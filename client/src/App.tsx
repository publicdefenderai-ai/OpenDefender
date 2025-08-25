import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import RightsInfo from "@/pages/rights-info";
import CaseGuidance from "@/pages/case-guidance";
import CourtLocator from "@/pages/court-locator";
import DevelopmentRoadmap from "@/pages/development-roadmap";
import DashboardTest from "@/pages/dashboard-test";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/rights-info" component={RightsInfo} />
      <Route path="/case-guidance" component={CaseGuidance} />
      <Route path="/court-locator" component={CourtLocator} />
      <Route path="/development-roadmap" component={DevelopmentRoadmap} />
      <Route path="/dashboard-test" component={DashboardTest} />
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
