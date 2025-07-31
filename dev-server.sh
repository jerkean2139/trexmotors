#!/bin/bash
# T-Rex Motors Development Server Wrapper
# This script ensures the server starts properly with npx tsx

export NODE_ENV=development
npx tsx server/index.ts