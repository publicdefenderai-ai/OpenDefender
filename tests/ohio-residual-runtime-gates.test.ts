import { afterEach, describe, expect, it, vi } from 'vitest';
const state = vi.hoisted(() => ({residual: false, older: false, database: true}));
vi.mock('../server/data/ohio-chapter-2903-refresh', () => ({isOhioChapter2903PilotFresh: () => state.older}));
vi.mock('../server/data/ohio-reviewed-source', async original => ({...await original<typeof import('../server/data/ohio-reviewed-source')>(), isOhioReviewedSourceFresh: () => state.older}));
vi.mock('../server/data/ohio-major-source', async original => ({...await original<typeof import('../server/data/ohio-major-source')>(), isOhioMajorSourceFresh: () => state.older}));
vi.mock('../server/data/ohio-residual-source', async original => ({...await original<typeof import('../server/data/ohio-residual-source')>(), isOhioResidualSourceFresh: () => state.residual}));
vi.mock('../server/services/authority-source-database', () => ({getCurrentAuthoritySelectableChargeIds: async () => new Set(state.database ? ['oh-orc-2905-01-kidnapping'] : [])}));
vi.mock('../server/services/california-source-database', () => ({getCurrentCaliforniaSelectableChargeIds: async () => new Set()}));
import {getCurrentAuthoritySelectableChargeIds} from '../server/services/authority-eligibility';
afterEach(() => vi.unstubAllEnvs());
describe('new Ohio batch runtime boundary', () => {
  for (const residual of [true, false]) for (const older of [true, false]) it(`uses only its own window: residual=${residual}, older=${older}`, async () => {
    Object.assign(state, {residual, older, database: true}); vi.stubEnv('RELEASE_CHECK', 'false');
    expect((await getCurrentAuthoritySelectableChargeIds()).has('oh-orc-2905-01-kidnapping')).toBe(residual);
  });
  it('does not expose fresh reviewed content before database eligibility exists', async () => {
    Object.assign(state, {residual: true, older: true, database: false}); vi.stubEnv('RELEASE_CHECK', 'false');
    expect((await getCurrentAuthoritySelectableChargeIds()).has('oh-orc-2905-01-kidnapping')).toBe(false);
  });
});
