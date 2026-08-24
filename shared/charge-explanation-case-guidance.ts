import type { LegalTermExplanation } from "./charge-explanations";

export type CaseGuidanceLanguage = "en" | "es" | "zh";

type ScopedContent = {
  plainSummary: string;
  degreeContext: string;
  keyTerms: LegalTermExplanation[];
};

const NEUTRAL_KEY_TERMS: Record<CaseGuidanceLanguage, LegalTermExplanation[]> = {
  en: [
    {
      term: "Core elements",
      plainMeaning: "The facts the prosecution generally must prove for this charge.",
      example: "The charging document and evidence identify which facts are disputed.",
    },
    {
      term: "Mental state and circumstances",
      plainMeaning: "The required intent, knowledge, recklessness, or surrounding circumstances depend on the law that applies.",
      example: "The same event can be evaluated differently when the required mental state is different.",
    },
    {
      term: "Classification and consequences",
      plainMeaning: "The charge level, possible penalties, and collateral consequences depend on the applicable law and case facts.",
      example: "Prior record, alleged injury, and other facts may affect classification or sentencing.",
    },
  ],
  es: [
    {
      term: "Elementos básicos",
      plainMeaning: "Los hechos que normalmente la fiscalía debe probar para este cargo.",
      example: "La acusación y las pruebas indican qué hechos están en disputa.",
    },
    {
      term: "Estado mental y circunstancias",
      plainMeaning: "La intención, el conocimiento, la imprudencia o las circunstancias requeridas dependen de la ley aplicable.",
      example: "El mismo evento puede evaluarse de manera diferente cuando cambia el estado mental requerido.",
    },
    {
      term: "Clasificación y consecuencias",
      plainMeaning: "El nivel del cargo, las posibles penas y otras consecuencias dependen de la ley aplicable y de los hechos del caso.",
      example: "Los antecedentes, las lesiones alegadas y otros hechos pueden afectar la clasificación o la sentencia.",
    },
  ],
  zh: [
    {
      term: "核心要件",
      plainMeaning: "检方通常必须为该罪名证明的事实。",
      example: "起诉文件和证据会显示哪些事实存在争议。",
    },
    {
      term: "主观心态与情节",
      plainMeaning: "所需的故意、明知、鲁莽或其他情节取决于适用的法律。",
      example: "当法律要求的主观心态不同时，同一事件可能受到不同评价。",
    },
    {
      term: "罪名分类与后果",
      plainMeaning: "罪名等级、可能的刑罚和其他后果取决于适用的法律及案件事实。",
      example: "前科、被指称的伤害和其他事实可能影响罪名分类或量刑。",
    },
  ],
};

const SUMMARY_BY_SLUG: Record<string, Record<CaseGuidanceLanguage, string>> = {
  "murder-in-the-first-degree": {
    en: "First degree murder is a serious homicide charge involving the elements described in the charging law. The required planning, intent, or aggravating circumstances must be evaluated under the law that applies to your case.",
    es: "El asesinato en primer grado es un cargo grave de homicidio que depende de los elementos descritos en la ley aplicable. La planificación, intención o circunstancias agravantes requeridas deben evaluarse según la ley de su caso.",
    zh: "一级谋杀是一项严重的杀人罪指控，其要件由适用的法律规定。所需的预谋、故意或加重情节必须根据您案件适用的法律评估。",
  },
  "murder-in-the-second-degree": {
    en: "Second degree murder generally describes a serious killing charge that does not require every aggravating circumstance associated with the highest homicide tier. The exact mental state and elements depend on the law that applies.",
    es: "El asesinato en segundo grado generalmente describe un cargo grave de homicidio que no requiere todas las circunstancias agravantes del nivel más alto. El estado mental y los elementos exactos dependen de la ley aplicable.",
    zh: "二级谋杀通常是指一项严重的杀人罪指控，但不要求最高级别杀人罪所需的全部加重情节。具体主观心态和要件取决于适用的法律。",
  },
  "felony-murder": {
    en: "Felony murder generally concerns a death alleged to have occurred during another serious offense. The required connection, mental state, and limits on responsibility depend on the law that applies.",
    es: "El homicidio durante un delito grave generalmente se refiere a una muerte que, según la acusación, ocurrió durante otro delito grave. La conexión, el estado mental y los límites de responsabilidad dependen de la ley aplicable.",
    zh: "重罪谋杀通常涉及被指称发生在另一项严重犯罪过程中的死亡。所需的关联、主观心态和责任范围取决于适用的法律。",
  },
  "assault-in-the-first-degree": {
    en: "First degree assault generally describes a high-level nonfatal assault charge involving serious injury, a dangerous instrument, or another circumstance specified by the applicable law.",
    es: "El asalto en primer grado generalmente describe un cargo grave de asalto no mortal que involucra lesiones graves, un instrumento peligroso u otra circunstancia especificada por la ley aplicable.",
    zh: "一级攻击通常是指涉及严重伤害、危险器具或适用法律规定的其他情节的高级别非致命攻击罪指控。",
  },
  "assault-in-the-second-degree": {
    en: "Second degree assault generally describes a serious assault charge involving physical injury or another circumstance specified by the applicable law, but not necessarily the highest assault tier.",
    es: "El asalto en segundo grado generalmente describe un cargo grave que involucra lesiones físicas u otra circunstancia especificada por la ley aplicable，但不一定是最高级别的攻击罪。",
    zh: "二级攻击通常是指涉及人身伤害或适用法律规定的其他情节的严重攻击罪指控，但不一定属于最高级别。",
  },
  "assault-in-the-third-degree": {
    en: "Third degree or simple assault generally describes a lower-level assault allegation involving minor injury, a threat, or another circumstance specified by the applicable law.",
    es: "El asalto en tercer grado o asalto simple generalmente describe una acusación de menor nivel que involucra lesiones menores, una amenaza u otra circunstancia especificada por la ley aplicable.",
    zh: "三级攻击或简单攻击通常是指涉及轻微伤害、威胁或适用法律规定的其他情节的较低级别攻击指控。",
  },
  "aggravated-assault": {
    en: "Aggravated assault generally describes an assault allegation made more serious by a weapon, injury, intent, protected circumstance, or another factor identified by the applicable law.",
    es: "El asalto agravado generalmente describe una acusación de asalto agravada por un arma, lesiones, intención, una circunstancia protegida u otro factor identificado por la ley aplicable.",
    zh: "加重攻击通常是指因武器、伤害、主观意图、受保护情节或适用法律确定的其他因素而加重的攻击指控。",
  },
  "assault-with-a-deadly-weapon": {
    en: "Assault with a deadly weapon generally concerns an alleged attack or threat involving an object or force capable of causing death or serious injury. The required act and intent depend on the applicable law.",
    es: "El asalto con arma mortal generalmente se refiere a un supuesto ataque o amenaza con un objeto o fuerza capaz de causar la muerte o lesiones graves. El acto y la intención requeridos dependen de la ley aplicable.",
    zh: "持致命武器攻击通常涉及被指称使用能够造成死亡或严重伤害的物品或力量进行攻击或威胁。所需行为和主观意图取决于适用的法律。",
  },
  "domestic-violence": {
    en: "Domestic violence allegations generally concern alleged assault, battery, threats, or related conduct involving a family or household relationship. The charge structure and additional consequences depend on the applicable law.",
    es: "Las acusaciones de violencia doméstica generalmente se refieren a asalto, agresión, amenazas u otra conducta presunta dentro de una relación familiar o doméstica. La estructura del cargo y las consecuencias adicionales dependen de la ley aplicable.",
    zh: "家庭暴力指控通常涉及家庭或同住关系中的攻击、殴打、威胁或相关行为。罪名结构和额外后果取决于适用的法律。",
  },
  battery: {
    en: "Battery generally concerns alleged unlawful physical contact or bodily harm. Whether the conduct is charged separately from assault and how it is classified depend on the applicable law.",
    es: "La agresión física generalmente se refiere a un supuesto contacto físico ilegal o daño corporal. La forma de acusar y clasificar la conducta depende de la ley aplicable.",
    zh: "殴打通常涉及被指称的非法身体接触或人身伤害。该行为是否与攻击分开起诉以及如何分类取决于适用的法律。",
  },
  manslaughter: {
    en: "Manslaughter generally concerns an alleged unlawful killing without the mental state required for the most serious homicide charge. The distinction between forms of manslaughter depends on the applicable law and facts.",
    es: "El homicidio involuntario generalmente se refiere a una muerte ilegal presunta sin el estado mental requerido para el cargo de homicidio más grave. La distinción entre sus formas depende de la ley aplicable y los hechos.",
    zh: "过失杀人通常涉及被指称的非法致死，但不具备最严重杀人罪所需的主观心态。不同类型之间的区别取决于适用的法律和案件事实。",
  },
  robbery: {
    en: "Robbery generally concerns alleged taking of property through force, threats, or intimidation. The required level of force, grading, and penalties depend on the applicable law.",
    es: "El robo generalmente se refiere a la supuesta apropiación de bienes mediante fuerza, amenazas o intimidación. El nivel de fuerza, la clasificación y las penas dependen de la ley aplicable.",
    zh: "抢劫通常涉及被指称通过武力、威胁或恐吓夺取财物。所需武力程度、罪名分类和刑罚取决于适用的法律。",
  },
  burglary: {
    en: "Burglary generally concerns alleged unauthorized entry into a building or structure with the intent required by the applicable law. The entry, location, and intent requirements can affect classification.",
    es: "El allanamiento generalmente se refiere a la supuesta entrada no autorizada a un edificio o estructura con la intención exigida por la ley aplicable. La entrada, el lugar y la intención pueden afectar la clasificación.",
    zh: "入室盗窃通常涉及被指称未经授权进入建筑物或构筑物，并具有适用法律要求的意图。进入方式、地点和意图可能影响罪名分类。",
  },
  theft: {
    en: "Theft generally concerns alleged unauthorized taking of property with the required intent. The value, circumstances, and prior record may affect the charge level under the applicable law.",
    es: "El hurto generalmente se refiere a la supuesta apropiación no autorizada de bienes con la intención requerida. El valor, las circunstancias y los antecedentes pueden afectar el nivel del cargo según la ley aplicable.",
    zh: "盗窃通常涉及被指称未经授权取走财物并具有所需意图。根据适用的法律，财物价值、情节和前科可能影响罪名等级。",
  },
  dui: {
    en: "DUI or a related impaired-driving charge generally concerns operating a vehicle while affected by alcohol, drugs, or both. The testing rules, thresholds, and penalties depend on the applicable law.",
    es: "DUI u otro cargo relacionado con conducir bajo los efectos generalmente se refiere a operar un vehículo afectado por alcohol, drogas o ambos. Las reglas de pruebas, límites y penas dependen de la ley aplicable.",
    zh: "DUI或相关酒驾罪名通常涉及在受到酒精、毒品或两者影响时驾驶车辆。检测规则、限值和刑罚取决于适用的法律。",
  },
  "drug-possession": {
    en: "Drug possession generally concerns alleged knowing control of a controlled substance without the authorization required by law. The substance, amount, and circumstances can affect classification.",
    es: "La posesión de drogas generalmente se refiere al supuesto control consciente de una sustancia controlada sin la autorización exigida por la ley. La sustancia, la cantidad y las circunstancias pueden afectar la clasificación.",
    zh: "持有毒品通常涉及被指称在明知情况下控制受管制物质，且未获得法律要求的授权。物质种类、数量和情节可能影响罪名分类。",
  },
  perjury: {
    en: "Perjury generally concerns an alleged materially false statement made after a legally required oath or affirmation. The required materiality and proceeding-related elements depend on the applicable law.",
    es: "El perjurio generalmente se refiere a una supuesta declaración materialmente falsa hecha después del juramento o afirmación exigidos por la ley. Los elementos exactos dependen de la ley aplicable.",
    zh: "作伪证通常涉及被指称在依法宣誓或确认后作出具有实质性的虚假陈述。实质性和程序相关要件取决于适用的法律。",
  },
  "failure-to-identify": {
    en: "Failure to identify or providing false information generally concerns alleged refusal to provide, or falsification of, identifying information during a lawful police encounter. The officer's authority and required response depend on the applicable law.",
    es: "La falta de identificación o proporcionar información falsa generalmente se refiere a la supuesta negativa a dar, o falsificación de, información identificatoria durante un encuentro policial legal. La autoridad del agente y la respuesta requerida dependen de la ley aplicable.",
    zh: "拒绝表明身份或提供虚假信息通常涉及被指称在合法警务接触中拒绝提供或伪造身份信息。警察权限和所需回应取决于适用的法律。",
  },
  "public-intoxication": {
    en: "Public intoxication and related allegations generally concern alleged impairment, danger, disturbance, or possession in a public setting. Whether the conduct is criminal and how it is classified depend on the applicable law.",
    es: "La intoxicación pública y acusaciones relacionadas generalmente se refieren a supuesta intoxicación, peligro, alteración del orden o posesión en un lugar público. La clasificación depende de la ley aplicable.",
    zh: "公共场所醉酒及相关指控通常涉及被指称在公共场所醉酒、造成危险、扰乱秩序或持有物品。该行为是否构成犯罪及如何分类取决于适用的法律。",
  },
  "murder-in-the-third-degree": {
    en: "Third degree murder, where recognized, generally describes a homicide tier between more serious murder charges and manslaughter. Its required mental state and grading depend on the applicable law.",
    es: "El asesinato en tercer grado, cuando existe, generalmente describe un nivel de homicidio entre los cargos de asesinato más graves y el homicidio involuntario. Sus elementos y clasificación dependen de la ley aplicable.",
    zh: "在承认该罪名的法律体系中，三级谋杀通常是介于更严重杀人罪与过失杀人之间的杀人罪等级。其主观心态和分类取决于适用的法律。",
  },
  "check-fraud": {
    en: "Check fraud generally concerns alleged use, creation, or passing of a check with the required knowledge and intent. The account status, amount, and alleged purpose can affect classification under the applicable law.",
    es: "El fraude con cheques generalmente se refiere al supuesto uso, creación o entrega de un cheque con el conocimiento y la intención requeridos. El estado de la cuenta, el monto y el propósito alegado pueden afectar la clasificación según la ley aplicable.",
    zh: "支票欺诈通常涉及被指称在具备所需明知和意图的情况下使用、制作或传递支票。账户状态、金额和被指称的目的可能根据适用法律影响罪名分类。",
  },
};

const DEGREE_CONTEXT: Record<CaseGuidanceLanguage, string> = {
  en: "Classification, available defenses, deadlines, and penalties are jurisdiction-specific and fact-specific. Use the selected-jurisdiction detail when it is available, and confirm the remaining questions with a licensed attorney.",
  es: "La clasificación, las defensas disponibles, los plazos y las penas dependen de la jurisdicción y de los hechos. Use el detalle de la jurisdicción seleccionada cuando esté disponible y confirme las preguntas restantes con un abogado autorizado.",
  zh: "罪名分类、可用抗辩、期限和刑罚取决于具体司法管辖区及案件事实。有选定司法管辖区的详细信息时请优先参考，并向持牌律师核实其他问题。",
};

export const CASE_GUIDANCE_SCOPED_SLUGS = new Set(Object.keys(SUMMARY_BY_SLUG));

export function getScopedCaseGuidance(
  slug: string,
  language: string | undefined,
): ScopedContent | null {
  if (!CASE_GUIDANCE_SCOPED_SLUGS.has(slug)) return null;
  const lang = (language ?? "en").split("-")[0].toLowerCase() as CaseGuidanceLanguage;
  const safeLanguage: CaseGuidanceLanguage = lang === "es" || lang === "zh" ? lang : "en";
  const summary = SUMMARY_BY_SLUG[slug]?.[safeLanguage] ?? SUMMARY_BY_SLUG[slug].en;
  return {
    plainSummary: summary,
    degreeContext: DEGREE_CONTEXT[safeLanguage],
    keyTerms: NEUTRAL_KEY_TERMS[safeLanguage].map(term => ({ ...term })),
  };
}