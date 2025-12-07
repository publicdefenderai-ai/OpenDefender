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
import { Search, BookOpen, ExternalLink, AlertCircle, Loader2 } from "lucide-react";

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
}

interface StatuteSearchResult {
  success: boolean;
  jurisdiction?: string;
  count?: number;
  statutes: Statute[];
  source?: string;
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

  const handleSearch = () => {
    setActiveSearchQuery(searchQuery);
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
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="federal" data-testid="tab-federal">Federal Laws</TabsTrigger>
            <TabsTrigger value="state" data-testid="tab-state">State Laws</TabsTrigger>
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
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}

function StatuteCard({ statute }: { statute: Statute }) {
  const citationKey = (statute.citation || 'unknown').replace(/[^a-z0-9]/gi, '-').toLowerCase();
  
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
          <div className="mb-2">
            <h4 className="font-semibold text-sm mb-1">Penalties:</h4>
            <p className="text-sm text-muted-foreground">{statute.penalties}</p>
          </div>
        )}
        {statute.dateIssued && (
          <div className="text-xs text-muted-foreground mt-2">
            Date Issued: {new Date(statute.dateIssued).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
