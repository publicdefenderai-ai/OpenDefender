import { BrandShieldIcon } from "@/components/brand-logo";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  Search,
  Check,
  Scale,
  Users,
  Heart,
  Globe2,
  MessageSquare,
} from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SiteSearch } from "@/components/search/site-search";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

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

  const paths = [
    {
      number: "1",
      accent: "#1e3a5f",
      accentBg: "#eef2f8",
      Icon: Clock,
      badge: t("home.paths.path1Badge"),
      headline: t("home.paths.path1Headline"),
      desc: t("home.paths.path1Desc"),
      link: "/first-24-hours",
      cta: t("home.paths.path1Cta"),
    },
    {
      number: "2",
      accent: "#0f766e",
      accentBg: "#eef9f8",
      Icon: MessageSquare,
      badge: t("home.paths.path2Badge"),
      headline: t("home.paths.path2Headline"),
      desc: t("home.paths.path2Desc"),
      link: "/case-guidance",
      cta: t("home.paths.path2Cta"),
    },
    {
      number: "3",
      accent: "#8b2252",
      accentBg: "#f8eef3",
      Icon: Heart,
      badge: t("home.paths.path3Badge"),
      headline: t("home.paths.path3Headline"),
      desc: t("home.paths.path3Desc"),
      link: "/support",
      cta: t("home.paths.path3Cta"),
    },
    {
      number: "4",
      accent: "#92400e",
      accentBg: "#fef3e2",
      Icon: Globe2,
      badge: t("home.paths.path4Badge"),
      headline: t("home.paths.path4Headline"),
      desc: t("home.paths.path4Desc"),
      link: "/immigration-guidance",
      cta: t("home.paths.path4Cta"),
    },
  ] as const;

  const trustItems = [
    { title: t("home.trust.freeTitle"), desc: t("home.trust.freeDesc"), icon: Check },
    { title: t("home.trust.privacyTitle"), desc: t("home.trust.privacyDesc"), icon: Check },
    { title: t("home.trust.earlyKnowledgeTitle"), desc: t("home.trust.earlyKnowledgeDesc"), icon: Check },
    { title: t("home.trust.multilingualTitle"), desc: t("home.trust.multilingualDesc"), icon: Check },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero — always dark, high contrast */}
      <section className="relative pt-14 pb-12 md:pt-20 md:pb-16 overflow-hidden texture-grain bg-slate-900 dark:bg-[hsl(192,55%,11%)]">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800/90 to-teal-900/50 dark:from-[hsl(192,60%,10%)] dark:via-[hsl(196,50%,13%)] dark:to-[hsl(210,42%,17%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-500/10 dark:from-teal-300/30 via-transparent to-transparent" />
        <div className="absolute inset-0 texture-mesh opacity-30" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-[3.5rem] font-black mb-6 leading-[1.1] tracking-tight text-white">
              <span className="text-teal-400">{t("home.hero.headlinePart1")}</span>
              <br />
              {t("home.hero.headlinePart2")}
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-8 text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {t("home.hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleUrgentHelp}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 active:bg-teal-600 text-white font-bold text-base transition-colors shadow-lg shadow-teal-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              >
                {t("home.hero.primaryCta")} <ArrowRight className="h-4 w-4" />
              </button>
              <Link href="/directory">
                <span className="text-slate-400 hover:text-white text-sm font-medium transition-colors underline underline-offset-2 hover:no-underline cursor-pointer">
                  {t("home.hero.secondaryCta")} →
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Paths — shortened cards */}
      <section className="pt-10 pb-4 md:pt-14 md:pb-6 bg-white dark:bg-background border-t border-border/20" id="paths">
        <div className="max-w-5xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-foreground mb-1 tracking-tight">
                {t("home.paths.situationLabel")}
              </h2>
              <p className="text-base text-muted-foreground">{t("home.paths.situationSubtitle")}</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {paths.map(({ number, accent, accentBg, Icon, badge, headline, desc, link, cta }, i) => (
              <ScrollReveal key={number} delay={i * 0.07}>
                <Link href={link}>
                  <div
                    className="flex flex-col h-full rounded-2xl border border-border border-l-4 bg-background shadow-sm overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                    style={{ borderLeftColor: accent }}
                  >
                    <div className="flex-1 p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0" style={{ background: accent }}>{number}</div>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: accentBg, color: accent }}>
                          <Icon className="w-3 h-3" />
                          <span>{badge}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-1.5 leading-snug">{headline}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                    </div>
                    <div className="px-5 pb-4">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white w-full justify-center" style={{ background: accent }}>
                        {cta} <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          {/* Friends & family — prominent secondary card */}
          <ScrollReveal delay={0.25}>
            <div className="mt-5 rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5">
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-0.5">
                      {t("home.paths.path5Badge")}
                    </p>
                    <h3 className="text-base font-bold text-foreground leading-snug">{t("home.paths.path5Headline")}</h3>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{t("home.paths.path5Desc")}</p>
                <Link href="/friends-family" className="flex-shrink-0">
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors whitespace-nowrap">
                    {t("home.paths.path5Cta")} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* Past conviction entry point */}
          <ScrollReveal delay={0.26}>
            <div className="mt-5 pt-5 border-t border-border/30 text-center">
              <p className="text-sm text-muted-foreground">
                {t("home.paths.pastConvictionLabel")}{" "}
                <Link href="/support/reputation" className="font-medium text-foreground underline underline-offset-2 hover:no-underline">
                  {t("home.paths.pastConvictionLink1")}
                </Link>
                {" "}or{" "}
                <Link href="/support/reputation#fcra-rights" className="font-medium text-foreground underline underline-offset-2 hover:no-underline">
                  {t("home.paths.pastConvictionLink2")}
                </Link>.
              </p>
            </div>
          </ScrollReveal>

          {/* How-to link — more prominent */}
          <ScrollReveal delay={0.28}>
            <div className="mt-4 text-center">
              <Link href="/how-to">
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground border border-border rounded-lg px-4 py-2 hover:bg-muted/60 hover:border-foreground/20 transition-colors cursor-pointer">
                  {t("home.paths.howToLink")}
                </span>
              </Link>
            </div>
          </ScrollReveal>

          {/* Search bar — opens the same modal as the header search */}
          <ScrollReveal delay={0.35}>
            <div className="mt-6 mb-2 max-w-xl mx-auto">
              <button
                onClick={() => setSearchOpen(true)}
                className="w-full flex items-center gap-3 pl-3.5 pr-4 py-3 rounded-xl border border-border bg-background text-sm text-muted-foreground hover:border-teal-500/50 hover:bg-muted/40 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40"
                aria-label={t("home.paths.searchPlaceholder")}
              >
                <Search className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                {t("home.paths.searchPlaceholder")}
              </button>
            </div>
          </ScrollReveal>
          <SiteSearch open={searchOpen} onOpenChange={setSearchOpen} />
        </div>
      </section>

      {/* Compact trust section */}
      <section className="py-12 md:py-16 bg-slate-50 dark:bg-background border-t border-border/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <h2 className="text-xl font-bold text-foreground text-center mb-8">{t("home.trust.title")}</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {trustItems.map(({ title, desc }, i) => (
              <ScrollReveal key={title} delay={i * 0.07}>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm mb-1">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Urgent Help Modal */}
      <Dialog open={urgentHelpOpen} onOpenChange={(open) => { setUrgentHelpOpen(open); if (!open) setUrgentSituation(null); }}>
        <DialogContent className="max-w-[95vw] md:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              {t("home.urgentHelp.modalTitle")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Triage step */}
            {urgentSituation === null && (
              <>
                <p className="text-sm text-muted-foreground">{t("home.urgentHelp.triageLead")}</p>
                <div className="space-y-3">
                  <button className="w-full text-left" onClick={() => setUrgentSituation("arrested")}>
                    <Card className="hover:shadow-md hover:border-red-400 dark:hover:border-red-600 transition-all cursor-pointer group border-red-200 dark:border-red-900 bg-red-50/40 dark:bg-red-950/20">
                      <CardContent className="p-4 flex items-start gap-3">
                        <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground group-hover:text-red-700 dark:group-hover:text-red-300">{t("home.urgentHelp.scenario1Label")}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{t("home.urgentHelp.scenario1Sub")}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </button>

                  <button className="w-full text-left" onClick={() => setUrgentSituation("charged")}>
                    <Card className="hover:shadow-md hover:border-amber-400 dark:hover:border-amber-600 transition-all cursor-pointer group">
                      <CardContent className="p-4 flex items-start gap-3">
                        <div className="w-9 h-9 bg-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Scale className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-300">{t("home.urgentHelp.scenario2Label")}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{t("home.urgentHelp.scenario2Sub")}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </button>

                  <button className="w-full text-left" onClick={() => setUrgentSituation("family")}>
                    <Card className="hover:shadow-md hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer group">
                      <CardContent className="p-4 flex items-start gap-3">
                        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground group-hover:text-blue-700 dark:group-hover:text-blue-300">{t("home.urgentHelp.scenario3Label")}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{t("home.urgentHelp.scenario3Sub")}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </button>

                  <Link href="/first-24-hours#before-arrest" onClick={() => { setUrgentHelpOpen(false); setUrgentSituation(null); }} className="block">
                    <Card className="hover:shadow-md hover:border-slate-400 dark:hover:border-slate-500 transition-all cursor-pointer group border-slate-200 dark:border-slate-700">
                      <CardContent className="p-4 flex items-start gap-3">
                        <div className="w-9 h-9 bg-slate-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground group-hover:text-slate-700 dark:group-hover:text-slate-300">{t("home.urgentHelp.scenario4Label")}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{t("home.urgentHelp.scenario4Sub")}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </>
            )}

            {/* Just arrested */}
            {urgentSituation === "arrested" && (
              <>
                <button onClick={() => setUrgentSituation(null)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 -mb-1">
                  {t("home.urgentHelp.back")}
                </button>
                <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800 dark:text-red-200">
                    <strong>{t("home.urgentHelp.arrestWarning")}</strong> {t("home.urgentHelp.arrestWarningText")}
                  </AlertDescription>
                </Alert>
                <Card>
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
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                          <div>
                            <h4 className="font-semibold text-sm">{step.title}</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">{step.body}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <Link href="/first-24-hours" onClick={() => { setUrgentHelpOpen(false); setUrgentSituation(null); }}>
                    <Card className="hover:shadow-md hover:border-foreground/30 transition-all cursor-pointer h-full">
                      <CardContent className="p-3 text-center">
                        <p className="text-xs font-semibold text-foreground">{t("home.urgentHelp.full24HourGuide")}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{t("home.urgentHelp.full24HourGuideSub")}</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/first-24-hours#phone-call" onClick={() => { setUrgentHelpOpen(false); setUrgentSituation(null); }}>
                    <Card className="hover:shadow-md hover:border-foreground/30 transition-all cursor-pointer h-full">
                      <CardContent className="p-3 text-center">
                        <p className="text-xs font-semibold text-foreground">{t("home.urgentHelp.jailPhoneCallGuide")}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{t("home.urgentHelp.jailPhoneCallGuideSub")}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </>
            )}

            {/* Charged and released */}
            {urgentSituation === "charged" && (
              <>
                <button onClick={() => setUrgentSituation(null)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 -mb-1">
                  {t("home.urgentHelp.back")}
                </button>
                <Card>
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
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                          <div>
                            <h4 className="font-semibold text-sm">{step.title}</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">{step.body}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <Link href="/case-guidance" onClick={() => { setUrgentHelpOpen(false); setUrgentSituation(null); }}>
                    <Card className="hover:shadow-md hover:border-foreground/30 transition-all cursor-pointer h-full">
                      <CardContent className="p-3 text-center">
                        <p className="text-xs font-semibold text-foreground">{t("home.urgentHelp.chargedLinkLabel")}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{t("home.urgentHelp.chargedLinkSub")}</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/support/court-logistics/bail-preparation" onClick={() => { setUrgentHelpOpen(false); setUrgentSituation(null); }}>
                    <Card className="hover:shadow-md hover:border-foreground/30 transition-all cursor-pointer h-full">
                      <CardContent className="p-3 text-center">
                        <p className="text-xs font-semibold text-foreground">Bail Preparation Checklist</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Gather documentation before the bail hearing</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </>
            )}

            {/* Helping family */}
            {urgentSituation === "family" && (
              <>
                <button onClick={() => setUrgentSituation(null)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 -mb-1">
                  {t("home.urgentHelp.back")}
                </button>
                <Card>
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
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                          <div>
                            <h4 className="font-semibold text-sm">{step.title}</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">{step.body}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <Link href="/friends-family" onClick={() => { setUrgentHelpOpen(false); setUrgentSituation(null); }}>
                    <Card className="hover:shadow-md hover:border-foreground/30 transition-all cursor-pointer h-full">
                      <CardContent className="p-3 text-center">
                        <p className="text-xs font-semibold text-foreground">{t("home.urgentHelp.familyLink1Label")}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{t("home.urgentHelp.familyLink1Sub")}</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/first-24-hours#phone-call" onClick={() => { setUrgentHelpOpen(false); setUrgentSituation(null); }}>
                    <Card className="hover:shadow-md hover:border-foreground/30 transition-all cursor-pointer h-full">
                      <CardContent className="p-3 text-center">
                        <p className="text-xs font-semibold text-foreground">{t("home.urgentHelp.familyLink2Label")}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{t("home.urgentHelp.familyLink2Sub")}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
