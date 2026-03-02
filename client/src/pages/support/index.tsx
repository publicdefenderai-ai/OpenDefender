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
  ArrowRight,
  ChevronLeft,
  Sparkles,
  ExternalLink,
  HandHeart,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

interface SupportCategoryProps {
  id: string;
  icon: React.ElementType;
  iconBg: string;
  iconText: string;
  borderColor: string;
  href: string;
  available: boolean;
}

const supportCategories: SupportCategoryProps[] = [
  { id: "employment", icon: Briefcase, iconBg: "bg-blue-100 dark:bg-blue-900/40", iconText: "text-blue-600 dark:text-blue-400", borderColor: "border-l-blue-500", href: "/support/employment", available: true },
  { id: "finances", icon: Wallet, iconBg: "bg-emerald-100 dark:bg-emerald-900/40", iconText: "text-emerald-600 dark:text-emerald-400", borderColor: "border-l-emerald-500", href: "/support/finances", available: true },
  { id: "courtLogistics", icon: Gavel, iconBg: "bg-purple-100 dark:bg-purple-900/40", iconText: "text-purple-600 dark:text-purple-400", borderColor: "border-l-purple-500", href: "/support/court-logistics", available: true },
  { id: "mentalHealth", icon: HeartPulse, iconBg: "bg-rose-100 dark:bg-rose-900/40", iconText: "text-rose-600 dark:text-rose-400", borderColor: "border-l-rose-500", href: "/support/mental-health", available: true },
  { id: "housing", icon: Home, iconBg: "bg-amber-100 dark:bg-amber-900/40", iconText: "text-amber-600 dark:text-amber-400", borderColor: "border-l-amber-500", href: "/support/housing", available: true },
  { id: "transportation", icon: Car, iconBg: "bg-cyan-100 dark:bg-cyan-900/40", iconText: "text-cyan-600 dark:text-cyan-400", borderColor: "border-l-cyan-500", href: "/support/transportation", available: true },
  { id: "childcare", icon: Baby, iconBg: "bg-pink-100 dark:bg-pink-900/40", iconText: "text-pink-600 dark:text-pink-400", borderColor: "border-l-pink-500", href: "/support/childcare", available: true },
  { id: "familyCare", icon: Users, iconBg: "bg-indigo-100 dark:bg-indigo-900/40", iconText: "text-indigo-600 dark:text-indigo-400", borderColor: "border-l-indigo-500", href: "/support/family-care", available: true },
  { id: "immigration", icon: Globe2, iconBg: "bg-teal-100 dark:bg-teal-900/40", iconText: "text-teal-600 dark:text-teal-400", borderColor: "border-l-teal-500", href: "/immigration-guidance", available: true },
  { id: "reputation", icon: ShieldCheck, iconBg: "bg-slate-100 dark:bg-slate-900/40", iconText: "text-slate-600 dark:text-slate-400", borderColor: "border-l-slate-500", href: "/support/reputation", available: true },
  { id: "personalHealth", icon: Activity, iconBg: "bg-green-100 dark:bg-green-900/40", iconText: "text-green-600 dark:text-green-400", borderColor: "border-l-green-500", href: "/support/personal-health", available: true },
];

function CategoryCard({ category, index }: { category: SupportCategoryProps; index: number }) {
  const { t } = useTranslation();
  const Icon = category.icon;

  const label = t(`legalGuidance.qaFlow.additionalDetails.concernsCategories.${category.id}.label`);
  const description = t(`legalGuidance.qaFlow.additionalDetails.concernsCategories.${category.id}.description`);

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="h-full"
    >
      <Card className={`group h-full border-l-4 ${category.borderColor} transition-all duration-300 ${
        category.available
          ? "hover:shadow-lg hover:-translate-y-1 cursor-pointer"
          : "opacity-50 cursor-not-allowed"
      }`}>
        <CardContent className="p-5 h-full flex flex-col">
          <div className="flex items-start gap-4 mb-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${category.iconBg} transition-transform duration-300 ${category.available ? "group-hover:scale-110" : ""}`}>
              <Icon className={`h-5 w-5 ${category.iconText}`} strokeWidth={1.75} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`text-lg font-bold text-foreground leading-snug ${category.available ? "group-hover:text-primary" : ""} transition-colors`}>
                {label}
              </h3>
              {!category.available && (
                <Badge variant="secondary" className="text-xs mt-1">
                  {t('support.comingSoon')}
                </Badge>
              )}
            </div>
          </div>
          <p className="text-sm leading-relaxed flex-1 text-slate-600 dark:text-slate-300">
            {description}
          </p>
          {category.available && (
            <div className={`flex items-center gap-2 mt-4 pt-3 border-t border-border/50 ${category.iconText} font-medium text-sm`}>
              <span>{t('support.viewResources')}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  if (category.available) {
    return <Link href={category.href}>{content}</Link>;
  }
  return content;
}

export default function SupportHub() {
  useScrollToTop();
  const { t } = useTranslation();

  const availableCategories = supportCategories.filter(c => c.available);
  const comingSoonCategories = supportCategories.filter(c => !c.available);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="vivid-header-alt py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 vivid-header-content text-center">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-6 text-white/80 hover:text-white hover:bg-white/10">
                <ChevronLeft className="h-4 w-4 mr-1" />
                {t('common.backToHome')}
              </Button>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              {t('support.title')}
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-4 max-w-2xl mx-auto">
              {t('support.subtitle')}
            </p>
            <p className="text-sm text-white/70 max-w-2xl mx-auto">
              {t('support.description')}
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-8">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold text-foreground">{t('support.availableNow', 'Available Now')}</h2>
                <Badge variant="secondary" className="text-xs">{availableCategories.length}</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {availableCategories.map((category, index) => (
                  <CategoryCard key={category.id} category={category} index={index} />
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {comingSoonCategories.length > 0 && (
          <section className="py-8 md:py-12 bg-muted/30">
            <div className="container mx-auto px-4">
              <ScrollReveal>
                <h2 className="text-lg font-semibold text-muted-foreground mb-6">{t('support.comingSoon')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {comingSoonCategories.map((category, index) => (
                    <CategoryCard key={category.id} category={category} index={index} />
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </section>
        )}

        <section className="py-10 md:py-14 bg-muted/20">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <HandHeart className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold text-foreground">Organizations Working Alongside Public Defenders</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  The following organizations work to expand what public defenders can do for their clients. They are not affiliated with this site — we cross-reference their work with attribution.
                </p>
                <Card className="border-l-4 border-l-primary shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-lg font-bold text-foreground">Partners for Justice</h3>
                          <Badge variant="secondary" className="text-xs">Featured Partner</Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                          A national nonprofit that embeds trained, non-attorney Advocates inside public defender offices. These Advocates help people facing charges connect with housing, employment, health care, and other social services — as part of their legal representation, not separately. Founded in 2018, PFJ operates in 20+ states and has helped eliminate an estimated 9,000+ years of potential incarceration by addressing the root causes behind criminal legal involvement.
                        </p>
                        <div className="flex flex-wrap gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-xl font-bold text-primary">20+</div>
                            <div className="text-xs text-muted-foreground">States</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-primary">29,000+</div>
                            <div className="text-xs text-muted-foreground">People connected to services</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-primary">9,000+</div>
                            <div className="text-xs text-muted-foreground">Years of incarceration eliminated</div>
                          </div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3 mb-4 text-xs text-muted-foreground">
                          <strong className="text-foreground">How they can help you:</strong> If your public defender's office works with Partners for Justice, ask them about connecting with a PFJ Advocate. An Advocate can help you access services for housing, employment, mental health, and more — which may also strengthen your legal case.
                        </div>
                        <a
                          href="https://www.partnersforjustice.org/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                        >
                          Visit partnersforjustice.org
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                        <p className="text-xs text-muted-foreground mt-3">
                          Statistics and descriptions sourced from <a href="https://www.partnersforjustice.org/our-impact" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">partnersforjustice.org/our-impact</a>. Cross-referenced with attribution.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-2xl mx-auto">
                <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/10">
                  <CardContent className="p-5">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      <strong className="text-foreground">{t('support.note.title')}</strong>{" "}
                      {t('support.note.content')}
                    </p>
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
