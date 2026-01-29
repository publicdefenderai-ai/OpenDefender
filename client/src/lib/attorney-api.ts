/**
 * Attorney API Client Functions
 *
 * Client-side API functions for attorney verification, session management,
 * and document generation.
 */

import type {
  AttorneyVerificationRequest,
  AttorneyVerificationResponse,
  AttorneySessionResponse,
} from "@shared/attorney/types";
import type { DocumentTemplate } from "@shared/templates/schema";

const API_BASE = "/api/attorney";

// ============================================================================
// Types
// ============================================================================

export interface DocumentTemplateSummary {
  id: string;
  name: string;
  category: string;
  description: string;
  estimatedCompletionTime: string;
  difficultyLevel: string;
  supportedJurisdictions: string[];
}

export interface GeneratedSection {
  id: string;
  name: string;
  type: "static" | "user-input" | "ai-generated";
  content: string;
}

export interface GeneratedDocument {
  documentId: string;
  templateId: string;
  templateName: string;
  jurisdiction: string;
  courtType?: "state" | "federal";
  district?: string;
  sections: GeneratedSection[];
  generatedAt: string;
  expiresAt: string;
}

export interface GenerateDocumentRequest {
  templateId: string;
  jurisdiction: string;
  courtType?: "state" | "federal";
  district?: string;
  formData: Record<string, string>;
}

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

// ============================================================================
// Document Template Functions
// ============================================================================

/**
 * Fetch available document templates
 */
export async function fetchTemplates(
  category?: string
): Promise<{ success: boolean; templates?: DocumentTemplateSummary[]; error?: string }> {
  try {
    const url = category
      ? `${API_BASE}/templates?category=${encodeURIComponent(category)}`
      : `${API_BASE}/templates`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Failed to fetch templates",
      };
    }

    return {
      success: true,
      templates: data.templates,
    };
  } catch {
    return {
      success: false,
      error: "Failed to fetch templates",
    };
  }
}

/**
 * Fetch a specific template by ID
 */
export async function fetchTemplate(
  templateId: string,
  jurisdiction?: string
): Promise<{ success: boolean; template?: DocumentTemplate; error?: string }> {
  try {
    const url = jurisdiction
      ? `${API_BASE}/templates/${templateId}?jurisdiction=${encodeURIComponent(jurisdiction)}`
      : `${API_BASE}/templates/${templateId}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Failed to fetch template",
      };
    }

    return {
      success: true,
      template: data.template,
    };
  } catch {
    return {
      success: false,
      error: "Failed to fetch template",
    };
  }
}

/**
 * Generate a document with AI-powered sections
 */
export async function generateDocument(
  request: GenerateDocumentRequest
): Promise<{ success: boolean; document?: GeneratedDocument; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/documents/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Failed to generate document",
      };
    }

    return {
      success: true,
      document: data.document,
    };
  } catch {
    return {
      success: false,
      error: "Failed to generate document",
    };
  }
}

/**
 * Fetch a generated document by ID
 */
export async function fetchGeneratedDocument(
  documentId: string
): Promise<{ success: boolean; document?: GeneratedDocument; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/documents/${documentId}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Failed to fetch document",
      };
    }

    return {
      success: true,
      document: data.document,
    };
  } catch {
    return {
      success: false,
      error: "Failed to fetch document",
    };
  }
}

/**
 * Export a generated document to DOCX
 */
export async function exportDocument(
  documentId: string,
  formData: Record<string, string>
): Promise<{ success: boolean; blob?: Blob; filename?: string; error?: string }> {
  try {
    const response = await fetch(`${API_BASE}/documents/export`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ documentId, formData }),
    });

    if (!response.ok) {
      const data = await response.json();
      return {
        success: false,
        error: data.error || "Failed to export document",
      };
    }

    // Get filename from Content-Disposition header
    const contentDisposition = response.headers.get("Content-Disposition");
    let filename = "document.docx";
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/);
      if (match) {
        filename = match[1];
      }
    }

    const blob = await response.blob();

    return {
      success: true,
      blob,
      filename,
    };
  } catch {
    return {
      success: false,
      error: "Failed to export document",
    };
  }
}

/**
 * Download a DOCX file to the user's device
 */
export function downloadDocx(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
