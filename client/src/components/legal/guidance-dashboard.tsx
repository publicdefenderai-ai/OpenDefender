import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Download,
  Phone,
  MapPin,
  ExternalLink,
  Shield,
  Scale,
  FileText,
  Users,
  Calendar,
  Eye,
  EyeOff,
  ArrowRight,
  Gavel,
  X,
  Building,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  Bookmark
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { generateGuidancePDF } from "@/lib/pdf-generator";

interface ImmediateAction {
  action: string;
  urgency: 'urgent' | 'high' | 'medium' | 'low';
}

interface PrecedentCase {
  id: string;
  caseName: string;
  citation: string;
  court: string;
  courtLevel: 'supreme' | 'appellate' | 'trial' | 'unknown';
  jurisdiction: string;
  dateFiled: string;
  relevanceScore: number;
  matchedChargeCategories: string[];
  excerpt?: string;
  url?: string;
  absoluteUrl?: string;
}

interface TierValidation {
  name: string;
  score: number;
  checksPerformed: number;
  checksPassed: number;
  issues: Array<{
    type: string;
    severity: 'error' | 'warning' | 'info';
    message: string;
  }>;
}

interface EnhancedGuidanceData {
  sessionId: string;
  overview: string;
  criticalAlerts: string[];
  immediateActions: ImmediateAction[];
  nextSteps: string[];
  deadlines: Array<{
    event: string;
    timeframe: string;
    description: string;
    priority: 'critical' | 'important' | 'normal';
    daysFromNow?: number;
  }>;
  rights: string[];
  resources: Array<{
    type: string;
    description: string;
    contact: string;
    hours?: string;
    website?: string;
  }>;
  warnings: string[];
  evidenceToGather: string[];
  courtPreparation: string[];
  avoidActions: string[];
  timeline: Array<{
    stage: string;
    description: string;
    timeframe: string;
    completed: boolean;
  }>;
  chargeClassifications?: Array<{
    name: string;
    classification: string;
    code: string;
  }>;
  validation?: {
    confidenceScore: number;
    isValid: boolean;
    summary: string;
    checksPerformed: number;
    checksPassed: number;
    issues: Array<{
      type: string;
      severity: 'error' | 'warning' | 'info';
      message: string;
      suggestion?: string;
    }>;
    tiers?: {
      tier1: TierValidation;
      tier2?: TierValidation;
    };
    precedents?: PrecedentCase[];
  };
  caseData: {
    jurisdiction: string;
    charges: string;
    caseStage: string;
    custodyStatus: string;
    hasAttorney: boolean;
  };
}

interface GuidanceDashboardProps {
  guidance: EnhancedGuidanceData;
  onClose: () => void;
  onDeleteSession: () => void;
  onShowPublicDefender?: () => void;
  onShowLegalAid?: () => void;
}

// Utility function to format charge names in plain English
const formatChargeName = (name: string): string => {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Get urgency badge color
const getUrgencyBadgeVariant = (urgency: string) => {
  switch (urgency) {
    case 'urgent':
      return 'destructive';
    case 'high':
      return 'default';
    case 'medium':
      return 'secondary';
    case 'low':
      return 'outline';
    default:
      return 'outline';
  }
};

// Get court level badge variant
const getCourtLevelBadge = (level: string) => {
  switch (level) {
    case 'supreme':
      return { variant: 'default' as const, label: 'Supreme Court' };
    case 'appellate':
      return { variant: 'secondary' as const, label: 'Appellate Court' };
    case 'trial':
      return { variant: 'outline' as const, label: 'Trial Court' };
    default:
      return { variant: 'outline' as const, label: 'Court' };
  }
};

// Precedent Cases Section with Feedback
function PrecedentCasesSection({ 
  precedents, 
  sessionId,
  jurisdiction,
  caseStage
}: { 
  precedents: PrecedentCase[]; 
  sessionId: string;
  jurisdiction: string;
  caseStage: string;
}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, boolean | null>>({});
  const [isExpanded, setIsExpanded] = useState(false);

  const feedbackMutation = useMutation({
    mutationFn: async ({ caseId, caseName, isHelpful, chargeCategory }: { 
      caseId: string; 
      caseName: string; 
      isHelpful: boolean;
      chargeCategory?: string;
    }) => {
      return apiRequest('POST', '/api/case-feedback', {
        sessionId,
        caseId,
        caseName,
        jurisdiction,
        chargeCategory,
        isHelpful,
        caseStage,
      });
    },
    onSuccess: (_, variables) => {
      setFeedbackGiven(prev => ({ ...prev, [variables.caseId]: variables.isHelpful }));
    },
  });

  const handleFeedback = (precedent: PrecedentCase, isHelpful: boolean) => {
    feedbackMutation.mutate({
      caseId: precedent.id,
      caseName: precedent.caseName,
      isHelpful,
      chargeCategory: precedent.matchedChargeCategories[0],
    });
  };

  const displayedPrecedents = isExpanded ? precedents : precedents.slice(0, 3);

  return (
    <Card className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
          <BookOpen className="h-5 w-5" />
          {t('guidance.precedents.title', 'Related Court Cases')}
          <Badge variant="secondary" className="ml-2">
            {precedents.length} {precedents.length === 1 ? 'case' : 'cases'}
          </Badge>
        </CardTitle>
        <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
          {t('guidance.precedents.description', 'Court cases similar to your situation that may help understand possible outcomes.')}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayedPrecedents.map((precedent) => {
          const courtInfo = getCourtLevelBadge(precedent.courtLevel);
          const hasFeedback = feedbackGiven[precedent.id] !== undefined;
          
          return (
            <div 
              key={precedent.id}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-purple-100 dark:border-purple-800"
              data-testid={`precedent-case-${precedent.id}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {precedent.caseName}
                    </h4>
                    <Badge variant={courtInfo.variant} className="text-xs">
                      {courtInfo.label}
                    </Badge>
                  </div>
                  
                  {precedent.citation && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {precedent.citation}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      {precedent.court}
                    </span>
                    {precedent.dateFiled && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(precedent.dateFiled).getFullYear()}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Scale className="h-3 w-3" />
                      {Math.round(precedent.relevanceScore * 100)}% match
                    </span>
                  </div>

                  {precedent.excerpt && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">
                      {precedent.excerpt}
                    </p>
                  )}

                  {precedent.matchedChargeCategories.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      {precedent.matchedChargeCategories.slice(0, 3).map((cat, i) => (
                        <Badge key={i} variant="outline" className="text-xs capitalize">
                          {cat.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  {(precedent.url || precedent.absoluteUrl) && (
                    <a 
                      href={precedent.absoluteUrl || precedent.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  
                  {/* Feedback buttons */}
                  <div className="flex items-center gap-1">
                    {hasFeedback ? (
                      <Badge variant={feedbackGiven[precedent.id] ? 'default' : 'secondary'} className="text-xs">
                        {feedbackGiven[precedent.id] ? 'Helpful' : 'Not Helpful'}
                      </Badge>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-500 hover:text-green-600"
                          onClick={() => handleFeedback(precedent, true)}
                          disabled={feedbackMutation.isPending}
                          data-testid={`btn-helpful-${precedent.id}`}
                        >
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                          onClick={() => handleFeedback(precedent, false)}
                          disabled={feedbackMutation.isPending}
                          data-testid={`btn-not-helpful-${precedent.id}`}
                        >
                          <ThumbsDown className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {precedents.length > 3 && (
          <Button
            variant="ghost"
            className="w-full text-purple-700 dark:text-purple-300"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded 
              ? t('guidance.precedents.showLess', 'Show fewer cases') 
              : t('guidance.precedents.showMore', `Show all ${precedents.length} cases`)
            }
            <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </Button>
        )}

        <p className="text-xs text-purple-600 dark:text-purple-400 text-center mt-2">
          {t('guidance.precedents.feedbackNote', 'Your feedback helps improve case relevance for others.')}
        </p>
      </CardContent>
    </Card>
  );
}

export function GuidanceDashboard({ guidance, onClose, onDeleteSession, onShowPublicDefender, onShowLegalAid }: GuidanceDashboardProps) {
  const { t, i18n } = useTranslation();
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['alerts', 'actions']));
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);

  const toggleAction = (action: string) => {
    const newCompleted = new Set(completedActions);
    if (newCompleted.has(action)) {
      newCompleted.delete(action);
    } else {
      newCompleted.add(action);
    }
    setCompletedActions(newCompleted);
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getImmediateActionsProgress = () => {
    if (guidance.immediateActions.length === 0) return 0;
    return Math.round((completedActions.size / guidance.immediateActions.length) * 100);
  };

  const getUrgentDeadlines = () => {
    return guidance.deadlines.filter(deadline => 
      deadline.priority === 'critical' && 
      (deadline.daysFromNow === undefined || deadline.daysFromNow <= 7)
    );
  };

  const handleExportPDF = () => {
    // Generate PDF entirely on client-side - no data sent to external servers
    generateGuidancePDF(guidance, i18n.language);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Case Summary Header */}
      <Card className="border-l-4 border-l-blue-600">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2 md:gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-xl">{t('legalGuidance.dashboard.title')}</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}
                className="gap-2"
                data-testid="button-toggle-sensitive-info"
              >
                {showSensitiveInfo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showSensitiveInfo ? t('legalGuidance.dashboard.hideDetails') : t('legalGuidance.dashboard.showDetails')}
              </Button>
            </div>
            <div className="flex gap-2 flex-wrap md:flex-nowrap">
              <Button variant="outline" onClick={onClose} className="flex-1 md:flex-none" data-testid="button-close-dashboard">
                {t('legalGuidance.dashboard.close')}
              </Button>
              <Button variant="outline" onClick={handleExportPDF} className="gap-2 flex-1 md:flex-none" data-testid="button-export-pdf">
                <Download className="h-4 w-4" />
                {t('legalGuidance.dashboard.exportPDF')}
              </Button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">{t('legalGuidance.dashboard.summary.charges')}</div>
              <div className="font-medium">
                {showSensitiveInfo ? (
                  <div className="flex flex-col gap-1">
                    {guidance.chargeClassifications && guidance.chargeClassifications.length > 0 ? (
                      guidance.chargeClassifications.map((charge, idx) => (
                        <div key={idx} className="flex items-center justify-center gap-2">
                          <span>{formatChargeName(charge.name)} ({charge.code})</span>
                          <Badge 
                            variant={charge.classification === 'felony' ? 'destructive' : 'secondary'}
                            className="text-xs"
                            data-testid={`badge-charge-classification-${idx}`}
                          >
                            {charge.classification.toUpperCase()}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      guidance.caseData.charges
                    )}
                  </div>
                ) : t('legalGuidance.dashboard.summary.protected')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">{t('legalGuidance.dashboard.summary.jurisdiction')}</div>
              <div className="font-medium">{guidance.caseData.jurisdiction.toUpperCase()}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">{t('legalGuidance.dashboard.summary.currentStage')}</div>
              <Badge variant="outline" className="capitalize">
                {guidance.caseData.caseStage}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">{t('legalGuidance.dashboard.summary.actionsCompleted')}</div>
              <div className="flex items-center gap-2">
                <Progress value={getImmediateActionsProgress()} className="flex-1" />
                <span className="text-sm font-medium">{getImmediateActionsProgress()}%</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Attorney Alert - Show if no attorney */}
      {!guidance.caseData.hasAttorney && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            <div className="font-semibold">
              Request{' '}
              {onShowPublicDefender ? (
                <button
                  onClick={onShowPublicDefender}
                  className="underline hover:text-red-900 dark:hover:text-red-100 font-bold"
                  data-testid="link-public-defender-alert"
                >
                  public defender
                </button>
              ) : (
                <Link href="/public-defender">
                  <span className="underline hover:text-red-900 dark:hover:text-red-100 font-bold cursor-pointer">
                    public defender
                  </span>
                </Link>
              )}{' '}
              immediately if you cannot afford attorney
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Section */}
      {guidance.overview && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <FileText className="h-5 w-5" />
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-900 dark:text-blue-100 leading-relaxed" data-testid="text-guidance-overview">
              {guidance.overview}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Simple Reassurance Message with Hidden Technical Details */}
      {guidance.validation && (
        <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-slate-700 dark:text-slate-300" data-testid="text-validation-reassurance">
              {t('guidance.validation.reassurance', 
                `This guidance is based on ${guidance.caseData.jurisdiction.toUpperCase()} criminal statutes and verified legal information. For your specific situation, we recommend speaking with a public defender or legal aid attorney.`
              )}
            </p>
            
            {/* Collapsible technical details for advanced users */}
            <Collapsible className="mt-3">
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-0 h-auto text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-transparent group"
                  data-testid="btn-show-verification-details"
                >
                  <ChevronRight className="h-3 w-3 mr-1 transition-transform group-data-[state=open]:rotate-90" />
                  {t('guidance.validation.showDetails', 'How we verified this')}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
                <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
                  {/* What we checked */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                      <span>{t('guidance.validation.checkedStatutes', 'Verified against state criminal statutes')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                      <span>{t('guidance.validation.checkedPenalties', 'Cross-referenced sentencing guidelines')}</span>
                    </div>
                    {guidance.validation.precedents && guidance.validation.precedents.length > 0 ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                        <span>{t('guidance.validation.foundCases', `Found ${guidance.validation.precedents.length} similar court case${guidance.validation.precedents.length !== 1 ? 's' : ''}`)}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <HelpCircle className="h-3.5 w-3.5 text-slate-400" />
                        <span>{t('guidance.validation.noCasesFound', 'We searched for similar court cases but none matched closely enough to include')}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Technical metrics - hidden by default, only for advanced users */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-600">
                    <p className="text-slate-500 dark:text-slate-500 mb-2">
                      {t('guidance.validation.technicalDetails', 'Technical details:')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="font-normal text-xs" data-testid="badge-confidence-score">
                        {Math.round(guidance.validation.confidenceScore * 100)}% confidence
                      </Badge>
                      <Badge variant="outline" className="font-normal text-xs">
                        {guidance.validation.checksPassed}/{guidance.validation.checksPerformed} checks passed
                      </Badge>
                      {guidance.validation.tiers?.tier1 && (
                        <Badge variant="outline" className="font-normal text-xs">
                          Statutes: {Math.round(guidance.validation.tiers.tier1.score * 100)}%
                        </Badge>
                      )}
                      {guidance.validation.tiers?.tier2 && (
                        <Badge variant="outline" className="font-normal text-xs">
                          Case law: {Math.round(guidance.validation.tiers.tier2.score * 100)}%
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Issues - only show if there are any */}
                  {guidance.validation.issues.length > 0 && (
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-600 space-y-1.5">
                      {guidance.validation.issues.map((issue, index) => (
                        <div 
                          key={index} 
                          className="flex items-start gap-2"
                          data-testid={`validation-issue-${index}`}
                        >
                          {issue.severity === 'info' ? (
                            <HelpCircle className="h-3.5 w-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                          )}
                          <span>{issue.message}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      )}

      {/* Precedent Cases Section */}
      {guidance.validation?.precedents && guidance.validation.precedents.length > 0 && (
        <PrecedentCasesSection 
          precedents={guidance.validation.precedents}
          sessionId={guidance.sessionId}
          jurisdiction={guidance.caseData.jurisdiction}
          caseStage={guidance.caseData.caseStage}
        />
      )}

      {/* Urgent Deadlines */}
      {getUrgentDeadlines().length > 0 && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <Clock className="h-5 w-5" />
              {t('legalGuidance.dashboard.upcomingDeadlines.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getUrgentDeadlines().map((deadline, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div>
                    <div className="font-medium">{deadline.event}</div>
                    <div className="text-sm text-muted-foreground">{deadline.description}</div>
                  </div>
                  <div className="text-right">
                    <Badge variant={deadline.priority === 'critical' ? 'destructive' : 'default'}>
                      {deadline.timeframe}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Immediate Actions Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              {t('legalGuidance.dashboard.immediateActions.title')}
            </div>
            <div className="flex items-center gap-2">
              <Progress value={getImmediateActionsProgress()} className="w-24" />
              <span className="text-sm font-medium">{getImmediateActionsProgress()}%</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {guidance.immediateActions.map((actionItem, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                <Checkbox
                  id={`action-${index}`}
                  checked={completedActions.has(actionItem.action)}
                  onCheckedChange={() => toggleAction(actionItem.action)}
                  className="mt-1"
                  data-testid={`checkbox-action-${index}`}
                />
                <label
                  htmlFor={`action-${index}`}
                  className={`flex-1 cursor-pointer ${
                    completedActions.has(actionItem.action) ? 'line-through text-muted-foreground' : ''
                  }`}
                >
                  {actionItem.action}
                </label>
                <Badge 
                  variant={getUrgencyBadgeVariant(actionItem.urgency)}
                  className="text-xs uppercase shrink-0"
                  data-testid={`badge-urgency-${index}`}
                >
                  {actionItem.urgency}
                </Badge>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            {t('legalGuidance.dashboard.immediateActions.completed', { count: completedActions.size, total: guidance.immediateActions.length })}
          </div>
        </CardContent>
      </Card>

      {/* Case Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            {t('legalGuidance.dashboard.caseTimeline.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {guidance.timeline.map((stage, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className={`w-4 h-4 rounded-full mt-2 ${
                  stage.completed ? 'bg-green-600' : 'bg-gray-300'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${
                      stage.completed ? 'text-green-700' : 'text-foreground'
                    }`}>
                      {stage.stage}
                    </h4>
                    <Badge variant={stage.completed ? 'default' : 'outline'}>
                      {stage.timeframe}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stage.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      {guidance.nextSteps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-indigo-600" />
              {t('legalGuidance.dashboard.nextSteps.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {guidance.nextSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold mt-1">
                    {index + 1}
                  </div>
                  <span className="flex-1 text-sm">{step}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expandable Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Your Rights */}
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Card className="cursor-pointer hover:bg-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    {t('legalGuidance.dashboard.yourRights.title')}
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </CardTitle>
              </CardHeader>
            </Card>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Card className="mt-2">
              <CardContent className="pt-6">
                <ul className="space-y-2">
                  {guidance.rights.map((right, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span className="text-sm">{right}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        {/* Local Resources */}
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Card className="cursor-pointer hover:bg-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    {t('legalGuidance.dashboard.localResources.title')}
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </CardTitle>
              </CardHeader>
            </Card>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Card className="mt-2">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {/* Public Defender Office - Only show if user doesn't have attorney */}
                  {!guidance.caseData.hasAttorney && onShowPublicDefender && (
                    <Button
                      variant="outline"
                      className="w-full justify-start h-auto py-4 px-4"
                      onClick={onShowPublicDefender}
                    >
                      <div className="flex items-start gap-3 w-full">
                        <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-base mb-1">Public Defender Office</div>
                          <p className="text-sm text-muted-foreground">
                            Search for public defender offices near you
                          </p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      </div>
                    </Button>
                  )}

                  {/* Legal Aid Organizations */}
                  {onShowLegalAid && (
                    <Button
                      variant="outline"
                      className="w-full justify-start h-auto py-4 px-4"
                      onClick={onShowLegalAid}
                    >
                      <div className="flex items-start gap-3 w-full">
                        <HelpCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-base mb-1">Legal Aid</div>
                          <p className="text-sm text-muted-foreground">
                            Find legal aid organizations and free legal services
                          </p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      </div>
                    </Button>
                  )}

                  {/* Court Self-Help Center */}
                  <Link href="/court-locator">
                    <Button
                      variant="outline"
                      className="w-full justify-start h-auto py-4 px-4"
                    >
                      <div className="flex items-start gap-3 w-full">
                        <Building className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-base mb-1">Court Self-Help Center</div>
                          <p className="text-sm text-muted-foreground">
                            Find local courthouses and court information
                          </p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      </div>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        {/* Evidence to Gather */}
        {guidance.evidenceToGather.length > 0 && (
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Card className="cursor-pointer hover:bg-muted/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-purple-600" />
                      {t('legalGuidance.dashboard.evidenceToGather.title')}
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </CardTitle>
                </CardHeader>
              </Card>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="mt-2">
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    {guidance.evidenceToGather.map((evidence, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-purple-600 mt-1">•</span>
                        <span className="text-sm">{evidence}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Important Warnings */}
        {guidance.warnings.length > 0 && (
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Card className="cursor-pointer hover:bg-muted/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      {t('legalGuidance.dashboard.importantWarnings.title')}
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </CardTitle>
                </CardHeader>
              </Card>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="mt-2">
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    {guidance.warnings.map((warning, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-red-600 mt-1">•</span>
                        <span className="text-sm">{warning}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Court Preparation */}
        {guidance.courtPreparation.length > 0 && (
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Card className="cursor-pointer hover:bg-muted/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gavel className="h-5 w-5 text-orange-600" />
                      {t('legalGuidance.dashboard.courtPreparation.title')}
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </CardTitle>
                </CardHeader>
              </Card>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="mt-2">
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    {guidance.courtPreparation.map((preparation, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-orange-600 mt-1">•</span>
                        <span className="text-sm">{preparation}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Actions to Avoid */}
        {guidance.avoidActions.length > 0 && (
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Card className="cursor-pointer hover:bg-muted/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <X className="h-5 w-5 text-red-500" />
                      {t('legalGuidance.dashboard.actionsToAvoid.title')}
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </CardTitle>
                </CardHeader>
              </Card>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="mt-2">
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    {guidance.avoidActions.map((action, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span className="text-sm">{action}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>

      {/* Privacy Notice */}
      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          <strong>{t('legalGuidance.dashboard.privacyNotice.title')}</strong> {t('legalGuidance.dashboard.privacyNotice.text')}
        </AlertDescription>
      </Alert>
    </div>
  );
}