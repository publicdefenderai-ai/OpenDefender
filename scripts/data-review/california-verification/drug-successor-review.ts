/** Combined successor accounting preserves historical findings and their limitations. */
import fs from "node:fs";
import {createHash} from "node:crypto";
import {fileURLToPath} from "node:url";
import additions from "../../../shared/california-drug-successor-additions.json";
import reviewData from "../output/california-drug-successor-review.json";
import acquisitionData from "../output/california-drug-successor-acquisition.json";
import {CALIFORNIA_CANONICAL_RECORDS, getCaliforniaCanonicalRecord} from "../../../shared/california-authority";
import {californiaPrimaryIdentity} from "../../../shared/california-law-codes";
import {controlledSubstancesDocuments, readCaliforniaControlledSubstancesReview, readCaliforniaDrugBenchmark, validateCaliforniaControlledSubstancesReview} from "./controlled-substances-review";
import {sourceText} from "./person-property-review";

const hash=(s:string)=>createHash("sha256").update(s).digest("hex");
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
const primary=(a:{lawCode:string;code:string})=>californiaPrimaryIdentity(a.lawCode,a.code).key;
export const readCaliforniaDrugSuccessorReview=()=>structuredClone(reviewData);
export const readCaliforniaDrugSuccessorAcquisition=()=>structuredClone(acquisitionData);
export function drugSuccessorDocuments(acquisition=readCaliforniaDrugSuccessorAcquisition()) {
  const docs=controlledSubstancesDocuments();
  for(const [key,versions] of Object.entries(acquisition.documents)) {
    if(docs[key])throw new Error("Successor acquisition shadows retained evidence");
    docs[key]=versions;
  }
  return docs;
}
export function validateCaliforniaDrugSuccessorReview(review=readCaliforniaDrugSuccessorReview(),definitions=additions,acquisition=readCaliforniaDrugSuccessorAcquisition()) {
  validateCaliforniaControlledSubstancesReview();
  const previous=readCaliforniaControlledSubstancesReview(),benchmark=readCaliforniaDrugBenchmark();
  const expectedKeys=["11358","11359","11360","11366.6","11366.7","11366.8","11370.6","11370.9","11379.6","11383","11383.5","11383.6","11383.7","11550"].map(s=>`HSC:${s}`).sort();
  if(review.schemaVersion!==1 || review.scope!=="bounded_drug_successor_not_statewide_certification" || review.sourceAsOf!==previous.sourceAsOf || review.archiveSha256!==previous.archiveSha256 || acquisition.archive.sha256!==review.archiveSha256 ||
     review.previousReviewSha256!==hash(fs.readFileSync(new URL("../output/california-controlled-substances-review.json",import.meta.url),"utf8")) || review.acquisitionSha256!==hash(JSON.stringify(acquisition,null,2)+"\n") || review.benchmarkSha256!==previous.benchmarkSha256) throw new Error("Successor provenance changed");
  if(!same(acquisition.candidateKeys,expectedKeys)||!same(review.sections.map(s=>s.key),expectedKeys))throw new Error("Successor section accounting changed");
  const required=[...new Set([...expectedKeys,...definitions.flatMap(a=>a.supportingKeys)])].sort(),docs=drugSuccessorDocuments(acquisition);
  if(!same([...acquisition.reusedKeys,...Object.keys(acquisition.documents)].sort(),required))throw new Error("Incomplete successor acquisition");
  for(const key of required) {
    const versions=docs[key];
    if(versions?.length!==1)throw new Error("Unresolved successor source version");
    const v=versions[0],u=new URL(v.sourceUrl);
    if(hash(v.contentXml)!==v.contentSha256||`${v.lawCode}:${v.section.replace(/\.$/,"")}`!==key||u.protocol!=="https:"||u.hostname!=="leginfo.legislature.ca.gov"||`${u.searchParams.get("lawCode")}:${u.searchParams.get("sectionNum")?.replace(/\.$/,"")}`!==key||v.effectiveDate&&v.effectiveDate.slice(0,10)>review.sourceAsOf)throw new Error("Unbound successor source");
  }
  const bindings=(key:string)=>docs[key].map(v=>({versionId:v.versionId,contentSha256:v.contentSha256}));
  const verifySpan=(e:{key:string;versionId:string;start:number;end:number;text:string},key:string)=>{
    if(e.key!==key||e.versionId!==docs[key][0].versionId||!e.text||e.start<0||e.end<=e.start||sourceText(docs[key][0].contentXml).slice(e.start,e.end)!==e.text)throw new Error("Unbound successor excerpt");
  };
  const ids=definitions.map(a=>a.id).sort();
  if(ids.length!==18||new Set(ids).size!==ids.length||!same(review.records.map(r=>r.id).sort(),ids))throw new Error("Successor addition accounting changed");
  for(const section of review.sections) {
    const assigned=definitions.filter(a=>primary(a)===section.key).map(a=>a.id);
    if(!assigned.length||!same(section.additionIds,assigned)||section.previousStatus!==previous.sections.find(s=>s.key===section.key)?.status||section.status!=="bounded_successor_branches_reviewed"||!section.remainingWork||!same(section.versions,bindings(section.key)))throw new Error("Successor disposition changed");
    verifySpan(section.evidence,section.key);
  }
  for(const row of review.records) {
    const a=definitions.find(a=>a.id===row.id)!,key=primary(a);
    if(!expectedKeys.includes(key)||row.status!=="bounded_statutory_addition_proposed"||!row.remainingWork||a.sourceAsOf!==review.sourceAsOf||a.translationStatus!=="english_only_pending_translation"||hash(JSON.stringify(a))!==row.definitionSha256)throw new Error("Successor definition changed");
    const keys=[...new Set([key,...a.supportingKeys])].sort();
    if(!same(row.sources.map(s=>s.key),keys)||!same(Object.keys(a.sourceEffectiveDates).sort(),keys))throw new Error("Incomplete successor dependencies");
    for(const s of row.sources) if(!same(s.versions,bindings(s.key))||(a.sourceEffectiveDates as Record<string,string|null>)[s.key] !== (docs[s.key][0].effectiveDate?.slice(0,10)??null))throw new Error("Successor source binding changed");
    verifySpan(row.primaryEvidence,key);
    const canonical=getCaliforniaCanonicalRecord(a.id);
    if(!canonical?.selectable||canonical.lawCode!==a.lawCode||canonical.code!==a.code||canonical.officialTitle!==a.title||canonical.penalty!==a.penalty||!same(canonical.categories,a.categories))throw new Error("Successor catalog drift");
    const runtimeKeys=canonical.sources.map(s=>{
      const u=new URL(s.url),k=`${u.searchParams.get("lawCode")}:${u.searchParams.get("sectionNum")}`;
      if(s.effectiveDate!==(a.sourceEffectiveDates as Record<string,string|null>)[k])throw new Error("Runtime date drift");return k;
    }).sort();
    if(!same(runtimeKeys,keys)||CALIFORNIA_CANONICAL_RECORDS.some(r=>r.selectable&&r.canonicalId!==a.id&&r.lawCode===a.lawCode&&r.code===a.code))throw new Error("Duplicate or incomplete successor identity");
  }
  if(!same(review.crosswalk.map(r=>r.instruction),previous.crosswalk.map(r=>r.instruction)))throw new Error("Lost benchmark instruction");
  for(const [i,row] of review.crosswalk.entries()) {
    const old=previous.crosswalk[i],newIds=definitions.filter(a=>a.calcrim.includes(row.instruction)).map(a=>a.id);
    if(!same(row.chargeIds,[...old.chargeIds,...newIds])||row.previousStatus!==old.status||row.firstPage!==old.firstPage||row.lastPage!==old.lastPage||row.status!==(newIds.length?"bounded_successor_matches":old.status)||!row.reason)throw new Error("Unbound successor benchmark match");
    if(!newIds.length&&!same(row,{...old,previousStatus:old.status}))throw new Error("Unexplained benchmark gap cleared");
    // Tie newly mapped charges to the actual instruction heading, not just a
    // handwritten instruction number. 2331's obsolete subdivision is retained.
    const instruction=benchmark.instructions[i];
    for(const id of newIds) {
      const a=definitions.find(a=>a.id===id)!;
      if(!instruction.heading.includes(primary(a).split(":")[1]))throw new Error("Instruction names a different statute");
    }
  }
  const matchedGaps=review.crosswalk.filter(r=>r.previousStatus==="publication_gap"&&r.status==="bounded_successor_matches").length;
  if(matchedGaps!==16)throw new Error("Successor lost an intended benchmark gap");
  return {additions:ids.length,primarySections:expectedKeys.length,reusedSections:acquisition.reusedKeys.length,newSections:Object.keys(acquisition.documents).length,newVersions:Object.values(acquisition.documents).reduce((n,v)=>n+v.length,0),newBenchmarkMatches:matchedGaps,configuredSelectable:CALIFORNIA_CANONICAL_RECORDS.filter(r=>r.selectable).length};
}
export function renderCaliforniaDrugSuccessorReview() {
  const a=validateCaliforniaDrugSuccessorReview();
  return ["# California combined drug follow-up", "",
    `${a.additions} proposed choices from ${a.primarySections} previously retained primary sections. Reuses ${a.reusedSections} sources and adds one licensing-protection dependency. Configured California choices: ${a.configuredSelectable}; current eligibility and production deployment remain separate.`, "",
    ...reviewData.limits.map(l=>`- ${l}`), "",
    "## Proposed choices", "", ...additions.flatMap(r=>[`### ${r.title}: HSC §${r.code}`,"",r.summary,"",`Mental state: ${r.mentalState}`,"",r.penalty,"",`Dependencies: ${r.supportingKeys.join(", ")}.`,"",`[Official statute](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=HSC&sectionNum=${primary(r).split(":")[1]}.)`,""]),
    "## Shared-source decisions", "",
    "- Cannabis authorization: BPC 26032 requires state/local authorization and compliance; it is not blanket immunity for every licensee act.",
    "- Cannabis fines: ordinary $500 provisions and HSC 11372(a)'s additional-fine text are disclosed together; $500 is not represented as an aggregate ceiling.",
    "- False compartments: the retained CALCRIM 2441 text incorporates the factory-equipment limitation from [People v. Arias (2008)](https://caselaw.findlaw.com/court/ca-supreme-court/1030162.html). An unchanged factory space is insufficient.",
    "- Manufacturing offers: current retained HSC 11379.6(e) controls; CALCRIM 2331's (c) citation remains literal in the source artifact and indexed as CA-005.",
    "- Attorney fees: section 11370.6(b) adds proof requirements; 11370.9(g) provides a distinct fee exclusion. They must not be collapsed into one rule.",
    "- Precursors: manufacturing intent and knowing transfer to a manufacturer have different penalties. The listed chemicals and branch-specific intended drug control; parallel sections are not assumed identical.", "",
    "## Complete independent crosswalk", "", "| Instruction | Previous status | Current status | Choices / limits |", "| --- | --- | --- | --- |",
    ...reviewData.crosswalk.map(r=>`| ${r.instruction} | ${r.previousStatus.replaceAll("_"," ")} | ${r.status.replaceAll("_"," ")} | ${r.chargeIds.join(", ")} ${r.reason} |`), "",
    "## Remaining scope in reviewed sections", "", ...reviewData.sections.map(s=>`- ${s.key}: ${s.remainingWork}`), "",
    "The 104-section predecessor ledger stays immutable. This successor addresses 14 sections; other entries and their open status remain in the prior packet. No unknown-severity provision is reclassified as a minor omission. Next broad family: driving and vessels, with consequential drug and juvenile/source-history gaps carried forward explicitly.", ""].join("\n");
}
if(process.argv[1]===fileURLToPath(import.meta.url)) {
  fs.writeFileSync(new URL("../output/california-drug-successor-review.md",import.meta.url),renderCaliforniaDrugSuccessorReview());
  console.log(JSON.stringify(validateCaliforniaDrugSuccessorReview()));
}
