import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Briefcase,
  DollarSign,
  Calendar,
  Heart,
  Home,
  Car,
  Baby,
  Users,
  Shield,
  Scale,
  ArrowRight,
  ChevronLeft,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

interface SupportCategoryProps {
  id: string;
  icon: React.ElementType;
  color: string;
  href: string;
  available: boolean;
}

const supportCategories: SupportCategoryProps[] = [
  { id: "employment", icon: Briefcase, color: "bg-blue-500/10 text-blue-600 dark:text-blue-400", href: "/support/employment", available: true },
  { id: "finances", icon: DollarSign, color: "bg-green-500/10 text-green-600 dark:text-green-400", href: "/support/finances", available: true },
  { id: "courtLogistics", icon: Calendar, color: "bg-purple-500/10 text-purple-600 dark:text-purple-400", href: "/support/court-logistics", available: true },
  { id: "mentalHealth", icon: Heart, color: "bg-rose-500/10 text-rose-600 dark:text-rose-400", href: "/support/mental-health", available: true },
  { id: "housing", icon: Home, color: "bg-amber-500/10 text-amber-600 dark:text-amber-400", href: "/support/housing", available: false },
  { id: "transportation", icon: Car, color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400", href: "/support/transportation", available: false },
  { id: "childcare", icon: Baby, color: "bg-pink-500/10 text-pink-600 dark:text-pink-400", href: "/support/childcare", available: false },
  { id: "familyCare", icon: Users, color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400", href: "/support/family-care", available: false },
  { id: "immigration", icon: Shield, color: "bg-teal-500/10 text-teal-600 dark:text-teal-400", href: "/immigration-guidance", available: true },
  { id: "reputation", icon: Scale, color: "bg-slate-500/10 text-slate-600 dark:text-slate-400", href: "/support/reputation", available: false },
];

function CategoryCard({ category }: { category: SupportCategoryProps }) {
  const { t } = useTranslation();
  const Icon = category.icon;

  const label = t(`legalGuidance.qaFlow.concernsStep.concernsCategories.${category.id}.label`);
  const description = t(`legalGuidance.qaFlow.concernsStep.concernsCategories.${category.id}.description`);

  const content = (
    <Card className={`group h-full border-2 border-transparent transition-all duration-200 ${
      category.available
        ? "card-interactive cursor-pointer hover:border-primary/20"
        : "opacity-60 cursor-not-allowed"
    }`}>
      <CardContent className="p-5 h-full flex flex-col">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${category.color} transition-transform duration-300 ${category.available ? "group-hover:scale-110" : ""}`}>
          <Icon className="h-6 w-6" />
        </div>
        <h3 className={`text-lg font-semibold mb-2 ${category.available ? "group-hover:text-primary" : ""} transition-colors`}>
          {label}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed flex-1">
          {description}
        </p>
        {category.available ? (
          <div className="flex items-center gap-2 mt-4 text-primary font-medium text-sm">
            <span>{t('support.viewResources')}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        ) : (
          <div className="mt-4 text-xs text-muted-foreground italic">
            {t('support.comingSoon')}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (category.available) {
    return <Link href={category.href}>{content}</Link>;
  }
  return content;
}

export default function SupportHub() {
  useScrollToTop();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
          <div className="container mx-auto px-4 relative">
            <ScrollReveal>
              <div className="max-w-3xl mx-auto text-center">
                <Link href="/">
                  <Button variant="ghost" size="sm" className="mb-6">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    {t('common.backToHome')}
                  </Button>
                </Link>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {t('support.title')}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-4">
                  {t('support.subtitle')}
                </p>
                <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                  {t('support.description')}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {supportCategories.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Note Section */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-2xl mx-auto">
                <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
                  <CardContent className="p-5">
                    <p className="text-sm text-muted-foreground">
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
