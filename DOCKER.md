# 🐳 Dockerization & Deployment Guide

Welcome to the comprehensive Docker deployment guide for **Emojud Sales & Inventory Management**. This document details the container architecture, configuration options, volume persistence, security considerations, and production deployment workflows.

---

## 📑 Table of Contents

1. [Architecture Overview](#-architecture-overview)
2. [Prerequisites](#-prerequisites)
3. [Configuration & Environment Variables](#-configuration--environment-variables)
4. [Quick Start with Docker Compose](#-quick-start-with-docker-compose)
5. [WhatsApp Web Integration & Session Persistence](#-whatsapp-web-integration--session-persistence)
6. [Managing Containers](#-managing-containers)
7. [Running with Standalone Docker CLI](#-running-with-standalone-docker-cli)
8. [Production Deployment with Nginx & SSL](#-production-deployment-with-nginx--ssl)
9. [Troubleshooting & FAQ](#-troubleshooting--faq)

---

## 🏗️ Architecture Overview

The container configuration is engineered for **minimal footprint**, **high performance**, and **production reliability**:

```
+---------------------------------------------------------------+
|                       Multi-Stage Build                       |
+---------------------------------------------------------------+
| Stage 1: deps    --> Installs production & build npm packages |
| Stage 2: builder --> Compiles Next.js app in standalone mode  |
| Stage 3: runner  --> Ultra-lean Debian Slim + Chromium runtime|
+---------------------------------------------------------------+
```

### Key Architectural Highlights:
- **Next.js Standalone Mode**: Enabled via `output: 'standalone'` in `next.config.mjs`. Only strictly required dependencies and server files are bundled into `.next/standalone`, reducing container size significantly (from ~1.2 GB to ~250 MB).
- **Headless Chromium for WhatsApp**: Includes Debian-packaged `chromium` with international font rendering and container-optimized Puppeteer flags (`--no-sandbox`, `--disable-dev-shm-usage`, `--disable-gpu`) so that `whatsapp-web.js` operates smoothly in server environments.
- **Process Management via `dumb-init`**: Uses `dumb-init` as `ENTRYPOINT` (PID 1) to handle signals (`SIGTERM`, `SIGINT`) properly and reap orphaned child processes spawned by Chromium.
- **Least-Privilege Security**: The runner executes under a non-root user (`nextjs:nodejs`, UID 1001).
- **Persistent Storage**: WhatsApp credentials and session caches are persisted outside the container lifecycle via dedicated named Docker volumes.

---

## 📋 Prerequisites

Before proceeding, ensure you have installed:
- [Docker Engine](https://docs.docker.com/engine/install/) (v20.10+ or newer)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+ or Docker Desktop)

Verify installation:
```bash
docker --version
docker compose version
```

---

## ⚙️ Configuration & Environment Variables

The Dockerfile is completely credential-free and relies strictly on dynamic environment variable injection at build and runtime.

Copy `.env.example` to create your active `.env.production` file for production deployment:

```bash
cp .env.example .env.production
```

### Environment Variable Reference

| Variable | Required | Default / Example | Description |
| :--- | :---: | :--- | :--- |
| `DATABASE_URL` | **Yes** | `postgresql://user:pass@host:5432/emojud?schema=public` | PostgreSQL database connection string |
| `JWT_SECRET` | **Yes** | `random_secret_string_32_chars+` | Secret key for signing and verifying JWT tokens |
| `JWT_ACCESS_EXPIRES` | No | `30m` | Expiration time for access tokens |
| `JWT_REFRESH_EXPIRES` | No | `30d` | Expiration time for refresh tokens |
| `NEXT_PUBLIC_API_URL` | No | `/api` | Public URL endpoint for client-side API requests |
| `NEXT_PUBLIC_API_IMG_URL` | No | `http://localhost:3000` | Public image root URL |
| `CLOUDINARY_CLOUD_NAME` | No | `your_cloud_name` | Cloudinary cloud name for media uploads |
| `CLOUDINARY_API_KEY` | No | `your_api_key` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | No | `your_api_secret` | Cloudinary API secret |
| `WHATSAPP_ADMIN_NUMBER` | No | `01XXXXXXXXX` | Admin phone number to receive WhatsApp alerts |
| `PORT` | No | `3000` | Port on which the container server listens |
| `PUPPETEER_EXECUTABLE_PATH` | Set in Docker | `/usr/bin/chromium` | Absolute path to Chromium binary inside container |

---

## 🚀 Quick Start with Docker Compose

Docker Compose is the recommended way to run the application in both local staging and production environments.

### 1. Build and Start the Application

```bash
docker compose up -d --build
```

### 2. Check Container Health and Status

```bash
docker compose ps
```

Once running, open **`http://localhost:3000`** in your browser. The app will automatically redirect to the login screen.

---

## 📱 WhatsApp Web Integration & Session Persistence

The system automatically initializes a WhatsApp client for automated customer and admin alerts.

### 1. First-Time Authentication (Scanning QR Code)

When the container launches for the first time, stream the container logs to view the QR code in your terminal:

```bash
docker compose logs -f emojud-app
```

1. Open **WhatsApp** on your mobile phone.
2. Navigate to **Linked Devices** > **Link a Device**.
3. Point your camera at the QR code displayed in the terminal.
4. You will see `WhatsApp Client is ready!` once connected.

### 2. Session Persistence

The Docker setup defines two named volumes:
- `emojud_whatsapp_auth` &rarr; `/app/.wwebjs_auth`
- `emojud_whatsapp_cache` &rarr; `/app/.wwebjs_cache`

Because these volumes persist independently of container lifecycles, **you do NOT need to re-scan the QR code when you restart, upgrade, or rebuild the container**.

---

## 🛠️ Managing Containers

### Viewing Logs
```bash
# View live logs for the application
docker compose logs -f emojud-app

# View last 100 lines of logs
docker compose logs --tail=100 emojud-app
```

### Restarting the Application
```bash
docker compose restart emojud-app
```

### Stopping the Application
```bash
docker compose down
```

### Rebuilding After Code Updates
```bash
git pull origin master
docker compose up -d --build
```

### Accessing the Container Shell
```bash
docker compose exec emojud-app /bin/bash
```

---

## 📦 Running with Standalone Docker CLI

If your environment does not use Docker Compose, you can build and run using standard Docker commands:

### 1. Build the Docker Image

```bash
docker build -t emojud-sales-inventory:latest .
```

### 2. Create the Persistent Volumes

```bash
docker volume create emojud_whatsapp_auth
docker volume create emojud_whatsapp_cache
```

### 3. Run the Container

```bash
docker run -d \
  --name emojud-app \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env.production \
  -v emojud_whatsapp_auth:/app/.wwebjs_auth \
  -v emojud_whatsapp_cache:/app/.wwebjs_cache \
  emojud-sales-inventory:latest
```

---

## 🌐 Production Deployment with Nginx & SSL

When deploying to a Linux VPS (e.g., Ubuntu/Debian), place the container behind an **Nginx Reverse Proxy** with **Let's Encrypt SSL/TLS**.

### 1. Nginx Configuration File (`/etc/nginx/sites-available/emojud`)

```nginx
server {
    listen 80;
    server_name emojud.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name emojud.yourdomain.com;

    # SSL Certificate Configuration
    ssl_certificate /etc/letsencrypt/live/emojud.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/emojud.yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Maximum file upload size (e.g. for media uploads / server actions)
    client_max_body_size 500M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        # WebSocket & Header propagation
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. Enable Site and Obtain SSL Certificate

```bash
sudo ln -s /etc/nginx/sites-available/emojud /etc/nginx/sites-enabled/
sudo certbot --nginx -d emojud.yourdomain.com
sudo nginx -t
sudo systemctl reload nginx
```

## 🐧 Rocky Linux (RHEL 9 / 8) Complete Server Setup & Deployment

Follow these exact steps from a fresh Rocky Linux server instance:

### Step 1: Update the Server & Install Essential Utilities

```bash
sudo dnf update -y
sudo dnf install -y git curl wget tar bzip2 nano firewalld epel-release
```

### Step 2: Install Docker CE & Docker Compose Plugin on Rocky Linux

Rocky Linux uses the CentOS/RHEL upstream Docker repository:

```bash
# 1. Install DNF config manager plugins
sudo dnf install -y dnf-plugins-core

# 2. Add the official Docker CE repository
sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 3. Install Docker Engine, CLI, Containerd, and Compose plugin
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 4. Start and enable Docker on boot
sudo systemctl start docker
sudo systemctl enable docker

# 5. (Optional) Add your non-root user to the docker group
sudo usermod -aG docker $USER
newgrp docker
```

Verify the installation:
```bash
docker --version
docker compose version
```

### Step 3: Configure Firewall (`firewalld`)

Allow standard web ports (80 for HTTP, 443 for HTTPS) in Rocky Linux's firewall:

```bash
# Start and enable firewalld if not already active
sudo systemctl start firewalld
sudo systemctl enable firewalld

# Open HTTP and HTTPS ports
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https

# (Optional) If you want to access port 3000 directly without Nginx
# sudo firewall-cmd --permanent --add-port=3000/tcp

sudo firewall-cmd --reload
```

### Step 4: Configure SELinux for Reverse Proxy Connections

If SELinux is in `Enforcing` mode (default in Rocky Linux), permit Nginx to proxy network requests:

```bash
sudo setsebool -P httpd_can_network_connect 1
```

---

### Step 5: Upload Project / Clone Repository & Configure Environment

As your regular (non-root) user:

```bash
# Navigate to your home directory or desired workspace
cd ~

# Clone or upload your project repository
git clone <YOUR_GIT_REPO_URL> emojud
cd ~/emojud

# Configure environment variables for production
cp .env.example .env.production
nano .env.production
```

*Paste your production `DATABASE_URL`, `JWT_SECRET`, Cloudinary credentials, and WhatsApp settings inside `.env.production`.*

---

### Step 6: Build & Start the Application

```bash
docker compose up -d --build
```

### Step 7: WhatsApp Authentication (QR Code)

Run the following to view the terminal QR code in your server console:

```bash
docker compose logs -f emojud-app
```

Open WhatsApp on your mobile phone &rarr; **Linked Devices** &rarr; **Link a Device** &rarr; scan the QR code. Once authenticated, press `CTRL+C` to exit the log view (the container continues running in the background).

---

### Step 8: Install Nginx & Set Up Let's Encrypt SSL

```bash
# Install Nginx and Certbot
sudo dnf install -y nginx certbot python3-certbot-nginx

# Create Nginx server configuration
sudo nano /etc/nginx/conf.d/emojud.conf
```

Paste the following configuration (replace `emojud.yourdomain.com` with your actual domain):

```nginx
server {
    listen 80;
    server_name emojud.yourdomain.com;

    client_max_body_size 500M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

Enable and start Nginx:
```bash
sudo nginx -t
sudo systemctl enable --now nginx
```

Obtain a free automated SSL certificate via Certbot:
```bash
sudo certbot --nginx -d emojud.yourdomain.com
```

---

### Step 9: Updating the Application (Future Releases)

Whenever you push new code updates to your git repository:

```bash
cd ~/emojud
git pull origin master
docker compose up -d --build
```

---

## ❓ Troubleshooting & FAQ

### Q1: The container logs show `WhatsApp Authentication Failure`
- **Fix**: Reset the session volume by running:
  ```bash
  docker compose down
  docker volume rm emojud_whatsapp_auth emojud_whatsapp_cache
  docker compose up -d
  docker compose logs -f emojud-app
  ```
  Scan the newly generated QR code.

### Q2: Database connection error `getaddrinfo ENOTFOUND` or connection refused
- Ensure your `DATABASE_URL` in `.env` uses an accessible IP address or valid public/private hostname reachable from inside the Docker network.

### Q3: How do I change the mapped port?
- In your `.env` file, set `PORT=8080` (or any desired host port), then restart with:
  ```bash
  docker compose up -d
  ```

---

*Authored for Emojud Sales & Inventory Management by Suman Sarker.*
