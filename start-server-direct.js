#!/usr/bin/env node

/**
 * Direct server startup to bypass tsx dependency issues
 */

console.log('🚗 Starting T-Rex Motors server directly...');

// Import and run server with node directly
import('./server/index.ts').catch(async (error) => {
  console.log('Falling back to compilation approach...');
  
  // Compile and run if direct import fails
  const { spawn } = await import('child_process');
  const proc = spawn('npx', ['--yes', 'tsx', 'server/index.ts'], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' }
  });
  
  proc.on('error', (err) => {
    console.error('Server startup failed:', err);
    process.exit(1);
  });
});