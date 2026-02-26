import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Calendar, 
  MapPin, 
  Book, 
  FileText, 
  Users, 
  Phone, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Clock,
  Scale,
  Gavel,
  UserCheck,
  FileX,
  HelpCircle,
  Search,
  Mail,
  Navigation,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "wouter";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { PageBreadcrumb } from "@/components/navigation/page-breadcrumb";
import { ShareButton } from "@/components/ui/share-button";
import { useLegalResources } from "@/hooks/use-legal-data";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { LegalTextHighlighter } from "@/components/legal-term-highlighter";

export default function RightsInfo() {
  useScrollToTop();
  const { t } = useTranslation();
  const [selectedJurisdiction, setSelectedJurisdiction] = useState("federal");
  const { data: resources, isLoading } = useLegalResources(selectedJurisdiction);
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
      <section className="vivid-header-alt py-16 md:py-20 lg:py-24">
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
      <section className="py-16 md:py-20 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center text-foreground mb-10 md:mb-14" data-testid="heading-quick-rights">
              {t('rights.quickRights.title')}
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <ScrollReveal delay={0.1}>
              <QuickRightCard
                icon={<Shield className="h-5 w-5" />}
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

      {/* Detailed Rights Information */}
      <section className="py-16 md:py-20 lg:py-24 bg-muted/30" id="constitutional-rights">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center text-foreground mb-10 md:mb-14" data-testid="heading-detailed-rights">
              {t('rights.detailedRights.title')}
            </h2>
          </ScrollReveal>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <ScrollReveal delay={0.1}>
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-10 md:mb-12 bg-background border border-border">
                <TabsTrigger 
                  value="miranda" 
                  data-testid="tab-miranda"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow-md hover:bg-blue-100 hover:text-blue-800 hover:font-semibold transition-all duration-200"
                >
                  {t('rights.detailedRights.tabs.miranda')}
                </TabsTrigger>
                <TabsTrigger 
                  value="arrest" 
                  data-testid="tab-arrest"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow-md hover:bg-blue-100 hover:text-blue-800 hover:font-semibold transition-all duration-200"
                >
                  {t('rights.detailedRights.tabs.arrest')}
                </TabsTrigger>
                <TabsTrigger 
                  value="court" 
                  data-testid="tab-court"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow-md hover:bg-blue-100 hover:text-blue-800 hover:font-semibold transition-all duration-200"
                >
                  {t('rights.detailedRights.tabs.court')}
                </TabsTrigger>
                <TabsTrigger 
                  value="prison" 
                  data-testid="tab-prison"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow-md hover:bg-blue-100 hover:text-blue-800 hover:font-semibold transition-all duration-200"
                >
                  {t('rights.detailedRights.tabs.prison')}
                </TabsTrigger>
              </TabsList>
            </ScrollReveal>

            <div>
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
                </motion.div>
              </AnimatePresence>
            </div>
          </Tabs>
        </div>
      </section>

      {/* Learn More About Search Rights */}
      <section className="py-8 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center">
              <Link href="/search-seizure">
                <Button 
                  data-testid="button-search-rights" 
                  variant="outline"
                  className="py-4 px-8 bg-indigo-100 dark:bg-indigo-900/40 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/50"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Rights During a Search
                </Button>
              </Link>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedRight === 'silent' && <Shield className="h-5 w-5 text-blue-600" />}
              {selectedRight === 'attorney' && <Scale className="h-5 w-5 text-green-600" />}
              {selectedRight === 'phoneCall' && <Phone className="h-5 w-5 text-blue-500" />}
              {selectedRight === 'knowCharges' && <UserCheck className="h-5 w-5 text-purple-600" />}
              {selectedRight && t(`rights.quickRights.${selectedRight}.title`)}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              {selectedRight && t(`rights.quickRights.${selectedRight}.detailedExplanation`)}
            </p>
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
          <Shield className="h-5 w-5 text-primary" />
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

function ProcessStep({ number, title, description, timeframe, rights, isLast }: {
  number: number;
  title: string;
  description: string;
  timeframe: string;
  rights: string[];
  isLast: boolean;
}) {
  return (
    <div className="flex">
      <div className="flex flex-col items-center mr-6">
        <div className="w-10 h-10 legal-blue rounded-full flex items-center justify-center text-white font-bold">
          {number}
        </div>
        {!isLast && <div className="w-0.5 h-16 bg-border mt-4"></div>}
      </div>
      
      <Card className="flex-1">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-foreground">{title}</h3>
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {timeframe}
            </Badge>
          </div>
          
          <p className="text-muted-foreground mb-4">{description}</p>
          
          <div>
            <h4 className="font-medium text-foreground mb-2">Your Rights at This Stage:</h4>
            <ul className="space-y-1">
              {rights.map((right, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start">
                  <span className="text-success-green mr-2">•</span>
                  {right}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ResourceCard({ icon, title, description, contact, bgColor }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  contact: string;
  bgColor: string;
}) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mb-4`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-3">{title}</h3>
        <p className="text-muted-foreground mb-4 text-sm">{description}</p>
        <div className="flex items-center text-sm text-primary">
          <Phone className="h-4 w-4 mr-2" />
          {contact}
        </div>
      </CardContent>
    </Card>
  );
}

const processSteps = [
  {
    title: "Arrest",
    description: "Law enforcement takes you into custody based on probable cause or a warrant.",
    timeframe: "Immediate",
    rights: [
      "Right to remain silent",
      "Right to an attorney",
      "Right to a phone call",
      "Right to be informed of charges"
    ]
  },
  {
    title: "Booking",
    description: "Processing at the police station including fingerprints, photos, and personal information.",
    timeframe: "1-3 hours",
    rights: [
      "Right to medical attention if needed",
      "Right to contact attorney or family",
      "Right to humane treatment"
    ]
  },
  {
    title: "Initial Appearance/Arraignment",
    description: "First court appearance where charges are formally read and you enter a plea.",
    timeframe: "24-72 hours",
    rights: [
      "Right to be informed of charges",
      "Right to have attorney present",
      "Right to request public defender",
      "Right to reasonable bail"
    ]
  },
  {
    title: "Preliminary Hearing",
    description: "Court determines if there's probable cause to believe you committed the crime.",
    timeframe: "1-2 weeks",
    rights: [
      "Right to challenge evidence",
      "Right to cross-examine witnesses",
      "Right to attorney representation"
    ]
  },
  {
    title: "Discovery",
    description: "Both sides exchange evidence, witness lists, and other case information.",
    timeframe: "Weeks to months",
    rights: [
      "Right to see prosecution's evidence",
      "Right to present defense evidence",
      "Right to expert witnesses"
    ]
  },
  {
    title: "Trial",
    description: "Formal presentation of evidence before a judge or jury to determine guilt or innocence.",
    timeframe: "Varies",
    rights: [
      "Right to jury trial",
      "Right to confront witnesses",
      "Right to remain silent",
      "Right to present defense"
    ]
  }
];
