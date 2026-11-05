/** Bounded official acquisition into candidate evidence only; no runtime receipt writes. */
import {writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {extractOhioDocument} from './import-ohio-source-database';
const documents: Record<string,unknown> = {};
for (const section of ['2903.22','2907.323']) {
 const sourceUrl=`https://codes.ohio.gov/ohio-revised-code/section-${section}`;
 const at=new Date();const response=await fetch(sourceUrl,{redirect:'manual',signal:AbortSignal.timeout(30000)});
 if(!response.ok) throw Error(`${section}: ${response.status}`);
 const doc=extractOhioDocument(await response.text(),section,sourceUrl,at);
 if(!doc?.effectiveDateStart || Date.parse(doc.effectiveDateStart)>at.getTime()) throw Error('Missing or future source');
 documents[section]={...doc,contentHash:createHash('sha256').update(doc.text).digest('hex'),retrievedAt:at.toISOString()};
}
writeFileSync('scripts/data-review/output/ohio-residual-supplemental-evidence.json',JSON.stringify({kind:'candidate_supporting_evidence_no_activation',documents},null,2)+'\n');
console.log(Object.keys(documents));
