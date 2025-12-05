import { motion } from "framer-motion";
import { Target, Users, Scale, TrendingUp, Shield, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { useTranslation } from "react-i18next";

export default function MissionStatement() {
  useScrollToTop();
  const { t } = useTranslation();
  
  const goals = [
    {
      icon: Users,
      titleKey: "missionStatement.goals.expandAccess.title",
      descriptionKey: "missionStatement.goals.expandAccess.description"
    },
    {
      icon: Scale,
      titleKey: "missionStatement.goals.supportDefenders.title",
      descriptionKey: "missionStatement.goals.supportDefenders.description"
    },
    {
      icon: FileText,
      titleKey: "missionStatement.goals.empowerDecisions.title",
      descriptionKey: "missionStatement.goals.empowerDecisions.description"
    },
    {
      icon: TrendingUp,
      titleKey: "missionStatement.goals.increaseFairness.title",
      descriptionKey: "missionStatement.goals.increaseFairness.description"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Hero Section */}
        <ScrollReveal>
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {t('missionStatement.hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              {t('missionStatement.hero.subtitle')}
            </p>
          </motion.div>
        </ScrollReveal>

        {/* Primary Goals Section */}
        <ScrollReveal>
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              {t('missionStatement.goals.title')}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {goals.map((goal, index) => {
                const Icon = goal.icon;
                return (
                  <motion.div
                    key={goal.titleKey}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-md transition-shadow border">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full border-2 border-muted flex items-center justify-center flex-shrink-0 text-muted-foreground">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                              {t(goal.titleKey)}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                              {t(goal.descriptionKey)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* Guiding Principles */}
        <ScrollReveal>
          <motion.div
            className="bg-slate-100 dark:bg-slate-800 rounded-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {t('missionStatement.principles.title')}
              </h2>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              {t('missionStatement.principles.description')}
            </p>
            <div className="bg-blue-50 dark:bg-slate-700 border-l-4 border-blue-600 p-4 rounded">
              <p className="text-slate-800 dark:text-slate-200 font-medium">
                {t('missionStatement.principles.disclaimer')}
              </p>
            </div>
          </motion.div>
        </ScrollReveal>
      </main>

      <Footer />
    </div>
  );
}
