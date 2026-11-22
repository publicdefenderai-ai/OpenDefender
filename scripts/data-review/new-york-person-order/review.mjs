import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const read=file=>JSON.parse(fs.readFileSync(path.join(here,file),'utf8'));
export const hash=value=>createHash('sha256').update(value).digest('hex');
const key=ref=>'ny:'+(ref.includes(':')?ref:'PEN:'+ref);
const ordinaryIndividualPenalty='Up to 364 days of imprisonment and/or a fine up to $1,000. Under 80.05(5), twice the gain may be imposed instead of the ordinary fine, subject to 80.00(2)–(3). These limits do not include restitution, fees or other case-specific consequences; corporate penalties are excluded.';
const common=['15.00','15.05','70.15','80.05','80.00'];
// Each row represents one statutory alternative. These are candidate research IDs,
// not new runtime identifiers or authority approvals.
export const plans=[
 {section:'120.00',scope:'1',mental:'intentional',start:'1. With intent',end:'\n\n2.',deps:['10.00'],summary:'With intent to cause physical injury to another person, causing that injury to that person or a third person. Physical injury means impairment of physical condition or substantial pain.'},
 {section:'120.00',scope:'2',mental:'reckless',start:'2. He recklessly',end:'\n\n3.',deps:['10.00'],summary:'Recklessly causing physical injury to another person. Recklessness requires the statutory substantial-and-unjustifiable-risk standard; physical injury means impairment of physical condition or substantial pain.'},
 {section:'120.00',scope:'3',mental:'criminal_negligence',start:'3. With criminal negligence',end:'\n\nAssault in',deps:['10.00'],summary:'With criminal negligence, causing physical injury to another person by means of a deadly weapon or dangerous instrument. This alternative requires the weapon or instrument; ordinary negligence is not the statutory mental state.'},
 {section:'120.14',scope:'1',mental:'intentional',start:'1. He or she intentionally',end:'\n\n2.',deps:['10.00'],summary:'Intentionally placing or attempting to place another person in reasonable fear of physical injury, serious physical injury or death by displaying a deadly weapon, dangerous instrument, or what appears to be a listed firearm. Actual physical injury is not required by this alternative.'},
 {section:'120.14',scope:'2',mental:'intentional',start:'2. He or she repeatedly',end:'\n\n3.',deps:['10.00'],summary:'Repeatedly following a person, engaging in a course of conduct, or repeatedly committing acts over time, intentionally placing or attempting to place another in reasonable fear of physical injury, serious physical injury or death. This alternative is not a generic single threatening remark.'},
 {section:'120.14',scope:'3',mental:'intentional',start:'3. He or she commits',end:'\n\nMenacing in',deps:['10.00','120.15','CPL:530.12','FCT:812','FCT:828','FCT:842'],summary:'Committing third-degree menacing by physical menace in violation of the qualifying protection-order provision. The statute distinguishes a duly served order or an order actually known because the defendant was present when issued under the specified New York provisions, and an order of a competent out-of-state, territorial or tribal court directing the person to stay away. Not every order violation is this offense.'},
 {section:'121.11',scope:'a',mental:'intentional',start:'a. applies pressure',end:'\n\nb.',deps:['121.14','25.00'],summary:'With intent to impede another person\'s normal breathing or blood circulation, applying pressure to that person\'s throat or neck. This section does not require proof that breathing or circulation was actually impeded. A valid medical or dental purpose is an affirmative defense under 121.14; it is not a missing element to be silently omitted.'},
 {section:'121.11',scope:'b',mental:'intentional',start:'b. blocks the nose',end:'\n\nCriminal obstruction',deps:['121.14','25.00'],summary:'With intent to impede another person\'s normal breathing or blood circulation, blocking that person\'s nose or mouth. This section does not require proof of injury. A valid medical or dental purpose is an affirmative defense under 121.14, subject to 25.00(2).'},
 {section:'195.05',scope:'1',mental:'intentional',start:'1. Such person intentionally',end:'\n\n2.',deps:['10.00'],summary:'Intentionally obstructing, impairing or perverting administration of law or another governmental function, or preventing or attempting to prevent a public servant\'s official function, by one of the listed means. Those means include intimidation, physical force or interference, an independently unlawful act, specified public telecommunications interference, or release of a dangerous animal with the stated intent. The required means and official-function conditions must not be reduced to mere disagreement with an official.'},
 {section:'195.05',scope:'2',mental:'intentional',start:'2. With the intent',end:'\n\nObstructing governmental',deps:[],summary:'With intent to violate a governmental closing or sealing order issued to address a public-health or safety concern, damaging or removing a padlock or other device installed to effectuate that order. This is a separate statutory alternative, not a generic obstruction catch-all.'},
 {section:'205.30',scope:'whole',mental:'intentional',start:'A person is guilty',end:'\n\nResisting arrest',deps:['CPL:1.20','CPL:2.10'],summary:'Intentionally preventing or attempting to prevent a police officer or peace officer from effecting an authorized arrest of oneself or another person. The arrest must be authorized. This section does not combine resisting arrest with every form of obstructing governmental administration.'},
];
export function validateSources(sources){
 const seen=new Set();
 for(const d of sources){
  const m=/^ny:(PEN|CPL|FCT):([0-9]+(?:\.[0-9]+)?)$/.exec(d.sourceKey);
  if(!m||seen.has(d.sourceKey)||d.sourceUrl!==`https://www.nysenate.gov/legislation/laws/${m[1]}/${m[2]}`||d.section!==m[2])throw Error('Source identity mismatch');seen.add(d.sourceKey);
  if(hash(d.text)!==d.contentSha256||!(d.text.startsWith('§ '+d.section+' ')||d.text.startsWith('§ '+d.section+'. '))||!d.officialTitle||!/^[a-f0-9]{64}$/.test(d.pageSha256))throw Error('Source integrity mismatch');
  if(!Number.isFinite(Date.parse(d.retrievedAt))||d.effectiveDateStart!==null||d.acquisitionChannel!=='senate_human_page_research_only_not_authority_API')throw Error('Research provenance mismatch');
 }
}
function bind(source,role,start=0,end=source.text.length){
 if(start<0||end<=start)throw Error('Missing exact statutory boundary');
 return {role,sourceKey:source.sourceKey,contentSha256:source.contentSha256,start,end,text:source.text.slice(start,end)};
}
function expectedBindings(plan,sources){
 const map=new Map(sources.map(d=>[d.sourceKey,d]));const d=map.get(key(plan.section));
 if(!d)throw Error('Missing primary');
 const start=d.text.indexOf(plan.start);const end=d.text.indexOf(plan.end,start);const grading=d.text.lastIndexOf('\n\n');
 const result=[bind(d,'statutory_identity',0,d.text.indexOf('\n\n')),bind(d,'conduct_subdivision',start,end),bind(d,'grading',grading+2)];
 // Intent applies to both breathing alternatives; retain the operative preamble
 // separately instead of claiming the isolated paragraph contains every element.
 if(plan.section==='121.11')result.push(bind(d,'shared_conduct_preamble',d.text.indexOf('A person is guilty'),d.text.indexOf('\n\na.')));
 for(const dep of [...common,...plan.deps]){
  const source=map.get(key(dep));if(!source)throw Error('Missing dependency '+dep);
  result.push(bind(source,['70.15','80.05','80.00'].includes(dep)?'sentencing_context':'definition_or_condition_context'));
 }
 return result;
}
export function validatePacket(packet,sources){
 validateSources(sources);
 if(packet.sourcePacketHash!==hash(JSON.stringify(sources)))throw Error('Source packet hash mismatch');
 if(packet.status!=='candidate_research_no_runtime_activation'||packet.records.length!==plans.length||new Set(packet.records.map(r=>r.candidateId)).size!==plans.length)throw Error('Candidate accounting mismatch');
 const used=new Set();
 for(const [i,plan] of plans.entries()){
  const r=packet.records[i];const bindings=expectedBindings(plan,sources);
  if(r.ordinaryIndividualPenalty!==ordinaryIndividualPenalty||r.officialTitle!==sources.find(d=>d.sourceKey===key(plan.section)).officialTitle)throw Error('Candidate name/penalty mismatch');
  if(r.section!==plan.section||r.scope!==plan.scope||r.candidateId!==`ny-pen-${plan.section.replace('.','-')}-${plan.scope}`||r.summary!==plan.summary||r.mentalState!==plan.mental||r.grade!=='A misdemeanor'||r.publicationStatus!=='blocked_pending_API_dates_instructions_and_product_review')throw Error('Candidate meaning mismatch');
  if(JSON.stringify(r.bindings)!==JSON.stringify(bindings))throw Error('Exact subdivision/dependency binding mismatch');
  if(!r.bindings.find(b=>b.role==='grading').text.replace(/\s+/g,' ').includes('class A misdemeanor'))throw Error('Grade unsupported');
  for(const b of bindings)used.add(b.sourceKey);
 }
 if(used.size!==sources.length)throw Error('Unused or missing source');
}
export function build(sources=read('candidate-sources.json')){
 validateSources(sources);
 const baseline=read('../new-york-first-pass/baseline.json');
 const records=plans.map(plan=>({candidateId:`ny-pen-${plan.section.replace('.','-')}-${plan.scope}`,section:plan.section,scope:plan.scope,officialTitle:sources.find(d=>d.sourceKey===key(plan.section)).officialTitle,mentalState:plan.mental,grade:'A misdemeanor',summary:plan.summary,publicationStatus:'blocked_pending_API_dates_instructions_and_product_review',existingSameSectionIds:baseline.rows.filter(row=>row.provisions.some(p=>p.sourceKey===key(plan.section))).map(r=>r.id),ordinaryIndividualPenalty,bindings:expectedBindings(plan,sources)}));
 const packet={status:'candidate_research_no_runtime_activation',baseCommit:'cdd21aa75da92d0751f3559efbe5a4d2ccc71708',sourcePacketHash:hash(JSON.stringify(sources)),counts:{primarySections:5,subdivisionMappings:11,retainedSources:sources.length,reusedSources:8,newlyAcquiredSources:12,publishedChoices:0,verifiedLiveChoices:null},publicationPrerequisites:['Exact official Senate API acquisition and comparison remains required; these human pages do not replace the API-only runtime contract.','Resolve substantive effective/amending-law chronology and applicable judicial/instruction limits before publication. The attempted official CJI 120.14(3) PDF acquisition returned HTTP 403; no instruction mapping or legal effective date is approved here.','Resolve legacy identities and citation overlays together; preserve all 27 existing reselection holds and the PR290 overlay inventory. Same-section matches are not automatic successors.','Prepare informational guidance and honest translations; replace directive urgentActions; verify selector, saved guidance and export paths.'],scopeNotes:['All five primary sections are selected from the PR290 purposive statutory benchmark, not arrest-frequency data.','Each numbered/lettered alternative is bound separately; whole dependency quotations are context and do not expand the mapped conduct.','Existing 205.30 identity is distinct from 195.05. Sections 120.14, 121.11 and 195.05 have no same-section match in the frozen baseline.','No API manifest, active receipt, catalog record, runtime eligibility or production linkage is changed.'],records};
 validatePacket(packet,sources);return packet;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const text=JSON.stringify(build(),null,2)+'\n';const file=path.join(here,'candidate-review.json');
 if(process.argv.includes('--check')){if(fs.readFileSync(file,'utf8')!==text)throw Error('Candidate artifact drift');console.log('11 New York subdivision mappings replayed; 20 sources; no runtime activation.');}
 else fs.writeFileSync(file,text);
}
