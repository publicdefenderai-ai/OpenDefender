/** Candidate evidence only. Does not issue or persist a receipt. */
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS, ohioChapter2903Evidence } from '../../server/data/ohio-chapter-2903-source';
import { extractOhioPilotComparisonText } from '../../server/data/ohio-chapter-2903-comparison';
import { OHIO_REVIEWED_SOURCES } from '../../server/data/ohio-reviewed-source';
import { OHIO_MAJOR_SOURCES } from '../../server/data/ohio-major-source';
import { extractOhioDocument } from './ohio-discovery/section-document';
import { buildOhioReviewedQuarterlyReceipt, extractReviewedOhioRule } from './refresh-ohio-reviewed-sources';
import { expectedDocuments as pilotReceiptDocuments, validateOhioChapter2903RefreshReceipt } from '../../server/data/ohio-chapter-2903-refresh';
import { QUARTERLY_POLICY, quarterlyDeadline } from '../../shared/source-verification-policy.mjs';

const output = 'scripts/data-review/output/ohio-quarterly-comparison-candidate.json';
const families = ['pilot', 'reviewed', 'major'] as const;
type Family = typeof families[number];
type Status = 'unchanged' | 'changed' | 'unavailable';
type Document = { section: string; title: string; sourceUrl: string; effectiveDateStart: string; text: string; contentHash: string };
type Binding = { document: Document; chargeIds: Set<string> };
type Page = { url: string; retrievedAt: string; status: number; html: string; pageHash?: string };
const hash = (text: string) => createHash('sha256').update(text).digest('hex');

export function ohioComparisonInventory() {
  const inventory = new Map<string, Map<Family, Binding>>();
  function add(family: Family, id: string, document: Document) {
    const {section, sourceUrl} = document;
    const url = section === 'OAC:3701-12-01' ? 'https://codes.ohio.gov/ohio-administrative-code/rule-3701-12-01'
      : /^\d+\.\d+$/.test(section) ? `https://codes.ohio.gov/ohio-revised-code/section-${section}` : '';
    if (!url || sourceUrl !== url || hash(document.text) !== document.contentHash) throw Error(`Invalid reviewed pin: ${family}/${section}`);
    const siblings = inventory.get(url) ?? new Map<Family, Binding>();
    const binding = siblings.get(family) ?? { document, chargeIds: new Set<string>() };
    if (binding.document.contentHash !== document.contentHash || binding.document.title !== document.title ||
        binding.document.effectiveDateStart !== document.effectiveDateStart) throw Error(`Inconsistent reviewed versions: ${family}/${section}`);
    binding.chargeIds.add(id); siblings.set(family, binding); inventory.set(url, siblings);
  }
  for (const row of OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS) {
    for (const {document} of ohioChapter2903Evidence(row)) add('pilot', row.chargeId, document);
  }
  for (const [family, records] of [['reviewed', OHIO_REVIEWED_SOURCES], ['major', OHIO_MAJOR_SOURCES]] as const) {
    for (const row of records) for (const doc of [row.offense, ...row.dependencies]) add(family, row.chargeId, doc);
  }
  return inventory;
}

export function compareOhioPage(family: Family, pin: Document, page: Page) {
  if (pin.sourceUrl !== page.url || !Number.isFinite(Date.parse(page.retrievedAt)) ||
      page.retrievedAt !== new Date(page.retrievedAt).toISOString() || Date.parse(page.retrievedAt) > Date.now() ||
      (page.status === 200 && hash(page.html) !== page.pageHash)) throw Error(`Invalid acquisition binding: ${pin.section}`);
  const expected = {title:pin.title, effectiveDateStart:pin.effectiveDateStart, contentHash:pin.contentHash};
  if (page.status !== 200) return {status:'unavailable' as const, expected, observed:null, reason:'http_or_transport_failure'};
  const retrieved = new Date(page.retrievedAt);
  let extracted: {title: string; text: string; effectiveDateStart?: string | null} | null;
  if (family === 'pilot') {
    const result = extractOhioPilotComparisonText(page.html, pin.section, pin.sourceUrl);
    extracted = result && {...result, effectiveDateStart:result.effectiveDate};
  } else if (pin.section === 'OAC:3701-12-01') {
    try { extracted = extractReviewedOhioRule(page.html, pin.sourceUrl, retrieved); }
    catch { extracted = null; }
  } else {
    extracted = extractOhioDocument(page.html, pin.section, pin.sourceUrl, retrieved);
  }
  if (!extracted?.effectiveDateStart || extracted.effectiveDateStart > page.retrievedAt.slice(0,10)) {
    return {status:'unavailable' as const, expected, observed:null, reason:'operative_section_not_established'};
  }
  const observed = {title:extracted.title, effectiveDateStart:extracted.effectiveDateStart, contentHash:hash(extracted.text)};
  const same = observed.title === expected.title && observed.effectiveDateStart === expected.effectiveDateStart &&
    observed.contentHash === expected.contentHash && extracted.text === pin.text;
  return {status: same ? 'unchanged' as const : 'changed' as const, expected, observed,
    ...(same ? {} : {observedText:extracted.text})};
}

const filename = (url: string) => encodeURIComponent(url) + '.json';
const rank: Record<Status, number> = {unchanged:0, changed:1, unavailable:2};
export function buildOhioComparison(directory: string) {
  const inventory = ohioComparisonInventory();
  const sources = [...inventory].sort(([a],[b])=>a.localeCompare(b)).map(([url, bindings])=>{
    const page = JSON.parse(readFileSync(join(directory, filename(url)), 'utf8')) as Page;
    const comparisons = [...bindings].map(([family, binding])=>({family, section:binding.document.section,
      chargeIds:[...binding.chargeIds].sort(), ...compareOhioPage(family, binding.document, page)}));
    return {url, retrievedAt:page.retrievedAt, httpStatus:page.status, pageHash:page.pageHash ?? null, comparisons};
  });
  const groups = families.map(family=>{
    const rows = sources.flatMap(source=>source.comparisons.filter(row=>row.family===family));
    const ids = new Map<string, Status>();
    for (const row of rows) for (const id of row.chargeIds) {
      const previous = ids.get(id);
      if (!previous || rank[row.status]>rank[previous]) ids.set(id,row.status);
    }
    const acquisitions = sources.flatMap(source=>source.comparisons.filter(row=>row.family===family)
      .map(row=>({section:row.section,contentHash:row.expected.contentHash,retrievedAt:source.retrievedAt})));
    const times=acquisitions.map(row=>Date.parse(row.retrievedAt));
    const firstAcquiredAt=new Date(Math.min(...times)).toISOString();
    const lastAcquiredAt=new Date(Math.max(...times)).toISOString();
    let quarterlyReadiness = 'blocked_by_comparison';
    if (rows.every(row=>row.status==='unchanged')) {
      if (family==='major') {
        quarterlyReadiness='requires_acquisition_bound_quarterly_validator';
      } else {
        // Exercise the issuance contracts in memory only. No active receipt is written.
        if (family==='reviewed') buildOhioReviewedQuarterlyReceipt(acquisitions,new Date(lastAcquiredAt));
        else {
          const error=validateOhioChapter2903RefreshReceipt({schemaVersion:1,verificationPolicy:QUARTERLY_POLICY,
            checkedAt:lastAcquiredAt,expiresAt:quarterlyDeadline(firstAcquiredAt),documents:pilotReceiptDocuments()},new Date(lastAcquiredAt));
          if (error) throw Error(error);
        }
        quarterlyReadiness = family==='pilot' ? 'compatible_requires_independent_shared_pilot_approval' : 'compatible_requires_separate_approval';
      }
    }
    const idsFor = (status:Status) => [...ids].filter(([,s])=>s===status).map(([id])=>id).sort();
    return {family, sections:rows.length, charges:ids.size, firstAcquiredAt, lastAcquiredAt, quarterlyReadiness,
      sectionsByStatus:Object.fromEntries(Object.keys(rank).map(status=>[status,rows.filter(row=>row.status===status).length])),
      chargeIdsByStatus:{unchanged:idsFor('unchanged'),changed:idsFor('changed'),unavailable:idsFor('unavailable')}};
  });
  return {schemaVersion:1, purpose:'candidate_source_comparison_only', groups, sources};
}

async function acquire() {
  const directory = mkdtempSync(join(tmpdir(), 'ohio-quarterly-pages-'));
  console.log(`Official response cache: ${directory}`);
  for (const url of [...ohioComparisonInventory().keys()].sort()) {
    let page: Page;
    try {
      const response=await fetch(url,{headers:{Accept:'text/html'},redirect:'manual',signal:AbortSignal.timeout(20000)});
      const html=response.ok ? await response.text() : '';
      page={url,retrievedAt:new Date().toISOString(),status:response.status,html,pageHash:hash(html)};
    } catch {
      page={url,retrievedAt:new Date().toISOString(),status:0,html:''};
    }
    writeFileSync(join(directory,filename(url)),JSON.stringify(page));
    if (page.status === 429) throw Error('Publisher throttled acquisition. Stop and retry later.');
    await new Promise(resolve=>setTimeout(resolve,1000));
  }
  return directory;
}

async function main() {
  const args=process.argv.slice(2);
  const directory=args.length===1 && args[0]==='--acquire' ? await acquire() :
    (args.length===2 || (args.length===3 && args[2]==='--check')) && args[0]==='--replay' ? args[1] : null;
  if (!directory) throw Error('Use --acquire or --replay PATH [--check].');
  const candidate=buildOhioComparison(directory);
  const rendered=JSON.stringify(candidate,null,2)+'\n';
  if (args.includes('--check')) {
    if (readFileSync(output,'utf8')!==rendered) throw Error('Candidate differs from retained official responses');
  } else writeFileSync(output,rendered);
  console.log(JSON.stringify(candidate.groups.map(({family,sections,charges,sectionsByStatus})=>({family,sections,charges,sectionsByStatus}))));
}

if (process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  main().catch(error=>{console.error(error.message);process.exitCode=1;});
}
