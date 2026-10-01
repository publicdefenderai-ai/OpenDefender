import financialIdentity from "./california-financial-identity-additions.json";
import repeatTheftAssembly from "./california-repeat-theft-assembly-additions.json";
import publicOrder from "./california-public-order-additions.json";
import {reviewedCaliforniaPenalty} from './california-attorney-decisions';
import financialTax from "./california-financial-tax-additions.json";
import propertyArson from "./california-property-arson-additions.json";
import justiceCustody from "./california-justice-custody-additions.json";
import weaponsEligibility from "./california-weapons-eligibility-additions.json";
import weaponsThreats from "./california-weapons-threats-additions.json";
import registrationExploitation from "./california-registration-exploitation-additions.json";
import sexualOffenses from "./california-sexual-offenses-additions.json";
import violenceDetention from "./california-violence-detention-additions.json";
import vehicleIdentification from "./california-vehicle-identification-additions.json";
import traffic from "./california-traffic-additions.json";
/** Keep each reviewed batch immutable while projecting one runtime catalog. */
import personProperty from "./california-person-property-additions.json";
import forgeryTheft from "./california-forgery-theft-additions.json";
import protectedPerson from "./california-protected-person-additions.json";
import specializedProperty from "./california-specialized-property-additions.json";
import controlledSubstances from "./california-controlled-substances-additions.json";
import drivingVessels from "./california-driving-vessels-additions.json";
import drugSuccessor from "./california-drug-successor-additions.json";
import { californiaLawCode } from "./california-law-codes";
export const CALIFORNIA_ADDITIONS = [
  ...financialIdentity.map(row => ({ ...row, lawCode: californiaLawCode(row.lawCode), reviewArtifact: "california-financial-identity-review.json" })),
  ...repeatTheftAssembly.map(row => ({ ...row, lawCode: californiaLawCode(row.lawCode), reviewArtifact: "california-repeat-theft-assembly-review.json" })),
  ...publicOrder.map(row => ({ ...row, lawCode: californiaLawCode(row.lawCode), reviewArtifact: "california-public-order-review.json" })),
  ...financialTax.map(row => ({ ...row, lawCode: californiaLawCode(row.lawCode), reviewArtifact: "california-financial-tax-review.json" })),
  ...propertyArson.map(row => ({ ...row, lawCode: californiaLawCode(row.lawCode), reviewArtifact: "california-property-arson-review.json" })),
  ...justiceCustody.map(row => ({ ...row, lawCode: californiaLawCode(row.lawCode), reviewArtifact: "california-justice-custody-review.json" })),
  ...weaponsEligibility.map(row => ({ ...row, lawCode: californiaLawCode(row.lawCode), reviewArtifact: "california-weapons-eligibility-review.json" })),
  ...weaponsThreats.map(row => ({ ...row, lawCode: californiaLawCode(row.lawCode), reviewArtifact: "california-weapons-threats-review.json" })),
  ...registrationExploitation.map(row => ({ ...row, lawCode: californiaLawCode(row.lawCode), reviewArtifact: "california-registration-exploitation-review.json" })),
  ...sexualOffenses.map(row => ({ ...row, lawCode: californiaLawCode(row.lawCode), reviewArtifact: "california-sexual-offenses-review.json" })),
  ...personProperty.map(row => ({ ...row, lawCode: "PEN" as const, reviewArtifact: "california-person-property-review.json" })),
  ...forgeryTheft.map(row => ({ ...row, lawCode: "PEN" as const, reviewArtifact: "california-forgery-theft-review.json" })),
  ...protectedPerson.map(row => ({ ...row, lawCode: californiaLawCode(row.lawCode), reviewArtifact: "california-protected-person-review.json" })),
  ...specializedProperty.map(row => ({ ...row, lawCode: californiaLawCode(row.lawCode), reviewArtifact: "california-specialized-property-review.json" })),
  ...controlledSubstances.map(row => ({ ...row, lawCode: californiaLawCode(row.lawCode), reviewArtifact: "california-controlled-substances-review.json" })),
  ...drugSuccessor.map(row => ({ ...row, lawCode: californiaLawCode(row.lawCode), reviewArtifact: "california-drug-successor-review.json" })),
  ...drivingVessels.map(row => ({ ...row, lawCode: californiaLawCode(row.lawCode), reviewArtifact: "california-driving-publication-review.json" })),
  ...traffic.map(row => ({ ...row, lawCode: californiaLawCode(row.lawCode), reviewArtifact: "california-traffic-review.json" })),
  ...violenceDetention.map(row => ({ ...row, lawCode: californiaLawCode(row.lawCode), reviewArtifact: "california-violence-detention-review.json" })),
  ...vehicleIdentification.map(row => ({ ...row, lawCode: californiaLawCode(row.lawCode), reviewArtifact: "california-vehicle-identification-review.json" })),
].map(row => ({
  ...row,
  penalty: reviewedCaliforniaPenalty(row.id, row.penalty),
  sourceEffectiveDates: {...row.sourceEffectiveDates, ...(row.id === 'ca-pen-237-a' ? {'PEN:672': '1983-09-27'} : {})},
  supportingKeys: [...new Set([...row.supportingKeys, ...(row.id === 'ca-pen-237-a' ? ['PEN:672'] : [])])],
}));
