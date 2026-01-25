/**
 * Attorney Verification Page
 *
 * Page for attorneys to verify their bar membership before accessing document generation tools.
 */

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { VerificationForm } from "@/components/attorney/verification-form";
import { useAttorneySession } from "@/hooks/use-attorney-session";

export default function AttorneyVerify() {
  useScrollToTop();
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { isVerified, isLoading } = useAttorneySession();

  // Redirect if already verified
  useEffect(() => {
    if (!isLoading && isVerified) {
      setLocation("/attorney/documents");
    }
  }, [isVerified, isLoading, setLocation]);

  const handleVerificationSuccess = () => {
    setLocation("/attorney/documents");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-slate-100/50 to-slate-50 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
              {t("attorneyPortal.verify.title", "Attorney Verification")}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t(
                "attorney.verify.subtitle",
                "Please verify your bar membership to access document generation tools."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          {/* Back Link */}
          <Link href="/attorney">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("attorneyPortal.verify.backToPortal", "Back to Attorney Portal")}
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>
                {t("attorneyPortal.verify.formTitle", "Bar Membership Verification")}
              </CardTitle>
              <CardDescription>
                {t(
                  "attorney.verify.formDescription",
                  "Enter your bar association information and confirm the required attestations to continue."
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VerificationForm onSuccess={handleVerificationSuccess} />
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
