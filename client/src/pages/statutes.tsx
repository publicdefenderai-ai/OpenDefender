import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Search, BookOpen, ExternalLink, AlertCircle, Loader2, ChevronDown, ChevronUp, Zap, FileText } from "lucide-react";

interface Statute {
  packageId?: string;
  title?: string;
  citation?: string;
  url?: string;
  dateIssued?: string;
  source?: string;
  summary?: string;
  penalties?: string;
  category?: string;
  content?: string;
}

interface StatuteSearchResult {
  success: boolean;
  jurisdiction?: string;
  count?: number;
  statutes: Statute[];
  source?: string;
  error?: string;
}

interface LiveStatuteLookup {
  success: boolean;
  statute?: {
    id: string;
    citation: string;
    jurisdiction: string;
    title: string;
    content: string;
    effectiveDate?: string;
    url?: string;
    chapter?: string;
    section: string;
  };
  error?: string;
}

const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'DC', name: 'District of Columbia' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
];

export default function StatutesPage() {
  const { t } = useTranslation();
  const [selectedState, setSelectedState] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchQuery, setActiveSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('federal');

  const [citationInput, setCitationInput] = useState('');
  const [activeCitation, setActiveCitation] = useState('');

  const federalUrl = activeSearchQuery
    ? `/api/statutes/federal?q=${encodeURIComponent(activeSearchQuery)}`
    : '/api/statutes/federal';

  const stateUrl = selectedState
    ? activeSearchQuery
      ? `/api/statutes/${selectedState}?q=${encodeURIComponent(activeSearchQuery)}`
      : `/api/statutes/${selectedState}`
    : '';

  const { data: federalStatutes, isLoading: loadingFederal } = useQuery<StatuteSearchResult>({
    queryKey: [federalUrl],
  });

  const { data: stateStatutes, isLoading: loadingState } = useQuery<StatuteSearchResult>({
    queryKey: [stateUrl],
    enabled: !!selectedState,
  });

  const { data: citationResult, isLoading: loadingCitation } = useQuery<LiveStatuteLookup>({
    queryKey: [`/api/openlaws/citation/${encodeURIComponent(activeCitation)}`],
    enabled: !!activeCitation,
  });

  const handleSearch = () => {
    setActiveSearchQuery(searchQuery);
  };

  const handleCitationLookup = () => {
    if (citationInput.trim()) {
      setActiveCitation(citationInput.trim());
    }
  };

  const displayStatutes = activeTab === 'federal' ? federalStatutes : stateStatutes;
  const isLoading = activeTab === 'federal' ? loadingFederal : loadingState;

  const filteredStatutes = displayStatutes?.statutes || [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="heading-statutes">
            Criminal Laws & Statutes
          </h1>
          <p className="text-lg text-muted-foreground">
            Search and browse federal and state criminal statutes
          </p>
        </div>

        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search by law name, citation, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                data-testid="input-search-statutes"
              />
            </div>
            <Button onClick={handleSearch} data-testid="button-search">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="federal" data-testid="tab-federal">Federal Laws</TabsTrigger>
            <TabsTrigger value="state" data-testid="tab-state">State Laws</TabsTrigger>
            <TabsTrigger value="lookup" data-testid="tab-lookup">
              <Zap className="h-3.5 w-3.5 mr-1.5" />
              Live Lookup
            </TabsTrigger>
          </TabsList>

          <TabsContent value="federal" className="mt-6">
            {loadingFederal ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading federal statutes...</span>
              </div>
            ) : federalStatutes?.error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{federalStatutes.error}</AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="mb-4 text-sm text-muted-foreground">
                  {filteredStatutes.length} {filteredStatutes.length === 1 ? 'statute' : 'statutes'} found
                  {federalStatutes?.source && ` · Source: ${federalStatutes.source}`}
                </div>
                <div className="grid gap-4">
                  {filteredStatutes.map((statute, index) => (
                    <StatuteCard key={statute.packageId || index} statute={statute} />
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="state" className="mt-6">
            <div className="mb-6">
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-full max-w-xs" data-testid="select-state">
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map(state => (
                    <SelectItem key={state.code} value={state.code}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!selectedState ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please select a state to view its criminal statutes
                </AlertDescription>
              </Alert>
            ) : loadingState ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading state statutes...</span>
              </div>
            ) : stateStatutes?.error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{stateStatutes.error}</AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="mb-4 text-sm text-muted-foreground">
                  {filteredStatutes.length} {filteredStatutes.length === 1 ? 'statute' : 'statutes'} found
                  {stateStatutes?.source && ` · Source: ${stateStatutes.source}`}
                </div>
                <div className="grid gap-4">
                  {filteredStatutes.map((statute, index) => (
                    <StatuteCard key={index} statute={statute} />
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="lookup" className="mt-6">
            <div className="max-w-2xl">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Live Citation Lookup</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Enter any statute citation to retrieve the full official text directly from OpenLaws. 
                  Try formats like <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">Cal. Penal Code § 242</span>, <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">18 U.S.C. § 1343</span>, or <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">Tex. Penal Code § 22.01</span>.
                </p>
                <div className="flex gap-3">
                  <Input
                    placeholder="e.g. Cal. Penal Code § 242"
                    value={citationInput}
                    onChange={(e) => setCitationInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCitationLookup()}
                    data-testid="input-citation-lookup"
                    className="flex-1"
                  />
                  <Button
                    onClick={handleCitationLookup}
                    disabled={!citationInput.trim()}
                    data-testid="button-citation-lookup"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Look Up
                  </Button>
                </div>
              </div>

              {loadingCitation && (
                <div className="flex items-center gap-3 py-8 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Fetching from OpenLaws...</span>
                </div>
              )}

              {citationResult && !loadingCitation && (
                citationResult.success && citationResult.statute ? (
                  <Card data-testid="card-citation-result">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">
                            <BookOpen className="inline h-5 w-5 mr-2 text-primary" />
                            {citationResult.statute.title}
                          </CardTitle>
                          <div className="flex flex-wrap gap-2 items-center">
                            <Badge variant="secondary">{citationResult.statute.citation}</Badge>
                            <Badge variant="outline">{citationResult.statute.jurisdiction}</Badge>
                            {citationResult.statute.section && (
                              <Badge variant="outline">§ {citationResult.statute.section}</Badge>
                            )}
                          </div>
                        </div>
                        {citationResult.statute.url && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={citationResult.statute.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {citationResult.statute.content && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2 flex items-center gap-1.5">
                            <FileText className="h-4 w-4 text-primary" />
                            Statute Text
                          </h4>
                          <div className="bg-muted/50 rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap font-mono border border-border/50">
                            {citationResult.statute.content}
                          </div>
                        </div>
                      )}
                      {citationResult.statute.effectiveDate && (
                        <p className="text-xs text-muted-foreground mt-3">
                          Effective: {new Date(citationResult.statute.effectiveDate).toLocaleDateString()}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        Source: OpenLaws · {citationResult.statute.jurisdiction} Statutes
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No statute found for "{activeCitation}". Try adjusting the citation format or check that the citation is correct.
                    </AlertDescription>
                  </Alert>
                )
              )}

              {!activeCitation && !loadingCitation && (
                <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
                  <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">Enter a citation above to retrieve live statute text from OpenLaws</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}

function StatuteCard({ statute }: { statute: Statute }) {
  const [showFullText, setShowFullText] = useState(false);
  const [fetchEnabled, setFetchEnabled] = useState(false);

  const citationKey = (statute.citation || 'unknown').replace(/[^a-z0-9]/gi, '-').toLowerCase();

  const { data: liveData, isLoading: loadingLive } = useQuery<LiveStatuteLookup>({
    queryKey: [`/api/openlaws/citation/${encodeURIComponent(statute.citation || '')}`],
    enabled: fetchEnabled && !!statute.citation,
  });

  const handleToggleFullText = () => {
    if (!showFullText) {
      setFetchEnabled(true);
    }
    setShowFullText(prev => !prev);
  };

  const liveContent = liveData?.statute?.content;
  const hasContent = statute.content || liveContent;

  return (
    <Card data-testid={`card-statute-${citationKey}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">
              <BookOpen className="inline h-5 w-5 mr-2 text-primary" />
              {statute.title || 'Untitled Statute'}
            </CardTitle>
            <div className="flex flex-wrap gap-2 items-center">
              {statute.citation && (
                <Badge variant="secondary" data-testid={`badge-citation-${statute.citation}`}>
                  {statute.citation}
                </Badge>
              )}
              {statute.category && (
                <Badge variant="outline">
                  {statute.category.replace(/_/g, ' ')}
                </Badge>
              )}
            </div>
          </div>
          {statute.url && (
            <Button
              variant="ghost"
              size="sm"
              asChild
              data-testid={`button-view-statute-${citationKey}`}
            >
              <a href={statute.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {statute.summary && (
          <div className="mb-4">
            <h4 className="font-semibold text-sm mb-1">Summary:</h4>
            <p className="text-sm text-muted-foreground">{statute.summary}</p>
          </div>
        )}
        {statute.penalties && (
          <div className="mb-4">
            <h4 className="font-semibold text-sm mb-1">Penalties:</h4>
            <p className="text-sm text-muted-foreground">{statute.penalties}</p>
          </div>
        )}
        {statute.dateIssued && (
          <div className="text-xs text-muted-foreground mb-3">
            Date Issued: {new Date(statute.dateIssued).toLocaleDateString()}
          </div>
        )}

        {statute.citation && (
          <>
            <Separator className="my-3" />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleFullText}
              className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
              data-testid={`button-full-text-${citationKey}`}
            >
              {showFullText ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Hide Full Text
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Read Full Statute Text
                </>
              )}
            </Button>

            {showFullText && (
              <div className="mt-3">
                {loadingLive ? (
                  <div className="flex items-center gap-2 py-4 text-muted-foreground text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Fetching from OpenLaws...</span>
                  </div>
                ) : liveContent ? (
                  <div>
                    <div className="bg-muted/50 rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap border border-border/50 max-h-80 overflow-y-auto">
                      {liveContent}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Live text via OpenLaws · {liveData?.statute?.jurisdiction} Statutes
                    </p>
                  </div>
                ) : statute.content ? (
                  <div className="bg-muted/50 rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap border border-border/50 max-h-80 overflow-y-auto">
                    {statute.content}
                  </div>
                ) : liveData && !liveData.success ? (
                  <p className="text-sm text-muted-foreground py-2">
                    Full text not available for this citation. 
                    {statute.url && (
                      <> View it at <a href={statute.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">the official source</a>.</>
                    )}
                  </p>
                ) : null}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
