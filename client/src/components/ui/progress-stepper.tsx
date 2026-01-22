import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  label: string;
  description?: string;
}

interface ProgressStepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export function ProgressStepper({
  steps,
  currentStep,
  className,
  orientation = "horizontal",
}: ProgressStepperProps) {
  return (
    <div
      className={cn(
        "w-full",
        orientation === "horizontal" ? "flex items-center" : "flex flex-col",
        className
      )}
    >
      {steps.map((step, index) => {
        const isComplete = index < currentStep;
        const isActive = index === currentStep;
        const isPending = index > currentStep;

        return (
          <div
            key={step.id}
            className={cn(
              orientation === "horizontal"
                ? "flex items-center flex-1"
                : "flex items-start gap-4 pb-8 last:pb-0"
            )}
          >
            {/* Step indicator */}
            <div
              className={cn(
                orientation === "horizontal"
                  ? "flex flex-col items-center"
                  : "flex flex-col items-center"
              )}
            >
              <div
                className={cn(
                  "stepper-dot",
                  isComplete && "stepper-dot-complete",
                  isActive && "stepper-dot-active",
                  isPending && "stepper-dot-pending"
                )}
              >
                {isComplete ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Vertical connector line */}
              {orientation === "vertical" && index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-0.5 h-full min-h-[2rem] mt-2",
                    isComplete ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </div>

            {/* Step content */}
            <div
              className={cn(
                orientation === "horizontal"
                  ? "mt-2 text-center hidden sm:block"
                  : "flex-1 pt-0.5"
              )}
            >
              <p
                className={cn(
                  "text-sm font-medium",
                  isActive && "text-primary",
                  isPending && "text-muted-foreground",
                  isComplete && "text-foreground"
                )}
              >
                {step.label}
              </p>
              {step.description && orientation === "vertical" && (
                <p className="text-xs text-muted-foreground mt-1">
                  {step.description}
                </p>
              )}
            </div>

            {/* Horizontal connector line */}
            {orientation === "horizontal" && index < steps.length - 1 && (
              <div
                className={cn(
                  "stepper-line flex-1",
                  isComplete && "stepper-line-complete",
                  isActive && "stepper-line-active"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Compact progress indicator (dots only)
interface ProgressDotsProps {
  total: number;
  current: number;
  className?: string;
}

export function ProgressDots({ total, current, className }: ProgressDotsProps) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "w-2 h-2 rounded-full transition-all duration-300",
            index === current
              ? "bg-primary w-6"
              : index < current
              ? "bg-primary"
              : "bg-border"
          )}
        />
      ))}
    </div>
  );
}

// Progress bar with percentage
interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  className?: string;
  variant?: "default" | "success" | "warning";
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  className,
  variant = "default",
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const variantClasses = {
    default: "bg-primary",
    success: "bg-green-500",
    warning: "bg-amber-500",
  };

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-sm text-muted-foreground">Progress</span>
          <span className="text-sm font-medium">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            variantClasses[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
