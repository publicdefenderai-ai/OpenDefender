import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  MessageSquare, 
  AlertTriangle, 
  ArrowRight,
  Shield,
  Calendar,
  MapPin,
  Route,
  Book,
  Eraser,
  University,
  BarChart3,
  Gavel,
  FileText,
  Users,
  Quote,
  RotateCcw,
  ExternalLink,
  Lightbulb,
  CheckCircle,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "wouter";

import { PrivacyBanner } from "@/components/layout/privacy-banner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { RightsCard } from "@/components/legal/rights-card";
import { DataSourceCard } from "@/components/legal/data-source-card";
import { QAFlow } from "@/components/legal/qa-flow";

export default function Home() {
  const [showQAFlow, setShowQAFlow] = useState(false);

  const handleUrgentHelp = () => {
    // Show emergency rights modal or redirect to urgent help page
    alert("URGENT LEGAL RIGHTS:\n\n1. You have the right to remain silent\n2. You have the right to an attorney\n3. Do not sign anything without legal counsel\n4. Ask for a public defender if you cannot afford an attorney\n\nContact local emergency legal services immediately.");
  };

  const handleQAComplete = (data: any) => {
    console.log("QA Flow completed with data:", data);
    setShowQAFlow(false);
    // Here you would typically redirect to results page or show guidance
  };

  if (showQAFlow) {
    return (
      <div className="min-h-screen bg-background">
        <PrivacyBanner />
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <QAFlow 
            onComplete={handleQAComplete}
            onCancel={() => setShowQAFlow(false)}
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PrivacyBanner />
      <Header />

      {/* Hero Section */}
      <section className="gradient-hero text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-blue-800 dark:text-blue-200">Know Your Rights.</span><br />
              <span className="text-blue-800 dark:text-blue-200">Protect Your Future.</span>
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-blue-800 dark:text-blue-200 max-w-4xl mx-auto leading-relaxed">
              Get free legal guidance, understand court processes, and access resources to help navigate the criminal justice system.
            </p>
          </motion.div>

          {/* Emergency Help Button */}
          <ScrollReveal delay={0.2}>
            <div className="mb-12">
              <Button
                onClick={handleUrgentHelp}
                className="urgent-red hover:bg-red-700 hover:shadow-xl font-bold py-4 px-8 rounded-xl text-lg shadow-lg transition-all duration-200 mb-6"
                data-testid="button-urgent-help"
              >
                <AlertTriangle className="mr-2 h-5 w-5" />
                URGENT HELP NEEDED
              </Button>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                If you're being arrested or in court now, click here for immediate rights information.
              </p>
            </div>
          </ScrollReveal>

          {/* Main Entry Points */}
          <ScrollReveal delay={0.4}>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Learn Your Rights */}
              <Link href="/rights-info">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 hover:shadow-lg transition-all duration-300 cursor-pointer group h-full">
                  <CardContent className="p-8 text-center h-full flex flex-col justify-between">
                    <div>
                      <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                        <Lightbulb className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">Learn Your Rights & Local Process</h3>
                      <p className="text-blue-800 dark:text-blue-200 mb-6">
                        Access general legal information, court procedures, and jurisdiction-specific guidance without entering personal details.
                      </p>
                    </div>
                    <div className="flex items-center justify-center text-blue-800 dark:text-blue-200 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 py-3 px-6 rounded-lg">
                      <span className="mr-2">Get Started</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Get Guidance */}
              <Card 
                className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 hover:shadow-lg transition-all duration-300 cursor-pointer group h-full"
                onClick={() => setShowQAFlow(true)}
              >
                <CardContent className="p-8 text-center h-full flex flex-col justify-between">
                  <div>
                    <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <MessageSquare className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Get Guidance for My Case</h3>
                    <p className="text-blue-800 dark:text-blue-200 mb-6">
                      Answer a few questions to receive personalized guidance, next steps, and relevant resources for your situation.
                    </p>
                  </div>
                  <div className="flex items-center justify-center text-blue-800 dark:text-blue-200 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 py-3 px-6 rounded-lg">
                    <span className="mr-2">Start Q&A</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Powered by Real Legal Data
              </h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                Our AI agent uses comprehensive legal databases and court records to provide accurate, up-to-date information.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            <ScrollReveal delay={0.1}>
              <DataSourceCard
                icon={<Book className="h-6 w-6 text-white" />}
                title="Federal Court Records"
                description="Access to 500M+ federal court documents through PACER and CourtListener APIs, including case law, dockets, and judicial data."
                status="live"
                statusText="Live Data Integration"
                iconBgColor="bg-blue-600"
              />
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <DataSourceCard
                icon={<FileText className="h-6 w-6 text-white" />}
                title="State & Local Laws"
                description="Federal and state statutes from Cornell LII, GovInfo.gov, and state legislature websites with regular updates."
                status="government"
                statusText="Updated Monthly"
                iconBgColor="bg-green-600"
              />
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <DataSourceCard
                icon={<BarChart3 className="h-6 w-6 text-white" />}
                title="Criminal Justice Analytics"
                description="DOJ APIs, Bureau of Justice Statistics, and state-specific datasets for sentencing guidelines and case outcomes."
                status="mock"
                statusText="Mock Data (Development)"
                iconBgColor="bg-blue-500"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Rights Information Section */}
      <section className="py-16 lg:py-24 bg-muted/30" id="rights-info">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Know Your Rights
              </h2>
              <p className="text-xl text-muted-foreground">
                Essential legal information everyone should know
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ScrollReveal delay={0.1}>
              <RightsCard
                icon={<Shield className="h-6 w-6 text-white" />}
                title="Miranda Rights"
                description="Understanding your constitutional rights during police interactions and arrest situations."
                buttonText="Learn More"
                href="/rights-info#miranda-rights"
                iconBgColor="legal-blue"
              />
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <RightsCard
                icon={<Calendar className="h-6 w-6 text-white" />}
                title="Court Process Timeline"
                description="Step-by-step guide through arrest, arraignment, trial, and sentencing procedures."
                buttonText="View Timeline"
                href="/rights-info#criminal-justice-timeline"
                iconBgColor="success-green"
              />
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <RightsCard
                icon={<MapPin className="h-6 w-6 text-white" />}
                title="Local Court Info"
                description="Court addresses, hours, bail schedules, and public defender contact information by jurisdiction."
                buttonText="Find Courts"
                iconBgColor="bg-blue-500"
              />
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <RightsCard
                icon={<Route className="h-6 w-6 text-white" />}
                title="Diversion Programs"
                description="Alternative sentencing options including drug courts, community service, and treatment programs."
                buttonText="Explore Options"
                iconBgColor="bg-green-600"
              />
            </ScrollReveal>

            <ScrollReveal delay={0.5}>
              <RightsCard
                icon={<Book className="h-6 w-6 text-white" />}
                title="Legal Glossary"
                description="Plain-language definitions of common legal terms and court procedures."
                buttonText="Browse Terms"
                iconBgColor="bg-purple-600"
              />
            </ScrollReveal>

            <ScrollReveal delay={0.6}>
              <RightsCard
                icon={<Eraser className="h-6 w-6 text-white" />}
                title="Record Expungement"
                description="Learn about sealing or expunging criminal records and eligibility requirements by state."
                buttonText="Check Eligibility"
                iconBgColor="bg-indigo-600"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Personalized Guidance Preview */}
      <section className="py-16 lg:py-24 legal-blue text-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Get Personalized Legal Guidance</h2>
            <p className="text-xl text-blue-800 dark:text-blue-200 mb-12">
              Answer a few questions to receive tailored advice for your specific situation
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl p-8 text-left max-w-2xl mx-auto">
              <CardContent className="p-0">
                <div className="space-y-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</div>
                    <span className="font-semibold">What state/jurisdiction are you in?</span>
                  </div>
                  
                  <div className="flex items-center mb-4 opacity-60">
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</div>
                    <span className="font-semibold text-blue-800 dark:text-blue-200">What charges are you facing?</span>
                  </div>

                  <div className="flex items-center mb-4 opacity-60">
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</div>
                    <span className="font-semibold text-blue-800 dark:text-blue-200">What stage is your case in?</span>
                  </div>

                  <Button
                    onClick={() => setShowQAFlow(true)}
                    className="w-full success-green hover:bg-green-700 hover:shadow-lg font-bold py-4 rounded-xl transition-all duration-200"
                    data-testid="button-start-assessment"
                  >
                    Start Personalized Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-6">
              <Shield className="inline h-4 w-4 mr-2" />
              Your responses are not stored and are deleted when you close your session
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Built on Trust & Transparency
              </h2>
              <p className="text-xl text-muted-foreground">
                Every piece of legal information is backed by credible sources
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ScrollReveal delay={0.1}>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-3 text-foreground">Verified Citations</h3>
                <p className="text-sm text-muted-foreground">
                  All legal statements include proper citations to statutes, case law, and regulations
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-3 text-foreground">Find Legal Help</h3>
                <p className="text-sm text-muted-foreground">
                  Direct connections to public defenders and legal aid organizations in your area
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-3 text-foreground">Privacy Protected</h3>
                <p className="text-sm text-muted-foreground">
                  No personal information stored, all session data automatically deleted
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <RotateCcw className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-3 text-foreground">Current Information</h3>
                <p className="text-sm text-muted-foreground">
                  Legal databases updated regularly to reflect the latest laws and procedures
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* Disclaimer */}
          <ScrollReveal delay={0.5}>
            <Alert className="mt-16 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                <strong className="font-semibold">Important Legal Disclaimer:</strong> This AI agent provides general legal information only and is not a substitute for professional legal advice. Always consult with a qualified attorney for your specific situation. The information provided may not reflect the most recent legal developments and should not be relied upon as legal counsel.
              </AlertDescription>
            </Alert>
          </ScrollReveal>

          {/* Call to Action */}
          <ScrollReveal delay={0.6}>
            <div className="text-center mt-12">
              <div className="space-x-4">
                <Button className="legal-blue hover:bg-blue-700 hover:shadow-xl font-bold py-4 px-8 rounded-xl text-lg shadow-lg transition-all duration-200">
                  Find a Public Defender
                </Button>
                <Button className="success-green hover:bg-green-700 hover:shadow-xl font-bold py-4 px-8 rounded-xl text-lg shadow-lg transition-all duration-200">
                  Legal Aid Organizations
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Data Sources & Development */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Powered by Comprehensive Legal Data
              </h2>
              <p className="text-xl text-muted-foreground">
                Real-time access to federal and state legal information
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <ScrollReveal delay={0.1}>
              <DataSourceCard
                icon={<Gavel className="h-5 w-5 text-white" />}
                title="CourtListener"
                description="8.4+ million court opinions, federal dockets, and judge data via Free Law Project API"
                status="free"
                statusText="FREE"
                iconBgColor="legal-blue"
              />
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <DataSourceCard
                icon={<FileText className="h-5 w-5 text-white" />}
                title="PACER"
                description="500M+ federal court documents and case records with authentication API"
                status="paid"
                statusText="$0.10/page"
                iconBgColor="bg-blue-600"
              />
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <DataSourceCard
                icon={<BarChart3 className="h-5 w-5 text-white" />}
                title="DOJ Statistics"
                description="FBI Crime Data, National Crime Victimization Survey, and Bureau of Justice Statistics"
                status="government"
                statusText="FREE"
                iconBgColor="success-green"
              />
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <DataSourceCard
                icon={<University className="h-5 w-5 text-white" />}
                title="State Laws"
                description="Cornell LII, GovInfo.gov, and state legislature websites for current statutes"
                status="government"
                statusText="FREE"
                iconBgColor="bg-purple-600"
              />
            </ScrollReveal>

            <ScrollReveal delay={0.5}>
              <div className="opacity-75">
                <DataSourceCard
                  icon={<AlertTriangle className="h-5 w-5 text-white" />}
                  title="Judge Analytics"
                  description="Sentencing patterns, plea statistics (using sample data during development)"
                  status="mock"
                  statusText="MOCK"
                  iconBgColor="bg-amber-500"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.6}>
              <DataSourceCard
                icon={<Users className="h-5 w-5 text-white" />}
                title="Legal Aid"
                description="NLADA, NAPD, and state public defender office resources and contacts"
                status="government"
                statusText="FREE"
                iconBgColor="bg-indigo-600"
              />
            </ScrollReveal>
          </div>

          {/* Development Roadmap CTA */}
          <ScrollReveal delay={0.7}>
            <Card className="legal-blue rounded-xl p-8 text-white text-center">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold mb-4">Transparency in Development</h3>
                <p className="text-blue-800 dark:text-blue-200 mb-6 max-w-4xl mx-auto">
                  Track our progress as we integrate additional data sources, expand coverage, and enhance AI capabilities. 
                  We believe in open development and community feedback.
                </p>
                <Link href="/development-roadmap">
                  <Button 
                    className="bg-white text-primary hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-colors"
                    data-testid="button-view-roadmap"
                  >
                    View Development Roadmap
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
      
      {/* Privacy Footer Banner */}
      <div className="legal-blue text-white py-3 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">
              <strong>Privacy First:</strong> We do not store your personal data — all input deleted after session.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
