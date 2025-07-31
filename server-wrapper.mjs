
import { createRequire } from 'module';
import { pathToFileURL } from 'url';

// Set up module resolution
process.env.NODE_PATH = [
  '/home/runner/workspace/.local-modules',
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
