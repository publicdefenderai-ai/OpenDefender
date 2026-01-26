/**
 * DOCX Generator Service
 *
 * Generates Word documents (.docx) from generated document sections.
 * Follows California Rules of Court formatting requirements:
 * - CRC 2.104: Font not smaller than 12 points
 * - CRC 2.105: Font equivalent to Courier, Times New Roman, or Arial
 * - CRC 2.107: Margins at least 1 inch left, 0.5 inch right
 * - CRC 2.108: Double-spaced, line numbers at left margin (at least 3 per inch)
 * - CRC 2.111: First page format with attorney info, clerk space, court title
 *
 * Los Angeles Superior Court specific formatting applied for CA jurisdiction.
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
  Table,
  TableRow,
  TableCell,
  WidthType,
  VerticalAlign,
  convertInchesToTwip,
  LineNumberRestartType,
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

// Default options (generic jurisdictions)
const DEFAULT_OPTIONS: Required<DocxOptions> = {
  includeLineNumbers: false,
  fontFamily: "Times New Roman",
  fontSize: 24, // 12pt in half-points
  lineSpacing: 480, // Double spacing in twips (240 twips = 1 line, 480 = double)
  marginTop: 1440, // 1 inch in twips (1440 twips = 1 inch)
  marginBottom: 1440,
  marginLeft: 1440,
  marginRight: 1440,
};

// California / Los Angeles Superior Court specific options
// Per CRC 2.107: at least 1" left margin, 0.5" right
// Per CRC 2.108: line numbers required, at least 3 per vertical inch
const CALIFORNIA_OPTIONS: Required<DocxOptions> = {
  includeLineNumbers: true,
  fontFamily: "Times New Roman",
  fontSize: 24, // 12pt (CRC 2.104 minimum)
  lineSpacing: 480, // Double spacing (CRC 2.108)
  marginTop: 1440, // 1 inch
  marginBottom: 720, // 0.5 inch
  marginLeft: 1800, // 1.25 inch (extra space for line numbers)
  marginRight: 720, // 0.5 inch minimum per CRC 2.107
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
  const isCaliforniaFormat = document.jurisdiction === "CA";
  const opts = {
    ...DEFAULT_OPTIONS,
    ...(isCaliforniaFormat ? CALIFORNIA_OPTIONS : {}),
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
          {
            id: "AttorneyHeader",
            name: "Attorney Header",
            basedOn: "Normal",
            run: {
              font: opts.fontFamily,
              size: opts.fontSize,
            },
            paragraph: {
              spacing: { line: 240 }, // Single spacing for header block
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
            // California pleading paper has 28 lines per page with line numbers
            // Line numbers restart at 1 on each page per CRC 2.108
            ...(isCaliforniaFormat && opts.includeLineNumbers
              ? {
                  lineNumbers: {
                    countBy: 1,
                    restart: LineNumberRestartType.NEW_PAGE,
                  },
                }
              : {}),
          },
          headers: {
            default: createHeader(),
          },
          footers: {
            default: createFooter(),
          },
          children: generateDocumentContent(document, formData, opts, isCaliforniaFormat),
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
  options: Required<DocxOptions>,
  isCaliforniaFormat: boolean = false
): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  // For California format, add attorney header block first (CRC 2.111)
  if (isCaliforniaFormat) {
    paragraphs.push(...generateCaliforniaAttorneyHeader(formData, options));
  }

  for (const section of document.sections) {
    // Add section content based on type
    switch (section.id) {
      case "caption":
        paragraphs.push(...generateCaptionSection(formData, options, isCaliforniaFormat));
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
 * Generate California attorney header block per CRC 2.111
 * Lines 1-7: Attorney information on left, clerk's filing space on right
 */
function generateCaliforniaAttorneyHeader(
  formData: Record<string, string>,
  options: Required<DocxOptions>
): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  // Attorney name
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: formData.attorneyName || "[Attorney Name]",
          font: options.fontFamily,
          size: options.fontSize,
        }),
      ],
      spacing: { line: 240 }, // Single spacing for header
    })
  );

  // Firm name (if provided)
  if (formData.firmName) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: formData.firmName,
            font: options.fontFamily,
            size: options.fontSize,
          }),
        ],
        spacing: { line: 240 },
      })
    );
  }

  // Address lines
  if (formData.address) {
    const addressLines = formData.address.split("\n");
    for (const line of addressLines) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line.trim(),
              font: options.fontFamily,
              size: options.fontSize,
            }),
          ],
          spacing: { line: 240 },
        })
      );
    }
  }

  // Phone
  if (formData.phone) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Telephone: ${formData.phone}`,
            font: options.fontFamily,
            size: options.fontSize,
          }),
        ],
        spacing: { line: 240 },
      })
    );
  }

  // Email
  if (formData.email) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Email: ${formData.email}`,
            font: options.fontFamily,
            size: options.fontSize,
          }),
        ],
        spacing: { line: 240 },
      })
    );
  }

  // Attorney for Defendant line
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Attorney for Defendant ${(formData.defendantName || "").toUpperCase()}`,
          font: options.fontFamily,
          size: options.fontSize,
        }),
      ],
      spacing: { line: 240, after: 240 },
    })
  );

  // Blank line before court title (line 8 per CRC 2.111)
  paragraphs.push(new Paragraph({ children: [], spacing: { after: 120 } }));

  return paragraphs;
}

/**
 * Generate court caption section
 * California format includes case number on right side per CRC 2.111
 */
function generateCaptionSection(
  formData: Record<string, string>,
  options: Required<DocxOptions>,
  isCaliforniaFormat: boolean = false
): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  // Court name (centered, all caps)
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: (formData.courtName || "SUPERIOR COURT OF CALIFORNIA").toUpperCase(),
          bold: true,
          font: options.fontFamily,
          size: options.fontSize,
        }),
      ],
    })
  );

  // For California, add county if in court name or separately
  if (isCaliforniaFormat && !formData.courtName?.toLowerCase().includes("county")) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "COUNTY OF LOS ANGELES",
            bold: true,
            font: options.fontFamily,
            size: options.fontSize,
          }),
        ],
      })
    );
  }

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

  // California uses "THE PEOPLE OF THE STATE OF CALIFORNIA"
  const peopleText = isCaliforniaFormat
    ? "THE PEOPLE OF THE STATE OF CALIFORNIA,"
    : "THE PEOPLE OF THE STATE,";

  // Case caption - People v. Defendant format
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: peopleText,
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

  // Case number line - positioned to the right in California format
  paragraphs.push(
    new Paragraph({
      tabStops: [
        {
          type: TabStopType.RIGHT,
          position: 9360, // Right side of page
        },
      ],
      children: [
        new TextRun({
          text: "\t", // Tab to right
        }),
        new TextRun({
          text: `Case No.: ${formData.caseNumber || "_____________"}`,
          font: options.fontFamily,
          size: options.fontSize,
          bold: true,
        }),
      ],
    })
  );

  paragraphs.push(
    new Paragraph({
      indent: { left: 720 },
      children: [
        new TextRun({
          text: "vs.",
          font: options.fontFamily,
          size: options.fontSize,
        }),
      ],
    })
  );

  // Hearing date/time on right if California
  if (isCaliforniaFormat && formData.currentHearingDate) {
    const hearingType = formatHearingTypeForDocument(formData.hearingType);
    paragraphs.push(
      new Paragraph({
        tabStops: [
          {
            type: TabStopType.RIGHT,
            position: 9360,
          },
        ],
        children: [
          new TextRun({
            text: (formData.defendantName || "_____________").toUpperCase() + ",",
            font: options.fontFamily,
            size: options.fontSize,
          }),
          new TextRun({
            text: "\t",
          }),
          new TextRun({
            text: `${hearingType}: ${formData.currentHearingDate}`,
            font: options.fontFamily,
            size: options.fontSize - 2,
          }),
        ],
      })
    );

    if (formData.currentHearingTime) {
      paragraphs.push(
        new Paragraph({
          tabStops: [
            {
              type: TabStopType.RIGHT,
              position: 9360,
            },
          ],
          children: [
            new TextRun({
              text: "\t",
            }),
            new TextRun({
              text: `Time: ${formData.currentHearingTime}`,
              font: options.fontFamily,
              size: options.fontSize - 2,
            }),
          ],
        })
      );
    }

    if (formData.department) {
      paragraphs.push(
        new Paragraph({
          tabStops: [
            {
              type: TabStopType.RIGHT,
              position: 9360,
            },
          ],
          children: [
            new TextRun({
              text: "\t",
            }),
            new TextRun({
              text: `Dept: ${formData.department}`,
              font: options.fontFamily,
              size: options.fontSize - 2,
            }),
          ],
        })
      );
    }
  } else {
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
  }

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

  // Horizontal line separator (common in CA pleadings)
  if (isCaliforniaFormat) {
    paragraphs.push(
      new Paragraph({
        border: {
          bottom: {
            style: BorderStyle.SINGLE,
            size: 6,
            color: "000000",
          },
        },
        children: [],
      })
    );
  }

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

  // Non-California format shows hearing info below title
  if (!isCaliforniaFormat && formData.currentHearingDate) {
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
