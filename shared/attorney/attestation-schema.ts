/**
 * Attorney Attestation Validation Schemas
 *
 * Zod schemas for validating attorney verification requests.
 * All 4 attestation checkboxes must be true for verification to succeed.
 */

import { z } from "zod";

// US state codes for bar associations
export const barStateSchema = z.string()
  .length(2, "Bar state must be a 2-letter state code")
  .regex(/^[A-Z]{2}$/, "Bar state must be uppercase letters")
  .refine(
    (val) => {
      const validStates = [
        "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL",
        "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME",
        "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH",
        "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI",
        "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI",
        "WY", "GU", "PR", "VI" // Include territories
      ];
      return validStates.includes(val);
    },
    { message: "Invalid US state or territory code" }
  );

// Bar number - alphanumeric, typically 4-10 characters
export const barNumberSchema = z.string()
  .min(4, "Bar number must be at least 4 characters")
  .max(15, "Bar number cannot exceed 15 characters")
  .regex(
    /^[A-Za-z0-9-]+$/,
    "Bar number must contain only letters, numbers, and hyphens"
  );

// All attestations must be true
export const attestationsSchema = z.object({
  isLicensedAttorney: z.literal(true, {
    errorMap: () => ({ message: "You must attest that you are a licensed attorney" })
  }),
  actingOnBehalfOfClient: z.literal(true, {
    errorMap: () => ({ message: "You must attest that you are acting on behalf of a client" })
  }),
  understandsPrivilegeRequirements: z.literal(true, {
    errorMap: () => ({ message: "You must attest that you understand privilege requirements" })
  }),
  acceptsTermsOfService: z.literal(true, {
    errorMap: () => ({ message: "You must accept the Terms of Service" })
  }),
});

// Complete verification request schema
export const attorneyVerificationRequestSchema = z.object({
  barState: barStateSchema,
  barNumber: barNumberSchema,
  attestations: attestationsSchema,
});

export type AttorneyVerificationInput = z.infer<typeof attorneyVerificationRequestSchema>;
