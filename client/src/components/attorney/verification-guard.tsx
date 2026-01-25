/**
 * Attorney Verification Guard
 *
 * HOC that protects pages requiring attorney verification.
 * Redirects to verification page if not verified.
 */

import { useEffect, type ReactNode } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAttorneySession } from "@/hooks/use-attorney-session";

interface VerificationGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function VerificationGuard({ children, fallback }: VerificationGuardProps) {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { isVerified, isLoading } = useAttorneySession();

  useEffect(() => {
    if (!isLoading && !isVerified) {
      setLocation("/attorney/verify");
    }
  }, [isVerified, isLoading, setLocation]);

  // Show loading state
  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              {t("attorneyPortal.session.checking", "Checking session...")}
            </p>
          </div>
        </div>
      )
    );
  }

  // Not verified - will redirect
  if (!isVerified) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            {t("attorneyPortal.session.redirecting", "Redirecting to verification...")}
          </p>
        </div>
      </div>
    );
  }

  // Verified - render children
  return <>{children}</>;
}

/**
 * Higher-order component version of VerificationGuard
 */
export function withVerificationGuard<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function VerificationGuardedComponent(props: P) {
    return (
      <VerificationGuard>
        <WrappedComponent {...props} />
      </VerificationGuard>
    );
  };
}
