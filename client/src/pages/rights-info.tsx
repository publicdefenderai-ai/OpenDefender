import { useState } from "react";
import { motion } from "framer-motion";
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
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";

import { PrivacyBanner } from "@/components/layout/privacy-banner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useLegalResources } from "@/hooks/use-legal-data";

export default function RightsInfo() {
  const [selectedJurisdiction, setSelectedJurisdiction] = useState("federal");
  const { data: resources, isLoading } = useLegalResources(selectedJurisdiction);

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
                Know Your Legal Rights
              </h1>
              <p className="text-xl text-blue-800 dark:text-blue-200 max-w-3xl mx-auto">
                Understanding your constitutional and legal rights is the first step in protecting yourself within the criminal justice system.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="flex justify-center">
              <Link href="/case-guidance">
                <Button 
                  className="success-green success-green-hover font-bold py-4 px-8 rounded-xl text-lg shadow-lg"
                  data-testid="button-get-personalized-guidance"
                >
                  Get Personalized Guidance
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Quick Rights Reference */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Essential Rights Everyone Should Know
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ScrollReveal delay={0.1}>
              <QuickRightCard
                icon={<Shield className="h-6 w-6 text-white" />}
                title="Right to Remain Silent"
                description="You don't have to answer questions beyond basic identification"
                bgColor="bg-blue-600"
              />
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <QuickRightCard
                icon={<Scale className="h-6 w-6 text-white" />}
                title="Right to an Attorney"
                description="Free legal representation if you cannot afford one"
                bgColor="bg-green-600"
              />
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <QuickRightCard
                icon={<Phone className="h-6 w-6 text-white" />}
                title="Right to a Phone Call"
                description="Contact family, attorney, or bail bondsman after arrest"
                bgColor="bg-blue-500"
              />
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <QuickRightCard
                icon={<UserCheck className="h-6 w-6 text-white" />}
                title="Right to Know Charges"
                description="Must be informed of accusations against you"
                bgColor="bg-purple-600"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Detailed Rights Information */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Your Constitutional Rights in Detail
            </h2>
          </ScrollReveal>

          <Tabs defaultValue="miranda" className="w-full">
            <ScrollReveal delay={0.1}>
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
                <TabsTrigger value="miranda" data-testid="tab-miranda">Miranda Rights</TabsTrigger>
                <TabsTrigger value="arrest" data-testid="tab-arrest">During Arrest</TabsTrigger>
                <TabsTrigger value="court" data-testid="tab-court">In Court</TabsTrigger>
                <TabsTrigger value="prison" data-testid="tab-prison">If Convicted</TabsTrigger>
              </TabsList>
            </ScrollReveal>

            <TabsContent value="miranda" id="miranda-rights">
              <ScrollReveal delay={0.2}>
                <MirandaRightsSection />
              </ScrollReveal>
            </TabsContent>

            <TabsContent value="arrest">
              <ScrollReveal delay={0.2}>
                <ArrestRightsSection />
              </ScrollReveal>
            </TabsContent>

            <TabsContent value="court">
              <ScrollReveal delay={0.2}>
                <CourtRightsSection />
              </ScrollReveal>
            </TabsContent>

            <TabsContent value="prison">
              <ScrollReveal delay={0.2}>
                <PrisonRightsSection />
              </ScrollReveal>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Court Process Timeline */}
      <section className="py-16 bg-background" id="criminal-justice-timeline">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Criminal Justice Process Timeline
            </h2>
          </ScrollReveal>

          <div className="space-y-8">
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

      {/* Legal Resources */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Legal Resources & Support
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ScrollReveal delay={0.1}>
              <ResourceCard
                icon={<Users className="h-6 w-6 text-white" />}
                title="Public Defenders"
                description="Free legal representation for those who qualify financially"
                contact="Contact your local public defender office"
                bgColor="legal-blue"
              />
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <ResourceCard
                icon={<HelpCircle className="h-6 w-6 text-white" />}
                title="Legal Aid Organizations"
                description="Non-profit organizations providing free or low-cost legal services"
                contact="Search local legal aid societies"
                bgColor="success-green"
              />
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <ResourceCard
                icon={<Phone className="h-6 w-6 text-white" />}
                title="Crisis Hotlines"
                description="24/7 support for legal emergencies and crisis situations"
                contact="National: 1-800-XXX-XXXX"
                bgColor="urgent-red"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Important Disclaimers */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                <strong className="font-semibold">Legal Disclaimer:</strong> This information is for educational purposes only and does not constitute legal advice. Laws vary by jurisdiction and change over time. Always consult with a qualified attorney for advice specific to your situation.
              </AlertDescription>
            </Alert>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="text-center mt-12">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Need Immediate Legal Help?
              </h3>
              <div className="space-x-4">
                <Button className="urgent-red urgent-red-hover font-bold py-3 px-6 rounded-lg">
                  Emergency Legal Aid
                </Button>
                <Link href="/case-guidance">
                  <Button className="legal-blue legal-blue-hover font-bold py-3 px-6 rounded-lg">
                    Get Case Guidance
                  </Button>
                </Link>
              </div>
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

function QuickRightCard({ icon, title, description, bgColor }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
}) {
  return (
    <Card className="text-center hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}>
          {icon}
        </div>
        <h3 className="font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function MirandaRightsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-primary" />
          <span>Miranda Rights</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold text-foreground mb-3">The Complete Miranda Warning:</h4>
          <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
            <p>"You have the right to remain silent."</p>
            <p>"Anything you say can and will be used against you in a court of law."</p>
            <p>"You have the right to an attorney."</p>
            <p>"If you cannot afford an attorney, one will be provided for you."</p>
            <p>"Do you understand the rights I have just read to you?"</p>
            <p>"With these rights in mind, do you wish to speak to me?"</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-3">When Miranda Rights Apply:</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>• When you are in police custody AND being interrogated</li>
            <li>• Not required for traffic stops or voluntary questioning</li>
            <li>• Must be given before custodial interrogation begins</li>
            <li>• You can invoke these rights at any time during questioning</li>
          </ul>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> If police fail to read Miranda rights, statements made during custodial interrogation may be inadmissible in court, but this doesn't automatically dismiss your case.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

function ArrestRightsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <UserCheck className="h-5 w-5 text-primary" />
          <span>Rights During Arrest</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-foreground mb-3">What You Should Do:</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Stay calm and don't resist arrest</li>
              <li>• Keep your hands visible</li>
              <li>• Exercise your right to remain silent</li>
              <li>• Ask for an attorney immediately</li>
              <li>• Remember details for your lawyer later</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-3">What You Should NOT Do:</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Don't run or resist physically</li>
              <li>• Don't argue with police</li>
              <li>• Don't consent to searches</li>
              <li>• Don't answer questions without a lawyer</li>
              <li>• Don't sign anything</li>
            </ul>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-3">Police Powers During Arrest:</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Can search you and immediate area for weapons/evidence</li>
            <li>• Can seize items in plain view</li>
            <li>• Can search your vehicle if arrested during traffic stop</li>
            <li>• Cannot search your phone without a warrant (in most cases)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function CourtRightsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Gavel className="h-5 w-5 text-primary" />
          <span>Rights in Court</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-foreground mb-3">Constitutional Rights:</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Right to a fair and speedy trial</li>
              <li>• Right to an impartial jury</li>
              <li>• Right to confront witnesses</li>
              <li>• Right to present a defense</li>
              <li>• Right to appeal conviction</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-3">Burden of Proof:</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Prosecution must prove guilt beyond reasonable doubt</li>
              <li>• You are presumed innocent until proven guilty</li>
              <li>• You don't have to prove your innocence</li>
              <li>• You have the right not to testify</li>
            </ul>
          </div>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Court Etiquette:</strong> Dress appropriately, arrive on time, stand when the judge enters, address the judge as "Your Honor," and let your attorney speak for you.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

function PrisonRightsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileX className="h-5 w-5 text-primary" />
          <span>Rights If Convicted</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold text-foreground mb-3">Continuing Rights:</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Right to appeal your conviction</li>
            <li>• Right to legal representation for appeal</li>
            <li>• Right to humane treatment in prison</li>
            <li>• Right to medical care</li>
            <li>• Right to practice religion</li>
            <li>• Right to communicate with family (with restrictions)</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-3">After Release:</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Possible probation or parole supervision</li>
            <li>• Potential employment restrictions</li>
            <li>• Loss of certain civil rights (voting, firearms)</li>
            <li>• Immigration consequences for non-citizens</li>
            <li>• Possible record expungement or sealing</li>
          </ul>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Collateral Consequences:</strong> Criminal convictions can affect employment, housing, professional licenses, student aid, and immigration status. Discuss these with your attorney.
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
