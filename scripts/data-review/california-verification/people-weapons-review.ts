/** Research crosswalk only. Neither a benchmark match nor retained text approves new publication. */
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import plan from './people-weapons-plan.json';
import acquisition from '../output/california-people-weapons-acquisition.json';
import benchmark from '../output/california-people-weapons-benchmark-source.json';
import priorBenchmark from '../output/california-controlled-substances-benchmark-source.json';
import batches from '../output/california-statewide/review-batches.json';
import {CALIFORNIA_CANONICAL_RECORDS} from '../../../shared/california-authority';
import {sourceText} from './person-property-review';
const ROOT='scripts/data-review/';
const hash=(text:string)=>createHash('sha256').update(text).digest('hex');
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
const sorted=(values:string[])=>[...new Set(values)].sort();
const normalize=(text:string)=>text.replace(/\s+/g,' ').trim();
type Version=typeof acquisition.documents[keyof typeof acquisition.documents][number];
export const readPeopleWeaponsAcquisition=()=>structuredClone(acquisition);
export const readPeopleWeaponsBenchmark=()=>structuredClone(benchmark);
export function validatePeopleWeaponsPacket(a=readPeopleWeaponsAcquisition(),b=readPeopleWeaponsBenchmark()) {
  const planHash=hash(fs.readFileSync(ROOT+'california-verification/people-weapons-plan.json','utf8'));
  if(a.scope!=='people_weapons_research_not_publication'||a.archive.sha256!=='dd0f40a7256bcf31e8dff50efa4833e296a700a7f772e36c23dc276039ef22a4'||a.planSha256!==planHash||b.planSha256!==planHash)throw new Error('People/weapons plan or archive binding changed');
  if(hash(fs.readFileSync(ROOT+'output/california-statewide/review-batches.json','utf8'))!==a.batchManifestSha256)throw new Error('Discovery manifest changed');
  const candidates=sorted([...plan.extraKeys,...plan.instructions.flatMap(i=>i.sourceKeys),...plan.discoveryGroupIds.flatMap(id=>{
    const batch=batches.find(row=>row.id===id);if(!batch)throw new Error('Discovery group absent');return batch.sectionKeys;
  })]);
  if(!same(candidates,a.candidateKeys)||!same([...a.reusedKeys,...Object.keys(a.documents),...a.missingKeys].sort(),candidates))throw new Error('Candidate accounting changed');
  if(candidates.length!==373||a.missingKeys.length)throw new Error('Candidate inventory requires explicit review');
  const docs:Record<string,Version[]>={};
  if(!same(Object.keys(a.retainedArtifactHashes),plan.retainedArtifacts))throw new Error('Reuse providers changed');
  for(const name of plan.retainedArtifacts) {
    const text=fs.readFileSync(ROOT+'output/'+name,'utf8');
    if(hash(text)!==(a.retainedArtifactHashes as Record<string,string>)[name])throw new Error('Retained provider changed');
    const provider=JSON.parse(text);
    if((provider.archiveSha256??provider.archive?.sha256)!==a.archive.sha256)throw new Error('Reuse archive changed');
    Object.assign(docs,provider.documents);
  }
  if(!same(sorted(candidates.filter(k=>docs[k])),a.reusedKeys))throw new Error('Reuse accounting changed');
  for(const [key,versions] of Object.entries(a.documents)) {
    if(docs[key])throw new Error('Research source shadows retained evidence');docs[key]=versions;
  }
  for(const key of candidates) {
    if(!docs[key]?.length)throw new Error('Missing research source');
    for(const v of docs[key]) {
      const url=new URL(v.sourceUrl!);
      if(`${v.lawCode}:${v.section.replace(/\.$/,'')}`!==key||hash(v.contentXml)!==v.contentSha256||url.origin!=='https://leginfo.legislature.ca.gov'||`${url.searchParams.get('lawCode')}:${url.searchParams.get('sectionNum')?.replace(/\.$/,'')}`!==key)throw new Error('Unbound research source');
    }
  }
  if(!same(b.receipt,priorBenchmark.receipt)||b.scope!=='people_weapons_benchmark_not_legal_certification')throw new Error('Benchmark receipt changed');
  const expectedPages=plan.families.flatMap(f=>Array.from({length:f.lastPage-f.firstPage+1},(_,i)=>f.firstPage+i));
  const expectedContents=plan.families.flatMap(f=>Array.from({length:f.tocLastPage-f.tocFirstPage+1},(_,i)=>f.tocFirstPage+i));
  if(!same(b.pages.map(p=>p.page),expectedPages)||!same(b.contentsPages.map(p=>p.page),expectedContents))throw new Error('Benchmark page inventory changed');
  for(const p of [...b.pages,...b.contentsPages])if(hash(p.text)!==p.sha256)throw new Error('Unbound benchmark page');
  if(!same(b.instructions.map(i=>i.id),plan.instructions.map(i=>i.id))||new Set(b.instructions.map(i=>i.id)).size!==207)throw new Error('Instruction inventory changed');
  for(const f of plan.families) {
    const rows=b.instructions.filter(i=>i.family===f.id);
    const toc=b.contentsPages.filter(p=>p.page>=f.tocFirstPage&&p.page<=f.tocLastPage).map(p=>p.text).join('\n');
    if(!same([...toc.matchAll(/^(\d{3,4}[A-Z]?)\.\s/gm)].map(m=>m[1]),f.instructionIds)||!same(rows.map(i=>i.id),f.instructionIds))throw new Error('Printed contents inventory changed');
    for(const [index,row] of rows.entries()) {
      const expected=plan.instructions.find(i=>i.id===row.id)!;
      const pages=b.pages.filter(p=>p.page>=row.firstPage&&p.page<=row.lastPage);
      if(row.firstPage!==expected.firstPage||row.lastPage!==(rows[index+1]?.firstPage??(f.lastPage+1))-1||!same(row.pageHashes,pages.map(p=>({page:p.page,sha256:p.sha256}))))throw new Error('Instruction interval changed');
      if(row.heading!==expected.heading||!normalize(pages[0].text).includes(row.heading))throw new Error('Instruction heading changed');
      const reference=row.heading.includes('Pen. Code,')?row.heading.split('Pen. Code,')[1]:'';
      const keys=sorted([...reference.matchAll(/(?<![\w(])\d+[a-z]*(?:\.\d+)?/g)].map(m=>'PEN:'+m[0]));
      if(!same(keys,expected.sourceKeys))throw new Error('Instruction source identity changed');
      if(expected.kind==='substantive_instruction_requires_branch_comparison'&&!keys.length)throw new Error('Missing substantive source reference');
      if(expected.kind!=='substantive_instruction_requires_branch_comparison'&&expected.boundedChargeIds.length)throw new Error('Context cannot approve a match');
      for(const id of expected.boundedChargeIds) {
        const record=CALIFORNIA_CANONICAL_RECORDS.find(r=>r.canonicalId===id);
        if(!record?.selectable||!keys.includes(`${record.lawCode}:${record.code.split(/[;(]/)[0]}`))throw new Error('Bounded catalog match changed');
      }
    }
  }
  for(const group of plan.publicationGroups)for(const key of group.keys)if(!docs[key])throw new Error('Priority source absent');
  return docs;
}
export function buildPeopleWeaponsReview() {
  const a=readPeopleWeaponsAcquisition(),b=readPeopleWeaponsBenchmark(),docs=validatePeopleWeaponsPacket(a,b);
  const records=CALIFORNIA_CANONICAL_RECORDS.filter(r=>r.selectable);
  const sameSection=(keys:string[])=>records.filter(r=>keys.includes(`${r.lawCode}:${r.code.split(/[;(]/)[0]}`)).map(r=>r.canonicalId);
  const crosswalk=plan.instructions.map(i=>{
    const source=b.instructions.find(r=>r.id===i.id)!;
    const related=sameSection(i.sourceKeys);
    const status=i.kind==='context_defense_or_allegation'?i.kind:i.kind==='generic_weapon_template'?'weapon_specific_identity_research':i.boundedChargeIds.length?'bounded_prior_catalog_match_not_complete':related.length?'same_section_candidates_require_branch_review':'no_same_section_catalog_candidate';
    return {...source,sourceKeys:i.sourceKeys,status,boundedChargeIds:i.boundedChargeIds,relatedCatalogIds:related,
      limitation:'Same-section associations are navigation only; bounded matches do not cover all instruction alternatives, certify freshness, or approve publication.'};
  });
  const sections=a.candidateKeys.map(key=>({key,status:'retained_research_not_publication',relatedCatalogIds:sameSection([key]),
    groups:plan.publicationGroups.filter(g=>g.keys.includes(key)).map(g=>g.name),
    versions:docs[key].map(v=>({versionId:v.versionId,contentSha256:v.contentSha256,effectiveDate:v.effectiveDate,activeFlag:v.activeFlag,sourceUrl:v.sourceUrl,context:sourceText(v.contentXml).slice(0,1400)}))}));
  const counts={candidateSections:sections.length,reusedSections:a.reusedKeys.length,newSections:Object.keys(a.documents).length,newVersions:Object.values(a.documents).reduce((n,v)=>n+v.length,0),instructions:crosswalk.length,pages:b.pages.length,
    boundedPriorMatches:crosswalk.filter(r=>r.boundedChargeIds.length).length,contextInstructions:crosswalk.filter(r=>r.status==='context_defense_or_allegation').length,genericTemplates:crosswalk.filter(r=>r.status==='weapon_specific_identity_research').length,
    sameSectionNeedsReview:crosswalk.filter(r=>r.status==='same_section_candidates_require_branch_review').length,noSameSectionCandidate:crosswalk.filter(r=>r.status==='no_same_section_catalog_candidate').length};
  return {schemaVersion:1,scope:'people_weapons_research_not_publication',sourceAsOf:'2026-09-24',acquisitionSha256:hash(JSON.stringify(a)),benchmarkSha256:hash(JSON.stringify(b)),counts,
    limits:['No catalog additions, publication pins or freshness receipts change in this packet.',
      'Five complete February 2026 instruction families; homicide, gangs and later supplements remain outside this benchmark. Instructions do not establish current law or statewide completeness.',
      'No-same-section counts include overlapping instruction variants. They are priority research leads, not a count of distinct missing crimes.',
      'Shared base citations such as PEN 240, 242 and 647 can associate unrelated choices; only explicit bounded matches receive credit.',
      'All unresolved candidates retain unknown or consequential severity until reviewed; none is silently deferred as minor.',
      'PEN 30515 remains a changed-source hold. An old instruction or original archive cannot clear it. Weapon enforceability requires separate current-source review.',
      'Four shared-source work groups guide publication. Routine evidence and entry stay engineering work; refer only specific unresolved legal interpretations to the attorney.'],
    groups:plan.publicationGroups,crosswalk,sections};
}
export function renderPeopleWeaponsReview(review=buildPeopleWeaponsReview()) {
  const c=review.counts;
  const plain=(s:string)=>s.replaceAll('—',': ').replaceAll('–','-');
  return ['# California people and weapons: combined gap review','',`${c.instructions} instructions across five families on ${c.pages} pages; ${c.candidateSections} statutory sections (${c.reusedSections} reused, ${c.newSections} newly retained).`,
    '',`${c.boundedPriorMatches} bounded prior matches; ${c.contextInstructions} context/defense/allegation instructions; ${c.genericTemplates} generic weapon template; ${c.sameSectionNeedsReview} instructions with same-section candidates needing branch review; ${c.noSameSectionCandidate} with no same-section catalog candidate. These are not distinct offense counts or a statewide coverage percentage.`,
    '',...review.limits.map(s=>`- ${s}`),'','## Combined publication order','',...review.groups.flatMap(g=>[`### ${g.name}`,'',g.question,'',`Read together: ${g.keys.join(', ')}.`,'']),
    '## Independent crosswalk','',...review.crosswalk.flatMap(r=>[`### CALCRIM ${r.id}: ${plain(r.heading.replace(/^\d+[A-Z]?\.\s/,''))}`,'',`Status: ${r.status.replaceAll('_',' ')}. Physical PDF pages ${r.firstPage}-${r.lastPage}.`,
      `Bounded prior matches: ${r.boundedChargeIds.join(', ')||'None credited'}.`, `Same-section navigation only: ${r.relatedCatalogIds.join(', ')||'None'}.`,`Read: ${r.sourceKeys.join(', ')||'Context or weapon-specific template; see retained instruction'}.`,'']),
    '## Source inventory','',...review.sections.map(s=>`- ${s.key}: ${s.groups.join('; ')||'remaining candidate or shared context; severity not yet adjudicated'}. ${s.versions.length} retained version(s).`),''].join('\n');
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
  const review=buildPeopleWeaponsReview();
  fs.writeFileSync(ROOT+'output/california-people-weapons-review.json',JSON.stringify(review,null,2)+'\n');
  fs.writeFileSync(ROOT+'output/california-people-weapons-review.md',renderPeopleWeaponsReview(review));
  console.log(JSON.stringify(review.counts));
}
