/**
 * Attorney Session Timer
 *
 * Floating timer component showing session expiration countdown.
 * Changes color when session is expiring soon.
 */

import { Clock, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useAttorneySession } from "@/hooks/use-attorney-session";

interface SessionTimerProps {
  className?: string;
  variant?: "floating" | "inline";
}

export function SessionTimer({ className, variant = "floating" }: SessionTimerProps) {
  const { t } = useTranslation();
  const { isVerified, formattedTimeRemaining, isExpiringSoon, isCritical } =
    useAttorneySession();

  if (!isVerified) {
    return null;
  }

  const baseClasses = cn(
    "flex items-center gap-2 font-mono text-sm",
    {
      // Floating variant - fixed position badge
      "fixed top-20 right-4 z-40 px-3 py-2 rounded-lg shadow-lg": variant === "floating",
      // Inline variant - can be placed anywhere
      "px-2 py-1 rounded": variant === "inline",
    },
    {
      // Normal state
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300":
        !isExpiringSoon && !isCritical,
      // Warning state (< 5 min)
      "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200":
        isExpiringSoon && !isCritical,
      // Critical state (< 1 min)
      "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200 animate-pulse":
        isCritical,
    },
    className
  );

  return (
    <div className={baseClasses}>
      {isCritical ? (
        <AlertTriangle className="h-4 w-4" />
      ) : (
        <Clock className="h-4 w-4" />
      )}
      <span>
        {t("attorneyPortal.session.expiresIn", "Session expires in")}{" "}
        <span className="font-bold">{formattedTimeRemaining}</span>
      </span>
    </div>
  );
}
