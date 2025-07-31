#!/bin/bash
# T-Rex Motors Application Starter
# This script works around the tsx PATH issues in Replit

echo "🚗 T-Rex Motors - Car Dealership Platform"
echo "==========================================="
echo ""
echo "🔧 Starting development server..."
echo "📍 Server will run at: http://localhost:5000"
echo ""

# Kill any existing tsx processes
pkill -f "tsx.*server" 2>/dev/null || true

# Set environment variables
export NODE_ENV=development

# Start the server using npx tsx (which works)
echo "⚡ Starting with npx tsx..."
npx tsx server/index.ts