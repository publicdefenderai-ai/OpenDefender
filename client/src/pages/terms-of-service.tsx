import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

const terms = {
  en: {
    title: "Terms of Service",
    subtitle: "Rules for using OpenDefender and its public information tools.",
    updated: "Last updated: August 20, 2026",
    sections: [
      ["1. Agreement", "By using OpenDefender, you agree to these Terms, the Privacy Policy, and the Notice & Disclaimers. If you do not agree, do not use the service."],
      ["2. General information only", "OpenDefender provides general educational information drawn from public legal sources, curated and sometimes synthesized datasets, user-selected inputs, and, in identified features, AI-generated text. It is not a law firm, does not provide legal advice, does not create an attorney-client relationship, and is not tailored to every fact that could affect a legal matter."],
      ["3. Accuracy and verification", "Information may be incomplete, estimated, outdated, mistranslated, or incorrect. Laws, court rules, deadlines, programs, and external resources change. Verify important details with current official sources and a qualified lawyer before acting or missing a deadline."],
      ["4. AI-assisted features", "Features labeled as AI-assisted send the disclosed inputs to Anthropic's Claude API. AI output may omit facts or make mistakes. Do not rely on AI output as legal advice, and review important documents and deadlines with a qualified lawyer. Some non-AI, rules-based tools are also available."],
      ["5. Privacy and sensitive information", "OpenDefender issues a 24-hour session cookie for session security and ownership. Some case, feedback, and consent records are held in server memory; case and feedback records generally expire within 24 hours or are cleared on restart. AI providers and infrastructure services may process or temporarily retain data as described in the Privacy Policy. Avoid entering information you do not need to share."],
      ["6. Acceptable use", "Do not misuse the service, interfere with security or rate limits, upload unlawful content, attempt unauthorized access, or use OpenDefender to impersonate a lawyer or provide unlicensed legal services."],
      ["7. Attorney and advocate tools", "Professional tools produce drafts only. The lawyer or advocate using them is responsible for privilege, confidentiality, client consent, professional duties, review, citation checking, and filing decisions. OpenDefender does not verify bar membership."],
      ["8. Third-party services and links", "External websites, data providers, courts, legal aid organizations, and embedded services control their own content and privacy practices. OpenDefender does not guarantee their availability, accuracy, or conduct."],
      ["9. No warranties; limitation", "The service is provided as-is and as-available, without warranties of accuracy, completeness, fitness, availability, or legal outcome. To the fullest extent allowed by law, OpenDefender and its contributors are not liable for losses arising from use of, inability to use, or reliance on the service."],
      ["10. Changes and termination", "We may update, suspend, or discontinue features and may revise these Terms. The updated date will appear above. Continued use after an update means you accept the revised Terms."],
      ["11. Contact", "Questions or reports may be submitted through the OpenDefender GitHub repository."],
    ],
  },
  es: {
    title: "Términos de Servicio",
    subtitle: "Reglas para usar OpenDefender y sus herramientas públicas de información.",
    updated: "Última actualización: 20 de agosto de 2026",
    sections: [
      ["1. Acuerdo", "Al usar OpenDefender, acepta estos Términos, la Política de Privacidad y el Aviso y Exenciones. Si no está de acuerdo, no use el servicio."],
      ["2. Solo información general", "OpenDefender proporciona información educativa general basada en fuentes legales públicas, conjuntos de datos seleccionados y a veces sintetizados, datos elegidos por el usuario y, en funciones identificadas, texto generado por IA. No es un bufete, no brinda asesoramiento legal, no crea una relación abogado-cliente y no se adapta a todos los hechos que podrían afectar un asunto legal."],
      ["3. Exactitud y verificación", "La información puede estar incompleta, estimada, desactualizada, mal traducida o ser incorrecta. Las leyes, reglas judiciales, plazos, programas y recursos externos cambian. Verifique los detalles importantes con fuentes oficiales vigentes y un abogado calificado antes de actuar o dejar vencer un plazo."],
      ["4. Funciones asistidas por IA", "Las funciones marcadas como asistidas por IA envían los datos divulgados a la API Claude de Anthropic. La IA puede omitir hechos o cometer errores. No confíe en resultados de IA como asesoramiento legal y revise documentos y plazos importantes con un abogado calificado. También hay algunas herramientas no basadas en IA."],
      ["5. Privacidad e información sensible", "OpenDefender emite una cookie de sesión de 24 horas para seguridad y control de la sesión. Algunos registros de caso, comentarios y consentimiento se mantienen en memoria del servidor; los registros de caso y comentarios generalmente caducan en 24 horas o se borran al reiniciar. Los proveedores de IA y de infraestructura pueden procesar o retener datos temporalmente como se describe en la Política de Privacidad. Evite ingresar información que no sea necesario compartir."],
      ["6. Uso aceptable", "No abuse del servicio, interfiera con la seguridad o los límites de uso, cargue contenido ilegal, intente acceso no autorizado ni use OpenDefender para hacerse pasar por abogado o prestar servicios legales sin licencia."],
      ["7. Herramientas para abogados y defensores", "Las herramientas profesionales solo producen borradores. El abogado o defensor es responsable del privilegio, confidencialidad, consentimiento del cliente, deberes profesionales, revisión, verificación de citas y decisiones de presentación. OpenDefender no verifica la membresía del colegio de abogados."],
      ["8. Servicios y enlaces de terceros", "Los sitios externos, proveedores de datos, tribunales, organizaciones de ayuda legal y servicios integrados controlan su propio contenido y prácticas de privacidad. OpenDefender no garantiza su disponibilidad, exactitud ni conducta."],
      ["9. Sin garantías; limitación", "El servicio se ofrece tal como está y según disponibilidad, sin garantías de exactitud, integridad, idoneidad, disponibilidad o resultado legal. En la medida permitida por la ley, OpenDefender y sus colaboradores no responden por pérdidas derivadas del uso, imposibilidad de uso o confianza en el servicio."],
      ["10. Cambios y terminación", "Podemos actualizar, suspender o discontinuar funciones y revisar estos Términos. La fecha actualizada aparecerá arriba. El uso continuado después de un cambio significa que acepta los Términos revisados."],
      ["11. Contacto", "Puede enviar preguntas o reportes mediante el repositorio de OpenDefender en GitHub."],
    ],
  },
  zh: {
    title: "服务条款",
    subtitle: "使用 OpenDefender 及其公共信息工具的规则。",
    updated: "最后更新：2026年8月20日",
    sections: [
      ["1. 同意", "使用 OpenDefender 即表示您同意本条款、隐私政策以及通知与免责声明。如不同意，请勿使用本服务。"],
      ["2. 仅提供一般信息", "OpenDefender 提供一般教育信息，内容来自公共法律来源、精选且有时经过综合的数据集、用户选择的输入，以及在明确标注的功能中由 AI 生成的文字。OpenDefender 不是律师事务所，不提供法律建议，不建立律师与当事人关系，也无法针对可能影响法律事项的每项事实进行定制。"],
      ["3. 准确性与核实", "信息可能不完整、属于估算、已过时、翻译有误或不正确。法律、法院规则、截止日期、项目和外部资源会发生变化。在采取行动或错过截止日期之前，请通过最新官方来源和合格律师核实重要细节。"],
      ["4. AI 辅助功能", "标注为 AI 辅助的功能会将已披露的输入发送至 Anthropic 的 Claude API。AI 输出可能遗漏事实或出错。请勿将 AI 输出视为法律建议，并请合格律师审查重要文件和截止日期。部分非 AI 的规则型工具也可使用。"],
      ["5. 隐私与敏感信息", "OpenDefender 会为会话安全和所有权控制签发有效期为24小时的会话 Cookie。部分案件、反馈和同意记录保存在服务器内存中；案件与反馈记录通常在24小时内过期或在服务器重启时清除。AI 提供商和基础设施服务可能按照隐私政策处理或暂时保留数据。请避免输入不必要分享的信息。"],
      ["6. 可接受使用", "不得滥用服务、干扰安全措施或速率限制、上传违法内容、尝试未经授权的访问，也不得使用 OpenDefender 冒充律师或提供无证法律服务。"],
      ["7. 律师与倡导者工具", "专业工具仅生成草稿。使用工具的律师或倡导者负责特权、保密、客户同意、职业义务、审查、引证核实和提交决定。OpenDefender 不核实律师执业资格。"],
      ["8. 第三方服务与链接", "外部网站、数据提供商、法院、法律援助组织和嵌入式服务自行控制其内容和隐私做法。OpenDefender 不保证其可用性、准确性或行为。"],
      ["9. 不作保证；责任限制", "服务按现状和可用状态提供，不保证准确性、完整性、适用性、可用性或法律结果。在法律允许的最大范围内，OpenDefender 及其贡献者不对因使用、无法使用或依赖本服务而产生的损失负责。"],
      ["10. 变更与终止", "我们可能更新、暂停或停止功能，并可能修订本条款。更新日期会显示在上方。更新后继续使用即表示接受修订后的条款。"],
      ["11. 联系", "问题或报告可通过 OpenDefender 的 GitHub 仓库提交。"],
    ],
  },
} as const;

export default function TermsOfService() {
  useScrollToTop();
  const { i18n } = useTranslation();
  const language = i18n.language.startsWith("es") ? "es" : i18n.language.startsWith("zh") ? "zh" : "en";
  const copy = terms[language];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="vivid-header py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center vivid-header-content">
          <h1 className="mb-4 text-3xl font-bold text-white md:text-5xl">{copy.title}</h1>
          <p className="mx-auto max-w-2xl text-white/80">{copy.subtitle}</p>
          <p className="mt-2 text-sm text-white/60">{copy.updated}</p>
        </div>
      </section>
      <main className="mx-auto max-w-4xl space-y-5 px-4 py-12">
        {copy.sections.map(([title, body]) => (
          <Card key={title}>
            <CardContent className="p-6">
              <h2 className="mb-2 text-xl font-semibold">{title}</h2>
              <p className="leading-relaxed text-muted-foreground">{body}</p>
            </CardContent>
          </Card>
        ))}
        <p className="text-sm text-muted-foreground">
          <Link href="/privacy-policy" className="underline">Privacy Policy</Link>
          {" · "}
          <Link href="/disclaimers" className="underline">Notice &amp; Disclaimers</Link>
          {" · "}
          <Link href="/data-sources" className="underline">Data Sources</Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}