import { 
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
  Globe,
  HelpCircle,
  ChevronRight
} from "lucide-react";
import { Link } from "wouter";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

interface ResourceItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

interface CategorySection {
  title: string;
  description: string;
  resources: ResourceItem[];
}

const sections: CategorySection[] = [
  {
    title: "Get Help",
    description: "Start here if you need guidance on your situation",
    resources: [
      {
        icon: <MessageSquare className="h-5 w-5" />,
        title: "Personalized Case Guidance",
        description: "Get tailored legal guidance based on your charges and jurisdiction.",
        link: "/case-guidance"
      },
      {
        icon: <Globe className="h-5 w-5" />,
        title: "Immigration Rights",
        description: "Know your rights during ICE encounters and deportation proceedings.",
        link: "/immigration-guidance"
      }
    ]
  },
  {
    title: "Know Your Rights",
    description: "Understand your legal protections",
    resources: [
      {
        icon: <Shield className="h-5 w-5" />,
        title: "Constitutional Rights",
        description: "Miranda rights, rights during arrest, and in court.",
        link: "/rights-info"
      },
      {
        icon: <Calendar className="h-5 w-5" />,
        title: "Criminal Justice Process",
        description: "Timeline from arrest through sentencing.",
        link: "/process"
      },
      {
        icon: <Search className="h-5 w-5" />,
        title: "Search & Seizure Rights",
        description: "Fourth Amendment rights during police stops.",
        link: "/search-seizure"
      },
      {
        icon: <Users className="h-5 w-5" />,
        title: "Helping Friends & Family",
        description: "Support someone who has been arrested.",
        link: "/friends-family"
      }
    ]
  },
  {
    title: "Find Resources",
    description: "Connect with legal support services",
    resources: [
      {
        icon: <MapPin className="h-5 w-5" />,
        title: "Find Public Defenders",
        description: "Search by ZIP code for free legal representation.",
        link: "/"
      },
      {
        icon: <HelpCircle className="h-5 w-5" />,
        title: "Legal Aid Organizations",
        description: "Free or low-cost legal services in your area.",
        link: "/"
      },
      {
        icon: <Route className="h-5 w-5" />,
        title: "Diversion Programs",
        description: "Alternative sentencing options like drug courts.",
        link: "/diversion-programs"
      },
      {
        icon: <Eraser className="h-5 w-5" />,
        title: "Record Expungement",
        description: "Learn about sealing criminal records.",
        link: "/record-expungement"
      },
      {
        icon: <FileText className="h-5 w-5" />,
        title: "Court Records Search",
        description: "Search free federal court documents.",
        link: "/court-records"
      }
    ]
  },
  {
    title: "Reference",
    description: "Look up legal terms and locations",
    resources: [
      {
        icon: <Book className="h-5 w-5" />,
        title: "Legal Glossary",
        description: "Plain-language definitions of legal terms.",
        link: "/legal-glossary"
      },
      {
        icon: <MapPin className="h-5 w-5" />,
        title: "Court Locator",
        description: "Find court addresses and contact information.",
        link: "/court-locator"
      }
    ]
  }
];

function ResourceLink({ resource }: { resource: ResourceItem }) {
  return (
    <Link href={resource.link}>
      <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/50 transition-all cursor-pointer group">
        <div className="flex items-center gap-3 min-w-0">
          <div className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0">
            {resource.icon}
          </div>
          <div className="min-w-0">
            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
              {resource.title}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {resource.description}
            </p>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
      </div>
    </Link>
  );
}

export default function HowTo() {
  useScrollToTop();
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="vivid-header-alt py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 vivid-header-content">
          <ScrollReveal>
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-white">
                Navigate This Tool
              </h1>
              <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto">
                Find legal resources, understand your rights, and get the support you need
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-8 md:py-12 bg-background">
        <div className="max-w-3xl mx-auto px-4">
          {sections.map((section, sectionIndex) => (
            <ScrollReveal key={section.title} delay={sectionIndex * 0.1}>
              <div className="mb-8 md:mb-10">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </div>
                <div className="space-y-2">
                  {section.resources.map((resource) => (
                    <ResourceLink key={resource.title} resource={resource} />
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <Footer />

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
