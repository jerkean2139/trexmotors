#!/usr/bin/env node
// Install vite locally then run the server
import { spawn } from 'child_process';
import { existsSync } from 'fs';

console.log('Setting up T-Rex Motors server...');

// First ensure vite is available
const installVite = spawn('npx', ['--yes', 'vite@5.4.19', '--version'], {
  stdio: 'inherit'
});

installVite.on('close', (code) => {
  if (code === 0) {
    console.log('\nStarting server with tsx...');
    
    // Now run the server with NODE_PATH set to include npx cache
    const server = spawn('npx', [
      '--yes', 
      'tsx@4.20.3',
      'server/index.ts'
    ], {
      env: { 
        ...process.env, 
        NODE_ENV: 'development',
        NODE_PATH: '/home/runner/.npm/_npx/node_modules:/home/runner/workspace/node_modules'
      },
      stdio: 'inherit'
    });
    
    server.on('error', (err) => {
      console.error('Failed to start server:', err);
      process.exit(1);
    });
    
    process.on('SIGINT', () => {
      server.kill('SIGINT');
      process.exit(0);
    });
  }
});