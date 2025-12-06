import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  MapPin, 
  ArrowLeft,
  Filter,
  X,
  Phone,
  Mail,
  ExternalLink,
  Users,
  CheckCircle,
  Loader2,
  Info
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "wouter";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { 
  diversionPrograms, 
  searchDiversionPrograms, 
  searchDiversionProgramsExpanded,
  getProgramsByState, 
  getAvailableStates,
  type ExpandedSearchResult
} from "@/lib/diversion-programs-data";

interface DiversionProgramCardProps {
  program: any;
}

function DiversionProgramCard({ program }: DiversionProgramCardProps) {
  const { t } = useTranslation();
  
  return (
    <Card className="hover:shadow-lg transition-all duration-300 h-full">
      <CardHeader>
        <CardTitle className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{program.name}</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                {program.county ? `${program.county} ${t('diversionPrograms.programCard.county')}` : program.state}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {program.jurisdictionType}
              </Badge>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Location */}
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm text-muted-foreground">{t('diversionPrograms.programCard.location')}</div>
              <div className="text-sm font-medium">
                {program.cities ? program.cities.slice(0, 3).join(", ") : program.county ? `${program.county} ${t('diversionPrograms.programCard.county')}` : program.state}
                {program.cities && program.cities.length > 3 && ` ${t('diversionPrograms.programCard.moreLocations', { count: program.cities.length - 3 })}`}
              </div>
            </div>
          </div>

          {/* Program Types */}
          <div>
            <div className="text-sm text-muted-foreground mb-2">{t('diversionPrograms.programCard.programTypes')}</div>
            <div className="flex flex-wrap gap-1">
              {program.programTypes.map((type: string) => (
                <Badge key={type} variant="secondary" className="text-xs">
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          {/* Eligibility */}
          {program.eligibilityNotes && (
            <div>
              <div className="text-sm text-muted-foreground mb-1">{t('diversionPrograms.programCard.eligibility')}</div>
              <p className="text-sm text-foreground">{program.eligibilityNotes}</p>
            </div>
          )}

          {/* Contact Information */}
          {program.contact && (
            <div className="space-y-2 pt-2 border-t">
              <div className="text-sm text-muted-foreground mb-2">{t('diversionPrograms.programCard.contactInformation')}</div>
              
              {program.contact.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <a 
                    href={`tel:${program.contact.phone}`} 
                    className="text-sm hover:text-blue-600 transition-colors"
                  >
                    {program.contact.phone}
                  </a>
                </div>
              )}

              {program.contact.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <a 
                    href={`mailto:${program.contact.email}`} 
                    className="text-sm hover:text-blue-600 transition-colors"
                  >
                    {program.contact.email}
                  </a>
                </div>
              )}

              {program.contact.url && (
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  <a 
                    href={program.contact.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm hover:text-blue-600 transition-colors"
                  >
                    {t('diversionPrograms.programCard.visitWebsite')}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function DiversionPrograms() {
  useScrollToTop();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedProgramType, setSelectedProgramType] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [expandedSearchResult, setExpandedSearchResult] = useState<ExpandedSearchResult | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Run expanded search when debounced query changes (for zip codes)
  // Use a ref to track the current query to prevent race conditions
  const latestQueryRef = useRef<string>("");
  
  useEffect(() => {
    const currentQuery = debouncedQuery.trim();
    latestQueryRef.current = currentQuery;
    
    const runExpandedSearch = async () => {
      // Clear loading state immediately for empty/non-zip queries
      if (!currentQuery) {
        setIsSearching(false);
        setExpandedSearchResult(null);
        return;
      }
      
      // Only use async search for zip codes (5 digits)
      if (/^\d{5}$/.test(currentQuery)) {
        setIsSearching(true);
        try {
          const result = await searchDiversionProgramsExpanded(currentQuery);
          // Only update state if this is still the latest query (prevents race conditions)
          if (latestQueryRef.current === currentQuery) {
            setExpandedSearchResult(result);
            setIsSearching(false);
          }
        } catch (error) {
          console.error('Error in expanded search:', error);
          if (latestQueryRef.current === currentQuery) {
            setExpandedSearchResult({ programs: searchDiversionPrograms(currentQuery) });
            setIsSearching(false);
          }
        }
      } else {
        // For non-zip searches, use sync search and clear loading state
        setIsSearching(false);
        setExpandedSearchResult({ programs: searchDiversionPrograms(currentQuery) });
      }
    };
    
    runExpandedSearch();
  }, [debouncedQuery]);

  // Get all unique program types
  const availableProgramTypes = useMemo(() => {
    const types = new Set<string>();
    diversionPrograms.forEach(program => {
      program.programTypes.forEach(type => types.add(type));
    });
    return Array.from(types).sort();
  }, []);

  // Filter programs based on search, state, and program type
  const filteredPrograms = useMemo(() => {
    // Start with expanded search results if available, otherwise all programs
    let programs = expandedSearchResult?.programs ?? (debouncedQuery.trim() ? [] : diversionPrograms);

    // If no expanded search result but we have a query (and not searching), fall back
    if (!expandedSearchResult && debouncedQuery.trim() && !isSearching) {
      programs = searchDiversionPrograms(debouncedQuery);
    }

    // Apply state filter
    if (selectedState && selectedState !== "all") {
      programs = programs.filter(program => program.state === selectedState);
    }

    // Apply program type filter
    if (selectedProgramType && selectedProgramType !== "all") {
      programs = programs.filter(program => 
        program.programTypes.includes(selectedProgramType)
      );
    }

    return programs.sort((a, b) => a.name.localeCompare(b.name));
  }, [expandedSearchResult, debouncedQuery, selectedState, selectedProgramType, isSearching]);

  const availableStates = getAvailableStates();

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedState("");
    setSelectedProgramType("");
    setExpandedSearchResult(null);
  };

  const hasActiveFilters = searchQuery || selectedState || selectedProgramType;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section - Green Vivid Header */}
      <section className="vivid-header-green py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 vivid-header-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              {t('diversionPrograms.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/85 max-w-3xl mx-auto">
              {t('diversionPrograms.hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-8">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('diversionPrograms.navigation.backToHome')}
                </Button>
              </Link>
              <div className="text-sm text-muted-foreground">
                {hasActiveFilters 
                  ? t('diversionPrograms.navigation.programsCount', { count: filteredPrograms.length, total: diversionPrograms.length })
                  : t('diversionPrograms.navigation.totalPrograms', { total: diversionPrograms.length, defaultValue: `${diversionPrograms.length} programs available` })
                }
              </div>
            </div>
          </ScrollReveal>

          {/* Search and Filters */}
          <ScrollReveal delay={0.1}>
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t('diversionPrograms.search.placeholder')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                      data-testid="input-location-search"
                    />
                  </div>

                  {/* State and Program Type Filters */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">{t('diversionPrograms.search.filterByState')}</label>
                      <Select
                        value={selectedState}
                        onValueChange={setSelectedState}
                      >
                        <SelectTrigger data-testid="select-state-filter">
                          <SelectValue placeholder={t('diversionPrograms.search.allStates')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t('diversionPrograms.search.allStates')}</SelectItem>
                          {availableStates.map(state => (
                            <SelectItem key={state} value={state}>
                              {state === "Federal" ? t('diversionPrograms.search.federalPrograms') : state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">{t('diversionPrograms.search.filterByProgramType')}</label>
                      <Select
                        value={selectedProgramType}
                        onValueChange={setSelectedProgramType}
                      >
                        <SelectTrigger data-testid="select-program-type-filter">
                          <SelectValue placeholder={t('diversionPrograms.search.allProgramTypes')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t('diversionPrograms.search.allProgramTypes')}</SelectItem>
                          {availableProgramTypes.map(type => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {hasActiveFilters && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-muted-foreground"
                        data-testid="button-clear-filters"
                      >
                        <X className="h-4 w-4 mr-2" />
                        {t('diversionPrograms.search.clearAllFilters')}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Expanded Search Info - Shows when zip code search expanded to state */}
          {expandedSearchResult?.expandedToState && (
            <ScrollReveal delay={0.12}>
              <Alert className="mb-6 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                <Info className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  {t('diversionPrograms.expandedSearch.message', {
                    zipCode: expandedSearchResult.searchedZipCode,
                    state: expandedSearchResult.expandedToState,
                    count: expandedSearchResult.programs.length,
                    defaultValue: `Showing all ${expandedSearchResult.programs.length} programs in ${expandedSearchResult.expandedToState} for ZIP code ${expandedSearchResult.searchedZipCode}. These programs may be available to you or accept referrals from your area.`
                  })}
                </AlertDescription>
              </Alert>
            </ScrollReveal>
          )}

          {/* Loading State */}
          {isSearching && (
            <ScrollReveal delay={0.12}>
              <Card className="mb-6">
                <CardContent className="p-6 flex items-center justify-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {t('diversionPrograms.search.searching', { defaultValue: 'Searching for programs near you...' })}
                  </span>
                </CardContent>
              </Card>
            </ScrollReveal>
          )}

          {/* Information Banner */}
          <ScrollReveal delay={0.15}>
            <Card className="mb-8 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                      {t('diversionPrograms.infoBanner.title')}
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {t('diversionPrograms.infoBanner.description')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Programs List - Only show after search/filter is applied */}
          <ScrollReveal delay={0.2}>
            {!hasActiveFilters ? (
              /* Initial state - prompt user to search */
              <Card className="border-dashed border-2">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{t('diversionPrograms.initialState.title', { defaultValue: 'Search for Diversion Programs' })}</h3>
                  <p className="text-muted-foreground mb-2 max-w-md mx-auto">
                    {t('diversionPrograms.initialState.description', { defaultValue: 'Enter your city, county, or state above to find diversion programs in your area.' })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('diversionPrograms.initialState.programCount', { count: diversionPrograms.length, defaultValue: `We have ${diversionPrograms.length} programs across multiple states ready to help.` })}
                  </p>
                </CardContent>
              </Card>
            ) : filteredPrograms.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredPrograms.map((program) => (
                  <DiversionProgramCard
                    key={program.id}
                    program={program}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{t('diversionPrograms.emptyState.title')}</h3>
                  <p className="text-muted-foreground mb-4">
                    {t('diversionPrograms.emptyState.description')}
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    {t('diversionPrograms.emptyState.clearFilters')}
                  </Button>
                </CardContent>
              </Card>
            )}
          </ScrollReveal>

          {/* Quick Navigation */}
          <ScrollReveal delay={0.3}>
            <div className="mt-12 grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">{t('diversionPrograms.quickNav.legalGuidanceTitle')}</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {t('diversionPrograms.quickNav.legalGuidanceDesc')}
                  </p>
                  <Link href="/case-guidance">
                    <Button variant="outline" className="w-full">
                      {t('diversionPrograms.quickNav.legalGuidanceButton')}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">{t('diversionPrograms.quickNav.recordClearingTitle')}</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {t('diversionPrograms.quickNav.recordClearingDesc')}
                  </p>
                  <Link href="/record-expungement">
                    <Button variant="outline" className="w-full">
                      {t('diversionPrograms.quickNav.recordClearingButton')}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}