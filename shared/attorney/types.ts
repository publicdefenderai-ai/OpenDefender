/**
 * Attorney Document Generation Types
 *
 * TypeScript interfaces for the attorney verification and document generation system.
 * Attorney sessions use 30-minute TTL (shorter than general 24-hour sessions).
 */

export interface AttorneyAttestation {
  isLicensedAttorney: boolean;
  actingOnBehalfOfClient: boolean;
  understandsPrivilegeRequirements: boolean;
  acceptsTermsOfService: boolean;
}

export interface AttorneySession {
  sessionId: string;
  isVerified: boolean;
  createdAt: Date;
  expiresAt: Date;        // 30 min from creation
  lastActivityAt: Date;
}

export interface AttorneyVerificationRequest {
  attestations: AttorneyAttestation;
}

export interface AttorneyVerificationResponse {
  success: boolean;
  sessionId?: string;
  expiresAt?: Date;
  error?: string;
}

export interface AttorneySessionResponse {
  success: boolean;
  isVerified: boolean;
  expiresAt?: Date;
  timeRemaining?: number; // seconds remaining
  error?: string;
}

export interface AttorneyAuditEntry {
  timestamp: Date;
  action: 'session_created' | 'session_validated' | 'session_terminated' | 'session_expired';
  sessionIdPrefix: string; // First 8 chars for correlation
  metadata?: Record<string, unknown>;
}
