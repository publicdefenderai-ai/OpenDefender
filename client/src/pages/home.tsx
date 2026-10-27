import {
  AlertTriangle,
} from "lucide-react";
import { Link } from "wouter";
import { UrgentGuidance } from "@/components/legal/urgent-guidance";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SiteSearch } from "@/components/search/site-search";
import { DisclosureNotice } from "@/components/legal/disclosure-notice";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

export default function Home() {
  useScrollToTop();
  const { t } = useTranslation();
  const [urgentHelpOpen, setUrgentHelpOpen] = useState(false);
  const [urgentSituation, setUrgentSituation] = useState<"arrested" | "charged" | "family" | null>(null);
  const urgentTrigger = useRef<HTMLButtonElement>(null);
  const urgentPanel = useRef<HTMLDivElement>(null);
  const previousSituation = useRef<typeof urgentSituation>(null);
  useEffect(() => {
    if (!urgentHelpOpen) { previousSituation.current = null; return; }
    if (urgentSituation) urgentPanel.current?.querySelector<HTMLElement>('h3')?.focus();
    else if (previousSituation.current) urgentPanel.current?.querySelector<HTMLElement>(`[data-situation="${previousSituation.current}"]`)?.focus();
    previousSituation.current = urgentSituation;
  }, [urgentSituation, urgentHelpOpen]);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleUrgentHelp = () => {
    setUrgentHelpOpen(true);
  };

  return (
    <div className="design-home min-h-screen bg-background">
      <Header />

      <section className="design-home-hero design-container">
        <p className="design-eyebrow">{t("design.eyebrow")}</p>
        <h1><span>{t("design.headline")}</span><em>{t("design.start")}</em></h1>
        <div className="design-open-door" aria-hidden="true" />
        <p className="design-intro">{t("design.intro")}</p>
        <div className="design-hero-actions">
          <div>
            <button ref={urgentTrigger} onClick={handleUrgentHelp} className="design-urgent-button" aria-describedby="urgent-context">
              <AlertTriangle aria-hidden="true" />{t("design.urgent")}
            </button>
            <p id="urgent-context">{t("design.urgentContext")}</p>
          </div>
          <Link href="/how-to" className="design-how-button">{t("design.how")}</Link>
        </div>
      </section>
      <section id="paths" className="design-container design-paths">
        <h2>{t("design.paths")}</h2>
        {[["arrest", "/first-24-hours"], ["case", "/case-guidance"], ["immigration", "/immigration-guidance"], ["support", "/support"]].map(([key, href], i) =>
          <Link key={key} href={href} className="design-path">
            <span className="design-path-number" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <span><strong>{t(`design.${key}`)}</strong><small>{t(`design.${key}Desc`)}</small></span>
            <span aria-hidden="true">›</span>
          </Link>)}
        <Link href="/directory" className="design-browse">{t("design.browse")}</Link>
        <DisclosureNotice compact className="design-disclosure" />
      </section>
      <SiteSearch open={searchOpen} onOpenChange={setSearchOpen} />
      <Footer />

      <Dialog open={urgentHelpOpen} onOpenChange={(open) => { setUrgentHelpOpen(open); if (!open) setUrgentSituation(null); }}>
        <DialogContent className="urgent-dialog" aria-describedby={undefined} onCloseAutoFocus={(event) => { event.preventDefault(); urgentTrigger.current?.focus(); }}>
          <div className="urgent-heading">
            <AlertTriangle aria-hidden="true" />
            <DialogTitle>{t("home.urgentHelp.modalTitle")}</DialogTitle>
          </div>

          {/* Body */}
          <div ref={urgentPanel} className="urgent-body">

            {/* Triage step */}
            {urgentSituation === null && (
              <>
                <p className="urgent-lead">{t("home.urgentHelp.triageLead")}</p>
                <div className="urgent-choices">
                  {(["arrested", "charged", "family"] as const).map((key, i) => (
                    <button key={key} data-situation={key} onClick={() => setUrgentSituation(key)}>
                      <span><strong>{t(`home.urgentHelp.scenario${i + 1}Label`)}</strong><small>{t(`home.urgentHelp.scenario${i + 1}Sub`)}</small></span>
                      <span aria-hidden="true">›</span>
                    </button>
                  ))}
                  {[
                    { href: "/first-24-hours#step-before-arrest", label: t("home.urgentHelp.scenario4Label"), sub: t("home.urgentHelp.scenario4Sub") },
                    { href: "/immigration-guidance#rapid-response", label: t("home.urgentHelp.scenario5Label"), sub: t("home.urgentHelp.scenario5Sub") },
                  ].map(s => (
                    <Link key={s.href} href={s.href} onClick={() => { setUrgentHelpOpen(false); setUrgentSituation(null); }}>
                      <span><strong>{s.label}</strong><small>{s.sub}</small></span><span aria-hidden="true">›</span>
                    </Link>
                  ))}
                </div>
              </>
            )}

            {urgentSituation && <>
              <UrgentGuidance situation={urgentSituation} onBack={() => setUrgentSituation(null)} onNavigate={() => { setUrgentHelpOpen(false); setUrgentSituation(null); }} />
              <Link className="urgent-full-page" href={`/urgent-help/${urgentSituation}`} onClick={() => { setUrgentHelpOpen(false); setUrgentSituation(null); }}>{t("design.urgentOpenPage")}</Link>
            </>}

          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
