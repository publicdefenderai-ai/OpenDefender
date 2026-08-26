import React from "react";
import {
  GUIDANCE_SECTION_ORDER,
  normalizeGuidance,
  type GuidanceSectionId,
  type GuidanceViewModel,
} from "@shared/guidance-view-model";
import { renderGuidanceRichText } from "./guidance-rich-text";

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

const immediateActionLabels = (language: string) => {
  if (language.startsWith("es")) {
    return {
      section: "Información y pasos para revisar",
      practical: "Pasos prácticos que puede realizar",
      legal: "Información del caso para revisar",
      note: "Estos son temas legales generales, no instrucciones personales. Un abogado puede explicarle cómo se aplican a su situación.",
      organize: "Guarde en un mismo lugar los documentos del tribunal, los detalles de sus citas y los contactos importantes.",
      calendar: "Anote en un calendario las próximas citas y fechas judiciales que aparezcan en sus documentos.",
      everydaySupport: "Elija una necesidad cotidiana que pueda atender hoy: vivienda, comida, trabajo, cuidado infantil, transporte o bienestar.",
      resources: "Encuentre apoyo e información",
      legalHelp: "Encuentre ayuda legal: busque un defensor público o asistencia legal cerca de usted.",
      court: "Encuentre su tribunal: busque el sitio web, la dirección y la información de contacto del tribunal.",
      lifeSupport: "Obtenga apoyo para usted y su familia: encuentre ayuda con vivienda, comida, trabajo, transporte, cuidado infantil o bienestar.",
      evidenceNote: "La forma de manejar la evidencia depende de los hechos y de la ley de su caso. Estos temas pueden ayudarle a preparar preguntas para un abogado calificado.",
      courtNote: "La preparación para el tribunal puede variar según el tribunal y los hechos de su caso. Un abogado puede ayudarle a entender qué opciones aplican.",
      avoidNote: "Los temas a continuación pueden afectar un caso. Son información general, no una lista de instrucciones personales.",
      title: "Su hoja de ruta del caso",
      footer: "Esta es información legal general, no asesoramiento legal. Verifique los plazos y las decisiones con un abogado autorizado.",
    };
  }
  if (language.startsWith("zh")) {
    return {
      section: "可了解的案件信息与实用步骤",
      practical: "您可以采取的实用步骤",
      legal: "可了解的案件信息",
      note: "以下是一般法律信息，并非针对您个人的指示。律师可以说明这些信息如何适用于您的情况。",
      organize: "将法庭文件、预约详情和重要联系人放在同一个地方。",
      calendar: "将文件中列出的即将到来的预约和出庭日期记入日历。",
      everydaySupport: "今天选择处理一项日常需求：住房、食物、工作、托儿、交通或身心健康。",
      resources: "查找支持与信息",
      legalHelp: "寻找法律帮助：查找您附近的公设辩护人或法律援助。",
      court: "查找您的法院：查询法院网站、地址和联系信息。",
      lifeSupport: "获得生活与家庭支持：查找住房、食物、工作、交通、托儿或身心健康方面的帮助。",
      evidenceNote: "证据应如何处理取决于您案件的事实和相关法律。这些主题可帮助您准备向合格律师提出的问题。",
      courtNote: "出庭准备可能因法院和您案件的事实而异。律师可以帮助您了解哪些选择适用。",
      avoidNote: "以下主题可能影响案件。它们是一般信息，并非针对您个人的指示。",
      title: "您的案件路线图",
      footer: "这是一般法律信息，不是法律建议。请向持牌律师核实截止日期和决定。",
    };
  }
  return {
    section: "Practical steps and case information",
    practical: "Practical steps you can take",
    legal: "Case information to review",
    note: "These are general legal topics, not personal instructions. A lawyer can explain how they apply to your situation.",
    organize: "Put your court papers, appointment details, and important contacts in one place.",
    calendar: "Add upcoming appointments and court dates from your paperwork to a calendar.",
    everydaySupport: "Choose one everyday need to address today: housing, food, work, child care, transportation, or wellbeing.",
    resources: "Find support and information",
    legalHelp: "Find legal help: search for a public defender or legal aid near you.",
    court: "Find your court: look up the court website, address, and contact information.",
    lifeSupport: "Get life and family support: find help with housing, food, work, transportation, child care, or wellbeing.",
    evidenceNote: "How evidence should be handled depends on the facts and law in your case. These topics can help you prepare questions for a qualified lawyer.",
    courtNote: "Court preparation can vary by court and the facts of your case. A lawyer can help you understand which options apply.",
    avoidNote: "The topics below can affect a case. They are general information, not a personalized list of instructions.",
    title: "Your Case Roadmap",
    footer: "This is general legal information, not legal advice. Verify deadlines and decisions with a licensed attorney.",
  };
};

function sectionLabels(language: string): Record<GuidanceSectionId, string> {
  const actions = immediateActionLabels(language);
  if (language.startsWith("es")) {
    return {
      ...SECTION_LABELS,
      immediateActions: actions.section,
      evidenceToGather: "Temas de evidencia para revisar con un abogado",
      courtPreparation: "Información para revisar antes de la corte",
      avoidActions: "Preguntas para discutir antes de actuar",
    };
  }
  if (language.startsWith("zh")) {
    return {
      ...SECTION_LABELS,
      immediateActions: actions.section,
      evidenceToGather: "可与律师讨论的证据事项",
      courtPreparation: "出庭前可了解的信息",
      avoidActions: "行动前可讨论的问题",
    };
  }
  return {
    ...SECTION_LABELS,
    immediateActions: actions.section,
    evidenceToGather: "Evidence topics to review with a lawyer",
    courtPreparation: "Court information to review",
    avoidActions: "Questions to discuss before acting",
  };
}

function list(items: string[]) {
  return <ul>{items.map((item, index) => <li key={index}>{renderGuidanceRichText(item)}</li>)}</ul>;
}

function sectionContent(section: GuidanceSectionId, guidance: GuidanceViewModel, language: string) {
  switch (section) {
    case "criticalAlerts":
      return guidance.criticalAlerts.length ? list(guidance.criticalAlerts) : null;
    case "overview":
      return guidance.overview ? <p>{renderGuidanceRichText(guidance.overview)}</p> : null;
    case "charges":
      return guidance.chargeClassifications.length ? (
        <ul>
          {guidance.chargeClassifications.map((charge, index) => (
            <li key={index}>
              <strong>{renderGuidanceRichText(charge.name)}:</strong> {renderGuidanceRichText(charge.classification)}
              {charge.verifiedCitation && <>, {renderGuidanceRichText(charge.verifiedCitation)}</>}
            </li>
          ))}
        </ul>
      ) : null;
    case "immediateActions":
      const actions = immediateActionLabels(language);
      const practicalActions = guidance.immediateActions.filter(item => item.treatment === "practical");
      const legalInformationActions = guidance.immediateActions.filter(item => item.treatment !== "practical");
      return (
        <>
          <h3>{actions.practical}</h3>
          <ol>
            {guidance.practicalStarterSteps.map((step) => <li key={step}>{actions[step]}</li>)}
             {practicalActions.map((item, index) => <li key={`generated-${index}`}><strong>{item.urgency}:</strong> {renderGuidanceRichText(item.action)}</li>)}
          </ol>
          <h3>{actions.resources}</h3>
          <ul>
            {guidance.practicalSupportLinks.map(link => (
              <li key={link.kind}>
                <a href={link.href}>{actions[link.kind]}</a>
              </li>
            ))}
          </ul>
          {legalInformationActions.length > 0 && (
            <>
              <h3>{actions.legal}</h3>
              <p>{actions.note}</p>
               <ul>{legalInformationActions.map((item, index) => <li key={index}><strong>{item.urgency}:</strong> {renderGuidanceRichText(item.action)}</li>)}</ul>
            </>
          )}
        </>
      );
    case "timeline":
      return guidance.timeline.length ? (
        <ol>{guidance.timeline.map((item, index) => (
          <li key={index}><strong>{renderGuidanceRichText(item.stage)}:</strong> {renderGuidanceRichText(item.description)} ({item.isEstimate ? "~" : ""}{renderGuidanceRichText(item.timeframe)}){item.completed ? ", completed" : ""}</li>
        ))}</ol>
      ) : null;
    case "deadlines":
      return guidance.deadlines.length ? (
        <ul>{guidance.deadlines.map((item, index) => (
          <li key={index}><strong>{renderGuidanceRichText(item.event)}:</strong> {item.isEstimate ? "~" : ""}{renderGuidanceRichText(item.timeframe)} [{item.priority}], {renderGuidanceRichText(item.description)}</li>
        ))}</ul>
      ) : null;
    case "rights":
      return guidance.rights.length ? list(guidance.rights) : null;
    case "nextSteps":
      return guidance.nextSteps.length ? list(guidance.nextSteps) : null;
    case "evidenceToGather":
      return guidance.evidenceToGather.length ? <><p>{immediateActionLabels(language).evidenceNote}</p>{list(guidance.evidenceToGather)}</> : null;
    case "warnings":
      return guidance.warnings.length ? list(guidance.warnings) : null;
    case "courtPreparation":
      return guidance.courtPreparation.length ? <><p>{immediateActionLabels(language).courtNote}</p>{list(guidance.courtPreparation)}</> : null;
    case "collateralConsequences":
      return guidance.collateralConsequences.length ? (
        <ul>{guidance.collateralConsequences.map((item, index) => (
           <li key={index}><strong>{renderGuidanceRichText(item.consequence)}</strong> ({renderGuidanceRichText(item.timing)}): {renderGuidanceRichText(item.actionNote)}</li>
        ))}</ul>
      ) : null;
    case "mockQA":
      return guidance.mockQA.length ? (
        <ol>{guidance.mockQA.map((item, index) => (
          <li key={index}>
             <strong>{renderGuidanceRichText(item.question)}</strong>
             <div>Suggested response: {renderGuidanceRichText(item.suggestedResponse)}</div>
             <div>Why: {renderGuidanceRichText(item.explanation)}</div>
          </li>
        ))}</ol>
      ) : null;
    case "avoidActions":
      return guidance.avoidActions.length ? <><p>{immediateActionLabels(language).avoidNote}</p>{list(guidance.avoidActions)}</> : null;
    case "uncertainties":
      return guidance.uncertainties.length ? (
         <ul>{guidance.uncertainties.map((item, index) => <li key={index}><strong>{renderGuidanceRichText(item.area)}:</strong> {renderGuidanceRichText(item.note)}</li>)}</ul>
      ) : null;
    case "resources":
      return guidance.resources.length ? (
        <ul>{guidance.resources.map((item, index) => (
          <li key={index}>
             <strong>{renderGuidanceRichText(item.type)}:</strong> {renderGuidanceRichText(item.description)}, {renderGuidanceRichText(item.contact)}
             {item.hours && <>, {renderGuidanceRichText(item.hours)}</>}
             {item.website && <>, {renderGuidanceRichText(item.website)}</>}
          </li>
        ))}</ul>
      ) : null;
  }
}

/**
 * Print does not depend on interactive accordion state. It renders a fresh,
 * complete plan from the normalized model in the canonical section order.
 */
export function GuidancePrintPlan({ guidance: raw, language = "en" }: { guidance: GuidanceViewModel; language?: string }) {
  const guidance = normalizeGuidance(raw);
  const labels = sectionLabels(language);
  const printLabels = immediateActionLabels(language);
  return (
    <article className="hidden print:block guidance-print-plan" data-testid="print-guidance-plan">
      <header>
        <h1>{printLabels.title}</h1>
        <p>{guidance.caseData.jurisdiction}: {guidance.caseData.caseStage}</p>
      </header>
      {GUIDANCE_SECTION_ORDER.map(section => {
        const content = sectionContent(section, guidance, language);
        if (!content) return null;
        return (
          <section key={section} data-guidance-section={section}>
            <h2>{labels[section]}</h2>
            {content}
          </section>
        );
      })}
      <footer>{printLabels.footer}</footer>
    </article>
  );
}
