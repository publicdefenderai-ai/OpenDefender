import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  ArrowRight, 
  ArrowLeft,
  Shield, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  FileText,
  Users,
  Phone,
  ExternalLink,
  Download,
  BookOpen,
  Scale
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";

import { PrivacyBanner } from "@/components/layout/privacy-banner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { QAFlow } from "@/components/legal/qa-flow";
import { GuidanceDashboard } from "@/components/legal/guidance-dashboard";
import { useLegalGuidance } from "@/hooks/use-legal-data";

interface EnhancedGuidanceResult {
  sessionId: string;
  criticalAlerts: string[];
  immediateActions: string[];
  nextSteps: string[];
  deadlines: Array<{
    event: string;
    timeframe: string;
    description: string;
    priority: 'critical' | 'important' | 'normal';
    daysFromNow?: number;
  }>;
  rights: string[];
  resources: Array<{
    type: string;
    description: string;
    contact: string;
    hours?: string;
    website?: string;
  }>;
  warnings: string[];
  evidenceToGather: string[];
  courtPreparation: string[];
  avoidActions: string[];
  timeline: Array<{
    stage: string;
    description: string;
    timeframe: string;
    completed: boolean;
  }>;
  caseData: {
    jurisdiction: string;
    charges: string;
    caseStage: string;
    custodyStatus: string;
    hasAttorney: boolean;
  };
}

export default function CaseGuidance() {
  const [showQAFlow, setShowQAFlow] = useState(false);
  const [guidanceResult, setGuidanceResult] = useState<EnhancedGuidanceResult | null>(null);
  const { generateGuidance, deleteGuidance } = useLegalGuidance();

  const handleQAComplete = async (data: any) => {
    try {
      console.log("Sending guidance request with data:", data);
      const result = await generateGuidance.mutateAsync(data);
      console.log("Received guidance result:", result);
      
      if (result && result.success) {
        // The guidance is directly the EnhancedGuidance object
        const guidance = result.guidance;
        console.log("Processing guidance data:", guidance);
        
        const guidanceData = {
          sessionId: result.sessionId,
          criticalAlerts: guidance.criticalAlerts || [],
          immediateActions: guidance.immediateActions || [],
          nextSteps: guidance.nextSteps || [],
          deadlines: guidance.deadlines || [],
          rights: guidance.rights || [],
          resources: guidance.resources || [],
          warnings: guidance.warnings || [],
          evidenceToGather: guidance.evidenceToGather || [],
          courtPreparation: guidance.courtPreparation || [],
          avoidActions: guidance.avoidActions || [],
          timeline: guidance.timeline || [],
          caseData: data,
        };
        
        console.log("Setting guidance result:", guidanceData);
        setGuidanceResult(guidanceData);
        setShowQAFlow(false);
        console.log("Should now show dashboard");
      } else {
        console.error("API returned unsuccessful result:", result);
        alert("Failed to generate guidance. Please try again.");
      }
    } catch (error) {
      console.error("Failed to generate guidance:", error);
      console.error("Error details:", error);
      alert("An error occurred while generating guidance. Please try again.");
    }
  };

  const handleNewSession = async () => {
    if (guidanceResult?.sessionId) {
      await deleteGuidance.mutateAsync(guidanceResult.sessionId);
    }
    setGuidanceResult(null);
    setShowQAFlow(true);
  };

  const handleStartQA = () => {
    setShowQAFlow(true);
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

  if (guidanceResult) {
    return (
      <div className="min-h-screen bg-background">
        <PrivacyBanner />
        <Header />
        
        <main className="px-4 py-8">
          <GuidanceDashboard 
            guidance={guidanceResult} 
            onClose={() => setGuidanceResult(null)}
            onDeleteSession={handleNewSession}
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
      <section className="gradient-hero text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-600">
                Case Guidance
              </h1>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Get Personalized Legal Guidance
              </h2>
              <p className="text-xl text-blue-800 dark:text-blue-200 max-w-3xl mx-auto mb-8">
                Answer a few questions about your situation to receive tailored legal guidance, next steps, and resources specific to your case and jurisdiction.
              </p>
              
              <Button
                onClick={handleStartQA}
                className="success-green success-green-hover font-bold py-4 px-8 rounded-xl text-lg shadow-lg hover:scale-105 transition-all duration-200"
                data-testid="button-start-guidance"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Start Personalized Assessment
              </Button>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="flex items-center justify-center space-x-2 text-sm text-blue-800 dark:text-blue-200">
              <Shield className="h-4 w-4" />
              <span>Your responses are private and automatically deleted after your session</span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              How Personalized Guidance Works
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-4 gap-8">
            <ScrollReveal delay={0.1}>
              <StepCard
                number={1}
                title="Answer Questions"
                description="Provide information about your jurisdiction, charges, and case stage"
                icon={<MessageSquare className="h-6 w-6 text-white" />}
              />
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <StepCard
                number={2}
                title="AI Analysis"
                description="Our system analyzes your situation using legal databases and precedents"
                icon={<Scale className="h-6 w-6 text-white" />}
              />
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <StepCard
                number={3}
                title="Get Guidance"
                description="Receive tailored next steps, deadlines, and relevant legal information"
                icon={<FileText className="h-6 w-6 text-white" />}
              />
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <StepCard
                number={4}
                title="Connect to Help"
                description="Access local resources, attorneys, and support organizations"
                icon={<Users className="h-6 w-6 text-white" />}
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* What You'll Get */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              What You'll Receive
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ScrollReveal delay={0.1}>
              <BenefitCard
                icon={<ArrowRight className="h-6 w-6 text-white" />}
                title="Next Steps"
                description="Clear, actionable steps you should take based on your case stage and circumstances"
                bgColor="legal-blue"
              />
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <BenefitCard
                icon={<Clock className="h-6 w-6 text-white" />}
                title="Important Deadlines"
                description="Critical dates and timeframes you need to be aware of in your jurisdiction"
                bgColor="urgent-red"
              />
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <BenefitCard
                icon={<Shield className="h-6 w-6 text-white" />}
                title="Your Rights"
                description="Specific rights that apply to your situation and how to exercise them"
                bgColor="success-green"
              />
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <BenefitCard
                icon={<Users className="h-6 w-6 text-white" />}
                title="Local Resources"
                description="Public defenders, legal aid organizations, and support services in your area"
                bgColor="bg-purple-600"
              />
            </ScrollReveal>

            <ScrollReveal delay={0.5}>
              <BenefitCard
                icon={<AlertTriangle className="h-6 w-6 text-white" />}
                title="Important Warnings"
                description="Things to avoid and potential pitfalls specific to your situation"
                bgColor="bg-amber-500"
              />
            </ScrollReveal>

            <ScrollReveal delay={0.6}>
              <BenefitCard
                icon={<BookOpen className="h-6 w-6 text-white" />}
                title="Legal Information"
                description="Relevant laws, statutes, and precedents that apply to your case"
                bgColor="bg-indigo-600"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Privacy & Security */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Your Privacy is Protected
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                We take your privacy seriously. Here's how we protect your information.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ScrollReveal delay={0.1}>
              <PrivacyFeature
                icon={<Shield className="h-5 w-5 text-success-green" />}
                title="No Data Storage"
                description="Personal information is not saved to our servers"
              />
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <PrivacyFeature
                icon={<Clock className="h-5 w-5 text-success-green" />}
                title="Session-Only"
                description="Data exists only during your active session"
              />
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <PrivacyFeature
                icon={<FileText className="h-5 w-5 text-success-green" />}
                title="Auto-Delete"
                description="All information automatically deleted when you leave"
              />
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <PrivacyFeature
                icon={<Users className="h-5 w-5 text-success-green" />}
                title="Anonymous"
                description="No account required, completely anonymous usage"
              />
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.5}>
            <Alert className="mt-12 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                <strong className="font-semibold">Important:</strong> This tool provides general legal information and guidance only. It is not a substitute for professional legal advice. Always consult with a qualified attorney for advice specific to your case.
              </AlertDescription>
            </Alert>
          </ScrollReveal>

          <ScrollReveal delay={0.6}>
            <div className="text-center mt-12">
              <Button
                onClick={handleStartQA}
                className="legal-blue legal-blue-hover font-bold py-4 px-8 rounded-xl text-lg shadow-lg mr-4"
                data-testid="button-start-guidance-bottom"
              >
                Get Started Now
              </Button>
              <Link href="/rights-info">
                <Button 
                  variant="outline" 
                  className="font-bold py-4 px-8 rounded-xl text-lg"
                  data-testid="button-learn-rights"
                >
                  Learn About Your Rights First
                </Button>
              </Link>
            </div>
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

function StepCard({ number, title, description, icon }: {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="text-center hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="relative mb-4">
          <div className="w-12 h-12 legal-blue rounded-lg flex items-center justify-center mx-auto">
            {icon}
          </div>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-success-green text-white rounded-full flex items-center justify-center text-xs font-bold">
            {number}
          </div>
        </div>
        <h3 className="font-semibold text-foreground mb-3">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function BenefitCard({ icon, title, description, bgColor }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
}) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mb-4`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-3">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function PrivacyFeature({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-3">
        {icon}
      </div>
      <h4 className="font-semibold text-foreground mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}


