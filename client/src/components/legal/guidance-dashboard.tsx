import { useState } from "react";
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
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";

interface EnhancedGuidanceData {
  sessionId: string;
  criticalAlerts: string[];
  immediateActions: string[];
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
}

export function GuidanceDashboard({ guidance, onClose, onDeleteSession }: GuidanceDashboardProps) {
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

  const getTimelinePriority = () => {
    const completedStages = guidance.timeline.filter(stage => stage.completed).length;
    const totalStages = guidance.timeline.length;
    return Math.round((completedStages / totalStages) * 100);
  };

  const getUrgentDeadlines = () => {
    return guidance.deadlines.filter(deadline => 
      deadline.priority === 'critical' && 
      (deadline.daysFromNow === undefined || deadline.daysFromNow <= 7)
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Case Summary Header */}
      <Card className="border-l-4 border-l-blue-600">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-xl">Legal Guidance Dashboard</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}
                className="gap-2"
              >
                {showSensitiveInfo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showSensitiveInfo ? 'Hide Details' : 'Show Details'}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Charges</div>
              <div className="font-medium">
                {showSensitiveInfo ? guidance.caseData.charges : 'Protected'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Jurisdiction</div>
              <div className="font-medium">{guidance.caseData.jurisdiction.toUpperCase()}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Current Stage</div>
              <Badge variant="outline" className="capitalize">
                {guidance.caseData.caseStage}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Progress</div>
              <div className="flex items-center gap-2">
                <Progress value={getTimelinePriority()} className="flex-1" />
                <span className="text-sm font-medium">{getTimelinePriority()}%</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Critical Alerts */}
      {guidance.criticalAlerts.length > 0 && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            <div className="font-semibold mb-2">Critical Alerts - Action Required</div>
            <ul className="space-y-1">
              {guidance.criticalAlerts.map((alert, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>{alert}</span>
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Urgent Deadlines */}
      {getUrgentDeadlines().length > 0 && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <Clock className="h-5 w-5" />
              Upcoming Deadlines
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
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Immediate Actions (Next 48 Hours)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {guidance.immediateActions.map((action, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                <Checkbox
                  id={`action-${index}`}
                  checked={completedActions.has(action)}
                  onCheckedChange={() => toggleAction(action)}
                  className="mt-1"
                />
                <label
                  htmlFor={`action-${index}`}
                  className={`flex-1 cursor-pointer ${
                    completedActions.has(action) ? 'line-through text-muted-foreground' : ''
                  }`}
                >
                  {action}
                </label>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            Completed: {completedActions.size} of {guidance.immediateActions.length} actions
          </div>
        </CardContent>
      </Card>

      {/* Case Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Case Timeline
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
                    Your Rights
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
                    Local Resources
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </CardTitle>
              </CardHeader>
            </Card>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Card className="mt-2">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {guidance.resources.map((resource, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">{resource.type}</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {resource.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {resource.contact}
                        </div>
                        {resource.hours && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {resource.hours}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
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
                      Evidence to Gather
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
                      Important Warnings
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
      </div>

      {/* Privacy Notice */}
      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          <strong>Privacy Protected:</strong> This guidance is generated based on your input and will be automatically deleted after your session ends. 
          No personal information is permanently stored.
        </AlertDescription>
      </Alert>
    </div>
  );
}