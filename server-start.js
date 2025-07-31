#!/usr/bin/env node
// Temporary server starter without tsx
import('./server/index.js').catch(err => {
  // If .js doesn't exist, we need to compile TypeScript first
  console.log('Starting server with TypeScript compilation...');
  
  import('child_process').then(({ spawn }) => {
    // First compile TypeScript
    const tsc = spawn('npx', ['--yes', 'typescript@5.6.3', '--module', 'esnext', '--target', 'es2022', '--moduleResolution', 'node', '--allowSyntheticDefaultImports', '--esModuleInterop', '--skipLibCheck', '--outDir', '.compiled'], {
      stdio: 'inherit'
    });
    
    tsc.on('close', (code) => {
      if (code === 0) {
        console.log('TypeScript compilation complete, starting server...');
        // Run the compiled server
        const server = spawn('node', ['.compiled/server/index.js'], {
          env: { ...process.env, NODE_ENV: 'development' },
          stdio: 'inherit'
        });
        
        process.on('SIGINT', () => {
          server.kill('SIGINT');
          process.exit(0);
        });
      } else {
        console.error('TypeScript compilation failed');
        process.exit(1);
      }
    });
  });
});