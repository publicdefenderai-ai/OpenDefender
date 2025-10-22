import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, ExternalLink, AlertCircle, FileText, Scale, DollarSign, Download } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

export default function CourtRecords() {
  const [searchTerm, setSearchTerm] = useState('');
  const [caseName, setCaseName] = useState('');
  const [docketNumber, setDocketNumber] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/court-records/search', { q: searchTerm, case_name: caseName, docket_number: docketNumber }],
    enabled: false,
  });

  const handleSearch = () => {
    if (searchTerm || caseName || docketNumber) {
      setHasSearched(true);
      refetch();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-3">Court Records Search</h1>
          <p className="text-lg text-muted-foreground mb-4">
            Search free court records from the RECAP Archive and case law database
          </p>
          
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Free First Policy:</strong> We search the free RECAP Archive first. If a document isn't available for free, 
              we'll show you where to find it on PACER (which charges fees). Install the{' '}
              <a href="/recap-extensions" className="underline font-medium hover:text-primary">RECAP browser extension</a>
              {' '}to automatically save your PACER purchases to the free archive.
            </AlertDescription>
          </Alert>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Parameters
            </CardTitle>
            <CardDescription>
              Enter at least one search criterion below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search Term</label>
                <Input
                  placeholder="Keywords, party names..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  data-testid="input-search-term"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Case Name</label>
                <Input
                  placeholder="Smith v. Jones"
                  value={caseName}
                  onChange={(e) => setCaseName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  data-testid="input-case-name"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Docket Number</label>
                <Input
                  placeholder="1:20-cv-12345"
                  value={docketNumber}
                  onChange={(e) => setDocketNumber(e.target.value)}
                  onKeyPress={handleKeyPress}
                  data-testid="input-docket-number"
                />
              </div>
            </div>
            <Button 
              onClick={handleSearch} 
              className="w-full md:w-auto"
              disabled={!searchTerm && !caseName && !docketNumber}
              data-testid="button-search"
            >
              <Search className="w-4 h-4 mr-2" />
              Search Court Records
            </Button>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Search failed. Please try again or refine your search criteria.
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && hasSearched && (data as any)?.success && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">
                Search Results
              </h2>
              <p className="text-sm text-muted-foreground">
                {((data as any)?.recap?.count || 0) + ((data as any)?.opinions?.count || 0)} total results
              </p>
            </div>

            {(data as any)?.message && (
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{(data as any).message}</AlertDescription>
              </Alert>
            )}

            {(data as any)?.recap?.count > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  RECAP Archive - Federal Court Filings ({(data as any).recap.count})
                </h3>
                <div className="space-y-4">
                  {(data as any).recap.results.map((result: any, idx: number) => (
                    <Card key={result.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2" data-testid={`text-case-name-${idx}`}>
                              {result.case_name}
                            </CardTitle>
                            <CardDescription className="space-y-1">
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline">{result.court_id}</Badge>
                                {result.docket_number && (
                                  <Badge variant="secondary" data-testid={`badge-docket-${idx}`}>
                                    {result.docket_number}
                                  </Badge>
                                )}
                                {result.date_filed && (
                                  <span className="text-sm">
                                    Filed: {format(new Date(result.date_filed), 'MMM d, yyyy')}
                                  </span>
                                )}
                              </div>
                            </CardDescription>
                          </div>
                          <Badge className="bg-green-600 hover:bg-green-700 ml-4">
                            <Download className="w-3 h-3 mr-1" />
                            FREE
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {result.nature_of_suit && (
                          <p className="text-sm text-muted-foreground mb-3">
                            <strong>Nature of Suit:</strong> {result.nature_of_suit}
                          </p>
                        )}
                        {result.assigned_to_str && (
                          <p className="text-sm text-muted-foreground mb-3">
                            <strong>Judge:</strong> {result.assigned_to_str}
                          </p>
                        )}
                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="default"
                            size="sm"
                            asChild
                            data-testid={`button-view-recap-${idx}`}
                          >
                            <a 
                              href={`https://www.courtlistener.com${result.absolute_url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View on RECAP (Free)
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {(data as any)?.opinions?.count > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Scale className="w-5 h-5" />
                  Case Law Opinions ({(data as any).opinions.count})
                </h3>
                <div className="space-y-4">
                  {(data as any).opinions.results.map((result: any, idx: number) => (
                    <Card key={result.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg mb-2" data-testid={`text-opinion-name-${idx}`}>
                          {result.case_name}
                        </CardTitle>
                        <CardDescription className="space-y-1">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">{result.court_id}</Badge>
                            {result.citation && result.citation.length > 0 && (
                              <Badge variant="secondary">{result.citation[0]}</Badge>
                            )}
                            {result.date_filed && (
                              <span className="text-sm">
                                Filed: {format(new Date(result.date_filed), 'MMM d, yyyy')}
                              </span>
                            )}
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {result.snippet && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                            {result.snippet}
                          </p>
                        )}
                        <Button
                          variant="default"
                          size="sm"
                          asChild
                          data-testid={`button-view-opinion-${idx}`}
                        >
                          <a 
                            href={`https://www.courtlistener.com${result.absolute_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Read Opinion
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {((data as any)?.recap?.count || 0) === 0 && ((data as any)?.opinions?.count || 0) === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
                  <p className="text-muted-foreground mb-4">
                    No court records match your search criteria. Try different keywords or check your spelling.
                  </p>
                  <Button variant="outline" onClick={() => {
                    setSearchTerm('');
                    setCaseName('');
                    setDocketNumber('');
                    setHasSearched(false);
                  }}>
                    Clear Search
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {!hasSearched && !isLoading && (
          <Card>
            <CardContent className="py-12 text-center">
              <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Ready to Search</h3>
              <p className="text-muted-foreground">
                Enter your search criteria above to find court records, federal filings, and case law opinions.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
