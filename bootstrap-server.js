#!/usr/bin/env node
import { spawn } from 'child_process';
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

console.log('🚗 T-Rex Motors Server Bootstrap');
console.log('================================\n');

// Create a local node_modules symlink workaround
const localModules = join(process.cwd(), '.local-modules');
if (!existsSync(localModules)) {
  mkdirSync(localModules, { recursive: true });
}

// Create a wrapper script that properly sets up module resolution
const wrapperScript = `
import { createRequire } from 'module';
import { pathToFileURL } from 'url';

// Set up module resolution
process.env.NODE_PATH = [
  '${localModules}',
  '/home/runner/.npm/_npx/node_modules',
  process.cwd() + '/node_modules',
  process.cwd()
].join(':');

// Patch module resolution
const Module = await import('module');
const originalResolveFilename = Module.default._resolveFilename;
Module.default._resolveFilename = function(request, parent, isMain) {
  // Try to resolve vite from npx cache
  if (request === 'vite' || request.startsWith('vite/')) {
    try {
      return require.resolve(request, { paths: ['/home/runner/.npm/_npx/node_modules'] });
    } catch (e) {
      // Fall through to original resolution
    }
  }
  return originalResolveFilename.apply(this, arguments);
};

// Now import the actual server
await import('./server/index.ts');
`;

writeFileSync('server-wrapper.mjs', wrapperScript);

console.log('📦 Downloading required packages...\n');

// First, ensure vite is available via npx
const downloadVite = spawn('npx', ['--yes', 'vite@5.4.19', '--version'], {
  stdio: 'inherit'
});

downloadVite.on('close', (code) => {
  if (code !== 0) {
    console.error('Failed to download vite');
    process.exit(1);
  }

  console.log('\n🚀 Starting server...\n');
  
  // Run the server with tsx and our wrapper
  const server = spawn('npx', [
    '--yes',
    'tsx@4.20.3',
    'server-wrapper.mjs'
  ], {
    env: { 
      ...process.env, 
      NODE_ENV: 'development',
      NODE_OPTIONS: '--experimental-loader data:text/javascript,' + encodeURIComponent(`
        export async function resolve(specifier, context, nextResolve) {
          if (specifier === 'vite' || specifier.startsWith('vite/')) {
            try {
              const viteUrl = new URL('file:///home/runner/.npm/_npx/node_modules/vite/dist/node/index.js');
              return { url: viteUrl.href, shortCircuit: true };
            } catch {}
          }
          return nextResolve(specifier, context);
        }
      `)
    },
    stdio: 'inherit'
  });

  server.on('error', (err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });

  process.on('SIGINT', () => {
    console.log('\nShutting down...');
    server.kill('SIGINT');
    process.exit(0);
  });
});