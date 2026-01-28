import { motion } from 'framer-motion';
import {
  Search,
  AlertTriangle,
  Phone,
  ExternalLink,
  FileText,
  Users,
  Scale,
  Clock,
  HelpCircle,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { PageBreadcrumb } from '@/components/navigation/page-breadcrumb';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { FacilitySearch } from '@/components/immigration/facility-search';

export default function FindDetained() {
  useScrollToTop();
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('es') ? 'es' : 'en';

  const breadcrumbItems = [
    { label: t('breadcrumb.home', 'Home'), href: '/' },
    { label: t('breadcrumb.immigrationGuidance', 'Immigration Guidance'), href: '/immigration-guidance' }
  ];

  const locatorSteps = [
    {
      step: 1,
      title: {
        en: 'Go to ICE Online Detainee Locator',
        es: 'Vaya al Localizador de Detenidos de ICE'
      },
      description: {
        en: 'Visit locator.ice.gov/odls/ - this is ICE\'s official system for finding people in immigration detention.',
        es: 'Visite locator.ice.gov/odls/ - este es el sistema oficial de ICE para encontrar personas en detención de inmigración.'
      },
      tips: {
        en: 'The system is available 24/7 and is free to use.',
        es: 'El sistema está disponible 24/7 y es gratuito.'
      }
    },
    {
      step: 2,
      title: {
        en: 'Enter Their Information',
        es: 'Ingrese Su Información'
      },
      description: {
        en: 'You\'ll need either their A-Number (Alien Registration Number) OR their name, country of birth, and date of birth.',
        es: 'Necesitará su Número A (Número de Registro de Extranjero) O su nombre, país de nacimiento y fecha de nacimiento.'
      },
      tips: {
        en: 'The A-Number is a 9-digit number that starts with "A". It may be on previous immigration documents.',
        es: 'El Número A es un número de 9 dígitos que comienza con "A". Puede estar en documentos de inmigración anteriores.'
      }
    },
    {
      step: 3,
      title: {
        en: 'Review Results',
        es: 'Revise los Resultados'
      },
      description: {
        en: 'If found, the system will show their current detention facility, the ICE field office, and when they arrived.',
        es: 'Si se encuentra, el sistema mostrará su centro de detención actual, la oficina de campo de ICE y cuándo llegaron.'
      },
      tips: {
        en: 'Results may take 24-48 hours to appear after an arrest. If not found, check back later.',
        es: 'Los resultados pueden tardar 24-48 horas en aparecer después de un arresto. Si no se encuentra, vuelva a verificar más tarde.'
      }
    },
    {
      step: 4,
      title: {
        en: 'Contact the Facility',
        es: 'Contacte el Centro'
      },
      description: {
        en: 'Use the facility phone number to confirm their location and ask about visitation policies.',
        es: 'Use el número de teléfono del centro para confirmar su ubicación y preguntar sobre las políticas de visita.'
      },
      tips: {
        en: 'Write down the A-Number if you learn it - you\'ll need it for bond payments and court proceedings.',
        es: 'Anote el Número A si lo aprende - lo necesitará para pagos de fianza y procedimientos judiciales.'
      }
    }
  ];

  const aNumberInfo = {
    en: {
      title: 'What is an A-Number?',
      description: 'An Alien Registration Number (A-Number) is a unique 9-digit identifier that ICE assigns to individuals in immigration proceedings. It looks like: A123-456-789',
      whereToFind: [
        'Previous immigration documents (visas, work permits, green cards)',
        'Immigration court notices',
        'Previous deportation orders',
        'Employment authorization cards'
      ],
      important: 'If you don\'t know the A-Number, you can search using name, date of birth, and country of birth instead.'
    },
    es: {
      title: '¿Qué es un Número A?',
      description: 'Un Número de Registro de Extranjero (Número A) es un identificador único de 9 dígitos que ICE asigna a las personas en procedimientos de inmigración. Se ve así: A123-456-789',
      whereToFind: [
        'Documentos de inmigración anteriores (visas, permisos de trabajo, tarjetas de residencia)',
        'Notificaciones del tribunal de inmigración',
        'Órdenes de deportación anteriores',
        'Tarjetas de autorización de empleo'
      ],
      important: 'Si no conoce el Número A, puede buscar usando nombre, fecha de nacimiento y país de nacimiento en su lugar.'
    }
  };

  const notFoundSteps = {
    en: [
      'Wait 24-48 hours and search again - the system may not be updated immediately',
      'Call the ICE detention reporting line: 1-888-351-4024',
      'Contact an immigration attorney who can make inquiries on your behalf',
      'File a missing person report with local police if you believe the person is missing',
      'Contact your local ICE field office directly'
    ],
    es: [
      'Espere 24-48 horas y busque de nuevo - el sistema puede no estar actualizado inmediatamente',
      'Llame a la línea de reportes de detención de ICE: 1-888-351-4024',
      'Contacte a un abogado de inmigración que pueda hacer consultas en su nombre',
      'Presente un reporte de persona desaparecida con la policía local si cree que la persona está desaparecida',
      'Contacte su oficina de campo local de ICE directamente'
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageBreadcrumb
        items={breadcrumbItems}
        currentPage={lang === 'es' ? 'Encontrar a un Ser Querido' : 'Find a Loved One'}
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
                <Search className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {lang === 'es' ? 'Encontrar a un Ser Querido Después del Arresto' : 'Finding a Loved One After Arrest'}
              </h1>
            </div>
            <p className="text-lg text-white/90 max-w-3xl">
              {lang === 'es'
                ? 'Guía paso a paso para localizar a alguien que ha sido detenido por ICE. Incluye cómo usar el localizador de detenidos, información sobre fianzas y directorio de centros de detención.'
                : 'Step-by-step guide to locate someone who has been detained by ICE. Includes how to use the detainee locator, bond information, and detention facility directory.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Critical Alert */}
      <Alert className="max-w-4xl mx-auto px-4 mt-6 mb-8 bg-amber-50 border-amber-200 dark:bg-amber-950/50 dark:border-amber-800">
        <Clock className="h-5 w-5 text-amber-600" />
        <AlertDescription className="text-amber-800 dark:text-amber-200">
          <strong>{lang === 'es' ? 'Actúe Rápido:' : 'Act Quickly:'}</strong>{' '}
          {lang === 'es'
            ? 'Los primeros días después del arresto son críticos. Localizar a la persona rápidamente ayuda a asegurar representación legal y puede afectar su elegibilidad para fianza.'
            : 'The first few days after arrest are critical. Locating the person quickly helps secure legal representation and may affect their bond eligibility.'}
        </AlertDescription>
      </Alert>

      {/* ICE Locator Steps */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-2xl font-bold mb-2">
              {lang === 'es' ? 'Cómo Usar el Localizador de Detenidos de ICE' : 'How to Use the ICE Detainee Locator'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {lang === 'es'
                ? 'Siga estos pasos para buscar a alguien en custodia de inmigración.'
                : 'Follow these steps to search for someone in immigration custody.'}
            </p>
          </ScrollReveal>

          <div className="space-y-4">
            {locatorSteps.map((step, index) => (
              <ScrollReveal key={step.step} delay={0.1 * index}>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{step.title[lang]}</h3>
                        <p className="text-muted-foreground mb-3">{step.description[lang]}</p>
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-sm">
                            <span className="font-medium">{lang === 'es' ? 'Consejo:' : 'Tip:'}</span>{' '}
                            {step.tips[lang]}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.5}>
            <div className="mt-6 text-center">
              <a
                href="https://locator.ice.gov/odls/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg text-lg font-medium hover:bg-primary/90 transition-colors"
              >
                {lang === 'es' ? 'Abrir Localizador de ICE' : 'Open ICE Locator'}
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* A-Number Info */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4">
          <ScrollReveal>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <HelpCircle className="h-6 w-6 text-primary" />
                  {aNumberInfo[lang].title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{aNumberInfo[lang].description}</p>

                <div>
                  <h4 className="font-semibold mb-2">
                    {lang === 'es' ? 'Dónde encontrarlo:' : 'Where to find it:'}
                  </h4>
                  <ul className="space-y-1">
                    {aNumberInfo[lang].whereToFind.map((item, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/50 dark:border-blue-800">
                  <AlertDescription className="text-blue-800 dark:text-blue-200">
                    {aNumberInfo[lang].important}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      {/* If Not Found */}
      <section className="py-12 bg-background">
        <div className="max-w-4xl mx-auto px-4">
          <ScrollReveal>
            <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="h-6 w-6" />
                  {lang === 'es' ? '¿Qué Hacer Si No Se Encuentra a la Persona?' : 'What If the Person Is Not Found?'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {notFoundSteps[lang].map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center text-amber-800 dark:text-amber-200 text-sm font-bold shrink-0">
                        {idx + 1}
                      </div>
                      <span className="text-sm">{step}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      {/* Bond Information */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-2xl font-bold mb-6">
              {lang === 'es' ? 'Información Sobre Fianzas' : 'Bond Information'}
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ScrollReveal delay={0.1}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Scale className="h-5 w-5 text-primary" />
                    {lang === 'es' ? '¿Cómo Se Fija la Fianza?' : 'How Is Bond Set?'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>
                    {lang === 'es'
                      ? 'ICE puede fijar una fianza inmediatamente después del arresto, o puede pedirse una audiencia de fianza ante un juez de inmigración.'
                      : 'ICE can set a bond immediately after arrest, or a bond hearing can be requested before an immigration judge.'}
                  </p>
                  <p>
                    {lang === 'es'
                      ? 'El monto típico de fianza varía de $1,500 a $25,000+, dependiendo del caso.'
                      : 'Typical bond amounts range from $1,500 to $25,000+, depending on the case.'}
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-primary" />
                    {lang === 'es' ? '¿Cómo Se Paga la Fianza?' : 'How to Pay Bond?'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>
                    {lang === 'es'
                      ? 'La fianza debe pagarse en una oficina local de ICE usando un giro postal o cheque de caja. NO se acepta efectivo.'
                      : 'Bond must be paid at a local ICE office using a money order or cashier\'s check. Cash is NOT accepted.'}
                  </p>
                  <p>
                    {lang === 'es'
                      ? 'Necesitará el Número A de la persona y un documento de identificación válido.'
                      : 'You\'ll need the person\'s A-Number and a valid ID.'}
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5 text-primary" />
                    {lang === 'es' ? '¿Qué Pasa Después?' : 'What Happens After?'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>
                    {lang === 'es'
                      ? 'Después de pagar la fianza, la persona será liberada en unas horas. DEBE asistir a TODAS las audiencias judiciales.'
                      : 'After bond is paid, the person will be released within hours. They MUST attend ALL court hearings.'}
                  </p>
                  <p>
                    {lang === 'es'
                      ? 'La fianza se devuelve al final del caso si la persona asiste a todas las audiencias.'
                      : 'The bond is returned at the end of the case if the person attends all hearings.'}
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.4}>
            <div className="mt-6 text-center">
              <Button asChild variant="outline">
                <a href="/immigration-guidance/bond-hearings">
                  {lang === 'es' ? 'Más Información Sobre Audiencias de Fianza' : 'More About Bond Hearings'}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Detention Facility Search */}
      <section className="py-12 bg-background">
        <div className="max-w-4xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-2xl font-bold mb-2">
              {lang === 'es' ? 'Directorio de Centros de Detención' : 'Detention Facility Directory'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {lang === 'es'
                ? 'Busque centros de detención de ICE por estado o nombre para encontrar información de contacto.'
                : 'Search ICE detention facilities by state or name to find contact information.'}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <FacilitySearch />
          </ScrollReveal>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="text-2xl font-bold mb-6">
              {lang === 'es' ? 'Números Importantes' : 'Important Numbers'}
            </h2>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 gap-4">
            <ScrollReveal delay={0.1}>
              <Card>
                <CardContent className="pt-6">
                  <Phone className="h-6 w-6 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-sm">
                    {lang === 'es' ? 'Línea de Reportes de Detención ICE' : 'ICE Detention Reporting Line'}
                  </h3>
                  <p className="text-xl font-bold text-primary mt-2">1-888-351-4024</p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card>
                <CardContent className="pt-6">
                  <Phone className="h-6 w-6 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-sm">
                    {lang === 'es' ? 'NIJC (Ayuda Legal)' : 'NIJC (Legal Help)'}
                  </h3>
                  <p className="text-xl font-bold text-primary mt-2">312-660-1370</p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="text-2xl font-bold mb-4">
              {lang === 'es' ? '¿Necesita Ayuda Legal?' : 'Need Legal Help?'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {lang === 'es'
                ? 'Un abogado de inmigración puede ayudar a navegar el proceso de detención y representar a su ser querido en audiencias.'
                : 'An immigration attorney can help navigate the detention process and represent your loved one at hearings.'}
            </p>
            <Button asChild size="lg">
              <a href="/immigration-guidance/find-attorney">
                {lang === 'es' ? 'Encontrar un Abogado de Inmigración' : 'Find an Immigration Attorney'}
              </a>
            </Button>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
