import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Search, ExternalLink, AlertCircle, FileText, Scale, DollarSign, Download, Sparkles } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function CourtRecords() {
  useScrollToTop();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [caseName, setCaseName] = useState('');
  const [docketNumber, setDocketNumber] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [useSemanticSearch, setUseSemanticSearch] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/court-records/search', { q: searchTerm, case_name: caseName, docket_number: docketNumber, search_type: useSemanticSearch ? 'semantic' : 'keyword' }],
    enabled: false,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('q', searchTerm);
      if (caseName) params.append('case_name', caseName);
      if (docketNumber) params.append('docket_number', docketNumber);
      if (useSemanticSearch) params.append('search_type', 'semantic');
      
      const url = `/api/court-records/search?${params.toString()}`;
      const response = await fetch(url, { credentials: 'include' });
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }
      
      return await response.json();
    }
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
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-3">{t('courtRecords.hero.title')}</h1>
          <p className="text-lg text-muted-foreground mb-4">
            {t('courtRecords.hero.subtitle')}
          </p>
          
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>{t('courtRecords.freeFirstAlert.title')}</strong> {t('courtRecords.freeFirstAlert.text1')}{' '}
              <a href="/recap-extensions" className="underline font-medium hover:text-primary">{t('courtRecords.freeFirstAlert.linkText')}</a>
              {' '}{t('courtRecords.freeFirstAlert.text2')}
            </AlertDescription>
          </Alert>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              {t('courtRecords.searchParams.title')}
            </CardTitle>
            <CardDescription>
              {t('courtRecords.searchParams.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-4 bg-muted/30 rounded-lg border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <Label htmlFor="semantic-search" className="text-sm font-semibold">
                      AI-Powered Semantic Search
                    </Label>
                    <Badge variant="secondary" className="text-xs">NEW</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {useSemanticSearch 
                      ? "Using natural language to find cases by meaning and intent" 
                      : "Using keyword matching to search case names and docket numbers"}
                  </p>
                </div>
                <Switch
                  id="semantic-search"
                  checked={useSemanticSearch}
                  onCheckedChange={setUseSemanticSearch}
                  data-testid="switch-semantic-search"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-2 block">{t('courtRecords.searchParams.searchTerm')}</label>
                <Input
                  placeholder={useSemanticSearch ? "Describe what you're looking for..." : t('courtRecords.searchParams.searchTermPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  data-testid="input-search-term"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">{t('courtRecords.searchParams.caseName')}</label>
                <Input
                  placeholder={t('courtRecords.searchParams.caseNamePlaceholder')}
                  value={caseName}
                  onChange={(e) => setCaseName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  data-testid="input-case-name"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">{t('courtRecords.searchParams.docketNumber')}</label>
                <Input
                  placeholder={t('courtRecords.searchParams.docketNumberPlaceholder')}
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
              {useSemanticSearch ? <Sparkles className="w-4 h-4 mr-2" /> : <Search className="w-4 h-4 mr-2" />}
              {t('courtRecords.searchParams.searchButton')}
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
              {t('courtRecords.results.searchFailed')}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && hasSearched && (data as any)?.success && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">
                {t('courtRecords.results.title')}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t('courtRecords.results.totalResults', { count: ((data as any)?.recap?.count || 0) + ((data as any)?.opinions?.count || 0) })}
              </p>
            </div>

            {(data as any)?.message && (
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{(data as any).message}</AlertDescription>
              </Alert>
            )}

            {(data as any)?.partialFailure && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{t('courtRecords.partialFailure.title')}</strong> {t('courtRecords.partialFailure.text')}
                  {(data as any).failedServices?.recap && ` ${t('courtRecords.partialFailure.recapFailed')}`}
                  {(data as any).failedServices?.opinions && ` ${t('courtRecords.partialFailure.opinionsFailed')}`}
                  {' '}{t('courtRecords.partialFailure.incomplete')}
                </AlertDescription>
              </Alert>
            )}

            {(data as any)?.recap?.count > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {t('courtRecords.results.recapSection', { count: (data as any).recap.count })}
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
                                    {t('courtRecords.results.filed', { date: format(new Date(result.date_filed), 'MMM d, yyyy') })}
                                  </span>
                                )}
                              </div>
                            </CardDescription>
                          </div>
                          <Badge className="bg-green-600 hover:bg-green-700 ml-4">
                            <Download className="w-3 h-3 mr-1" />
                            {t('courtRecords.results.free')}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {result.nature_of_suit && (
                          <p className="text-sm text-muted-foreground mb-3">
                            <strong>{t('courtRecords.results.natureOfSuit')}</strong> {result.nature_of_suit}
                          </p>
                        )}
                        {result.assigned_to_str && (
                          <p className="text-sm text-muted-foreground mb-3">
                            <strong>{t('courtRecords.results.assignedTo')}</strong> {result.assigned_to_str}
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
                              {t('courtRecords.results.downloadFree')}
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
                  {t('courtRecords.results.opinionsSection', { count: (data as any).opinions.count })}
                </h3>
                <div className="space-y-4">
                  {(data as any).opinions.results.map((result: any, idx: number) => (
                    <Card key={result.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg mb-2" data-testid={`text-opinion-name-${idx}`}>
                          {result.caseName || result.caseNameFull || result.case_name}
                        </CardTitle>
                        <CardDescription className="space-y-1">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">{result.court_id}</Badge>
                            {result.citation && result.citation.length > 0 && (
                              <Badge variant="secondary">{result.citation[0]}</Badge>
                            )}
                            {(result.dateFiled || result.date_filed) && (
                              <span className="text-sm">
                                {t('courtRecords.results.filed', { date: format(new Date(result.dateFiled || result.date_filed), 'MMM d, yyyy') })}
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
                            {t('courtRecords.results.viewOpinion')}
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
                  <h3 className="text-lg font-semibold mb-2">{t('courtRecords.results.noResults')}</h3>
                  <p className="text-muted-foreground mb-4">
                    {t('courtRecords.results.searchFailed')}
                  </p>
                  <Button variant="outline" onClick={() => {
                    setSearchTerm('');
                    setCaseName('');
                    setDocketNumber('');
                    setHasSearched(false);
                  }}>
                    {t('common.back')}
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
              <h3 className="text-lg font-semibold mb-2">{t('courtRecords.searchParams.title')}</h3>
              <p className="text-muted-foreground">
                {t('courtRecords.searchParams.description')}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      <Footer />
    </div>
  );
}
