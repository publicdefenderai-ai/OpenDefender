import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { getChargeExplanation } from "@shared/charge-explanations";

interface ImmediateAction {
  action: string;
  urgency: 'urgent' | 'high' | 'medium' | 'low';
}

interface EnhancedGuidanceData {
  sessionId: string;
  overview: string;
  criticalAlerts: string[];
  immediateActions: ImmediateAction[];
  nextSteps: string[];
  deadlines: Array<{
    event: string;
    timeframe: string;
    description: string;
    priority: 'critical' | 'important' | 'normal';
    daysFromNow?: number;
  }>;
  rights: string[];
  resources: Array<{
    type: string;
    description: string;
    contact: string;
    hours?: string;
    website?: string;
  }>;
  warnings: string[];
  evidenceToGather: string[];
  courtPreparation: string[];
  avoidActions: string[];
  timeline: Array<{
    stage: string;
    description: string;
    timeframe: string;
    completed: boolean;
  }>;
  chargeClassifications?: Array<{
    name: string;
    classification: string;
    code: string;
  }>;
  caseData: {
    jurisdiction: string;
    charges: string;
    caseStage: string;
    custodyStatus: string;
    hasAttorney: boolean;
  };
}

// Utility function to format charge names in plain English
const formatChargeName = (name: string): string => {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Generates a PDF document from legal guidance data.
 * All processing happens client-side - no data is sent to external servers.
 * 
 * @param guidance - The legal guidance data to export
 * @param language - The language for the PDF (en or es)
 */
export function generateGuidancePDF(guidance: EnhancedGuidanceData, language: string = 'en') {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let yPosition = 20;
  const isSpanish = language === 'es';

  // Localized labels
  const labels = isSpanish ? {
    title: 'Su Guía de Ayuda Legal',
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
    chargeDisclaimer: 'Recuerde: La fiscalía debe probar cada elemento de estos cargos más allá de una duda razonable. Su abogado puede ayudar a identificar qué elementos pueden ser cuestionados basándose en la evidencia.',
    immediateActions: 'Acciones Inmediatas (Próximas 48 Horas)',
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
    footer: 'Esto no es asesoría legal. Consulte con un abogado calificado para su situación específica.',
    page: 'Página',
    of: 'de',
    na: 'N/D',
    felonyFallback: 'Este es un cargo de delito mayor, que es un delito penal más grave. Los delitos mayores pueden llevar penas significativas incluyendo tiempo en prisión. Su abogado puede explicar los elementos específicos que la fiscalía debe probar.',
    misdemeanorFallback: 'Este es un cargo de delito menor, que generalmente es menos grave que un delito mayor. Los delitos menores aún pueden resultar en tiempo en la cárcel, multas y antecedentes penales. Su abogado puede explicar lo que la fiscalía necesita probar.',
    howDegreesDiffer: 'Cómo difieren los grados:',
    example: 'Ejemplo:',
  } : {
    title: 'Your Legal Help Guide',
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
    chargeDisclaimer: 'Remember: The prosecution must prove every element of these charges beyond a reasonable doubt. Your attorney can help identify which elements may be challenged based on the evidence.',
    immediateActions: 'Immediate Actions (Next 48 Hours)',
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
    footer: 'This is not legal advice. Consult with a qualified attorney for your specific situation.',
    page: 'Page',
    of: 'of',
    na: 'N/A',
    felonyFallback: 'This is a felony charge, which is a more serious criminal offense. Felonies can carry significant penalties including potential prison time. Your attorney can explain the specific elements the prosecution must prove.',
    misdemeanorFallback: 'This is a misdemeanor charge, which is generally less serious than a felony. Misdemeanors can still result in jail time, fines, and a criminal record. Your attorney can explain what the prosecution needs to prove.',
    howDegreesDiffer: 'How degrees differ:',
    example: 'Example:',
  };

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
  doc.setFont('helvetica', 'bold');
  doc.text(labels.title, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Subtitle - Date and Session
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
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
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(labels.caseInfo, margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const summaryData = [
    [labels.yourState, guidance.caseData.jurisdiction.toUpperCase()],
    [labels.processStage, guidance.caseData.caseStage],
    [labels.inJail, guidance.caseData.custodyStatus],
    [labels.hasLawyer, guidance.caseData.hasAttorney ? labels.yes : labels.no],
  ];

  if (guidance.chargeClassifications && guidance.chargeClassifications.length > 0) {
    guidance.chargeClassifications.forEach((charge, idx) => {
      summaryData.push([
        idx === 0 ? labels.charges : '',
        `${formatChargeName(charge.name)} (${charge.code}) - ${charge.classification.toUpperCase()}`
      ]);
    });
  } else {
    summaryData.push([labels.charges, guidance.caseData.charges]);
  }

  autoTable(doc, {
    startY: yPosition,
    head: [],
    body: summaryData,
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185] },
    margin: { left: margin, right: margin },
    styles: { fontSize: 10 },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 10;

  // Overview - appears first
  if (guidance.overview) {
    checkPageBreak(30);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 100, 200);
    doc.text(labels.overview, margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    yPosition = addText(guidance.overview, margin + 5, yPosition);
    yPosition += 10;
  }

  // Understanding Your Charges Section
  if (guidance.chargeClassifications && guidance.chargeClassifications.length > 0) {
    checkPageBreak(40);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 100, 200);
    doc.text(labels.understandingCharges, margin, yPosition);
    yPosition += 6;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    yPosition = addText(labels.chargesSubtitle, margin, yPosition);
    yPosition += 8;

    guidance.chargeClassifications.forEach((charge, chargeIdx) => {
      checkPageBreak(50);
      
      // Charge header with classification
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      const chargeHeader = `${formatChargeName(charge.name)} - ${charge.classification.toUpperCase()}`;
      doc.text(chargeHeader, margin, yPosition);
      yPosition += 8;

      // Get explanation for this charge
      const explanation = getChargeExplanation(charge.name);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);

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

      // Degree context if available
      if (explanation?.degreeContext) {
        checkPageBreak(25);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(80, 80, 80);
        yPosition = addText(`${labels.howDegreesDiffer} ${explanation.degreeContext}`, margin + 5, yPosition);
        yPosition += 6;
        doc.setTextColor(0, 0, 0);
      }

      // Key legal terms - cleaner formatting
      if (explanation?.keyTerms && explanation.keyTerms.length > 0) {
        checkPageBreak(30);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(labels.keyTerms, margin + 5, yPosition);
        yPosition += 8;

        explanation.keyTerms.forEach((term) => {
          checkPageBreak(25);
          
          // Term name on its own line
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0, 0, 0);
          doc.text(`${term.term}`, margin + 10, yPosition);
          yPosition += 6;
          
          // Definition on next line, indented
          doc.setFont('helvetica', 'normal');
          yPosition = addText(term.plainMeaning, margin + 15, yPosition);
          yPosition += 4;

          // Example on its own line
          if (term.example) {
            doc.setFontSize(9);
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(100, 100, 100);
            yPosition = addText(`${labels.example} ${term.example}`, margin + 15, yPosition);
            doc.setTextColor(0, 0, 0);
            yPosition += 4;
          }
          yPosition += 2;
        });
      }

      // Separator between charges
      if (chargeIdx < guidance.chargeClassifications!.length - 1) {
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
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    yPosition = addText(
      labels.chargeDisclaimer,
      margin,
      yPosition
    );
    doc.setTextColor(0, 0, 0);
    yPosition += 10;
  }

  // Immediate Actions
  if (guidance.immediateActions.length > 0) {
    checkPageBreak(30);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 100, 200);
    doc.text(labels.immediateActions, margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    guidance.immediateActions.forEach((actionItem, idx) => {
      checkPageBreak();
      const urgencyLabel = `[${actionItem.urgency.toUpperCase()}]`;
      yPosition = addText(`   [ ] ${urgencyLabel} ${actionItem.action}`, margin + 5, yPosition);
      yPosition += 3;
    });
    yPosition += 5;
  }

  // Deadlines
  if (guidance.deadlines.length > 0) {
    checkPageBreak(40);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(labels.importantDates, margin, yPosition);
    yPosition += 8;

    const deadlineData = guidance.deadlines.map(deadline => [
      deadline.event,
      deadline.timeframe,
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
      styles: { fontSize: 9 },
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
  if (guidance.rights.length > 0) {
    checkPageBreak(30);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 150, 0);
    doc.text(labels.yourRights, margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    guidance.rights.forEach((right, idx) => {
      checkPageBreak();
      yPosition = addText(`• ${right}`, margin + 5, yPosition);
      yPosition += 3;
    });
    yPosition += 5;
  }

  // Next Steps
  if (guidance.nextSteps.length > 0) {
    checkPageBreak(30);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(labels.nextSteps, margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    guidance.nextSteps.forEach((step, idx) => {
      checkPageBreak();
      yPosition = addText(`${idx + 1}. ${step}`, margin + 5, yPosition);
      yPosition += 3;
    });
    yPosition += 5;
  }

  // Evidence to Gather
  if (guidance.evidenceToGather.length > 0) {
    checkPageBreak(30);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(labels.evidenceToGather, margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    guidance.evidenceToGather.forEach((evidence, idx) => {
      checkPageBreak();
      yPosition = addText(`   [ ] ${evidence}`, margin + 5, yPosition);
      yPosition += 3;
    });
    yPosition += 5;
  }

  // Court Preparation
  if (guidance.courtPreparation.length > 0) {
    checkPageBreak(30);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(labels.courtPrep, margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    guidance.courtPreparation.forEach((item, idx) => {
      checkPageBreak();
      yPosition = addText(`   [ ] ${item}`, margin + 5, yPosition);
      yPosition += 3;
    });
    yPosition += 5;
  }

  // Things to Avoid
  if (guidance.avoidActions.length > 0) {
    checkPageBreak(30);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(200, 0, 0);
    doc.text(labels.actionsToAvoid, margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    guidance.avoidActions.forEach((action, idx) => {
      checkPageBreak();
      yPosition = addText(`   - ${action}`, margin + 5, yPosition);
      yPosition += 3;
    });
    yPosition += 5;
  }

  // Warnings
  if (guidance.warnings.length > 0) {
    checkPageBreak(30);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(200, 100, 0);
    doc.text(labels.warnings, margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    guidance.warnings.forEach((warning, idx) => {
      checkPageBreak();
      yPosition = addText(`   * ${warning}`, margin + 5, yPosition);
      yPosition += 3;
    });
    yPosition += 5;
  }

  // Resources
  if (guidance.resources.length > 0) {
    checkPageBreak(40);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(labels.resources, margin, yPosition);
    yPosition += 8;

    const resourceData = guidance.resources.map(resource => [
      resource.type,
      resource.description,
      resource.contact,
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
      styles: { fontSize: 8 },
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

  // Timeline
  if (guidance.timeline.length > 0) {
    checkPageBreak(40);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(labels.timeline, margin, yPosition);
    yPosition += 8;

    const timelineData = guidance.timeline.map(stage => [
      stage.completed ? '[X]' : '[ ]',
      stage.stage,
      stage.description,
      stage.timeframe
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [[labels.status, labels.stage, labels.description, labels.timeframe]],
      body: timelineData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      margin: { left: margin, right: margin },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' },
        1: { cellWidth: 35 },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 30 }
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
  const jurisdiction = guidance.caseData.jurisdiction.replace(/\s+/g, '-');
  const filename = `Legal-Guidance-${jurisdiction}-${dateStr}.pdf`;

  // Save the PDF (downloads to user's device)
  doc.save(filename);
}
