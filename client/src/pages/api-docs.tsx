import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Code, 
  Database, 
  Search, 
  FileText, 
  Download, 
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Zap,
  Shield,
  Globe,
  Layout
} from "lucide-react";

interface Endpoint {
  method: string;
  path: string;
  summary: string;
  description: string;
  tag: string;
  parameters?: any[];
  exampleResponse?: any;
}

const endpoints: Endpoint[] = [
  {
    method: "GET",
    path: "/api/v1/search",
    summary: "Search all legal content",
    description: "Full-text search across criminal charges, diversion programs, glossary, and more. Supports legal synonym expansion.",
    tag: "Search",
    parameters: [
      { name: "q", required: true, description: "Search query (2-100 characters)", example: "DUI first offense" },
      { name: "lang", required: false, description: "Language (en, es, or zh)", example: "en" },
      { name: "types", required: false, description: "Filter by types (comma-separated)", example: "charge,glossary" },
      { name: "limit", required: false, description: "Max results (1-50)", example: "20" }
    ],
    exampleResponse: {
      success: true,
      results: [{ document: { id: "ca-dui-first-offense", type: "charge", title: "DUI - First Offense" }, score: 85.5 }],
      meta: { totalResults: 42, queryTime: 12 }
    }
  },
  {
    method: "GET",
    path: "/api/v1/charges",
    summary: "List criminal charges",
    description: "Browse 4,100+ criminal charge definitions across 51 jurisdictions (50 states + DC + Federal).",
    tag: "Data",
    parameters: [
      { name: "jurisdiction", required: false, description: "Two-letter state code", example: "CA" },
      { name: "category", required: false, description: "Charge category", example: "drug" },
      { name: "limit", required: false, description: "Max results (1-100)", example: "50" },
      { name: "offset", required: false, description: "Pagination offset", example: "0" }
    ],
    exampleResponse: {
      success: true,
      data: [{ id: "ca-dui-first-offense", name: "DUI - First Offense", jurisdiction: "CA", severity: "misdemeanor" }],
      meta: { total: 4144, limit: 50, offset: 0 }
    }
  },
  {
    method: "GET",
    path: "/api/v1/charges/:id",
    summary: "Get charge details",
    description: "Retrieve detailed information about a specific criminal charge including penalties and common defenses.",
    tag: "Data",
    parameters: [
      { name: "id", required: true, description: "Charge ID", example: "ca-dui-first-offense" },
      { name: "lang", required: false, description: "Language for translations (en, es, or zh)", example: "es" }
    ]
  },
  {
    method: "GET",
    path: "/api/v1/diversion-programs",
    summary: "List diversion programs",
    description: "Browse 73 pre-trial diversion and alternative sentencing programs across major U.S. metros.",
    tag: "Data",
    parameters: [
      { name: "state", required: false, description: "Filter by state", example: "CA" },
      { name: "county", required: false, description: "Filter by county", example: "Los Angeles" },
      { name: "type", required: false, description: "Program type", example: "drug_court" }
    ]
  },
  {
    method: "GET",
    path: "/api/v1/glossary",
    summary: "List legal terms",
    description: "Get legal terminology definitions written at a 6th-8th grade reading level. Trilingual support (English, Spanish, Chinese).",
    tag: "Data",
    parameters: [
      { name: "lang", required: false, description: "Language (en, es, or zh)", example: "en" }
    ]
  },
  {
    method: "GET",
    path: "/api/v1/expungement-rules",
    summary: "List expungement rules",
    description: "Record expungement eligibility rules by state.",
    tag: "Data",
    parameters: [
      { name: "state", required: false, description: "Filter by state", example: "CA" }
    ]
  },
  {
    method: "GET",
    path: "/api/v1/export/charges",
    summary: "Export all charges",
    description: "Bulk export of criminal charges in JSON or CSV format for data analysis.",
    tag: "Export",
    parameters: [
      { name: "format", required: false, description: "json or csv", example: "csv" },
      { name: "jurisdiction", required: false, description: "Filter by jurisdiction", example: "CA" }
    ]
  },
  {
    method: "GET",
    path: "/api/v1/export/diversion-programs",
    summary: "Export diversion programs",
    description: "Bulk export of diversion programs in JSON or CSV format.",
    tag: "Export",
    parameters: [
      { name: "format", required: false, description: "json or csv", example: "json" }
    ]
  },
  {
    method: "GET",
    path: "/api/v1/stats",
    summary: "Get index statistics",
    description: "Returns statistics about available data and search index.",
    tag: "Search"
  }
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 px-2">
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const fullUrl = `${baseUrl}${endpoint.path}`;
  
  const exampleParams = endpoint.parameters?.filter(p => p.example).map(p => `${p.name}=${encodeURIComponent(p.example)}`).join('&');
  const exampleUrl = exampleParams ? `${fullUrl}?${exampleParams}` : fullUrl;
  
  return (
    <Card className="mb-4">
      <CardHeader 
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              {endpoint.method}
            </Badge>
            <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
              {endpoint.path}
            </code>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{endpoint.tag}</Badge>
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </div>
        </div>
        <CardDescription className="mt-2">{endpoint.summary}</CardDescription>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="border-t pt-4">
          <p className="text-sm text-muted-foreground mb-4">{endpoint.description}</p>
          
          {endpoint.parameters && endpoint.parameters.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-sm mb-2">Parameters</h4>
              <div className="bg-muted rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/80">
                    <tr>
                      <th className="text-left p-2 font-medium">Name</th>
                      <th className="text-left p-2 font-medium">Required</th>
                      <th className="text-left p-2 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {endpoint.parameters.map((param, i) => (
                      <tr key={i} className="border-t border-border/50">
                        <td className="p-2 font-mono text-xs">{param.name}</td>
                        <td className="p-2">
                          {param.required ? (
                            <Badge variant="destructive" className="text-xs">Required</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">Optional</Badge>
                          )}
                        </td>
                        <td className="p-2 text-muted-foreground">{param.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          <div className="mb-4">
            <h4 className="font-semibold text-sm mb-2">Example Request</h4>
            <div className="bg-slate-900 text-slate-100 rounded-lg p-3 flex items-center justify-between">
              <code className="text-xs break-all">curl "{exampleUrl.replace(':id', 'ca-dui-first-offense')}"</code>
              <CopyButton text={`curl "${exampleUrl.replace(':id', 'ca-dui-first-offense')}"`} />
            </div>
          </div>
          
          {endpoint.exampleResponse && (
            <div>
              <h4 className="font-semibold text-sm mb-2">Example Response</h4>
              <div className="bg-slate-900 text-slate-100 rounded-lg p-3 relative">
                <pre className="text-xs overflow-x-auto">
                  {JSON.stringify(endpoint.exampleResponse, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export default function ApiDocs() {
  const { t } = useTranslation();
  
  const { data: stats } = useQuery({
    queryKey: ['/api/v1/stats'],
    queryFn: async () => {
      const res = await fetch('/api/v1/stats');
      return res.json();
    }
  });

  const searchEndpoints = endpoints.filter(e => e.tag === "Search");
  const dataEndpoints = endpoints.filter(e => e.tag === "Data");
  const exportEndpoints = endpoints.filter(e => e.tag === "Export");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">API Documentation</h1>
              <p className="text-muted-foreground">Public Defender AI - Open API v1</p>
            </div>
          </div>
          
          <p className="text-lg text-muted-foreground max-w-3xl mb-6">
            Free, open access to legal information and resources. Integrate our datasets into your applications 
            to help more people access legal guidance.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <a href="/api/v1/openapi.json" target="_blank">
                <FileText className="h-4 w-4 mr-2" />
                OpenAPI Spec
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/api/v1/schemas" target="_blank">
                <Code className="h-4 w-4 mr-2" />
                JSON Schemas
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/widgets">
                <Zap className="h-4 w-4 mr-2" />
                Embeddable Widgets
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://github.com/publicdefenderai" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                GitHub Repository
              </a>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Database className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats?.totalDocuments?.toLocaleString() || '4,299'}</div>
                  <div className="text-sm text-muted-foreground">Total Documents</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                  <Globe className="h-5 w-5 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold">51</div>
                  <div className="text-sm text-muted-foreground">Jurisdictions</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                  <Zap className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold">60/min</div>
                  <div className="text-sm text-muted-foreground">Rate Limit</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">Security & Fair Use</h3>
                <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                  <li>• All endpoints are <strong>read-only</strong> (GET requests only)</li>
                  <li>• No authentication required for public data</li>
                  <li>• Rate limited to 60 requests per minute per IP</li>
                  <li>• CORS enabled for cross-origin requests</li>
                  <li>• AI-powered guidance is NOT available via API (direct site access only)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="search" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Data
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Search Endpoints</h2>
            <p className="text-muted-foreground mb-6">
              Full-text search with legal synonym expansion. Searching "lawyer" also finds "attorney", "counsel", etc.
            </p>
            {searchEndpoints.map((endpoint, i) => (
              <EndpointCard key={i} endpoint={endpoint} />
            ))}
          </TabsContent>
          
          <TabsContent value="data" className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Data Endpoints</h2>
            <p className="text-muted-foreground mb-6">
              Access structured legal data including criminal charges, diversion programs, legal glossary, and expungement rules.
            </p>
            {dataEndpoints.map((endpoint, i) => (
              <EndpointCard key={i} endpoint={endpoint} />
            ))}
          </TabsContent>
          
          <TabsContent value="export" className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Export Endpoints</h2>
            <p className="text-muted-foreground mb-6">
              Bulk download datasets in JSON or CSV format for data analysis and integration.
            </p>
            {exportEndpoints.map((endpoint, i) => (
              <EndpointCard key={i} endpoint={endpoint} />
            ))}
          </TabsContent>
        </Tabs>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Start</CardTitle>
            <CardDescription>Get started with the API in seconds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">1. Search for legal content</h4>
                <div className="bg-slate-900 text-slate-100 rounded-lg p-3">
                  <code className="text-sm">curl "https://publicdefenderai.replit.app/api/v1/search?q=DUI&lang=en"</code>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm mb-2">2. Get charges for a state</h4>
                <div className="bg-slate-900 text-slate-100 rounded-lg p-3">
                  <code className="text-sm">curl "https://publicdefenderai.replit.app/api/v1/charges?jurisdiction=CA&limit=10"</code>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm mb-2">3. Export data as CSV</h4>
                <div className="bg-slate-900 text-slate-100 rounded-lg p-3">
                  <code className="text-sm">curl "https://publicdefenderai.replit.app/api/v1/export/charges?format=csv" -o charges.csv</code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attribution</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              When using this data in your applications, please include attribution:
            </p>
            <div className="bg-muted rounded-lg p-4 border-l-4 border-primary">
              <p className="text-sm font-medium">
                Data provided by <a href="https://publicdefenderai.replit.app" className="text-primary hover:underline">Public Defender AI</a>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
