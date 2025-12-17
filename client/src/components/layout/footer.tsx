import { Scale, Github, Shield, Search, Phone, Mail, Navigation, Clock, MapPin, X } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { searchPublicDefenderOffices, PublicDefenderOffice } from "@/lib/public-defender-services";
import { searchLegalAidOrganizations, LegalAidOrganization } from "@/lib/legal-aid-services";
import { useTranslation } from "react-i18next";

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
                {office.distance} {t('home.publicDefenderSearch.miAway')}
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
                {organization.distance} {t('home.publicDefenderSearch.miAway')}
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

export function Footer() {
  const { t } = useTranslation();
  
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
    <>
    <footer className="bg-slate-600 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 legal-blue rounded-lg flex items-center justify-center">
                <Scale className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg">Public Defender AI</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              {t('footer.tagline')}
            </p>
            <div className="flex space-x-3">
              <a 
                href="https://github.com/shahabasghar/PublicDefenderAI" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                data-testid="link-github"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Legal Resources */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.legalResources')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/rights-info" className="hover:text-white transition-colors">
                  {t('footer.knowYourRights')}
                </Link>
              </li>
              <li>
                <Link href="/process" className="hover:text-white transition-colors">
                  {t('footer.courtProcedures')}
                </Link>
              </li>
              <li>
                <Link href="/legal-glossary" className="hover:text-white transition-colors">
                  {t('footer.legalGlossary')}
                </Link>
              </li>
              <li>
                <Link href="/record-expungement" className="hover:text-white transition-colors">
                  {t('footer.recordExpungement')}
                </Link>
              </li>
              <li>
                <Link href="/friends-family" className="hover:text-white transition-colors">
                  {t('footer.friendsFamily')}
                </Link>
              </li>
              <li>
                <Link href="/court-records" className="hover:text-white transition-colors">
                  {t('footer.courtRecords')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Get Help */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.getHelp')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/case-guidance" className="hover:text-white transition-colors">
                  {t('footer.getCaseGuidance')}
                </Link>
              </li>
              <li>
                <Link href="/immigration-guidance" className="hover:text-white transition-colors">
                  {t('footer.immigrationEnforcement')}
                </Link>
              </li>
              <li>
                <Link href="/diversion-programs" className="hover:text-white transition-colors">
                  {t('footer.diversionPrograms')}
                </Link>
              </li>
              <li>
                <Link href="/court-locator" className="hover:text-white transition-colors">
                  {t('footer.findLocalCourts')}
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setShowPublicDefenderModal(true)}
                  className="hover:text-white transition-colors text-left"
                  data-testid="button-find-public-defender-footer"
                >
                  {t('footer.findPublicDefender')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowLegalAidModal(true)}
                  className="hover:text-white transition-colors text-left"
                  data-testid="button-legal-aid-organizations-footer"
                >
                  {t('footer.legalAidOrgs')}
                </button>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold mb-4">{t('footer.about')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/mission-statement" className="hover:text-white transition-colors">
                  {t('footer.ourMission')}
                </Link>
              </li>
              <li>
                <Link href="/development-roadmap" className="hover:text-white transition-colors">
                  {t('footer.developmentRoadmap')}
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link href="/disclaimers" className="hover:text-white transition-colors">
                  {t('footer.noticeDisclaimers')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-8">
          <div className="legal-blue text-white py-4 px-6 rounded-lg">
            <div className="flex items-center justify-center space-x-2">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">
                {t('footer.privacyNotice')}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            {t('footer.copyright')}
          </p>
          <div className="flex space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">
              Accessibility
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contact
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Feedback
            </a>
          </div>
        </div>
      </div>
    </footer>

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
              onChange={(e) => setPdZipCode(e.target.value)}
              maxLength={5}
              className="flex-1"
              data-testid="input-pd-zip-code-footer"
            />
            <Button 
              onClick={handlePublicDefenderSearch}
              disabled={pdSearching}
              data-testid="button-search-pd-footer"
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

          {!pdSearching && pdOffices.length === 0 && !pdError && (
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
              onChange={(e) => setLaZipCode(e.target.value)}
              maxLength={5}
              className="flex-1"
              data-testid="input-la-zip-code-footer"
            />
            <Button 
              onClick={handleLegalAidSearch}
              disabled={laSearching}
              data-testid="button-search-la-footer"
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

          {!laSearching && laOrganizations.length === 0 && !laError && (
            <p className="text-sm text-muted-foreground">
              {t('home.legalAidSearch.noResults')}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
