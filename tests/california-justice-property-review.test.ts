import {describe,expect,it,vi} from 'vitest';
import fs from 'node:fs';
import {renderJusticePropertyReview,buildJusticePropertyReview,validateJusticePropertyPacket,readJusticePropertyAcquisition,readJusticePropertyBenchmark,validateJusticePropertyReview,readJusticePropertyReview,justiceInstructionSourceKeys,justiceContentsInventory} from '../scripts/data-review/california-verification/justice-property-review';
describe('California combined justice/public-order/property research',()=>{
  it('accounts for eight entire families and separates catalog overlap from legal approval',()=>{
    const r=readJusticePropertyReview();
    expect(validateJusticePropertyReview(r)).toEqual({families:8,instructions:202,pages:574,contentsPages:13,candidateSections:912,reusedSections:232,newSections:680,newVersions:682,missingSections:0,catalogOverlapNeedsBranchReview:67,noCatalogPrimaryMatch:102,contextInstructions:33});
    expect(r.crosswalk.filter(i=>i.status==='context_defense_or_grading').map(i=>i.id)).toEqual(expect.arrayContaining(['1551','1751','2670','2764','2952']));
    expect(r.crosswalk.map(i=>i.id)).toEqual(expect.arrayContaining(['3001','3002','3010','2045']));
    expect(r.crosswalk.map(i=>i.id)).not.toContain('1809');
    expect(r.groups.flatMap(g=>g.instructionIds).sort()).toEqual(r.crosswalk.map(i=>i.id).sort());
    expect(new Set(r.groups.flatMap(g=>g.instructionIds)).size).toBe(202);
    expect(r.groups.every(g=>g.status==='engineering_research_not_attorney_assignment')).toBe(true);
    expect(r.limits.join(' ')).toContain('Unknown severity stays open');
  });
  it('keeps historical accounting stable after receipt expiry and does not mutate publication data',()=>{
    const paths=['shared/california-retained-pins.json','scripts/data-review/output/california-archive-refresh-receipt.json','scripts/data-review/output/california-expanded-catalog-coverage.json'];
    const before=paths.map(p=>fs.readFileSync(p,'utf8'));
    try {vi.useFakeTimers();vi.setSystemTime(new Date('2040-01-01'));expect(buildJusticePropertyReview()).toEqual(readJusticePropertyReview());}
    finally{vi.useRealTimers();}
    expect(paths.map(p=>fs.readFileSync(p,'utf8'))).toEqual(before);
  });
  it('preserves non-Penal codes and strips subdivision ranges before identifying sections',()=>{
    expect(justiceInstructionSourceKeys('2765. Funds (Pen. Code § 424(a)(1–7))')).toEqual(['PEN:424']);
    expect(justiceInstructionSourceKeys('2800. Tax (Rev. & Tax. Code, § 19701(a))')).toEqual(['RTC:19701']);
    expect(justiceInstructionSourceKeys('1752. Chop Shop (Veh. Code, § 10801)')).toEqual(['VEH:10801']);
    expect(justiceInstructionSourceKeys('2960. Alcohol (Bus. & Prof. Code, § 25662(a))')).toEqual(['BPC:25662']);
    expect(()=>justiceInstructionSourceKeys('9999. Unknown (New Code, § 123)')).toThrow('Unsupported');
    expect(justiceContentsInventory('1808. Real entry\n1809. \nReserved for Future Use\n1810. Another entry')).toEqual(['1808','1810']);
  });
  it('rejects missing or duplicate sources, changed providers and corrupted retained text',()=>{
    const lost=readJusticePropertyAcquisition();lost.candidateKeys.pop();expect(()=>validateJusticePropertyPacket(lost)).toThrow('accounting');
    const duplicate=readJusticePropertyAcquisition();duplicate.reusedKeys.push(duplicate.reusedKeys[0]);expect(()=>validateJusticePropertyPacket(duplicate)).toThrow('accounting');
    const provider=readJusticePropertyAcquisition();Object.keys(provider.retainedArtifactHashes).forEach(k=>(provider.retainedArtifactHashes as Record<string,string>)[k]='bad');expect(()=>validateJusticePropertyPacket(provider)).toThrow('provider');
    const source=readJusticePropertyAcquisition();Object.values(source.documents)[0][0].contentXml+='changed';expect(()=>validateJusticePropertyPacket(source)).toThrow('source');
    const identity=readJusticePropertyAcquisition();Object.values(identity.documents)[0][0].lawCode='OTHER';expect(()=>validateJusticePropertyPacket(identity)).toThrow('source');
  });
  it('rejects lost end-of-family instructions, altered headings, receipts, pages and intervals',()=>{
    const b=readJusticePropertyBenchmark();b.instructions=b.instructions.filter(i=>i.id!=='3010');expect(()=>validateJusticePropertyPacket(undefined,b)).toThrow('inventory');
    const text=readJusticePropertyBenchmark();text.pages[0].text+='changed';expect(()=>validateJusticePropertyPacket(undefined,text)).toThrow('page');
    const toc=readJusticePropertyBenchmark();toc.contentsPages.pop();expect(()=>validateJusticePropertyPacket(undefined,toc)).toThrow('inventory');
    const interval=readJusticePropertyBenchmark();interval.instructions[0].lastPage++;expect(()=>validateJusticePropertyPacket(undefined,interval)).toThrow('interval');
    const heading=readJusticePropertyBenchmark();heading.instructions[0].heading='1500. Wrong';expect(()=>validateJusticePropertyPacket(undefined,heading)).toThrow('heading');
    const receipt=readJusticePropertyBenchmark();receipt.receipt.sha256='0'.repeat(64);expect(()=>validateJusticePropertyPacket(undefined,receipt)).toThrow('receipt');
  });
  it('rejects silently promoted matches, missing successor groups or removed limits',()=>{
    const promoted=readJusticePropertyReview();promoted.crosswalk[0].status='approved';expect(()=>validateJusticePropertyReview(promoted)).toThrow('accounting');
    const group=readJusticePropertyReview();group.groups.pop();expect(()=>validateJusticePropertyReview(group)).toThrow('accounting');
    const limits=readJusticePropertyReview();limits.limits=[];expect(()=>validateJusticePropertyReview(limits)).toThrow('accounting');
  });
  it('normalizes display punctuation while preserving source headings',()=>{
    const review=readJusticePropertyReview();
    const original=JSON.stringify(review.crosswalk);
    const rendered=renderJusticePropertyReview(review);
    expect(rendered).not.toMatch(/[—–]/);
    expect(JSON.stringify(review.crosswalk)).toBe(original);
  });

});
