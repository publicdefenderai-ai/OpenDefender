import { afterEach, describe, expect, it, vi } from 'vitest';
const state = vi.hoisted(() => ({ oldFresh: false, personsFresh: false, ids: [] as string[] }));
vi.mock('../server/data/florida-reviewed-source-records', async (original) => ({ ...await original<typeof import('../server/data/florida-reviewed-source-records')>(), isFloridaReviewedSourceFresh: () => state.oldFresh }));
vi.mock('../server/data/florida-persons-source', async (original) => ({ ...await original<typeof import('../server/data/florida-persons-source')>(), isFloridaPersonsSourceFresh: () => state.personsFresh }));
vi.mock('../server/db', () => ({ db: { select: () => {
            const query: any = { from: () => query, innerJoin: () => query, where: () => {
                    const links: any = state.ids.map(chargeId => ({ chargeId, sourceKey: 'fixture', supportRole: 'offense', citation: 'fixture', subdivision: null }));
                    links.orderBy = () => ({ limit: async () => [{ metadata: { selectableChargeIds: state.ids, catalogRecords: state.ids.map(chargeId => ({ chargeId, provisions: [{ sourceKey: 'fixture', supportRole: 'offense', citation: 'fixture', subdivision: null }] })) } }] });
                    return links;
                } };
            return query;
        } } }));
import { getCurrentAuthoritySelectableChargeIds as databaseIds, getAuthorityChargeProvenance } from '../server/services/authority-source-database';
import { getCurrentAuthoritySelectableChargeIds as eligibleIds } from '../server/services/authority-eligibility';
import { FLORIDA_REVIEWED_SOURCE_RECORDS } from '../server/data/florida-reviewed-source-records';
import { FLORIDA_PERSONS_SOURCES } from '../server/data/florida-persons-source';
import { CALIFORNIA_CANONICAL_RECORDS } from '../shared/california-authority';
const old = FLORIDA_REVIEWED_SOURCE_RECORDS[0].chargeId, person = FLORIDA_PERSONS_SOURCES[0].chargeId, legacy = 'fl-aggravated-assault';
afterEach(() => vi.unstubAllEnvs());
describe('Florida independent reviewed-family gates', () => {
    it('keeps source memberships disjoint even though both IDs start fl-fs', () => {
        expect(old.startsWith('fl-fs-')).toBe(true);
        expect(person.startsWith('fl-fs-')).toBe(true);
        expect(FLORIDA_PERSONS_SOURCES.some(s => FLORIDA_REVIEWED_SOURCE_RECORDS.some(r => r.chargeId === s.chargeId))).toBe(false);
    });
    for (const fixture of [false, true])
        for (const oldFresh of [false, true])
            for (const personsFresh of [false, true]) {
                it(`requires each own receipt: fixture=${fixture},old=${oldFresh},persons=${personsFresh}`, async () => {
                    state.oldFresh = oldFresh;
                    state.personsFresh = personsFresh;
                    state.ids = [old, person, legacy];
                    const lower = await databaseIds('FL');
                    expect(lower.has(old)).toBe(oldFresh);
                    expect(lower.has(person)).toBe(personsFresh);
                    expect(lower.has(legacy)).toBe(true);
                    vi.stubEnv('RELEASE_CHECK', fixture ? 'true' : 'false');
                    if (fixture)
                        vi.stubEnv('RELEASE_CHECK_AUTHORITY_SELECTABLE_CHARGE_IDS', JSON.stringify([...CALIFORNIA_CANONICAL_RECORDS.filter(r => r.selectable).map(r => r.canonicalId), old, person, legacy]));
                    const upper = await eligibleIds();
                    expect(upper.has(old)).toBe(oldFresh);
                    expect(upper.has(person)).toBe(personsFresh);
                    expect(upper.has(legacy)).toBe(true);
                });
            }
    it('requires database eligibility even when both receipts are fresh', async () => {
        state.oldFresh = true;
        state.personsFresh = true;
        state.ids = [];
        vi.stubEnv('RELEASE_CHECK', 'false');
        const ids = await eligibleIds();
        expect(ids.has(old)).toBe(false);
        expect(ids.has(person)).toBe(false);
    });
    it('refuses expired persons provenance through the direct service', async () => {
        state.oldFresh = true;
        state.personsFresh = false;
        state.ids = [person];
        expect(await getAuthorityChargeProvenance('FL', person)).toBeNull();
    });
});
