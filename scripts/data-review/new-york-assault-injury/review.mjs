import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const read=f=>JSON.parse(fs.readFileSync(path.join(here,f),'utf8'));
export const hash=text=>createHash('sha256').update(text).digest('hex');
const key=ref=>'ny:'+(ref.includes(':')?ref:'PEN:'+ref);
function plan(section,scope,summary,deps=[]){return {section,scope,summary,deps};}
export const plans=[
 plan('120.05','1','Intent to cause serious physical injury, and causing that injury to the intended person or a third person.'),
 plan('120.05','2','Intent to cause physical injury, and causing that injury to the intended person or a third person by a deadly weapon or dangerous instrument.'),
 plan('120.05','4','Recklessly causing serious physical injury by a deadly weapon or dangerous instrument; an intent to injure is not added to this branch.'),
 plan('120.05','4-a','Recklessly causing physical injury to a child under eighteen through intentional discharge of a firearm, rifle or shotgun. Intentional discharge and reckless injury are distinct conditions.',['265.00']),
 plan('120.05','5','For a purpose other than lawful medical or therapeutic treatment, intentionally causing stupor, unconsciousness or other physical impairment or injury by administering a capable drug, substance or preparation without consent.'),
 plan('120.05','6','During and in furtherance of a felony or attempted felony, or immediate flight, the actor or another participant causes physical injury to a nonparticipant. The statute excludes Article 130 felonies requiring corroboration; the exact predicate and corroboration rule still need case-specific application.',['130.16']),
 plan('120.05','7','Having been charged with or convicted of a crime and confined pursuant to that charge or conviction in the incorporated Correction Law 40(3) facility, intentionally causing physical injury to the intended person or a third person. The definition’s expressly article-limited secure-facility wording is not broadened.',['COR:40']),
 plan('120.05','8','Actor at least eighteen, intending physical injury to a child under eleven, recklessly causes serious physical injury to that child. The two mental-state/injury levels are not collapsed.'),
 plan('120.05','9','Actor at least eighteen, intending physical injury to a child under seven, causes that injury to that child; serious injury is not required by this branch.'),
 plan('120.05','10(a)','At a place known or reasonably known to be school grounds, intending physical injury and causing that injury to a school or public-school-district employee. The separate nonstudent limitation in (b) is not imposed on (a).',['220.00']),
 plan('120.05','10(b)','At a place known or reasonably known to be school grounds, intending physical injury, the actor is not a student of that school/district and injures a student attending or present for educational purposes. The incorporated grounds definition includes specified areas within 1,000 feet.',['220.00']),
 plan('120.05','12','Intending and causing physical injury to a person at least sixty-five, with the actor more than ten years younger. Exactly a ten-year age difference does not satisfy this paragraph.'),
 plan('120.10','1','Intending serious physical injury and causing it to the intended person or a third person by a deadly weapon or dangerous instrument.'),
 plan('120.10','2','Intending serious and permanent disfigurement, or permanent destruction, amputation or disabling of a bodily member or organ, and causing that injury to the intended person or a third person.'),
 plan('120.10','3','Reckless conduct creating a grave risk of death and causing serious physical injury under circumstances evincing depraved indifference to human life. Depraved indifference is not treated as ordinary recklessness; its independent judicial mental-state requirements remain a publication prerequisite.'),
 plan('120.10','4','During and in furtherance of a felony or attempted felony, or immediate flight, the actor or another participant causes serious physical injury to a nonparticipant. This paragraph does not repeat 120.05(6)’s Article 130 corroboration exclusion; applicable predicate and judicial limitations still need review.'),
 plan('121.12','121.11(a)','With intent to impede normal breathing or blood circulation, applying pressure to the throat or neck and thereby causing stupor, loss of consciousness for any period, or other physical injury or impairment. Serious injury is not required. The valid medical/dental-purpose affirmative defense in 121.14 is retained.',['121.11','121.14']),
 plan('121.12','121.11(b)','With intent to impede normal breathing or blood circulation, blocking the nose or mouth and thereby causing stupor, loss of consciousness for any period, or other physical injury or impairment. Serious injury is not required. The valid medical/dental-purpose affirmative defense in 121.14 is retained.',['121.11','121.14']),
];
export const heldScopes=['3','3-a','3-b','3-c','11','11-a','11-b','11-c','13','14'];
export function validateSources(sources){
 const seen=new Set();for(const s of sources){
  const m=/^ny:(PEN|CPL|COR):([0-9]+(?:\.[0-9]+)?)$/.exec(s.sourceKey);
  if(!m||seen.has(s.sourceKey)||s.sourceUrl!==`https://www.nysenate.gov/legislation/laws/${m[1]}/${m[2]}`||s.section!==m[2])throw Error('Source identity mismatch');seen.add(s.sourceKey);
  if(hash(s.text)!==s.contentSha256||!s.officialTitle||!/^[a-f0-9]{64}$/.test(s.pageSha256)||!(s.text.startsWith('§ '+s.section+' ')||s.text.startsWith('§ '+s.section+'. ')))throw Error('Source integrity mismatch');
  if(s.effectiveDateStart!==null||!Number.isFinite(Date.parse(s.retrievedAt))||s.acquisitionChannel!=='senate_human_page_research_only_not_authority_API')throw Error('Research provenance mismatch');
 }
}
function span(doc,role,start=0,end=doc.text.length){
 if(!doc||start<0||end<=start||end>doc.text.length)throw Error('Missing exact evidence boundary');
 return {role,sourceKey:doc.sourceKey,contentSha256:doc.contentSha256,start,end,...(role.endsWith('_context')?{}:{text:doc.text.slice(start,end)})};
}
function selected(doc,role,startText,endText){const start=doc.text.indexOf(startText);return span(doc,role,start,doc.text.indexOf(endText,start));}

const common=['10.00','15.05','25.00','60.01','60.05','60.12','65.00','70.00','70.02','70.45','80.00','85.00','CPL:1.20','CPL:220.10','CPL:220.30'];
function subdivision(doc,scope,role='conduct_subdivision'){
 const all=[...doc.text.matchAll(/^(\d+(?:-[a-z])?)\. /gm)];const i=all.findIndex(m=>m[1]===scope);if(i<0)throw Error('Missing subdivision');return span(doc,role,all[i].index,i+1<all.length?all[i+1].index-2:doc.text.lastIndexOf('\n\n'));
}
function bindings(p,sources){
 const docs=new Map(sources.map(d=>[d.sourceKey,d]));const d=docs.get(key(p.section));const result=[span(d,'statutory_identity',0,d.text.indexOf('\n\n')),span(d,'grading',d.text.lastIndexOf('\n\n')+2)];
 if(p.section==='121.12'){
  result.push(selected(d,'offense_result','A person is guilty','\n\nStrangulation'));
  const base=docs.get(key('121.11'));result.push(selected(base,'shared_conduct_preamble','A person is guilty','\n\na.'));
  result.push(p.scope.endsWith('(a)')?selected(base,'conduct_subdivision','a. applies','\n\nb.'):selected(base,'conduct_subdivision','b. blocks','\n\nCriminal obstruction'));
 }else{
  result.push(selected(d,'shared_conduct_preamble','A person is guilty','\n\n1.'));
  if(p.scope.startsWith('10(')){result.push(selected(d,'shared_school_condition','10. Acting','\n\n(a)'));result.push(p.scope==='10(a)'?selected(d,'conduct_subdivision','(a) causes','\n\n(b)'):selected(d,'conduct_subdivision','(b) not being','\n\n11.'));}
  else result.push(subdivision(d,p.scope));
 }
 for(const ref of [...common,...p.deps]){const dep=docs.get(key(ref));if(!dep)throw Error('Missing dependency '+ref);result.push(span(dep,'dependency_context'));}
 const grade=p.section==='120.10'?'B':'D';const sentence=docs.get(key('70.02'));const prs=docs.get(key('70.45'));
 result.push(selected(sentence,'violent_classification',grade==='B'?'(a) Class B violent':'(c) Class D violent',grade==='B'?'\n\n(b) Class C':'\n\n(d) Class E'));
 result.push(grade==='B'?selected(sentence,'publisher_pre_2027_authorization','* (a) Except as provided','\n\n* (a) The sentence'):selected(sentence,'conditional_D_authorization','(b) Except as provided','\n\n(b-1)'));
 result.push(selected(sentence,'ordinary_determinate_range',grade==='B'?'(a) For a class B felony':'(c) For a class D felony',grade==='B'?'\n\n(b) For a class C felony':'\n\n(d) For a class E felony'));
 result.push(selected(prs,'ordinary_PRS',grade==='B'?'(f) such period':'(e) such period',grade==='B'?'\n\n2-a.':'\n\n(f) such period'));
 if(grade==='D')result.push(selected(docs.get(key('60.05')),'D_disposition_requirement','5. Certain class D felonies','\n\n6.'));
 return result;
}
function record(p,sources){const grade=p.section==='120.10'?'B':'D';return {
 candidateId:`ny-pen-${p.section.replace('.','-')}-${p.scope.replace(/[().]/g,'')}`,section:p.section,scope:p.scope,officialTitle:sources.find(d=>d.sourceKey===key(p.section)).officialTitle,summary:p.summary,statutoryGrade:grade+' felony',violentClassification:grade+'_violent_under_70.02',
 sentencingSummary:grade==='B'?'Ordinary adult 70.02(3)(a) determinate term 5–25 years, plus 2.5–5 years of post-release supervision under 70.45(2)(f). The publisher-labelled pre-September-2027 authorization is bound separately from scheduled text.':'Sections 60.05(5) and 70.02(2)(b) govern these D violent offenses. If state-prison commitment is imposed, the ordinary determinate term under 70.02(3)(c) is 2–7 years, with 1.5–3 years of post-release supervision under 70.45(2)(e). This is not an unconditional mandatory two-year state-prison minimum; 60.05(5), the applicable 70.00/85.00 conditions, the armed-felony plea rule in 70.02(4), and multiple-offender exceptions must be considered. No probation or alternative disposition is guaranteed.',
 fine:'An individual fine under 80.00 may be up to the greater of $5,000 or twice gain, subject to its definition and findings rules. Corporate penalties, restitution and fees are outside this summary.',
 limitations:'Candidate ordinary adult framework only; multiple-offender, youth, special sentencing, offense-date chronology and applicable judicial/CJI limits remain separate. No statutory-number-only substitution for a legacy record.',
 publicationStatus:'blocked_pending_API_legal_dates_CJI_and_product_review',bindings:bindings(p,sources)};}
function held(sources){const d=sources.find(s=>s.sourceKey===key('120.05'));return heldScopes.map(scope=>({candidateId:`ny-pen-120-05-${scope}-held`,section:'120.05',scope,status:'held_specialized_membership_duty_and_dependency_review',reason:'The precise employee, facility, role, location, duty or retaliation predicates and their external dependencies require separate substantive review. This paragraph is accounted for, not cleared by another assault row.',bindings:[subdivision(d,scope,'held_conduct'),span(d,'grading',d.text.lastIndexOf('\n\n')+2)]}));}
const counts={primarySections:3,subdivisionMappings:18,heldPrimaryAlternatives:10,retainedSources:24,reusedSources:18,newlyAcquiredSources:6,publishedChoices:0,verifiedLiveChoices:null};
function expected(sources){return {status:'candidate_research_no_runtime_activation',baseCommit:'327d0071b41a85f944c6685bf5e6f963f28f76dd',sourcePacketHash:hash(JSON.stringify(sources)),counts,records:plans.map(p=>record(p,sources)),heldAlternatives:held(sources)};}
export function validatePacket(packet,sources){validateSources(sources);if(JSON.stringify(packet)!==JSON.stringify(expected(sources)))throw Error('Candidate meaning, accounting or binding mismatch');
 const used=new Set();for(const r of packet.records){if(!r.bindings.find(b=>b.role==='grading').text.replace(/\s+/g,' ').includes('class '+r.statutoryGrade))throw Error('Unsupported grade');for(const b of r.bindings)used.add(b.sourceKey);}
 if(used.size!==sources.length||new Set([...packet.records,...packet.heldAlternatives].map(r=>r.candidateId)).size!==28)throw Error('Unused evidence or duplicate identity');
 const d=sources.find(s=>s.sourceKey===key('120.05'));const primary=[...d.text.matchAll(/^(\d+(?:-[a-z])?)\. /gm)].map(m=>m[1]);const accounted=new Set([...plans.filter(p=>p.section==='120.05').map(p=>p.scope.replace(/\([ab]\)/,'')),...heldScopes]);if(primary.length!==accounted.size||primary.some(s=>!accounted.has(s)))throw Error('Primary subdivision omission');
}
export function build(sources=read('candidate-sources.json')){validateSources(sources);const packet=expected(sources);validatePacket(packet,sources);return packet;}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){const output=JSON.stringify(build(),null,2)+'\n';const target=path.join(here,'candidate-review.json');if(process.argv.includes('--check')){if(fs.readFileSync(target,'utf8')!==output)throw Error('Candidate artifact drift');console.log('18 injury mappings and 10 explicit specialized holds replayed against 24 sources; no activation.');}else fs.writeFileSync(target,output);}
