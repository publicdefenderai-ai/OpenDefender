import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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
  doc.text('Your Legal Help Guide', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Subtitle - Date and Session
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  doc.text(`Generated: ${currentDate}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  // Privacy Notice
  doc.setFontSize(9);
  doc.setTextColor(150, 0, 0);
  yPosition = addText(
    'PRIVATE: This document has your personal legal information. Don\'t share it without talking to a lawyer first.',
    margin,
    yPosition
  );
  yPosition += 10;

  // Case Summary Section
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Your Case Information', margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const summaryData = [
    ['Your State', guidance.caseData.jurisdiction.toUpperCase()],
    ['Where You Are in the Process', guidance.caseData.caseStage],
    ['Are You in Jail', guidance.caseData.custodyStatus],
    ['Do You Have a Lawyer', guidance.caseData.hasAttorney ? 'Yes' : 'No'],
  ];

  if (guidance.chargeClassifications && guidance.chargeClassifications.length > 0) {
    guidance.chargeClassifications.forEach((charge, idx) => {
      summaryData.push([
        idx === 0 ? 'Charges' : '',
        `${formatChargeName(charge.name)} (${charge.code}) - ${charge.classification.toUpperCase()}`
      ]);
    });
  } else {
    summaryData.push(['Charges', guidance.caseData.charges]);
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

  // Overview
  if (guidance.overview) {
    checkPageBreak(30);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 100, 200);
    doc.text('Overview', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    yPosition = addText(guidance.overview, margin + 5, yPosition);
    yPosition += 10;
  }

  // Immediate Actions
  if (guidance.immediateActions.length > 0) {
    checkPageBreak(30);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 100, 200);
    doc.text('Immediate Actions (Next 48 Hours)', margin, yPosition);
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
    doc.text('Important Dates', margin, yPosition);
    yPosition += 8;

    const deadlineData = guidance.deadlines.map(deadline => [
      deadline.event,
      deadline.timeframe,
      deadline.priority.toUpperCase(),
      deadline.description
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Event', 'Timeframe', 'Priority', 'Description']],
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
    doc.text('Your Legal Rights', margin, yPosition);
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
    doc.text('Recommended Next Steps', margin, yPosition);
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
    doc.text('Evidence to Gather', margin, yPosition);
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
    doc.text('Court Preparation Checklist', margin, yPosition);
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
    doc.text('! Actions to Avoid', margin, yPosition);
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
    doc.text('Important Warnings', margin, yPosition);
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
    doc.text('Legal Resources & Contacts', margin, yPosition);
    yPosition += 8;

    const resourceData = guidance.resources.map(resource => [
      resource.type,
      resource.description,
      resource.contact,
      resource.hours || 'N/A',
      resource.website || 'N/A'
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Type', 'Description', 'Contact', 'Hours', 'Website']],
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
    doc.text('Case Timeline & Process', margin, yPosition);
    yPosition += 8;

    const timelineData = guidance.timeline.map(stage => [
      stage.completed ? '[X]' : '[ ]',
      stage.stage,
      stage.description,
      stage.timeframe
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Status', 'Stage', 'Description', 'Timeframe']],
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
      'This is not legal advice. Consult with a qualified attorney for your specific situation.',
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
    doc.text(
      `Page ${i} of ${pageCount}`,
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
