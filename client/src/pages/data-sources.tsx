import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { Link } from "wouter";
import { AlertTriangle, CheckCircle, Info, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

// States whose preliminary-hearing and discovery-deadline fields are estimates
// (arraignment, bail, and speedy-trial are fully verified for all 52 jurisdictions)
const ESTIMATE_JURISDICTIONS = [
  'MA', 'MO', 'LA', 'OK', 'CT', 'NM', 'NE', 'WV', 'ID', 'HI',
  'NH', 'ME', 'MT', 'RI', 'SD', 'ND', 'AK', 'VT', 'WY', 'DC',
];

const sourceDisclosureCopy = {
  en: {
    title: "Data Sources & Methodology",
    subtitle: "Where our legal content comes from, how confident we are in it, and what its limitations are.",
    reviewed: "Last reviewed: August 2026",
    heading: "Three things every user should know before relying on this platform",
    items: [
      ["Most criminal-charge entries are curated and synthesized, not verbatim state statutes.", "The base charge dataset was organized using Model Penal Code patterns and other curated research. Some statute codes are generated organizational placeholders. Never cite them as authoritative without checking the current official code."],
      ["Some preliminary-hearing and discovery timeframes are estimates.", `For ${ESTIMATE_JURISDICTIONS.join(", ")}, those fields have not all been verified against primary sources and are shown as approximations. Court rules and case-specific orders can also change any deadline.`],
      ["The platform has not completed a full licensed-attorney review.", "Content draws from public legal sources, curated datasets, user-selected inputs, and sometimes AI-generated text. It may be incomplete, estimated, outdated, mistranslated, or wrong. It is general educational information, not legal advice. Verify important details, deadlines, and citations with an attorney and a current official source."],
    ],
    badges: {
      verified: "Verified",
      partial: "Partially Estimated",
      estimated: "Estimated",
    },
    sectionTitles: {
      "§1": "Jurisdiction Procedure Rules",
      "§2": "Criminal Charges Database",
      "§2b": "Charge Explanations",
      "§3": "Collateral Consequences",
      "§4": "Constitutional Rights",
      "§5": "Expungement Eligibility",
      "§6": "Diversion Programs",
      "§7": "Legal Aid Organizations",
      "§8": "Jury Instruction References",
      "§9": "External Validation APIs",
      "§10": "AI Guidance",
    },
    labels: {
      sourceType: "Source type",
      primarySource: "Primary source",
      primarySources: "Primary sources",
      primaryCitations: "Primary citations",
      coverage: "Coverage",
    },
    reportError: {
      lead: "Spotted an error?",
      body: (
        <>
          Email{" "}
          <a
            href="mailto:legal-data@opendefender.io"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
          >
            legal-data@opendefender.io
          </a>{" "}
          with the state, the section, and what you believe the correct rule to be. We review all
          submissions and update the platform within 30 days of confirmed corrections.
        </>
      ),
    },
    methodology: {
      title: "Methodology & coverage summary",
      intro: "Before the detailed inventory below, here is what our legal content is built from and what its confidence labels mean.",
      sourceHeading: "Kinds of sources used",
      sources: [
        "Official primary law: state statutes, court rules, and case law (one cited source per rule where verified).",
        "Curated or synthesized charge entries organized from Model Penal Code patterns — some statute codes are generated organizational placeholders, not official code.",
        "Public APIs and datasets: OpenLaws, CourtListener/RECAP, GovInfo (U.S. GPO), and the LOCUS municipal-ordinance dataset.",
        "Court-published jury instructions (some free, some paywalled), referenced by series number and, where available, a direct link.",
      ],
      confidenceHeading: "What the confidence labels mean",
      confidence: [
        ["Verified", "Checked against a primary or authoritative source with a specific citation."],
        ["Partially Estimated", "Mostly verified, but some fields (for example, certain preliminary-hearing or discovery deadlines) are approximations not yet confirmed against a primary source."],
        ["Estimated", "An approximation shown when a primary source has not been confirmed; treat it as a starting point, not authority."],
      ],
      limitationsHeading: "Key limitations",
      limitations: [
        "Some citations, statute placeholders, and deadlines still need verification against the current official source before you rely on them.",
        "This inventory has not been fully reviewed by a licensed attorney. It is general educational information, not legal advice.",
      ],
      reportHeading: "How to report an error",
      report: (
        <>
          Email{" "}
          <a
            href="mailto:legal-data@opendefender.io"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
          >
            legal-data@opendefender.io
          </a>{" "}
          with the state, the section, and the correction you believe is needed. We review all submissions and update the platform within 30 days of confirmed corrections.
        </>
      ),
      englishNote: "The detailed inventory below is currently presented in English. The material limitations described above apply in every language.",
    },
  },
  es: {
    title: "Fuentes de Datos y Metodología",
    subtitle: "De dónde proviene el contenido legal, nuestro nivel de confianza y sus limitaciones.",
    reviewed: "Última revisión: agosto de 2026",
    heading: "Tres cosas que toda persona debe saber antes de confiar en esta plataforma",
    items: [
      ["La mayoría de las entradas de cargos penales son seleccionadas y sintetizadas; no son copias textuales de estatutos estatales.", "El conjunto base se organizó con patrones del Código Penal Modelo y otra investigación seleccionada. Algunos códigos son marcadores generados para organizar información. No los cite como autoridad sin verificar el código oficial vigente."],
      ["Algunos plazos de audiencia preliminar y descubrimiento son estimaciones.", `Para ${ESTIMATE_JURISDICTIONS.join(", ")}, no todos esos campos se han verificado con fuentes primarias y se muestran como aproximaciones. Las reglas judiciales y órdenes de un caso también pueden cambiar cualquier plazo.`],
      ["La plataforma no ha completado una revisión integral por abogados con licencia.", "El contenido se basa en fuentes legales públicas, datos seleccionados, entradas elegidas por el usuario y, a veces, texto generado por IA. Puede estar incompleto, estimado, desactualizado, mal traducido o ser incorrecto. Es información educativa general, no asesoramiento legal. Verifique detalles, plazos y citas importantes con un abogado y una fuente oficial vigente."],
    ],
    badges: {
      verified: "Verificado",
      partial: "Parcialmente estimado",
      estimated: "Estimado",
    },
    sectionTitles: {
      "§1": "Reglas de procedimiento por jurisdicción",
      "§2": "Base de datos de cargos penales",
      "§2b": "Explicaciones de cargos",
      "§3": "Consecuencias colaterales",
      "§4": "Derechos constitucionales",
      "§5": "Elegibilidad para eliminación de antecedentes",
      "§6": "Programas de derivación",
      "§7": "Organizaciones de asistencia legal",
      "§8": "Referencias de instrucciones al jurado",
      "§9": "API de validación externa",
      "§10": "Orientación con IA",
    },
    labels: {
      sourceType: "Tipo de fuente",
      primarySource: "Fuente principal",
      primarySources: "Fuentes principales",
      primaryCitations: "Citas principales",
      coverage: "Cobertura",
    },
    reportError: {
      lead: "¿Encontró un error?",
      body: (
        <>
          Escriba a{" "}
          <a
            href="mailto:legal-data@opendefender.io"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
          >
            legal-data@opendefender.io
          </a>{" "}
          indicando el estado, la sección y cuál cree que es la regla correcta. Revisamos todos los
          envíos y actualizamos la plataforma dentro de los 30 días de confirmar una corrección.
        </>
      ),
    },
    methodology: {
      title: "Resumen de metodología y cobertura",
      intro: "Antes del inventario detallado que aparece abajo, esto es de qué se compone nuestro contenido legal y qué significan sus etiquetas de confianza.",
      sourceHeading: "Tipos de fuentes utilizadas",
      sources: [
        "Ley primaria oficial: estatutos estatales, reglas judiciales y jurisprudencia (una fuente citada por regla cuando está verificada).",
        "Entradas de cargos seleccionadas o sintetizadas y organizadas a partir de patrones del Código Penal Modelo; algunos códigos de estatuto son marcadores generados para organizar información, no el código oficial.",
        "API y conjuntos de datos públicos: OpenLaws, CourtListener/RECAP, GovInfo (GPO de EE. UU.) y el conjunto de datos de ordenanzas municipales LOCUS.",
        "Instrucciones al jurado publicadas por los tribunales (algunas gratuitas, otras de pago), referenciadas por número de serie y, cuando es posible, con un enlace directo.",
      ],
      confidenceHeading: "Qué significan las etiquetas de confianza",
      confidence: [
        ["Verificado", "Comprobado con una fuente primaria o autorizada, con una cita específica."],
        ["Parcialmente estimado", "En su mayoría verificado, pero algunos campos (por ejemplo, ciertos plazos de audiencia preliminar o descubrimiento) son aproximaciones aún no confirmadas con una fuente primaria."],
        ["Estimado", "Una aproximación que se muestra cuando no se ha confirmado una fuente primaria; tómela como punto de partida, no como autoridad."],
      ],
      limitationsHeading: "Limitaciones clave",
      limitations: [
        "Algunas citas, marcadores de estatutos y plazos aún deben verificarse con la fuente oficial vigente antes de que usted confíe en ellos.",
        "Este inventario no ha sido revisado en su totalidad por un abogado con licencia. Es información educativa general, no asesoramiento legal.",
      ],
      reportHeading: "Cómo reportar un error",
      report: (
        <>
          Escriba a{" "}
          <a
            href="mailto:legal-data@opendefender.io"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
          >
            legal-data@opendefender.io
          </a>{" "}
          indicando el estado, la sección y la corrección que cree necesaria. Revisamos todos los envíos y actualizamos la plataforma dentro de los 30 días de confirmar una corrección.
        </>
      ),
      englishNote: "El inventario detallado que aparece abajo se presenta actualmente en inglés. Las limitaciones materiales descritas arriba aplican en todos los idiomas.",
    },
  },
  zh: {
    title: "数据来源与方法",
    subtitle: "法律内容来自何处、我们对其可信度的判断，以及内容的局限。",
    reviewed: "最后审查：2026年8月",
    heading: "依赖本平台前，每位用户都应了解的三件事",
    items: [
      ["大多数刑事指控条目是精选和综合整理的内容，并非州法规原文。", "基础指控数据依据《示范刑法典》模式和其他精选研究整理。部分法规代码是为组织信息而生成的占位符。未经查验最新官方法典，请勿将其作为权威引证。"],
      ["部分初步听证和证据开示期限属于估算。", `对于 ${ESTIMATE_JURISDICTIONS.join("、")}，相关字段尚未全部通过一手来源核实，因此以近似值显示。法院规则和个案命令也可能改变任何截止日期。`],
      ["本平台尚未完成持牌律师的全面审查。", "内容来自公共法律来源、精选数据集、用户选择的输入，以及部分 AI 生成文字。内容可能不完整、属于估算、已过时、翻译有误或不正确。这只是一般教育信息，并非法律建议。请向律师和最新官方来源核实重要细节、截止日期和引证。"],
    ],
    badges: {
      verified: "已核实",
      partial: "部分为估算",
      estimated: "估算",
    },
    sectionTitles: {
      "§1": "各法域程序规则",
      "§2": "刑事指控数据库",
      "§2b": "指控说明",
      "§3": "附带后果",
      "§4": "宪法权利",
      "§5": "记录清除资格",
      "§6": "转介项目",
      "§7": "法律援助机构",
      "§8": "陪审团指示参考",
      "§9": "外部验证 API",
      "§10": "AI 指导",
    },
    labels: {
      sourceType: "来源类型",
      primarySource: "主要来源",
      primarySources: "主要来源",
      primaryCitations: "主要引证",
      coverage: "覆盖范围",
    },
    reportError: {
      lead: "发现错误？",
      body: (
        <>
          请发送邮件至{" "}
          <a
            href="mailto:legal-data@opendefender.io"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
          >
            legal-data@opendefender.io
          </a>{" "}
          ，并注明州、相关章节以及您认为正确的规则。我们会审核所有反馈，并在确认更正后 30 天内更新平台。
        </>
      ),
    },
    methodology: {
      title: "方法与覆盖范围摘要",
      intro: "在下方详细清单之前，以下说明我们的法律内容由什么构成，以及各可信度标签的含义。",
      sourceHeading: "所使用的来源类型",
      sources: [
        "官方一手法律：州法规、法院规则和判例法（已核实的规则均标注一个引证来源）。",
        "依据《示范刑法典》模式整理的精选或综合指控条目；部分法规代码是为组织信息而生成的占位符，并非官方法典。",
        "公共 API 和数据集：OpenLaws、CourtListener/RECAP、GovInfo（美国 GPO）以及 LOCUS 市政条例数据集。",
        "法院发布的陪审团指示（部分免费，部分需付费），以系列编号引用，并在可能时提供直接链接。",
      ],
      confidenceHeading: "可信度标签的含义",
      confidence: [
        ["已核实", "已对照一手或权威来源核实，并附有具体引证。"],
        ["部分为估算", "大部分已核实，但部分字段（例如某些初步听证或证据开示期限）为尚未通过一手来源确认的近似值。"],
        ["估算", "在未确认一手来源时显示的近似值；请将其视为参考起点，而非权威依据。"],
      ],
      limitationsHeading: "主要局限",
      limitations: [
        "在您依赖之前，部分引证、法规占位符和截止日期仍需对照最新官方来源进行核实。",
        "本清单尚未经过持牌律师的全面审查。它只是一般教育信息，并非法律建议。",
      ],
      reportHeading: "如何报告错误",
      report: (
        <>
          请发送邮件至{" "}
          <a
            href="mailto:legal-data@opendefender.io"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
          >
            legal-data@opendefender.io
          </a>{" "}
          ，并注明州、相关章节以及您认为需要的更正。我们会审核所有反馈，并在确认更正后 30 天内更新平台。
        </>
      ),
      englishNote: "下方的详细清单目前以英文呈现。上述实质性限制适用于所有语言。",
    },
  },
} as const;

type DisclosureCopy = typeof sourceDisclosureCopy[keyof typeof sourceDisclosureCopy];

function ConfidenceBadge({
  level,
  copy,
}: {
  level: 'verified' | 'estimated' | 'partial';
  copy: DisclosureCopy;
}) {
  if (level === 'verified') {
    return (
      <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50 dark:text-green-400 dark:border-green-700 dark:bg-green-950/20 gap-1">
        <CheckCircle className="h-3 w-3" />
        {copy.badges.verified}
      </Badge>
    );
  }
  if (level === 'partial') {
    return (
      <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50 dark:text-amber-400 dark:border-amber-700 dark:bg-amber-950/20 gap-1">
        <Info className="h-3 w-3" />
        {copy.badges.partial}
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-orange-700 border-orange-300 bg-orange-50 dark:text-orange-400 dark:border-orange-700 dark:bg-orange-950/20 gap-1">
      <AlertTriangle className="h-3 w-3" />
      {copy.badges.estimated}
    </Badge>
  );
}

function SectionHeader({
  number,
  confidence,
  copy,
}: {
  number: keyof DisclosureCopy["sectionTitles"];
  confidence: 'verified' | 'estimated' | 'partial';
  copy: DisclosureCopy;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <span className="text-sm font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
        {number}
      </span>
      <h2 className="text-2xl md:text-3xl font-bold">{copy.sectionTitles[number]}</h2>
      <ConfidenceBadge level={confidence} copy={copy} />
    </div>
  );
}

function ReportError({ copy }: { copy: DisclosureCopy }) {
  return (
    <div className="mt-4 pt-4 border-t border-border">
      <p className="text-sm text-muted-foreground flex items-start gap-2">
        <Mail className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
        <span>
          <strong className="text-foreground">{copy.reportError.lead}</strong>{" "}
          {copy.reportError.body}
        </span>
      </p>
    </div>
  );
}

export default function DataSources() {
  useScrollToTop();
  const { i18n } = useTranslation();
  const language = i18n.language.startsWith("es") ? "es" : i18n.language.startsWith("zh") ? "zh" : "en";
  const copy: DisclosureCopy = sourceDisclosureCopy[language];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="vivid-header py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 vivid-header-content text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-white">
            {copy.title}
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto">
            {copy.subtitle}
          </p>
          <p className="text-sm text-white/60 mt-2">{copy.reviewed}</p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">

        {/* Top Limitations Card */}
        <ScrollReveal>
          <Alert className="mb-12 border-amber-300 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-700">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-900 dark:text-amber-200 ml-2">
              <p className="font-semibold text-base mb-3">{copy.heading}</p>
              <ol className="list-decimal pl-4 space-y-2 text-sm leading-relaxed">
                {copy.items.map(([lead, body]) => (
                  <li key={lead}>
                    <strong>{lead}</strong>{" "}{body}
                  </li>
                ))}
              </ol>
            </AlertDescription>
          </Alert>
        </ScrollReveal>

        {/* Localized Methodology & Coverage Summary (understandable in every language) */}
        <ScrollReveal>
          <Card className="mb-12 border-border">
            <CardContent className="p-6 space-y-5">
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-2">{copy.methodology.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{copy.methodology.intro}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  {copy.methodology.sourceHeading}
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground leading-relaxed">
                  {copy.methodology.sources.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  {copy.methodology.confidenceHeading}
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                  {copy.methodology.confidence.map(([label, meaning]) => (
                    <li key={label}>
                      <strong className="text-foreground">{label}:</strong> {meaning}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  {copy.methodology.limitationsHeading}
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground leading-relaxed">
                  {copy.methodology.limitations.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  {copy.methodology.reportHeading}
                </p>
                <p className="text-sm text-muted-foreground flex items-start gap-2 leading-relaxed">
                  <Mail className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                  <span>{copy.methodology.report}</span>
                </p>
              </div>

              <Alert className="border-blue-300 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-700">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <AlertDescription className="text-blue-900 dark:text-blue-200 ml-2 text-sm leading-relaxed">
                  {copy.methodology.englishNote}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Section 1 — Jurisdiction Procedure Rules */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <SectionHeader number="§1" confidence="partial" copy={copy} />
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{copy.labels.sourceType}</p>
                    <p>State statutes, court rules, and case law — one primary citation per jurisdiction</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{copy.labels.coverage}</p>
                    <p>All 50 states + DC + Federal + 5 U.S. territories (57 total)</p>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground leading-relaxed">
                    Each jurisdiction's procedural rules — how quickly you must be brought before a judge, when bail is set,
                    how long the government has to bring your case to trial, and what phone-call rights you have — are stored
                    with a specific statute or court-rule citation. For example, California's arraignment deadline cites{" "}
                    <em>Cal. Penal Code § 825</em>; the federal speedy-trial window cites{" "}
                    <em>18 U.S.C. § 3161(c)(1)</em>.
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">What is verified vs. estimated</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-foreground">Arraignment deadline, bail hearing timing, speedy-trial window, phone-call rights, and bail structure</strong>{" "}
                        are verified for all 52 jurisdictions (50 states + DC + Federal) with a specific cited source.
                        The 5 territories (AS, GU, MP, PR, VI) are verified at medium confidence from territory codes.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-foreground">Preliminary hearing timing and discovery deadline</strong>{" "}
                        for the following 20 jurisdictions are estimates that have not been verified against a primary source:{" "}
                        {ESTIMATE_JURISDICTIONS.join(', ')}. These fields are shown to users with an "estimated" notice.
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Key reform notes</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Illinois eliminated cash bail statewide (SAFE-T Act, effective Sept. 18, 2023)</li>
                    <li>New Jersey eliminated cash bail for most defendants (Criminal Justice Reform Act, effective Jan. 1, 2017)</li>
                    <li>New York eliminated cash bail for most non-violent offenses (2019 bail reform, amended 2020 and 2022)</li>
                    <li>Florida changed its speedy-trial clock to run from filing of formal charges, not arrest (effective July 1, 2025)</li>
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">How data is kept current</p>
                  <p className="text-sm text-muted-foreground">
                    Each entry records the date it was last verified. Entries older than 12 months are flagged for re-verification
                    in our quarterly automated review. When a state legislature amends a speedy-trial statute or bail reform passes,
                    the entry is updated and dated.
                  </p>
                </div>

                <ReportError copy={copy} />
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Section 2 — Criminal Charges Database */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <SectionHeader number="§2" confidence="partial" copy={copy} />
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{copy.labels.primarySource}</p>
                    <p>Model Penal Code (ALI); individual state statutes for verified entries; FBI UCR for charge frequency ranking</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{copy.labels.coverage}</p>
                    <p>7,155 charges across 57 jurisdiction codes (50 states + DC + 5 territories + Federal)</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Two accuracy tiers</p>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="border border-border rounded-lg p-4">
                      <p className="font-semibold text-foreground mb-1">Tier A — Base charges (~6,496 entries): synthesized</p>
                      <p>
                        The original charge set was built from Model Penal Code patterns, not by pulling each statute
                        individually from each state legislature. Statute codes in this tier (for example,{" "}
                        <code className="text-xs bg-muted px-1 rounded">Cal. Penal Code § X</code>) are generated
                        placeholders used for organizational consistency. Penalty ranges reflect common patterns.{" "}
                        <strong className="text-foreground">Do not cite these statute numbers as authoritative</strong>{" "}
                        without cross-referencing the actual state code. Since July 2026, major jurisdictions (CA, NY, FL,
                        IL, OH, GA, NC, NJ, VA, AZ, and others) have had their base charges spot-checked and corrected
                        against primary statute text.
                      </p>
                    </div>
                    <div className="border border-border rounded-lg p-4">
                      <p className="font-semibold text-foreground mb-1">Tier B — Inchoate, derivative, and specialty charges (659 entries): doctrine-grounded</p>
                      <p>
                        Attempt, conspiracy, aiding and abetting, and accessory charges (Phases 1–2) cite actual MPC
                        doctrine (§§ 2.06, 2.07, 5.01, 5.03) and federal statutes (18 U.S.C. §§ 2, 3, 371).
                        Sentencing enhancements (Phase 3) and white-collar offenses (Phase 4) cite federal statutes directly.
                        Juvenile proceedings (Phase 5) cite 18 U.S.C. §§ 5031–5042 and landmark cases (<em>In re Gault</em>,{" "}
                        <em>Kent v. United States</em>, <em>Miller v. Alabama</em>).
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Jury instruction overlay</p>
                  <p className="text-sm text-muted-foreground">
                    A separate companion dataset annotates select charges in major jurisdictions with jury instruction
                    references — for example, CALCRIM 1600 for robbery in California, or NYPJI 155.25 for theft in
                    New York. These references include direct URLs to court-hosted instruction documents where publicly
                    available. Some instruction sets are paywalled (Westlaw, LexisNexis); those entries include the
                    instruction number but not a direct link. Coverage is concentrated in CA, NY, FL, TX, PA, OH, and IL.
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Live citation validation</p>
                  <p className="text-sm text-muted-foreground">
                    When AI guidance cites a statute, it passes through a three-tier validator before being shown to users:{" "}
                    (1) local database check, (2) CourtListener case-law search, and (3) OpenLaws live statute lookup.
                    Any citation not confirmed by at least one tier is flagged as unverified in the guidance output.
                  </p>
                </div>

                <ReportError copy={copy} />
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Section 2b — Charge Explanations */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <SectionHeader number="§2b" confidence="partial" copy={copy} />
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{copy.labels.primarySource}</p>
                    <p>Statute text read directly from state legislature and government websites, one citation per verified entry</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{copy.labels.coverage}</p>
                    <p>56 of 60 charge categories have real, state-specific detail for nearly all 52 jurisdictions in scope (50 states, D.C., and Puerto Rico); the remaining 4 categories use general, non-state-specific language by design, not because they haven't been reached yet</p>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    The "Understanding Your Charges" card and its PDF version explain what a charge means in plain
                    language. This content is a separate project from the citation database above, and started later:
                    it had no sourcing at all until August 2026. As of August 2026, real per-state detail is in
                    place across all three coverage tiers for every jurisdiction in scope except two disclosed gaps:
                    South Dakota, whose official legislature site has blocked every access path tried so far, and
                    Oklahoma, which is still missing one of the three tiers. We would rather show you accurate
                    detail for the charges we have verified, and a clearly general explanation for the ones we
                    have not, than pretend every state has been checked.
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">What is verified vs. general</p>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="border border-border rounded-lg p-4">
                      <p className="font-semibold text-foreground mb-1">State-specific: 16 highest-frequency charges</p>
                      <p>
                        Murder (first degree, second degree, felony murder), manslaughter, assault (first degree,
                        aggravated, deadly weapon, second degree, third degree), battery, domestic violence, DUI,
                        drug possession, theft, robbery, and burglary have real detail for all 10 of our original
                        anchor states: California, New York, Florida, Virginia, Ohio, Illinois, Georgia, North
                        Carolina, New Jersey, and Arizona, plus Texas, Pennsylvania, Michigan, Washington,
                        Massachusetts, Tennessee, Indiana, Missouri, Maryland, Wisconsin, Colorado, Minnesota,
                        South Carolina, Alabama, Louisiana, Kentucky, Oregon, Oklahoma, Connecticut, Utah, Nevada, Iowa, Arkansas, Mississippi, Kansas, New Mexico, Puerto Rico, Nebraska, Idaho, West Virginia, Hawaii, New Hampshire, Maine, Montana, Rhode Island, Delaware, North Dakota, Vermont, the District of Columbia, Wyoming, and Alaska, the first forty-one jurisdictions added beyond that anchor set, including Puerto Rico as the first U.S. territory in this expansion. Some individual
                        charge terms do not exist in every state (for example, several states have no "first
                        degree assault" statute, and Indiana and Wisconsin have no "assault" concept separate from
                        battery at all); those gaps are noted directly rather than force-mapped to the wrong charge.
                      </p>
                    </div>
                    <div className="border border-border rounded-lg p-4">
                      <p className="font-semibold text-foreground mb-1">State-specific: 20 additional charges (50 jurisdictions so far)</p>
                      <p>
                        Weapons charges, financial fraud, sexual assault, resisting arrest, forgery, failure to
                        appear, shoplifting, criminal mischief, trespass, disorderly conduct, stalking, animal
                        cruelty, prostitution, receiving stolen property, criminal nonsupport, hate crime
                        enhancement, kidnapping, arson, carjacking, and vehicular homicide have real detail for
                        all 10 of our original anchor states (California, New York, Florida, Virginia, Ohio,
                        Illinois, Georgia, North Carolina, New Jersey, and Arizona) plus Texas, Pennsylvania,
                        Michigan, Washington, Massachusetts, Tennessee, Indiana, Missouri, Maryland, Wisconsin,
                        Colorado, Minnesota, South Carolina, Alabama, Louisiana, Kentucky, Oregon, Connecticut,
                        Utah, Nevada, Iowa, Arkansas, Mississippi, Kansas, Nebraska, Idaho, West Virginia, Hawaii,
                        New Hampshire, Maine, Montana, Rhode Island, Delaware, North Dakota, Vermont, the
                        District of Columbia, Wyoming, Alaska, New Mexico, and Puerto Rico. Only South Dakota and
                        Oklahoma remain: South Dakota is blocked by its official site's bot-detection gate, and
                        Oklahoma's sourcing wall was resolved for the other two tiers but hasn't been revisited
                        for this one yet.
                      </p>
                    </div>
                    <div className="border border-border rounded-lg p-4">
                      <p className="font-semibold text-foreground mb-1">State-specific: 20 more charges (51 jurisdictions so far)</p>
                      <p>
                        Rape, sex offenses against minors, indecent exposure, drug distribution, marijuana
                        possession, driving while suspended, driving without a license, reckless driving, hit and
                        run, public intoxication, loitering, perjury, failure to identify, murder in the third
                        degree, check fraud, abuse of a family member, attempted murder, conspiracy/accessory/attempt,
                        recidivist (habitual offender) enhancement, and juvenile transfer proceedings have real
                        detail for all 10 of our original anchor states (California, New York, Florida, Virginia,
                        Ohio, Illinois, Georgia, North Carolina, New Jersey, and Arizona), plus Texas,
                        Pennsylvania, Michigan, Washington, Massachusetts, Tennessee, Indiana, Missouri,
                        Maryland, Wisconsin, Colorado, Minnesota, South Carolina, Alabama, Louisiana,
                        Kentucky, Oregon, Oklahoma, Connecticut, Utah, Nevada, Iowa, Arkansas,
                        Mississippi, Kansas, New Mexico, Puerto Rico, Nebraska, Idaho, West Virginia,
                        Hawaii, New Hampshire, Maine, Montana, Rhode Island, Delaware, North Dakota,
                        Vermont, the District of Columbia, Wyoming, and Alaska. Only South Dakota
                        remains, blocked by its official site's bot-detection gate with no working
                        mirror found yet.
                      </p>
                    </div>
                    <div className="border border-border rounded-lg p-4">
                      <p className="font-semibold text-foreground mb-1">General only: 4 remaining categories</p>
                      <p>
                        Illegal entry/re-entry and contempt/probation-violation are handled through federal or
                        procedural rules that do not meaningfully vary by state, so they stay general by design.
                        Two other categories in our data are internal catch-all labels rather than distinct charges
                        a person is ever actually charged with, and never get their own state-specific detail.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Why some states are missing for a given charge</p>
                  <p className="text-sm text-muted-foreground">
                    Not every state uses the same legal terms. For example, California, Florida, and Ohio do not
                    have a charge called "first degree assault," so no entry is forced to fit that label; their
                    real equivalents (aggravated assault, felonious assault) are covered under those charges
                    instead. New Jersey does not grade murder into degrees at all. When a state genuinely does not
                    use a term, that is stated plainly rather than mapped to the wrong statute.
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">How data is kept current</p>
                  <p className="text-sm text-muted-foreground">
                    Each state-specific entry records the statute it was read from, a link to that source, and the
                    date it was last verified. As coverage expands to more states and charge categories, this
                    section will be updated to reflect the current state.
                  </p>
                </div>

                <ReportError copy={copy} />
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Section 3 — Collateral Consequences */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <SectionHeader number="§3" confidence="partial" copy={copy} />
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{copy.labels.primaryCitations}</p>
                    <p>
                      18 U.S.C. § 922(g) (federal firearms prohibition); <em>Padilla v. Kentucky</em>, 559 U.S. 356
                      (2010) (immigration consequences); 21 U.S.C. § 862a (federal SNAP/TANF drug felony ban);
                      34 U.S.C. § 20901 et seq. (SORNA)
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{copy.labels.coverage}</p>
                    <p>All 50 states + DC (51 entries), across 7 consequence categories</p>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    Collateral consequences are the legal penalties that follow a conviction beyond the sentence itself —
                    things like loss of voting rights, firearms restrictions, public housing ineligibility, professional
                    license revocation, and immigration consequences. Our screener covers seven categories for each state:
                    voting rights restoration, ban-the-box / fair chance hiring, occupational licensing restrictions,
                    SNAP/TANF drug-felony bans, fair chance housing laws, driver's license suspension, and immigration
                    enforcement posture.
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Secondary sources</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Collateral Consequences Resource Center (CCRC) — state profiles and licensing tracker</li>
                    <li>NELP Fair Chance Hiring Tracker and NCSL Ban-the-Box state law survey</li>
                    <li>USDA FNS State Options Reports (SNAP drug-felony ban status)</li>
                    <li>ILRC Quick Reference Chart (2024) for immigration enforcement posture</li>
                    <li>NCSL sex offender registration law database</li>
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Known limitations</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Most entries are verified at "medium" confidence — checked against a secondary source but not always the primary statute text</li>
                    <li>Voting rights data reflects the law as of July 2026; executive-order-based policies (notably Virginia) can change without legislative action</li>
                    <li>Local ordinances and county-level policies are not captured; only statewide rules are shown</li>
                    <li>The <em>Padilla v. Kentucky</em> duty applies to defense counsel advising clients, not to platform users directly; individual immigration consequences depend on specific facts and immigration status</li>
                  </ul>
                </div>

                <ReportError copy={copy} />
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Section 4 — Constitutional Rights */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <SectionHeader number="§4" confidence="verified" copy={copy} />
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{copy.labels.primaryCitations}</p>
                    <p>U.S. Const. Amends. IV, V, VI, VIII, XIV; landmark Supreme Court decisions</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Last editorial review</p>
                    <p>May 2026</p>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    Our constitutional rights content — Miranda rights, right to remain silent, right to counsel,
                    protection from unreasonable searches, and related rights — is authored by the platform team
                    and grounded in well-established Supreme Court precedent. The law in this area is stable;
                    the major cases have been settled for decades.
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Landmark cases cited</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li><em>Miranda v. Arizona</em>, 384 U.S. 436 (1966) — right to remain silent, right to counsel during interrogation</li>
                    <li><em>Gideon v. Wainwright</em>, 372 U.S. 335 (1963) — Sixth Amendment right to appointed counsel</li>
                    <li><em>Mapp v. Ohio</em>, 367 U.S. 643 (1961) — exclusionary rule applies to states via Fourteenth Amendment</li>
                    <li><em>Terry v. Ohio</em>, 392 U.S. 1 (1968) — reasonable suspicion standard for investigatory stops</li>
                    <li><em>Riley v. California</em>, 573 U.S. 373 (2014) — warrant required to search a cell phone incident to arrest</li>
                    <li><em>Brady v. Maryland</em>, 373 U.S. 83 (1963) — prosecution must disclose material exculpatory evidence</li>
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Areas of genuine legal uncertainty noted on site</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Biometric device unlocking (fingerprint/face): unsettled law, significant circuit variation</li>
                    <li>Terry stop custody analysis: varies by circuit and state — not uniform nationally</li>
                  </ul>
                </div>

                <ReportError copy={copy} />
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Section 5 — Expungement Eligibility */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <SectionHeader number="§5" confidence="partial" copy={copy} />
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{copy.labels.primarySources}</p>
                    <p>State legislature websites (statute text) and state court administrative websites; one citation per state entry</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{copy.labels.coverage}</p>
                    <p>All 50 states + DC + Federal (52 entries total). Expanded to full national coverage in March 2026.</p>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    Expungement (or record sealing, set-aside, or similar relief depending on the state) rules vary
                    enormously. Each state entry in our database lists: waiting periods by charge type, which offenses
                    are excluded, whether the state offers true expungement (record destruction) or only sealing,
                    and estimated filing fees where available.
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Secondary reference sources</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>NCSL Expungement/Sealing State Statutes Survey</li>
                    <li>Clean Slate Initiative state tracker</li>
                    <li>National Reentry Resource Center</li>
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Known limitations</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Filing fees change frequently and may not reflect current court schedules</li>
                    <li>Several states (AZ, NM) offer "set-aside" statutes rather than true expungement; this distinction is noted per entry</li>
                    <li>Wisconsin expungement is only available if a judge orders it at sentencing — no post-sentence petition pathway exists</li>
                    <li>Nebraska has no conviction expungement; only non-conviction records (arrests, acquittals) are eligible</li>
                    <li>Entries with last-verified dates older than 24 months should be treated with extra caution</li>
                  </ul>
                </div>

                <ReportError copy={copy} />
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Section 6 — Diversion Programs */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <SectionHeader number="§6" confidence="partial" copy={copy} />
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{copy.labels.primarySources}</p>
                    <p>NADCP Find-a-Drug-Court locator; NDAA Prosecutor-Led Diversion Directory; individual state court system and prosecutor office websites</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{copy.labels.coverage}</p>
                    <p>111 programs covering all 50 states + DC + Federal. Last link validation: April 10, 2026.</p>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    Pre-trial diversion and alternative sentencing programs let eligible defendants avoid a criminal record
                    by completing conditions like treatment, community service, or education. Our database covers drug courts,
                    mental health courts, veterans courts, and prosecutor-led diversion programs. Metro-area programs include
                    specific court contact information; statewide entries link to the official state court system's
                    specialty courts portal.
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Important limitation</p>
                  <p className="text-sm text-muted-foreground">
                    Diversion program eligibility criteria, operating status, phone numbers, and even program existence
                    change frequently — often without public notice. Our quarterly link check catches dead URLs, but
                    cannot verify whether program details are still accurate. Always contact the program or court directly
                    before relying on our data. Program entries are re-verified annually at minimum.
                  </p>
                </div>

                <ReportError copy={copy} />
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Section 7 — Legal Aid Organizations */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <SectionHeader number="§7" confidence="verified" copy={copy} />
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{copy.labels.primarySources}</p>
                    <p>EOIR Pro Bono List; Legal Services Corporation (LSC) grantee directory; federal judiciary public defender directory; official state and county government websites</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{copy.labels.coverage}</p>
                    <p>195+ organizations. Last manual verification: March 2026.</p>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    Our directory covers four types of organizations: EOIR-approved immigration legal aid providers,
                    LSC-funded civil and criminal legal aid organizations, Federal Public Defender offices (one per
                    federal district), and local/county public defender offices and court-appointed attorney programs.
                    Each entry records the verification source (EOIR list, LSC directory, or official government website).
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">How we keep it accurate</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Quarterly automated URL checks flag 404 errors and redirects</li>
                    <li>Entries with missing phone numbers are automatically flagged for manual lookup</li>
                    <li>March 2026 manual pass: 13 corrections applied (addresses, phone numbers, and website URLs)</li>
                  </ul>
                </div>

                <ReportError copy={copy} />
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Section 8 — Jury Instruction References */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <SectionHeader number="§8" confidence="partial" copy={copy} />
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{copy.labels.sourceType}</p>
                    <p>Official court-published instruction sets; supplemented by commercially published sets where court PDFs are unavailable</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{copy.labels.coverage}</p>
                    <p>Major jurisdictions: CA, NY, FL, TX, PA, OH, IL, and others. Not all charges in all states have instruction references.</p>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    Jury instruction references tell attorneys and defendants which standard instruction a jury would
                    receive for a given charge. We annotate charges with instruction series numbers (such as CALCRIM 1600
                    for robbery in California) and — where the instruction set is publicly available — a direct URL to
                    the court's PDF.
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Instruction sets referenced</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-muted-foreground border-collapse">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 pr-4 font-semibold text-foreground">State / Series</th>
                          <th className="text-left py-2 pr-4 font-semibold text-foreground">Full Name</th>
                          <th className="text-left py-2 font-semibold text-foreground">Access</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {[
                          ['CALCRIM', 'California Criminal Jury Instructions (Judicial Council)', 'Free — Judicial Council website'],
                          ['CALJIC', 'California Jury Instructions — Criminal (older series)', 'Paywalled — West/LexisNexis'],
                          ['NYPJI', 'New York Pattern Jury Instructions — Criminal', 'Free — NY Courts website'],
                          ['FPJI', 'Florida Standard Jury Instructions in Criminal Cases', 'Free — Florida Supreme Court'],
                          ['CTJI', 'Connecticut Criminal Jury Instructions', 'Free — CT Judicial Branch'],
                          ['O\'Malley', 'Federal Jury Practice and Instructions (criminal)', 'Paywalled — Westlaw'],
                          ['Sand', 'Modern Federal Jury Instructions — Criminal', 'Paywalled — LexisNexis'],
                          ['TX CPJC', 'Texas Criminal Pattern Jury Charges', 'Partially free — State Bar of Texas'],
                          ['PA SSJI', 'Pennsylvania Suggested Standard Criminal Jury Instructions', 'Free — PA Courts website'],
                          ['OH OJI', 'Ohio Jury Instructions — Criminal', 'Paywalled — Baldwin\'s Ohio Practice'],
                          ['IL IPI-Crim', 'Illinois Pattern Jury Instructions — Criminal', 'Free — Illinois Courts website'],
                        ].map(([series, name, access]) => (
                          <tr key={series}>
                            <td className="py-2 pr-4 font-mono font-semibold text-foreground">{series}</td>
                            <td className="py-2 pr-4">{name}</td>
                            <td className="py-2">{access}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Limitation</p>
                  <p className="text-sm text-muted-foreground">
                    Instruction numbers in paywalled sets are included for reference but cannot be independently
                    verified without a subscription. Coverage is not uniform across all charges or all states.
                  </p>
                </div>

                <ReportError copy={copy} />
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Section 9 — External Validation APIs */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <SectionHeader number="§9" confidence="verified" copy={copy} />
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed text-sm">
                  When AI guidance generates a statute citation, it passes through a three-tier live validation
                  system before being shown to users. Any citation not confirmed by at least one tier is
                  flagged as unverified in the output.
                </p>

                <div className="space-y-4">
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-semibold text-foreground">OpenLaws</p>
                      <Badge variant="outline" className="text-xs">Tier 3 fallback</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Live statutory database covering 4.3M+ sections across all 50 states and federal law.
                      When a citation is not found in our local database, OpenLaws is queried as an
                      authoritative live source before the citation is flagged as unverified. Fails silently
                      if the API is unavailable.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Source: <a href="https://docs.openlaws.us/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 underline">docs.openlaws.us</a>
                    </p>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-semibold text-foreground">CourtListener / RECAP Archive</p>
                      <Badge variant="outline" className="text-xs">Tier 2 — case law confidence</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Semantic case-law precedent search. When AI guidance cites a case, CourtListener is
                      queried to confirm the case exists and is relevant. A confirmed match boosts our
                      confidence in the guidance. CourtListener is a project of the Free Law Project,
                      a nonprofit dedicated to free access to legal information.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Source: <a href="https://www.courtlistener.com/api/rest/v4" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 underline">courtlistener.com</a>
                    </p>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-semibold text-foreground">GovInfo (U.S. GPO)</p>
                      <Badge variant="outline" className="text-xs">Federal statute metadata</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      U.S. Government Publishing Office API. Used to search and retrieve federal statute
                      package metadata and document links. Covers the United States Code and Code of Federal
                      Regulations.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Source: <a href="https://api.govinfo.gov" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 underline">api.govinfo.gov</a>
                    </p>
                  </div>

                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-semibold text-foreground">LOCUS-v1 (LocalLaws / UC Berkeley)</p>
                      <Badge variant="outline" className="text-xs shrink-0">Municipal ordinances — CC-BY-NC-4.0</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      A public dataset of municipal and county ordinance text, used as a supplementary reference
                      for local-ordinance charges (loitering, trespass, disorderly conduct, noise violations,
                      and similar offenses). Not used for state felony or misdemeanor citations.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Citation: Peskoff, Barrow, Vu &amp; Davenport et al. (2026),{" "}
                      <em>Freeing the Law with LOCUS</em>, arXiv:2606.19334.{" "}
                      Dataset:{" "}
                      <a
                        href="https://huggingface.co/datasets/LocalLaws/LOCUS-v1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 underline"
                      >
                        huggingface.co/datasets/LocalLaws/LOCUS-v1
                      </a>.{" "}
                      Licensed under{" "}
                      <a
                        href="https://creativecommons.org/licenses/by-nc/4.0/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 underline"
                      >
                        CC-BY-NC-4.0
                      </a>.
                    </p>
                  </div>
                </div>

                <ReportError copy={copy} />
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Section 10 — AI Guidance Disclosure */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <SectionHeader number="§10" confidence="verified" copy={copy} />
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Provider</p>
                    <p>Anthropic — Claude Sonnet 4 (claude-sonnet-4-6) via API</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Features using AI</p>
                    <p>Case Roadmap, AI Chat, Document Summarizer, Letter Generator, Attorney Document Generation</p>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    We use Anthropic's Claude API — not the consumer Claude.ai product — to generate personalized
                    case guidance and document summaries. The key privacy and accuracy properties of this integration are:
                  </p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">No training use</p>
                      <p className="text-muted-foreground">
                        Anthropic does not use prompts submitted via the API to train its AI models.
                        Your case details are not used to improve Claude.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Automated redaction before transmission</p>
                      <p className="text-muted-foreground">
                        Before case details are sent to Anthropic, our servers attempt to detect and remove
                        common identifiers such as names, phone numbers, email addresses, and Social Security
                        numbers. Automated redaction can miss sensitive details, so avoid submitting
                        unnecessary personal information.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">30-day retention by Anthropic</p>
                      <p className="text-muted-foreground">
                        Under Anthropic's standard API terms, prompts and responses may be retained by
                        Anthropic for up to 30 days for operational and safety purposes. We do not have a
                        zero-data-retention agreement. During this window, Anthropic may be required to
                        disclose conversation data in response to a valid legal process such as a subpoena
                        or court order.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">Output is validated, not trusted raw</p>
                      <p className="text-muted-foreground">
                        Every piece of AI guidance passes through a three-tier legal accuracy validator
                        (local database, CourtListener, OpenLaws) before being shown to users. Citations not
                        confirmed by the validator are flagged as unverified. The AI is also given the verified
                        procedural rules for the user's jurisdiction as grounding context before it generates
                        any guidance.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">
                    For more details, see our{" "}
                    <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">
                      Privacy Policy
                    </Link>{" "}
                    and{" "}
                    <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">
                      Anthropic's Privacy Policy
                    </a>.
                  </p>
                </div>

                <ReportError copy={copy} />
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Closing — How to report an error */}
        <ScrollReveal>
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-3">How to Report a Data Error</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                If you are an attorney, legal researcher, or anyone who has found an error in our data — an incorrect
                statute citation, an outdated deadline, a wrong penalty range — please report it. We take accuracy
                seriously and review all submissions.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground mb-4">
                <li>Email <a href="mailto:legal-data@opendefender.io" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 underline">legal-data@opendefender.io</a> with the state, the specific field or rule, and what you believe the correct information to be</li>
                <li>Include a citation to the primary source (statute number, court rule, or case citation) if possible</li>
                <li>We will review and respond within 30 days; confirmed corrections are applied and dated in the database</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                This page corresponds to the internal <code className="text-xs bg-muted px-1 py-0.5 rounded">SOURCES.md</code> reference document
                maintained by the platform team. The public page omits internal file paths and implementation notes.
              </p>
            </CardContent>
          </Card>
        </ScrollReveal>
      </main>

      <Footer />
    </div>
  );
}
