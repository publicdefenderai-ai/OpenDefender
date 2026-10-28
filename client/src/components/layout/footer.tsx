import { BrandLogo } from "@/components/brand-logo";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
  return <footer className="design-footer">
    <div className="design-footer-inner">
      <div className="design-footer-upper">
        <div className="design-footer-identity"><BrandLogo size="md" />
          <nav aria-label="Social links"><a href="https://github.com/publicdefenderai-ai/OpenDefender" target="_blank" rel="noopener noreferrer" data-testid="link-github">GitHub</a><a href="https://x.com/OpenDefenderAI" target="_blank" rel="noopener noreferrer">X</a></nav>
        </div>
        <span className="design-footer-languages">English · Español · 中文</span>
      </div>
      <p>{t("footer.legalDisclaimer")}</p>
      <div className="design-footer-bottom"><span>{t("footer.copyright")}</span>
        <nav aria-label="About and policies">
          <Link href="/mission-statement">{t("design.mission")}</Link>
          <Link href="/disclaimers">{t("footer.noticeDisclaimers")}</Link>
          <Link href="/privacy-policy">{t("design.privacy")}</Link>
          <Link href="/tech-docs">{t("design.developers")}</Link>
        </nav>
      </div>
    </div>
  </footer>;
}
