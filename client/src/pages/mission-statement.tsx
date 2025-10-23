import { motion } from "framer-motion";
import { Target, Users, Scale, TrendingUp, Shield, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PrivacyBanner } from "@/components/layout/privacy-banner";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

export default function MissionStatement() {
  useScrollToTop();
  const goals = [
    {
      icon: Users,
      title: "Expand Access to Justice",
      description: "Deliver preliminary legal information, guidance, and case-relevant insights to defendants at no cost, reducing barriers for underserved populations.",
      color: "bg-blue-600"
    },
    {
      icon: Scale,
      title: "Support Public Defender Workflows",
      description: "Provide public defenders with fast access to aggregated legal data, case statistics, and procedural requirements to help them prepare more effective defense strategies.",
      color: "bg-green-600"
    },
    {
      icon: FileText,
      title: "Empower Informed Decision-Making",
      description: "Enable defendants to better understand their rights, legal options, and potential outcomes through clear, plain-language explanations grounded in reliable data.",
      color: "bg-purple-600"
    },
    {
      icon: TrendingUp,
      title: "Increase Efficiency and Fairness",
      description: "Automate collection and synthesis of public legal datasets so that defendants and attorneys can quickly identify relevant precedents, procedural rules, and plea or sentencing trends.",
      color: "bg-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <PrivacyBanner />
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
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-600 rounded-full">
                <Target className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Mission Statement
            </h1>
            <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
              The Public Defender AI Agent project aims to leverage artificial intelligence, legal data, and automation to provide timely, accurate, and accessible assistance to individuals in the United States who are accused of crimes and may not have immediate access to legal counsel.
            </p>
          </motion.div>
        </ScrollReveal>

        {/* Primary Goals Section */}
        <ScrollReveal>
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
              Our Primary Goals
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {goals.map((goal, index) => {
                const Icon = goal.icon;
                return (
                  <motion.div
                    key={goal.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 ${goal.color} rounded-lg flex-shrink-0`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                              {goal.title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                              {goal.description}
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
                Guiding Principles
              </h2>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              This project is guided by the principles of <strong>fairness</strong>, <strong>transparency</strong>, <strong>data privacy</strong>, and <strong>compliance</strong> with applicable laws and ethical guidelines governing legal practice.
            </p>
            <div className="bg-blue-50 dark:bg-slate-700 border-l-4 border-blue-600 p-4 rounded">
              <p className="text-slate-800 dark:text-slate-200 font-medium">
                The AI agent is not a substitute for a licensed attorney but a support tool to supplement human legal counsel and improve access to equitable defense resources.
              </p>
            </div>
          </motion.div>
        </ScrollReveal>
      </main>

      <Footer />
    </div>
  );
}
