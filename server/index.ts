import "dotenv/config";
import { execSync } from "child_process";
import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import session from "express-session";
import { registerRoutes } from "./routes";
import { registerV1Routes } from "./routes-v1";
import { setupVite, serveStatic, log } from "./vite";
import { opsLog } from "./utils/dev-logger";
import { initializeCostTracker } from "./services/cost-tracker";
import { assertProductionEnv } from "./startup-checks";
import { isCrossOriginRequest } from "./middleware/csrf-check";

// Production environment guard — fail loud at startup, not silently at runtime.
//
// Both of these previously degraded quietly when unset: SESSION_SECRET fell
// back to a hardcoded dev string (letting anyone forge a session-ownership
// cookie), and missing Turnstile keys made isCaptchaRequired() return false
// (silently disabling bot protection on every AI endpoint). Either failure
// mode is a one-line log message away from going unnoticed indefinitely.
// Refusing to boot forces a misconfigured production deploy to be caught
// immediately, by whoever is deploying it, instead of discovered later.
assertProductionEnv(process.env);

const app = express();
// Trust only the first proxy hop (Replit's load balancer).
// 'true' would trust all hops, letting clients spoof X-Forwarded-For and bypass
// per-IP rate limits. '1' reads only the load balancer's addition and ignores
// any X-Forwarded-For header sent by the client itself. VPN users are unaffected —
// they appear as their VPN exit node IP regardless of this setting.
app.set('trust proxy', 1);

// Security headers with Helmet
// SECURITY: Removed 'unsafe-eval' to prevent XSS attacks via eval()
// Note: 'unsafe-inline' kept for styles due to CSS-in-JS libraries; consider nonces for production
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      // Removed 'unsafe-eval' - React/Vite work without it
      // Development mode may need relaxed CSP; production should be strict
      // challenges.cloudflare.com is required for Turnstile CAPTCHA (script
      // loads the widget API; frame-src renders the actual challenge iframe).
      // Without both, every CAPTCHA-gated page (letter generator, chat,
      // case guidance, document summarizer, mitigation builder) silently
      // fails with "Failed to load verification" the moment real Turnstile
      // keys are configured, since the browser blocks the script/iframe
      // before it ever reaches Cloudflare.
      scriptSrc: process.env.NODE_ENV === 'development'
        ? ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://challenges.cloudflare.com"]
        : ["'self'", "'unsafe-inline'", "https://challenges.cloudflare.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https:", "wss:"],
      frameSrc: ["'self'", "https://challenges.cloudflare.com"],
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

// Cookie parser for attorney session management
app.use(cookieParser());

// ============================================================================
// Session middleware — establishes req.sessionID for every request so the
// guidance ownership check can bind and enforce session-scoped access control.
// Uses a named cookie ("od.sid") to avoid fingerprinting default names.
// The dev-only fallback secret below is unreachable in production — the
// startup guard above already refused to boot if SESSION_SECRET is unset.
// ============================================================================
app.use(session({
  name: 'od.sid',
  secret: process.env.SESSION_SECRET || 'dev-only-secret-change-in-production',
  resave: false,
  saveUninitialized: true, // issue a session ID to every visitor (needed for ownership binding)
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours — matches legal case expiry
  },
}));

// ============================================================================
// SECURITY: CSRF Protection for API endpoints
// ============================================================================
// For JSON APIs, we use a combination of:
// 1. SameSite=lax cookies (first line of defense, but not sufficient alone —
//    the session cookie above IS used for auth: it backs the guidance
//    session-ownership binding, so this is not a cookie-free JSON API).
// 2. Content-Type validation for state-changing requests
// 3. Strict Origin/Referer header checking — REQUIRED, not just checked when
//    present. A request with no Origin or Referer header is rejected rather
//    than assumed same-origin; real browsers always send at least one of
//    these on state-changing requests, so a missing pair is itself a signal
//    of a forged/non-browser request, not a false positive to wave through.
app.use((req, res, next) => {
  // Only check state-changing methods
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'] || '';

    // For API endpoints, require JSON content type (with exceptions for file uploads)
    if (req.path.startsWith('/api/')) {
      // Allow multipart/form-data for file upload endpoints
      const fileUploadPaths = [
        '/api/document-summary/summarize',
        '/api/attorney/document-summary/summarize',
        '/api/document-summary/batch',           // C-3: batch upload also uses multipart
        '/api/attorney/document-summary/batch',
      ];
      const isFileUpload = fileUploadPaths.some(p => req.path === p);
      
      // Allow requests with no body (e.g., DELETE), JSON, or file uploads with multipart
      const hasBody = req.headers['content-length'] && parseInt(req.headers['content-length']) > 0;

      if (hasBody && !contentType.includes('application/json') && 
          !(isFileUpload && contentType.includes('multipart/form-data'))) {
        return res.status(415).json({
          success: false,
          error: 'Content-Type must be application/json for API requests'
        });
      }

      // Check Origin/Referer header for CSRF protection.
      // In production, a state-changing API request must present an Origin
      // or Referer header whose host matches ours. Previously this only
      // checked the header when present, so a request with no Origin header
      // at all — trivial for a script or a non-browser client to produce —
      // bypassed the check entirely and relied on SameSite=lax alone.
      const origin = req.headers['origin'];
      const referer = req.headers['referer'];
      const host = req.headers['host'];

      if (process.env.NODE_ENV === 'production' && isCrossOriginRequest({ origin, referer, host })) {
        opsLog('security', `Cross-origin request blocked: origin=${origin ?? '(none)'} referer=${referer ?? '(none)'} -> ${host}`);
        return res.status(403).json({
          success: false,
          error: 'Cross-origin requests not allowed'
        });
      }
    }
  }

  next();
});

// Privacy-safe logging middleware - excludes sensitive data from logs
const SENSITIVE_PATHS = [
  '/api/legal-guidance', '/api/guidance', '/api/chat', '/api/legal-case', '/api/session',
  '/api/document-summary', '/api/attorney/document-summary',
];
const SENSITIVE_FIELDS = ['incidentDescription', 'policeStatement', 'evidenceNotes', 'priorConvictions',
  'employmentStatus', 'familySituation', 'arrestLocation', 'arrestDate',
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
  await initializeCostTracker();
  registerV1Routes(app);
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

  // Free the port if a previous process is still holding it (unclean shutdown).
  // Retries up to 3 times with increasing delays to handle slow process teardown
  // (common after task-agent merges trigger a workflow restart).
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      execSync(`fuser -k ${port}/tcp`, { stdio: 'ignore' });
    } catch (_) {
      // No process holding the port — normal case, stop retrying
      break;
    }
    await new Promise(resolve => setTimeout(resolve, 800 + attempt * 400));
  }

  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
