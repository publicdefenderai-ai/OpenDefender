import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const read=file=>JSON.parse(fs.readFileSync(path.join(here,file),'utf8'));
export const hash=text=>createHash('sha256').update(text).digest('hex');
const key=ref=>'ny:'+(ref.includes(':')?ref:'PEN:'+ref);
const sentencingCommon=['60.01','60.05','60.12','70.00','80.00'];
const profiles={
 D:{statutoryGrade:'D felony',violentFelonyClassification:'completed_offense_not_listed_in_70.02',sentencingSummary:'For an adult individual sentenced under the ordinary nonviolent Class D framework, an indeterminate maximum is at least three and no more than seven years; its minimum is at least one year and no more than one-third of the maximum imposed. This is not a mandatory three-year minimum period of confinement. Eligible alternative dispositions, including the conditional definite-sentence rule in 70.00(4), remain distinct; probation is not guaranteed.'},
 C:{statutoryGrade:'C felony',violentFelonyClassification:'C_violent_under_70.02_1_b',sentencingSummary:'For an adult individual sentenced under 70.02(3)(b), the ordinary determinate prison term is 3.5–15 years, plus 2.5–5 years of post-release supervision under 70.45(2)(f). This profile uses the authorization paragraph the publisher labels effective until September 1, 2027; it does not mix in the scheduled indeterminate paragraph.'},
 B:{statutoryGrade:'B felony',violentFelonyClassification:'B_violent_under_70.02_1_a',sentencingSummary:'For an adult individual sentenced under 70.02(3)(a), the ordinary determinate prison term is 5–25 years, plus 2.5–5 years of post-release supervision under 70.45(2)(f). This profile uses the authorization paragraph the publisher labels effective until September 1, 2027; it does not mix in the scheduled indeterminate paragraph.'},
};
const fine='For an individual, 80.00 permits a fine up to the greater of $5,000 or twice the gain, with gain and findings governed by 80.00(2)–(3). This is not an automatic added fine; corporate penalties, restitution and fees are outside this summary.';
const limitations='Candidate ordinary adult sentencing context only. Multiple-offender sentencing, youth dispositions and applicable special provisions such as 60.12 require separate assessment. No sentence prediction, guaranteed program eligibility, substantive effective-date approval or runtime authority is established here.';
function plan(section,scope,grade,start,end,summary,options={}){return {section,scope,grade,start,end,summary,...options};}
export const plans=[
 plan('140.20','whole','D','A person is guilty','\n\nBurglary in','Knowingly entering or remaining unlawfully in a building with intent to commit a crime therein. A dwelling is not required by this section.'),
 plan('140.25','1(a)','C','(a) Is armed','\n\n(b)','The common unlawful-building entry/remain and crime-intent requirements, plus the defendant or another participant being armed with explosives or a deadly weapon during entry, inside, or immediate flight.',{group:'1'}),
 plan('140.25','1(b)','C','(b) Causes physical','\n\n(c)','The common unlawful-building entry/remain and crime-intent requirements, plus the defendant or another participant causing physical injury to a nonparticipant during entry, inside, or immediate flight.',{group:'1'}),
 plan('140.25','1(c)','C','(c) Uses or threatens','\n\n(d)','The common unlawful-building entry/remain and crime-intent requirements, plus the defendant or another participant using or threatening immediate use of a dangerous instrument during entry, inside, or immediate flight.',{group:'1'}),
 plan('140.25','1(d)','C','(d) Displays','\n\n2.','The common unlawful-building entry/remain and crime-intent requirements, plus the defendant or another participant displaying what appears to be a listed firearm during entry, inside, or immediate flight. Do not import the first-degree display defense as a defense to this second-degree alternative.',{group:'1'}),
 plan('140.25','2','C','2. The building','\n\nBurglary in','The common unlawful-entry/remain and crime-intent requirements, with a building that is a dwelling. This alternative does not additionally require a weapon, injury or display.',{shockContext:true}),
 plan('140.30','1','B','1. Is armed','\n\n2.','The common unlawful-dwelling entry/remain and crime-intent requirements, plus the defendant or another participant being armed with explosives or a deadly weapon during entry, inside, or immediate flight.'),
 plan('140.30','2','B','2. Causes physical','\n\n3.','The common unlawful-dwelling entry/remain and crime-intent requirements, plus the defendant or another participant causing physical injury to a nonparticipant during entry, inside, or immediate flight. The statutory threshold here is physical injury, not serious physical injury.'),
 plan('140.30','3','B','3. Uses or threatens','\n\n4.','The common unlawful-dwelling entry/remain and crime-intent requirements, plus the defendant or another participant using or threatening immediate use of a dangerous instrument during entry, inside, or immediate flight.'),
 plan('140.30','4','B','4. Displays','\n\nBurglary in','The common unlawful-dwelling entry/remain and crime-intent requirements, plus the defendant or another participant displaying what appears to be a listed firearm during entry, inside, or immediate flight. The specified unloaded/incapable-firearm affirmative defense applies to this subdivision; it does not bar conviction of second- or third-degree burglary or another crime.',{affirmativeDefense:true}),
 plan('160.05','whole','D','A person is guilty','\n\nRobbery in','Forcibly stealing property. Section 160.00 requires use or threatened immediate use of physical force upon another for one of its two specified larceny-related purposes.'),
 plan('160.10','1','C','1. He is aided','\n\n2.','Forcibly stealing property while aided by another person actually present. Mere abstract participation by an absent person does not supply the quoted actually-present condition.',{shockContext:true}),
 plan('160.10','2(a)','C','(a) Causes physical','\n\n(b)','Forcibly stealing property, with the defendant or another participant causing physical injury to a nonparticipant during commission or immediate flight. Serious physical injury is not this paragraph\'s threshold.',{group:'2'}),
 plan('160.10','2(b)','C','(b) Displays','\n\n3.','Forcibly stealing property, with the defendant or another participant displaying what appears to be a listed firearm during commission or immediate flight. Do not import the first-degree display defense as a defense to this second-degree alternative.',{group:'2'}),
 plan('160.10','3','C','3. The property','\n\nRobbery in','Forcibly stealing a motor vehicle as defined in Vehicle and Traffic Law 125. The incorporated definition has specific exclusions; not every powered conveyance necessarily qualifies.',{deps:['VAT:125']}),
 plan('160.15','1','B','1. Causes serious','\n\n2.','Forcibly stealing property, with the defendant or another participant causing serious physical injury to a nonparticipant during commission or immediate flight. This paragraph requires serious physical injury, unlike the second-degree injury alternative.'),
 plan('160.15','2','B','2. Is armed','\n\n3.','Forcibly stealing property, with the defendant or another participant armed with a deadly weapon during commission or immediate flight. The statute does not add burglary\'s separate explosives alternative here.'),
 plan('160.15','3','B','3. Uses or threatens','\n\n4.','Forcibly stealing property, with the defendant or another participant using or threatening immediate use of a dangerous instrument during commission or immediate flight.'),
 plan('160.15','4','B','4. Displays','\n\nRobbery in','Forcibly stealing property, with the defendant or another participant displaying what appears to be a listed firearm during commission or immediate flight. The specified unloaded/incapable-firearm affirmative defense applies to this subdivision; it does not bar conviction of second- or third-degree robbery or another crime.',{affirmativeDefense:true}),
];
export function validateSources(sources){
 const seen=new Set();for(const s of sources){
  const m=/^ny:(PEN|VAT):([0-9]+(?:\.[0-9]+)?)$/.exec(s.sourceKey);
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
function bindings(plan,sources){
 const byKey=new Map(sources.map(d=>[d.sourceKey,d]));const doc=byKey.get(key(plan.section));if(!doc)throw Error('Missing primary');
 const result=[span(doc,'statutory_identity',0,doc.text.indexOf('\n\n')),selected(doc,'conduct_subdivision',plan.start,plan.end),span(doc,'grading',doc.text.lastIndexOf('\n\n')+2)];
 if(plan.scope!=='whole')result.push(selected(doc,'shared_conduct_preamble','A person is guilty','\n\n1.'));
 if(plan.group)result.push(selected(doc,'shared_participant_timing_condition',plan.group+'. ', '\n\n(a)'));
 const dependencies=[...sentencingCommon,'10.00','15.05',...(plan.section.startsWith('140.')?['140.00']:['160.00','155.00','155.05']),...(plan.grade==='D'?['65.00']:['70.45']),...(plan.affirmativeDefense?['25.00']:[]),...(plan.deps??[])];
 for(const ref of dependencies){const d=byKey.get(key(ref));if(!d)throw Error('Missing dependency '+ref);result.push(span(d,'dependency_context'));}
 const violent=byKey.get(key('70.02'));if(!violent)throw Error('Missing violent classification context');
 result.push(selected(violent,'violent_classification_context','1. Definition','\n\n2. Authorized'));
 if(plan.grade!=='D'){
  result.push(selected(violent,'publisher_labelled_pre_2027_authorization','* (a) Except as provided','\n\n* (a) The sentence'));
  result.push(selected(violent,'ordinary_determinate_range',plan.grade==='B'?'(a) For a class B felony':'(b) For a class C felony',plan.grade==='B'?'\n\n(b) For a class C felony':'\n\n(c) For a class D felony'));
 }
 return result;
}
function candidate(plan,sources){
 const baseline=read('../new-york-first-pass/baseline.json');
 const source=sources.find(d=>d.sourceKey===key(plan.section));
 return {candidateId:`ny-pen-${plan.section.replace('.','-')}-${plan.scope.replace(/[()]/g,'')}`,section:plan.section,scope:plan.scope,officialTitle:source.officialTitle,summary:plan.summary,...profiles[plan.grade],fine,limitations,
  affirmativeDefense:!!plan.affirmativeDefense,shockProgramContext:plan.shockContext?'60.05(8) expressly identifies this subdivision. Its eligibility and program requirements remain separate; no program entitlement is proposed.':'No 60.05(8) subdivision-specific program claim made.',
  existingSameSectionIds:baseline.rows.filter(r=>r.provisions.some(p=>p.sourceKey===key(plan.section))).map(r=>r.id),publicationStatus:'blocked_pending_API_legal_dates_CJI_and_product_review',bindings:bindings(plan,sources)};
}
export function validatePacket(packet,sources){
 validateSources(sources);
 if(packet.status!=='candidate_research_no_runtime_activation'||packet.sourcePacketHash!==hash(JSON.stringify(sources))||packet.records.length!==plans.length)throw Error('Candidate accounting/hash mismatch');
 const used=new Set();
 for(const [i,p] of plans.entries()){
  const expected=candidate(p,sources);if(JSON.stringify(packet.records[i])!==JSON.stringify(expected))throw Error('Candidate meaning or exact binding mismatch');
  if(!expected.bindings.find(b=>b.role==='grading').text.replace(/\s+/g,' ').includes('class '+p.grade+' felony'))throw Error('Unsupported primary grade');
  for(const b of expected.bindings)used.add(b.sourceKey);
 }
 if(used.size!==sources.length||new Set(packet.records.map(r=>r.candidateId)).size!==plans.length)throw Error('Unused evidence or duplicate ID');
}
export function build(sources=read('candidate-sources.json')){
 validateSources(sources);
 const packet={status:'candidate_research_no_runtime_activation',baseCommit:'cdd21aa75da92d0751f3559efbe5a4d2ccc71708',sourcePacketHash:hash(JSON.stringify(sources)),counts:{primarySections:6,subdivisionMappings:19,retainedSources:22,reusedSources:10,newlyAcquiredSources:12,publishedChoices:0,verifiedLiveChoices:null},
  prerequisites:['Exact Senate API acquisition and comparison is still required; human-page evidence does not satisfy the API-only runtime contract.','Substantive amendment/effective-date chronology and applicable judicial/instruction limitations remain unapproved. The attempted official 140.25(2) CJI PDF returned HTTP 403 and is not retained evidence.','The publisher displays both pre-September-2027 and scheduled September-2027 sentencing branches. This packet separates them but does not independently validate the enactment history or a case-specific offense-date rule.','Preserve all existing reselection holds and reconcile legacy labels/citation overlays before any publication; a same-section match is not an automatic successor.','Prepare informational guidance, honest translations and product-path tests before a later publication package; do not regenerate or activate receipts from this research.'],records:plans.map(p=>candidate(p,sources))};
 validatePacket(packet,sources);return packet;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const output=JSON.stringify(build(),null,2)+'\n';const target=path.join(here,'candidate-review.json');
 if(process.argv.includes('--check')){if(fs.readFileSync(target,'utf8')!==output)throw Error('Candidate artifact drift');console.log('19 burglary/robbery mappings replayed against 22 sources; no activation.');}
 else fs.writeFileSync(target,output);
}
