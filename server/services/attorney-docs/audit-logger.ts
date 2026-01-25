/**
 * Attorney Audit Logger
 *
 * Logs attorney session events for compliance and debugging.
 * Metadata only - never logs PII or bar numbers.
 */

import type { AttorneySession, AttorneyAuditEntry } from "@shared/attorney/types";
import { opsLog, devLog } from "../../utils/dev-logger";

class AttorneyAuditLogger {
  private auditLog: AttorneyAuditEntry[] = [];
  private maxLogSize = 1000; // Keep last 1000 entries in memory

  /**
   * Create an audit entry from session data
   * Only includes metadata safe for logging
   */
  private createEntry(
    session: AttorneySession,
    action: AttorneyAuditEntry["action"]
  ): AttorneyAuditEntry {
    return {
      timestamp: new Date(),
      action,
      sessionIdPrefix: session.sessionId.substring(0, 8),
    };
  }

  /**
   * Log a new session creation
   */
  logSessionCreated(session: AttorneySession): void {
    const entry = this.createEntry(session, "session_created");
    this.addEntry(entry);
    devLog(`[Attorney Audit] Session created, ID: ${entry.sessionIdPrefix}...`);
  }

  /**
   * Log a session validation check
   */
  logSessionValidated(session: AttorneySession): void {
    const entry = this.createEntry(session, "session_validated");
    this.addEntry(entry);
    // Don't log every validation to avoid noise
  }

  /**
   * Log a user-initiated session termination
   */
  logSessionTerminated(session: AttorneySession): void {
    const entry = this.createEntry(session, "session_terminated");
    this.addEntry(entry);
    devLog(`[Attorney Audit] Session terminated, ID: ${entry.sessionIdPrefix}...`);
  }

  /**
   * Log a session expiration
   */
  logSessionExpired(session: AttorneySession): void {
    const entry = this.createEntry(session, "session_expired");
    this.addEntry(entry);
    devLog(`[Attorney Audit] Session expired, ID: ${entry.sessionIdPrefix}...`);
  }

  /**
   * Add entry to the log with size management
   */
  private addEntry(entry: AttorneyAuditEntry): void {
    this.auditLog.push(entry);

    // Trim old entries if exceeding max size
    if (this.auditLog.length > this.maxLogSize) {
      this.auditLog = this.auditLog.slice(-this.maxLogSize);
    }
  }

  /**
   * Get aggregated statistics for monitoring
   */
  getStats(): {
    totalSessions: number;
    byAction: Record<string, number>;
    lastHour: number;
  } {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const byAction: Record<string, number> = {};
    let lastHour = 0;

    for (const entry of this.auditLog) {
      // Count by action
      byAction[entry.action] = (byAction[entry.action] || 0) + 1;

      // Count last hour
      if (entry.timestamp >= oneHourAgo) {
        lastHour++;
      }
    }

    return {
      totalSessions: this.auditLog.filter(e => e.action === "session_created").length,
      byAction,
      lastHour,
    };
  }

  /**
   * Get recent audit entries (for admin viewing)
   */
  getRecentEntries(limit: number = 50): AttorneyAuditEntry[] {
    return this.auditLog.slice(-limit);
  }

  /**
   * Clear the audit log (for testing)
   */
  clear(): void {
    this.auditLog = [];
  }
}

// Export singleton instance
export const auditLogger = new AttorneyAuditLogger();
