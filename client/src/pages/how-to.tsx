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
    description: "Get tailored legal guidance, next steps, and resources based on your charges and jurisdiction.",
    link: "/case-guidance",
    category: "Get Help",
    iconBgColor: "bg-blue-600"
  },
  {
    icon: <Globe className="h-6 w-6 text-white" />,
    title: "Immigration Rights",
    description: "Know your rights during ICE encounters and deportation proceedings.",
    link: "/immigration-guidance",
    category: "Get Help",
    iconBgColor: "bg-amber-600"
  },
  {
    icon: <Shield className="h-6 w-6 text-white" />,
    title: "Constitutional Rights",
    description: "Learn about your Miranda rights, rights during arrest, and in court.",
    link: "/rights-info",
    category: "Legal Rights",
    iconBgColor: "bg-blue-500"
  },
  {
    icon: <Calendar className="h-6 w-6 text-white" />,
    title: "Criminal Justice Process",
    description: "Step-by-step timeline from arrest through sentencing and what to expect at each stage.",
    link: "/process",
    category: "Legal Rights",
    iconBgColor: "bg-green-600"
  },
  {
    icon: <Search className="h-6 w-6 text-white" />,
    title: "Search & Seizure Rights",
    description: "Know your Fourth Amendment rights during police stops and searches.",
    link: "/search-seizure",
    category: "Legal Rights",
    iconBgColor: "bg-purple-600"
  },
  {
    icon: <Users className="h-6 w-6 text-white" />,
    title: "Helping Friends/Family",
    description: "Support someone who has been arrested with practical guidance and resources.",
    link: "/friends-family",
    category: "Legal Rights",
    iconBgColor: "bg-indigo-600"
  },
  {
    icon: <MapPin className="h-6 w-6 text-white" />,
    title: "Find Public Defenders",
    description: "Search by ZIP code to find public defender offices providing free legal representation.",
    link: "/",
    category: "Resources",
    iconBgColor: "bg-blue-600"
  },
  {
    icon: <HelpCircle className="h-6 w-6 text-white" />,
    title: "Legal Aid Organizations",
    description: "Find free or low-cost legal services and immigration support in your area.",
    link: "/",
    category: "Resources",
    iconBgColor: "bg-green-600"
  },
  {
    icon: <Route className="h-6 w-6 text-white" />,
    title: "Diversion Programs",
    description: "Explore alternative sentencing options like drug courts and treatment programs.",
    link: "/diversion-programs",
    category: "Resources",
    iconBgColor: "bg-green-500"
  },
  {
    icon: <Eraser className="h-6 w-6 text-white" />,
    title: "Record Expungement",
    description: "Learn about sealing or expunging criminal records in your state.",
    link: "/record-expungement",
    category: "Resources",
    iconBgColor: "bg-indigo-600"
  },
  {
    icon: <FileText className="h-6 w-6 text-white" />,
    title: "Court Records Search",
    description: "Search free federal court documents and case law without PACER fees.",
    link: "/court-records",
    category: "Resources",
    iconBgColor: "bg-blue-500"
  },
  {
    icon: <Book className="h-6 w-6 text-white" />,
    title: "Legal Glossary",
    description: "Plain-language definitions of legal terms and court procedures.",
    link: "/legal-glossary",
    category: "Reference",
    iconBgColor: "bg-purple-500"
  },
  {
    icon: <MapPin className="h-6 w-6 text-white" />,
    title: "Court Locator",
    description: "Find court addresses, hours, and contact information by jurisdiction.",
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
      <Header />

      {/* Hero Section */}
      <section className="gradient-hero text-white py-10 md:py-14 lg:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-blue-600">
                <Lightbulb className="inline h-7 w-7 md:h-10 md:w-10 mr-2 mb-1 md:mb-2" />
                Navigating This Tool
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-blue-800 dark:text-blue-200 max-w-3xl mx-auto px-2">
                Explore all the legal resources, guidance tools, and information available to help you understand and navigate the criminal justice system
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Overview */}
      <section className="py-10 md:py-14 lg:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14 lg:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold mb-4 md:mb-6">What This Platform Offers</h2>
              <p className="text-base md:text-lg text-muted-foreground px-2">
                Public Defender AI provides free, accessible legal information to help you understand your rights, navigate court processes, and find the support you need. All resources are backed by real legal data and designed with privacy in mind.
              </p>
            </div>
          </ScrollReveal>

          {/* Resources by Category */}
          {categories.map((category, categoryIndex) => {
            const categoryResources = resources.filter(r => r.category === category);
            
            return (
              <div key={category} className="mb-10 md:mb-14 lg:mb-16">
                <ScrollReveal delay={categoryIndex * 0.1}>
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 md:mb-6 flex items-center">
                    {category === "Get Help" && <AlertTriangle className="h-6 w-6 mr-2 text-red-600" />}
                    {category === "Legal Rights" && <Shield className="h-6 w-6 mr-2 text-blue-600" />}
                    {category === "Resources" && <Users className="h-6 w-6 mr-2 text-green-600" />}
                    {category === "Reference" && <Book className="h-6 w-6 mr-2 text-purple-600" />}
                    {category}
                  </h2>
                </ScrollReveal>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
