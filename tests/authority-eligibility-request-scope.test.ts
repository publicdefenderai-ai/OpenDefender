import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const state = vi.hoisted(() => {
  const deadline = Date.parse('2026-11-10T00:00:00Z');
  const checks = Object.fromEntries(['ca','pilot','reviewed','major','theftFraud','benefitsFraud','justice','custody','publicPeace','residual','flOld','flNew'].map(key => [key, vi.fn(() => Date.now() < deadline)]));
  return { checks, db: vi.fn(async (_state: string) => new Set(['oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-j1','oh-j2','oh-c1','oh-c2','oh-pp1','oh-pp2','fl-n1','fl-n2'])), caDb: vi.fn(async () => new Set(['ca-one'])), deadline };
});
vi.mock('../shared/criminal-charges', () => ({getSelectableCharges: () => [
  {id:'ca-one',jurisdiction:'CA'}, {id:'oh-r1',jurisdiction:'OH'}, {id:'oh-r2',jurisdiction:'OH'},
  {id:'oh-t1',jurisdiction:'OH'}, {id:'oh-t2',jurisdiction:'OH'},
  {id:'oh-b1',jurisdiction:'OH'}, {id:'oh-b2',jurisdiction:'OH'},
  {id:'oh-j1',jurisdiction:'OH'}, {id:'oh-j2',jurisdiction:'OH'},
  {id:'oh-c1',jurisdiction:'OH'}, {id:'oh-c2',jurisdiction:'OH'},
  {id:'oh-pp1',jurisdiction:'OH'}, {id:'oh-pp2',jurisdiction:'OH'},
  {id:'fl-n1',jurisdiction:'FL'}, {id:'fl-n2',jurisdiction:'FL'},
]}));
vi.mock('../shared/california-authority', () => ({CALIFORNIA_CANONICAL_RECORDS:[{canonicalId:'ca-one',selectable:true}],getCaliforniaCanonicalRecord:()=>({currentness:{status:'current'}})}));
vi.mock('../shared/california-freshness', () => ({isCaliforniaEvidenceFresh:state.checks.ca}));
vi.mock('../shared/ohio-residual-batch', () => ({OHIO_RESIDUAL_IDS:new Set(['oh-r1','oh-r2'])}));
vi.mock('../server/data/ohio-residual-source', () => ({isOhioResidualSourceFresh:state.checks.residual}));
vi.mock('../shared/ohio-theft-fraud-batch', () => ({OHIO_THEFT_FRAUD_IDS:new Set(['oh-t1','oh-t2'])}));
vi.mock('../server/data/ohio-theft-fraud-source', () => ({isOhioTheftFraudSourceFresh:state.checks.theftFraud}));
vi.mock('../shared/ohio-benefits-fraud-batch', () => ({OHIO_BENEFITS_FRAUD_IDS:new Set(['oh-b1','oh-b2'])}));
vi.mock('../server/data/ohio-benefits-fraud-source', () => ({isOhioBenefitsFraudSourceFresh:state.checks.benefitsFraud}));
vi.mock('../shared/ohio-justice-batch', () => ({OHIO_JUSTICE_IDS:new Set(['oh-j1','oh-j2'])}));
vi.mock('../server/data/ohio-justice-source', () => ({isOhioJusticeSourceFresh:state.checks.justice}));
vi.mock('../shared/ohio-custody-batch', () => ({OHIO_CUSTODY_IDS:new Set(['oh-c1','oh-c2'])}));
vi.mock('../shared/ohio-public-peace-batch', () => ({OHIO_PUBLIC_PEACE_IDS:new Set(['oh-pp1','oh-pp2'])}));
vi.mock('../server/data/ohio-custody-source', () => ({isOhioCustodySourceFresh:state.checks.custody}));
vi.mock('../server/data/ohio-public-peace-source', () => ({isOhioPublicPeaceSourceFresh:state.checks.publicPeace}));
vi.mock('../shared/ohio-major-batch', () => ({OHIO_MAJOR_IDS:new Set()}));
vi.mock('../server/data/ohio-major-source', () => ({isOhioMajorSourceFresh:state.checks.major}));
vi.mock('../server/data/ohio-reviewed-source', () => ({OHIO_REVIEWED_SOURCES:[],isOhioReviewedSourceFresh:state.checks.reviewed}));
vi.mock('../server/data/ohio-chapter-2903-source', () => ({OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS:[]}));
vi.mock('../server/data/ohio-chapter-2903-refresh', () => ({isOhioChapter2903PilotFresh:state.checks.pilot}));
vi.mock('../shared/florida-persons-batch', () => ({FLORIDA_PERSONS_IDS:new Set(['fl-n1','fl-n2'])}));
vi.mock('../server/data/florida-persons-source', () => ({isFloridaPersonsSourceFresh:state.checks.flNew}));
vi.mock('../server/data/florida-reviewed-source-records', () => ({FLORIDA_REVIEWED_SOURCE_RECORDS:[],isFloridaReviewedSourceFresh:state.checks.flOld}));
vi.mock('../server/services/authority-source-database', () => ({getCurrentAuthoritySelectableChargeIds:state.db}));
vi.mock('../server/services/california-source-database', () => ({getCurrentCaliforniaSelectableChargeIds:state.caDb}));
import {getCurrentAuthoritySelectableChargeIds} from '../server/services/authority-eligibility';
beforeEach(() => {vi.clearAllMocks(); vi.useFakeTimers(); vi.setSystemTime(state.deadline-1);});
afterEach(() => {vi.useRealTimers();vi.unstubAllEnvs();});
for (const fixture of [true,false]) describe(`request-scoped eligibility fixture=${fixture}`, () => {
  beforeEach(() => {vi.stubEnv('RELEASE_CHECK',String(fixture));vi.stubEnv('RELEASE_CHECK_AUTHORITY_SELECTABLE_CHARGE_IDS',JSON.stringify(['ca-one','oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-j1','oh-j2','oh-c1','oh-c2','oh-pp1','oh-pp2','fl-n1','fl-n2']));});
  it('does not evaluate unrelated state evidence or databases for California',async()=>{
    expect([...await getCurrentAuthoritySelectableChargeIds(['CA'])]).toEqual(['ca-one']);
    expect(state.db).not.toHaveBeenCalled();
    for(const [key,fn] of Object.entries(state.checks)) if(key!=='ca')expect(fn).not.toHaveBeenCalled();
    expect(state.checks.ca).toHaveBeenCalledTimes(1);
  });
  it('checks each relevant family once, then rechecks expiry on the next request',async()=>{
    expect((await getCurrentAuthoritySelectableChargeIds(['OH','FL'])).size).toBe(14);
    expect(state.checks.publicPeace).toHaveBeenCalledTimes(1);expect(state.checks.custody).toHaveBeenCalledTimes(1);expect(state.checks.justice).toHaveBeenCalledTimes(1);expect(state.checks.benefitsFraud).toHaveBeenCalledTimes(1);expect(state.checks.theftFraud).toHaveBeenCalledTimes(1);expect(state.checks.residual).toHaveBeenCalledTimes(1);expect(state.checks.flNew).toHaveBeenCalledTimes(1);
    vi.setSystemTime(state.deadline);
    expect((await getCurrentAuthoritySelectableChargeIds(['OH','FL'])).size).toBe(0);
    expect(state.checks.publicPeace).toHaveBeenCalledTimes(2);expect(state.checks.custody).toHaveBeenCalledTimes(2);expect(state.checks.justice).toHaveBeenCalledTimes(2);expect(state.checks.benefitsFraud).toHaveBeenCalledTimes(2);expect(state.checks.theftFraud).toHaveBeenCalledTimes(2);expect(state.checks.residual).toHaveBeenCalledTimes(2);expect(state.checks.flNew).toHaveBeenCalledTimes(2);
  });
  it('withholds theft/fraud alone when its own receipt is stale', async()=>{
    state.checks.theftFraud.mockReturnValueOnce(false);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-b1','oh-b2','oh-j1','oh-j2','oh-c1','oh-c2','oh-pp1','oh-pp2']);
    expect(state.checks.theftFraud).toHaveBeenCalledTimes(1);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-j1','oh-j2','oh-c1','oh-c2','oh-pp1','oh-pp2']);
    expect(state.checks.theftFraud).toHaveBeenCalledTimes(2);
  });
  it('withholds benefits/fraud alone when its own receipt is stale',async()=>{
    state.checks.benefitsFraud.mockReturnValueOnce(false);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-t1','oh-t2','oh-j1','oh-j2','oh-c1','oh-c2','oh-pp1','oh-pp2']);
    expect(state.checks.benefitsFraud).toHaveBeenCalledTimes(1);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-j1','oh-j2','oh-c1','oh-c2','oh-pp1','oh-pp2']);
    expect(state.checks.benefitsFraud).toHaveBeenCalledTimes(2);
  });
  it('withholds justice alone when its own receipt is stale',async()=>{
    state.checks.justice.mockReturnValueOnce(false);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-c1','oh-c2','oh-pp1','oh-pp2']);
    expect(state.checks.justice).toHaveBeenCalledTimes(1);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-j1','oh-j2','oh-c1','oh-c2','oh-pp1','oh-pp2']);
    expect(state.checks.justice).toHaveBeenCalledTimes(2);
  });
  it('withholds custody alone when its own receipt is stale',async()=>{
    state.checks.custody.mockReturnValueOnce(false);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-j1','oh-j2','oh-pp1','oh-pp2']);
    expect(state.checks.custody).toHaveBeenCalledTimes(1);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-j1','oh-j2','oh-c1','oh-c2','oh-pp1','oh-pp2']);
    expect(state.checks.custody).toHaveBeenCalledTimes(2);
  });
  it('withholds publicPeace alone when its own receipt is stale',async()=>{
    state.checks.publicPeace.mockReturnValueOnce(false);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-j1','oh-j2','oh-c1','oh-c2']);
    expect(state.checks.publicPeace).toHaveBeenCalledTimes(1);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-j1','oh-j2','oh-c1','oh-c2','oh-pp1','oh-pp2']);
    expect(state.checks.publicPeace).toHaveBeenCalledTimes(2);
  });
  it('keeps all-jurisdiction callers supported',async()=>{expect((await getCurrentAuthoritySelectableChargeIds()).size).toBe(15);});
});
it('does not cache database eligibility between requests',async()=>{
  vi.stubEnv('RELEASE_CHECK','false');
  expect((await getCurrentAuthoritySelectableChargeIds(['CA'])).has('ca-one')).toBe(true);
  state.caDb.mockResolvedValueOnce(new Set());
  expect((await getCurrentAuthoritySelectableChargeIds(['CA'])).has('ca-one')).toBe(false);
});
