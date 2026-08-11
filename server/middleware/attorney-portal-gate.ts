/**
 * Feature-flag gate for the Attorney Portal (document generation, playbooks,
 * attorney-side document summarizer/Q&A).
 *
 * Pulled out as a pure function (rather than left inline in routes.ts) so it's
 * unit-testable without booting the real server — see tests/attorney-portal-gate.test.ts.
 *
 * Why this exists: the frontend routes (/attorney/*) already redirect to
 * /directory, but that alone provided no real protection — every one of these
 * API endpoints was still fully reachable directly, and this is a public,
 * open-source repo, so the exact route names are sitting in server/routes.ts
 * on GitHub for anyone to read. The "bar membership" gate in front of document
 * generation is four self-attested checkboxes (see shared/attorney/attestation-schema.ts)
 * with no bar-number or identity verification — trivial for anyone to pass,
 * attorney or not. Until the attorney-review checklist's H-4/H-5/H-9 items
 * (unreviewed AI-generated legal document sections) are cleared, this flag
 * keeps the whole surface off by default rather than relying on the frontend
 * being unlinked.
 *
 * Fails closed: unset, empty, or any value other than the literal string
 * 'true' disables the portal. Set ATTORNEY_PORTAL_ENABLED=true only once the
 * checklist is cleared and the frontend has been reconnected.
 */
export function isAttorneyPortalEnabled(env: NodeJS.ProcessEnv): boolean {
  return env.ATTORNEY_PORTAL_ENABLED === 'true';
}
