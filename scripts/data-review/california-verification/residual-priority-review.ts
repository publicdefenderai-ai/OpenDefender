import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import inventory from '../output/california-closeout-inventory.json';
import benefits from '../output/california-other-code-priority-review.json';
import research from '../output/california-people-weapons-acquisition.json';
import benchmark from '../output/california-people-weapons-benchmark-source.json';
import { otherCodePriorityDocuments } from './other-code-priority-review';
import { readEngagingConductReview, validateEngagingConductReview } from './engaging-conduct-review';
import { sourceText } from './person-property-review';
const hash = (v: unknown) => createHash('sha256').update(typeof v === 'string' ? v : JSON.stringify(v)).digest('hex');
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const comparisonIds = ['1153', '2530', '2560', '2561'];
const sourceKeys = ['PEN:25850', 'PEN:30600', 'PEN:30615', 'WIC:10980', 'BPC:7028'];
export function buildResidualPriorityReview() {
    validateEngagingConductReview();
    const published = otherCodePriorityDocuments();
    const sources = sourceKeys.map(key => {
        // A research copy must never shadow a later reviewed version.
        const versions = published[key] ?? (research.documents as typeof published)[key];
        if (versions?.length !== 1)
            throw new Error('Missing or ambiguous retained source: ' + key);
        const v = versions[0], url = new URL(v.sourceUrl), text = sourceText(v.contentXml);
        if (v.activeFlag !== 'Y' || hash(v.contentXml) !== v.contentSha256 || `${v.lawCode}:${v.section.replace(/\.$/, '')}` !== key || url.origin !== 'https://leginfo.legislature.ca.gov' || `${url.searchParams.get('lawCode')}:${url.searchParams.get('sectionNum')?.replace(/\.$/, '')}` !== key)
            throw new Error('Retained source identity or text drift: ' + key);
        return { key, retention: published[key] ? 'reviewed_source_pool' : 'research_only_not_promoted', versionId: v.versionId, contentSha256: v.contentSha256, effectiveDate: v.effectiveDate, history: v.history, sourceUrl: v.sourceUrl, text };
    });
    const span = (key: string, startText: string, endText?: string) => {
        const source = sources.find(s => s.key === key);
        if (!source)
            throw new Error('Missing source for span');
        const start = source.text.indexOf(startText), end = endText ? source.text.indexOf(endText, start + startText.length) : source.text.length;
        if (start < 0 || end <= start)
            throw new Error('Missing or inverted subdivision span: ' + key);
        return { key, start, end, text: source.text.slice(start, end) };
    };
    const priorComparisons = comparisonIds.map(id => {
        const rows = inventory.comparisons.filter(r => r.family === 'people-weapons' && r.instructionId === id);
        if (rows.length !== 1)
            throw new Error('Missing or duplicate prior comparison: ' + id);
        return { instructionId: id, status: rows[0].status, sha256: hash(rows[0]) };
    });
    const instruction = benchmark.instructions.find(i => i.id === '2561');
    if (!instruction)
        throw new Error('Missing instruction 2561');
    const pages = benchmark.pages.filter(p => p.page >= instruction.firstPage && p.page <= instruction.lastPage);
    if (!same(instruction.pageHashes, pages.map(p => ({ page: p.page, sha256: hash(p.text) }))))
        throw new Error('Instruction page binding drift');
    const conductWork = [
        { id: 'PEN:25850', scope: 'Loaded-firearm carrying: conduct, grading branches, exceptions and enforceability', status: 'unpublished_priority', evidence: span('PEN:25850', '(a) A person'), next: 'Reconcile the carrying exceptions and predicate-dependent grading with the retained section before preparing selectable branches. No generic misdemeanor default is assigned.' },
        { id: 'PEN:30600(a)', scope: 'Assault-weapon or .50 BMG rifle manufacture, transfer and related conduct', status: 'existing_possession_choice_does_not_cover_sibling_conduct', evidence: span('PEN:30600', '(a) Any person', '(b) In addition'), next: 'Reconcile weapon definitions, chapter exceptions, conduct-specific knowledge requirements and enforceability. Preserve the existing possession decision; it is not blanket approval of this sibling.' },
        { id: 'WIC:10980(d)', scope: 'Unauthorized blank program authorizations with intent to defraud', status: 'unpublished_program_dependencies', evidence: span('WIC:10980', '(d) Any person', '(e) Any person'), next: 'Bind the Chapter 10 program authorization rules and sentencing dependencies. Do not collapse blank authorizations into ordinary aid overpayments.' },
        { id: 'WIC:10980(e)', scope: 'Counterfeit or altered program authorizations and benefits', status: 'unpublished_program_and_penalty_dependencies', evidence: span('WIC:10980', '(e) Any person', '(f) Any person'), next: 'Bind the incorporated federal authorization rules and applicable forgery punishment. Do not copy the adjacent subdivision penalty.' },
        { id: 'WIC:10980(f)', scope: 'Entrusted public employee appropriation of benefits or authorizations', status: 'unpublished_program_and_penalty_dependencies', evidence: span('WIC:10980', '(f) Any person', '(g) Any person'), next: 'Bind public-funds embezzlement punishment and applicable program definitions, plus the (h), (i), and (j) provisions retained below.' },
        { id: 'WIC:10980(g)(1)', scope: 'Unauthorized benefits or authorizations: face value $950 or less', status: 'unpublished_program_dependencies', evidence: span('WIC:10980', '(g) Any person', '(h) (1)'), next: 'Bind authorized-use rules and the valuation language, including electronic benefits. Exactly $950 is in the lower branch; it is not evidence of authorized use.' },
        { id: 'WIC:10980(g)(2)', scope: 'Unauthorized benefits or authorizations: face value more than $950', status: 'unpublished_program_dependencies', evidence: span('WIC:10980', '(g) Any person', '(h) (1)'), next: 'Bind authorized-use rules, valuation and both punishment alternatives, with the (h), (i), and (j) provisions retained below.' },
    ];
    const additionalPunishment = [
        { id: 'PEN:30615', kind: 'additional_punishment', evidence: span('PEN:30615', 'Notwithstanding'), treatment: 'Keep visible as an additional-punishment dependency, not a new independent conduct choice. CALCRIM 2561 expressly discusses a separate-count and enhancement setting; this accounting does not decide pleading treatment or imply that the provision cannot appear on charging papers.' },
        { id: 'PEN:30600(b)-(c)', kind: 'enhancement_and_offense_unit_rules', evidence: span('PEN:30600', '(b) In addition'), treatment: 'Retain the minor-transfer enhancement and multiple-weapon offense-unit rule with the pending conduct group. Neither is silently absorbed into an ordinary custody ceiling.' },
        { id: 'WIC:10980(h)', kind: 'electronic_transfer_additional_terms', evidence: span('WIC:10980', '(h) (1)', '(i) A person'), treatment: 'Retain thresholds and common-scheme aggregation for (f)/(g) violations or attempts; do not count the four additional terms as four new ordinary charges.' },
        { id: 'WIC:10980(i)', kind: 'additional_term_limitation', evidence: span('WIC:10980', '(i) A person', '(j) (1)'), treatment: 'Preserve the restriction on adding (h) punishment when another law supplies an additional term for the (f)/(g) violation.' },
    ];
    return { schemaVersion: 1, scope: 'residual_priority_accounting_not_publication_or_currentness', sourceAsOf: '2026-09-24', priorComparisons, benefitScopeSha256: hash(benefits.remainingScopes), engagingReviewSha256: hash(readEngagingConductReview()), sources,
        instruction: { ...instruction, receipt: benchmark.receipt, pages: pages.map(p => ({ page: p.page, sha256: hash(p.text), text: p.text })) },
        completedBoundedComparison: { instructionId: '1153', status: 'bounded_engaging_conduct_summary_not_exhaustive_instruction_coverage', chargeId: 'ca-prostitution-solicitation' },
        conductWork, additionalPunishment,
        sharedProtection: { id: 'WIC:10980(j)', evidence: span('WIC:10980', '(j) (1)'), treatment: 'Keep the specified overpayment prosecution bar and authorized-delay exceptions in the benefit-program review; (a)-(c) publication does not close (d)-(g).' },
        carriedLimitation: { id: 'BPC:7028(c)', status: 'repeat_branch_upper_custody_limit_not_quantified_in_product', evidence: span('BPC:7028', '(c) If a person', '(d) A third') },
        counts: { conductFollowUpUnits: conductWork.length, additionalPunishmentOrLimitationGroups: additionalPunishment.length, newChoices: 0, newPins: 0, receiptRenewals: 0 },
        limits: ['Follow-up units are work groups, not an offense denominator or a count of charges to publish.', 'Research-only sources remain separate from publication pins and runtime receipts. Active flags describe the retained snapshot, not a new currentness determination.', 'No existing attorney decision, source hold, transition or approved product entry is cleared, replaced or activated.', 'The frozen closeout inventory remains unchanged. This successor resolves classification of the residual work, not statewide completeness.', 'No low-volume or uncertain branch is silently declared minor or complete.'] };
}
export type ResidualPriorityReview = ReturnType<typeof buildResidualPriorityReview>;
export const readResidualPriorityReview = () => JSON.parse(fs.readFileSync(new URL('../output/california-residual-priority-review.json', import.meta.url), 'utf8')) as ResidualPriorityReview;
export function validateResidualPriorityReview(packet = readResidualPriorityReview()) {
    if (!same(packet, buildResidualPriorityReview()))
        throw new Error('Residual priority evidence or accounting drift');
    return packet.counts;
}
export function renderResidualPriorityReview(packet = readResidualPriorityReview()) {
    validateResidualPriorityReview(packet);
    return ['# California remaining priority work: conduct and additional punishment', '', ...packet.limits.map(s => `- ${s}`), '', 'The section 647(b) engaging-conduct comparison now has a bounded supplement. Two weapons work groups and five benefit-program branch work units remain below. No new charge is published by this packet.', '', '## Conduct work', '', ...packet.conductWork.flatMap(r => [`### ${r.id}: ${r.scope}`, '', r.next, '']), '## Additional punishment and limitations', '', ...packet.additionalPunishment.flatMap(r => [`### ${r.id}`, '', r.treatment, '']), '## Shared protections and carried limitations', '', packet.sharedProtection.treatment, '', 'BPC 7028(c): the existing repeat-contracting upper-custody limitation remains open.', '', '## Retained evidence', '', ...packet.sources.map(s => `- [${s.key}](${s.sourceUrl}): ${s.retention}; version ${s.versionId}; effective metadata ${s.effectiveDate}.`), `- [CALCRIM 2561](${packet.instruction.receipt.sourceUrl}): ${packet.instruction.receipt.edition}, PDF pages ${packet.instruction.firstPage} through ${packet.instruction.lastPage}.`, '', 'Subdivision spans, source hashes, full retained metadata history, and instruction page bindings are in the JSON packet.', ''].join('\n').replace(/[\u2013\u2014]/g, ':');
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const p = buildResidualPriorityReview();
    validateResidualPriorityReview(p);
    fs.writeFileSync(new URL('../output/california-residual-priority-review.json', import.meta.url), JSON.stringify(p, null, 2) + '\n');
    fs.writeFileSync(new URL('../output/california-residual-priority-review.md', import.meta.url), renderResidualPriorityReview(p));
    console.log(JSON.stringify(p.counts));
}
