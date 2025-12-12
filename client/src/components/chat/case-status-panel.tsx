import { motion } from "framer-motion";
import { MapPin, Gavel, Clock, UserCheck, FileText, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { CaseInfo } from "@/contexts/chat-context";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CaseStatusPanelProps {
  caseInfo: CaseInfo;
  className?: string;
}

export function CaseStatusPanel({ caseInfo, className }: CaseStatusPanelProps) {
  const { t } = useTranslation();
  
  const getStageLabel = (stage: string) => {
    return t(`chat.casePanel.stages.${stage}`, stage);
  };
  
  const getCustodyLabel = (status: string) => {
    return t(`chat.casePanel.custody_status.${status}`, status);
  };
  const hasInfo = caseInfo.state || caseInfo.charges?.length || caseInfo.courtStage;

  if (!hasInfo) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "bg-gradient-to-b from-primary/5 to-transparent rounded-xl border border-border/50 overflow-hidden",
        className
      )}
    >
      <div className="p-4 border-b border-border/50">
        <h3 className="font-semibold text-sm text-foreground">{t('chat.casePanel.title', 'Your Case Info')}</h3>
      </div>

      <ScrollArea className="h-[calc(100%-52px)]">
        <div className="p-4 space-y-4">
          {caseInfo.stateName && (
            <InfoRow 
              icon={MapPin} 
              label={t('chat.casePanel.state', 'State')}
              value={caseInfo.stateName}
            />
          )}

          {caseInfo.chargeNames && caseInfo.chargeNames.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Gavel className="h-4 w-4" />
                <span className="text-xs">{t('chat.casePanel.charges', 'Charges')}</span>
              </div>
              <div className="pl-6 space-y-1">
                {caseInfo.chargeNames.map((charge, idx) => (
                  <p key={idx} className="text-sm font-medium text-foreground leading-tight">{charge}</p>
                ))}
              </div>
            </div>
          )}

          {caseInfo.courtStage && (
            <InfoRow 
              icon={Clock} 
              label={t('chat.casePanel.stage', 'Stage')}
              value={getStageLabel(caseInfo.courtStage)}
            />
          )}

          {caseInfo.custodyStatus && (
            <InfoRow 
              icon={AlertTriangle} 
              label={t('chat.casePanel.custody', 'Custody')}
              value={getCustodyLabel(caseInfo.custodyStatus)}
            />
          )}

          {caseInfo.hasAttorney !== undefined && (
            <InfoRow 
              icon={UserCheck} 
              label={t('chat.casePanel.attorney', 'Attorney')}
              value={caseInfo.hasAttorney ? t('chat.casePanel.hasAttorney', 'Yes') : t('chat.casePanel.noAttorney', 'No')}
            />
          )}

          {caseInfo.isEmergency && (
            <div className="mt-4 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-xs font-medium">{t('chat.casePanel.urgentSituation', 'Urgent Situation')}</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </motion.div>
  );
}

interface InfoRowProps {
  icon: typeof MapPin;
  label: string;
  value: string;
}

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-sm font-semibold text-foreground pl-6">{value}</p>
    </div>
  );
}
