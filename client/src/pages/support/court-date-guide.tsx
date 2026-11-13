import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { ScanFirstPageFrame } from "@/components/layout/scan-first-page-frame";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import "./court-date-guide.css";

function GuideSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={id + "-heading"} className="court-date-section">
      <h2 id={id + "-heading"}>{title}</h2>
      <div>{children}</div>
    </section>
  );
}

export default function CourtDateGuide() {
  const { t } = useTranslation("translation", { keyPrefix: "courtDateGuide" });
  useScrollToTop();
  const jumps = ["confirm", "reminders", "transport", "day"];
  const bailProject = "https://bailproject.org";
  return (
    <ScanFirstPageFrame mainClassName="court-date-page">
      <header>
        <Link href="/support/court-logistics">{t("backToCourtLogistics")}</Link>
        <h1>{t("design.heading")} <span>{t("design.accent")}</span></h1>
        <p>{t("subtitle")}</p>
      </header>
      <nav className="court-date-jumps" aria-label={t("design.navigation")}>
        {jumps.map(key => <a key={key} href={"#dg-" + key}>{t("design." + key)}</a>)}
      </nav>
      <a className="court-date-urgent" href="#dg-missed">{t("design.missed")}</a>

      <GuideSection id="dg-why" title={t("sections.whyMatters.title")}>
        <p>{t("sections.whyMatters.body")}</p>
        <p className="court-date-warning">{t("sections.whyMatters.warrantNote")}</p>
      </GuideSection>
      <GuideSection id="dg-confirm" title={t("sections.confirmWriting.title")}>
        <p>{t("sections.confirmWriting.intro")}</p>
        <ol>{[1, 2, 3, 4].map(n => <li key={n}>{t("sections.confirmWriting.step" + n)}</li>)}</ol>
        <div className="court-date-paper">
          <h3>{t("sections.confirmWriting.saveTitle")}</h3>
          <ul>{["caseNumber", "courtroom", "judgeName", "time"].map(key =>
            <li key={key}>{t("sections.confirmWriting.saveItems." + key)}</li>)}</ul>
        </div>
      </GuideSection>
      <GuideSection id="dg-reminders" title={t("sections.reminders.title")}>
        <p>{t("sections.reminders.intro")}</p>
        <div className="court-date-strip">{["week", "days", "morning"].map(key =>
          <span key={key}>{t("design." + key)}</span>)}</div>
        <ul>{[1, 2, 3, 4].map(n => <li key={n}>{t("sections.reminders.tip" + n)}</li>)}</ul>
      </GuideSection>
      <GuideSection id="dg-services" title={t("sections.thirdParty.title")}>
        {["bailProject", "courtPortals", "pdOffice"].map(key => (
          <details key={key}>
            <summary>{t("sections.thirdParty." + key + ".name")}</summary>
            <p>{t("sections.thirdParty." + key + ".description")}</p>
            {key === "bailProject" && <a href={bailProject} target="_blank" rel="noopener noreferrer">{t("sections.thirdParty.bailProject.name")}</a>}
          </details>
        ))}
      </GuideSection>
      <GuideSection id="dg-transport" title={t("sections.transportation.title")}>
        <ul>
          <li><a href={bailProject} target="_blank" rel="noopener noreferrer">{t("sections.transportation.bailProject")}</a></li>
          <li>{t("sections.transportation.twoEleven")}</li>
          <li>{t("sections.transportation.pdOffice")}</li>
        </ul>
      </GuideSection>
      <GuideSection id="dg-day" title={t("sections.dayOf.title")}>
        <p>{t("sections.dayOf.intro")}</p>
        {[1, 2, 3, 4, 5, 6].map(n => <label key={n}><input type="checkbox" />{t("sections.dayOf.item" + n)}</label>)}
      </GuideSection>
      <GuideSection id="dg-missed" title={t("sections.missed.title")}>
        <p className="court-date-warning">{t("sections.missed.warning")}</p>
        <ol>{[1, 2, 3, 4].map(n => <li key={n}>{t("sections.missed.step" + n)}</li>)}</ol>
        <p>{t("sections.missed.disclaimer")}</p>
      </GuideSection>
      <nav className="court-date-links" aria-label={t("relatedTitle")}>
        <Link href="/support/court-logistics">{t("relatedLinks.courtLogistics")}</Link>
        <Link href="/support/transportation">{t("relatedLinks.transportation")}</Link>
        <Link href="/support/court-logistics/intake-form">{t("relatedLinks.intakeForm")}</Link>
      </nav>
    </ScanFirstPageFrame>
  );
}
