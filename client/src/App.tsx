import { useState } from "react";
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
import { MobileBottomNav } from "@/components/navigation/mobile-bottom-nav";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { X } from "lucide-react";
import "./i18n";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import RightsInfo from "@/pages/rights-info";
import CaseGuidance from "@/pages/case-guidance";
import CourtLocator from "@/pages/court-locator";
import DevelopmentRoadmap from "@/pages/development-roadmap";
import DashboardTest from "@/pages/dashboard-test";
import ImmigrationGuidance from "@/pages/immigration-guidance";
import DacaTps from "@/pages/immigration/daca-tps";
import WorkplaceRaids from "@/pages/immigration/workplace-raids";
import FamilyPlanning from "@/pages/immigration/family-planning";
import BondHearings from "@/pages/immigration/bond-hearings";
import FindAttorney from "@/pages/immigration/find-attorney";
import FindDetained from "@/pages/immigration/find-detained";
import KnowYourRights from "@/pages/immigration/know-your-rights";
import RaidsToolkit from "@/pages/immigration/raids-toolkit";
import LegalGlossary from "@/pages/legal-glossary";
import DiversionPrograms from "@/pages/diversion-programs";
import RecordExpungement from "@/pages/record-expungement";
import MissionStatement from "@/pages/mission-statement";
import CourtRecords from "@/pages/court-records";
import RecapExtensions from "@/pages/recap-extensions";
import Process from "@/pages/process";
import SearchSeizure from "@/pages/search-seizure";
import FriendsFamily from "@/pages/friends-family";
import HowTo from "@/pages/how-to";
import PrivacyPolicy from "@/pages/privacy-policy";
import Disclaimers from "@/pages/disclaimers";
import Statutes from "@/pages/statutes";
import Chat from "@/pages/chat";
import DocumentLibrary from "@/pages/document-library";
import Resources from "@/pages/resources";
import DocumentSummarizerPage from "@/pages/document-summarizer";
import AttorneyPortal from "@/pages/attorney/index";
import AttorneyVerify from "@/pages/attorney/verify";
import AttorneyDocuments from "@/pages/attorney/documents";
import DocumentWizard from "@/pages/attorney/document-wizard";
import ApiDocs from "@/pages/api-docs";
import Widgets from "@/pages/widgets";
import TechDocs from "@/pages/tech-docs";
import EmbedSearch from "@/pages/embed/search";
import EmbedRights from "@/pages/embed/rights";
import EmbedGlossary from "@/pages/embed/glossary";

function BetaBanner() {
  const [isDismissed, setIsDismissed] = useState(false);

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
            Beta
          </span>
          <p className="text-sm text-muted-foreground truncate sm:whitespace-normal">
            <span className="hidden sm:inline">Beta Version — Our guidance is carefully researched, but we're still refining features based on user feedback.</span>
            <span className="sm:hidden">Beta — We're still refining features based on feedback.</span>
          </p>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="shrink-0 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Dismiss beta banner"
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
      <Route path="/development-roadmap" component={DevelopmentRoadmap} />
      <Route path="/dashboard-test" component={DashboardTest} />
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
      <Route path="/search-seizure" component={SearchSeizure} />
      <Route path="/friends-family" component={FriendsFamily} />
      <Route path="/how-to" component={HowTo} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/disclaimers" component={Disclaimers} />
      <Route path="/statutes" component={Statutes} />
      <Route path="/chat" component={Chat} />
      <Route path="/document-library" component={DocumentLibrary} />
      <Route path="/resources" component={Resources} />
      <Route path="/document-summarizer" component={DocumentSummarizerPage} />
      <Route path="/attorney" component={AttorneyPortal} />
      <Route path="/attorney/verify" component={AttorneyVerify} />
      <Route path="/attorney/documents" component={AttorneyDocuments} />
      <Route path="/attorney/documents/:templateId" component={DocumentWizard} />
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
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      data-testid="skip-navigation"
    >
      Skip to main content
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
                <main id="main-content" tabIndex={-1} className="pb-16 md:pb-0">
                  <AnimatePresence mode="wait">
                    <PageTransition key={location}>
                      <Router />
                    </PageTransition>
                  </AnimatePresence>
                </main>
                <ChatLauncher />
                <MobileBottomNav />
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
