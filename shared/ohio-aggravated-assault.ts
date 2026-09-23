import type { CriminalCharge } from "./criminal-charges";
import type { ChargeExplanation } from "./charge-explanations";

export const OHIO_AGGRAVATED_ASSAULT_CHARGE: CriminalCharge = {
  id: "oh-orc-2903-12-aggravated-assault",
  name: "Aggravated assault", nameEs: "Aggravated assault",
  code: "2903.12", jurisdiction: "OH", category: "felony",
  description: "Ohio § 2903.12 requires sudden passion or rage brought on by serious victim provocation reasonably sufficient to incite deadly force, and knowingly causing serious physical harm, or causing or attempting physical harm by deadly weapon or dangerous ordnance, to another or another's unborn. The base grade is fourth-degree felony; a peace-officer or qualifying BCI-investigator victim makes it third-degree. Statutory definitions and § 2903.09 pregnancy-related exceptions apply.",
  descriptionEs: "La sección 2903.12 de Ohio exige pasión o ira repentina causada por una provocación grave de la víctima razonablemente suficiente para incitar al uso de fuerza mortal, y causar a sabiendas daño físico grave, o causar o intentar causar daño físico mediante un arma mortal o material peligroso, a otra persona o al ser no nacido de otra persona. La clasificación básica es delito grave de cuarto grado; si la víctima es un agente del orden o un investigador del BCI que cumpla la definición legal, es de tercer grado. Se aplican las definiciones legales y las excepciones relativas al embarazo de la sección 2903.09.",
  maxPenalty: "Ordinary fourth-degree prison terms: 6–18 months in whole-month increments (§ 2929.14(A)(4)); base fine up to $5,000 (§ 2929.18(A)(3)(d)). Third-degree branch: 9, 12, 18, 24, 30 or 36 months (§ 2929.14(A)(3)(b)); base fine up to $10,000. Serious physical harm to a peace officer or qualifying BCI investigator requires one of those third-degree prison terms. A qualifying known-pregnancy specification under § 2941.1423 invokes § 2929.14(B)(8), which permits a mandatory six-month term or a term for the applicable degree, subject to the section's protected-victim rule. These are not aggregate sentence caps; other specifications, counts and sanctions require separate review.",
  commonDefenses: [], evidenceToGather: [], specificRights: [], urgentActions: [],
  statuteCitations: ["Ohio Rev. Code Ann. § 2903.12"],
  sourceUrls: ["https://codes.ohio.gov/ohio-revised-code/section-2903.12",
    "https://codes.ohio.gov/ohio-revised-code/section-2929.14",
    "https://codes.ohio.gov/ohio-revised-code/section-2929.18",
    "https://codes.ohio.gov/ohio-revised-code/section-2941.1423"],
  dataConfidence: "high", lastVerified: "2026-09",
};

export const OHIO_AGGRAVATED_ASSAULT_EXPLANATION: ChargeExplanation = {
  jurisdiction: "OH", canonicalChargeId: "oh-orc-2903-12-aggravated-assault",
  chargePattern: /^aggravated assault$/i,
  slug: "ohio-aggravated-assault",
  plainSummary: "Ohio aggravated assault (§ 2903.12) is not just a generic label for a severe assault. It requires knowing conduct under sudden passion or rage caused by serious victim provocation reasonably sufficient to incite deadly force. The conduct is causing serious physical harm, or causing or attempting physical harm using a deadly weapon or dangerous ordnance, to another or another's unborn. Anger alone does not satisfy the statutory conditions. Definitions and pregnancy-related exceptions matter.",
  degreeContext: "The base offense is fourth-degree (ordinary prison terms of 6–18 months; base fine up to $5,000). A peace-officer or qualifying BCI-investigator victim makes it third-degree (ordinary terms of 9, 12, 18, 24, 30 or 36 months; base fine up to $10,000). Serious physical harm to such a victim requires one of those third-degree terms. A qualifying known-pregnancy specification requires either six months or a term prescribed for the applicable felony degree, subject to the protected-victim rule; it does not add six months to the sentence. Ordinary ranges are not total-sentence predictions.",
  keyTerms: [], pendingAttorneyReview: true,
  sources: [
    { jurisdiction: "OH", citation: "Ohio Rev. Code § 2903.12", url: "https://codes.ohio.gov/ohio-revised-code/section-2903.12" },
    { jurisdiction: "OH", citation: "Ohio Rev. Code § 2929.14", url: "https://codes.ohio.gov/ohio-revised-code/section-2929.14" },
    { jurisdiction: "OH", citation: "Ohio Rev. Code § 2929.18", url: "https://codes.ohio.gov/ohio-revised-code/section-2929.18" },
    { jurisdiction: "OH", citation: "Ohio Rev. Code § 2941.1423", url: "https://codes.ohio.gov/ohio-revised-code/section-2941.1423" },
  ],
};