import { useEffect, useState } from "react";
import { Link } from "wouter";
import "./documents.css";
import { Folder, LogOut, Clock, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      <div className="attorney-catalog" data-skip-content tabIndex={-1}>
      <div className="attorney-catalog-top">
        <Link href="/attorney">{t("attorneyPortal.verify.backToPortal", "Back to Attorney Portal")}</Link>
        <SessionTimer variant="inline" />
      </div>

      <header className="attorney-catalog-heading">
        <h1>
              {t("attorneyPortal.documents.title", "Document Drafting")}
            </h1>
        <p className="attorney-catalog-intro" lang="en">
              {t(
                "attorney.documents.subtitle",
                "AI-assisted drafting for criminal and immigration matters. Generates professionally structured starting drafts — always verify local rules and standing orders before filing."
              )}
            </p>
        <p className="attorney-catalog-notice" lang="en">
              Separate attorney filing drafts: these DOCX documents are not part of a defendant's Case Roadmap, chat guidance, PDF, or print plan.
            </p>
      </header>
      <section className="attorney-catalog-list">
        <div>
          <Tabs defaultValue="criminal" className="space-y-6">
            <TabsList className="attorney-catalog-tabs">
              <TabsTrigger value="criminal" className="gap-2">
                {t("attorneyPortal.documents.criminal", "Criminal")}
              </TabsTrigger>
              <TabsTrigger value="immigration" className="gap-2">
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
                <span lang="en">
                  {t(
                    "attorney.documents.sessionNote",
                    "Your session will automatically end after 1 hour of inactivity."
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

      </div>
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
      <Card className="attorney-catalog-state" role="status" lang="en">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-8 w-8 text-[var(--editorial-signal)] animate-spin mb-4" />
          <p className="text-muted-foreground">Loading templates...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="attorney-catalog-state" role="alert" lang="en">
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
    <Card className="attorney-catalog-state">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-[var(--editorial-paper-deep)] rounded-full flex items-center justify-center mb-4">
          <Folder className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">
          {t("attorneyPortal.documents.comingSoonTitle", "No Templates Found")}
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
