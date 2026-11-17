import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, realpathSync, writeFileSync, readdirSync } from 'node:fs';
import { isAbsolute, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { extractExactFloridaDocument, extractFloridaEdition, floridaSectionUrl, type FloridaBatchDocument } from '../batch/florida-adapter';
import { FLORIDA_REVIEWED_SOURCE_RECORDS } from '../../../server/data/florida-reviewed-source-records';

const hash = (data: string | Buffer) => createHash('sha256').update(data).digest('hex');
const load = (path: string) => JSON.parse(readFileSync(path,'utf8'));
const pause = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export function compareRetainedDocuments(retained: Array<{text:string;contentHash:string;title:string;effectiveDateStart:string|null}>, candidate: FloridaBatchDocument | null) {
  if (!candidate) return 'unavailable_or_unresolved';
  if (retained.some(doc => hash(doc.text) !== doc.contentHash)) throw Error('Invalid retained source hash');
  if (retained.some(doc => doc.text !== candidate.text)) {
    if (retained.every(doc => doc.text.replace(/\s+/g,' ').trim() === candidate.text.replace(/\s+/g,' ').trim())) return 'extraction_formatting_difference';
    return 'source_text_difference_requires_review';
  }
  if (retained.some(doc => doc.title !== candidate.title || doc.effectiveDateStart !== candidate.effectiveDateStart)) return 'version_metadata_difference_requires_review';
  return 'matching_text_and_retained_metadata';
}
export async function compareFloridaReviewedSources(directory: string, replay = false) {
  if (!isAbsolute(directory)) throw Error('Use an absolute candidate directory outside the checkout');
  const requested = relative(realpathSync(process.cwd()), resolve(directory));
  if (!requested.startsWith('..')) throw Error('Candidate directory must be outside the checkout');
  mkdirSync(directory,{recursive:true});
  const output = realpathSync(directory), repository = realpathSync(process.cwd());
  const relation = relative(repository, output);
  if (!relation.startsWith('..')) throw Error('Candidate directory must be outside the checkout');
  const active = [
    'scripts/data-review/output/florida-reviewed-analysis.json',
    'scripts/data-review/output/florida-reviewed-refresh-receipt.json',
    'scripts/data-review/output/florida-batch-source-cache.json',
    'shared/florida-reviewed-eligibility.json',
    ...readdirSync('shared/florida-reviewed-data').filter(name => name.endsWith('.json')).map(name=>'shared/florida-reviewed-data/'+name),
  ];
  const before = Object.fromEntries(active.map(path=>[path,hash(readFileSync(path))]));
  const report = load(active[0]);
  const sections = [...new Set(FLORIDA_REVIEWED_SOURCE_RECORDS.flatMap(row=>row.dependencies.map(doc=>doc.section)))].sort();
  const rows = [];
  for (const section of sections) {
    const url = floridaSectionUrl(section), base = resolve(output, section);
    const related = FLORIDA_REVIEWED_SOURCE_RECORDS.filter(row=>row.dependencies.some(doc=>doc.section===section)).map(row=>row.chargeId);
    let candidate: FloridaBatchDocument | null = null, error: string | null = null, edition: string | null = null;
    try {
      if (!replay) {
        execFileSync('curl',['--fail','--silent','--show-error','--max-time','35','--max-filesize','5000000',url,'-o',base+'.html'],{stdio:'pipe'});
        writeFileSync(base+'.acquisition.json',JSON.stringify({url,retrievedAt:new Date().toISOString(),responseSha256:hash(readFileSync(base+'.html'))},null,2)+'\n');
      }
      const acquisition = load(base+'.acquisition.json');
      const html = readFileSync(base+'.html','utf8');
      if (acquisition.url!==url || acquisition.responseSha256!==hash(html)) throw Error('Candidate acquisition binding mismatch');
      edition = extractFloridaEdition(html);
      if (edition !== 'Florida Statutes 2026') throw Error('Unexpected official edition: '+edition);
      candidate = extractExactFloridaDocument(html,section,url,new Date(acquisition.retrievedAt),edition);
      if (!candidate) throw Error('Official section structure missing');
      writeFileSync(base+'.candidate.json',JSON.stringify(candidate,null,2)+'\n');
    } catch (cause) {
      error = cause instanceof Error ? cause.message.split('\n')[0] : String(cause);
    }
    const retained = Object.values(report.sourceEvidence).filter((doc:any)=>doc.section===section) as Array<{text:string;contentHash:string;title:string;effectiveDateStart:string|null}>;
    if (!retained.length) throw Error('Missing retained dependency '+section);
    rows.push({section,url,edition,classification:compareRetainedDocuments(retained,candidate),error,affectedChargeIds:related,
      responseSha256: candidate ? hash(readFileSync(base+'.html')) : null,
      retainedHashes:[...new Set(retained.map(doc=>doc.contentHash))],candidateHash:candidate?.contentHash??null,
      retrievedAt:candidate?.retrievedAt??null,effectiveDateStart:candidate?.effectiveDateStart??null,
      operativeDateSignals:candidate?.text.split('\n').filter(line=>/effective|repeal|expires|contingent|taking effect/i.test(line))??[],
      currentnessReview:'Text/metadata comparison alone does not approve legal applicability or receipt issuance'});
    if (!replay) await pause(400);
  }
  const recordCoverage = FLORIDA_REVIEWED_SOURCE_RECORDS.map(record => {
    const bindings = record.dependencies.map(dependency => {
      const retained = report.sourceEvidence[dependency.sourceKey];
      const comparison = rows.find(row => row.section === dependency.section);
      if (!retained || retained.contentHash !== dependency.contentHash || !comparison
          || !comparison.affectedChargeIds.includes(record.chargeId)) throw Error('Incomplete dependency coverage for '+record.chargeId);
      return {sourceKey:dependency.sourceKey,section:dependency.section,retainedHash:dependency.contentHash,
        classification:comparison.classification,candidateHash:comparison.candidateHash};
    });
    return {id:record.chargeId,complete:bindings.every(binding=>binding.classification==='matching_text_and_retained_metadata'),bindings};
  });
  if (new Set(recordCoverage.map(record=>record.id)).size!==FLORIDA_REVIEWED_SOURCE_RECORDS.length) throw Error('Duplicate reviewed identity');
  const after = Object.fromEntries(active.map(path=>[path,hash(readFileSync(path))]));
  if (JSON.stringify(before)!==JSON.stringify(after)) throw Error('Active inputs changed during candidate comparison');
  const result = {schemaVersion:1,scope:'candidate_only_florida_reviewed_restoration',checkedAt:new Date().toISOString(),
    baselineCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),activeBefore:before,activeAfter:after,
    summary:rows.reduce((counts:Record<string,number>,row)=>({...counts,[row.classification]:(counts[row.classification]??0)+1}),{}),
    sectionCount:sections.length,chargeCount:FLORIDA_REVIEWED_SOURCE_RECORDS.length,recordCoverage,rows};
  writeFileSync(resolve(output,'comparison.json'),JSON.stringify(result,null,2)+'\n');
  return result;
}
if (process.argv[1] && import.meta.url===pathToFileURL(resolve(process.argv[1])).href) {
  const dir=process.argv[2];
  if (!dir) throw Error('Pass an absolute candidate output directory outside the checkout, optionally followed by --replay');
  const result=await compareFloridaReviewedSources(dir,process.argv[3]==='--replay');
  console.log(JSON.stringify({sections:result.sectionCount,records:result.chargeCount,summary:result.summary}));
}
