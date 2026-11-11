import { integrateFloridaCorrections } from '../batch/integrate-florida-corrections';
/** Correct existing product content and its evidence. Never issue or extend a receipt. */
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import plan from './correction-plan.json';
import originals from './previous-definitions.json';
import baselineDrafts from './previous-evidence.json';
import guidance from './guidance.json';
import effectiveDates from './effective-dates.json';
import {validateFloridaCloseoutIncorporatedConduct} from './validate';
import { assembleFloridaReviewedReport, buildFloridaReviewedSourceRecords, findSubdivisionRange, type FloridaReviewedAnalysisEntry, type FloridaReviewedCacheDocument } from '../../../server/data/florida-reviewed-source-records';
import type { EvidenceBackedChargeDefinition } from '../../../shared/evidence-backed-charge-batch';
import { floridaSectionUrl } from '../batch/florida-adapter';
const json = (p: string) => JSON.parse(fs.readFileSync(p, 'utf8'));
const hash = (x: unknown) => createHash('sha256').update(JSON.stringify(x)).digest('hex');
const encode = (x: unknown) => JSON.stringify(x, null, 2) + '\n';
const output = 'scripts/data-review/output/florida-reviewed-closeout-corrections.json';
const mode = process.argv[2], candidate = process.argv[3];
if (!['--prepare', '--integrate', '--check'].includes(mode))
    throw Error('Use --prepare candidate.json, --integrate, or --check');
const retained = mode === '--prepare' ? null : json(output);
const cache = mode === '--prepare' ? json(candidate) : { schemaVersion: 1, jurisdiction: 'FL', documents: retained.documents };
const docs = cache.documents as Record<string, FloridaReviewedCacheDocument>;
const definitions = originals.map(original => {
    const d = structuredClone(original) as EvidenceBackedChargeDefinition;
    const row = plan.records.find(r => r.id === d.id)!;
    d.verifiedMonth = '2026-11';
    if (row.newPrimary) {
      if (!d.categories?.includes('misdemeanor') || !d.categories.includes('felony')) throw Error('Missing supported category for '+d.code);
      d.category = 'misdemeanor';
      d.categories = ['misdemeanor','felony'];
    }
    const dependencies = [...new Set(row.requiredSections.map(s => s.section))].filter(s=>s!==row.section);
    d.citations = [d.citations[0], ...dependencies.map(section=>({citation:`Fla. Stat. § ${section}`,url:floridaSectionUrl(section)}))];
    for (const lang of ['en','es','zh'] as const) {
      if (d.code === '877.03') d.text[lang].plainSummary += ' ' + guidance['877.03'][lang];
      const details = d.code === '877.03' ? [] : [row.message];
      const messages = [...details,...row.grades,'domestic'].map(key => guidance[key as keyof typeof guidance][lang]);
      d.text[lang].degreeContext = [original.text[lang].degreeContext,...messages].join(' ');
    }
    return d;
});
const analyses: FloridaReviewedAnalysisEntry[] = definitions.map(d => {
    const row = plan.records.find(r => r.id === d.id)!, section = d.code.match(/^\d+\.\d+/)![0];
    const original = baselineDrafts.find(r => r.id === d.id);
    if (!original)
        throw Error(`Missing original ${d.id}`);
    const identity = original.identityEvidence;
    const gradingQuotes = original.gradeEvidence.map(e=>e.text);
    return { id:d.id, section, status:'eligible', reason:'Individually bound reviewed-family offense, scope and penalties.', identity:{kind:identity.target === 'title' ? 'official_heading' : 'operative_guilt_clause', quote:identity.text, sourceHash:docs[section].contentHash}, conductQuotes:original.conductEvidence.map(e=>e.text), gradingQuotes, requiredSections:row.requiredSections.map(s=>({section:s.section,role:s.role as FloridaReviewedAnalysisEntry['requiredSections'][number]['role'],contentHash:docs[s.section].contentHash})), notes:'Charged subdivision retains its own scope. Incorporated definitions, repeat and collateral branches are context-specific.' };

});
// Definitions outside the charged subdivision stay separately bound; they do
// not become additional charged conduct or relax the assembler's scope guard.
const incorporatedConduct = plan.records.map(row => {
    const scopes = row.incorporatedConduct;
    return {id:row.id, spans:scopes.map(({section,scope})=> {
      if (!row.requiredSections.some(d=>d.section===section)) throw Error(`Unbound incorporated source ${section}`);
      const range=findSubdivisionRange(docs[section].text,scope)[0];
      if(!range) throw Error(`Missing incorporated definition ${section}${scope}`);
      return {section,scope,contentHash:docs[section].contentHash,start:range.start,end:range.end,text:docs[section].text.slice(range.start,range.end)};
    })};
});
const selected = Object.fromEntries(plan.sections.map(s => { if (!docs[s])
    throw Error(`Missing ${s}`); return [s, docs[s]]; }));
const now = new Date(Math.max(...Object.values(selected).map(d => Date.parse(d.retrievedAt))));
const assembled = assembleFloridaReviewedReport(definitions, analyses, { schemaVersion: 1, jurisdiction: 'FL', documents: selected }, now);
if (assembled.technicalHolds.length)
    throw Error(JSON.stringify(assembled.technicalHolds));
const decisions = definitions.map(d => { const draft = assembled.report.drafts.find(r => r.id === d.id)!; const base = { id: d.id, status: 'eligible', reason: 'Corrected existing record with individually bound conduct and sentencing conditions; freshness and database gates remain separate.', draftHash: hash(draft), definitionHash: hash(d) }; return { ...base, approvalHash: hash(base) }; });
const eligibility = { schemaVersion: 1, reportHash: hash(assembled.report), decisions };
buildFloridaReviewedSourceRecords(definitions, assembled.report, eligibility as any);
const effectiveDateEvidence = effectiveDates;
for (const [chapter,date] of [['2026-86','2026-07-01'],['2026-144','2026-06-16'],['2026-76','2026-07-01'],['2026-78','2026-10-01']]) {
 const e=effectiveDates.find(r=>r.chapter===chapter);
 if(!e || e.effectiveDate!==date || createHash('sha256').update(e.effectiveDateQuote).digest('hex')!==e.quoteSha256) throw Error(`Invalid effective-date evidence ${chapter}`);
}
const speechAuthority = {
  section: '877.03',
  authority: 'State v. Saunders, 339 So. 2d 641, 644 (Fla. 1976)',
  opinionUrl: 'https://law.justia.com/cases/florida/supreme-court/1976/48438-0.html',
  applyingCourtUrl: 'https://4dca.flcourts.gov/content/download/589625/opinion/Opinion_17-0787.pdf',
};
const packet = { speechAuthority, schemaVersion: 1, kind: 'florida_reviewed_closeout_corrections_without_receipt_renewal', effectiveDateEvidence, incorporatedConduct, baselineDrafts: baselineDrafts, documents: selected, definitions, analyses, report: assembled.report, eligibility };
validateFloridaCloseoutIncorporatedConduct(packet);
if (retained) validateFloridaCloseoutIncorporatedConduct(retained);
if (mode === '--prepare')
    fs.writeFileSync(output, encode(packet));
if (mode === '--check' && fs.readFileSync(output, 'utf8') !== encode(packet))
    throw Error('Correction packet reproduction drift');
if(mode === '--integrate') integrateFloridaCorrections(definitions, analyses, assembled, decisions, selected, originals);
console.log(JSON.stringify({ corrected: definitions.length, sections: plan.sections.length, receipt: 'unchanged; corrections do not authorize renewal or live availability' }));
