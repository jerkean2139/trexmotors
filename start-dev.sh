#!/bin/bash
# Development server startup script for T-Rex Motors

echo "🚗 Starting T-Rex Motors development server..."
echo "================================================"
echo ""

# Use npx to run tsx which will download it if needed
echo "📦 Loading dependencies..."
NODE_ENV=development exec npx --yes tsx@4.20.3 minimal-server.js