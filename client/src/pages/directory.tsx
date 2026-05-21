import { ChevronRight, MessageSquare, Scale, Users, Heart, BookOpen, FileText, Shield } from "lucide-react";
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
  icon: React.ElementType;
  accent: string;
  accentBg: string;
  title: string;
  description: string;
  resources: ResourceItem[];
}

function ResourceLink({ resource, index = 0 }: { resource: ResourceItem; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05, ease: "easeOut" }}
    >
      <Link href={resource.link}>
        <div className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/50 transition-all cursor-pointer group card-press">
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
              {resource.title}
            </h3>
            <p className="text-xs text-muted-foreground truncate mt-0.5">{resource.description}</p>
          </div>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-active:translate-x-1 transition-all flex-shrink-0 ml-3" />
        </div>
      </Link>
    </motion.div>
  );
}

function InventoryCategory({ cat, idx }: { cat: CategorySection; idx: number }) {
  return (
    <ScrollReveal delay={idx * 0.05}>
      <div className="bg-background rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border" style={{ background: cat.accentBg }}>
          <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0" style={{ background: cat.accent }}>
            <cat.icon className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold" style={{ color: cat.accent }}>{cat.title}</div>
            <div className="text-[10px] text-muted-foreground">{cat.description}</div>
          </div>
        </div>
        <div className="p-3 space-y-1">
          {cat.resources.map((r, i) => (
            <ResourceLink key={r.title} resource={r} index={i} />
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}

export default function Directory() {
  useScrollToTop();
  const { t } = useTranslation();

  const inventoryCategories: CategorySection[] = [
    {
      icon: MessageSquare, accent: "#0f766e", accentBg: "#eef9f8",
      title: t("howTo.sections.getHelp.title"),
      description: t("howTo.sections.getHelp.description"),
      resources: [
        { title: t("howTo.sections.getHelp.caseGuidance.title"), description: t("howTo.sections.getHelp.caseGuidance.description"), link: "/case-guidance" },
        { title: t("howTo.sections.getHelp.aiChat.title"), description: t("howTo.sections.getHelp.aiChat.description"), link: "/chat" },
        { title: t("howTo.sections.getHelp.documentSummarizer.title"), description: t("howTo.sections.getHelp.documentSummarizer.description"), link: "/document-summarizer" },
        { title: t("howTo.sections.getHelp.letterGenerator.title"), description: t("howTo.sections.getHelp.letterGenerator.description"), link: "/letter-generator" },
        { title: t("howTo.sections.getHelp.first24Hours.title"), description: t("howTo.sections.getHelp.first24Hours.description"), link: "/first-24-hours" },
      ],
    },
    {
      icon: Scale, accent: "#1e3a5f", accentBg: "#eef2f8",
      title: t("howTo.sections.knowYourRights.title"),
      description: t("howTo.sections.knowYourRights.description"),
      resources: [
        { title: t("howTo.sections.knowYourRights.constitutionalRights.title"), description: t("howTo.sections.knowYourRights.constitutionalRights.description"), link: "/rights-info" },
        { title: t("howTo.rightToCounsel"), description: t("howTo.rightToCounselDesc"), link: "/right-to-counsel" },
        { title: t("howTo.warrants"), description: t("howTo.warrantsDesc"), link: "/warrants" },
        { title: t("howTo.sections.knowYourRights.caseTimeline.title"), description: t("howTo.sections.knowYourRights.caseTimeline.description"), link: "/case-timeline" },
        { title: t("howTo.sections.knowYourRights.friendsFamily.title"), description: t("howTo.sections.knowYourRights.friendsFamily.description"), link: "/friends-family" },
        { title: t("howTo.collateralConsequences"), description: t("howTo.collateralConsequencesDesc"), link: "/support/reputation" },
        { title: t("howTo.sections.knowYourRights.mockQA.title"), description: t("howTo.sections.knowYourRights.mockQA.description"), link: "/resources" },
      ],
    },
    {
      icon: Users, accent: "#5b21b6", accentBg: "#f3effe",
      title: t("howTo.sections.findResources.title"),
      description: t("howTo.sections.findResources.description"),
      resources: [
        { title: t("howTo.sections.findResources.publicDefenders.title"), description: t("howTo.sections.findResources.publicDefenders.description"), link: "/legal-aid" },
        { title: t("howTo.sections.findResources.legalAid.title"), description: t("howTo.sections.findResources.legalAid.description"), link: "/legal-aid" },
        { title: t("howTo.sections.findResources.diversionPrograms.title"), description: t("howTo.sections.findResources.diversionPrograms.description"), link: "/diversion-programs" },
        { title: t("howTo.sections.findResources.recordExpungement.title"), description: t("howTo.sections.findResources.recordExpungement.description"), link: "/support/reputation" },
        { title: t("howTo.immigrationGuidance"), description: t("howTo.immigrationGuidanceDesc"), link: "/immigration-guidance" },
      ],
    },
    {
      icon: Heart, accent: "#8b2252", accentBg: "#f8eef3",
      title: t("howTo.sections.lifeSupport.title"),
      description: t("howTo.sections.lifeSupport.description"),
      resources: [
        { title: t("howTo.sections.lifeSupport.supportHub.title"), description: t("howTo.sections.lifeSupport.supportHub.description"), link: "/support" },
        { title: t("howTo.sections.lifeSupport.employment.title"), description: t("howTo.sections.lifeSupport.employment.description"), link: "/support/employment" },
        { title: t("howTo.sections.lifeSupport.finances.title"), description: t("howTo.sections.lifeSupport.finances.description"), link: "/support/finances" },
        { title: t("howTo.sections.lifeSupport.mentalHealth.title"), description: t("howTo.sections.lifeSupport.mentalHealth.description"), link: "/support/mental-health" },
        { title: t("howTo.sections.lifeSupport.transportation.title"), description: t("howTo.sections.lifeSupport.transportation.description"), link: "/support/transportation" },
        { title: t("howTo.sections.lifeSupport.childcare.title"), description: t("howTo.sections.lifeSupport.childcare.description"), link: "/support/childcare" },
        { title: t("howTo.sections.lifeSupport.courtLogistics.title"), description: t("howTo.sections.lifeSupport.courtLogistics.description"), link: "/support/court-logistics" },
        { title: t("howTo.housing"), description: t("howTo.housingDesc"), link: "/support/housing" },
        { title: t("howTo.familyCare"), description: t("howTo.familyCareDesc"), link: "/support/family-care" },
        { title: t("howTo.personalHealth"), description: t("howTo.personalHealthDesc"), link: "/support/personal-health" },
        { title: t("howTo.reputation"), description: t("howTo.reputationDesc"), link: "/support/reputation" },
        { title: t("howTo.reentry"), description: t("howTo.reentryDesc"), link: "/support/reentry" },
        { title: t("howTo.sections.getHelp.letterGenerator.title"), description: t("howTo.sections.getHelp.letterGenerator.description"), link: "/letter-generator" },
      ],
    },
    {
      icon: BookOpen, accent: "#374151", accentBg: "#f3f4f6",
      title: t("howTo.sections.reference.title"),
      description: t("howTo.sections.reference.description"),
      resources: [
        { title: t("howTo.sections.reference.legalGlossary.title"), description: t("howTo.sections.reference.legalGlossary.description"), link: "/legal-glossary" },
        { title: t("howTo.sections.reference.courtLocator.title"), description: t("howTo.sections.reference.courtLocator.description"), link: "/court-locator" },
        { title: t("howTo.sections.reference.statuteLookup.title"), description: t("howTo.sections.reference.statuteLookup.description"), link: "/statutes" },
        { title: t("howTo.sections.reference.documentLibrary.title"), description: t("howTo.sections.reference.documentLibrary.description"), link: "/document-library" },
      ],
    },
    {
      icon: FileText, accent: "#92400e", accentBg: "#fef3e2",
      title: t("howTo.sections.attorneyTools.title"),
      description: t("howTo.sections.attorneyTools.description"),
      resources: [
        { title: t("howTo.sections.attorneyTools.attorneyPortal.title"), description: t("howTo.sections.attorneyTools.attorneyPortal.description"), link: "/attorney" },
        { title: t("howTo.sections.attorneyTools.courtRecords.title"), description: t("howTo.sections.attorneyTools.courtRecords.description"), link: "/court-records" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="vivid-header-alt py-10 md:py-14">
        <div className="max-w-3xl mx-auto px-4 vivid-header-content">
          <ScrollReveal>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-blue-300" />
                <span className="text-blue-200 text-sm font-semibold tracking-wide uppercase">OpenDefender</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-white leading-tight">
                {t("directory.hero.title")}
              </h1>
              <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto">
                {t("directory.hero.subtitle")}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Full site inventory */}
      <section className="py-10 md:py-14 bg-muted/20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventoryCategories.map((cat, i) => (
              <InventoryCategory key={cat.title} cat={cat} idx={i} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
