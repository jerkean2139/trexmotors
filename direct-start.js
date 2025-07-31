#!/usr/bin/env node
// Direct server start using npx to download and run tsx
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('Starting T-Rex Motors server...');
console.log('This may take a moment as dependencies are downloaded...\n');

const server = spawn('npx', [
  '--yes',
  'tsx@4.20.3',
  'server/index.ts'
], {
  env: { ...process.env, NODE_ENV: 'development' },
  stdio: 'inherit',
  cwd: __dirname
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`Server exited with code ${code}`);
  process.exit(code || 0);
});

process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.kill('SIGINT');
});