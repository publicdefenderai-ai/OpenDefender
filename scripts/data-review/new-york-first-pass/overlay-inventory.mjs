// Read-only comparison of frozen training-data overlays with exact-ID provenance.
// A matching section is not substantive approval of a charge or its penalties.
const laws = new Map([
 ['N.Y. Penal Law','PEN'],['N.Y. Veh. & Traf. Law','VAT'],['N.Y. Tax Law','TAX'],
 ['N.Y. Jud. Law','JUD'],['N.Y. Alco. Bev. Cont. Law','ABC'],['N.Y. Agric. & Mkts. Law','AGM'],
 ['N.Y. Fam. Ct. Act','FCT'],['N.Y. Educ. Law','EDN'],['N.Y. Envtl. Conserv. Law','ENV'],['N.Y. Gen. Bus. Law','GBS'],
]);
export function citationKeys(citation) {
 const split=citation.split(/\s+§{1,2}\s+/);
 const law=laws.get(split[0]);if(split.length!==2||!law)throw Error('Unrecognized NY overlay citation');
 return split[1].split(/,\s*/).map(part=>{
  const match=/^([0-9]+(?:\.[0-9]+)?(?:-[A-Za-z0-9]+)?)(?:\([^)]*\))*$/.exec(part);
  if(!match)throw Error('Unrecognized NY overlay section');return `ny:${law}:${match[1].toUpperCase()}`;
 });
}
export function trainingOverlays(citations) {
 return Object.entries(citations).filter(([id,row])=>id.startsWith('ny-')&&row.source?.includes('Training data'))
  .map(([id,row])=>({id,citation:row.citation,confidence:row.confidence,lastVerified:row.lastVerified,source:row.source,sourceUrl:row.sourceUrl??null,instructionRef:row.instructionRef??null,instructionUrl:row.instructionUrl??null})).sort((a,b)=>a.id.localeCompare(b.id));
}
export function buildOverlayInventory(overlays,baseline) {
 const rows=overlays.map(overlay=>{
  const catalog=baseline.rows.find(row=>row.id===overlay.id);
  const overlayKeys=citationKeys(overlay.citation).sort();
  const manifestKeys=[...new Set(catalog?.provisions.map(p=>p.sourceKey.toUpperCase().replace(/^NY:/,'ny:'))??[])].sort();
  const sectionMatches=JSON.stringify(overlayKeys)===JSON.stringify(manifestKeys);
  const urlMatch=overlay.sourceUrl?.match(/^https:\/\/www\.nysenate\.gov\/legislation\/laws\/([A-Z]+)\/([^/?#]+)$/);
  const urlKey=urlMatch?`ny:${urlMatch[1]}:${urlMatch[2].toUpperCase()}`:null;
  return {...overlay,catalogCode:catalog?.catalogCode??null,baselineDisposition:catalog?.disposition??null,overlayKeys,manifestKeys,
   sectionStatus:!catalog?'absent_from_frozen_catalog':catalog.disposition==='require_exact_reselection'?'existing_reselection_hold':sectionMatches?'same_section_scope_unreviewed':'section_identity_mismatch',
   officialUrlStatus:!urlKey?'not_official_senate_URL':overlayKeys.includes(urlKey)?'matches_overlay_section':'differs_from_overlay_section',
   proposedTreatment:overlay.id==='ny-trespass-after-warning'?'Candidate PEN 140.10 citation and URL must replace PEN 140.05 with the reviewed conduct/grade correction; runtime unchanged here.':!catalog?'Do not infer an active catalog record or publish from this overlay.':catalog.disposition==='require_exact_reselection'?'Preserve existing exact-reselection hold; no automatic successor substitution.':sectionMatches?'Section identity agrees only; independently verify scope, grade, penalties, instructions and provenance before publication.':'Resolve exact offense identity across catalog, manifest and overlay before publication; do not automatically choose either side.'};
 });
 return {status:'research_inventory_no_runtime_change',scope:'Every NY overlay whose source contains Training data; comparison to the frozen first-pass baseline, not substantive verification.',counts:{overlays:rows.length,sectionIdentityMismatches:rows.filter(r=>r.sectionStatus==='section_identity_mismatch').length,matchingSectionsStillUnreviewed:rows.filter(r=>r.sectionStatus==='same_section_scope_unreviewed').length,existingHolds:rows.filter(r=>r.sectionStatus==='existing_reselection_hold').length,absentFromFrozenCatalog:rows.filter(r=>r.sectionStatus==='absent_from_frozen_catalog').length,officialUrlCitationMismatches:rows.filter(r=>r.officialUrlStatus==='differs_from_overlay_section').length},rows};
}
