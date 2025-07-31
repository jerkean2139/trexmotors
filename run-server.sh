#!/bin/bash
echo "Starting development server with npx..."
cd /home/runner/workspace
NODE_ENV=development npx --yes tsx@4.20.3 server/index.ts