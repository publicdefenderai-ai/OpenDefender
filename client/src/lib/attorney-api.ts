/**
 * Attorney API Client Functions
 *
 * Client-side API functions for attorney verification and session management.
 */

import type {
  AttorneyVerificationRequest,
  AttorneyVerificationResponse,
  AttorneySessionResponse,
} from "@shared/attorney/types";

const API_BASE = "/api/attorney";

/**
 * Verify attorney credentials and create a session
 */
export async function verifyAttorney(
  request: AttorneyVerificationRequest
): Promise<AttorneyVerificationResponse> {
  const response = await fetch(`${API_BASE}/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Include cookies
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      error: data.error || "Verification failed",
    };
  }

  return {
    success: true,
    sessionId: data.sessionId,
    expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
  };
}

/**
 * Check if there is a valid attorney session
 */
export async function checkAttorneySession(): Promise<AttorneySessionResponse> {
  try {
    const response = await fetch(`${API_BASE}/session`, {
      method: "GET",
      credentials: "include", // Include cookies
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        isVerified: false,
        error: data.error || "Session check failed",
      };
    }

    return {
      success: true,
      isVerified: data.isVerified || false,
      barState: data.barState,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      timeRemaining: data.timeRemaining,
    };
  } catch {
    return {
      success: false,
      isVerified: false,
      error: "Failed to check session",
    };
  }
}

/**
 * End the current attorney session
 */
export async function endAttorneySession(): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/session`, {
      method: "DELETE",
      credentials: "include", // Include cookies
    });

    const data = await response.json();

    return {
      success: data.success || false,
      error: data.error,
    };
  } catch {
    return {
      success: false,
      error: "Failed to end session",
    };
  }
}
