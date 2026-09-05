import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MapPin,
  ArrowRight,
  Search,
  Scale,
  Phone,
  Mail,
  Navigation,
  Clock,
  UserCheck,
  Heart,
  BookOpen,
  FileText,
  GitBranch,
  Info,
  ExternalLink,
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
  const publicDefenderTriggerRef = useRef<HTMLDivElement>(null);

  // Legal Aid Organizations search state
  const [showLegalAidModal, setShowLegalAidModal] = useState(false);
  const [laZipCode, setLaZipCode] = useState("");
  const [laSearching, setLaSearching] = useState(false);
  const [laOrganizations, setLaOrganizations] = useState<LegalAidOrganization[]>([]);
  const [laError, setLaError] = useState("");
  const [laHasSearched, setLaHasSearched] = useState(false);
  const legalAidTriggerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="editorial-page-intro editorial-finder-intro py-10 md:py-14">
        <div className="editorial-page-intro-inner max-w-3xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {t('resources.hero.title', { defaultValue: 'Find Legal Help' })}
          </h1>
          <p className="text-base max-w-xl">
            {t('resources.hero.subtitle', { defaultValue: 'Free and low-cost legal representation near you — search by ZIP code.' })}
          </p>
          <Button asChild size="lg" className="mt-5 gap-2">
            <a href="#resource-finders">
              {t('resources.hero.nextStep', 'Search for help by ZIP code')}
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>

      {/* Two finder cards */}
      <section id="resource-finders" className="py-10 md:py-14 scroll-mt-24">
        <div className="max-w-3xl mx-auto px-4">
          <ScrollReveal>
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {/* Public Defender card */}
              <Card
                 className="editorial-finder-card cursor-pointer group"
                onClick={() => setShowPublicDefenderModal(true)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setShowPublicDefenderModal(true);
                  }
                }}
                role="button"
                tabIndex={0}
                ref={publicDefenderTriggerRef}
                data-testid="card-public-defender"
              >
                <CardContent className="p-5">
                   <UserCheck className="h-6 w-6 text-[var(--editorial-signal)] mb-3" strokeWidth={1.75} />
                  <p className="font-semibold text-foreground mb-1">
                    {t('resources.publicDefender.title', { defaultValue: 'Find a Public Defender' })}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {t('resources.publicDefender.description', { defaultValue: 'Search for public defender offices near you by ZIP code. Free legal representation if you can\'t afford an attorney.' })}
                  </p>
                   <p className="text-sm font-semibold text-primary flex items-center gap-1">
                    Search by ZIP <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </p>
                </CardContent>
              </Card>

              {/* Legal Aid card */}
              <Card
                 className="editorial-finder-card cursor-pointer group"
                onClick={() => setShowLegalAidModal(true)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setShowLegalAidModal(true);
                  }
                }}
                role="button"
                tabIndex={0}
                ref={legalAidTriggerRef}
                data-testid="card-legal-aid"
              >
                <CardContent className="p-5">
                   <Heart className="h-6 w-6 text-[var(--editorial-signal)] mb-3" strokeWidth={1.75} />
                  <p className="font-semibold text-foreground mb-1">
                    {t('resources.legalAid.title', { defaultValue: 'Find Legal Aid' })}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {t('resources.legalAid.description', { defaultValue: 'Find nonprofit legal aid organizations providing free or low-cost legal help in your community.' })}
                  </p>
                   <p className="text-sm font-semibold text-primary flex items-center gap-1">
                    Search by ZIP <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </p>
                </CardContent>
              </Card>
            </div>
          </ScrollReveal>

          {/* 211 callout */}
          <ScrollReveal delay={0.1}>
            <div className="rounded-xl border border-border bg-muted/30 p-4 mb-8 flex items-start gap-3">
              <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Call or text 211</strong> — free, 24/7 social services hotline that can also connect you to local legal aid organizations in your area.
              </p>
            </div>
          </ScrollReveal>

          {/* Secondary links */}
          <ScrollReveal delay={0.15}>
            <div className="border-t border-border/60 pt-8">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">Also available</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { href: "/court-locator",          Icon: MapPin,     label: "Court Locator" },
                  { href: "/legal-glossary",          Icon: BookOpen,   label: "Legal Glossary" },
                  { href: "/court-records",           Icon: Search,     label: "Court Records" },
                  { href: "/diversion-programs",      Icon: GitBranch,  label: "Diversion Programs" },
                  { href: "/support/reputation",      Icon: FileText,   label: "Record Expungement" },
                  { href: "/document-summarizer",     Icon: FileText,   label: "Document Summarizer" },
                ].map(({ href, Icon, label }) => (
                  <Link key={href} href={href}>
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border/60 hover:border-border hover:bg-muted/40 transition-all text-sm text-muted-foreground hover:text-foreground">
                      <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>{label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Court-Appointed Counsel section */}
      <section className="py-10 md:py-14 bg-muted/30 border-t border-border/30">
        <div className="max-w-5xl mx-auto px-4">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-2">
              <Scale className="h-5 w-5 text-slate-600" />
              <h2 className="text-xl md:text-2xl font-bold text-foreground">Beyond the Public Defender: Court-Appointed Attorneys</h2>
            </div>
            <p className="text-muted-foreground mb-8 max-w-3xl">
              When a public defender's office has a conflict of interest, is unavailable, or has reached capacity, courts appoint private attorneys from a local panel instead. Requesting court-appointed counsel works the same way as requesting a public defender — tell the judge at your first appearance that you cannot afford an attorney.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-5">
            <ScrollReveal>
              <Card>
                <CardContent className="pt-5">
                  <div className="flex gap-3">
                    <Info className="h-5 w-5 text-slate-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-2">How to find the assigned counsel program near you</p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-slate-400 mt-0.5 flex-shrink-0">•</span>
                          Search the court's website for an "assigned counsel," "appointment panel," or "indigent defense" section — many courts publish their appointed attorney lists there.
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-slate-400 mt-0.5 flex-shrink-0">•</span>
                          Ask the court clerk directly — they administer the appointment panel and can tell you who is on it and how the process works in that court.
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-slate-400 mt-0.5 flex-shrink-0">•</span>
                          At your arraignment or first appearance, tell the judge you cannot afford an attorney. The court is required to appoint one. You do not need to identify a specific attorney yourself.
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.07}>
              <Card>
                <CardContent className="pt-5">
                  <div className="flex gap-3">
                    <BookOpen className="h-5 w-5 text-slate-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-2">National resources on indigent defense</p>
                      <ul className="space-y-3 text-sm">
                        <li>
                          <a
                            href="https://www.nlada.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-medium text-foreground hover:underline"
                          >
                            National Legal Aid & Defender Association (NLADA) <ExternalLink className="h-3 w-3" />
                          </a>
                          <p className="text-muted-foreground mt-0.5">The principal national organization for public defense. Covers both public defender offices and assigned counsel programs.</p>
                        </li>
                        <li>
                          <a
                            href="https://www.americanbar.org/groups/legal_services/flh-home/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-medium text-foreground hover:underline"
                          >
                            ABA Free Legal Help Directory <ExternalLink className="h-3 w-3" />
                          </a>
                          <p className="text-muted-foreground mt-0.5">Search for free and low-cost legal help by state, including criminal defense resources.</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <Footer />

      {/* Public Defender Search Modal — unchanged */}
      <Dialog
        open={showPublicDefenderModal}
        onOpenChange={(open) => {
          setShowPublicDefenderModal(open);
          if (!open) requestAnimationFrame(() => publicDefenderTriggerRef.current?.focus());
        }}
      >
        <DialogContent className="max-w-[95vw] md:max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('home.publicDefenderSearch.title')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                type="text"
                placeholder={t('home.publicDefenderSearch.inputPlaceholder')}
                value={pdZipCode}
                onChange={(e) => setPdZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                onKeyPress={(e) => e.key === 'Enter' && handlePublicDefenderSearch()}
                maxLength={5}
                className="min-h-[44px] flex-1"
                data-testid="input-pd-zip-code-resources"
              />
              <Button className="min-h-[44px] sm:w-auto" onClick={handlePublicDefenderSearch} disabled={pdSearching} data-testid="button-search-pd-resources">
                <Search className="h-4 w-4 mr-2" />
                {pdSearching ? t('home.publicDefenderSearch.searching') : t('home.publicDefenderSearch.searchButton')}
              </Button>
            </div>
            {pdError && <div className="text-red-600 text-sm">{pdError}</div>}
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
              <p className="text-sm text-muted-foreground">{t('home.publicDefenderSearch.noResults')}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Legal Aid Search Modal — unchanged */}
      <Dialog
        open={showLegalAidModal}
        onOpenChange={(open) => {
          setShowLegalAidModal(open);
          if (!open) requestAnimationFrame(() => legalAidTriggerRef.current?.focus());
        }}
      >
        <DialogContent className="max-w-[95vw] md:max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('home.legalAidSearch.title')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                type="text"
                placeholder={t('home.legalAidSearch.inputPlaceholder')}
                value={laZipCode}
                onChange={(e) => setLaZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                onKeyPress={(e) => e.key === 'Enter' && handleLegalAidSearch()}
                maxLength={5}
                className="min-h-[44px] flex-1"
                data-testid="input-la-zip-code-resources"
              />
              <Button className="min-h-[44px] sm:w-auto" onClick={handleLegalAidSearch} disabled={laSearching} data-testid="button-search-la-resources">
                <Search className="h-4 w-4 mr-2" />
                {laSearching ? t('home.legalAidSearch.searching') : t('home.legalAidSearch.searchButton')}
              </Button>
            </div>
            {laError && <div className="text-red-600 text-sm">{laError}</div>}
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
              <p className="text-sm text-muted-foreground">{t('home.legalAidSearch.noResults')}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
