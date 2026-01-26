/**
 * DOCX Generator Service
 *
 * Generates Word documents (.docx) from generated document sections.
 * Handles court document formatting requirements including line numbers for California.
 */

import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  PageNumber,
  NumberFormat,
  Footer,
  Header,
  Tab,
  TabStopPosition,
  TabStopType,
  BorderStyle,
  Packer,
} from "docx";
import type { GeneratedDocument, GeneratedSection } from "./document-generator";
import { devLog, errLog } from "../../utils/dev-logger";

// ============================================================================
// Types
// ============================================================================

export interface DocxOptions {
  includeLineNumbers?: boolean;
  fontFamily?: string;
  fontSize?: number;
  lineSpacing?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
}

const DEFAULT_OPTIONS: Required<DocxOptions> = {
  includeLineNumbers: false,
  fontFamily: "Times New Roman",
  fontSize: 24, // 12pt in half-points
  lineSpacing: 480, // Double spacing in twips (1/20 of a point)
  marginTop: 1440, // 1 inch in twips
  marginBottom: 1440,
  marginLeft: 1440,
  marginRight: 1440,
};

// California-specific options
const CALIFORNIA_OPTIONS: Required<DocxOptions> = {
  ...DEFAULT_OPTIONS,
  includeLineNumbers: true,
};

// ============================================================================
// Document Generation
// ============================================================================

/**
 * Generate a DOCX file from a generated document
 */
export async function generateDocx(
  document: GeneratedDocument,
  formData: Record<string, string>,
  options?: DocxOptions
): Promise<Buffer> {
  const opts = {
    ...DEFAULT_OPTIONS,
    ...(document.jurisdiction === "CA" ? CALIFORNIA_OPTIONS : {}),
    ...options,
  };

  devLog(`[DOCX] Generating document for ${document.templateId} (${document.jurisdiction})`);

  try {
    const doc = new Document({
      creator: "Public Defender AI",
      title: document.templateName,
      description: `Generated ${document.templateName} for ${document.jurisdiction}`,
      styles: {
        default: {
          document: {
            run: {
              font: opts.fontFamily,
              size: opts.fontSize,
            },
            paragraph: {
              spacing: {
                line: opts.lineSpacing,
              },
            },
          },
        },
        paragraphStyles: [
          {
            id: "Title",
            name: "Title",
            basedOn: "Normal",
            next: "Normal",
            run: {
              font: opts.fontFamily,
              size: 28, // 14pt
              bold: true,
            },
            paragraph: {
              alignment: AlignmentType.CENTER,
              spacing: { after: 240 },
            },
          },
          {
            id: "Heading1",
            name: "Heading 1",
            basedOn: "Normal",
            next: "Normal",
            run: {
              font: opts.fontFamily,
              size: opts.fontSize,
              bold: true,
              allCaps: true,
            },
            paragraph: {
              spacing: { before: 240, after: 120 },
            },
          },
          {
            id: "CaptionText",
            name: "Caption Text",
            basedOn: "Normal",
            run: {
              font: opts.fontFamily,
              size: opts.fontSize,
            },
            paragraph: {
              spacing: { line: 240 }, // Single spacing for caption
            },
          },
        ],
      },
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: opts.marginTop,
                bottom: opts.marginBottom,
                left: opts.marginLeft,
                right: opts.marginRight,
              },
            },
          },
          headers: {
            default: createHeader(),
          },
          footers: {
            default: createFooter(),
          },
          children: generateDocumentContent(document, formData, opts),
        },
      ],
    });

    // Generate buffer
    const buffer = await Packer.toBuffer(doc);
    devLog(`[DOCX] Generated document: ${buffer.length} bytes`);

    return buffer;
  } catch (error) {
    errLog("[DOCX] Failed to generate document:", error);
    throw error;
  }
}

/**
 * Create document header
 */
function createHeader(): Header {
  return new Header({
    children: [
      new Paragraph({
        children: [],
      }),
    ],
  });
}

/**
 * Create document footer with page numbers
 */
function createFooter(): Footer {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            children: [PageNumber.CURRENT],
          }),
        ],
      }),
    ],
  });
}

/**
 * Generate all document content
 */
function generateDocumentContent(
  document: GeneratedDocument,
  formData: Record<string, string>,
  options: Required<DocxOptions>
): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  for (const section of document.sections) {
    // Add section content based on type
    switch (section.id) {
      case "caption":
        paragraphs.push(...generateCaptionSection(formData, options));
        break;

      case "signatureBlock":
        paragraphs.push(...generateSignatureBlock(formData, options));
        break;

      case "certificateOfService":
        paragraphs.push(...generateCertificateOfService(section, options));
        break;

      default:
        if (section.type === "static" || section.type === "ai-generated") {
          paragraphs.push(...generateTextSection(section, options));
        } else if (section.type === "user-input") {
          // User input sections are typically embedded in the caption or other sections
          // Skip standalone rendering unless it has displayable content
          if (section.content && !["caption", "signatureBlock"].includes(section.id)) {
            paragraphs.push(...generateTextSection(section, options));
          }
        }
    }
  }

  return paragraphs;
}

/**
 * Generate court caption section
 */
function generateCaptionSection(
  formData: Record<string, string>,
  options: Required<DocxOptions>
): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  // Court name (centered, all caps)
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: (formData.courtName || "SUPERIOR COURT").toUpperCase(),
          bold: true,
          font: options.fontFamily,
          size: options.fontSize,
        }),
      ],
    })
  );

  // Department (if provided)
  if (formData.department) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: formData.department.toUpperCase(),
            font: options.fontFamily,
            size: options.fontSize,
          }),
        ],
      })
    );
  }

  // Spacing
  paragraphs.push(new Paragraph({ children: [] }));

  // Case caption box
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "THE PEOPLE OF THE STATE,",
          font: options.fontFamily,
          size: options.fontSize,
        }),
      ],
    })
  );

  paragraphs.push(
    new Paragraph({
      indent: { left: 1440 },
      children: [
        new TextRun({
          text: "Plaintiff,",
          font: options.fontFamily,
          size: options.fontSize,
        }),
      ],
    })
  );

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Case No.: ${formData.caseNumber || "_____________"}`,
          font: options.fontFamily,
          size: options.fontSize,
        }),
      ],
      tabStops: [
        {
          type: TabStopType.LEFT,
          position: 5760,
        },
      ],
    })
  );

  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "v.",
          font: options.fontFamily,
          size: options.fontSize,
        }),
      ],
    })
  );

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: (formData.defendantName || "_____________").toUpperCase() + ",",
          font: options.fontFamily,
          size: options.fontSize,
        }),
      ],
    })
  );

  paragraphs.push(
    new Paragraph({
      indent: { left: 1440 },
      children: [
        new TextRun({
          text: "Defendant.",
          font: options.fontFamily,
          size: options.fontSize,
        }),
      ],
    })
  );

  // Spacing
  paragraphs.push(new Paragraph({ children: [] }));

  // Document title
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "MOTION TO CONTINUE",
          bold: true,
          allCaps: true,
          font: options.fontFamily,
          size: options.fontSize,
        }),
      ],
    })
  );

  // Hearing info line
  if (formData.currentHearingDate) {
    const hearingType = formatHearingTypeForDocument(formData.hearingType);
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `[${hearingType} Scheduled: ${formData.currentHearingDate}${
              formData.currentHearingTime ? ` at ${formData.currentHearingTime}` : ""
            }]`,
            italics: true,
            font: options.fontFamily,
            size: options.fontSize - 2,
          }),
        ],
      })
    );
  }

  // Spacing before body
  paragraphs.push(new Paragraph({ children: [] }));
  paragraphs.push(new Paragraph({ children: [] }));

  return paragraphs;
}

/**
 * Generate a text section (static or AI-generated)
 */
function generateTextSection(
  section: GeneratedSection,
  options: Required<DocxOptions>
): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  // Section heading
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: section.name.toUpperCase(),
          bold: true,
          font: options.fontFamily,
          size: options.fontSize,
        }),
      ],
      spacing: { before: 240, after: 120 },
    })
  );

  // Section content - split by paragraphs
  const contentParagraphs = section.content.split(/\n\n+/);

  for (const content of contentParagraphs) {
    if (content.trim()) {
      // Handle lists (lines starting with numbers or bullets)
      const lines = content.split("\n");
      let isInList = false;

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        // Check if this is a list item
        const listMatch = trimmedLine.match(/^(\d+\.|[-•])\s*(.*)$/);

        if (listMatch) {
          isInList = true;
          paragraphs.push(
            new Paragraph({
              indent: { left: 720 },
              children: [
                new TextRun({
                  text: trimmedLine,
                  font: options.fontFamily,
                  size: options.fontSize,
                }),
              ],
            })
          );
        } else if (isInList && !listMatch) {
          // Continuation of list item
          paragraphs.push(
            new Paragraph({
              indent: { left: 720 },
              children: [
                new TextRun({
                  text: trimmedLine,
                  font: options.fontFamily,
                  size: options.fontSize,
                }),
              ],
            })
          );
        } else {
          isInList = false;
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: trimmedLine,
                  font: options.fontFamily,
                  size: options.fontSize,
                }),
              ],
              spacing: { after: 120 },
            })
          );
        }
      }
    }
  }

  return paragraphs;
}

/**
 * Generate signature block
 */
function generateSignatureBlock(
  formData: Record<string, string>,
  options: Required<DocxOptions>
): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  // Spacing before signature
  paragraphs.push(new Paragraph({ children: [] }));
  paragraphs.push(new Paragraph({ children: [] }));

  // Date line
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Dated: _______________",
          font: options.fontFamily,
          size: options.fontSize,
        }),
      ],
    })
  );

  // Spacing
  paragraphs.push(new Paragraph({ children: [] }));

  // Respectfully submitted
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [
        new TextRun({
          text: "Respectfully submitted,",
          font: options.fontFamily,
          size: options.fontSize,
        }),
      ],
    })
  );

  // Spacing for signature
  paragraphs.push(new Paragraph({ children: [] }));
  paragraphs.push(new Paragraph({ children: [] }));

  // Signature line
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [
        new TextRun({
          text: "_________________________________",
          font: options.fontFamily,
          size: options.fontSize,
        }),
      ],
    })
  );

  // Attorney name
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [
        new TextRun({
          text: formData.attorneyName || "[Attorney Name]",
          font: options.fontFamily,
          size: options.fontSize,
        }),
      ],
    })
  );

  // Firm name (if provided)
  if (formData.firmName) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({
            text: formData.firmName,
            font: options.fontFamily,
            size: options.fontSize,
          }),
        ],
      })
    );
  }

  // Address
  if (formData.address) {
    const addressLines = formData.address.split("\n");
    for (const line of addressLines) {
      paragraphs.push(
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({
              text: line.trim(),
              font: options.fontFamily,
              size: options.fontSize,
            }),
          ],
        })
      );
    }
  }

  // Phone
  if (formData.phone) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({
            text: `Tel: ${formData.phone}`,
            font: options.fontFamily,
            size: options.fontSize,
          }),
        ],
      })
    );
  }

  // Email
  if (formData.email) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({
            text: `Email: ${formData.email}`,
            font: options.fontFamily,
            size: options.fontSize,
          }),
        ],
      })
    );
  }

  // Attorney for Defendant
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [
        new TextRun({
          text: `Attorney for Defendant ${(formData.defendantName || "").toUpperCase()}`,
          font: options.fontFamily,
          size: options.fontSize,
          italics: true,
        }),
      ],
    })
  );

  return paragraphs;
}

/**
 * Generate certificate of service section
 */
function generateCertificateOfService(
  section: GeneratedSection,
  options: Required<DocxOptions>
): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  // Page break before certificate
  paragraphs.push(
    new Paragraph({
      pageBreakBefore: true,
      children: [],
    })
  );

  // Title
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "PROOF OF SERVICE",
          bold: true,
          font: options.fontFamily,
          size: options.fontSize,
        }),
      ],
      spacing: { after: 240 },
    })
  );

  // Content paragraphs
  const contentLines = section.content.split("\n");

  for (const line of contentLines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      paragraphs.push(new Paragraph({ children: [] }));
      continue;
    }

    // Handle checkbox lines
    if (trimmedLine.startsWith("[ ]") || trimmedLine.startsWith("[X]")) {
      paragraphs.push(
        new Paragraph({
          indent: { left: 720 },
          children: [
            new TextRun({
              text: trimmedLine,
              font: options.fontFamily,
              size: options.fontSize,
            }),
          ],
        })
      );
    } else if (trimmedLine.startsWith("[")) {
      // Bracketed instructions
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: trimmedLine,
              font: options.fontFamily,
              size: options.fontSize,
              italics: true,
            }),
          ],
        })
      );
    } else if (trimmedLine.startsWith("____")) {
      // Blank lines for filling in
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: trimmedLine,
              font: options.fontFamily,
              size: options.fontSize,
            }),
          ],
        })
      );
    } else {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: trimmedLine,
              font: options.fontFamily,
              size: options.fontSize,
            }),
          ],
        })
      );
    }
  }

  return paragraphs;
}

/**
 * Format hearing type for document display
 */
function formatHearingTypeForDocument(hearingType: string): string {
  const types: Record<string, string> = {
    arraignment: "Arraignment",
    preliminary: "Preliminary Hearing",
    pretrial: "Pre-Trial Conference",
    motions: "Motion Hearing",
    trial: "Trial",
    sentencing: "Sentencing",
    probation: "Probation Violation Hearing",
    other: "Hearing",
  };

  return types[hearingType] || "Hearing";
}
