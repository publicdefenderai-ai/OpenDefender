/** Keep each reviewed batch immutable while projecting one runtime catalog. */
import personProperty from "./california-person-property-additions.json";
import forgeryTheft from "./california-forgery-theft-additions.json";
export const CALIFORNIA_ADDITIONS = [
  ...personProperty.map(row => ({ ...row, reviewArtifact: "california-person-property-review.json" })),
  ...forgeryTheft.map(row => ({ ...row, reviewArtifact: "california-forgery-theft-review.json" })),
];
