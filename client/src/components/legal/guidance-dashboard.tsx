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
  ArrowRight,
  Gavel,
  X,
  Building,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  Bookmark,
  Lock,
  Briefcase,
  DollarSign,
  Heart,
  Home,
  Car,
  Baby,
  LifeBuoy
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { generateGuidancePDF } from "@/lib/pdf-generator";
import { criminalCharges } from "@shared/criminal-charges";
import { getChargeExplanation } from "@shared/charge-explanations";
import { getDocumentsForPhase, mapCaseStageToPhase, type LegalDocument } from "@shared/legal-documents";
import { MockQAList } from "@/components/legal/mock-qa-section";
import { getStateCourtInfo, getCourtLocatorUrl } from "@shared/state-court-websites";
import { CaseOutcomeStatistics } from "@/components/legal/case-outcome-statistics";

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
  generatedAt?: string; // ISO timestamp when guidance was generated
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
  mockQA?: Array<{
    question: string;
    suggestedResponse: string;
    explanation: string;
    category?: 'identity' | 'charges' | 'circumstances' | 'plea' | 'procedural' | 'general';
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
    selectedConcerns?: string[];
  };
}

interface GuidanceDashboardProps {
  guidance: EnhancedGuidanceData;
  onClose: () => void;
  onShowPublicDefender?: () => void;
  onShowLegalAid?: () => void;
  onExport?: () => void;
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

// Local Court Variation Disclaimer Component
function LocalCourtDisclaimer({ jurisdiction }: { jurisdiction: string }) {
  const { t } = useTranslation();
  const courtInfo = getStateCourtInfo(jurisdiction);
  const courtLocatorUrl = getCourtLocatorUrl(jurisdiction);
  
  if (!courtInfo) return null;
  
  return (
    <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
      <div className="flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="text-amber-800 dark:text-amber-200">
            <strong>{t('guidance.courtDisclaimer.title', 'Important:')}</strong>{' '}
            {t('guidance.courtDisclaimer.text', 'Court rules and deadlines vary by county. Check your local court to verify all deadlines and procedures.')}
          </p>
          {courtLocatorUrl && (
            <a 
              href={courtLocatorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 underline font-medium"
            >
              <Building className="h-3.5 w-3.5" />
              {t('guidance.courtDisclaimer.findCourt', 'Find your {{state}} court', { state: courtInfo.stateName })}
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

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
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <BookOpen className="h-5 w-5 text-muted-foreground" />
          {t('guidance.precedents.title', 'Related Court Cases')}
          <Badge variant="secondary" className="ml-2">
            {precedents.length} {precedents.length === 1 ? 'case' : 'cases'}
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
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
              className="p-4 bg-muted/30 rounded-lg border border-border"
              data-testid={`precedent-case-${precedent.id}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-medium text-foreground truncate">
                      {precedent.caseName}
                    </h4>
                    <Badge variant={courtInfo.variant} className="text-xs">
                      {courtInfo.label}
                    </Badge>
                  </div>
                  
                  {precedent.citation && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {precedent.citation}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
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
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
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
                      className="text-primary hover:text-primary/80"
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
            className="w-full text-muted-foreground hover:text-foreground"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded 
              ? t('guidance.precedents.showLess', 'Show fewer cases') 
              : t('guidance.precedents.showMore', `Show all ${precedents.length} cases`)
            }
            <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </Button>
        )}

        <p className="text-xs text-muted-foreground text-center mt-2">
          {t('guidance.precedents.feedbackNote', 'Your feedback helps improve case relevance for others.')}
        </p>
      </CardContent>
    </Card>
  );
}

// Your Charges Section - Plain English explanation of charges
function YourChargesSection({ 
  chargeClassifications
}: { 
  chargeClassifications?: Array<{ name: string; classification: string; code: string }>;
}) {
  const { t } = useTranslation();
  
  if (!chargeClassifications || chargeClassifications.length === 0) {
    return null;
  }

  // Get plain-language explanations for each charge
  const chargesWithExplanations = chargeClassifications.map(classification => {
    const explanation = getChargeExplanation(classification.name);
    return {
      name: formatChargeName(classification.name),
      code: classification.code,
      classification: classification.classification,
      explanation
    };
  });

  // Generate fallback description based on classification
  const getFallbackDescription = (charge: { name: string; classification: string; code: string }) => {
    const isFelony = charge.classification === 'felony';
    return isFelony 
      ? `This is a felony charge, which is a more serious criminal offense. Felonies can carry significant penalties including potential prison time. Your attorney can explain the specific elements the prosecution must prove.`
      : `This is a misdemeanor charge, which is generally less serious than a felony. Misdemeanors can still result in jail time, fines, and a criminal record. Your attorney can explain what the prosecution needs to prove.`;
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Gavel className="h-5 w-5 text-muted-foreground" />
          {t('guidance.yourCharges.title', 'Understanding Your Charges')}
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          {t('guidance.yourCharges.subtitle', 'Here\'s what these legal terms actually mean in plain English.')}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {chargesWithExplanations.map((charge, index) => (
          <div 
            key={index} 
            className="space-y-4"
            data-testid={`charge-explanation-${index}`}
          >
            {/* Charge Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-semibold text-foreground text-lg">{charge.name}</h4>
              </div>
              <Badge 
                variant={charge.classification === 'felony' ? 'destructive' : 'secondary'}
                className="shrink-0"
              >
                {charge.classification}
              </Badge>
            </div>

            {/* Plain Summary - use explanation or fallback */}
            <p className="text-sm text-foreground leading-relaxed">
              {charge.explanation?.plainSummary || getFallbackDescription(charge)}
            </p>

            {/* Degree Context - helps explain 1st vs 2nd degree etc. */}
            {charge.explanation?.degreeContext && (
              <div className="p-3 rounded-lg bg-muted/50 border-l-2 border-primary">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <span className="font-medium text-foreground">How degrees differ: </span>
                  {charge.explanation.degreeContext}
                </p>
              </div>
            )}

            {/* Key Legal Terms */}
            {charge.explanation?.keyTerms && charge.explanation.keyTerms.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">
                  Key legal terms the prosecution must prove:
                </p>
                <div className="space-y-3">
                  {charge.explanation.keyTerms.map((term, termIdx) => (
                    <div 
                      key={termIdx}
                      className="p-3 rounded-lg border border-border bg-muted/30"
                    >
                      <p className="text-sm">
                        <span className="font-semibold text-foreground">{term.term}: </span>
                        <span className="text-muted-foreground">{term.plainMeaning}</span>
                      </p>
                      {term.example && (
                        <p className="text-xs text-muted-foreground mt-1 italic">
                          Example: {term.example}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Separator between charges */}
            {index < chargesWithExplanations.length - 1 && (
              <div className="border-t border-border pt-4" />
            )}
          </div>
        ))}

        {/* Disclaimer */}
        <div className="p-3 rounded-lg bg-muted/50 border border-border mt-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Remember: </strong>
            The prosecution must prove every element of these charges beyond a reasonable doubt. Your attorney can help identify which elements may be challenged based on the evidence.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function DocumentsSection({ caseStage }: { caseStage: string }) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const phase = mapCaseStageToPhase(caseStage || 'just_arrested');
  const documents = getDocumentsForPhase(phase, 'criminal');
  
  if (documents.length === 0) return null;
  
  const importanceBadgeColor: Record<string, string> = {
    critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    important: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    informational: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  };
  
  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <FileText className="h-5 w-5 text-muted-foreground" />
          {t('documents.guidance.documentsSection.title', 'Documents You Should Have')}
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          {t('documents.guidance.documentsSection.description', 'Based on your case stage, you should have received these important documents. Click any document to learn more.')}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {documents.slice(0, isExpanded ? undefined : 4).map((doc: LegalDocument) => (
            <Link
              key={doc.id}
              href={`/document-library#${doc.slug}`}
              className="block"
            >
              <div 
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                data-testid={`doc-link-${doc.id}`}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">
                    {t(doc.titleKey)}
                  </p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {t(doc.descriptionKey)}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-3 shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${importanceBadgeColor[doc.importanceLevel]}`}>
                    {t(`documentLibrary.importance.${doc.importanceLevel}`)}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {documents.length > 4 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full mt-3 text-muted-foreground hover:text-foreground"
            data-testid="button-expand-documents"
          >
            {isExpanded 
              ? t('common.showLess', 'Show Less') 
              : t('common.showMore', 'Show {{count}} More', { count: documents.length - 4 })
            }
            <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </Button>
        )}
        
        <Link href="/document-library" className="block mt-4">
          <Button 
            variant="outline" 
            className="w-full"
            data-testid="button-view-document-library"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            {t('documents.guidance.documentsSection.viewLibrary', 'View All Documents')}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export function GuidanceDashboard({ guidance, onClose, onShowPublicDefender, onShowLegalAid, onExport }: GuidanceDashboardProps) {
  const { t, i18n } = useTranslation();
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['alerts', 'actions']));
  const [showExportWarning, setShowExportWarning] = useState(false);

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

  const handleExportClick = () => {
    setShowExportWarning(true);
  };

  const handleConfirmExport = () => {
    setShowExportWarning(false);
    // Generate PDF entirely on client-side - no data sent to external servers
    generateGuidancePDF(guidance, i18n.language);
    // Notify parent that export has been completed
    onExport?.();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Case Summary Header */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-xl text-foreground">{t('legalGuidance.dashboard.title')}</CardTitle>
              </div>
              {guidance.generatedAt && (
                <div className="text-xs text-muted-foreground flex items-center gap-1" data-testid="guidance-timestamp">
                  <Clock className="h-3 w-3" />
                  {t('legalGuidance.dashboard.generatedOn', 'Generated on')}: {new Date(guidance.generatedAt).toLocaleString(i18n.language === 'es' ? 'es-ES' : 'en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              )}
            </div>
            <div className="flex gap-2 flex-wrap md:flex-nowrap">
              <Button variant="outline" onClick={onClose} className="flex-1 md:flex-none" data-testid="button-close-dashboard">
                {t('legalGuidance.dashboard.close')}
              </Button>
              <Button variant="outline" onClick={handleExportClick} className="gap-2 flex-1 md:flex-none" data-testid="button-export-pdf">
                <Download className="h-4 w-4" />
                {t('legalGuidance.dashboard.exportPDF')}
              </Button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">{t('legalGuidance.dashboard.summary.charges')}</div>
              <div className="font-medium">
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
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <FileText className="h-5 w-5 text-muted-foreground" />
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed" data-testid="text-guidance-overview">
              {guidance.overview}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Your Charges Section */}
      <YourChargesSection 
        chargeClassifications={guidance.chargeClassifications}
      />

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

      {/* Documents You Should Have Section */}
      <DocumentsSection caseStage={guidance.caseData.caseStage} />

      {/* Urgent Deadlines */}
      {getUrgentDeadlines().length > 0 && (
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Clock className="h-5 w-5 text-muted-foreground" />
              {t('legalGuidance.dashboard.upcomingDeadlines.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getUrgentDeadlines().map((deadline, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border">
                  <div>
                    <div className="font-medium text-foreground">{deadline.event}</div>
                    <div className="text-sm text-muted-foreground">{deadline.description}</div>
                  </div>
                  <div className="text-right">
                    <Badge variant={deadline.priority === 'critical' ? 'destructive' : 'secondary'}>
                      {deadline.timeframe}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Local Court Variation Disclaimer */}
            <LocalCourtDisclaimer jurisdiction={guidance.caseData.jurisdiction} />
          </CardContent>
        </Card>
      )}

      {/* Immediate Actions Checklist */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-foreground">
              <CheckCircle className="h-5 w-5 text-muted-foreground" />
              {t('legalGuidance.dashboard.immediateActions.title')}
            </div>
            <div className="flex items-center gap-2">
              <Progress value={getImmediateActionsProgress()} className="w-24" />
              <span className="text-sm font-medium text-muted-foreground">{getImmediateActionsProgress()}%</span>
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

      {/* Enhanced Case Timeline */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            {t('legalGuidance.dashboard.caseTimeline.title')}
          </CardTitle>
          {/* Progress indicator */}
          {guidance.timeline.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span>{t('legalGuidance.dashboard.caseTimeline.progress', 'Case Progress')}</span>
                <span>{Math.round((guidance.timeline.filter(s => s.completed).length / guidance.timeline.length) * 100)}%</span>
              </div>
              <Progress 
                value={(guidance.timeline.filter(s => s.completed).length / guidance.timeline.length) * 100} 
                className="h-2"
              />
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Vertical connecting line */}
            <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-muted-foreground/20" />
            
            <div className="space-y-0">
              {guidance.timeline.map((stage, index) => {
                const isCurrentStage = !stage.completed && (index === 0 || guidance.timeline[index - 1]?.completed);
                const isCompleted = stage.completed;
                
                return (
                  <div key={index} className="relative flex items-start gap-4 pb-6 last:pb-0" data-testid={`timeline-stage-${index}`}>
                    {/* Stage indicator */}
                    <div className={`relative z-10 flex items-center justify-center w-6 h-6 rounded-full border-2 ${
                      isCompleted 
                        ? 'bg-primary border-primary text-primary-foreground' 
                        : isCurrentStage
                          ? 'bg-background border-primary ring-4 ring-primary/20'
                          : 'bg-background border-muted-foreground/30'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <span className={`text-xs font-semibold ${isCurrentStage ? 'text-primary' : 'text-muted-foreground'}`}>
                          {index + 1}
                        </span>
                      )}
                    </div>
                    
                    {/* Stage content */}
                    <div className={`flex-1 ${isCurrentStage ? 'bg-primary/5 -ml-2 pl-4 pr-3 py-2 rounded-lg border border-primary/20' : ''}`}>
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h4 className={`font-medium ${isCurrentStage ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {stage.stage}
                          {isCurrentStage && (
                            <Badge variant="default" className="ml-2 text-xs">
                              {t('legalGuidance.dashboard.caseTimeline.current', 'Current')}
                            </Badge>
                          )}
                        </h4>
                        <Badge variant={isCompleted ? 'secondary' : 'outline'} className="text-xs">
                          {stage.timeframe}
                        </Badge>
                      </div>
                      <p className={`text-sm mt-1 ${isCurrentStage ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {stage.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      {guidance.nextSteps.length > 0 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              {t('legalGuidance.dashboard.nextSteps.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {guidance.nextSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/20">
                  <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">
                    {index + 1}
                  </div>
                  <span className="flex-1 text-sm text-foreground">{step}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Case Outcome Statistics - What Happens in Cases Like Yours */}
      {guidance.caseData?.charges && (
        <CaseOutcomeStatistics 
          charges={guidance.caseData.charges}
          jurisdiction={guidance.caseData?.jurisdiction}
        />
      )}

      {/* Expandable Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Your Rights */}
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Card className="cursor-pointer hover:bg-muted/50 border-border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-foreground">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    {t('legalGuidance.dashboard.yourRights.title')}
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
              </CardHeader>
            </Card>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Card className="mt-2 border-border">
              <CardContent className="pt-6">
                <ul className="space-y-2">
                  {guidance.rights.map((right, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-muted-foreground mt-1">•</span>
                      <span className="text-sm text-foreground">{right}</span>
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
            <Card className="cursor-pointer hover:bg-muted/50 border-border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    {t('legalGuidance.dashboard.localResources.title')}
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
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

        {/* Personalized Mock Q&A Practice */}
        {guidance.mockQA && guidance.mockQA.length > 0 && (
          <MockQAList 
            items={guidance.mockQA}
            title={t('mockQA.personalizedTitle', 'Practice Questions for Your Case')}
          />
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

      {/* Concern-Based Support Resources */}
      {guidance.caseData?.selectedConcerns && guidance.caseData.selectedConcerns.length > 0 && (
        <Card className="border-rose-200 dark:border-rose-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <LifeBuoy className="h-5 w-5 text-rose-600" />
              {t('legalGuidance.dashboard.supportResources.title', 'Support Resources For You')}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t('legalGuidance.dashboard.supportResources.subtitle', 'Based on what you told us you\'re worried about, here are resources that may help:')}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {guidance.caseData.selectedConcerns.map((concernId) => {
                const concernConfig: Record<string, { icon: React.ElementType; color: string; href: string; available: boolean }> = {
                  employment: { icon: Briefcase, color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', href: '/support/employment', available: true },
                  finances: { icon: DollarSign, color: 'bg-green-500/10 text-green-600 dark:text-green-400', href: '/support/finances', available: true },
                  courtLogistics: { icon: Calendar, color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400', href: '/support/court-logistics', available: true },
                  mentalHealth: { icon: Heart, color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400', href: '/support/mental-health', available: true },
                  housing: { icon: Home, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', href: '/support/housing', available: false },
                  transportation: { icon: Car, color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400', href: '/support/transportation', available: false },
                  childcare: { icon: Baby, color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400', href: '/support/childcare', available: false },
                  familyCare: { icon: Users, color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400', href: '/support/family-care', available: false },
                  immigration: { icon: Shield, color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400', href: '/immigration-guidance', available: true },
                  reputation: { icon: Scale, color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400', href: '/support/reputation', available: false },
                };

                const config = concernConfig[concernId];
                if (!config) return null;

                const Icon = config.icon;
                const label = t(`legalGuidance.qaFlow.concernsStep.concernsCategories.${concernId}.label`);
                const description = t(`legalGuidance.qaFlow.concernsStep.concernsCategories.${concernId}.description`);

                if (config.available) {
                  return (
                    <Link key={concernId} href={config.href}>
                      <div className="group flex items-start gap-3 p-3 rounded-lg border hover:border-primary/40 hover:bg-muted/50 transition-all cursor-pointer">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.color} flex-shrink-0 transition-transform group-hover:scale-105`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm group-hover:text-primary transition-colors">{label}</div>
                          <div className="text-xs text-muted-foreground truncate">{description}</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                      </div>
                    </Link>
                  );
                }

                return (
                  <div key={concernId} className="flex items-start gap-3 p-3 rounded-lg border opacity-60">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.color} flex-shrink-0`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{label}</div>
                      <div className="text-xs text-muted-foreground">{t('support.comingSoon', 'Coming soon')}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t">
              <Link href="/support">
                <Button variant="outline" size="sm" className="w-full sm:w-auto group">
                  {t('legalGuidance.dashboard.supportResources.viewAll', 'View All Support Resources')}
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Privacy Notice */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-800 dark:text-blue-200">
              {t('legalGuidance.dashboard.privacyNotice.title', 'Your Privacy is Protected')}
            </h3>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-blue-800 dark:text-blue-200">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <span>{t('legalGuidance.dashboard.privacyNotice.encrypted', 'Data encrypted')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <span>{t('legalGuidance.dashboard.privacyNotice.autoDelete', 'Auto-deletes in 24 hours')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <span>{t('legalGuidance.dashboard.privacyNotice.piiRedacted', 'Personal info redacted')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Warning Dialog */}
      <AlertDialog open={showExportWarning} onOpenChange={setShowExportWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              {t('exportWarning.title', 'Important: Before You Export')}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 text-left">
                <p>{t('exportWarning.intro', 'This document contains details about your legal situation that you provided. Please be aware:')}</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span><strong>{t('exportWarning.notLegalAdvice', 'This is not legal advice')}</strong> — {t('exportWarning.notLegalAdviceDesc', "It's general legal information only")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span><strong>{t('exportWarning.notPrivileged', 'Not protected by attorney-client privilege')}</strong> — {t('exportWarning.notPrivilegedDesc', 'Documents you create and share may be requested by opposing parties in legal proceedings')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span><strong>{t('exportWarning.shareWithAttorney', 'Share only with your attorney')}</strong> — {t('exportWarning.shareWithAttorneyDesc', 'If you have a lawyer, share this with them first before anyone else')}</span>
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground italic">
                  {t('exportWarning.recommendation', 'We recommend discussing this guidance with a licensed attorney before taking any action.')}
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel', 'Cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmExport} data-testid="button-confirm-export">
              {t('exportWarning.confirmButton', 'I Understand, Export PDF')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}