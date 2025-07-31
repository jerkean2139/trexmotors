#!/bin/bash

# Build script for T-Rex Motors deployment
echo "🚗 Starting T-Rex Motors build process..."

# Build frontend with Vite
echo "📦 Building frontend..."
npx --yes vite build

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

# Build backend with esbuild
echo "⚙️ Building backend..."
npx --yes esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

if [ $? -ne 0 ]; then
    echo "❌ Backend build failed"
    exit 1
fi

echo "✅ Build completed successfully!"
echo "🚀 Ready for deployment"