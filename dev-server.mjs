#!/usr/bin/env node
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

// Register TypeScript loader
register('./ts-loader.mjs', pathToFileURL('./'));

// Set environment
process.env.NODE_ENV = 'development';

// Import and run the server
await import('./server/index.ts');