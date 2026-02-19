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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

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
  // Content sections
  overview: string;
  startHereItems: ActionItem[];
  externalResources: ExternalResource[];
  faqs?: FAQ[];
  tips?: string[];
  relatedLinks?: { label: string; href: string }[];
  // Optional custom sections
  customSections?: ReactNode;
}

function ActionCard({ item, index }: { item: ActionItem; index: number }) {
  const { t } = useTranslation();

  const priorityColors = {
    high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <h4 className="font-semibold text-base">{item.title}</h4>
                {item.priority && (
                  <Badge variant="secondary" className={`text-xs ${priorityColors[item.priority]}`}>
                    {t(`support.priority.${item.priority}`)}
                  </Badge>
                )}
                {item.timeframe && (
                  <Badge variant="outline" className="text-xs">
                    {item.timeframe}
                  </Badge>
                )}
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

function ResourceCard({ resource }: { resource: ExternalResource }) {
  const { t } = useTranslation();

  const typeColors = {
    national: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    state: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    local: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    online: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  };

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h4 className="font-semibold text-base">{resource.name}</h4>
          <div className="flex gap-2 flex-shrink-0">
            {resource.free && (
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs">
                {t('support.free')}
              </Badge>
            )}
            <Badge variant="secondary" className={`text-xs ${typeColors[resource.type]}`}>
              {t(`support.resourceType.${resource.type}`)}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {resource.description}
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <Globe className="h-4 w-4" />
            {t('support.visitWebsite')}
            <ExternalLink className="h-3 w-3" />
          </a>
          {resource.phone && (
            <a
              href={`tel:${resource.phone}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
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

function FAQSection({ faqs }: { faqs: FAQ[] }) {
  const { t } = useTranslation();

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <h2 className="text-2xl font-bold mb-6">{t('support.faq.title')}</h2>
          <div className="space-y-4 max-w-3xl">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-5">
                  <h4 className="font-semibold mb-2 flex items-start gap-2">
                    <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    {faq.question}
                  </h4>
                  <p className="text-sm text-muted-foreground ml-7 leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function TipsSection({ tips }: { tips: string[] }) {
  const { t } = useTranslation();

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-600" />
                {t('support.tips.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
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

  const categoryLabel = t(`legalGuidance.qaFlow.concernsStep.concernsCategories.${categoryId}.label`);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className={`relative py-14 md:py-18 overflow-hidden ${heroGradient}`}>
          <div className="container mx-auto px-4 relative">
            <ScrollReveal>
              <div className="max-w-3xl">
                <Link href="/support">
                  <Button variant="ghost" size="sm" className="mb-4">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    {t('support.backToSupport')}
                  </Button>
                </Link>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${iconColor}`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold">
                    {categoryLabel}
                  </h1>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {overview}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Start Here Section */}
        <section className="py-10 md:py-14">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold">{t('support.startHere')}</h2>
                <Badge variant="outline" className="text-xs">
                  {t('support.practicalSteps')}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {startHereItems.map((item, index) => (
                  <ActionCard key={item.id} item={item} index={index} />
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Custom Sections */}
        {customSections}

        {/* External Resources */}
        <section className="py-10 md:py-14 bg-muted/30">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <h2 className="text-2xl font-bold mb-6">{t('support.helpfulResources')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {externalResources.map((resource, index) => (
                  <ResourceCard key={index} resource={resource} />
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* FAQs */}
        {faqs && faqs.length > 0 && <FAQSection faqs={faqs} />}

        {/* Tips */}
        {tips && tips.length > 0 && <TipsSection tips={tips} />}

        {/* Related Links */}
        {relatedLinks && relatedLinks.length > 0 && (
          <section className="py-10">
            <div className="container mx-auto px-4">
              <ScrollReveal>
                <h2 className="text-xl font-bold mb-4">{t('support.relatedResources')}</h2>
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
              </ScrollReveal>
            </div>
          </section>
        )}

        {/* Disclaimer */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <Card className="border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground">
                      {t('support.disclaimer')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
