import supplements from './california-conduct-supplements.json';
import {CALIFORNIA_CHARGE_CORRECTIONS} from './california-corrections';

/** Check the entire inventory before any lookup can silently ignore an orphan. */
export function validateCaliforniaConductSupplementIds(
  input: readonly {id:string}[],
  corrections: readonly {id:string}[] = CALIFORNIA_CHARGE_CORRECTIONS,
): void {
  const known = new Set(corrections.map(row => row.id));
  const seen = new Set<string>();
  for (const row of input) {
    if (!known.has(row.id)) throw new Error(`Unknown California conduct supplement ID: ${row.id}`);
    if (seen.has(row.id)) throw new Error(`Duplicate California conduct supplement ID: ${row.id}`);
    seen.add(row.id);
  }
}
validateCaliforniaConductSupplementIds(supplements);
export const CALIFORNIA_CONDUCT_SUPPLEMENTS = supplements;
