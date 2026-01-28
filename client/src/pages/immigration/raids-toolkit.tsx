import { motion } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  Phone,
  ExternalLink,
  CheckCircle2,
  FileText,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { PageBreadcrumb } from '@/components/navigation/page-breadcrumb';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { ScenarioGuide } from '@/components/immigration/scenario-guide';
import { SafetyChecklist } from '@/components/immigration/safety-checklist';
import { EmergencyCard } from '@/components/immigration/emergency-card';

export default function RaidsToolkit() {
  useScrollToTop();
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('es') ? 'es' : 'en';

  const breadcrumbItems = [
    { label: t('breadcrumb.home', 'Home'), href: '/' },
    { label: t('breadcrumb.immigrationGuidance', 'Immigration Guidance'), href: '/immigration-guidance' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageBreadcrumb
        items={breadcrumbItems}
        currentPage={lang === 'es' ? 'Kit de Preparación para Redadas' : 'Raids Preparedness Toolkit'}
      />

      {/* Hero Section */}
      <section className="vivid-header text-white py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/20 via-white/10 to-transparent flex items-center justify-center ring-1 ring-white/20">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {lang === 'es' ? 'Kit de Preparación para Redadas' : 'Raids Preparedness Toolkit'}
              </h1>
            </div>
            <p className="text-lg text-white/90 max-w-3xl">
              {lang === 'es'
                ? 'Recursos de preparación comunitaria y orientación específica para diferentes escenarios de encuentro con ICE. Prepárese antes de que ocurra una emergencia.'
                : 'Community preparedness resources and scenario-specific guidance for different ICE encounters. Prepare before an emergency happens.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Critical Alert */}
      <Alert className="max-w-4xl mx-auto px-4 mt-6 mb-8 bg-red-50 border-red-200 dark:bg-red-950/50 dark:border-red-800">
        <AlertTriangle className="h-5 w-5 text-red-600" />
        <AlertDescription className="text-red-800 dark:text-red-200">
          <strong>{lang === 'es' ? 'RECUERDE:' : 'REMEMBER:'}</strong>{' '}
          {lang === 'es'
            ? 'La preparación es clave. Tenga un plan antes de que ocurra una emergencia. Estos derechos aplican a TODAS las personas en Estados Unidos.'
            : 'Preparation is key. Have a plan before an emergency happens. These rights apply to ALL persons in the United States.'}
        </AlertDescription>
      </Alert>

      {/* Quick Links */}
      <section className="py-8 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href="#scenarios" className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-all">
                <Shield className="h-8 w-8 text-primary" />
                <span className="text-sm font-medium text-center">
                  {lang === 'es' ? 'Guías por Escenario' : 'Scenario Guides'}
                </span>
              </a>
              <a href="#checklist" className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-all">
                <CheckCircle2 className="h-8 w-8 text-primary" />
                <span className="text-sm font-medium text-center">
                  {lang === 'es' ? 'Lista de Preparación' : 'Safety Checklist'}
                </span>
              </a>
              <a href="#emergency-card" className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-all">
                <FileText className="h-8 w-8 text-primary" />
                <span className="text-sm font-medium text-center">
                  {lang === 'es' ? 'Tarjeta de Emergencia' : 'Emergency Card'}
                </span>
              </a>
              <a href="/immigration-guidance/know-your-rights" className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-all">
                <Users className="h-8 w-8 text-primary" />
                <span className="text-sm font-medium text-center">
                  {lang === 'es' ? 'Tarjetas Rojas' : 'Red Cards'}
                </span>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Scenario Guides Section */}
      <section id="scenarios" className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-2xl font-bold mb-2">
              {lang === 'es' ? 'Guías por Escenario' : 'Scenario Guides'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {lang === 'es'
                ? 'Seleccione un escenario para ver instrucciones paso a paso sobre qué hacer durante un encuentro con ICE.'
                : 'Select a scenario to see step-by-step instructions on what to do during an ICE encounter.'}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <ScenarioGuide />
          </ScrollReveal>
        </div>
      </section>

      {/* Safety Checklist Section */}
      <section id="checklist" className="py-12 bg-background">
        <div className="max-w-4xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-2xl font-bold mb-2">
              {lang === 'es' ? 'Lista de Preparación de Seguridad' : 'Safety Preparedness Checklist'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {lang === 'es'
                ? 'Use esta lista interactiva para prepararse para posibles encuentros de inmigración. Su progreso se guarda en su dispositivo.'
                : 'Use this interactive checklist to prepare for potential immigration encounters. Your progress is saved on your device.'}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <SafetyChecklist />
          </ScrollReveal>
        </div>
      </section>

      {/* Emergency Card Section */}
      <section id="emergency-card" className="py-12 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-2xl font-bold mb-2">
              {lang === 'es' ? 'Tarjeta de Contacto de Emergencia' : 'Emergency Contact Card'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {lang === 'es'
                ? 'Cree una tarjeta personalizada con sus contactos de emergencia para tenerla a mano.'
                : 'Create a personalized card with your emergency contacts to have ready.'}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <EmergencyCard />
          </ScrollReveal>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-2xl font-bold mb-6 text-center">
              {lang === 'es' ? 'Recursos Adicionales' : 'Additional Resources'}
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            <ScrollReveal delay={0.1}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Phone className="h-5 w-5 text-primary" />
                    {lang === 'es' ? 'Líneas de Emergencia' : 'Emergency Hotlines'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-semibold text-sm">NILC</p>
                    <p className="text-primary font-bold">213-639-3900</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">United We Dream</p>
                    <p className="text-primary font-bold">1-844-363-1423</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">ACLU</p>
                    <p className="text-primary font-bold">212-549-2660</p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-primary" />
                    {lang === 'es' ? 'Materiales Imprimibles' : 'Printable Materials'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a
                    href="/immigration-guidance/know-your-rights"
                    className="block text-sm text-primary hover:underline"
                  >
                    {lang === 'es' ? '→ Tarjetas Rojas (Conozca Sus Derechos)' : '→ Red Cards (Know Your Rights)'}
                  </a>
                  <a
                    href="/immigration-guidance/family-preparedness"
                    className="block text-sm text-primary hover:underline"
                  >
                    {lang === 'es' ? '→ Plantillas de Poder Notarial' : '→ Power of Attorney Templates'}
                  </a>
                  <a
                    href="#emergency-card"
                    className="block text-sm text-primary hover:underline"
                  >
                    {lang === 'es' ? '→ Tarjeta de Contacto de Emergencia' : '→ Emergency Contact Card'}
                  </a>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ExternalLink className="h-5 w-5 text-primary" />
                    {lang === 'es' ? 'Enlaces Externos' : 'External Links'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <a
                    href="https://www.ilrc.org/red-cards"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    ILRC Red Cards <ExternalLink className="h-3 w-3" />
                  </a>
                  <a
                    href="https://www.nilc.org/issues/immigration-enforcement/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    NILC Enforcement Resources <ExternalLink className="h-3 w-3" />
                  </a>
                  <a
                    href="https://www.aclu.org/know-your-rights/immigrants-rights"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    ACLU Immigrants' Rights <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="text-2xl font-bold mb-4">
              {lang === 'es' ? 'Preparación Familiar' : 'Family Preparedness'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {lang === 'es'
                ? 'Cree un plan completo para su familia, incluyendo poderes notariales y planes de cuidado de niños.'
                : 'Create a comprehensive plan for your family, including power of attorney and childcare plans.'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <a href="/immigration-guidance/family-preparedness">
                  {lang === 'es' ? 'Crear Plan Familiar' : 'Create Family Plan'}
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="/immigration-guidance/find-attorney">
                  {lang === 'es' ? 'Encontrar un Abogado' : 'Find an Attorney'}
                </a>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
