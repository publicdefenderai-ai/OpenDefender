import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { getChargeExplanation } from "@shared/charge-explanations";
import { getDocumentsForPhase, mapCaseStageToPhase, type LegalDocument } from "@shared/legal-documents";
import { normalizeGuidance, type GuidanceViewModel } from "@shared/guidance-view-model";

// jsPDF's built-in fonts (helvetica, times, courier) only cover Latin/WinAnsi glyphs. Chinese
// text renders as garbage without an embedded CJK font. This lazily fetches a GB2312-subset
// TrueType build of Noto Sans SC (Regular + Bold, ~2.2MB each) and caches the base64 result so
// only the first Chinese-language export in a session pays the download cost.
let cjkFontPromise: Promise<{ regular: string; bold: string }> | null = null;

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000; // avoid blowing the call stack on String.fromCharCode(...bytes)
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

async function loadCJKFont(): Promise<{ regular: string; bold: string }> {
  if (!cjkFontPromise) {
    cjkFontPromise = Promise.all([
      fetch('/fonts/NotoSansSC-Regular.ttf').then(r => r.arrayBuffer()),
      fetch('/fonts/NotoSansSC-Bold.ttf').then(r => r.arrayBuffer()),
    ])
      .then(([regularBuf, boldBuf]) => ({
        regular: arrayBufferToBase64(regularBuf),
        bold: arrayBufferToBase64(boldBuf),
      }))
      .catch((err) => {
        cjkFontPromise = null; // don't cache a failure — allow retry on the next export
        throw err;
      });
  }
  return cjkFontPromise;
}

// Convert markdown links to readable plain text for PDF output:
// [Childcare Resources](/support/childcare) → Childcare Resources (opendefender.org/support/childcare)
function pl(text: string): string {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) =>
    href.startsWith('/') ? `${label} (opendefender.org${href})` : `${label} (${href})`
  );
}

// Strip inline markdown (bold, italic) so raw asterisks never appear in PDF output
function stripMd(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')  // **bold**
    .replace(/\*([^*]+)\*/g, '$1')       // *italic*
    .replace(/_([^_]+)_/g, '$1');        // _italic_
}

type EnhancedGuidanceData = GuidanceViewModel;

// Utility function to format charge names in plain English
const formatChargeName = (name: string): string => {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Document titles and descriptions for PDF export (hardcoded to avoid i18n dependency)
const DOCUMENT_LABELS: Record<string, { en: { title: string; description: string }; es: { title: string; description: string } }> = {
  'citation-ticket': {
    en: { title: 'Citation / Ticket', description: 'Official document showing charges and court date' },
    es: { title: 'Citación / Multa', description: 'Documento oficial mostrando cargos y fecha de corte' }
  },
  'arrest-warrant': {
    en: { title: 'Arrest Warrant', description: 'Court order authorizing your arrest' },
    es: { title: 'Orden de Arresto', description: 'Orden judicial autorizando su arresto' }
  },
  'property-voucher': {
    en: { title: 'Property Voucher', description: 'Receipt for items taken during arrest' },
    es: { title: 'Comprobante de Propiedad', description: 'Recibo de artículos tomados durante el arresto' }
  },
  'booking-papers': {
    en: { title: 'Booking Papers', description: 'Processing documents from jail intake' },
    es: { title: 'Documentos de Registro', description: 'Documentos de procesamiento de ingreso a cárcel' }
  },
  'miranda-acknowledgment': {
    en: { title: 'Miranda Acknowledgment', description: 'Form showing you were read your rights' },
    es: { title: 'Reconocimiento Miranda', description: 'Formulario mostrando que le leyeron sus derechos' }
  },
  'complaint-information': {
    en: { title: 'Criminal Complaint', description: 'Formal charging document filed by prosecutor' },
    es: { title: 'Denuncia Criminal', description: 'Documento formal de cargos presentado por fiscal' }
  },
  'bail-bond': {
    en: { title: 'Bail Bond Documents', description: 'Paperwork related to your release conditions' },
    es: { title: 'Documentos de Fianza', description: 'Papeles relacionados con sus condiciones de libertad' }
  },
  'arraignment-minutes': {
    en: { title: 'Arraignment Minutes', description: 'Record of your first court appearance' },
    es: { title: 'Acta de Lectura de Cargos', description: 'Registro de su primera comparecencia' }
  },
  'discovery-materials': {
    en: { title: 'Discovery Materials', description: 'Evidence the prosecution plans to use' },
    es: { title: 'Materiales de Descubrimiento', description: 'Evidencia que la fiscalía planea usar' }
  },
  'motion-papers': {
    en: { title: 'Motion Papers', description: 'Legal requests filed with the court' },
    es: { title: 'Documentos de Moción', description: 'Solicitudes legales presentadas al tribunal' }
  },
  'plea-agreement': {
    en: { title: 'Plea Agreement', description: 'Written deal with the prosecutor' },
    es: { title: 'Acuerdo de Culpabilidad', description: 'Trato escrito con el fiscal' }
  },
  'pretrial-order': {
    en: { title: 'Pretrial Order', description: 'Court rules for before trial' },
    es: { title: 'Orden Prejuicio', description: 'Reglas del tribunal antes del juicio' }
  },
  'jury-instructions': {
    en: { title: 'Jury Instructions', description: 'Rules given to jury about the law' },
    es: { title: 'Instrucciones al Jurado', description: 'Reglas dadas al jurado sobre la ley' }
  },
  'verdict-form': {
    en: { title: 'Verdict Form', description: 'Document recording jury decision' },
    es: { title: 'Formulario de Veredicto', description: 'Documento registrando decisión del jurado' }
  },
  'sentencing-order': {
    en: { title: 'Sentencing Order', description: 'Official record of your sentence' },
    es: { title: 'Orden de Sentencia', description: 'Registro oficial de su sentencia' }
  },
  'criminal-complaint': {
    en: { title: 'Criminal Complaint', description: 'Formal document listing charges against you' },
    es: { title: 'Denuncia Criminal', description: 'Documento formal listando cargos en su contra' }
  },
  'arraignment-notice': {
    en: { title: 'Arraignment Notice', description: 'Notice of your first court appearance' },
    es: { title: 'Aviso de Lectura de Cargos', description: 'Aviso de su primera comparecencia' }
  },
  'bail-bond-order': {
    en: { title: 'Bail Bond Order', description: 'Court order setting your bail conditions' },
    es: { title: 'Orden de Fianza', description: 'Orden del tribunal estableciendo condiciones de fianza' }
  },
  'discovery-documents': {
    en: { title: 'Discovery Documents', description: 'Evidence and information from prosecution' },
    es: { title: 'Documentos de Descubrimiento', description: 'Evidencia e información de la fiscalía' }
  },
  'plea-offer': {
    en: { title: 'Plea Offer', description: 'Written deal offered by the prosecutor' },
    es: { title: 'Oferta de Declaración', description: 'Trato escrito ofrecido por el fiscal' }
  },
  'subpoena': {
    en: { title: 'Subpoena', description: 'Court order requiring testimony or documents' },
    es: { title: 'Citación Judicial', description: 'Orden del tribunal requiriendo testimonio o documentos' }
  },
  'notice-to-appear-i862': {
    en: { title: 'Notice to Appear (I-862)', description: 'Immigration court charging document' },
    es: { title: 'Aviso de Comparecencia (I-862)', description: 'Documento de cargos de corte de inmigración' }
  },
  'record-deportable-alien-i213': {
    en: { title: 'Record of Deportable Alien (I-213)', description: 'ICE arrest and processing form' },
    es: { title: 'Registro de Extranjero Deportable (I-213)', description: 'Formulario de arresto y procesamiento de ICE' }
  },
  'bond-hearing-notice': {
    en: { title: 'Bond Hearing Notice', description: 'Notice of immigration bond hearing' },
    es: { title: 'Aviso de Audiencia de Fianza', description: 'Aviso de audiencia de fianza de inmigración' }
  },
  'warrant-of-removal-i205': {
    en: { title: 'Warrant of Removal (I-205)', description: 'Deportation order from immigration court' },
    es: { title: 'Orden de Deportación (I-205)', description: 'Orden de deportación del tribunal de inmigración' }
  },
  'order-of-supervision-i220b': {
    en: { title: 'Order of Supervision (I-220B)', description: 'Release conditions from ICE custody' },
    es: { title: 'Orden de Supervisión (I-220B)', description: 'Condiciones de liberación de custodia de ICE' }
  },
  'expedited-removal-i860': {
    en: { title: 'Expedited Removal (I-860)', description: 'Fast-track deportation order' },
    es: { title: 'Deportación Acelerada (I-860)', description: 'Orden de deportación acelerada' }
  },
};

function getDocumentTitle(docId: string, isSpanish: boolean): string {
  const labels = DOCUMENT_LABELS[docId];
  if (!labels) return docId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return isSpanish ? labels.es.title : labels.en.title;
}

function getDocumentDescription(docId: string, isSpanish: boolean): string {
  const labels = DOCUMENT_LABELS[docId];
  if (!labels) return '';
  return isSpanish ? labels.es.description : labels.en.description;
}

function formatSentenceLength(months: number): string {
  if (months === 0) return 'No jail time';
  if (months < 1) return 'Fine only';
  if (months < 12) return `${months} months`;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) {
    return years === 1 ? '1 year' : `${years} years`;
  }
  return `${years}y ${remainingMonths}m`;
}

/**
 * Generates a PDF document from legal guidance data.
 * All processing happens client-side - no data is sent to external servers.
 *
 * @param guidance - The legal guidance data to export
 * @param language - The language for the PDF (en, es, or zh)
 */
export async function generateGuidancePDF(guidance: EnhancedGuidanceData, language: string = 'en') {
  guidance = normalizeGuidance(guidance) as EnhancedGuidanceData;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let yPosition = 20;
  const isSpanish = language === 'es';
  const isChinese = language === 'zh';
  const FONT_NAME = isChinese ? 'NotoSansSC' : 'helvetica';

  if (isChinese) {
    const { regular, bold } = await loadCJKFont();
    doc.addFileToVFS('NotoSansSC-Regular.ttf', regular);
    doc.addFont('NotoSansSC-Regular.ttf', 'NotoSansSC', 'normal');
    doc.addFileToVFS('NotoSansSC-Bold.ttf', bold);
    doc.addFont('NotoSansSC-Bold.ttf', 'NotoSansSC', 'bold');
  }

  // Defensive normalization — Claude may return partial responses with missing fields.
  // Using a safe object prevents hard crashes when any array or caseData field is absent.
  const safe = {
    criticalAlerts:   Array.isArray(guidance.criticalAlerts)        ? guidance.criticalAlerts        : [],
    immediateActions: Array.isArray(guidance.immediateActions)      ? guidance.immediateActions      : [],
    nextSteps:        Array.isArray(guidance.nextSteps)             ? guidance.nextSteps             : [],
    deadlines:        Array.isArray(guidance.deadlines)             ? guidance.deadlines             : [],
    rights:           Array.isArray(guidance.rights)                ? guidance.rights                : [],
    resources:        Array.isArray(guidance.resources)             ? guidance.resources             : [],
    warnings:         Array.isArray(guidance.warnings)              ? guidance.warnings              : [],
    evidenceToGather: Array.isArray(guidance.evidenceToGather)      ? guidance.evidenceToGather      : [],
    courtPreparation: Array.isArray(guidance.courtPreparation)      ? guidance.courtPreparation      : [],
    avoidActions:     Array.isArray(guidance.avoidActions)          ? guidance.avoidActions          : [],
    timeline:         Array.isArray(guidance.timeline)              ? guidance.timeline              : [],
    mockQA:           Array.isArray(guidance.mockQA)                ? guidance.mockQA               : [],
    collateralConsequences: Array.isArray(guidance.collateralConsequences) ? guidance.collateralConsequences : [],
    uncertainties:          Array.isArray(guidance.uncertainties)           ? guidance.uncertainties           : [],
  };
  const caseData = guidance.caseData ?? {
    jurisdiction: 'Unknown',
    charges: 'Not specified',
    caseStage: 'Not specified',
    custodyStatus: 'Not specified',
    hasAttorney: false,
  };

  // Localized labels
  const labels = isSpanish ? {
    title: 'Hoja de Ruta del Caso',
    generated: 'Generado',
    privacy: 'PRIVADO: Este documento contiene su información legal personal. No lo comparta sin consultar primero con un abogado.',
    caseInfo: 'Información de su Caso',
    yourState: 'Su Estado',
    processStage: 'Etapa del Proceso',
    inJail: '¿Está Detenido?',
    hasLawyer: '¿Tiene Abogado?',
    charges: 'Cargos',
    yes: 'Sí',
    no: 'No',
    overview: 'Resumen',
    understandingCharges: 'Entendiendo sus Cargos',
    chargesSubtitle: 'Esto es lo que significan estos términos legales en lenguaje sencillo.',
    keyTerms: 'Términos legales clave que la fiscalía debe probar:',
    chargeDisclaimer: 'Recuerde: La fiscalía debe probar cada elemento de estos cargos más allá de una duda razonable. Su abogado puede ayudar a identificar qué elementos pueden ser cuestionados basándose en la evidencia. Los rangos de sentencia anteriores son estimaciones generales y no son específicos de su estado ni de su caso. Las penas reales dependen del estatuto de su jurisdicción y de los hechos de su caso, lo cual su abogado puede confirmar.',
    urgentTakeaways: 'Alertas Urgentes',
    immediateActions: 'Lo Que Importa Ahora',
    importantDates: 'Fechas Importantes',
    event: 'Evento',
    timeframe: 'Plazo',
    priority: 'Prioridad',
    description: 'Descripción',
    yourRights: 'Sus Derechos Legales',
    nextSteps: 'Próximos Pasos Recomendados',
    evidenceToGather: 'Evidencia a Reunir',
    courtPrep: 'Lista de Preparación para la Corte',
    actionsToAvoid: '! Acciones a Evitar',
    warnings: 'Advertencias Importantes',
    resources: 'Recursos Legales y Contactos',
    type: 'Tipo',
    contact: 'Contacto',
    hours: 'Horario',
    website: 'Sitio Web',
    timeline: 'Cronología y Proceso del Caso',
    status: 'Estado',
    stage: 'Etapa',
    practiceQA: 'Preguntas de Práctica para su Caso',
    practiceQASubtitle: 'Preguntas que le pueden hacer y respuestas sugeridas',
    suggestedResponse: 'Respuesta Sugerida',
    explanation: 'Por Qué Esto Importa',
    footer: 'Esto no es asesoría legal. Consulte con un abogado calificado para su situación específica.',
    page: 'Página',
    of: 'de',
    na: 'N/D',
    felonyFallback: 'Este es un cargo de delito mayor, que es un delito penal más grave. Los delitos mayores pueden llevar penas significativas incluyendo tiempo en prisión. Su abogado puede explicar los elementos específicos que la fiscalía debe probar.',
    misdemeanorFallback: 'Este es un cargo de delito menor, que generalmente es menos grave que un delito mayor. Los delitos menores aún pueden resultar en tiempo en la cárcel, multas y antecedentes penales. Su abogado puede explicar lo que la fiscalía necesita probar.',
    howDegreesDiffer: 'Cómo difieren los grados:',
    example: 'Ejemplo:',
    documentsYouNeed: 'Documentos que Debería Tener',
    documentsSubtitle: 'Estos documentos son importantes para su etapa actual del proceso legal.',
    documentName: 'Documento',
    documentDescription: 'Para Qué Sirve',
    /** Shown before charge explanations flagged pendingAttorneyReview: true */
    pendingReviewWarning: '⚠ Nota: Esta explicación aún no ha sido revisada por un abogado defensor penal autorizado. Trátela solo como un punto de partida general.',
    /** Shown before charge explanations whose translation is machine-assisted and not yet reviewed */
    translationDraftWarning: '⚠ Traducción provisional: Esta traducción fue generada automáticamente y aún no ha sido revisada por un profesional legal bilingüe. Verifique términos críticos con su abogado.',
  } : {
    title: 'Your Case Roadmap',
    generated: 'Generated',
    privacy: 'PRIVATE: This document has your personal legal information. Don\'t share it without talking to a lawyer first.',
    caseInfo: 'Your Case Information',
    yourState: 'Your State',
    processStage: 'Where You Are in the Process',
    inJail: 'Are You in Jail',
    hasLawyer: 'Do You Have a Lawyer',
    charges: 'Charges',
    yes: 'Yes',
    no: 'No',
    overview: 'Overview',
    understandingCharges: 'Understanding Your Charges',
    chargesSubtitle: "Here's what these legal terms actually mean in plain English.",
    keyTerms: 'Key legal terms the prosecution must prove:',
    chargeDisclaimer: 'Remember: The prosecution must prove every element of these charges beyond a reasonable doubt. Your attorney can help identify which elements may be challenged based on the evidence. The sentencing ranges above are general estimates and are not specific to your state or your case. Actual penalties depend on your jurisdiction\'s statute and the facts of your case, which your attorney can confirm.',
    urgentTakeaways: 'Urgent Takeaways',
    immediateActions: 'What Matters Now',
    importantDates: 'Important Dates',
    event: 'Event',
    timeframe: 'Timeframe',
    priority: 'Priority',
    description: 'Description',
    yourRights: 'Your Legal Rights',
    nextSteps: 'Recommended Next Steps',
    evidenceToGather: 'Evidence to Gather',
    courtPrep: 'Court Preparation Checklist',
    actionsToAvoid: '! Actions to Avoid',
    warnings: 'Important Warnings',
    resources: 'Legal Resources & Contacts',
    type: 'Type',
    contact: 'Contact',
    hours: 'Hours',
    website: 'Website',
    timeline: 'Case Timeline & Process',
    status: 'Status',
    stage: 'Stage',
    practiceQA: 'Practice Questions for Your Case',
    practiceQASubtitle: 'Questions you may be asked and suggested responses',
    suggestedResponse: 'Suggested Response',
    explanation: 'Why This Matters',
    footer: 'This is not legal advice. Consult with a qualified attorney for your specific situation.',
    page: 'Page',
    of: 'of',
    na: 'N/A',
    felonyFallback: 'This is a felony charge, which is a more serious criminal offense. Felonies can carry significant penalties including potential prison time. Your attorney can explain the specific elements the prosecution must prove.',
    misdemeanorFallback: 'This is a misdemeanor charge, which is generally less serious than a felony. Misdemeanors can still result in jail time, fines, and a criminal record. Your attorney can explain what the prosecution needs to prove.',
    howDegreesDiffer: 'How degrees differ:',
    example: 'Example:',
    documentsYouNeed: 'Documents You Should Have',
    documentsSubtitle: 'These documents are important for your current stage in the legal process.',
    documentName: 'Document',
    documentDescription: 'What It\'s For',
    /** Shown before charge explanations flagged pendingAttorneyReview: true */
    pendingReviewWarning: '⚠ Note: This explanation has not yet been reviewed by a licensed criminal defense attorney. Treat it as a general starting point only.',
    /** Shown before charge explanations whose translation is machine-assisted and not yet reviewed */
    translationDraftWarning: '⚠ Draft translation: This translation was machine-assisted and has not yet been reviewed by a bilingual legal professional. Verify critical terms with your attorney.',
  };

  // Chinese requires separate overrides for warning strings because the labels
  // object above only branches on Spanish vs. English.
  const pendingReviewWarningLocalized: string = isChinese
    ? '⚠ 注意：此说明尚未经持牌刑事辩护律师审查。请仅将其视为一般起点。'
    : labels.pendingReviewWarning;
  const translationDraftWarningLocalized: string = isChinese
    ? '⚠ 暂定翻译：此翻译由机器辅助生成，尚未经双语法律专业人士审核。请与您的律师核实关键术语。'
    : labels.translationDraftWarning;

  // Helper function to add text with word wrap
  const addText = (text: string, x: number, y: number, options?: any) => {
    const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
    doc.text(lines, x, y, options);
    return y + (lines.length * 7);
  };

  // Helper function to check if we need a new page
  const checkPageBreak = (requiredSpace: number = 20) => {
    if (yPosition > doc.internal.pageSize.getHeight() - requiredSpace) {
      doc.addPage();
      yPosition = 20;
    }
  };

  // Title
  doc.setFontSize(22);
  doc.setFont(FONT_NAME, 'bold');
  doc.text(labels.title, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Subtitle - Date and Session
  doc.setFontSize(10);
  doc.setFont(FONT_NAME, 'normal');
  doc.setTextColor(100, 100, 100);
  const currentDate = new Date().toLocaleDateString(isSpanish ? 'es-ES' : 'en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  doc.text(`${labels.generated}: ${currentDate}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  // Privacy Notice
  doc.setFontSize(9);
  doc.setTextColor(150, 0, 0);
  yPosition = addText(labels.privacy, margin, yPosition);
  yPosition += 10;

  // Case Summary Section
  doc.setFontSize(16);
  doc.setFont(FONT_NAME, 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(labels.caseInfo, margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont(FONT_NAME, 'normal');
  
  const summaryData = [
    [labels.yourState, (caseData.jurisdiction || 'Unknown').toUpperCase()],
    [labels.processStage, caseData.caseStage || 'Not specified'],
    [labels.inJail, caseData.custodyStatus || 'Not specified'],
    [labels.hasLawyer, caseData.hasAttorney ? labels.yes : labels.no],
  ];

  if (guidance.chargeClassifications && guidance.chargeClassifications.length > 0) {
    guidance.chargeClassifications.forEach((charge, idx) => {
      summaryData.push([
        idx === 0 ? labels.charges : '',
        charge.verifiedCitation
          ? `${formatChargeName(charge.name)} (${charge.verifiedCitation}) - ${charge.classification.toUpperCase()}`
          : `${formatChargeName(charge.name)} - ${charge.classification.toUpperCase()}`
      ]);
    });
  } else {
    summaryData.push([labels.charges, caseData.charges || 'Not specified']);
  }

  autoTable(doc, {
    startY: yPosition,
    head: [],
    body: summaryData,
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185] },
    margin: { left: margin, right: margin },
    styles: { fontSize: 10, font: FONT_NAME },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 10;

  // Urgent Takeaways — appears before overview, matching the web dashboard
  if (safe.criticalAlerts.length > 0) {
    checkPageBreak(30);
    doc.setFontSize(14);
    doc.setFont(FONT_NAME, 'bold');
    doc.setTextColor(180, 100, 0);
    doc.text(labels.urgentTakeaways, margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont(FONT_NAME, 'normal');
    doc.setTextColor(0, 0, 0);
    safe.criticalAlerts.forEach((alert) => {
      checkPageBreak();
      yPosition = addText(`   • ${pl(stripMd(typeof alert === 'string' ? alert : String(alert)))}`, margin + 5, yPosition);
      yPosition += 3;
    });
    yPosition += 5;
  }

  // Overview - appears after Urgent Takeaways
  if (guidance.overview) {
    checkPageBreak(30);
    doc.setFontSize(14);
    doc.setFont(FONT_NAME, 'bold');
    doc.setTextColor(0, 100, 200);
    doc.text(labels.overview, margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont(FONT_NAME, 'normal');
    doc.setTextColor(0, 0, 0);

    yPosition = addText(pl(guidance.overview), margin + 5, yPosition);
    yPosition += 10;
  }

  // Understanding Your Charges Section
  if (guidance.chargeClassifications && guidance.chargeClassifications.length > 0) {
    checkPageBreak(40);
    doc.setFontSize(14);
    doc.setFont(FONT_NAME, 'bold');
    doc.setTextColor(0, 100, 200);
    doc.text(labels.understandingCharges, margin, yPosition);
    yPosition += 6;

    doc.setFontSize(9);
    doc.setFont(FONT_NAME, isChinese ? 'normal' : 'italic');
    doc.setTextColor(100, 100, 100);
    yPosition = addText(labels.chargesSubtitle, margin, yPosition);
    yPosition += 8;

    guidance.chargeClassifications.forEach((charge, chargeIdx) => {
      checkPageBreak(50);
      
      // Charge header with classification
      doc.setFontSize(11);
      doc.setFont(FONT_NAME, 'bold');
      doc.setTextColor(0, 0, 0);
      const chargeHeader = `${formatChargeName(charge.name)} - ${charge.classification.toUpperCase()}`;
      doc.text(chargeHeader, margin, yPosition);
      yPosition += 8;

      // Get explanation for this charge
      const explanation = getChargeExplanation(charge.name, caseData.jurisdiction, language);
      
      doc.setFontSize(10);
      doc.setFont(FONT_NAME, 'normal');
      doc.setTextColor(0, 0, 0);

      // Pending-review notice — driven by explanation.pendingAttorneyReview, an explicit
      // per-entry flag. Distinct from dataConfidence: a sourced entry can have
      // dataConfidence: 'high' and still be pending attorney review, so gating on
      // dataConfidence alone would silently omit the warning for those three entries.
      if (explanation?.pendingAttorneyReview === true) {
        checkPageBreak(15);
        doc.setFontSize(9);
        doc.setFont(FONT_NAME, isChinese ? 'normal' : 'italic');
        doc.setTextColor(180, 100, 0); // amber
        yPosition = addText(
          pendingReviewWarningLocalized,
          margin + 5,
          yPosition
        );
        doc.setTextColor(0, 0, 0);
        yPosition += 6;
      }

      // Translation-draft notice — shown when the explanation was machine-translated
      // and has not yet been reviewed by a fluent-speaker legal professional.
      if (explanation?.translationDraft === true) {
        checkPageBreak(15);
        doc.setFontSize(9);
        doc.setFont(FONT_NAME, isChinese ? 'normal' : 'italic');
        doc.setTextColor(30, 80, 160); // blue to distinguish from amber attorney-review warning
        yPosition = addText(
          translationDraftWarningLocalized,
          margin + 5,
          yPosition
        );
        doc.setTextColor(0, 0, 0);
        yPosition += 6;
      }

      if (explanation?.plainSummary) {
        yPosition = addText(explanation.plainSummary, margin + 5, yPosition);
        yPosition += 6;
      } else {
        // Fallback description based on classification
        const fallback = charge.classification === 'felony'
          ? labels.felonyFallback
          : labels.misdemeanorFallback;
        yPosition = addText(fallback, margin + 5, yPosition);
        yPosition += 6;
      }

      // Jurisdiction-specific detail takes priority over the generic degree context when a
      // shared/charge-explanation-jurisdiction-overlay.ts entry exists for this state.
      if (explanation?.jurisdictionDetail) {
        checkPageBreak(25);
        doc.setFontSize(9);
        doc.setFont(FONT_NAME, isChinese ? 'normal' : 'italic');
        doc.setTextColor(80, 80, 80);
        const jd = explanation.jurisdictionDetail;
        const stateLabel = caseData.jurisdiction ? `In ${caseData.jurisdiction}:` : 'For this jurisdiction:';
        yPosition = addText(`${stateLabel} ${jd.keyRule}`, margin + 5, yPosition);
        yPosition += 4;
        doc.setFontSize(8);
        yPosition = addText(`Source: ${jd.citation}${jd.penaltyClass ? ` (${jd.penaltyClass})` : ''}`, margin + 5, yPosition);
        yPosition += 6;
        doc.setTextColor(0, 0, 0);
      } else if (explanation?.degreeContext) {
        checkPageBreak(25);
        doc.setFontSize(9);
        doc.setFont(FONT_NAME, isChinese ? 'normal' : 'italic');
        doc.setTextColor(80, 80, 80);
        yPosition = addText(`${labels.howDegreesDiffer} ${explanation.degreeContext}`, margin + 5, yPosition);
        yPosition += 6;
        doc.setTextColor(0, 0, 0);
      }

      // Key legal terms - cleaner formatting
      if (explanation?.keyTerms && explanation.keyTerms.length > 0) {
        checkPageBreak(30);
        doc.setFontSize(10);
        doc.setFont(FONT_NAME, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(labels.keyTerms, margin + 5, yPosition);
        yPosition += 8;

        explanation.keyTerms.forEach((term) => {
          checkPageBreak(25);
          
          // Term name on its own line
          doc.setFontSize(10);
          doc.setFont(FONT_NAME, 'bold');
          doc.setTextColor(0, 0, 0);
          doc.text(`${term.term}`, margin + 10, yPosition);
          yPosition += 6;
          
          // Definition on next line, indented
          doc.setFont(FONT_NAME, 'normal');
          yPosition = addText(term.plainMeaning, margin + 15, yPosition);
          yPosition += 4;

          // Example on its own line
          if (term.example) {
            doc.setFontSize(9);
            doc.setFont(FONT_NAME, isChinese ? 'normal' : 'italic');
            doc.setTextColor(100, 100, 100);
            yPosition = addText(`${labels.example} ${term.example}`, margin + 15, yPosition);
            doc.setTextColor(0, 0, 0);
            yPosition += 4;
          }
          yPosition += 2;
        });
      }

      // Separator between charges
      if (chargeIdx < guidance.chargeClassifications.length - 1) {
        yPosition += 3;
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 8;
      }
    });

    // Disclaimer
    checkPageBreak(25);
    yPosition += 5;
    doc.setFontSize(9);
    doc.setFont(FONT_NAME, isChinese ? 'normal' : 'italic');
    doc.setTextColor(100, 100, 100);
    yPosition = addText(
      labels.chargeDisclaimer,
      margin,
      yPosition
    );
    doc.setTextColor(0, 0, 0);
    yPosition += 10;
  }

  // Documents You Should Have — appears before What Matters Now, matching the web dashboard
  const phase = mapCaseStageToPhase(caseData.caseStage);
  const legalDocuments = getDocumentsForPhase(phase, 'criminal');
  if (legalDocuments.length > 0) {
    checkPageBreak(40);
    doc.setFontSize(14);
    doc.setFont(FONT_NAME, 'bold');
    doc.setTextColor(0, 100, 200);
    doc.text(labels.documentsYouNeed, margin, yPosition);
    yPosition += 6;

    doc.setFontSize(9);
    doc.setFont(FONT_NAME, isChinese ? 'normal' : 'italic');
    doc.setTextColor(100, 100, 100);
    yPosition = addText(labels.documentsSubtitle, margin, yPosition);
    yPosition += 8;

    const documentData = legalDocuments.map(legalDoc => [
      getDocumentTitle(legalDoc.id, isSpanish),
      getDocumentDescription(legalDoc.id, isSpanish)
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [[labels.documentName, labels.documentDescription]],
      body: documentData,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
      margin: { left: margin, right: margin },
      styles: { fontSize: 9, font: FONT_NAME },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 'auto' }
      }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;
  }

  // What Matters Now — action checklist matching the web dashboard
  if (safe.immediateActions.length > 0) {
    checkPageBreak(30);
    doc.setFontSize(14);
    doc.setFont(FONT_NAME, 'bold');
    doc.setTextColor(0, 100, 200);
    doc.text(labels.immediateActions, margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont(FONT_NAME, 'normal');
    doc.setTextColor(0, 0, 0);

    safe.immediateActions.forEach((actionItem) => {
      checkPageBreak(25);
      const urgency = (actionItem.urgency || 'medium').toUpperCase();
      // Colored urgency indicator
      doc.setFontSize(8);
      doc.setFont(FONT_NAME, 'bold');
      if (urgency === 'URGENT') doc.setTextColor(192, 0, 0);
      else if (urgency === 'HIGH') doc.setTextColor(180, 100, 0);
      else doc.setTextColor(80, 80, 80);
      doc.text(`\u25b8 ${urgency}`, margin + 5, yPosition);
      yPosition += 5;
      // Action text — markdown stripped so **bold** never appears raw
      doc.setFontSize(10);
      doc.setFont(FONT_NAME, 'normal');
      doc.setTextColor(0, 0, 0);
      yPosition = addText(stripMd(pl(actionItem.action || '')), margin + 8, yPosition);
      yPosition += 5;
    });
    yPosition += 3;
  }

  // Case Timeline — appears after What Matters Now, matching the web dashboard
  if (safe.timeline.length > 0) {
    checkPageBreak(40);
    doc.setFontSize(14);
    doc.setFont(FONT_NAME, 'bold');
    doc.text(labels.timeline, margin, yPosition);
    yPosition += 8;

    const timelineData = safe.timeline.map(stage => [
      stage.completed ? '[X]' : '[ ]',
      stage.stage || '',
      stage.description || '',
      stage.isEstimate ? `~${stage.timeframe}` : (stage.timeframe || '')
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [[labels.status, labels.stage, labels.description, labels.timeframe]],
      body: timelineData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      margin: { left: margin, right: margin },
      styles: { fontSize: 9, font: FONT_NAME },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' },
        1: { cellWidth: 35 },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 30 }
      }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;
  }

  // Deadlines
  if (safe.deadlines.length > 0) {
    checkPageBreak(40);
    doc.setFontSize(14);
    doc.setFont(FONT_NAME, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(labels.importantDates, margin, yPosition);
    yPosition += 8;

    // Estimate notice — shown when any deadline is flagged as an estimate (unmapped state)
    const hasEstimateDeadlines = safe.deadlines.some(d => d.isEstimate);
    if (hasEstimateDeadlines) {
      checkPageBreak(25);
      doc.setFontSize(9);
      doc.setFont(FONT_NAME, 'bold');
      doc.setTextColor(180, 100, 0);
      const estimateLabel = isSpanish ? '⚠ Nota sobre plazos estimados' : '⚠ Note on estimated timeframes';
      doc.text(estimateLabel, margin, yPosition);
      yPosition += 5;
      doc.setFont(FONT_NAME, 'normal');
      const estimateNotice = isSpanish
        ? 'Estos plazos son estimados generales: los plazos exactos de su estado pueden variar. Verifique con sus documentos del tribunal o el sitio web del tribunal de su estado las fechas reales de su caso.'
        : "These timeframes are general estimates: your state's exact deadlines may differ. Check your court paperwork or your state court's website for the actual dates in your case.";
      yPosition = addText(estimateNotice, margin, yPosition);
      doc.setTextColor(0, 0, 0);
      yPosition += 6;
    }

    const deadlineData = safe.deadlines.map(deadline => [
      deadline.event,
      deadline.isEstimate ? `~${deadline.timeframe}` : deadline.timeframe,
      deadline.priority.toUpperCase(),
      deadline.description
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [[labels.event, labels.timeframe, labels.priority, labels.description]],
      body: deadlineData,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
      margin: { left: margin, right: margin },
      styles: { fontSize: 9, font: FONT_NAME },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 30 },
        2: { cellWidth: 25 },
        3: { cellWidth: 'auto' }
      }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;
  }

  // Your Rights
  if (safe.rights.length > 0) {
    checkPageBreak(30);
    doc.setFontSize(14);
    doc.setFont(FONT_NAME, 'bold');
    doc.setTextColor(0, 150, 0);
    doc.text(labels.yourRights, margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont(FONT_NAME, 'normal');
    doc.setTextColor(0, 0, 0);

    safe.rights.forEach((right) => {
      checkPageBreak();
      yPosition = addText(`• ${typeof right === 'string' ? right : String(right)}`, margin + 5, yPosition);
      yPosition += 3;
    });
    yPosition += 5;
  }

  // Next Steps
  if (safe.nextSteps.length > 0) {
    checkPageBreak(30);
    doc.setFontSize(14);
    doc.setFont(FONT_NAME, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(labels.nextSteps, margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont(FONT_NAME, 'normal');

    safe.nextSteps.forEach((step, idx) => {
      checkPageBreak();
      yPosition = addText(`${idx + 1}. ${stripMd(pl(typeof step === 'string' ? step : String(step)))}`, margin + 5, yPosition);
      yPosition += 3;
    });
    yPosition += 5;
  }

  // Evidence to Gather
  if (safe.evidenceToGather.length > 0) {
    checkPageBreak(30);
    doc.setFontSize(14);
    doc.setFont(FONT_NAME, 'bold');
    doc.text(labels.evidenceToGather, margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont(FONT_NAME, 'normal');

    safe.evidenceToGather.forEach((evidence) => {
      checkPageBreak();
      yPosition = addText(`   [ ] ${stripMd(typeof evidence === 'string' ? evidence : String(evidence))}`, margin + 5, yPosition);
      yPosition += 3;
    });
    yPosition += 5;
  }

  // Court Preparation & Warnings — combined section mirrors the dashboard UI
  const hasCourt = safe.courtPreparation.length > 0;
  const hasWarn  = safe.warnings.length > 0;
  if (hasCourt || hasWarn) {
    checkPageBreak(30);
    doc.setFontSize(14);
    doc.setFont(FONT_NAME, 'bold');
    doc.setTextColor(200, 100, 0);
    doc.text(`${labels.warnings} & ${labels.courtPrep}`, margin, yPosition);
    yPosition += 8;
    doc.setFontSize(10);
    doc.setFont(FONT_NAME, 'normal');
    doc.setTextColor(0, 0, 0);

    if (hasWarn) {
      safe.warnings.forEach((warning) => {
        checkPageBreak();
        yPosition = addText(`   * ${stripMd(typeof warning === 'string' ? warning : String(warning))}`, margin + 5, yPosition);
        yPosition += 3;
      });
      if (hasCourt) {
        yPosition += 3;
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 6;
      }
    }

    if (hasCourt) {
      safe.courtPreparation.forEach((item) => {
        checkPageBreak();
        yPosition = addText(`   [ ] ${stripMd(typeof item === 'string' ? item : String(item))}`, margin + 5, yPosition);
        yPosition += 3;
      });
    }
    yPosition += 5;
  }

  // Beyond the Sentence: What Else May Be at Risk — matches dashboard "CollateralConsequencesCard"
  if (safe.collateralConsequences.length > 0) {
    // Human-readable category labels matching the dashboard's categoryMeta
    const categoryLabels: Record<string, string> = {
      drivers_license: "Driver's License",
      immigration: 'Immigration Status',
      housing: 'Housing',
      employment: 'Employment & Licensing',
      custody: 'Child Custody',
      benefits: 'Public Benefits',
      firearms: 'Firearms Rights',
      registry: 'Sex Offender Registry',
      supervision_revocation: 'Probation / Parole',
      other: 'Other Consequence',
    };
    const categoryLabelsEs: Record<string, string> = {
      drivers_license: 'Licencia de Conducir',
      immigration: 'Estado Migratorio',
      housing: 'Vivienda',
      employment: 'Empleo y Licencias',
      custody: 'Custodia de Menores',
      benefits: 'Beneficios Públicos',
      firearms: 'Derecho a Portar Armas',
      registry: 'Registro de Ofensores Sexuales',
      supervision_revocation: 'Probatoria / Libertad Condicional',
      other: 'Otra Consecuencia',
    };
    const catLabel = (cat: string) =>
      isSpanish
        ? (categoryLabelsEs[cat] || cat)
        : (categoryLabels[cat] || cat);

    checkPageBreak(40);
    doc.setFontSize(14);
    doc.setFont(FONT_NAME, 'bold');
    doc.setTextColor(180, 90, 0);
    doc.text(
      isSpanish ? 'Más Allá de la Sentencia: Qué Más Puede Estar en Riesgo' : 'Beyond the Sentence: What Else May Be at Risk',
      margin, yPosition
    );
    yPosition += 6;

    doc.setFontSize(9);
    doc.setFont(FONT_NAME, isChinese ? 'normal' : 'italic');
    doc.setTextColor(100, 100, 100);
    yPosition = addText(
      isSpanish
        ? 'Estas consecuencias van más allá de la sentencia y a veces entran en vigor automáticamente. Informe a su abogado antes de cualquier declaración de culpabilidad.'
        : 'These consequences go beyond the sentence itself and often take effect automatically, sometimes upon a guilty plea. Raise each one with your attorney before any plea decision.',
      margin, yPosition
    );
    yPosition += 8;

    const collateralData = safe.collateralConsequences.map(item => [
      catLabel(item.category || 'other'),
      item.consequence || '',
      item.timing || '',
      item.actionNote || '',
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [[
        isSpanish ? 'Área' : 'Area',
        isSpanish ? 'Consecuencia' : 'Consequence',
        isSpanish ? 'Cuándo' : 'When',
        isSpanish ? 'Acción a Tomar' : 'Action to Take',
      ]],
      body: collateralData,
      theme: 'striped',
      headStyles: { fillColor: [180, 90, 0] },
      margin: { left: margin, right: margin },
      styles: { fontSize: 8, font: FONT_NAME },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 25 },
        3: { cellWidth: 45 },
      }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 5;
    doc.setFontSize(8);
    doc.setFont(FONT_NAME, isChinese ? 'normal' : 'italic');
    doc.setTextColor(120, 120, 120);
    yPosition = addText(
      isSpanish
        ? 'Estos riesgos varían por estado y cargo. Verifique con su abogado.'
        : 'These risks vary by state and charge. Verify with your attorney.',
      margin, yPosition
    );
    doc.setTextColor(0, 0, 0);
    yPosition += 10;
  }

  // Practice Q&A Section — matches dashboard position (before Actions to Avoid)
  if (safe.mockQA.length > 0) {
    checkPageBreak(60);
    doc.setFontSize(14);
    doc.setFont(FONT_NAME, 'bold');
    doc.setTextColor(41, 128, 185);
    doc.text(labels.practiceQA, margin, yPosition);
    yPosition += 6;
    
    doc.setFontSize(9);
    doc.setFont(FONT_NAME, isChinese ? 'normal' : 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text(labels.practiceQASubtitle, margin, yPosition);
    yPosition += 10;
    
    doc.setTextColor(0, 0, 0);
    
    safe.mockQA.forEach((qa, index) => {
      checkPageBreak(50);
      
      doc.setFontSize(11);
      doc.setFont(FONT_NAME, 'bold');
      yPosition = addText(`${index + 1}. ${qa.question}`, margin, yPosition);
      yPosition += 3;
      
      doc.setFontSize(10);
      doc.setFont(FONT_NAME, 'bold');
      doc.setTextColor(41, 128, 185);
      doc.text(labels.suggestedResponse + ':', margin + 5, yPosition);
      yPosition += 5;
      
      doc.setFont(FONT_NAME, 'normal');
      doc.setTextColor(0, 0, 0);
      yPosition = addText(`"${qa.suggestedResponse}"`, margin + 10, yPosition);
      yPosition += 3;
      
      doc.setFontSize(9);
      doc.setFont(FONT_NAME, isChinese ? 'normal' : 'italic');
      doc.setTextColor(80, 80, 80);
      yPosition = addText(qa.explanation, margin + 10, yPosition);
      yPosition += 8;
      
      doc.setTextColor(0, 0, 0);
    });
    
    yPosition += 5;
  }

  // Actions to Avoid — matches dashboard position (after Practice Q&A)
  if (safe.avoidActions.length > 0) {
    checkPageBreak(30);
    doc.setFontSize(14);
    doc.setFont(FONT_NAME, 'bold');
    doc.setTextColor(200, 0, 0);
    doc.text(labels.actionsToAvoid, margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont(FONT_NAME, 'normal');
    doc.setTextColor(0, 0, 0);

    safe.avoidActions.forEach((action) => {
      checkPageBreak();
      yPosition = addText(`   - ${typeof action === 'string' ? action : String(action)}`, margin + 5, yPosition);
      yPosition += 3;
    });
    yPosition += 5;
  }

  // Areas of Uncertainty — matches dashboard section
  if (safe.uncertainties.length > 0) {
    checkPageBreak(30);
    doc.setFontSize(14);
    doc.setFont(FONT_NAME, 'bold');
    doc.setTextColor(180, 140, 0);
    doc.text(isSpanish ? 'Áreas de Incertidumbre' : 'Areas of Uncertainty', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont(FONT_NAME, 'normal');
    doc.setTextColor(0, 0, 0);

    safe.uncertainties.forEach((item) => {
      checkPageBreak(20);
      doc.setFont(FONT_NAME, 'bold');
      yPosition = addText(item.area || '', margin + 5, yPosition);
      yPosition += 1;
      doc.setFont(FONT_NAME, 'normal');
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      yPosition = addText(item.note || '', margin + 8, yPosition);
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      yPosition += 5;
    });

    doc.setFontSize(8);
    doc.setFont(FONT_NAME, isChinese ? 'normal' : 'italic');
    doc.setTextColor(120, 120, 120);
    yPosition = addText(
      isSpanish
        ? 'Estas áreas no pudieron confirmarse para su jurisdicción específica. Verifique con un abogado antes de actuar.'
        : 'These areas could not be confirmed for your specific jurisdiction. Verify with a licensed attorney before relying on them.',
      margin, yPosition
    );
    doc.setTextColor(0, 0, 0);
    yPosition += 8;
  }

  // Resources
  if (safe.resources.length > 0) {
    checkPageBreak(40);
    doc.setFontSize(14);
    doc.setFont(FONT_NAME, 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(labels.resources, margin, yPosition);
    yPosition += 8;

    const resourceData = safe.resources.map(resource => [
      resource.type || '',
      resource.description || '',
      resource.contact || '',
      resource.hours || labels.na,
      resource.website || labels.na
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [[labels.type, labels.description, labels.contact, labels.hours, labels.website]],
      body: resourceData,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
      margin: { left: margin, right: margin },
      styles: { fontSize: 8, font: FONT_NAME },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 35 },
        3: { cellWidth: 25 },
        4: { cellWidth: 30 }
      }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;
  }

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      labels.footer,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
    doc.text(
      `${labels.page} ${i} ${labels.of} ${pageCount}`,
      pageWidth - margin,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'right' }
    );
  }

  // Generate filename with jurisdiction and date
  const dateStr = new Date().toISOString().split('T')[0];
  const jurisdiction = (caseData.jurisdiction || 'Unknown').replace(/\s+/g, '-');
  const filename = `Case-Guidance-${jurisdiction}-${dateStr}.pdf`;

  // Trigger download via blob URL — more reliable than doc.save() in sandboxed iframe contexts.
  // jsPDF's built-in save() uses the same approach but can be silently blocked in some browsers.
  const pdfBlob = doc.output('blob');
  const downloadUrl = URL.createObjectURL(pdfBlob);
  const downloadLink = document.createElement('a');
  downloadLink.href = downloadUrl;
  downloadLink.setAttribute('download', filename);
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  // Revoke after a short delay to ensure the browser has processed the click
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
}
