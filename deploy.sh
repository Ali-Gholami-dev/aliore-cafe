#!/bin/bash
# ─── Aliore Café — VPS Deployment Script ──────────────────────────────────────
# Usage: bash deploy.sh
# Run on your server after uploading code or pulling from Git.

set -e
echo "🚀 Deploying Aliore Café..."

# 1. Pull latest code (if using Git)
# git pull origin main

# 2. Install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# 3. Generate Prisma client
echo "🗃️ Generating Prisma client..."
npx prisma generate

# 4. Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

# 5. Build Next.js
echo "🔨 Building Next.js..."
npm run build

# 6. Reload PM2
echo "♻️  Reloading PM2..."
pm2 reload ecosystem.config.js --update-env || pm2 start ecosystem.config.js

# 7. Reload Nginx
echo "🌐 Reloading Nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo "✅ Deployment complete! Aliore Café is live."
