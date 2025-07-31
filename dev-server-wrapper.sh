#!/bin/bash
# Wrapper script that can be called by npm run dev

echo "🚗 Starting T-Rex Motors Server..."
echo "=================================="
echo ""

# Check if tsx is available, if not use npx
if command -v tsx &> /dev/null; then
    echo "Using local tsx..."
    NODE_ENV=development tsx server/index.ts
else
    echo "Downloading dependencies and starting server..."
    NODE_ENV=development npx --yes tsx@4.20.3 server/index.ts
fi