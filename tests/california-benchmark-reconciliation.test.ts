import {describe,it,expect} from 'vitest';
import plan from '../scripts/data-review/california-verification/benchmark-reconciliation-plan.json';
import previous from '../scripts/data-review/output/california-repeat-theft-assembly-review.json';
import {buildBenchmarkReconciliation,readBenchmarkReconciliation,validateBenchmarkReconciliation,renderBenchmarkReconciliation} from '../scripts/data-review/california-verification/benchmark-reconciliation';

describe('California bounded benchmark reconciliation',()=>{
  it('accounts for every entry without turning context into missing charges',()=>{
    const r=readBenchmarkReconciliation();
    expect(validateBenchmarkReconciliation(r)).toEqual({instructions:202,previousBounded:97,newlyLinked:20,bounded:117,context:31,openComparisons:54,configuredChoices:604});
    expect(r.counts.bounded+r.counts.context+r.counts.openComparisons).toBe(202);
    expect(new Set(r.crosswalk.map(i=>i.id)).size).toBe(202);
    expect(r.remainingFindings).toEqual(previous.remainingFindings);
    for(const old of previous.crosswalk.filter(r=>r.boundedChargeIds.length))expect(r.crosswalk.find(r=>r.id===old.id)?.boundedChargeIds).toEqual(old.boundedChargeIds);
  });
  it('keeps wrong sibling and partial source associations open',()=>{
    const r=readBenchmarkReconciliation();
    for(const id of ['1803','1807','1950','1952','2001','2002','2042','2043','2915','2916']) {
      expect(r.crosswalk.find(i=>i.id===id)?.boundedChargeIds).toEqual([]);
      expect(r.groups.some(g=>g.instructionIds.includes(id))).toBe(true);
    }
    expect(r.crosswalk.find(i=>i.id==='1951')?.boundedChargeIds).toEqual(['ca-pen-484e-c']);
    expect(r.crosswalk.find(i=>i.id==='1926')?.reconciliationNote).toContain('willful concealment');
    expect(r.crosswalk.find(i=>i.id==='1810')?.reconciliationNote).toContain('does not resolve');
  });
  it('rejects evidence, definition, page and disposition drift',()=>{
    for(const mutate of [
      (r:ReturnType<typeof readBenchmarkReconciliation>)=>{r.links[0].charges[0].primaryEvidence.text+=' changed';},
      (r:ReturnType<typeof readBenchmarkReconciliation>)=>{r.links[0].charges[0].definitionSha256='bad';},
      (r:ReturnType<typeof readBenchmarkReconciliation>)=>{r.links[0].instructionEvidence.pageHashes[0].sha256='bad';},
      (r:ReturnType<typeof readBenchmarkReconciliation>)=>{r.crosswalk.find(i=>i.id==='1950')!.boundedChargeIds=['ca-pen-484e-c'];},
      (r:ReturnType<typeof readBenchmarkReconciliation>)=>{r.remainingFindings=[];},
    ]) {const r=readBenchmarkReconciliation();mutate(r);expect(()=>validateBenchmarkReconciliation(r)).toThrow('Reconciliation evidence or accounting changed');}
  });
  it('rejects duplicate mappings and non-substantive instructions',()=>{
    expect(()=>buildBenchmarkReconciliation([...plan,plan[0]])).toThrow('Duplicate instruction');
    expect(()=>buildBenchmarkReconciliation([{...plan[0],instructionId:'1801'}])).toThrow('unmatched substantive');
  });
  it('rejects unknown providers and charges from another statutory identity',()=>{
    expect(()=>buildBenchmarkReconciliation([{...plan[0],provider:'../private-file'}])).toThrow('Unknown review provider');
    expect(()=>buildBenchmarkReconciliation([{...plan[0],chargeIds:['ca-veh-10852']}])).toThrow('primary do not match');
    expect(()=>buildBenchmarkReconciliation([{...plan[0],chargeIds:['missing']}])).toThrow('Unreviewed or changed');
  });
  it('renders readable bounds and all entries without house-style dashes',()=>{
    const text=renderBenchmarkReconciliation(readBenchmarkReconciliation());
    expect(text).not.toMatch(/[\u2013\u2014]/);
    expect(text).toContain('No new charges, penalty changes or freshness renewal');
    expect(text.match(/^\| \d/gm)).toHaveLength(202);
  });
});
