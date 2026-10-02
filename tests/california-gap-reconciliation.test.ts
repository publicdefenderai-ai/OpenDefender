import {describe,expect,it} from 'vitest';
import previous from '../scripts/data-review/output/california-officials-custody-review.json';
import plan from '../scripts/data-review/california-verification/gap-reconciliation-plan.json';
import aliases from '../shared/california-reviewed-search-aliases.json';
import {buildGapReconciliation,readGapReconciliation,validateGapReconciliation,renderGapReconciliation} from '../scripts/data-review/california-verification/gap-reconciliation';
import {getChargesByJurisdiction,getChargeById} from '../shared/criminal-charges';
import {getCaliforniaCanonicalRecord} from '../shared/california-authority';

describe('California consolidated gap reconciliation',()=>{
  it('accounts for all 31 comparisons without upgrading partial summaries to complete branch coverage',()=>{
    expect(validateGapReconciliation()).toEqual({configuredChoices:644,benchmarkInstructions:202,previousBoundedMatches:140,contextEntries:31,reconciledComparisons:31,existingReviewedChoiceComparisons:23,broadChoiceComparisonsNeedingWork:3,unpublishedComparisons:3,deferredComparisons:2,distinctExistingChoices:21,newCharges:0});
    const report=readGapReconciliation();
    expect(report.priorCrosswalk).toEqual(previous.crosswalk);
    expect(report.remainingFindings).toEqual(previous.remainingFindings);
    expect(report.rows.filter(r=>r.status==='existing_broad_choice_needs_branch_work').map(r=>r.instructionId)).toEqual(['1800','1804','1805']);
    expect(report.rows.filter(r=>r.status==='unpublished_branch').map(r=>r.instructionId)).toEqual(['2915','2916','2953']);
    expect(report.rows.filter(r=>r.status==='deferred_expression_sensitive').map(r=>r.instructionId)).toEqual(['2680','2917']);
    expect(report.rows.find(r=>r.instructionId==='2981')?.rationale).toContain('recorded attorney decision');
    expect(renderGapReconciliation(report)).not.toMatch(/[—–]/);
  });
  it('rejects omitted, duplicated and unrelated mappings',()=>{
    expect(()=>buildGapReconciliation(plan.slice(1))).toThrow('exactly one');
    expect(()=>buildGapReconciliation([...plan,plan[0]])).toThrow('exactly one');
    const changed=structuredClone(plan);changed[0].chargeIds=['ca-check-fraud'];
    expect(()=>buildGapReconciliation(changed)).toThrow('Unrelated');
  });
  it('does not accept public-intoxication coverage for sibling loitering',()=>{
    const changed=structuredClone(plan),row=changed.find(r=>r.instructionId==='2915')!;
    row.status='existing_reviewed_choice_partial';row.chargeIds=['ca-public-intoxication'];
    expect(()=>buildGapReconciliation(changed)).toThrow('Sibling subdivision');
  });
  it('rejects source-span, instruction-binding, count and finding drift',()=>{
    const mutations=[
      (r:ReturnType<typeof readGapReconciliation>)=>{r.choices[0].primaryEvidence[0].text+=' altered';},
      (r:ReturnType<typeof readGapReconciliation>)=>{r.rows[0].instructionEvidence.firstPage++;},
      (r:ReturnType<typeof readGapReconciliation>)=>{r.counts.newCharges++;},
      (r:ReturnType<typeof readGapReconciliation>)=>{r.remainingFindings.pop();},
      (r:ReturnType<typeof readGapReconciliation>)=>{r.choices[0].sources.pop();},
    ];
    for(const mutate of mutations){const report=readGapReconciliation();mutate(report);expect(()=>validateGapReconciliation(report)).toThrow('changed');}
  });
  it('makes reviewed charging-paper subdivisions searchable without new identities or penalty changes',()=>{
    const charges=getChargesByJurisdiction('CA');
    for(const [id,queries] of Object.entries(aliases)){
      const charge=charges.find(c=>c.id===id)!;
      for(const query of queries){
        expect(charge.searchAliases).toContain(query);
        const hits=charges.filter(c=>[c.name,c.code,...(c.searchAliases??[])].some(s=>s.toLowerCase().includes(query.toLowerCase())));
        expect(hits.map(c=>c.id)).toContain(id);
      }
      expect(getChargeById(id)?.searchAliases).toEqual(charge.searchAliases);
      expect(charge.maxPenalty).toBe(getCaliforniaCanonicalRecord(id)!.penalty);
    }
    expect(charges.find(c=>c.id==='ca-credit-card-fraud')?.searchAliases).not.toContain('PC 484e(b)');
    expect(charges.find(c=>c.id==='ca-check-fraud')?.searchAliases).not.toContain('PC 476');
  });
});
