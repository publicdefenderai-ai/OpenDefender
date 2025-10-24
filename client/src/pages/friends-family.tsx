import { motion } from "framer-motion";
import { Users, Phone, FileText, Clock, MapPin, AlertCircle, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

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

      {/* Hero Section */}
      <section className="gradient-hero text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-600">
                <Users className="inline h-10 w-10 mr-2 mb-2" />
                {t('friendsFamily.hero.title')}
              </h1>
              <p className="text-xl text-blue-800 dark:text-blue-200 max-w-3xl mx-auto">
                {t('friendsFamily.hero.subtitle')}
              </p>
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
                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">{t('friendsFamily.step2.publicDefenderTitle')}</h4>
                        <p className="text-sm text-muted-foreground">
                          {t('friendsFamily.step2.publicDefenderDesc')}
                        </p>
                      </div>
                      
                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">{t('friendsFamily.step2.legalAidTitle')}</h4>
                        <p className="text-sm text-muted-foreground">
                          {t('friendsFamily.step2.legalAidDesc')}
                        </p>
                      </div>
                      
                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">{t('friendsFamily.step2.privateAttorneyTitle')}</h4>
                        <p className="text-sm text-muted-foreground">
                          {t('friendsFamily.step2.privateAttorneyDesc')}
                        </p>
                      </div>
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
                    </ul>
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
              <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                <strong>{t('friendsFamily.disclaimer.title')}</strong> {t('friendsFamily.disclaimer.text')}
              </AlertDescription>
            </Alert>
          </ScrollReveal>
        </div>
      </section>

      <Footer />

      {/* Privacy Footer Banner */}
      <div className="legal-blue text-white py-3 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">
              <strong>{t('friendsFamily.privacyBanner.title')}</strong> {t('friendsFamily.privacyBanner.text')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
