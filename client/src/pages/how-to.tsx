import { ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

interface ResourceItem {
  title: string;
  description: string;
  link: string;
}

interface CategorySection {
  title: string;
  description: string;
  resources: ResourceItem[];
}

function ResourceLink({ resource, index = 0 }: { resource: ResourceItem; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06, ease: "easeOut" }}
    >
      <Link href={resource.link}>
        <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/50 transition-all cursor-pointer group card-press">
          <div className="min-w-0">
            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
              {resource.title}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {resource.description}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-active:translate-x-1 transition-all flex-shrink-0 ml-3" />
        </div>
      </Link>
    </motion.div>
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
        { title: t('howTo.sections.getHelp.caseGuidance.title'), description: t('howTo.sections.getHelp.caseGuidance.description'), link: "/case-guidance" },
        { title: t('howTo.sections.getHelp.aiChat.title'), description: t('howTo.sections.getHelp.aiChat.description'), link: "/chat" },
        { title: t('howTo.sections.getHelp.immigrationRights.title'), description: t('howTo.sections.getHelp.immigrationRights.description'), link: "/immigration-guidance" },
        { title: t('howTo.sections.getHelp.documentSummarizer.title'), description: t('howTo.sections.getHelp.documentSummarizer.description'), link: "/document-summarizer" },
        { title: "Your First 24 Hours", description: "Step-by-step guide from arrest through your first court appearance", link: "/first-24-hours" },
        { title: "Jail Phone Call Guide", description: "What to say and what never to say on jail calls", link: "/jail-phone-call" },
      ]
    },
    {
      title: t('howTo.sections.knowYourRights.title'),
      description: t('howTo.sections.knowYourRights.description'),
      resources: [
        { title: t('howTo.sections.knowYourRights.constitutionalRights.title'), description: t('howTo.sections.knowYourRights.constitutionalRights.description'), link: "/rights-info" },
        { title: t('howTo.sections.knowYourRights.caseTimeline.title'), description: t('howTo.sections.knowYourRights.caseTimeline.description'), link: "/case-timeline" },
        { title: t('howTo.sections.knowYourRights.quickReference.title'), description: t('howTo.sections.knowYourRights.quickReference.description'), link: "/quick-reference" },
        { title: t('howTo.sections.knowYourRights.criminalJusticeProcess.title'), description: t('howTo.sections.knowYourRights.criminalJusticeProcess.description'), link: "/process" },
        { title: t('howTo.sections.knowYourRights.searchSeizure.title'), description: t('howTo.sections.knowYourRights.searchSeizure.description'), link: "/search-seizure" },
        { title: t('howTo.sections.knowYourRights.friendsFamily.title'), description: t('howTo.sections.knowYourRights.friendsFamily.description'), link: "/friends-family" },
        { title: t('howTo.sections.knowYourRights.mockQA.title'), description: t('howTo.sections.knowYourRights.mockQA.description'), link: "/resources" },
        { title: "Collateral Consequences", description: "Hidden consequences of a conviction beyond the sentence", link: "/collateral-consequences" },
      ]
    },
    {
      title: t('howTo.sections.findResources.title'),
      description: t('howTo.sections.findResources.description'),
      resources: [
        { title: t('howTo.sections.findResources.resourcesHub.title'), description: t('howTo.sections.findResources.resourcesHub.description'), link: "/resources" },
        { title: t('howTo.sections.findResources.publicDefenders.title'), description: t('howTo.sections.findResources.publicDefenders.description'), link: "/resources" },
        { title: t('howTo.sections.findResources.legalAid.title'), description: t('howTo.sections.findResources.legalAid.description'), link: "/resources" },
        { title: t('howTo.sections.findResources.diversionPrograms.title'), description: t('howTo.sections.findResources.diversionPrograms.description'), link: "/diversion-programs" },
        { title: t('howTo.sections.findResources.recordExpungement.title'), description: t('howTo.sections.findResources.recordExpungement.description'), link: "/record-expungement" },
      ]
    },
    {
      title: t('howTo.sections.lifeSupport.title'),
      description: t('howTo.sections.lifeSupport.description'),
      resources: [
        { title: t('howTo.sections.lifeSupport.supportHub.title'), description: t('howTo.sections.lifeSupport.supportHub.description'), link: "/support" },
        { title: t('howTo.sections.lifeSupport.employment.title'), description: t('howTo.sections.lifeSupport.employment.description'), link: "/support/employment" },
        { title: t('howTo.sections.lifeSupport.finances.title'), description: t('howTo.sections.lifeSupport.finances.description'), link: "/support/finances" },
        { title: t('howTo.sections.lifeSupport.courtLogistics.title'), description: t('howTo.sections.lifeSupport.courtLogistics.description'), link: "/support/court-logistics" },
        { title: t('howTo.sections.lifeSupport.mentalHealth.title'), description: t('howTo.sections.lifeSupport.mentalHealth.description'), link: "/support/mental-health" },
        { title: t('howTo.sections.lifeSupport.transportation.title'), description: t('howTo.sections.lifeSupport.transportation.description'), link: "/support/transportation" },
        { title: t('howTo.sections.lifeSupport.childcare.title'), description: t('howTo.sections.lifeSupport.childcare.description'), link: "/support/childcare" },
      ]
    },
    {
      title: t('howTo.sections.reference.title'),
      description: t('howTo.sections.reference.description'),
      resources: [
        { title: t('howTo.sections.reference.legalGlossary.title'), description: t('howTo.sections.reference.legalGlossary.description'), link: "/legal-glossary" },
        { title: t('howTo.sections.reference.courtLocator.title'), description: t('howTo.sections.reference.courtLocator.description'), link: "/court-locator" },
        { title: t('howTo.sections.reference.statuteLookup.title'), description: t('howTo.sections.reference.statuteLookup.description'), link: "/statutes" },
        { title: t('howTo.sections.reference.documentLibrary.title'), description: t('howTo.sections.reference.documentLibrary.description'), link: "/document-library" },
      ]
    },
    {
      title: t('howTo.sections.attorneyTools.title'),
      description: t('howTo.sections.attorneyTools.description'),
      resources: [
        { title: t('howTo.sections.attorneyTools.attorneyPortal.title'), description: t('howTo.sections.attorneyTools.attorneyPortal.description'), link: "/attorney" },
        { title: t('howTo.sections.attorneyTools.courtRecords.title'), description: t('howTo.sections.attorneyTools.courtRecords.description'), link: "/court-records" },
      ]
    },
    {
      title: t('howTo.sections.developersPartners.title'),
      description: t('howTo.sections.developersPartners.description'),
      resources: [
        { title: t('howTo.sections.developersPartners.apiDocs.title'), description: t('howTo.sections.developersPartners.apiDocs.description'), link: "/api-docs" },
        { title: t('howTo.sections.developersPartners.widgets.title'), description: t('howTo.sections.developersPartners.widgets.description'), link: "/widgets" },
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
                  {section.resources.map((resource, idx) => (
                    <ResourceLink key={resource.title} resource={resource} index={idx} />
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
