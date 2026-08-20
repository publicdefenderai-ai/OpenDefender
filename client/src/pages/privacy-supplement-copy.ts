export const privacySupplementCopy = {
  en: {
    government: {
      title: "Government and Legal Requests",
      body: "Because temporary records and provider logs can exist, we cannot promise that information could never be disclosed. We may preserve or disclose information when legally required by a valid subpoena, court order, or other binding process, and may challenge requests where appropriate. Data already cleared from our systems cannot be recovered by us.",
    },
    privilege: {
      title: "No Attorney-Client Privilege",
      body: "OpenDefender is not a law firm, does not provide legal representation, and does not form an attorney-client relationship. Information submitted to public tools or AI features is not protected by attorney-client privilege. Do not submit confidential facts that you would share only with your lawyer.",
    },
    aiUse: {
      title: "Use of Artificial Intelligence",
      intro: "Identified features use Anthropic's Claude Sonnet 4.6 to generate text. AI-assisted features include:",
      bullets: [
        "Case Roadmap and chat guidance",
        "Document Summarizer, document Q&A, and Letter Generator",
        "Mitigation Memo AI Polish and attorney document generation or summarization",
      ],
      callout: "OpenDefender provides general educational information, not legal advice. AI can omit facts, make errors, or give outdated citations. Verify important details, deadlines, and citations with a qualified attorney and a current official source.",
    },
    api: {
      title: "Public API",
      body: "The public API serves curated or sometimes synthesized legal-reference data and is subject to rate limits. Requests can create standard server and infrastructure logs such as IP address, route, time, and user agent. API data is not legal advice and may be incomplete, estimated, outdated, mistranslated, or incorrect. Integrators must verify important fields and preserve OpenDefender attribution and disclosures.",
    },
    inventory: {
      title: "AI Feature Data Inventory",
      subtitle: "What each AI-assisted feature sends and how long processing records may remain",
      headers: ["Feature", "Data sent for AI processing", "Retention and limits"],
      rows: [
        ["Case Roadmap and Chat", "Selected jurisdiction, charges, stage, concerns, and optional free text; common identifiers are redacted where detected", "OpenDefender case records generally expire within 24 hours; guidance cache about 15 minutes; Anthropic up to 30 days"],
        ["Document Summary and Q&A", "Extracted document text and questions; automated redaction may miss sensitive content", "No permanent OpenDefender document library; temporary server processing; Anthropic up to 30 days"],
        ["Letter Generator", "Form fields needed to draft the requested letter", "No permanent OpenDefender letter database; standard operational processing; Anthropic up to 30 days"],
        ["Mitigation AI Polish", "Only populated mitigation fields; blank fields are omitted", "Core form and export are local; AI request uses standard operational processing; Anthropic up to 30 days"],
        ["Attorney Generation and Summarization", "Attorney-entered facts, instructions, or uploaded document text", "Attorney session records normally expire within 1 hour or on restart; Anthropic up to 30 days"],
      ],
      terms: "These retention periods describe OpenDefender's current implementation and Anthropic's standard commercial API terms. Infrastructure, security, and operational logs may follow provider-specific retention. OpenDefender does not represent that zero-data-retention terms apply.",
    },
  },
  es: {
    government: {
      title: "Solicitudes Gubernamentales y Legales",
      body: "Como pueden existir registros temporales y registros de proveedores, no podemos prometer que la información nunca pueda divulgarse. Podemos conservar o divulgar información cuando lo exija una citación, orden judicial u otro proceso vinculante válido, y podemos impugnar solicitudes cuando corresponda. No podemos recuperar datos ya eliminados de nuestros sistemas.",
    },
    privilege: {
      title: "Sin Privilegio Abogado-Cliente",
      body: "OpenDefender no es un bufete, no ofrece representación legal y no crea una relación abogado-cliente. La información enviada a herramientas públicas o funciones de IA no está protegida por ese privilegio. No envíe hechos confidenciales que compartiría solo con su abogado.",
    },
    aiUse: {
      title: "Uso de Inteligencia Artificial",
      intro: "Las funciones identificadas usan Claude Sonnet 4.6 de Anthropic para generar texto. Incluyen:",
      bullets: [
        "Hoja de Ruta del Caso y orientación por chat",
        "Resumidor y preguntas de documentos, y Generador de Cartas",
        "Pulido con IA de mitigación y generación o resumen de documentos para abogados",
      ],
      callout: "OpenDefender ofrece información educativa general, no asesoramiento legal. La IA puede omitir hechos, equivocarse o dar citas desactualizadas. Verifique detalles, plazos y citas importantes con un abogado y una fuente oficial vigente.",
    },
    api: {
      title: "API Pública",
      body: "La API pública ofrece datos legales seleccionados o a veces sintetizados y tiene límites de uso. Las solicitudes pueden crear registros técnicos estándar como IP, ruta, hora y navegador. Los datos no son asesoramiento legal y pueden estar incompletos, estimados, desactualizados, mal traducidos o ser incorrectos. Los integradores deben verificar campos importantes y conservar la atribución y los avisos.",
    },
    inventory: {
      title: "Inventario de Datos de Funciones de IA",
      subtitle: "Qué envía cada función asistida por IA y cuánto tiempo pueden permanecer los registros",
      headers: ["Función", "Datos enviados para procesamiento de IA", "Retención y límites"],
      rows: [
        ["Hoja de Ruta y Chat", "Jurisdicción, cargos, etapa, preocupaciones y texto opcional; se ocultan identificadores comunes cuando se detectan", "Registros de caso hasta unas 24 horas; caché unos 15 minutos; Anthropic hasta 30 días"],
        ["Resumen y Preguntas de Documentos", "Texto extraído y preguntas; la redacción automática puede omitir contenido sensible", "Sin biblioteca permanente; procesamiento temporal; Anthropic hasta 30 días"],
        ["Generador de Cartas", "Campos necesarios para redactar la carta solicitada", "Sin base permanente de cartas; procesamiento operativo estándar; Anthropic hasta 30 días"],
        ["Pulido con IA de Mitigación", "Solo campos completados; se omiten campos vacíos", "Formulario y exportación local; solicitud de IA con procesamiento estándar; Anthropic hasta 30 días"],
        ["Generación y Resumen para Abogados", "Hechos, instrucciones o texto de documentos ingresados por el abogado", "Sesión de abogado normalmente 1 hora o hasta reinicio; Anthropic hasta 30 días"],
      ],
      terms: "Estos periodos describen la implementación actual y los términos comerciales estándar de Anthropic. Los registros de infraestructura, seguridad y operación pueden seguir plazos propios del proveedor. OpenDefender no afirma que se apliquen términos de retención cero.",
    },
  },
  zh: {
    government: {
      title: "政府与法律请求",
      body: "由于可能存在临时记录和提供商日志，我们无法承诺信息绝不会被披露。收到有效传票、法院命令或其他具有约束力的法律程序时，我们可能依法保存或披露信息，并在适当情况下提出异议。已经从我们系统清除的数据无法由我们恢复。",
    },
    privilege: {
      title: "不享有律师—委托人保密特权",
      body: "OpenDefender 不是律师事务所，不提供法律代理，也不会建立律师—委托人关系。提交给公共工具或 AI 功能的信息不受律师—委托人保密特权保护。请勿提交只会与律师分享的机密事实。",
    },
    aiUse: {
      title: "人工智能的使用",
      intro: "明确标注的功能使用 Anthropic Claude Sonnet 4.6 生成文字，包括：",
      bullets: [
        "案件路线图与聊天指导",
        "文件摘要、文件问答和信函生成",
        "减轻情节 AI 润色，以及律师文件生成或摘要",
      ],
      callout: "OpenDefender 提供一般教育信息，并非法律建议。AI 可能遗漏事实、出错或给出过时引证。请向合格律师和最新官方来源核实重要细节、截止日期和引证。",
    },
    api: {
      title: "公共 API",
      body: "公共 API 提供精选或有时经过综合的法律参考数据，并设有速率限制。请求可能生成 IP 地址、路径、时间和浏览器等标准技术日志。API 数据并非法律建议，可能不完整、属于估算、已过时、翻译有误或不正确。集成方必须核实重要字段，并保留 OpenDefender 署名和披露。",
    },
    inventory: {
      title: "AI 功能数据清单",
      subtitle: "各 AI 辅助功能发送哪些数据，以及处理记录可能保留多久",
      headers: ["功能", "发送用于 AI 处理的数据", "保留期限与限制"],
      rows: [
        ["案件路线图与聊天", "所选司法辖区、指控、阶段、关注事项及可选文字；检测到的常见身份信息会被遮盖", "案件记录通常最多约24小时；指导缓存约15分钟；Anthropic 最多30天"],
        ["文件摘要与问答", "提取的文件文字和问题；自动遮盖可能遗漏敏感内容", "无永久文件库；临时服务器处理；Anthropic 最多30天"],
        ["信函生成", "起草所需信函的表单字段", "无永久信函数据库；标准运营处理；Anthropic 最多30天"],
        ["减轻情节 AI 润色", "仅已填写字段；空白字段会被省略", "核心表单和导出在本地；AI 请求进行标准处理；Anthropic 最多30天"],
        ["律师文件生成与摘要", "律师输入的事实、指示或上传文件文字", "律师会话通常1小时或到服务重启；Anthropic 最多30天"],
      ],
      terms: "这些期限说明当前实现及 Anthropic 标准商业 API 条款。基础设施、安全和运营日志可能遵循提供商自己的保留期限。OpenDefender 不表示零数据保留条款适用。",
    },
  },
} as const;