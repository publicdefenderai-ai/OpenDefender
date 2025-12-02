import { Shield, Lock, Users, Database, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { useTranslation } from "react-i18next";

export default function PrivacyPolicy() {
  useScrollToTop();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        {/* Hero Section */}
        <ScrollReveal>
          <div className="text-center mb-10 md:mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-600 rounded-full">
                <Shield className="h-10 w-10 md:h-12 md:w-12 text-white" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              {t('privacyPolicy.hero.title')}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('privacyPolicy.hero.subtitle')}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {t('privacyPolicy.hero.lastUpdated')}
            </p>
          </div>
        </ScrollReveal>

        {/* Privacy-First Notice */}
        <ScrollReveal>
          <Alert className="mb-10 md:mb-12 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-700">
            <Lock className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              <strong className="font-semibold">{t('privacyPolicy.notice.title')}</strong> {t('privacyPolicy.notice.description')}
            </AlertDescription>
          </Alert>
        </ScrollReveal>

        {/* Core Principles */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              {t('privacyPolicy.principles.title')}
            </h2>
            
            <div className="space-y-6">
              {/* No Personal Data Collection */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-600 rounded-lg flex-shrink-0">
                      <Database className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {t('privacyPolicy.principles.noPersonalData.title')}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {t('privacyPolicy.principles.noPersonalData.description')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Anonymized Data Only */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-600 rounded-lg flex-shrink-0">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {t('privacyPolicy.principles.anonymizedData.title')}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        {t('privacyPolicy.principles.anonymizedData.description')}
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
                        <li>{t('privacyPolicy.principles.anonymizedData.usage.metrics')}</li>
                        <li>{t('privacyPolicy.principles.anonymizedData.usage.improvements')}</li>
                        <li>{t('privacyPolicy.principles.anonymizedData.usage.integrations')}</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* No Third-Party Sharing */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-600 rounded-lg flex-shrink-0">
                      <Lock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {t('privacyPolicy.principles.noSharing.title')}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {t('privacyPolicy.principles.noSharing.description')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollReveal>

        {/* Technical Details */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              {t('privacyPolicy.technical.title')}
            </h2>
            
            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Session Data */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {t('privacyPolicy.technical.sessions.title')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacyPolicy.technical.sessions.description')}
                  </p>
                </div>

                {/* Server Logs */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {t('privacyPolicy.technical.logs.title')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t('privacyPolicy.technical.logs.description')}
                  </p>
                </div>

                {/* External Services */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {t('privacyPolicy.technical.external.title')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-2">
                    {t('privacyPolicy.technical.external.description')}
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                    <li>{t('privacyPolicy.technical.external.services.courtListener')}</li>
                    <li>{t('privacyPolicy.technical.external.services.recap')}</li>
                    <li>{t('privacyPolicy.technical.external.services.cornell')}</li>
                    <li>{t('privacyPolicy.technical.external.services.openLaws')}</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-2">
                    {t('privacyPolicy.technical.external.note')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Your Rights */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              {t('privacyPolicy.rights.title')}
            </h2>
            
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {t('privacyPolicy.rights.description')}
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
                  <li>{t('privacyPolicy.rights.list.noDataStored')}</li>
                  <li>{t('privacyPolicy.rights.list.sessionControl')}</li>
                  <li>{t('privacyPolicy.rights.list.noTracking')}</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Changes to Policy */}
        <ScrollReveal>
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
              {t('privacyPolicy.changes.title')}
            </h2>
            
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  {t('privacyPolicy.changes.description')}
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Contact */}
        <ScrollReveal>
          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700">
            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              <strong className="font-semibold">{t('privacyPolicy.contact.title')}</strong> {t('privacyPolicy.contact.description')}
            </AlertDescription>
          </Alert>
        </ScrollReveal>
      </main>

      <Footer />
    </div>
  );
}
