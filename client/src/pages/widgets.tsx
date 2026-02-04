import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Copy, Check, Search, Shield, BookOpen, Code } from "lucide-react";
import { EmbeddableSearch } from "@/components/widgets/embeddable-search";
import { RightsCard } from "@/components/widgets/rights-card";
import { GlossaryWidget } from "@/components/widgets/glossary-widget";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
      {copied ? "Copied!" : "Copy"}
    </Button>
  );
}

export default function Widgets() {
  const { t } = useTranslation();
  const [searchTheme, setSearchTheme] = useState<"light" | "dark">("light");
  const [searchLanguage, setSearchLanguage] = useState<"en" | "es">("en");
  const [searchCompact, setSearchCompact] = useState(false);
  
  const [rightsTheme, setRightsTheme] = useState<"light" | "dark">("light");
  const [rightsLanguage, setRightsLanguage] = useState<"en" | "es">("en");
  const [rightsVariant, setRightsVariant] = useState<"full" | "compact" | "mini">("full");
  
  const [glossaryTheme, setGlossaryTheme] = useState<"light" | "dark">("light");
  const [glossaryLanguage, setGlossaryLanguage] = useState<"en" | "es">("en");

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://publicdefenderai.replit.app';

  const generateSearchEmbed = () => {
    const params = new URLSearchParams({
      theme: searchTheme,
      lang: searchLanguage,
      compact: searchCompact.toString()
    }).toString();
    return `<!-- Public Defender AI Search Widget -->
<iframe 
  src="${baseUrl}/embed/search?${params}"
  width="400"
  height="300"
  frameborder="0"
  style="border: none; border-radius: 8px;"
  title="Public Defender AI search widget"
></iframe>`;
  };

  const generateRightsEmbed = () => {
    const params = new URLSearchParams({
      theme: rightsTheme,
      lang: rightsLanguage,
      variant: rightsVariant
    }).toString();
    const height = rightsVariant === "mini" ? "60" : rightsVariant === "compact" ? "250" : "450";
    return `<!-- Public Defender AI Rights Card -->
<iframe 
  src="${baseUrl}/embed/rights?${params}"
  width="420"
  height="${height}"
  frameborder="0"
  style="border: none; border-radius: 8px;"
  title="Public Defender AI Know Your Rights widget"
></iframe>`;
  };

  const generateGlossaryEmbed = () => {
    const params = new URLSearchParams({
      theme: glossaryTheme,
      lang: glossaryLanguage
    }).toString();
    return `<!-- Public Defender AI Glossary Widget -->
<iframe 
  src="${baseUrl}/embed/glossary?${params}"
  width="420"
  height="450"
  frameborder="0"
  style="border: none; border-radius: 8px;"
  title="Public Defender AI legal glossary widget"
></iframe>`;
  };

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
              <h1 className="text-3xl font-bold">Embeddable Widgets</h1>
              <p className="text-muted-foreground">Add legal resources to your website</p>
            </div>
          </div>
          
          <p className="text-lg text-muted-foreground max-w-3xl">
            Embed Public Defender AI widgets on your website to provide legal resources to your visitors. 
            Customize appearance, language, and more.
          </p>
        </div>

        <Tabs defaultValue="search" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search
            </TabsTrigger>
            <TabsTrigger value="rights" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Rights Card
            </TabsTrigger>
            <TabsTrigger value="glossary" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Glossary
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Search Widget</CardTitle>
                  <CardDescription>
                    A search bar that lets users find legal resources, charges, and definitions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Theme</Label>
                      <Select value={searchTheme} onValueChange={(v: "light" | "dark") => setSearchTheme(v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Language</Label>
                      <Select value={searchLanguage} onValueChange={(v: "en" | "es") => setSearchLanguage(v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="compact-mode">Compact Mode</Label>
                    <Switch id="compact-mode" checked={searchCompact} onCheckedChange={setSearchCompact} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent className={searchTheme === "dark" ? "bg-gray-900 rounded-lg p-4" : ""}>
                  <EmbeddableSearch 
                    baseUrl={baseUrl}
                    theme={searchTheme} 
                    language={searchLanguage}
                    compact={searchCompact}
                  />
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Embed Code</CardTitle>
                    <CardDescription>Copy this code to embed the search widget</CardDescription>
                  </div>
                  <CopyButton text={generateSearchEmbed()} />
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto text-sm">
                    {generateSearchEmbed()}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="rights">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Know Your Rights Card</CardTitle>
                  <CardDescription>
                    An informational card showing essential rights when interacting with law enforcement.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Theme</Label>
                      <Select value={rightsTheme} onValueChange={(v: "light" | "dark") => setRightsTheme(v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Language</Label>
                      <Select value={rightsLanguage} onValueChange={(v: "en" | "es") => setRightsLanguage(v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Variant</Label>
                    <Select value={rightsVariant} onValueChange={(v: "full" | "compact" | "mini") => setRightsVariant(v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">Full</SelectItem>
                        <SelectItem value="compact">Compact</SelectItem>
                        <SelectItem value="mini">Mini (Button)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent className={`flex justify-center ${rightsTheme === "dark" ? "bg-gray-900 rounded-lg p-4" : ""}`}>
                  <RightsCard 
                    baseUrl={baseUrl}
                    theme={rightsTheme}
                    language={rightsLanguage}
                    variant={rightsVariant}
                  />
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Embed Code</CardTitle>
                    <CardDescription>Copy this code to embed the rights card</CardDescription>
                  </div>
                  <CopyButton text={generateRightsEmbed()} />
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto text-sm">
                    {generateRightsEmbed()}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="glossary">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Legal Glossary Widget</CardTitle>
                  <CardDescription>
                    An expandable list of legal terms and definitions.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Theme</Label>
                      <Select value={glossaryTheme} onValueChange={(v: "light" | "dark") => setGlossaryTheme(v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Language</Label>
                      <Select value={glossaryLanguage} onValueChange={(v: "en" | "es") => setGlossaryLanguage(v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent className={glossaryTheme === "dark" ? "bg-gray-900 rounded-lg p-4" : ""}>
                  <GlossaryWidget 
                    baseUrl={baseUrl}
                    theme={glossaryTheme}
                    language={glossaryLanguage}
                  />
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Embed Code</CardTitle>
                    <CardDescription>Copy this code to embed the glossary widget</CardDescription>
                  </div>
                  <CopyButton text={generateGlossaryEmbed()} />
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto text-sm">
                    {generateGlossaryEmbed()}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Embedding Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                All widgets use iframe embedding, which works on any website without JavaScript compatibility issues.
                Simply copy the embed code for your chosen widget and paste it into your HTML.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Search className="h-4 w-4" /> Search Widget
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Recommended size: 400x300px. Shows search results with links to full resources.
                  </p>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" /> Rights Card
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Available in full (450px), compact (250px), or mini (60px) heights.
                  </p>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" /> Glossary
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Recommended size: 420x450px. Shows expandable legal term definitions.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}
