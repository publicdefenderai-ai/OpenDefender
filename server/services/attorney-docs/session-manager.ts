/**
 * Attorney Session Manager
 *
 * Manages verified attorney sessions with 30-minute TTL.
 * Sessions are stored in memory only (no database persistence).
 * Bar numbers are SHA-256 hashed before storage for privacy.
 */

import crypto from "crypto";
import { randomUUID } from "crypto";
import type { AttorneySession, AttorneyVerificationRequest } from "@shared/attorney/types";
import { attorneyVerificationRequestSchema } from "@shared/attorney/attestation-schema";
import { auditLogger } from "./audit-logger";
import { opsLog, devLog, errLog } from "../../utils/dev-logger";

// Session configuration
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const SESSION_COOKIE_NAME = "attorney_session";

class AttorneySessionManager {
  private sessions: Map<string, AttorneySession>;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.sessions = new Map();
    this.startPeriodicCleanup();
  }

  /**
   * Hash a bar number using SHA-256
   * Never stores or logs the plaintext bar number
   */
  private hashBarNumber(barNumber: string): string {
    return crypto.createHash("sha256").update(barNumber.trim()).digest("hex");
  }

  /**
   * Create a new verified attorney session
   */
  createSession(request: AttorneyVerificationRequest): AttorneySession | null {
    // Validate the request
    const validation = attorneyVerificationRequestSchema.safeParse(request);
    if (!validation.success) {
      devLog("[Attorney Session] Validation failed:", validation.error.errors);
      return null;
    }

    const sessionId = randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + SESSION_TTL_MS);

    const session: AttorneySession = {
      sessionId,
      isVerified: true,
      barState: request.barState.toUpperCase(),
      barNumberHash: this.hashBarNumber(request.barNumber),
      createdAt: now,
      expiresAt,
      lastActivityAt: now,
    };

    this.sessions.set(sessionId, session);

    // Log audit entry (metadata only, no PII)
    auditLogger.logSessionCreated(session);

    opsLog(`[Attorney Session] Created session for ${request.barState}, expires in 30 minutes`);

    return session;
  }

  /**
   * Validate an existing session by ID
   * Updates lastActivityAt on valid sessions
   */
  validateSession(sessionId: string): AttorneySession | null {
    const session = this.sessions.get(sessionId);

    if (!session) {
      devLog("[Attorney Session] Session not found:", sessionId.substring(0, 8));
      return null;
    }

    // Check if session has expired
    if (session.expiresAt <= new Date()) {
      this.terminateSession(sessionId, "expired");
      return null;
    }

    // Update last activity
    session.lastActivityAt = new Date();
    this.sessions.set(sessionId, session);

    auditLogger.logSessionValidated(session);

    return session;
  }

  /**
   * Terminate a session (user logout or expiry)
   */
  terminateSession(sessionId: string, reason: "user" | "expired" = "user"): boolean {
    const session = this.sessions.get(sessionId);

    if (!session) {
      return false;
    }

    this.sessions.delete(sessionId);

    if (reason === "expired") {
      auditLogger.logSessionExpired(session);
      devLog("[Attorney Session] Session expired:", sessionId.substring(0, 8));
    } else {
      auditLogger.logSessionTerminated(session);
      opsLog(`[Attorney Session] User terminated session for ${session.barState}`);
    }

    return true;
  }

  /**
   * Get session time remaining in seconds
   */
  getTimeRemaining(sessionId: string): number {
    const session = this.sessions.get(sessionId);
    if (!session) return 0;

    const remaining = session.expiresAt.getTime() - Date.now();
    return Math.max(0, Math.floor(remaining / 1000));
  }

  /**
   * Periodic cleanup of expired sessions
   */
  private startPeriodicCleanup() {
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredSessions();
    }, CLEANUP_INTERVAL_MS);
  }

  private cleanupExpiredSessions() {
    const now = new Date();
    let cleanedCount = 0;

    // Use forEach instead of for...of to avoid downlevelIteration requirement
    this.sessions.forEach((session, sessionId) => {
      if (session.expiresAt <= now) {
        this.terminateSession(sessionId, "expired");
        cleanedCount++;
      }
    });

    if (cleanedCount > 0) {
      opsLog(`[Attorney Session] Cleaned up ${cleanedCount} expired sessions`);
    }
  }

  /**
   * Get active session count (for monitoring)
   */
  getActiveSessionCount(): number {
    return this.sessions.size;
  }

  /**
   * Stop the cleanup interval (for graceful shutdown)
   */
  stopCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * Get cookie name for session ID
   */
  getCookieName(): string {
    return SESSION_COOKIE_NAME;
  }

  /**
   * Get session TTL in milliseconds
   */
  getSessionTTL(): number {
    return SESSION_TTL_MS;
  }
}

// Export singleton instance
export const attorneySessionManager = new AttorneySessionManager();
