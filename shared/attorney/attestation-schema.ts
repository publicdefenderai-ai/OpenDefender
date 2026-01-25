/**
 * Attorney Attestation Validation Schemas
 *
 * Zod schemas for validating attorney verification requests.
 * All 4 attestation checkboxes must be true for verification to succeed.
 */

import { z } from "zod";

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
  attestations: attestationsSchema,
});

export type AttorneyVerificationInput = z.infer<typeof attorneyVerificationRequestSchema>;
