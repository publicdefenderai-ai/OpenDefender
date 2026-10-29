import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import supplements from '../../../shared/california-conduct-supplements.json';
import corrections from '../../../shared/california-batch-six-corrections.json';
import pins from '../../../shared/california-retained-pins.json';
import benchmark from '../output/california-people-weapons-benchmark-source.json';
import { otherCodePriorityDocuments } from './other-code-priority-review';
import { sourceText } from './person-property-review';
import { getCaliforniaCanonicalRecord, getCaliforniaBatchCorrection } from '../../../shared/california-authority';
const ID = 'ca-prostitution-solicitation';
const hash = (value: unknown) => createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
export function buildEngagingConductReview() {
    const supplement = supplements.find(row => row.id === ID), original = corrections.find(row => row.id === ID);
    if (!supplement || !original)
        throw new Error('Missing conduct supplement or original correction');
    const versions = otherCodePriorityDocuments()['PEN:647'];
    if (versions?.length !== 1 || versions[0].activeFlag !== 'Y' || pins['PEN:647'].versions !== 1)
        throw new Error('Ambiguous or unmonitored source');
    const source = versions[0], text = sourceText(source.contentXml), url = new URL(source.sourceUrl);
    if (hash(source.contentXml) !== source.contentSha256 || source.lawCode !== 'PEN' || source.section !== '647.' || url.origin !== 'https://leginfo.legislature.ca.gov' || url.searchParams.get('lawCode') !== 'PEN' || url.searchParams.get('sectionNum') !== '647.')
        throw new Error('Source identity or text mismatch');
    const start = text.indexOf('(b) (1)'), end = text.indexOf('(c) Who', start);
    if (start < 0 || end <= start)
        throw new Error('Missing conduct or exception span');
    const instruction = benchmark.instructions.find(row => row.id === '1153');
    if (!instruction)
        throw new Error('Missing CALCRIM 1153');
    const pages = benchmark.pages.filter(p => p.page >= instruction.firstPage && p.page <= instruction.lastPage);
    if (!same(pages.map(p => ({ page: p.page, sha256: hash(p.text) })), instruction.pageHashes))
        throw new Error('Unbound instruction text');
    return {
        schemaVersion: 1, scope: 'existing_choice_conduct_supplement_not_new_charge',
        id: ID, sourceAsOf: '2026-09-24', originalCorrectionSha256: hash(original), supplementSha256: hash(supplement),
        source: { key: 'PEN:647', versionId: source.versionId, contentSha256: source.contentSha256, effectiveDate: source.effectiveDate, history: source.history, sourceUrl: source.sourceUrl, pin: pins['PEN:647'], start, end, text: text.slice(start, end) },
        instruction: { ...instruction, receipt: benchmark.receipt, pages: pages.map(p => ({ page: p.page, sha256: hash(p.text), text: p.text })) },
        product: { title: 'Prostitution: Soliciting, Agreeing, or Engaging', supplement },
        accounting: { updatedChoices: 1, newChoices: 0, newSections: 0, newVersions: 0 },
        comparisonUpdate: { instructionId: '1153', previousStatus: 'existing_choice_requires_conduct_comparison', status: 'bounded_engaging_conduct_summary_not_exhaustive_instruction_coverage' },
        limits: [
            'One existing identity receives a conduct clarification and inclusive title. No new offense, penalty, category, source pin or receipt change.',
            'CALCRIM 1153 supports the engaging-act explanation only. It is not a complete checklist for solicitation, agreement, defenses or the separate sentencing branches.',
            'Section 647(b)(1)-(5) supplies the receiving/paying distinctions, agreement requirements and child-recipient exclusion. The older generic instruction does not override those statutory limits.',
            'The retained 2026 instruction edition and statutory version are reused; this offline review does not establish new source currentness or live availability.',
            'Spanish and Chinese base summaries remain translated. Additional English detail is separate and labeled as untranslated; the base retains its provisional-translation notice.',
            'The earlier benchmark and closeout inventory remain historical records. Remaining weapons and benefit-program comparisons are not resolved by this supplement.',
        ],
    };
}
export type EngagingConductReview = ReturnType<typeof buildEngagingConductReview>;
export const readEngagingConductReview = () => JSON.parse(fs.readFileSync(new URL('../output/california-engaging-conduct-review.json', import.meta.url), 'utf8')) as EngagingConductReview;
export function validateEngagingConductReview(packet = readEngagingConductReview()) {
    if (!same(packet, buildEngagingConductReview()))
        throw new Error('Engaging conduct evidence or publication binding drift');
    const original = corrections.find(row => row.id === ID)!, supplement = packet.product.supplement;
    const record = getCaliforniaCanonicalRecord(ID), correction = getCaliforniaBatchCorrection(ID);
    if (!record?.selectable || record.officialTitle !== packet.product.title || record.penalty !== original.penalty.en || !same(record.categories, original.categories) || !same(record.elements, supplement.elements) || record.mentalState !== supplement.mentalState)
        throw new Error('Conduct identity, title or punishment drift');
    if (correction?.summary.en !== `${original.summary.en} ${supplement.summary}` || correction.summary.es !== original.summary.es || correction.summary.zh !== original.summary.zh || correction.translationStatus !== 'partial_translation_english_supplement' || correction.untranslatedSupplement.text !== supplement.summary)
        throw new Error('Unmarked language fallback');
    if (!record.sources.some(s => s.kind === 'jury-instruction' && s.citation === 'CALCRIM 1153'))
        throw new Error('Missing instruction citation');
    return packet.accounting;
}
export function renderEngagingConductReview(packet = readEngagingConductReview()) {
    validateEngagingConductReview(packet);
    return ['# California section 647(b): engaging conduct clarification', '', ...packet.limits.map(s => `- ${s}`), '', '## Product content', '', packet.product.title, '', packet.product.supplement.summary, '', '## Evidence', '', `- [Penal Code 647(b)(1)-(5)](${packet.source.sourceUrl}): retained version ${packet.source.versionId}, effective ${packet.source.effectiveDate}. Character offsets and content hash are bound in the JSON packet.`, `- [CALCRIM 1153](${packet.instruction.receipt.sourceUrl}): ${packet.instruction.receipt.edition}; PDF pages ${packet.instruction.firstPage} through ${packet.instruction.lastPage} (printed pages 929 through 930).`, '', 'Configured selections remain 689. One existing choice is improved; the historical comparison is not relabeled as exhaustive coverage.', ''].join('\n');
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const packet = buildEngagingConductReview();
    validateEngagingConductReview(packet);
    fs.writeFileSync(new URL('../output/california-engaging-conduct-review.json', import.meta.url), JSON.stringify(packet, null, 2) + '\n');
    fs.writeFileSync(new URL('../output/california-engaging-conduct-review.md', import.meta.url), renderEngagingConductReview(packet));
    console.log(JSON.stringify(packet.accounting));
}
