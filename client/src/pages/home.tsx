import { BrandShieldIcon } from "@/components/brand-logo";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Shield,
  Phone,
  Mail,
  Navigation,
  Clock,
  MapPin,
  Book,
  FileText,
  BarChart3,
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
import { RotatingCardCarousel } from "@/components/ui/rotating-card-carousel";
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

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 lg:py-28 overflow-hidden texture-grain">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="absolute inset-0 texture-mesh" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight text-foreground">
              {t('home.hero.title1')}{' '}
              <span className="text-primary">{t('home.hero.title2')}</span>
            </h1>

            <div className="mb-8 text-xl sm:text-2xl md:text-3xl font-medium text-foreground/80">
              {t('home.hero.rotatingPrefix')}{' '}
              <span className="inline-block" style={{ minWidth: '9ch', verticalAlign: 'baseline' }}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.28 }}
                    className="text-primary font-bold inline-block"
                  >
                    {rotatingWords[wordIndex]}.
                  </motion.span>
                </AnimatePresence>
              </span>
            </div>

            <p className="text-base sm:text-lg md:text-xl mb-12 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t('home.hero.subtitle')}
            </p>
          </motion.div>

          {/* 4-path selector */}
          <ScrollReveal delay={0.2}>
            <div className="w-full max-w-lg mx-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {([
                  { href: "/first-24-hours",      Icon: Clock,        label: t('home.hero.path1Label'), desc: t('home.hero.path1Desc'), color: "text-slate-700 dark:text-slate-300",  bg: "bg-slate-50 hover:bg-slate-100 border-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-800 dark:border-slate-700",   testId: "path-first-24" },
                  { href: "/case-guidance",       Icon: MessageSquare,label: t('home.hero.path2Label'), desc: t('home.hero.path2Desc'), color: "text-teal-700 dark:text-teal-300",    bg: "bg-teal-50 hover:bg-teal-100 border-teal-200 dark:bg-teal-900/30 dark:hover:bg-teal-900/50 dark:border-teal-800/60", testId: "path-guidance" },
                  { href: "/support",             Icon: Heart,        label: t('home.hero.path3Label'), desc: t('home.hero.path3Desc'), color: "text-rose-700 dark:text-rose-300",    bg: "bg-rose-50 hover:bg-rose-100 border-rose-200 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 dark:border-rose-800/60",   testId: "path-support" },
                  { href: "/immigration-guidance",Icon: Globe2,       label: t('home.hero.path4Label'), desc: t('home.hero.path4Desc'), color: "text-amber-700 dark:text-amber-300",  bg: "bg-amber-50 hover:bg-amber-100 border-amber-200 dark:bg-amber-900/20 dark:hover:bg-amber-900/40 dark:border-amber-800/60",testId: "path-immigration" },
                ] as const).map(({ href, Icon, label, desc, color, bg, testId }) => (
                  <Link key={href} href={href}>
                    <div
                      className={`flex items-start gap-3 p-4 rounded-xl border text-left cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${bg}`}
                      data-testid={testId}
                    >
                      <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${color}`} strokeWidth={1.75} />
                      <div className="min-w-0">
                        <p className={`font-semibold text-sm leading-snug ${color}`}>{label}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{desc}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <Button
                onClick={handleUrgentHelp}
                variant="outline"
                size="lg"
                className="w-full font-medium py-4 rounded-xl text-base border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/50 transition-all"
                data-testid="button-urgent-help"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                {t('home.hero.urgentHelpButton')}
              </Button>

              <div className="text-center">
                <Link href="/how-to">
                  <button
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="link-how-to"
                  >
                    {t('home.hero.navigatingToolButton')}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-20 md:py-28 bg-slate-900 dark:bg-slate-950">
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

      {/* Data Sources Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-background border-t border-border/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-10 md:mb-12">
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('home.features.subtitle')}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <RotatingCardCarousel
              items={[
                {
                  id: "federal-courts",
                  icon: <Book className="h-6 w-6" />,
                  title: t('home.features.federalCourts'),
                  description: t('home.features.federalCourtsDesc'),
                },
                {
                  id: "state-laws",
                  icon: <FileText className="h-6 w-6" />,
                  title: t('home.features.stateLaws'),
                  description: t('home.features.stateLawsDesc'),
                },
                {
                  id: "analytics",
                  icon: <BarChart3 className="h-6 w-6" />,
                  title: t('home.features.analytics'),
                  description: t('home.features.analyticsDesc'),
                },
              ]}
              autoRotateInterval={5000}
            />
          </ScrollReveal>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-slate-50 dark:bg-slate-900/60 border-t border-border/30">
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

          {/* Expandable Trust Items */}
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

          {/* Disclaimer */}
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
