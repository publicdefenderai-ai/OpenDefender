import { BrandShieldIcon } from "@/components/brand-logo";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Phone,
  AlertTriangle,
  Clock,
  Scale,
  Gavel,
  UserCheck,
  FileX,
  Search,
  MessageSquare,
  ChevronRight,
  Home,
  Car,
  Smartphone,
  CheckCircle,
  ChevronDown,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "wouter";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { PageBreadcrumb } from "@/components/navigation/page-breadcrumb";
import { ShareButton } from "@/components/ui/share-button";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { LegalTextHighlighter } from "@/components/legal-term-highlighter";

export default function RightsInfo() {
  useScrollToTop();
  const { t } = useTranslation();
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("miranda");
  const [animationKey, setAnimationKey] = useState(0);
  
  const breadcrumbItems = [
    { label: t('breadcrumb.home', 'Home'), href: '/' }
  ];
  
  const handleTabChange = (value: string) => {
    setAnimationKey(prev => prev + 1);
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageBreadcrumb 
        items={breadcrumbItems} 
        currentPage={t('rights.hero.title')} 
      />

      {/* Hero Section - Vivid Header */}
      <section className="vivid-header py-16 md:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 vivid-header-content">
          <ScrollReveal>
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white" data-testid="heading-rights-title">
                {t('rights.hero.title')}
              </h1>
              <p className="text-xl text-white/80 max-w-3xl mx-auto mb-6" data-testid="text-rights-subtitle">
                {t('rights.hero.subtitle')}
              </p>
              <ShareButton 
                title={t('rights.hero.title')}
                text={t('share.rightsDescription', 'Learn about your constitutional rights - important information everyone should know.')}
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                data-testid="button-share-rights"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Quick Rights Reference */}
      <section className="py-16 md:py-20 lg:py-24 bg-background" id="quick-rights">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center text-foreground mb-10 md:mb-14" data-testid="heading-quick-rights">
              {t('rights.quickRights.title')}
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <ScrollReveal delay={0.1}>
              <QuickRightCard
                icon={<BrandShieldIcon size={20} />}
                title={t('rights.quickRights.silent.title')}
                description={t('rights.quickRights.silent.description')}
                onClick={() => setSelectedRight('silent')}
              />
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <QuickRightCard
                icon={<Scale className="h-5 w-5" />}
                title={t('rights.quickRights.attorney.title')}
                description={t('rights.quickRights.attorney.description')}
                onClick={() => setSelectedRight('attorney')}
              />
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <QuickRightCard
                icon={<Phone className="h-5 w-5" />}
                title={t('rights.quickRights.phoneCall.title')}
                description={t('rights.quickRights.phoneCall.description')}
                onClick={() => setSelectedRight('phoneCall')}
              />
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <QuickRightCard
                icon={<UserCheck className="h-5 w-5" />}
                title={t('rights.quickRights.knowCharges.title')}
                description={t('rights.quickRights.knowCharges.description')}
                onClick={() => setSelectedRight('knowCharges')}
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Detailed Rights Information — two-column layout with sticky sidebar on desktop */}
      <section className="py-16 md:py-20 lg:py-24 bg-muted/30" id="constitutional-rights">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-10 items-start">

            {/* Main content */}
            <div className="flex-1 min-w-0">
              <ScrollReveal>
                <h2 className="text-3xl font-bold text-foreground mb-10 md:mb-12" data-testid="heading-detailed-rights">
                  {t('rights.detailedRights.title')}
                </h2>
              </ScrollReveal>

              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <ScrollReveal delay={0.1}>
                  <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 mb-10 md:mb-12 bg-background border border-border">
                    <TabsTrigger value="miranda" data-testid="tab-miranda" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow-md hover:bg-blue-100 hover:text-blue-800 hover:font-semibold transition-all duration-200">
                      {t('rights.detailedRights.tabs.miranda')}
                    </TabsTrigger>
                    <TabsTrigger value="arrest" data-testid="tab-arrest" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow-md hover:bg-blue-100 hover:text-blue-800 hover:font-semibold transition-all duration-200">
                      {t('rights.detailedRights.tabs.arrest')}
                    </TabsTrigger>
                    <TabsTrigger value="court" data-testid="tab-court" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow-md hover:bg-blue-100 hover:text-blue-800 hover:font-semibold transition-all duration-200">
                      {t('rights.detailedRights.tabs.court')}
                    </TabsTrigger>
                    <TabsTrigger value="prison" data-testid="tab-prison" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow-md hover:bg-blue-100 hover:text-blue-800 hover:font-semibold transition-all duration-200">
                      {t('rights.detailedRights.tabs.prison')}
                    </TabsTrigger>
                    <TabsTrigger value="search" data-testid="tab-search" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow-md hover:bg-blue-100 hover:text-blue-800 hover:font-semibold transition-all duration-200">
                      Search & Seizure
                    </TabsTrigger>
                  </TabsList>
                </ScrollReveal>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`tab-${activeTab}-${animationKey}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <TabsContent value="miranda" className="mt-0" forceMount={activeTab === "miranda" ? true : undefined}>
                      {activeTab === "miranda" && <MirandaRightsSection />}
                    </TabsContent>
                    <TabsContent value="arrest" className="mt-0" forceMount={activeTab === "arrest" ? true : undefined}>
                      {activeTab === "arrest" && <ArrestRightsSection />}
                    </TabsContent>
                    <TabsContent value="court" className="mt-0" forceMount={activeTab === "court" ? true : undefined}>
                      {activeTab === "court" && <CourtRightsSection />}
                    </TabsContent>
                    <TabsContent value="prison" className="mt-0" forceMount={activeTab === "prison" ? true : undefined}>
                      {activeTab === "prison" && <PrisonRightsSection />}
                    </TabsContent>
                    <TabsContent value="search" className="mt-0" forceMount={activeTab === "search" ? true : undefined}>
                      {activeTab === "search" && <SearchSeizureSection />}
                    </TabsContent>
                  </motion.div>
                </AnimatePresence>
              </Tabs>
            </div>

            {/* Sticky sidebar — desktop only */}
            <aside className="hidden lg:block w-52 flex-shrink-0 sticky top-6 self-start" aria-label="Rights navigation">
              {/* On this page */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 px-1">On this page</p>
                {([
                  { value: 'miranda',  label: t('rights.detailedRights.tabs.miranda'), Icon: BrandShieldIcon },
                  { value: 'arrest',   label: t('rights.detailedRights.tabs.arrest'),  Icon: UserCheck },
                  { value: 'court',    label: t('rights.detailedRights.tabs.court'),   Icon: Gavel },
                  { value: 'prison',   label: t('rights.detailedRights.tabs.prison'),  Icon: FileX },
                  { value: 'search',   label: 'Search & Seizure',                      Icon: Search },
                ] as const).map(({ value, label, Icon }) => (
                  <button
                    key={value}
                    onClick={() => handleTabChange(value)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-all duration-150 ${
                      activeTab === value
                        ? "bg-primary/10 border border-primary/20 text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    <span className="flex-shrink-0 w-3.5 h-3.5"><Icon size={14} /></span>
                    <span className="truncate flex-1">{label}</span>
                    {activeTab === value && <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
                  </button>
                ))}
              </div>

              {/* Deep dives */}
              <div className="border-t border-border/60 pt-4 mb-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 px-1">Go deeper</p>
                {[
                  { href: "/right-to-counsel",   label: "Right to an Attorney",   Icon: Scale   },
                  { href: "/warrants",           label: "Warrants & Your Rights", Icon: FileText},
                  { href: "/support/reputation", label: "Hidden Consequences",    Icon: FileX   },
                ].map(({ href, label, Icon }) => (
                  <Link key={href} href={href}>
                    <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-150 text-left">
                      <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="flex-1">{label}</span>
                      <ChevronRight className="h-3 w-3 flex-shrink-0 opacity-40" />
                    </button>
                  </Link>
                ))}
              </div>

              {/* Take action */}
              <div className="border-t border-border/60 pt-4">
                <Link href="/first-24-hours">
                  <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all text-left">
                    <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>First 24 Hours</span>
                  </button>
                </Link>
                <Link href="/case-guidance">
                  <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all text-left">
                    <MessageSquare className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>Get guidance</span>
                  </button>
                </Link>
              </div>
            </aside>

          </div>
        </div>
      </section>

      {/* Rights Deep Dives — replaces the old "Learn More" button row */}
      <section className="py-12 bg-background" id="deep-dives">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-xl font-bold text-foreground mb-1">Go deeper into your rights</h2>
            <p className="text-sm text-muted-foreground mb-6">Each of these pages covers a specific area in full detail.</p>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { href: "/right-to-counsel",   Icon: Scale,    title: "Right to an Attorney",   desc: "When it begins, how to invoke it, and the dangerous gap before arraignment.", color: "text-green-600 dark:text-green-400", bg: "bg-green-50/60 dark:bg-green-900/10 border-green-200 dark:border-green-800/60", testId: "button-right-to-counsel" },
                { href: "/warrants",           Icon: FileText, title: "Warrants & Your Rights", desc: "Arrest warrants, search warrants, how to check if one exists, and what to do.", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50/60 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/60", testId: "button-warrants" },
                { href: "/support/reputation", Icon: FileX,    title: "Hidden Consequences",    desc: "What happens to housing, jobs, benefits, and family after a charge or conviction.", color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700",   testId: "button-collateral-consequences" },
              ].map(({ href, Icon, title, desc, color, bg, testId }) => (
                <Link key={href} href={href}>
                  <div data-testid={testId} className={`rounded-xl border p-4 h-full cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${bg}`}>
                    <Icon className={`h-5 w-5 mb-3 ${color}`} strokeWidth={1.75} />
                    <p className="font-semibold text-foreground text-sm mb-1">{title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Important Disclaimers */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <Alert className="border-border bg-muted/50">
              <AlertDescription className="text-muted-foreground">
                <strong className="font-semibold text-foreground">{t('rights.disclaimer.title')}</strong> {t('rights.disclaimer.text')}
              </AlertDescription>
            </Alert>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="text-center mt-12">
              <h3 className="text-xl font-semibold text-foreground mb-4" data-testid="heading-need-help">
                {t('rights.disclaimer.needHelp')}
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/case-guidance">
                  <Button 
                    data-testid="button-case-guidance" 
                    className="py-3 px-6"
                  >
                    {t('rights.disclaimer.caseGuidance')}
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />

      {/* Right Detail Dialog */}
      <Dialog open={selectedRight !== null} onOpenChange={(open) => !open && setSelectedRight(null)}>
        <DialogContent className="max-w-[92vw] sm:max-w-lg md:max-w-2xl overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 min-w-0">
              <span className="flex-shrink-0">
                {selectedRight === 'silent' && <BrandShieldIcon size={20} />}
                {selectedRight === 'attorney' && <Scale className="h-5 w-5 text-green-600" />}
                {selectedRight === 'phoneCall' && <Phone className="h-5 w-5 text-blue-500" />}
                {selectedRight === 'knowCharges' && <UserCheck className="h-5 w-5 text-blue-600" />}
              </span>
              <span className="truncate">{selectedRight && t(`rights.quickRights.${selectedRight}.title`)}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm sm:text-base">
              {selectedRight && t(`rights.quickRights.${selectedRight}.detailedExplanation`)}
            </p>
            {selectedRight === 'attorney' && (
              <div className="pt-2 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3">
                  There's an important distinction between when your right to counsel begins during interrogation (5th Amendment) versus when it covers your full prosecution (6th Amendment). Many people don't know the right applies before formal charges are filed.
                </p>
                <Link href="/right-to-counsel" onClick={() => setSelectedRight(null)}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-auto py-2.5 px-3 whitespace-normal text-left border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900/20"
                  >
                    <Scale className="mr-2 h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>Right to an Attorney: Full Guide →</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function QuickRightCard({ icon, title, description, onClick }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <Card 
      className="text-center hover:shadow-lg transition-all duration-200 cursor-pointer border hover:border-primary hover:ring-2 hover:ring-primary/30 ring-offset-2 ring-offset-background card-press" 
      onClick={onClick}
      data-testid={`card-right-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <CardContent className="p-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center mx-auto mb-4 text-primary ring-1 ring-primary/20">
          {icon}
        </div>
        <h3 className="font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function MirandaRightsSection() {
  const { t } = useTranslation();
  
  return (
    <Card>
      <CardHeader className="animate-rights-header">
        <CardTitle className="flex items-center space-x-2">
          <BrandShieldIcon size={20} />
          <span>{t('rights.detailedRights.miranda.title')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 animate-rights-content">
        <div>
          <h4 className="font-semibold text-foreground mb-3">{t('rights.detailedRights.miranda.completeWarning')}</h4>
          <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
            <p>"{t('rights.detailedRights.miranda.warning1')}"</p>
            <p>"{t('rights.detailedRights.miranda.warning2')}"</p>
            <p>"{t('rights.detailedRights.miranda.warning3')}"</p>
            <p>"{t('rights.detailedRights.miranda.warning4')}"</p>
            <p>"{t('rights.detailedRights.miranda.warning5')}"</p>
            <p>"{t('rights.detailedRights.miranda.warning6')}"</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-3">{t('rights.detailedRights.miranda.whenApply')}</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.miranda.apply1')} /></li>
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.miranda.apply2')} /></li>
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.miranda.apply3')} /></li>
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.miranda.apply4')} /></li>
          </ul>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{t('rights.detailedRights.miranda.alertTitle')}</strong> <LegalTextHighlighter text={t('rights.detailedRights.miranda.alertText')} />
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

function ArrestRightsSection() {
  const { t } = useTranslation();
  
  return (
    <Card>
      <CardHeader className="animate-rights-header">
        <CardTitle className="flex items-center space-x-2">
          <UserCheck className="h-5 w-5 text-primary" />
          <span>{t('rights.detailedRights.arrest.title')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 animate-rights-content">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-foreground mb-3">{t('rights.detailedRights.arrest.shouldDo')}</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>• <LegalTextHighlighter text={t('rights.detailedRights.arrest.do1')} /></li>
              <li>• <LegalTextHighlighter text={t('rights.detailedRights.arrest.do2')} /></li>
              <li>• <LegalTextHighlighter text={t('rights.detailedRights.arrest.do3')} /></li>
              <li>• <LegalTextHighlighter text={t('rights.detailedRights.arrest.do4')} /></li>
              <li>• <LegalTextHighlighter text={t('rights.detailedRights.arrest.do5')} /></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-3">{t('rights.detailedRights.arrest.shouldNotDo')}</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>• <LegalTextHighlighter text={t('rights.detailedRights.arrest.dont1')} /></li>
              <li>• <LegalTextHighlighter text={t('rights.detailedRights.arrest.dont2')} /></li>
              <li>• <LegalTextHighlighter text={t('rights.detailedRights.arrest.dont3')} /></li>
              <li>• <LegalTextHighlighter text={t('rights.detailedRights.arrest.dont4')} /></li>
              <li>• <LegalTextHighlighter text={t('rights.detailedRights.arrest.dont5')} /></li>
            </ul>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-3">{t('rights.detailedRights.arrest.policePowers')}</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.arrest.power1')} /></li>
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.arrest.power2')} /></li>
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.arrest.power3')} /></li>
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.arrest.power4')} /></li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function CourtRightsSection() {
  const { t } = useTranslation();
  
  return (
    <Card>
      <CardHeader className="animate-rights-header">
        <CardTitle className="flex items-center space-x-2">
          <Gavel className="h-5 w-5 text-primary" />
          <span>{t('rights.detailedRights.court.title')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 animate-rights-content">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-foreground mb-3">{t('rights.detailedRights.court.constitutional')}</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>• <LegalTextHighlighter text={t('rights.detailedRights.court.right1')} /></li>
              <li>• <LegalTextHighlighter text={t('rights.detailedRights.court.right2')} /></li>
              <li>• <LegalTextHighlighter text={t('rights.detailedRights.court.right3')} /></li>
              <li>• <LegalTextHighlighter text={t('rights.detailedRights.court.right4')} /></li>
              <li>• <LegalTextHighlighter text={t('rights.detailedRights.court.right5')} /></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-3">{t('rights.detailedRights.court.burdenProof')}</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>• <LegalTextHighlighter text={t('rights.detailedRights.court.burden1')} /></li>
              <li>• <LegalTextHighlighter text={t('rights.detailedRights.court.burden2')} /></li>
              <li>• <LegalTextHighlighter text={t('rights.detailedRights.court.burden3')} /></li>
              <li>• <LegalTextHighlighter text={t('rights.detailedRights.court.burden4')} /></li>
            </ul>
          </div>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{t('rights.detailedRights.court.etiquetteTitle')}</strong> <LegalTextHighlighter text={t('rights.detailedRights.court.etiquetteText')} />
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

function PrisonRightsSection() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader className="animate-rights-header">
        <CardTitle className="flex items-center space-x-2">
          <FileX className="h-5 w-5 text-primary" />
          <span>{t('rights.detailedRights.prison.title')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 animate-rights-content">
        <div>
          <h4 className="font-semibold text-foreground mb-3">{t('rights.detailedRights.prison.continuing')}</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.prison.right1')} /></li>
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.prison.right2')} /></li>
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.prison.right3')} /></li>
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.prison.right4')} /></li>
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.prison.right5')} /></li>
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.prison.right6')} /></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-3">{t('rights.detailedRights.prison.afterRelease')}</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.prison.after1')} /></li>
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.prison.after2')} /></li>
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.prison.after3')} /></li>
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.prison.after4')} /></li>
            <li>• <LegalTextHighlighter text={t('rights.detailedRights.prison.after5')} /></li>
          </ul>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{t('rights.detailedRights.prison.collateralTitle')}</strong> <LegalTextHighlighter text={t('rights.detailedRights.prison.collateralText')} />
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

interface SearchScenario {
  icon: React.ReactNode;
  title: string;
  description: string;
  yourRights: string[];
  whatToDo: string[];
  whatNotToDo: string[];
  iconBgColor: string;
}

const searchScenarios: SearchScenario[] = [
  {
    icon: <User className="h-6 w-6 text-white" />,
    title: "Stop and Frisk",
    description: "When police stop you on the street and pat you down for weapons",
    iconBgColor: "bg-blue-600",
    yourRights: [
      "You can ask if you're free to leave",
      "You can refuse to answer questions (except giving your name in some states)",
      "Officer needs a good reason to stop you",
      "Pat-down should only check for weapons unless they see something illegal in plain view",
    ],
    whatToDo: [
      "Stay calm and keep hands visible",
      "Ask 'Am I free to go?'",
      "State clearly: 'I do not consent to this search'",
      "Remember the officer's name and badge number",
      "Note any witnesses present",
    ],
    whatNotToDo: [
      "Don't resist physically",
      "Don't run away",
      "Don't put hands in pockets",
      "Don't make sudden movements",
      "Don't consent to searches beyond what's legally required",
    ],
  },
  {
    icon: <Car className="h-6 w-6 text-white" />,
    title: "Vehicle Search",
    description: "When police want to search your car during a traffic stop",
    iconBgColor: "bg-green-600",
    yourRights: [
      "Police need a good reason or your permission to search",
      "You can say no to a search of your vehicle",
      "Officer can see items that are out in the open",
      "If arrested, your car can be searched without permission",
    ],
    whatToDo: [
      "Pull over safely when signaled",
      "Keep hands on steering wheel",
      "Provide license, registration, and insurance when asked",
      "Clearly state: 'I do not consent to a search'",
      "Ask if you're free to go",
    ],
    whatNotToDo: [
      "Don't exit vehicle unless instructed",
      "Don't reach for documents until asked",
      "Don't consent to searches",
      "Don't volunteer information",
      "Don't argue or become confrontational",
    ],
  },
  {
    icon: <Home className="h-6 w-6 text-white" />,
    title: "Home Search",
    description: "When law enforcement wants to enter or search your home",
    iconBgColor: "bg-purple-600",
    yourRights: [
      "Police usually need a warrant (court order) to enter your home",
      "You can say no if they don't have a warrant",
      "The warrant must name exactly what they can search",
      "You have the right to see the warrant before letting them in",
      "Police can enter without a warrant in emergencies (such as hearing screams)",
    ],
    whatToDo: [
      "Ask to see the warrant before opening the door",
      "Read the warrant carefully",
      "Step outside and close the door behind you to speak with officers",
      "Clearly state: 'I do not consent to a search'",
      "Ask for a lawyer immediately if they insist on searching",
    ],
    whatNotToDo: [
      "Don't open the door fully",
      "Don't let officers in without seeing a warrant",
      "Don't physically resist",
      "Don't interfere with the search",
      "Don't answer questions beyond identifying yourself",
    ],
  },
  {
    icon: <BrandShieldIcon size={24} light />,
    title: "Search of Your Person",
    description: "When police want to conduct a body search",
    iconBgColor: "bg-red-600",
    yourRights: [
      "Police need a good reason to pat you down",
      "Full body search requires arrest or a very good reason",
      "Strip searches require a warrant or serious emergency",
      "You can state that you don't agree to the search",
      "You have privacy rights under the law",
    ],
    whatToDo: [
      "Keep hands visible at all times",
      "Clearly state: 'I do not consent to this search'",
      "Ask what the search is for",
      "Remain calm and cooperative despite your objection",
      "Document what happened as soon as you can",
    ],
    whatNotToDo: [
      "Don't physically resist",
      "Don't reach into your own pockets",
      "Don't make sudden movements",
      "Don't touch the officer",
      "Don't run or attempt to flee",
    ],
  },
  {
    icon: <Smartphone className="h-6 w-6 text-white" />,
    title: "Phone Search",
    description: "When police ask to see or unlock your phone",
    iconBgColor: "bg-indigo-600",
    yourRights: [
      "Police usually need a warrant (court order) to search your phone",
      "You can refuse to unlock your phone",
      "You have the right not to help them build a case against you",
      "Courts are divided on biometrics — many have held police cannot force fingerprint or Face ID unlock without a warrant, but this varies by jurisdiction",
      "Passcodes are more protected. Courts generally hold you cannot be compelled to reveal a passcode (5th Amendment)",
    ],
    whatToDo: [
      "Clearly state: 'I do not consent to a search of my phone'",
      "Ask if they have a warrant",
      "Request to speak with an attorney",
      "Keep phone locked and password-protected",
      "Consider disabling biometric unlock in sensitive situations",
    ],
    whatNotToDo: [
      "Don't unlock your phone for police",
      "Don't provide your passcode",
      "Don't let them use your biometrics to unlock",
      "Don't let officers look through your phone to 'prove' something",
      "Don't delete anything (this could be obstruction of justice)",
    ],
  },
];

function SearchScenarioCard({ scenario }: { scenario: SearchScenario }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader>
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${scenario.iconBgColor} rounded-lg flex items-center justify-center`}>
                  {scenario.icon}
                </div>
                <div className="text-left">
                  <CardTitle className="text-base">{scenario.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{scenario.description}</p>
                </div>
              </div>
              <ChevronDown className={`h-5 w-5 flex-shrink-0 ml-2 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2 text-sm">
                <BrandShieldIcon size={14} />
                Your Rights:
              </h4>
              <ul className="space-y-2">
                {scenario.yourRights.map((right, i) => (
                  <li key={i} className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    {right}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3 text-sm">What to Do:</h4>
                <ul className="space-y-1.5">
                  {scenario.whatToDo.map((action, i) => (
                    <li key={i} className="text-sm text-green-800 dark:text-green-200">+ {action}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
                <h4 className="font-semibold text-red-900 dark:text-red-100 mb-3 text-sm">What NOT to Do:</h4>
                <ul className="space-y-1.5">
                  {scenario.whatNotToDo.map((action, i) => (
                    <li key={i} className="text-sm text-red-800 dark:text-red-200">- {action}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

function SearchSeizureSection() {
  return (
    <Card>
      <CardHeader className="animate-rights-header">
        <CardTitle className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-primary" />
          <span>Search &amp; Seizure Rights</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 animate-rights-content">
        <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700">
          <AlertDescription className="text-blue-800 dark:text-blue-200 flex items-start gap-3">
            <BrandShieldIcon size={16} className="mt-0.5 flex-shrink-0" />
            <span><strong>Key Principle:</strong> Police usually need a warrant or your permission to search you. You have the right to say no, even if it doesn't stop the search. Refusing is not an admission of guilt. It protects your rights in court.</span>
          </AlertDescription>
        </Alert>

        <div>
          <h4 className="font-semibold text-foreground mb-4">General Guidelines</h4>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="font-semibold text-sm text-foreground mb-1">Stay Calm</p>
              <p className="text-sm text-muted-foreground">Remain polite and calm, even if you believe your rights are being violated. Arguments escalate situations.</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="font-semibold text-sm text-foreground mb-1">State Your Rights</p>
              <p className="text-sm text-muted-foreground">Clearly say "I do not consent to this search" and "I want to speak to an attorney." Silence alone may not be enough.</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="font-semibold text-sm text-foreground mb-1">Document Everything</p>
              <p className="text-sm text-muted-foreground">Note badge numbers, officer names, and witnesses. Write down what happened as soon as possible.</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-4">Common Search Scenarios</h4>
          <p className="text-sm text-muted-foreground mb-4">Tap each scenario to see your rights and what to do.</p>
          <div className="space-y-3">
            {searchScenarios.map((scenario) => (
              <SearchScenarioCard key={scenario.title} scenario={scenario} />
            ))}
          </div>
        </div>

        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <strong>Note:</strong> Laws vary by state and situation. This is general information, not legal advice. If your rights were violated during a search, tell your attorney immediately. Evidence obtained illegally may be excluded from your case.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

