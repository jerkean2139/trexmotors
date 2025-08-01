import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { type Server } from "http";

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

// Fallback setup that serves static files instead of using Vite
export async function setupVite(app: Express, server: Server) {
  log("Using fallback static serving (Vite not available)");
  
  // Try to serve from built server/public directory first
  const serverPublicPath = path.resolve(import.meta.dirname, "public");
  const distPath = path.resolve(import.meta.dirname, "..", "dist", "public");
  const clientPath = path.resolve(import.meta.dirname, "..", "client");
  
  if (fs.existsSync(serverPublicPath)) {
    app.use(express.static(serverPublicPath));
    log(`Serving built static files from: ${serverPublicPath}`);
    
    // Serve index.html for all routes
    app.use("*", (req, res) => {
      const indexPath = path.resolve(serverPublicPath, "index.html");
      res.sendFile(indexPath);
    });
  } else if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    log(`Serving built static files from: ${distPath}`);
    
    // Serve index.html for all routes
    app.use("*", (req, res) => {
      const indexPath = path.resolve(distPath, "index.html");
      res.sendFile(indexPath);
    });
  } else if (fs.existsSync(clientPath)) {
    // This mode won't work because browsers can't execute TypeScript
    log("Warning: Attempting to serve raw TypeScript files - this will likely fail");
    app.use(express.static(clientPath));
    log(`Serving static files from: ${clientPath}`);
    
    app.use("*", (req, res) => {
      const indexPath = path.resolve(clientPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).json({ 
          error: "Frontend not available", 
          message: "Build not found and raw TypeScript cannot be served to browsers." 
        });
      }
    });
  } else {
    app.use("*", (req, res) => {
      res.status(404).json({ 
        error: "Frontend not available", 
        message: "Neither build nor client directory found." 
      });
    });
  }
}

export function serveStatic(app: Express) {
  // In production, the build output is in the same directory as the server
  const distPath = path.resolve(import.meta.dirname, "public");
  const fallbackPath = path.resolve(process.cwd(), "dist", "public");
  
  let staticPath = distPath;
  if (!fs.existsSync(distPath) && fs.existsSync(fallbackPath)) {
    staticPath = fallbackPath;
  }

  if (!fs.existsSync(staticPath)) {
    throw new Error(
      `Could not find the build directory: ${staticPath}, make sure to build the client first`,
    );
  }

  log(`Serving production static files from: ${staticPath}`);
  app.use(express.static(staticPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(staticPath, "index.html"));
  });
}