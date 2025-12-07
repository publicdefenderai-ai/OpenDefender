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
}

const resources: ResourceCard[] = [
  {
    icon: <MessageSquare className="h-5 w-5" />,
    title: "Personalized Case Guidance",
    description: "Get tailored legal guidance, next steps, and resources based on your charges and jurisdiction.",
    link: "/case-guidance",
    category: "Get Help"
  },
  {
    icon: <Globe className="h-5 w-5" />,
    title: "Immigration Rights",
    description: "Know your rights during ICE encounters and deportation proceedings.",
    link: "/immigration-guidance",
    category: "Get Help"
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Constitutional Rights",
    description: "Learn about your Miranda rights, rights during arrest, and in court.",
    link: "/rights-info",
    category: "Legal Rights"
  },
  {
    icon: <Calendar className="h-5 w-5" />,
    title: "Criminal Justice Process",
    description: "Step-by-step timeline from arrest through sentencing and what to expect at each stage.",
    link: "/process",
    category: "Legal Rights"
  },
  {
    icon: <Search className="h-5 w-5" />,
    title: "Search & Seizure Rights",
    description: "Know your Fourth Amendment rights during police stops and searches.",
    link: "/search-seizure",
    category: "Legal Rights"
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Helping Friends/Family",
    description: "Support someone who has been arrested with practical guidance and resources.",
    link: "/friends-family",
    category: "Legal Rights"
  },
  {
    icon: <MapPin className="h-5 w-5" />,
    title: "Find Public Defenders",
    description: "Search by ZIP code to find public defender offices providing free legal representation.",
    link: "/",
    category: "Resources"
  },
  {
    icon: <HelpCircle className="h-5 w-5" />,
    title: "Legal Aid Organizations",
    description: "Find free or low-cost legal services and immigration support in your area.",
    link: "/",
    category: "Resources"
  },
  {
    icon: <Route className="h-5 w-5" />,
    title: "Diversion Programs",
    description: "Explore alternative sentencing options like drug courts and treatment programs.",
    link: "/diversion-programs",
    category: "Resources"
  },
  {
    icon: <Eraser className="h-5 w-5" />,
    title: "Record Expungement",
    description: "Learn about sealing or expunging criminal records in your state.",
    link: "/record-expungement",
    category: "Resources"
  },
  {
    icon: <FileText className="h-5 w-5" />,
    title: "Court Records Search",
    description: "Search free federal court documents and case law without PACER fees.",
    link: "/court-records",
    category: "Resources"
  },
  {
    icon: <Book className="h-5 w-5" />,
    title: "Legal Glossary",
    description: "Plain-language definitions of legal terms and court procedures.",
    link: "/legal-glossary",
    category: "Reference"
  },
  {
    icon: <MapPin className="h-5 w-5" />,
    title: "Court Locator",
    description: "Find court addresses, hours, and contact information by jurisdiction.",
    link: "/court-locator",
    category: "Reference"
  }
];

const categories = ["Get Help", "Legal Rights", "Resources", "Reference"];

function ResourceCardComponent({ resource }: { resource: ResourceCard }) {
  return (
    <Link href={resource.link}>
      <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer group border hover:border-primary/30">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center flex-shrink-0 text-primary ring-1 ring-primary/20 group-hover:ring-primary/40 transition-all">
              {resource.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
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
      <section className="vivid-header-alt py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 vivid-header-content">
          <ScrollReveal>
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 text-white">
                Navigating This Tool
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto px-2">
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
