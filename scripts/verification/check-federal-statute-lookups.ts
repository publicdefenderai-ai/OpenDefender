/** Read-only smoke check against an app server configured with its OpenLaws key.
 * Usage: npx tsx scripts/verification/check-federal-statute-lookups.ts http://127.0.0.1:5000
 * Does not print credentials or statute bodies. Runs all ten federal examples, five state forms and one hyphenated federal citation
 * individually, then all sixteen together. The original filename remains for existing instructions.
 */
import { allStatuteLookups } from '../../tests/fixtures/federal-statute-lookups';
const base = new URL(process.argv[2] || 'http://127.0.0.1:5000');
if (!['http:', 'https:'].includes(base.protocol)) throw new Error('Expected an HTTP app URL');
let failed = false;
async function check(item: typeof allStatuteLookups[number], phase: string) {
  const start = Date.now();
  try {
    const response = await fetch(new URL(`/api/openlaws/citation/${encodeURIComponent(item.citation)}`, base), {
      signal: AbortSignal.timeout(40_000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    const statute = payload.statute;
    const segments = typeof statute?.path === 'string' ? statute.path.split('.') : [];
    const section = item.section.toLowerCase().replace(/[.:-]/g, '_');
    const correctSection = String(statute?.section ?? '').toLowerCase() === item.section.toLowerCase() ||
      segments.includes(`section_${section}`);
    const correctTitle = item.jurisdiction !== 'FED' || segments.includes(`title_${item.code}`);
    if (!payload.success || statute?.jurisdiction !== item.jurisdiction || !correctSection || !correctTitle ||
        typeof statute.content !== 'string' || !statute.content.trim()) throw new Error('Missing or mismatched statute');
    console.log(`${phase}: PASS ${item.citation} (${statute.content.length} characters, ${Date.now() - start}ms)`);
  } catch (error) {
    failed = true;
    console.log(`${phase}: FAIL ${item.citation} (${error instanceof Error ? error.message : 'lookup failed'})`);
  }
}
for (const item of allStatuteLookups) await check(item, 'individual');
await Promise.all(allStatuteLookups.map(item => check(item, 'together')));
console.log(`Checked ${allStatuteLookups.length} citations individually and together (${allStatuteLookups.length * 2} lookups).`);
process.exitCode = failed ? 1 : 0;
