import { lazy, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { PageTransition } from "@/components/ui/page-transition";
import { NavigationGuardProvider } from "@/contexts/navigation-guard";
import { ChatProvider } from "@/contexts/chat-context";
import { AttorneyProvider } from "@/contexts/attorney-context";
import { ChatLauncher } from "@/components/chat/chat-launcher";
import { KeyboardShortcutsDialog } from "@/components/ui/keyboard-shortcuts-dialog";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { X } from "lucide-react";
import "./i18n";

const NotFound = lazy(() => import("@/pages/not-found"));
const Home = lazy(() => import("@/pages/home"));
const RightsInfo = lazy(() => import("@/pages/rights-info"));
const CaseGuidance = lazy(() => import("@/pages/case-guidance"));
const CourtLocator = lazy(() => import("@/pages/court-locator"));
const ImmigrationGuidance = lazy(() => import("@/pages/immigration-guidance"));
const DacaTps = lazy(() => import("@/pages/immigration/daca-tps"));
const WorkplaceRaids = lazy(() => import("@/pages/immigration/workplace-raids"));
const FamilyPlanning = lazy(() => import("@/pages/immigration/family-planning"));
const BondHearings = lazy(() => import("@/pages/immigration/bond-hearings"));
const FindAttorney = lazy(() => import("@/pages/immigration/find-attorney"));
const FindDetained = lazy(() => import("@/pages/immigration/find-detained"));
const KnowYourRights = lazy(() => import("@/pages/immigration/know-your-rights"));
const RaidsToolkit = lazy(() => import("@/pages/immigration/raids-toolkit"));
const LegalGlossary = lazy(() => import("@/pages/legal-glossary"));
const DiversionPrograms = lazy(() => import("@/pages/diversion-programs"));
const RecordExpungement = lazy(() => import("@/pages/record-expungement"));
const MissionStatement = lazy(() => import("@/pages/mission-statement"));
const CourtRecords = lazy(() => import("@/pages/court-records"));
const RecapExtensions = lazy(() => import("@/pages/recap-extensions"));
const Process = lazy(() => import("@/pages/process"));
const SearchSeizure = lazy(() => import("@/pages/search-seizure"));
const FriendsFamily = lazy(() => import("@/pages/friends-family"));
const HowTo = lazy(() => import("@/pages/how-to"));
const PrivacyPolicy = lazy(() => import("@/pages/privacy-policy"));
const Disclaimers = lazy(() => import("@/pages/disclaimers"));
const Statutes = lazy(() => import("@/pages/statutes"));
const Chat = lazy(() => import("@/pages/chat"));
const DocumentLibrary = lazy(() => import("@/pages/document-library"));
const Resources = lazy(() => import("@/pages/resources"));
const LegalAid = lazy(() => import("@/pages/legal-aid"));
const DocumentSummarizerPage = lazy(() => import("@/pages/document-summarizer"));
const AttorneyPortal = lazy(() => import("@/pages/attorney/index"));
const AttorneyVerify = lazy(() => import("@/pages/attorney/verify"));
const AttorneyDocuments = lazy(() => import("@/pages/attorney/documents"));
const DocumentWizard = lazy(() => import("@/pages/attorney/document-wizard"));
const AttorneyPlaybooks = lazy(() => import("@/pages/attorney/playbooks"));
const PlaybookDetail = lazy(() => import("@/pages/attorney/playbook-detail"));
const ApiDocs = lazy(() => import("@/pages/api-docs"));
const Widgets = lazy(() => import("@/pages/widgets"));
const TechDocs = lazy(() => import("@/pages/tech-docs"));
const EmbedSearch = lazy(() => import("@/pages/embed/search"));
const EmbedRights = lazy(() => import("@/pages/embed/rights"));
const EmbedGlossary = lazy(() => import("@/pages/embed/glossary"));
const CaseTimeline = lazy(() => import("@/pages/case-timeline"));
const QuickReference = lazy(() => import("@/pages/quick-reference"));
const SupportHub = lazy(() => import("@/pages/support/index"));
const EmploymentSupport = lazy(() => import("@/pages/support/employment"));
const FinancesSupport = lazy(() => import("@/pages/support/finances"));
const CourtLogisticsSupport = lazy(() => import("@/pages/support/court-logistics"));
const MentalHealthSupport = lazy(() => import("@/pages/support/mental-health"));
const TransportationSupport = lazy(() => import("@/pages/support/transportation"));
const ChildcareSupport = lazy(() => import("@/pages/support/childcare"));
const HousingSupport = lazy(() => import("@/pages/support/housing"));
const FamilyCareSupport = lazy(() => import("@/pages/support/family-care"));
const ReputationSupport = lazy(() => import("@/pages/support/reputation"));
const PersonalHealthSupport = lazy(() => import("@/pages/support/personal-health"));
const FirstTwentyFourHours = lazy(() => import("@/pages/first-24-hours"));
const JailPhoneCall = lazy(() => import("@/pages/jail-phone-call"));
const CollateralConsequences = lazy(() => import("@/pages/collateral-consequences"));

function BetaBanner() {
  const [isDismissed, setIsDismissed] = useState(false);
  const { t } = useTranslation();

  if (isDismissed) {
    return null;
  }

  return (
    <div
      className="w-full bg-muted/80 border-b border-border py-2.5 px-4"
      data-testid="beta-banner"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            {t('beta.label')}
          </span>
          <p className="text-sm text-muted-foreground truncate sm:whitespace-normal">
            <span className="hidden sm:inline">{t('beta.messageFull')}</span>
            <span className="sm:hidden">{t('beta.messageShort')}</span>
          </p>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="shrink-0 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label={t('common.close')}
          data-testid="beta-banner-dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/rights-info" component={RightsInfo} />
      <Route path="/case-guidance" component={CaseGuidance} />
      <Route path="/court-locator" component={CourtLocator} />
      <Route path="/immigration-guidance" component={ImmigrationGuidance} />
      <Route path="/immigration-guidance/daca-tps" component={DacaTps} />
      <Route path="/immigration-guidance/workplace-raids" component={WorkplaceRaids} />
      <Route path="/immigration-guidance/family-planning" component={FamilyPlanning} />
      <Route path="/immigration-guidance/bond-hearings" component={BondHearings} />
      <Route path="/immigration-guidance/find-attorney" component={FindAttorney} />
      <Route path="/immigration-guidance/find-detained" component={FindDetained} />
      <Route path="/immigration-guidance/know-your-rights" component={KnowYourRights} />
      <Route path="/immigration-guidance/raids-toolkit" component={RaidsToolkit} />
      <Route path="/legal-glossary" component={LegalGlossary} />
      <Route path="/diversion-programs" component={DiversionPrograms} />
      <Route path="/record-expungement" component={RecordExpungement} />
      <Route path="/mission-statement" component={MissionStatement} />
      <Route path="/court-records" component={CourtRecords} />
      <Route path="/recap-extensions" component={RecapExtensions} />
      <Route path="/process" component={Process} />
      <Route path="/case-timeline" component={CaseTimeline} />
      <Route path="/quick-reference" component={QuickReference} />
      <Route path="/search-seizure" component={SearchSeizure} />
      <Route path="/friends-family" component={FriendsFamily} />
      <Route path="/first-24-hours" component={FirstTwentyFourHours} />
      <Route path="/jail-phone-call" component={JailPhoneCall} />
      <Route path="/collateral-consequences" component={CollateralConsequences} />
      <Route path="/how-to" component={HowTo} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/disclaimers" component={Disclaimers} />
      <Route path="/statutes" component={Statutes} />
      <Route path="/chat" component={Chat} />
      <Route path="/document-library" component={DocumentLibrary} />
      <Route path="/resources" component={Resources} />
      <Route path="/legal-aid" component={LegalAid} />
      <Route path="/support" component={SupportHub} />
      <Route path="/support/employment" component={EmploymentSupport} />
      <Route path="/support/finances" component={FinancesSupport} />
      <Route path="/support/court-logistics" component={CourtLogisticsSupport} />
      <Route path="/support/mental-health" component={MentalHealthSupport} />
      <Route path="/support/transportation" component={TransportationSupport} />
      <Route path="/support/childcare" component={ChildcareSupport} />
      <Route path="/support/housing" component={HousingSupport} />
      <Route path="/support/family-care" component={FamilyCareSupport} />
      <Route path="/support/reputation" component={ReputationSupport} />
      <Route path="/support/personal-health" component={PersonalHealthSupport} />
      <Route path="/document-summarizer" component={DocumentSummarizerPage} />
      <Route path="/attorney" component={AttorneyPortal} />
      <Route path="/attorney/verify" component={AttorneyVerify} />
      <Route path="/attorney/documents" component={AttorneyDocuments} />
      <Route path="/attorney/documents/:templateId" component={DocumentWizard} />
      <Route path="/attorney/playbooks" component={AttorneyPlaybooks} />
      <Route path="/attorney/playbooks/:playbookId" component={PlaybookDetail} />
      <Route path="/api-docs" component={ApiDocs} />
      <Route path="/widgets" component={Widgets} />
      <Route path="/tech-docs" component={TechDocs} />
      <Route path="/embed/search" component={EmbedSearch} />
      <Route path="/embed/rights" component={EmbedRights} />
      <Route path="/embed/glossary" component={EmbedGlossary} />
      <Route component={NotFound} />
    </Switch>
  );
}

function SkipNavigation() {
  const { t } = useTranslation();
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      data-testid="skip-navigation"
    >
      {t('common.skipToContent')}
    </a>
  );
}

function App() {
  const [location] = useLocation();
  useKeyboardShortcuts();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="public-defender-theme">
        <NavigationGuardProvider>
          <ChatProvider>
            <AttorneyProvider>
              <TooltipProvider>
                <Toaster />
                <SkipNavigation />
                <BetaBanner />
                <main id="main-content" tabIndex={-1}>
                  <Suspense fallback={<div className="min-h-screen bg-background" />}>
                    <AnimatePresence mode="wait">
                      <PageTransition key={location}>
                        <Router />
                      </PageTransition>
                    </AnimatePresence>
                  </Suspense>
                </main>
                <ChatLauncher />
                <KeyboardShortcutsDialog />
              </TooltipProvider>
            </AttorneyProvider>
          </ChatProvider>
        </NavigationGuardProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
