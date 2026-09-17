import type { CriminalCharge } from "./criminal-charges";
import type { ChargeExplanation } from "./charge-explanations";

const summary = [
  "Ohio § 2903.11(A) prohibits knowingly causing serious physical harm, or causing or attempting physical harm using a deadly weapon or dangerous ordnance, to another or another's unborn.",
  "Division (B) separately addresses knowingly engaging in specified sexual conduct while knowing of a positive HIV-carrier test: without prior disclosure; with someone the offender knows or has reasonable cause to believe lacks the mental capacity to appreciate the significance of that knowledge; or with someone under eighteen who is not the offender's spouse.",
  "For this section, insertion of a non-body instrument or object into another's vaginal or anal opening is excluded from sexual conduct unless the offender knew at the time that it carried the offender's bodily fluid.",
  "Pregnancy-related definitions and exceptions also matter. This is not simply a weapon-assault label.",
].join(" ");
const penalty = [
  "Ordinarily second-degree; division (A) involving a peace officer or qualifying BCI investigator is first-degree.",
  "Serious physical harm to a protected victim triggers the first-degree mandatory-prison rule.",
  "For conduct on or after March 22, 2019, ordinary minimum terms are 2–8 years (second-degree) or 3–11 years (first-degree), with an indefinite maximum under § 2929.144; for one qualifying felony, maximum equals minimum plus 50%.",
  "Base fine ceilings are up to $15,000 (second-degree) or $20,000 (first-degree), not fixed fines.",
  "A qualifying known-pregnancy specification requires an applicable mandatory minimum for first/second-degree conduct on or after that date—not six months.",
  "A qualifying accelerant specification involving permanent serious disfigurement or permanent substantial incapacity adds six years, consecutive and prior to the underlying sentence, with at most one such term for felonies in the same act.",
  "A qualifying under-ten/permanent-disabling-harm specification adds six years, consecutive and prior to the underlying sentence, but bars any other additional prison term for the same offense.",
  "Using a motor vehicle as the deadly weapon under (A)(2) requires a class-two license suspension of three years to life.",
  "Qualifying convictions on both sexual-motivation and sexually violent predator specifications can invoke life sentencing; sexual conduct alone does not establish those specifications.",
  "Earlier conduct, other allegations and aggregate sentences require separate review.",
].join(" ");

export const OHIO_FELONIOUS_ASSAULT_CHARGE: CriminalCharge = {
  id: "oh-orc-2903-11-felonious-assault", name: "Felonious assault", nameEs: "Felonious assault",
  code: "2903.11", jurisdiction: "OH", category: "felony",
  description: summary,
  descriptionEs: "La sección 2903.11(A) de Ohio prohíbe causar a sabiendas daño físico grave, o causar o intentar causar daño físico mediante un arma mortal o material peligroso, a otra persona o al ser no nacido de otra persona. El apartado (B) contempla por separado determinadas conductas sexuales realizadas a sabiendas con conocimiento de un resultado positivo como portador del VIH: sin revelarlo previamente; con alguien que el autor sabe o tiene motivos razonables para creer que carece de capacidad mental para apreciar la importancia de ese conocimiento; o con una persona menor de dieciocho años que no sea su cónyuge. Para esta sección, insertar un instrumento u objeto que no sea parte del cuerpo en la abertura vaginal o anal de otra persona queda excluido de la conducta sexual, salvo que el autor supiera en ese momento que llevaba su propio fluido corporal. También importan las definiciones y excepciones relativas al embarazo. No es simplemente una etiqueta de agresión con arma.",
  maxPenalty: penalty,
  commonDefenses: [], evidenceToGather: [], specificRights: [], urgentActions: [],
  statuteCitations: ["Ohio Rev. Code Ann. § 2903.11"],
  sourceUrls: ["https://codes.ohio.gov/ohio-revised-code/section-2903.11",
    "https://codes.ohio.gov/ohio-revised-code/section-2929.14",
    "https://codes.ohio.gov/ohio-revised-code/section-2929.144",
    "https://codes.ohio.gov/ohio-revised-code/section-2971.03"],
  dataConfidence: "high", lastVerified: "2026-09",
};

export const OHIO_FELONIOUS_ASSAULT_EXPLANATION: ChargeExplanation = {
  jurisdiction: "OH", chargePattern: /^felonious assault$/i, slug: "ohio-felonious-assault",
  plainSummary: summary, degreeContext: penalty,
  keyTerms: [], pendingAttorneyReview: true,
  sources: [
    { jurisdiction: "OH", citation: "Ohio Rev. Code § 2903.11", url: "https://codes.ohio.gov/ohio-revised-code/section-2903.11" },
    { jurisdiction: "OH", citation: "Ohio Rev. Code § 2929.14", url: "https://codes.ohio.gov/ohio-revised-code/section-2929.14" },
    { jurisdiction: "OH", citation: "Ohio Rev. Code § 2929.144", url: "https://codes.ohio.gov/ohio-revised-code/section-2929.144" },
    { jurisdiction: "OH", citation: "Ohio Rev. Code § 2941.1426", url: "https://codes.ohio.gov/ohio-revised-code/section-2941.1426" },
    { jurisdiction: "OH", citation: "Ohio Rev. Code § 2971.03", url: "https://codes.ohio.gov/ohio-revised-code/section-2971.03" },
  ],
};