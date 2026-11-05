import { describe, expect, it } from 'vitest';
import { search, addChargesToSearchIndex } from '../server/services/search-indexer';
import { criminalCharges } from '../shared/criminal-charges';

describe('authority-filtered charge search pagination', () => {
  it('returns later pages without omissions, duplicates or withheld records', () => {
    const rows = Array.from({length: 605}, (_, i) => ({...criminalCharges[0],
      id: `pagination-fixture-${i}`, name: `Paginationfixture ${i}`, jurisdiction: 'ZZ'}));
    addChargesToSearchIndex(rows);
    const allowed = rows.slice(0, 603).map(row => `charge-${row.id}`);
    const query = {query:'Paginationfixture', language:'en' as const,
      filters:{types:['charge' as const], chargeIds:allowed}, limit:500};
    const {limit, ...defaultPage} = query;
    expect(search(defaultPage).results).toHaveLength(50);
    expect(search({...query, limit:NaN}).results).toHaveLength(50);
    const first = search({...query, offset:0});
    const second = search({...query, offset:500});
    expect(first.results).toHaveLength(500);
    expect(second.results).toHaveLength(103);
    expect(first.totalCount).toBe(603);
    expect(second.totalCount).toBe(603);
    const ids = [...first.results,...second.results].map(r=>r.document.id);
    expect(new Set(ids).size).toBe(603);
    expect(new Set(ids)).toEqual(new Set(allowed));
    expect(search({...query,offset:1000}).results).toEqual([]);
    expect(second.groupedResults.charge).toEqual(second.results);
  });
});
