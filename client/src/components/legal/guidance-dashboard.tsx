import React, { useState, useCallback } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { JuryInstructionBadge } from "@/components/legal/jury-instruction-badge";
import { useTranslation } from "react-i18next";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigationGuard } from "@/contexts/navigation-guard";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ChevronUp,
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
  AlertCircle,
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
  LifeBuoy,
  Activity,
  Loader2,
  Flag,
  Send,
  Printer
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { generateGuidancePDF } from "@/lib/pdf-generator";
import {
  getVerifiedCitation,
  getInstructionRef,
  getInstructionUrl,
  getInstructionPaywall,
} from "@shared/criminal-charges";
import {
  resolveGuidanceCharge,
  type GuidanceChargeClassification,
} from "@shared/guidance-charge-resolution";
import { getChargeExplanation } from "@shared/charge-explanations";
import { getDocumentsForPhase, mapCaseStageToPhase, type LegalDocument } from "@shared/legal-documents";
import { MockQAList } from "@/components/legal/mock-qa-section";
import { GuidancePrintPlan } from "@/components/legal/guidance-print-plan";
import { renderGuidanceRichText } from "@/components/legal/guidance-rich-text";
import { getStateCourtInfo, getCourtLocatorUrl } from "@shared/state-court-websites";
import { BrandShieldIcon } from "@/components/brand-logo";
import { normalizeGuidance, type GuidanceViewModel } from "@shared/guidance-view-model";
import { getLiveStatuteErrorKey } from "@/lib/live-statute-errors";

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

type EnhancedGuidanceData = GuidanceViewModel;

interface GuidanceDashboardProps {
  guidance: EnhancedGuidanceData;
  onClose: () => void;
  onNewSession?: () => void;
  onShowPublicDefender?: () => void;
  onShowLegalAid?: () => void;
  onExport?: () => void;
  guidanceMode?: 'ai' | 'rules';
}

const formatChargeName = (name: string): string => {
  // Canonical authority records already carry their official human-readable
  // title, including titles with hyphenated words. Only slug-shaped labels
  // without whitespace need title-casing.
  if (/\s/.test(name)) return name;
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

// categoryMeta used by CollateralConsequencesCard — defined at module level so the
// named component below is stable across renders (no inline object recreation).
const categoryMeta: Record<string, { label: string; Icon: React.ElementType; color: string }> = {
  drivers_license:        { label: "Driver's License",        Icon: Car,          color: "text-amber-600" },
  immigration:            { label: "Immigration Status",       Icon: Flag,         color: "text-red-600" },
  housing:                { label: "Housing",                  Icon: Home,         color: "text-orange-600" },
  employment:             { label: "Employment & Licensing",   Icon: Briefcase,    color: "text-blue-600" },
  custody:                { label: "Child Custody",            Icon: Baby,         color: "text-purple-600" },
  benefits:               { label: "Public Benefits",          Icon: DollarSign,   color: "text-green-600" },
  firearms:               { label: "Firearms Rights",          Icon: Shield,       color: "text-slate-600" },
  registry:               { label: "Sex Offender Registry",    Icon: AlertTriangle, color: "text-red-700" },
  supervision_revocation: { label: "Probation / Parole",       Icon: Activity,     color: "text-amber-700" },
  other:                  { label: "Other Consequence",        Icon: AlertTriangle, color: "text-slate-600" },
};

function CollateralConsequencesCard({
  items,
}: {
  items: Array<{ category: string; consequence: string; timing: string; actionNote: string }>;
}) {
  return (
    <Collapsible defaultOpen>
      <CollapsibleTrigger asChild>
        <Card className="cursor-pointer hover:bg-muted/50 border-amber-200 dark:border-amber-800">
          <CardHeader className="min-w-0">
            <CardTitle className="flex min-w-0 items-center justify-between gap-3 text-foreground">
              <div className="flex min-w-0 flex-1 items-center gap-2 break-words">
                <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                Beyond the Sentence: What Else May Be at Risk
                <Badge variant="secondary" className="shrink-0 text-xs">{items.length}</Badge>
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
        </Card>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Card className="mt-2 border-amber-200 dark:border-amber-800">
          <CardContent className="pt-5 space-y-1">
            <p className="text-xs text-muted-foreground pb-3">
              These are consequences that go beyond the sentence itself. They often take effect automatically, sometimes upon a guilty plea, before sentencing. Raise each one with your attorney before any plea decision.
            </p>
            <div className="space-y-3">
              {items.map((item, i) => {
                const meta = categoryMeta[item.category] || categoryMeta.other;
                const IconComp = meta.Icon;
                return (
                  <div key={i} className="p-3 rounded-lg border border-amber-100 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-900/10">
                    <div className="flex min-w-0 items-center gap-2 mb-1">
                      <IconComp className={`h-3.5 w-3.5 ${meta.color} flex-shrink-0`} />
                      <span className="min-w-0 break-words text-xs font-semibold text-foreground">{meta.label}</span>
                      <Badge variant="outline" className="ml-auto shrink-0 text-xs">{item.timing}</Badge>
                    </div>
                    <p className="text-sm text-foreground mb-1">{item.consequence}</p>
                    <p className="text-xs text-muted-foreground italic">{item.actionNote}</p>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col items-start gap-2 pt-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="min-w-0 text-xs text-muted-foreground">These risks vary by state and charge. Verify with your attorney.</p>
              <Link href="/collateral-consequences">
                <Button variant="outline" size="sm" className="h-7 shrink-0 gap-1 text-xs">
                  Full Guide <ExternalLink className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}

// Your Charges Section - Plain English explanation of charges
interface LiveStatuteResult {
  success: boolean;
  statute?: {
    title: string;
    content: string;
    citation: string;
    jurisdiction: string;
    url?: string;
    section: string;
  };
  error?: string;
}

function ChargeReadTheLaw({ jurisdiction, citation }: { jurisdiction: string; citation: string }) {
  const { t } = useTranslation();
  const [showStatute, setShowStatute] = useState(false);
  const [fetchEnabled, setFetchEnabled] = useState(false);

  const encodedCitation = encodeURIComponent(citation);

  const { data: liveData, isLoading, error: liveError } = useQuery<LiveStatuteResult>({
    queryKey: [`/api/openlaws/citation/${encodedCitation}`],
    enabled: fetchEnabled,
  });

  const handleToggle = () => {
    if (!showStatute) setFetchEnabled(true);
    setShowStatute(prev => !prev);
  };

  return (
    <div className="mt-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        className="text-primary hover:text-primary/80 p-0 h-auto font-medium text-sm"
        aria-expanded={showStatute}
        data-testid="live-statute-toggle"
      >
        <BookOpen className="h-3.5 w-3.5 mr-1.5" />
        {showStatute ? (
          <>
            <ChevronUp className="h-3.5 w-3.5 mr-1" />
            {t("statutes.liveText.hideStatuteText")}
          </>
        ) : (
          <>
            <ChevronDown className="h-3.5 w-3.5 mr-1" />
            {t("statutes.liveText.readLaw")}
          </>
        )}
      </Button>

      {showStatute && (
        <div
          className="mt-3 min-w-0 rounded-lg border border-border bg-muted/30 p-4"
          data-testid="live-statute-panel"
        >
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("statutes.liveText.fetching")}
            </div>
          ) : liveError || liveData?.error ? (
            <Alert variant="destructive" className="min-w-0">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="min-w-0 break-words">
                {t(`statutes.errors.${getLiveStatuteErrorKey(liveError, liveData?.error)}`, {
                  citation,
                })}
              </AlertDescription>
            </Alert>
          ) : liveData?.success && liveData.statute ? (
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">{liveData.statute.title}</p>
                  <p className="text-xs text-muted-foreground">{liveData.statute.citation}</p>
                </div>
                {liveData.statute.url && (
                  <a
                    href={liveData.statute.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 shrink-0"
                    aria-label={t("statutes.liveText.viewOnOpenLaws")}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
              <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto font-mono bg-background rounded p-2 border border-border/50">
                {liveData.statute.content}
              </div>
              <p className="text-xs text-muted-foreground">{t("statutes.liveText.source")}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("statutes.liveText.unavailable", { citation })}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function YourChargesSection({
  chargeClassifications,
  jurisdiction,
}: {
  chargeClassifications?: GuidanceChargeClassification[];
  jurisdiction?: string;
}) {
  const { t, i18n } = useTranslation();
  const normalizedJurisdiction = jurisdiction?.toUpperCase();
  const isAuthorityBacked = normalizedJurisdiction === "NY" ||
    normalizedJurisdiction === "TX" ||
    normalizedJurisdiction === "FL" ||
    normalizedJurisdiction === "PA" ||
    normalizedJurisdiction === "SC" ||
    normalizedJurisdiction === "IL" ||
    normalizedJurisdiction === "OH" ||
    normalizedJurisdiction === "GA";
  const { data: currentAuthorityCharges } = useQuery<{ charges?: Array<{ id: string }> }>({
    queryKey: ["/api/criminal-charges", "guidance-authority", normalizedJurisdiction],
    queryFn: async () => {
      const response = await fetch(
        `/api/criminal-charges?jurisdiction=${encodeURIComponent(normalizedJurisdiction ?? "")}&limit=500`,
      );
      if (!response.ok) throw new Error("Current authority could not be loaded");
      return response.json();
    },
    enabled: isAuthorityBacked,
    staleTime: 0,
    retry: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
  const currentAuthorityIds = new Set(
    currentAuthorityCharges?.charges?.map((charge) => charge.id) ?? [],
  );
  
  if (!chargeClassifications || chargeClassifications.length === 0) {
    return null;
  }

  // Get plain-language explanations for each charge.
  // Resolve the canonical entry to carry through the verified citation and
  // jury-instruction metadata required by the "Read the Law" button guard.
  const chargesWithExplanations = chargeClassifications.map(classification => {
    const authorityUnavailable = isAuthorityBacked &&
      !currentAuthorityIds.has(classification.id ?? "");
    const dbCharge = authorityUnavailable
      ? undefined
      : resolveGuidanceCharge(classification, jurisdiction);
    const verifiedCitation = dbCharge ? getVerifiedCitation(dbCharge) : null;
    const isCalifornia = jurisdiction?.toUpperCase() === 'CA';
    const explanation = (isCalifornia || authorityUnavailable) && !dbCharge
      ? undefined
      : getChargeExplanation(
          dbCharge?.name ?? classification.name,
          jurisdiction,
          i18n.language,
          dbCharge?.id,
        );
    return {
      name: formatChargeName(classification.name),
      id: classification.id,
      code: classification.code,
      classification: classification.classification,
      explanation,
      verifiedCitation,
      instructionRef: dbCharge ? getInstructionRef(dbCharge) : undefined,
      instructionUrl: dbCharge ? getInstructionUrl(dbCharge) : undefined,
      instructionPaywall: dbCharge ? getInstructionPaywall(dbCharge) : undefined,
      needsReselection: Boolean(
        (isCalifornia && !dbCharge) || authorityUnavailable,
      ),
      /** True when the plain-language explanation itself is pending attorney review.
       *  Driven by explanation.pendingAttorneyReview — an explicit per-entry flag
       *  distinct from dataConfidence (which reflects statutory-source quality and
       *  can be 'high' even while attorney review is still pending). */
      explanationPendingReview: explanation?.pendingAttorneyReview === true,
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

            {/* Pending-review warning — shown when explanation.pendingAttorneyReview is true.
                Uses the translation system so the warning is readable in the advocate's
                selected language (English, Spanish, or Chinese). */}
            {charge.explanationPendingReview && (
              <div className="flex items-start gap-2 p-2.5 rounded-md bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-800">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-snug">
                  <span className="font-semibold">
                    {t('guidance.yourCharges.pendingReviewWarning.title', 'Not yet attorney-reviewed.')}
                  </span>{" "}
                  {t('guidance.yourCharges.pendingReviewWarning.body', 'This explanation is a general starting point only. Verify specifics with a licensed criminal defense attorney before relying on it.')}
                </p>
              </div>
            )}

            {/* Translation-draft notice — shown when explanation is machine-translated
                and has not yet been reviewed by a fluent-speaker legal professional. */}
            {charge.explanation?.translationDraft && (
              <div className="flex items-start gap-2 p-2.5 rounded-md bg-blue-50 border border-blue-200 dark:bg-blue-950/30 dark:border-blue-800">
                <AlertTriangle className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800 dark:text-blue-300 leading-snug">
                  <span className="font-semibold">
                    {t('guidance.yourCharges.translationDraftWarning.title', 'Provisional translation.')}
                  </span>{" "}
                  {t('guidance.yourCharges.translationDraftWarning.body', 'This translation was machine-assisted and has not yet been reviewed by a bilingual legal professional. Verify critical terms with your attorney.')}
                </p>
              </div>
            )}

            {/* A neutral explanation is still useful when the selected jurisdiction
                has no verified overlay, but do not imply that comparative corpus
                text is state-specific guidance. */}
            {charge.explanation?.jurisdictionDetailMissing && (
              <div
                className="flex items-start gap-2 p-2.5 rounded-md bg-slate-50 border border-slate-200 dark:bg-slate-900/40 dark:border-slate-700"
                data-testid={`charge-jurisdiction-coverage-${index}`}
              >
                <AlertTriangle className="h-4 w-4 text-slate-600 dark:text-slate-300 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug">
                  <span className="font-semibold">
                    {t('guidance.yourCharges.jurisdictionCoverageWarning.title', 'State-specific detail not yet verified.')}
                  </span>{' '}
                  {t('guidance.yourCharges.jurisdictionCoverageWarning.body', 'This is general charge information. We do not have verified state-specific detail for this charge yet. Ask a licensed attorney to confirm the rule, deadlines, and penalties for your case.')}
                </p>
              </div>
            )}

             {charge.needsReselection && (
               <Alert
                 variant="default"
                 className="border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200"
                 data-testid={`charge-reselection-warning-${index}`}
               >
                 <AlertTriangle className="h-4 w-4" />
                 <AlertDescription>
                   <span className="font-semibold">
                     {i18n.language === 'es'
                       ? 'Se necesita volver a seleccionar el cargo.'
                       : i18n.language === 'zh'
                         ? '需要重新选择罪名。'
                         : 'Charge selection needs to be confirmed.'}
                   </span>{' '}
                   {i18n.language === 'es'
                   ? `Este registro histórico no coincide con la autoridad vigente de ${normalizedJurisdiction ?? 'este estado'}. Seleccione el cargo exacto de la lista actual o pida ayuda a un abogado.`
                     : i18n.language === 'zh'
                       ? `此历史记录无法与可核实的${normalizedJurisdiction ?? '该州'}现行法律匹配。请从当前列表中选择确切罪名，或向律师寻求帮助。`
                       : `This historical record does not match current verified ${normalizedJurisdiction ?? 'state'} authority. Choose the exact charge from the current list or ask an attorney for help.`}
                 </AlertDescription>
               </Alert>
             )}

             {/* Plain Summary - use explanation or fallback */}
            <p className="text-sm text-foreground leading-relaxed">
               {charge.explanation?.plainSummary || (
                 charge.needsReselection
                   ? (i18n.language === 'es'
                     ? `No podemos mostrar información específica de este cargo hasta confirmar el cargo exacto y la autoridad vigente de ${normalizedJurisdiction ?? 'este estado'}.`
                     : i18n.language === 'zh'
                       ? `在确认确切的${normalizedJurisdiction ?? '该州'}罪名和现行法律之前，我们无法显示此罪名的具体信息。`
                       : `We cannot show charge-specific information until the exact charge and current ${normalizedJurisdiction ?? 'state'} authority are confirmed.`)
                   : getFallbackDescription(charge)
               )}
            </p>

            {/* Jurisdiction-specific detail takes priority over the generic degree context
                when a shared/charge-explanation-jurisdiction-overlay.ts entry exists for
                the user's state. Falls back to the generic explanation otherwise. */}
            {charge.explanation?.jurisdictionDetail ? (
              <div className="p-3 rounded-lg bg-muted/50 border-l-2 border-primary">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <span className="font-medium text-foreground">
                    {jurisdiction ? `In ${jurisdiction}: ` : 'For this jurisdiction: '}
                  </span>
                  {charge.explanation.jurisdictionDetail.keyRule}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Source: {charge.explanation.jurisdictionDetail.citation}
                  {charge.explanation.jurisdictionDetail.penaltyClass && ` (${charge.explanation.jurisdictionDetail.penaltyClass})`}
                </p>
              </div>
            ) : charge.explanation?.degreeContext && (
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

            {/* Read the Law — only shown when the canonical citation gate verifies it. */}
            {jurisdiction && charge.verifiedCitation && (
              <ChargeReadTheLaw
                jurisdiction={jurisdiction}
                citation={charge.verifiedCitation}
              />
            )}

            {/* Jury Instruction Reference */}
            {charge.instructionRef && (
              <JuryInstructionBadge
                instructionRef={charge.instructionRef}
                instructionUrl={charge.instructionUrl ?? undefined}
                instructionPaywall={charge.instructionPaywall ?? undefined}
                chargeId={charge.id ?? charge.code}
                dataTestIdPrefix="link-instruction-dashboard"
                label={t('legalGuidance.qaFlow.caseDetails.juryInstruction')}
                tooltipText={t('legalGuidance.qaFlow.caseDetails.juryInstructionTooltip')}
                tooltipAriaLabel={t('legalGuidance.qaFlow.caseDetails.juryInstructionAriaLabel')}
              />
            )}

            {/* Separator between charges */}
            {index < chargesWithExplanations.length - 1 && (
              <div className="border-t border-border pt-4 mt-4" />
            )}
          </div>
        ))}

        {/* Disclaimer */}
        <div className="p-3 rounded-lg bg-muted/50 border border-border mt-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Remember: </strong>
            The prosecution must prove every element of these charges beyond a reasonable doubt. Your attorney can help identify which elements may be challenged based on the evidence. The sentencing ranges above are general estimates and are not specific to your state or your case. Actual penalties depend on your jurisdiction's statute and the facts of your case, which your attorney can confirm.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function DocumentsSection({ caseStage, guardedNavigate }: { caseStage: string; guardedNavigate: (href: string) => void }) {
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
            <button
              key={doc.id}
              onClick={() => guardedNavigate(`/document-library#${doc.slug}`)}
              className="block w-full text-left"
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
            </button>
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
        
        <div className="block mt-4">
          <Button 
            variant="outline" 
            className="w-full"
            data-testid="button-view-document-library"
            onClick={() => guardedNavigate('/document-library')}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            {t('documents.guidance.documentsSection.viewLibrary', 'View All Documents')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function GuidanceDashboard({ guidance, onClose, onNewSession, onShowPublicDefender, onShowLegalAid, onExport, guidanceMode = 'ai' }: GuidanceDashboardProps) {
  guidance = normalizeGuidance(guidance);
  const { t, i18n } = useTranslation();
  const [, setLocation] = useLocation();
  const { attemptNavigation } = useNavigationGuard();
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['alerts', 'actions']));
  const [showExportWarning, setShowExportWarning] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showFlagDialog, setShowFlagDialog] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const [flagSubmitted, setFlagSubmitted] = useState(false);

  const flagMutation = useMutation({
    mutationFn: async (reason: string) => {
      const bucket = guidance.validation
        ? guidance.validation.confidenceScore >= 0.8 ? 'high' : guidance.validation.confidenceScore >= 0.5 ? 'medium' : 'low'
        : undefined;
      return apiRequest('POST', '/api/guidance/flag', {
        flagReason: reason,
        jurisdiction: guidance.caseData?.jurisdiction,
        confidenceBucket: bucket,
        sessionIdHash: guidance.sessionId,
      });
    },
    onSuccess: () => {
      setFlagSubmitted(true);
    },
  });

  const guardedNavigate = useCallback((href: string) => {
    attemptNavigation(() => setLocation(href));
  }, [attemptNavigation, setLocation]);

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

  const practicalStarterActions = guidance.practicalStarterSteps.map(step =>
    t(`legalGuidance.dashboard.practicalPlan.${step}`),
  );
  const generatedPracticalActions = guidance.immediateActions.filter(action => action.treatment === 'practical');
  const legalInformationActions = guidance.immediateActions.filter(action => action.treatment !== 'practical');
  const practicalActions = [...practicalStarterActions, ...generatedPracticalActions.map(action => action.action)];

  const getPracticalActionsProgress = () => {
    if (practicalActions.length === 0) return 0;
    return Math.round((completedActions.size / practicalActions.length) * 100);
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

  const handleConfirmExport = async () => {
    setShowExportWarning(false);
    setIsExporting(true);
    try {
      const jurisdiction = guidance.caseData?.jurisdiction?.toUpperCase();
      if (
        ["NY", "TX", "FL", "PA", "SC", "IL", "OH", "GA"].includes(jurisdiction) &&
        guidance.chargeClassifications?.length
      ) {
        const authorityResponse = await fetch(
          `/api/criminal-charges?jurisdiction=${encodeURIComponent(jurisdiction)}&limit=500`,
        );
        if (!authorityResponse.ok) {
          throw new Error("Current charge authority could not be verified");
        }
        const authorityPayload = await authorityResponse.json() as {
          charges?: Array<{ id: string }>;
        };
        const currentIds = new Set(authorityPayload.charges?.map((charge) => charge.id) ?? []);
        if (guidance.chargeClassifications.some((charge) => !currentIds.has(charge.id ?? ""))) {
          throw new Error("One or more saved charges no longer has current authority");
        }
      }
      // Generate PDF entirely on client-side. No data sent to external servers.
      await generateGuidancePDF(guidance, i18n.language);
      // Notify parent that export has been completed
      onExport?.();
    } catch (err) {
      console.error('[PDF export error]', err);
      // Surface the failure — previously this threw silently and the dialog
      // just closed, leaving the user wondering why nothing happened.
      alert(t('exportWarning.exportFailed', 'PDF export failed. Please try again or use your browser\'s print function (Ctrl+P / Cmd+P).'));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <GuidancePrintPlan guidance={guidance} language={i18n.language} />
      <div className="w-full min-w-0 max-w-6xl mx-auto overflow-x-hidden p-6 space-y-6 print:hidden">
      {/* Case Summary Header */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Scale className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-xl text-foreground">
                  {guidance.chargeClassifications && guidance.chargeClassifications.length > 0
                    ? `Guidance: ${formatChargeName(guidance.chargeClassifications[0].name)} in ${(guidance.caseData?.jurisdiction ?? '').toUpperCase()}`
                    : `Case Roadmap: ${(guidance.caseData?.jurisdiction ?? '').toUpperCase()}`}
                </CardTitle>
                <Badge
                  variant="outline"
                  className="text-[11px] px-2 py-0 text-muted-foreground border-muted-foreground/30"
                  data-testid="badge-guidance-mode"
                >
                  {guidanceMode === 'rules'
                    ? t('legalGuidance.qaFlow.consent.badgeRules', 'Rules-based guidance')
                    : t('legalGuidance.qaFlow.consent.badgeAI', 'AI-powered guidance')}
                </Badge>
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
              {onNewSession && (
                <Button
                  variant="outline"
                  onClick={onNewSession}
                  className="flex-1 md:flex-none"
                  data-testid="button-new-session"
                >
                  {t('legalGuidance.dashboard.newSession', 'Start New Session')}
                </Button>
              )}
              <Button variant="outline" onClick={onClose} className="flex-1 md:flex-none" data-testid="button-close-dashboard">
                {t('legalGuidance.dashboard.close')}
              </Button>
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="gap-2 flex-1 md:flex-none print:hidden"
                data-testid="button-print-guidance"
              >
                <Printer className="h-4 w-4" />
                {t('legalGuidance.dashboard.print', 'Print')}
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
                        <span>{formatChargeName(charge.name)}</span>
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
                <Progress value={getPracticalActionsProgress()} className="flex-1" />
                <span className="text-sm font-medium">{getPracticalActionsProgress()}%</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="editorial-card border-l-4 border-l-primary bg-primary/[0.03]" data-testid="guidance-next-step">
        <CardContent className="p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary mb-1">
              {t('legalGuidance.dashboard.nextStep.label', 'Start here')}
            </p>
            <h2 className="font-semibold text-foreground">
              {t('legalGuidance.dashboard.nextStep.title', 'Review your practical next steps')}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {t('legalGuidance.dashboard.nextStep.description', 'Start with the practical plan, then use the timeline and deadlines to prepare for what comes next.')}
            </p>
          </div>
          <Button
            onClick={() => document.getElementById('practical-action-plan')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="w-full sm:w-auto shrink-0"
            data-testid="button-guidance-next-step"
          >
            {t('legalGuidance.dashboard.nextStep.button', 'View practical plan')}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>

      {/* (Attorney notice folded into Urgent Takeaways below) */}

      {/* Safety flag notice — shown when server stripped dangerous content */}
      {guidance.dangerFlags && guidance.dangerFlags.length > 0 && (
        <Alert className="border-orange-300 bg-orange-50 dark:bg-orange-900/20" data-testid="banner-safety-flag">
          <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          <AlertDescription className="text-orange-800 dark:text-orange-200 italic">
            Some specific recommendations were removed. Consult a licensed attorney for complete guidance.
          </AlertDescription>
        </Alert>
      )}

      {/* Urgent Takeaways — AI critical alerts only (time-sensitive, case-specific) */}
      {guidance.criticalAlerts.length > 0 && (
        <Alert
          className="border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700"
          data-testid="section-critical-alerts"
          data-guidance-section="criticalAlerts"
        >
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            {guidance.criticalAlerts.length > 1 && (
              <p className="font-semibold text-sm mb-2">Urgent Takeaways</p>
            )}
            {guidance.criticalAlerts.length === 1 ? (
              <span className="text-sm" data-testid="critical-alert-0">{renderGuidanceRichText(guidance.criticalAlerts[0], guardedNavigate)}</span>
            ) : (
              <ul className="space-y-1.5 text-sm list-none">
                {guidance.criticalAlerts.map((alert, index) => (
                  <li key={index} data-testid={`critical-alert-${index}`} className="flex items-start gap-2">
                    <span className="mt-0.5 flex-shrink-0">•</span>
                    <span>{renderGuidanceRichText(alert, guardedNavigate)}</span>
                  </li>
                ))}
              </ul>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Section */}
      {guidance.overview && (
        <Card className="border-border" data-guidance-section="overview">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <FileText className="h-5 w-5 text-muted-foreground" />
                Overview
              </CardTitle>
              {guidance.validation && (
                guidance.validation.confidenceScore < 0.7 ||
                guidance.validation.issues.some(i => i.severity === 'error' || i.severity === 'warning')
              ) && (
                <p className="text-xs text-amber-700 dark:text-amber-400 italic text-right" data-testid="banner-low-confidence">
                  Some deadlines and procedures could not be fully verified for this jurisdiction. Confirm with your attorney.
                </p>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed" data-testid="text-guidance-overview">
              {renderGuidanceRichText(guidance.overview, guardedNavigate)}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Your Charges Section */}
      <div data-guidance-section="charges">
        <YourChargesSection
          chargeClassifications={guidance.chargeClassifications}
          jurisdiction={guidance.caseData?.jurisdiction}
        />
      </div>

      {/* Local Ordinance Attribution — shown when LOCUS found a relevant municipal ordinance */}
      {guidance.localOrdinance && (
        <div className="flex items-start gap-2 text-xs text-muted-foreground px-1 -mt-2">
          <MapPin className="h-3 w-3 flex-shrink-0 mt-0.5" />
          <span>
            Local ordinance referenced: {guidance.localOrdinance.section} ({guidance.localOrdinance.jurisdictionDisplay})
            {' · '}
            <a
              href="https://huggingface.co/datasets/LocalLaws/LOCUS-v1"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              LOCUS-v1
            </a>
            , CC-BY-NC-4.0
          </span>
        </div>
      )}

      {/* Simple Reassurance Message with Hidden Technical Details */}
      {guidance.validation && (
        <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-slate-700 dark:text-slate-300" data-testid="text-validation-reassurance">
              {t('guidance.validation.reassurance', 
                `This guidance is based on ${(guidance.caseData?.jurisdiction ?? '').toUpperCase()} criminal statutes and publicly available legal information. For your specific situation, we recommend speaking with a public defender or legal aid attorney.`
              )}
            </p>
            {guidance.validation.sourceEnrichment?.status === 'unavailable' && (
              <p
                className="mt-2 text-xs text-muted-foreground"
                data-testid="text-source-enrichment-status"
                role="status"
                aria-live="polite"
              >
                {t(
                  'guidance.validation.sourceUnavailable',
                  'Some optional verification details are unavailable right now; the main roadmap is unaffected.'
                )}
              </p>
            )}
            
            {/* Collapsible technical details for advanced users */}
            <Collapsible className="mt-3">
              <div className="flex items-center gap-3 flex-wrap">
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-0 h-auto text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-transparent group"
                    data-testid="btn-show-verification-details"
                  >
                    <ChevronRight className="h-3 w-3 mr-1 transition-transform group-data-[state=open]:rotate-90" />
                    {t('guidance.validation.showDetails', 'How this guidance was sourced')}
                  </Button>
                </CollapsibleTrigger>
                <a
                  href="/tech-docs#ai-validation"
                  className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 underline underline-offset-2"
                >
                  {t('guidance.validation.methodologyLink', 'Full methodology')}
                </a>
              </div>
              <CollapsibleContent className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
                <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
                  {/* What we checked */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                      <span>{t('guidance.validation.checkedStatutes', 'Cross-referenced with state criminal statutes')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                      <span>{t('guidance.validation.checkedPenalties', 'Cross-referenced with published sentencing guidelines')}</span>
                    </div>
                    {guidance.localOrdinance && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-blue-500" />
                        <span>
                          Municipal ordinance context: {guidance.localOrdinance.section}, {guidance.localOrdinance.jurisdictionDisplay} (
                          <a
                            href="https://huggingface.co/datasets/LocalLaws/LOCUS-v1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-slate-700 dark:hover:text-slate-200"
                          >
                            LOCUS-v1
                          </a>
                          , CC-BY-NC-4.0)
                        </span>
                      </div>
                    )}
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
                  {(guidance.validation.issues?.length ?? 0) > 0 && (
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
      <DocumentsSection caseStage={guidance.caseData.caseStage} guardedNavigate={guardedNavigate} />

      {/* Practical support is intentionally separate from case-specific legal information. */}
      <Card id="practical-action-plan" className="editorial-card border-l-4 border-l-primary bg-primary/[0.03]" data-testid="practical-action-plan">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-foreground">
              <CheckCircle className="h-5 w-5 text-primary" />
              {t('legalGuidance.dashboard.practicalPlan.title')}
            </div>
            <div className="flex items-center gap-2">
              <Progress value={getPracticalActionsProgress()} className="w-24" />
              <span className="text-sm font-medium text-muted-foreground">{getPracticalActionsProgress()}%</span>
            </div>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t('legalGuidance.dashboard.practicalPlan.subtitle')}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {practicalActions.map((action, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                <Checkbox
                  id={`practical-action-${index}`}
                  checked={completedActions.has(action)}
                  onCheckedChange={() => toggleAction(action)}
                  className="mt-1"
                  data-testid={`checkbox-practical-action-${index}`}
                />
                <label
                  htmlFor={`practical-action-${index}`}
                  className={`flex-1 cursor-pointer ${
                    completedActions.has(action) ? 'line-through text-muted-foreground' : ''
                  }`}
                >
                  {renderGuidanceRichText(action, guardedNavigate)}
                </label>
              </div>
            ))}
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            {t('legalGuidance.dashboard.practicalPlan.completed', { count: completedActions.size, total: practicalActions.length })}
          </div>

          <div className="mt-5 pt-4 border-t border-border">
            <p className="text-sm font-medium text-foreground mb-3">
              {t('legalGuidance.dashboard.practicalPlan.resourcesTitle')}
            </p>
            <div className="grid gap-2 sm:grid-cols-3">
              {guidance.practicalSupportLinks.map((link) => {
                const Icon = link.kind === 'legalHelp' ? Scale : link.kind === 'court' ? Building : LifeBuoy;
                const translationKey = link.kind === 'legalHelp'
                  ? 'findLegalHelp'
                  : link.kind === 'court'
                    ? 'findCourt'
                    : 'lifeSupport';
                const action = link.kind === 'legalHelp' && onShowPublicDefender
                  ? onShowPublicDefender
                  : () => guardedNavigate(link.href);
                return (
                  <Button
                    key={link.kind}
                    variant="outline"
                    className="h-auto min-h-16 justify-start text-left whitespace-normal"
                    onClick={action}
                  >
                    <Icon className="h-4 w-4 mr-2 shrink-0" />
                    <span>
                      <span className="block font-medium">{t(`legalGuidance.dashboard.practicalPlan.${translationKey}`)}</span>
                      <span className="block text-xs font-normal text-muted-foreground mt-0.5">{t(`legalGuidance.dashboard.practicalPlan.${translationKey}Description`)}</span>
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* These records contain general case information, not a personalized task list. */}
      {legalInformationActions.length > 0 && (
       <Card className="editorial-card" data-guidance-section="immediateActions" data-testid="legal-information-actions">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            {t('legalGuidance.dashboard.practicalPlan.legalInformationTitle')}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t('legalGuidance.dashboard.practicalPlan.legalInformationDescription')}
          </p>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {legalInformationActions.map((actionItem, index) => (
              <li key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                <span className="text-muted-foreground mt-0.5">•</span>
                <span className="flex-1 text-sm">{renderGuidanceRichText(actionItem.action, guardedNavigate)}</span>
                <Badge
                  variant={getUrgencyBadgeVariant(actionItem.urgency)}
                  className="text-xs uppercase shrink-0"
                  data-testid={`badge-legal-information-${index}`}
                >
                  {actionItem.urgency}
                </Badge>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            {t('legalGuidance.dashboard.practicalPlan.talkToLawyer')}
          </p>
        </CardContent>
      </Card>
      )}

      {/* Enhanced Case Timeline */}
      <Card className="editorial-card" data-guidance-section="timeline">
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
          {/* Inline estimate notice — shown when the user's state is not individually mapped */}
          {guidance.deadlines.some(d => d.isEstimate) && (
            <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg" data-testid="notice-deadline-estimate">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-amber-800 dark:text-amber-200">
                    {t('legalGuidance.dashboard.estimateDeadlines.notice',
                      "These timeframes are general estimates: your state's exact deadlines may differ. Check your court paperwork or your state court's website for the actual dates in your case."
                    )}
                  </p>
                  <button
                    onClick={() => guardedNavigate('/court-locator')}
                    className="inline-flex items-center gap-1 mt-2 text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 underline font-medium text-xs"
                  >
                    <Building className="h-3.5 w-3.5" />
                    {t('legalGuidance.dashboard.estimateDeadlines.findCourt', 'Find your state court website')}
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          )}
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
                        <Badge variant={isCompleted ? 'secondary' : 'outline'} className={`text-xs ${stage.isEstimate ? 'border-amber-400 text-amber-700 dark:text-amber-400' : ''}`} title={stage.isEstimate ? 'General estimate: verify with your court' : undefined}>
                          {stage.isEstimate ? `~${stage.timeframe}` : stage.timeframe}
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
          {/* Local Court Variation Disclaimer — timeframes vary by county */}
          <LocalCourtDisclaimer jurisdiction={guidance.caseData?.jurisdiction ?? ''} />
        </CardContent>
      </Card>

      {/* Important Dates: same normalized deadlines used by chat and PDF. */}
      {guidance.deadlines.length > 0 && (
        <Card className="editorial-card" data-guidance-section="deadlines" data-testid="section-deadlines">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Clock className="h-5 w-5 text-muted-foreground" />
              {t('legalGuidance.dashboard.importantDates.title', 'Important Dates')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {guidance.deadlines.map((deadline, index) => (
              <div key={`${deadline.event}-${index}`} className="rounded-lg border border-border p-3" data-testid={`deadline-${index}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">{deadline.event}</p>
                    <p className="text-sm text-muted-foreground mt-1">{deadline.description}</p>
                  </div>
                  <Badge
                    variant={deadline.priority === 'critical' ? 'destructive' : deadline.priority === 'important' ? 'default' : 'outline'}
                    className="shrink-0"
                  >
                    {deadline.isEstimate ? '~' : ''}{deadline.timeframe}
                  </Badge>
                </div>
              </div>
            ))}
            <LocalCourtDisclaimer jurisdiction={guidance.caseData.jurisdiction} />
          </CardContent>
        </Card>
      )}

      {/* Your Rights */}
      {guidance.rights.length > 0 && (
        <Card className="editorial-card" data-guidance-section="rights">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <BrandShieldIcon size={20} />
              {t('legalGuidance.dashboard.yourRights.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
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
      )}

      {/* Next Steps */}
      {guidance.nextSteps.length > 0 && (
        <Card className="editorial-card" data-guidance-section="nextSteps">
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
                  <span className="flex-1 text-sm text-foreground">{renderGuidanceRichText(step, guardedNavigate)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Court Fees & Fines Callout */}
      <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20">
        <CardContent className="p-4 flex items-start gap-3">
          <DollarSign className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground mb-0.5">
              Court Fines & Fees
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              Most criminal cases result in fines, court costs, probation fees, and surcharges set at sentencing. Know what to expect, whether you qualify for a waiver, and where to get financial help.
            </p>
            <button
              onClick={() => guardedNavigate('/support/finances')}
              className="text-sm font-medium text-amber-700 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
            >
              Court Fees & Financial Help <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Expandable Sections */}
      <div className="grid min-w-0 md:grid-cols-2 gap-6">
        {/* Local Resources */}
        <Collapsible defaultOpen className="min-w-0">
          <CollapsibleTrigger asChild>
            <Card className="min-w-0 cursor-pointer hover:bg-muted/50 border-border">
              <CardHeader className="min-w-0">
                <CardTitle className="flex min-w-0 items-center justify-between gap-3 text-foreground">
                  <div className="flex min-w-0 flex-1 items-center gap-2 break-words">
                    <Users className="h-5 w-5 shrink-0 text-muted-foreground" />
                    {t('legalGuidance.dashboard.localResources.title')}
                  </div>
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
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
                      <div className="flex min-w-0 w-full items-start gap-3">
                        <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1 text-left">
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
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto py-4 px-4"
                    onClick={() => guardedNavigate('/resources')}
                  >
                    <div className="flex min-w-0 w-full items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1 text-left">
                        <div className="font-semibold text-base mb-1">Legal Aid</div>
                        <p className="text-sm text-muted-foreground">
                          Find legal aid organizations and free legal services
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  </Button>

                  {/* Court Self-Help Center */}
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto py-4 px-4"
                    onClick={() => guardedNavigate('/court-locator')}
                  >
                    <div className="flex min-w-0 w-full items-start gap-3">
                      <Building className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1 text-left">
                        <div className="font-semibold text-base mb-1">Court Self-Help Center</div>
                        <p className="text-sm text-muted-foreground">
                          Find local courthouses and court information
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        {/* Evidence — Discuss With Attorney */}
        {guidance.evidenceToGather.length > 0 && (
          <Collapsible defaultOpen data-guidance-section="evidenceToGather" className="min-w-0">
            <CollapsibleTrigger asChild>
              <Card className="cursor-pointer hover:bg-muted/50">
                <CardHeader className="min-w-0">
                  <CardTitle className="flex min-w-0 items-center justify-between gap-3">
                    <div className="flex min-w-0 flex-1 items-center gap-2 break-words">
                      <FileText className="h-5 w-5 shrink-0 text-amber-600" />
                      {t('legalGuidance.dashboard.evidenceToGather.title')}
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0" />
                  </CardTitle>
                </CardHeader>
              </Card>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="mt-2">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                      {t('legalGuidance.dashboard.evidenceToGather.warning')}
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {guidance.evidenceToGather.map((evidence, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-amber-600 mt-1">•</span>
                        <span className="text-sm">{evidence}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Warnings & Court Preparation — merged into one collapsible */}
        {(guidance.warnings.length > 0 || guidance.courtPreparation.length > 0) && (
          <Collapsible defaultOpen className="min-w-0">
            <CollapsibleTrigger asChild>
              <Card className="cursor-pointer hover:bg-muted/50">
                <CardHeader className="min-w-0">
                  <CardTitle className="flex min-w-0 items-center justify-between gap-3">
                    <div className="flex min-w-0 flex-1 items-center gap-2 break-words">
                      <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" />
                      {t('legalGuidance.dashboard.warningsAndPrep.title', 'Warnings & Court Preparation')}
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0" />
                  </CardTitle>
                </CardHeader>
              </Card>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="mt-2">
                <CardContent className="pt-6 space-y-4">
                  {guidance.warnings.length > 0 && (
                    <div data-guidance-section="warnings">
                      {guidance.courtPreparation.length > 0 && (
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{t('legalGuidance.dashboard.warningsAndPrep.thingsToReview')}</p>
                      )}
                      <ul className="space-y-2">
                        {guidance.warnings.map((warning, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-red-600 mt-1">•</span>
                            <span className="text-sm">{renderGuidanceRichText(warning, guardedNavigate)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {guidance.courtPreparation.length > 0 && (
                    <div data-guidance-section="courtPreparation">
                      {guidance.warnings.length > 0 && (
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 pt-2 border-t border-border">{t('legalGuidance.dashboard.warningsAndPrep.courtInformation')}</p>
                      )}
                      <ul className="space-y-2">
                        {guidance.courtPreparation.map((preparation, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-orange-600 mt-1">•</span>
                            <span className="text-sm">{renderGuidanceRichText(preparation, guardedNavigate)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Collateral Consequences */}
        {guidance.collateralConsequences && guidance.collateralConsequences.length > 0 && (
          <div data-guidance-section="collateralConsequences">
            <CollateralConsequencesCard items={guidance.collateralConsequences} />
          </div>
        )}

        {/* Personalized Mock Q&A Practice */}
        {guidance.mockQA && guidance.mockQA.length > 0 && (
          <div data-guidance-section="mockQA">
            <MockQAList
              items={guidance.mockQA}
              title={t('mockQA.personalizedTitle', 'Practice Questions for Your Case')}
            />
          </div>
        )}

        {/* Actions to Avoid */}
        {guidance.avoidActions.length > 0 && (
          <Collapsible defaultOpen data-guidance-section="avoidActions" className="min-w-0">
            <CollapsibleTrigger asChild>
              <Card className="cursor-pointer hover:bg-muted/50">
                <CardHeader className="min-w-0">
                  <CardTitle className="flex min-w-0 items-center justify-between gap-3">
                    <div className="flex min-w-0 flex-1 items-center gap-2 break-words">
                      <X className="h-5 w-5 shrink-0 text-red-500" />
                      {t('legalGuidance.dashboard.actionsToAvoid.title')}
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0" />
                  </CardTitle>
                </CardHeader>
              </Card>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="mt-2">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('legalGuidance.dashboard.actionsToAvoid.description')}
                  </p>
                  <ul className="space-y-2">
                    {guidance.avoidActions.map((action, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span className="text-sm">{renderGuidanceRichText(action, guardedNavigate)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Areas of Uncertainty */}
        {guidance.uncertainties && guidance.uncertainties.length > 0 && (
          <Collapsible defaultOpen data-guidance-section="uncertainties" className="min-w-0">
            <CollapsibleTrigger asChild>
              <Card className="cursor-pointer hover:bg-muted/50 border-amber-200 dark:border-amber-800" data-testid="collapsible-uncertainties">
                <CardHeader className="min-w-0">
                  <CardTitle className="flex min-w-0 items-center justify-between gap-3 text-foreground">
                    <div className="flex min-w-0 flex-1 items-center gap-2 break-words">
                      <HelpCircle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                      Areas of Uncertainty
                      <Badge variant="secondary" className="shrink-0 text-xs">{guidance.uncertainties.length}</Badge>
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
              </Card>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="mt-2 border-amber-200 dark:border-amber-800">
                <CardContent className="pt-6 space-y-3">
                  {guidance.uncertainties.map((item, index) => (
                    <div key={index} className="p-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">
                      <p className="text-sm font-medium text-foreground">{item.area}</p>
                      <p className="text-sm text-muted-foreground mt-1">{item.note}</p>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground pt-1">
                    These areas could not be confirmed for your specific jurisdiction. Verify with a licensed attorney before relying on them.
                  </p>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>

      {/* Generated legal contacts: the same resource records shown in chat and PDF. */}
      {guidance.resources.length > 0 && (
        <Card className="border-border" data-guidance-section="resources" data-testid="section-guidance-resources">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Users className="h-5 w-5 text-muted-foreground" />
              {t('legalGuidance.dashboard.resources.title', 'Legal Resources & Contacts')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {guidance.resources.map((resource, index) => (
              <div key={`${resource.type}-${index}`} className="rounded-lg border border-border p-3">
                <p className="font-medium text-foreground">{resource.type}</p>
                <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                <p className="text-sm mt-2">{resource.contact}</p>
                {resource.hours && <p className="text-xs text-muted-foreground mt-1">{resource.hours}</p>}
                {resource.website && (
                  <a href={resource.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline mt-1 inline-block">
                    {resource.website}
                  </a>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

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
                  housing: { icon: Home, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', href: '/support/housing', available: true },
                  transportation: { icon: Car, color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400', href: '/support/transportation', available: true },
                  childcare: { icon: Baby, color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400', href: '/support/childcare', available: true },
                  familyCare: { icon: Users, color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400', href: '/support/family-care', available: true },
                  personalHealth: { icon: Activity, color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400', href: '/support/personal-health', available: true },
                  immigration: { icon: Shield, color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400', href: '/immigration-guidance', available: true },
                  reputation: { icon: Scale, color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400', href: '/support/reputation', available: true },
                };

                const config = concernConfig[concernId];
                if (!config) return null;

                const Icon = config.icon;
                const label = t(`legalGuidance.qaFlow.additionalDetails.concernsCategories.${concernId}.label`);
                const description = t(`legalGuidance.qaFlow.additionalDetails.concernsCategories.${concernId}.description`);

                return (
                  <div key={concernId} className="flex flex-col gap-1">
                    <button onClick={() => guardedNavigate(config.href)} className="w-full text-left">
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
                    </button>
                    {concernId === 'finances' && (
                      <button
                        onClick={() => guardedNavigate('/support/finances')}
                        className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 px-3"
                      >
                        <DollarSign className="h-3 w-3" />
                        Court Fees & Fines guide →
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t">
              <Button variant="outline" size="sm" className="w-full sm:w-auto group" onClick={() => guardedNavigate('/support')}>
                {t('legalGuidance.dashboard.supportResources.viewAll', 'View All Support Resources')}
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Privacy Notice */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
        <CardContent className="pt-6">
          <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-3">
                <BrandShieldIcon size={20} />
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
                  <BrandShieldIcon size={16} />
                  <span>{t('legalGuidance.dashboard.privacyNotice.piiRedacted', 'Personal info redacted')}</span>
                </div>
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
                {t('legalGuidance.dashboard.privacyNotice.legalNotice', 'This guidance is general legal information, not legal advice. No attorney-client relationship is formed. Information shared here is not protected by attorney-client privilege.')}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full shrink-0 self-start text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 sm:w-auto"
              onClick={() => { setFlagSubmitted(false); setFlagReason(''); setShowFlagDialog(true); }}
              data-testid="btn-flag-response"
            >
              <Flag className="h-3.5 w-3.5 mr-1" />
              {t('guidance.flag.buttonLabel', 'Report an issue')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Context footer — universal rights and reminders, compact two-column */}
      <div className="border-t border-border/50 pt-6 mt-2">
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Fundamental Rights</p>
            <ul className="space-y-1.5">
              {[
                "You have the right to remain silent. You do not have to answer questions from police or prosecutors.",
                "You have the right to an attorney at no cost if you cannot afford one. Request one at your first appearance.",
                "You cannot be compelled to testify against yourself in court.",
              ].map((right, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <span className="flex-shrink-0 font-semibold text-foreground/60">{i + 1}.</span>
                  <span>{right}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Key Reminders</p>
            <ul className="space-y-1.5">
              {[
                "Conversations about your case outside of attorney-client privilege are not protected. Friends and family can be required to testify about what you told them.",
                "You can decline a search clearly and calmly. Saying no does not prevent a search but preserves your rights.",
                "Do not miss any court date. A missed appearance typically results in a bench warrant.",
              ].map((reminder, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <span className="flex-shrink-0 text-muted-foreground/50">•</span>
                  <span>{reminder}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Flag Response Dialog */}
      <Dialog open={showFlagDialog} onOpenChange={(open) => { setShowFlagDialog(open); if (!open) { setFlagReason(''); } }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-muted-foreground" />
              {t('guidance.flag.dialogTitle', 'Report an issue')}
            </DialogTitle>
            <DialogDescription>
              {t('guidance.flag.dialogDesc', 'Help us improve. No case details are submitted, only the issue type and your jurisdiction.')}
            </DialogDescription>
          </DialogHeader>

          {flagSubmitted ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <p className="text-sm font-medium">{t('guidance.flag.successTitle', 'Thank you')}</p>
              <p className="text-xs text-muted-foreground">{t('guidance.flag.successDesc', 'Your report helps us improve accuracy for everyone.')}</p>
              <Button size="sm" variant="outline" onClick={() => setShowFlagDialog(false)}>
                {t('common.close', 'Close')}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <RadioGroup value={flagReason} onValueChange={setFlagReason}>
                {[
                  { value: 'inaccurate', label: t('guidance.flag.reason.inaccurate', 'Information seems incorrect') },
                  { value: 'unclear', label: t('guidance.flag.reason.unclear', 'Hard to understand') },
                  { value: 'missing_info', label: t('guidance.flag.reason.missing_info', 'Important information is missing') },
                  { value: 'other', label: t('guidance.flag.reason.other', 'Something else') },
                ].map(({ value, label }) => (
                  <div key={value} className="flex items-center space-x-2">
                    <RadioGroupItem value={value} id={`flag-${value}`} />
                    <Label htmlFor={`flag-${value}`} className="text-sm cursor-pointer">{label}</Label>
                  </div>
                ))}
              </RadioGroup>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowFlagDialog(false)}>
                  {t('common.cancel', 'Cancel')}
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  disabled={!flagReason || flagMutation.isPending}
                  onClick={() => flagMutation.mutate(flagReason)}
                  data-testid="btn-submit-flag"
                >
                  {flagMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5 mr-1.5" />
                      {t('guidance.flag.submitButton', 'Submit')}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
                    <span><strong>{t('exportWarning.notLegalAdvice', 'This is not legal advice')}.</strong> {t('exportWarning.notLegalAdviceDesc', "It's general legal information only")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span><strong>{t('exportWarning.notPrivileged', 'Not protected by attorney-client privilege')}.</strong> {t('exportWarning.notPrivilegedDesc', 'Documents you create and share may be requested by opposing parties in legal proceedings')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span><strong>{t('exportWarning.shareWithAttorney', 'Share only with your attorney')}.</strong> {t('exportWarning.shareWithAttorneyDesc', 'If you have a lawyer, share this with them first before anyone else')}</span>
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
            <AlertDialogAction onClick={handleConfirmExport} disabled={isExporting} data-testid="button-confirm-export">
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t('exportWarning.confirmButton', 'I Understand, Export PDF')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </>
  );
}