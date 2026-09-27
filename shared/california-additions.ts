/** Keep each reviewed batch immutable while projecting one runtime catalog. */
import personProperty from "./california-person-property-additions.json";
import forgeryTheft from "./california-forgery-theft-additions.json";
import protectedPerson from "./california-protected-person-additions.json";
import { californiaLawCode } from "./california-law-codes";
export const CALIFORNIA_ADDITIONS = [
  ...personProperty.map(row => ({ ...row, lawCode: "PEN" as const, reviewArtifact: "california-person-property-review.json" })),
  ...forgeryTheft.map(row => ({ ...row, lawCode: "PEN" as const, reviewArtifact: "california-forgery-theft-review.json" })),
  ...protectedPerson.map(row => ({ ...row, lawCode: californiaLawCode(row.lawCode), reviewArtifact: "california-protected-person-review.json" })),
];
