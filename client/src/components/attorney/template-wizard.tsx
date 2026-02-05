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
  Loader2,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
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
import type { DocumentTemplate, TemplateSection } from "@shared/templates/schema";

interface TemplateWizardProps {
  template: DocumentTemplate;
  onComplete?: () => void;
}

type WizardStep = "jurisdiction" | "form" | "generate" | "preview";

export function TemplateWizard({ template, onComplete }: TemplateWizardProps) {
  const [step, setStep] = useState<WizardStep>("jurisdiction");
  const isImmigrationTemplate = template.supportedJurisdictions.includes("EOIR");
  const [jurisdictionSelection, setJurisdictionSelection] = useState<JurisdictionSelection>(
    isImmigrationTemplate
      ? { jurisdiction: "EOIR", courtType: "immigration" }
      : { jurisdiction: "generic" }
  );
  const [currentFormSectionIndex, setCurrentFormSectionIndex] = useState(0);
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

  // Calculate total steps
  const totalSteps = 1 + formSections.length + 2; // jurisdiction + form sections + generate + preview
  const currentStepNumber =
    step === "jurisdiction"
      ? 1
      : step === "form"
      ? 2 + currentFormSectionIndex
      : step === "generate"
      ? 2 + formSections.length
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
          setStep("generate");
          handleGenerate();
        }
      }
    }
  }, [step, currentFormSectionIndex, formSections, form]);

  const handleBack = useCallback(() => {
    if (step === "form" && currentFormSectionIndex > 0) {
      setCurrentFormSectionIndex(currentFormSectionIndex - 1);
    } else if (step === "form" && currentFormSectionIndex === 0) {
      setStep("jurisdiction");
    } else if (step === "generate" || step === "preview") {
      setStep("form");
      setCurrentFormSectionIndex(formSections.length - 1);
    }
  }, [step, currentFormSectionIndex, formSections.length]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationError(null);

    try {
      const formData = form.getValues();

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
              <h2 className="text-xl font-semibold mb-2">Select Jurisdiction</h2>
              <p className="text-muted-foreground">
                Choose the jurisdiction for this document. This determines the
                legal citations and formatting used.
              </p>
            </div>
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
                  <TemplateFormSection section={currentSection} />
                  {isLastFormSection && (
                    <div className="mt-6">
                      <TurnstileCaptcha onVerify={setCaptchaToken} size="normal" />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </form>
          </FormProvider>
        );

      case "generate":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Generating Document</h2>
              <p className="text-muted-foreground">
                AI is generating the legal content for your document.
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

      {/* Navigation Buttons */}
      {step !== "generate" && step !== "preview" && (
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
            {step === "form" && currentFormSectionIndex === formSections.length - 1
              ? "Generate Document"
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
