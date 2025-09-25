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
import { Link } from "wouter";

import { PrivacyBanner } from "@/components/layout/privacy-banner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "planned" | "researching";
  priority: "critical" | "high" | "medium" | "low";
  category: "data" | "features" | "infrastructure" | "ai" | "legal";
  estimatedCompletion?: string;
  dependencies?: string[];
  progress?: number;
  challenges?: string[];
  impact: string;
}

export default function DevelopmentRoadmap() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const roadmapItems: RoadmapItem[] = [
    {
      id: "courtlistener-integration",
      title: "CourtListener API Integration",
      description: "Complete integration with Free Law Project's CourtListener API for 8.4+ million court opinions and federal dockets",
      status: "completed",
      priority: "critical",
      category: "data",
      progress: 100,
      impact: "Provides foundational access to federal case law and court records"
    },
    {
      id: "pacer-authentication",
      title: "PACER Authentication & Data Access",
      description: "Implement PACER authentication API and cost-effective document retrieval system",
      status: "in-progress",
      priority: "high",
      category: "data",
      estimatedCompletion: "Q1 2025",
      progress: 45,
      challenges: ["Cost management for $0.10/page", "Rate limiting compliance", "Bulk data optimization"],
      impact: "Access to 500M+ federal court documents and real-time case updates"
    },
    {
      id: "state-statutes-api",
      title: "State Statutes Database",
      description: "Integration with Cornell LII, GovInfo.gov, and state legislature APIs for current statutes",
      status: "in-progress",
      priority: "high",
      category: "data",
      estimatedCompletion: "Q2 2025",
      progress: 30,
      impact: "Comprehensive coverage of federal and state legal codes"
    },
    {
      id: "ai-guidance-engine",
      title: "AI Legal Guidance Engine",
      description: "Advanced AI system for generating personalized legal guidance based on case parameters",
      status: "in-progress",
      priority: "critical",
      category: "ai",
      estimatedCompletion: "Q2 2025",
      progress: 65,
      challenges: ["Legal accuracy validation", "Bias detection and mitigation", "Jurisdiction-specific nuances"],
      impact: "Core functionality for personalized legal assistance"
    },
    {
      id: "judge-analytics",
      title: "Judge & Court Analytics",
      description: "Statistical analysis of sentencing patterns, plea agreements, and judicial decision-making",
      status: "researching",
      priority: "medium",
      category: "data",
      estimatedCompletion: "Q3 2025",
      challenges: ["Data privacy concerns", "Statistical significance", "Bias in historical data"],
      impact: "Predictive insights for case strategy and outcomes"
    },
    {
      id: "mobile-app",
      title: "Mobile Application",
      description: "Native mobile apps for iOS and Android with offline capabilities for emergency situations",
      status: "planned",
      priority: "high",
      category: "features",
      estimatedCompletion: "Q3 2025",
      dependencies: ["ai-guidance-engine"],
      impact: "Accessibility during arrest and emergency situations"
    },
    {
      id: "multilingual-support",
      title: "Multi-language Support",
      description: "Translation system for Spanish, French, and other common languages in criminal justice",
      status: "planned",
      priority: "medium",
      category: "features",
      estimatedCompletion: "Q4 2025",
      impact: "Expanded access for non-English speaking defendants"
    },
    {
      id: "legal-aid-directory",
      title: "Legal Aid Organization Directory",
      description: "Comprehensive database of public defenders and legal aid organizations nationwide",
      status: "in-progress",
      priority: "high",
      category: "data",
      estimatedCompletion: "Q1 2025",
      progress: 75,
      impact: "Direct connection to legal representation resources"
    },
    {
      id: "real-time-alerts",
      title: "Real-time Case Alerts",
      description: "Notification system for court dates, deadline changes, and case updates",
      status: "planned",
      priority: "medium",
      category: "features",
      estimatedCompletion: "Q4 2025",
      dependencies: ["pacer-authentication", "mobile-app"],
      impact: "Prevention of missed court appearances and deadlines"
    },
    {
      id: "privacy-encryption",
      title: "Advanced Privacy & Encryption",
      description: "End-to-end encryption and enhanced privacy protections for sensitive legal consultations",
      status: "in-progress",
      priority: "critical",
      category: "infrastructure",
      estimatedCompletion: "Q1 2025",
      progress: 80,
      impact: "Maximum privacy protection for vulnerable users"
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
      <PrivacyBanner />
      <Header />

      {/* Hero Section */}
      <section className="gradient-hero text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Development Roadmap
              </h1>
              <p className="text-xl text-blue-900 dark:text-blue-100 max-w-4xl mx-auto mb-8">
                Transparency in our mission to expand access to justice through technology. 
                Track our progress as we build a comprehensive legal assistance platform.
              </p>
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-bold">{overallProgress}%</div>
                  <div className="text-blue-900 dark:text-blue-200 text-sm">Overall Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{roadmapItems.filter(item => item.status === "completed").length}</div>
                  <div className="text-blue-900 dark:text-blue-200 text-sm">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{roadmapItems.filter(item => item.status === "in-progress").length}</div>
                  <div className="text-blue-900 dark:text-blue-200 text-sm">In Progress</div>
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
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission & Principles</h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            <ScrollReveal delay={0.1}>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-3">Access to Justice</h3>
                  <p className="text-sm text-muted-foreground">
                    Making legal guidance accessible to everyone, regardless of economic status or location
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
                  <h3 className="font-semibold text-foreground mb-3">Privacy First</h3>
                  <p className="text-sm text-muted-foreground">
                    Protecting user privacy with ephemeral sessions and no data retention
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
                  <h3 className="font-semibold text-foreground mb-3">Continuous Improvement</h3>
                  <p className="text-sm text-muted-foreground">
                    Iterating based on user feedback and evolving legal landscape
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
                  All ({categoryStats.all})
                </Button>
                <Button
                  variant={selectedCategory === "data" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("data")}
                  data-testid="filter-data"
                >
                  <Database className="h-4 w-4 mr-1" />
                  Data ({categoryStats.data})
                </Button>
                <Button
                  variant={selectedCategory === "features" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("features")}
                  data-testid="filter-features"
                >
                  <Zap className="h-4 w-4 mr-1" />
                  Features ({categoryStats.features})
                </Button>
                <Button
                  variant={selectedCategory === "ai" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("ai")}
                  data-testid="filter-ai"
                >
                  <Code className="h-4 w-4 mr-1" />
                  AI ({categoryStats.ai})
                </Button>
                <Button
                  variant={selectedCategory === "infrastructure" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("infrastructure")}
                  data-testid="filter-infrastructure"
                >
                  <Shield className="h-4 w-4 mr-1" />
                  Infrastructure ({categoryStats.infrastructure})
                </Button>
              </div>
            </div>
          </ScrollReveal>

          <div className="space-y-6">
            {filteredItems.map((item, index) => (
              <ScrollReveal key={item.id} delay={index * 0.1}>
                <RoadmapCard item={item} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Data Sources Status */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Data Integration Status
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ScrollReveal delay={0.1}>
              <DataSourceStatus
                name="CourtListener API"
                status="completed"
                description="8.4M+ court opinions and federal dockets"
                coverage="Federal Courts"
                cost="Free"
                progress={100}
              />
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <DataSourceStatus
                name="PACER Integration"
                status="in-progress"
                description="500M+ federal court documents"
                coverage="Federal Courts"
                cost="$0.10/page"
                progress={45}
              />
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <DataSourceStatus
                name="State Statutes"
                status="in-progress"
                description="Federal and state legal codes"
                coverage="All Jurisdictions"
                cost="Free"
                progress={30}
              />
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <DataSourceStatus
                name="DOJ Statistics"
                status="completed"
                description="Crime data and justice statistics"
                coverage="National"
                cost="Free"
                progress={100}
              />
            </ScrollReveal>

            <ScrollReveal delay={0.5}>
              <DataSourceStatus
                name="Legal Aid Directory"
                status="in-progress"
                description="Public defender and legal aid contacts"
                coverage="Nationwide"
                cost="Free"
                progress={75}
              />
            </ScrollReveal>

            <ScrollReveal delay={0.6}>
              <DataSourceStatus
                name="Judge Analytics"
                status="researching"
                description="Sentencing patterns and judicial data"
                coverage="Variable"
                cost="TBD"
                progress={10}
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Community & Feedback */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Community & Open Development
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                We believe in transparent development and community input. Here's how you can participate.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ScrollReveal delay={0.1}>
              <CommunityCard
                icon={<Github className="h-6 w-6 text-white" />}
                title="Open Source"
                description="Core components available on GitHub for community review and contribution"
                bgColor="legal-blue"
              />
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <CommunityCard
                icon={<Users className="h-6 w-6 text-white" />}
                title="Legal Expert Review"
                description="Partnership with legal professionals for accuracy and ethical guidelines"
                bgColor="success-green"
              />
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <CommunityCard
                icon={<Lightbulb className="h-6 w-6 text-white" />}
                title="Feature Requests"
                description="Community-driven feature suggestions and priority voting"
                bgColor="bg-purple-600"
              />
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <CommunityCard
                icon={<BarChart3 className="h-6 w-6 text-white" />}
                title="Impact Metrics"
                description="Regular reporting on usage, outcomes, and social impact"
                bgColor="bg-amber-500"
              />
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.5}>
            <div className="text-center mt-12">
              <div className="space-x-4">
                <Button className="legal-blue legal-blue-hover font-bold py-3 px-6 rounded-lg">
                  <Github className="mr-2 h-4 w-4" />
                  View on GitHub
                </Button>
                <Button className="success-green success-green-hover font-bold py-3 px-6 rounded-lg">
                  Provide Feedback
                </Button>
                <Link href="/case-guidance">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg">
                    Try the Platform
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
      
      {/* Privacy Footer Banner */}
      <div className="legal-blue text-white py-3 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">
              <strong>Privacy First:</strong> We do not store your personal data — all input deleted after session.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoadmapCard({ item }: { item: RoadmapItem }) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className="flex items-center space-x-1">
                {getStatusIcon(item.status)}
                <Badge className={`${getStatusColor(item.status)} text-white text-xs`}>
                  {item.status.replace("-", " ").toUpperCase()}
                </Badge>
              </div>
              <Badge className={`${getPriorityColor(item.priority)} text-white text-xs`}>
                {item.priority.toUpperCase()}
              </Badge>
              <div className="flex items-center space-x-1 text-muted-foreground">
                {getCategoryIcon(item.category)}
                <span className="text-xs capitalize">{item.category}</span>
              </div>
            </div>
            <CardTitle className="text-lg">{item.title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{item.description}</p>
        
        {item.progress !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{item.progress}%</span>
            </div>
            <Progress value={item.progress} className="h-2" />
          </div>
        )}

        {item.estimatedCompletion && (
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <Clock className="h-4 w-4 mr-2" />
            <span>Target: {item.estimatedCompletion}</span>
          </div>
        )}

        {item.challenges && item.challenges.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-foreground mb-2 text-sm">Current Challenges:</h4>
            <ul className="space-y-1">
              {item.challenges.map((challenge, index) => (
                <li key={index} className="text-xs text-muted-foreground flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  {challenge}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-muted p-3 rounded-lg">
          <h4 className="font-medium text-foreground mb-1 text-sm">Impact:</h4>
          <p className="text-xs text-muted-foreground">{item.impact}</p>
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

function CommunityCard({ icon, title, description, bgColor }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
}) {
  return (
    <Card className="text-center hover:shadow-lg transition-all duration-300">
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
