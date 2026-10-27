import {
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { Link } from "wouter";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
    if (!urgentHelpOpen) return;
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

            {/* Just arrested */}
            {urgentSituation === "arrested" && (
              <div className="urgent-detail">
                <button onClick={() => setUrgentSituation(null)} className="urgent-back">
                  {t("home.urgentHelp.back")}
                </button>
                <Alert className="urgent-warning">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="urgent-warning-text">
                    <strong>{t("home.urgentHelp.arrestWarning")}</strong> {t("home.urgentHelp.arrestWarningText")}
                  </AlertDescription>
                </Alert>
                <div className="urgent-section">
                  <div>
                    <h3 tabIndex={-1}>{t("home.urgentHelp.immediateActions")}</h3>
                    <ol className="space-y-3">
                      {[
                        { title: t("home.urgentHelp.stayCalmTitle"), body: t("home.urgentHelp.stayCalmText") },
                        { title: t("home.urgentHelp.assertRightsTitle"), body: `${t("home.urgentHelp.assertRightsText1")} ${t("home.urgentHelp.assertRightsText2")}` },
                        { title: t("home.urgentHelp.noConsentTitle"), body: t("home.urgentHelp.noConsentText") },
                        { title: t("home.urgentHelp.publicDefenderTitle"), body: t("home.urgentHelp.publicDefenderText") },
                      ].map((step, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="urgent-step-number" aria-hidden="true">{i + 1}</span>
                          <div>
                            <h4 className="font-semibold text-sm">{step.title}</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">{step.body}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
                <div className="urgent-next">
                  <Link href="/first-24-hours" onClick={() => { setUrgentHelpOpen(false); setUrgentSituation(null); }}>
                    <div className="urgent-section">
                      <div>
                        <div className="flex items-start justify-between gap-1 mb-0.5">
                          <p className="text-xs font-semibold text-foreground">{t("home.urgentHelp.full24HourGuide")}</p>
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                        </div>
                        <p className="text-xs text-muted-foreground">{t("home.urgentHelp.full24HourGuideSub")}</p>
                      </div>
                    </div>
                  </Link>
                  <Link href="/first-24-hours#phone-call" onClick={() => { setUrgentHelpOpen(false); setUrgentSituation(null); }}>
                    <div className="urgent-section">
                      <div>
                        <div className="flex items-start justify-between gap-1 mb-0.5">
                          <p className="text-xs font-semibold text-foreground">{t("home.urgentHelp.jailPhoneCallGuide")}</p>
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                        </div>
                        <p className="text-xs text-muted-foreground">{t("home.urgentHelp.jailPhoneCallGuideSub")}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )}

            {/* Charged and released */}
            {urgentSituation === "charged" && (
              <div className="urgent-detail">
                <button onClick={() => setUrgentSituation(null)} className="urgent-back">
                  {t("home.urgentHelp.back")}
                </button>
                <div className="urgent-section">
                  <div>
                    <h3 tabIndex={-1}>{t("home.urgentHelp.chargedSectionTitle")}</h3>
                    <ol className="space-y-3">
                      {[
                        { title: t("home.urgentHelp.chargedStep1Title"), body: t("home.urgentHelp.chargedStep1Body") },
                        { title: t("home.urgentHelp.chargedStep2Title"), body: t("home.urgentHelp.chargedStep2Body") },
                        { title: t("home.urgentHelp.chargedStep3Title"), body: t("home.urgentHelp.chargedStep3Body") },
                        { title: t("home.urgentHelp.chargedStep4Title"), body: t("home.urgentHelp.chargedStep4Body") },
                      ].map((step, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="urgent-step-number" aria-hidden="true">{i + 1}</span>
                          <div>
                            <h4 className="font-semibold text-sm">{step.title}</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">{step.body}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
                <div className="urgent-next">
                  <Link href="/case-guidance" onClick={() => { setUrgentHelpOpen(false); setUrgentSituation(null); }}>
                    <div className="urgent-section">
                      <div>
                        <div className="flex items-start justify-between gap-1 mb-0.5">
                          <p className="text-xs font-semibold text-foreground">{t("home.urgentHelp.chargedLinkLabel")}</p>
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                        </div>
                        <p className="text-xs text-muted-foreground">{t("home.urgentHelp.chargedLinkSub")}</p>
                      </div>
                    </div>
                  </Link>
                  <Link href="/support/court-logistics/bail-preparation" onClick={() => { setUrgentHelpOpen(false); setUrgentSituation(null); }}>
                    <div className="urgent-section">
                      <div>
                        <div className="flex items-start justify-between gap-1 mb-0.5">
                          <p className="text-xs font-semibold text-foreground">Bail Preparation Checklist</p>
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                        </div>
                        <p className="text-xs text-muted-foreground">Gather documentation before the bail hearing</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )}

            {/* Helping family */}
            {urgentSituation === "family" && (
              <div className="urgent-detail">
                <button onClick={() => setUrgentSituation(null)} className="urgent-back">
                  {t("home.urgentHelp.back")}
                </button>
                <div className="urgent-section">
                  <div>
                    <h3 tabIndex={-1}>{t("home.urgentHelp.familySectionTitle")}</h3>
                    <ol className="space-y-3">
                      {[
                        { title: t("home.urgentHelp.familyStep1Title"), body: t("home.urgentHelp.familyStep1Body") },
                        { title: t("home.urgentHelp.familyStep2Title"), body: t("home.urgentHelp.familyStep2Body") },
                        { title: t("home.urgentHelp.familyStep3Title"), body: t("home.urgentHelp.familyStep3Body") },
                        { title: t("home.urgentHelp.familyStep4Title"), body: t("home.urgentHelp.familyStep4Body") },
                      ].map((step, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="urgent-step-number" aria-hidden="true">{i + 1}</span>
                          <div>
                            <h4 className="font-semibold text-sm">{step.title}</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">{step.body}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
                <div className="urgent-next">
                  <Link href="/friends-family" onClick={() => { setUrgentHelpOpen(false); setUrgentSituation(null); }}>
                    <div className="urgent-section">
                      <div>
                        <div className="flex items-start justify-between gap-1 mb-0.5">
                          <p className="text-xs font-semibold text-foreground">{t("home.urgentHelp.familyLink1Label")}</p>
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                        </div>
                        <p className="text-xs text-muted-foreground">{t("home.urgentHelp.familyLink1Sub")}</p>
                      </div>
                    </div>
                  </Link>
                  <Link href="/first-24-hours#phone-call" onClick={() => { setUrgentHelpOpen(false); setUrgentSituation(null); }}>
                    <div className="urgent-section">
                      <div>
                        <div className="flex items-start justify-between gap-1 mb-0.5">
                          <p className="text-xs font-semibold text-foreground">{t("home.urgentHelp.familyLink2Label")}</p>
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                        </div>
                        <p className="text-xs text-muted-foreground">{t("home.urgentHelp.familyLink2Sub")}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )}

          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
