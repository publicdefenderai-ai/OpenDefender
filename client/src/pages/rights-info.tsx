import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  Calendar, 
  MapPin, 
  Book, 
  FileText, 
  Users, 
  Phone, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Clock,
  Scale,
  Gavel,
  UserCheck,
  FileX,
  HelpCircle,
  Search,
  Mail,
  Navigation,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "wouter";

import { PrivacyBanner } from "@/components/layout/privacy-banner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useLegalResources } from "@/hooks/use-legal-data";
import { searchPublicDefenderOffices, PublicDefenderOffice } from "@/lib/public-defender-services";
import { searchLegalAidOrganizations, LegalAidOrganization } from "@/lib/legal-aid-services";

function PublicDefenderCard({ onSearchClick }: { onSearchClick: () => void }) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
          <Users className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Public Defenders</h3>
        <p className="text-muted-foreground mb-4 text-sm">
          Free legal representation for those who qualify financially
        </p>
        <Button 
          onClick={onSearchClick}
          variant="outline"
          className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
          data-testid="button-search-public-defender"
        >
          <Search className="h-4 w-4 mr-2" />
          Find Local Office
        </Button>
      </CardContent>
    </Card>
  );
}

function LegalAidCard({ onSearchClick }: { onSearchClick: () => void }) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
          <HelpCircle className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Legal Aid Organizations</h3>
        <p className="text-muted-foreground mb-4 text-sm">
          Free or low-cost legal services for criminal justice and immigration cases
        </p>
        <Button 
          onClick={onSearchClick}
          variant="outline"
          className="w-full border-green-600 text-green-600 hover:bg-green-50"
          data-testid="button-search-legal-aid"
        >
          <Search className="h-4 w-4 mr-2" />
          Find Local Organizations
        </Button>
      </CardContent>
    </Card>
  );
}

function PublicDefenderOfficeCard({ office }: { office: PublicDefenderOffice }) {
  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-lg mb-1">{office.name}</h4>
            <div className="flex flex-wrap gap-2">
              {office.county && (
                <Badge variant="outline" className="text-xs">
                  {office.county} County
                </Badge>
              )}
              <Badge className="bg-blue-600 text-white text-xs">
                {office.distance} mi away
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          {/* Address */}
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm text-muted-foreground">Address</div>
              <div className="text-sm font-medium">{office.address}</div>
            </div>
          </div>

          {/* Phone */}
          {office.phone && (
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground">Phone</div>
                <a href={`tel:${office.phone}`} className="text-sm font-medium hover:text-blue-600">
                  {office.phone}
                </a>
              </div>
            </div>
          )}

          {/* Email */}
          {office.email && (
            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <a href={`mailto:${office.email}`} className="text-sm font-medium hover:text-blue-600">
                  {office.email}
                </a>
              </div>
            </div>
          )}

          {/* Hours */}
          {office.hours && (
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground">Hours</div>
                <div className="text-sm font-medium">{office.hours}</div>
              </div>
            </div>
          )}

          {/* Services */}
          <div>
            <div className="text-sm text-muted-foreground mb-2">Services</div>
            <div className="flex flex-wrap gap-1">
              {office.services.map((service) => (
                <Badge key={service} variant="outline" className="text-xs">
                  {service}
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => window.open(`https://maps.google.com/maps?daddr=${encodeURIComponent(office.address)}`, '_blank')}
            >
              <Navigation className="h-3 w-3 mr-1" />
              Directions
            </Button>
            {office.website && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(office.website, '_blank')}
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RightsInfo() {
  const [selectedJurisdiction, setSelectedJurisdiction] = useState("federal");
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
  
  const { data: resources, isLoading } = useLegalResources(selectedJurisdiction);

  const handlePublicDefenderSearch = async () => {
    if (!pdZipCode.trim() || pdZipCode.length !== 5) {
      setPdError("Please enter a valid 5-digit ZIP code");
      return;
    }

    setPdSearching(true);
    setPdError("");
    
    try {
      const offices = await searchPublicDefenderOffices(pdZipCode);
      setPdOffices(offices);
    } catch (err) {
      console.error('Public defender search error:', err);
      setPdError("Unable to search for offices. Please try again or contact your local court for information.");
    } finally {
      setPdSearching(false);
    }
  };
  
  const handleLegalAidSearch = async () => {
    if (!laZipCode.trim() || laZipCode.length !== 5) {
      setLaError("Please enter a valid 5-digit ZIP code");
      return;
    }

    setLaSearching(true);
    setLaError("");
    
    try {
      const organizations = await searchLegalAidOrganizations(laZipCode);
      setLaOrganizations(organizations);
    } catch (err) {
      console.error('Legal aid search error:', err);
      setLaError("Unable to search for organizations. Please try again or contact your local bar association.");
    } finally {
      setLaSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PrivacyBanner />
      <Header />

      {/* Hero Section */}
      <section className="gradient-hero text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-600">
                Know Your Legal Rights
              </h1>
              <p className="text-xl text-blue-800 dark:text-blue-200 max-w-3xl mx-auto">
                Understanding your constitutional and legal rights is the first step in protecting yourself within the criminal justice system.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Quick Rights Reference */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Essential Rights Everyone Should Know
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ScrollReveal delay={0.1}>
              <QuickRightCard
                icon={<Shield className="h-6 w-6 text-white" />}
                title="Right to Remain Silent"
                description="You don't have to answer questions beyond basic identification"
                bgColor="bg-blue-600"
              />
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <QuickRightCard
                icon={<Scale className="h-6 w-6 text-white" />}
                title="Right to an Attorney"
                description="Free legal representation if you cannot afford one"
                bgColor="bg-green-600"
              />
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <QuickRightCard
                icon={<Phone className="h-6 w-6 text-white" />}
                title="Right to a Phone Call"
                description="Contact family, attorney, or bail bondsman after arrest"
                bgColor="bg-blue-500"
              />
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <QuickRightCard
                icon={<UserCheck className="h-6 w-6 text-white" />}
                title="Right to Know Charges"
                description="Must be informed of accusations against you"
                bgColor="bg-purple-600"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Detailed Rights Information */}
      <section className="py-16 bg-muted/30" id="constitutional-rights">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Your Constitutional Rights in Detail
            </h2>
          </ScrollReveal>

          <Tabs defaultValue="miranda" className="w-full">
            <ScrollReveal delay={0.1}>
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8 bg-background border border-border">
                <TabsTrigger 
                  value="miranda" 
                  data-testid="tab-miranda"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow-md hover:bg-blue-100 hover:text-blue-800 hover:font-semibold transition-all duration-200"
                >
                  Miranda Rights
                </TabsTrigger>
                <TabsTrigger 
                  value="arrest" 
                  data-testid="tab-arrest"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow-md hover:bg-blue-100 hover:text-blue-800 hover:font-semibold transition-all duration-200"
                >
                  During Arrest
                </TabsTrigger>
                <TabsTrigger 
                  value="court" 
                  data-testid="tab-court"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow-md hover:bg-blue-100 hover:text-blue-800 hover:font-semibold transition-all duration-200"
                >
                  In Court
                </TabsTrigger>
                <TabsTrigger 
                  value="prison" 
                  data-testid="tab-prison"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow-md hover:bg-blue-100 hover:text-blue-800 hover:font-semibold transition-all duration-200"
                >
                  If Convicted
                </TabsTrigger>
              </TabsList>
            </ScrollReveal>

            <TabsContent value="miranda">
              <ScrollReveal delay={0.2}>
                <MirandaRightsSection />
              </ScrollReveal>
            </TabsContent>

            <TabsContent value="arrest">
              <ScrollReveal delay={0.2}>
                <ArrestRightsSection />
              </ScrollReveal>
            </TabsContent>

            <TabsContent value="court">
              <ScrollReveal delay={0.2}>
                <CourtRightsSection />
              </ScrollReveal>
            </TabsContent>

            <TabsContent value="prison">
              <ScrollReveal delay={0.2}>
                <PrisonRightsSection />
              </ScrollReveal>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Important Disclaimers */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                <strong className="font-semibold">Legal Disclaimer:</strong> This information is for educational purposes only and does not constitute legal advice. Laws vary by jurisdiction and change over time. Always consult with a qualified attorney for advice specific to your situation.
              </AlertDescription>
            </Alert>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="text-center mt-12">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Need Immediate Legal Help?
              </h3>
              <div className="space-x-4">
                <Button className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 hover:scale-105 hover:font-extrabold transition-all duration-200 shadow-md hover:shadow-lg">
                  Emergency Legal Aid
                </Button>
                <Link href="/case-guidance">
                  <Button className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 hover:scale-105 hover:font-extrabold transition-all duration-200 shadow-md hover:shadow-lg">
                    Get Case Guidance
                  </Button>
                </Link>
              </div>
            </div>
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
              <strong>Privacy First:</strong> We do not store your personal data — all input deleted after session.
            </span>
          </div>
        </div>
      </div>

      {/* Public Defender Search Modal */}
      <Dialog open={showPublicDefenderModal} onOpenChange={setShowPublicDefenderModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Find Public Defender Offices
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Search Section */}
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Enter ZIP code"
                  value={pdZipCode}
                  onChange={(e) => setPdZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  onKeyPress={(e) => e.key === 'Enter' && handlePublicDefenderSearch()}
                  className="border-2 border-blue-300 focus:border-blue-500"
                />
              </div>
              <Button
                onClick={handlePublicDefenderSearch}
                disabled={pdSearching || pdZipCode.length !== 5}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6"
              >
                {pdSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </>
                )}
              </Button>
            </div>

            {/* Error Message */}
            {pdError && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  {pdError}
                </AlertDescription>
              </Alert>
            )}

            {/* Results */}
            {pdOffices.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Found {pdOffices.length} office{pdOffices.length !== 1 ? 's' : ''} near you
                </h3>
                
                <div className="grid gap-4">
                  {pdOffices.map((office) => (
                    <PublicDefenderOfficeCard key={office.id} office={office} />
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {!pdSearching && pdOffices.length === 0 && pdZipCode.length === 5 && !pdError && (
              <div className="text-center py-8">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No offices found</h3>
                <p className="text-muted-foreground">
                  Try searching with a different ZIP code or contact your local court for referral information.
                </p>
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
              Find Legal Aid Organizations
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <Alert className="border-blue-200 bg-blue-50">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>These organizations focus on criminal justice and immigration legal assistance.</strong> Services are often free or low-cost for those who qualify.
              </AlertDescription>
            </Alert>

            {/* Search Section */}
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Enter ZIP code"
                  value={laZipCode}
                  onChange={(e) => setLaZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  onKeyPress={(e) => e.key === 'Enter' && handleLegalAidSearch()}
                  className="border-2 border-green-300 focus:border-green-500"
                />
              </div>
              <Button
                onClick={handleLegalAidSearch}
                disabled={laSearching || laZipCode.length !== 5}
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-6"
              >
                {laSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </>
                )}
              </Button>
            </div>

            {/* Error Message */}
            {laError && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  {laError}
                </AlertDescription>
              </Alert>
            )}

            {/* Results */}
            {laOrganizations.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Found {laOrganizations.length} organization{laOrganizations.length !== 1 ? 's' : ''} near you
                </h3>
                
                <div className="grid gap-4">
                  {laOrganizations.map((org) => (
                    <LegalAidOrganizationCard key={org.id} organization={org} />
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {!laSearching && laOrganizations.length === 0 && laZipCode.length === 5 && !laError && (
              <div className="text-center py-8">
                <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No organizations found</h3>
                <p className="text-muted-foreground">
                  Try searching with a different ZIP code or contact your local bar association for referrals.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Component for displaying Legal Aid Organization cards
function LegalAidOrganizationCard({ organization }: { organization: LegalAidOrganization }) {
  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-lg mb-1">{organization.name}</h4>
            <div className="flex flex-wrap gap-2">
              {organization.county && (
                <Badge variant="outline" className="text-xs">
                  {organization.county} County
                </Badge>
              )}
              <Badge className="bg-green-600 text-white text-xs">
                {organization.distance} mi away
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {organization.organizationType}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          {/* Address */}
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm text-muted-foreground">Address</div>
              <div className="text-sm font-medium">{organization.address}</div>
            </div>
          </div>

          {/* Phone */}
          {organization.phone && (
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground">Phone</div>
                <a href={`tel:${organization.phone}`} className="text-sm font-medium hover:text-green-600">
                  {organization.phone}
                </a>
              </div>
            </div>
          )}

          {/* Email */}
          {organization.email && (
            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <a href={`mailto:${organization.email}`} className="text-sm font-medium hover:text-green-600">
                  {organization.email}
                </a>
              </div>
            </div>
          )}

          {/* Hours */}
          {organization.hours && (
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground">Hours</div>
                <div className="text-sm font-medium">{organization.hours}</div>
              </div>
            </div>
          )}

          {/* Services */}
          <div>
            <div className="text-sm text-muted-foreground mb-2">Services Offered</div>
            <div className="flex flex-wrap gap-1">
              {organization.services.map((service) => (
                <Badge key={service} variant="outline" className="text-xs">
                  {service}
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => window.open(`https://maps.google.com/maps?daddr=${encodeURIComponent(organization.address)}`, '_blank')}
            >
              <Navigation className="h-3 w-3 mr-1" />
              Directions
            </Button>
            {organization.website && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(organization.website, '_blank')}
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickRightCard({ icon, title, description, bgColor }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
}) {
  return (
    <Card className="text-center hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}>
          {icon}
        </div>
        <h3 className="font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function MirandaRightsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-primary" />
          <span>Miranda Rights</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold text-foreground mb-3">The Complete Miranda Warning:</h4>
          <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
            <p>"You have the right to remain silent."</p>
            <p>"Anything you say can and will be used against you in a court of law."</p>
            <p>"You have the right to an attorney."</p>
            <p>"If you cannot afford an attorney, one will be provided for you."</p>
            <p>"Do you understand the rights I have just read to you?"</p>
            <p>"With these rights in mind, do you wish to speak to me?"</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-3">When Miranda Rights Apply:</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>• When you are in police custody AND being interrogated</li>
            <li>• Not required for traffic stops or voluntary questioning</li>
            <li>• Must be given before custodial interrogation begins</li>
            <li>• You can invoke these rights at any time during questioning</li>
          </ul>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> If police fail to read Miranda rights, statements made during custodial interrogation may be inadmissible in court, but this doesn't automatically dismiss your case.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

function ArrestRightsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <UserCheck className="h-5 w-5 text-primary" />
          <span>Rights During Arrest</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-foreground mb-3">What You Should Do:</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Stay calm and don't resist arrest</li>
              <li>• Keep your hands visible</li>
              <li>• Exercise your right to remain silent</li>
              <li>• Ask for an attorney immediately</li>
              <li>• Remember details for your lawyer later</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-3">What You Should NOT Do:</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Don't run or resist physically</li>
              <li>• Don't argue with police</li>
              <li>• Don't consent to searches</li>
              <li>• Don't answer questions without a lawyer</li>
              <li>• Don't sign anything</li>
            </ul>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-3">Police Powers During Arrest:</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Can search you and immediate area for weapons/evidence</li>
            <li>• Can seize items in plain view</li>
            <li>• Can search your vehicle if arrested during traffic stop</li>
            <li>• Cannot search your phone without a warrant (in most cases)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function CourtRightsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Gavel className="h-5 w-5 text-primary" />
          <span>Rights in Court</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-foreground mb-3">Constitutional Rights:</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Right to a fair and speedy trial</li>
              <li>• Right to an impartial jury</li>
              <li>• Right to confront witnesses</li>
              <li>• Right to present a defense</li>
              <li>• Right to appeal conviction</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-3">Burden of Proof:</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Prosecution must prove guilt beyond reasonable doubt</li>
              <li>• You are presumed innocent until proven guilty</li>
              <li>• You don't have to prove your innocence</li>
              <li>• You have the right not to testify</li>
            </ul>
          </div>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Court Etiquette:</strong> Dress appropriately, arrive on time, stand when the judge enters, address the judge as "Your Honor," and let your attorney speak for you.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

function PrisonRightsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileX className="h-5 w-5 text-primary" />
          <span>Rights If Convicted</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold text-foreground mb-3">Continuing Rights:</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Right to appeal your conviction</li>
            <li>• Right to legal representation for appeal</li>
            <li>• Right to humane treatment in prison</li>
            <li>• Right to medical care</li>
            <li>• Right to practice religion</li>
            <li>• Right to communicate with family (with restrictions)</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-3">After Release:</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Possible probation or parole supervision</li>
            <li>• Potential employment restrictions</li>
            <li>• Loss of certain civil rights (voting, firearms)</li>
            <li>• Immigration consequences for non-citizens</li>
            <li>• Possible record expungement or sealing</li>
          </ul>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Collateral Consequences:</strong> Criminal convictions can affect employment, housing, professional licenses, student aid, and immigration status. Discuss these with your attorney.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

function ProcessStep({ number, title, description, timeframe, rights, isLast }: {
  number: number;
  title: string;
  description: string;
  timeframe: string;
  rights: string[];
  isLast: boolean;
}) {
  return (
    <div className="flex">
      <div className="flex flex-col items-center mr-6">
        <div className="w-10 h-10 legal-blue rounded-full flex items-center justify-center text-white font-bold">
          {number}
        </div>
        {!isLast && <div className="w-0.5 h-16 bg-border mt-4"></div>}
      </div>
      
      <Card className="flex-1">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-foreground">{title}</h3>
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {timeframe}
            </Badge>
          </div>
          
          <p className="text-muted-foreground mb-4">{description}</p>
          
          <div>
            <h4 className="font-medium text-foreground mb-2">Your Rights at This Stage:</h4>
            <ul className="space-y-1">
              {rights.map((right, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start">
                  <span className="text-success-green mr-2">•</span>
                  {right}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ResourceCard({ icon, title, description, contact, bgColor }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  contact: string;
  bgColor: string;
}) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mb-4`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-3">{title}</h3>
        <p className="text-muted-foreground mb-4 text-sm">{description}</p>
        <div className="flex items-center text-sm text-primary">
          <Phone className="h-4 w-4 mr-2" />
          {contact}
        </div>
      </CardContent>
    </Card>
  );
}

const processSteps = [
  {
    title: "Arrest",
    description: "Law enforcement takes you into custody based on probable cause or a warrant.",
    timeframe: "Immediate",
    rights: [
      "Right to remain silent",
      "Right to an attorney",
      "Right to a phone call",
      "Right to be informed of charges"
    ]
  },
  {
    title: "Booking",
    description: "Processing at the police station including fingerprints, photos, and personal information.",
    timeframe: "1-3 hours",
    rights: [
      "Right to medical attention if needed",
      "Right to contact attorney or family",
      "Right to humane treatment"
    ]
  },
  {
    title: "Initial Appearance/Arraignment",
    description: "First court appearance where charges are formally read and you enter a plea.",
    timeframe: "24-72 hours",
    rights: [
      "Right to be informed of charges",
      "Right to have attorney present",
      "Right to request public defender",
      "Right to reasonable bail"
    ]
  },
  {
    title: "Preliminary Hearing",
    description: "Court determines if there's probable cause to believe you committed the crime.",
    timeframe: "1-2 weeks",
    rights: [
      "Right to challenge evidence",
      "Right to cross-examine witnesses",
      "Right to attorney representation"
    ]
  },
  {
    title: "Discovery",
    description: "Both sides exchange evidence, witness lists, and other case information.",
    timeframe: "Weeks to months",
    rights: [
      "Right to see prosecution's evidence",
      "Right to present defense evidence",
      "Right to expert witnesses"
    ]
  },
  {
    title: "Trial",
    description: "Formal presentation of evidence before a judge or jury to determine guilt or innocence.",
    timeframe: "Varies",
    rights: [
      "Right to jury trial",
      "Right to confront witnesses",
      "Right to remain silent",
      "Right to present defense"
    ]
  }
];
