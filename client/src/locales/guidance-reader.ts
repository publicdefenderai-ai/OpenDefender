export const readerCopy = {
  en: {
    readerLawyerQuestions: "Questions to bring to a lawyer",
    readerChargeQuestion: "Which statute and classification appear on my charging papers?",
    readerReleaseQuestion: "Which release conditions apply until my next appearance?",
    readerHousingQuestion: "Could a possible outcome affect my housing, and what paperwork would help you assess that?",
    readerPrepareFallback: "Check your latest court notice for the location, time and any paperwork to bring.",
    readerFees: "Court costs and financial help",
    readerConsequences: "Possible effects beyond the criminal case",
    readerEffectsNote: "Timing and circumstances matter. These topics can help you discuss possible effects before a plea.",
    readerChargeUnknown: "Use the charging document to confirm the classification and applicable penalties with a lawyer.",
    readerHasCounsel: "Your lawyer can go over the charging papers and any release conditions before your next hearing.",
    readerNeedsCounsel: "Before court, you can ask the local public defender’s office how appointment works and which papers to bring.",
    readerUnknownCounsel: "If you have a lawyer, they can review your papers with you. If you need representation, you can ask the local public defender’s office about appointment before court.",
    readerAppearance: "Next court appearance",
    readerDateNote: "No confirmed hearing date is recorded in this plan. Check your latest notice for the date, time and courtroom.",
    readerPrepare: "Prepare for Court",
    readerDocuments: "Documents you may receive",
    readerDocumentsNote: "Open a document to see what it is for and where to find it.",
  },
  es: {
    readerLawyerQuestions: "Preguntas para su abogado",
    readerChargeQuestion: "¿Qué ley y qué clasificación figuran en el documento de cargos?",
    readerReleaseQuestion: "¿Qué condiciones de libertad se aplican hasta mi próxima audiencia?",
    readerHousingQuestion: "¿Podría algún resultado afectar mi vivienda? ¿Qué documentos ayudarían a evaluarlo?",
    readerPrepareFallback: "Consulte el aviso judicial más reciente para confirmar el lugar, la hora y los documentos que debe llevar.",
    readerFees: "Costos judiciales y ayuda económica",
    readerConsequences: "Posibles efectos fuera del caso penal",
    readerEffectsNote: "El momento y las circunstancias importan. Puede hablar de estos posibles efectos antes de declararse culpable.",
    readerChargeUnknown: "Consulte el documento de cargos con un abogado para confirmar la clasificación y las posibles sanciones.",
    readerHasCounsel: "Su abogado puede revisar los cargos y las condiciones de libertad antes de la próxima audiencia.",
    readerNeedsCounsel: "Antes de la audiencia, puede preguntar a la defensoría pública local cómo se asigna un abogado y qué documentos llevar.",
    readerUnknownCounsel: "Si tiene abogado, puede revisar los documentos con usted. Si necesita representación, puede preguntar a la defensoría pública sobre el nombramiento antes de la audiencia.",
    readerAppearance: "Próxima comparecencia",
    readerDateNote: "Este plan no contiene una fecha de audiencia confirmada. Consulte el aviso más reciente para verificar la fecha, la hora y la sala.",
    readerPrepare: "Prepárese para el tribunal",
    readerDocuments: "Documentos que podría recibir",
    readerDocumentsNote: "Abra un documento para consultar su finalidad y dónde encontrarlo.",
  },
  zh: {
    readerLawyerQuestions: "可以向律师咨询的问题",
    readerChargeQuestion: "我的起诉文件列出了哪条法律和哪种指控类别？",
    readerReleaseQuestion: "在下次出庭前，我需要遵守哪些释放条件？",
    readerHousingQuestion: "案件结果可能影响我的住房吗？哪些文件有助于评估影响？",
    readerPrepareFallback: "请查看最近的法院通知，确认地点、时间及需要携带的文件。",
    readerFees: "法院费用和经济援助",
    readerConsequences: "刑事案件以外的可能影响",
    readerEffectsNote: "时间和具体情况很重要。您可以在认罪前与律师讨论这些可能的影响。",
    readerChargeUnknown: "可与律师一起查看起诉文件，确认指控类别及适用的处罚。",
    readerHasCounsel: "您的律师可以在下次开庭前与您一起查看起诉文件和释放条件。",
    readerNeedsCounsel: "开庭前，您可以向当地公设辩护人办公室询问指派律师的流程和所需文件。",
    readerUnknownCounsel: "如果您已有律师，可以请律师查看文件。如果需要律师，可以在开庭前向当地公设辩护人办公室咨询。",
    readerAppearance: "下次出庭",
    readerDateNote: "本指南没有记录已确认的开庭日期。请查看最近的法院通知，确认日期、时间和法庭。",
    readerPrepare: "出庭准备",
    readerDocuments: "您可能收到的文件",
    readerDocumentsNote: "选择文件，了解其用途和获取方式。",
  },
};

export function guidanceReaderCopy(language: string) {
  return readerCopy[language.startsWith("es") ? "es" : language.startsWith("zh") ? "zh" : "en"];
}

export function counselCopyKey(answer: boolean | null) {
  if (answer === true) return "readerHasCounsel";
  if (answer === false) return "readerNeedsCounsel";
  return "readerUnknownCounsel";
}

export function lawyerQuestions(language: string, hasCharges: boolean, custody: string, concerns?: string[]) {
  const copy = guidanceReaderCopy(language);
  const questions: string[] = [];
  if (hasCharges) questions.push(copy.readerChargeQuestion);
  if (['released', 'ownrecognizance', 'bail', 'out_on_bail', 'on_bail', 'released_on_bail', 'or_release'].includes(custody.toLowerCase().replace(/ /g, '_'))) questions.push(copy.readerReleaseQuestion);
  if (concerns?.includes('housing')) questions.push(copy.readerHousingQuestion);
  return questions;
}
