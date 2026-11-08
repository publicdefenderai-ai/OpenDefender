import { afterEach, describe, expect, it, vi } from 'vitest';
const state = vi.hoisted(() => ({theftFraud: false, older: false, database: true}));
vi.mock('../server/data/ohio-chapter-2903-refresh', () => ({isOhioChapter2903PilotFresh: () => state.older}));
vi.mock('../server/data/ohio-reviewed-source', async original => ({...await original<typeof import('../server/data/ohio-reviewed-source')>(), isOhioReviewedSourceFresh: () => state.older}));
vi.mock('../server/data/ohio-major-source', async original => ({...await original<typeof import('../server/data/ohio-major-source')>(), isOhioMajorSourceFresh: () => state.older}));
vi.mock('../server/data/ohio-residual-source', async original => ({...await original<typeof import('../server/data/ohio-residual-source')>(), isOhioResidualSourceFresh: () => state.older}));
vi.mock('../server/data/ohio-theft-fraud-source', async original => ({...await original<typeof import('../server/data/ohio-theft-fraud-source')>(), isOhioTheftFraudSourceFresh: () => state.theftFraud}));
vi.mock('../server/services/authority-source-database', () => ({getCurrentAuthoritySelectableChargeIds: async () => new Set(state.database ? ['oh-orc-2913-03-unauthorized-vehicle-use'] : [])}));
vi.mock('../server/services/california-source-database', () => ({getCurrentCaliforniaSelectableChargeIds: async () => new Set()}));
import {getCurrentAuthoritySelectableChargeIds} from '../server/services/authority-eligibility';
afterEach(() => vi.unstubAllEnvs());
describe('new Ohio batch runtime boundary', () => {
  for (const theftFraud of [true, false]) for (const older of [true, false]) it(`uses only its own window: theftFraud=${theftFraud}, older=${older}`, async () => {
    Object.assign(state, {theftFraud, older, database: true}); vi.stubEnv('RELEASE_CHECK', 'false');
    expect((await getCurrentAuthoritySelectableChargeIds()).has('oh-orc-2913-03-unauthorized-vehicle-use')).toBe(theftFraud);
  });
  it('does not expose fresh reviewed content before database eligibility exists', async () => {
    Object.assign(state, {theftFraud: true, older: true, database: false}); vi.stubEnv('RELEASE_CHECK', 'false');
    expect((await getCurrentAuthoritySelectableChargeIds()).has('oh-orc-2913-03-unauthorized-vehicle-use')).toBe(false);
  });
});
