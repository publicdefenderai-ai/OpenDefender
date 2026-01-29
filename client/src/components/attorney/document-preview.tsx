/**
 * Document Preview Component
 *
 * Displays a styled preview of the generated document before download.
 */

import { motion } from "framer-motion";
import { FileText, Download, Printer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { GeneratedSection } from "@/lib/attorney-api";

interface DocumentPreviewProps {
  templateName: string;
  jurisdiction: string;
  courtType?: "state" | "federal";
  district?: string;
  sections: GeneratedSection[];
  formData: Record<string, string>;
  onDownload: () => void;
  isDownloading?: boolean;
}

export function DocumentPreview({
  templateName,
  jurisdiction,
  courtType,
  district,
  sections,
  formData,
  onDownload,
  isDownloading,
}: DocumentPreviewProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-lg">{templateName}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {formatCourtLabel(jurisdiction, courtType, district)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="hidden sm:flex"
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button
            size="sm"
            onClick={onDownload}
            disabled={isDownloading}
          >
            <Download className="h-4 w-4 mr-2" />
            {isDownloading ? "Downloading..." : "Download DOCX"}
          </Button>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6 max-w-[8.5in] mx-auto">
            {/* Document Preview styled like a legal document */}
            <div
              className="bg-white dark:bg-slate-950 shadow-lg rounded-lg p-8 space-y-6 font-serif"
              style={{ fontFamily: "Times New Roman, serif" }}
            >
              {/* Caption Section */}
              {sections.find((s) => s.id === "caption") && (
                <DocumentCaption formData={formData} courtType={courtType} district={district} />
              )}

              {/* Document Title */}
              <div className="text-center font-bold text-lg uppercase tracking-wide">
                {templateName.toUpperCase()}
              </div>

              {/* Hearing Info */}
              {formData.currentHearingDate && (
                <div className="text-center text-sm italic text-muted-foreground">
                  [{formatHearingType(formData.hearingType)} Scheduled:{" "}
                  {formatDate(formData.currentHearingDate)}
                  {formData.currentHearingTime && ` at ${formData.currentHearingTime}`}]
                </div>
              )}

              <Separator className="my-6" />

              {/* Document Sections */}
              {sections.map((section) => {
                // Skip caption and signature block - rendered separately
                if (["caption", "signatureBlock", "certificateOfService"].includes(section.id)) {
                  return null;
                }

                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    <h3 className="font-bold uppercase text-sm tracking-wider">
                      {section.name}
                    </h3>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {formatSectionContent(section.content)}
                    </div>
                  </motion.div>
                );
              })}

              {/* Signature Block */}
              <DocumentSignature formData={formData} />
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function DocumentCaption({ formData, courtType, district }: { formData: Record<string, string>; courtType?: "state" | "federal"; district?: string }) {
  const plaintiffLabel = courtType === "federal"
    ? "UNITED STATES OF AMERICA,"
    : "THE PEOPLE OF THE STATE,";

  return (
    <div className="text-center space-y-2">
      {/* Court Name */}
      <div className="font-bold uppercase">
        {formData.courtName || (courtType === "federal" ? "UNITED STATES DISTRICT COURT" : "SUPERIOR COURT")}
      </div>
      {courtType === "federal" && (
        <div className="font-bold uppercase">{getDistrictName(district)}</div>
      )}
      {courtType !== "federal" && formData.county && (
        <div className="font-bold uppercase">
          COUNTY OF {(formData.county === "other" ? formData.countyOther || "" : formData.county).toUpperCase()}
        </div>
      )}
      {formData.department && (
        <div className="uppercase">{formData.department}</div>
      )}

      {/* Case Caption */}
      <div className="mt-6 text-left">
        <div>{plaintiffLabel}</div>
        <div className="ml-8">Plaintiff,</div>
        <div className="flex justify-between">
          <span />
          <span>Case No.: {formData.caseNumber || "_______________"}</span>
        </div>
        <div className="text-center">v.</div>
        <div className="uppercase">{formData.defendantName || "_______________"},</div>
        <div className="ml-8">Defendant.</div>
      </div>
    </div>
  );
}

function DocumentSignature({ formData }: { formData: Record<string, string> }) {
  return (
    <div className="mt-12 space-y-4">
      <Separator />

      <div className="pt-4">
        <div>Dated: _______________</div>
      </div>

      <div className="text-right space-y-1 mt-8">
        <div>Respectfully submitted,</div>
        <div className="mt-8">_________________________________</div>
        <div>{formData.attorneyName || "[Attorney Name]"}</div>
        {formData.firmName && <div>{formData.firmName}</div>}
        {formData.address && (
          <div className="whitespace-pre-line text-sm">{formData.address}</div>
        )}
        {formData.phone && <div className="text-sm">Tel: {formData.phone}</div>}
        {formData.email && <div className="text-sm">Email: {formData.email}</div>}
        <div className="italic text-sm mt-2">
          Attorney for Defendant {(formData.defendantName || "").toUpperCase()}
        </div>
      </div>
    </div>
  );
}

function formatSectionContent(content: string): string {
  if (!content) return "";

  // Replace template variables that weren't filled
  return content.replace(/\{\{(\w+)\}\}/g, "_______________");
}

function getDistrictName(district?: string): string {
  const names: Record<string, string> = {
    CACD: "CENTRAL DISTRICT OF CALIFORNIA",
    NDCA: "NORTHERN DISTRICT OF CALIFORNIA",
    EDCA: "EASTERN DISTRICT OF CALIFORNIA",
    SDCA: "SOUTHERN DISTRICT OF CALIFORNIA",
  };
  return names[district || ""] || "DISTRICT OF CALIFORNIA";
}

function formatCourtLabel(jurisdiction: string, courtType?: "state" | "federal", district?: string): string {
  if (courtType === "federal" && district) {
    const districtLabels: Record<string, string> = {
      CACD: "C.D. Cal. Federal Format (14pt)",
      NDCA: "N.D. Cal. Federal Format (14pt)",
      EDCA: "E.D. Cal. Federal Format (12pt)",
      SDCA: "S.D. Cal. Federal Format (14pt)",
    };
    return districtLabels[district] || `${district} Federal Format`;
  }
  if (jurisdiction === "CA") {
    return "California State Format";
  }
  return "Standard Format";
}

function formatHearingType(value: string): string {
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

  return types[value] || "Hearing";
}

function formatDate(dateString: string): string {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

interface PreviewPlaceholderProps {
  message?: string;
}

export function PreviewPlaceholder({ message }: PreviewPlaceholderProps) {
  return (
    <Card className="h-full flex items-center justify-center">
      <CardContent className="text-center py-12">
        <FileText className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
        <p className="text-muted-foreground">
          {message || "Complete the form to generate a preview"}
        </p>
      </CardContent>
    </Card>
  );
}
