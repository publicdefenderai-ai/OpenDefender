/** Frozen research inventory. A shared citation never approves a charge or its penalty. */
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import plan from './justice-property-plan.json';
import acquisition from '../output/california-justice-property-acquisition.json';
import benchmark from '../output/california-justice-property-benchmark-source.json';
import snapshot from '../output/california-justice-property-catalog-snapshot.json';
import priorBenchmark from '../output/california-controlled-substances-benchmark-source.json';
import batches from '../output/california-statewide/review-batches.json';
import {sourceText} from './person-property-review';
const ROOT='scripts/data-review/';
const hash=(s:string)=>createHash('sha256').update(s).digest('hex');
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
const sorted=(v:string[])=>[...new Set(v)].sort();
const normalize=(s:string)=>s.replace(/\s+/g,' ').trim();
type Version={lawCode:string;section:string;versionId:string;contentXml:string;contentSha256:string;sourceUrl?:string;effectiveDate?:string|null;activeFlag?:string;[key:string]:unknown};
const sourceIdentity=(v:Version)=>Object.fromEntries(Object.entries(v).filter(([k])=>!['contentMember','tableRow','tableRowSha256','transUid','sourceUrl','contentXml','transUpdate'].includes(k)).sort(([a],[b])=>a.localeCompare(b)));
const semanticVersions=(vs:Version[])=>vs.map(v=>JSON.stringify(sourceIdentity(v))).sort();
export const readJusticePropertyAcquisition=()=>structuredClone(acquisition);
export const readJusticePropertyBenchmark=()=>structuredClone(benchmark);
export function justiceInstructionSourceKeys(heading:string):string[] {
  const match=heading.match(/\((Pen\. Code|Veh\. Code|Rev\. & Tax\. Code|Bus\. & Prof\. Code),?\s*§{1,2}\s*(.*)\)$/);
  if(!match){if(heading.includes('Code'))throw new Error('Unsupported instruction code reference');return [];}
  const codes:Record<string,string>={'Pen. Code':'PEN','Veh. Code':'VEH','Rev. & Tax. Code':'RTC','Bus. & Prof. Code':'BPC'};
  const reference=match[2].replace(/\([^)]*\)/g,'');
  return sorted([...reference.matchAll(/\d+(?:\.\d+)*[a-z]*/g)].map(m=>codes[match[1]]+':'+m[0]));
}
export function justiceContentsInventory(text:string){
  return [...text.matchAll(/^(\d{3,4}[A-Z]?)\.\s+([^\n]+)/gm)].filter(m=>m[2].trim()!=='Reserved for Future Use').map(m=>m[1]);
}
export function validateJusticePropertyPacket(a=readJusticePropertyAcquisition(),b=readJusticePropertyBenchmark()) {
  const planHash=hash(fs.readFileSync(ROOT+'california-verification/justice-property-plan.json','utf8'));
  if(a.scope!=='justice_property_research_not_publication'||a.archive.sha256!=='dd0f40a7256bcf31e8dff50efa4833e296a700a7f772e36c23dc276039ef22a4'||a.planSha256!==planHash||b.planSha256!==planHash)throw new Error('Plan or archive binding changed');
  if(hash(fs.readFileSync(ROOT+'output/california-statewide/review-batches.json','utf8'))!==a.batchManifestSha256)throw new Error('Discovery manifest changed');
  if(hash(fs.readFileSync(ROOT+'output/california-justice-property-catalog-snapshot.json','utf8'))!==plan.catalogSnapshotSha256||snapshot.scope!=='configured_catalog_snapshot_after_pr37_not_live_availability'||!snapshot.gitCommit.match(/^[a-f0-9]{40}$/))throw new Error('Frozen catalog changed');
  if(snapshot.records.length!==497||new Set(snapshot.records.map(r=>r.id)).size!==497||snapshot.records.filter(r=>r.selectable).length!==476)throw new Error('Frozen catalog accounting changed');
  const candidates=sorted([...plan.extraKeys,...plan.instructions.flatMap(i=>i.sourceKeys),...plan.discoveryGroupIds.flatMap(id=>{
    const group=batches.find(r=>r.id===id);if(!group)throw new Error('Discovery group absent');return group.sectionKeys;
  })]);
  if(!same(candidates,a.candidateKeys)||!same([...a.reusedKeys,...Object.keys(a.documents),...a.missingKeys].sort(),candidates))throw new Error('Candidate accounting changed');
  const docs:Record<string,Version[]>={};
  if(!same(Object.keys(a.retainedArtifactHashes),plan.retainedArtifacts))throw new Error('Reuse providers changed');
  for(const name of plan.retainedArtifacts){
    const text=fs.readFileSync(ROOT+'output/'+name,'utf8');
    if(hash(text)!==(a.retainedArtifactHashes as Record<string,string>)[name])throw new Error('Retained provider changed');
    const provider=JSON.parse(text);
    if((provider.archiveSha256??provider.archive?.sha256)!==a.archive.sha256)throw new Error('Reuse archive changed');
    for(const [key,value] of Object.entries(provider.documents)){
      const versions=value as Version[];
      if(docs[key]&&!same(semanticVersions(docs[key]),semanticVersions(versions)))throw new Error('Conflicting retained provider');
      docs[key]=versions;
    }
  }
  if(!same(sorted(candidates.filter(k=>docs[k])),a.reusedKeys))throw new Error('Reuse accounting changed');
  for(const [key,versions] of Object.entries(a.documents)){
    if(docs[key])throw new Error('Research source shadows retained evidence');docs[key]=versions as Version[];
  }
  for(const key of candidates){
    if(a.missingKeys.includes(key)){
      if(docs[key])throw new Error('Missing source overlaps retained text');
      continue; // Absence remains an explicit research gap, never a repeal finding.
    }
    if(!docs[key]?.length)throw new Error('Missing research source');
    for(const v of docs[key]){
      const url=new URL(v.sourceUrl!);
      if(`${v.lawCode}:${v.section.replace(/\.$/,'')}`!==key||hash(v.contentXml)!==v.contentSha256||url.origin!=='https://leginfo.legislature.ca.gov'||`${url.searchParams.get('lawCode')}:${url.searchParams.get('sectionNum')?.replace(/\.$/,'')}`!==key)throw new Error('Unbound research source');
    }
  }
  if(!same(b.receipt,priorBenchmark.receipt)||b.scope!=='justice_property_benchmark_not_legal_certification')throw new Error('Benchmark receipt changed');
  const pages=plan.families.flatMap(f=>Array.from({length:f.lastPage-f.firstPage+1},(_,i)=>f.firstPage+i));
  const contents=plan.families.flatMap(f=>Array.from({length:f.tocLastPage-f.tocFirstPage+1},(_,i)=>f.tocFirstPage+i));
  if(!same(b.pages.map(p=>p.page),pages)||!same(b.contentsPages.map(p=>p.page),contents))throw new Error('Benchmark page inventory changed');
  for(const p of [...b.pages,...b.contentsPages])if(hash(p.text)!==p.sha256)throw new Error('Unbound benchmark page');
  if(!same(b.instructions.map(i=>i.id),plan.instructions.map(i=>i.id))||new Set(b.instructions.map(i=>i.id)).size!==202)throw new Error('Instruction inventory changed');
  for(const f of plan.families){
    const rows=b.instructions.filter(i=>i.family===f.id);
    const toc=b.contentsPages.filter(p=>p.page>=f.tocFirstPage&&p.page<=f.tocLastPage).map(p=>p.text).join('\n');
    if(!same(justiceContentsInventory(toc),f.instructionIds)||!same(rows.map(i=>i.id),f.instructionIds))throw new Error('Printed contents inventory changed');
    for(const [index,row] of rows.entries()){
      const expected=plan.instructions.find(i=>i.id===row.id)!;
      const selected=b.pages.filter(p=>p.page>=row.firstPage&&p.page<=row.lastPage);
      if(row.firstPage!==expected.firstPage||row.lastPage!==(rows[index+1]?.firstPage??(f.lastPage+1))-1||!same(row.pageHashes,selected.map(p=>({page:p.page,sha256:p.sha256}))))throw new Error('Instruction interval changed');
      if(row.heading!==expected.heading||!normalize(selected[0].text).includes(row.heading))throw new Error('Instruction heading changed');
      if(!same(justiceInstructionSourceKeys(row.heading),expected.sourceKeys))throw new Error('Instruction source identity changed');
      if(expected.kind==='substantive_instruction_requires_branch_comparison'&&!expected.sourceKeys.length)throw new Error('Missing substantive source');
    }
  }
  return docs;
}
function groupFor(id:string,family:string){
  const n=Number(id);
  if((n>=2600&&n<=2673)||(n>=2700&&n<=2703)||['3001','3002'].includes(id))return 'justice_witnesses_orders';
  if(n>=2720&&n<=2764)return 'custody_escape';
  if(['arson','robbery_carjacking','burglary_receiving','theft_extortion'].includes(family))return 'property_arson_extortion';
  if(['fraud','tax'].includes(family)||['2765','2997'].includes(id))return 'fraud_financial_tax';
  return 'public_order_miscellaneous';
}
const groupDescriptions:Record<string,string>={
  justice_witnesses_orders:'Witness interference, perjury, official conduct, court orders and failure to appear: separate conduct, valid-duty/order conditions and misdemeanor/felony alternatives.',
  custody_escape:'Prison/jail violence, contraband and escape: distinguish custody basis, facility type, force, sentence and necessity defenses.',
  property_arson_extortion:'Arson, robbery, burglary, theft and extortion: reuse prior exact branches before adding injury, value, prior and intent alternatives.',
  fraud_financial_tax:'Forgery, payment/identity/insurance fraud, public funds, laundering and tax: retain code identity, value thresholds, knowledge and intent.',
  public_order_miscellaneous:'Assembly, peace, trespass, damage, dangerous animals, minors, alcohol and gambling: preserve protected conduct and exceptions; defer only after severity is established.',
};
export function buildJusticePropertyReview(){
  const a=readJusticePropertyAcquisition(),b=readJusticePropertyBenchmark(),docs=validateJusticePropertyPacket(a,b);
  const related=(keys:string[])=>snapshot.records.filter(r=>r.selectable&&r.primaryKeys.some(k=>keys.includes(k))).map(r=>r.id);
  const crosswalk=plan.instructions.map(i=>{
    const source=b.instructions.find(r=>r.id===i.id)!;const ids=related(i.sourceKeys);
    return {...source,sourceKeys:i.sourceKeys,group:groupFor(i.id,i.family),relatedCatalogIds:ids,
      status:i.kind==='context_defense_or_grading'?i.kind:ids.length?'catalog_overlap_requires_branch_review':'no_catalog_primary_match',
      limitation:'Frozen configured-catalog association only; no legal approval, complete branch match, freshness or live selection is inferred.'};
  });
  const sections=a.candidateKeys.map(key=>({key,status:a.missingKeys.includes(key)?'absent_from_snapshot_requires_research':'retained_research_not_publication',relatedCatalogIds:related([key]),
    instructionIds:crosswalk.filter(i=>i.sourceKeys.includes(key)).map(i=>i.id),discoveryGroups:plan.discoveryGroupIds.filter(id=>batches.find(b=>b.id===id)!.sectionKeys.includes(key)),
    versions:(docs[key]??[]).map(v=>({versionId:v.versionId,contentSha256:v.contentSha256,effectiveDate:v.effectiveDate,activeFlag:v.activeFlag,sourceUrl:v.sourceUrl,context:sourceText(v.contentXml).slice(0,1400)}))}));
  const groups=Object.entries(groupDescriptions).map(([id,question])=>{
    const rows=crosswalk.filter(i=>i.group===id),keys=sorted(rows.flatMap(i=>i.sourceKeys));
    return {id,question,status:'engineering_research_not_attorney_assignment',instructionIds:rows.map(i=>i.id),primaryKeys:keys,
      noCatalogPrimaryMatch:rows.filter(i=>i.status==='no_catalog_primary_match').map(i=>i.id),catalogOverlapNeedsBranchReview:rows.filter(i=>i.status==='catalog_overlap_requires_branch_review').map(i=>i.id),contextInstructions:rows.filter(i=>i.status==='context_defense_or_grading').map(i=>i.id)};
  });
  return {schemaVersion:1,scope:'justice_property_research_not_publication',sourceAsOf:'2026-09-24',catalogCommit:snapshot.gitCommit,acquisitionSha256:hash(JSON.stringify(a)),benchmarkSha256:hash(JSON.stringify(b)),catalogSnapshotSha256:plan.catalogSnapshotSha256,
    counts:{families:plan.families.length,instructions:crosswalk.length,pages:b.pages.length,contentsPages:b.contentsPages.length,candidateSections:sections.length,reusedSections:a.reusedKeys.length,newSections:Object.keys(a.documents).length,newVersions:Object.values(a.documents).reduce((n,v)=>n+v.length,0),missingSections:a.missingKeys.length,
      catalogOverlapNeedsBranchReview:crosswalk.filter(i=>i.status==='catalog_overlap_requires_branch_review').length,noCatalogPrimaryMatch:crosswalk.filter(i=>i.status==='no_catalog_primary_match').length,contextInstructions:crosswalk.filter(i=>i.status==='context_defense_or_grading').length},
    limits:['No new charge selections, publication pins or freshness approvals are created by this research packet.',
      'Eight complete families in the retained official 2026 CALCRIM PDF. Homicide, gangs, other-code universes and subsequent supplements are not certified by this packet.',
      'Instruction counts are not offense counts. Existing-section associations still require conduct/subdivision comparison; unmatched instructions can overlap offenses.',
      'The catalog comparison is frozen after PR37 so later additions do not silently rewrite historical accounting. Successors must explicitly record new matches.',
      'Sources outside instruction headings are shared-group discovery leads. Their acquisition creates no requirement to publish every regulatory clause.',
      'Unknown severity stays open. No candidate is classified as minor merely because it lacks a catalog match or benchmark instruction.',
      'Existing attorney questions, source discrepancies and enforceability holds continue in their predecessor packets. This acquisition neither answers nor clears them.'],
    decisions:['Printed contents and extracted headings must agree, including 3001/3002 failure-to-appear and 3010 recording communications at the end of the miscellaneous family.',
      'A single reserved number such as 1809 is explicitly excluded only when its contents label is Reserved for Future Use; substantive entries cannot disappear under a numeric-range shortcut.',
      'Code identity is parsed from each heading. Subdivision ranges such as 424(a)(1–7) do not create a fictional PEN:7 dependency.',
      'Tax instructions are acquired with this group to avoid a separate source-gathering cycle. Context on deductions and proof is retained without becoming a charge.',
      'The five successor groups are engineering queues. Start with justice/witness/order and custody sources, then combine property and financial branches that reuse the most evidence.',
      'This report retains the edition receipt and exact page text. Instruction headings and older citations are research evidence, not a replacement for operative statutory text.'],crosswalk,groups,sections};
}
export const readJusticePropertyReview=()=>JSON.parse(fs.readFileSync(ROOT+'output/california-justice-property-review.json','utf8')) as ReturnType<typeof buildJusticePropertyReview>;
export function validateJusticePropertyReview(report=readJusticePropertyReview()){
  if(!same(report,buildJusticePropertyReview()))throw new Error('Research accounting or limits changed');
  const ids=report.groups.flatMap(g=>g.instructionIds);
  if(new Set(ids).size!==202||!same(ids.sort(),report.crosswalk.map(r=>r.id).sort()))throw new Error('Successor group accounting changed');
  return report.counts;
}
export function renderJusticePropertyReview(r=readJusticePropertyReview()){
  const plain=(s:string)=>s.replaceAll("—",": ").replaceAll("–","-");
  return plain(['# California justice, public order and property: combined research packet','',`${r.counts.instructions} instructions across ${r.counts.families} complete families. ${r.counts.catalogOverlapNeedsBranchReview} substantive entries have catalog associations, ${r.counts.noCatalogPrimaryMatch} have no catalog primary match, and ${r.counts.contextInstructions} are context or grading. These are research counts, not missing-offense counts.`,
    '',`${r.counts.candidateSections} candidate sections: ${r.counts.reusedSections} reused, ${r.counts.newSections} newly retained, ${r.counts.missingSections} absent. Catalog frozen at ${r.catalogCommit}.`,
    '',...r.limits.map(s=>`- ${s}`),'','## Decisions','',...r.decisions.map(s=>`- ${s}`),'','## Larger successor batches','',...r.groups.flatMap(g=>[`### ${g.id.replaceAll('_',' ')}`,'',g.question,'',`No catalog primary match: ${g.noCatalogPrimaryMatch.join(', ')||'none'}. Existing associations needing branch review: ${g.catalogOverlapNeedsBranchReview.join(', ')||'none'}. Context/grading: ${g.contextInstructions.join(', ')||'none'}.`,'']),'## Instruction crosswalk','',...r.crosswalk.flatMap(i=>[`### ${i.id}: ${plain(i.heading.replace(/^\d+[A-Z]?\.\s*/,''))}`,'',`PDF pages ${i.firstPage}-${i.lastPage}. Status: ${i.status.replaceAll('_',' ')}.`,`Sources: ${i.sourceKeys.map(k=>`[${k}](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=${k.split(':')[0]}&sectionNum=${k.split(':')[1]}.)`).join(', ')||'context only'}.`,`Existing associations: ${i.relatedCatalogIds.join(', ')||'none'}.`,''])].join('\n'));
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
  const r=buildJusticePropertyReview();validateJusticePropertyReview(r);
  fs.writeFileSync(ROOT+'output/california-justice-property-review.json',JSON.stringify(r,null,2)+'\n');
  fs.writeFileSync(ROOT+'output/california-justice-property-review.md',renderJusticePropertyReview(r));console.log(JSON.stringify(r.counts));
}
