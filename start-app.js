#!/usr/bin/env node
// Simple Node.js starter that bypasses tsx issues

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('Starting T-Rex Motors application...\n');

// Use npx to run tsx since it works via npx
const startProcess = spawn('npx', ['tsx@4.20.3', 'server/index.ts'], {
  env: { 
    ...process.env, 
    NODE_ENV: 'development',
    PATH: process.env.PATH
  },
  stdio: 'inherit',
  cwd: __dirname
});

startProcess.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

startProcess.on('close', (code) => {
  console.log(`\nServer process exited with code ${code}`);
  if (code !== 0) {
    process.exit(code);
  }
});

// Handle shutdown gracefully
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down T-Rex Motors server...');
  startProcess.kill('SIGINT');
  setTimeout(() => {
    process.exit(0);
  }, 1000);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Server terminated');
  startProcess.kill('SIGTERM');
  setTimeout(() => {
    process.exit(0);
  }, 1000);
});