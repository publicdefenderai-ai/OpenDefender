import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const read=file=>JSON.parse(fs.readFileSync(path.join(here,file),'utf8'));
export const hash=text=>createHash('sha256').update(text).digest('hex');
const key=ref=>'ny:'+(ref.includes(':')?ref:'PEN:'+ref);
function plan(section,scope,grade,start,end,summary,deps=[]){return {section,scope,grade,start,end,summary,deps};}
export const plans=[
 plan('145.05','1','E','1. damages','\n\n2.','Intentional damage without right or reasonable ground to believe in a right, by breaking into another person’s locked motor vehicle intending to steal, plus at least three listed criminal-mischief convictions within the previous ten years, in separate transactions with sentences on separate occasions.',['145.00','145.10','145.12']),
 plan('145.05','2','E','2. damages','\n\nCriminal mischief','Intentional damage to another person’s property exceeding $250, without right or reasonable ground to believe in a right. Exactly $250 alone does not meet this value condition.'),
 plan('155.30','1','E','1. The value','\n\n2.','Stealing property whose value exceeds $1,000. Exactly $1,000 alone does not meet this branch; no upper ceiling is imposed by this subdivision.'),
 plan('155.30','2','E','2. The property','\n\n3.','Stealing the specified public record, writing or instrument kept, filed or deposited according to law with a public office or public servant; no monetary threshold stated.'),
 plan('155.30','3','E','3. The property','\n\n4.','Stealing secret scientific material as defined in 155.00(6); no monetary threshold stated.'),
 plan('155.30','4','E','4. The property','\n\n5.','Stealing a credit card or debit card, with the incorporated General Business Law 511 definitions; no monetary threshold stated.',['GBS:511']),
 plan('155.30','5','E','5. The property','\n\n6.','Stealing property from the person of another, regardless of nature and value.'),
 plan('155.30','6','E','6. The property','\n\n7.','Stealing property by extortion under 155.05(2)(e), regardless of nature and value. Its threat alternatives and labor-group exception remain distinct; the limited 155.15(2) defense is not a universal extortion defense.'),
 plan('155.30','7','E','7. The property','\n\n8.','Stealing one or more firearms, rifles or shotguns as defined in 265.00; no monetary threshold stated.',['265.00']),
 plan('155.30','8','E','8. The value','\n\n9.','Stealing a motor vehicle under Vehicle and Traffic Law 125, other than a motorcycle under 123, with value exceeding $100. Exactly $100 alone fails this branch.',['VAT:125','VAT:123']),
 plan('155.30','9','E','9. The property','\n\n10.','Stealing the specified religious-worship property worth at least $100 and kept or used for worship at the qualifying building, structure or curtilage by a religious corporation incorporated under the Religious Corporations Law or Education Law. Both conditions apply. Incorporation predicates require further review.',['RCO:2']),
 plan('155.30','10','E','10. The property','\n\n11.','Stealing an access device with intent to use it unlawfully to obtain telephone service; 155.00(7-c) supplies the definition.'),
 plan('155.30','11','E','11. The property','\n\n12.','Stealing anhydrous ammonia or liquified ammonia gas with intent to use it, or knowledge that another intends to use it, to manufacture methamphetamine.'),
 plan('155.30','12','E','12. The property','\n\nGrand larceny','Stealing retail goods or merchandise under a common scheme or plan or single ongoing intent, with aggregate value exceeding $1,000 regardless of different owners. The savings clause preserves other legally available aggregation and charging provisions; it does not allow arbitrary aggregation without the stated connection. Section 70.10(1)(b)(iv) excludes this subdivision from qualifying previous felony convictions for that persistent-offender definition; this is not blanket immunity from enhanced sentencing.'),
 plan('155.35','1','D','1. when the value','\n\n2.','Stealing property whose value exceeds $3,000. Exactly $3,000 alone does not meet this branch; no statutory upper ceiling is added.'),
 plan('155.35','2','D','2. the property','\n\n** 3.','Stealing an automated teller machine or its contents; no monetary threshold stated.'),
 plan('155.40','1','C','1. The value','\n\n2.','Stealing property whose value exceeds $50,000. Exactly $50,000 alone does not meet this branch; no upper ceiling is added.'),
 plan('155.40','2(a)','C','(a) cause physical',' or (b)','Extortion by instilling fear that the actor or another will cause physical injury to someone in the future; property nature and value do not set a threshold. This is physical injury, not a serious-physical-injury requirement.'),
 plan('155.40','2(b)','C','(b) cause damage',' or (c)','Extortion by instilling fear that the actor or another will damage property; property nature and value do not set a threshold.'),
 plan('155.40','2(c)','C','(c) use or abuse','; or\n\n** 3.','Extortion by instilling fear that the actor or another will use or abuse a public-servant position through conduct within or related to official duties, or failure/refusal to perform a duty, so as adversely to affect someone; property nature and value do not set a threshold.'),
];
export function validateSources(sources){
 const seen=new Set();for(const s of sources){
  const m=/^ny:(PEN|VAT|GBS|RCO):([0-9]+(?:\.[0-9]+)?)$/.exec(s.sourceKey);
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

const common=['10.00','15.05','25.00','60.01','60.05','60.12','65.00','70.00','70.02','70.10','80.00'];
function bindings(p,sources){
 const docs=new Map(sources.map(d=>[d.sourceKey,d]));const doc=docs.get(key(p.section));
 const out=[span(doc,'statutory_identity',0,doc.text.indexOf('\n\n')),selected(doc,'conduct_subdivision',p.start,p.end),span(doc,'grading',doc.text.lastIndexOf('\n\n')+2),selected(doc,'shared_conduct_preamble','A person is guilty','\n\n1.')];
 if(p.scope.startsWith('2('))out.push(selected(doc,'shared_extortion_condition','2. The property','(a) cause physical'));
 for(const ref of [...common,...(p.section.startsWith('155.')?['155.00','155.05','155.15','155.20']:[]),...p.deps]){const d=docs.get(key(ref));if(!d)throw Error('Missing dependency '+ref);out.push(span(d,'dependency_context'));}
 const sentence=docs.get(key('70.00'));
 out.push(selected(sentence,'publisher_pre_2027_authorization','* 1. Indeterminate sentence','\n\n* 1. Indeterminate sentence'));
 out.push(selected(sentence,'maximum_term_framework','2. Maximum term','\n\n(a) For a class A'));
 const term={C:['(c) For a class C','\n\n(d)'],D:['(d) For a class D','\n\n(e)'],E:['(e) For a class E','\n\n3.']}[p.grade];
 out.push(selected(sentence,'maximum_term_grade',...term),selected(sentence,'minimum_period','(b) For any other felony','\n\n4.'));
 if(p.grade!=='C')out.push(selected(sentence,'conditional_definite_alternative','4. Alternative definite sentence','\n\n5.'));
 return out;
}
function candidate(p,sources){return {
 candidateId:`ny-pen-${p.section.replace('.','-')}-${p.scope.replace(/[()]/g,'')}`,section:p.section,scope:p.scope,officialTitle:sources.find(d=>d.sourceKey===key(p.section)).officialTitle,summary:p.summary,statutoryGrade:p.grade+' felony',
 violentFelonyClassification:'completed_offense_not_listed_in_70.02',
 sentencingSummary:`Ordinary adult nonviolent Class ${p.grade}: if an indeterminate prison sentence is imposed, its maximum is at least three years and no more than ${ {C:'fifteen',D:'seven',E:'four'}[p.grade]} years; its minimum is at least one year and no more than one-third of that imposed maximum. This is not a mandatory three-year minimum confinement term. Alternative dispositions remain conditional. `+(p.grade==='C'?'The 70.00(4) D/E definite-sentence alternative is not asserted for Class C.':'Section 70.00(4) conditionally permits a definite term of one year or less for an eligible D/E offender; it does not guarantee that disposition.'),
 fine:'For an individual, 80.00 permits a fine up to the greater of $5,000 or twice the gain, subject to its gain and findings rules. Corporate penalties, restitution and fees are not summarized.',
 limitations:'Ordinary adult framework only. Multiple-offender, youth and other special sentencing provisions require separate assessment. Publisher-labelled pre-September-2027 authorization is separated from scheduled text; no independent effective-date, CJI or runtime API approval.',
 publicationStatus:'blocked_pending_API_legal_dates_CJI_and_product_review',
 additionalDependencyHold:p.section==='155.30'&&p.scope==='9'?'Religious-corporation incorporation under the Religious Corporations Law or Education Law has not been completely resolved; RCO 2 alone does not establish qualification.':null,
 bindings:bindings(p,sources)};}
function holds(sources){return ['155.35','155.40'].flatMap(section=>{
 const d=sources.find(s=>s.sourceKey===key(section));const retailStart=d.text.indexOf('** 3.');const retailEnd=d.text.indexOf('\n\n** NB',retailStart);const deedStart=d.text.indexOf(section==='155.35'?'* 3. when':'** 3. Such');const deedEnd=d.text.indexOf('\n\n** NB',deedStart);
 return [['retail',retailStart,retailEnd],['deed',deedStart,deedEnd]].map(([kind,start,end])=>({candidateId:`ny-pen-${section.replace('.','-')}-3-${kind}`,section,publisherSubdivision:'3',alternative:kind,status:'held_pending_separate_enactment_applicability_and_dependency_review',reason:'The publisher displays two distinct subdivision 3 texts. Both are retained with separate identities and offsets; this does not declare either invalid or repealed.',bindings:[span(d,'held_conduct',start,end),span(d,'grading',d.text.lastIndexOf('\n\n')+2)]}));
 });}
export function validatePacket(packet,sources){validateSources(sources);
 const expected={status:'candidate_research_no_runtime_activation',baseCommit:'d99b3991352329f5606937428b4a30124a2b226d',sourcePacketHash:hash(JSON.stringify(sources)),counts:{primarySections:4,subdivisionMappings:20,heldPublisherAlternatives:4,retainedSources:27,reusedSources:19,newlyAcquiredSources:8,publishedChoices:0,verifiedLiveChoices:null},records:plans.map(p=>candidate(p,sources)),heldAlternatives:holds(sources)};
 if(JSON.stringify(packet)!==JSON.stringify(expected))throw Error('Candidate meaning, accounting or binding mismatch');
 const used=new Set();for(const r of packet.records){if(!r.bindings.find(b=>b.role==='grading').text.replace(/\s+/g,' ').includes('class '+r.statutoryGrade))throw Error('Unsupported grade');for(const b of r.bindings)used.add(b.sourceKey);}
 if(used.size!==sources.length||new Set([...packet.records,...packet.heldAlternatives].map(r=>r.candidateId)).size!==24)throw Error('Unused evidence or duplicate identity');
}
export function build(sources=read('candidate-sources.json')){validateSources(sources);const packet={status:'candidate_research_no_runtime_activation',baseCommit:'d99b3991352329f5606937428b4a30124a2b226d',sourcePacketHash:hash(JSON.stringify(sources)),counts:{primarySections:4,subdivisionMappings:20,heldPublisherAlternatives:4,retainedSources:27,reusedSources:19,newlyAcquiredSources:8,publishedChoices:0,verifiedLiveChoices:null},records:plans.map(p=>candidate(p,sources)),heldAlternatives:holds(sources)};validatePacket(packet,sources);return packet;}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){const output=JSON.stringify(build(),null,2)+'\n';const target=path.join(here,'candidate-review.json');if(process.argv.includes('--check')){if(fs.readFileSync(target,'utf8')!==output)throw Error('Candidate artifact drift');console.log('20 property-degree mappings and 4 separately held alternatives replayed; no activation.');}else fs.writeFileSync(target,output);}
