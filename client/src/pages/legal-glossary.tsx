import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  BookOpen, 
  ArrowLeft,
  Hash,
  Filter,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Link } from "wouter";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { 
  legalGlossaryTerms, 
  searchGlossaryTerms, 
  getTermsByLetter, 
  getAvailableLetters 
} from "@/lib/legal-glossary-data";

export default function LegalGlossary() {
  useScrollToTop();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  // Get all unique tags
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    legalGlossaryTerms.forEach(term => {
      term.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  // Filter terms based on search, letter, and tag
  const filteredTerms = useMemo(() => {
    let terms = legalGlossaryTerms;

    // Apply search filter
    if (searchQuery.trim()) {
      terms = searchGlossaryTerms(searchQuery);
    }

    // Apply letter filter
    if (selectedLetter) {
      terms = terms.filter(term => 
        term.term.charAt(0).toLowerCase() === selectedLetter.toLowerCase()
      );
    }

    // Apply tag filter
    if (selectedTag) {
      terms = terms.filter(term => 
        term.tags?.includes(selectedTag)
      );
    }

    return terms.sort((a, b) => a.term.localeCompare(b.term));
  }, [searchQuery, selectedLetter, selectedTag]);

  const availableLetters = getAvailableLetters();

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedLetter("");
    setSelectedTag("");
  };

  const hasActiveFilters = searchQuery || selectedLetter || selectedTag;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section - Purple Vivid Header */}
      <section className="vivid-header-purple py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 vivid-header-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              {t('legalGlossary.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/85 max-w-3xl mx-auto">
              {t('legalGlossary.hero.subtitle')}
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
                  {t('legalGlossary.navigation.backToHome')}
                </Button>
              </Link>
              <div className="text-sm text-muted-foreground">
                {t('legalGlossary.navigation.termsCount', { count: filteredTerms.length, total: legalGlossaryTerms.length })}
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
                      placeholder={t('legalGlossary.search.placeholder')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                      data-testid="input-glossary-search"
                    />
                  </div>

                  {/* Alphabet Filter */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{t('legalGlossary.search.browseByLetter')}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {availableLetters.map(letter => (
                        <Button
                          key={letter}
                          variant={selectedLetter === letter ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedLetter(selectedLetter === letter ? "" : letter)}
                          className="w-8 h-8 p-0"
                          data-testid={`button-letter-${letter}`}
                        >
                          {letter.toUpperCase()}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Tag Filter */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{t('legalGlossary.search.filterByCategory')}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {availableTags.slice(0, 10).map(tag => (
                        <Button
                          key={tag}
                          variant={selectedTag === tag ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
                          data-testid={`button-tag-${tag}`}
                        >
                          {tag}
                        </Button>
                      ))}
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
                        {t('legalGlossary.search.clearFilters')}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Terms List */}
          <ScrollReveal delay={0.2}>
            {filteredTerms.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {t('legalGlossary.terms.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Accordion type="multiple" className="w-full">
                    {filteredTerms.map((term, index) => (
                      <AccordionItem 
                        key={term.id} 
                        value={term.id}
                        className="px-6"
                      >
                        <AccordionTrigger 
                          className="text-left hover:no-underline"
                          data-testid={`accordion-term-${term.slug}`}
                        >
                          <div className="flex flex-col items-start gap-2 flex-1">
                            <div className="font-semibold text-lg">
                              {term.term}
                            </div>
                            {term.aliases && term.aliases.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {term.aliases.map(alias => (
                                  <Badge key={alias} variant="secondary" className="text-xs">
                                    {alias}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-0 pb-6">
                          <div className="space-y-4">
                            <p className="text-muted-foreground leading-relaxed">
                              {term.definition}
                            </p>
                            {term.tags && term.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {term.tags.map(tag => (
                                  <Badge 
                                    key={tag} 
                                    variant="outline" 
                                    className="text-xs cursor-pointer hover:bg-muted"
                                    onClick={() => setSelectedTag(tag)}
                                    data-testid={`badge-tag-${tag}`}
                                  >
                                    #{tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{t('courtRecords.results.noResults')}</h3>
                  <p className="text-muted-foreground mb-4">
                    {t('courtRecords.results.searchFailed')}
                  </p>
                  {hasActiveFilters && (
                    <Button variant="outline" onClick={clearFilters}>
                      {t('legalGlossary.search.clearFilters')}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </ScrollReveal>

          {/* Quick Navigation */}
          <ScrollReveal delay={0.3}>
            <div className="mt-12 grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Need Legal Help?</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Get personalized legal guidance for your specific situation.
                  </p>
                  <Link href="/case-guidance">
                    <Button variant="outline" className="w-full">
                      Get Legal Guidance
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Know Your Rights</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Learn about your constitutional rights and legal protections.
                  </p>
                  <Link href="/rights-info">
                    <Button variant="outline" className="w-full">
                      Learn Your Rights
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