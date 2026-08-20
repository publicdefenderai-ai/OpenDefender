import {
  GUIDANCE_SECTION_ORDER,
  normalizeGuidance,
  type GuidanceViewModel,
} from './guidance-view-model';

const bullet = (items: string[]) => items.map(item => `• ${item}`).join('\n');

const casePlanLabels = (language: string) => {
  if (language.startsWith('es')) {
    return {
      practical: 'Pasos prácticos que puede realizar',
      legal: 'Información del caso para revisar',
      legalNote: 'Estos son temas legales generales, no instrucciones personales. Un abogado puede explicarle cómo se aplican a su situación.',
      organize: 'Guarde en un mismo lugar los documentos del tribunal, los detalles de sus citas y los contactos importantes.',
      calendar: 'Anote en un calendario las próximas citas y fechas judiciales que aparezcan en sus documentos.',
      everydaySupport: 'Elija una necesidad cotidiana que pueda atender hoy: vivienda, comida, trabajo, cuidado infantil, transporte o bienestar.',
      resources: 'Encuentre apoyo e información',
      legalHelp: '[Encuentre ayuda legal](/resources) — Busque un defensor público o asistencia legal cerca de usted.',
      court: '[Encuentre su tribunal](/court-locator) — Busque el sitio web, la dirección y la información de contacto del tribunal.',
      lifeSupport: '[Obtenga apoyo para usted y su familia](/support) — Encuentre ayuda con vivienda, comida, trabajo, transporte, cuidado infantil o bienestar.',
      evidence: 'Temas de evidencia para revisar con un abogado',
      evidenceNote: 'La forma de manejar la evidencia depende de los hechos y de la ley de su caso. Estos temas pueden ayudarle a preparar preguntas para un abogado calificado.',
      courtInformation: 'Información judicial para revisar',
      courtNote: 'La preparación para el tribunal puede variar según el tribunal y los hechos de su caso. Un abogado puede ayudarle a entender qué opciones aplican.',
      beforeActing: 'Preguntas para discutir antes de actuar',
      beforeActingNote: 'Los temas a continuación pueden afectar un caso. Son información general, no una lista de instrucciones personales.',
    };
  }
  if (language.startsWith('zh')) {
    return {
      practical: '您可以采取的实用步骤',
      legal: '可了解的案件信息',
      legalNote: '以下是一般法律信息，并非针对您个人的指示。律师可以说明这些信息如何适用于您的情况。',
      organize: '将法庭文件、预约详情和重要联系人放在同一个地方。',
      calendar: '将文件中列出的即将到来的预约和出庭日期记入日历。',
      everydaySupport: '今天选择处理一项日常需求：住房、食物、工作、托儿、交通或身心健康。',
      resources: '查找支持与信息',
      legalHelp: '[寻找法律帮助](/resources) — 查找您附近的公设辩护人或法律援助。',
      court: '[查找您的法院](/court-locator) — 查询法院网站、地址和联系信息。',
      lifeSupport: '[获得生活与家庭支持](/support) — 查找住房、食物、工作、交通、托儿或身心健康方面的帮助。',
      evidence: '可与律师讨论的证据事项',
      evidenceNote: '证据应如何处理取决于您案件的事实和相关法律。这些主题可帮助您准备向合格律师提出的问题。',
      courtInformation: '可了解的法庭信息',
      courtNote: '出庭准备可能因法院和您案件的事实而异。律师可以帮助您了解哪些选择适用。',
      beforeActing: '行动前可讨论的问题',
      beforeActingNote: '以下主题可能影响案件。它们是一般信息，并非针对您个人的指示。',
    };
  }
  return {
    practical: 'Practical steps you can take',
    legal: 'Case information to review',
    legalNote: 'These are general legal topics, not personal instructions. A lawyer can explain how they apply to your situation.',
    organize: 'Put your court papers, appointment details, and important contacts in one place.',
    calendar: 'Add upcoming appointments and court dates from your paperwork to a calendar.',
    everydaySupport: 'Choose one everyday need to address today—housing, food, work, child care, transportation, or wellbeing.',
    resources: 'Find support and information',
    legalHelp: '[Find legal help](/resources) — Search for a public defender or legal aid near you.',
    court: '[Find your court](/court-locator) — Look up the court website, address, and contact information.',
    lifeSupport: '[Get life and family support](/support) — Find help with housing, food, work, transportation, child care, or wellbeing.',
    evidence: 'Evidence topics to review with a lawyer',
    evidenceNote: 'How evidence should be handled depends on the facts and law in your case. These topics can help you prepare questions for a qualified lawyer.',
    courtInformation: 'Court information to review',
    courtNote: 'Court preparation can vary by court and the facts of your case. A lawyer can help you understand which options apply.',
    beforeActing: 'Questions to discuss before acting',
    beforeActingNote: 'The topics below can affect a case. They are general information, not a personalized list of instructions.',
  };
};

/**
 * Accessible text presentation of the complete normalized plan.
 * The section sequence comes from GUIDANCE_SECTION_ORDER, so chat cannot
 * silently omit a newly added safety field.
 */
export function buildGuidanceChatSummary(raw: unknown, language = 'en'): string {
  const guidance = normalizeGuidance(raw);
  const labels = casePlanLabels(language);
  const practicalActions = guidance.immediateActions.filter(item => item.treatment === 'practical');
  const legalInformationActions = guidance.immediateActions.filter(item => item.treatment !== 'practical');
  const practicalPlan = [
    ...guidance.practicalStarterSteps.map(step => labels[step]),
    ...practicalActions.map(item => `[${item.urgency}] ${item.action}`),
  ];
  const sections: Record<(typeof GUIDANCE_SECTION_ORDER)[number], string> = {
    criticalAlerts: guidance.criticalAlerts.length ? `**Urgent Takeaways**\n${bullet(guidance.criticalAlerts)}` : '',
    overview: guidance.overview ? `**Overview**\n${guidance.overview}` : '',
    charges: guidance.chargeClassifications.length
      ? `**Your Charges**\n${bullet(guidance.chargeClassifications.map(item => `${item.name} — ${item.classification}`))}`
      : '',
    immediateActions: practicalPlan.length || legalInformationActions.length ? [
      practicalPlan.length
        ? `**${labels.practical}**\n${bullet(practicalPlan)}\n\n**${labels.resources}**\n${bullet(guidance.practicalSupportLinks.map(link => labels[link.kind]))}`
        : '',
      legalInformationActions.length
        ? `**${labels.legal}**\n${labels.legalNote}\n${bullet(legalInformationActions.map(item => `[${item.urgency}] ${item.action}`))}`
        : '',
    ].filter(Boolean).join('\n\n') : '',
    timeline: guidance.timeline.length
      ? `**Case Timeline**\n${bullet(guidance.timeline.map(item => `${item.stage}: ${item.description} (${item.isEstimate ? '~' : ''}${item.timeframe})`))}`
      : '',
    deadlines: guidance.deadlines.length
      ? `**Important Dates**\n${bullet(guidance.deadlines.map(item => `${item.event}: ${item.isEstimate ? '~' : ''}${item.timeframe} [${item.priority}] — ${item.description}`))}`
      : '',
    rights: guidance.rights.length ? `**Your Rights**\n${bullet(guidance.rights)}` : '',
    nextSteps: guidance.nextSteps.length ? `**Next Steps**\n${bullet(guidance.nextSteps)}` : '',
    evidenceToGather: guidance.evidenceToGather.length ? `**${labels.evidence}**\n${labels.evidenceNote}\n${bullet(guidance.evidenceToGather)}` : '',
    warnings: guidance.warnings.length ? `**Important Warnings**\n${bullet(guidance.warnings)}` : '',
    courtPreparation: guidance.courtPreparation.length ? `**${labels.courtInformation}**\n${labels.courtNote}\n${bullet(guidance.courtPreparation)}` : '',
    collateralConsequences: guidance.collateralConsequences.length
      ? `**Possible Collateral Consequences**\n${bullet(guidance.collateralConsequences.map(item => `${item.consequence} (${item.timing}) — ${item.actionNote}`))}`
      : '',
    mockQA: guidance.mockQA.length
      ? `**Practice Questions for Your Case**\n${bullet(guidance.mockQA.map(item => `${item.question}\n  Suggested response: ${item.suggestedResponse}\n  Why: ${item.explanation}`))}`
      : '',
    avoidActions: guidance.avoidActions.length ? `**${labels.beforeActing}**\n${labels.beforeActingNote}\n${bullet(guidance.avoidActions)}` : '',
    uncertainties: guidance.uncertainties.length
      ? `**Areas to Verify**\n${bullet(guidance.uncertainties.map(item => `${item.area}: ${item.note}`))}`
      : '',
    resources: guidance.resources.length
      ? `**Resources**\n${bullet(guidance.resources.map(item => [
          `${item.type}: ${item.description} (${item.contact})`,
          item.hours ? `Hours: ${item.hours}` : '',
          item.website ? `Website: ${item.website}` : '',
        ].filter(Boolean).join(' — ')))}`
      : '',
  };

  return GUIDANCE_SECTION_ORDER.map(section => sections[section]).filter(Boolean).join('\n\n');
}

export function withGuidanceCaseData(
  raw: unknown,
  caseData: Partial<GuidanceViewModel['caseData']>,
): GuidanceViewModel {
  return normalizeGuidance(raw, caseData);
}