import {createHash} from 'node:crypto';
import plan from './correction-plan.json';
import {findSubdivisionRange} from '../../../server/data/florida-reviewed-source-records';
type Span = {section:string;scope:string;contentHash:string;start:number;end:number;text:string};
type Packet = {
  documents: Record<string,{text:string;contentHash:string}>;
  incorporatedConduct: {id:string;spans:Span[]}[];
};
/** Incorporated definitions remain distinct from the charged-subdivision spans. */
export function validateFloridaTraffickingIncorporatedConduct(packet: Packet) {
  const rows = packet.incorporatedConduct;
  if (!Array.isArray(rows) || rows.length !== plan.records.length ||
      new Set(rows.map(r=>r.id)).size !== plan.records.length)
    throw Error('Incomplete incorporated-conduct accounting');
  for (const row of plan.records) {
    const found=rows.find(r=>r.id===row.id);
    if (!found || !Array.isArray(found.spans) || found.spans.length!==row.incorporatedConduct.length)
      throw Error(`Missing incorporated-conduct binding: ${row.id}`);
    for (const [index, expected] of row.incorporatedConduct.entries()) {
      const span=found.spans[index],doc=packet.documents[expected.section];
      if (!span || !doc || span.section!==expected.section || span.scope!==expected.scope ||
          !row.requiredSections.some(r=>r.section===span.section) ||
          createHash('sha256').update(doc.text).digest('hex')!==doc.contentHash ||
          span.contentHash!==doc.contentHash)
        throw Error(`Invalid incorporated-conduct source: ${row.id}`);
      const range=findSubdivisionRange(doc.text,expected.scope)[0];
      if (!range || !Number.isInteger(span.start) || !Number.isInteger(span.end) ||
          span.start!==range.start || span.end!==range.end ||
          doc.text.slice(span.start,span.end)!==span.text)
        throw Error(`Invalid incorporated-conduct span: ${row.id}`);
    }
  }
}
