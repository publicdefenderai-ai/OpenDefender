/**
 * Attorney Portal feature-flag gate tests.
 *
 * Goal: the Attorney Portal frontend (/attorney/*) redirects to /directory,
 * but until this flag existed, every backend API route it depends on
 * (session verify, document generation, playbooks, document-summary) was
 * still fully reachable directly — trivial to find in a public, open-source
 * repo, and gated only by a four-checkbox self-attestation with no identity
 * verification. This suite locks in that the portal is disabled by default
 * (fails closed) and only turns on with the exact literal string 'true'.
 */

import { describe, it, expect } from 'vitest';
import { isAttorneyPortalEnabled } from '../server/middleware/attorney-portal-gate';

describe('isAttorneyPortalEnabled', () => {
  it('is disabled when the env var is unset', () => {
    expect(isAttorneyPortalEnabled({})).toBe(false);
  });

  it('is disabled when the env var is an empty string', () => {
    expect(isAttorneyPortalEnabled({ ATTORNEY_PORTAL_ENABLED: '' })).toBe(false);
  });

  it('is disabled for common "truthy" strings other than the exact literal "true"', () => {
    expect(isAttorneyPortalEnabled({ ATTORNEY_PORTAL_ENABLED: '1' })).toBe(false);
    expect(isAttorneyPortalEnabled({ ATTORNEY_PORTAL_ENABLED: 'yes' })).toBe(false);
    expect(isAttorneyPortalEnabled({ ATTORNEY_PORTAL_ENABLED: 'True' })).toBe(false);
    expect(isAttorneyPortalEnabled({ ATTORNEY_PORTAL_ENABLED: 'TRUE' })).toBe(false);
    expect(isAttorneyPortalEnabled({ ATTORNEY_PORTAL_ENABLED: ' true' })).toBe(false);
  });

  it('is enabled only when the env var is exactly "true"', () => {
    expect(isAttorneyPortalEnabled({ ATTORNEY_PORTAL_ENABLED: 'true' })).toBe(true);
  });

  it('is disabled regardless of NODE_ENV — this is not a prod-only guard', () => {
    expect(isAttorneyPortalEnabled({ NODE_ENV: 'development' })).toBe(false);
    expect(isAttorneyPortalEnabled({ NODE_ENV: 'production' })).toBe(false);
    expect(isAttorneyPortalEnabled({ NODE_ENV: 'test' })).toBe(false);
  });
});
