#!/usr/bin/env node

import { spawn } from 'child_process';

// Set environment variable
process.env.NODE_ENV = 'development';

// Start the server using npx tsx
const server = spawn('npx', ['tsx', 'server/index.ts'], {
  stdio: 'inherit',
  env: process.env
});

server.on('close', (code) => {
  process.exit(code);
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});