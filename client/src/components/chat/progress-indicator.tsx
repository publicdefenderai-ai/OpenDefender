import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
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
      // Reset everything when not generating
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
    
    // Mark as started and set start time only once when isGenerating becomes true
    if (!hasStarted) {
      setHasStarted(true);
      startTimeRef.current = Date.now();
      setProgress(0);
    }
    
    // Start interval to update progress
    intervalRef.current = setInterval(() => {
      if (!startTimeRef.current) return;
      
      const elapsed = Date.now() - startTimeRef.current;
      const seconds = elapsed / 1000;
      
      if (seconds <= 15) {
        // Smooth curve from 0 to 75% over 15 seconds
        // Using easeOutQuad for natural deceleration
        const t = seconds / 15;
        const eased = t * (2 - t); // easeOutQuad
        const newProgress = Math.round(eased * 75);
        setProgress(newProgress);
      } else if (seconds > 20 && onProgressComplete && !hasCalledComplete.current) {
        hasCalledComplete.current = true;
        onProgressComplete();
      }
    }, 50); // More frequent updates for smoother animation
    
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
