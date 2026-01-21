import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { runStartupValidation } from "./services/charge-statute-validator";

const app = express();
// Enable trust proxy for rate limiting to work correctly with X-Forwarded-For header
app.set('trust proxy', true);

// Security headers with Helmet
// SECURITY: Removed 'unsafe-eval' to prevent XSS attacks via eval()
// Note: 'unsafe-inline' kept for styles due to CSS-in-JS libraries; consider nonces for production
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      // Removed 'unsafe-eval' - React/Vite work without it
      // Development mode may need relaxed CSP; production should be strict
      scriptSrc: process.env.NODE_ENV === 'development'
        ? ["'self'", "'unsafe-inline'", "'unsafe-eval'"]
        : ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https:", "wss:"],
      frameSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false, // Required for some external resources
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xFrameOptions: { action: "sameorigin" },
}));

// SECURITY: Explicit request size limits to prevent DoS attacks
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

// ============================================================================
// SECURITY: CSRF Protection for API endpoints
// ============================================================================
// For JSON APIs, we use a combination of:
// 1. SameSite cookies (set on client-side cookies)
// 2. Content-Type validation for state-changing requests
// 3. Origin/Referer header checking
//
// This prevents cross-site request forgery without requiring CSRF tokens,
// which is appropriate for JSON-based APIs that don't use cookies for auth.
app.use((req, res, next) => {
  // Only check state-changing methods
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'] || '';

    // For API endpoints, require JSON content type
    if (req.path.startsWith('/api/')) {
      // Allow requests with no body (e.g., DELETE) or with JSON content type
      const hasBody = req.headers['content-length'] && parseInt(req.headers['content-length']) > 0;

      if (hasBody && !contentType.includes('application/json')) {
        return res.status(415).json({
          success: false,
          error: 'Content-Type must be application/json for API requests'
        });
      }

      // Check Origin header for additional CSRF protection
      const origin = req.headers['origin'];
      const host = req.headers['host'];

      // In production, verify origin matches host
      if (process.env.NODE_ENV === 'production' && origin) {
        const originHost = new URL(origin).host;
        if (originHost !== host) {
          console.warn(`[Security] Cross-origin request blocked: ${origin} -> ${host}`);
          return res.status(403).json({
            success: false,
            error: 'Cross-origin requests not allowed'
          });
        }
      }
    }
  }

  next();
});

// Privacy-safe logging middleware - excludes sensitive data from logs
const SENSITIVE_PATHS = ['/api/legal-guidance', '/api/guidance', '/api/chat', '/api/legal-case', '/api/session'];
const SENSITIVE_FIELDS = ['incidentDescription', 'policeStatement', 'evidenceNotes', 'priorConvictions', 
  'employmentStatus', 'familySituation', 'concernsQuestions', 'arrestLocation', 'arrestDate',
  'guidance', 'response', 'content', 'message', 'details'];

function sanitizeForLogging(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_FIELDS.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = Array.isArray(value) ? '[Array]' : '[Object]';
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      
      // NEVER log response bodies for sensitive endpoints - privacy protection
      const isSensitivePath = SENSITIVE_PATHS.some(p => path.startsWith(p));
      if (capturedJsonResponse && !isSensitivePath) {
        const sanitized = sanitizeForLogging(capturedJsonResponse);
        logLine += ` :: ${JSON.stringify(sanitized)}`;
      }

      if (logLine.length > 120) {
        logLine = logLine.slice(0, 119) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
    
    // Run charge-statute consistency check on startup
    runStartupValidation().catch(err => {
      log(`Startup validation error: ${err.message}`);
    });
  });
})();
