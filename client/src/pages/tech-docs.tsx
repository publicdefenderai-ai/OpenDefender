import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Code, 
  FileJson, 
  Layout, 
  Database, 
  ExternalLink, 
  BookOpen,
  Download,
  Search
} from "lucide-react";

export default function TechDocs() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Technical Documentation</h1>
          <p className="text-lg text-muted-foreground">
            Resources for developers and organizations integrating with Public Defender AI
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Code className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle>API Documentation</CardTitle>
                  <CardDescription>REST API endpoints and usage</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Complete reference for our public API including search, charges, diversion programs, 
                glossary terms, and bulk data export endpoints.
              </p>
              <Button asChild>
                <Link href="/api-docs">
                  View API Docs
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                  <Layout className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle>Embeddable Widgets</CardTitle>
                  <CardDescription>Add legal resources to your website</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Embed search, Know Your Rights cards, and legal glossary widgets on your website 
                with customizable themes and trilingual support (English, Spanish, Chinese).
              </p>
              <Button asChild>
                <Link href="/widgets">
                  View Widgets
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                  <FileJson className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle>JSON Schemas</CardTitle>
                  <CardDescription>Data model specifications</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                JSON Schema definitions for all API data models including CriminalCharge, 
                DiversionProgram, GlossaryTerm, and more.
              </p>
              <Button variant="outline" asChild>
                <a href="/api/v1/schemas" target="_blank">
                  <FileJson className="h-4 w-4 mr-2" />
                  View Schemas
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900">
                  <Download className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <CardTitle>OpenAPI Specification</CardTitle>
                  <CardDescription>Machine-readable API definition</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Download the OpenAPI 3.0 specification to generate client libraries or import 
                into tools like Postman or Swagger.
              </p>
              <Button variant="outline" asChild>
                <a href="/api/v1/openapi.json" target="_blank">
                  <Download className="h-4 w-4 mr-2" />
                  Download OpenAPI Spec
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">4,144+</div>
                <div className="text-sm text-muted-foreground">Criminal Charges</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">51</div>
                <div className="text-sm text-muted-foreground">Jurisdictions</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">73</div>
                <div className="text-sm text-muted-foreground">Diversion Programs</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">30</div>
                <div className="text-sm text-muted-foreground">Glossary Terms</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Quick Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-3">
              <a 
                href="/api/v1/search?q=theft" 
                target="_blank"
                className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
              >
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Try Search API</span>
                <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
              </a>
              <a 
                href="/api/v1/charges?jurisdiction=CA&limit=5" 
                target="_blank"
                className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
              >
                <Code className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Sample Charges (CA)</span>
                <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
              </a>
              <a 
                href="/api/v1/glossary" 
                target="_blank"
                className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
              >
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Legal Glossary</span>
                <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
              </a>
              <a 
                href="/api/v1/export/charges?format=csv&limit=100" 
                target="_blank"
                className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
              >
                <Download className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Export Sample (CSV)</span>
                <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
              </a>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
