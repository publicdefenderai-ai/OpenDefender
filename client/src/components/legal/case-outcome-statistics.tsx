import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronUp, BarChart3, Scale, AlertCircle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getOutcomeStatisticsForDisplay, type CaseOutcomeStatistic } from "@shared/case-outcome-statistics";

interface CaseOutcomeStatisticsProps {
  charges: string | string[];
  jurisdiction?: string;
}

export function CaseOutcomeStatistics({ charges, jurisdiction }: CaseOutcomeStatisticsProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(true);
  
  const { statistics, disclaimer } = getOutcomeStatisticsForDisplay(charges, jurisdiction);
  
  if (statistics.length === 0) {
    return null;
  }
  
  return (
    <Card className="border-border">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-foreground">
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
                <span>{t('legalGuidance.dashboard.caseOutcomes.title', 'What Happens in Cases Like Yours')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {statistics.reduce((sum, s) => sum + s.sampleSize, 0).toLocaleString()} {t('legalGuidance.dashboard.caseOutcomes.cases', 'cases')}
                </Badge>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            <Alert className="mb-4 border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-sm text-amber-800 dark:text-amber-200">
                {t('legalGuidance.dashboard.caseOutcomes.disclaimer', disclaimer)}
              </AlertDescription>
            </Alert>
            
            <div className="space-y-6">
              {statistics.map((stat, index) => (
                <StatisticCard key={index} statistic={stat} />
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

function StatisticCard({ statistic }: { statistic: CaseOutcomeStatistic }) {
  const { t } = useTranslation();
  
  return (
    <div className="p-4 rounded-lg border border-border bg-muted/20">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-foreground flex items-center gap-2">
          <Scale className="h-4 w-4 text-muted-foreground" />
          {statistic.chargeCategoryDisplay}
        </h4>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {statistic.jurisdiction === 'federal' ? t('legalGuidance.dashboard.caseOutcomes.federal', 'Federal') : t('legalGuidance.dashboard.caseOutcomes.state', 'State')}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {statistic.dataYear}
          </Badge>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h5 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-1">
            {t('legalGuidance.dashboard.caseOutcomes.howCasesResolve', 'How Cases Resolve')}
            <Info className="h-3 w-3" />
          </h5>
          <div className="space-y-2">
            <OutcomeBar 
              label={t('legalGuidance.dashboard.caseOutcomes.dismissed', 'Dismissed')} 
              percentage={statistic.outcomes.dismissal}
              color="bg-green-500"
            />
            <OutcomeBar 
              label={t('legalGuidance.dashboard.caseOutcomes.pleaDeal', 'Plea Deal')} 
              percentage={statistic.outcomes.pleaBargain}
              color="bg-blue-500"
            />
            <OutcomeBar 
              label={t('legalGuidance.dashboard.caseOutcomes.trialConviction', 'Trial - Conviction')} 
              percentage={statistic.outcomes.trialConviction}
              color="bg-orange-500"
            />
            <OutcomeBar 
              label={t('legalGuidance.dashboard.caseOutcomes.trialAcquittal', 'Trial - Acquittal')} 
              percentage={statistic.outcomes.trialAcquittal}
              color="bg-emerald-500"
            />
          </div>
        </div>
        
        <div>
          <h5 className="text-sm font-medium text-muted-foreground mb-3">
            {t('legalGuidance.dashboard.caseOutcomes.ifConvicted', 'If Convicted')}
          </h5>
          <div className="space-y-2">
            <OutcomeBar 
              label={t('legalGuidance.dashboard.caseOutcomes.probationOnly', 'Probation Only')} 
              percentage={statistic.sentencingIfConvicted.probationOnly}
              color="bg-sky-500"
            />
            <OutcomeBar 
              label={t('legalGuidance.dashboard.caseOutcomes.incarceration', 'Incarceration')} 
              percentage={statistic.sentencingIfConvicted.incarceration}
              color="bg-red-500"
            />
            <OutcomeBar 
              label={t('legalGuidance.dashboard.caseOutcomes.splitSentence', 'Split Sentence')} 
              percentage={statistic.sentencingIfConvicted.splitSentence}
              color="bg-purple-500"
            />
          </div>
          
          {statistic.sentencingIfConvicted.avgSentenceMonths > 0 && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t('legalGuidance.dashboard.caseOutcomes.avgSentence', 'Avg. Sentence')}:
                </span>
                <span className="font-medium text-foreground">
                  {formatSentence(statistic.sentencingIfConvicted.avgSentenceMonths)}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-muted-foreground">
                  {t('legalGuidance.dashboard.caseOutcomes.medianSentence', 'Median Sentence')}:
                </span>
                <span className="font-medium text-foreground">
                  {formatSentence(statistic.sentencingIfConvicted.medianSentenceMonths)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {statistic.diversionEligibility > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {t('legalGuidance.dashboard.caseOutcomes.diversionEligibility', 'Diversion Program Eligibility')}:
            </span>
            <div className="flex items-center gap-2">
              <Progress value={statistic.diversionEligibility} className="w-24 h-2" />
              <span className="text-sm font-medium text-foreground">{statistic.diversionEligibility}%</span>
            </div>
          </div>
        </div>
      )}
      
      {statistic.notes && (
        <div className="mt-3 p-2 bg-muted/40 rounded text-xs text-muted-foreground">
          <Info className="h-3 w-3 inline-block mr-1" />
          {statistic.notes}
        </div>
      )}
      
      <div className="mt-2 text-xs text-muted-foreground/70">
        {t('legalGuidance.dashboard.caseOutcomes.source', 'Source')}: {statistic.source} ({statistic.sampleSize.toLocaleString()} {t('legalGuidance.dashboard.caseOutcomes.cases', 'cases')})
      </div>
    </div>
  );
}

function OutcomeBar({ label, percentage, color }: { label: string; percentage: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-28 text-xs text-muted-foreground truncate">{label}</div>
      <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="w-10 text-xs font-medium text-foreground text-right">{percentage}%</div>
    </div>
  );
}

function formatSentence(months: number): string {
  if (months === 0) return 'No jail time';
  if (months < 1) return 'Fine only';
  if (months < 12) return `${months} months`;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) {
    return years === 1 ? '1 year' : `${years} years`;
  }
  return `${years}y ${remainingMonths}m`;
}
