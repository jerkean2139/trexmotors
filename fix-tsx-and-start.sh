#!/bin/bash

echo "🔧 Fixing TSX dependency and starting server..."

# Kill any existing processes
pkill -f "tsx server/index.ts" 2>/dev/null || true
pkill -f "node.*server" 2>/dev/null || true

# Install tsx globally to avoid installation prompts
npm install -g tsx 2>/dev/null || true

# Try multiple startup approaches
echo "📦 Attempting server startup..."

# Approach 1: Direct tsx with --yes flag
NODE_ENV=development npx --yes tsx server/index.ts &
SERVER_PID=$!

# Wait and check if server started
sleep 10
if curl -s http://localhost:5000/api/vehicles > /dev/null 2>&1; then
    echo "✅ Server started successfully on port 5000"
    curl -s http://localhost:5000/api/vehicles | head -c 100
    exit 0
fi

# If approach 1 failed, try approach 2
echo "🔄 Trying alternative startup method..."
kill $SERVER_PID 2>/dev/null || true

# Approach 2: Compile and run
npx --yes esbuild server/index.ts --platform=node --format=esm --outfile=temp-server.js --packages=external
NODE_ENV=development node temp-server.js &
SERVER_PID=$!

sleep 5
if curl -s http://localhost:5000/api/vehicles > /dev/null 2>&1; then
    echo "✅ Server started with compiled approach"
    rm -f temp-server.js
    exit 0
fi

echo "❌ Server startup failed"
kill $SERVER_PID 2>/dev/null || true
rm -f temp-server.js
exit 1