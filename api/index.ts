import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import express, { type RequestHandler } from "express";

// Create the Express app once (reused across Vercel invocations)
let app: express.Application | null = null;

/**
 * GET /api/ping
 * Simple ping/health-check endpoint
 */
const handlePing: RequestHandler = (_req, res) => {
  res.json({ message: "pong", timestamp: new Date().toISOString() });
};

function createServer() {
  const expressApp = express();

  // Middleware
  expressApp.use(express.json());
  expressApp.use(express.urlencoded({ extended: true }));

  // Log requests in development
  if (process.env.NODE_ENV !== "production") {
    expressApp.use((req, _res, next) => {
      console.log(`${req.method} ${req.url}`);
      next();
    });
  }

  // ==================== ROUTES ====================

  expressApp.get("/api/ping", handlePing);

  // ================================================

  return expressApp;
}

function getApp() {
  if (!app) {
    app = createServer();
  }
  return app;
}

// Export createServer for Vite dev server integration
export { createServer };

// Default export for Vercel serverless
export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const expressApp = getApp();
    expressApp(req as any, res as any);
  } catch (error) {
    console.error("API Handler Error:", error);
    if (!res.headersSent) {
      return res.status(500).json({
        error: {
          code: "500",
          message: "A server error has occurred",
          details: error instanceof Error ? error.message : "Unknown error",
        },
      });
    }
  }
};
