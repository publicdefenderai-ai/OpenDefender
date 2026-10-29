import { ImmigrationSituations } from "@/components/immigration/immigration-situations";
import { BrandShieldIcon } from "@/components/brand-logo";
import { motion } from "framer-motion";
import { 
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
  Scale,
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
import { RapidlyEvolvingNotice } from "@/components/immigration/rapidly-evolving-notice";
import { RapidResponseSection } from "@/components/immigration/rapid-response-section";

function DeportationPhasesList({ t }: { t: (key: string) => string }) {
  
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

  return (
    <div className="immigration-phases">
      {phases.map((phase, index) => (
        <details key={phase.id} className="immigration-phase" open={index === 0}>
          <summary>
            <span className="immigration-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <h3 data-testid={`text-${phase.id}-title`}>{phase.title}</h3>
            <span className="immigration-expand" aria-hidden="true" />
          </summary>
          <div className="immigration-phase-body">
            <div><h4>{phase.rightsTitle}</h4><ul>{phase.rights.map((right, i) => <li key={i}>{right}</li>)}</ul></div>
            <div><h4>{phase.expectTitle}</h4><ul>{phase.expectations.map((expectation, i) => <li key={i}>{expectation}</li>)}</ul></div>
          </div>
        </details>
      ))}
    </div>
  );
}

export default function ImmigrationGuidance() {
  useScrollToTop();
  const { t } = useTranslation();
  
  return (
    <div className="design-immigration min-h-screen bg-background">
      <Header />

      <section className="immigration-intro">
        <div className="immigration-intro-grid">
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight" data-testid="text-immigration-hero-title">
              <span className="immigration-heading-line">{t('immigration.hero.title1')}</span>
              <span className="immigration-heading-line text-[var(--editorial-signal)]">{t('immigration.hero.title2')}</span>
            </h1>
            <p className="text-lg md:text-xl max-w-4xl leading-relaxed" data-testid="text-immigration-hero-subtitle">
              {t('immigration.hero.subtitle')}
            </p>
            <Button asChild className="mt-6 gap-2">
              <a href="#rapid-response">
                {t('immigration.hero.nextStep', 'See emergency resources')}
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </motion.div>
          <div className="immigration-arch-art" aria-hidden="true"><span className="immigration-arch" /><span className="immigration-plane" /></div>
        </div>
      </section>
      <nav className="immigration-start" aria-label={t('design.immigrationStart', 'Immigration starting points')}>
        {[
          ['know-your-rights', 'kyrCard'],
          ['find-detained', 'findDetainedCard'],
          ['find-attorney', 'attorneyCard'],
        ].map(([route, key], index) => <Link key={route} href={`/immigration-guidance/${route}`} className="immigration-route">
          <span className="immigration-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <span><strong>{t(`immigration.hub.detailedGuides.${key}.title`)}</strong><small>{t(`immigration.hub.detailedGuides.${key}.description`)}</small></span>
          <span aria-hidden="true">›</span>
        </Link>)}
      </nav>

      {/* Critical Alert - Below Hero */}
      <div className="max-w-4xl mx-auto px-4 mt-6 mb-4">
        <Alert className="bg-red-600 border-red-700 text-white shadow-lg">
          <AlertTriangle className="h-5 w-5 text-white" />
          <AlertDescription className="text-white font-semibold" data-testid="alert-critical-rights">
            <strong>{t('immigration.criticalAlert.title')}</strong> {t('immigration.criticalAlert.text')}
          </AlertDescription>
        </Alert>
      </div>

      <RapidlyEvolvingNotice />

      {/* Rapid Response Hotlines */}
      <RapidResponseSection />

      {/* Emergency Rights Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mx-auto mb-5">
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
              <Card className="editorial-card editorial-card-interactive">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-foreground" data-testid="text-constitutional-rights-title">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <BrandShieldIcon size={20} />
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
              <Card className="editorial-card editorial-card-interactive">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-foreground" data-testid="text-what-not-to-do-title">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
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

      {/* AOS policy update — May 2026 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Alert className="border-blue-300 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-700">
          <AlertTriangle className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <AlertDescription className="text-blue-900 dark:text-blue-200">
            <span className="block text-xs font-semibold uppercase tracking-wider text-blue-500 dark:text-blue-400 mb-1">
              {t('immigration.aosNotice.date')}
            </span>
            <strong className="block text-sm mb-1">{t('immigration.aosNotice.title')}</strong>
            <span className="text-sm leading-relaxed">{t('immigration.aosNotice.body')}</span>
            <span className="block mt-1.5 text-sm font-medium">{t('immigration.aosNotice.cta')}</span>
          </AlertDescription>
        </Alert>
      </div>

      <ImmigrationSituations />

      {/* Deportation Process Phases - 3D Carousel */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mx-auto mb-5">
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

          <DeportationPhasesList t={t} />
        </div>
      </section>

      {/* Special Protections */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mx-auto mb-5">
                <BrandShieldIcon size={32} />
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
              <Card className="editorial-card editorial-card-interactive h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-foreground" data-testid="text-us-citizens-title">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
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
              <Card className="editorial-card editorial-card-interactive h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-foreground" data-testid="text-vulnerable-populations-title">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
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
              <Card className="editorial-card editorial-card-interactive h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-foreground" data-testid="text-sanctuary-jurisdictions-title">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
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
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mx-auto mb-5">
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
              <Card className="editorial-card editorial-card-interactive h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-foreground" data-testid="text-national-hotlines-title">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
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
              <Card className="editorial-card editorial-card-interactive h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-foreground" data-testid="text-locator-services-title">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    {t('immigration.resources.locators.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <strong className="text-lg">{t('immigration.resources.locators.iceDetainee.name')}</strong>
                      <p className="text-lg font-bold">
                        <a
                          href={`https://${t('immigration.resources.locators.iceDetainee.url')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline break-all"
                        >
                          {t('immigration.resources.locators.iceDetainee.url')}
                        </a>
                      </p>
                      <p className="text-sm text-muted-foreground">{t('immigration.resources.locators.iceDetainee.description')}</p>
                    </div>
                    <div>
                      <strong className="text-lg">{t('immigration.resources.locators.legalServices.name')}</strong>
                      <p className="text-lg font-bold">
                        <a
                          href={`https://${t('immigration.resources.locators.legalServices.url')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline break-all"
                        >
                          {t('immigration.resources.locators.legalServices.url')}
                        </a>
                      </p>
                      <p className="text-sm text-muted-foreground">{t('immigration.resources.locators.legalServices.description')}</p>
                    </div>
                    <div>
                      <strong className="text-lg">{t('immigration.resources.locators.consulate.name')}</strong>
                      <p className="text-lg font-bold">
                        <a
                          href={`https://${t('immigration.resources.locators.consulate.url')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline break-all"
                        >
                          {t('immigration.resources.locators.consulate.url')}
                        </a>
                      </p>
                      <p className="text-sm text-muted-foreground">{t('immigration.resources.locators.consulate.description')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>

          {/* Prepare Now Section */}
          <ScrollReveal delay={0.3}>
            <Card className="editorial-card editorial-card-interactive mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-foreground" data-testid="text-prepare-now-title">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
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
                  <BrandShieldIcon size={20} className="mr-2" />
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
