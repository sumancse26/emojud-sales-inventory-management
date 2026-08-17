# syntax=docker/dockerfile:1

# =============================================================================
# Stage 1: Base Image
# =============================================================================
FROM node:20-bookworm-slim AS base
WORKDIR /app
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    NEXT_TELEMETRY_DISABLED=1

# =============================================================================
# Stage 2: Install Dependencies (Cached Layer)
# =============================================================================
FROM base AS deps
WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json* ./

# Install dependencies with npm cache mount for high build performance
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# =============================================================================
# Stage 3: Build Next.js Application
# =============================================================================
FROM base AS builder
WORKDIR /app

# Build arguments for build-time environment variables
ARG DATABASE_URL="postgresql://emojud_user:CyberneticsIT%40%2325@72.62.124.6:5432/emojud?schema=public"
ARG JWT_SECRET="3u9QK4vM5L1V0jQ6x9vX7xQmWJje5%wq@gk1oNfg%^8nH2P5aR0dY$@%kL7sFv8EwZcT6mBn9QpR2yUx"
ARG JWT_ACCESS_EXPIRES="30m"
ARG JWT_REFRESH_EXPIRES="30d"
ARG NEXT_PUBLIC_API_URL="/api"
ARG NEXT_PUBLIC_API_IMG_URL=""
ARG CLOUDINARY_CLOUD_NAME="dovk9fhfi"
ARG CLOUDINARY_API_KEY="886865778826549"
ARG CLOUDINARY_API_SECRET="V9dj4rfmw21xZky1rTYyJUSNTMU"
ARG WHATSAPP_ADMIN_NUMBER="01635000601"

# Expose build args to the build environment
ENV DATABASE_URL=${DATABASE_URL} \
    JWT_SECRET=${JWT_SECRET} \
    JWT_ACCESS_EXPIRES=${JWT_ACCESS_EXPIRES} \
    JWT_REFRESH_EXPIRES=${JWT_REFRESH_EXPIRES} \
    NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \
    NEXT_PUBLIC_API_IMG_URL=${NEXT_PUBLIC_API_IMG_URL} \
    CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME} \
    CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY} \
    CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET} \
    WHATSAPP_ADMIN_NUMBER=${WHATSAPP_ADMIN_NUMBER}

# Copy installed modules and application source
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build standalone Next.js bundle with BuildKit cache
RUN --mount=type=cache,target=/app/.next/cache \
    npm run build

# =============================================================================
# Stage 4: Production Runner (Lean & Secure Runtime)
# =============================================================================
FROM node:20-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME="0.0.0.0" \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    DATABASE_URL="postgresql://emojud_user:CyberneticsIT%40%2325@72.62.124.6:5432/emojud?schema=public" \
    JWT_SECRET="3u9QK4vM5L1V0jQ6x9vX7xQmWJje5%wq@gk1oNfg%^8nH2P5aR0dY$@%kL7sFv8EwZcT6mBn9QpR2yUx" \
    JWT_ACCESS_EXPIRES="30m" \
    JWT_REFRESH_EXPIRES="30d" \
    NEXT_PUBLIC_API_URL="/api" \
    CLOUDINARY_CLOUD_NAME="dovk9fhfi" \
    CLOUDINARY_API_KEY="886865778826549" \
    CLOUDINARY_API_SECRET="V9dj4rfmw21xZky1rTYyJUSNTMU" \
    WHATSAPP_ADMIN_NUMBER="01635000601"

# Install Chromium and headless browser fonts/libraries for whatsapp-web.js, plus dumb-init
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    fonts-freefont-ttf \
    fonts-ipafont-gothic \
    fonts-kacst \
    fonts-thai-tlwg \
    fonts-wqy-zenhei \
    libxss1 \
    dumb-init \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create secure non-root system user and group
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 nextjs

# Create WhatsApp session and cache directories with appropriate ownership
RUN mkdir -p /app/.wwebjs_auth /app/.wwebjs_cache && \
    chown -R nextjs:nodejs /app/.wwebjs_auth /app/.wwebjs_cache

# Copy public static assets and standalone build output from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

EXPOSE 3000

# Use dumb-init for PID 1 signal management & process reaping
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "server.js"]
