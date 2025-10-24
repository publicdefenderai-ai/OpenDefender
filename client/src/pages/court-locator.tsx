import { useState } from "react";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Search, 
  Phone, 
  Clock, 
  Navigation,
  Building2,
  Scale,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { searchCourthousesWithFederalData, getMockCourtData, CourtLocation } from "@/lib/court-services";

export default function CourtLocator() {
  useScrollToTop();
  const { t } = useTranslation();
  const [zipCode, setZipCode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [courts, setCourts] = useState<CourtLocation[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!zipCode.trim() || zipCode.length !== 5) {
      setError(t('courtLocator.search.error'));
      return;
    }

    setIsSearching(true);
    setError("");
    
    try {
      // Use real courthouse data from free APIs
      const courtData = await searchCourthousesWithFederalData(zipCode);
      
      if (courtData.length === 0) {
        // Fallback to mock data if no real results
        const mockData = getMockCourtData(zipCode);
        setCourts(mockData);
        setError(t('courtLocator.search.limitedData'));
      } else {
        setCourts(courtData);
      }
      
      setSearchPerformed(true);
    } catch (err) {
      console.error('Court search error:', err);
      // Use mock data as fallback
      const mockData = getMockCourtData(zipCode);
      setCourts(mockData);
      setError(t('courtLocator.search.sampleData'));
      setSearchPerformed(true);
    } finally {
      setIsSearching(false);
    }
  };

  const getCourtTypeColor = (type: CourtLocation["type"]) => {
    switch (type) {
      case "federal": return "bg-blue-600";
      case "state": return "bg-green-600";
      case "municipal": return "bg-purple-600";
      case "traffic": return "bg-orange-600";
      case "bankruptcy": return "bg-indigo-600";
      default: return "bg-gray-600";
    }
  };

  const getCourtTypeName = (type: CourtLocation["type"]) => {
    switch (type) {
      case "federal": return t('courtLocator.courtTypes.federal');
      case "state": return t('courtLocator.courtTypes.state');
      case "municipal": return t('courtLocator.courtTypes.municipal');
      case "traffic": return t('courtLocator.courtTypes.traffic');
      case "bankruptcy": return t('courtLocator.courtTypes.bankruptcy');
      default: return t('courtLocator.courtTypes.court');
    }
  };

  const stateCourts = courts.filter(court => 
    court.type === 'state' || court.type === 'municipal' || court.type === 'traffic'
  );
  const federalCourts = courts.filter(court => 
    court.type === 'federal' || court.type === 'bankruptcy'
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="gradient-hero text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-600">
                {t('courtLocator.hero.title')}
              </h1>
              <p className="text-xl text-blue-800 dark:text-blue-200 max-w-3xl mx-auto">
                {t('courtLocator.hero.subtitle')}
              </p>
            </div>
          </ScrollReveal>

          {/* Search Section */}
          <ScrollReveal delay={0.2}>
            <div className="max-w-md mx-auto mb-8">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder={t('courtLocator.search.inputPlaceholder')}
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="bg-white border-2 border-blue-300 text-black placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    data-testid="input-zip-code"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={isSearching || zipCode.length !== 5}
                  className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 shadow-lg"
                  data-testid="button-search-courts"
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mr-2"></div>
                      {t('courtLocator.search.searching')}
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      {t('courtLocator.search.searchButton')}
                    </>
                  )}
                </Button>
              </div>
              
              {error && (
                <Alert className="mt-4 border-yellow-200 bg-yellow-50">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Results Section */}
      {searchPerformed && (
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  {t('courtLocator.results.title')}
                </h2>
                <p className="text-muted-foreground">
                  {t('courtLocator.results.foundCourts', { count: courts.length, plural: courts.length !== 1 ? 's' : '' })}
                </p>
              </div>
            </ScrollReveal>

            {/* Court Results */}
            <div className="space-y-12">
              {/* State Courts Section */}
              {stateCourts.length > 0 && (
                <div>
                  <ScrollReveal>
                    <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                      <Scale className="h-6 w-6 mr-3 text-green-600" />
                      {t('courtLocator.sections.stateTitle', { count: stateCourts.length })}
                    </h3>
                    <p className="text-muted-foreground mb-8">
                      {t('courtLocator.sections.stateDesc')}
                    </p>
                  </ScrollReveal>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stateCourts.map((court, index) => (
                      <CourtCard 
                        key={court.id} 
                        court={court} 
                        index={index} 
                        getCourtTypeColor={getCourtTypeColor} 
                        getCourtTypeName={getCourtTypeName}
                        t={t}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Federal Courts Section */}
              {federalCourts.length > 0 && (
                <div>
                  <ScrollReveal>
                    <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                      <Building2 className="h-6 w-6 mr-3 text-blue-600" />
                      {t('courtLocator.sections.federalTitle', { count: federalCourts.length })}
                    </h3>
                    <p className="text-muted-foreground mb-8">
                      {t('courtLocator.sections.federalDesc')}
                    </p>
                  </ScrollReveal>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {federalCourts.map((court, index) => (
                      <CourtCard 
                        key={court.id} 
                        court={court} 
                        index={index} 
                        getCourtTypeColor={getCourtTypeColor} 
                        getCourtTypeName={getCourtTypeName}
                        t={t}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {courts.length === 0 && (
              <ScrollReveal>
                <div className="text-center py-12">
                  <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {t('courtLocator.results.noCourts')}
                  </h3>
                  <p className="text-muted-foreground">
                    {t('courtLocator.results.tryDifferent')}
                  </p>
                </div>
              </ScrollReveal>
            )}
          </div>
        </section>
      )}

      {/* Information Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                {t('courtLocator.courtInformation.title')}
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ScrollReveal delay={0.1}>
              <Card>
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <Scale className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{t('courtLocator.courtInformation.courtTypesCard.title')}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {t('courtLocator.courtInformation.courtTypesCard.description')}
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card>
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{t('courtLocator.courtInformation.courtHoursCard.title')}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {t('courtLocator.courtInformation.courtHoursCard.description')}
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <Card>
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{t('courtLocator.courtInformation.dataSourcesCard.title')}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {t('courtLocator.courtInformation.dataSourcesCard.description')}
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-foreground mb-6">
              {t('rights.disclaimer.needHelp')}
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {t('courtLocator.info.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/rights-info">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl"
                  data-testid="button-know-your-rights"
                >
                  {t('footer.knowYourRights')}
                </Button>
              </Link>
              <Link href="/case-guidance">
                <Button 
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 px-8 rounded-xl"
                  data-testid="button-get-guidance"
                >
                  {t('footer.getCaseGuidance')}
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

// Court Card Component
function CourtCard({ court, index, getCourtTypeColor, getCourtTypeName, t }: {
  court: CourtLocation;
  index: number;
  getCourtTypeColor: (type: CourtLocation["type"]) => string;
  getCourtTypeName: (type: CourtLocation["type"]) => string;
  t: any;
}) {
  return (
    <ScrollReveal key={court.id} delay={index * 0.1}>
      <Card className="h-full hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg mb-2">{court.name}</CardTitle>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge className={`${getCourtTypeColor(court.type)} text-white`}>
                  {getCourtTypeName(court.type)}
                </Badge>
                {court.county && (
                  <Badge variant="outline" className="text-xs">
                    {court.county} County
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">Distance</div>
              <div className="font-semibold text-blue-600">
                {court.distance} mi
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Address */}
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground">Address</div>
                <div className="text-sm font-medium">{court.address}</div>
              </div>
            </div>

            {/* Phone */}
            {court.phone && (
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm text-muted-foreground">{t('courtLocator.courtCard.phone')}</div>
                  <div className="text-sm font-medium">
                    <a href={`tel:${court.phone}`} className="hover:text-blue-600 transition-colors">
                      {court.phone}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Hours */}
            {court.hours && (
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm text-muted-foreground">{t('courtLocator.courtCard.hours')}</div>
                  <div className="text-sm font-medium">{court.hours}</div>
                </div>
              </div>
            )}

            {/* Services */}
            <div>
              <div className="text-sm text-muted-foreground mb-2">{t('courtLocator.courtCard.services')}</div>
              <div className="flex flex-wrap gap-1">
                {court.services.map((service) => (
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
                onClick={() => window.open(`https://maps.google.com/maps?daddr=${encodeURIComponent(court.address)}`, '_blank')}
                data-testid={`button-directions-${court.id}`}
              >
                <Navigation className="h-3 w-3 mr-1" />
                {t('courtLocator.courtCard.directions')}
              </Button>
              {court.website && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(court.website, '_blank')}
                  data-testid={`button-website-${court.id}`}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </ScrollReveal>
  );
}