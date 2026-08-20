import React from "react";
import {
  GUIDANCE_SECTION_ORDER,
  normalizeGuidance,
  type GuidanceSectionId,
  type GuidanceViewModel,
} from "@shared/guidance-view-model";

const SECTION_LABELS: Record<GuidanceSectionId, string> = {
  criticalAlerts: "Urgent Takeaways",
  overview: "Overview",
  charges: "Understanding Your Charges",
  immediateActions: "What Matters Now",
  timeline: "Case Timeline & Process",
  deadlines: "Important Dates",
  rights: "Your Legal Rights",
  nextSteps: "Recommended Next Steps",
  evidenceToGather: "Evidence to Gather",
  warnings: "Important Warnings",
  courtPreparation: "Court Preparation Checklist",
  collateralConsequences: "Beyond the Sentence: What Else May Be at Risk",
  mockQA: "Practice Questions for Your Case",
  avoidActions: "Actions to Avoid",
  uncertainties: "Areas of Uncertainty",
  resources: "Legal Resources & Contacts",
};

function list(items: string[]) {
  return <ul>{items.map((item, index) => <li key={index}>{item}</li>)}</ul>;
}

function sectionContent(section: GuidanceSectionId, guidance: GuidanceViewModel) {
  switch (section) {
    case "criticalAlerts":
      return guidance.criticalAlerts.length ? list(guidance.criticalAlerts) : null;
    case "overview":
      return guidance.overview ? <p>{guidance.overview}</p> : null;
    case "charges":
      return guidance.chargeClassifications.length ? (
        <ul>
          {guidance.chargeClassifications.map((charge, index) => (
            <li key={index}>
              <strong>{charge.name}</strong> — {charge.classification}
              {charge.verifiedCitation && <> — {charge.verifiedCitation}</>}
            </li>
          ))}
        </ul>
      ) : null;
    case "immediateActions":
      return guidance.immediateActions.length ? (
        <ol>{guidance.immediateActions.map((item, index) => <li key={index}><strong>{item.urgency}:</strong> {item.action}</li>)}</ol>
      ) : null;
    case "timeline":
      return guidance.timeline.length ? (
        <ol>{guidance.timeline.map((item, index) => (
          <li key={index}><strong>{item.stage}</strong> — {item.description} ({item.isEstimate ? "~" : ""}{item.timeframe}){item.completed ? " — completed" : ""}</li>
        ))}</ol>
      ) : null;
    case "deadlines":
      return guidance.deadlines.length ? (
        <ul>{guidance.deadlines.map((item, index) => (
          <li key={index}><strong>{item.event}</strong> — {item.isEstimate ? "~" : ""}{item.timeframe} [{item.priority}] — {item.description}</li>
        ))}</ul>
      ) : null;
    case "rights":
      return guidance.rights.length ? list(guidance.rights) : null;
    case "nextSteps":
      return guidance.nextSteps.length ? list(guidance.nextSteps) : null;
    case "evidenceToGather":
      return guidance.evidenceToGather.length ? list(guidance.evidenceToGather) : null;
    case "warnings":
      return guidance.warnings.length ? list(guidance.warnings) : null;
    case "courtPreparation":
      return guidance.courtPreparation.length ? list(guidance.courtPreparation) : null;
    case "collateralConsequences":
      return guidance.collateralConsequences.length ? (
        <ul>{guidance.collateralConsequences.map((item, index) => (
          <li key={index}><strong>{item.consequence}</strong> ({item.timing}) — {item.actionNote}</li>
        ))}</ul>
      ) : null;
    case "mockQA":
      return guidance.mockQA.length ? (
        <ol>{guidance.mockQA.map((item, index) => (
          <li key={index}>
            <strong>{item.question}</strong>
            <div>Suggested response: {item.suggestedResponse}</div>
            <div>Why: {item.explanation}</div>
          </li>
        ))}</ol>
      ) : null;
    case "avoidActions":
      return guidance.avoidActions.length ? list(guidance.avoidActions) : null;
    case "uncertainties":
      return guidance.uncertainties.length ? (
        <ul>{guidance.uncertainties.map((item, index) => <li key={index}><strong>{item.area}</strong> — {item.note}</li>)}</ul>
      ) : null;
    case "resources":
      return guidance.resources.length ? (
        <ul>{guidance.resources.map((item, index) => (
          <li key={index}>
            <strong>{item.type}</strong> — {item.description} — {item.contact}
            {item.hours && <> — {item.hours}</>}
            {item.website && <> — {item.website}</>}
          </li>
        ))}</ul>
      ) : null;
  }
}

/**
 * Print does not depend on interactive accordion state. It renders a fresh,
 * complete plan from the normalized model in the canonical section order.
 */
export function GuidancePrintPlan({ guidance: raw }: { guidance: GuidanceViewModel }) {
  const guidance = normalizeGuidance(raw);
  return (
    <article className="hidden print:block guidance-print-plan" data-testid="print-guidance-plan">
      <header>
        <h1>Your Case Roadmap</h1>
        <p>{guidance.caseData.jurisdiction} — {guidance.caseData.caseStage}</p>
      </header>
      {GUIDANCE_SECTION_ORDER.map(section => {
        const content = sectionContent(section, guidance);
        if (!content) return null;
        return (
          <section key={section} data-guidance-section={section}>
            <h2>{SECTION_LABELS[section]}</h2>
            {content}
          </section>
        );
      })}
      <footer>This is general legal information, not legal advice. Verify deadlines and decisions with a licensed attorney.</footer>
    </article>
  );
}
