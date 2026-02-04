import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  BookOpen,
  FileText,
  MapPin,
  Users,
  ArrowLeft,
  ArrowRight,
  Search,
  Scale,
  Phone,
  Mail,
  Navigation,
  Clock,
  UserCheck,
  Heart,
  FileSearch
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "wouter";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { searchPublicDefenderOffices, PublicDefenderOffice } from "@/lib/public-defender-services";
import { searchLegalAidOrganizations, LegalAidOrganization } from "@/lib/legal-aid-services";
import { DocumentSummarizer } from "@/components/document-summarizer";

interface ResourceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
  onClick?: () => void;
  color: string;
}

function ResourceCard({ icon, title, description, href, onClick, color }: ResourceCardProps) {
  const content = (
    <Card className="group h-full card-interactive cursor-pointer border-2 border-transparent hover:border-primary/20">
      <CardContent className="p-6 h-full flex flex-col">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${color} transition-transform duration-300 group-hover:scale-110`}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed flex-1">
          {description}
        </p>
        <div className="flex items-center gap-2 mt-4 text-primary font-medium text-sm">
          <span>{href ? "Learn more" : "Search now"}</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </CardContent>
    </Card>
  );

  if (onClick) {
    return <div onClick={onClick}>{content}</div>;
  }

  return <Link href={href || "/"}>{content}</Link>;
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

export default function Resources() {
  useScrollToTop();
  const { t } = useTranslation();

  // Public Defender search state
  const [showPublicDefenderModal, setShowPublicDefenderModal] = useState(false);
  const [pdZipCode, setPdZipCode] = useState("");
  const [pdSearching, setPdSearching] = useState(false);
  const [pdOffices, setPdOffices] = useState<PublicDefenderOffice[]>([]);
  const [pdError, setPdError] = useState("");
  const [pdHasSearched, setPdHasSearched] = useState(false);

  // Legal Aid Organizations search state
  const [showLegalAidModal, setShowLegalAidModal] = useState(false);
  const [laZipCode, setLaZipCode] = useState("");
  const [laSearching, setLaSearching] = useState(false);
  const [laOrganizations, setLaOrganizations] = useState<LegalAidOrganization[]>([]);
  const [laError, setLaError] = useState("");
  const [laHasSearched, setLaHasSearched] = useState(false);

  // Document Summarizer state
  const [showDocumentSummarizerModal, setShowDocumentSummarizerModal] = useState(false);

  const handlePublicDefenderSearch = async () => {
    if (!pdZipCode.trim() || pdZipCode.length !== 5) {
      setPdError(t('home.publicDefenderSearch.error'));
      return;
    }

    setPdSearching(true);
    setPdError("");
    setPdHasSearched(true);

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
    setLaHasSearched(true);

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

  const resources = [
    {
      icon: <BookOpen className="h-7 w-7 text-white" />,
      title: t('resources.glossary.title', { defaultValue: 'Legal Glossary' }),
      description: t('resources.glossary.description', { defaultValue: 'Understand legal terminology with our comprehensive glossary of terms commonly used in criminal proceedings.' }),
      href: "/legal-glossary",
      color: "bg-gradient-to-br from-purple-500 to-purple-700"
    },
    {
      icon: <FileText className="h-7 w-7 text-white" />,
      title: t('resources.expungement.title', { defaultValue: 'Record Expungement' }),
      description: t('resources.expungement.description', { defaultValue: 'Learn about clearing your criminal record, eligibility requirements, and the expungement process in your state.' }),
      href: "/record-expungement",
      color: "bg-gradient-to-br from-amber-500 to-amber-700"
    },
    {
      icon: <Search className="h-7 w-7 text-white" />,
      title: t('resources.courtRecords.title', { defaultValue: 'Find Court Records' }),
      description: t('resources.courtRecords.description', { defaultValue: 'Access public court records, case information, and PACER resources for federal and state courts.' }),
      href: "/court-records",
      color: "bg-gradient-to-br from-blue-500 to-blue-700"
    },
    {
      icon: <MapPin className="h-7 w-7 text-white" />,
      title: t('resources.courtLocator.title', { defaultValue: 'Find Local Courts' }),
      description: t('resources.courtLocator.description', { defaultValue: 'Locate courts in your area, find addresses, phone numbers, and directions to courthouses.' }),
      href: "/court-locator",
      color: "bg-gradient-to-br from-teal-500 to-teal-700"
    },
    {
      icon: <Users className="h-7 w-7 text-white" />,
      title: t('resources.diversionPrograms.title', { defaultValue: 'Diversion Programs' }),
      description: t('resources.diversionPrograms.description', { defaultValue: 'Explore alternative sentencing programs that may help you avoid traditional prosecution and criminal records.' }),
      href: "/diversion-programs",
      color: "bg-gradient-to-br from-green-500 to-green-700"
    },
    {
      icon: <UserCheck className="h-7 w-7 text-white" />,
      title: t('resources.publicDefender.title', { defaultValue: 'Find a Public Defender' }),
      description: t('resources.publicDefender.description', { defaultValue: 'Search for public defender offices in your area by zip code to get free legal representation.' }),
      onClick: () => setShowPublicDefenderModal(true),
      color: "bg-gradient-to-br from-indigo-500 to-indigo-700"
    },
    {
      icon: <Heart className="h-7 w-7 text-white" />,
      title: t('resources.legalAid.title', { defaultValue: 'Legal Aid Organizations' }),
      description: t('resources.legalAid.description', { defaultValue: 'Find nonprofit legal aid organizations that provide free or low-cost legal assistance in your community.' }),
      onClick: () => setShowLegalAidModal(true),
      color: "bg-gradient-to-br from-rose-500 to-rose-700"
    },
    {
      icon: <FileSearch className="h-7 w-7 text-white" />,
      title: t('resources.documentSummarizer.title', { defaultValue: 'Document Summarizer' }),
      description: t('resources.documentSummarizer.description', { defaultValue: 'Upload legal documents and get AI-powered plain-English summaries. Your documents are never stored.' }),
      onClick: () => setShowDocumentSummarizerModal(true),
      color: "bg-gradient-to-br from-cyan-500 to-cyan-700"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="vivid-header py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 vivid-header-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Scale className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              {t('resources.hero.title', { defaultValue: 'Legal Resources' })}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/85 max-w-3xl mx-auto">
              {t('resources.hero.subtitle', { defaultValue: 'Tools and information to help you navigate the legal system' })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 lg:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-10">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('common.backToHome', { defaultValue: 'Back to Home' })}
                </Button>
              </Link>
            </div>
          </ScrollReveal>

          {/* Resource Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <ScrollReveal key={resource.title} delay={index * 0.1}>
                <ResourceCard {...resource} />
              </ScrollReveal>
            ))}
          </div>

          {/* Additional Info Section */}
          <ScrollReveal delay={0.5}>
            <Card className="mt-12 bg-muted/50 border-dashed">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold mb-3">
                  {t('resources.needHelp.title', { defaultValue: 'Need Personalized Guidance?' })}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  {t('resources.needHelp.description', { defaultValue: 'Our case guidance tool can help you understand your specific situation and provide tailored information based on your charges and jurisdiction.' })}
                </p>
                <Link href="/case-guidance">
                  <Button size="lg">
                    {t('resources.needHelp.cta', { defaultValue: 'Get Case Guidance' })}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      <Footer />

      {/* Public Defender Search Modal */}
      <Dialog open={showPublicDefenderModal} onOpenChange={setShowPublicDefenderModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('home.publicDefenderSearch.title')}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder={t('home.publicDefenderSearch.inputPlaceholder')}
                value={pdZipCode}
                onChange={(e) => setPdZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                onKeyPress={(e) => e.key === 'Enter' && handlePublicDefenderSearch()}
                maxLength={5}
                className="flex-1"
                data-testid="input-pd-zip-code-resources"
              />
              <Button
                onClick={handlePublicDefenderSearch}
                disabled={pdSearching}
                data-testid="button-search-pd-resources"
              >
                <Search className="h-4 w-4 mr-2" />
                {pdSearching ? t('home.publicDefenderSearch.searching') : t('home.publicDefenderSearch.searchButton')}
              </Button>
            </div>

            {pdError && (
              <div className="text-red-600 text-sm">{pdError}</div>
            )}

            {pdOffices.length > 0 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {t('home.searchResults.foundOffices', { count: pdOffices.length, plural: pdOffices.length !== 1 ? 's' : '' })}
                </p>
                {pdOffices.map((office) => (
                  <PublicDefenderOfficeCard key={office.id} office={office} />
                ))}
              </div>
            )}

            {!pdSearching && pdHasSearched && pdOffices.length === 0 && !pdError && (
              <p className="text-sm text-muted-foreground">
                {t('home.publicDefenderSearch.noResults')}
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Legal Aid Organizations Search Modal */}
      <Dialog open={showLegalAidModal} onOpenChange={setShowLegalAidModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('home.legalAidSearch.title')}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder={t('home.legalAidSearch.inputPlaceholder')}
                value={laZipCode}
                onChange={(e) => setLaZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                onKeyPress={(e) => e.key === 'Enter' && handleLegalAidSearch()}
                maxLength={5}
                className="flex-1"
                data-testid="input-la-zip-code-resources"
              />
              <Button
                onClick={handleLegalAidSearch}
                disabled={laSearching}
                data-testid="button-search-la-resources"
              >
                <Search className="h-4 w-4 mr-2" />
                {laSearching ? t('home.legalAidSearch.searching') : t('home.legalAidSearch.searchButton')}
              </Button>
            </div>

            {laError && (
              <div className="text-red-600 text-sm">{laError}</div>
            )}

            {laOrganizations.length > 0 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {t('home.legalAidSearch.resultsFound', { count: laOrganizations.length, plural: laOrganizations.length !== 1 ? 's' : '' })}
                </p>
                {laOrganizations.map((org) => (
                  <LegalAidOrganizationCard key={org.id} organization={org} />
                ))}
              </div>
            )}

            {!laSearching && laHasSearched && laOrganizations.length === 0 && !laError && (
              <p className="text-sm text-muted-foreground">
                {t('home.legalAidSearch.noResults')}
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Summarizer Modal */}
      <Dialog open={showDocumentSummarizerModal} onOpenChange={setShowDocumentSummarizerModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
          <DocumentSummarizer
            isAttorneyMode={false}
            onClose={() => setShowDocumentSummarizerModal(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
