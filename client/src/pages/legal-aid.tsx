import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, MapPin, Phone, Mail, Navigation, Clock, HelpCircle, ExternalLink, AlertCircle, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { searchLegalAidOrganizations, LegalAidOrganization } from "@/lib/legal-aid-services";

function OrgCard({ org }: { org: LegalAidOrganization }) {
  const { t } = useTranslation();
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-base leading-snug mb-1">{org.name}</h3>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                {org.distance} mi away
              </Badge>
              <Badge variant="secondary" className="text-xs text-muted-foreground">
                {org.organizationType}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-2.5 text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <span className="text-foreground">{org.address}</span>
          </div>
          {org.phone && (
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <a href={`tel:${org.phone}`} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                {org.phone}
              </a>
            </div>
          )}
          {org.email && (
            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <a href={`mailto:${org.email}`} className="text-blue-600 dark:text-blue-400 hover:underline truncate">
                {org.email}
              </a>
            </div>
          )}
          {org.hours && (
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">{org.hours}</span>
            </div>
          )}
        </div>

        {org.services.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-muted-foreground mb-1.5">Services offered</p>
            <div className="flex flex-wrap gap-1">
              {org.services.map((s) => (
                <span key={s} className="text-xs bg-muted px-2 py-0.5 rounded">{s}</span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => window.open(`https://maps.google.com/maps?daddr=${encodeURIComponent(org.address)}`, '_blank')}
          >
            <Navigation className="h-3 w-3 mr-1.5" />
            Get Directions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LegalAid() {
  useScrollToTop();
  const { t } = useTranslation();
  const [zipCode, setZipCode] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<LegalAidOrganization[]>([]);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (zipCode.length !== 5) {
      setError("Please enter a valid 5-digit ZIP code.");
      return;
    }
    setSearching(true);
    setError("");
    setHasSearched(false);
    try {
      const orgs = await searchLegalAidOrganizations(zipCode);
      setResults(orgs);
      setHasSearched(true);
      if (orgs.length === 0) {
        setError("No organizations found within 50 miles. Try a nearby ZIP code, or see the national resources below.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1" id="main-content">

        {/* Hero */}
        <section className="vivid-header-alt py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 vivid-header-content">
            <div className="flex items-center gap-3 mb-3">
              <HelpCircle className="h-7 w-7 text-white/80" strokeWidth={1.75} />
              <h1 className="text-3xl md:text-4xl font-bold text-white">Find Legal Aid</h1>
            </div>
            <p className="text-base md:text-lg text-white/75 leading-relaxed max-w-2xl">
              Free and low-cost legal help is available in most areas. Search by ZIP code to find nonprofit legal aid organizations near you.
            </p>
          </div>
        </section>

        {/* What is Legal Aid */}
        <section className="py-10 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4">
            <ScrollReveal>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-sm mb-2">Who can get help?</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Legal aid organizations serve people who cannot afford a private attorney. Most use income guidelines based on federal poverty levels.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-sm mb-2">What kinds of help are available?</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Criminal defense, immigration, housing, family law, and civil matters. Some organizations specialize in one area.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-sm mb-2">Is it really free?</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Yes — legal aid organizations are nonprofits funded to serve the community. There is no bill for their services.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Search */}
        <section className="py-10 md:py-12">
          <div className="max-w-2xl mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Search by ZIP Code</h2>
                <p className="text-muted-foreground text-sm">Searches within 50 miles of your ZIP code</p>
              </div>
              <div className="flex gap-2">
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter ZIP code"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  maxLength={5}
                  className="flex-1 text-base"
                  aria-label="ZIP code"
                />
                <Button onClick={handleSearch} disabled={searching || zipCode.length !== 5} className="px-6">
                  <Search className="h-4 w-4 mr-2" />
                  {searching ? "Searching..." : "Search"}
                </Button>
              </div>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </ScrollReveal>
          </div>
        </section>

        {/* Results */}
        {hasSearched && results.length > 0 && (
          <section className="pb-10 md:pb-12">
            <div className="max-w-4xl mx-auto px-4">
              <p className="text-sm text-muted-foreground mb-5">
                {results.length} organization{results.length !== 1 ? "s" : ""} found near {zipCode}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map((org) => (
                  <OrgCard key={org.id} org={org} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* National resources fallback */}
        <section className="py-10 md:py-12 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4">
            <ScrollReveal>
              <h2 className="text-xl font-bold mb-2">National Resources</h2>
              <p className="text-sm text-muted-foreground mb-5">
                These national organizations can also help you find free legal assistance anywhere in the U.S.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    name: "LawHelp.org",
                    description: "State-by-state directory of free legal aid programs across the country.",
                    url: "https://www.lawhelp.org",
                  },
                  {
                    name: "Legal Services Corporation",
                    description: "The largest funder of civil legal aid in the U.S. Find a local program near you.",
                    url: "https://www.lsc.gov/what-legal-aid/find-legal-aid",
                  },
                  {
                    name: "American Bar Association Free Legal Answers",
                    description: "Ask a civil legal question online and get an answer from a volunteer attorney.",
                    url: "https://www.lawhelp.org/d/map?category=free-legal-answers",
                  },
                  {
                    name: "NLADA (National Legal Aid & Defender Association)",
                    description: "The national voice for public defense and civil legal aid. Includes a program finder.",
                    url: "https://www.nlada.org",
                  },
                ].map((resource) => (
                  <Card key={resource.name} className="hover:shadow-md transition-shadow duration-200">
                    <CardContent className="p-5 flex flex-col h-full">
                      <h3 className="font-semibold text-sm mb-2">{resource.name}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">{resource.description}</p>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Visit site <ExternalLink className="h-3.5 w-3.5 ml-1" />
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Related links */}
        <section className="py-8 border-t">
          <div className="max-w-4xl mx-auto px-4">
            <ScrollReveal>
              <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">Related</p>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "Find a Public Defender", href: "/resources" },
                  { label: "Diversion Programs", href: "/diversion-programs" },
                  { label: "Record Expungement", href: "/record-expungement" },
                  { label: "For Families", href: "/friends-family" },
                ].map((link) => (
                  <Link key={link.href} href={link.href}>
                    <Button variant="outline" size="sm" className="gap-1">
                      {link.label} <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
