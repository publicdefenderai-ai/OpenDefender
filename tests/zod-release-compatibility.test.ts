import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertLegalCaseSchema, insertUserSchema } from '../shared/schema';
import { attorneyVerificationRequestSchema } from '../shared/attorney/attestation-schema';

describe('patched Zod release compatibility', () => {
  it('rejects oversized constrained collections before traversing their entries', () => {
    let visits = 0;
    const schema = z.array(z.string().superRefine(() => { visits++; })).max(8);
    const result = schema.safeParse(Array(1000).fill('fixture'));
    expect(result.success).toBe(false);
    expect(visits).toBe(0);
    if (!result.success) expect(result.error.issues).toHaveLength(1);
  });
  it('retains database-derived input validation without changing database schema', () => {
    expect(insertUserSchema.parse({ username: 'fixture', password: 'fixture', id: 'ignored' })).toEqual({ username: 'fixture', password: 'fixture' });
    const input = { sessionId: 'fixture', jurisdiction: 'OH', charges: ['fixture-charge'], caseStage: 'arraignment', expiresAt: new Date('2026-12-01T00:00:00Z') };
    expect(insertLegalCaseSchema.parse(input)).toEqual(input);
    expect(insertLegalCaseSchema.safeParse({ ...input, charges: [123] }).success).toBe(false);
    expect(insertLegalCaseSchema.safeParse({ ...input, expiresAt: 'not-a-date' }).success).toBe(false);
  });
  it('still requires all attorney attestations and preserves their error messages', () => {
    const attestations = { isLicensedAttorney:true, actingOnBehalfOfClient:true, understandsPrivilegeRequirements:true, acceptsDisclosures:true };
    expect(attorneyVerificationRequestSchema.safeParse({ attestations }).success).toBe(true);
    for (const key of Object.keys(attestations)) {
      const result = attorneyVerificationRequestSchema.safeParse({ attestations:{...attestations,[key]:false} });
      expect(result.success).toBe(false);
      if(!result.success) expect(result.error.issues[0].message).toMatch(/^You must/);
    }
  });
  it('resolves browser form errors through the compatible adapter', async () => {
    const resolver=zodResolver(z.object({answer:z.string().min(2,'Please provide an answer')}));
    const options={criteriaMode:'firstError' as const, fields:{}, shouldUseNativeValidation:false};
    const bad=await resolver({answer:''},undefined,options);
    expect(bad.errors.answer?.message).toBe('Please provide an answer');
    expect(bad.values).toEqual({});
    const good=await resolver({answer:'valid'},undefined,options);
    expect(good.errors).toEqual({});expect(good.values).toEqual({answer:'valid'});
  });
});
