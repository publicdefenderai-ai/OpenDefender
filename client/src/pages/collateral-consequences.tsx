import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle, ArrowRight, ArrowLeft, Copy, Check,
  Printer, Info, Home, Briefcase, Globe2,
  DollarSign, Users, Scale, Award, CheckCircle2, Shield, Lock,
} from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */

type Lang = "en" | "es" | "zh";
type Answer = "yes" | "no" | null;
type QuestionId =
  | "housing"
  | "employment"
  | "immigration"
  | "benefits"
  | "children"
  | "supervision"
  | "license";

interface TriText {
  en: string;
  es: string;
  zh: string;
}

interface Question {
  id: QuestionId;
  Icon: React.ElementType;
  question: TriText;
  sub: TriText;
  privacyNote: TriText | null;
}

interface RiskCard {
  id: QuestionId;
  urgency: number;
  Icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  title: TriText;
  what: TriText;
  clock: TriText;
  action: TriText;
  link: { href: string; label: TriText };
}

/* ------------------------------------------------------------------ */
/* Question content                                                     */
/* ------------------------------------------------------------------ */

const QUESTIONS: Question[] = [
  {
    id: "housing",
    Icon: Home,
    question: {
      en: "Are you renting, or living in subsidized or Section 8 housing?",
      es: "¿Alquila vivienda o vive en una vivienda subsidiada o con Sección 8?",
      zh: "您是否在租房，或居住于补贴住房或第八章住房？",
    },
    sub: {
      en: "Includes public housing, Section 8 vouchers, or any government-assisted rental.",
      es: "Incluye vivienda pública, vales de la Sección 8 o cualquier alquiler con asistencia gubernamental.",
      zh: "包括公共住房、第八章住房券或任何政府补贴租房。",
    },
    privacyNote: null,
  },
  {
    id: "employment",
    Icon: Briefcase,
    question: {
      en: "Are you currently employed?",
      es: "¿Está trabajando actualmente?",
      zh: "您目前有工作吗？",
    },
    sub: {
      en: "Includes full-time, part-time, gig work, or any paying job.",
      es: "Incluye trabajo a tiempo completo, parcial, por cuenta propia o cualquier trabajo remunerado.",
      zh: "包括全职、兼职、零工或任何有报酬的工作。",
    },
    privacyNote: null,
  },
  {
    id: "immigration",
    Icon: Globe2,
    question: {
      en: "Is anyone in your household not a U.S. citizen or permanent resident?",
      es: "¿Hay alguien en su hogar que no sea ciudadano estadounidense o residente permanente?",
      zh: "您家中是否有人不是美国公民或永久居民？",
    },
    sub: {
      en: "Includes visa holders, DACA recipients, undocumented individuals, and others with temporary status.",
      es: "Incluye titulares de visas, beneficiarios de DACA, personas indocumentadas y otros con estatus temporal.",
      zh: "包括持签证者、DACA受益人、无证件者以及其他持临时身份者。",
    },
    privacyNote: {
      en: "This answer is never stored or transmitted. It runs only in your browser.",
      es: "Esta respuesta nunca se almacena ni se transmite. Solo se procesa en su navegador.",
      zh: "此答案从不存储或传输，仅在您的浏览器中运行。",
    },
  },
  {
    id: "benefits",
    Icon: DollarSign,
    question: {
      en: "Are you receiving federal benefits?",
      es: "¿Recibe beneficios federales?",
      zh: "您是否在领取联邦福利？",
    },
    sub: {
      en: "Includes SNAP, SSI, SSDI, Medicaid, Section 8, TANF, or other federal assistance programs.",
      es: "Incluye SNAP, SSI, SSDI, Medicaid, Sección 8, TANF u otros programas de asistencia federal.",
      zh: "包括SNAP、SSI、SSDI、Medicaid、第八章、TANF或其他联邦援助项目。",
    },
    privacyNote: null,
  },
  {
    id: "children",
    Icon: Users,
    question: {
      en: "Do you have minor children in your care?",
      es: "¿Tiene hijos menores de edad bajo su cuidado?",
      zh: "您是否有未成年子女需要照顾？",
    },
    sub: {
      en: "Includes children you have custody of or are the primary caregiver for.",
      es: "Incluye hijos bajo su custodia o de los que usted es el cuidador principal.",
      zh: "包括您拥有监护权或担任主要照顾者的子女。",
    },
    privacyNote: null,
  },
  {
    id: "supervision",
    Icon: Scale,
    question: {
      en: "Are you currently on probation or parole?",
      es: "¿Está actualmente en libertad condicional o supervisada?",
      zh: "您目前是否处于缓刑或假释期间？",
    },
    sub: {
      en: "Includes any active supervision, conditional release, or community supervision order.",
      es: "Incluye cualquier supervisión activa, liberación condicional u orden de supervisión comunitaria.",
      zh: "包括任何有效的监督令、有条件释放或社区监督令。",
    },
    privacyNote: null,
  },
  {
    id: "license",
    Icon: Award,
    question: {
      en: "Do you hold a professional or occupational license?",
      es: "¿Tiene una licencia profesional u ocupacional?",
      zh: "您是否持有职业或执业许可证？",
    },
    sub: {
      en: "Includes nursing, teaching, contractor, security guard, real estate, and other licensed professions.",
      es: "Incluye enfermería, docencia, contratista, guardia de seguridad, bienes raíces y otras profesiones con licencia.",
      zh: "包括护理、教学、承包商、保安、房地产及其他持证职业。",
    },
    privacyNote: null,
  },
];

/* ------------------------------------------------------------------ */
/* Risk card content (sorted by urgency order within this array)       */
/* ------------------------------------------------------------------ */

const RISKS: RiskCard[] = [
  {
    id: "supervision",
    urgency: 1,
    Icon: Scale,
    color: "text-red-700 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-800",
    title: {
      en: "Probation or Parole Violation Risk",
      es: "Riesgo de Violación de Supervisión",
      zh: "缓刑或假释违规风险",
    },
    what: {
      en: "A new arrest triggers an automatic supervision violation regardless of how this case ends. A hold may be placed before you see a judge, and a separate revocation hearing can be scheduled before your criminal case is resolved.",
      es: "Un nuevo arresto desencadena automáticamente una violación de la supervisión, sin importar cómo termine este caso. Se puede imponer una retención antes de que usted vea a un juez, y se puede programar una audiencia de revocación separada antes de que su caso penal se resuelva.",
      zh: "无论本案结果如何，新的逮捕都会自动触发监督违规。在您见到法官之前就可能被拘留，且可能在刑事案件解决之前安排单独的撤销听证会。",
    },
    clock: {
      en: "Your supervision officer is typically notified within 24 hours of booking. A hold can be placed before any bail hearing.",
      es: "Su oficial de supervisión suele ser notificado dentro de las 24 horas del registro. Se puede imponer una retención antes de cualquier audiencia de fianza.",
      zh: "您的监督官员通常在登记后24小时内收到通知，在保释听证会之前就可能被拘留。",
    },
    action: {
      en: "Tell your defense attorney about your supervision status right away. Do not contact your supervision officer without speaking to your attorney first.",
      es: "Informe a su abogado defensor sobre su situación de supervisión de inmediato. No contacte a su oficial de supervisión sin hablar primero con su abogado.",
      zh: "立即告知您的辩护律师您的监督状态。在先咨询律师之前，不要联系您的监督官员。",
    },
    link: {
      href: "/case-guidance",
      label: { en: "Get case guidance", es: "Obtener orientación del caso", zh: "获取案件指导" },
    },
  },
  {
    id: "immigration",
    urgency: 2,
    Icon: Globe2,
    color: "text-orange-700 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-950/30",
    border: "border-orange-200 dark:border-orange-800",
    title: {
      en: "Immigration and ICE Detainer Risk",
      es: "Riesgo de Detención de ICE e Inmigración",
      zh: "移民和ICE羁押令风险",
    },
    what: {
      en: "ICE can lodge a detainer against any non-citizen booked into a local jail, asking the jail to hold the person up to 48 hours past their release date so ICE can take custody. Criminal charges or a conviction can also affect visa status, green card eligibility, and create grounds for removal.",
      es: "ICE puede presentar una orden de detención contra cualquier persona no ciudadana registrada en una cárcel local, solicitando que la cárcel retenga a la persona hasta 48 horas después de su fecha de liberación para que ICE pueda tomar custodia. Los cargos penales o una condena también pueden afectar el estatus de visa, la elegibilidad para la tarjeta verde y crear motivos de expulsión.",
      zh: "ICE可以对在本地监狱登记的任何非公民发出羁押令，要求监狱在其获释日期后最多48小时内继续关押，以便ICE接管。刑事指控或定罪还可能影响签证身份、绿卡资格并产生驱逐依据。",
    },
    clock: {
      en: "An ICE detainer can be issued within hours of booking. This is one of the fastest-moving consequences of an arrest.",
      es: "Una orden de detención de ICE puede emitirse en cuestión de horas después del registro. Esta es una de las consecuencias más rápidas de un arresto.",
      zh: "ICE羁押令可在登记后数小时内发出，这是逮捕后发展最快的后果之一。",
    },
    action: {
      en: "Contact an immigration attorney as soon as possible, before any plea discussions. Criminal charges and immigration consequences must be evaluated together.",
      es: "Contacte a un abogado de inmigración lo antes posible, antes de cualquier discusión sobre declaraciones. Los cargos penales y las consecuencias migratorias deben evaluarse juntos.",
      zh: "尽快联系移民律师，在任何认罪讨论之前。刑事指控和移民后果必须一起评估。",
    },
    link: {
      href: "/immigration-guidance",
      label: { en: "Immigration guidance", es: "Orientación de inmigración", zh: "移民指导" },
    },
  },
  {
    id: "children",
    urgency: 3,
    Icon: Users,
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
    title: {
      en: "Child Welfare and Custody Risk",
      es: "Riesgo de Bienestar Infantil y Custodia",
      zh: "儿童福利和监护权风险",
    },
    what: {
      en: "Law enforcement can notify Child Protective Services at the time of arrest, especially if children were present or you are the sole caregiver. An open CPS investigation can affect custody arrangements and parental rights before any conviction.",
      es: "Las fuerzas del orden pueden notificar a los Servicios de Protección de Menores en el momento del arresto, especialmente si los niños estaban presentes o usted es el único cuidador. Una investigación abierta de CPS puede afectar los acuerdos de custodia y los derechos parentales antes de cualquier condena.",
      zh: "执法部门可以在逮捕时通知儿童保护服务机构，特别是当有儿童在场或您是唯一照顾者时。在任何定罪之前，开放的CPS调查就可能影响监护安排和亲权。",
    },
    clock: {
      en: "CPS can be notified at the time of arrest. If children are left without care, emergency placement can happen the same day.",
      es: "CPS puede ser notificado en el momento del arresto. Si los niños se quedan sin cuidado, la colocación de emergencia puede ocurrir el mismo día.",
      zh: "CPS可以在逮捕时收到通知。如果儿童无人照管，当天即可进行紧急安置。",
    },
    action: {
      en: "Arrange childcare with a trusted adult right away if you may be detained. Document existing custody arrangements and contact your attorney if CPS makes contact.",
      es: "Organice el cuidado de los niños con un adulto de confianza de inmediato si puede ser detenido. Documente los acuerdos de custodia existentes y contacte a su abogado si CPS se comunica con usted.",
      zh: "如果您可能被关押，立即安排受信任的成年人照看孩子。记录现有的监护安排，如果CPS联系您，请联系您的律师。",
    },
    link: {
      href: "/support/childcare",
      label: { en: "Childcare support", es: "Apoyo para cuidado infantil", zh: "儿童照顾支持" },
    },
  },
  {
    id: "housing",
    urgency: 4,
    Icon: Home,
    color: "text-blue-700 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
    title: {
      en: "Housing and Eviction Risk",
      es: "Riesgo de Vivienda y Desalojo",
      zh: "住房和驱逐风险",
    },
    what: {
      en: "Public housing authorities and Section 8 programs can begin eviction proceedings based on an arrest alone, before any conviction. Federal one-strike rules give housing authorities broad authority to act. Private landlords may also have lease clauses that treat an arrest as a violation.",
      es: "Las autoridades de vivienda pública y los programas de la Sección 8 pueden iniciar procedimientos de desalojo basándose únicamente en un arresto, antes de cualquier condena. Las reglas federales de un solo incidente dan a las autoridades de vivienda una amplia autoridad para actuar. Los arrendadores privados también pueden tener cláusulas en el contrato que tratan un arresto como una violación.",
      zh: "公共住房管理机构和第八章计划可以仅凭逮捕（在任何定罪之前）开始驱逐程序。联邦一次违规即驱逐规则赋予住房管理机构广泛权力。私人房东的租约中也可能有将逮捕视为违约的条款。",
    },
    clock: {
      en: "Public housing authorities can begin proceedings within days of an arrest. Review your lease immediately.",
      es: "Las autoridades de vivienda pública pueden iniciar procedimientos en pocos días después del arresto. Revise su contrato de arrendamiento de inmediato.",
      zh: "公共住房管理机构可以在逮捕后几天内开始程序。请立即查看您的租约。",
    },
    action: {
      en: "Review your lease for arrest or criminal activity clauses. If you live in public housing or use a Section 8 voucher, contact a housing attorney before the housing authority contacts you.",
      es: "Revise su contrato para ver las cláusulas de arresto o actividad criminal. Si vive en vivienda pública o usa un vale de la Sección 8, contacte a un abogado de vivienda antes de que la autoridad de vivienda se comunique con usted.",
      zh: "查看您的租约中关于逮捕或犯罪活动的条款。如果您住在公共住房或使用第八章住房券，请在住房管理机构联系您之前咨询住房律师。",
    },
    link: {
      href: "/support/housing",
      label: { en: "Housing support", es: "Apoyo de vivienda", zh: "住房支持" },
    },
  },
  {
    id: "employment",
    urgency: 5,
    Icon: Briefcase,
    color: "text-teal-700 dark:text-teal-400",
    bg: "bg-teal-50 dark:bg-teal-950/30",
    border: "border-teal-200 dark:border-teal-800",
    title: {
      en: "Employment Risk",
      es: "Riesgo de Empleo",
      zh: "就业风险",
    },
    what: {
      en: "At-will employers can terminate employment after an arrest even without a conviction. Some jobs require employees to report arrests to HR within a set number of days. Roles requiring security clearances or working with vulnerable populations face the highest risk of suspension.",
      es: "Los empleadores a voluntad pueden despedir después de un arresto incluso sin condena. Algunos empleos requieren que los empleados reporten los arrestos a recursos humanos dentro de un número determinado de días. Los puestos que requieren autorización de seguridad o trabajo con poblaciones vulnerables enfrentan el mayor riesgo de suspensión.",
      zh: "随意雇佣关系的雇主可以在逮捕后（即使没有定罪）终止雇佣。某些工作要求员工在规定天数内向人力资源部门报告逮捕情况。需要安全许可或与弱势群体合作的职位面临最高的停职风险。",
    },
    clock: {
      en: "There is no set timeline. An at-will employer can act immediately. Check your employment contract for arrest reporting requirements.",
      es: "No hay un plazo establecido. Un empleador a voluntad puede actuar de inmediato. Revise su contrato de trabajo para conocer los requisitos de notificación.",
      zh: "没有固定的时间限制。随意雇佣的雇主可以立即采取行动。查看您的劳动合同了解逮捕报告要求。",
    },
    action: {
      en: "Review your employment contract and employee handbook for arrest reporting obligations. Do not volunteer information to your employer before consulting your attorney.",
      es: "Revise su contrato de trabajo y el manual del empleado para conocer las obligaciones de notificación de arrestos. No proporcione información a su empleador antes de consultar a su abogado.",
      zh: "查看您的劳动合同和员工手册了解逮捕报告义务。在咨询律师之前，不要主动向雇主提供信息。",
    },
    link: {
      href: "/support/employment",
      label: { en: "Employment support", es: "Apoyo de empleo", zh: "就业支持" },
    },
  },
  {
    id: "benefits",
    urgency: 6,
    Icon: DollarSign,
    color: "text-violet-700 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    border: "border-violet-200 dark:border-violet-800",
    title: {
      en: "Federal Benefits Risk",
      es: "Riesgo de Beneficios Federales",
      zh: "联邦福利风险",
    },
    what: {
      en: "Some federal benefit programs require you to report an arrest. A conviction for certain offenses, particularly drug offenses, can result in automatic disqualification from programs like SNAP and federal student aid. A felony conviction triggers a lifetime SNAP ban in some states.",
      es: "Algunos programas de beneficios federales requieren que reporte un arresto. Una condena por ciertos delitos, en particular de drogas, puede resultar en descalificación automática de programas como SNAP y la ayuda federal para estudiantes. Una condena por delito grave puede desencadenar una prohibición de por vida de SNAP en algunos estados.",
      zh: "某些联邦福利计划要求您报告逮捕情况。对某些罪行（特别是毒品罪行）的定罪可能导致自动取消SNAP和联邦学生援助等项目的资格。在某些州，重罪定罪可能触发终身禁止SNAP的规定。",
    },
    clock: {
      en: "Reporting requirements vary by program. Some require notification within 10 days of an arrest. Contact your caseworker to understand your obligations.",
      es: "Los requisitos de notificación varían según el programa. Algunos requieren notificación dentro de los 10 días posteriores al arresto. Contacte a su trabajador social para comprender sus obligaciones.",
      zh: "报告要求因计划而异。某些计划要求在逮捕后10天内通知。联系您的案例工作者了解您的具体义务。",
    },
    action: {
      en: "Contact your benefits caseworker to understand your reporting obligations. Ask your attorney whether the charges you face carry automatic benefits consequences.",
      es: "Contacte a su trabajador social de beneficios para comprender sus obligaciones de notificación. Pregúntele a su abogado si los cargos que enfrenta conllevan consecuencias automáticas en los beneficios.",
      zh: "联系您的福利案例工作者了解报告义务。询问您的律师，您面临的指控是否会自动产生福利后果。",
    },
    link: {
      href: "/support/finances",
      label: { en: "Financial support", es: "Apoyo financiero", zh: "财务支持" },
    },
  },
  {
    id: "license",
    urgency: 7,
    Icon: Award,
    color: "text-slate-700 dark:text-slate-400",
    bg: "bg-slate-50 dark:bg-slate-950/30",
    border: "border-slate-200 dark:border-slate-800",
    title: {
      en: "Professional License Risk",
      es: "Riesgo de Licencia Profesional",
      zh: "职业许可证风险",
    },
    what: {
      en: "Many licensing boards require license holders to report arrests within 30 days and can suspend a license pending the outcome of a case. Fields with the highest risk include nursing, teaching, law, real estate, contracting, security work, and any profession requiring a background check for renewal.",
      es: "Muchas juntas de licencias requieren que los titulares reporten los arrestos dentro de los 30 días y pueden suspender una licencia mientras se conoce el resultado del caso. Los campos con mayor riesgo incluyen enfermería, docencia, derecho, bienes raíces, contratación y cualquier profesión que requiera verificación de antecedentes para la renovación.",
      zh: "许多许可委员会要求持证人在30天内报告逮捕情况，并可在案件结果出来之前暂停许可证。风险最高的领域包括护理、教学、法律、房地产、承包、安保工作以及任何需要背景调查才能续证的职业。",
    },
    clock: {
      en: "Most licensing boards require reporting within 30 days of an arrest. Some boards act immediately upon notification. Check your board's specific rules.",
      es: "La mayoría de las juntas de licencias requieren notificación dentro de los 30 días posteriores al arresto. Algunas juntas actúan de inmediato al recibir la notificación. Verifique las reglas específicas de su junta.",
      zh: "大多数许可委员会要求在逮捕后30天内报告。某些委员会在收到通知后立即采取行动。查看您委员会的具体规定。",
    },
    action: {
      en: "Look up your licensing board's rules on arrest reporting. Contact an attorney who handles professional licensing matters before you report to your board.",
      es: "Consulte las reglas de su junta de licencias sobre la notificación de arrestos. Contacte a un abogado que maneje asuntos de licencias profesionales antes de reportar a su junta.",
      zh: "查阅您的许可委员会关于逮捕报告的规定。在向委员会报告之前，联系处理职业许可事务的律师。",
    },
    link: {
      href: "/legal-aid",
      label: { en: "Find legal help", es: "Encontrar ayuda legal", zh: "寻找ayuda legal" },
    },
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

function txt(t: TriText, lang: Lang): string {
  return t[lang] ?? t.en;
}

function getLang(code: string): Lang {
  if (code.startsWith("es")) return "es";
  if (code.startsWith("zh")) return "zh";
  return "en";
}

function buildPlainText(answers: Record<QuestionId, Answer>, lang: Lang): string {
  const activeRisks = RISKS.filter(r => answers[r.id] === "yes").sort((a, b) => a.urgency - b.urgency);

  const today = new Date().toLocaleDateString(
    lang === "zh" ? "zh-CN" : lang === "es" ? "es-ES" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  const L = {
    heading: { en: "ARREST-STAGE RISK SUMMARY", es: "RESUMEN DE RIESGOS AL MOMENTO DEL ARRESTO", zh: "逮捕阶段风险摘要" },
    date: { en: `Generated: ${today}`, es: `Generado: ${today}`, zh: `生成日期: ${today}` },
    noRisk: {
      en: "No active risks identified based on your answers.",
      es: "No se identificaron riesgos activos según sus respuestas.",
      zh: "根据您的回答，未发现活跃风险。",
    },
    timeline: { en: "Timeline:", es: "Plazo:", zh: "时间：" },
    action: { en: "Act now:", es: "Actuar ahora:", zh: "立即行动：" },
    disclaimer: {
      en: "This summary is for your own use. Consult an attorney before sharing it with anyone. This is general information only and does not constitute legal advice.",
      es: "Este resumen es para su uso personal. Consulte a un abogado antes de compartirlo. Esta es solo información general y no constituye asesoramiento legal.",
      zh: "此摘要仅供您个人使用。在与任何人分享之前，请咨询律师。这仅为一般信息，不构成法律建议。",
    },
  };

  const lines = [txt(L.heading, lang), txt(L.date, lang), ""];

  if (activeRisks.length === 0) {
    lines.push(txt(L.noRisk, lang));
  } else {
    for (const r of activeRisks) {
      lines.push(`** ${txt(r.title, lang)} **`);
      lines.push(txt(r.what, lang));
      lines.push("");
      lines.push(`${txt(L.timeline, lang)} ${txt(r.clock, lang)}`);
      lines.push(`${txt(L.action, lang)} ${txt(r.action, lang)}`);
      lines.push("");
    }
  }

  lines.push("---");
  lines.push(txt(L.disclaimer, lang));
  return lines.join("\n");
}

/* ------------------------------------------------------------------ */
/* Privacy note component                                              */
/* ------------------------------------------------------------------ */

function PrivacyNote({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 px-3 py-2.5 mt-3">
      <Lock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
      <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">{text}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                       */
/* ------------------------------------------------------------------ */

const QUESTION_ORDER: QuestionId[] = [
  "housing", "employment", "immigration", "benefits", "children", "supervision", "license",
];

export default function CollateralConsequences() {
  useScrollToTop();
  const { i18n } = useTranslation();
  const lang = getLang(i18n.language);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<QuestionId, Answer>>({
    housing: null, employment: null, immigration: null,
    benefits: null, children: null, supervision: null, license: null,
  });
  const [copied, setCopied] = useState(false);

  const isResults = step === QUESTION_ORDER.length;
  const progress = Math.round((step / QUESTION_ORDER.length) * 100);
  const question = QUESTIONS[step];
  const currentId = QUESTION_ORDER[step];

  const activeRisks = RISKS
    .filter(r => answers[r.id] === "yes")
    .sort((a, b) => a.urgency - b.urgency);

  function handleAnswer(ans: "yes" | "no") {
    setAnswers(prev => ({ ...prev, [currentId]: ans }));
    setStep(s => s + 1);
  }

  function handleBack() {
    if (step > 0) setStep(s => s - 1);
  }

  function handleRestart() {
    setStep(0);
    setAnswers({ housing: null, employment: null, immigration: null, benefits: null, children: null, supervision: null, license: null });
  }

  async function handleCopy() {
    const text = buildPlainText(answers, lang);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  function handlePrint() {
    const text = buildPlainText(answers, lang);
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Risk Summary</title><style>body{font-family:Georgia,serif;font-size:13px;line-height:1.75;max-width:680px;margin:48px auto;padding:0 24px;color:#111}pre{white-space:pre-wrap;word-break:break-word}</style></head><body><pre>${text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre></body></html>`);
    win.document.close();
    win.print();
  }

  const ui = {
    badge: { en: "Arrest stage", es: "Etapa de arresto", zh: "逮捕阶段" },
    pageTitle: { en: "Arrest-Stage Risk Screener", es: "Verificador de Riesgos al Momento del Arresto", zh: "逮捕阶段风险筛查" },
    pageDesc: {
      en: "An arrest can immediately put housing, employment, and other vital systems at risk, even before any conviction. Answer 7 quick yes-or-no questions to see what may need attention right now.",
      es: "Un arresto puede poner en riesgo inmediatamente la vivienda, el empleo y otros sistemas vitales, incluso antes de una condena. Responda 7 preguntas rápidas para ver qué puede necesitar atención ahora mismo.",
      zh: "逮捕可能立即对住房、就业和其他重要方面产生影响，甚至在定罪之前。回答7个简短的是否问题，了解现在需要关注什么。",
    },
    qOf: {
      en: (n: number, t: number) => `Question ${n} of ${t}`,
      es: (n: number, t: number) => `Pregunta ${n} de ${t}`,
      zh: (n: number, t: number) => `第 ${n} 题，共 ${t} 题`,
    },
    yes: { en: "Yes", es: "Sí", zh: "是" },
    no: { en: "No", es: "No", zh: "否" },
    back: { en: "Back", es: "Volver", zh: "返回" },
    resultsTitle: { en: "Your Risk Summary", es: "Su Resumen de Riesgos", zh: "您的风险摘要" },
    resultsDesc: {
      en: "These systems may be at immediate risk based on your answers. The most urgent items appear first.",
      es: "Estos sistemas pueden estar en riesgo inmediato según sus respuestas. Los elementos más urgentes aparecen primero.",
      zh: "根据您的回答，这些方面可能面临直接风险。最紧急的事项排在最前面。",
    },
    noRiskTitle: { en: "No Active Risks Identified", es: "No Se Identificaron Riesgos Activos", zh: "未发现活跃风险" },
    noRiskDesc: {
      en: "Based on your answers, none of the civil systems we screen for appear to be at immediate risk from this arrest. This does not cover every possible consequence. Speak with your attorney about your specific situation.",
      es: "Según sus respuestas, ninguno de los sistemas civiles que evaluamos parece estar en riesgo inmediato por este arresto. Esto no cubre todas las posibles consecuencias. Hable con su abogado sobre su situación específica.",
      zh: "根据您的回答，我们筛查的民事系统中没有一项因本次逮捕而面临直接风险。这并不涵盖所有可能的后果。请与您的律师讨论您的具体情况。",
    },
    whatLabel: { en: "What's at risk", es: "Qué está en riesgo", zh: "什么处于风险中" },
    timelineLabel: { en: "Timeline", es: "Plazo", zh: "时间表" },
    actionLabel: { en: "Act now", es: "Actuar ahora", zh: "立即行动" },
    disclaimer: {
      en: "This summary is for your own use. Consult an attorney before sharing it with anyone.",
      es: "Este resumen es para su uso personal. Consulte a un abogado antes de compartirlo con cualquier persona.",
      zh: "此摘要仅供您个人使用。在与任何人分享之前，请咨询律师。",
    },
    generalInfo: {
      en: "General information only. Not legal advice.",
      es: "Solo información general. No es asesoramiento legal.",
      zh: "仅为一般信息，不构成法律建议。",
    },
    copyBtn: { en: "Copy summary", es: "Copiar resumen", zh: "复制摘要" },
    copiedBtn: { en: "Copied", es: "Copiado", zh: "已复制" },
    printBtn: { en: "Print", es: "Imprimir", zh: "打印" },
    restart: { en: "Start over", es: "Comenzar de nuevo", zh: "重新开始" },
    backToHub: { en: "Back to Advocate Hub", es: "Volver al Centro de Defensores", zh: "返回倡导者中心" },
    privacyStrip: {
      en: "This tool stores none of your answers. All processing happens locally on your device.",
      es: "Esta herramienta no almacena ninguna de sus respuestas. Todo el procesamiento ocurre localmente en su dispositivo.",
      zh: "此工具不存储您的任何回答。所有处理仅在您的设备上本地完成。",
    },
  };

  const T = (key: keyof typeof ui): string => {
    const v = ui[key];
    if (typeof v === "object" && "en" in v && typeof (v as TriText).en === "string") {
      return txt(v as TriText, lang);
    }
    return "";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="vivid-header-rose py-12 md:py-16" aria-labelledby="screener-heading">
        <div className="max-w-2xl mx-auto px-4 vivid-header-content text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-white/80 text-xs font-semibold uppercase tracking-wider mb-4">
              <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
              {T("badge")}
            </div>
            <h1 id="screener-heading" className="text-2xl md:text-3xl font-black text-white mb-4 leading-tight">
              {T("pageTitle")}
            </h1>
            <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-xl mx-auto">
              {T("pageDesc")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Screener body */}
      <section className="py-10 md:py-14">
        <div className="max-w-xl mx-auto px-4">

          {/* ---------- QUESTION FLOW ---------- */}
          {!isResults ? (
            <>
              {/* Progress bar */}
              <div className="mb-6" aria-label={ui.qOf[lang](step + 1, QUESTION_ORDER.length)}>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span className="font-semibold">{ui.qOf[lang](step + 1, QUESTION_ORDER.length)}</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                  <motion.div
                    className="h-full bg-rose-500 rounded-full"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Question card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <div className="rounded-2xl border border-border bg-card shadow-sm p-6 md:p-8 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mb-5">
                      <question.Icon className="h-6 w-6 text-rose-600 dark:text-rose-400" strokeWidth={1.75} aria-hidden="true" />
                    </div>
                    <h2 className="text-lg font-bold text-foreground leading-snug mb-2">
                      {txt(question.question, lang)}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {txt(question.sub, lang)}
                    </p>
                    {question.privacyNote && (
                      <PrivacyNote text={txt(question.privacyNote, lang)} />
                    )}
                  </div>

                  {/* Yes / No buttons */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      onClick={() => handleAnswer("yes")}
                      className="flex items-center justify-center py-4 rounded-xl border-2 border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 font-bold text-base hover:border-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                      aria-label={`${T("yes")}: ${txt(question.question, lang)}`}
                    >
                      {T("yes")}
                    </button>
                    <button
                      onClick={() => handleAnswer("no")}
                      className="flex items-center justify-center py-4 rounded-xl border-2 border-border bg-background text-foreground font-bold text-base hover:border-muted-foreground hover:bg-muted/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label={`${T("no")}: ${txt(question.question, lang)}`}
                    >
                      {T("no")}
                    </button>
                  </div>

                  {/* Back */}
                  {step > 0 && (
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                      {T("back")}
                    </button>
                  )}
                </motion.div>
              </AnimatePresence>
            </>
          ) : (
            /* ---------- RESULTS ---------- */
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              {activeRisks.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" aria-hidden="true" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-3">{T("noRiskTitle")}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto mb-6">
                    {T("noRiskDesc")}
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-foreground mb-1">{T("resultsTitle")}</h2>
                    <p className="text-sm text-muted-foreground">{T("resultsDesc")}</p>
                  </div>

                  <div className="space-y-4 mb-6">
                    {activeRisks.map((risk, i) => (
                      <motion.div
                        key={risk.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.22 }}
                        className={`rounded-xl border p-5 ${risk.bg} ${risk.border}`}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <risk.Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${risk.color}`} strokeWidth={1.75} aria-hidden="true" />
                          <h3 className={`font-bold text-sm leading-snug ${risk.color}`}>{txt(risk.title, lang)}</h3>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-0.5">
                              {T("whatLabel")}
                            </p>
                            <p className="text-foreground leading-relaxed">{txt(risk.what, lang)}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-0.5">
                              {T("timelineLabel")}
                            </p>
                            <p className="text-foreground leading-relaxed">{txt(risk.clock, lang)}</p>
                          </div>
                          <div className={`rounded-lg border p-3 ${risk.bg} ${risk.border}`}>
                            <p className="text-xs font-bold uppercase tracking-wider mb-0.5 text-muted-foreground">
                              {T("actionLabel")}
                            </p>
                            <p className="text-foreground leading-relaxed">{txt(risk.action, lang)}</p>
                          </div>
                          <Link href={risk.link.href}>
                            <span className={`text-xs font-semibold flex items-center gap-1 ${risk.color} hover:underline cursor-pointer`}>
                              {txt(risk.link.label, lang)}
                              <ArrowRight className="h-3 w-3" aria-hidden="true" />
                            </span>
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}

              {/* Disclaimer */}
              <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 px-4 py-3 mb-5">
                <Info className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div className="text-xs text-muted-foreground leading-relaxed space-y-0.5">
                  <p>{T("disclaimer")}</p>
                  <p>{T("generalInfo")}</p>
                </div>
              </div>

              {/* Export controls */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background text-sm font-semibold text-foreground hover:bg-muted/40 transition-colors"
                  aria-live="polite"
                >
                  {copied
                    ? <><Check className="h-4 w-4 text-green-600" aria-hidden="true" />{T("copiedBtn")}</>
                    : <><Copy className="h-4 w-4" aria-hidden="true" />{T("copyBtn")}</>
                  }
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background text-sm font-semibold text-foreground hover:bg-muted/40 transition-colors"
                >
                  <Printer className="h-4 w-4" aria-hidden="true" />
                  {T("printBtn")}
                </button>
                <button
                  onClick={handleRestart}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                >
                  {T("restart")}
                </button>
              </div>

              {/* Back to advocate hub */}
              <div className="border-t border-border pt-5">
                <Link href="/for-advocates">
                  <span className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors cursor-pointer">
                    <ArrowLeft className="h-3 w-3" aria-hidden="true" />
                    {T("backToHub")}
                  </span>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Privacy strip */}
      <section className="py-8 border-t border-border/30 bg-muted/20">
        <div className="max-w-xl mx-auto px-4 text-center">
          <Shield className="h-5 w-5 text-muted-foreground mx-auto mb-2" aria-hidden="true" />
          <p className="text-xs text-muted-foreground leading-relaxed">{T("privacyStrip")}</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
