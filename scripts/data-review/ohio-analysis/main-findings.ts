/**
 * Main-agent substantive decisions. These are compiled against the separately
 * recorded source hashes; changing cache text never silently refreshes approval.
 */
import type { SubstantiveFinding } from "../batch/substantive-review";
type Candidate = [name: string, conduct: string, grading: string, quoteAnchors: string[]];
export interface MainFindingSpec {
  section: string;
  classification?: SubstantiveFinding["classification"];
  resolution: string;
  question?: string;
  relatedSections?: string[];
  candidates: Candidate[];
}

export const MAIN_OHIO_FINDINGS: MainFindingSpec[] = [
  ...[
    ["2903.01", "aggravated murder"], ["2903.02", "murder"],
    ["2903.03", "voluntary manslaughter"], ["2903.04", "involuntary manslaughter"],
    ["2903.05", "negligent homicide"], ["2903.11", "felonious assault"],
    ["2903.12", "aggravated assault"],
  ].map(([section, name]) => ({
    section, resolution: "An independently verified source-first record already covers this statute. Keep the legacy ID withheld without making legacy-alias reconciliation a prerequisite to the existing statutory record.",
    candidates: [[name, "Existing reviewed source-first conduct scope.", "Reuse the existing reviewed grading evidence; do not introduce a new grade or alias.", [`guilty of ${name}`]]] as Candidate[],
  })),
  {
    section: "2903.06",
    resolution: "Three offense names and their conduct grouping are explicit. Preserve the different (A)(1)/(A)(2) grading branches under one aggravated-vehicular-homicide name; neither every subparagraph nor every enhancement is a separate offense.",
    relatedSections: ["2929.14", "2929.142", "1547.11", "4511.19", "4561.15"],
    candidates: [
      ["aggravated vehicular homicide", "(A)(1) or (A)(2); guilt in (B)(1).", "(A)(1): F2, with the specified F1 branches and mandatory terms in (B)(2)/(E). (A)(2): F3 or the specified F2 enhancement under (B)(3). Preserve the complete conditions.", ["(B)(1) Whoever violates", "(2)(a) Except as otherwise provided in division (B)(2)", "(3) Except as otherwise provided in this division, aggravated vehicular homicide"]],
      ["vehicular homicide", "(A)(3); guilt and grading in (C).", "M1; specified licensing/prior-offense circumstances elevate to F4, with applicable mandatory custody under (E).", ["(C) Whoever violates"]],
      ["vehicular manslaughter", "(A)(4); guilt and grading in (D).", "M2; specified licensing/prior-offense circumstances elevate to M1.", ["(D) Whoever violates"]],
    ],
  },
  {
    section: "2903.08",
    resolution: "Two names and explicit conduct-to-grade branches are routine source data. Aggravated vehicular assault must not be used as an alias for generic reckless driving.",
    relatedSections: ["2929.14", "1547.11", "4511.19", "4561.15"],
    candidates: [
      ["aggravated vehicular assault", "(A)(1), with guilt/grade under (B).", "F3; specified (B) conditions elevate to F2; preserve the mandatory-term provisions of (D).", ["(B)(1) Whoever violates"]],
      ["vehicular assault", "(A)(2) or (A)(3), guilt under (C)(1).", "(A)(2): F4 or specified F3 enhancement. (A)(3): M1 or specified F4 enhancement. Do not combine the two base grades.", ["(C)(1) Whoever violates", "(2) Except as otherwise provided in this division, vehicular assault", "(3) Except as otherwise provided in this division, vehicular assault"]],
    ],
  },
  {
    section: "2903.13", classification: "specific_legal_question",
    resolution: "The basic assault prohibition and statutory grading branches can be transcribed. Isolate the unresolved HMO definition to the hospital-related enhancement; do not ask for generic review of the entire assault statute or use an invented replacement definition.",
    question: "For the hospital-related assault enhancement in §2903.13(C)(8), what definition governs an HMO-operated hospital when §2903.13(E)(20) incorporates §3727.01 but that section no longer provides current official text? Identify the controlling authority before applying this enhancement to an HMO-operated facility.",
    relatedSections: ["2903.10", "3701.01", "3937.41"],
    candidates: [
      ["assault", "(A) knowingly causing/attempting physical harm or (B) recklessly causing serious physical harm; grading under (C).", "M1 baseline with the explicit (C) enhancements retained. Hospital/HMO-dependent application is specifically held pending the definition question.", ["Whoever violates this section is guilty of assault", "(19)(a) \"Hospital\" means", "(20) \"Health maintenance organization\""]],
    ],
  },
  {
    section: "2903.16", classification: "specific_legal_question",
    resolution: "Two names are explicit and §2903.10 supplies caretaker/functionally-impaired definitions, including the care-facility exclusion. The knowing branch is routine. The reckless branch has a specific apparent element/enhancement overlap; do not present its M2 recital as an established available outcome.",
    question: "Can the M2 grading recital in §2903.16(C)(2) apply to any violation of (B)? Division (B) already requires resulting serious physical harm, while (C)(2) makes the violation F4 when that same harm results. Confirm whether an M2 outcome exists, or how the reckless branch must be described.",
    relatedSections: ["2903.10", "2903.33", "2901.01", "2901.22"],
    candidates: [
      ["knowingly failing to provide for a person with a functional impairment", "(A): caretaker knowingly fails to provide necessary treatment/care/goods/service, resulting in physical or serious physical harm.", "(C)(1): M1; F4 when serious physical harm results.", ["(A) No caretaker shall knowingly", "(C)(1) Whoever violates"]],
      ["recklessly failing to provide for a person with a functional impairment", "(B): caretaker recklessly fails to provide necessary treatment/care/goods/service, resulting in serious physical harm.", "(C)(2) recites M2 and an F4 serious-harm enhancement; the relationship to (B)'s serious-harm element is the specific held question.", ["(B) No caretaker shall recklessly", "(2) Whoever violates division (B)"]],
    ],
  },
  {
    section: "2903.211",
    resolution: "One named offense. The M1/F4/F5 alternatives, pattern-of-conduct definitions, sexual-motivation branch and electronic-access exceptions are expressly stated; retain them as source data rather than requesting generic attorney interpretation.",
    relatedSections: ["2971.01", "2911.211", "2913.01"],
    candidates: [["menacing by stalking", "(A)(1)-(3), with definitions in (D) and exclusions in (F).", "(B)(1) M1; (B)(2) specified F4 conditions; (B)(3) child-services-employee branch F5 or specified F4. No blanket single maximum.", ["(B) Whoever violates", "(1) Except as otherwise provided in divisions (B)(2)", "(2) Menacing by stalking is a felony", "(3) If the victim of the offense is an officer"]]],
  },
  {
    section: "2903.216",
    resolution: "The statutory offense, consent rules, exceptions and grade conditions are express. Preserve the exceptions instead of treating every tracking device use as illegal.",
    relatedSections: ["2903.211", "2913.01", "4749.01"],
    candidates: [["illegal use of a tracking device or application", "The tracking prohibitions in (B), read with definitions/consent rules and the exceptions in (D).", "(F)(1) M1; specified (F)(2) conditions F4.", ["(F) Whoever violates", "(1) Except as otherwise provided in division (F)(2)", "(2) Illegal use of a tracking device or application is a felony"]]],
  },
  {
    section: "2903.22",
    resolution: "One named offense with express M4/M1/F4 branches. Only the responder/family/co-worker definitions in §2903.13 are incorporated; the unrelated HMO definition gap does not block menacing.",
    relatedSections: ["2903.13", "2941.25"],
    candidates: [["menacing", "(A)(1) threatening-belief conduct, or (A)(2) deadly-weapon display against the specified emergency responder/family/co-worker with the stated knowledge/purpose.", "(B) M4 baseline; specified child-services/responder circumstances M1; specified qualifying prior and victim/duty conditions F4.", ["(B) Whoever violates", "Except as otherwise provided in this division, menacing is a misdemeanor", "(D) As used in this section:"]]],
  },
  {
    section: "2903.341",
    resolution: "Patient endangerment is one named offense with two conduct routes, express spiritual-treatment exclusions, affirmative defenses and a clear grade ladder. The chapter-wide definitions and the specifically incorporated developmental-disability definitions are retained; no HMO definition is imported.",
    relatedSections: ["2903.33", "5123.01", "5123.50", "2901.01"],
    candidates: [["patient endangerment", "(B) caretaker creates substantial risk; (C) specified owner/operator/administrator/agent condones or knowingly permits prohibited caretaker conduct; preserve (B)-(D) exclusions/defenses.", "(E)(1) M1; qualifying prior under (E)(2) F4; resulting serious physical harm under (E)(3) F3.", ["(E)(1) Except as provided", "(2) If the offender previously has been convicted of, or pleaded guilty to, a violation of this section", "(3) If the violation results in serious physical harm"]]],
  },
  {
    section: "2903.43",
    resolution: "Use a clearly marked descriptive conduct label for (I)(1), not the administrative section heading as a supposedly named offense. The F5 penalty and enrollment duties are express; routine source-first construction does not require a naming opinion.",
    relatedSections: ["2903.41", "2903.42", "2903.421", "2903.44"],
    candidates: [["reckless violation of violent-offender database duties", "(I)(1): reckless failure to enroll/re-enroll/notify or another reckless VOD-duty violation by an offender actually subject to those duties.", "(I)(2): F5; also a supervised-release violation in the specified circumstances. Preserve the statutory affirmative-defense provisions.", ["(I)(1)", "(2) Whoever violates division (I)(1)"]]],
  },
  ...[
    ["2907.02", "rape", "(A)(1)-(2); the attempted-sexual-assault legacy row is not automatically equivalent to completed rape.", "(B): F1, with the complete special mandatory/life/juvenile sentencing branches preserved. Attempt remains a separate §2923.02 construction.", ["2971.03", "2929.14", "2907.01", "2923.02"]],
    ["2907.03", "sexual battery", "(A)(1)-(13), with the source's relational/authority/incapacity circumstances and definitions.", "(B): F3, or F2 for the specified under-13 victim branch with mandatory prison.", ["2907.01", "2929.13"]],
    ["2907.04", "unlawful sexual conduct with a minor", "(A): offender age 18 or older, victim at least 13 but under 16, and the specified knowledge/recklessness.", "(B): explicit F4/M1/F3/F2 age-gap and qualifying-prior branches; retain each condition.", ["2907.01", "2907.02", "2907.03"]],
    ["2907.05", "gross sexual imposition", "(A)(1)-(5) or (B), with stated circumstances, ages and mental states.", "(C): explicit F4/F3 subdivision and prison-term branches; do not equate all child sexual abuse with this one offense.", ["2907.01", "2929.13"]],
    ["2907.09", "public indecency", "(A)(1)-(3) or (B)(1)-(4), with the distinct public/likely-minor-viewer conduct routes.", "(C)(2)-(5): M4/M3/M2/M1/F5 according to exact conduct, prior count and minor-viewer conditions.", ["2907.01"]],
    ["2907.321", "pandering obscenity involving a minor or impaired person", "(A)(1)-(6), subject to (B)'s proper-purpose exception and the minor/impaired-person rules.", "(C): minor (A)(1)-(4)/(6) F2; impaired-person counterparts F3; (A)(5) F4 or qualifying-prior F3.", ["2907.01", "2907.322", "2907.323"]],
  ].map(([section, name, conduct, grading, related]) => ({
    section: section as string, resolution: "The statutory name and conduct/grade alternatives are explicit. Preserve complete conditions and exceptions in the structured draft; no decision about equivalence to a synthesized legacy label is required.",
    relatedSections: related as string[],
    candidates: [[name as string, conduct as string, grading as string, [`guilty of ${name}`]]] as Candidate[],
  })),
  {
    section: "2907.24",
    resolution: "Separate the two expressly named offenses; current post-July-1996 F3 grading must not be replaced by the historical F2 branch.",
    relatedSections: ["2907.01"],
    candidates: [
      ["soliciting", "(A): knowingly solicit sexual activity for hire in exchange for receiving value.", "(C)(1): M3.", ["(C)(1) Whoever violates"]],
      ["engaging in solicitation after a positive HIV test", "(B): knowledge of a positive carrier test plus conduct violating (A).", "(C)(2): F3 for conduct on/after July 1, 1996; historical F2 branch retained as historical only.", ["(2) Whoever violates division (B)"]],
    ],
  },
  {
    section: "2907.25",
    resolution: "Separate the expressly named prostitution and positive-test offenses, retaining the temporal grading distinction rather than creating a generic combined solicitation/prostitution alias.",
    relatedSections: ["2907.01"],
    candidates: [
      ["prostitution", "(A): engage in sexual activity for hire.", "(C)(1): M3.", ["(C)(1) Whoever violates"]],
      ["engaging in prostitution after a positive HIV test", "(B): knowledge of a positive carrier test while engaging in sexual activity for hire.", "(C)(2): F3 on/after July 1, 1996; historical F2 branch applies only to earlier conduct.", ["(2) Whoever violates division (B)"]],
    ],
  },
  {
    section: "2909.06",
    resolution: "One expressly named offense with two mental-state/conduct routes and an explicit harm/aircraft enhancement ladder. The shorter legacy label need not be migrated.",
    candidates: [["criminal damaging or endangering", "(A)(1) knowingly by any means, or (A)(2) recklessly by listed dangerous means, causing or risking harm to another's property without consent.", "(B): M2 baseline, M1 for person-harm risk, and the specific aircraft-related F5/F4 circumstances.", ["(A) No person shall cause", "(B) Whoever violates"]]],
  },
];