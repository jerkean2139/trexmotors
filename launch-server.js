#!/usr/bin/env node

// T-Rex Motors Server Launcher
// This script works around the tsx PATH issue by using spawn with npx directly

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set development environment
process.env.NODE_ENV = 'development';

console.log('🚗 Starting T-Rex Motors server...');

// Launch server with npx tsx to bypass PATH issues
const server = spawn('npx', ['tsx', join(__dirname, 'server/index.ts')], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'development'
  }
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down T-Rex Motors server...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Terminating T-Rex Motors server...');
  server.kill('SIGTERM');
});