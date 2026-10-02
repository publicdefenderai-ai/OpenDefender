import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import supplements from '../../../shared/california-conduct-supplements.json';
import corrections from '../../../shared/california-batch-one-corrections.json';
import previous from '../output/california-trespass-review.json';
import research from '../output/california-justice-property-acquisition.json';
import {validateTrespassReview} from './trespass-review';
import {readJusticePropertyBenchmark,validateJusticePropertyPacket} from './justice-property-review';
import {sourceText} from './person-property-review';
import {getCaliforniaCanonicalRecord,getCaliforniaBatchCorrection} from '../../../shared/california-authority';
const hash=(v:unknown)=>createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
export function buildTheftConductReview() {
  validateTrespassReview();
  const docs=validateJusticePropertyPacket(),benchmark=readJusticePropertyBenchmark();
  const supplement=supplements[0],base=corrections.find(c=>c.id===supplement.id)!;
  const evidence=(key:string)=>docs[key].map(v=>{const text=sourceText(v.contentXml);return {key,versionId:v.versionId,contentSha256:v.contentSha256,sourceUrl:v.sourceUrl,start:0,end:text.length,text};});
  return {schemaVersion:1,scope:'existing_choice_conduct_supplement_not_new_charge',sourceAsOf:'2026-09-24',archiveSha256:research.archive.sha256,previousReviewSha256:hash(previous),researchSha256:hash(research),benchmarkSha256:hash(benchmark),
    documents:{'PEN:532':docs['PEN:532']},
    records:[{id:supplement.id,supplementSha256:hash(supplement),originalCorrectionSha256:hash(base),sources:['PEN:484','PEN:532'].flatMap(evidence),
      instructions:supplement.instructions.map(id=>{const i=benchmark.instructions.find(i=>i.id===id);if(!i)throw new Error('Missing instruction');return {...i,pages:benchmark.pages.filter(p=>p.page>=i.firstPage&&p.page<=i.lastPage).map(p=>({page:p.page,sha256:hash(p.text),text:p.text}))};})}],
    accounting:{newChoices:0,updatedChoices:1,configuredChoicesSnapshot:657,newlyMonitoredSections:1,newlyMonitoredVersions:1},
    dispositions:['1800','1804','1805'].map(instructionId=>({instructionId,chargeId:supplement.id,status:'bounded_conduct_summary_published_other_issues_open'})),
    limits:['One existing charge gains three alternative conduct explanations; no new charge ID, penalty change or case reassignment.',
      'The original correction and historical reconciliation remain unchanged. This supplement binds its own added text, instructions and dependency.',
      'This is an introductory conduct summary, not exhaustive elements, defenses, evidentiary exceptions or jury-instruction certification.',
      'Section 532 is promoted from retained research to monitored publication evidence. Receipt acquisition and expiry must not be advanced by offline replay.',
      'Spanish and Chinese requests show English for this updated summary with the existing explicit untranslated-content notice. No invented translation.',
      'Vehicle-taking and other previous unresolved findings remain open; this packet does not increase the earlier 141 bounded publication matches to imply full instruction coverage.'],
    decisions:['Keep the existing petty-theft identity and grading/penalty text. Do not create three duplicate generic theft choices.',
      'Replace the overbroad permanent-deprivation-only element list with theory-specific alternatives, including the major-value-or-enjoyment alternative for larceny and trick.',
      'False pretense involves intended transfer of ownership as well as possession; trick does not. Reliance and section 532(b) proof requirements must not disappear in simplification.',
      'Runtime descriptions, explanations and canonical elements share the reviewed supplement. Other jurisdictions and unrelated California theft entries remain unchanged.'],
  };
}
export type TheftConductReview=ReturnType<typeof buildTheftConductReview>;
export const readTheftConductReview=()=>JSON.parse(fs.readFileSync(new URL('../output/california-theft-conduct-review.json',import.meta.url),'utf8')) as TheftConductReview;
export function validateTheftConductReview(review=readTheftConductReview()) {
  if(!same(review,buildTheftConductReview()))throw new Error('Conduct supplement evidence or accounting drift');
  if(review.documents['PEN:532'].length!==1)throw new Error('Unresolved supporting version');
  const proof=review.documents['PEN:532'][0];
  if(proof.activeFlag!=='Y'||proof.lawCode!=='PEN'||proof.section.replace(/\.$/,'')!=='532'||hash(proof.contentXml)!==proof.contentSha256)throw new Error('Invalid operative proof source');
  for(const r of review.records){
    const supplement=supplements.find(s=>s.id===r.id)!,base=corrections.find(c=>c.id===r.id)!;
    const c=getCaliforniaCanonicalRecord(r.id),correction=getCaliforniaBatchCorrection(r.id);
    if(!c?.selectable||c.penalty!==base.penalty.en||!same(c.categories,base.categories)||!same(c.elements,supplement.elements)||c.mentalState!==supplement.mentalState)throw new Error('Runtime conduct or penalty drift');
    if(correction?.summary.en!==`${base.summary.en} ${supplement.summary}`||correction.summary.es!==correction.summary.en||correction.summary.zh!==correction.summary.en||correction.translationStatus!=='english_only_pending_translation')throw new Error('Unmarked language fallback');
    for(const source of r.sources){
      if(!c.sources.some(s=>{const u=new URL(s.url);return `${u.searchParams.get('lawCode')}:${u.searchParams.get('sectionNum')}`===source.key;}))throw new Error('Missing runtime source');
    }
    for(const i of r.instructions){
      if(!c.sources.some(s=>s.kind==='jury-instruction'&&s.citation.includes(i.id)))throw new Error('Missing instruction citation');
      if(!same(i.pages.map(p=>({page:p.page,sha256:hash(p.text)})),i.pageHashes))throw new Error('Unbound instruction pages');
    }
  }
  return {updatedChoices:1,newChoices:0,newSections:1,newVersions:1};
}
export function renderTheftConductReview(review=readTheftConductReview()){
  validateTheftConductReview(review);
  return ['# California petty theft: conduct explanation supplement','',...review.limits.map(s=>`- ${s}`),'','## Published explanation','',getCaliforniaBatchCorrection('ca-petty-theft')!.summary.en,'','## Decisions','',...review.decisions.map(s=>`- ${s}`),'','## Evidence','',...review.records.flatMap(r=>[...r.sources.map(s=>`- [${s.key}](${s.sourceUrl})`),...r.instructions.map(i=>`- CALCRIM ${i.id}: retained PDF pages ${i.firstPage} through ${i.lastPage}, with page hashes and text in the JSON packet.`)]),''].join('\n').replace(/[\u2013\u2014]/g,':').trimEnd()+'\n';
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const review=buildTheftConductReview();validateTheftConductReview(review);
 fs.writeFileSync(new URL('../output/california-theft-conduct-review.json',import.meta.url),JSON.stringify(review,null,2)+'\n');
 fs.writeFileSync(new URL('../output/california-theft-conduct-review.md',import.meta.url),renderTheftConductReview(review));
 console.log(JSON.stringify(validateTheftConductReview(review)));
}
