import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Folder, LogOut, Clock, Scale, Plane, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { VerificationGuard } from "@/components/attorney/verification-guard";
import { SessionTimer } from "@/components/attorney/session-timer";
import { useAttorneySession } from "@/hooks/use-attorney-session";
import { StagedTemplateList } from "@/components/attorney/template-card";
import { fetchTemplates, type DocumentTemplateSummary } from "@/lib/attorney-api";

function DocumentsContent() {
  useScrollToTop();
  const { t } = useTranslation();
  const { endSession } = useAttorneySession();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SessionTimer />

      <section className="relative py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-slate-50 to-blue-50 dark:from-blue-950/20 dark:via-slate-950 dark:to-blue-950/20" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
              {t("attorneyPortal.documents.title", "Document Generation")}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t(
                "attorney.documents.subtitle",
                "AI-powered document drafting for criminal and immigration matters."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Tabs defaultValue="criminal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="criminal" className="gap-2">
                <Scale className="h-4 w-4" />
                {t("attorneyPortal.documents.criminal", "Criminal")}
              </TabsTrigger>
              <TabsTrigger value="immigration" className="gap-2">
                <Plane className="h-4 w-4" />
                {t("attorneyPortal.documents.immigration", "Immigration")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="criminal" className="space-y-6">
              <CategoryTemplates category="criminal" />
            </TabsContent>

            <TabsContent value="immigration" className="space-y-6">
              <CategoryTemplates category="immigration" />
            </TabsContent>
          </Tabs>

          <div className="mt-12 pt-8 border-t">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  {t(
                    "attorney.documents.sessionNote",
                    "Your session will automatically end after 30 minutes of inactivity."
                  )}
                </span>
              </div>
              <Button
                variant="outline"
                onClick={endSession}
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:hover:bg-red-950"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t("attorneyPortal.documents.endSession", "End Session")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

interface CategoryTemplatesProps {
  category: "criminal" | "immigration";
}

function CategoryTemplates({ category }: CategoryTemplatesProps) {
  const { t } = useTranslation();
  const [templates, setTemplates] = useState<DocumentTemplateSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTemplates() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchTemplates(category);

        if (result.success && result.templates) {
          setTemplates(result.templates);
        } else {
          setError(result.error || "Failed to load templates");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load templates");
      } finally {
        setIsLoading(false);
      }
    }

    loadTemplates();
  }, [category]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-4" />
          <p className="text-muted-foreground">Loading templates...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (templates.length > 0) {
    return (
      <StagedTemplateList
        templates={templates}
        category={category}
      />
    );
  }

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <Folder className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold mb-2">
          {t("attorneyPortal.documents.comingSoonTitle", "Templates Coming Soon")}
        </h3>
        <p className="text-muted-foreground max-w-md">
          {category === "criminal"
            ? t(
                "attorney.documents.criminalComingSoon",
                "Additional criminal law templates are being developed."
              )
            : t(
                "attorney.documents.immigrationComingSoon",
                "Additional immigration templates are being developed."
              )}
        </p>
      </CardContent>
    </Card>
  );
}

export default function AttorneyDocuments() {
  return (
    <VerificationGuard>
      <DocumentsContent />
    </VerificationGuard>
  );
}
