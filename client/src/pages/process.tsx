import { motion } from "framer-motion";
import { Calendar, Clock, Shield, Scale, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { PrivacyBanner } from "@/components/layout/privacy-banner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

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
  },
  {
    title: "Sentencing",
    description: "If convicted, the court determines the appropriate punishment.",
    timeframe: "2-6 weeks after trial",
    rights: [
      "Right to speak at sentencing",
      "Right to appeal",
      "Right to fair and proportional punishment"
    ]
  }
];

function ProcessStep({ number, title, description, timeframe, rights, isLast }: {
  number: number;
  title: string;
  description: string;
  timeframe: string;
  rights: string[];
  isLast?: boolean;
}) {
  return (
    <div className="relative">
      <div className="flex items-start gap-6">
        {/* Timeline Marker */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-10">
            {number}
          </div>
          {!isLast && (
            <div className="w-1 flex-1 bg-blue-300 dark:bg-blue-800 min-h-[100px] mt-4"></div>
          )}
        </div>

        {/* Content Card */}
        <div className="flex-1 pb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{title}</span>
                <Badge variant="secondary" className="ml-4">
                  <Clock className="h-3 w-3 mr-1" />
                  {timeframe}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{description}</p>
              
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Your Rights at This Stage:
                </h4>
                <ul className="space-y-1">
                  {rights.map((right, index) => (
                    <li key={index} className="text-sm text-blue-800 dark:text-blue-200">
                      • {right}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function Process() {
  useScrollToTop();
  return (
    <div className="min-h-screen bg-background">
      <PrivacyBanner />
      <Header />

      {/* Hero Section */}
      <section className="gradient-hero text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-600">
                <Calendar className="inline h-10 w-10 mr-2 mb-2" />
                Criminal Justice Process Timeline
              </h1>
              <p className="text-xl text-blue-800 dark:text-blue-200 max-w-3xl mx-auto">
                Step-by-step guide through arrest, arraignment, trial, and sentencing procedures
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-16 bg-background">
        <div className="max-w-5xl mx-auto px-4">
          <ScrollReveal>
            <Alert className="mb-12 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700">
              <Scale className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                <strong>Important:</strong> The exact timeline and procedures can vary significantly by jurisdiction and case complexity. Always consult with a qualified attorney for guidance specific to your situation.
              </AlertDescription>
            </Alert>
          </ScrollReveal>

          <div className="space-y-0">
            {processSteps.map((step, index) => (
              <ScrollReveal key={step.title} delay={index * 0.1}>
                <ProcessStep
                  number={index + 1}
                  title={step.title}
                  description={step.description}
                  timeframe={step.timeframe}
                  rights={step.rights}
                  isLast={index === processSteps.length - 1}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center text-foreground mb-8">
              Important Notes
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6">
            <ScrollReveal delay={0.1}>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <Shield className="h-5 w-5 text-blue-600 mr-2" />
                    Plea Bargains
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Most criminal cases (about 90-95%) are resolved through plea bargains rather than going to trial. This happens during the discovery phase when prosecutors and defense attorneys negotiate reduced charges or sentencing in exchange for a guilty plea.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3 flex items-center">
                    <Clock className="h-5 w-5 text-green-600 mr-2" />
                    Speedy Trial Rights
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    The Sixth Amendment guarantees your right to a speedy trial. Federal cases must typically begin within 70 days of indictment or first appearance. State requirements vary, often ranging from 60 to 180 days.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.3}>
            <Alert className="mt-8 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                <strong>Legal Disclaimer:</strong> This information is for educational purposes only and does not constitute legal advice. Laws and procedures vary by state and federal jurisdiction. Always consult with a qualified attorney for advice specific to your situation.
              </AlertDescription>
            </Alert>
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
