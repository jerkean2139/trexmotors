// server/index.ts
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import path from "path";
import { fileURLToPath } from "url";

// Compute __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();

  // --- HEALTH CHECK ROUTE (Required for Replit Deploy) ---
  app.get("/", (req, res) => {
    res.setHeader("X-Replit-No-Auth", "true");
    res.setHeader("X-Replit-Public", "true");
    res.setHeader("Content-Type", "text/plain");
    res.status(200).send("OK");
  });

  // --- DIRECT API ENDPOINT (Before Any Middleware) ---
  app.get('/api/vehicles', async (req, res) => {
    try {
      // Apply Replit Shield bypass headers
      res.setHeader("X-Replit-No-Auth", "true");
      res.setHeader("X-Replit-Public", "true");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      
      const { storage } = await import("./storage");
      const vehicles = await storage.getAllVehicles();
      
      console.log(`API: Returning ${vehicles.length} vehicles`);
      res.json(vehicles);
    } catch (error) {
      console.error('Direct API error:', error);
      res.status(500).json({ 
        message: "Failed to fetch vehicles", 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  // --- API MIDDLEWARE: Shield Bypass + CORS + Logging ---
  app.use('/api', (req, res, next) => {
    // Replit Shield Bypass
    res.setHeader("X-Replit-No-Auth", "true");
    res.setHeader("X-Replit-Public", "true");

    // CORS Headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, User-Agent");
    res.setHeader("X-Content-Type-Options", "nosniff");

    // Cache Control
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    // Handle preflight
    if (req.method === "OPTIONS") {
      return res.status(200).send();
    }

    // Response logging (only for API routes)
    const start = Date.now();
    const originalJson = res.json.bind(res);
    let responseBody: any;
    res.json = (body: any) => {
      responseBody = body;
      return originalJson(body);
    };
    res.on("finish", () => {
      const duration = Date.now() - start;
      let logLine = `${req.method} ${req.path} ${res.statusCode} in ${duration}ms`;
      if (responseBody !== undefined) {
        const jsonStr = JSON.stringify(responseBody);
        logLine += ` :: ${jsonStr.length < 100 ? jsonStr : jsonStr.slice(0, 100) + "…"}`;
      }
      console.log(logLine);
    });

    next();
  });

  // --- Body Parsers (After API routes) ---
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // --- Static manifest route ---
  app.get('/manifest.json', (req, res) => {
    res.setHeader('Content-Type', 'application/manifest+json');
    res.sendFile(path.resolve(__dirname, '../public/manifest.json'));
  });

  // --- Register Other API Routes ---
  const server = await registerRoutes(app);

  // --- Error Handler ---
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    console.error("Unhandled error:", err);
  });

  // --- Vite vs. Fallback Setup ---
  let setupVite: any, serveStatic: any, log: any;
  try {
    console.log("📦 Trying to import ./vite…");
    const viteMod = await import("./vite");
    setupVite = viteMod.setupVite;
    serveStatic = viteMod.serveStatic;
    log = viteMod.log;
    console.log("✅ Loaded ./vite successfully");
  } catch (err) {
    console.error("❌ Error importing ./vite:", err);
    const fallback = await import("./vite-fallback");
    setupVite = fallback.setupVite;
    serveStatic = fallback.serveStatic;
    log = fallback.log;
    console.log("✅ Loaded ./vite-fallback");
  }

  // Only integrate Vite in development
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // --- Start Listening ---
  const port = process.env.PORT ? Number(process.env.PORT) : 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`Server listening on port ${port}`);
  });
}

// Kick things off
startServer().catch((err) => {
  console.error("❌ Server startup error:", err);
  process.exit(1);
});