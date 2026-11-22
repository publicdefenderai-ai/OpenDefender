/**
 * Attorney Verification Page
 *
 * Page for attorneys to verify their bar membership before accessing document generation tools.
 */

import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { VerificationForm } from "@/components/attorney/verification-form";
import { useAttorneySession } from "@/hooks/use-attorney-session";

import "./verify.css";

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
    <div className="attorney-access min-h-screen bg-background">
      <Header />
      <div className="attorney-access-width" data-skip-content tabIndex={-1}>
        <Link href="/attorney" className="attorney-access-back">
          <ArrowLeft size={17} aria-hidden="true" />
          {t("attorneyPortal.verify.backToPortal", "Back to Attorney Portal")}
        </Link>
        <section className="attorney-access-heading" aria-labelledby="attorney-access-title">
          <h1 id="attorney-access-title">{t("attorneyPortal.verify.title", "Attorney Verification")}</h1>
          <p>{t("attorneyPortal.verify.subtitle", "Please verify your bar membership to access document generation tools.")}</p>
        </section>
        <section className="attorney-access-workspace" aria-labelledby="attorney-access-form-title">
          <h2 id="attorney-access-form-title">{t("attorneyPortal.verify.formTitle", "Bar Membership Verification")}</h2>
          <p className="attorney-access-description">
            {t("attorneyPortal.verify.formDescription", "Confirm the required attestations to access attorney document tools.")}
          </p>
          <VerificationForm onSuccess={handleVerificationSuccess} />
        </section>
      </div>
      <Footer />
    </div>
  );
}
