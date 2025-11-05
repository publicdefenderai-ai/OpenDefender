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
  HelpCircle
} from "lucide-react";
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