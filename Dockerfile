# syntax=docker/dockerfile:1

# =============================================================================
# Stage 1: Base Image
# =============================================================================
FROM node:20-bookworm-slim AS base
WORKDIR /app
SHELL ["/bin/bash", "-c"]
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

# Build arguments for public build-time environment variables
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_API_IMG_URL
ARG NEXT_PUBLIC_IMG_SERVER_DOMAIN

# Expose build args to the build environment
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \
    NEXT_PUBLIC_API_IMG_URL=${NEXT_PUBLIC_API_IMG_URL} \
    NEXT_PUBLIC_IMG_SERVER_DOMAIN=${NEXT_PUBLIC_IMG_SERVER_DOMAIN}

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
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

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

# Create secure non-root system user and group with /bin/bash shell
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid 1001 -s /bin/bash nextjs

# Set default shell to /bin/bash
SHELL ["/bin/bash", "-c"]

# Create WhatsApp session and cache directories with appropriate ownership
RUN mkdir -p /app/.wwebjs_auth /app/.wwebjs_cache && \
    chown -R nextjs:nodejs /app

# Copy public static assets and standalone build output from builder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

EXPOSE 3000

# Use dumb-init for PID 1 signal management & process reaping
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "server.js"]
