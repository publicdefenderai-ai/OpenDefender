import { motion } from "framer-motion";
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
  Flag
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

export default function ImmigrationGuidance() {
  useScrollToTop();
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-amber-600 text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" data-testid="text-immigration-hero-title">
              {t('immigration.hero.title1')}<br />
              <span className="text-amber-200">{t('immigration.hero.title2')}</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-amber-100 max-w-4xl mx-auto leading-relaxed" data-testid="text-immigration-hero-subtitle">
              {t('immigration.hero.subtitle')}
            </p>
          </motion.div>

          <ScrollReveal delay={0.2}>
            <Alert className="bg-red-600 border-red-700 text-white max-w-4xl mx-auto mb-8">
              <AlertTriangle className="h-5 w-5 text-white" />
              <AlertDescription className="text-white font-semibold" data-testid="alert-critical-rights">
                <strong>{t('immigration.criticalAlert.title')}</strong> {t('immigration.criticalAlert.text')}
              </AlertDescription>
            </Alert>
          </ScrollReveal>
        </div>
      </section>

      {/* Emergency Rights Section */}
      <section className="py-16 bg-red-50 dark:bg-red-950">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-red-800 dark:text-red-200 mb-6" data-testid="text-emergency-rights-title">
                {t('immigration.emergencyRights.title')}
              </h2>
              <p className="text-xl text-red-700 dark:text-red-300" data-testid="text-emergency-rights-subtitle">
                {t('immigration.emergencyRights.subtitle')}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            <ScrollReveal delay={0.1}>
              <Card className="border-red-200 bg-white dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center text-red-800 dark:text-red-200" data-testid="text-constitutional-rights-title">
                    <Shield className="mr-2 h-6 w-6" />
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
              <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950">
                <CardHeader>
                  <CardTitle className="flex items-center text-amber-800 dark:text-amber-200" data-testid="text-what-not-to-do-title">
                    <XCircle className="mr-2 h-6 w-6" />
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

      {/* Deportation Process Phases */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6" data-testid="text-deportation-phases-title">
                {t('immigration.deportationPhases.title')}
              </h2>
              <p className="text-xl text-muted-foreground" data-testid="text-deportation-phases-subtitle">
                {t('immigration.deportationPhases.subtitle')}
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-8">
            {/* Phase 1: Initial Encounter */}
            <ScrollReveal delay={0.1}>
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-800 dark:text-blue-200" data-testid="text-phase1-title">
                    <Eye className="mr-2 h-6 w-6" />
                    {t('immigration.deportationPhases.phase1.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-foreground">{t('immigration.deportationPhases.phase1.rightsTitle')}</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          {t('immigration.deportationPhases.phase1.rights.askLeave')}
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          {t('immigration.deportationPhases.phase1.rights.warrant')}
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          {t('immigration.deportationPhases.phase1.rights.silent')}
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          {t('immigration.deportationPhases.phase1.rights.attorney')}
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-foreground">{t('immigration.deportationPhases.phase1.expectTitle')}</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• {t('immigration.deportationPhases.phase1.expect.approach')}</li>
                        <li>• {t('immigration.deportationPhases.phase1.expect.documents')}</li>
                        <li>• {t('immigration.deportationPhases.phase1.expect.adminWarrant')}</li>
                        <li>• {t('immigration.deportationPhases.phase1.expect.detention')}</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Phase 2: Detention */}
            <ScrollReveal delay={0.2}>
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-800 dark:text-orange-200" data-testid="text-phase2-title">
                    <Users className="mr-2 h-6 w-6" />
                    {t('immigration.deportationPhases.phase2.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-foreground">{t('immigration.deportationPhases.phase2.rightsTitle')}</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          {t('immigration.deportationPhases.phase2.rights.phone')}
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          {t('immigration.deportationPhases.phase2.rights.consulate')}
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          {t('immigration.deportationPhases.phase2.rights.interpreter')}
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          {t('immigration.deportationPhases.phase2.rights.charges')}
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          {t('immigration.deportationPhases.phase2.rights.bond')}
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-foreground">{t('immigration.deportationPhases.phase2.importantTitle')}</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• {t('immigration.deportationPhases.phase2.important.duration')}</li>
                        <li>• {t('immigration.deportationPhases.phase2.important.nta')}</li>
                        <li>• {t('immigration.deportationPhases.phase2.important.mandatory')}</li>
                        <li>• {t('immigration.deportationPhases.phase2.important.bondAmount')}</li>
                        <li>• {t('immigration.deportationPhases.phase2.important.criminal')}</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Phase 3: Immigration Court */}
            <ScrollReveal delay={0.3}>
              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-800 dark:text-purple-200" data-testid="text-phase3-title">
                    <Gavel className="mr-2 h-6 w-6" />
                    {t('immigration.deportationPhases.phase3.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-foreground">{t('immigration.deportationPhases.phase3.rightsTitle')}</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          {t('immigration.deportationPhases.phase3.rights.attorney')}
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          {t('immigration.deportationPhases.phase3.rights.interpreter')}
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          {t('immigration.deportationPhases.phase3.rights.examine')}
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          {t('immigration.deportationPhases.phase3.rights.present')}
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          {t('immigration.deportationPhases.phase3.rights.appeal')}
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-foreground">{t('immigration.deportationPhases.phase3.outcomesTitle')}</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• {t('immigration.deportationPhases.phase3.outcomes.relief')}</li>
                        <li>• {t('immigration.deportationPhases.phase3.outcomes.voluntary')}</li>
                        <li>• {t('immigration.deportationPhases.phase3.outcomes.removal')}</li>
                        <li>• {t('immigration.deportationPhases.phase3.outcomes.continuances')}</li>
                        <li>• {t('immigration.deportationPhases.phase3.outcomes.closure')}</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Phase 4: Appeals and Final Removal */}
            <ScrollReveal delay={0.4}>
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-red-800 dark:text-red-200" data-testid="text-phase4-title">
                    <FileText className="mr-2 h-6 w-6" />
                    {t('immigration.deportationPhases.phase4.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-foreground">{t('immigration.deportationPhases.phase4.rightsTitle')}</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          {t('immigration.deportationPhases.phase4.rights.deadline')}
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          {t('immigration.deportationPhases.phase4.rights.federal')}
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          {t('immigration.deportationPhases.phase4.rights.stay')}
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          {t('immigration.deportationPhases.phase4.rights.motions')}
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-foreground">{t('immigration.deportationPhases.phase4.processTitle')}</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• {t('immigration.deportationPhases.phase4.process.schedule')}</li>
                        <li>• {t('immigration.deportationPhases.phase4.process.period')}</li>
                        <li>• {t('immigration.deportationPhases.phase4.process.refusal')}</li>
                        <li>• {t('immigration.deportationPhases.phase4.process.supervision')}</li>
                        <li>• {t('immigration.deportationPhases.phase4.process.bar')}</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Special Protections */}
      <section className="py-16 bg-green-50 dark:bg-green-950">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-green-800 dark:text-green-200 mb-6" data-testid="text-special-protections-title">
                {t('immigration.specialProtections.title')}
              </h2>
              <p className="text-xl text-green-700 dark:text-green-300" data-testid="text-special-protections-subtitle">
                {t('immigration.specialProtections.subtitle')}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            <ScrollReveal delay={0.1}>
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-800 dark:text-green-200" data-testid="text-us-citizens-title">
                    <UserCheck className="mr-2 h-5 w-5" />
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
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-800 dark:text-blue-200" data-testid="text-vulnerable-populations-title">
                    <Users className="mr-2 h-5 w-5" />
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
              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-purple-800 dark:text-purple-200" data-testid="text-sanctuary-jurisdictions-title">
                    <Home className="mr-2 h-5 w-5" />
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
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-800 dark:text-blue-200" data-testid="text-national-hotlines-title">
                    <Phone className="mr-2 h-6 w-6" />
                    {t('immigration.resources.hotlines.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <strong className="text-lg">{t('immigration.resources.hotlines.nif.name')}</strong>
                      <p className="text-2xl font-bold text-blue-600">{t('immigration.resources.hotlines.nif.number')}</p>
                      <p className="text-sm text-muted-foreground">{t('immigration.resources.hotlines.nif.description')}</p>
                    </div>
                    <div>
                      <strong className="text-lg">{t('immigration.resources.hotlines.aclu.name')}</strong>
                      <p className="text-2xl font-bold text-blue-600">{t('immigration.resources.hotlines.aclu.number')}</p>
                      <p className="text-sm text-muted-foreground">{t('immigration.resources.hotlines.aclu.description')}</p>
                    </div>
                    <div>
                      <strong className="text-lg">{t('immigration.resources.hotlines.doj.name')}</strong>
                      <p className="text-2xl font-bold text-blue-600">{t('immigration.resources.hotlines.doj.number')}</p>
                      <p className="text-sm text-muted-foreground">{t('immigration.resources.hotlines.doj.description')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-800 dark:text-green-200" data-testid="text-locator-services-title">
                    <BookOpen className="mr-2 h-6 w-6" />
                    {t('immigration.resources.locators.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <strong className="text-lg">{t('immigration.resources.locators.iceDetainee.name')}</strong>
                      <p className="text-lg font-bold text-green-600">{t('immigration.resources.locators.iceDetainee.url')}</p>
                      <p className="text-sm text-muted-foreground">{t('immigration.resources.locators.iceDetainee.description')}</p>
                    </div>
                    <div>
                      <strong className="text-lg">{t('immigration.resources.locators.legalServices.name')}</strong>
                      <p className="text-lg font-bold text-green-600">{t('immigration.resources.locators.legalServices.url')}</p>
                      <p className="text-sm text-muted-foreground">{t('immigration.resources.locators.legalServices.description')}</p>
                    </div>
                    <div>
                      <strong className="text-lg">{t('immigration.resources.locators.consulate.name')}</strong>
                      <p className="text-lg font-bold text-green-600">{t('immigration.resources.locators.consulate.url')}</p>
                      <p className="text-sm text-muted-foreground">{t('immigration.resources.locators.consulate.description')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>

          {/* Prepare Now Section */}
          <ScrollReveal delay={0.3}>
            <Card className="mt-8 border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-800 dark:text-purple-200" data-testid="text-prepare-now-title">
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
      <section className="py-16 bg-blue-50 dark:bg-blue-950">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-blue-800 dark:text-blue-200 mb-8" data-testid="text-get-additional-help-title">
              {t('immigration.finalCta.title')}
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/rights-info">
                <Button variant="default" size="lg" className="w-full sm:w-auto" data-testid="button-learn-rights">
                  <Shield className="mr-2 h-5 w-5" />
                  {t('immigration.finalCta.rights')}
                </Button>
              </Link>
              <Link href="/">
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
