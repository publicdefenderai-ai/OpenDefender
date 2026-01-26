/**
 * Document Wizard Page
 *
 * Multi-step wizard for generating attorney documents.
 * Loads template based on URL parameter and guides user through form completion.
 */

import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Loader2, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { VerificationGuard } from "@/components/attorney/verification-guard";
import { SessionTimer } from "@/components/attorney/session-timer";
import { TemplateWizard } from "@/components/attorney/template-wizard";
import { fetchTemplate } from "@/lib/attorney-api";
import type { DocumentTemplate } from "@shared/templates/schema";

function DocumentWizardContent() {
  useScrollToTop();
  const { t } = useTranslation();
  const params = useParams<{ templateId: string }>();
  const [, setLocation] = useLocation();

  const [template, setTemplate] = useState<DocumentTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTemplate() {
      if (!params.templateId) {
        setError("No template specified");
        setIsLoading(false);
        return;
      }

      try {
        const result = await fetchTemplate(params.templateId);

        if (result.success && result.template) {
          setTemplate(result.template);
        } else {
          setError(result.error || "Template not found");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load template");
      } finally {
        setIsLoading(false);
      }
    }

    loadTemplate();
  }, [params.templateId]);

  const handleComplete = () => {
    setLocation("/attorney/documents");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <SessionTimer />

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                <p className="text-muted-foreground">Loading template...</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <SessionTimer />

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error || "Template not found"}
              </AlertDescription>
            </Alert>

            <div className="mt-6">
              <Link href="/attorney/documents">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Documents
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SessionTimer />

      {/* Hero Section */}
      <section className="relative py-8 md:py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-slate-50 to-blue-50 dark:from-blue-950/20 dark:via-slate-950 dark:to-blue-950/20" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Back Link */}
            <Link href="/attorney/documents">
              <Button variant="ghost" size="sm" className="mb-4 -ml-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Documents
              </Button>
            </Link>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {template.name}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {template.description}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Wizard Content */}
      <section className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <TemplateWizard template={template} onComplete={handleComplete} />
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function DocumentWizard() {
  return (
    <VerificationGuard>
      <DocumentWizardContent />
    </VerificationGuard>
  );
}
