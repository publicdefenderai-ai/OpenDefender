/** Offline subdivision-level verification; never changes catalog, receipts or approval state. */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import plan from './ohio-residual-plan.json';
import { bind, division } from './ohio-major-substantive';
type Doc = Parameters<typeof bind>[0];
const hash = (text: string) => createHash('sha256').update(text).digest('hex');
const output = 'scripts/data-review/output/';
export function retainedDocuments() {
  const documents: Record<string, Doc> = {};
  for (const name of ['ohio-major-coverage-evidence.json','ohio-major-substantive-evidence.json','ohio-residual-supplemental-evidence.json']) {
    const packet = JSON.parse(readFileSync(output + name, 'utf8'));
    for (const [key, doc] of Object.entries(packet.documents) as [string,Doc][]) {
      bind(doc);
      if (key !== doc.section || doc.sourceUrl !== `https://codes.ohio.gov/ohio-revised-code/section-${key}` ||
          !doc.text.startsWith(`Section ${key} |\n${doc.title}.\nEffective: ${doc.effectiveDateStart}\n`) ||
          !Number.isFinite(Date.parse(doc.effectiveDateStart)) || Date.parse(doc.effectiveDateStart) > Date.parse(doc.retrievedAt)) throw Error(`Invalid official identity ${key}`);
      if (documents[key] && documents[key].contentHash !== doc.contentHash) throw Error(`Conflicting evidence ${key}`);
      documents[key] = doc;
    }
  }
  return documents;
}
/** Supported grammar: top-level letter, optional numbered child. Reject rather than guess deeper paths. */
export function subdivision(doc: Doc, path: string) {
  const parsed = /^([A-Z])(?:\((\d+)\))?$/.exec(path);
  if (!parsed) throw Error(`Unsupported subdivision ${path}`);
  const parent = division(doc, parsed[1]);
  if (!parsed[2]) return parent;
  // First child may share the parent's line: (C)(1), or (C) (1).
  const children = [...parent.text.matchAll(/^(?:\([A-Z]\)\s*)?\((\d+)\)/gm)];
  const matches = children.map((m,i) => ({m,i})).filter(({m}) => m[1] === parsed[2]);
  if (matches.length !== 1) throw Error(`Missing or ambiguous subdivision ${doc.section}(${path})`);
  const {m,i} = matches[0];
  return bind(doc, parent.start + m.index!, parent.start + (children[i+1]?.index ?? parent.text.length));
}
function conduct(doc: Doc, paths: string[]) {
  const preambles = [...new Set(paths.filter(p => p.includes('(')).map(p => p[0]))].flatMap(letter => {
    const parent = division(doc, letter);
    const child = /^(?:\([A-Z]\)\s*)?\(\d+\)/m.exec(parent.text);
    if (!child || child.index === 0) return [];
    return [{role:'shared_conduct_preamble',path:letter,evidence:bind(doc,parent.start,parent.start+child.index)}];
  });
  return [...preambles, ...paths.map(path => ({role:'included_conduct',path,evidence:subdivision(doc,path)}))];
}
export function buildOhioResidual(documents = retainedDocuments()) {
  const priorBytes = readFileSync(output+'ohio-major-substantive-mapping.json','utf8');
  const prior = JSON.parse(priorBytes);
  const required = (section: string) => { if (!documents[section]) throw Error(`Missing dependency ${section}`); bind(documents[section]); return documents[section]; };
  const records = plan.map(row => {
    const old = prior.records.find((r: any) => r.id === row.mappingId);
    if (!old || old.section !== row.section || old.scope !== row.scope) throw Error(`Unmapped residual ${row.mappingId}`);
    const doc = required(row.section);
    if (doc.contentHash !== old.completePrimary.sourceHash) throw Error(`Primary source changed ${row.section}`);
    if (old.namingBasis.startsWith('official_heading') ? old.statutoryName !== doc.title :
        !old.grading.some((span: any) => span.text.includes(`guilty of ${old.statutoryName}`))) throw Error(`Unbound name ${row.section}`);
    const rules = row.penaltyRules.map(rule => {
      const evidence = subdivision(doc,rule.path);
      for (const grade of rule.grades) {
        const degree = ['','first','second','third','fourth','fifth'][Number(grade.slice(1))];
        if (!evidence.text.includes(`${grade[0]==='F'?'felony':'misdemeanor'} of the ${degree} degree`)) throw Error(`Unbound grade ${row.mappingId}/${grade}`);
      }
      return {...rule,evidence};
    });
    const dependencyChanges = {
      added: row.dependencies.filter(k => !old.dependencies.some((d: any) => d.section===k)),
      removedFromApplicableScope: old.dependencies.filter((d: any) => !row.dependencies.includes(d.section)).map((d: any)=>d.section),
    };
    return {id:row.mappingId,section:row.section,scope:row.scope,statutoryName:old.statutoryName,namingBasis:old.namingBasis,
      status:'subdivision_verified_not_publication_or_activation',conduct:conduct(doc,row.conductPaths),penaltyRules:rules,
      completePrimaryContext:bind(doc),dependencies:row.dependencies.map(k=>bind(required(k))),dependencyChanges};
  });
  if (records.length!==14 || new Set(records.map(r=>r.id)).size!==14) throw Error('Residual mapping accounting mismatch');
  // Separate context: this definition does not resolve the held hospital reference.
  const excludedContext = [{section:'2909.04',scope:'A(3)',status:'still_excluded_3727_01_unresolved',
    incorporation:subdivision(required('2909.04'),'D(1)'),definition:subdivision(required('2133.21'),'F')}];
  const sentencingSections=['2929.13','2929.14','2929.144','2929.18','2929.24','2929.28','2929.32','2971.03'];
  return {schemaVersion:1,kind:'ohio_residual_subdivision_verification',baselineSha256:hash(priorBytes),
    planSha256:hash(JSON.stringify(plan)),counts:{mappings:records.length,sections:new Set(records.map(r=>r.section)).size,
      penaltyRules:records.reduce((n,r)=>n+r.penaltyRules.length,0)},
    boundaries:['No catalog, runtime source, receipt, hold, attorney decision or database changes.',
      'Whole-primary context is not selectable conduct. Only included_conduct spans define the mapped scope.',
      'Grade rules are statutory branches, not individual sentencing advice or a comprehensive recursive dependency certificate.',
      'Existing section 1509.01 hold and 2909.04(A)(3) exclusion remain unchanged.',
      'Publication still requires branch-specific sentencing implementation, exemptions, evidence currency and approved import.'],
    records,excludedContext,sharedSentencingContext:sentencingSections.map(k=>bind(required(k)))};
}
export function renderOhioResidual(packet: ReturnType<typeof buildOhioResidual>) {
  const lines=['# Ohio residual subdivision verification','',
    'This packet advances all fourteen unpublished mappings from the first major-offense batch. It does not add selectable charges, renew evidence, or repeat resolved attorney questions.','',
    '| Section | Scope | Statutory identity | Penalty branches |','| --- | --- | --- | --- |'];
  for(const row of packet.records) lines.push(`| ${row.section} | ${row.scope} | ${row.statutoryName} | ${row.penaltyRules.map(r=>r.path).join(', ')} |`);
  lines.push('','## Material corrections','',
    '- Abduction now binds the sexual-motivation definition to 2971.01, preserving the same correction already merged for unlawful restraint.',
    '- Document servitude retains all nine listed predicate sections, including 2907.321, 2907.322 and 2907.323.',
    '- Extortion retains both listed menacing predicates. Sexual-extortion definitions and allied-offense language have their supporting state sections attached.',
    '- Trafficking retains its actual local developmental-disability definition and its 2929.01 material/performance definition, instead of treating 5123.01 as the incorporated definition.',
    '- The three usury entries now bind only their own numbered conduct paragraph. Public-service disruption excludes A(3); criminal mischief excludes A(7). Whole sections remain separately labeled context.',
    '- The 2133.21(F) emergency-personnel definition is bound to 2909.04(D)(1) as excluded-branch context. It does not clear the unresolved 3727.01 dependency.',
    '', '## Penalty distinctions retained','');
  for(const row of packet.records) {
    lines.push(`### ${row.section}: ${row.statutoryName} (${row.scope})`,'');
    for(const rule of row.penaltyRules) lines.push(`- ${rule.path}: ${rule.application}`);
    lines.push('');
  }
  lines.push('## Reuse and next step','',
    'Previously retained primary sources are reused without changing acquisition dates. Only two absent dependency documents were acquired: 2903.22 and 2907.323. Source bodies, exact spans, hashes, dates and URLs are retained in the JSON packets.',
    'The historical mapping, twenty published definitions, and their receipt remain untouched. The new packet is the input for the next publication implementation; it does not claim that all exemptions, collateral consequences or recursive dependencies are cleared.',
    '', 'Verification: `node --import tsx scripts/data-review/ohio-residual-verification.ts --check` and `npx vitest run tests/ohio-residual-verification.test.ts`.','');
  return lines.join('\n').replace(/[\u2013\u2014]/g,'-');
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const packet=buildOhioResidual();
  for(const [name,content] of [['ohio-residual-verification.json',JSON.stringify(packet,null,2)+'\n'],['ohio-residual-verification.md',renderOhioResidual(packet)]]) {
    if(process.argv.includes('--check')) {if(readFileSync(output+name,'utf8')!==content)throw Error(`Residual drift: ${name}`);}
    else writeFileSync(output+name,content);
  }
  console.log(JSON.stringify(packet.counts));
}
