import { BrandShieldIcon } from "@/components/brand-logo";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Shield,
  Phone,
  Mail,
  Navigation,
  Clock,
  MapPin,
  Book,
  FileText,
  BarChart3,
  Search,
  HelpCircle,
  Compass,
  Check,
  Scale,
  Users,
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { RotatingCardCarousel } from "@/components/ui/rotating-card-carousel";
import { Input } from "@/components/ui/input";
import { searchPublicDefenderOffices, PublicDefenderOffice } from "@/lib/public-defender-services";
import { searchLegalAidOrganizations, LegalAidOrganization } from "@/lib/legal-aid-services";
import { GetStartedMenu } from "@/components/navigation/get-started-menu";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

function TrustItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="border-b border-border/50 last:border-b-0 py-4 px-2" data-testid={`trust-item-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <h3 className="font-medium text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed" data-testid={`text-description-${title.toLowerCase().replace(/\s+/g, '-')}`}>
        {description}
      </p>
    </div>
  );
}

function PublicDefenderOfficeCard({ office }: { office: PublicDefenderOffice }) {
  const { t } = useTranslation();

  return (
    <Card className="card-hover">
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
              <div className="text-sm font-medium break-words">{office.address}</div>
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
    <Card className="card-hover">
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
  const [urgentSituation, setUrgentSituation] = useState<"arrested" | "charged" | "family" | null>(null);
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

  const rotatingWords = [
    t('home.hero.rotatingWord1'),
    t('home.hero.rotatingWord2'),
    t('home.hero.rotatingWord3'),
    t('home.hero.rotatingWord4'),
  ];
  const [wordIndex, setWordIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex(i => (i + 1) % rotatingWords.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [rotatingWords.length]);

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
      <section className="relative py-16 md:py-24 lg:py-28 overflow-hidden texture-grain">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="absolute inset-0 texture-mesh" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight text-foreground">
              {t('home.hero.title1')}{' '}
              <span className="text-primary">{t('home.hero.title2')}</span>
            </h1>

            <div className="mb-8 text-xl sm:text-2xl md:text-3xl font-medium text-foreground/80">
              {t('home.hero.rotatingPrefix')}{' '}
              <span className="inline-block" style={{ minWidth: '9ch', verticalAlign: 'baseline' }}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.28 }}
                    className="text-primary font-bold inline-block"
                  >
                    {rotatingWords[wordIndex]}.
                  </motion.span>
                </AnimatePresence>
              </span>
            </div>

            <p className="text-base sm:text-lg md:text-xl mb-12 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t('home.hero.subtitle')}
            </p>
          </motion.div>

          {/* Main CTAs */}
          <ScrollReveal delay={0.2}>
            <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
              <Button
                onClick={() => setGetStartedOpen(true)}
                size="lg"
                className="bg-primary hover:bg-primary/90 font-semibold py-6 px-10 rounded-xl text-lg shadow-md hover:shadow-lg transition-all duration-200 w-full md:w-auto btn-interactive"
                data-testid="button-get-started"
              >
                {t('home.hero.getStartedButton')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button
                onClick={handleUrgentHelp}
                variant="outline"
                size="lg"
                className="font-medium py-5 px-8 rounded-xl text-base border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/50 transition-all duration-200 w-full md:w-auto"
                data-testid="button-urgent-help"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                {t('home.hero.urgentHelpButton')}
              </Button>
              
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                {t('home.hero.urgentHelpNotice')}
              </p>
              
              <Link href="/how-to">
                <button 
                  className="mt-4 text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 underline-offset-4 hover:underline"
                  data-testid="link-how-to"
                >
                  <Compass className="h-4 w-4" />
                  {t('home.hero.navigatingToolButton')}
                </button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-20 md:py-28 bg-slate-900 dark:bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-14 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t('home.commitment.title')}
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {[1, 2, 3, 4, 5].map((i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <div className="flex gap-4 group">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-teal-400/20 border border-teal-400/40 flex items-center justify-center mt-0.5 group-hover:bg-teal-400/30 transition-colors">
                    <Check className="h-4 w-4 text-teal-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2 text-base leading-snug">
                      {t(`home.commitment.pledge${i}Title`)}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {t(`home.commitment.pledge${i}Desc`)}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Data Sources Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-background border-t border-border/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-10 md:mb-12">
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('home.features.subtitle')}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <RotatingCardCarousel
              items={[
                {
                  id: "federal-courts",
                  icon: <Book className="h-6 w-6" />,
                  title: t('home.features.federalCourts'),
                  description: t('home.features.federalCourtsDesc'),
                },
                {
                  id: "state-laws",
                  icon: <FileText className="h-6 w-6" />,
                  title: t('home.features.stateLaws'),
                  description: t('home.features.stateLawsDesc'),
                },
                {
                  id: "analytics",
                  icon: <BarChart3 className="h-6 w-6" />,
                  title: t('home.features.analytics'),
                  description: t('home.features.analyticsDesc'),
                },
              ]}
              autoRotateInterval={5000}
            />
          </ScrollReveal>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-slate-50 dark:bg-slate-900/60 border-t border-border/30">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-10 md:mb-12">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
                {t('home.trust.title')}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t('home.trust.subtitle')}
              </p>
            </div>
          </ScrollReveal>

          {/* Expandable Trust Items */}
          <ScrollReveal delay={0.1}>
            <Card className="border-border/50">
              <CardContent className="p-5 md:p-6">
                <TrustItem
                  title={t('home.trust.verifiedTitle')}
                  description={t('home.trust.verifiedDesc')}
                />
                <TrustItem
                  title={t('home.trust.privacyTitle')}
                  description={t('home.trust.privacyDesc')}
                />
                <TrustItem
                  title={t('home.trust.currentTitle')}
                  description={t('home.trust.currentDesc')}
                />
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Disclaimer */}
          <ScrollReveal delay={0.3}>
            <p className="mt-10 md:mt-12 text-xs text-muted-foreground text-center leading-relaxed">
              <span className="font-medium">{t('home.trust.disclaimerTitle')}</span>{' '}
              {t('home.trust.disclaimerText')}
            </p>
          </ScrollReveal>
        </div>
      </section>

      <Footer />

      {/* Urgent Help Modal */}
      <Dialog open={urgentHelpOpen} onOpenChange={(open) => { setUrgentHelpOpen(open); if (!open) setUrgentSituation(null); }}>
        <DialogContent className="max-w-[95vw] md:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              {t('home.urgentHelp.modalTitle')}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* ── Triage step ── */}
            {urgentSituation === null && (
              <>
                <p className="text-sm text-muted-foreground">What best describes your situation right now?</p>
                <div className="space-y-3">
                  <button className="w-full text-left" onClick={() => setUrgentSituation("arrested")}>
                    <Card className="hover:shadow-md hover:border-red-400 dark:hover:border-red-600 transition-all cursor-pointer group border-red-200 dark:border-red-900 bg-red-50/40 dark:bg-red-950/20">
                      <CardContent className="p-4 flex items-start gap-3">
                        <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground group-hover:text-red-700 dark:group-hover:text-red-300">I was just arrested or am currently in custody</p>
                          <p className="text-xs text-muted-foreground mt-0.5">What to do in the next few hours</p>
                        </div>
                      </CardContent>
                    </Card>
                  </button>

                  <button className="w-full text-left" onClick={() => setUrgentSituation("charged")}>
                    <Card className="hover:shadow-md hover:border-amber-400 dark:hover:border-amber-600 transition-all cursor-pointer group">
                      <CardContent className="p-4 flex items-start gap-3">
                        <div className="w-9 h-9 bg-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Scale className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-300">I've been charged and released — I have a court date coming up</p>
                          <p className="text-xs text-muted-foreground mt-0.5">What you need to do before your first appearance</p>
                        </div>
                      </CardContent>
                    </Card>
                  </button>

                  <button className="w-full text-left" onClick={() => setUrgentSituation("family")}>
                    <Card className="hover:shadow-md hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer group">
                      <CardContent className="p-4 flex items-start gap-3">
                        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-foreground group-hover:text-blue-700 dark:group-hover:text-blue-300">Someone I know was arrested and I'm trying to help</p>
                          <p className="text-xs text-muted-foreground mt-0.5">How to find them and what to do</p>
                        </div>
                      </CardContent>
                    </Card>
                  </button>
                </div>
              </>
            )}

            {/* ── Just arrested ── */}
            {urgentSituation === "arrested" && (
              <>
                <button onClick={() => setUrgentSituation(null)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 -mb-1">
                  ← Back
                </button>
                <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800 dark:text-red-200">
                    <strong>{t('home.urgentHelp.arrestWarning')}</strong> {t('home.urgentHelp.arrestWarningText')}
                  </AlertDescription>
                </Alert>
                <Card>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-sm mb-3">{t('home.urgentHelp.immediateActions')}</h3>
                    <ol className="space-y-3">
                      {[
                        { title: t('home.urgentHelp.stayCalmTitle'), body: t('home.urgentHelp.stayCalmText') },
                        { title: t('home.urgentHelp.assertRightsTitle'), body: `${t('home.urgentHelp.assertRightsText1')} ${t('home.urgentHelp.assertRightsText2')}` },
                        { title: t('home.urgentHelp.noConsentTitle'), body: t('home.urgentHelp.noConsentText') },
                        { title: t('home.urgentHelp.publicDefenderTitle'), body: t('home.urgentHelp.publicDefenderText') },
                      ].map((step, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                          <div>
                            <h4 className="font-semibold text-sm">{step.title}</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">{step.body}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <Link href="/first-24-hours" onClick={() => { setUrgentHelpOpen(false); setUrgentSituation(null); }}>
                    <Card className="hover:shadow-md hover:border-foreground/30 transition-all cursor-pointer h-full">
                      <CardContent className="p-3 text-center">
                        <p className="text-xs font-semibold text-foreground">Full 24-Hour Guide</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Step-by-step through arrest, bail, and arraignment</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/jail-phone-call" onClick={() => { setUrgentHelpOpen(false); setUrgentSituation(null); }}>
                    <Card className="hover:shadow-md hover:border-foreground/30 transition-all cursor-pointer h-full">
                      <CardContent className="p-3 text-center">
                        <p className="text-xs font-semibold text-foreground">Jail Phone Call Guide</p>
                        <p className="text-xs text-muted-foreground mt-0.5">What to say — and what never to say</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </>
            )}

            {/* ── Charged and released ── */}
            {urgentSituation === "charged" && (
              <>
                <button onClick={() => setUrgentSituation(null)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 -mb-1">
                  ← Back
                </button>
                <Card>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-sm mb-3">Before your first court date</h3>
                    <ol className="space-y-3">
                      {[
                        { title: "Get a lawyer before you appear", body: "If you cannot afford one, contact the public defender's office in the county where you were charged immediately. Do not go to your first appearance without representation if you can avoid it." },
                        { title: "Don't discuss your case", body: "Do not talk about the charges with friends, family, or on social media. Prosecutors can subpoena anyone you speak to." },
                        { title: "Understand your bail conditions", body: "If you were released on bail, read every condition carefully. Violating any condition — even accidentally — results in immediate re-arrest." },
                        { title: "Don't miss your court date", body: "Missing a hearing results in an arrest warrant being issued. Set multiple reminders." },
                      ].map((step, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                          <div>
                            <h4 className="font-semibold text-sm">{step.title}</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">{step.body}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <Link href="/case-guidance" onClick={() => { setUrgentHelpOpen(false); setUrgentSituation(null); }}>
                    <Card className="hover:shadow-md hover:border-foreground/30 transition-all cursor-pointer h-full">
                      <CardContent className="p-3 text-center">
                        <p className="text-xs font-semibold text-foreground">Get Case Guidance</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Personalized guidance for your situation</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/process" onClick={() => { setUrgentHelpOpen(false); setUrgentSituation(null); }}>
                    <Card className="hover:shadow-md hover:border-foreground/30 transition-all cursor-pointer h-full">
                      <CardContent className="p-3 text-center">
                        <p className="text-xs font-semibold text-foreground">What Happens Next</p>
                        <p className="text-xs text-muted-foreground mt-0.5">The full criminal process explained</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </>
            )}

            {/* ── Helping family ── */}
            {urgentSituation === "family" && (
              <>
                <button onClick={() => setUrgentSituation(null)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 -mb-1">
                  ← Back
                </button>
                <Card>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-sm mb-3">How to help someone who was arrested</h3>
                    <ol className="space-y-3">
                      {[
                        { title: "Find out where they are", body: "Call the county jail or use an online inmate locator. You'll need their full legal name and ideally their date of birth." },
                        { title: "Get them legal representation", body: "Contact a criminal defense attorney or the public defender's office in the county where they were arrested. Do this before the bail hearing if at all possible." },
                        { title: "Learn their booking number and the charges", body: "You'll need this to post bail, contact their attorney, and stay informed about court dates." },
                        { title: "Be careful what you say on phone calls", body: "Jail phone calls are recorded. Don't discuss the case, the facts of what happened, or ask them to do anything related to the incident." },
                      ].map((step, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                          <div>
                            <h4 className="font-semibold text-sm">{step.title}</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">{step.body}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <Link href="/friends-family" onClick={() => { setUrgentHelpOpen(false); setUrgentSituation(null); }}>
                    <Card className="hover:shadow-md hover:border-foreground/30 transition-all cursor-pointer h-full">
                      <CardContent className="p-3 text-center">
                        <p className="text-xs font-semibold text-foreground">Full Family Guide</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Finding, contacting, and supporting someone in custody</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/jail-phone-call" onClick={() => { setUrgentHelpOpen(false); setUrgentSituation(null); }}>
                    <Card className="hover:shadow-md hover:border-foreground/30 transition-all cursor-pointer h-full">
                      <CardContent className="p-3 text-center">
                        <p className="text-xs font-semibold text-foreground">Jail Phone Calls</p>
                        <p className="text-xs text-muted-foreground mt-0.5">What to say and what to avoid</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </>
            )}
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
        <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[80vh] overflow-y-auto">
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
        <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              {t('home.legalAidSearch.title')}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <Alert className="border-blue-200 bg-blue-50">
              <AlertDescription className="text-blue-800">
                <div className="flex items-start gap-3">
                  <BrandShieldIcon size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{t('home.legalAidSearch.alertMessage')}</span>
                </div>
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
