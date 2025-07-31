#!/bin/bash
# Development starter script for T-Rex Motors
echo "🚗 Starting T-Rex Motors Development Server..."
echo "⚡ Using npx tsx to bypass PATH issues..."

# Set environment
export NODE_ENV=development

# Start the server using npx tsx
exec npx tsx server/index.ts