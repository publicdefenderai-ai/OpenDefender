import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Info,
  Phone,
  Globe,
  ArrowRight,
  Lightbulb,
  ChevronDown,
  Landmark,
  MapPin,
  Monitor,
  Map,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  employment: {
    accent: "text-blue-600 dark:text-blue-400",
    accentBg: "bg-blue-50 dark:bg-blue-950/30",
    accentBorder: "border-blue-200 dark:border-blue-800",
    heroClass: "vivid-header-alt",
  },
  finances: {
    accent: "text-emerald-600 dark:text-emerald-400",
    accentBg: "bg-emerald-50 dark:bg-emerald-950/30",
    accentBorder: "border-emerald-200 dark:border-emerald-800",
    heroClass: "vivid-header-alt",
  },
  courtLogistics: {
    accent: "text-purple-600 dark:text-purple-400",
    accentBg: "bg-purple-50 dark:bg-purple-950/30",
    accentBorder: "border-purple-200 dark:border-purple-800",
    heroClass: "vivid-header-alt",
  },
  mentalHealth: {
    accent: "text-rose-600 dark:text-rose-400",
    accentBg: "bg-rose-50 dark:bg-rose-950/30",
    accentBorder: "border-rose-200 dark:border-rose-800",
    heroClass: "vivid-header-alt",
  },
  personalHealth: {
    accent: "text-green-600 dark:text-green-400",
    accentBg: "bg-green-50 dark:bg-green-950/30",
    accentBorder: "border-green-200 dark:border-green-800",
    heroClass: "vivid-header-alt",
  },
  housing: {
    accent: "text-amber-600 dark:text-amber-400",
    accentBg: "bg-amber-50 dark:bg-amber-950/30",
    accentBorder: "border-amber-200 dark:border-amber-800",
    heroClass: "vivid-header-alt",
  },
  transportation: {
    accent: "text-cyan-600 dark:text-cyan-400",
    accentBg: "bg-cyan-50 dark:bg-cyan-950/30",
    accentBorder: "border-cyan-200 dark:border-cyan-800",
    heroClass: "vivid-header-alt",
  },
  childcare: {
    accent: "text-pink-600 dark:text-pink-400",
    accentBg: "bg-pink-50 dark:bg-pink-950/30",
    accentBorder: "border-pink-200 dark:border-pink-800",
    heroClass: "vivid-header-alt",
  },
  familyCare: {
    accent: "text-indigo-600 dark:text-indigo-400",
    accentBg: "bg-indigo-50 dark:bg-indigo-950/30",
    accentBorder: "border-indigo-200 dark:border-indigo-800",
    heroClass: "vivid-header-alt",
  },
  immigration: {
    accent: "text-teal-600 dark:text-teal-400",
    accentBg: "bg-teal-50 dark:bg-teal-950/30",
    accentBorder: "border-teal-200 dark:border-teal-800",
    heroClass: "vivid-header-alt",
  },
  reputation: {
    accent: "text-slate-600 dark:text-slate-400",
    accentBg: "bg-slate-50 dark:bg-slate-950/30",
    accentBorder: "border-slate-200 dark:border-slate-800",
    heroClass: "vivid-header-alt",
  },
};

function ActionCard({ item, index, theme }: { item: ActionItem; index: number; theme: typeof categoryThemes[string] }) {
  const { t } = useTranslation();

  const priorityConfig = {
    high: { color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", label: t('support.priority.high') },
    medium: { color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", label: t('support.priority.medium') },
    low: { color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", label: t('support.priority.low') },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <Card className={`h-full border-l-4 ${theme.accentBorder} hover:shadow-lg transition-all duration-300`}>
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 w-9 h-9 rounded-xl ${theme.accentBg} flex items-center justify-center ${theme.accent} font-bold text-sm`}>
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <h4 className="font-semibold text-base text-foreground">{item.title}</h4>
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
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
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

  const typeConfig: Record<string, { color: string; badgeColor: string; IconComponent: LucideIcon }> = {
    national: { color: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400", badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", IconComponent: Landmark },
    state: { color: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400", badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", IconComponent: Map },
    local: { color: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400", badgeColor: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", IconComponent: MapPin },
    online: { color: "bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400", badgeColor: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400", IconComponent: Monitor },
  };

  const config = typeConfig[resource.type] || typeConfig.online;
  const TypeIcon = config.IconComponent;

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 group">
      <CardContent className="p-5 h-full flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${config.color}`}>
              <TypeIcon className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </div>
            <h4 className="font-semibold text-base text-foreground leading-snug mt-1">{resource.name}</h4>
          </div>
          <div className="flex gap-1.5 flex-shrink-0 flex-wrap justify-end">
            {resource.free && (
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs whitespace-nowrap">
                {t('support.free')}
              </Badge>
            )}
            <Badge variant="secondary" className={`text-xs whitespace-nowrap ${config.badgeColor}`}>
              {t(`support.resourceType.${resource.type}`)}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed flex-1">
          {resource.description}
        </p>
        <div className="flex flex-wrap gap-3 pt-2 border-t border-border/50">
          <a
            href={resource.url}
            target={resource.url.startsWith('/') ? undefined : "_blank"}
            rel={resource.url.startsWith('/') ? undefined : "noopener noreferrer"}
            className={`inline-flex items-center gap-1.5 text-sm font-medium ${theme.accent} hover:underline transition-colors`}
          >
            <Globe className="h-4 w-4" />
            {t('support.visitWebsite')}
            <ExternalLink className="h-3 w-3" />
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
    <Card className={`transition-all duration-300 ${isOpen ? `shadow-md ${theme.accentBorder} border` : 'hover:shadow-sm'}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-5 flex items-start gap-3"
        aria-expanded={isOpen}
      >
        <Info className={`h-5 w-5 flex-shrink-0 mt-0.5 transition-colors ${isOpen ? theme.accent : 'text-muted-foreground'}`} />
        <span className="font-semibold text-foreground flex-1 text-left">{faq.question}</span>
        <ChevronDown className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.2 }}
        >
          <div className="px-5 pb-5 ml-8">
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
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
    <section className="py-10 md:py-14">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-foreground">{t('support.faq.title')}</h2>
            <div className="space-y-3">
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
    <section className="py-10 md:py-14">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto">
            <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                    <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  {t('support.tips.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-slate-200">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export function ResourcePageTemplate({
  categoryId,
  icon: Icon,
  iconColor,
  heroGradient,
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
        <section className={`${theme.heroClass} py-14 md:py-20`}>
          <div className="max-w-4xl mx-auto px-4 vivid-header-content">
            <Link href="/support">
              <Button variant="ghost" size="sm" className="mb-4 text-white/80 hover:text-white hover:bg-white/10">
                <ChevronLeft className="h-4 w-4 mr-1" />
                {t('support.backToSupport')}
              </Button>
            </Link>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <Icon className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {categoryLabel}
              </h1>
            </div>
            <p className="text-lg text-white/80 leading-relaxed max-w-3xl">
              {overview}
            </p>
          </div>
        </section>

        <section className="py-10 md:py-14">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-8">
                <div className={`w-1.5 h-8 rounded-full ${theme.accentBg} ${theme.accentBorder} border`} />
                <h2 className="text-2xl font-bold text-foreground">{t('support.startHere')}</h2>
                <Badge variant="outline" className="text-xs">
                  {t('support.practicalSteps')}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {startHereItems.map((item, index) => (
                  <ActionCard key={item.id} item={item} index={index} theme={theme} />
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {customSections}

        <section className="py-10 md:py-14 bg-muted/30">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-8">
                <div className={`w-1.5 h-8 rounded-full ${theme.accentBg} ${theme.accentBorder} border`} />
                <h2 className="text-2xl font-bold text-foreground">{t('support.helpfulResources')}</h2>
              </div>
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

        {relatedLinks && relatedLinks.length > 0 && (
          <section className="py-10 md:py-14">
            <div className="container mx-auto px-4">
              <ScrollReveal>
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-xl font-bold mb-4 text-foreground">{t('support.relatedResources')}</h2>
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

        <section className="py-8">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-3xl mx-auto">
                <Card className="border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {t('support.disclaimer')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
