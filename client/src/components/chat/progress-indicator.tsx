import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, MapPin, Shield, Scale, FileText, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { ConversationStep } from "@/contexts/chat-context";

interface ProgressIndicatorProps {
  currentStep: ConversationStep;
}

const TRIAGE_STEPS = [
  { id: 'welcome', label: 'Start' },
  { id: 'emergency_check', label: 'Safety' },
  { id: 'state_selection', label: 'Location' },
  { id: 'charge_selection', label: 'Charges' },
  { id: 'court_stage', label: 'Stage' },
  { id: 'incident_description', label: 'Details' },
] as const;

const STEP_ORDER: ConversationStep[] = [
  'welcome',
  'emergency_check', 
  'state_selection',
  'charge_selection',
  'court_stage',
  'custody_status',
  'attorney_status',
  'incident_description',
  'generating_guidance',
  'guidance_ready',
  'follow_up',
  'completed',
];

function getStepIndex(step: ConversationStep): number {
  return STEP_ORDER.indexOf(step);
}

const BREADCRUMB_STEPS = [
  { 
    id: 'safety',
    icon: Shield,
    stepKey: 'chat.progress.safety',
    descKey: 'chat.progress.safetyDesc',
    matchSteps: ['welcome', 'emergency_check', 'emergency_options'] as ConversationStep[],
  },
  { 
    id: 'location',
    icon: MapPin,
    stepKey: 'chat.progress.location',
    descKey: 'chat.progress.locationDesc',
    matchSteps: ['state_selection'] as ConversationStep[],
  },
  { 
    id: 'charges',
    icon: Scale,
    stepKey: 'chat.progress.charges',
    descKey: 'chat.progress.chargesDesc',
    matchSteps: ['charge_selection'] as ConversationStep[],
  },
  { 
    id: 'situation',
    icon: FileText,
    stepKey: 'chat.progress.situation',
    descKey: 'chat.progress.situationDesc',
    matchSteps: ['court_stage', 'custody_status', 'attorney_status'] as ConversationStep[],
  },
  { 
    id: 'details',
    icon: FileText,
    stepKey: 'chat.progress.details',
    descKey: 'chat.progress.detailsDesc',
    matchSteps: ['privilege_warning', 'incident_description', 'concerns_question'] as ConversationStep[],
  },
] as const;

const GUIDANCE_FLOW_STEPS: ConversationStep[] = [
  'welcome', 'emergency_check', 'emergency_options',
  'state_selection',
  'charge_selection',
  'court_stage', 'custody_status', 'attorney_status',
  'privilege_warning', 'incident_description', 'concerns_question',
  'generating_guidance',
];

function isInGuidanceFlow(step: ConversationStep): boolean {
  return GUIDANCE_FLOW_STEPS.includes(step);
}

function getActiveStepIndex(step: ConversationStep): number {
  for (let i = 0; i < BREADCRUMB_STEPS.length; i++) {
    if ((BREADCRUMB_STEPS[i].matchSteps as readonly ConversationStep[]).includes(step)) {
      return i;
    }
  }
  if (step === 'generating_guidance') return BREADCRUMB_STEPS.length;
  return -1;
}

export function ProgressBreadcrumbs({ currentStep }: ProgressIndicatorProps) {
  const { t } = useTranslation();

  if (!isInGuidanceFlow(currentStep)) {
    return null;
  }

  const activeIdx = getActiveStepIndex(currentStep);
  const isGenerating = currentStep === 'generating_guidance';
  const progressPercent = isGenerating ? 100 : Math.max(0, ((activeIdx + 1) / BREADCRUMB_STEPS.length) * 100);

  return (
    <div className="border-b border-border bg-muted/30 px-3 py-2.5" role="navigation" aria-label={t('chat.progress.ariaLabel', 'Guidance progress')}>
      <div className="max-w-2xl mx-auto">
        <div className="relative mb-2" role="progressbar" aria-valuenow={activeIdx + 1} aria-valuemin={1} aria-valuemax={BREADCRUMB_STEPS.length} aria-label={t('chat.progress.step', { current: activeIdx + 1, total: BREADCRUMB_STEPS.length })}>
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        <ol className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide list-none m-0 p-0">
          {BREADCRUMB_STEPS.map((step, idx) => {
            const isCompleted = activeIdx > idx;
            const isCurrent = activeIdx === idx;
            const isFuture = activeIdx < idx;
            const Icon = step.icon;

            return (
              <li key={step.id} className="flex items-center shrink-0" aria-current={isCurrent ? 'step' : undefined}>
                <div
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-300",
                    isCompleted && "text-primary",
                    isCurrent && "bg-primary/10 text-primary ring-1 ring-primary/30",
                    isFuture && "text-muted-foreground/50"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-3 w-3 shrink-0" aria-hidden="true" />
                  ) : (
                    <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
                  )}
                  <span className="hidden sm:inline">{t(step.stepKey)}</span>
                  <span className="sr-only sm:hidden">{t(step.stepKey)}</span>
                </div>
                {idx < BREADCRUMB_STEPS.length - 1 && (
                  <ChevronRight className={cn(
                    "h-3 w-3 shrink-0 mx-0.5",
                    isCompleted ? "text-primary/50" : "text-muted-foreground/30"
                  )} aria-hidden="true" />
                )}
              </li>
            );
          })}
        </ol>

        <AnimatePresence mode="wait">
          {!isGenerating && activeIdx >= 0 && activeIdx < BREADCRUMB_STEPS.length && (
            <motion.p
              key={BREADCRUMB_STEPS[activeIdx].id}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className="text-xs text-muted-foreground mt-1.5 pl-1"
            >
              {t(`chat.progress.step`, { current: activeIdx + 1, total: BREADCRUMB_STEPS.length })} — {t(BREADCRUMB_STEPS[activeIdx].descKey)}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const currentIdx = getStepIndex(currentStep);
  
  if (currentStep === 'guidance_ready' || currentStep === 'follow_up' || currentStep === 'completed') {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-1.5 py-3" role="progressbar" aria-label="Triage progress">
      {TRIAGE_STEPS.map((step, idx) => {
        const stepIdx = getStepIndex(step.id as ConversationStep);
        const isCompleted = currentIdx > stepIdx;
        const isCurrent = step.id === currentStep || 
          (currentStep === 'custody_status' && step.id === 'court_stage') ||
          (currentStep === 'attorney_status' && step.id === 'court_stage') ||
          (currentStep === 'generating_guidance' && step.id === 'incident_description');
        
        return (
          <motion.div
            key={step.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-center gap-1.5"
          >
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300",
                isCompleted && "bg-primary text-primary-foreground",
                isCurrent && "bg-primary/20 text-primary ring-2 ring-primary ring-offset-1",
                !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
              )}
              title={step.label}
            >
              {isCompleted ? (
                <Check className="h-3 w-3" />
              ) : (
                <span>{idx + 1}</span>
              )}
            </div>
            
            {idx < TRIAGE_STEPS.length - 1 && (
              <div 
                className={cn(
                  "w-4 h-0.5 transition-colors duration-300",
                  currentIdx > stepIdx ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

export function ProgressDots({ currentStep }: ProgressIndicatorProps) {
  const currentIdx = getStepIndex(currentStep);
  const totalSteps = 6;
  
  if (currentStep === 'guidance_ready' || currentStep === 'follow_up' || currentStep === 'completed') {
    return null;
  }
  
  const progressStep = Math.min(currentIdx, totalSteps);

  return (
    <div className="flex items-center justify-center gap-2 py-2" role="progressbar" aria-valuenow={progressStep} aria-valuemax={totalSteps}>
      {Array.from({ length: totalSteps }).map((_, idx) => (
        <motion.div
          key={idx}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: idx * 0.03 }}
          className={cn(
            "w-2 h-2 rounded-full transition-all duration-300",
            idx < progressStep && "bg-primary",
            idx === progressStep && "bg-primary w-4",
            idx > progressStep && "bg-muted"
          )}
        />
      ))}
    </div>
  );
}

interface AnimatedProgressBarProps {
  className?: string;
  duration?: number;
  maxProgress?: number;
}

export function AnimatedProgressBar({ className = "", duration = 15, maxProgress = 75 }: AnimatedProgressBarProps) {
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  
  useEffect(() => {
    startTimeRef.current = Date.now();
    setProgress(0);
    
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      
      if (elapsed <= duration) {
        const t = elapsed / duration;
        const eased = t * (2 - t);
        setProgress(Math.round(eased * maxProgress));
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, [duration, maxProgress]);
  
  return (
    <div className={`w-full bg-muted rounded-full h-2 overflow-hidden ${className}`}>
      <div
        className="h-full bg-primary rounded-full transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

interface GeneratingProgressProps {
  isGenerating: boolean;
  onProgressComplete?: () => void;
}

export function GeneratingProgress({ isGenerating, onProgressComplete }: GeneratingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const hasCalledComplete = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (!isGenerating) {
      setProgress(0);
      setHasStarted(false);
      startTimeRef.current = null;
      hasCalledComplete.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    
    if (!hasStarted) {
      setHasStarted(true);
      startTimeRef.current = Date.now();
      setProgress(0);
    }
    
    intervalRef.current = setInterval(() => {
      if (!startTimeRef.current) return;
      
      const elapsed = Date.now() - startTimeRef.current;
      const seconds = elapsed / 1000;
      
      if (seconds <= 15) {
        const t = seconds / 15;
        const eased = t * (2 - t);
        const newProgress = Math.round(eased * 75);
        setProgress(newProgress);
      } else if (seconds > 20 && onProgressComplete && !hasCalledComplete.current) {
        hasCalledComplete.current = true;
        onProgressComplete();
      }
    }, 50);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isGenerating, hasStarted, onProgressComplete]);
  
  if (!isGenerating) return null;
  
  return (
    <div className="w-full max-w-md mx-auto px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">Analyzing your situation...</span>
        <span className="text-sm font-medium text-primary">{progress}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
