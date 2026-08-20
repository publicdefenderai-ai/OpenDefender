import {
  GUIDANCE_SECTION_ORDER,
  normalizeGuidance,
  type GuidanceViewModel,
} from './guidance-view-model';

const bullet = (items: string[]) => items.map(item => `• ${item}`).join('\n');

/**
 * Accessible text presentation of the complete normalized plan.
 * The section sequence comes from GUIDANCE_SECTION_ORDER, so chat cannot
 * silently omit a newly added safety field.
 */
export function buildGuidanceChatSummary(raw: unknown): string {
  const guidance = normalizeGuidance(raw);
  const sections: Record<(typeof GUIDANCE_SECTION_ORDER)[number], string> = {
    criticalAlerts: guidance.criticalAlerts.length ? `**Urgent Takeaways**\n${bullet(guidance.criticalAlerts)}` : '',
    overview: guidance.overview ? `**Overview**\n${guidance.overview}` : '',
    charges: guidance.chargeClassifications.length
      ? `**Your Charges**\n${bullet(guidance.chargeClassifications.map(item => `${item.name} — ${item.classification}`))}`
      : '',
    immediateActions: guidance.immediateActions.length
      ? `**What Matters Now**\n${bullet(guidance.immediateActions.map(item => `[${item.urgency}] ${item.action}`))}`
      : '',
    timeline: guidance.timeline.length
      ? `**Case Timeline**\n${bullet(guidance.timeline.map(item => `${item.stage}: ${item.description} (${item.isEstimate ? '~' : ''}${item.timeframe})`))}`
      : '',
    deadlines: guidance.deadlines.length
      ? `**Important Dates**\n${bullet(guidance.deadlines.map(item => `${item.event}: ${item.isEstimate ? '~' : ''}${item.timeframe} [${item.priority}] — ${item.description}`))}`
      : '',
    rights: guidance.rights.length ? `**Your Rights**\n${bullet(guidance.rights)}` : '',
    nextSteps: guidance.nextSteps.length ? `**Next Steps**\n${bullet(guidance.nextSteps)}` : '',
    evidenceToGather: guidance.evidenceToGather.length ? `**Evidence to Gather**\n${bullet(guidance.evidenceToGather)}` : '',
    warnings: guidance.warnings.length ? `**Important Warnings**\n${bullet(guidance.warnings)}` : '',
    courtPreparation: guidance.courtPreparation.length ? `**Court Preparation**\n${bullet(guidance.courtPreparation)}` : '',
    collateralConsequences: guidance.collateralConsequences.length
      ? `**Possible Collateral Consequences**\n${bullet(guidance.collateralConsequences.map(item => `${item.consequence} (${item.timing}) — ${item.actionNote}`))}`
      : '',
    mockQA: guidance.mockQA.length
      ? `**Practice Questions for Your Case**\n${bullet(guidance.mockQA.map(item => `${item.question}\n  Suggested response: ${item.suggestedResponse}\n  Why: ${item.explanation}`))}`
      : '',
    avoidActions: guidance.avoidActions.length ? `**Actions to Avoid**\n${bullet(guidance.avoidActions)}` : '',
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