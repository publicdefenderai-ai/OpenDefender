/**
 * Template Wizard Component
 *
 * Multi-step form wizard for document generation.
 * Handles step navigation, form state, and document generation.
 */

import { useState, useMemo, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  AlertTriangle,
  BookOpen,
  ExternalLink,
  Zap,
  ClipboardCheck,
  ShieldAlert,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  TemplateFormSection,
  JurisdictionSelector,
  type JurisdictionSelection,
} from "./template-form-section";
import { AIGenerationStatus } from "./ai-generation-status";
import { DocumentPreview, PreviewPlaceholder } from "./document-preview";
import {
  generateDocument,
  exportDocument,
  downloadDocx,
  type GeneratedDocument,
} from "@/lib/attorney-api";
import { TurnstileCaptcha, useCaptcha } from "@/components/captcha/turnstile";
import { useAIAvailability } from "@/hooks/use-legal-data";
import { getLiveStatuteErrorKey } from "@/lib/live-statute-errors";
import type { DocumentTemplate, TemplateSection } from "@shared/templates/schema";
import { useTranslation } from "react-i18next";

interface TemplateWizardProps {
  template: DocumentTemplate;
  onComplete?: () => void;
}

type WizardStep = "jurisdiction" | "form" | "checklist" | "generate" | "preview";

interface LiveStatuteResult {
  success: boolean;
  statute?: {
    title: string;
    content: string;
    citation: string;
    jurisdiction: string;
    url?: string;
    section: string;
  };
  error?: string;
}

function StatuteLookupWidget() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [citationInput, setCitationInput] = useState('');
  const [activeCitation, setActiveCitation] = useState('');

  const { data: liveData, isLoading, error: liveError } = useQuery<LiveStatuteResult>({
    queryKey: [`/api/openlaws/citation/${encodeURIComponent(activeCitation)}`],
    enabled: !!activeCitation,
  });

  const handleLookup = () => {
    if (citationInput.trim()) {
      setActiveCitation(citationInput.trim());
    }
  };

  return (
    <div className="mt-6 rounded-lg border border-border bg-muted/20">
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/40 transition-colors rounded-lg"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          Statute Reference Tool
        </span>
        {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-3">
          <Separator />
          <p className="text-xs text-muted-foreground">
            Verify any citation before including it in your motion. Enter a citation to retrieve the live statute text.
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. Cal. Penal Code § 187"
              value={citationInput}
              onChange={(e) => setCitationInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
              className="text-sm h-8"
            />
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={handleLookup}
              disabled={!citationInput.trim()}
              className="h-8 shrink-0"
            >
              <Zap className="h-3.5 w-3.5 mr-1" />
              Verify
            </Button>
          </div>

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground py-1">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Looking up citation...
            </div>
          )}

          {!isLoading && (liveError || liveData?.error) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t(`statutes.errors.${getLiveStatuteErrorKey(liveError, liveData?.error)}`, {
                  citation: activeCitation,
                })}
              </AlertDescription>
            </Alert>
          )}

          {liveData && !isLoading && !liveError && !liveData.error && (
            liveData.success && liveData.statute ? (
              <div className="rounded-md border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20 p-3 space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-green-800 dark:text-green-300">
                      ✓ Citation verified
                    </p>
                    <p className="text-xs text-foreground font-medium mt-0.5">{liveData.statute.title}</p>
                    <p className="text-xs text-muted-foreground">{liveData.statute.citation}</p>
                  </div>
                  {liveData.statute.url && (
                    <a
                      href={liveData.statute.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 shrink-0"
                      aria-label="View on OpenLaws"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
                {liveData.statute.content && (
                  <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto font-mono bg-background rounded p-1.5 border border-border/50 mt-1">
                    {liveData.statute.content}
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-md border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-3">
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  ⚠ Citation not found for "{activeCitation}". Double-check the format or consult a primary source.
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export function TemplateWizard({ template, onComplete }: TemplateWizardProps) {
  const [step, setStep] = useState<WizardStep>("jurisdiction");
  const isImmigrationTemplate = template.supportedJurisdictions.includes("EOIR");
  const [jurisdictionSelection, setJurisdictionSelection] = useState<JurisdictionSelection>(
    isImmigrationTemplate
      ? { jurisdiction: "EOIR", courtType: "immigration" }
      : { jurisdiction: "generic" }
  );
  const [currentFormSectionIndex, setCurrentFormSectionIndex] = useState(0);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generatedDocument, setGeneratedDocument] = useState<GeneratedDocument | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const { token: captchaToken, setToken: setCaptchaToken, isRequired: captchaRequired } = useCaptcha();
  const { data: aiStatus } = useAIAvailability();
  const aiUnavailable = aiStatus && aiStatus.available === false;

  // Apply jurisdiction variant to get the correct sections (county dropdowns, placeholders, etc.)
  const activeSections = useMemo(() => {
    const { jurisdiction, courtType, district } = jurisdictionSelection;

    if (!jurisdiction || jurisdiction === "generic") {
      return template.baseSections;
    }

    // Find matching variant — most specific match first
    const variant = template.jurisdictionVariants?.find((v) => {
      if (v.jurisdiction.toUpperCase() !== jurisdiction.toUpperCase()) return false;
      if (courtType && v.courtType && v.courtType !== courtType) return false;
      if (district && v.district && v.district.toUpperCase() !== district.toUpperCase()) return false;
      if (courtType && !v.courtType) return false;
      if (district && !v.district) return false;
      return true;
    }) || template.jurisdictionVariants?.find(
      (v) => v.jurisdiction.toUpperCase() === jurisdiction.toUpperCase() && v.courtType === "state"
    );

    if (!variant) return template.baseSections;

    // Merge variant sections over base sections
    const sectionMap = new Map<string, TemplateSection>();
    for (const section of template.baseSections) {
      sectionMap.set(section.id, section);
    }
    for (const section of variant.sections) {
      sectionMap.set(section.id, section);
    }
    return Array.from(sectionMap.values()).sort((a, b) => a.order - b.order);
  }, [template, jurisdictionSelection]);

  // Get user-input sections for form steps
  const formSections = useMemo(() => {
    return activeSections.filter(
      (section) => section.type === "user-input"
    );
  }, [activeSections]);

  // Build validation schema from template inputs
  const formSchema = useMemo(() => {
    const schemaFields: Record<string, z.ZodType<any>> = {};

    for (const section of formSections) {
      if (section.inputs) {
        for (const input of section.inputs) {
          let fieldSchema: z.ZodType<any> = z.string();

          // Add validation based on input properties
          if (input.validation?.minLength) {
            fieldSchema = z.string().min(input.validation.minLength, {
              message: `Must be at least ${input.validation.minLength} characters`,
            });
          }

          if (input.validation?.maxLength) {
            fieldSchema = z.string().max(input.validation.maxLength, {
              message: `Must be no more than ${input.validation.maxLength} characters`,
            });
          }

          // Handle required vs optional
          if (!input.required) {
            fieldSchema = fieldSchema.optional().or(z.literal(""));
          }

          schemaFields[input.id] = fieldSchema;
        }
      }
    }

    return z.object(schemaFields);
  }, [formSections]);

  // Build default values from template inputs
  const defaultValues = useMemo(() => {
    const defaults: Record<string, string> = {};

    for (const section of formSections) {
      if (section.inputs) {
        for (const input of section.inputs) {
          defaults[input.id] = input.defaultValue || "";
        }
      }
    }

    return defaults;
  }, [formSections]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onBlur",
  });

  // Calculate total steps — criminal adds a "checklist" step before generate
  const checklistStepCount = isImmigrationTemplate ? 0 : 1;
  const totalSteps = 1 + formSections.length + checklistStepCount + 2; // jurisdiction + form sections + [checklist] + generate + preview
  const currentStepNumber =
    step === "jurisdiction"
      ? 1
      : step === "form"
      ? 2 + currentFormSectionIndex
      : step === "checklist"
      ? 1 + formSections.length + 1
      : step === "generate"
      ? 1 + formSections.length + checklistStepCount + 1
      : totalSteps;

  const progress = (currentStepNumber / totalSteps) * 100;

  // Navigation handlers
  const handleNext = useCallback(async () => {
    if (step === "jurisdiction") {
      setStep("form");
      setCurrentFormSectionIndex(0);
    } else if (step === "form") {
      // Validate current section fields
      const currentSection = formSections[currentFormSectionIndex];
      const fieldsToValidate = currentSection.inputs?.map((i) => i.id) || [];

      const isValid = await form.trigger(fieldsToValidate as any);

      if (isValid) {
        if (currentFormSectionIndex < formSections.length - 1) {
          setCurrentFormSectionIndex(currentFormSectionIndex + 1);
        } else {
          // Criminal templates go to checklist; immigration go directly to generate
          if (isImmigrationTemplate) {
            setStep("generate");
            handleGenerate();
          } else {
            setStep("checklist");
          }
        }
      }
    } else if (step === "checklist") {
      setStep("generate");
      handleGenerate();
    }
  }, [step, currentFormSectionIndex, formSections, form, isImmigrationTemplate]);

  const handleBack = useCallback(() => {
    if (step === "form" && currentFormSectionIndex > 0) {
      setCurrentFormSectionIndex(currentFormSectionIndex - 1);
    } else if (step === "form" && currentFormSectionIndex === 0) {
      setStep("jurisdiction");
    } else if (step === "checklist") {
      setStep("form");
      setCurrentFormSectionIndex(formSections.length - 1);
    } else if (step === "generate" || step === "preview") {
      if (isImmigrationTemplate) {
        setStep("form");
        setCurrentFormSectionIndex(formSections.length - 1);
      } else {
        setStep("checklist");
      }
    }
  }, [step, currentFormSectionIndex, formSections.length, isImmigrationTemplate]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationError(null);

    try {
      const formData = form.getValues();

      if (jurisdictionSelection.county) {
        formData.county = jurisdictionSelection.county;
        if (jurisdictionSelection.county === "other" && jurisdictionSelection.countyOther) {
          formData.countyOther = jurisdictionSelection.countyOther;
        }
      }
      if (jurisdictionSelection.division) {
        formData.department = jurisdictionSelection.division;
      }

      const result = await generateDocument({
        templateId: template.id,
        jurisdiction: jurisdictionSelection.jurisdiction,
        courtType: jurisdictionSelection.courtType,
        district: jurisdictionSelection.district,
        formData,
        captchaToken,
      });

      if (result.success && result.document) {
        setGeneratedDocument(result.document);
        setStep("preview");
      } else {
        setGenerationError(result.error || "Failed to generate document");
      }
    } catch (error: any) {
      setGenerationError(error.message || "An unexpected error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedDocument) return;

    setIsDownloading(true);

    try {
      const formData = form.getValues();
      const result = await exportDocument(generatedDocument.documentId, formData);

      if (result.success && result.blob && result.filename) {
        downloadDocx(result.blob, result.filename);
      } else {
        setGenerationError(result.error || "Failed to download document");
      }
    } catch (error: any) {
      setGenerationError(error.message || "Failed to download document");
    } finally {
      setIsDownloading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case "jurisdiction":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">
                {isImmigrationTemplate ? "Filing Court" : "Filing Context"}
              </h2>
              <p className="text-muted-foreground text-sm">
                {isImmigrationTemplate
                  ? "Immigration templates follow the EOIR Practice Manual, which is uniform nationwide."
                  : "Select the state and court type where you plan to file. This shapes the caption format and guides the AI on citation style — it does not substitute for verifying your court's specific local rules, standing orders, or formatting requirements."}
              </p>
            </div>
            {!isImmigrationTemplate && (
              <div className="flex items-start gap-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-3">
                <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                  <strong>Starting drafts only.</strong> Every court, district, and judge may have different local rules, page limits, and standing orders. You will confirm verification steps before generating your draft.
                </p>
              </div>
            )}
            <JurisdictionSelector
              value={jurisdictionSelection}
              onChange={setJurisdictionSelection}
              supportedJurisdictions={template.supportedJurisdictions}
            />
          </div>
        );

      case "form":
        const currentSection = formSections[currentFormSectionIndex];
        const isLastFormSection = currentFormSectionIndex === formSections.length - 1;
        return (
          <>
            <FormProvider {...form}>
              <form onSubmit={(e) => e.preventDefault()}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSection.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TemplateFormSection section={currentSection} jurisdictionContext={jurisdictionSelection} />
                    {isLastFormSection && (
                      <div className="mt-6">
                        <TurnstileCaptcha onVerify={setCaptchaToken} size="normal" />
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </form>
            </FormProvider>
            <StatuteLookupWidget />
          </>
        );

      case "checklist": {
        const isFederal = jurisdictionSelection.courtType === "federal";

        const checklistItems = [
          {
            id: "local_rules",
            label: "I have located and reviewed my court's local rules for this motion type.",
            link: isFederal
              ? { text: "Find federal local rules (PACER)", href: "https://www.pacer.gov/psco/cgi-bin/links.pl" }
              : { text: "Find state court rules (NCSC)", href: "https://www.ncsc.org/topics/court-management/court-technology/resource-guide" },
          },
          {
            id: "standing_orders",
            label: "I have checked the assigned judge's standing orders and individual practices.",
          },
          {
            id: "page_limits",
            label: "I have confirmed page/word limits and any briefing schedule requirements for this court.",
          },
          {
            id: "caption_format",
            label: "I have verified the caption format and case number format required by this specific court.",
          },
          {
            id: "service_rules",
            label: "I have confirmed the correct method of service and certificate-of-service requirements.",
          },
          {
            id: "draft_understanding",
            label: "I understand this is a professionally structured starting draft — I am responsible for all local-rule compliance before filing.",
          },
        ];

        const allChecked = checklistItems.every((item) => checkedItems[item.id]);

        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ClipboardCheck className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Pre-Filing Verification</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Before generating your draft, confirm you have completed these verification steps. Local rules vary by court and by individual judge — the AI cannot verify these for you.
              </p>
            </div>

            <div className="rounded-lg border border-border divide-y divide-border">
              {checklistItems.map((item) => (
                <label
                  key={item.id}
                  htmlFor={`check-${item.id}`}
                  className="flex items-start gap-3 p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                >
                  <Checkbox
                    id={`check-${item.id}`}
                    checked={!!checkedItems[item.id]}
                    onCheckedChange={(checked) =>
                      setCheckedItems((prev) => ({ ...prev, [item.id]: !!checked }))
                    }
                    className="mt-0.5 shrink-0"
                  />
                  <div className="space-y-1">
                    <span className="text-sm leading-snug">{item.label}</span>
                    {item.link && (
                      <a
                        href={item.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {item.link.text}
                      </a>
                    )}
                  </div>
                </label>
              ))}
            </div>

            {!allChecked && (
              <p className="text-xs text-muted-foreground italic">
                Check all items above to proceed.
              </p>
            )}

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={() => { setStep("generate"); handleGenerate(); }}
                disabled={!allChecked || !!aiUnavailable}
              >
                Generate Draft
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        );
      }

      case "generate":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Generating Draft</h2>
              <p className="text-muted-foreground">
                AI is generating the legal content for your draft document.
              </p>
            </div>
            <AIGenerationStatus
              isGenerating={isGenerating}
              currentSection="Good Cause Statement"
              totalSections={2}
              completedSections={0}
              error={generationError || undefined}
            />
            {generationError && (
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleBack}>
                  Go Back
                </Button>
                <Button onClick={handleGenerate}>
                  Try Again
                </Button>
              </div>
            )}
          </div>
        );

      case "preview":
        if (!generatedDocument) {
          return <PreviewPlaceholder message="Document not found" />;
        }
        return (
          <DocumentPreview
            templateName={generatedDocument.templateName}
            jurisdiction={jurisdictionSelection.jurisdiction}
            courtType={jurisdictionSelection.courtType}
            district={jurisdictionSelection.district}
            sections={generatedDocument.sections}
            formData={form.getValues()}
            onDownload={handleDownload}
            isDownloading={isDownloading}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Unavailable Banner */}
      {aiUnavailable && (
        <Alert className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            {aiStatus?.reason || 'AI features are temporarily unavailable due to high usage today. They will be restored at midnight UTC.'}
          </AlertDescription>
        </Alert>
      )}

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Step {currentStepNumber} of {totalSteps}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation Buttons — the checklist step renders its own inline buttons */}
      {step !== "generate" && step !== "preview" && step !== "checklist" && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === "jurisdiction"}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={
              !!aiUnavailable ||
              !!(step === "form" &&
              currentFormSectionIndex === formSections.length - 1 &&
              captchaRequired &&
              !captchaToken)
            }
          >
            {step === "form" && currentFormSectionIndex === formSections.length - 1 && isImmigrationTemplate
              ? "Generate Draft"
              : "Continue"}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Errors */}
      {generationError && step !== "generate" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{generationError}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
