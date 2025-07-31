import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// Shim __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Only enable Replit-specific plugins when in dev on Replit
const isReplitDev = process.env.NODE_ENV !== "production" && !!process.env.REPLIT_ID;

export default defineConfig({
  plugins: [
    react(),
    // Dev‑only Replit plugins
    ...(isReplitDev
      ? [
          // Runtime error overlay for dev
          (() => {
            try {
              const { default: runtimeErrorOverlay } = require(
                "@replit/vite-plugin-runtime-error-modal"
              );
              return runtimeErrorOverlay();
            } catch {
              return null;
            }
          })(),

          // Code map visualization (cartographer)
          (() => {
            try {
              const { cartographer } = require(
                "@replit/vite-plugin-cartographer"
              );
              return cartographer();
            } catch {
              return null;
            }
          })(),
        ].filter(Boolean)
      : []),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },

  root: path.resolve(__dirname, "client"),

  build: {
    outDir: path.resolve(__dirname, "dist", "public"),
    emptyOutDir: true,
  },

  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
