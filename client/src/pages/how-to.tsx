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
  ChevronRight,
  Briefcase,
  Bot,
  ClipboardList,
  CreditCard,
  Code,
  FileScan,
  Compass,
  Milestone,
  HeartPulse,
  Wallet,
  Gavel,
  Car,
  Baby
} from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const sections: CategorySection[] = [
    {
      title: t('howTo.sections.getHelp.title'),
      description: t('howTo.sections.getHelp.description'),
      resources: [
        {
          icon: <MessageSquare className="h-5 w-5" />,
          title: t('howTo.sections.getHelp.caseGuidance.title'),
          description: t('howTo.sections.getHelp.caseGuidance.description'),
          link: "/case-guidance"
        },
        {
          icon: <Bot className="h-5 w-5" />,
          title: t('howTo.sections.getHelp.aiChat.title'),
          description: t('howTo.sections.getHelp.aiChat.description'),
          link: "/chat"
        },
        {
          icon: <Globe className="h-5 w-5" />,
          title: t('howTo.sections.getHelp.immigrationRights.title'),
          description: t('howTo.sections.getHelp.immigrationRights.description'),
          link: "/immigration-guidance"
        },
        {
          icon: <FileScan className="h-5 w-5" />,
          title: t('howTo.sections.getHelp.documentSummarizer.title'),
          description: t('howTo.sections.getHelp.documentSummarizer.description'),
          link: "/document-summarizer"
        }
      ]
    },
    {
      title: t('howTo.sections.knowYourRights.title'),
      description: t('howTo.sections.knowYourRights.description'),
      resources: [
        {
          icon: <Shield className="h-5 w-5" />,
          title: t('howTo.sections.knowYourRights.constitutionalRights.title'),
          description: t('howTo.sections.knowYourRights.constitutionalRights.description'),
          link: "/rights-info"
        },
        {
          icon: <Milestone className="h-5 w-5" />,
          title: t('howTo.sections.knowYourRights.caseTimeline.title'),
          description: t('howTo.sections.knowYourRights.caseTimeline.description'),
          link: "/case-timeline"
        },
        {
          icon: <CreditCard className="h-5 w-5" />,
          title: t('howTo.sections.knowYourRights.quickReference.title'),
          description: t('howTo.sections.knowYourRights.quickReference.description'),
          link: "/quick-reference"
        },
        {
          icon: <Calendar className="h-5 w-5" />,
          title: t('howTo.sections.knowYourRights.criminalJusticeProcess.title'),
          description: t('howTo.sections.knowYourRights.criminalJusticeProcess.description'),
          link: "/process"
        },
        {
          icon: <Search className="h-5 w-5" />,
          title: t('howTo.sections.knowYourRights.searchSeizure.title'),
          description: t('howTo.sections.knowYourRights.searchSeizure.description'),
          link: "/search-seizure"
        },
        {
          icon: <Users className="h-5 w-5" />,
          title: t('howTo.sections.knowYourRights.friendsFamily.title'),
          description: t('howTo.sections.knowYourRights.friendsFamily.description'),
          link: "/friends-family"
        },
        {
          icon: <ClipboardList className="h-5 w-5" />,
          title: t('howTo.sections.knowYourRights.mockQA.title'),
          description: t('howTo.sections.knowYourRights.mockQA.description'),
          link: "/resources"
        }
      ]
    },
    {
      title: t('howTo.sections.findResources.title'),
      description: t('howTo.sections.findResources.description'),
      resources: [
        {
          icon: <Compass className="h-5 w-5" />,
          title: t('howTo.sections.findResources.resourcesHub.title'),
          description: t('howTo.sections.findResources.resourcesHub.description'),
          link: "/resources"
        },
        {
          icon: <MapPin className="h-5 w-5" />,
          title: t('howTo.sections.findResources.publicDefenders.title'),
          description: t('howTo.sections.findResources.publicDefenders.description'),
          link: "/"
        },
        {
          icon: <HelpCircle className="h-5 w-5" />,
          title: t('howTo.sections.findResources.legalAid.title'),
          description: t('howTo.sections.findResources.legalAid.description'),
          link: "/"
        },
        {
          icon: <Route className="h-5 w-5" />,
          title: t('howTo.sections.findResources.diversionPrograms.title'),
          description: t('howTo.sections.findResources.diversionPrograms.description'),
          link: "/diversion-programs"
        },
        {
          icon: <Eraser className="h-5 w-5" />,
          title: t('howTo.sections.findResources.recordExpungement.title'),
          description: t('howTo.sections.findResources.recordExpungement.description'),
          link: "/record-expungement"
        }
      ]
    },
    {
      title: t('howTo.sections.lifeSupport.title'),
      description: t('howTo.sections.lifeSupport.description'),
      resources: [
        {
          icon: <HeartPulse className="h-5 w-5" />,
          title: t('howTo.sections.lifeSupport.supportHub.title'),
          description: t('howTo.sections.lifeSupport.supportHub.description'),
          link: "/support"
        },
        {
          icon: <Briefcase className="h-5 w-5" />,
          title: t('howTo.sections.lifeSupport.employment.title'),
          description: t('howTo.sections.lifeSupport.employment.description'),
          link: "/support/employment"
        },
        {
          icon: <Wallet className="h-5 w-5" />,
          title: t('howTo.sections.lifeSupport.finances.title'),
          description: t('howTo.sections.lifeSupport.finances.description'),
          link: "/support/finances"
        },
        {
          icon: <Gavel className="h-5 w-5" />,
          title: t('howTo.sections.lifeSupport.courtLogistics.title'),
          description: t('howTo.sections.lifeSupport.courtLogistics.description'),
          link: "/support/court-logistics"
        },
        {
          icon: <HeartPulse className="h-5 w-5" />,
          title: t('howTo.sections.lifeSupport.mentalHealth.title'),
          description: t('howTo.sections.lifeSupport.mentalHealth.description'),
          link: "/support/mental-health"
        },
        {
          icon: <Car className="h-5 w-5" />,
          title: t('howTo.sections.lifeSupport.transportation.title'),
          description: t('howTo.sections.lifeSupport.transportation.description'),
          link: "/support/transportation"
        },
        {
          icon: <Baby className="h-5 w-5" />,
          title: t('howTo.sections.lifeSupport.childcare.title'),
          description: t('howTo.sections.lifeSupport.childcare.description'),
          link: "/support/childcare"
        }
      ]
    },
    {
      title: t('howTo.sections.reference.title'),
      description: t('howTo.sections.reference.description'),
      resources: [
        {
          icon: <Book className="h-5 w-5" />,
          title: t('howTo.sections.reference.legalGlossary.title'),
          description: t('howTo.sections.reference.legalGlossary.description'),
          link: "/legal-glossary"
        },
        {
          icon: <MapPin className="h-5 w-5" />,
          title: t('howTo.sections.reference.courtLocator.title'),
          description: t('howTo.sections.reference.courtLocator.description'),
          link: "/court-locator"
        },
        {
          icon: <Book className="h-5 w-5" />,
          title: t('howTo.sections.reference.statuteLookup.title'),
          description: t('howTo.sections.reference.statuteLookup.description'),
          link: "/statutes"
        },
        {
          icon: <FileText className="h-5 w-5" />,
          title: t('howTo.sections.reference.documentLibrary.title'),
          description: t('howTo.sections.reference.documentLibrary.description'),
          link: "/document-library"
        }
      ]
    },
    {
      title: t('howTo.sections.attorneyTools.title'),
      description: t('howTo.sections.attorneyTools.description'),
      resources: [
        {
          icon: <Briefcase className="h-5 w-5" />,
          title: t('howTo.sections.attorneyTools.attorneyPortal.title'),
          description: t('howTo.sections.attorneyTools.attorneyPortal.description'),
          link: "/attorney"
        },
        {
          icon: <FileText className="h-5 w-5" />,
          title: t('howTo.sections.attorneyTools.courtRecords.title'),
          description: t('howTo.sections.attorneyTools.courtRecords.description'),
          link: "/court-records"
        }
      ]
    },
    {
      title: t('howTo.sections.developersPartners.title'),
      description: t('howTo.sections.developersPartners.description'),
      resources: [
        {
          icon: <Code className="h-5 w-5" />,
          title: t('howTo.sections.developersPartners.apiDocs.title'),
          description: t('howTo.sections.developersPartners.apiDocs.description'),
          link: "/api-docs"
        },
        {
          icon: <Globe className="h-5 w-5" />,
          title: t('howTo.sections.developersPartners.widgets.title'),
          description: t('howTo.sections.developersPartners.widgets.description'),
          link: "/widgets"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="vivid-header-alt py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 vivid-header-content">
          <ScrollReveal>
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-white">
                {t('howTo.pageTitle')}
              </h1>
              <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto">
                {t('howTo.pageSubtitle')}
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
              <strong>{t('howTo.privacyLabel')}</strong> {t('howTo.privacyText')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
