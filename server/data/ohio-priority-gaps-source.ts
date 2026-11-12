import { validateOhioClassificationEvidence } from '@shared/ohio-primary-classification';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { OHIO_PRIORITY_GAPS_DEFINITIONS, ohioPriorityGapsDependencies } from '@shared/ohio-priority-gaps-batch';
import { OHIO_PRIORITY_GAPS_SENTENCING } from '@shared/ohio-priority-gaps-batch';
import { validVerificationWindow } from '@shared/source-verification-policy.mjs';
import rows from '@shared/ohio-priority-gaps-publication.json';
import type { OhioReviewedDocument, OhioReviewedSource } from './ohio-reviewed-source';
const hash = (value: string) => createHash('sha256').update(value).digest('hex');
const directory = resolve(process.cwd(), 'scripts/data-review/output');
export const OHIO_PRIORITY_GAPS_RECEIPT_PATH = resolve(directory, 'ohio-priority-gaps-refresh-receipt.json');
type Span = { section: string; sourceUrl: string; effectiveDateStart: string; retrievedAt: string; sourceHash: string; start: number; end: number; text: string };
type Packet = { schemaVersion: number; kind: string; planHash: string; sentencingHash: string;
  documents: Record<string, OhioReviewedDocument>;
  records: Array<{ id: string; section: string; scope: string; definitionHash: string; primaryClassification: unknown;
    dependencies: string[]; conduct: Span[]; grading: Span[]; context: Span[]; evidence: Span[] }> };
export const ohioPriorityGapsPacket = JSON.parse(readFileSync(resolve(directory, 'ohio-priority-gaps-publication-evidence.json'), 'utf8')) as Packet;


function sourceSpan(doc: OhioReviewedDocument, start: number, end: number): Span {
  return {section:doc.section,sourceUrl:doc.sourceUrl,sourceHash:doc.contentHash,effectiveDateStart:doc.effectiveDateStart,retrievedAt:doc.retrievedAt,start,end,text:doc.text.slice(start,end)};
}
/** Exact parent/numbered-child boundaries, never a whole-parent substitute for a selected child. */
function sourceSubdivision(doc: OhioReviewedDocument, path: string): Span {
  if (path === 'whole') {
    if (/^\([A-Z]\)/m.test(doc.text)) throw Error(`Expected an unnumbered section: ${doc.section}`);
    return sourceSpan(doc, 0, doc.text.length);
  }
  const match=/^([A-Z])(?:\((\d+)\))?$/.exec(path);
  if(!doc || !match)throw Error(`Invalid statutory subdivision ${path}`);
  const parents=[...doc.text.matchAll(/^\(([A-Z])\)/gm)];
  const indexes=parents.map((m,i)=>({m,i})).filter(({m})=>m[1]===match[1]);
  if(indexes.length!==1)throw Error(`Missing/ambiguous statutory division ${doc.section}/${path}`);
  const {m,i}=indexes[0],parent=sourceSpan(doc,m.index!,parents[i+1]?.index??doc.text.length);
  if(!match[2])return parent;
  const children=[...parent.text.matchAll(/^(?:\([A-Z]\)\s*)?\((\d+)\)/gm)];
  const selected=children.map((m,i)=>({m,i})).filter(({m})=>m[1]===match[2]);
  if(selected.length!==1)throw Error(`Missing/ambiguous statutory child ${doc.section}/${path}`);
  const child=selected[0];
  return sourceSpan(doc,parent.start+child.m.index!,parent.start+(children[child.i+1]?.index??parent.text.length));
}

export function validateOhioPriorityGapsPacket(packet: Packet): void {
  if (packet.schemaVersion !== 1 || packet.kind !== 'ohio_priority_gaps_publication_evidence' ||
      packet.planHash !== hash(JSON.stringify(rows)) || packet.sentencingHash !== hash(JSON.stringify(OHIO_PRIORITY_GAPS_SENTENCING)) || packet.records.length !== rows.length ||
      new Set(packet.records.map(r => r.id)).size !== rows.length) throw Error('Ohio priority gaps packet accounting changed');
  const used = new Set<string>();
  for (const record of packet.records) {
    const row = rows.find(r => r.id === record.id), definition = OHIO_PRIORITY_GAPS_DEFINITIONS.find(r => r.id === record.id);
    if (!row || !definition || record.section !== row.section || record.scope !== row.scope ||
        record.definitionHash !== hash(JSON.stringify(definition)) ||
        JSON.stringify(record.dependencies) !== JSON.stringify(ohioPriorityGapsDependencies(row)) ||
        !record.conduct.length || !record.grading.length) throw Error(`Unbound Ohio priority gaps definition ${record.id}`);
    if (JSON.stringify(record.primaryClassification) !== JSON.stringify("primaryClassification" in row ? row.primaryClassification : null)) throw Error(`Ohio classification binding changed ${record.id}`);
    validateOhioClassificationEvidence(row, record.grading);
    const sections = [record.section, ...record.dependencies];
    for (const section of sections) {
      used.add(section); const doc = packet.documents[section];
      if (!doc || doc.section !== section || hash(doc.text) !== doc.contentHash ||
          doc.sourceUrl !== `https://codes.ohio.gov/ohio-revised-code/section-${section}` ||
          !doc.text.startsWith(`Section ${section} |\n${doc.title}.\nEffective: ${doc.effectiveDateStart}\n`) ||
          !/^\d{4}-\d{2}-\d{2}$/.test(doc.effectiveDateStart) ||
          !Number.isFinite(Date.parse(doc.retrievedAt)) || doc.effectiveDateStart > doc.retrievedAt.slice(0,10) ||
          !record.evidence.some(span => span.section === section && span.start === 0 && span.end === doc.text.length)) throw Error(`Invalid Ohio priority gaps dependency ${record.id}/${section}`);
    }
    for (const span of [...record.conduct, ...record.grading, ...record.context, ...record.evidence]) {
      const doc = packet.documents[span.section];
      if (!sections.includes(span.section) || !doc || doc.contentHash !== span.sourceHash ||
          !Number.isInteger(span.start) || !Number.isInteger(span.end) || span.start < 0 || span.end <= span.start || span.end > doc.text.length ||
          doc.text.slice(span.start, span.end) !== span.text) throw Error(`Invalid Ohio priority gaps evidence ${record.id}/${span.section}`);
    }
    const primary = packet.documents[record.section];
    const preambles = [...new Set(row.conductPaths.filter(p=>p.includes('(')).map(p=>p[0]))].flatMap(letter=>{
      const parent=sourceSubdivision(primary,letter), child=/^(?:\([A-Z]\)\s*)?\(\d+\)/m.exec(parent.text);
      return child && child.index>0 ? [sourceSpan(primary,parent.start,parent.start+child.index)] : [];
    });
    const expectedConduct=[...preambles,...row.conductPaths.map(p=>sourceSubdivision(primary,p))];
    const expectedGrading=[...row.gradingPaths.map(p=>sourceSubdivision(primary,p)),...(row.extraGrading as Array<{section: string; path: string}>).map(r=>sourceSubdivision(packet.documents[r.section],r.path))];
    const expectedContext=row.contextPaths.map(p=>sourceSubdivision(primary,p));
    if(JSON.stringify(record.conduct)!==JSON.stringify(expectedConduct) || JSON.stringify(record.grading)!==JSON.stringify(expectedGrading) || JSON.stringify(record.context)!==JSON.stringify(expectedContext))throw Error(`Unbound priority gaps scope ${record.id}`);
    if(row.namingBasis === 'official_heading' ? primary.title !== row.statutoryName : !record.grading.some(s=>s.section===record.section && s.text.toLowerCase().includes(`guilty of ${row.statutoryName.toLowerCase()}`)))throw Error(`Unbound Ohio statutory name ${record.id}`);
    for(const grade of row.degrees) {
      const degree=['','first','second','third','fourth','fifth'][Number(grade.slice(1))];
      if(!record.grading.some(s=>(s.text.includes(grade === 'MM' ? 'minor misdemeanor' : `${grade[0]==='F'?'felony':'misdemeanor'} of the ${degree} degree`) || (grade.startsWith('F') && s.text.includes(`felonies of the ${degree} degree`)))))throw Error(`Unbound Ohio grade ${record.id}/${grade}`);
    }
  }
  if (Object.keys(packet.documents).some(section => !used.has(section))) throw Error('Unused Ohio priority gaps authority');
}
validateOhioPriorityGapsPacket(ohioPriorityGapsPacket);
export const OHIO_PRIORITY_GAPS_SOURCES: readonly OhioReviewedSource[] = ohioPriorityGapsPacket.records.map(record => {
  const definition = OHIO_PRIORITY_GAPS_DEFINITIONS.find(row => row.id === record.id)!;
  return { chargeId: record.id, canonicalTitle: definition.name, section: record.section,
    conduct: definition.text.en.plainSummary, grading: definition.text.en.degreeContext,
    interpretation: `Published scope: ${record.scope}. Bound offense-specific grading and dependencies; excluded branches are not approved.`,
    offense: ohioPriorityGapsPacket.documents[record.section], evidence: [...record.conduct, ...record.grading, ...record.context, ...record.evidence],
    dependencies: record.dependencies.map(section => ohioPriorityGapsPacket.documents[section]), reviewedLegalDecision: null };
});
export function validateOhioPriorityGapsReceipt(receipt: any, now = new Date()): string | null {
  const checked = Date.parse(receipt?.checkedAt), expires = Date.parse(receipt?.expiresAt);
  const acquisitions = Object.values(ohioPriorityGapsPacket.documents).map(doc => Date.parse(doc.retrievedAt));
  if (!Number.isFinite(now.getTime()) || receipt?.schemaVersion !== 1 || receipt?.kind !== 'initial_acquired_evidence_window' ||
      receipt?.packetHash !== hash(JSON.stringify(ohioPriorityGapsPacket)) ||
      !Number.isFinite(checked) || !Number.isFinite(expires) || checked > now.getTime() ||
      receipt?.verificationPolicy !== 'quarterly-v1' || checked !== Math.max(...acquisitions) ||
      expires <= checked || expires <= now.getTime() ||
      !validVerificationWindow(receipt, new Date(Math.min(...acquisitions)).toISOString())) return 'Ohio priority gaps evidence window is missing, mismatched or expired';
  return null;
}
export function isOhioPriorityGapsSourceFresh(now = new Date()): boolean {
  try { return validateOhioPriorityGapsReceipt(JSON.parse(readFileSync(OHIO_PRIORITY_GAPS_RECEIPT_PATH, 'utf8')), now) === null; }
  catch { return false; }
}
