import {createHash} from "node:crypto";
import {expect,it} from "vitest";
import rows from "../shared/texas-animal-cruelty.json";
import evidence from "../scripts/data-review/output/texas-animal-cruelty-evidence.json";
import transition from "../scripts/data-review/output/texas-animal-hb285-transition.json";
import priorities from "../scripts/data-review/output/texas-animal-priorities.json";
import {chargeCategories,getChargeById,getInstructionRef,getVerifiedCitation} from "../shared/criminal-charges";
import {getChargeExplanation} from "../shared/charge-explanations";
import {resolveGuidanceCharge} from "../shared/guidance-charge-resolution";
import {loadTexasAuthorityManifest} from "../server/data/texas-manifest-loader";
import {buildTexasManifestRecord,buildTexasSourceDatabaseSeed} from "../server/data/texas-source-database-seed";
const row=(id:string)=>rows.find(r=>r.id===id)!;
it("accounts for24 choices and two aggregate DPS codes without treating arrests as convictions",()=>{
 expect(rows).toHaveLength(24);expect(priorities.rows.map(r=>r.rank)).toEqual([98,138]);expect(priorities.rows.reduce((n,r)=>n+r.adult,0)).toBe(1711);
 expect(new Set(rows.map(r=>r.id)).size).toBe(24);
 expect(buildTexasSourceDatabaseSeed(loadTexasAuthorityManifest()).selectableChargeIds).not.toContain("tx-animal-cruelty-misdemeanor");
});
it("keeps livestock intent, special poison exclusions and two-prior ladder distinct",()=>{
 const text=evidence["PE:42.09"].text;expect(text).toContain("intentionally or knowingly");expect(text).toContain("other than cattle, horses, sheep, swine, or goats");
 for(const r of rows.filter(r=>r.references[0].section==="42.09")){expect(r.conduct).toContain("recklessness or criminal negligence alone is not");expect(r.penalty).toContain("Two prior convictions");expect(r.penalty).not.toContain("five-year");}
 expect(row("tx-pc-42-09-transport-confine").conduct).toContain("cruel and unusual");expect(row("tx-pc-42-09-trip-horse").conduct).toContain("identify its ownership or provide veterinary care");
});
it("preserves all three different nonlivestock repeat ladders and scoped defenses",()=>{
 const text=evidence["PE:42.092"].text;expect(text).toContain("if either animal is not a dog");expect(text).toContain("in the act of or after");
 expect(row("tx-pc-42-092-neglect").penalty).toContain("Two prior convictions");expect(row("tx-pc-42-092-torture").penalty).toContain("One prior conviction under §42.092(b)(1), (2), (7) or (8)");expect(row("tx-pc-42-092-fight").penalty).toContain("One prior conviction under any branch");
 for(const id of ["kill-poison-injure","injure"]){const r=row("tx-pc-42-092-"+id);expect(r.conduct).toContain("in the act of or after");expect(r.conduct).toContain("killed/injured at that discovery");}
 expect(row("tx-pc-42-092-abandon").conduct).toContain("trap-neuter-return");expect(row("tx-pc-42-092-torture").conduct).not.toContain("trap-neuter-return");
});
it("qualifies the2025 mental-state change on each affected choice and binds the enrolled act",()=>{
 expect(createHash("sha256").update(transition.text).digest("hex")).toBe(transition.textSha256);
 for(const s of transition.spans){expect(transition.text.slice(s.start,s.end)).toBe(s.text);expect(createHash("sha256").update(s.text).digest("hex")).toBe(s.sha256);}
 expect(transition.spans[1].text).toContain("if any element of the offense occurred before that date");expect(transition.spans[2].text).toContain("September 1, 2025");
 for(const r of rows.filter(r=>r.references[0].section==="42.092")){expect(r.conduct).toContain("any element before that date");expect(r.conduct).toContain("earlier law, which did not include that mental state");expect(r.conduct).toContain("For alleged criminal negligence only");}
});
it("distinguishes assistance attack/injury/death and limits the mandatory restitution provision to(a)",()=>{
 expect(evidence["PE:42.091"].text).toContain("convicted of an offense under Subsection (a)");
 for(const r of rows.filter(r=>r.references[0].section==="42.091")){expect(r.conduct).toContain("specific Human Resources Code §121.002 definition");expect(r.penalty).toContain("five-year");if(r.id.includes("-a-"))expect(r.penalty).toContain("court must order owner restitution");else expect(r.penalty).toContain("not this subsection (b)");}
 expect(evidence["PE:42.107"].text).toContain("within the five-year period preceding");
});
it("uses existing groups and does not label an unverified jury item as an instruction",()=>{
 for(const r of rows){expect(chargeCategories["Public Order"]).toContain(r.id);expect(getInstructionRef(getChargeById(r.id)!)).toBeNull();}
});
it("rebuilds individually supported identities and fails closed on altered or missing evidence", () => {
  const sources=new Map(Object.entries(evidence));
  const manifest=loadTexasAuthorityManifest();
  const generatedAt=new Date(Math.max(...Object.values(evidence).map(doc=>Date.parse(doc.retrievedAt))));
  for (const r of rows) {
    const charge=getChargeById(r.id)!;
    const docs=r.references.map(ref=>{
      const d=sources.get(ref.code+":"+ref.section)!;
      expect(d.textSha256).toBe(createHash("sha256").update(d.text).digest("hex"));
      expect(d.snapshotHash).toBe(createHash("sha256").update(JSON.stringify(d.text)).digest("hex"));
      expect(d.sourceUrl).toBe(`https://tcss.legis.texas.gov/resources/${ref.code}/htm/${ref.code}.${ref.section.split('.')[0]}.htm#${ref.section}`);
      return {...d,retrievedAt:new Date(d.retrievedAt)};
    });
    const actual=buildTexasManifestRecord(charge,docs,generatedAt);
    expect(actual).toEqual(manifest.catalogRecords.find(record=>record.chargeId===r.id));
    expect(actual.provisions.map(p=>[p.lawId,p.section,p.subdivision,p.supportRole])).toEqual(r.references.map(ref=>[ref.code,ref.section,ref.subdivision,ref.supportRole]));
    expect(buildTexasManifestRecord(charge,docs.slice(1),generatedAt).provisions).toHaveLength(0);
    expect(buildTexasManifestRecord(charge,docs.map((d,i)=>i===0?{...d,text:d.text+" changed"}:d),generatedAt).provisions).toHaveLength(0);
    expect(getVerifiedCitation(charge)).toBe(r.citation);
    for (const lang of ["en","es","zh"]) expect(getChargeExplanation(r.name,"TX",lang,r.id)).toMatchObject({plainSummary:r.conduct,degreeContext:r.penalty,untranslated:lang!=="en",translationDraft:false});
    expect(resolveGuidanceCharge({id:r.id,name:r.name,code:r.code,classification:r.category},"TX")).toMatchObject({id:r.id});
    if (r.id.startsWith("tx-pc-")) expect(resolveGuidanceCharge({name:r.name,code:r.code,classification:r.category},"TX")).toBeUndefined();
  }
});


