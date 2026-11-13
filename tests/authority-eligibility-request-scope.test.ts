import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const state = vi.hoisted(() => {
  const deadline = Date.parse('2026-11-10T00:00:00Z');
  const checks = Object.fromEntries(['ca','pilot','reviewed','major','theftFraud','benefitsFraud','justice','custody','publicPeace','family','protection','privacy','priorityGaps','commercialSex','drugConduct','drugRemainder','weaponsLocation','gambling','residual','flOld','flNew','flRobbery','flCrashFlight','flRestraint'].map(key => [key, vi.fn(() => Date.now() < deadline)]));
  return { checks, db: vi.fn(async (_state: string) => new Set(['oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-j1','oh-j2','oh-c1','oh-c2','oh-pp1','oh-pp2','oh-fa1','oh-fa2','oh-pr1','oh-pr2','oh-pv1','oh-pv2','oh-pg1','oh-pg2','oh-cs1','oh-cs2','oh-dc1','oh-dc2','oh-dr1','oh-dr2','oh-wl1','oh-wl2','oh-gb1','oh-gb2','fl-n1','fl-n2','fl-r1','fl-r2','fl-c1','fl-c2','fl-s1','fl-s2','oh-criminal-trespass'])), caDb: vi.fn(async () => new Set(['ca-one'])), deadline };
});
// Synthetic IDs stand in for the reviewed batches mocked below.
vi.mock('../shared/ohio-reviewed-identity', () => ({isReviewedOhioChargeId: (id: string) => /^oh-(?:r|t|b|j|c|pp|fa|pr|pv|pg|cs|dc|dr|wl|gb)[12]$/.test(id)}));
vi.mock('../shared/criminal-charges', () => ({getSelectableCharges: () => [
  {id:'ca-one',jurisdiction:'CA'}, {id:'oh-criminal-trespass',jurisdiction:'OH'}, {id:'oh-r1',jurisdiction:'OH'}, {id:'oh-r2',jurisdiction:'OH'},
  {id:'oh-t1',jurisdiction:'OH'}, {id:'oh-t2',jurisdiction:'OH'},
  {id:'oh-b1',jurisdiction:'OH'}, {id:'oh-b2',jurisdiction:'OH'},
  {id:'oh-j1',jurisdiction:'OH'}, {id:'oh-j2',jurisdiction:'OH'},
  {id:'oh-c1',jurisdiction:'OH'}, {id:'oh-c2',jurisdiction:'OH'},
  {id:'oh-pp1',jurisdiction:'OH'}, {id:'oh-pp2',jurisdiction:'OH'},
  {id:'oh-fa1',jurisdiction:'OH'}, {id:'oh-fa2',jurisdiction:'OH'},
  {id:'oh-pr1',jurisdiction:'OH'}, {id:'oh-pr2',jurisdiction:'OH'},
  {id:'oh-pv1',jurisdiction:'OH'}, {id:'oh-pv2',jurisdiction:'OH'},
  {id:'oh-pg1',jurisdiction:'OH'}, {id:'oh-pg2',jurisdiction:'OH'},
  {id:'oh-cs1',jurisdiction:'OH'}, {id:'oh-cs2',jurisdiction:'OH'},
  {id:'oh-dc1',jurisdiction:'OH'}, {id:'oh-dc2',jurisdiction:'OH'},
  {id:'oh-dr1',jurisdiction:'OH'}, {id:'oh-dr2',jurisdiction:'OH'},
  {id:'oh-wl1',jurisdiction:'OH'}, {id:'oh-wl2',jurisdiction:'OH'},
  {id:'oh-gb1',jurisdiction:'OH'}, {id:'oh-gb2',jurisdiction:'OH'},
  {id:'fl-n1',jurisdiction:'FL'}, {id:'fl-n2',jurisdiction:'FL'},
  {id:'fl-r1',jurisdiction:'FL'}, {id:'fl-r2',jurisdiction:'FL'},
  {id:'fl-s1',jurisdiction:'FL'}, {id:'fl-s2',jurisdiction:'FL'},
  {id:'fl-c1',jurisdiction:'FL'}, {id:'fl-c2',jurisdiction:'FL'},
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
vi.mock('../shared/ohio-protection-batch', () => ({OHIO_PROTECTION_IDS:new Set(['oh-pr1','oh-pr2'])}));
vi.mock('../shared/ohio-privacy-batch', () => ({OHIO_PRIVACY_IDS:new Set(['oh-pv1','oh-pv2'])}));
vi.mock('../shared/ohio-priority-gaps-batch', () => ({OHIO_PRIORITY_GAPS_IDS:new Set(['oh-pg1','oh-pg2'])}));
vi.mock('../shared/ohio-commercial-sex-batch', () => ({OHIO_COMMERCIAL_SEX_IDS:new Set(['oh-cs1','oh-cs2'])}));
vi.mock('../shared/ohio-drug-conduct-batch', () => ({OHIO_DRUG_CONDUCT_IDS:new Set(['oh-dc1','oh-dc2'])}));
vi.mock('../shared/ohio-drug-remainder-batch', () => ({OHIO_DRUG_REMAINDER_IDS:new Set(['oh-dr1','oh-dr2'])}));
vi.mock('../shared/ohio-weapons-location-batch', () => ({OHIO_WEAPONS_LOCATION_IDS:new Set(['oh-wl1','oh-wl2'])}));
vi.mock('../shared/ohio-gambling-batch', () => ({OHIO_GAMBLING_IDS:new Set(['oh-gb1','oh-gb2'])}));
vi.mock('../shared/ohio-family-batch', () => ({OHIO_FAMILY_IDS:new Set(['oh-fa1','oh-fa2'])}));
vi.mock('../server/data/ohio-custody-source', () => ({isOhioCustodySourceFresh:state.checks.custody}));
vi.mock('../server/data/ohio-public-peace-source', () => ({isOhioPublicPeaceSourceFresh:state.checks.publicPeace}));
vi.mock('../server/data/ohio-protection-source', () => ({isOhioProtectionSourceFresh:state.checks.protection}));
vi.mock('../server/data/ohio-privacy-source', () => ({isOhioPrivacySourceFresh:state.checks.privacy}));
vi.mock('../server/data/ohio-priority-gaps-source', () => ({isOhioPriorityGapsSourceFresh:state.checks.priorityGaps}));
vi.mock('../server/data/ohio-commercial-sex-source', () => ({isOhioCommercialSexSourceFresh:state.checks.commercialSex}));
vi.mock('../server/data/ohio-drug-conduct-source', () => ({isOhioDrugConductSourceFresh:state.checks.drugConduct}));
vi.mock('../server/data/ohio-drug-remainder-source', () => ({isOhioDrugRemainderSourceFresh:state.checks.drugRemainder}));
vi.mock('../server/data/ohio-weapons-location-source', () => ({isOhioWeaponsLocationSourceFresh:state.checks.weaponsLocation}));
vi.mock('../server/data/ohio-gambling-source', () => ({isOhioGamblingSourceFresh:state.checks.gambling}));
vi.mock('../server/data/ohio-family-source', () => ({isOhioFamilySourceFresh:state.checks.family}));
vi.mock('../shared/ohio-major-batch', () => ({OHIO_MAJOR_IDS:new Set()}));
vi.mock('../server/data/ohio-major-source', () => ({isOhioMajorSourceFresh:state.checks.major}));
vi.mock('../server/data/ohio-reviewed-source', () => ({OHIO_REVIEWED_SOURCES:[],isOhioReviewedSourceFresh:state.checks.reviewed}));
vi.mock('../server/data/ohio-chapter-2903-source', () => ({OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS:[]}));
vi.mock('../server/data/ohio-chapter-2903-refresh', () => ({isOhioChapter2903PilotFresh:state.checks.pilot}));
vi.mock('../shared/florida-crash-flight-batch', () => ({FLORIDA_CRASH_FLIGHT_IDS:new Set(['fl-c1','fl-c2'])}));
vi.mock('../shared/florida-restraint-batch', () => ({FLORIDA_RESTRAINT_IDS:new Set(['fl-s1','fl-s2'])}));
vi.mock('../server/data/florida-crash-flight-source', () => ({isFloridaCrashFlightSourceFresh:state.checks.flCrashFlight}));
vi.mock('../server/data/florida-restraint-source', () => ({isFloridaRestraintSourceFresh:state.checks.flRestraint}));
vi.mock('../shared/florida-robbery-batch', () => ({FLORIDA_ROBBERY_IDS:new Set(['fl-r1','fl-r2'])}));
vi.mock('../server/data/florida-robbery-source', () => ({isFloridaRobberySourceFresh:state.checks.flRobbery}));
vi.mock('../shared/florida-persons-batch', () => ({FLORIDA_PERSONS_IDS:new Set(['fl-n1','fl-n2'])}));
vi.mock('../server/data/florida-persons-source', () => ({isFloridaPersonsSourceFresh:state.checks.flNew}));
vi.mock('../server/data/florida-reviewed-source-records', () => ({FLORIDA_REVIEWED_SOURCE_RECORDS:[],isFloridaReviewedSourceFresh:state.checks.flOld}));
vi.mock('../server/services/authority-source-database', () => ({getCurrentAuthoritySelectableChargeIds:state.db}));
vi.mock('../server/services/california-source-database', () => ({getCurrentCaliforniaSelectableChargeIds:state.caDb}));
import {getCurrentAuthoritySelectableChargeIds} from '../server/services/authority-eligibility';
beforeEach(() => {vi.clearAllMocks(); vi.useFakeTimers(); vi.setSystemTime(state.deadline-1);});
afterEach(() => {vi.useRealTimers();vi.unstubAllEnvs();});
for (const fixture of [true,false]) describe(`request-scoped eligibility fixture=${fixture}`, () => {
  beforeEach(() => {vi.stubEnv('RELEASE_CHECK',String(fixture));vi.stubEnv('RELEASE_CHECK_AUTHORITY_SELECTABLE_CHARGE_IDS',JSON.stringify(['ca-one','oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-j1','oh-j2','oh-c1','oh-c2','oh-pp1','oh-pp2','oh-fa1','oh-fa2','oh-pr1','oh-pr2','oh-pv1','oh-pv2','oh-pg1','oh-pg2','oh-cs1','oh-cs2','oh-dc1','oh-dc2','oh-dr1','oh-dr2','oh-wl1','oh-wl2','oh-gb1','oh-gb2','fl-n1','fl-n2','fl-r1','fl-r2','fl-c1','fl-c2','fl-s1','fl-s2','oh-criminal-trespass']));});
  it('does not evaluate unrelated state evidence or databases for California',async()=>{
    expect([...await getCurrentAuthoritySelectableChargeIds(['CA'])]).toEqual(['ca-one']);
    expect(state.db).not.toHaveBeenCalled();
    for(const [key,fn] of Object.entries(state.checks)) if(key!=='ca')expect(fn).not.toHaveBeenCalled();
    expect(state.checks.ca).toHaveBeenCalledTimes(1);
  });
  it('checks each relevant family once, then rechecks expiry on the next request',async()=>{
    expect((await getCurrentAuthoritySelectableChargeIds(['OH','FL'])).size).toBe(38);
    expect(state.checks.gambling).toHaveBeenCalledTimes(1);expect(state.checks.weaponsLocation).toHaveBeenCalledTimes(1);expect(state.checks.drugRemainder).toHaveBeenCalledTimes(1);expect(state.checks.drugConduct).toHaveBeenCalledTimes(1);expect(state.checks.commercialSex).toHaveBeenCalledTimes(1);expect(state.checks.priorityGaps).toHaveBeenCalledTimes(1);expect(state.checks.privacy).toHaveBeenCalledTimes(1);expect(state.checks.protection).toHaveBeenCalledTimes(1);expect(state.checks.family).toHaveBeenCalledTimes(1);expect(state.checks.publicPeace).toHaveBeenCalledTimes(1);expect(state.checks.custody).toHaveBeenCalledTimes(1);expect(state.checks.justice).toHaveBeenCalledTimes(1);expect(state.checks.benefitsFraud).toHaveBeenCalledTimes(1);expect(state.checks.theftFraud).toHaveBeenCalledTimes(1);expect(state.checks.residual).toHaveBeenCalledTimes(1);expect(state.checks.flNew).toHaveBeenCalledTimes(1);
    vi.setSystemTime(state.deadline);
    expect((await getCurrentAuthoritySelectableChargeIds(['OH','FL'])).size).toBe(0);
    expect(state.checks.gambling).toHaveBeenCalledTimes(2);expect(state.checks.weaponsLocation).toHaveBeenCalledTimes(2);expect(state.checks.drugRemainder).toHaveBeenCalledTimes(2);expect(state.checks.drugConduct).toHaveBeenCalledTimes(2);expect(state.checks.commercialSex).toHaveBeenCalledTimes(2);expect(state.checks.priorityGaps).toHaveBeenCalledTimes(2);expect(state.checks.privacy).toHaveBeenCalledTimes(2);expect(state.checks.protection).toHaveBeenCalledTimes(2);expect(state.checks.family).toHaveBeenCalledTimes(2);expect(state.checks.publicPeace).toHaveBeenCalledTimes(2);expect(state.checks.custody).toHaveBeenCalledTimes(2);expect(state.checks.justice).toHaveBeenCalledTimes(2);expect(state.checks.benefitsFraud).toHaveBeenCalledTimes(2);expect(state.checks.theftFraud).toHaveBeenCalledTimes(2);expect(state.checks.residual).toHaveBeenCalledTimes(2);expect(state.checks.flNew).toHaveBeenCalledTimes(2);
  });
  it('withholds only restraint choices when the new family expires', async () => {
    state.checks.flRestraint.mockReturnValueOnce(false);
    expect([...await getCurrentAuthoritySelectableChargeIds(['FL'])]).toEqual(['fl-n1','fl-n2','fl-r1','fl-r2','fl-c1','fl-c2']);
    expect(state.checks.flRestraint).toHaveBeenCalledTimes(1);
    expect(await getCurrentAuthoritySelectableChargeIds(['FL'])).toContain('fl-s1');
    expect(state.checks.flRestraint).toHaveBeenCalledTimes(2);
  });
  it('checks crash and flight evidence independently on each Florida request', async () => {
    state.checks.flCrashFlight.mockReturnValueOnce(false);
    expect([...await getCurrentAuthoritySelectableChargeIds(['FL'])]).toEqual(['fl-n1', 'fl-n2', 'fl-r1', 'fl-r2', 'fl-s1', 'fl-s2']);
    expect(state.checks.flCrashFlight).toHaveBeenCalledTimes(1);
    expect([...await getCurrentAuthoritySelectableChargeIds(['FL'])]).toEqual(['fl-n1', 'fl-n2', 'fl-r1', 'fl-r2', 'fl-s1', 'fl-s2', 'fl-c1', 'fl-c2']);
    expect(state.checks.flCrashFlight).toHaveBeenCalledTimes(2);
  });
  it('withholds robbery choices when their evidence expires and rechecks on the next Florida request', async () => {
    state.checks.flRobbery.mockReturnValueOnce(false);
    expect([...await getCurrentAuthoritySelectableChargeIds(['FL'])]).toEqual(['fl-n1', 'fl-n2', 'fl-s1', 'fl-s2', 'fl-c1', 'fl-c2']);
    expect(state.checks.flRobbery).toHaveBeenCalledTimes(1);
    expect([...await getCurrentAuthoritySelectableChargeIds(['FL'])]).toEqual(['fl-n1', 'fl-n2', 'fl-r1', 'fl-r2', 'fl-s1', 'fl-s2', 'fl-c1', 'fl-c2']);
    expect(state.checks.flRobbery).toHaveBeenCalledTimes(2);
  });
  it('withholds theft/fraud alone when its own receipt is stale', async()=>{
    state.checks.theftFraud.mockReturnValueOnce(false);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-b1','oh-b2','oh-j1','oh-j2','oh-c1','oh-c2','oh-pp1','oh-pp2','oh-fa1','oh-fa2','oh-pr1','oh-pr2','oh-pv1','oh-pv2','oh-pg1','oh-pg2','oh-cs1','oh-cs2','oh-dc1','oh-dc2','oh-dr1','oh-dr2','oh-wl1','oh-wl2','oh-gb1','oh-gb2']);
    expect(state.checks.theftFraud).toHaveBeenCalledTimes(1);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-j1','oh-j2','oh-c1','oh-c2','oh-pp1','oh-pp2','oh-fa1','oh-fa2','oh-pr1','oh-pr2','oh-pv1','oh-pv2','oh-pg1','oh-pg2','oh-cs1','oh-cs2','oh-dc1','oh-dc2','oh-dr1','oh-dr2','oh-wl1','oh-wl2','oh-gb1','oh-gb2']);
    expect(state.checks.theftFraud).toHaveBeenCalledTimes(2);
  });
  it('withholds benefits/fraud alone when its own receipt is stale',async()=>{
    state.checks.benefitsFraud.mockReturnValueOnce(false);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-t1','oh-t2','oh-j1','oh-j2','oh-c1','oh-c2','oh-pp1','oh-pp2','oh-fa1','oh-fa2','oh-pr1','oh-pr2','oh-pv1','oh-pv2','oh-pg1','oh-pg2','oh-cs1','oh-cs2','oh-dc1','oh-dc2','oh-dr1','oh-dr2','oh-wl1','oh-wl2','oh-gb1','oh-gb2']);
    expect(state.checks.benefitsFraud).toHaveBeenCalledTimes(1);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-j1','oh-j2','oh-c1','oh-c2','oh-pp1','oh-pp2','oh-fa1','oh-fa2','oh-pr1','oh-pr2','oh-pv1','oh-pv2','oh-pg1','oh-pg2','oh-cs1','oh-cs2','oh-dc1','oh-dc2','oh-dr1','oh-dr2','oh-wl1','oh-wl2','oh-gb1','oh-gb2']);
    expect(state.checks.benefitsFraud).toHaveBeenCalledTimes(2);
  });
  it('withholds justice alone when its own receipt is stale',async()=>{
    state.checks.justice.mockReturnValueOnce(false);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-c1','oh-c2','oh-pp1','oh-pp2','oh-fa1','oh-fa2','oh-pr1','oh-pr2','oh-pv1','oh-pv2','oh-pg1','oh-pg2','oh-cs1','oh-cs2','oh-dc1','oh-dc2','oh-dr1','oh-dr2','oh-wl1','oh-wl2','oh-gb1','oh-gb2']);
    expect(state.checks.justice).toHaveBeenCalledTimes(1);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-j1','oh-j2','oh-c1','oh-c2','oh-pp1','oh-pp2','oh-fa1','oh-fa2','oh-pr1','oh-pr2','oh-pv1','oh-pv2','oh-pg1','oh-pg2','oh-cs1','oh-cs2','oh-dc1','oh-dc2','oh-dr1','oh-dr2','oh-wl1','oh-wl2','oh-gb1','oh-gb2']);
    expect(state.checks.justice).toHaveBeenCalledTimes(2);
  });
  it('withholds custody alone when its own receipt is stale',async()=>{
    state.checks.custody.mockReturnValueOnce(false);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-j1','oh-j2','oh-pp1','oh-pp2','oh-fa1','oh-fa2','oh-pr1','oh-pr2','oh-pv1','oh-pv2','oh-pg1','oh-pg2','oh-cs1','oh-cs2','oh-dc1','oh-dc2','oh-dr1','oh-dr2','oh-wl1','oh-wl2','oh-gb1','oh-gb2']);
    expect(state.checks.custody).toHaveBeenCalledTimes(1);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-j1','oh-j2','oh-c1','oh-c2','oh-pp1','oh-pp2','oh-fa1','oh-fa2','oh-pr1','oh-pr2','oh-pv1','oh-pv2','oh-pg1','oh-pg2','oh-cs1','oh-cs2','oh-dc1','oh-dc2','oh-dr1','oh-dr2','oh-wl1','oh-wl2','oh-gb1','oh-gb2']);
    expect(state.checks.custody).toHaveBeenCalledTimes(2);
  });
  it('withholds publicPeace alone when its own receipt is stale',async()=>{
    state.checks.publicPeace.mockReturnValueOnce(false);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-j1','oh-j2','oh-c1','oh-c2','oh-fa1','oh-fa2','oh-pr1','oh-pr2','oh-pv1','oh-pv2','oh-pg1','oh-pg2','oh-cs1','oh-cs2','oh-dc1','oh-dc2','oh-dr1','oh-dr2','oh-wl1','oh-wl2','oh-gb1','oh-gb2']);
    expect(state.checks.publicPeace).toHaveBeenCalledTimes(1);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-j1','oh-j2','oh-c1','oh-c2','oh-pp1','oh-pp2','oh-fa1','oh-fa2','oh-pr1','oh-pr2','oh-pv1','oh-pv2','oh-pg1','oh-pg2','oh-cs1','oh-cs2','oh-dc1','oh-dc2','oh-dr1','oh-dr2','oh-wl1','oh-wl2','oh-gb1','oh-gb2']);
    expect(state.checks.publicPeace).toHaveBeenCalledTimes(2);
  });
  it('withholds family alone when its own receipt is stale',async()=>{
    state.checks.family.mockReturnValueOnce(false);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-j1','oh-j2','oh-c1','oh-c2','oh-pp1','oh-pp2','oh-pr1','oh-pr2','oh-pv1','oh-pv2','oh-pg1','oh-pg2','oh-cs1','oh-cs2','oh-dc1','oh-dc2','oh-dr1','oh-dr2','oh-wl1','oh-wl2','oh-gb1','oh-gb2']);
    expect(state.checks.family).toHaveBeenCalledTimes(1);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-j1','oh-j2','oh-c1','oh-c2','oh-pp1','oh-pp2','oh-fa1','oh-fa2','oh-pr1','oh-pr2','oh-pv1','oh-pv2','oh-pg1','oh-pg2','oh-cs1','oh-cs2','oh-dc1','oh-dc2','oh-dr1','oh-dr2','oh-wl1','oh-wl2','oh-gb1','oh-gb2']);
    expect(state.checks.family).toHaveBeenCalledTimes(2);
  });
  it('withholds protection alone when its own receipt is stale',async()=>{
    state.checks.protection.mockReturnValueOnce(false);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-j1','oh-j2','oh-c1','oh-c2','oh-pp1','oh-pp2','oh-fa1','oh-fa2','oh-pv1','oh-pv2','oh-pg1','oh-pg2','oh-cs1','oh-cs2','oh-dc1','oh-dc2','oh-dr1','oh-dr2','oh-wl1','oh-wl2','oh-gb1','oh-gb2']);
    expect(state.checks.protection).toHaveBeenCalledTimes(1);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-j1','oh-j2','oh-c1','oh-c2','oh-pp1','oh-pp2','oh-fa1','oh-fa2','oh-pr1','oh-pr2','oh-pv1','oh-pv2','oh-pg1','oh-pg2','oh-cs1','oh-cs2','oh-dc1','oh-dc2','oh-dr1','oh-dr2','oh-wl1','oh-wl2','oh-gb1','oh-gb2']);
    expect(state.checks.protection).toHaveBeenCalledTimes(2);
  });
  it('withholds privacy alone when its own receipt is stale',async()=>{
    state.checks.privacy.mockReturnValueOnce(false);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-j1','oh-j2','oh-c1','oh-c2','oh-pp1','oh-pp2','oh-fa1','oh-fa2','oh-pr1','oh-pr2','oh-pg1','oh-pg2','oh-cs1','oh-cs2','oh-dc1','oh-dc2','oh-dr1','oh-dr2','oh-wl1','oh-wl2','oh-gb1','oh-gb2']);
    expect(state.checks.privacy).toHaveBeenCalledTimes(1);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-j1','oh-j2','oh-c1','oh-c2','oh-pp1','oh-pp2','oh-fa1','oh-fa2','oh-pr1','oh-pr2','oh-pv1','oh-pv2','oh-pg1','oh-pg2','oh-cs1','oh-cs2','oh-dc1','oh-dc2','oh-dr1','oh-dr2','oh-wl1','oh-wl2','oh-gb1','oh-gb2']);
    expect(state.checks.privacy).toHaveBeenCalledTimes(2);
  });
  it('withholds priorityGaps alone when its own receipt is stale',async()=>{
    state.checks.priorityGaps.mockReturnValueOnce(false);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-j1','oh-j2','oh-c1','oh-c2','oh-pp1','oh-pp2','oh-fa1','oh-fa2','oh-pr1','oh-pr2','oh-pv1','oh-pv2','oh-cs1','oh-cs2','oh-dc1','oh-dc2','oh-dr1','oh-dr2','oh-wl1','oh-wl2','oh-gb1','oh-gb2']);
    expect(state.checks.priorityGaps).toHaveBeenCalledTimes(1);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-j1','oh-j2','oh-c1','oh-c2','oh-pp1','oh-pp2','oh-fa1','oh-fa2','oh-pr1','oh-pr2','oh-pv1','oh-pv2','oh-pg1','oh-pg2','oh-cs1','oh-cs2','oh-dc1','oh-dc2','oh-dr1','oh-dr2','oh-wl1','oh-wl2','oh-gb1','oh-gb2']);
    expect(state.checks.priorityGaps).toHaveBeenCalledTimes(2);
  });
  it('withholds commercialSex alone when its own receipt is stale',async()=>{
    state.checks.commercialSex.mockReturnValueOnce(false);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-j1','oh-j2','oh-c1','oh-c2','oh-pp1','oh-pp2','oh-fa1','oh-fa2','oh-pr1','oh-pr2','oh-pv1','oh-pv2','oh-pg1','oh-pg2','oh-dc1','oh-dc2','oh-dr1','oh-dr2','oh-wl1','oh-wl2','oh-gb1','oh-gb2']);
    expect(state.checks.commercialSex).toHaveBeenCalledTimes(1);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-j1','oh-j2','oh-c1','oh-c2','oh-pp1','oh-pp2','oh-fa1','oh-fa2','oh-pr1','oh-pr2','oh-pv1','oh-pv2','oh-pg1','oh-pg2','oh-cs1','oh-cs2','oh-dc1','oh-dc2','oh-dr1','oh-dr2','oh-wl1','oh-wl2','oh-gb1','oh-gb2']);
    expect(state.checks.commercialSex).toHaveBeenCalledTimes(2);
  });
  it('withholds drugConduct alone when its own receipt is stale',async()=>{
    state.checks.drugConduct.mockReturnValueOnce(false);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-j1','oh-j2','oh-c1','oh-c2','oh-pp1','oh-pp2','oh-fa1','oh-fa2','oh-pr1','oh-pr2','oh-pv1','oh-pv2','oh-pg1','oh-pg2','oh-cs1','oh-cs2','oh-dr1','oh-dr2','oh-wl1','oh-wl2','oh-gb1','oh-gb2']);
    expect(state.checks.drugConduct).toHaveBeenCalledTimes(1);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-j1','oh-j2','oh-c1','oh-c2','oh-pp1','oh-pp2','oh-fa1','oh-fa2','oh-pr1','oh-pr2','oh-pv1','oh-pv2','oh-pg1','oh-pg2','oh-cs1','oh-cs2','oh-dc1','oh-dc2','oh-dr1','oh-dr2','oh-wl1','oh-wl2','oh-gb1','oh-gb2']);
    expect(state.checks.drugConduct).toHaveBeenCalledTimes(2);
  });
  it('withholds drugRemainder alone when its own receipt is stale',async()=>{
    state.checks.drugRemainder.mockReturnValueOnce(false);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-j1','oh-j2','oh-c1','oh-c2','oh-pp1','oh-pp2','oh-fa1','oh-fa2','oh-pr1','oh-pr2','oh-pv1','oh-pv2','oh-pg1','oh-pg2','oh-cs1','oh-cs2','oh-dc1','oh-dc2','oh-wl1','oh-wl2','oh-gb1','oh-gb2']);
    expect(state.checks.drugRemainder).toHaveBeenCalledTimes(1);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-j1','oh-j2','oh-c1','oh-c2','oh-pp1','oh-pp2','oh-fa1','oh-fa2','oh-pr1','oh-pr2','oh-pv1','oh-pv2','oh-pg1','oh-pg2','oh-cs1','oh-cs2','oh-dc1','oh-dc2','oh-dr1','oh-dr2','oh-wl1','oh-wl2','oh-gb1','oh-gb2']);
    expect(state.checks.drugRemainder).toHaveBeenCalledTimes(2);
  });
  it('withholds weaponsLocation alone when its own receipt is stale',async()=>{
    state.checks.weaponsLocation.mockReturnValueOnce(false);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-j1','oh-j2','oh-c1','oh-c2','oh-pp1','oh-pp2','oh-fa1','oh-fa2','oh-pr1','oh-pr2','oh-pv1','oh-pv2','oh-pg1','oh-pg2','oh-cs1','oh-cs2','oh-dc1','oh-dc2','oh-dr1','oh-dr2','oh-gb1','oh-gb2']);
    expect(state.checks.weaponsLocation).toHaveBeenCalledTimes(1);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-j1','oh-j2','oh-c1','oh-c2','oh-pp1','oh-pp2','oh-fa1','oh-fa2','oh-pr1','oh-pr2','oh-pv1','oh-pv2','oh-pg1','oh-pg2','oh-cs1','oh-cs2','oh-dc1','oh-dc2','oh-dr1','oh-dr2','oh-wl1','oh-wl2','oh-gb1','oh-gb2']);
    expect(state.checks.weaponsLocation).toHaveBeenCalledTimes(2);
  });
  it('withholds gambling alone when its own receipt is stale',async()=>{
    state.checks.gambling.mockReturnValueOnce(false);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-j1','oh-j2','oh-c1','oh-c2','oh-pp1','oh-pp2','oh-fa1','oh-fa2','oh-pr1','oh-pr2','oh-pv1','oh-pv2','oh-pg1','oh-pg2','oh-cs1','oh-cs2','oh-dc1','oh-dc2','oh-dr1','oh-dr2','oh-wl1','oh-wl2']);
    expect(state.checks.gambling).toHaveBeenCalledTimes(1);
    expect([...await getCurrentAuthoritySelectableChargeIds(['OH'])]).toEqual(['oh-r1','oh-r2','oh-t1','oh-t2','oh-b1','oh-b2','oh-j1','oh-j2','oh-c1','oh-c2','oh-pp1','oh-pp2','oh-fa1','oh-fa2','oh-pr1','oh-pr2','oh-pv1','oh-pv2','oh-pg1','oh-pg2','oh-cs1','oh-cs2','oh-dc1','oh-dc2','oh-dr1','oh-dr2','oh-wl1','oh-wl2','oh-gb1','oh-gb2']);
    expect(state.checks.gambling).toHaveBeenCalledTimes(2);
  });
  it('keeps all-jurisdiction callers supported',async()=>{expect((await getCurrentAuthoritySelectableChargeIds()).size).toBe(39);});
});
it('does not cache database eligibility between requests',async()=>{
  vi.stubEnv('RELEASE_CHECK','false');
  expect((await getCurrentAuthoritySelectableChargeIds(['CA'])).has('ca-one')).toBe(true);
  state.caDb.mockResolvedValueOnce(new Set());
  expect((await getCurrentAuthoritySelectableChargeIds(['CA'])).has('ca-one')).toBe(false);
});
