import { motion } from "framer-motion";
import {
  Building2,
  AlertTriangle,
  Phone,
  FileText,
  Shield,
  ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { PageBreadcrumb } from "@/components/navigation/page-breadcrumb";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

export default function WorkplaceRaids() {
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
        currentPage={t('immigration.raids.title')} 
      />

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
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white" data-testid="text-workplace-raids-title">
                {t('immigration.raids.title')}
              </h1>
            </div>
            <p className="text-lg text-white/90 max-w-3xl" data-testid="text-workplace-raids-subtitle">
              {t('immigration.raids.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      <Alert className="max-w-4xl mx-auto px-4 mt-6 mb-8 bg-red-50 border-red-200 dark:bg-red-950/50 dark:border-red-800">
        <AlertTriangle className="h-5 w-5 text-red-600" />
        <AlertDescription className="text-red-800 dark:text-red-200" data-testid="alert-workplace-critical">
          <strong>{t('immigration.raids.criticalAlert')}</strong> {t('immigration.raids.criticalAlertText')}
        </AlertDescription>
      </Alert>

      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            <ScrollReveal>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle data-testid="text-your-rights-title">
                    {t('immigration.raids.yourRights.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-l-2 border-green-500 pl-4">
                    <strong className="text-foreground">{t('immigration.raids.yourRights.silent')}</strong>
                    <p className="text-sm text-muted-foreground">{t('immigration.raids.yourRights.silentText')}</p>
                  </div>
                  <div className="border-l-2 border-green-500 pl-4">
                    <strong className="text-foreground">{t('immigration.raids.yourRights.refuse')}</strong>
                    <p className="text-sm text-muted-foreground">{t('immigration.raids.yourRights.refuseText')}</p>
                  </div>
                  <div className="border-l-2 border-green-500 pl-4">
                    <strong className="text-foreground">{t('immigration.raids.yourRights.attorney')}</strong>
                    <p className="text-sm text-muted-foreground">{t('immigration.raids.yourRights.attorneyText')}</p>
                  </div>
                  <div className="border-l-2 border-green-500 pl-4">
                    <strong className="text-foreground">{t('immigration.raids.yourRights.basis')}</strong>
                    <p className="text-sm text-muted-foreground">{t('immigration.raids.yourRights.basisText')}</p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle data-testid="text-what-not-to-do-title">
                    {t('immigration.raids.whatNotToDo.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-l-2 border-red-500 pl-4">
                    <strong className="text-foreground">{t('immigration.raids.whatNotToDo.run')}</strong>
                    <p className="text-sm text-muted-foreground">{t('immigration.raids.whatNotToDo.runText')}</p>
                  </div>
                  <div className="border-l-2 border-red-500 pl-4">
                    <strong className="text-foreground">{t('immigration.raids.whatNotToDo.falseDocs')}</strong>
                    <p className="text-sm text-muted-foreground">{t('immigration.raids.whatNotToDo.falseDocsText')}</p>
                  </div>
                  <div className="border-l-2 border-red-500 pl-4">
                    <strong className="text-foreground">{t('immigration.raids.whatNotToDo.lie')}</strong>
                    <p className="text-sm text-muted-foreground">{t('immigration.raids.whatNotToDo.lieText')}</p>
                  </div>
                  <div className="border-l-2 border-red-500 pl-4">
                    <strong className="text-foreground">{t('immigration.raids.whatNotToDo.sign')}</strong>
                    <p className="text-sm text-muted-foreground">{t('immigration.raids.whatNotToDo.signText')}</p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-center mb-8" data-testid="text-employer-obligations-title">
              {t('immigration.raids.employer.title')}
            </h2>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-2 gap-8">
            <ScrollReveal delay={0.1}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t('immigration.raids.employer.mustProvide')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                    <li>{t('immigration.raids.employer.must1')}</li>
                    <li>{t('immigration.raids.employer.must2')}</li>
                    <li>{t('immigration.raids.employer.must3')}</li>
                  </ul>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t('immigration.raids.employer.canDo')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                    <li>{t('immigration.raids.employer.can1')}</li>
                    <li>{t('immigration.raids.employer.can2')}</li>
                    <li>{t('immigration.raids.employer.can3')}</li>
                    <li>{t('immigration.raids.employer.can4')}</li>
                  </ul>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle data-testid="text-after-raid-title">
                  {t('immigration.raids.afterRaid.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">{t('immigration.raids.afterRaid.detained')}</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                      <li>{t('immigration.raids.afterRaid.detained1')}</li>
                      <li>{t('immigration.raids.afterRaid.detained2')}</li>
                      <li>{t('immigration.raids.afterRaid.detained3')}</li>
                      <li>{t('immigration.raids.afterRaid.detained4')}</li>
                      <li>{t('immigration.raids.afterRaid.detained5')}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">{t('immigration.raids.afterRaid.notDetained')}</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                      <li>{t('immigration.raids.afterRaid.notDetained1')}</li>
                      <li>{t('immigration.raids.afterRaid.notDetained2')}</li>
                      <li>{t('immigration.raids.afterRaid.notDetained3')}</li>
                      <li>{t('immigration.raids.afterRaid.notDetained4')}</li>
                      <li>{t('immigration.raids.afterRaid.notDetained5')}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      {/* Work Authorization Rights Section */}
      <section className="py-12 bg-muted/30" id="work-authorization">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              {lang === 'es' ? 'Sus Derechos de Autorización de Trabajo' : 'Your Work Authorization Rights'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {lang === 'es'
                ? 'Conozca sus derechos si su permiso de trabajo expira, es revocado, o su empleador inicia una auditoría de I-9.'
                : 'Know your rights if your work permit expires, is revoked, or your employer initiates an I-9 audit.'}
            </p>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <ScrollReveal delay={0.1}>
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5 text-green-600" />
                    {lang === 'es' ? 'Derechos del Trabajador' : 'Worker Rights'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-l-2 border-green-500 pl-4">
                    <strong className="text-foreground">
                      {lang === 'es' ? 'Usted elige los documentos' : 'You choose the documents'}
                    </strong>
                    <p className="text-sm text-muted-foreground">
                      {lang === 'es'
                        ? 'Usted, el trabajador, tiene el derecho de elegir qué documentos de la lista aceptable del formulario I-9 presentar. Es ilegal que su empleador exija un documento específico o pida más documentos de los requeridos.'
                        : 'You, the worker, have the right to choose which documents from the I-9 acceptable documents list to present. It is unlawful for your employer to demand a specific document or ask for more documents than required.'}
                    </p>
                  </div>
                  <div className="border-l-2 border-green-500 pl-4">
                    <strong className="text-foreground">
                      {lang === 'es' ? 'Puede tener otra autorización' : 'You may still have authorization'}
                    </strong>
                    <p className="text-sm text-muted-foreground">
                      {lang === 'es'
                        ? 'Incluso si su permiso de trabajo ha expirado o sido revocado, podría seguir autorizado para trabajar por otros medios, como una renovación de permiso, protecciones temporales, asilo, o ajuste de estatus a residencia permanente. Antes de que un empleador lo despida, debe tener la oportunidad de presentar otra documentación.'
                        : 'Even when your work permit has expired or been revoked, you might still be legally authorized to work through other means, such as a work permit renewal, temporary protections, asylum, or adjusting status to permanent residency. Before an employer fires you, you should have the chance to present other documentation.'}
                    </p>
                  </div>
                  <div className="border-l-2 border-green-500 pl-4">
                    <strong className="text-foreground">
                      {lang === 'es' ? 'Protección contra represalias' : 'Anti-retaliation protection'}
                    </strong>
                    <p className="text-sm text-muted-foreground">
                      {lang === 'es'
                        ? 'Un empleador no puede usar una auditoría de I-9 como pretexto para despedir empleados porque han exigido salarios no pagados o han ejercido sus derechos laborales. Empleadores inescrupulosos a veces usan auditorías internas de I-9 para tomar represalias contra trabajadores que se quejan o toman acción colectiva.'
                        : 'An employer cannot use an I-9 audit as a pretext to fire employees because they have demanded unpaid wages or exercised their workplace rights. Unscrupulous employers sometimes use internal I-9 audits to retaliate against workers who complain or take collective action.'}
                    </p>
                  </div>
                  <div className="border-l-2 border-green-500 pl-4">
                    <strong className="text-foreground">
                      {lang === 'es' ? 'Derechos sindicales' : 'Union protections'}
                    </strong>
                    <p className="text-sm text-muted-foreground">
                      {lang === 'es'
                        ? 'Los trabajadores sindicalizados pueden tener derechos adicionales bajo convenios colectivos. Contacte a su sindicato directamente para más información.'
                        : 'Union members may have additional rights under collective bargaining agreements. Contact your union directly for more information.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    {lang === 'es' ? 'Reverificación del I-9' : 'I-9 Reverification'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {lang === 'es'
                      ? 'Si al momento de ser contratado presentó un documento con fecha de vencimiento (como un permiso de trabajo), la ley federal requiere que su empleador verifique sus documentos nuevamente antes de que expire. Esto se llama reverificación.'
                      : 'If at the time of hire you presented a document with an expiration date (like a work permit), federal law requires your employer to check your documents again before it expires. This is called reverification.'}
                  </p>

                  <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800 dark:text-amber-200 text-sm">
                      <strong>{lang === 'es' ? 'Revocación de permisos:' : 'Permit revocation:'}</strong>{' '}
                      {lang === 'es'
                        ? 'Un permiso de trabajo puede ser invalidado antes de su fecha de vencimiento si ha sido "revocado". Si su permiso es revocado, ya no puede usarse para demostrar autorización de trabajo, y su empleador puede requerir reverificación.'
                        : 'A work permit can become invalid before its expiration date if it has been "revoked." If your permit is revoked, it can no longer be used to show work authorization, and your employer may require reverification.'}
                    </AlertDescription>
                  </Alert>

                  <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800 dark:text-amber-200 text-sm">
                      <strong>{lang === 'es' ? 'E-Verify y reportes de cambio de estatus:' : 'E-Verify & status change reports:'}</strong>{' '}
                      {lang === 'es'
                        ? 'En junio de 2025, DHS emitió orientación específica sobre revocaciones de permisos de trabajo para empleadores de E-Verify, alertándolos sobre un nuevo "Reporte de Cambio de Estatus." Ha habido casos de personas identificadas erróneamente en este reporte. Esta orientación solo aplica a empleadores de E-Verify.'
                        : 'In June 2025, DHS issued specific guidance about work permit revocations for E-Verify employers, alerting them to a "Status Change Report." There have been instances of individuals being erroneously identified in this report. This guidance only applies to E-Verify employers.'}
                    </AlertDescription>
                  </Alert>

                  <Alert className="bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800 dark:text-red-200 text-sm">
                      <strong>{lang === 'es' ? 'Extensiones automáticas eliminadas:' : 'Automatic extensions eliminated:'}</strong>{' '}
                      {lang === 'es'
                        ? 'En octubre de 2025, USCIS eliminó la extensión automática de permisos de trabajo (anteriormente hasta 540 días) para personas que solicitaron renovación. Verifique el estado actual de su permiso con un abogado.'
                        : 'In October 2025, USCIS eliminated the automatic work permit extension (previously up to 540 days) for people who applied to renew. Verify your current permit status with an attorney.'}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.3}>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="outline" className="text-xs py-1 px-3">
                {lang === 'es'
                  ? 'Fuente: NILC, "Understanding Your Rights When Losing Work Authorization" (dic. 2025)'
                  : 'Source: NILC, "Understanding Your Rights When Losing Work Authorization" (Dec. 2025)'}
              </Badge>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="text-2xl font-bold mb-4">{t('immigration.raids.emergency.title')}</h2>
            <p className="text-muted-foreground mb-6">{t('immigration.raids.emergency.subtitle')}</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <Phone className="h-6 w-6 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold">{t('immigration.raids.emergency.nilc')}</h3>
                  <p className="text-xl font-bold text-primary mt-2">1-844-NILC-123</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Phone className="h-6 w-6 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold">{t('immigration.raids.emergency.aclu')}</h3>
                  <p className="text-xl font-bold text-primary mt-2">1-800-775-2258</p>
                </CardContent>
              </Card>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
