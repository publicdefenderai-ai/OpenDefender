import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const read=name=>JSON.parse(fs.readFileSync(path.join(here,name),'utf8'));
export const hash=value=>createHash('sha256').update(value).digest('hex');
export const benchmarkSections=['120.00','120.05','120.10','120.14','121.11','121.12','130.20','140.05','140.10','140.15','140.20','140.25','140.30','145.00','145.05','155.25','155.30','155.35','155.40','160.05','160.10','160.15','165.40','170.20','195.05','205.30','215.50','240.26'];
const specs=[
 {id:'ny-petit-larceny',section:'155.25',scope:'whole section; definition in 155.05 and claim-of-right rule in 155.15',grade:'A',dependencies:['155.00','155.05','155.15','70.15','80.05','80.00'],
 proposedConduct:'Stealing property. Penal Law 155.05 supplies the required intent to deprive or appropriate and the applicable manner of taking, obtaining or withholding. Section 155.25 does not itself impose a $1,000-or-less element. Applicable higher-degree offenses must be considered separately.',
 correction:'Remove the one-year custody ceiling, unsupported statutory value ceiling and asserted entitlement to an ACD. This packet does not independently establish eligibility for diversion or other procedural relief.'},
 {id:'ny-criminal-possession-of-stolen-property',section:'165.40',scope:'whole section',grade:'A',dependencies:['155.00','165.55','70.15','80.05','80.00'],
 proposedConduct:'Knowingly possessing stolen property with intent to benefit oneself or someone other than an owner, or to impede an owner\'s recovery. Section 165.40 does not itself impose a $1,000-or-less element. Applicable higher-degree offenses and the limitations on statutory presumptions require separate attention.',
 correction:'Replace the one-year ceiling; preserve the alternative intent to impede recovery; remove the unsupported statutory value ceiling.'},
 {id:'ny-vandalism',section:'145.00',scope:'subdivisions 1–4, including incorporated abandoned-building definition',grade:'A',dependencies:['70.15','80.05','80.00','RPA:1971-A','RPA:1971'],
 proposedConduct:'Without a right or reasonable ground to believe one has a right: intentionally damaging another person\'s property; intentionally participating in destruction of an abandoned building as statutorily defined; recklessly damaging another person\'s property in an amount exceeding $250; or intentionally disabling/removing communication equipment to prevent an emergency-assistance request under subdivision 4. An ownership interest in that equipment is not a defense to subdivision 4.',
 correction:'Replace the one-year ceiling and generic destruction label with the official title and actual alternative conduct. Do not turn the greater-than-$250 reckless threshold into an at-least-$250 threshold.'},
 {id:'ny-trespass-after-warning',section:'140.10',scope:'subdivisions (a)–(g), with 140.00 unlawful-entry definition and incorporated camp definitions',grade:'B',dependencies:['140.00','70.15','80.05','80.00','PBH:1392'],
 proposedConduct:'Knowingly entering or remaining unlawfully in a building or on real property under one of the specific conditions in subdivisions (a)–(g): enclosing barriers; specified school or camp conditions; specified public-housing conditions; or a designated, conspicuously posted no-trespass railroad zone. A generic warning or ban alone does not establish every required statutory condition.',
 correction:'Replace the generic warning-based description and the one-year/$1,000 penalty with the actual Class B classification. Do not promise a fixed warning expiration or an entitlement not established by the statute.'}
];
function key(section){return 'ny:'+(section.includes(':')?section:'PEN:'+section);}
function span(document,start,end=document.text.length){const text=document.text.slice(start,end);return {sourceKey:document.sourceKey,contentSha256:document.contentSha256,start,end,text};}
export function validateSources(sources){
 const seen=new Set();for(const s of sources){
  if(seen.has(s.sourceKey))throw Error('Duplicate source');seen.add(s.sourceKey);
  const match=/^ny:(PEN|RPA|PBH):([0-9]+\.[0-9]+|[0-9]+(?:-A)?)$/.exec(s.sourceKey);
  if(!match||s.sourceUrl!==`https://www.nysenate.gov/legislation/laws/${match[1]}/${match[2]}`||s.section!==match[2])throw Error('Unexpected source identity');
  if(hash(s.text)!==s.contentSha256||!s.text.trim().startsWith('§ '+s.section.toLowerCase())&&!s.text.trim().startsWith('§ '+s.section))throw Error('Source body/hash mismatch');
  if(!Number.isFinite(Date.parse(s.retrievedAt))||!s.officialTitle||s.text.length<60)throw Error('Incomplete source');
  if(s.effectiveDateStart!==null||s.acquisitionChannel!=='senate_human_page_research_only_not_authority_API')throw Error('Unexpected research provenance');
 }
}
export function validateBindings(packet,sources){
 const byKey=new Map(sources.map(s=>[s.sourceKey,s]));
 for(const record of packet.records){
  const spec=specs.find(s=>s.id===record.id);if(!spec)throw Error('Unknown reviewed ID');
  const expected=[key(spec.section),...spec.dependencies.map(key)].sort();
  const actual=[...new Set(record.bindings.map(b=>b.sourceKey))].sort();
  if(JSON.stringify(expected)!==JSON.stringify(actual))throw Error('Dependency coverage mismatch');
  for(const b of record.bindings){const source=byKey.get(b.sourceKey);if(!source||!Number.isInteger(b.start)||!Number.isInteger(b.end)||b.start<0||b.end<=b.start||b.end>source.text.length||b.contentSha256!==source.contentSha256||source.text.slice(b.start,b.end)!==b.text)throw Error('Invalid evidence span');}
  if(record.grade!==spec.grade||record.researchOnly!==true)throw Error('Unexpected grade or approval');
  if(!record.bindings.find(b=>b.role==='grading')?.text.replace(/\s+/g,' ').includes(`class ${spec.grade} misdemeanor`))throw Error('Missing exact grading');
 }
 if(packet.records.length!==4||new Set(packet.records.map(r=>r.id)).size!==4)throw Error('Incomplete reviewed set');
}
export function build(sources=read('candidate-sources.json'),baseline=read('baseline.json')){
 validateSources(sources);
 if(baseline.rows.length!==121||new Set(baseline.rows.map(r=>r.id)).size!==121||baseline.rows.filter(r=>r.disposition==='require_exact_reselection').length!==27)throw Error('Baseline identity/hold mismatch');
 const byKey=new Map(sources.map(s=>[s.sourceKey,s]));
 const records=specs.map(spec=>{
  const source=byKey.get(key(spec.section));if(!source)throw Error('Missing primary');
  const gradingStart=source.text.lastIndexOf('\n\n');
  const bindings=[{role:'conduct',...span(source,0,gradingStart)},{role:'grading',...span(source,gradingStart+2)},...spec.dependencies.map(dep=>{const doc=byKey.get(key(dep));if(!doc)throw Error('Missing dependency '+dep);return {role:['70.15','80.05','80.00'].includes(dep)?'penalty':'definition_or_exception',...span(doc,0)};})];
  return {...spec,officialTitle:source.officialTitle,researchOnly:true,publicationStatus:'blocked_pending_API_provenance_and_date_review',proposedOrdinaryPenalty:spec.grade==='A'?'For an individual: up to 364 days of imprisonment and/or a fine up to $1,000. If money or property was gained, the court may instead impose a fine up to twice the gain under 80.05(5), subject to 80.00(2)–(3). Restitution, fees and other case-specific consequences are not included in these fine limits.':'For an individual: up to three months of imprisonment and/or a fine up to $500. If money or property was gained, the court may instead impose a fine up to twice the gain under 80.05(5), subject to 80.00(2)–(3). Restitution, fees and other case-specific consequences are not included in these fine limits.',bindings};
 });
 const benchmark=benchmarkSections.map(section=>{
  const source=byKey.get(key(section));if(!source)throw Error('Missing benchmark source');
  const matches=baseline.rows.filter(r=>r.provisions.some(p=>p.lawId==='PEN'&&p.section===section));
  return {citation:`N.Y. Penal Law § ${section}`,section,officialTitle:source.officialTitle,sourceKey:source.sourceKey,contentSha256:source.contentSha256,status:matches.length?'same_section_requires_scope_review':'no_baseline_section_mapping',matches:matches.map(r=>({id:r.id,disposition:r.disposition}))};
 });
 const packet={status:'candidate_research_not_API_manifest_or_approval',baselineCommit:baseline.baseCommit,baselineSha256:hash(JSON.stringify(baseline)),sourcesSha256:hash(JSON.stringify(sources)),selectionMethod:'28 purposive statutory citations selected across offense families before catalog matching; official Senate text is the independent reference. No frequency, randomness or statewide completeness claim.',counts:{baselineRows:121,retained:33,renamed:61,heldForReselection:27,benchmarkCitations:28,sourceDocuments:sources.length,candidateReviewedRecords:4,newPublishedRecords:0,liveSelections:null},publicationBlockers:['Official Senate API key not available in this research process; human-page evidence does not satisfy the existing API-only authority contract.','Substantive amendment/effective-date chronology remains to be reconciled; page acquisition time is not an effective date.','Candidate summaries are not wired to selector, saved guidance or exports; translations and production-path verification remain publication prerequisites.'],benchmark,records};
 validateBindings(packet,sources);return packet;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const text=JSON.stringify(build(),null,2)+'\n';const file=path.join(here,'candidate-review.json');
 if(process.argv.includes('--check')){if(fs.readFileSync(file,'utf8')!==text)throw Error('Candidate artifact drift');console.log('Candidate research replay passed; no runtime authority changed.');}
 else fs.writeFileSync(file,text);
}
