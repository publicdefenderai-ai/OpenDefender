import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DisclosureNotice } from "@/components/legal/disclosure-notice";
import { UrgentGuidance, type UrgentSituation } from "@/components/legal/urgent-guidance";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

const situations = ["arrested", "charged", "family"] as const;
const titles = { arrested: "urgentArrestTitle", charged: "urgentChargedTitle", family: "urgentFamilyTitle" };

export default function UrgentHelp({ situation }: { situation?: UrgentSituation }) {
  const { t } = useTranslation();
  useScrollToTop();
  return <div className="min-h-screen bg-background">
    <Header />
    <article className={`urgent-guide ${situation ? `urgent-guide-${situation}` : ""}`} aria-labelledby="urgent-guide-title">
      <div className="urgent-guide-top">
        <span><AlertTriangle aria-hidden="true" />{t("home.urgentHelp.modalTitle")}</span>
        <Link href={situation ? "/urgent-help" : "/"}>{t(situation ? "design.urgentAll" : "design.urgentHome")}</Link>
      </div>
      <h1 id="urgent-guide-title">{t(situation ? `design.${titles[situation]}` : "home.urgentHelp.triageLead")}</h1>
      {situation ? <>
        <p className="urgent-guide-intro">{t(`home.urgentHelp.scenario${situations.indexOf(situation) + 1}Sub`)}</p>
        <UrgentGuidance situation={situation} standalone />
      </> : <div className="urgent-choices">
        {situations.map((key, i) => <Link key={key} href={`/urgent-help/${key}`}>
          <span><strong>{t(`home.urgentHelp.scenario${i + 1}Label`)}</strong><small>{t(`home.urgentHelp.scenario${i + 1}Sub`)}</small></span><span aria-hidden="true">›</span>
        </Link>)}
        {[{ href: "/first-24-hours#step-before-arrest", n: 4 }, { href: "/immigration-guidance#rapid-response", n: 5 }].map(({href,n}) => <Link key={href} href={href}>
          <span><strong>{t(`home.urgentHelp.scenario${n}Label`)}</strong><small>{t(`home.urgentHelp.scenario${n}Sub`)}</small></span><span aria-hidden="true">›</span>
        </Link>)}
      </div>}
      <DisclosureNotice compact className="urgent-guide-disclosure" />
    </article>
    <Footer />
  </div>;
}
