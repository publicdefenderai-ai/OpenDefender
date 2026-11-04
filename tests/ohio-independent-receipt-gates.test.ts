import { afterEach, describe, expect, it, vi } from 'vitest';
const state = vi.hoisted(() => ({pilot: false, reviewed: false, database: true}));
vi.mock('../server/data/ohio-chapter-2903-refresh', () => ({isOhioChapter2903PilotFresh: () => state.pilot}));
vi.mock('../server/data/ohio-reviewed-source', async original => ({
  ...await original<typeof import('../server/data/ohio-reviewed-source')>(),
  isOhioReviewedSourceFresh: () => state.reviewed,
}));
vi.mock('../server/services/authority-source-database', () => ({
  getCurrentAuthoritySelectableChargeIds: async (jurisdiction: string) => new Set(
    // Runtime pilot freshness is enforced by the durable database boundary,
    // not the filesystem receipt used only by release fixtures.
    jurisdiction === 'OH' && state.database
      ? [...(state.pilot ? ['oh-orc-2903-01-aggravated-murder'] : []), 'oh-orc-2913-02-theft']
      : []),
}));
vi.mock('../server/services/california-source-database', () => ({getCurrentCaliforniaSelectableChargeIds: async () => new Set()}));
import {getCurrentAuthoritySelectableChargeIds} from '../server/services/authority-eligibility';
import {OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS} from '../server/data/ohio-chapter-2903-source';
import {OHIO_REVIEWED_SOURCES} from '../server/data/ohio-reviewed-source';
import {CALIFORNIA_CANONICAL_RECORDS} from '../shared/california-authority';
const pilot='oh-orc-2903-01-aggravated-murder', reviewed='oh-orc-2913-02-theft';
afterEach(() => vi.unstubAllEnvs());
describe('Ohio independent source-receipt boundaries', () => {
  it('uses disjoint source memberships rather than the combined public catalog', () => {
    const ids=new Set(OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS.map(r=>r.chargeId));
    expect(ids.has(pilot)).toBe(true);
    expect(OHIO_REVIEWED_SOURCES.some(r=>r.chargeId===reviewed)).toBe(true);
    expect(OHIO_REVIEWED_SOURCES.filter(r=>ids.has(r.chargeId))).toEqual([]);
  });
  for(const fixture of [false,true]) for(const p of [false,true]) for(const r of [false,true]) {
    it(`requires each record's own receipt: fixture=${fixture}, pilot=${p}, reviewed=${r}`, async()=>{
      state.pilot=p; state.reviewed=r; state.database=true;
      vi.stubEnv('RELEASE_CHECK',fixture?'true':'false');
      if(fixture) vi.stubEnv('RELEASE_CHECK_AUTHORITY_SELECTABLE_CHARGE_IDS',JSON.stringify([
        ...CALIFORNIA_CANONICAL_RECORDS.filter(row=>row.selectable).map(row=>row.canonicalId),pilot,reviewed,
      ]));
      const ids=await getCurrentAuthoritySelectableChargeIds();
      expect(ids.has(pilot)).toBe(p); expect(ids.has(reviewed)).toBe(r);
    });
  }
  it('still requires database eligibility even when both receipts are fresh', async()=>{
    state.pilot=true; state.reviewed=true; state.database=false;vi.stubEnv('RELEASE_CHECK','false');
    const ids=await getCurrentAuthoritySelectableChargeIds();
    expect(ids.has(pilot)).toBe(false);expect(ids.has(reviewed)).toBe(false);
  });
});
