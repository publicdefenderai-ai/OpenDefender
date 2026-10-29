import { afterEach, describe, expect, it, vi } from 'vitest';
import { searchPublicDefenderOffices } from '../client/src/lib/public-defender-services';
import { searchLegalAidOrganizations } from '../client/src/lib/legal-aid-services';

afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });
for (const [name, search, empty] of [
  ['public defender', searchPublicDefenderOffices, { success: true, results: [] }],
  ['legal aid', searchLegalAidOrganizations, { success: true, organizations: [] }],
] as const) {
  describe(`${name} search error compatibility`, () => {
    it('preserves the legacy empty result on failure but allows callers to distinguish errors', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
      await expect(search('90210')).resolves.toEqual([]);
      await expect(search('90210', { propagateErrors: true })).rejects.toThrow();
    });
    it('keeps a successful empty response distinct from unavailable service', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => empty }));
      await expect(search('90210', { propagateErrors: true })).resolves.toEqual([]);
    });
  });
}
