import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../..');
const load = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const compact = text => text.trim().replace(/\s+/g,' ');
const normalize = text => text.replace(/\s+/g,'').toLowerCase();
const sectionOf = code => code.match(/^\d+\.\d+/)?.[0];
const proportions = [0.15, 0.50, 0.85];

export function selectSample(html) {
  const doc = new JSDOM(html).window.document;
  const tables = [...doc.querySelectorAll('table[ContainsSectionNumbers]')];
  if (tables.length !== 10) throw Error('Expected ten Florida offense severity levels');
  return tables.flatMap((table, index) => {
    if (table.previousElementSibling?.textContent.trim() !== 'LEVEL ' + (index + 1)) throw Error('Unexpected level');
    const rows = [...table.rows].filter(r => r.cells.length === 3 && r.cells[0].querySelector('a'));
    if (rows.length < 3) throw Error('Incomplete ranking chart');
    return proportions.map(fraction => {
      const i = Math.floor((rows.length-1)*fraction);
      const [citation,degree,description] = [...rows[i].cells].map(c => compact(c.textContent));
      return {level:index+1, row:i+1, levelRows:rows.length, citation,degree,description};
    });
  });
}

// Use explicit catalog dispositions, not every old row still present in criminalCharges.
export function configuredChoices(directory = root) {
  const definitions = path.join(directory,'shared');
  const manifest = load(path.join(directory, 'scripts/data-review/output/fl-source-manifest.json'));
  const legacy = manifest.catalogRecords.filter(r => ['retain','exact_alias_rename'].includes(r.disposition) && r.provisions.length)
    .map(r => ({id:r.chargeId,code:r.catalogCode,name:r.canonicalTitle}));
  const eligible = new Set(load(path.join(definitions,'florida-reviewed-eligibility.json')).decisions.filter(r=>r.status==='eligible').map(r=>r.id));
  const old = ['a','b','c','d','e','f'].flatMap(k=>load(path.join(definitions,'florida-reviewed-data',k+'.json'))).filter(r=>eligible.has(r.id));
  const additions = fs.readdirSync(definitions).filter(f=>/^florida-.+-publication\.json$/.test(f))
    .flatMap(f=>load(path.join(definitions,f)).map(r=>r.definition ?? {id:r.id,code:r.section + r.scope,name:r.name}));
  const choices=[...legacy,...old,...additions].map(({id,code,name})=>({id,code,name})).sort((a,b)=>a.id.localeCompare(b.id));
  if (new Set(choices.map(r=>r.id)).size!==choices.length) throw Error('Duplicate catalog identity');
  return choices;
}

export function assess(citation,choices) {
  const section=sectionOf(citation);
  if (!section) throw Error('Unrecognized statutory citation: '+citation);
  const family=choices.filter(r=>sectionOf(r.code)===section);
  const exact=family.filter(r=>normalize(r.code)===normalize(citation));
  const matches=exact.length?exact:family;
  return {result:exact.length?'exact_citation':family.length?'same_section_requires_scope_review':'section_absent', matches:matches.map(r=>({id:r.id,code:r.code}))};
}

if (process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const samplePath=path.join(here,'official-sample.json');
  const source=load(samplePath);
  if (process.argv[2]==='--verify-source') {
    const html=fs.readFileSync(process.argv[3]);
    if (createHash('sha256').update(html).digest('hex')!==source.pageSha256 ||
        JSON.stringify(selectSample(html))!==JSON.stringify(source.rows)) throw Error('Official benchmark snapshot differs');
  } else {
    const choices=configuredChoices(process.argv[2]);
    console.log(JSON.stringify(source.rows.map(r=>({...r,...assess(r.citation,choices)})),null,2));
  }
}
