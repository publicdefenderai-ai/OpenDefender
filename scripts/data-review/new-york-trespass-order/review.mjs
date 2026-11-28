import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const read=f=>JSON.parse(fs.readFileSync(path.join(here,f),'utf8'));
export const hash=t=>createHash('sha256').update(t).digest('hex');
const key=r=>'ny:'+(r.includes(':')?r:'PEN:'+r);
const plan=(section,scope,summary,deps=[])=>({section,scope,summary,deps});
export const plans=[
 plan('140.05','whole','Knowingly entering or remaining unlawfully in or upon premises; this is a violation, not a misdemeanor.',['140.00']),
 plan('140.15','1','Knowingly entering or remaining unlawfully in a dwelling. The incorporated dwelling and license/privilege definitions apply.',['140.00']),
 plan('140.15','2','A person required to maintain Article 6-C registration and designated level two or three enters or remains at an enumerated school knowing the registration-offense victim attends or formerly attended. Five exceptions remain: registered student, lawful student event participant, parent/guardian attending their child’s event, designated polling place for voting, or limited superintendent/chief-administrator authorization. This branch is not rewritten as the separate unlawful-dwelling branch. Registration status and risk designation must be established independently.',['COR:168-A','COR:168-F','COR:168-L']),
 plan('215.50','1','Disorderly, contemptuous or insolent behavior during a court sitting, in its immediate view and presence, directly tending to interrupt proceedings or impair respect for its authority. Mere disagreement outside these limits is not substituted.'),
 plan('215.50','2','Breach of the peace, noise or other disturbance directly tending to interrupt court proceedings.'),
 plan('215.50','3','Intentional disobedience or resistance to lawful court process or mandate, excluding cases involving or growing out of labor disputes as defined in Judiciary Law 753-a(2). Validity, notice and ability-to-comply requirements need judicial/procedural review before publication.',['JUD:753-A']),
 plan('215.50','4','Contumacious and unlawful refusal to be sworn in a court proceeding or, after oath, to answer a legal and proper interrogatory. This is not a rule requiring answers to privileged questions; privilege, immunity and procedural conditions remain publication prerequisites.'),
 plan('240.26','1','With intent to harass, annoy or alarm another, physical contact of the stated kind, or attempting or threatening that contact. A threat must satisfy applicable constitutional and judicial limits; mere offensive speech or a crude outburst is not automatically criminal.'),
 plan('240.26','2','With intent to harass, annoy or alarm another, following a person in or about public places. The express labor-activity exclusion applies.'),
 plan('240.26','3','With intent to harass, annoy or alarm another, a course of conduct or repeated acts that alarm or seriously annoy that person and serve no legitimate purpose. The express labor-activity exclusion applies.'),
];
const common=['10.00','15.05','60.01','65.00','70.15','80.05','80.00'];
export function validateSources(sources){const seen=new Set();for(const s of sources){
 const m=/^ny:(PEN|COR|JUD):([0-9]+(?:\.[0-9]+|-A|-F|-L)?)$/.exec(s.sourceKey);
 if(!m||seen.has(s.sourceKey)||s.section!==m[2]||s.sourceUrl!==`https://www.nysenate.gov/legislation/laws/${m[1]}/${m[2]}`)throw Error('Source identity mismatch');seen.add(s.sourceKey);
 if(hash(s.text)!==s.contentSha256||!/^[a-f0-9]{64}$/.test(s.pageSha256)||!s.officialTitle||!new RegExp('^§ '+s.section.replace('.','\\.')+'(?:[ .])','i').test(s.text))throw Error('Source integrity mismatch');
 if(s.effectiveDateStart!==null||!Number.isFinite(Date.parse(s.retrievedAt))||s.acquisitionChannel!=='senate_human_page_research_only_not_authority_API')throw Error('Research provenance mismatch');
}}
function span(d,role,start=0,end=d.text.length){if(start<0||end<=start||end>d.text.length)throw Error('Missing exact evidence boundary');return {role,sourceKey:d.sourceKey,contentSha256:d.contentSha256,start,end,...(role.endsWith('_context')?{}:{text:d.text.slice(start,end)})};}
function selected(d,role,a,b){const start=d.text.indexOf(a);return span(d,role,start,b?d.text.indexOf(b,start):d.text.length);}
function sub(d,n,role='conduct_subdivision'){const all=[...d.text.matchAll(/^(\d+)\. /gm)];const i=all.findIndex(m=>m[1]===n);if(i<0)throw Error('Missing subdivision');let end=i+1<all.length?all[i+1].index-2:d.text.lastIndexOf('\n\n');if(d.section==='240.26'&&n==='3')end=d.text.indexOf('\n\nSubdivisions');return span(d,role,all[i].index,end);}
function row(p,sources){const docs=new Map(sources.map(s=>[s.sourceKey,s]));const d=docs.get(key(p.section));const violation=['140.05','240.26'].includes(p.section);const grade=violation?'violation':'class A misdemeanor';
 const b=[span(d,'statutory_identity',0,d.text.indexOf('\n\n')),span(d,'grading',d.text.lastIndexOf('\n\n')+2)];
 if(p.scope==='whole')b.push(selected(d,'conduct_subdivision','A person','\n\nTrespass'));
 else {b.push(selected(d,'shared_conduct_preamble','A person','\n\n1.'));b.push(sub(d,p.scope));}
 if(p.section==='240.26'&&p.scope!=='1')b.push(selected(d,'labor_exclusion','Subdivisions two','\n\nHarassment'));
 for(const r of [...common,...p.deps])b.push(span(docs.get(key(r)),'dependency_context'));
 b.push(selected(docs.get(key('70.15')),'ordinary_imprisonment',violation?'4. Violation.':'1. Class A',violation?null:'\n\n1-a.'));
 b.push(selected(docs.get(key('80.05')),'ordinary_fine',violation?'4. Violation.':'1. Class A',violation?'\n\n5.':'\n\n2.'));
 b.push(selected(docs.get(key('80.05')),'alternative_gain_fine','5. Alternative','\n\n6.'));
 return {candidateId:`ny-pen-${p.section.replace('.','-')}-${p.scope}`,section:p.section,scope:p.scope,officialTitle:d.officialTitle,summary:p.summary,statutoryGrade:grade,
 sentencingSummary:violation?'If imprisonment is imposed, no more than fifteen days; ordinary individual fine no more than $250.':'If imprisonment is imposed, no more than 364 days; ordinary individual fine no more than $1,000.',
 fineQualification:'Section 80.05(5) permits an alternative fine up to twice gain, with 80.00(2)–(3) definitions/findings. These ordinary individual limits exclude corporations; restitution, fees and special dispositions are not resolved here.',
 publicationStatus:'blocked_pending_API_legal_dates_CJI_and_product_review',bindings:b};}
function held(sources){const d=sources.find(s=>s.sourceKey===key('215.50'));return ['5','6','7'].map(scope=>({candidateId:`ny-pen-215-50-${scope}-held`,section:'215.50',scope,status:'held_pending_constitutional_or_jury_procedure_review',reason:scope==='6'?'The incorporated jury statutes, rules and special statutes have not been exhaustively bound.':'Speech and courthouse-expression constitutional limits require independent judicial review; retained statutory text alone does not resolve enforceability.',bindings:[sub(d,scope,'held_conduct'),span(d,'grading',d.text.lastIndexOf('\n\n')+2)]}));}
function expected(sources){return {status:'candidate_research_no_runtime_activation',baseCommit:'38842e5c4aa002db4ea940352785af79dde8ee1b',sourcePacketHash:hash(JSON.stringify(sources)),counts:{primarySections:4,subdivisionMappings:10,heldPrimaryAlternatives:3,retainedSources:16,reusedSources:12,newlyAcquiredSources:4,publishedChoices:0,verifiedLiveChoices:null},records:plans.map(p=>row(p,sources)),heldAlternatives:held(sources)};}
export function validatePacket(packet,sources){validateSources(sources);if(JSON.stringify(packet)!==JSON.stringify(expected(sources)))throw Error('Candidate meaning, accounting or binding mismatch');const used=new Set();for(const r of packet.records){if(!r.bindings.find(b=>b.role==='grading').text.includes(r.statutoryGrade))throw Error('Unsupported grade');for(const b of r.bindings)used.add(b.sourceKey);}if(used.size!==sources.length||new Set([...packet.records,...packet.heldAlternatives].map(r=>r.candidateId)).size!==13)throw Error('Unused evidence or duplicate identity');for(const section of ['140.15','215.50','240.26']){const d=sources.find(s=>s.section===section);const scopes=[...d.text.matchAll(/^(\d+)\. /gm)].map(m=>m[1]);const accounted=[...packet.records,...packet.heldAlternatives].filter(r=>r.section===section).map(r=>r.scope);if(JSON.stringify(scopes)!==JSON.stringify(accounted))throw Error('Primary subdivision omission');}}
export function build(sources=read('candidate-sources.json')){validateSources(sources);const p=expected(sources);validatePacket(p,sources);return p;}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){const output=JSON.stringify(build(),null,2)+'\n';const target=path.join(here,'candidate-review.json');if(process.argv.includes('--check')){if(fs.readFileSync(target,'utf8')!==output)throw Error('Candidate artifact drift');console.log('10 mappings and 3 explicit holds replayed against 16 sources; no activation.');}else fs.writeFileSync(target,output);}
