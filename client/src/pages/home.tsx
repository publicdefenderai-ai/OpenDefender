import { motion, useInView } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Search,
  Scale,
  Users,
  Globe2,
  MessageSquare,
  Phone,
  Heart,
  Briefcase,
  Sunrise,
} from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SiteSearch } from "@/components/search/site-search";
import { DisclosureNotice } from "@/components/legal/disclosure-notice";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

function CountUp({ target, duration = 1400 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    if (target === 0) {
      setCount(0);
      return;
    }
    let animId: number;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        animId = requestAnimationFrame(tick);
      }
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [inView, target, duration]);

  return <span ref={ref}>{count}</span>;
}

export default function Home() {
  useScrollToTop();
  const { t } = useTranslation();
  const [urgentHelpOpen, setUrgentHelpOpen] = useState(false);
  const [urgentSituation, setUrgentSituation] = useState<"arrested" | "charged" | "family" | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleUrgentHelp = () => {
    setUrgentHelpOpen(true);
  };

  const doors = [
    {
      badge: t("home.doors.door1.badge"),
      headline: t("home.doors.door1.headline"),
      desc: t("home.doors.door1.desc"),
      cta: t("home.doors.door1.cta"),
      link: "/first-24-hours",
      links: [
        { label: t("home.doors.door1.link1"), href: "/first-24-hours#inmate-locator" },
        { label: t("home.doors.door1.link2"), href: "/support/court-logistics/bail-preparation" },
        { label: t("home.doors.door1.link3"), href: "/collateral-consequences" },
      ],
      tone: "urgent",
      pulsing: true,
    },
    {
      badge: t("home.doors.door2.badge"),
      headline: t("home.doors.door2.headline"),
      desc: t("home.doors.door2.desc"),
      cta: t("home.doors.door2.cta"),
      link: "/case-guidance",
      links: [
        { label: t("home.doors.door2.link1"), href: "/rights-info" },
        { label: t("home.doors.door2.link2"), href: "/case-timeline" },
        { label: t("home.doors.door2.link3"), href: "/collateral-consequences" },
      ],
      tone: "case",
      pulsing: false,
    },
    {
      badge: t("home.doors.door3.badge"),
      headline: t("home.doors.door3.headline"),
      desc: t("home.doors.door3.desc"),
      cta: t("home.doors.door3.cta"),
      link: "/support",
      links: [
        { label: t("home.doors.door3.link1"), href: "/support/housing" },
        { label: t("home.doors.door3.link2"), href: "/support/employment" },
        { label: t("home.doors.door3.link3"), href: "/support/childcare" },
      ],
      tone: "support",
      pulsing: false,
    },
  ];

  const secondaryPaths = [
    {
      Icon: Globe2,
      title: t("home.secondary.immigration.title"),
      desc: t("home.secondary.immigration.desc"),
      cta: t("home.secondary.immigration.cta"),
      href: "/immigration-guidance",
      accent: "#b45309",
      bg: "bg-amber-50/60 dark:bg-amber-900/10",
      border: "border-amber-200 dark:border-amber-800/50",
      color: "text-amber-700 dark:text-amber-400",
    },
    {
      Icon: Sunrise,
      title: t("home.secondary.reentry.title"),
      desc: t("home.secondary.reentry.desc"),
      cta: t("home.secondary.reentry.cta"),
      href: "/support/reentry",
      accent: "#4338ca",
      bg: "bg-indigo-50/60 dark:bg-indigo-900/10",
      border: "border-indigo-200 dark:border-indigo-800/50",
      color: "text-indigo-700 dark:text-indigo-400",
    },
    {
      Icon: Users,
      title: t("home.secondary.findHelp.title"),
      desc: t("home.secondary.findHelp.desc"),
      cta: t("home.secondary.findHelp.cta"),
      href: "/legal-aid",
      accent: "#0d9488",
      bg: "bg-teal-50/60 dark:bg-teal-900/10",
      border: "border-teal-200 dark:border-teal-800/50",
      color: "text-teal-700 dark:text-teal-400",
    },
    {
      Icon: Briefcase,
      title: t("home.secondary.lifeSupport.title"),
      desc: t("home.secondary.lifeSupport.desc"),
      cta: t("home.secondary.lifeSupport.cta"),
      href: "/for-advocates",
      accent: "#6d28d9",
      bg: "bg-violet-50/60 dark:bg-violet-900/10",
      border: "border-violet-200 dark:border-violet-800/50",
      color: "text-violet-700 dark:text-violet-400",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero — orientation first, with a quieter editorial opening */}
      <section className="editorial-home-hero relative pt-12 pb-10 md:pt-20 md:pb-14 overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="editorial-kicker mb-5">OpenDefender</p>
            <h1 className="font-display text-[2.15rem] sm:text-[3rem] md:text-[4.25rem] font-normal mb-6 tracking-tight" style={{ lineHeight: '1.08' }}>
              {t("home.hero.headlinePart1")}
              <br />
              <strong className="font-bold">{t("home.hero.headlinePart3")}</strong>
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-8 text-muted-foreground max-w-2xl leading-relaxed">
              {t("home.hero.subtitle")}
            </p>
            <div className="flex flex-col items-start justify-center">
              <button
                onClick={handleUrgentHelp}
                className="editorial-primary-action focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {t("home.hero.primaryCta")} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Three Doors */}
      <section className="pt-10 pb-6 md:pt-14 md:pb-8 bg-white dark:bg-background border-t border-border/20" id="paths">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-xl font-bold text-center text-foreground mb-6 tracking-tight">
              {t("home.doors.sectionLabel")}
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            {doors.map((door, i) => (
              <motion.div
                key={door.link}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="group h-full"
              >
                <div
                  className={`editorial-path-card editorial-path-card-${door.tone} relative flex flex-col overflow-hidden
                    h-full min-h-[360px]`}
                >
                  <div className="relative z-10 flex flex-col flex-1 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      {door.pulsing && (
                        <span className="editorial-urgency-dot" aria-hidden="true">
                        </span>
                      )}
                      <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase leading-tight">
                        {door.badge}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 leading-snug">
                      {door.headline}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5">
                      {door.desc}
                    </p>

                    <Link
                      href={door.link}
                      className="editorial-path-action inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors mb-5 w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {door.cta}
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>

                    <div className="flex flex-col gap-2 border-t border-border pt-4">
                      {door.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          <ArrowRight className="h-2.5 w-2.5 opacity-60 flex-shrink-0" aria-hidden="true" />
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Secondary paths 2×2 */}
          <ScrollReveal delay={0.15}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-10 mb-4">
              {t("home.secondary.title")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {secondaryPaths.map(({ Icon, title, desc, cta, href }) => (
                <Link key={href} href={href} className="flex">
                  <div className="editorial-secondary-path flex items-start gap-3.5 p-4 cursor-pointer h-full w-full">
                    <Icon className="h-4 w-4 mt-0.5 flex-shrink-0 text-[var(--editorial-signal)]" strokeWidth={1.75} aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground text-sm leading-snug">{title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{desc}</p>
                      <p className="text-xs font-semibold text-[var(--editorial-signal)] flex items-center gap-1 mt-2">
                        {cta} <ArrowRight className="h-2.5 w-2.5" aria-hidden="true" />
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </ScrollReveal>

          {/* Search bar */}
          <ScrollReveal delay={0.2}>
            <div className="mt-7 mb-2 max-w-xl mx-auto">
              <button
                onClick={() => setSearchOpen(true)}
                className="w-full flex items-center gap-3 pl-3.5 pr-4 py-3 rounded-md border border-border bg-background text-sm text-muted-foreground hover:border-[var(--editorial-signal)] hover:bg-muted/40 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--editorial-signal)]"
                aria-label={t("home.paths.searchPlaceholder")}
              >
                <Search className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                {t("home.paths.searchPlaceholder")}
              </button>
            </div>
          </ScrollReveal>
          <SiteSearch open={searchOpen} onOpenChange={setSearchOpen} />
          <div className="mt-2 mb-1 text-center">
            <Link href="/directory" className="text-xs text-muted-foreground hover:text-foreground font-medium inline-flex items-center gap-1 transition-colors">
              {t("navigation.browseAll", "Browse all resources")} <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why OpenDefender section */}
      <section className="py-10 md:py-12 bg-white dark:bg-background border-t border-border/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <p className="text-center text-[15px] font-medium text-foreground mb-7 max-w-2xl mx-auto leading-relaxed">
              {t("home.features.heading")}
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { Icon: AlertTriangle, title: t("home.features.card1Title"), desc: t("home.features.card1Desc") },
                { Icon: Heart, title: t("home.features.card2Title"), desc: t("home.features.card2Desc") },
                { Icon: Globe2, title: t("home.features.card3Title"), desc: t("home.features.card3Desc") },
              ].map(({ Icon, title, desc }) => (
              <ScrollReveal key={title}>
                <div className="p-4 rounded-xl border border-border bg-muted/20 h-full">
                  <Icon className="h-4 w-4 text-[var(--editorial-signal)] mb-3" strokeWidth={1.75} aria-hidden="true" />
                  <p className="font-semibold text-sm text-foreground mb-1.5">{title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Animated stats + condensed trust strip */}
      <section className="py-10 md:py-12 bg-slate-50 dark:bg-background border-t border-border/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          {/* Animated triple stat */}
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 mb-8">
              <div className="flex flex-col items-center">
                <span className="text-4xl font-black text-foreground tabular-nums">
                  <CountUp target={3} />
                </span>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">
                  {t("home.stats.label1")}
                </span>
              </div>
              <div className="hidden sm:block w-px h-10 bg-border" aria-hidden="true" />
              <div className="flex flex-col items-center">
                <span className="text-4xl font-black text-foreground tabular-nums">
                  <CountUp target={51} />
                </span>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">
                  {t("home.stats.label2")}
                </span>
              </div>
              <div className="hidden sm:block w-px h-10 bg-border" aria-hidden="true" />
              <div className="flex flex-col items-center">
                <span className="text-4xl font-black text-foreground tabular-nums">
                  $<CountUp target={0} />
                </span>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">
                  {t("home.stats.label3")}
                </span>
              </div>
            </div>
          </ScrollReveal>

          {/* Condensed trust badges */}
          <ScrollReveal delay={0.1}>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                t("home.stats.badge1"),
                t("home.stats.badge2"),
                t("home.stats.badge3"),
              ].map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center px-3 py-1 rounded-sm text-xs font-semibold bg-background border border-border text-muted-foreground"
                >
                  {badge}
                </span>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <DisclosureNotice className="mx-4 mb-6 rounded-xl border border-border/60 bg-muted/20 md:mx-auto md:max-w-6xl" />
      <Footer />

      {/* Urgent Help Modal */}
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
