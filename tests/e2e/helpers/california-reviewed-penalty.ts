import {readFileSync} from 'node:fs';
const decisions = JSON.parse(readFileSync('shared/california-attorney-decisions.json','utf8')) as Array<{id:string;previousPenalty:string;penalty:string}>;
export function reviewedCaliforniaPenalty(id:string, original:string) {
  const decision=decisions.find(row=>row.id===id);
  if (!decision) return original;
  if (decision.previousPenalty!==original) throw new Error('Review baseline changed');
  return decision.penalty;
}
