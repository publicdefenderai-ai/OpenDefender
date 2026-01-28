import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  Shield, 
  AlertTriangle, 
  Phone, 
  FileText, 
  Clock, 
  UserCheck, 
  Home, 
  CheckCircle, 
  XCircle, 
  Users, 
  Gavel, 
  BookOpen,
  Eye,
  ArrowRight,
  Flag,
  Building2,
  Heart,
  Scale,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "wouter";
import { useTranslation } from 'react-i18next';

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

function DeportationPhasesCarousel({ t }: { t: (key: string) => string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const phases = [
    {
      id: 'phase1',
      icon: <Eye className="h-6 w-6" />,
      title: t('immigration.deportationPhases.phase1.title'),
      color: 'blue',
      rightsTitle: t('immigration.deportationPhases.phase1.rightsTitle'),
      rights: [
        t('immigration.deportationPhases.phase1.rights.askLeave'),
        t('immigration.deportationPhases.phase1.rights.warrant'),
        t('immigration.deportationPhases.phase1.rights.silent'),
        t('immigration.deportationPhases.phase1.rights.attorney'),
      ],
      expectTitle: t('immigration.deportationPhases.phase1.expectTitle'),
      expectations: [
        t('immigration.deportationPhases.phase1.expect.approach'),
        t('immigration.deportationPhases.phase1.expect.documents'),
        t('immigration.deportationPhases.phase1.expect.adminWarrant'),
        t('immigration.deportationPhases.phase1.expect.detention'),
      ],
    },
    {
      id: 'phase2',
      icon: <Users className="h-6 w-6" />,
      title: t('immigration.deportationPhases.phase2.title'),
      color: 'orange',
      rightsTitle: t('immigration.deportationPhases.phase2.rightsTitle'),
      rights: [
        t('immigration.deportationPhases.phase2.rights.phone'),
        t('immigration.deportationPhases.phase2.rights.consulate'),
        t('immigration.deportationPhases.phase2.rights.interpreter'),
        t('immigration.deportationPhases.phase2.rights.charges'),
        t('immigration.deportationPhases.phase2.rights.bond'),
      ],
      expectTitle: t('immigration.deportationPhases.phase2.importantTitle'),
      expectations: [
        t('immigration.deportationPhases.phase2.important.duration'),
        t('immigration.deportationPhases.phase2.important.nta'),
        t('immigration.deportationPhases.phase2.important.mandatory'),
        t('immigration.deportationPhases.phase2.important.bondAmount'),
        t('immigration.deportationPhases.phase2.important.criminal'),
      ],
    },
    {
      id: 'phase3',
      icon: <Gavel className="h-6 w-6" />,
      title: t('immigration.deportationPhases.phase3.title'),
      color: 'purple',
      rightsTitle: t('immigration.deportationPhases.phase3.rightsTitle'),
      rights: [
        t('immigration.deportationPhases.phase3.rights.attorney'),
        t('immigration.deportationPhases.phase3.rights.interpreter'),
        t('immigration.deportationPhases.phase3.rights.examine'),
        t('immigration.deportationPhases.phase3.rights.present'),
        t('immigration.deportationPhases.phase3.rights.appeal'),
      ],
      expectTitle: t('immigration.deportationPhases.phase3.outcomesTitle'),
      expectations: [
        t('immigration.deportationPhases.phase3.outcomes.relief'),
        t('immigration.deportationPhases.phase3.outcomes.voluntary'),
        t('immigration.deportationPhases.phase3.outcomes.removal'),
        t('immigration.deportationPhases.phase3.outcomes.continuances'),
        t('immigration.deportationPhases.phase3.outcomes.closure'),
      ],
    },
    {
      id: 'phase4',
      icon: <FileText className="h-6 w-6" />,
      title: t('immigration.deportationPhases.phase4.title'),
      color: 'red',
      rightsTitle: t('immigration.deportationPhases.phase4.rightsTitle'),
      rights: [
        t('immigration.deportationPhases.phase4.rights.deadline'),
        t('immigration.deportationPhases.phase4.rights.federal'),
        t('immigration.deportationPhases.phase4.rights.stay'),
        t('immigration.deportationPhases.phase4.rights.motions'),
      ],
      expectTitle: t('immigration.deportationPhases.phase4.processTitle'),
      expectations: [
        t('immigration.deportationPhases.phase4.process.schedule'),
        t('immigration.deportationPhases.phase4.process.period'),
        t('immigration.deportationPhases.phase4.process.refusal'),
        t('immigration.deportationPhases.phase4.process.supervision'),
        t('immigration.deportationPhases.phase4.process.bar'),
      ],
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % phases.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [phases.length]);

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; ring: string }> = {
      blue: { bg: 'from-blue-500/20 via-blue-500/10', text: 'text-blue-600 dark:text-blue-400', ring: 'ring-blue-500/20' },
      orange: { bg: 'from-orange-500/20 via-orange-500/10', text: 'text-orange-600 dark:text-orange-400', ring: 'ring-orange-500/20' },
      purple: { bg: 'from-purple-500/20 via-purple-500/10', text: 'text-purple-600 dark:text-purple-400', ring: 'ring-purple-500/20' },
      red: { bg: 'from-red-500/20 via-red-500/10', text: 'text-red-600 dark:text-red-400', ring: 'ring-red-500/20' },
    };
    return colors[color] || colors.blue;
  };

  const activePhase = phases[activeIndex];
  const activeColors = getColorClasses(activePhase.color);

  return (
    <div className="relative">
      <div className="relative min-h-[420px] md:min-h-[350px]">
        <motion.div
          key={activePhase.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-foreground" data-testid={`text-${activePhase.id}-title`}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activeColors.bg} to-transparent flex items-center justify-center ring-1 ${activeColors.ring}`}>
                  <span className={activeColors.text}>{activePhase.icon}</span>
                </div>
                <div>
                  <Badge variant="outline" className="mb-1">Phase {activeIndex + 1} of {phases.length}</Badge>
                  <div className="text-xl">{activePhase.title}</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-foreground">{activePhase.rightsTitle}</h4>
                  <ul className="space-y-2 text-sm">
                    {activePhase.rights.map((right, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        {right}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-foreground">{activePhase.expectTitle}</h4>
                  <ul className="space-y-2 text-sm">
                    {activePhase.expectations.map((exp, i) => (
                      <li key={i}>• {exp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="flex justify-center gap-3 mt-8">
        {phases.map((phase, index) => (
          <button
            key={phase.id}
            onClick={() => setActiveIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 border-2 ${
              index === activeIndex
                ? 'bg-primary border-primary ring-2 ring-primary/30 ring-offset-2 ring-offset-background'
                : 'bg-transparent border-muted-foreground/50 hover:border-primary/50'
            }`}
            aria-label={`Go to phase ${index + 1}`}
            data-testid={`dot-phase-${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function ImmigrationGuidance() {
  useScrollToTop();
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section - Vivid Gradient Style */}
      <section className="vivid-header text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-white/20 via-white/10 to-transparent flex items-center justify-center mx-auto mb-8 ring-1 ring-white/20">
              <Flag className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white" data-testid="text-immigration-hero-title">
              {t('immigration.hero.title1')}<br />
              <span className="text-white/80">{t('immigration.hero.title2')}</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-4xl mx-auto leading-relaxed" data-testid="text-immigration-hero-subtitle">
              {t('immigration.hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Critical Alert - Below Hero */}
      <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-20 mb-8">
        <Alert className="bg-red-600 border-red-700 text-white shadow-lg">
          <AlertTriangle className="h-5 w-5 text-white" />
          <AlertDescription className="text-white font-semibold" data-testid="alert-critical-rights">
            <strong>{t('immigration.criticalAlert.title')}</strong> {t('immigration.criticalAlert.text')}
          </AlertDescription>
        </Alert>
      </div>

      {/* Emergency Rights Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-500/20 via-red-500/10 to-transparent flex items-center justify-center mx-auto mb-6 ring-1 ring-red-500/20">
                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6" data-testid="text-emergency-rights-title">
                {t('immigration.emergencyRights.title')}
              </h2>
              <p className="text-xl text-muted-foreground" data-testid="text-emergency-rights-subtitle">
                {t('immigration.emergencyRights.subtitle')}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            <ScrollReveal delay={0.1}>
              <Card className="hover:shadow-lg hover:border-primary/30 transition-all duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-foreground" data-testid="text-constitutional-rights-title">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 via-green-500/10 to-transparent flex items-center justify-center ring-1 ring-green-500/20">
                      <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    {t('immigration.emergencyRights.constitutionalTitle')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>{t('immigration.emergencyRights.constitutionalRights.silent.title')}</strong> {t('immigration.emergencyRights.constitutionalRights.silent.text')}
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>{t('immigration.emergencyRights.constitutionalRights.refuseSearch.title')}</strong> {t('immigration.emergencyRights.constitutionalRights.refuseSearch.text')}
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>{t('immigration.emergencyRights.constitutionalRights.attorney.title')}</strong> {t('immigration.emergencyRights.constitutionalRights.attorney.text')}
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>{t('immigration.emergencyRights.constitutionalRights.interpreter.title')}</strong> {t('immigration.emergencyRights.constitutionalRights.interpreter.text')}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card className="hover:shadow-lg hover:border-primary/30 transition-all duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-foreground" data-testid="text-what-not-to-do-title">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/20 via-red-500/10 to-transparent flex items-center justify-center ring-1 ring-red-500/20">
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    {t('immigration.emergencyRights.whatNotToDoTitle')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>{t('immigration.emergencyRights.whatNotToDo.lie.title')}</strong> {t('immigration.emergencyRights.whatNotToDo.lie.text')}
                      </div>
                    </div>
                    <div className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>{t('immigration.emergencyRights.whatNotToDo.run.title')}</strong> {t('immigration.emergencyRights.whatNotToDo.run.text')}
                      </div>
                    </div>
                    <div className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>{t('immigration.emergencyRights.whatNotToDo.sign.title')}</strong> {t('immigration.emergencyRights.whatNotToDo.sign.text')}
                      </div>
                    </div>
                    <div className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong>{t('immigration.emergencyRights.whatNotToDo.carryDocuments.title')}</strong> {t('immigration.emergencyRights.whatNotToDo.carryDocuments.text')}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Topic Navigation Cards */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center mx-auto mb-6 ring-1 ring-primary/20">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6" data-testid="text-detailed-guides-title">
                {t('immigration.hub.detailedGuides.title')}
              </h2>
              <p className="text-xl text-muted-foreground">
                {t('immigration.hub.detailedGuides.subtitle')}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ScrollReveal delay={0.1}>
              <Link href="/immigration-guidance/daca-tps">
                <Card className="h-full hover:shadow-lg hover:border-blue-500/50 transition-all duration-200 cursor-pointer group">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent flex items-center justify-center ring-1 ring-blue-500/20 flex-shrink-0">
                        <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors" data-testid="link-daca-tps">
                          {t('immigration.hub.detailedGuides.dacaCard.title')}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t('immigration.hub.detailedGuides.dacaCard.description')}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-600 transition-colors flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <Link href="/immigration-guidance/workplace-raids">
                <Card className="h-full hover:shadow-lg hover:border-orange-500/50 transition-all duration-200 cursor-pointer group">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-transparent flex items-center justify-center ring-1 ring-orange-500/20 flex-shrink-0">
                        <Building2 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg group-hover:text-orange-600 transition-colors" data-testid="link-workplace-raids">
                          {t('immigration.hub.detailedGuides.raidsCard.title')}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t('immigration.hub.detailedGuides.raidsCard.description')}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-orange-600 transition-colors flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Link href="/immigration-guidance/family-planning">
                <Card className="h-full hover:shadow-lg hover:border-purple-500/50 transition-all duration-200 cursor-pointer group">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-transparent flex items-center justify-center ring-1 ring-purple-500/20 flex-shrink-0">
                        <Heart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg group-hover:text-purple-600 transition-colors" data-testid="link-family-planning">
                          {t('immigration.hub.detailedGuides.familyCard.title')}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t('immigration.hub.detailedGuides.familyCard.description')}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-purple-600 transition-colors flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </ScrollReveal>

            <ScrollReveal delay={0.25}>
              <Link href="/immigration-guidance/bond-hearings">
                <Card className="h-full hover:shadow-lg hover:border-green-500/50 transition-all duration-200 cursor-pointer group">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 via-green-500/10 to-transparent flex items-center justify-center ring-1 ring-green-500/20 flex-shrink-0">
                        <Scale className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg group-hover:text-green-600 transition-colors" data-testid="link-bond-hearings">
                          {t('immigration.hub.detailedGuides.bondCard.title')}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t('immigration.hub.detailedGuides.bondCard.description')}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-green-600 transition-colors flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <Link href="/immigration-guidance/find-attorney">
                <Card className="h-full hover:shadow-lg hover:border-red-500/50 transition-all duration-200 cursor-pointer group">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 via-red-500/10 to-transparent flex items-center justify-center ring-1 ring-red-500/20 flex-shrink-0">
                        <UserCheck className="h-6 w-6 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg group-hover:text-red-600 transition-colors" data-testid="link-find-attorney">
                          {t('immigration.hub.detailedGuides.attorneyCard.title')}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t('immigration.hub.detailedGuides.attorneyCard.description')}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-red-600 transition-colors flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </ScrollReveal>

            <ScrollReveal delay={0.35}>
              <Link href="/immigration-guidance/find-detained">
                <Card className="h-full hover:shadow-lg hover:border-cyan-500/50 transition-all duration-200 cursor-pointer group">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 via-cyan-500/10 to-transparent flex items-center justify-center ring-1 ring-cyan-500/20 flex-shrink-0">
                        <Eye className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg group-hover:text-cyan-600 transition-colors" data-testid="link-find-detained">
                          {t('immigration.hub.detailedGuides.findDetainedCard.title')}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t('immigration.hub.detailedGuides.findDetainedCard.description')}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-cyan-600 transition-colors flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <Link href="/immigration-guidance/know-your-rights">
                <Card className="h-full hover:shadow-lg hover:border-emerald-500/50 transition-all duration-200 cursor-pointer group">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent flex items-center justify-center ring-1 ring-emerald-500/20 flex-shrink-0">
                        <FileText className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg group-hover:text-emerald-600 transition-colors" data-testid="link-know-your-rights">
                          {t('immigration.hub.detailedGuides.kyrCard.title')}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t('immigration.hub.detailedGuides.kyrCard.description')}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-emerald-600 transition-colors flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </ScrollReveal>

            <ScrollReveal delay={0.45}>
              <Link href="/immigration-guidance/raids-toolkit">
                <Card className="h-full hover:shadow-lg hover:border-amber-500/50 transition-all duration-200 cursor-pointer group">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-transparent flex items-center justify-center ring-1 ring-amber-500/20 flex-shrink-0">
                        <Flag className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg group-hover:text-amber-600 transition-colors" data-testid="link-raids-toolkit">
                          {t('immigration.hub.detailedGuides.raidsToolkitCard.title')}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t('immigration.hub.detailedGuides.raidsToolkitCard.description')}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-amber-600 transition-colors flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Deportation Process Phases - 3D Carousel */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center mx-auto mb-6 ring-1 ring-primary/20">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6" data-testid="text-deportation-phases-title">
                {t('immigration.deportationPhases.title')}
              </h2>
              <p className="text-xl text-muted-foreground" data-testid="text-deportation-phases-subtitle">
                {t('immigration.deportationPhases.subtitle')}
              </p>
            </div>
          </ScrollReveal>

          <DeportationPhasesCarousel t={t} />
        </div>
      </section>

      {/* Special Protections */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500/20 via-green-500/10 to-transparent flex items-center justify-center mx-auto mb-6 ring-1 ring-green-500/20">
                <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6" data-testid="text-special-protections-title">
                {t('immigration.specialProtections.title')}
              </h2>
              <p className="text-xl text-muted-foreground" data-testid="text-special-protections-subtitle">
                {t('immigration.specialProtections.subtitle')}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            <ScrollReveal delay={0.1}>
              <Card className="hover:shadow-lg hover:border-primary/30 transition-all duration-200 h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-foreground" data-testid="text-us-citizens-title">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 via-green-500/10 to-transparent flex items-center justify-center ring-1 ring-green-500/20">
                      <UserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    {t('immigration.specialProtections.usCitizens.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• {t('immigration.specialProtections.usCitizens.items.noDeportation')}</li>
                    <li>• {t('immigration.specialProtections.usCitizens.items.detained')}</li>
                    <li>• {t('immigration.specialProtections.usCitizens.items.proof')}</li>
                    <li>• {t('immigration.specialProtections.usCitizens.items.contact')}</li>
                    <li>• {t('immigration.specialProtections.usCitizens.items.complaints')}</li>
                  </ul>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card className="hover:shadow-lg hover:border-primary/30 transition-all duration-200 h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-foreground" data-testid="text-vulnerable-populations-title">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent flex items-center justify-center ring-1 ring-blue-500/20">
                      <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    {t('immigration.specialProtections.vulnerable.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• {t('immigration.specialProtections.vulnerable.pregnant')}</li>
                    <li>• {t('immigration.specialProtections.vulnerable.nursing')}</li>
                    <li>• {t('immigration.specialProtections.vulnerable.minors')}</li>
                    <li>• {t('immigration.specialProtections.vulnerable.mentallyIll')}</li>
                    <li>• {t('immigration.specialProtections.vulnerable.trafficking')}</li>
                  </ul>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <Card className="hover:shadow-lg hover:border-primary/30 transition-all duration-200 h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-foreground" data-testid="text-sanctuary-jurisdictions-title">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-transparent flex items-center justify-center ring-1 ring-purple-500/20">
                      <Home className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    {t('immigration.specialProtections.sanctuary.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• {t('immigration.specialProtections.sanctuary.items.policies')}</li>
                    <li>• {t('immigration.specialProtections.sanctuary.items.notice')}</li>
                    <li>• {t('immigration.specialProtections.sanctuary.items.know')}</li>
                    <li>• {t('immigration.specialProtections.sanctuary.items.canOperate')}</li>
                    <li>• {t('immigration.specialProtections.sanctuary.items.contact')}</li>
                  </ul>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center mx-auto mb-6 ring-1 ring-primary/20">
                <Phone className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6" data-testid="text-emergency-resources-title">
                {t('immigration.resources.title')}
              </h2>
              <p className="text-xl text-muted-foreground" data-testid="text-emergency-resources-subtitle">
                {t('immigration.resources.subtitle')}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            <ScrollReveal delay={0.1}>
              <Card className="hover:shadow-lg hover:border-primary/30 transition-all duration-200 h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-foreground" data-testid="text-national-hotlines-title">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent flex items-center justify-center ring-1 ring-blue-500/20">
                      <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    {t('immigration.resources.hotlines.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <strong className="text-lg">{t('immigration.resources.hotlines.nif.name')}</strong>
                      <p className="text-2xl font-bold text-primary">{t('immigration.resources.hotlines.nif.number')}</p>
                      <p className="text-sm text-muted-foreground">{t('immigration.resources.hotlines.nif.description')}</p>
                    </div>
                    <div>
                      <strong className="text-lg">{t('immigration.resources.hotlines.aclu.name')}</strong>
                      <p className="text-2xl font-bold text-primary">{t('immigration.resources.hotlines.aclu.number')}</p>
                      <p className="text-sm text-muted-foreground">{t('immigration.resources.hotlines.aclu.description')}</p>
                    </div>
                    <div>
                      <strong className="text-lg">{t('immigration.resources.hotlines.doj.name')}</strong>
                      <p className="text-2xl font-bold text-primary">{t('immigration.resources.hotlines.doj.number')}</p>
                      <p className="text-sm text-muted-foreground">{t('immigration.resources.hotlines.doj.description')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card className="hover:shadow-lg hover:border-primary/30 transition-all duration-200 h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-foreground" data-testid="text-locator-services-title">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 via-green-500/10 to-transparent flex items-center justify-center ring-1 ring-green-500/20">
                      <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    {t('immigration.resources.locators.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <strong className="text-lg">{t('immigration.resources.locators.iceDetainee.name')}</strong>
                      <p className="text-lg font-bold text-primary">{t('immigration.resources.locators.iceDetainee.url')}</p>
                      <p className="text-sm text-muted-foreground">{t('immigration.resources.locators.iceDetainee.description')}</p>
                    </div>
                    <div>
                      <strong className="text-lg">{t('immigration.resources.locators.legalServices.name')}</strong>
                      <p className="text-lg font-bold text-primary">{t('immigration.resources.locators.legalServices.url')}</p>
                      <p className="text-sm text-muted-foreground">{t('immigration.resources.locators.legalServices.description')}</p>
                    </div>
                    <div>
                      <strong className="text-lg">{t('immigration.resources.locators.consulate.name')}</strong>
                      <p className="text-lg font-bold text-primary">{t('immigration.resources.locators.consulate.url')}</p>
                      <p className="text-sm text-muted-foreground">{t('immigration.resources.locators.consulate.description')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>

          {/* Prepare Now Section */}
          <ScrollReveal delay={0.3}>
            <Card className="mt-8 hover:shadow-lg hover:border-primary/30 transition-all duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-foreground" data-testid="text-prepare-now-title">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-transparent flex items-center justify-center ring-1 ring-purple-500/20">
                    <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  {t('immigration.resources.prepareTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 grid md:grid-cols-2 gap-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{t('immigration.resources.prepare.plan')}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{t('immigration.resources.prepare.documents')}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{t('immigration.resources.prepare.attorney')}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{t('immigration.resources.prepare.redCard')}</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{t('immigration.resources.prepare.trustee')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-foreground mb-8" data-testid="text-get-additional-help-title">
              {t('immigration.finalCta.title')}
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/rights-info">
                <Button variant="default" size="lg" className="w-full sm:w-auto" data-testid="button-learn-rights">
                  <Shield className="mr-2 h-5 w-5" />
                  {t('immigration.finalCta.rights')}
                </Button>
              </Link>
              <Link href="/how-to">
                <Button variant="outline" size="lg" className="w-full sm:w-auto" data-testid="button-find-resources">
                  <ArrowRight className="mr-2 h-5 w-5" />
                  {t('immigration.finalCta.local')}
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
