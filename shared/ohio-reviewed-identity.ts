import { OHIO_CHAPTER_2903_PILOT_CHARGES } from "./ohio-chapter-2903-catalog";

// The historical catalog export combines every published Ohio review family.
const reviewedOhioIds = new Set(OHIO_CHAPTER_2903_PILOT_CHARGES.map(charge => charge.id));

export function isReviewedOhioChargeId(id: string): boolean {
  return reviewedOhioIds.has(id);
}
