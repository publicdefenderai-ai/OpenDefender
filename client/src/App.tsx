import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import "./i18n";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import RightsInfo from "@/pages/rights-info";
import CaseGuidance from "@/pages/case-guidance";
import CourtLocator from "@/pages/court-locator";
import DevelopmentRoadmap from "@/pages/development-roadmap";
import DashboardTest from "@/pages/dashboard-test";
import ImmigrationGuidance from "@/pages/immigration-guidance";
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
import Statutes from "@/pages/statutes";

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
      <Route path="/statutes" component={Statutes} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="public-defender-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
