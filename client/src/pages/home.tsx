import { BrandShieldIcon } from "@/components/brand-logo";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Phone,
  Mail,
  Navigation,
  Clock,
  MapPin,
  BookOpen,
  Search,
  HelpCircle,
  Check,
  Scale,
  Users,
  Heart,
  Globe2,
  MessageSquare,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

import { useScrollToTop } from "@/hooks/use-scroll-to-top";

function TrustItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="border-b border-border/50 last:border-b-0 py-4 px-2" data-testid={`trust-item-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <h3 className="font-medium text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed" data-testid={`text-description-${title.toLowerCase().replace(/\s+/g, '-')}`}>
        {description}
      </p>
    </div>
  );
}

export default function Home() {
  useScrollToTop();
  const { t } = useTranslation();
  const [urgentHelpOpen, setUrgentHelpOpen] = useState(false);
  const [urgentSituation, setUrgentSituation] = useState<"arrested" | "charged" | "family" | null>(null);

  const rotatingWords = [
    t('home.hero.rotatingWord1'),
    t('home.hero.rotatingWord2'),
    t('home.hero.rotatingWord3'),
    t('home.hero.rotatingWord4'),
    t('home.hero.rotatingWord5'),
  ];
  const [wordIndex, setWordIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex(i => (i + 1) % rotatingWords.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [rotatingWords.length]);

  const handleUrgentHelp = () => {
    setUrgentHelpOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Urgent alert strip */}
      <div className="w-full bg-red-50 dark:bg-red-950/30 border-b border-red-200 dark:border-red-800/60">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" aria-hidden="true" />
            <span className="text-base font-medium text-red-800 dark:text-red-200">
              {t('home.hero.urgentStripMessage')}
            </span>
          </div>
          <button
            onClick={handleUrgentHelp}
            className="text-base font-semibold text-red-700 dark:text-red-300 underline underline-offset-2 hover:no-underline whitespace-nowrap transition-colors"
            data-testid="button-urgent-strip"
          >
            {t('home.hero.urgentStripCta')} →
          </button>
        </div>
      </div>

      {/* Hero Section — always dark, high contrast */}
      <section className="relative pt-14 pb-10 md:pt-20 md:pb-14 lg:pt-24 lg:pb-16 overflow-hidden texture-grain bg-slate-900 dark:bg-[hsl(192,55%,11%)]">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800/90 to-teal-900/50 dark:from-[hsl(192,60%,10%)] dark:via-[hsl(196,50%,13%)] dark:to-[hsl(210,42%,17%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-500/10 dark:from-teal-300/30 via-transparent to-transparent" />
        <div className="absolute inset-0 texture-mesh opacity-30" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 leading-[1.05] tracking-tight text-white">
              {t('home.hero.title1')}{' '}
              <span className="text-teal-400">{t('home.hero.title2')}</span>
            </h1>

            <div className="mb-8 text-xl sm:text-2xl md:text-3xl font-medium text-white/75">
              {t('home.hero.rotatingPrefix')}{' '}
              <span className="inline-block" style={{ minWidth: '9ch', verticalAlign: 'baseline' }}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.28 }}
                    className="text-teal-300 font-bold inline-block"
                  >
                    {rotatingWords[wordIndex]}.
                  </motion.span>
                </AnimatePresence>
              </span>
            </div>

            <p className="text-base sm:text-lg md:text-xl mb-6 text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {t('home.hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Four paths — text-only cards, no browser previews */}
      <section className="pt-10 pb-12 md:pt-14 md:pb-16 bg-white dark:bg-background border-t border-border/20" id="paths">
        <div className="max-w-5xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-black text-foreground mb-1 tracking-tight">Choose your path</h2>
              <p className="text-base text-muted-foreground">Four paths to choose from. Most people use more than one.</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {([
              { number: "1", accent: "#1e3a5f", accentBg: "#eef2f8", Icon: Clock,        badge: t('howTo.paths.path1.badge'), headline: t('howTo.paths.path1.headline'), subhead: t('howTo.paths.path1.subhead'), bullets: [t('howTo.paths.path1.bullet1'), t('howTo.paths.path1.bullet2'), t('howTo.paths.path1.bullet3'), t('howTo.paths.path1.bullet4')], link: "/first-24-hours", cta: t('howTo.paths.path1.cta') },
              { number: "2", accent: "#0f766e", accentBg: "#eef9f8", Icon: MessageSquare, badge: t('howTo.paths.path2.badge'), headline: t('howTo.paths.path2.headline'), subhead: t('howTo.paths.path2.subhead'), bullets: [t('howTo.paths.path2.bullet1'), t('howTo.paths.path2.bullet2'), t('howTo.paths.path2.bullet3'), t('howTo.paths.path2.bullet4')], link: "/case-guidance",  cta: t('howTo.paths.path2.cta') },
              { number: "3", accent: "#8b2252", accentBg: "#f8eef3", Icon: Heart,         badge: t('howTo.paths.path3.badge'), headline: t('howTo.paths.path3.headline'), subhead: t('howTo.paths.path3.subhead'), bullets: [t('howTo.paths.path3.bullet1'), t('howTo.paths.path3.bullet2'), t('howTo.paths.path3.bullet3'), t('howTo.paths.path3.bullet4')], link: "/support",        cta: t('howTo.paths.path3.cta') },
              { number: "4", accent: "#92400e", accentBg: "#fef3e2", Icon: Globe2,        badge: t('howTo.paths.path4.badge'), headline: t('howTo.paths.path4.headline'), subhead: t('howTo.paths.path4.subhead'), bullets: [t('howTo.paths.path4.bullet1'), t('howTo.paths.path4.bullet2'), t('howTo.paths.path4.bullet3'), t('howTo.paths.path4.bullet4')], link: "/immigration-guidance", cta: t('howTo.paths.path4.cta') },
            ] as const).map(({ number, accent, accentBg, Icon, badge, headline, subhead, bullets, link, cta }, i) => (
              <ScrollReveal key={number} delay={i * 0.07}>
                <div
                  className="flex flex-col h-full rounded-2xl border border-border border-l-4 bg-background shadow-sm overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                  style={{ borderLeftColor: accent }}
                >
                  <div className="flex-1 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: accent }}>{number}</div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: accentBg, color: accent }}>
                        <Icon className="w-3 h-3" />
                        <span>{badge}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2 leading-snug">{headline}</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{subhead}</p>
                    <ul className="space-y-2">
                      {bullets.map((b, bi) => (
                        <li key={bi} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: accentBg }}>
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
                          </div>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="px-6 pb-5">
                    <Link href={link}>
                      <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 w-full justify-center" style={{ background: accent }}>
                        {cta} <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Example journey */}
      <section className="py-12 bg-muted/30 dark:bg-background">
        <div className="max-w-3xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-background border border-border mb-4">
                {t('howTo.flow.label', 'Example')}
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">{t('howTo.flow.title', 'A typical first use')}</h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-[15px]">{t('howTo.flow.subtitle', 'Most people use OpenDefender in this order.')}</p>
            </div>
          </ScrollReveal>
          <div className="relative">
            <div className="absolute left-[99px] top-8 bottom-8 w-px bg-border hidden sm:block" />
            <div className="space-y-5">
              {([
                { time: t('howTo.flow.step1.time'), path: t('howTo.flow.step1.path'), accent: "#1e3a5f", accentBg: "#eef2f8", Icon: Clock,        action: t('howTo.flow.step1.action'), detail: t('howTo.flow.step1.detail') },
                { time: t('howTo.flow.step2.time'), path: t('howTo.flow.step2.path'), accent: "#0f766e", accentBg: "#eef9f8", Icon: MessageSquare, action: t('howTo.flow.step2.action'), detail: t('howTo.flow.step2.detail') },
                { time: t('howTo.flow.step3.time'), path: t('howTo.flow.step3.path'), accent: "#8b2252", accentBg: "#f8eef3", Icon: Heart,         action: t('howTo.flow.step3.action'), detail: t('howTo.flow.step3.detail') },
                { time: t('howTo.flow.step4.time'), path: t('howTo.flow.step4.path'), accent: "#0f766e", accentBg: "#eef9f8", Icon: MessageSquare, action: t('howTo.flow.step4.action'), detail: t('howTo.flow.step4.detail') },
              ] as const).map(({ time, path, accent, accentBg, Icon, action, detail }, i) => (
                <ScrollReveal key={i} delay={i * 0.08}>
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="w-16 sm:w-20 text-right flex-shrink-0 pt-2.5">
                      <span className="text-xs font-bold text-muted-foreground">{time}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 shadow-sm" style={{ background: accent }}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 bg-background rounded-xl border border-border p-4 shadow-sm">
                      <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-2" style={{ background: accentBg, color: accent }}>{path}</span>
                      <p className="text-sm font-semibold text-foreground mb-1">{action}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{detail}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
        <div className="text-center mt-10">
          <ScrollReveal>
            <Link href="/directory">
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted/60 hover:border-foreground/20 transition-all">
                <BookOpen className="h-4 w-4" />
                Browse All Resources
              </button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-20 md:py-28 bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-14 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t('home.commitment.title')}
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <div className="flex gap-4 group">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-teal-400/20 border border-teal-400/40 flex items-center justify-center mt-0.5 group-hover:bg-teal-400/30 transition-colors">
                    <Check className="h-4 w-4 text-teal-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2 text-base leading-snug">
                      {t(`home.commitment.pledge${i}Title`)}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {t(`home.commitment.pledge${i}Desc`)}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-slate-50 dark:bg-background border-t border-border/30">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
                {t('home.trust.title')}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t('home.trust.subtitle')}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <Card className="border-border/50">
              <CardContent className="p-5 md:p-6">
                <TrustItem
                  title={t('home.trust.privacyTitle')}
                  description={t('home.trust.privacyDesc')}
                />
                <TrustItem
                  title={t('home.trust.verifiedTitle')}
                  description={t('home.trust.verifiedDesc')}
                />
                <TrustItem
                  title={t('home.trust.currentTitle')}
                  description={t('home.trust.currentDesc')}
                />
              </CardContent>
            </Card>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <p className="mt-10 md:mt-12 text-xs text-muted-foreground text-center leading-relaxed">
              <span className="font-medium">{t('home.trust.disclaimerTitle')}</span>{' '}
              {t('home.trust.disclaimerText')}
            </p>
          </ScrollReveal>
        </div>
      </section>

      <Footer />

      {/* Urgent Help Modal */}
      <Dialog open={urgentHelpOpen} onOpenChange={(open) => { setUrgentHelpOpen(open); if (!open) setUrgentSituation(null); }}>
        <DialogContent className="max-w-[95vw] md:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              {t('home.urgentHelp.modalTitle')}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* ── Triage step ── */}
            {urgentSituation === null && (
              <>
                <p className="text-sm text-muted-foreground">What best describes your situation right now?</p>
                <div className="space-y-3">
                  <button className="w-full text-left" onClick={() => setUrgentSituation("arrested")}>
                    <Card className="hover:shadow-md hover:border-red-400 dark:hover:border-red-600 transition-all cursor-pointer group border-red-200 dark:border-red-900 bg-red-50/40 dark:bg-red-950/20">
                      <CardContent className="p-4 flex items-start gap-3">
                        <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground group-hover:text-red-700 dark:group-hover:text-red-300">I was just arrested or am currently in custody</p>
                          <p className="text-xs text-muted-foreground mt-0.5">What to do in the next few hours</p>
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
                          <p className="font-semibold text-sm text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-300">I've been charged and released — I have a court date coming up</p>
                          <p className="text-xs text-muted-foreground mt-0.5">What you need to do before your first appearance</p>
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
                          <p className="font-semibold text-sm text-foreground group-hover:text-blue-700 dark:group-hover:text-blue-300">Someone I know was arrested and I'm trying to help</p>
                          <p className="text-xs text-muted-foreground mt-0.5">How to find them and what to do</p>
                        </div>
                      </CardContent>
                    </Card>
                  </button>

                  <Link href="/first-24-hours#before-arrest" onClick={() => { setUrgentHelpOpen(false); setUrgentSituation(null); }}>
                    <Card className="hover:shadow-md hover:border-slate-400 dark:hover:border-slate-500 transition-all cursor-pointer group border-slate-200 dark:border-slate-700">
                      <CardContent className="p-4 flex items-start gap-3">
                        <div className="w-9 h-9 bg-slate-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground group-hover:text-slate-700 dark:group-hover:text-slate-300">Police want to talk to me / I may be arrested soon</p>
                          <p className="text-xs text-muted-foreground mt-0.5">What to do before an arrest happens</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </>
            )}

            {/* ── Just arrested ── */}
            {urgentSituation === "arrested" && (
              <>
                <button onClick={() => setUrgentSituation(null)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 -mb-1">
                  ← Back
                </button>
                <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800 dark:text-red-200">
                    <strong>{t('home.urgentHelp.arrestWarning')}</strong> {t('home.urgentHelp.arrestWarningText')}
                  </AlertDescription>
                </Alert>
                <Card>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-sm mb-3">{t('home.urgentHelp.immediateActions')}</h3>
                    <ol className="space-y-3">
                      {[
                        { title: t('home.urgentHelp.stayCalmTitle'), body: t('home.urgentHelp.stayCalmText') },
                        { title: t('home.urgentHelp.assertRightsTitle'), body: `${t('home.urgentHelp.assertRightsText1')} ${t('home.urgentHelp.assertRightsText2')}` },
                        { title: t('home.urgentHelp.noConsentTitle'), body: t('home.urgentHelp.noConsentText') },
                        { title: t('home.urgentHelp.publicDefenderTitle'), body: t('home.urgentHelp.publicDefenderText') },
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
                        <p className="text-xs font-semibold text-foreground">Full 24-Hour Guide</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Step-by-step through arrest, bail, and arraignment</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/first-24-hours#phone-call" onClick={() => { setUrgentHelpOpen(false); setUrgentSituation(null); }}>
                    <Card className="hover:shadow-md hover:border-foreground/30 transition-all cursor-pointer h-full">
                      <CardContent className="p-3 text-center">
                        <p className="text-xs font-semibold text-foreground">Jail Phone Call Guide</p>
                        <p className="text-xs text-muted-foreground mt-0.5">What to say, and what never to say</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </>
            )}

            {/* ── Charged and released ── */}
            {urgentSituation === "charged" && (
              <>
                <button onClick={() => setUrgentSituation(null)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 -mb-1">
                  ← Back
                </button>
                <Card>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-sm mb-3">Before your first court date</h3>
                    <ol className="space-y-3">
                      {[
                        { title: "Get a lawyer before you appear", body: "If you cannot afford one, contact the public defender's office in the county where you were charged immediately. Do not go to your first appearance without representation if you can avoid it." },
                        { title: "Don't discuss your case", body: "Do not talk about the charges with friends, family, or on social media. Prosecutors can subpoena anyone you speak to." },
                        { title: "Understand your bail conditions", body: "If you were released on bail, read every condition carefully. Violating any condition, even accidentally, results in immediate re-arrest." },
                        { title: "Don't miss your court date", body: "Missing a hearing results in an arrest warrant being issued. Set multiple reminders." },
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
                <div className="pt-1">
                  <Link href="/case-guidance" onClick={() => { setUrgentHelpOpen(false); setUrgentSituation(null); }}>
                    <Card className="hover:shadow-md hover:border-foreground/30 transition-all cursor-pointer">
                      <CardContent className="p-3 text-center">
                        <p className="text-xs font-semibold text-foreground">Get Case Guidance</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Personalized guidance for your situation</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </>
            )}

            {/* ── Helping family ── */}
            {urgentSituation === "family" && (
              <>
                <button onClick={() => setUrgentSituation(null)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 -mb-1">
                  ← Back
                </button>
                <Card>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-sm mb-3">How to help someone who was arrested</h3>
                    <ol className="space-y-3">
                      {[
                        { title: "Find out where they are", body: "Call the county jail or use an online inmate locator. You'll need their full legal name and ideally their date of birth." },
                        { title: "Get them legal representation", body: "Contact a criminal defense attorney or the public defender's office in the county where they were arrested. Do this before the bail hearing if at all possible." },
                        { title: "Learn their booking number and the charges", body: "You'll need this to post bail, contact their attorney, and stay informed about court dates." },
                        { title: "Be careful what you say on phone calls", body: "Jail phone calls are recorded. Don't discuss the case, the facts of what happened, or ask them to do anything related to the incident." },
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
                        <p className="text-xs font-semibold text-foreground">Full Family Guide</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Finding, contacting, and supporting someone in custody</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/first-24-hours#phone-call" onClick={() => { setUrgentHelpOpen(false); setUrgentSituation(null); }}>
                    <Card className="hover:shadow-md hover:border-foreground/30 transition-all cursor-pointer h-full">
                      <CardContent className="p-3 text-center">
                        <p className="text-xs font-semibold text-foreground">Jail Phone Calls</p>
                        <p className="text-xs text-muted-foreground mt-0.5">What to say and what to avoid</p>
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
