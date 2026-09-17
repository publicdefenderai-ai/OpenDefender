import type { CriminalCharge } from "./criminal-charges";

/** These selections preserve section-level identity and disclose conditional
 * branches; they do not resolve every specification or historical sentence. */
export const OHIO_MANSLAUGHTER_CHARGES: CriminalCharge[] = [
  {
    id: "oh-orc-2903-03-voluntary-manslaughter",
    name: "Voluntary manslaughter", nameEs: "Voluntary manslaughter",
    jurisdiction: "OH", code: "2903.03", category: "felony",
    description: "Ohio § 2903.03(A) prohibits knowingly causing another's death or the unlawful termination of another's pregnancy while under sudden passion or a sudden fit of rage brought on by the victim's serious provocation, reasonably sufficient to incite deadly force. Division (B) addresses doing so with sexual motivation. Division (C) makes a violation a first-degree felony. Pregnancy-related definitions and exceptions in § 2903.09 apply.",
    descriptionEs: "La sección 2903.03(A) de Ohio prohíbe causar a sabiendas la muerte de otra persona o la terminación ilícita del embarazo de otra persona bajo una pasión repentina o un arrebato de ira provocado por una provocación grave de la víctima, razonablemente suficiente para incitar al uso de fuerza mortal. El apartado (B) contempla hacerlo con motivación sexual. El apartado (C) lo clasifica como delito grave de primer grado. Se aplican las definiciones y excepciones de la sección 2903.09.",
    maxPenalty: "First-degree felony. Under current § 2929.14(A)(1)(a), the ordinary prison range for conduct on or after March 22, 2019 has a selected minimum of 3–11 years and an indefinite maximum determined under § 2929.144 (for one qualifying felony, the minimum plus 50%). The current statute describes a different, definite-term rule for earlier conduct; this is not a historical-law determination. The base fine limit is $20,000 under § 2929.18(A)(3)(a). § 2929.13 includes presumptions and conditional mandatory-prison rules. Specifications, prior convictions, multiple counts and collateral consequences require separate review; these are not an aggregate sentence prediction.",
    commonDefenses: [], evidenceToGather: [], specificRights: [], urgentActions: [],
    statuteCitations: ["Ohio Rev. Code Ann. § 2903.03"],
    sourceUrls: ["https://codes.ohio.gov/ohio-revised-code/section-2903.03", "https://codes.ohio.gov/ohio-revised-code/section-2929.14", "https://codes.ohio.gov/ohio-revised-code/section-2929.144"],
    dataConfidence: "high", lastVerified: "2026-09",
  },
  {
    id: "oh-orc-2903-04-involuntary-manslaughter",
    name: "Involuntary manslaughter", nameEs: "Involuntary manslaughter",
    jurisdiction: "OH", code: "2903.04", category: "felony",
    description: "Ohio § 2903.04 prohibits causing another's death or the unlawful termination of another's pregnancy as a proximate result of committing or attempting an underlying offense. Division (A), involving a felony, is a first-degree felony; division (B), involving specified lesser offenses, is a third-degree felony. Division (B) excludes certain Title XLV minor misdemeanors and equivalent ordinances. Do not treat this as reckless homicide. Pregnancy-related definitions and exceptions in § 2903.09 apply.",
    descriptionEs: "La sección 2903.04 de Ohio prohíbe causar la muerte de otra persona o la terminación ilícita del embarazo de otra persona como resultado próximo de cometer o intentar cometer un delito subyacente. El apartado (A), relativo a un delito grave, es un delito grave de primer grado; el apartado (B), relativo a determinadas infracciones menores, es un delito grave de tercer grado. El apartado (B) excluye ciertas infracciones de la categoría minor misdemeanor del Título XLV y ordenanzas equivalentes. No debe confundirse con Reckless homicide. Se aplican las definiciones y excepciones de la sección 2903.09.",
    maxPenalty: "Division (A): ordinary first-degree rules in §§ 2929.14(A)(1) and 2929.144; for conduct on or after March 22, 2019, a selected minimum of 3–11 years with an indefinite maximum (for one qualifying felony, minimum plus 50%); base fine up to $20,000. Division (B): § 2929.14(A)(3)(b) lists 9, 12, 18, 24, 30 or 36 months; base fine up to $10,000. The intoxication-related conditions in § 2903.04(D) require prison and a class-one (lifetime) license suspension. § 2929.13 has additional conditional mandatory-prison rules. For division (A), qualifying sexual-motivation and sexually violent predator specifications can invoke § 2971.03, including life sentences; ordinary ranges are not caps on those sentences. Exact allegations, offense date, prior convictions and all specifications require counsel's review.",
    commonDefenses: [], evidenceToGather: [], specificRights: [], urgentActions: [],
    statuteCitations: ["Ohio Rev. Code Ann. § 2903.04"],
    sourceUrls: ["https://codes.ohio.gov/ohio-revised-code/section-2903.04", "https://codes.ohio.gov/ohio-revised-code/section-2929.14", "https://codes.ohio.gov/ohio-revised-code/section-2971.03"],
    dataConfidence: "high", lastVerified: "2026-09",
  },
];