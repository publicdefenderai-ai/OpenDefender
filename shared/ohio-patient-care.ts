import { projectEvidenceBackedChargeBatch, type EvidenceBackedChargeDefinition } from "./evidence-backed-charge-batch";

const scope = {
  en: "This applies to a care facility's owner, operator, administrator, agent or employee, and protects its residents and patients. 'Care facility' has the specific scope in §2903.33(A); this is not every caregiving relationship.",
  es: "Se aplica al propietario, operador, administrador, agente o empleado de un centro de atención y protege a sus residentes y pacientes. «Centro de atención» tiene el alcance específico de §2903.33(A); no incluye toda relación de cuidado.",
  zh: "本条适用于照护机构的所有者、经营者、管理者、代理人或雇员，保护该机构的住民和患者。“照护机构”的范围由第2903.33(A)款规定，并非所有照护关系均适用。",
};
const restraint = {
  en: "Abuse must involve physical contact or inappropriate use of physical or chemical restraint, medication or isolation. Inappropriate use includes punishment, staff convenience, excessive use, substitution for treatment, or quantities that preclude habilitation and treatment.",
  es: "El abuso debe implicar contacto físico o el uso inapropiado de restricciones físicas o químicas, medicamentos o aislamiento. El uso inapropiado incluye castigo, conveniencia del personal, uso excesivo, sustitución del tratamiento o cantidades que impidan la habilitación y el tratamiento.",
  zh: "虐待须涉及身体接触，或不当使用身体或化学约束、药物或隔离。不当使用包括惩罚、为工作人员提供方便、过度使用、代替治疗，或使用量妨碍适应能力训练及治疗。",
};
const defense = {
  en: "For gross neglect or neglect, acting in good faith solely because a supervisor ordered the conduct is a statutory affirmative defense, not an automatic exemption.",
  es: "Para negligencia grave o negligencia, actuar de buena fe únicamente porque una persona con autoridad de supervisión ordenó la conducta constituye una defensa afirmativa legal, no una exención automática.",
  zh: "对于严重疏忽或疏忽，善意且仅因有监督权限者下令而实施行为，是法定积极抗辩，并非自动豁免。",
};
const limits = {
  en: "These are ordinary degree-based terms if incarceration is imposed and fine ceilings, not mandatory sentences, fixed fines, or universal total maximums. Other allegations, facility-licensing consequences and aggregate sentences require separate review.",
  es: "Son penas ordinarias según el grado si se impone encarcelamiento y límites de multa, no penas obligatorias, multas fijas ni máximos totales universales. Otras alegaciones, consecuencias para la licencia del centro y penas acumuladas requieren revisión separada.",
  zh: "这些是判处监禁时按等级适用的普通刑期及罚金上限，并非强制刑期、固定罚金或普遍适用的总刑罚上限。其他指控、机构执照后果及合并刑罚须另行审查。",
};
const prior = {
  en: "A prior conviction or guilty plea for any violation of §2903.34 triggers the enhancement; it need not be the same patient offense.",
  es: "Una condena o declaración de culpabilidad previa por cualquier infracción de §2903.34 activa el aumento; no tiene que ser el mismo delito contra un paciente.",
  zh: "曾因违反第2903.34条的任何规定被定罪或认罪，均可触发加重规定；不要求是同一种侵害患者的罪行。",
};

interface PatientCareDefinition extends EvidenceBackedChargeDefinition {
  subdivision: string | null;
  gradingPrefix: string;
  conductPrefix: string;
  definitionPrefixes: string[];
  degrees: Array<"M1" | "M2" | "F3" | "F4" | "F5">;
}
const careSections = ["2903.33", "3721.10", "5123.19", "5119.14", "5123.03", "5119.34", "3701.01", "3721.01", "2901.01", "2901.22"];
const citations = (section: string, subdivision: string | null, degrees: PatientCareDefinition["degrees"]) => [
  { citation: `Ohio Rev. Code Ann. § ${section}${subdivision ?? ""}`, url: `https://codes.ohio.gov/ohio-revised-code/section-${section}` },
  ...[...careSections, ...(section === "2903.35" ? ["2903.34"] : []),
    ...(degrees.some(degree => degree.startsWith("M")) ? ["2929.24", "2929.28"] : []),
    ...(degrees.some(degree => degree.startsWith("F")) ? ["2929.14", "2929.18"] : []),
  ].map(code => ({ citation: `Ohio Rev. Code Ann. § ${code}`, url: `https://codes.ohio.gov/ohio-revised-code/section-${code}` })),
];

const common = { jurisdiction: "OH", verifiedMonth: "2026-09" } as const;
export const OHIO_PATIENT_CARE_DEFINITIONS: PatientCareDefinition[] = [
  {
    ...common, id: "oh-orc-2903-34-a1-patient-abuse", slug: "ohio-patient-abuse",
    name: "Patient abuse", code: "2903.34", subdivision: "(A)(1)", category: "felony",
    gradingPrefix: "(C)", conductPrefix: "(1) Commit abuse", definitionPrefixes: ['(B) "Abuse"', '(D) "Inappropriate use'],
    degrees: ["F4", "F3"], citations: citations("2903.34", "(A)(1)", ["F4", "F3"]),
    text: {
      en: { plainSummary: `${scope.en} Patient abuse means knowingly causing physical harm or recklessly causing serious physical harm. ${restraint.en} The spiritual-treatment provision and supervisor-order affirmative defense in §2903.34(B) do not apply to patient abuse.`,
        degreeContext: `Normally F4; F3 with the qualifying prior conviction or guilty plea. ${prior.en} F4: 6–18 months and a fine up to $5,000. F3: 9, 12, 18, 24, 30 or 36 months and a fine up to $10,000. ${limits.en}` },
      es: { plainSummary: `${scope.es} El abuso de pacientes consiste en causar a sabiendas daño físico o causar temerariamente daño físico grave. ${restraint.es} La disposición sobre tratamiento espiritual y la defensa afirmativa por orden de un supervisor de §2903.34(B) no se aplican al abuso de pacientes.`,
        degreeContext: `Normalmente F4; F3 con la condena o declaración de culpabilidad previa correspondiente. ${prior.es} F4: de 6 a 18 meses y multa de hasta $5,000. F3: 9, 12, 18, 24, 30 o 36 meses y multa de hasta $10,000. ${limits.es}` },
      zh: { plainSummary: `${scope.zh} 虐待患者是指明知地造成身体伤害，或轻率地造成严重身体伤害。${restraint.zh} 第2903.34(B)款中的宗教治疗规定及遵照主管命令的积极抗辩不适用于虐待患者。`,
        degreeContext: `通常为四级重罪（F4）；有符合条件的既往定罪或认罪时为三级重罪（F3）。${prior.zh} F4：6至18个月，罚金最高5,000美元。F3：9、12、18、24、30或36个月，罚金最高10,000美元。${limits.zh}` },
    },
  },
  {
    ...common, id: "oh-orc-2903-34-a2-gross-patient-neglect", slug: "ohio-gross-patient-neglect",
    name: "Gross patient neglect", code: "2903.34", subdivision: "(A)(2)", category: "misdemeanor",
    gradingPrefix: "(D)", conductPrefix: "(2) Commit gross neglect", definitionPrefixes: ['(C)(1) "Gross neglect"'],
    degrees: ["M1", "F5"], citations: citations("2903.34", "(A)(2)", ["M1", "F5"]),
    text: {
      en: { plainSummary: `${scope.en} Gross patient neglect means knowingly failing to provide treatment, care, goods or a service necessary to maintain health or safety, when the failure results in physical harm or serious physical harm. ${defense.en} The prayer-alone provision in §2903.34(B)(1) applies specifically to neglect under (A)(3), not this (A)(2) offense.`,
        degreeContext: `Normally M1: up to 180 days in jail and a fine up to $1,000. With the qualifying prior conviction or guilty plea, F5: 6–12 months in prison and a fine up to $2,500. ${prior.en} ${limits.en}` },
      es: { plainSummary: `${scope.es} La negligencia grave contra pacientes consiste en no proporcionar a sabiendas tratamiento, atención, bienes o un servicio necesario para mantener la salud o seguridad, cuando ello causa daño físico o daño físico grave. ${defense.es} La disposición sobre oración sola de §2903.34(B)(1) se aplica específicamente a la negligencia de (A)(3), no a este delito de (A)(2).`,
        degreeContext: `Normalmente M1: hasta 180 días de cárcel y multa de hasta $1,000. Con la condena o declaración de culpabilidad previa correspondiente, F5: de 6 a 12 meses de prisión y multa de hasta $2,500. ${prior.es} ${limits.es}` },
      zh: { plainSummary: `${scope.zh} 严重疏忽照护患者是指明知地不提供维持健康或安全所必需的治疗、照护、物品或服务，且因此造成身体伤害或严重身体伤害。${defense.zh} 第2903.34(B)(1)款关于仅靠祈祷治疗的规定只适用于(A)(3)款的疏忽罪，不适用于本(A)(2)款罪行。`,
        degreeContext: `通常为一级轻罪（M1）：监禁最高180天，罚金最高1,000美元。有符合条件的既往定罪或认罪时为五级重罪（F5）：监禁6至12个月，罚金最高2,500美元。${prior.zh}${limits.zh}` },
    },
  },
  {
    ...common, id: "oh-orc-2903-34-a3-patient-neglect", slug: "ohio-patient-neglect",
    name: "Patient neglect", code: "2903.34", subdivision: "(A)(3)", category: "misdemeanor",
    gradingPrefix: "(E)", conductPrefix: "(3) Commit neglect", definitionPrefixes: ['(2) "Neglect"'],
    degrees: ["M2", "F5"], citations: citations("2903.34", "(A)(3)", ["M2", "F5"]),
    text: {
      en: { plainSummary: `${scope.en} Patient neglect means recklessly failing to provide treatment, care, goods or a service necessary to maintain health or safety, when the failure results in serious physical harm. Physical harm alone does not satisfy that result requirement. A person relying on spiritual treatment through prayer alone, according to the tenets of a recognized religious denomination, is not considered neglected under (A)(3) for that reason alone. ${defense.en}`,
        degreeContext: `Normally M2: up to 90 days in jail and a fine up to $750. With the qualifying prior conviction or guilty plea, F5: 6–12 months in prison and a fine up to $2,500. ${prior.en} ${limits.en}` },
      es: { plainSummary: `${scope.es} La negligencia contra pacientes consiste en no proporcionar temerariamente tratamiento, atención, bienes o un servicio necesario para mantener la salud o seguridad, cuando ello causa daño físico grave. El daño físico por sí solo no satisface ese requisito de resultado. Quien depende de tratamiento espiritual mediante oración sola conforme a los principios de una denominación religiosa reconocida no se considera desatendido conforme a (A)(3) por ese solo motivo. ${defense.es}`,
        degreeContext: `Normalmente M2: hasta 90 días de cárcel y multa de hasta $750. Con la condena o declaración de culpabilidad previa correspondiente, F5: de 6 a 12 meses de prisión y multa de hasta $2,500. ${prior.es} ${limits.es}` },
      zh: { plainSummary: `${scope.zh} 疏忽照护患者是指轻率地不提供维持健康或安全所必需的治疗、照护、物品或服务，且因此造成严重身体伤害。仅有身体伤害不满足这一结果要求。依据获认可宗教教派的教义而仅靠祈祷接受精神治疗的人，不会仅因此被视为(A)(3)款意义上的被疏忽者。${defense.zh}`,
        degreeContext: `通常为二级轻罪（M2）：监禁最高90天，罚金最高750美元。有符合条件的既往定罪或认罪时为五级重罪（F5）：监禁6至12个月，罚金最高2,500美元。${prior.zh}${limits.zh}` },
    },
  },
  {
    ...common, id: "oh-orc-2903-35-filing-false-patient-abuse-or-neglect-complaints",
    slug: "ohio-filing-false-patient-abuse-or-neglect-complaints",
    name: "Filing false patient abuse or neglect complaints", code: "2903.35", subdivision: null, category: "misdemeanor",
    gradingPrefix: "(B)", conductPrefix: "(A)", definitionPrefixes: [], degrees: ["M1"],
    citations: citations("2903.35", null, ["M1"]),
    text: {
      en: { plainSummary: "This offense requires knowingly making a false statement, or knowingly swearing or affirming the truth of a previously made false statement, alleging a violation of §2903.34, with the purpose of incriminating another. A complaint that is unsubstantiated, mistaken or unsuccessful does not by itself establish these knowledge and purpose requirements. Unlike the underlying patient offenses, this prohibition is not limited to facility owners or staff.",
        degreeContext: `M1: up to 180 days in jail and a fine up to $1,000. Section 2903.35 contains no prior-conviction enhancement; the separate §2903.34 enhancement is not imported. ${limits.en}` },
      es: { plainSummary: "Este delito exige hacer a sabiendas una declaración falsa, o jurar o afirmar a sabiendas la veracidad de una declaración falsa anterior, que alegue una infracción de §2903.34, con el propósito de incriminar a otra persona. Una denuncia no corroborada, equivocada o que no prospere no establece por sí sola estos requisitos de conocimiento y propósito. A diferencia de los delitos subyacentes contra pacientes, esta prohibición no se limita a propietarios o personal del centro.",
        degreeContext: `M1: hasta 180 días de cárcel y multa de hasta $1,000. §2903.35 no contiene un aumento por condena previa; no se incorpora el aumento independiente de §2903.34. ${limits.es}` },
      zh: { plainSummary: "本罪要求明知地作出虚假陈述，或明知地宣誓或确认先前虚假陈述属实，声称有人违反第2903.34条，并以使他人被归罪为目的。投诉未获证实、存在错误或未成功，本身并不能确立这些明知及目的要件。与相关侵害患者罪行不同，本禁令不限于机构所有者或工作人员。",
        degreeContext: `一级轻罪（M1）：监禁最高180天，罚金最高1,000美元。第2903.35条没有因既往定罪而加重的规定；不得套用第2903.34条的独立加重规定。${limits.zh}` },
    },
  },
];

export const OHIO_PATIENT_CARE_BATCH = projectEvidenceBackedChargeBatch(OHIO_PATIENT_CARE_DEFINITIONS);