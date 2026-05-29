import { BrandShieldIcon } from "@/components/brand-logo";
import { motion } from "framer-motion";
import { Users, Phone, FileText, Clock, Heart, MessageSquare, AlertCircle, AlertTriangle, CheckCircle, ArrowRight, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Link } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

export default function FriendsFamily() {
  useScrollToTop();
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section - Rose Vivid Header */}
      <section className="vivid-header-rose py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 vivid-header-content">
          <ScrollReveal>
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-white">
                {t('friendsFamily.hero.title')}
              </h1>
              <p className="text-lg text-white/85 max-w-2xl mx-auto">
                {t('friendsFamily.hero.subtitle')}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Orientation — what this site can do for you */}
      <section className="py-10 bg-background border-b border-border/60">
        <div className="max-w-5xl mx-auto px-4">
          <ScrollReveal>
            <p className="text-base font-semibold text-foreground mb-1">{t('friendsFamily.orientation.heading')}</p>
            <p className="text-sm text-muted-foreground mb-6">{t('friendsFamily.orientation.subheading')}</p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  href: "/first-24-hours",
                  Icon: Clock,
                  color: "text-slate-600 dark:text-slate-400",
                  bg: "bg-slate-50 dark:bg-slate-900/40",
                  accent: "#1e3a5f",
                  titleKey: "friendsFamily.orientation.first24h.title",
                  descKey:  "friendsFamily.orientation.first24h.desc",
                  ctaKey:   "friendsFamily.orientation.first24h.cta",
                },
                {
                  href: "/support",
                  Icon: Heart,
                  color: "text-rose-600 dark:text-rose-400",
                  bg: "bg-rose-50/60 dark:bg-rose-900/10",
                  accent: "#8b2252",
                  titleKey: "friendsFamily.orientation.lifeSupport.title",
                  descKey:  "friendsFamily.orientation.lifeSupport.desc",
                  ctaKey:   "friendsFamily.orientation.lifeSupport.cta",
                },
                {
                  href: "/case-guidance",
                  Icon: MessageSquare,
                  color: "text-teal-600 dark:text-teal-400",
                  bg: "bg-teal-50/60 dark:bg-teal-900/10",
                  accent: "#0f766e",
                  titleKey: "friendsFamily.orientation.guidance.title",
                  descKey:  "friendsFamily.orientation.guidance.desc",
                  ctaKey:   "friendsFamily.orientation.guidance.cta",
                },
              ].map(({ href, Icon, color, bg, accent, titleKey, descKey, ctaKey }) => (
                <Link key={href} href={href}>
                  <div
                    className={`rounded-xl border border-l-4 p-4 h-full cursor-pointer transition-all hover:shadow-md hover:-translate-y-1 ${bg}`}
                    style={{ borderLeftColor: accent }}
                  >
                    <Icon className={`h-5 w-5 mb-3 ${color}`} strokeWidth={1.75} />
                    <p className="font-semibold text-foreground text-sm mb-1">{t(titleKey)}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">{t(descKey)}</p>
                    <p className={`text-xs font-semibold flex items-center gap-1 ${color}`}>
                      {t(ctaKey)} <ArrowRight className="h-3 w-3" />
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Immediate Actions */}
      <section className="py-16 bg-background">
        <div className="max-w-5xl mx-auto px-4">
          <ScrollReveal>
            <Alert className="mb-12 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-700">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                <strong>{t('friendsFamily.criticalAlert.title')}</strong> {t('friendsFamily.criticalAlert.text')}
              </AlertDescription>
            </Alert>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              {t('friendsFamily.sectionTitle')}
            </h2>
          </ScrollReveal>

          <div className="space-y-6">
            {/* Step 1 */}
            <ScrollReveal delay={0.2}>
              <Card className="border-l-4 border-l-blue-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      1
                    </div>
                    <span>{t('friendsFamily.step1.title')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    {t('friendsFamily.step1.description')}
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        {t('friendsFamily.step1.howToFindTitle')}
                      </h4>
                      <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                        <li>• {t('friendsFamily.step1.howToFind1')}</li>
                        <li>• {t('friendsFamily.step1.howToFind2')}</li>
                        <li>• {t('friendsFamily.step1.howToFind3')}</li>
                        <li>• {t('friendsFamily.step1.howToFind4')}</li>
                      </ul>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                        {t('friendsFamily.step1.infoToProvideTitle')}
                      </h4>
                      <ul className="space-y-1 text-sm text-green-800 dark:text-green-200">
                        <li>• {t('friendsFamily.step1.infoToProvide1')}</li>
                        <li>• {t('friendsFamily.step1.infoToProvide2')}</li>
                        <li>• {t('friendsFamily.step1.infoToProvide3')}</li>
                        <li>• {t('friendsFamily.step1.infoToProvide4')}</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Step 2 */}
            <ScrollReveal delay={0.3}>
              <Card className="border-l-4 border-l-green-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      2
                    </div>
                    <span>{t('friendsFamily.step2.title')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    {t('friendsFamily.step2.description')}
                  </p>
                  
                  <div className="space-y-3">
                    <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-800 dark:text-amber-200">
                        <strong>{t('friendsFamily.step2.alertTitle')}</strong> {t('friendsFamily.step2.alertText')}
                      </AlertDescription>
                    </Alert>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-muted p-4 rounded-lg flex flex-col">
                        <h4 className="font-semibold mb-2">{t('friendsFamily.step2.publicDefenderTitle')}</h4>
                        <p className="text-sm text-muted-foreground flex-1">
                          {t('friendsFamily.step2.publicDefenderDesc')}
                        </p>
                        <Link
                          href="/right-to-counsel"
                          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                        >
                          Learn about your right to a public defender
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                      
                      <div className="bg-muted p-4 rounded-lg flex flex-col">
                        <h4 className="font-semibold mb-2">{t('friendsFamily.step2.legalAidTitle')}</h4>
                        <p className="text-sm text-muted-foreground flex-1">
                          {t('friendsFamily.step2.legalAidDesc')}
                        </p>
                        <Link
                          href="/legal-aid"
                          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                        >
                          Find legal aid organizations near you
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                      
                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">{t('friendsFamily.step2.privateAttorneyTitle')}</h4>
                        <p className="text-sm text-muted-foreground">
                          {t('friendsFamily.step2.privateAttorneyDesc')}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-lg border border-border bg-background p-4">
                      <h4 className="font-semibold text-sm mb-2">If the public defender's office isn't available</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        When a public defender has a conflict of interest or the office is at capacity, the court appoints a private attorney from a local panel instead. The person still receives free representation. The process is the same.
                      </p>
                      <ul className="space-y-1.5 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 mt-0.5">•</span>
                          Check the court's website for an "assigned counsel" or "appointment panel" section.
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 mt-0.5">•</span>
                          Ask the court clerk directly. They administer the panel and know who is on it.
                        </li>
                      </ul>
                    </div>

                    <div className="mt-4 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 p-4">
                      <h4 className="font-semibold text-sm mb-2">Preparing for the bail hearing</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        The bail hearing often happens within 24 to 48 hours of arrest. Gathering information before it starts can help the attorney argue for release. Employment records, proof of housing, names of family members in the area, and character references all factor in.
                      </p>
                      <Link
                        href="/support/court-logistics/bail-preparation"
                        className="inline-flex items-center gap-1 text-sm font-medium text-amber-700 dark:text-amber-400 hover:underline"
                      >
                        Bail Preparation Checklist and Templates <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>

                    <div className="mt-4 rounded-lg border border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/20 p-4">
                      <h4 className="font-semibold text-sm mb-2">If this is a drug-related case</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Courts in drug cases often consider whether the defendant has already enrolled in a treatment program when deciding between incarceration and alternatives. Enrolling before the first court appearance can matter. A letter from the program confirming enrollment is something the attorney can present.
                      </p>
                      <Link
                        href="/support/mental-health#treatment-connection"
                        className="inline-flex items-center gap-1 text-sm font-medium text-teal-700 dark:text-teal-400 hover:underline"
                      >
                        Treatment Connection Guide: How to Enroll and Document It <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Step 3 */}
            <ScrollReveal delay={0.4}>
              <Card className="border-l-4 border-l-purple-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      3
                    </div>
                    <span>{t('friendsFamily.step3.title')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {t('friendsFamily.step3.description')}
                  </p>
                  
                  <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      {t('friendsFamily.step3.keyInfoTitle')}
                    </h4>
                    <ul className="grid md:grid-cols-2 gap-2 text-sm text-purple-800 dark:text-purple-200">
                      <li>• {t('friendsFamily.step3.keyInfo1')}</li>
                      <li>• {t('friendsFamily.step3.keyInfo2')}</li>
                      <li>• {t('friendsFamily.step3.keyInfo3')}</li>
                      <li>• {t('friendsFamily.step3.keyInfo4')}</li>
                      <li>• {t('friendsFamily.step3.keyInfo5')}</li>
                      <li>• {t('friendsFamily.step3.keyInfo6')}</li>
                      <li>• {t('friendsFamily.step3.keyInfo7')}</li>
                      <li>• {t('friendsFamily.step3.keyInfo8')}</li>
                      <li>• {t('friendsFamily.step3.keyInfo9')}</li>
                    </ul>
                  </div>

                  <div className="rounded-md border border-border/60 bg-muted/30 p-3 text-sm text-muted-foreground leading-relaxed">
                    {t('friendsFamily.step3.prosecutorNote')}{" "}
                    <Link href="/legal-glossary?search=prosecutor" className="underline underline-offset-2 font-medium text-foreground hover:text-foreground/80 transition-colors">
                      {t('friendsFamily.step3.prosecutorCta')} →
                    </Link>
                  </div>

                  {/* Toolkit prompt — contextual entry inside Step 3 */}
                  <div className="mt-4 rounded-xl border border-border bg-muted/30 p-4 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">Ready to collect this information?</p>
                      <p className="text-xs text-muted-foreground mt-0.5">The Family Toolkit has a fillable Contact Info Kit, a court record lookup, and more.</p>
                    </div>
                    <Link href="/friends-family/toolkit" className="flex-shrink-0">
                      <Button size="sm" variant="outline" className="whitespace-nowrap">
                        Open toolkit →
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Step 4 */}
            <ScrollReveal delay={0.5}>
              <Card className="border-l-4 border-l-orange-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      4
                    </div>
                    <span>{t('friendsFamily.step4.title')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    {t('friendsFamily.step4.description')}
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-3">{t('friendsFamily.step4.bailOptionsTitle')}</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                          <span><strong>{t('friendsFamily.step4.cashBailTitle')}</strong> {t('friendsFamily.step4.cashBailDesc')}</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                          <span><strong>{t('friendsFamily.step4.bailBondTitle')}</strong> {t('friendsFamily.step4.bailBondDesc')}</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                          <span><strong>{t('friendsFamily.step4.propertyBondTitle')}</strong> {t('friendsFamily.step4.propertyBondDesc')}</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                          <span><strong>{t('friendsFamily.step4.rorTitle')}</strong> {t('friendsFamily.step4.rorDesc')}</span>
                        </li>
                      </ul>
                    </div>
                    
                    <Alert className="h-fit">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>{t('friendsFamily.step4.warningTitle')}</strong> {t('friendsFamily.step4.warningText')}
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Step 5 */}
            <ScrollReveal delay={0.6}>
              <Card className="border-l-4 border-l-indigo-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      5
                    </div>
                    <span>{t('friendsFamily.step5.title')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {t('friendsFamily.step5.description')}
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-indigo-50 dark:bg-indigo-950 p-4 rounded-lg">
                      <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
                        {t('friendsFamily.step5.practicalHelpTitle')}
                      </h4>
                      <ul className="space-y-1 text-sm text-indigo-800 dark:text-indigo-200">
                        <li>• {t('friendsFamily.step5.practicalHelp1')}</li>
                        <li>• {t('friendsFamily.step5.practicalHelp2')}</li>
                        <li>• {t('friendsFamily.step5.practicalHelp3')}</li>
                        <li>• {t('friendsFamily.step5.practicalHelp4')}</li>
                        <li>• {t('friendsFamily.step5.practicalHelp5')}</li>
                        <li>• {t('friendsFamily.step5.practicalHelp6')}</li>
                        <li>• Start planning for re-entry now:{" "}
                          <Link href="/support/reentry" className="underline underline-offset-2 font-medium">
                            ID, housing, employment, and voting rights →
                          </Link>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                        {t('friendsFamily.step5.emotionalSupportTitle')}
                      </h4>
                      <ul className="space-y-1 text-sm text-green-800 dark:text-green-200">
                        <li>• {t('friendsFamily.step5.emotionalSupport1')}</li>
                        <li>• {t('friendsFamily.step5.emotionalSupport2')}</li>
                        <li>• {t('friendsFamily.step5.emotionalSupport3')}</li>
                        <li>• {t('friendsFamily.step5.emotionalSupport4')}</li>
                        <li>• {t('friendsFamily.step5.emotionalSupport5')}</li>
                        <li>• {t('friendsFamily.step5.emotionalSupport6')}</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Probation / Parole — family-specific section */}
      <section className="py-14 bg-amber-50/60 dark:bg-amber-900/10 border-y border-amber-200 dark:border-amber-800/40">
        <div className="max-w-5xl mx-auto px-4">
          <ScrollReveal>
            <div className="flex items-start gap-3 mb-6">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">{t('friendsFamily.probationParole.sectionTitle')}</h2>
                <p className="text-sm text-muted-foreground">{t('friendsFamily.probationParole.sectionSubtitle')}</p>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-4">
            <ScrollReveal delay={0.1}>
              <Card className="border-amber-200 dark:border-amber-800/60 h-full">
                <CardContent className="p-4">
                  <p className="font-semibold text-sm text-foreground mb-1">{t('friendsFamily.probationParole.holdTitle')}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t('friendsFamily.probationParole.holdText')}</p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card className="border-amber-200 dark:border-amber-800/60 h-full">
                <CardContent className="p-4">
                  <p className="font-semibold text-sm text-foreground mb-1">{t('friendsFamily.probationParole.facilityTitle')}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t('friendsFamily.probationParole.facilityText')}</p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <Card className="border-amber-200 dark:border-amber-800/60 h-full">
                <CardContent className="p-4">
                  <p className="font-semibold text-sm text-foreground mb-1">{t('friendsFamily.probationParole.parallelTitle')}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t('friendsFamily.probationParole.parallelText')}</p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <Card className="border-amber-200 dark:border-amber-800/60 h-full">
                <CardContent className="p-4">
                  <p className="font-semibold text-sm text-foreground mb-1">{t('friendsFamily.probationParole.poTitle')}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t('friendsFamily.probationParole.poText')}</p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.5}>
            <p className="text-xs text-muted-foreground mt-4 px-1">{t('friendsFamily.probationParole.disclaimer')}</p>
          </ScrollReveal>
        </div>
      </section>

      {/* Following the Case */}
      <section className="py-14 bg-background border-b border-border/60">
        <div className="max-w-5xl mx-auto px-4">
          <ScrollReveal>
            <div className="flex items-start gap-3 mb-6">
              <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xl font-bold text-foreground mb-1">{t('friendsFamily.followingCase.sectionTitle')}</h2>
                <p className="text-sm text-muted-foreground">{t('friendsFamily.followingCase.sectionSubtitle')}</p>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-4">
            <ScrollReveal delay={0.1}>
              <Card className="h-full">
                <CardContent className="p-4">
                  <p className="font-semibold text-sm text-foreground mb-1">{t('friendsFamily.followingCase.courtDocketTitle')}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t('friendsFamily.followingCase.courtDocketText')}</p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card className="h-full">
                <CardContent className="p-4">
                  <p className="font-semibold text-sm text-foreground mb-1">{t('friendsFamily.followingCase.hearingDatesTitle')}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t('friendsFamily.followingCase.hearingDatesText')}</p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <Card className="h-full">
                <CardContent className="p-4">
                  <p className="font-semibold text-sm text-foreground mb-1">{t('friendsFamily.followingCase.vineTitle')}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t('friendsFamily.followingCase.vineText')}</p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <Card className="h-full">
                <CardContent className="p-4">
                  <p className="font-semibold text-sm text-foreground mb-1">{t('friendsFamily.followingCase.federalTitle')}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t('friendsFamily.followingCase.federalText')}</p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.5}>
            <p className="text-xs text-muted-foreground mt-4 px-1">{t('friendsFamily.followingCase.continuanceNote')}</p>
          </ScrollReveal>
        </div>
      </section>

      {/* Important Warnings */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center text-foreground mb-8">
              {t('friendsFamily.warnings.title')}
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6">
            <ScrollReveal delay={0.1}>
              <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-700">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-red-800 dark:text-red-200">
                  <strong>{t('friendsFamily.warnings.jailCallsTitle')}</strong> {t('friendsFamily.warnings.jailCallsText')}
                </AlertDescription>
              </Alert>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertDescription className="text-amber-800 dark:text-amber-200">
                  <strong>{t('friendsFamily.warnings.interferenceTitle')}</strong> {t('friendsFamily.warnings.interferenceText')}
                </AlertDescription>
              </Alert>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.3}>
            <Alert className="mt-6 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700">
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                <div className="flex items-start gap-3">
                  <BrandShieldIcon size={16} className="mt-0.5 flex-shrink-0" />
                  <span><strong>{t('friendsFamily.disclaimer.title')}</strong> {t('friendsFamily.disclaimer.text')}</span>
                </div>
              </AlertDescription>
            </Alert>
          </ScrollReveal>
        </div>
      </section>

      {/* Bottom toolkit CTA */}
      <section className="py-10 bg-background border-t border-border/60">
        <div className="max-w-5xl mx-auto px-4">
          <ScrollReveal>
            <div className="rounded-2xl border border-border bg-muted/20 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-bold text-foreground mb-1">Now use the Family Toolkit</p>
                <p className="text-sm text-muted-foreground max-w-md">Collect contact information, look up court records, and track what needs certified mail — all in one place.</p>
              </div>
              <Link href="/friends-family/toolkit" className="flex-shrink-0">
                <Button className="whitespace-nowrap">
                  Open toolkit →
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />

      {/* Privacy Footer Banner */}
      <div className="legal-blue text-white py-3 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2">
            <BrandShieldIcon size={16} />
            <span className="text-sm font-medium">
              <strong>{t('friendsFamily.privacyBanner.title')}</strong> {t('friendsFamily.privacyBanner.text')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
