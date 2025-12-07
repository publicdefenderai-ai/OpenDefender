import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  AlertTriangle,
  Clock,
  Phone,
  Scale,
  HelpCircle,
  MapPin,
  Navigation,
  Search,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { searchPublicDefenderOffices, PublicDefenderOffice } from "@/lib/public-defender-services";
import { searchLegalAidOrganizations, LegalAidOrganization } from "@/lib/legal-aid-services";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { QAFlow } from "@/components/legal/qa-flow";
import { GuidanceDashboard } from "@/components/legal/guidance-dashboard";
import { useLegalGuidance } from "@/hooks/use-legal-data";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

interface ImmediateAction {
  action: string;
  urgency: 'urgent' | 'high' | 'medium' | 'low';
}

interface EnhancedGuidanceResult {
  sessionId: string;
  overview: string;
  criticalAlerts: string[];
  immediateActions: ImmediateAction[];
  nextSteps: string[];
  deadlines: Array<{
    event: string;
    timeframe: string;
    description: string;
    priority: 'critical' | 'important' | 'normal';
    daysFromNow?: number;
  }>;
  rights: string[];
  resources: Array<{
    type: string;
    description: string;
    contact: string;
    hours?: string;
    website?: string;
  }>;
  warnings: string[];
  evidenceToGather: string[];
  courtPreparation: string[];
  avoidActions: string[];
  timeline: Array<{
    stage: string;
    description: string;
    timeframe: string;
    completed: boolean;
  }>;
  validation?: {
    confidenceScore: number;
    isValid: boolean;
    summary: string;
    checksPerformed: number;
    checksPassed: number;
    issues: Array<{
      type: string;
      severity: 'error' | 'warning' | 'info';
      message: string;
      suggestion?: string;
    }>;
  };
  caseData: {
    jurisdiction: string;
    charges: string;
    caseStage: string;
    custodyStatus: string;
    hasAttorney: boolean;
  };
}

function PublicDefenderOfficeCard({ office }: { office: PublicDefenderOffice }) {
  const { t } = useTranslation();
  
  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-lg mb-1">{office.name}</h4>
            <div className="flex flex-wrap gap-2">
              {office.county && (
                <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {office.county} {t('home.publicDefenderSearch.county')}
                </span>
              )}
              <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                {office.distance} {t('home.publicDefenderSearch.milesAway')}
              </span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm text-muted-foreground">{t('home.publicDefenderSearch.address')}</div>
              <div className="text-sm font-medium">{office.address}</div>
            </div>
          </div>

          {office.phone && (
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground">{t('home.publicDefenderSearch.phone')}</div>
                <a href={`tel:${office.phone}`} className="text-sm font-medium hover:text-blue-600">
                  {office.phone}
                </a>
              </div>
            </div>
          )}

          {office.email && (
            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground">{t('home.publicDefenderSearch.email')}</div>
                <a href={`mailto:${office.email}`} className="text-sm font-medium hover:text-blue-600">
                  {office.email}
                </a>
              </div>
            </div>
          )}

          {office.hours && (
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground">{t('home.publicDefenderSearch.hours')}</div>
                <div className="text-sm font-medium">{office.hours}</div>
              </div>
            </div>
          )}

          <div>
            <div className="text-sm text-muted-foreground mb-2">{t('home.publicDefenderSearch.services')}</div>
            <div className="flex flex-wrap gap-1">
              {office.services.map((service) => (
                <span key={service} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {service}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => window.open(`https://maps.google.com/maps?daddr=${encodeURIComponent(office.address)}`, '_blank')}
            >
              <Navigation className="h-3 w-3 mr-1" />
              {t('home.publicDefenderSearch.directions')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LegalAidOrganizationCard({ organization }: { organization: LegalAidOrganization }) {
  const { t } = useTranslation();
  
  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-lg mb-1">{organization.name}</h4>
            <div className="flex flex-wrap gap-2">
              {organization.county && (
                <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {organization.county} {t('home.publicDefenderSearch.county')}
                </span>
              )}
              <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                {organization.distance} {t('home.publicDefenderSearch.milesAway')}
              </span>
              <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                {organization.organizationType}
              </span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm text-muted-foreground">{t('home.publicDefenderSearch.address')}</div>
              <div className="text-sm font-medium">{organization.address}</div>
            </div>
          </div>

          {organization.phone && (
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground">{t('home.publicDefenderSearch.phone')}</div>
                <a href={`tel:${organization.phone}`} className="text-sm font-medium hover:text-green-600">
                  {organization.phone}
                </a>
              </div>
            </div>
          )}

          {organization.email && (
            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground">{t('home.publicDefenderSearch.email')}</div>
                <a href={`mailto:${organization.email}`} className="text-sm font-medium hover:text-green-600">
                  {organization.email}
                </a>
              </div>
            </div>
          )}

          {organization.hours && (
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground">{t('home.publicDefenderSearch.hours')}</div>
                <div className="text-sm font-medium">{organization.hours}</div>
              </div>
            </div>
          )}

          <div>
            <div className="text-sm text-muted-foreground mb-2">{t('home.legalAidSearch.servicesOffered')}</div>
            <div className="flex flex-wrap gap-1">
              {organization.services.map((service) => (
                <span key={service} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {service}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => window.open(`https://maps.google.com/maps?daddr=${encodeURIComponent(organization.address)}`, '_blank')}
            >
              <Navigation className="h-3 w-3 mr-1" />
              {t('home.publicDefenderSearch.directions')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CaseGuidance() {
  useScrollToTop();
  const { t } = useTranslation();
  const [showQAFlow, setShowQAFlow] = useState(false);
  const [guidanceResult, setGuidanceResult] = useState<EnhancedGuidanceResult | null>(null);
  const { generateGuidance, deleteGuidance } = useLegalGuidance();

  // Public Defender search state
  const [showPublicDefenderModal, setShowPublicDefenderModal] = useState(false);
  const [pdZipCode, setPdZipCode] = useState("");
  const [pdSearching, setPdSearching] = useState(false);
  const [pdOffices, setPdOffices] = useState<PublicDefenderOffice[]>([]);
  const [pdError, setPdError] = useState("");

  // Legal Aid Organizations search state
  const [showLegalAidModal, setShowLegalAidModal] = useState(false);
  const [laZipCode, setLaZipCode] = useState("");
  const [laSearching, setLaSearching] = useState(false);
  const [laOrganizations, setLaOrganizations] = useState<LegalAidOrganization[]>([]);
  const [laError, setLaError] = useState("");

  const handleQAComplete = async (data: any) => {
    try {
      console.log("Sending guidance request with data:", data);
      const result = await generateGuidance.mutateAsync(data);
      console.log("Received guidance result:", result);
      
      if (result && result.success) {
        // Wait a tick to ensure the API response is fully processed
        // This prevents partial rendering of guidance data
        await new Promise(resolve => setTimeout(resolve, 0));
        
        // The guidance is directly the EnhancedGuidance object
        const guidance = result.guidance;
        console.log("Processing guidance data:", guidance);
        
        // Build the complete guidance data object synchronously
        const guidanceData: EnhancedGuidanceResult = {
          sessionId: result.sessionId,
          overview: guidance.overview || '',
          criticalAlerts: guidance.criticalAlerts || [],
          immediateActions: guidance.immediateActions || [],
          nextSteps: guidance.nextSteps || [],
          deadlines: guidance.deadlines || [],
          rights: guidance.rights || [],
          resources: guidance.resources || [],
          warnings: guidance.warnings || [],
          evidenceToGather: guidance.evidenceToGather || [],
          courtPreparation: guidance.courtPreparation || [],
          avoidActions: guidance.avoidActions || [],
          timeline: guidance.timeline || [],
          validation: guidance.validation,
          caseData: {
            ...data,
            charges: Array.isArray(data.charges) ? data.charges.join(', ') : data.charges
          },
        };
        
        // Close the QA flow first
        setShowQAFlow(false);
        
        // Then set the complete guidance result in one atomic update
        // This ensures the guidance dashboard receives complete, stable data
        setGuidanceResult(guidanceData);
      } else {
        console.error("API returned unsuccessful result:", result);
        alert("Failed to generate guidance. Please try again.");
      }
    } catch (error) {
      console.error("Failed to generate guidance:", error);
      console.error("Error details:", error);
      alert("An error occurred while generating guidance. Please try again.");
    }
  };

  const handleNewSession = async () => {
    if (guidanceResult?.sessionId) {
      await deleteGuidance.mutateAsync(guidanceResult.sessionId);
    }
    setGuidanceResult(null);
    setShowQAFlow(true);
  };

  const handleStartQA = () => {
    setShowQAFlow(true);
  };

  const handlePDSearch = async () => {
    if (!pdZipCode || pdZipCode.length !== 5) {
      setPdError("Please enter a valid 5-digit ZIP code");
      return;
    }
    setPdSearching(true);
    setPdError("");
    try {
      const results = await searchPublicDefenderOffices(pdZipCode);
      setPdOffices(results);
      if (results.length === 0) {
        setPdError("No public defender offices found in this area");
      }
    } catch (error) {
      setPdError("Error searching for public defenders. Please try again.");
    } finally {
      setPdSearching(false);
    }
  };

  const handleLASearch = async () => {
    if (!laZipCode || laZipCode.length !== 5) {
      setLaError("Please enter a valid 5-digit ZIP code");
      return;
    }
    setLaSearching(true);
    setLaError("");
    try {
      const results = await searchLegalAidOrganizations(laZipCode);
      setLaOrganizations(results);
      if (results.length === 0) {
        setLaError("No legal aid organizations found in this area");
      }
    } catch (error) {
      setLaError("Error searching for legal aid organizations. Please try again.");
    } finally {
      setLaSearching(false);
    }
  };

  // Show loading state while generating guidance
  if (generateGuidance.isPending) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="relative">
                  <div className="h-16 w-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
                  <Scale className="h-8 w-8 text-blue-600 dark:text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Generating Your Personalized Guidance</h3>
                  <p className="text-sm text-muted-foreground">
                    Our AI is analyzing your case details and creating customized legal guidance. This may take up to a minute...
                  </p>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 dark:bg-blue-400 h-full rounded-full animate-pulse" style={{ width: '70%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (showQAFlow) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <QAFlow 
            onComplete={handleQAComplete}
            onCancel={() => setShowQAFlow(false)}
          />
        </main>
        <Footer />
      </div>
    );
  }

  if (guidanceResult) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="px-4 py-8">
          <GuidanceDashboard 
            guidance={guidanceResult} 
            onClose={() => setGuidanceResult(null)}
            onShowPublicDefender={() => setShowPublicDefenderModal(true)}
            onShowLegalAid={() => setShowLegalAidModal(true)}
          />
        </main>
        
        {/* Public Defender Search Modal */}
        <Dialog open={showPublicDefenderModal} onOpenChange={setShowPublicDefenderModal}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {t('home.publicDefenderSearch.title')}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder={t('home.publicDefenderSearch.inputPlaceholder')}
                    value={pdZipCode}
                    onChange={(e) => setPdZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                    onKeyPress={(e) => e.key === 'Enter' && handlePDSearch()}
                    className="border-2 border-blue-300 focus:border-blue-500"
                    data-testid="input-pd-zipcode"
                  />
                </div>
                <Button
                  onClick={handlePDSearch}
                  disabled={pdSearching || pdZipCode.length !== 5}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6"
                  data-testid="button-search-pd"
                >
                  {pdSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      {t('home.publicDefenderSearch.searching')}
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      {t('home.publicDefenderSearch.searchButton')}
                    </>
                  )}
                </Button>
              </div>

              {pdError && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    {pdError}
                  </AlertDescription>
                </Alert>
              )}

              {pdOffices.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    {t('home.searchResults.foundOffices', { count: pdOffices.length, plural: pdOffices.length !== 1 ? 's' : '' })}
                  </h3>
                  
                  <div className="grid gap-4">
                    {pdOffices.map((office) => (
                      <PublicDefenderOfficeCard key={office.id} office={office} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Legal Aid Organizations Search Modal */}
        <Dialog open={showLegalAidModal} onOpenChange={setShowLegalAidModal}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                {t('home.legalAidSearch.title')}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <Alert className="border-blue-200 bg-blue-50">
                <Shield className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  {t('home.legalAidSearch.alertMessage')}
                </AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder={t('home.legalAidSearch.inputPlaceholder')}
                    value={laZipCode}
                    onChange={(e) => setLaZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                    onKeyPress={(e) => e.key === 'Enter' && handleLASearch()}
                    className="border-2 border-green-300 focus:border-green-500"
                    data-testid="input-la-zipcode"
                  />
                </div>
                <Button
                  onClick={handleLASearch}
                  disabled={laSearching || laZipCode.length !== 5}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-6"
                  data-testid="button-search-la"
                >
                  {laSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      {t('home.legalAidSearch.searching')}
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      {t('home.legalAidSearch.searchButton')}
                    </>
                  )}
                </Button>
              </div>

              {laError && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    {laError}
                  </AlertDescription>
                </Alert>
              )}

              {laOrganizations.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    {t('home.legalAidSearch.resultsFound', { count: laOrganizations.length, plural: laOrganizations.length !== 1 ? 's' : '' })}
                  </h3>
                  
                  <div className="grid gap-4">
                    {laOrganizations.map((org) => (
                      <LegalAidOrganizationCard key={org.id} organization={org} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="vivid-header py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 vivid-header-content text-center">
          <ScrollReveal>
            <h1 className="text-3xl md:text-4xl font-bold mb-4" data-testid="heading-case-title">
              {t('case.hero.title')}
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-8" data-testid="text-case-description">
              {t('case.hero.description')}
            </p>
            
            <Button
              onClick={handleStartQA}
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-3 rounded-lg shadow-lg"
              data-testid="button-start-guidance"
            >
              {t('case.hero.startButton')}
            </Button>
          </ScrollReveal>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-center text-foreground mb-10" data-testid="heading-how-it-works">
              {t('case.howItWorks.title')}
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-4 gap-6">
            <ScrollReveal delay={0.1}>
              <StepCard
                number={1}
                title={t('case.howItWorks.step1Title')}
                description={t('case.howItWorks.step1Desc')}
              />
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <StepCard
                number={2}
                title={t('case.howItWorks.step2Title')}
                description={t('case.howItWorks.step2Desc')}
              />
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <StepCard
                number={3}
                title={t('case.howItWorks.step3Title')}
                description={t('case.howItWorks.step3Desc')}
              />
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <StepCard
                number={4}
                title={t('case.howItWorks.step4Title')}
                description={t('case.howItWorks.step4Desc')}
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Privacy & Security */}
      <section className="py-12 bg-background">
        <div className="max-w-4xl mx-auto px-4">
          <ScrollReveal>
            <div className="bg-muted/50 rounded-xl p-6 md:p-8">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center mb-4 ring-1 ring-primary/20">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground" data-testid="heading-privacy">
                  {t('case.privacy.title')}
                </h2>
              </div>

              <PrivacyAssurancesCarousel />

              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                <Button
                  onClick={handleStartQA}
                  data-testid="button-start-guidance-bottom"
                >
                  {t('case.privacy.getStartedButton')}
                </Button>
                <Link href="/rights-info">
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-auto"
                    data-testid="button-learn-rights"
                  >
                    {t('case.privacy.learnRightsButton')}
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-muted-foreground text-center">
            <span className="font-medium">{t('common.important')}:</span> {t('case.privacy.disclaimer')}
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function StepCard({ number, title, description }: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3 text-sm font-semibold">
        {number}
      </div>
      <h3 className="font-medium text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function PrivacyAssurancesCarousel() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const items = [
    {
      title: t('case.privacy.noStorageTitle'),
      description: t('case.privacy.noStorageDesc'),
    },
    {
      title: t('case.privacy.sessionOnlyTitle'),
      description: t('case.privacy.sessionOnlyDesc'),
    },
    {
      title: t('case.privacy.autoDeleteTitle'),
      description: t('case.privacy.autoDeleteDesc'),
    },
    {
      title: t('case.privacy.anonymousTitle'),
      description: t('case.privacy.anonymousDesc'),
    },
  ];

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [items.length, isPaused]);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      role="region"
      aria-live="polite"
      data-testid="carousel-privacy"
    >
      <div className="flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-center px-6 py-4 border border-border rounded-lg bg-background/50 min-w-[280px] max-w-sm"
          >
            <h3 className="font-semibold text-foreground mb-1">
              {items[activeIndex].title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {items[activeIndex].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "bg-primary w-6"
                : "w-2 bg-transparent border border-muted-foreground/40 hover:border-primary/60"
            }`}
            aria-label={`Go to privacy point ${index + 1}`}
            data-testid={`carousel-dot-${index}`}
          />
        ))}
      </div>
    </div>
  );
}



