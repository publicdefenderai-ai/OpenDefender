/**
 * DOCX Generator Service
 *
 * Generates Word documents (.docx) from generated document sections.
 * Uses centralized CourtFormattingRules from formatting-rules.ts
 * to drive all court-specific formatting decisions.
 */

import {
  Document,
  Paragraph,
  TextRun,
  AlignmentType,
  PageNumber,
  Footer,
  Header,
  TabStopType,
  BorderStyle,
  Packer,
} from "docx";
import type { GeneratedDocument, GeneratedSection } from "./document-generator";
import { resolveFormattingRules, type CourtFormattingRules } from "./formatting-rules";
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
  // Resolve formatting rules from the centralized registry
  const rules = resolveFormattingRules(
    document.jurisdiction,
    document.courtType || "state",
    document.district
  );

  // Build opts from rules, with optional user overrides
  const opts: Required<DocxOptions> = {
    includeLineNumbers: options?.includeLineNumbers ?? rules.includeLineNumbers,
    fontFamily: options?.fontFamily ?? rules.fontFamily,
    fontSize: options?.fontSize ?? rules.fontSize,
    lineSpacing: options?.lineSpacing ?? rules.lineSpacing,
    marginTop: options?.marginTop ?? rules.marginTop,
    marginBottom: options?.marginBottom ?? rules.marginBottom,
    marginLeft: options?.marginLeft ?? rules.marginLeft,
    marginRight: options?.marginRight ?? rules.marginRight,
  };

  devLog(`[DOCX] Generating document for ${document.templateId} (${document.jurisdiction}, ${rules.ruleSource})`);

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
              color: rules.fontColor,
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
            // Line numbers driven by rules
            ...(rules.includeLineNumbers && opts.includeLineNumbers
              ? {
                  lineNumbers: {
                    countBy: 1,
                    restart: rules.lineNumberRestart as "newPage" | "continuous",
                  },
                }
              : {}),
          },
          headers: {
            default: createHeader(),
          },
          footers: {
            default: createFooter(rules, document.templateName),
          },
          children: generateDocumentContent(document, formData, opts, rules),
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
 * Create document footer based on formatting rules.
 * CRC 2.110: footer must include document title (>= 10pt) with separator line.
 */
function createFooter(rules: CourtFormattingRules, documentTitle: string): Footer {
  const children: Paragraph[] = [];

  // Separator line above footer (CRC 2.110)
  if (rules.footer.includeSeparatorLine) {
    children.push(
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

  // Document title in footer (CRC 2.110)
  if (rules.footer.includeDocumentTitle) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({
            text: documentTitle.toUpperCase(),
            font: rules.fontFamily,
            size: rules.footer.documentTitleFontSize,
          }),
        ],
      })
    );
  }

  // Page number
  if (rules.footer.includePageNumber) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            children: [PageNumber.CURRENT],
          }),
        ],
      })
    );
  }

  // Fallback: ensure footer has at least one paragraph
  if (children.length === 0) {
    children.push(new Paragraph({ children: [] }));
  }

  return new Footer({ children });
}

/**
 * Generate all document content
 */
function generateDocumentContent(
  document: GeneratedDocument,
  formData: Record<string, string>,
  options: Required<DocxOptions>,
  rules: CourtFormattingRules
): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  // Add attorney header block when rules require it (CA state + CACD federal)
  if (rules.includeAttorneyHeader) {
    paragraphs.push(...generateAttorneyHeader(formData, options));
  }

  for (const section of document.sections) {
    // Add section content based on type
    switch (section.id) {
      case "caption":
        paragraphs.push(...generateCaptionSection(formData, options, rules, document.templateName));
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
 * Generate attorney header block (lines 1-7).
 * Used by both CA state (CRC 2.111) and CACD federal (L.R. 11-3.8).
 */
function generateAttorneyHeader(
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

  // Blank line before court title (line 8)
  paragraphs.push(new Paragraph({ children: [], spacing: { after: 120 } }));

  return paragraphs;
}

/**
 * Generate court caption section.
 * Uses rules for court title, subtitle, plaintiff label, and separator line.
 */
function generateCaptionSection(
  formData: Record<string, string>,
  options: Required<DocxOptions>,
  rules: CourtFormattingRules,
  templateName: string
): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  // Court title (centered, all caps) — from rules or user input
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: (formData.courtName || rules.courtTitle).toUpperCase(),
          bold: true,
          font: options.fontFamily,
          size: options.fontSize,
        }),
      ],
    })
  );

  // Court subtitle (county or district)
  // For state courts with county line: use formData.county if available, else rules default
  // For federal courts: always show district name from rules
  if (rules.includeCountyLine && !formData.courtName?.toLowerCase().includes("county")) {
    const effectiveCounty = formData.county === "other"
      ? formData.countyOther
      : formData.county;
    const countySubtitle = effectiveCounty
      ? `COUNTY OF ${effectiveCounty.toUpperCase()}`
      : (rules.courtSubtitle || "").toUpperCase();
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: countySubtitle,
            bold: true,
            font: options.fontFamily,
            size: options.fontSize,
          }),
        ],
      })
    );
  } else if (rules.courtSubtitle && !rules.includeCountyLine) {
    // Federal courts always show subtitle (district name)
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: rules.courtSubtitle.toUpperCase(),
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

  // Plaintiff label from rules
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: rules.plaintiffLabel,
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

  // Case number line - positioned to the right
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

  // Hearing date/time on right if attorney header is present (formatted courts)
  if (rules.includeAttorneyHeader && formData.currentHearingDate) {
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

  // Horizontal line separator (driven by rules)
  if (rules.includeSeparatorLine) {
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

  // Document title (from template name)
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: templateName.toUpperCase(),
          bold: true,
          font: options.fontFamily,
          size: options.fontSize,
        }),
      ],
    })
  );

  // Non-formatted courts show hearing info below title
  if (!rules.includeAttorneyHeader && formData.currentHearingDate) {
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
        const listMatch = trimmedLine.match(/^(\d+\.|[-\u2022])\s*(.*)$/);

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
