#!/usr/bin/env node
// Temporary workaround to start the server without tsx

import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use Node.js directly with --loader flag for TypeScript
const serverProcess = spawn('node', [
  '--experimental-loader',
  'data:text/javascript,export{load}from"data:text/javascript,import{createRequire}from%22module%22;import{pathToFileURL}from%22url%22;const%20require%3DcreateRequire(import.meta.url);const%20{transform}%3Drequire(%22esbuild%22);export%20async%20function%20load(url%2Ccontext%2CdefaultLoad){if(url.endsWith(%22.ts%22)||url.endsWith(%22.tsx%22)){const%20{source}%3Dawait%20defaultLoad(url%2C{...context%2Cformat%3A%22module%22});const%20{code}%3Dawait%20transform(source.toString()%2C{loader%3Aurl.endsWith(%22.tsx%22)%3F%22tsx%22%3A%22ts%22%2Ctarget%3A%22node20%22%2Cformat%3A%22esm%22});return{format%3A%22module%22%2Csource%3Acode%2CshortCircuit%3Atrue}}return%20defaultLoad(url%2Ccontext)}"',
  '--no-warnings',
  join(__dirname, 'server/index.ts')
], {
  env: { ...process.env, NODE_ENV: 'development' },
  stdio: 'inherit'
});

serverProcess.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

process.on('SIGINT', () => {
  serverProcess.kill('SIGINT');
  process.exit(0);
});