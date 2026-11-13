import { validateOhioClassificationEvidence } from '../../shared/ohio-primary-classification';
/** Offline new-batch preparation; no database or existing receipt writes. */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import rows from '../../shared/ohio-driving-license-publication.json';
import { OHIO_DRIVING_LICENSE_DEFINITIONS, ohioDrivingLicenseDependencies } from '../../shared/ohio-driving-license-batch';
import { OHIO_DRIVING_LICENSE_SENTENCING } from '../../shared/ohio-driving-license-batch';
import { quarterlyDeadline } from '../../shared/source-verification-policy.mjs';
import { bind, division } from './ohio-major-substantive';
import { subdivision } from './ohio-residual-verification';
const hash = (s: string) => createHash('sha256').update(s).digest('hex');
function drivingLicenseSpan(doc: Parameters<typeof bind>[0], path: string) {
  if (path !== 'whole') return subdivision(doc, path);
  if (/^\([A-Z]\)/m.test(doc.text)) throw Error(`Expected an unnumbered section: ${doc.section}`);
  return bind(doc);
}
export function buildOhioDrivingLicensePublication() {
  const research = JSON.parse(readFileSync('scripts/data-review/output/ohio-driving-license-evidence.json','utf8'));
  const all = research.documents as Record<string, Parameters<typeof bind>[0]>;
  const documents: typeof all = {};
  const records = rows.map(row => {
    const primary = all[row.section];
    const definition = OHIO_DRIVING_LICENSE_DEFINITIONS.find(r => r.id === row.id)!;
    const sections = [row.section,...ohioDrivingLicenseDependencies(row)];
    const evidence = sections.map(section => {
      const doc=all[section]; if (!doc) throw Error(`Missing source ${row.id}/${section}`);
      documents[section]=doc; return bind(doc);
    });
    const preambles = [...new Set(row.conductPaths.filter(p=>p.includes('(')).map(p=>p[0]))].flatMap(letter=>{
      const parent=division(primary,letter), child=/^(?:\([A-Z]\)\s*)?\(\d+\)/m.exec(parent.text);
      return child && child.index>0 ? [bind(primary,parent.start,parent.start+child.index)] : [];
    });
    const grading=[...row.gradingPaths.map(path=>drivingLicenseSpan(primary,path)),...(row.extraGrading as Array<{section: string; path: string}>).map(r=>drivingLicenseSpan(all[r.section],r.path))];
    for(const grade of row.degrees) {
      const degree=['','first','second','third','fourth','fifth'][Number(grade.slice(1))];
      if(!grading.some(s=>(s.text.includes(grade === 'UM' ? 'unclassified misdemeanor' : grade === 'MN' ? 'driving under OVI suspension is a misdemeanor.' : grade === 'MM' ? 'minor misdemeanor' : `${grade[0]==='F'?'felony':'misdemeanor'} of the ${degree} degree`) || (grade.startsWith('F') && s.text.includes(`felonies of the ${degree} degree`))))) throw Error(`Unbound grade ${row.id}/${grade}`);
    }
    if(row.namingBasis === 'official_heading' ? primary.title !== row.statutoryName : !grading.some(s=>s.section===row.section && s.text.toLowerCase().includes(`guilty of ${row.statutoryName.toLowerCase()}`)))throw Error(`Unbound statutory name ${row.id}`);
    validateOhioClassificationEvidence(row, grading);
    return {id:row.id,section:row.section,scope:row.scope,primaryClassification: "primaryClassification" in row ? row.primaryClassification : null, definitionHash:hash(JSON.stringify(definition)),dependencies:sections.slice(1),
      conduct:[...preambles,...row.conductPaths.map(path=>drivingLicenseSpan(primary,path))],grading,
      context:row.contextPaths.map(path=>drivingLicenseSpan(primary,path)),evidence};
  });
  const packet={schemaVersion:1,kind:'ohio_driving_license_publication_evidence',planHash:hash(JSON.stringify(rows)),sentencingHash:hash(JSON.stringify(OHIO_DRIVING_LICENSE_SENTENCING)),translationStatus:'english_only_pending_translation',records,documents};
  const times=Object.values(documents).map(d=>Date.parse(d.retrievedAt));
  const receipt={schemaVersion:1,kind:'initial_acquired_evidence_window',verificationPolicy:'quarterly-v1',checkedAt:new Date(Math.max(...times)).toISOString(),expiresAt:quarterlyDeadline(new Date(Math.min(...times)).toISOString()),packetHash:hash(JSON.stringify(packet))};
  return {packet,receipt};
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 const {packet,receipt}=buildOhioDrivingLicensePublication();
 for(const [name,value] of [['ohio-driving-license-publication-evidence.json',packet],['ohio-driving-license-refresh-receipt.json',receipt]] as const) {
  const path=`scripts/data-review/output/${name}`,output=JSON.stringify(value,null,2)+'\n';
  if(process.argv.includes('--check')){if(readFileSync(path,'utf8')!==output)throw Error(`Publication drift ${name}`);}else writeFileSync(path,output);
 }
 console.log(JSON.stringify({records:packet.records.length,sources:Object.keys(packet.documents).length,checkedAt:receipt.checkedAt,expiresAt:receipt.expiresAt}));
}
