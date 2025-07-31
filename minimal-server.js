#!/usr/bin/env node
// Minimal server to bypass vite dependency issues
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('🚗 T-Rex Motors - Starting minimal server...\n');

// Create Express app
const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS for Google Apps Script
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, User-Agent");
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  
  next();
});

// Create a minimal routes setup since we can't import TypeScript directly
const setupRoutes = async () => {
  // Manually create the routes here
  const { createServer } = await import('http');
  
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });
  
  // Vehicles endpoints (empty for now)
  app.get('/api/vehicles', (req, res) => {
    res.json([]); // Empty vehicle list for now
  });
  
  app.get('/api/stats', (req, res) => {
    res.json({ 
      totalVehicles: 0,
      availableVehicles: 0,
      soldVehicles: 0
    });
  });
  
  // Create HTTP server
  const server = createServer(app);
  return server;
};

setupRoutes().then(server => {
    // Serve static files in production mode
    if (process.env.NODE_ENV === 'production') {
      const publicDir = join(__dirname, 'server', 'public');
      if (existsSync(publicDir)) {
        app.use(express.static(publicDir));
      }
    } else {
      // In development, serve the index.html directly
      app.get('*', (req, res) => {
        const indexPath = join(__dirname, 'client', 'index.html');
        if (existsSync(indexPath)) {
          let html = readFileSync(indexPath, 'utf-8');
          // Simple development mode indicator
          html = html.replace('</body>', '<script>console.log("Development mode - Vite HMR disabled");</script></body>');
          res.send(html);
        } else {
          res.status(404).send('Client index.html not found');
        }
      });
    }
    
    // Actually start the server on port 5000
    const PORT = 5000;
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
      console.log(`📝 API endpoints available at http://localhost:${PORT}/api`);
      console.log(`\n⚠️  Note: Running in minimal mode without Vite HMR`);
    });
}).catch(err => {
  console.error('Failed to setup routes:', err);
  process.exit(1);
});