import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShareResource } from "@/components/ui/share-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { EmptyState } from "@/components/ui/empty-state";
import { PageBreadcrumb } from "@/components/navigation/page-breadcrumb";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { DeferredContent } from "@/components/ui/deferred-content";
import { CardSkeleton } from "@/components/ui/loading-skeletons";
import { 
  LEGAL_DOCUMENTS, 
  getDocumentsForPhase, 
  type CasePhase, 
  type DocumentCategory,
  type LegalDocument,
  PHASE_LABELS
} from "@shared/legal-documents";

function ImportanceBadge({ level }: { level: LegalDocument['importanceLevel'] }) {
  const { t } = useTranslation();
  
  const config = {
    critical: { 
      className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800",
      label: t('documentLibrary.importance.critical', 'Critical')
    },
    important: { 
      className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800",
      label: t('documentLibrary.importance.important', 'Important')
    },
    informational: { 
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      label: t('documentLibrary.importance.informational', 'Informational')
    },
  };

  const { className, label } = config[level];

  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
}

function DocumentCard({ document }: { document: LegalDocument }) {
  const { t, i18n } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card hoverable className="overflow-hidden" data-testid={`document-card-${document.slug}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div>
              <CardTitle className="text-lg leading-tight">
                {t(document.titleKey)}
                {document.formNumber && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({document.formNumber})
                  </span>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {t(document.descriptionKey)}
              </p>
            </div>
          </div>
          <ImportanceBadge level={document.importanceLevel} />
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-1">
              {t('documentLibrary.card.purpose', 'Purpose')}
            </h4>
            <p className="text-sm text-muted-foreground">
              {t(document.purposeKey)}
            </p>
          </div>

          <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
            <h4 className="text-sm font-semibold text-primary mb-1">
              {t('documentLibrary.card.whatToDo', 'What To Do With This Document')}
            </h4>
            <p className="text-sm text-foreground">
              {t(document.whatToDoKey)}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              {document.phases.map(phase => (
                <Badge key={phase} variant="secondary" className="text-xs">
                  {i18n.language === 'es' ? PHASE_LABELS[phase].es : i18n.language?.startsWith('zh') ? PHASE_LABELS[phase].zh : PHASE_LABELS[phase].en}
                </Badge>
              ))}
            </div>
            <ShareResource 
              resourceTitle={t(document.titleKey)} 
              resourceDescription={t(document.descriptionKey)}
              resourceId={document.slug}
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full justify-between"
            data-testid={`button-expand-${document.slug}`}
          >
            <span>{t('documentLibrary.card.sections', 'Document Sections')}</span>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <Accordion type="single" collapsible className="w-full">
                  {document.sections.map((section, index) => (
                    <AccordionItem key={section.id} value={section.id}>
                      <AccordionTrigger className="text-sm py-2">
                        <span className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                          {t(section.labelKey)}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground pl-7">
                        {t(section.explanationKey)}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DocumentLibrary() {
  useScrollToTop();
  const { t, i18n } = useTranslation();
  const [selectedPhase, setSelectedPhase] = useState<CasePhase | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'all'>('all');
  
  const breadcrumbItems = [
    { label: t('breadcrumb.home', 'Home'), href: '/' }
  ];

  const filteredDocuments = LEGAL_DOCUMENTS.filter(doc => {
    const matchesPhase = selectedPhase === 'all' || doc.phases.includes(selectedPhase as CasePhase);
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesPhase && matchesCategory;
  }).sort((a, b) => a.displayOrder - b.displayOrder);

  const criminalDocs = filteredDocuments.filter(d => d.category === 'criminal');
  const immigrationDocs = filteredDocuments.filter(d => d.category === 'immigration');

  const phases: Array<CasePhase | 'all'> = ['all', 'just_arrested', 'arraignment', 'pretrial', 'trial', 'sentencing', 'post_conviction'];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageBreadcrumb 
        items={breadcrumbItems} 
        currentPage={t('documentLibrary.title', 'Case Documents Library')} 
      />
      
      <section className="vivid-header py-16 md:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 vivid-header-content text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 md:mb-6 text-white">
            {t('documentLibrary.title', 'Case Documents Library')}
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto">
            {t('documentLibrary.subtitle', 'Understand the documents you may receive during your case. Each section is explained in plain language.')}
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14 lg:py-16">
        <ScrollReveal>
          <Card className="mb-10 md:mb-12">
            <CardContent className="p-5 md:p-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <span className="text-sm font-medium text-muted-foreground">{t('documentLibrary.filter.label', 'Filter by:')}</span>
                
                <div className="flex flex-wrap gap-3 flex-1">
                  <Select value={selectedPhase} onValueChange={(v) => setSelectedPhase(v as CasePhase | 'all')}>
                    <SelectTrigger className="w-[200px]" data-testid="select-phase-filter">
                      <SelectValue placeholder={t('documentLibrary.filter.phase', 'Case Phase')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" data-testid="option-phase-all">
                        {t('documentLibrary.filter.allPhases', 'All Phases')}
                      </SelectItem>
                      {phases.filter(p => p !== 'all').map(phase => (
                        <SelectItem key={phase} value={phase} data-testid={`option-phase-${phase}`}>
                          {i18n.language === 'es' ? PHASE_LABELS[phase as CasePhase].es : i18n.language?.startsWith('zh') ? PHASE_LABELS[phase as CasePhase].zh : PHASE_LABELS[phase as CasePhase].en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as DocumentCategory | 'all')}>
                    <SelectTrigger className="w-[180px]" data-testid="select-category-filter">
                      <SelectValue placeholder={t('documentLibrary.filter.category', 'Category')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" data-testid="option-category-all">
                        {t('documentLibrary.filter.allCategories', 'All Categories')}
                      </SelectItem>
                      <SelectItem value="criminal" data-testid="option-category-criminal">
                        {t('documentLibrary.filter.criminal', 'Criminal Justice')}
                      </SelectItem>
                      <SelectItem value="immigration" data-testid="option-category-immigration">
                        {t('documentLibrary.filter.immigration', 'Immigration')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-sm text-muted-foreground">
                  {t('documentLibrary.filter.showing', '{{count}} documents', { count: filteredDocuments.length })}
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>

        {selectedCategory === 'all' ? (
          <Tabs defaultValue="criminal" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="criminal" data-testid="tab-criminal">
                {t('documentLibrary.tabs.criminal', 'Criminal Justice')} ({criminalDocs.length})
              </TabsTrigger>
              <TabsTrigger value="immigration" data-testid="tab-immigration">
                {t('documentLibrary.tabs.immigration', 'Immigration')} ({immigrationDocs.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="criminal">
              <div className="grid gap-6 md:gap-8 md:grid-cols-2">
                {criminalDocs.map((doc, index) => (
                  <DeferredContent 
                    key={doc.id} 
                    delay={index < 4 ? 0 : 100 + (index - 4) * 50}
                    customSkeleton={<CardSkeleton />}
                  >
                    <ScrollReveal>
                      <DocumentCard document={doc} />
                    </ScrollReveal>
                  </DeferredContent>
                ))}
              </div>
              {criminalDocs.length === 0 && (
                <EmptyState
                  variant="documents"
                  title={t('documentLibrary.noDocuments', 'No documents match your filters.')}
                  description={t('documentLibrary.noDocumentsHint', 'Try adjusting your filters to see more documents.')}
                  action={{
                    label: t('documentLibrary.clearFilters', 'Clear filters'),
                    onClick: () => { setSelectedPhase('all'); setSelectedCategory('all'); }
                  }}
                />
              )}
            </TabsContent>
            
            <TabsContent value="immigration">
              <div className="grid gap-6 md:gap-8 md:grid-cols-2">
                {immigrationDocs.map((doc, index) => (
                  <DeferredContent 
                    key={doc.id} 
                    delay={index < 4 ? 0 : 100 + (index - 4) * 50}
                    customSkeleton={<CardSkeleton />}
                  >
                    <ScrollReveal>
                      <DocumentCard document={doc} />
                    </ScrollReveal>
                  </DeferredContent>
                ))}
              </div>
              {immigrationDocs.length === 0 && (
                <EmptyState
                  variant="documents"
                  title={t('documentLibrary.noDocuments', 'No documents match your filters.')}
                  description={t('documentLibrary.noDocumentsHint', 'Try adjusting your filters to see more documents.')}
                  action={{
                    label: t('documentLibrary.clearFilters', 'Clear filters'),
                    onClick: () => { setSelectedPhase('all'); setSelectedCategory('all'); }
                  }}
                />
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="grid gap-6 md:gap-8 md:grid-cols-2">
            {filteredDocuments.map((doc, index) => (
              <DeferredContent 
                key={doc.id} 
                delay={index < 4 ? 0 : 100 + (index - 4) * 50}
                customSkeleton={<CardSkeleton />}
              >
                <ScrollReveal>
                  <DocumentCard document={doc} />
                </ScrollReveal>
              </DeferredContent>
            ))}
            {filteredDocuments.length === 0 && (
              <div className="col-span-2">
                <EmptyState
                  variant="documents"
                  title={t('documentLibrary.noDocuments', 'No documents match your filters.')}
                  description={t('documentLibrary.noDocumentsHint', 'Try adjusting your filters to see more documents.')}
                  action={{
                    label: t('documentLibrary.clearFilters', 'Clear filters'),
                    onClick: () => { setSelectedPhase('all'); setSelectedCategory('all'); }
                  }}
                />
              </div>
            )}
          </div>
        )}

        <ScrollReveal>
          <Card className="mt-10 bg-muted/50">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">
                    {t('documentLibrary.cta.title', 'Need Personalized Guidance?')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('documentLibrary.cta.description', 'Our AI assistant can help you understand which documents you should have for your specific situation.')}
                  </p>
                </div>
                <Link href="/chat">
                  <Button data-testid="button-get-guidance">
                    {t('documentLibrary.cta.button', 'Get Guidance')}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </main>

      <Footer />
    </div>
  );
}
