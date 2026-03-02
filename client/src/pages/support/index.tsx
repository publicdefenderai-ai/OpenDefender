import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Briefcase,
  Wallet,
  Gavel,
  HeartPulse,
  Home,
  Car,
  Baby,
  Users,
  Globe2,
  ShieldCheck,
  Activity,
  ChevronLeft,
  ExternalLink,
  HandHeart,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

interface CategoryDef {
  id: string;
  icon: React.ElementType;
  iconText: string;
  href: string;
}

const CATEGORIES: Record<string, CategoryDef> = {
  employment:      { id: "employment",      icon: Briefcase,   iconText: "text-blue-500",    href: "/support/employment" },
  finances:        { id: "finances",        icon: Wallet,       iconText: "text-emerald-500", href: "/support/finances" },
  housing:         { id: "housing",         icon: Home,         iconText: "text-amber-500",   href: "/support/housing" },
  transportation:  { id: "transportation",  icon: Car,          iconText: "text-cyan-500",    href: "/support/transportation" },
  childcare:       { id: "childcare",       icon: Baby,         iconText: "text-pink-500",    href: "/support/childcare" },
  courtLogistics:  { id: "courtLogistics",  icon: Gavel,        iconText: "text-purple-500",  href: "/support/court-logistics" },
  reputation:      { id: "reputation",      icon: ShieldCheck,  iconText: "text-slate-500",   href: "/support/reputation" },
  immigration:     { id: "immigration",     icon: Globe2,       iconText: "text-teal-500",    href: "/immigration-guidance" },
  mentalHealth:    { id: "mentalHealth",    icon: HeartPulse,   iconText: "text-rose-500",    href: "/support/mental-health" },
  personalHealth:  { id: "personalHealth",  icon: Activity,     iconText: "text-green-500",   href: "/support/personal-health" },
  familyCare:      { id: "familyCare",      icon: Users,        iconText: "text-indigo-500",  href: "/support/family-care" },
};

const GROUPS = [
  { labelKey: "support.groups.dailyLife",  ids: ["employment", "finances", "housing", "transportation", "childcare"] },
  { labelKey: "support.groups.legalCourt", ids: ["courtLogistics", "reputation", "immigration"] },
  { labelKey: "support.groups.health",     ids: ["mentalHealth", "personalHealth", "familyCare"] },
];

function CategoryCard({ category, index }: { category: CategoryDef; index: number }) {
  const { t } = useTranslation();
  const Icon = category.icon;
  const label = t(`legalGuidance.qaFlow.additionalDetails.concernsCategories.${category.id}.label`);
  const description = t(`legalGuidance.qaFlow.additionalDetails.concernsCategories.${category.id}.description`);

  return (
    <Link href={category.href}>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.35 }}
        className="h-full"
      >
        <Card className="group h-full cursor-pointer border-border/60 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-border">
          <CardContent className="p-5 flex flex-col gap-3">
            <Icon className={`h-6 w-6 ${category.iconText}`} strokeWidth={1.75} />
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-[15px] leading-snug mb-1">
                {label}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {description}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}

function GroupSection({ labelKey, ids, baseIndex }: { labelKey: string; ids: string[]; baseIndex: number }) {
  const { t } = useTranslation();
  return (
    <div className="mb-12 last:mb-0">
      <div className="flex items-center gap-4 mb-5">
        <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground whitespace-nowrap">
          {t(labelKey)}
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ids.map((id, i) => (
          <CategoryCard key={id} category={CATEGORIES[id]} index={baseIndex + i} />
        ))}
      </div>
    </div>
  );
}

export default function SupportHub() {
  useScrollToTop();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="vivid-header-alt py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-4 text-center vivid-header-content">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-5 text-white/70 hover:text-white hover:bg-white/10">
                <ChevronLeft className="h-4 w-4 mr-1" />
                {t('common.backToHome')}
              </Button>
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">
              {t('support.title')}
            </h1>
            <p className="text-base md:text-lg text-white/75 max-w-xl mx-auto leading-relaxed">
              {t('support.description')}
            </p>
          </div>
        </section>

        {/* Category groups */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <ScrollReveal>
              {GROUPS.map((group, gi) => {
                const baseIndex = GROUPS.slice(0, gi).reduce((sum, g) => sum + g.ids.length, 0);
                return (
                  <GroupSection
                    key={group.labelKey}
                    labelKey={group.labelKey}
                    ids={group.ids}
                    baseIndex={baseIndex}
                  />
                );
              })}
            </ScrollReveal>
          </div>
        </section>

        {/* Partners callout */}
        <section className="py-10 border-t border-border/40">
          <div className="container mx-auto px-4 max-w-5xl">
            <ScrollReveal>
              <div className="rounded-xl bg-muted/40 border border-border/50 p-5 flex items-start gap-4">
                <HandHeart className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">Partners for Justice</p>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    A national nonprofit that embeds trained advocates inside public defender offices, helping clients connect with housing, employment, health care, and other services as part of their legal representation — operating in 20+ states and connecting over 29,000 people with services.
                  </p>
                  <a
                    href="https://www.partnersforjustice.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mt-2"
                  >
                    partnersforjustice.org
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
