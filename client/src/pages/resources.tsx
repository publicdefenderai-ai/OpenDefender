import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  BookOpen,
  FileText,
  MapPin,
  Users,
  ArrowLeft,
  ArrowRight,
  Search,
  Scale
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

interface ResourceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  color: string;
}

function ResourceCard({ icon, title, description, href, color }: ResourceCardProps) {
  return (
    <Link href={href}>
      <Card className="group h-full card-interactive cursor-pointer border-2 border-transparent hover:border-primary/20">
        <CardContent className="p-6 h-full flex flex-col">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${color} transition-transform duration-300 group-hover:scale-110`}>
            {icon}
          </div>
          <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed flex-1">
            {description}
          </p>
          <div className="flex items-center gap-2 mt-4 text-primary font-medium text-sm">
            <span>Learn more</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function Resources() {
  useScrollToTop();
  const { t } = useTranslation();

  const resources = [
    {
      icon: <BookOpen className="h-7 w-7 text-white" />,
      title: t('resources.glossary.title', { defaultValue: 'Legal Glossary' }),
      description: t('resources.glossary.description', { defaultValue: 'Understand legal terminology with our comprehensive glossary of terms commonly used in criminal proceedings.' }),
      href: "/legal-glossary",
      color: "bg-gradient-to-br from-purple-500 to-purple-700"
    },
    {
      icon: <FileText className="h-7 w-7 text-white" />,
      title: t('resources.expungement.title', { defaultValue: 'Record Expungement' }),
      description: t('resources.expungement.description', { defaultValue: 'Learn about clearing your criminal record, eligibility requirements, and the expungement process in your state.' }),
      href: "/record-expungement",
      color: "bg-gradient-to-br from-amber-500 to-amber-700"
    },
    {
      icon: <Search className="h-7 w-7 text-white" />,
      title: t('resources.courtRecords.title', { defaultValue: 'Find Court Records' }),
      description: t('resources.courtRecords.description', { defaultValue: 'Access public court records, case information, and PACER resources for federal and state courts.' }),
      href: "/court-records",
      color: "bg-gradient-to-br from-blue-500 to-blue-700"
    },
    {
      icon: <MapPin className="h-7 w-7 text-white" />,
      title: t('resources.courtLocator.title', { defaultValue: 'Find Local Courts' }),
      description: t('resources.courtLocator.description', { defaultValue: 'Locate courts in your area, find addresses, phone numbers, and directions to courthouses.' }),
      href: "/court-locator",
      color: "bg-gradient-to-br from-teal-500 to-teal-700"
    },
    {
      icon: <Users className="h-7 w-7 text-white" />,
      title: t('resources.diversionPrograms.title', { defaultValue: 'Diversion Programs' }),
      description: t('resources.diversionPrograms.description', { defaultValue: 'Explore alternative sentencing programs that may help you avoid traditional prosecution and criminal records.' }),
      href: "/diversion-programs",
      color: "bg-gradient-to-br from-green-500 to-green-700"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="vivid-header py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 vivid-header-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-6">
              <Scale className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              {t('resources.hero.title', { defaultValue: 'Legal Resources' })}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/85 max-w-3xl mx-auto">
              {t('resources.hero.subtitle', { defaultValue: 'Tools and information to help you navigate the legal system' })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 lg:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-10">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('common.backToHome', { defaultValue: 'Back to Home' })}
                </Button>
              </Link>
            </div>
          </ScrollReveal>

          {/* Resource Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <ScrollReveal key={resource.href} delay={index * 0.1}>
                <ResourceCard {...resource} />
              </ScrollReveal>
            ))}
          </div>

          {/* Additional Info Section */}
          <ScrollReveal delay={0.5}>
            <Card className="mt-12 bg-muted/50 border-dashed">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold mb-3">
                  {t('resources.needHelp.title', { defaultValue: 'Need Personalized Guidance?' })}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  {t('resources.needHelp.description', { defaultValue: 'Our case guidance tool can help you understand your specific situation and provide tailored information based on your charges and jurisdiction.' })}
                </p>
                <Link href="/case-guidance">
                  <Button size="lg">
                    {t('resources.needHelp.cta', { defaultValue: 'Get Case Guidance' })}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
