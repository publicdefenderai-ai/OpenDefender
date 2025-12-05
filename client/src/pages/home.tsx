import { motion } from "framer-motion";
import { 
  AlertTriangle, 
  ArrowRight,
  Shield,
  CheckCircle,
  UserCheck,
  Phone,
  X,
  Search,
  Mail,
  Navigation,
  Clock,
  HelpCircle,
  MapPin,
  RotateCcw,
  Book,
  FileText,
  BarChart3,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Link } from "wouter";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { DataSourceCard } from "@/components/legal/data-source-card";
import { Input } from "@/components/ui/input";
import { searchPublicDefenderOffices, PublicDefenderOffice } from "@/lib/public-defender-services";
import { searchLegalAidOrganizations, LegalAidOrganization } from "@/lib/legal-aid-services";
import { GetStartedMenu } from "@/components/navigation/get-started-menu";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

interface TrustItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function TrustItem({ icon, title, description }: TrustItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="overflow-hidden border hover:border-primary/30 transition-all duration-200" data-testid={`trust-item-${title.toLowerCase().replace(/\s+/g, '-')}`}>
        <CollapsibleTrigger className="w-full" data-testid={`button-toggle-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-muted flex items-center justify-center flex-shrink-0 text-muted-foreground">
                  {icon}
                </div>
                <h3 className="font-semibold text-foreground text-left">{title}</h3>
              </div>
              <ChevronDown 
                className={`h-5 w-5 text-muted-foreground transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
              />
            </div>
          </CardContent>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="px-4 pb-4 pt-0">
            <p className="text-sm text-muted-foreground pl-[52px]" data-testid={`text-description-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              {description}
            </p>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
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
              <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
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
              <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
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

export default function Home() {
  useScrollToTop();
  const { t } = useTranslation();
  const [urgentHelpOpen, setUrgentHelpOpen] = useState(false);
  const [getStartedOpen, setGetStartedOpen] = useState(false);
  
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

  const handleUrgentHelp = () => {
    setUrgentHelpOpen(true);
  };
  
  const handlePublicDefenderSearch = async () => {
    if (!pdZipCode.trim() || pdZipCode.length !== 5) {
      setPdError(t('home.publicDefenderSearch.error'));
      return;
    }

    setPdSearching(true);
    setPdError("");
    
    try {
      const offices = await searchPublicDefenderOffices(pdZipCode);
      setPdOffices(offices);
    } catch (err) {
      console.error('Public defender search error:', err);
      setPdError(t('home.publicDefenderSearch.errorGeneral'));
    } finally {
      setPdSearching(false);
    }
  };
  
  const handleLegalAidSearch = async () => {
    if (!laZipCode.trim() || laZipCode.length !== 5) {
      setLaError(t('home.legalAidSearch.error'));
      return;
    }

    setLaSearching(true);
    setLaError("");
    
    try {
      const organizations = await searchLegalAidOrganizations(laZipCode);
      setLaOrganizations(organizations);
    } catch (err) {
      console.error('Legal aid search error:', err);
      setLaError(t('home.legalAidSearch.errorGeneral'));
    } finally {
      setLaSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-background py-16 md:py-24 lg:py-32 border-b">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 leading-tight text-foreground">
              {t('home.hero.title1')}{' '}
              <span className="text-primary">{t('home.hero.title2')}</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-10 md:mb-14 text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('home.hero.subtitle')}
            </p>
          </motion.div>

          {/* Main CTAs */}
          <ScrollReveal delay={0.2}>
            <div className="flex flex-col items-center gap-4 md:gap-5 max-w-xl mx-auto">
              <Button
                onClick={() => setGetStartedOpen(true)}
                size="lg"
                className="bg-primary hover:bg-primary/90 font-semibold py-6 px-10 rounded-lg text-lg shadow-sm transition-all duration-200 w-full md:w-auto min-h-[56px]"
                data-testid="button-get-started"
              >
                {t('home.hero.getStartedButton')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button
                onClick={handleUrgentHelp}
                variant="destructive"
                size="lg"
                className="font-semibold py-5 px-8 rounded-lg text-base shadow-lg hover:shadow-xl transition-all duration-200 w-full md:w-auto min-h-[52px] animate-pulse hover:animate-none"
                data-testid="button-urgent-help"
              >
                <AlertTriangle className="h-5 w-5 mr-2" />
                {t('home.hero.urgentHelpButton')}
              </Button>
              
              <p className="text-sm text-muted-foreground mt-2 px-4 max-w-2xl mx-auto">
                {t('home.hero.urgentHelpNotice')}
              </p>
              
              <Link href="/how-to" className="mt-2 text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition-colors flex items-center gap-1.5">
                <Book className="h-4 w-4" />
                {t('home.hero.navigatingToolButton')}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 md:mb-6">
                {t('home.features.title')}
              </h2>
              <p className="text-base md:text-xl text-muted-foreground max-w-4xl mx-auto px-2">
                {t('home.features.subtitle')}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <ScrollReveal delay={0.1}>
              <DataSourceCard
                icon={<Book className="h-5 w-5" />}
                title={t('home.features.federalCourts')}
                description={t('home.features.federalCourtsDesc')}
                status="partial"
                statusText={t('home.features.federalCourtsStatus')}
              />
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <DataSourceCard
                icon={<FileText className="h-5 w-5" />}
                title={t('home.features.stateLaws')}
                description={t('home.features.stateLawsDesc')}
                status="live"
                statusText={t('home.features.stateLawsStatus')}
              />
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <DataSourceCard
                icon={<BarChart3 className="h-5 w-5" />}
                title={t('home.features.analytics')}
                description={t('home.features.analyticsDesc')}
                status="partial"
                statusText={t('home.features.analyticsStatus')}
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-12 md:py-20 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-6 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 md:mb-6">
                {t('home.trust.title')}
              </h2>
              <p className="text-base md:text-xl text-muted-foreground px-2">
                {t('home.trust.subtitle')}
              </p>
            </div>
          </ScrollReveal>

          {/* Expandable Trust Items */}
          <div className="max-w-3xl mx-auto space-y-3">
            <ScrollReveal delay={0.1}>
              <TrustItem
                icon={<CheckCircle className="h-5 w-5" />}
                title={t('home.trust.verifiedTitle')}
                description={t('home.trust.verifiedDesc')}
              />
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <TrustItem
                icon={<Shield className="h-5 w-5" />}
                title={t('home.trust.privacyTitle')}
                description={t('home.trust.privacyDesc')}
              />
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <TrustItem
                icon={<RotateCcw className="h-5 w-5" />}
                title={t('home.trust.currentTitle')}
                description={t('home.trust.currentDesc')}
              />
            </ScrollReveal>
          </div>

          {/* Disclaimer */}
          <ScrollReveal delay={0.5}>
            <Card className="mt-12 max-w-3xl mx-auto">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">
                  <strong className="font-semibold text-foreground">{t('home.trust.disclaimerTitle')}</strong>{' '}
                  {t('home.trust.disclaimerText')}
                </p>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      <Footer />

      {/* Urgent Help Modal */}
      <Dialog open={urgentHelpOpen} onOpenChange={setUrgentHelpOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              {t('home.urgentHelp.modalTitle')}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                <strong>{t('home.urgentHelp.arrestWarning')}</strong> {t('home.urgentHelp.arrestWarningText')}
              </AlertDescription>
            </Alert>

            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-bold text-lg text-red-600">{t('home.urgentHelp.immediateActions')}</h3>
                
                <div className="space-y-3">
                  <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                    <h4 className="font-bold text-green-900 dark:text-green-100 mb-2">{t('home.urgentHelp.stayCalmTitle')}</h4>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      {t('home.urgentHelp.stayCalmText')}
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                    <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">{t('home.urgentHelp.assertRightsTitle')}</h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                      {t('home.urgentHelp.assertRightsText1')}
                    </p>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      {t('home.urgentHelp.assertRightsText2')}
                    </p>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
                    <h4 className="font-bold text-purple-900 dark:text-purple-100 mb-2">{t('home.urgentHelp.noConsentTitle')}</h4>
                    <p className="text-sm text-purple-800 dark:text-purple-200">
                      {t('home.urgentHelp.noConsentText')}
                    </p>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg">
                    <h4 className="font-bold text-amber-900 dark:text-amber-100 mb-2">{t('home.urgentHelp.publicDefenderTitle')}</h4>
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      {t('home.urgentHelp.publicDefenderText')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>{t('home.urgentHelp.rememberTitle')}</strong> {t('home.urgentHelp.rememberText')}
              </AlertDescription>
            </Alert>
          </div>
        </DialogContent>
      </Dialog>

      {/* Get Started Menu */}
      <GetStartedMenu
        isOpen={getStartedOpen}
        onClose={() => setGetStartedOpen(false)}
        onShowPublicDefender={() => setShowPublicDefenderModal(true)}
        onShowLegalAid={() => setShowLegalAidModal(true)}
      />

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
                  onKeyPress={(e) => e.key === 'Enter' && handlePublicDefenderSearch()}
                  className="border-2 border-blue-300 focus:border-blue-500"
                  data-testid="input-pd-zipcode"
                />
              </div>
              <Button
                onClick={handlePublicDefenderSearch}
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
                  onKeyPress={(e) => e.key === 'Enter' && handleLegalAidSearch()}
                  className="border-2 border-green-300 focus:border-green-500"
                  data-testid="input-la-zipcode"
                />
              </div>
              <Button
                onClick={handleLegalAidSearch}
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
    </div>
  );
}
