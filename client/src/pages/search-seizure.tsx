import { motion } from "framer-motion";
import { Search, Home, Car, User, Smartphone, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { PrivacyBanner } from "@/components/layout/privacy-banner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

interface RightsScenario {
  icon: React.ReactNode;
  title: string;
  description: string;
  yourRights: string[];
  whatToDo: string[];
  whatNotToDo: string[];
  iconBgColor: string;
}

const scenarios: RightsScenario[] = [
  {
    icon: <User className="h-6 w-6 text-white" />,
    title: "Stop and Frisk",
    description: "When police stop you on the street and pat you down for weapons",
    iconBgColor: "bg-blue-600",
    yourRights: [
      "You can ask if you're free to leave",
      "You can refuse to answer questions beyond basic identification",
      "Officer needs reasonable suspicion to stop you",
      "Pat-down limited to weapons unless plain-view evidence found"
    ],
    whatToDo: [
      "Stay calm and keep hands visible",
      "Ask 'Am I free to go?'",
      "State clearly: 'I do not consent to this search'",
      "Remember the officer's name and badge number",
      "Note any witnesses present"
    ],
    whatNotToDo: [
      "Don't resist physically",
      "Don't run away",
      "Don't put hands in pockets",
      "Don't make sudden movements",
      "Don't consent to searches beyond what's legally required"
    ]
  },
  {
    icon: <Car className="h-6 w-6 text-white" />,
    title: "Vehicle Search",
    description: "When police want to search your car during a traffic stop",
    iconBgColor: "bg-green-600",
    yourRights: [
      "Police need probable cause or your consent to search",
      "You can refuse consent to search the vehicle",
      "Officer can see items in plain view",
      "If arrested, your car can be searched without warrant"
    ],
    whatToDo: [
      "Pull over safely when signaled",
      "Keep hands on steering wheel",
      "Provide license, registration, and insurance when asked",
      "Clearly state: 'I do not consent to a search'",
      "Ask if you're free to go"
    ],
    whatNotToDo: [
      "Don't exit vehicle unless instructed",
      "Don't reach for documents until asked",
      "Don't consent to searches",
      "Don't volunteer information",
      "Don't argue or become confrontational"
    ]
  },
  {
    icon: <Home className="h-6 w-6 text-white" />,
    title: "Home Search",
    description: "When law enforcement wants to enter or search your dwelling",
    iconBgColor: "bg-purple-600",
    yourRights: [
      "Police generally need a warrant to enter your home",
      "You can refuse entry without a warrant",
      "Warrant must describe specific areas to be searched",
      "You have right to see the warrant before allowing entry",
      "Emergency situations (exigent circumstances) may allow warrantless entry"
    ],
    whatToDo: [
      "Ask to see the warrant before opening door",
      "Read the warrant carefully",
      "Step outside and close door behind you to speak with officers",
      "Clearly state: 'I do not consent to a search'",
      "Ask for a lawyer immediately if they insist on searching",
      "Take notes or photos of damage if search occurs"
    ],
    whatNotToDo: [
      "Don't open the door fully",
      "Don't let officers in without seeing a warrant",
      "Don't physically resist",
      "Don't interfere with the search",
      "Don't answer questions beyond identifying yourself"
    ]
  },
  {
    icon: <Shield className="h-6 w-6 text-white" />,
    title: "Search of Your Person",
    description: "When police want to conduct a body search",
    iconBgColor: "bg-red-600",
    yourRights: [
      "Police need reasonable suspicion for pat-down",
      "Full body search requires probable cause or arrest",
      "Strip searches require warrant or serious circumstances",
      "You can state you don't consent",
      "Right to privacy protections under 4th Amendment"
    ],
    whatToDo: [
      "Keep hands visible at all times",
      "Clearly state: 'I do not consent to this search'",
      "Ask what the search is for",
      "Remain calm and cooperative despite objection",
      "Document what happened immediately after"
    ],
    whatNotToDo: [
      "Don't physically resist",
      "Don't reach into your own pockets",
      "Don't make sudden movements",
      "Don't touch the officer",
      "Don't run or attempt to flee"
    ]
  },
  {
    icon: <Smartphone className="h-6 w-6 text-white" />,
    title: "Phone Search",
    description: "When police ask to see or unlock your phone",
    iconBgColor: "bg-indigo-600",
    yourRights: [
      "Police generally need a warrant to search your phone",
      "You can refuse to unlock your phone",
      "Fifth Amendment protects against self-incrimination",
      "Biometric unlock (Face ID, fingerprint) has less protection than passcode",
      "Police cannot force you to provide a passcode"
    ],
    whatToDo: [
      "Clearly state: 'I do not consent to a search of my phone'",
      "Ask if they have a warrant",
      "Request to speak with an attorney",
      "Keep phone locked and password-protected",
      "Consider disabling biometric unlock in sensitive situations"
    ],
    whatNotToDo: [
      "Don't unlock your phone for police",
      "Don't provide your passcode",
      "Don't let them use your biometrics to unlock",
      "Don't let officers look through your phone 'just to prove' something",
      "Don't delete anything (potential obstruction of justice)"
    ]
  }
];

function ScenarioCard({ scenario }: { scenario: RightsScenario }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader>
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${scenario.iconBgColor} rounded-lg flex items-center justify-center`}>
                  {scenario.icon}
                </div>
                <div className="text-left">
                  <CardTitle>{scenario.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{scenario.description}</p>
                </div>
              </div>
              {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Your Rights */}
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Your Rights:
              </h4>
              <ul className="space-y-2">
                {scenario.yourRights.map((right, index) => (
                  <li key={index} className="text-sm text-blue-800 dark:text-blue-200 flex items-start">
                    <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    {right}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* What to Do */}
              <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">
                  ✓ What to Do:
                </h4>
                <ul className="space-y-2">
                  {scenario.whatToDo.map((action, index) => (
                    <li key={index} className="text-sm text-green-800 dark:text-green-200">
                      • {action}
                    </li>
                  ))}
                </ul>
              </div>

              {/* What NOT to Do */}
              <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
                <h4 className="font-semibold text-red-900 dark:text-red-100 mb-3">
                  ✗ What NOT to Do:
                </h4>
                <ul className="space-y-2">
                  {scenario.whatNotToDo.map((action, index) => (
                    <li key={index} className="text-sm text-red-800 dark:text-red-200">
                      • {action}
                    </li>
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

export default function SearchSeizure() {
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
                <Search className="inline h-10 w-10 mr-2 mb-2" />
                Search and Seizure Rights
              </h1>
              <p className="text-xl text-blue-800 dark:text-blue-200 max-w-3xl mx-auto">
                Know your Fourth Amendment rights during police stops, searches, and seizures
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* General Guidance */}
      <section className="py-16 bg-background">
        <div className="max-w-5xl mx-auto px-4">
          <ScrollReveal>
            <Alert className="mb-12 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700">
              <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                <strong>Key Principle:</strong> The Fourth Amendment protects you against unreasonable searches and seizures. Police generally need a warrant or your consent, unless specific exceptions apply (emergencies, plain view, etc.). You have the right to refuse consent, even if it doesn't stop the search.
              </AlertDescription>
            </Alert>
          </ScrollReveal>

          {/* General Behavior Tips */}
          <ScrollReveal delay={0.1}>
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              General Guidelines for Police Interactions
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <ScrollReveal delay={0.2}>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3 text-green-600">Stay Calm</h3>
                  <p className="text-sm text-muted-foreground">
                    Remain polite and calm, even if you believe your rights are being violated. Arguments escalate situations and can be used against you.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3 text-blue-600">Assert Your Rights</h3>
                  <p className="text-sm text-muted-foreground">
                    Clearly state "I do not consent to this search" and "I want to speak to an attorney." Silence alone may not be enough.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3 text-purple-600">Document Everything</h3>
                  <p className="text-sm text-muted-foreground">
                    Remember badge numbers, officer names, and witness information. Write down what happened as soon as possible.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.5}>
            <h2 className="text-3xl font-bold text-center text-foreground mb-8">
              Common Search Scenarios
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
              Click on each scenario to learn your rights and how to protect them
            </p>
          </ScrollReveal>

          <div className="space-y-4">
            {scenarios.map((scenario, index) => (
              <ScrollReveal key={scenario.title} delay={index * 0.1}>
                <ScenarioCard scenario={scenario} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Disclaimer */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4">
          <ScrollReveal>
            <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                <strong>Legal Disclaimer:</strong> This information is for educational purposes only and does not constitute legal advice. Laws and enforcement practices vary by jurisdiction. Always consult with a qualified attorney for advice specific to your situation.
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
