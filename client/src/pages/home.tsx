import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Scale,
  Users,
  Globe2,
  MessageSquare,
  Phone,
} from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
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
            <button onClick={handleUrgentHelp} className="design-urgent-button" aria-describedby="urgent-context">
              <AlertTriangle aria-hidden="true" />{t("design.urgent")}
            </button>
            <p id="urgent-context">{t("design.urgentContext")}</p>
          </div>
          <Link href="/how-to" className="design-how-button">{t("design.how")}</Link>
        </div>
        <DisclosureNotice compact className="design-disclosure" />
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
      </section>
      <SiteSearch open={searchOpen} onOpenChange={setSearchOpen} />
      <Footer />

      <Dialog open={urgentHelpOpen} onOpenChange={(open) => { setUrgentHelpOpen(open); if (!open) setUrgentSituation(null); }}>
        <DialogContent className="max-w-[95vw] md:max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0 [&>button:first-of-type]:text-white/80 [&>button:first-of-type]:hover:bg-white/20 [&>button:first-of-type]:focus:ring-white/40">

          {/* Command strip header — full bleed */}
          <div className="relative bg-gradient-to-br from-red-700 via-red-700 to-red-800 px-6 pt-6 pb-5 rounded-t-lg overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_hsl(0_100%_80%/0.15),_transparent_60%)] pointer-events-none" />
            <div className="relative flex items-center gap-3 pr-8">
              <div className="w-11 h-11 rounded-full bg-white/20 border border-white/30 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-red-200 mb-0.5">OpenDefender</p>
                <DialogTitle className="text-base font-bold text-white leading-snug">{t("home.urgentHelp.modalTitle")}</DialogTitle>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">

            {/* Triage step */}
            {urgentSituation === null && (
              <>
                <div>
                  <p className="text-[15px] font-bold text-foreground tracking-tight leading-snug">{t("home.urgentHelp.triageLead")}</p>
                  <div className="mt-1.5 h-0.5 w-10 rounded-full bg-red-500" />
                </div>
                <div className="space-y-3">
                  {/* Interactive scenario cards */}
                  {([
                    { key: "arrested" as const, icon: <AlertTriangle className="h-5 w-5 text-white" />, label: t("home.urgentHelp.scenario1Label"), sub: t("home.urgentHelp.scenario1Sub"), cardCls: "border-red-200 dark:border-red-900 hover:border-red-400 dark:hover:border-red-600", iconBg: "bg-red-600", hoverCls: "group-hover:text-red-700 dark:group-hover:text-red-300" },
                    { key: "charged" as const, icon: <Scale className="h-5 w-5 text-white" />, label: t("home.urgentHelp.scenario2Label"), sub: t("home.urgentHelp.scenario2Sub"), cardCls: "hover:border-amber-400 dark:hover:border-amber-600", iconBg: "bg-amber-600", hoverCls: "group-hover:text-amber-700 dark:group-hover:text-amber-300" },
                    { key: "family" as const, icon: <Users className="h-5 w-5 text-white" />, label: t("home.urgentHelp.scenario3Label"), sub: t("home.urgentHelp.scenario3Sub"), cardCls: "hover:border-blue-400 dark:hover:border-blue-600", iconBg: "bg-blue-600", hoverCls: "group-hover:text-blue-700 dark:group-hover:text-blue-300" },
                  ] as const).map((s, i) => (
                    <motion.div
                      key={s.key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.22, ease: "easeOut" }}
                    >
                      <button className="w-full text-left" onClick={() => setUrgentSituation(s.key)}>
                        <Card className={`hover:shadow-md transition-all cursor-pointer group ${s.cardCls}`}>
                          <CardContent className="p-4 flex items-center gap-3">
                            <div className={`w-9 h-9 ${s.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>{s.icon}</div>
                            <div className="flex-1 min-w-0">
                              <p className={`font-semibold text-sm text-foreground ${s.hoverCls}`}>{s.label}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground/40 flex-shrink-0 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all" />
                          </CardContent>
                        </Card>
                      </button>
                    </motion.div>
                  ))}

                  {/* Link-only scenario cards */}
                  {([
                    { href: "/first-24-hours#before-arrest", icon: <AlertTriangle className="h-5 w-5 text-white" />, label: t("home.urgentHelp.scenario4Label"), sub: t("home.urgentHelp.scenario4Sub"), cardCls: "border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500", iconBg: "bg-slate-600", hoverCls: "group-hover:text-slate-700 dark:group-hover:text-slate-300" },
                    { href: "/immigration-guidance#rapid-response", icon: <Phone className="h-5 w-5 text-white" />, label: t("home.urgentHelp.scenario5Label"), sub: t("home.urgentHelp.scenario5Sub"), cardCls: "border-orange-200 dark:border-orange-900 hover:border-orange-400 dark:hover:border-orange-600", iconBg: "bg-orange-600", hoverCls: "group-hover:text-orange-700 dark:group-hover:text-orange-300" },
                  ] as const).map((s, i) => (
                    <motion.div
                      key={s.href}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (3 + i) * 0.07, duration: 0.22, ease: "easeOut" }}
                    >
                      <Link href={s.href} onClick={() => { setUrgentHelpOpen(false); setUrgentSituation(null); }} className="block">
                        <Card className={`hover:shadow-md transition-all cursor-pointer group ${s.cardCls}`}>
                          <CardContent className="p-4 flex items-center gap-3">
                            <div className={`w-9 h-9 ${s.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>{s.icon}</div>
                            <div className="flex-1 min-w-0">
                              <p className={`font-semibold text-sm text-foreground ${s.hoverCls}`}>{s.label}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground/40 flex-shrink-0 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all" />
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {/* Just arrested */}
            {urgentSituation === "arrested" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, ease: "easeOut" }} className="space-y-4">
                <button onClick={() => setUrgentSituation(null)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                  {t("home.urgentHelp.back")}
                </button>
                <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800 dark:text-red-200">
                    <strong>{t("home.urgentHelp.arrestWarning")}</strong> {t("home.urgentHelp.arrestWarningText")}
                  </AlertDescription>
                </Alert>
                <Card className="border-l-4 border-l-red-500">
                  <CardContent className="p-5">
                    <h3 className="font-bold text-sm mb-3">{t("home.urgentHelp.immediateActions")}</h3>
                    <ol className="space-y-3">
                      {[
                        { title: t("home.urgentHelp.stayCalmTitle"), body: t("home.urgentHelp.stayCalmText") },
                        { title: t("home.urgentHelp.assertRightsTitle"), body: `${t("home.urgentHelp.assertRightsText1")} ${t("home.urgentHelp.assertRightsText2")}` },
                        { title: t("home.urgentHelp.noConsentTitle"), body: t("home.urgentHelp.noConsentText") },
                        { title: t("home.urgentHelp.publicDefenderTitle"), body: t("home.urgentHelp.publicDefenderText") },
                      ].map((step, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center mt-0.5 ring-2 ring-red-200 dark:ring-red-900">{i + 1}</span>
                          <div>
                            <h4 className="font-semibold text-sm">{step.title}</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">{step.body}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/first-24-hours" onClick={() => { setUrgentHelpOpen(false); setUrgentSituation(null); }}>
                    <Card className="hover:shadow-md hover:border-red-300 transition-all cursor-pointer h-full border-l-4 border-l-red-200 bg-red-50/30 dark:bg-red-950/10">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-1 mb-0.5">
                          <p className="text-xs font-semibold text-foreground">{t("home.urgentHelp.full24HourGuide")}</p>
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                        </div>
                        <p className="text-xs text-muted-foreground">{t("home.urgentHelp.full24HourGuideSub")}</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/first-24-hours#phone-call" onClick={() => { setUrgentHelpOpen(false); setUrgentSituation(null); }}>
                    <Card className="hover:shadow-md hover:border-red-300 transition-all cursor-pointer h-full border-l-4 border-l-red-200 bg-red-50/30 dark:bg-red-950/10">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-1 mb-0.5">
                          <p className="text-xs font-semibold text-foreground">{t("home.urgentHelp.jailPhoneCallGuide")}</p>
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                        </div>
                        <p className="text-xs text-muted-foreground">{t("home.urgentHelp.jailPhoneCallGuideSub")}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Charged and released */}
            {urgentSituation === "charged" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, ease: "easeOut" }} className="space-y-4">
                <button onClick={() => setUrgentSituation(null)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                  {t("home.urgentHelp.back")}
                </button>
                <Card className="border-l-4 border-l-amber-500">
                  <CardContent className="p-5">
                    <h3 className="font-bold text-sm mb-3">{t("home.urgentHelp.chargedSectionTitle")}</h3>
                    <ol className="space-y-3">
                      {[
                        { title: t("home.urgentHelp.chargedStep1Title"), body: t("home.urgentHelp.chargedStep1Body") },
                        { title: t("home.urgentHelp.chargedStep2Title"), body: t("home.urgentHelp.chargedStep2Body") },
                        { title: t("home.urgentHelp.chargedStep3Title"), body: t("home.urgentHelp.chargedStep3Body") },
                        { title: t("home.urgentHelp.chargedStep4Title"), body: t("home.urgentHelp.chargedStep4Body") },
                      ].map((step, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center mt-0.5 ring-2 ring-amber-200 dark:ring-amber-900">{i + 1}</span>
                          <div>
                            <h4 className="font-semibold text-sm">{step.title}</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">{step.body}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/case-guidance" onClick={() => { setUrgentHelpOpen(false); setUrgentSituation(null); }}>
                    <Card className="hover:shadow-md hover:border-amber-300 transition-all cursor-pointer h-full border-l-4 border-l-amber-200 bg-amber-50/30 dark:bg-amber-950/10">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-1 mb-0.5">
                          <p className="text-xs font-semibold text-foreground">{t("home.urgentHelp.chargedLinkLabel")}</p>
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                        </div>
                        <p className="text-xs text-muted-foreground">{t("home.urgentHelp.chargedLinkSub")}</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/support/court-logistics/bail-preparation" onClick={() => { setUrgentHelpOpen(false); setUrgentSituation(null); }}>
                    <Card className="hover:shadow-md hover:border-amber-300 transition-all cursor-pointer h-full border-l-4 border-l-amber-200 bg-amber-50/30 dark:bg-amber-950/10">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-1 mb-0.5">
                          <p className="text-xs font-semibold text-foreground">Bail Preparation Checklist</p>
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                        </div>
                        <p className="text-xs text-muted-foreground">Gather documentation before the bail hearing</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Helping family */}
            {urgentSituation === "family" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, ease: "easeOut" }} className="space-y-4">
                <button onClick={() => setUrgentSituation(null)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                  {t("home.urgentHelp.back")}
                </button>
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-5">
                    <h3 className="font-bold text-sm mb-3">{t("home.urgentHelp.familySectionTitle")}</h3>
                    <ol className="space-y-3">
                      {[
                        { title: t("home.urgentHelp.familyStep1Title"), body: t("home.urgentHelp.familyStep1Body") },
                        { title: t("home.urgentHelp.familyStep2Title"), body: t("home.urgentHelp.familyStep2Body") },
                        { title: t("home.urgentHelp.familyStep3Title"), body: t("home.urgentHelp.familyStep3Body") },
                        { title: t("home.urgentHelp.familyStep4Title"), body: t("home.urgentHelp.familyStep4Body") },
                      ].map((step, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mt-0.5 ring-2 ring-blue-200 dark:ring-blue-900">{i + 1}</span>
                          <div>
                            <h4 className="font-semibold text-sm">{step.title}</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">{step.body}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/friends-family" onClick={() => { setUrgentHelpOpen(false); setUrgentSituation(null); }}>
                    <Card className="hover:shadow-md hover:border-blue-300 transition-all cursor-pointer h-full border-l-4 border-l-blue-200 bg-blue-50/30 dark:bg-blue-950/10">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-1 mb-0.5">
                          <p className="text-xs font-semibold text-foreground">{t("home.urgentHelp.familyLink1Label")}</p>
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                        </div>
                        <p className="text-xs text-muted-foreground">{t("home.urgentHelp.familyLink1Sub")}</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/first-24-hours#phone-call" onClick={() => { setUrgentHelpOpen(false); setUrgentSituation(null); }}>
                    <Card className="hover:shadow-md hover:border-blue-300 transition-all cursor-pointer h-full border-l-4 border-l-blue-200 bg-blue-50/30 dark:bg-blue-950/10">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-1 mb-0.5">
                          <p className="text-xs font-semibold text-foreground">{t("home.urgentHelp.familyLink2Label")}</p>
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                        </div>
                        <p className="text-xs text-muted-foreground">{t("home.urgentHelp.familyLink2Sub")}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </motion.div>
            )}

          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
