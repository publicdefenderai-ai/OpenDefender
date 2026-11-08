import { OHIO_CUSTODY_IDS } from '../shared/ohio-custody-batch';
import { afterEach, describe, expect, it, vi } from 'vitest';
const state = vi.hoisted(() => ({custody: false, older: false, database: true, checks: 0}));
vi.mock('../server/data/ohio-chapter-2903-refresh', () => ({isOhioChapter2903PilotFresh: () => state.older}));
vi.mock('../server/data/ohio-reviewed-source', async original => ({...await original<typeof import('../server/data/ohio-reviewed-source')>(), isOhioReviewedSourceFresh: () => state.older}));
vi.mock('../server/data/ohio-major-source', async original => ({...await original<typeof import('../server/data/ohio-major-source')>(), isOhioMajorSourceFresh: () => state.older}));
vi.mock('../server/data/ohio-residual-source', async original => ({...await original<typeof import('../server/data/ohio-residual-source')>(), isOhioResidualSourceFresh: () => state.older}));
vi.mock('../server/data/ohio-theft-fraud-source', async original => ({...await original<typeof import('../server/data/ohio-theft-fraud-source')>(), isOhioTheftFraudSourceFresh: () => state.older}));
vi.mock('../server/data/ohio-benefits-fraud-source', async original => ({...await original<typeof import('../server/data/ohio-benefits-fraud-source')>(), isOhioBenefitsFraudSourceFresh: () => state.older}));
vi.mock('../server/data/ohio-custody-source', async original => ({...await original<typeof import('../server/data/ohio-custody-source')>(), isOhioCustodySourceFresh: () => { state.checks++; return state.custody; }}));
vi.mock('../server/services/authority-source-database', () => ({getCurrentAuthoritySelectableChargeIds: async () => new Set(state.database ? [...OHIO_CUSTODY_IDS] : [])}));
vi.mock('../server/services/california-source-database', () => ({getCurrentCaliforniaSelectableChargeIds: async () => new Set()}));
import {getCurrentAuthoritySelectableChargeIds} from '../server/services/authority-eligibility';
afterEach(() => vi.unstubAllEnvs());
describe('new Ohio batch runtime boundary', () => {
  for (const custody of [true, false]) for (const older of [true, false]) it(`uses only its own window: custody=${custody}, older=${older}`, async () => {
    Object.assign(state, {custody, older, database: true}); vi.stubEnv('RELEASE_CHECK', 'false');
    expect((await getCurrentAuthoritySelectableChargeIds()).has('oh-orc-2921-41-theft-in-office')).toBe(custody);
  });
  it('does not expose fresh reviewed content before database eligibility exists', async () => {
    Object.assign(state, {custody: true, older: true, database: false}); vi.stubEnv('RELEASE_CHECK', 'false');
    expect((await getCurrentAuthoritySelectableChargeIds()).has('oh-orc-2921-41-theft-in-office')).toBe(false);
  });
  it('checks the thirty-record family once per request and rechecks changed freshness next request',async()=>{
    Object.assign(state,{custody:true,older:false,database:true,checks:0});vi.stubEnv('RELEASE_CHECK','false');
    const first=await getCurrentAuthoritySelectableChargeIds(['OH']);
    for(const id of OHIO_CUSTODY_IDS)expect(first.has(id)).toBe(true);
    expect(state.checks).toBe(1);
    state.custody=false;
    const second=await getCurrentAuthoritySelectableChargeIds(['OH']);
    for(const id of OHIO_CUSTODY_IDS)expect(second.has(id)).toBe(false);
    expect(state.checks).toBe(2);
  });

});
