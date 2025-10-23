import { motion } from "framer-motion";
import { 
  BookOpen, 
  MessageSquare, 
  Shield, 
  Calendar, 
  MapPin, 
  Search, 
  Users, 
  FileText, 
  Route, 
  Eraser,
  Book,
  Home,
  Smartphone,
  AlertTriangle,
  Globe,
  Lightbulb,
  HelpCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

import { PrivacyBanner } from "@/components/layout/privacy-banner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

interface ResourceCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  category: string;
  iconBgColor: string;
}

const resources: ResourceCard[] = [
  {
    icon: <MessageSquare className="h-6 w-6 text-white" />,
    title: "Personalized Case Guidance",
    description: "Answer a few questions to receive tailored legal guidance, next steps, and resources specific to your situation. Includes charge information, jurisdiction-specific laws, and recommended actions.",
    link: "/case-guidance",
    category: "Get Help",
    iconBgColor: "bg-blue-600"
  },
  {
    icon: <Globe className="h-6 w-6 text-white" />,
    title: "Immigration Enforcement Rights",
    description: "Know your rights during ICE encounters and deportation proceedings. Includes guidance for both citizens and non-citizens, information about detention facilities, and how to find immigration attorneys.",
    link: "/immigration-guidance",
    category: "Get Help",
    iconBgColor: "bg-amber-600"
  },
  {
    icon: <Shield className="h-6 w-6 text-white" />,
    title: "Constitutional Rights",
    description: "Comprehensive guide to your Miranda rights, rights during arrest, in court, and if convicted. Includes detailed explanations of the Fifth and Sixth Amendments.",
    link: "/rights-info",
    category: "Legal Rights",
    iconBgColor: "bg-blue-500"
  },
  {
    icon: <Calendar className="h-6 w-6 text-white" />,
    title: "Criminal Justice Process",
    description: "Step-by-step timeline from arrest through sentencing. Learn what to expect at each stage including booking, arraignment, preliminary hearing, discovery, and trial. Understand your rights at every step.",
    link: "/process",
    category: "Legal Rights",
    iconBgColor: "bg-green-600"
  },
  {
    icon: <Search className="h-6 w-6 text-white" />,
    title: "Search and Seizure Rights",
    description: "Know your Fourth Amendment rights during police stops, vehicle searches, home searches, and phone searches. Learn when you can refuse consent and how to protect your rights.",
    link: "/search-seizure",
    category: "Legal Rights",
    iconBgColor: "bg-purple-600"
  },
  {
    icon: <Users className="h-6 w-6 text-white" />,
    title: "Helping Arrested Friends/Family",
    description: "Practical guide for supporting someone who has been arrested. Covers finding detention facilities, securing legal representation, understanding bail, and providing ongoing support.",
    link: "/friends-family",
    category: "Legal Rights",
    iconBgColor: "bg-indigo-600"
  },
  {
    icon: <MapPin className="h-6 w-6 text-white" />,
    title: "Find Public Defenders",
    description: "Search for public defender offices near you by ZIP code. Get contact information, office hours, and directions to local offices providing free legal representation.",
    link: "/",
    category: "Resources",
    iconBgColor: "bg-blue-600"
  },
  {
    icon: <HelpCircle className="h-6 w-6 text-white" />,
    title: "Legal Aid Organizations",
    description: "Find free or low-cost legal services in your area. Search our database of immigration legal services and civil legal aid organizations by ZIP code. Includes organizations from EOIR and Legal Services Corporation.",
    link: "/",
    category: "Resources",
    iconBgColor: "bg-green-600"
  },
  {
    icon: <Route className="h-6 w-6 text-white" />,
    title: "Diversion Programs",
    description: "Explore alternative sentencing options including drug courts, mental health courts, veteran's courts, community service programs, and treatment-based alternatives to incarceration.",
    link: "/diversion-programs",
    category: "Resources",
    iconBgColor: "bg-green-500"
  },
  {
    icon: <Eraser className="h-6 w-6 text-white" />,
    title: "Record Expungement",
    description: "Learn about sealing or expunging criminal records. Includes eligibility requirements by state, step-by-step process, waiting periods, and resources for getting help with petitions.",
    link: "/record-expungement",
    category: "Resources",
    iconBgColor: "bg-indigo-600"
  },
  {
    icon: <FileText className="h-6 w-6 text-white" />,
    title: "Court Records Search",
    description: "Search federal court filings and case law through the RECAP Archive and CourtListener database. Access free court documents and legal opinions without PACER fees.",
    link: "/court-records",
    category: "Resources",
    iconBgColor: "bg-blue-500"
  },
  {
    icon: <Book className="h-6 w-6 text-white" />,
    title: "Legal Glossary",
    description: "Plain-language definitions of common legal terms, court procedures, and legal jargon. Searchable database to help you understand legal documents and proceedings.",
    link: "/legal-glossary",
    category: "Reference",
    iconBgColor: "bg-purple-500"
  },
  {
    icon: <MapPin className="h-6 w-6 text-white" />,
    title: "Court Locator",
    description: "Find court addresses, phone numbers, hours, bail schedules, and local procedures by jurisdiction. Includes links to court websites and public information.",
    link: "/court-locator",
    category: "Reference",
    iconBgColor: "bg-blue-400"
  }
];

const categories = ["Get Help", "Legal Rights", "Resources", "Reference"];

function ResourceCardComponent({ resource }: { resource: ResourceCard }) {
  return (
    <Link href={resource.link}>
      <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 ${resource.iconBgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0`}>
              {resource.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                  {resource.title}
                </CardTitle>
                <Badge variant="outline" className="text-xs flex-shrink-0">
                  {resource.category}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {resource.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function HowTo() {
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
                <Lightbulb className="inline h-10 w-10 mr-2 mb-2" />
                Navigating This Tool
              </h1>
              <p className="text-xl text-blue-800 dark:text-blue-200 max-w-3xl mx-auto">
                Explore all the legal resources, guidance tools, and information available to help you understand and navigate the criminal justice system
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Overview */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-6">What This Platform Offers</h2>
              <p className="text-lg text-muted-foreground">
                Public Defender AI provides free, accessible legal information to help you understand your rights, navigate court processes, and find the support you need. All resources are backed by real legal data and designed with privacy in mind.
              </p>
            </div>
          </ScrollReveal>

          {/* Resources by Category */}
          {categories.map((category, categoryIndex) => {
            const categoryResources = resources.filter(r => r.category === category);
            
            return (
              <div key={category} className="mb-16">
                <ScrollReveal delay={categoryIndex * 0.1}>
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    {category === "Get Help" && <AlertTriangle className="h-6 w-6 mr-2 text-red-600" />}
                    {category === "Legal Rights" && <Shield className="h-6 w-6 mr-2 text-blue-600" />}
                    {category === "Resources" && <Users className="h-6 w-6 mr-2 text-green-600" />}
                    {category === "Reference" && <Book className="h-6 w-6 mr-2 text-purple-600" />}
                    {category}
                  </h2>
                </ScrollReveal>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryResources.map((resource, index) => (
                    <ScrollReveal key={resource.title} delay={(categoryIndex * 0.1) + (index * 0.05)}>
                      <ResourceCardComponent resource={resource} />
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center mb-12">
              Key Features
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-4 gap-6">
            <ScrollReveal delay={0.1}>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Privacy Protected</h3>
                  <p className="text-sm text-muted-foreground">
                    No personal data stored. All session information automatically deleted.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Real Legal Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Powered by federal court records, state statutes, and official legal databases.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Location-Based</h3>
                  <p className="text-sm text-muted-foreground">
                    Find local resources, courts, and legal aid organizations near you.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Plain Language</h3>
                  <p className="text-sm text-muted-foreground">
                    Complex legal concepts explained in everyday language you can understand.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* How to Get Started */}
      <section className="py-16 bg-background">
        <div className="max-w-5xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center mb-12">
              How to Get Started
            </h2>
          </ScrollReveal>

          <div className="space-y-6">
            <ScrollReveal delay={0.1}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Urgent Help?</h3>
                      <p className="text-muted-foreground">
                        If you're being arrested or in court right now, click the "Urgent Help Needed" button on the home page for immediate information about your rights.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Need Case-Specific Guidance?</h3>
                      <p className="text-muted-foreground">
                        Use the "Get Started" menu and select "Get Guidance For My Case" to answer questions about your specific situation and receive personalized recommendations.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Learning About Your Rights?</h3>
                      <p className="text-muted-foreground">
                        Explore the "Legal Rights Info" section from the Get Started menu to learn about constitutional rights, court processes, and search and seizure protections.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Looking for Legal Help?</h3>
                      <p className="text-muted-foreground">
                        Use "Legal Aid Resources & Support" from the Get Started menu to find public defenders, legal aid organizations, diversion programs, and expungement resources near you.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
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
