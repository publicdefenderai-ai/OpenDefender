import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  Phone,
  Home,
  Car,
  Building2,
  Users,
  MapPin,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Scale,
  FileText,
  Gavel
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { PageBreadcrumb } from '@/components/navigation/page-breadcrumb';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { RedCardGenerator } from '@/components/immigration/red-card-generator';
import { WarrantGuide } from '@/components/immigration/warrant-guide';
import {
  kyrScripts,
  redCardContent,
  warrantInfo,
  commonMistakes,
  emergencyContacts
} from '../../../../shared/data/kyr-scripts';

export default function KnowYourRights() {
  useScrollToTop();
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('es') ? 'es' : 'en';
  const [expandedScript, setExpandedScript] = useState<string | null>('door');

  const breadcrumbItems = [
    { label: t('breadcrumb.home', 'Home'), href: '/' },
    { label: t('breadcrumb.immigrationGuidance', 'Immigration Guidance'), href: '/immigration-guidance' }
  ];

  const getScenarioIcon = (id: string) => {
    switch (id) {
      case 'door': return <Home className="h-5 w-5" />;
      case 'traffic': return <Car className="h-5 w-5" />;
      case 'workplace': return <Building2 className="h-5 w-5" />;
      case 'public': return <Users className="h-5 w-5" />;
      case 'checkpoint': return <MapPin className="h-5 w-5" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageBreadcrumb
        items={breadcrumbItems}
        currentPage={lang === 'es' ? 'Conozca Sus Derechos' : 'Know Your Rights'}
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
                {lang === 'es' ? 'Conozca Sus Derechos' : 'Know Your Rights'}
              </h1>
            </div>
            <p className="text-lg text-white/90 max-w-3xl">
              {lang === 'es'
                ? 'Materiales imprimibles y guías interactivas para proteger sus derechos durante encuentros con ICE. Basado en plantillas del ILRC y orientación de ACLU/NILC.'
                : 'Printable materials and interactive guides to protect your rights during ICE encounters. Based on ILRC templates and ACLU/NILC guidance.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Critical Alert */}
      <Alert className="max-w-4xl mx-auto px-4 mt-6 mb-8 bg-red-50 border-red-200 dark:bg-red-950/50 dark:border-red-800">
        <AlertTriangle className="h-5 w-5 text-red-600" />
        <AlertDescription className="text-red-800 dark:text-red-200">
          <strong>{lang === 'es' ? 'CRÍTICO:' : 'CRITICAL:'}</strong>{' '}
          {lang === 'es'
            ? 'Estos derechos aplican a TODAS las personas en Estados Unidos, sin importar su estatus migratorio. Tiene protecciones legales incluso durante acciones de cumplimiento de inmigración.'
            : 'These rights apply to ALL persons in the United States, regardless of immigration status. You have legal protections even during immigration enforcement actions.'}
        </AlertDescription>
      </Alert>

      {/* Red Card Generator Section */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-2xl font-bold mb-2">
              {lang === 'es' ? 'Tarjetas Rojas Imprimibles' : 'Printable Red Cards'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {lang === 'es'
                ? 'Imprima estas tarjetas para tener a mano durante encuentros con agentes de inmigración.'
                : 'Print these cards to have ready during encounters with immigration agents.'}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <RedCardGenerator cards={redCardContent} />
          </ScrollReveal>
        </div>
      </section>

      {/* ICE Encounter Scripts Section */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-2xl font-bold mb-2">
              {lang === 'es' ? 'Guiones para Encuentros con ICE' : 'ICE Encounter Scripts'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {lang === 'es'
                ? 'Qué decir (y qué NO decir) en diferentes situaciones. Haga clic en cada escenario para ver los detalles.'
                : 'What to say (and what NOT to say) in different situations. Click each scenario to see details.'}
            </p>
          </ScrollReveal>

          <div className="space-y-4">
            {kyrScripts.map((script, index) => (
              <ScrollReveal key={script.id} delay={0.1 * index}>
                <Card className={`overflow-hidden transition-all ${
                  expandedScript === script.id ? 'ring-2 ring-primary' : ''
                }`}>
                  <button
                    onClick={() => setExpandedScript(expandedScript === script.id ? null : script.id)}
                    className="w-full text-left"
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center ring-1 ring-primary/20">
                            {getScenarioIcon(script.id)}
                          </div>
                          <span>{script.scenario[lang]}</span>
                        </div>
                        {expandedScript === script.id ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </CardTitle>
                    </CardHeader>
                  </button>

                  {expandedScript === script.id && (
                    <CardContent className="pt-0 space-y-6">
                      {/* What to Say */}
                      <div>
                        <h4 className="font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                          <Badge variant="outline" className="border-green-500 text-green-700 dark:text-green-400">
                            {lang === 'es' ? 'QUÉ DECIR' : 'WHAT TO SAY'}
                          </Badge>
                        </h4>
                        <div className="space-y-2 bg-green-50 dark:bg-green-950/30 rounded-lg p-4">
                          {script.whatToSay[lang].map((text, idx) => (
                            <p key={idx} className="text-sm font-medium text-green-800 dark:text-green-200">
                              {text}
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* What NOT to Say */}
                      <div>
                        <h4 className="font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                          <Badge variant="outline" className="border-red-500 text-red-700 dark:text-red-400">
                            {lang === 'es' ? 'QUÉ NO DECIR' : 'WHAT NOT TO SAY'}
                          </Badge>
                        </h4>
                        <div className="space-y-2 bg-red-50 dark:bg-red-950/30 rounded-lg p-4">
                          {script.whatNotToSay[lang].map((text, idx) => (
                            <p key={idx} className="text-sm text-red-800 dark:text-red-200">
                              • {text}
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Tips */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Badge variant="outline">
                            {lang === 'es' ? 'CONSEJOS' : 'TIPS'}
                          </Badge>
                        </h4>
                        <ul className="space-y-2">
                          {script.tips[lang].map((tip, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Legal Basis */}
                      <div className="bg-muted rounded-lg p-4">
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                          <Scale className="h-4 w-4" />
                          {lang === 'es' ? 'Base Legal:' : 'Legal Basis:'}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {script.legalBasis[lang]}
                        </p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Warrant Recognition Guide Section */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              {lang === 'es' ? 'Guía de Reconocimiento de Órdenes' : 'Warrant Recognition Guide'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {lang === 'es'
                ? 'Aprenda a distinguir entre una orden judicial (que permite la entrada) y una orden administrativa de ICE (que NO permite la entrada).'
                : 'Learn to distinguish between a judicial warrant (which allows entry) and an ICE administrative warrant (which does NOT allow entry).'}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <WarrantGuide warrantInfo={warrantInfo} />
          </ScrollReveal>
        </div>
      </section>

      {/* Blackie's Warrants Section */}
      <section className="py-12 bg-muted/30" id="blackies-warrants">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
              <Gavel className="h-6 w-6 text-primary" />
              {lang === 'es' ? '"Blackie\'s Warrants": Lo Que Debe Saber' : '"Blackie\'s Warrants": What You Should Know'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {lang === 'es'
                ? 'Comprenda los diferentes tipos de ordenes que los agentes de ICE pueden presentar en su lugar de trabajo o hogar, y cuáles le dan derecho a negar la entrada.'
                : 'Understand the different types of warrants ICE agents may present at your workplace or home, and which ones give you the right to deny entry.'}
            </p>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <ScrollReveal delay={0.1}>
              <Card className="h-full border-green-200 dark:border-green-800">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Scale className="h-5 w-5 text-green-600" />
                    {lang === 'es' ? 'Orden Judicial' : 'Judicial Warrant'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                      {lang === 'es'
                        ? 'Emitida por un tribunal federal y firmada por un juez federal (no un juez de inmigración).'
                        : 'Issued by a federal court and signed by a federal judge (not an immigration judge).'}
                    </p>
                    <ul className="space-y-1.5 text-sm text-green-700 dark:text-green-300">
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        {lang === 'es'
                          ? 'Requiere causa probable de que se cometió un delito'
                          : 'Requires probable cause that a crime was committed'}
                      </li>
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        {lang === 'es'
                          ? 'Permite a los agentes entrar en áreas privadas'
                          : 'Allows officers to enter private areas'}
                      </li>
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        {lang === 'es'
                          ? 'Solo pueden registrar los lugares indicados en la orden'
                          : 'Officers can only search the places listed on the warrant'}
                      </li>
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        {lang === 'es'
                          ? 'Inmigración casi nunca usa órdenes judiciales'
                          : 'Immigration almost never uses judicial warrants'}
                      </li>
                    </ul>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {lang === 'es'
                      ? 'Identificación: Menciona "búsqueda e incautación" o "arresto"; emitida por un tribunal; firmada por un juez no-migratorio.'
                      : 'How to identify: Says "search and seizure" or "arrest"; issued by a court; signed by a non-immigration judge.'}
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card className="h-full border-red-200 dark:border-red-800">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-red-600" />
                    {lang === 'es' ? 'Orden Administrativa (ICE)' : 'Administrative Warrant (ICE)'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-4">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                      {lang === 'es'
                        ? 'Emitida por una agencia federal como ICE o CBP — NO por un tribunal.'
                        : 'Issued by a federal agency like ICE or CBP — NOT by a court.'}
                    </p>
                    <ul className="space-y-1.5 text-sm text-red-700 dark:text-red-300">
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        {lang === 'es'
                          ? 'NO permite la entrada a espacios privados sin su permiso'
                          : 'Does NOT allow entry to private spaces without your permission'}
                      </li>
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        {lang === 'es'
                          ? 'Usualmente usada para arrestar personas en público'
                          : 'Usually used to arrest a person in public'}
                      </li>
                      <li className="flex items-start gap-2">
                        <span>•</span>
                        {lang === 'es'
                          ? 'Puede estar firmada por un juez de inmigración, pero eso NO la convierte en una orden judicial'
                          : 'May be signed by an immigration judge, but that does NOT make it a judicial warrant'}
                      </li>
                    </ul>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {lang === 'es'
                      ? 'Identificación: Sello de DHS; formularios I-200 (Orden de Arresto) o I-205 (Orden de Deportación).'
                      : 'How to identify: DHS seal; Form I-200 (Warrant for Arrest) or I-205 (Warrant of Removal/Deportation).'}
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.3}>
            <Card className="border-amber-200 dark:border-amber-800">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Gavel className="h-5 w-5 text-amber-600" />
                  {lang === 'es' ? '¿Qué es una "Blackie\'s Warrant"?' : 'What Is a "Blackie\'s Warrant"?'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {lang === 'es'
                    ? 'Una "Blackie\'s warrant" es una orden de inspección administrativa que ICE ha utilizado históricamente para ingresar a lugares de trabajo. El nombre proviene del caso Blackie\'s House of Beef, Inc. v. Castillo (1981), donde un tribunal federal permitió una inspección de inmigración en el lugar de trabajo con un estándar menor que la causa probable requerida para órdenes judiciales penales.'
                    : 'A "Blackie\'s warrant" is an administrative inspection warrant that ICE has historically used to enter workplaces. The name comes from Blackie\'s House of Beef, Inc. v. Castillo (1981), where a federal court allowed a workplace immigration inspection under a lower standard than the probable cause required for criminal judicial warrants.'}
                </p>

                <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <AlertDescription className="text-amber-800 dark:text-amber-200">
                    <strong>{lang === 'es' ? 'Desarrollo reciente (2025):' : 'Recent development (2025):'}</strong>{' '}
                    {lang === 'es'
                      ? 'En mayo de 2025, un juez magistrado federal en el Distrito Sur de Texas denegó la solicitud del gobierno para una orden de inspección administrativa, dictaminando que los agentes de ICE deben obtener una orden judicial que cumpla con la Cuarta Enmienda para buscar en las áreas privadas de un negocio personas indocumentadas sospechosas. Sin embargo, los agentes de ICE aún pueden presentar "Blackie\'s warrants" u órdenes bajo la Regla 41.'
                      : 'In May 2025, a federal magistrate judge in the Southern District of Texas denied the government\'s application for an administrative inspection warrant, ruling that ICE agents must obtain a Fourth Amendment judicial warrant to search a business\'s private areas for suspected undocumented immigrants. However, ICE agents may still present "Blackie\'s warrants" or Rule 41 warrants.'}
                  </AlertDescription>
                </Alert>

                <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-2 text-blue-800 dark:text-blue-200">
                    {lang === 'es' ? 'Qué verificar en cualquier orden:' : 'What to verify on any warrant:'}
                  </h4>
                  <ul className="space-y-1.5 text-sm text-blue-700 dark:text-blue-300">
                    <li className="flex items-start gap-2">
                      <span className="font-bold">1.</span>
                      {lang === 'es'
                        ? '¿Fue emitida por un tribunal federal?'
                        : 'Was it issued by a federal court?'}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">2.</span>
                      {lang === 'es'
                        ? '¿Fue firmada por un juez federal (no un juez de inmigración)?'
                        : 'Was it signed by a federal judge (not an immigration judge)?'}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">3.</span>
                      {lang === 'es'
                        ? '¿Especifica el tiempo, lugar y objetivos de la búsqueda?'
                        : 'Does it specify the time, location, and targets of the search?'}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">4.</span>
                      {lang === 'es'
                        ? '¿Está acompañada de una declaración jurada con base creíble?'
                        : 'Is it accompanied by an affidavit with a plausible basis?'}
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-2 text-green-800 dark:text-green-200">
                    {lang === 'es' ? 'Qué decir si ICE se presenta con una orden:' : 'What to say if ICE shows up with a warrant:'}
                  </h4>
                  <p className="text-sm font-medium text-green-800 dark:text-green-200 italic">
                    {lang === 'es'
                      ? '"Esta es un área privada. No pueden entrar sin una orden judicial firmada por un juez. ¿Tiene una orden judicial?"'
                      : '"This is a private area. You cannot enter without a judicial warrant signed by a judge. Do you have a judicial warrant?"'}
                  </p>
                </div>

                <p className="text-xs text-muted-foreground">
                  {lang === 'es'
                    ? 'Fuente: National Immigration Law Center (NILC), "Know Your Rights: Warrants" (diciembre 2025). Esta información es solo educativa y no constituye asesoramiento legal.'
                    : 'Source: National Immigration Law Center (NILC), "Know Your Rights: Warrants" (December 2025). This information is educational only and does not constitute legal advice.'}
                </p>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      {/* Common Mistakes Section */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-2xl font-bold mb-2">
              {lang === 'es' ? 'Errores Comunes a Evitar' : 'Common Mistakes to Avoid'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {lang === 'es'
                ? 'Estos errores pueden perjudicar su caso. Conozca qué evitar.'
                : 'These mistakes can hurt your case. Know what to avoid.'}
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {commonMistakes[lang].map((item, index) => (
              <ScrollReveal key={index} delay={0.1 * index}>
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-red-700 dark:text-red-400 text-sm">
                            {item.mistake}
                          </p>
                        </div>
                      </div>
                      <div className="bg-red-50 dark:bg-red-950/30 rounded p-2">
                        <p className="text-xs text-red-800 dark:text-red-200">
                          <strong>{lang === 'es' ? 'Consecuencia:' : 'Consequence:'}</strong> {item.consequence}
                        </p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-950/30 rounded p-2">
                        <p className="text-xs text-green-800 dark:text-green-200">
                          <strong>{lang === 'es' ? 'En su lugar:' : 'Instead:'}</strong> {item.instead}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Contacts Section */}
      <section className="py-12 bg-background">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="text-2xl font-bold mb-4">
              {lang === 'es' ? 'Líneas de Ayuda de Emergencia' : 'Emergency Hotlines'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {lang === 'es'
                ? 'Si necesita ayuda inmediata, contacte estas organizaciones:'
                : 'If you need immediate help, contact these organizations:'}
            </p>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 gap-4">
            {emergencyContacts.national.map((contact, index) => (
              <ScrollReveal key={index} delay={0.1 * index}>
                <Card>
                  <CardContent className="pt-6">
                    <Phone className="h-6 w-6 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-sm">{contact.name[lang]}</h3>
                    <p className="text-xl font-bold text-primary mt-2">{contact.phone}</p>
                    <a
                      href={contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mt-2"
                    >
                      {lang === 'es' ? 'Visitar sitio web' : 'Visit website'}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="text-2xl font-bold mb-4">
              {lang === 'es' ? 'Prepárese Ahora' : 'Prepare Now'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {lang === 'es'
                ? 'Tome estos pasos para protegerse a usted y a su familia antes de un encuentro.'
                : 'Take these steps to protect yourself and your family before an encounter.'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <a href="/immigration-guidance/raids-toolkit">
                  {lang === 'es' ? 'Kit de Preparación para Redadas' : 'Raids Preparedness Toolkit'}
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="/immigration-guidance/family-preparedness">
                  {lang === 'es' ? 'Plan Familiar de Emergencia' : 'Family Emergency Plan'}
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
