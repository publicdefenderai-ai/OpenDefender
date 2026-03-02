import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Info,
  Phone,
  Globe,
  ArrowRight,
  Lightbulb,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { useState } from "react";

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority?: "high" | "medium" | "low";
  timeframe?: string;
}

export interface ExternalResource {
  name: string;
  description: string;
  url: string;
  phone?: string;
  type: "national" | "state" | "local" | "online";
  free?: boolean;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ResourcePageProps {
  categoryId: string;
  icon: React.ElementType;
  iconColor: string;
  heroGradient: string;
  overview: string;
  startHereItems: ActionItem[];
  externalResources: ExternalResource[];
  faqs?: FAQ[];
  tips?: string[];
  relatedLinks?: { label: string; href: string }[];
  customSections?: ReactNode;
}

const categoryThemes: Record<string, { accent: string; accentBg: string; accentBorder: string; heroClass: string }> = {
  employment:     { accent: "text-blue-600 dark:text-blue-400",    accentBg: "bg-blue-50 dark:bg-blue-950/30",    accentBorder: "border-blue-200 dark:border-blue-800",    heroClass: "vivid-header-alt" },
  finances:       { accent: "text-emerald-600 dark:text-emerald-400", accentBg: "bg-emerald-50 dark:bg-emerald-950/30", accentBorder: "border-emerald-200 dark:border-emerald-800", heroClass: "vivid-header-alt" },
  courtLogistics: { accent: "text-purple-600 dark:text-purple-400",  accentBg: "bg-purple-50 dark:bg-purple-950/30",  accentBorder: "border-purple-200 dark:border-purple-800",  heroClass: "vivid-header-alt" },
  mentalHealth:   { accent: "text-rose-600 dark:text-rose-400",     accentBg: "bg-rose-50 dark:bg-rose-950/30",     accentBorder: "border-rose-200 dark:border-rose-800",     heroClass: "vivid-header-alt" },
  personalHealth: { accent: "text-green-600 dark:text-green-400",   accentBg: "bg-green-50 dark:bg-green-950/30",   accentBorder: "border-green-200 dark:border-green-800",   heroClass: "vivid-header-alt" },
  housing:        { accent: "text-amber-600 dark:text-amber-400",   accentBg: "bg-amber-50 dark:bg-amber-950/30",   accentBorder: "border-amber-200 dark:border-amber-800",   heroClass: "vivid-header-alt" },
  transportation: { accent: "text-cyan-600 dark:text-cyan-400",     accentBg: "bg-cyan-50 dark:bg-cyan-950/30",     accentBorder: "border-cyan-200 dark:border-cyan-800",     heroClass: "vivid-header-alt" },
  childcare:      { accent: "text-pink-600 dark:text-pink-400",     accentBg: "bg-pink-50 dark:bg-pink-950/30",     accentBorder: "border-pink-200 dark:border-pink-800",     heroClass: "vivid-header-alt" },
  familyCare:     { accent: "text-indigo-600 dark:text-indigo-400", accentBg: "bg-indigo-50 dark:bg-indigo-950/30", accentBorder: "border-indigo-200 dark:border-indigo-800", heroClass: "vivid-header-alt" },
  immigration:    { accent: "text-teal-600 dark:text-teal-400",     accentBg: "bg-teal-50 dark:bg-teal-950/30",     accentBorder: "border-teal-200 dark:border-teal-800",     heroClass: "vivid-header-alt" },
  reputation:     { accent: "text-slate-600 dark:text-slate-400",   accentBg: "bg-slate-50 dark:bg-slate-950/30",   accentBorder: "border-slate-200 dark:border-slate-800",   heroClass: "vivid-header-alt" },
};

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground whitespace-nowrap">
        {title}
      </span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

function ActionCard({ item, index, theme }: { item: ActionItem; index: number; theme: typeof categoryThemes[string] }) {
  const { t } = useTranslation();

  const priorityConfig = {
    high:   { color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",     label: t('support.priority.high') },
    medium: { color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", label: t('support.priority.medium') },
    low:    { color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", label: t('support.priority.low') },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
    >
      <Card className="h-full hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground mt-0.5">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 flex-wrap mb-1.5">
                <h4 className="font-semibold text-[15px] text-foreground leading-snug">{item.title}</h4>
                <div className="flex gap-1.5 flex-shrink-0">
                  {item.priority && (
                    <Badge variant="secondary" className={`text-xs ${priorityConfig[item.priority].color}`}>
                      {priorityConfig[item.priority].label}
                    </Badge>
                  )}
                  {item.timeframe && (
                    <Badge variant="outline" className="text-xs">
                      {item.timeframe}
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ResourceCard({ resource, theme }: { resource: ExternalResource; theme: typeof categoryThemes[string] }) {
  const { t } = useTranslation();

  return (
    <Card className="h-full hover:shadow-sm transition-shadow duration-200">
      <CardContent className="p-5 h-full flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="font-semibold text-[15px] text-foreground leading-snug">{resource.name}</h4>
          <div className="flex gap-1.5 flex-shrink-0 flex-wrap justify-end">
            {resource.free && (
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs whitespace-nowrap">
                {t('support.free')}
              </Badge>
            )}
            <Badge variant="secondary" className="text-xs whitespace-nowrap text-muted-foreground">
              {t(`support.resourceType.${resource.type}`)}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed flex-1">
          {resource.description}
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href={resource.url}
            target={resource.url.startsWith('/') ? undefined : "_blank"}
            rel={resource.url.startsWith('/') ? undefined : "noopener noreferrer"}
            className={`inline-flex items-center gap-1.5 text-sm font-medium ${theme.accent} hover:underline transition-colors`}
          >
            <Globe className="h-4 w-4" />
            {t('support.visitWebsite')}
          </a>
          {resource.phone && (
            <a
              href={`tel:${resource.phone}`}
              className={`inline-flex items-center gap-1.5 text-sm font-medium ${theme.accent} hover:underline transition-colors`}
            >
              <Phone className="h-4 w-4" />
              {resource.phone}
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function FAQItem({ faq, theme }: { faq: FAQ; theme: typeof categoryThemes[string] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className={`transition-shadow duration-200 ${isOpen ? 'shadow-sm' : 'hover:shadow-sm'}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-5 flex items-start gap-3"
        aria-expanded={isOpen}
      >
        <Info className={`h-4 w-4 flex-shrink-0 mt-0.5 transition-colors ${isOpen ? theme.accent : 'text-muted-foreground'}`} />
        <span className="font-medium text-foreground flex-1 text-left text-[15px] leading-snug">{faq.question}</span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.18 }}
        >
          <div className="px-5 pb-5 ml-7">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {faq.answer}
            </p>
          </div>
        </motion.div>
      )}
    </Card>
  );
}

function FAQSection({ faqs, theme }: { faqs: FAQ[]; theme: typeof categoryThemes[string] }) {
  const { t } = useTranslation();
  return (
    <section className="py-10 md:py-12">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto">
            <SectionHeading title={t('support.faq.title')} />
            <div className="space-y-2">
              {faqs.map((faq, index) => (
                <FAQItem key={index} faq={faq} theme={theme} />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function TipsSection({ tips }: { tips: string[] }) {
  const { t } = useTranslation();
  return (
    <section className="py-10 md:py-12">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto">
            <SectionHeading title={t('support.tips.title')} />
            <ul className="space-y-3">
              {tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-foreground leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export function ResourcePageTemplate({
  categoryId,
  icon: Icon,
  overview,
  startHereItems,
  externalResources,
  faqs,
  tips,
  relatedLinks,
  customSections,
}: ResourcePageProps) {
  useScrollToTop();
  const { t } = useTranslation();

  const categoryLabel = t(`legalGuidance.qaFlow.additionalDetails.concernsCategories.${categoryId}.label`);
  const theme = categoryThemes[categoryId] || categoryThemes.employment;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">

        {/* Hero */}
        <section className={`${theme.heroClass} py-10 md:py-14`}>
          <div className="max-w-4xl mx-auto px-4 vivid-header-content">
            <Link href="/support">
              <Button variant="ghost" size="sm" className="mb-5 text-white/70 hover:text-white hover:bg-white/10">
                <ChevronLeft className="h-4 w-4 mr-1" />
                {t('support.backToSupport')}
              </Button>
            </Link>
            <div className="flex items-center gap-3 mb-3">
              <Icon className="h-6 w-6 text-white/80" strokeWidth={1.75} />
              <h1 className="text-3xl md:text-4xl font-bold text-white">{categoryLabel}</h1>
            </div>
            <p className="text-base md:text-lg text-white/75 leading-relaxed max-w-3xl">
              {overview}
            </p>
          </div>
        </section>

        {/* Start Here */}
        <section className="py-10 md:py-12">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <SectionHeading title={t('support.startHere')} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {startHereItems.map((item, index) => (
                  <ActionCard key={item.id} item={item} index={index} theme={theme} />
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {customSections}

        {/* Helpful Resources */}
        <section className="py-10 md:py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <SectionHeading title={t('support.helpfulResources')} />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {externalResources.map((resource, index) => (
                  <ResourceCard key={index} resource={resource} theme={theme} />
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {faqs && faqs.length > 0 && <FAQSection faqs={faqs} theme={theme} />}

        {tips && tips.length > 0 && <TipsSection tips={tips} />}

        {/* Related links */}
        {relatedLinks && relatedLinks.length > 0 && (
          <section className="py-10 md:py-12">
            <div className="container mx-auto px-4">
              <ScrollReveal>
                <div className="max-w-3xl mx-auto">
                  <SectionHeading title={t('support.relatedResources')} />
                  <div className="flex flex-wrap gap-3">
                    {relatedLinks.map((link, index) => (
                      <Link key={index} href={link.href}>
                        <Button variant="outline" size="sm" className="group">
                          {link.label}
                          <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>
        )}

        {/* Disclaimer */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto flex items-start gap-2">
              <AlertCircle className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t('support.disclaimer')}
              </p>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
