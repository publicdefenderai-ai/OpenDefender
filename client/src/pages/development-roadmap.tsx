import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Code, 
  Database, 
  Globe, 
  Users, 
  Check, 
  Clock, 
  AlertCircle,
  GitBranch,
  Target,
  Zap,
  Shield,
  BarChart3,
  FileText,
  ExternalLink,
  Github,
  ArrowRight,
  Lightbulb,
  Heart,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

interface RoadmapItem {
  id: string;
  titleKey: string;
  descriptionKey: string;
  status: "completed" | "in-progress" | "planned" | "researching";
  priority: "critical" | "high" | "medium" | "low";
  category: "data" | "features" | "infrastructure" | "ai" | "legal";
  estimatedCompletion?: string;
  dependencies?: string[];
  progress?: number;
  challengesKeys?: string[];
  impactKey: string;
}

export default function DevelopmentRoadmap() {
  useScrollToTop();
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showFeatureRequestModal, setShowFeatureRequestModal] = useState(false);
  const [featureName, setFeatureName] = useState("");
  const [featureEmail, setFeatureEmail] = useState("");
  const [featureDescription, setFeatureDescription] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const { toast } = useToast();

  const handleSubmitFeatureRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check for spam protection
    if (honeypot) {
      // Silently reject spam
      return;
    }

    if (!featureName || !featureEmail || !featureDescription) {
      toast({
        title: t('developmentRoadmap.featureRequest.validationName'),
        description: t('developmentRoadmap.featureRequest.validationNameDesc'),
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(featureEmail)) {
      toast({
        title: t('developmentRoadmap.featureRequest.validationEmail'),
        description: t('developmentRoadmap.featureRequest.validationEmailDesc'),
        variant: "destructive",
      });
      return;
    }

    // Construct mailto link
    const subject = encodeURIComponent(`Feature Request: ${featureName}`);
    const body = encodeURIComponent(
      `Name: ${featureName}\n\nEmail: ${featureEmail}\n\nFeature Request:\n${featureDescription}`
    );
    const mailtoLink = `mailto:publicdefenderai@gmail.com?subject=${subject}&body=${body}`;
    
    // Open email client
    window.location.href = mailtoLink;

    // Reset form and close modal
    setFeatureName("");
    setFeatureEmail("");
    setFeatureDescription("");
    setHoneypot("");
    setShowFeatureRequestModal(false);

    toast({
      title: t('developmentRoadmap.featureRequest.successTitle'),
      description: t('developmentRoadmap.featureRequest.successDesc'),
    });
  };

  const roadmapItems: RoadmapItem[] = [
    {
      id: "pacer-authentication",
      titleKey: "developmentRoadmap.items.pacer.title",
      descriptionKey: "developmentRoadmap.items.pacer.description",
      status: "in-progress",
      priority: "high",
      category: "data",
      estimatedCompletion: "Q4 2025",
      progress: 45,
      challengesKeys: ["developmentRoadmap.items.pacer.challenges.cost", "developmentRoadmap.items.pacer.challenges.rateLimit", "developmentRoadmap.items.pacer.challenges.bulk"],
      impactKey: "developmentRoadmap.items.pacer.impact"
    },
    {
      id: "state-statutes-api",
      titleKey: "developmentRoadmap.items.stateStatutes.title",
      descriptionKey: "developmentRoadmap.items.stateStatutes.description",
      status: "completed",
      priority: "high",
      category: "data",
      estimatedCompletion: "Completed Dec 2025",
      progress: 100,
      impactKey: "developmentRoadmap.items.stateStatutes.impact"
    },
    {
      id: "ai-guidance-engine",
      titleKey: "developmentRoadmap.items.aiGuidance.title",
      descriptionKey: "developmentRoadmap.items.aiGuidance.description",
      status: "in-progress",
      priority: "critical",
      category: "ai",
      estimatedCompletion: "Q1 2026",
      progress: 78,
      challengesKeys: ["developmentRoadmap.items.aiGuidance.challenges.accuracy", "developmentRoadmap.items.aiGuidance.challenges.bias", "developmentRoadmap.items.aiGuidance.challenges.jurisdiction"],
      impactKey: "developmentRoadmap.items.aiGuidance.impact"
    },
    {
      id: "judge-analytics",
      titleKey: "developmentRoadmap.items.judgeAnalytics.title",
      descriptionKey: "developmentRoadmap.items.judgeAnalytics.description",
      status: "researching",
      priority: "medium",
      category: "data",
      estimatedCompletion: "Q4 2025",
      challengesKeys: ["developmentRoadmap.items.judgeAnalytics.challenges.privacy", "developmentRoadmap.items.judgeAnalytics.challenges.significance", "developmentRoadmap.items.judgeAnalytics.challenges.historicalBias"],
      impactKey: "developmentRoadmap.items.judgeAnalytics.impact"
    },
    {
      id: "mobile-app",
      titleKey: "developmentRoadmap.items.mobileApp.title",
      descriptionKey: "developmentRoadmap.items.mobileApp.description",
      status: "planned",
      priority: "high",
      category: "features",
      estimatedCompletion: "Q1 2026",
      dependencies: ["ai-guidance-engine"],
      impactKey: "developmentRoadmap.items.mobileApp.impact"
    },
    {
      id: "real-time-alerts",
      titleKey: "developmentRoadmap.items.realTimeAlerts.title",
      descriptionKey: "developmentRoadmap.items.realTimeAlerts.description",
      status: "planned",
      priority: "medium",
      category: "features",
      estimatedCompletion: "Q4 2025",
      dependencies: ["pacer-authentication", "mobile-app"],
      impactKey: "developmentRoadmap.items.realTimeAlerts.impact"
    },
    {
      id: "privacy-encryption",
      titleKey: "developmentRoadmap.items.privacyEncryption.title",
      descriptionKey: "developmentRoadmap.items.privacyEncryption.description",
      status: "in-progress",
      priority: "critical",
      category: "infrastructure",
      estimatedCompletion: "Q1 2026",
      progress: 95,
      challengesKeys: ["developmentRoadmap.items.privacyEncryption.challenges.e2e"],
      impactKey: "developmentRoadmap.items.privacyEncryption.impact"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check className="h-4 w-4 text-success-green" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "planned":
        return <Target className="h-4 w-4 text-amber-500" />;
      case "researching":
        return <AlertCircle className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success-green";
      case "in-progress":
        return "bg-blue-500";
      case "planned":
        return "bg-amber-500";
      case "researching":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "urgent-red";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-blue-500";
      case "low":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "data":
        return <Database className="h-4 w-4" />;
      case "features":
        return <Zap className="h-4 w-4" />;
      case "infrastructure":
        return <Shield className="h-4 w-4" />;
      case "ai":
        return <Code className="h-4 w-4" />;
      case "legal":
        return <FileText className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const filteredItems = selectedCategory === "all" 
    ? roadmapItems 
    : roadmapItems.filter(item => item.category === selectedCategory);

  const categoryStats = {
    all: roadmapItems.length,
    data: roadmapItems.filter(item => item.category === "data").length,
    features: roadmapItems.filter(item => item.category === "features").length,
    infrastructure: roadmapItems.filter(item => item.category === "infrastructure").length,
    ai: roadmapItems.filter(item => item.category === "ai").length,
    legal: roadmapItems.filter(item => item.category === "legal").length,
  };

  const overallProgress = Math.round(
    roadmapItems.reduce((acc, item) => acc + (item.progress || 0), 0) / roadmapItems.length
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="gradient-hero text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-900 dark:text-white">
                {t('developmentRoadmap.hero.title')}
              </h1>
              <p className="text-xl text-blue-900 dark:text-blue-100 max-w-4xl mx-auto mb-8">
                {t('developmentRoadmap.hero.description')}
              </p>
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-bold">{overallProgress}%</div>
                  <div className="text-blue-900 dark:text-blue-200 text-sm">{t('developmentRoadmap.progress.overall')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{roadmapItems.filter(item => item.status === "completed").length}</div>
                  <div className="text-blue-900 dark:text-blue-200 text-sm">{t('developmentRoadmap.stats.completed')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{roadmapItems.filter(item => item.status === "in-progress").length}</div>
                  <div className="text-blue-900 dark:text-blue-200 text-sm">{t('developmentRoadmap.stats.inProgress')}</div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-6">{t('developmentRoadmap.mission.title')}</h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            <ScrollReveal delay={0.1}>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-3">{t('developmentRoadmap.mission.accessToJustice.title')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('developmentRoadmap.mission.accessToJustice.description')}
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-3">{t('developmentRoadmap.mission.privacyFirst.title')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('developmentRoadmap.mission.privacyFirst.description')}
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-3">{t('developmentRoadmap.mission.continuousImprovement.title')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('developmentRoadmap.mission.continuousImprovement.description')}
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Roadmap Items */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4 md:mb-0">Development Progress</h2>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                  data-testid="filter-all"
                >
                  {t('developmentRoadmap.categories.all')} ({categoryStats.all})
                </Button>
                <Button
                  variant={selectedCategory === "data" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("data")}
                  data-testid="filter-data"
                >
                  <Database className="h-4 w-4 mr-1" />
                  {t('developmentRoadmap.categories.data')} ({categoryStats.data})
                </Button>
                <Button
                  variant={selectedCategory === "features" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("features")}
                  data-testid="filter-features"
                >
                  <Zap className="h-4 w-4 mr-1" />
                  {t('developmentRoadmap.categories.features')} ({categoryStats.features})
                </Button>
                <Button
                  variant={selectedCategory === "ai" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("ai")}
                  data-testid="filter-ai"
                >
                  <Code className="h-4 w-4 mr-1" />
                  {t('developmentRoadmap.categories.ai')} ({categoryStats.ai})
                </Button>
                <Button
                  variant={selectedCategory === "infrastructure" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("infrastructure")}
                  data-testid="filter-infrastructure"
                >
                  <Shield className="h-4 w-4 mr-1" />
                  {t('developmentRoadmap.categories.infrastructure')} ({categoryStats.infrastructure})
                </Button>
              </div>
            </div>
          </ScrollReveal>

          <div className="space-y-6">
            {filteredItems.map((item, index) => (
              <ScrollReveal key={item.id} delay={index * 0.1}>
                <RoadmapCard item={item} t={t} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Community & Feedback */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                {t('developmentRoadmap.getInvolved.title')}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t('developmentRoadmap.hero.openSourceNote')}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6">
            <ScrollReveal delay={0.1}>
              <CommunityCard
                icon={<Lightbulb className="h-6 w-6 text-white" />}
                title={t('developmentRoadmap.featureRequest.requestButton')}
                description={t('developmentRoadmap.getInvolved.feedback.description')}
                bgColor="bg-purple-600"
                onClick={() => setShowFeatureRequestModal(true)}
              />
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <CommunityCard
                icon={<BarChart3 className="h-6 w-6 text-white" />}
                title={t('developmentRoadmap.getInvolved.spread.title')}
                description={t('developmentRoadmap.getInvolved.spread.description')}
                bgColor="bg-amber-500"
              />
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.5}>
            <div className="text-center mt-12">
              <div className="space-x-4">
                <Button className="legal-blue legal-blue-hover font-bold py-3 px-6 rounded-lg">
                  <Github className="mr-2 h-4 w-4" />
                  {t('developmentRoadmap.getInvolved.contribute.title')}
                </Button>
                <Button className="success-green success-green-hover font-bold py-3 px-6 rounded-lg">
                  {t('developmentRoadmap.getInvolved.feedback.title')}
                </Button>
                <Link href="/case-guidance">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg">
                    {t('footer.getCaseGuidance')}
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Feature Request Modal */}
      <Dialog open={showFeatureRequestModal} onOpenChange={setShowFeatureRequestModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('developmentRoadmap.featureRequest.modalTitle')}</DialogTitle>
            <DialogDescription>
              {t('developmentRoadmap.featureRequest.description')}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitFeatureRequest} className="space-y-4">
            {/* Honeypot field for spam protection - hidden from users */}
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="space-y-2">
              <label htmlFor="feature-name" className="text-sm font-medium">
                {t('developmentRoadmap.featureRequest.nameLabel')}
              </label>
              <Input
                id="feature-name"
                type="text"
                placeholder={t('developmentRoadmap.featureRequest.namePlaceholder')}
                value={featureName}
                onChange={(e) => setFeatureName(e.target.value)}
                required
                data-testid="input-feature-name"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="feature-email" className="text-sm font-medium">
                {t('developmentRoadmap.featureRequest.emailLabel')}
              </label>
              <Input
                id="feature-email"
                type="email"
                placeholder={t('developmentRoadmap.featureRequest.emailPlaceholder')}
                value={featureEmail}
                onChange={(e) => setFeatureEmail(e.target.value)}
                required
                data-testid="input-feature-email"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="feature-description" className="text-sm font-medium">
                {t('developmentRoadmap.featureRequest.descriptionLabel')}
              </label>
              <Textarea
                id="feature-description"
                placeholder={t('developmentRoadmap.featureRequest.descriptionPlaceholder')}
                value={featureDescription}
                onChange={(e) => setFeatureDescription(e.target.value)}
                required
                rows={5}
                data-testid="textarea-feature-description"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFeatureRequestModal(false)}
                data-testid="button-cancel-feature-request"
              >
                {t('developmentRoadmap.featureRequest.cancelButton')}
              </Button>
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white"
                data-testid="button-submit-feature-request"
              >
                <Lightbulb className="mr-2 h-4 w-4" />
                {t('developmentRoadmap.featureRequest.submitButton')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
      
      {/* Privacy Footer Banner */}
      <div className="legal-blue text-white py-3 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">
              {t('helpSomeone.privacyBanner.text')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoadmapCard({ item, t }: { item: RoadmapItem; t: any }) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className="flex items-center space-x-1">
                {getStatusIcon(item.status)}
                <Badge className={`${getStatusColor(item.status)} text-white text-xs`}>
                  {t(`developmentRoadmap.status.${item.status.replace("-", "")}`)}
                </Badge>
              </div>
              <Badge className={`${getPriorityColor(item.priority)} text-white text-xs`}>
                {t(`developmentRoadmap.priority.${item.priority}`)}
              </Badge>
              <div className="flex items-center space-x-1 text-muted-foreground">
                {getCategoryIcon(item.category)}
                <span className="text-xs capitalize">{t(`developmentRoadmap.categories.${item.category}`)}</span>
              </div>
            </div>
            <CardTitle className="text-lg">{t(item.titleKey)}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{t(item.descriptionKey)}</p>
        
        {item.progress !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>{t('developmentRoadmap.roadmapItem.progress')}</span>
              <span>{item.progress}%</span>
            </div>
            <Progress value={item.progress} className="h-2" />
          </div>
        )}

        {item.estimatedCompletion && (
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <Clock className="h-4 w-4 mr-2" />
            <span>{t('developmentRoadmap.roadmapItem.estimatedCompletion')}: {item.estimatedCompletion}</span>
          </div>
        )}

        {item.challengesKeys && item.challengesKeys.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-foreground mb-2 text-sm">{t('developmentRoadmap.roadmapItem.challenges')}:</h4>
            <ul className="space-y-1">
              {item.challengesKeys.map((challengeKey, index) => (
                <li key={index} className="text-xs text-muted-foreground flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  {t(challengeKey)}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-muted p-3 rounded-lg">
          <h4 className="font-medium text-foreground mb-1 text-sm">{t('developmentRoadmap.roadmapItem.impact')}:</h4>
          <p className="text-xs text-muted-foreground">{t(item.impactKey)}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function DataSourceStatus({ name, status, description, coverage, cost, progress }: {
  name: string;
  status: string;
  description: string;
  coverage: string;
  cost: string;
  progress: number;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">{name}</h3>
          <Badge className={`${getStatusColor(status)} text-white text-xs`}>
            {status.replace("-", " ").toUpperCase()}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Coverage:</span>
            <span className="text-foreground">{coverage}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Cost:</span>
            <span className="text-foreground">{cost}</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Integration Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}

function CommunityCard({ icon, title, description, bgColor, onClick }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
  onClick?: () => void;
}) {
  return (
    <Card 
      className={`text-center hover:shadow-lg transition-all duration-300 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      data-testid={onClick ? `card-${title.toLowerCase().replace(/\s+/g, '-')}` : undefined}
    >
      <CardContent className="p-6">
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}>
          {icon}
        </div>
        <h3 className="font-semibold text-foreground mb-3">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function getStatusIcon(status: string) {
  switch (status) {
    case "completed":
      return <Check className="h-4 w-4 text-success-green" />;
    case "in-progress":
      return <Clock className="h-4 w-4 text-blue-500" />;
    case "planned":
      return <Target className="h-4 w-4 text-amber-500" />;
    case "researching":
      return <AlertCircle className="h-4 w-4 text-purple-500" />;
    default:
      return null;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "completed":
      return "success-green";
    case "in-progress":
      return "bg-blue-500";
    case "planned":
      return "bg-amber-500";
    case "researching":
      return "bg-purple-500";
    default:
      return "bg-gray-500";
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "critical":
      return "urgent-red";
    case "high":
      return "bg-orange-500";
    case "medium":
      return "bg-blue-500";
    case "low":
      return "bg-gray-500";
    default:
      return "bg-gray-500";
  }
}

function getCategoryIcon(category: string) {
  switch (category) {
    case "data":
      return <Database className="h-4 w-4" />;
    case "features":
      return <Zap className="h-4 w-4" />;
    case "infrastructure":
      return <Shield className="h-4 w-4" />;
    case "ai":
      return <Code className="h-4 w-4" />;
    case "legal":
      return <FileText className="h-4 w-4" />;
    default:
      return <Globe className="h-4 w-4" />;
  }
}
