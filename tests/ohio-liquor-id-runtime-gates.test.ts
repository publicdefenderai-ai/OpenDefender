import { OHIO_LIQUOR_ID_IDS } from '../shared/ohio-liquor-id-batch';
import { afterEach, describe, expect, it, vi } from 'vitest';
const state = vi.hoisted(() => ({family: false, older: false, database: true, checks: 0}));
vi.mock('../server/data/ohio-chapter-2903-refresh', () => ({isOhioChapter2903PilotFresh: () => state.older}));
vi.mock('../server/data/ohio-reviewed-source', async original => ({...await original<typeof import('../server/data/ohio-reviewed-source')>(), isOhioReviewedSourceFresh: () => state.older}));
vi.mock('../server/data/ohio-major-source', async original => ({...await original<typeof import('../server/data/ohio-major-source')>(), isOhioMajorSourceFresh: () => state.older}));
vi.mock('../server/data/ohio-residual-source', async original => ({...await original<typeof import('../server/data/ohio-residual-source')>(), isOhioResidualSourceFresh: () => state.older}));
vi.mock('../server/data/ohio-theft-fraud-source', async original => ({...await original<typeof import('../server/data/ohio-theft-fraud-source')>(), isOhioTheftFraudSourceFresh: () => state.older}));
vi.mock('../server/data/ohio-benefits-fraud-source', async original => ({...await original<typeof import('../server/data/ohio-benefits-fraud-source')>(), isOhioBenefitsFraudSourceFresh: () => state.older}));
vi.mock('../server/data/ohio-liquor-id-source', async original => ({...await original<typeof import('../server/data/ohio-liquor-id-source')>(), isOhioLiquorIdSourceFresh: () => { state.checks++; return state.family; }}));
vi.mock('../server/services/authority-source-database', () => ({getCurrentAuthoritySelectableChargeIds: async () => new Set(state.database ? [...OHIO_LIQUOR_ID_IDS] : [])}));
vi.mock('../server/services/california-source-database', () => ({getCurrentCaliforniaSelectableChargeIds: async () => new Set()}));
import {getCurrentAuthoritySelectableChargeIds} from '../server/services/authority-eligibility';
afterEach(() => vi.unstubAllEnvs());
describe('new Ohio batch runtime boundary', () => {
  for (const family of [true, false]) for (const older of [true, false]) it(`uses only its own window: family=${family}, older=${older}`, async () => {
    Object.assign(state, {family, older, database: true}); vi.stubEnv('RELEASE_CHECK', 'false');
    expect((await getCurrentAuthoritySelectableChargeIds()).has('oh-orc-4301-631-order-or-attempt')).toBe(family);
  });
  it('does not expose fresh reviewed content before database eligibility exists', async () => {
    Object.assign(state, {family: true, older: true, database: false}); vi.stubEnv('RELEASE_CHECK', 'false');
    expect((await getCurrentAuthoritySelectableChargeIds()).has('oh-orc-4301-631-order-or-attempt')).toBe(false);
  });
  it('checks the eighteen-record family once per request and rechecks changed freshness next request',async()=>{
    Object.assign(state,{family:true,older:false,database:true,checks:0});vi.stubEnv('RELEASE_CHECK','false');
    const first=await getCurrentAuthoritySelectableChargeIds(['OH']);
    for(const id of OHIO_LIQUOR_ID_IDS)expect(first.has(id)).toBe(true);
    expect(state.checks).toBe(1);
    state.family=false;
    const second=await getCurrentAuthoritySelectableChargeIds(['OH']);
    for(const id of OHIO_LIQUOR_ID_IDS)expect(second.has(id)).toBe(false);
    expect(state.checks).toBe(2);
  });

});
