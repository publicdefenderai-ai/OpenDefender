import { BrandShieldIcon } from "@/components/brand-logo";
import { motion } from "framer-motion";
import { 
  Heart, 
  
  AlertTriangle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from 'react-i18next';
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { ImmigrationDetailLayout } from "@/components/immigration/immigration-detail-layout";

export default function FamilyPlanning() {
  useScrollToTop();
  const { t } = useTranslation();
  
  const breadcrumbItems = [
    { label: t('breadcrumb.home', 'Home'), href: '/' },
    { label: t('breadcrumb.immigrationGuidance', 'Immigration Guidance'), href: '/immigration-guidance' }
  ];
  
  return (
    <ImmigrationDetailLayout
      title={t('immigration.family.title')}
      subtitle={t('immigration.family.subtitle')}
      breadcrumbItems={breadcrumbItems}
      icon={<Heart className="h-7 w-7" />}
      alert={
        <Alert className="border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/40">
          <AlertDescription className="text-blue-900 dark:text-blue-200" data-testid="alert-family-planning">
            <div className="flex items-start gap-3">
              <BrandShieldIcon size={20} className="mt-0.5 shrink-0" />
              <span><strong>{t('immigration.family.planningAlert')}</strong> {t('immigration.family.planningAlertText')}</span>
            </div>
          </AlertDescription>
        </Alert>
      }
    >

      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-center mb-8" data-testid="text-essential-documents-title">
              {t('immigration.family.documents.title')}
            </h2>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ScrollReveal delay={0.1}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {t('immigration.family.documents.poa.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('immigration.family.documents.poa.description')}
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                    <li>{t('immigration.family.documents.poa.item1')}</li>
                    <li>{t('immigration.family.documents.poa.item2')}</li>
                    <li>{t('immigration.family.documents.poa.item3')}</li>
                  </ul>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {t('immigration.family.documents.caregiver.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('immigration.family.documents.caregiver.description')}
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                    <li>{t('immigration.family.documents.caregiver.item1')}</li>
                    <li>{t('immigration.family.documents.caregiver.item2')}</li>
                    <li>{t('immigration.family.documents.caregiver.item3')}</li>
                  </ul>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {t('immigration.family.documents.guardianship.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('immigration.family.documents.guardianship.description')}
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                    <li>{t('immigration.family.documents.guardianship.item1')}</li>
                    <li>{t('immigration.family.documents.guardianship.item2')}</li>
                    <li>{t('immigration.family.documents.guardianship.item3')}</li>
                  </ul>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-center mb-8" data-testid="text-emergency-plan-title">
              {t('immigration.family.emergencyPlan.title')}
            </h2>
          </ScrollReveal>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <ScrollReveal delay={0.1}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t('immigration.family.emergencyPlan.communication.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-sm font-semibold text-primary">1</span>
                    <div>
                      <strong className="text-foreground">{t('immigration.family.emergencyPlan.communication.step1')}</strong>
                      <p className="text-sm text-muted-foreground">{t('immigration.family.emergencyPlan.communication.step1Text')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-sm font-semibold text-primary">2</span>
                    <div>
                      <strong className="text-foreground">{t('immigration.family.emergencyPlan.communication.step2')}</strong>
                      <p className="text-sm text-muted-foreground">{t('immigration.family.emergencyPlan.communication.step2Text')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-sm font-semibold text-primary">3</span>
                    <div>
                      <strong className="text-foreground">{t('immigration.family.emergencyPlan.communication.step3')}</strong>
                      <p className="text-sm text-muted-foreground">{t('immigration.family.emergencyPlan.communication.step3Text')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t('immigration.family.emergencyPlan.documentPrep.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-sm font-semibold text-primary">1</span>
                    <div>
                      <strong className="text-foreground">{t('immigration.family.emergencyPlan.documentPrep.step1')}</strong>
                      <p className="text-sm text-muted-foreground">{t('immigration.family.emergencyPlan.documentPrep.step1Text')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-sm font-semibold text-primary">2</span>
                    <div>
                      <strong className="text-foreground">{t('immigration.family.emergencyPlan.documentPrep.step2')}</strong>
                      <p className="text-sm text-muted-foreground">{t('immigration.family.emergencyPlan.documentPrep.step2Text')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-sm font-semibold text-primary">3</span>
                    <div>
                      <strong className="text-foreground">{t('immigration.family.emergencyPlan.documentPrep.step3')}</strong>
                      <p className="text-sm text-muted-foreground">{t('immigration.family.emergencyPlan.documentPrep.step3Text')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-center mb-8" data-testid="text-financial-planning-title">
              {t('immigration.family.financial.title')}
            </h2>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-3 gap-6">
            <ScrollReveal delay={0.1}>
              <Card className="h-full">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">{t('immigration.family.financial.bank')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('immigration.family.financial.bankText')}
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card className="h-full">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">{t('immigration.family.financial.property')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('immigration.family.financial.propertyText')}
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <Card className="h-full">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">{t('immigration.family.financial.medical')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('immigration.family.financial.medicalText')}
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4">
          <ScrollReveal>
            <Alert className="bg-green-50 border-green-200 dark:bg-green-950/50 dark:border-green-800">
              <AlertTriangle className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                <strong>{t('immigration.family.freeHelp')}</strong> {t('immigration.family.freeHelpText')}
              </AlertDescription>
            </Alert>
          </ScrollReveal>
        </div>
      </section>

    </ImmigrationDetailLayout>
  );
}
