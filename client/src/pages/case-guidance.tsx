import { BrandShieldIcon } from "@/components/brand-logo";
import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertTriangle,
  Clock,
  Phone,
  Scale,
  RefreshCw,
  BookOpen,
  ClipboardList,
  HelpCircle,
  MapPin,
  Navigation,
  Search,
  Mail,
  HardDrive as HardDriveIcon,
  Trash2,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Link, useSearch } from "wouter";
import { searchPublicDefenderOffices, PublicDefenderOffice } from "@/lib/public-defender-services";
import { searchLegalAidOrganizations, LegalAidOrganization } from "@/lib/legal-aid-services";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { QAFlow } from "@/components/legal/qa-flow";
import { GuidanceDashboard } from "@/components/legal/guidance-dashboard";
import { useLegalGuidance, useAIAvailability } from "@/hooks/use-legal-data";
import { legalDataApi } from "@/lib/legal-data";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { generateGuidancePDF } from "@/lib/pdf-generator";
import { normalizeGuidance, type GuidanceViewModel } from "@shared/guidance-view-model";
import { useNavigationGuard } from "@/contexts/navigation-guard";
import { useToast } from "@/hooks/use-toast";
import { TurnstileCaptcha } from "@/components/captcha/turnstile";
import {
  buildGuidanceRetryPayload,
  isGuidanceRequestActive,
  type GuidanceRetryMode,
} from "@/lib/case-guidance-retry";

type EnhancedGuidanceResult = GuidanceViewModel;

const GUIDANCE_RECOVERY_STORAGE_KEY = 'open-defender:case-guidance-recovery';

interface StoredGuidanceRecovery {
  pendingGuidanceData: any;
  guidanceTimedOut: boolean;
  guidanceRecoveryError: boolean;
  reviewingTimedOutAnswers: boolean;
}

function readStoredGuidanceRecovery(): StoredGuidanceRecovery | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = window.sessionStorage.getItem(GUIDANCE_RECOVERY_STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as Partial<StoredGuidanceRecovery>;
    if (
      !parsed.pendingGuidanceData ||
      typeof parsed.pendingGuidanceData !== 'object' ||
      (!parsed.guidanceTimedOut && !parsed.reviewingTimedOutAnswers)
    ) {
      return null;
    }

    return {
      pendingGuidanceData: parsed.pendingGuidanceData as Record<string, unknown>,
      guidanceTimedOut: parsed.guidanceTimedOut === true,
      guidanceRecoveryError: parsed.guidanceRecoveryError === true,
      reviewingTimedOutAnswers: parsed.reviewingTimedOutAnswers === true,
    };
  } catch {
    return null;
  }
}

function clearStoredGuidanceRecovery() {
  try {
    window.sessionStorage.removeItem(GUIDANCE_RECOVERY_STORAGE_KEY);
  } catch {
    // Session storage may be unavailable in privacy-restricted browsers.
  }
}

function PublicDefenderOfficeCard({ office }: { office: PublicDefenderOffice }) {
  const { t } = useTranslation();
  
  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-lg mb-1">{office.name}</h4>
            <div className="flex flex-wrap gap-2">
              {office.county && (
                <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {office.county} {t('home.publicDefenderSearch.county')}
                </span>
              )}
              <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                {office.distance} {t('home.publicDefenderSearch.milesAway')}
              </span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm text-muted-foreground">{t('home.publicDefenderSearch.address')}</div>
              <div className="text-sm font-medium break-words">{office.address}</div>
            </div>
          </div>

          {office.phone && (
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground">{t('home.publicDefenderSearch.phone')}</div>
                <a href={`tel:${office.phone}`} className="text-sm font-medium hover:text-blue-600">
                  {office.phone}
                </a>
              </div>
            </div>
          )}

          {office.email && (
            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground">{t('home.publicDefenderSearch.email')}</div>
                <a href={`mailto:${office.email}`} className="text-sm font-medium hover:text-blue-600">
                  {office.email}
                </a>
              </div>
            </div>
          )}

          {office.hours && (
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground">{t('home.publicDefenderSearch.hours')}</div>
                <div className="text-sm font-medium">{office.hours}</div>
              </div>
            </div>
          )}

          <div>
            <div className="text-sm text-muted-foreground mb-2">{t('home.publicDefenderSearch.services')}</div>
            <div className="flex flex-wrap gap-1">
              {office.services.map((service) => (
                <span key={service} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {service}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => window.open(`https://maps.google.com/maps?daddr=${encodeURIComponent(office.address)}`, '_blank')}
            >
              <Navigation className="h-3 w-3 mr-1" />
              {t('home.publicDefenderSearch.directions')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LegalAidOrganizationCard({ organization }: { organization: LegalAidOrganization }) {
  const { t } = useTranslation();
  
  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-lg mb-1">{organization.name}</h4>
            <div className="flex flex-wrap gap-2">
              {organization.county && (
                <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {organization.county} {t('home.publicDefenderSearch.county')}
                </span>
              )}
              <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                {organization.distance} {t('home.publicDefenderSearch.milesAway')}
              </span>
              <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                {organization.organizationType}
              </span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm text-muted-foreground">{t('home.publicDefenderSearch.address')}</div>
              <div className="text-sm font-medium">{organization.address}</div>
            </div>
          </div>

          {organization.phone && (
            <div className="flex items-start gap-2">
              <Phone className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground">{t('home.publicDefenderSearch.phone')}</div>
                <a href={`tel:${organization.phone}`} className="text-sm font-medium hover:text-green-600">
                  {organization.phone}
                </a>
              </div>
            </div>
          )}

          {organization.email && (
            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground">{t('home.publicDefenderSearch.email')}</div>
                <a href={`mailto:${organization.email}`} className="text-sm font-medium hover:text-green-600">
                  {organization.email}
                </a>
              </div>
            </div>
          )}

          {organization.hours && (
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-muted-foreground">{t('home.publicDefenderSearch.hours')}</div>
                <div className="text-sm font-medium">{organization.hours}</div>
              </div>
            </div>
          )}

          <div>
            <div className="text-sm text-muted-foreground mb-2">{t('home.legalAidSearch.servicesOffered')}</div>
            <div className="flex flex-wrap gap-1">
              {organization.services.map((service) => (
                <span key={service} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {service}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => window.open(`https://maps.google.com/maps?daddr=${encodeURIComponent(organization.address)}`, '_blank')}
            >
              <Navigation className="h-3 w-3 mr-1" />
              {t('home.publicDefenderSearch.directions')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CaseGuidance() {
  useScrollToTop();
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [storedGuidanceRecovery] = useState(readStoredGuidanceRecovery);
  const [showQAFlow, setShowQAFlow] = useState(
    () => storedGuidanceRecovery?.reviewingTimedOutAnswers === true,
  );
  const [guidanceResult, setGuidanceResult] = useState<EnhancedGuidanceResult | null>(null);
  const [guidanceMode, setGuidanceMode] = useState<'ai' | 'rules'>('ai');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamProgress, setStreamProgress] = useState(0);
  const [pendingGuidanceData, setPendingGuidanceData] = useState<any | null>(
    () => storedGuidanceRecovery?.pendingGuidanceData ?? null,
  );
  const [guidanceTimedOut, setGuidanceTimedOut] = useState(
    () => storedGuidanceRecovery?.guidanceTimedOut === true,
  );
  const [guidanceRecoveryError, setGuidanceRecoveryError] = useState(
    () => storedGuidanceRecovery?.guidanceRecoveryError === true,
  );
  const [reviewingTimedOutAnswers, setReviewingTimedOutAnswers] = useState(
    () => storedGuidanceRecovery?.reviewingTimedOutAnswers === true,
  );
  const [retryCaptchaToken, setRetryCaptchaToken] = useState<string | null>(null);
  const [retryCaptchaAttempt, setRetryCaptchaAttempt] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);
  const guidanceAttemptInFlightRef = useRef(false);
  const { deleteGuidance } = useLegalGuidance();
  const { data: aiStatus } = useAIAvailability();
  const aiUnavailable = aiStatus && aiStatus.available === false;
  const { registerGuard, unregisterGuard } = useNavigationGuard();

  // Keep timeout recovery in the current browser tab so a full reload does
  // not discard edited answers. It is cleared as soon as recovery is no
  // longer active, preserving the session-only privacy boundary.
  useEffect(() => {
    if (!pendingGuidanceData || (!guidanceTimedOut && !reviewingTimedOutAnswers)) {
      clearStoredGuidanceRecovery();
      return;
    }

    try {
      window.sessionStorage.setItem(
        GUIDANCE_RECOVERY_STORAGE_KEY,
        JSON.stringify({
          pendingGuidanceData,
          guidanceTimedOut,
          guidanceRecoveryError,
          reviewingTimedOutAnswers,
        } satisfies StoredGuidanceRecovery),
      );
    } catch {
      // Session storage may be unavailable in privacy-restricted browsers.
    }
  }, [
    pendingGuidanceData,
    guidanceTimedOut,
    guidanceRecoveryError,
    reviewingTimedOutAnswers,
  ]);

  // Exit warning state
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [hasExported, setHasExported] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);

  // Clear session confirmation state
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearingSession, setIsClearingSession] = useState(false);

  // Session-expired state — set when a bookmarked sessionId no longer matches the browser session
  const [sessionExpired, setSessionExpired] = useState(false);
  const searchString = useSearch();

  // Navigation guard callbacks - memoized to prevent recreation
  const shouldBlockNavigation = useCallback(() => {
    return !!(guidanceResult && !hasExported);
  }, [guidanceResult, hasExported]);

  const onBlockNavigation = useCallback((navigateFn: () => void) => {
    setPendingNavigation(() => navigateFn);
    setShowExitWarning(true);
  }, []);

  // Register navigation guard only when there's unexported guidance
  useEffect(() => {
    if (guidanceResult && !hasExported) {
      registerGuard({
        shouldBlock: shouldBlockNavigation,
        onBlock: onBlockNavigation
      });
      
      return () => {
        unregisterGuard();
      };
    } else {
      // Unregister guard if no unexported guidance
      unregisterGuard();
    }
  }, [guidanceResult, hasExported, shouldBlockNavigation, onBlockNavigation, registerGuard, unregisterGuard]);

  // Public Defender search state
  const [showPublicDefenderModal, setShowPublicDefenderModal] = useState(false);
  const [pdZipCode, setPdZipCode] = useState("");
  const [pdSearching, setPdSearching] = useState(false);
  const [pdOffices, setPdOffices] = useState<PublicDefenderOffice[]>([]);
  const [pdError, setPdError] = useState("");

  // Legal Aid Organizations search state
  const [showLegalAidModal, setShowLegalAidModal] = useState(false);
  const [laZipCode, setLaZipCode] = useState("");
  const [laSearching, setLaSearching] = useState(false);
  const [laOrganizations, setLaOrganizations] = useState<LegalAidOrganization[]>([]);
  const [laError, setLaError] = useState("");

  // Browser beforeunload warning for unsaved guidance
  useEffect(() => {
    if (guidanceResult && !hasExported) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '';
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [guidanceResult, hasExported]);

  // URL-based session restoration: if the URL contains ?session=<id>, attempt to
  // retrieve existing guidance. A SESSION_EXPIRED response means the express-session
  // cookie has rotated and the case is no longer accessible — show a helpful prompt.
  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const urlSessionId = params.get('session');
    if (!urlSessionId || guidanceResult || sessionExpired) return;

    legalDataApi.getLegalGuidance(urlSessionId).then((data) => {
      if (data.success && data.guidance) {
        const guidance = data.guidance as any;
        setGuidanceResult(normalizeGuidance({ ...guidance, sessionId: urlSessionId }) as EnhancedGuidanceResult);
      }
    }).catch((err: Error & { code?: string }) => {
      if (err.code === 'SESSION_EXPIRED') {
        setSessionExpired(true);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchString]);

  // Source checks intentionally run after the core roadmap is returned. Refresh
  // the saved session briefly so optional results become visible without making
  // initial guidance wait on an external provider.
  const pendingEnrichmentSessionId = guidanceResult?.validation?.sourceEnrichment?.status === 'pending'
    ? guidanceResult.sessionId
    : null;
  useEffect(() => {
    if (!pendingEnrichmentSessionId) return;

    let stopped = false;
    let attempts = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const refreshEnrichment = async () => {
      if (stopped || attempts >= 10) return;
      attempts += 1;
      try {
        const data = await legalDataApi.getLegalGuidance(pendingEnrichmentSessionId);
        const refreshed = normalizeGuidance(data.guidance);
        const status = refreshed.validation?.sourceEnrichment?.status;
        if (!stopped && status && status !== 'pending') {
          setGuidanceResult(current => current ? {
            ...current,
            ...refreshed,
            sessionId: current.sessionId,
          } as EnhancedGuidanceResult : current);
          return;
        }
      } catch {
        // The initial response remains usable if the optional refresh fails.
      }
      if (!stopped && attempts < 10) {
        timer = setTimeout(refreshEnrichment, 1_200);
      }
    };

    timer = setTimeout(refreshEnrichment, 1_200);
    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
    };
  }, [pendingEnrichmentSessionId]);

  // Handler for attempting to close/navigate away from guidance
  const handleAttemptClose = (navigationAction?: () => void) => {
    if (guidanceResult && !hasExported) {
      setPendingNavigation(() => navigationAction || (() => setGuidanceResult(null)));
      setShowExitWarning(true);
    } else {
      if (navigationAction) {
        navigationAction();
      } else {
        setGuidanceResult(null);
      }
    }
  };

  // Handler for proceeding without export
  const handleProceedWithoutExport = () => {
    setShowExitWarning(false);
    if (pendingNavigation) {
      pendingNavigation();
    } else {
      setGuidanceResult(null);
    }
    setPendingNavigation(null);
  };

  // Handler for export from warning dialog - exports PDF and stays on page
  const handleExportFromWarning = async () => {
    if (guidanceResult) {
      try {
        // Generate the PDF directly
        await generateGuidancePDF(guidanceResult, i18n.language);
        setHasExported(true);
      } catch (error) {
        console.error('[PDF export error]', error);
        toast({
          title: t('case.export.errorTitle', 'Export failed'),
          description: t('case.export.errorMessage', 'PDF export failed. Please try again or use your browser\'s print function (Ctrl+P / Cmd+P).'),
          variant: "destructive",
        });
      }
    }
    // Close dialog and clear pending navigation - user stays on guidance page after export
    setShowExitWarning(false);
    setPendingNavigation(null);
  };

  // Simulated slow-advance ticker — keeps the bar moving during Claude's
  // pre-generation "thinking" phase when no real chunks have arrived yet.
  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      setStreamProgress(prev => {
        // Only advance the simulated ticker while real progress hasn't kicked in.
        // Once real chunks drive progress above 8%, stop simulating.
        if (prev >= 8) return prev;
        return Math.min(prev + 1, 8);
      });
    }, 600);
    return () => clearInterval(interval);
  }, [isStreaming]);

  const GUIDANCE_TIMEOUT_MS = 120_000;

  const handleCancel = useCallback(() => {
    requestIdRef.current += 1;
    guidanceAttemptInFlightRef.current = false;
    abortControllerRef.current?.abort('user_cancelled');
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    abortControllerRef.current = null;
    setIsStreaming(false);
    setStreamProgress(0);
  }, []);

  const handleQAComplete = async (data: any) => {
    if (guidanceAttemptInFlightRef.current) return;
    guidanceAttemptInFlightRef.current = true;

    const requestId = ++requestIdRef.current;
    const mode: 'ai' | 'rules' = data.guidanceMode === 'rules' ? 'rules' : 'ai';
    const { captchaToken: _submittedCaptchaToken, ...caseData } = data;
    setPendingGuidanceData(caseData);
    setGuidanceTimedOut(false);
    setGuidanceRecoveryError(false);
    setReviewingTimedOutAnswers(false);
    setRetryCaptchaToken(null);
    setGuidanceMode(mode);
    setIsStreaming(true);
    setStreamProgress(0);

    // Retire any timed-out controller before starting a replacement request.
    abortControllerRef.current?.abort('superseded');
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Auto-cancel after 120 seconds on bad connections
    timeoutRef.current = setTimeout(() => {
      if (!isGuidanceRequestActive(requestIdRef.current, requestId)) return;
      controller.abort('timeout');
      setGuidanceTimedOut(true);
      setGuidanceRecoveryError(false);
      setIsStreaming(false);
      setStreamProgress(0);
      guidanceAttemptInFlightRef.current = false;
      setRetryCaptchaToken(null);
      setRetryCaptchaAttempt((attempt) => attempt + 1);
    }, GUIDANCE_TIMEOUT_MS);

    try {
      let result: any;

      if (mode === 'rules') {
        // Rules-based path: standard fetch, no streaming, brief artificial delay
        // so the transition doesn't feel jarring
        const [response] = await Promise.all([
          fetch('/api/legal-guidance/rules', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            signal: controller.signal,
          }),
          new Promise(resolve => setTimeout(resolve, 600)),
        ]);
        result = await response.json();
      } else {
        // AI path: streaming flow with abort signal
        result = await legalDataApi.streamLegalGuidance(data, (_chars, progress) => {
          if (isGuidanceRequestActive(requestIdRef.current, requestId)) {
            setStreamProgress(progress);
          }
        }, controller.signal);
      }

      if (!isGuidanceRequestActive(requestIdRef.current, requestId)) return;

      if (result && result.success) {
        // Wait a tick to ensure the API response is fully processed
        // This prevents partial rendering of guidance data
        await new Promise(resolve => setTimeout(resolve, 0));
        
        if (!isGuidanceRequestActive(requestIdRef.current, requestId)) return;

        // The guidance is directly the EnhancedGuidance object
        const guidance = result.guidance;
        
        // Build the complete guidance data object synchronously
        const guidanceData = normalizeGuidance(
          { ...guidance, sessionId: result.sessionId },
          {
            ...data,
            charges: Array.isArray(data.charges) ? data.charges.join(', ') : data.charges,
          },
        );
        
        // Close the QA flow first
        setShowQAFlow(false);
        
        // Then set the complete guidance result in one atomic update
        // This ensures the guidance dashboard receives complete, stable data
        setGuidanceResult(guidanceData);
        // Reset export state for new guidance session
        setHasExported(false);
      } else {
        if (!isGuidanceRequestActive(requestIdRef.current, requestId)) return;
        console.error("API returned unsuccessful result:", result);
        setGuidanceTimedOut(true);
        setGuidanceRecoveryError(true);
        setRetryCaptchaToken(null);
        setRetryCaptchaAttempt((attempt) => attempt + 1);
        toast({
          title: t('caseGuidance.errors.generationFailed', 'Generation Failed'),
          description: t('caseGuidance.errors.tryAgain', 'Failed to generate guidance. Please try again.'),
          variant: "destructive",
        });
      }
    } catch (error: any) {
      if (!isGuidanceRequestActive(requestIdRef.current, requestId)) return;
      // Abort errors are either user-initiated cancels or the timeout handler
      // (which shows its own toast). Suppress the generic error toast for both.
      const isAbort = error?.name === 'AbortError' || controller.signal.aborted;
      if (!isAbort) {
        console.error("Failed to generate guidance:", error);
        setGuidanceTimedOut(true);
        setGuidanceRecoveryError(true);
        setRetryCaptchaToken(null);
        setRetryCaptchaAttempt((attempt) => attempt + 1);
        toast({
          title: t('caseGuidance.errors.errorOccurred', 'Error'),
          description: t('caseGuidance.errors.tryAgain', 'An error occurred while generating guidance. Please try again.'),
          variant: "destructive",
        });
      }
    } finally {
      if (isGuidanceRequestActive(requestIdRef.current, requestId)) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
        abortControllerRef.current = null;
        setIsStreaming(false);
        setStreamProgress(0);
        guidanceAttemptInFlightRef.current = false;
      }
    }
  };

  const handleRetryGuidance = (mode: GuidanceRetryMode) => {
    if (!pendingGuidanceData) return;
    if (mode === 'ai' && !retryCaptchaToken) return;
    void handleQAComplete(
      buildGuidanceRetryPayload(pendingGuidanceData, mode, retryCaptchaToken),
    );
  };

  const handleReviewTimedOutAnswers = () => {
    setGuidanceTimedOut(false);
    setGuidanceRecoveryError(false);
    setReviewingTimedOutAnswers(true);
    setShowQAFlow(true);
  };

  const handleTimedOutAnswersChange = useCallback((data: any) => {
    setPendingGuidanceData(data);
  }, []);

  const handleNewSession = async () => {
    if (isClearingSession) return;
    setIsClearingSession(true);
    try {
      if (guidanceResult?.sessionId) {
        await deleteGuidance.mutateAsync(guidanceResult.sessionId);
      } else {
        await legalDataApi.clearSession();
      }
      setGuidanceResult(null);
      setPendingGuidanceData(null);
      setGuidanceTimedOut(false);
      setGuidanceRecoveryError(false);
      setReviewingTimedOutAnswers(false);
      setRetryCaptchaToken(null);
      setRetryCaptchaAttempt((attempt) => attempt + 1);
      setShowQAFlow(true);
    } catch (error) {
      console.error('Failed to delete guidance before starting a new session:', error);
      toast({
        title: t('case.clearSession.errorTitle'),
        description: t('case.clearSession.errorMessage'),
        variant: 'destructive',
      });
    } finally {
      setIsClearingSession(false);
    }
  };

  const handleStartQA = () => {
    setPendingGuidanceData(null);
    setGuidanceTimedOut(false);
    setReviewingTimedOutAnswers(false);
      setRetryCaptchaToken(null);
    setShowQAFlow(true);
  };

  // Clear session handlers
  const handleClearSession = () => {
    setShowClearConfirm(true);
  };

  const confirmClearSession = async () => {
    if (isClearingSession) return;
    setIsClearingSession(true);
    try {
      // Pass the completed guidance ID when one is available. The server also
      // resolves records owned by this browser session when the screener is
      // still open and there is no local result yet.
      await legalDataApi.clearSession(guidanceResult?.sessionId);
      // Reset all local state
      setGuidanceResult(null);
      setPendingGuidanceData(null);
      setGuidanceTimedOut(false);
      setGuidanceRecoveryError(false);
      setReviewingTimedOutAnswers(false);
      setShowQAFlow(false);
      setHasExported(false);
      setShowClearConfirm(false);
      // Show success toast
      toast({
        title: t('case.clearSession.successTitle'),
        description: t('case.clearSession.successMessage'),
      });
    } catch (error) {
      console.error('Failed to clear session:', error);
      toast({
        title: t('case.clearSession.errorTitle'),
        description: t('case.clearSession.errorMessage'),
        variant: 'destructive',
      });
    } finally {
      setIsClearingSession(false);
    }
  };

  const handlePDSearch = async () => {
    if (!pdZipCode || pdZipCode.length !== 5) {
      setPdError("Please enter a valid 5-digit ZIP code");
      return;
    }
    setPdSearching(true);
    setPdError("");
    try {
      const results = await searchPublicDefenderOffices(pdZipCode);
      setPdOffices(results);
      if (results.length === 0) {
        setPdError("No public defender offices found in this area");
      }
    } catch (error) {
      setPdError("Error searching for public defenders. Please try again.");
    } finally {
      setPdSearching(false);
    }
  };

  const handleLASearch = async () => {
    if (!laZipCode || laZipCode.length !== 5) {
      setLaError("Please enter a valid 5-digit ZIP code");
      return;
    }
    setLaSearching(true);
    setLaError("");
    try {
      const results = await searchLegalAidOrganizations(laZipCode);
      setLaOrganizations(results);
      if (results.length === 0) {
        setLaError("No legal aid organizations found in this area");
      }
    } catch (error) {
      setLaError("Error searching for legal aid organizations. Please try again.");
    } finally {
      setLaSearching(false);
    }
  };

  // Show streaming progress while generating guidance
  if (isStreaming) {
    const isSourceCheckPhase = guidanceMode === 'ai' && streamProgress >= 70;
    const stage = guidanceMode === 'rules'
      ? t('case.loading.rulesPhase', 'Preparing the rules-based roadmap...')
      : isSourceCheckPhase
        ? t('case.loading.sourceCheckPhase', 'Checking legal sources...')
        : t('case.loading.generationPhase', 'Building your case roadmap...');

    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="editorial-workspace px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <Card className="editorial-card w-full max-w-md">
            <CardContent className="pt-6 pb-5">
              <div className="flex flex-col items-center justify-center space-y-5 text-center">
                <div className="relative">
                  <div className="h-16 w-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
                  <Scale className="h-8 w-8 text-blue-600 dark:text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">
                    {t('case.loading.title', 'Generating Your Case Roadmap')}
                  </h3>
                  <p className="text-sm text-muted-foreground">{stage}</p>
                </div>
                {guidanceMode === 'ai' && (
                  <div className="w-full space-y-2 text-left" aria-label={t('case.loading.phaseLabel', 'Guidance generation phases')}>
                    <div className={`flex items-center gap-2 text-sm ${!isSourceCheckPhase ? 'font-semibold text-blue-700 dark:text-blue-300' : 'text-muted-foreground'}`}>
                      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-current text-xs">1</span>
                      {t('case.loading.generationPhase', 'Building your case roadmap')}
                    </div>
                    <div className={`flex items-center gap-2 text-sm ${isSourceCheckPhase ? 'font-semibold text-blue-700 dark:text-blue-300' : 'text-muted-foreground'}`}>
                      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-current text-xs">2</span>
                      {t('case.loading.sourceCheckPhase', 'Checking legal sources')}
                    </div>
                  </div>
                )}
                <div className="w-full space-y-1">
                  <div className="h-2 w-full bg-blue-100 dark:bg-blue-900/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 dark:bg-blue-400 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${Math.max(2, streamProgress)}%` }}
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={streamProgress}
                      aria-label={stage}
                    />
                  </div>
                </div>
                {/* De-emphasized cancel — small and low-contrast so it won't be tapped accidentally */}
                <button
                  onClick={handleCancel}
                  className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors underline-offset-2 hover:underline mt-1"
                >
                  {t('case.loading.cancel', 'Cancel')}
                </button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (guidanceTimedOut) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="editorial-workspace px-4 py-16 flex items-center justify-center min-h-[60vh]">
          <Card className="editorial-card w-full max-w-lg">
            <CardContent className="pt-8 pb-8 px-8">
              <div className="space-y-6">
                <Alert
                  role="alert"
                  aria-live="assertive"
                  className="border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100"
                >
                  <Clock className="h-5 w-5" />
                  <AlertTitle>
                    {guidanceRecoveryError
                      ? t('case.loading.retryFailedTitle', 'That retry could not be completed')
                      : t('case.loading.timedOutTitle', 'Taking longer than usual')}
                  </AlertTitle>
                  <AlertDescription className="mt-2 text-amber-900 dark:text-amber-100">
                    {guidanceRecoveryError
                      ? t('case.loading.retryFailed', 'That attempt could not be completed. Your answers are still here, so you can try again with a new verification.')
                      : t('case.loading.timedOut', 'The guidance request took too long to finish. Your answers are still here, so you can try again without starting over.')}
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">
                    {t('case.loading.recoveryTitle', 'Choose how to continue')}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {t('case.loading.recoveryDescription', 'You can retry the personalized guidance, switch to a faster rules-based roadmap, or review your answers first.')}
                  </p>
                </div>

                <div className="grid gap-3">
                  <div className="rounded-lg border border-border bg-muted/30 p-3">
                    <TurnstileCaptcha
                      key={retryCaptchaAttempt}
                      onVerify={setRetryCaptchaToken}
                      onExpire={() => setRetryCaptchaToken(null)}
                      onError={() => setRetryCaptchaToken(null)}
                    />
                    {!retryCaptchaToken && (
                      <p className="text-xs text-muted-foreground">
                        {t('case.loading.retryVerification', 'Complete the verification above to retry AI guidance.')}
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={() => handleRetryGuidance('ai')}
                    disabled={!retryCaptchaToken}
                    className="w-full justify-start min-h-[48px]"
                    data-testid="button-retry-ai-guidance"
                  >
                    <RefreshCw className="mr-3 h-4 w-4" />
                    {t('case.loading.retryAI', 'Retry AI guidance')}
                  </Button>
                  <Button onClick={() => handleRetryGuidance('rules')} variant="outline" className="w-full justify-start min-h-[48px]" data-testid="button-use-rules-guidance">
                    <BookOpen className="mr-3 h-4 w-4" />
                    {t('case.loading.useRules', 'Use the faster rules-based roadmap')}
                  </Button>
                  <Button onClick={handleReviewTimedOutAnswers} variant="ghost" className="w-full justify-start min-h-[48px]" data-testid="button-review-guidance-answers">
                    <ClipboardList className="mr-3 h-4 w-4" />
                    {t('case.loading.reviewAnswers', 'Review my answers')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (sessionExpired) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="editorial-workspace px-4 py-16 flex items-center justify-center min-h-[60vh]">
          <Card className="editorial-card w-full max-w-lg">
            <CardContent className="pt-8 pb-8 px-8">
              <div className="flex flex-col items-center text-center space-y-5">
                <div className="h-14 w-14 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Clock className="h-7 w-7 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">
                    {t('case.sessionExpired.title', 'Your session has expired')}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('case.sessionExpired.message', 'This guidance is no longer accessible because your browser session has ended. This is a privacy protection — your case details are never stored permanently.')}
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2 pt-2 w-full">
                  <Button
                    className="w-full sm:w-auto"
                    onClick={() => {
                      setSessionExpired(false);
                      setShowQAFlow(true);
                    }}
                  >
                    {t('case.sessionExpired.cta', 'Start a new screener')}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    {t('case.sessionExpired.subtext', 'Your new guidance will be just as detailed. It only takes a few minutes.')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (showQAFlow) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="editorial-workspace max-w-7xl mx-auto px-4 py-8">
          <QAFlow
            onComplete={handleQAComplete}
            onCancel={() => {
              setShowQAFlow(false);
              setReviewingTimedOutAnswers(false);
            }}
            onFindLawyer={() => {
              setShowQAFlow(false);
              setShowPublicDefenderModal(true);
            }}
            onClearSession={handleClearSession}
            clearSessionDialog={
              <Dialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      {t('case.clearSession.title')}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      {t('case.clearSession.message')}
                    </p>
                    <div className="flex gap-3 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setShowClearConfirm(false)}
                        data-testid="button-cancel-clear-session"
                      >
                        {t('case.clearSession.cancel')}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={confirmClearSession}
                        disabled={isClearingSession}
                        data-testid="button-confirm-clear-session"
                      >
                        {isClearingSession
                          ? t('case.clearSession.clearing')
                          : t('case.clearSession.confirm')}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            }
            initialData={reviewingTimedOutAnswers ? pendingGuidanceData : undefined}
            reviewAnswers={reviewingTimedOutAnswers}
            onFormDataChange={
              reviewingTimedOutAnswers ? handleTimedOutAnswersChange : undefined
            }
          />
        </main>
        <Footer />
      </div>
    );
  }

  if (guidanceResult) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="editorial-workspace px-4 py-8">
          <GuidanceDashboard 
            guidance={guidanceResult} 
            onClose={() => handleAttemptClose()}
            onNewSession={handleNewSession}
            onShowPublicDefender={() => setShowPublicDefenderModal(true)}
            onShowLegalAid={() => setShowLegalAidModal(true)}
            onExport={() => setHasExported(true)}
            guidanceMode={guidanceMode}
          />
          <aside
            className="editorial-card max-w-5xl mx-auto mt-6 p-4"
            aria-labelledby="trusted-resources-heading"
          >
            <h2 id="trusted-resources-heading" className="font-semibold text-foreground">
              {t('guidance.trustedResources.title', 'Check trusted help and sources')}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {t('guidance.trustedResources.description', 'Use local legal help for your situation, and review how OpenDefender builds and verifies this guidance.')}
            </p>
            <div className="flex flex-wrap gap-3 mt-3">
              <Link href="/legal-aid" className="text-sm font-semibold text-primary underline underline-offset-4">
                {t('navigation.intents.legalHelp.label', 'Find a lawyer or resources')}
              </Link>
              <Link href="/data-sources" className="text-sm font-semibold text-primary underline underline-offset-4">
                {t('navigation.intents.sources.label', 'Verify sources')}
              </Link>
            </div>
          </aside>
        </main>
        
        {/* Public Defender Search Modal */}
        <Dialog open={showPublicDefenderModal} onOpenChange={setShowPublicDefenderModal}>
          <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {t('home.publicDefenderSearch.title')}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder={t('home.publicDefenderSearch.inputPlaceholder')}
                    value={pdZipCode}
                    onChange={(e) => setPdZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                    onKeyPress={(e) => e.key === 'Enter' && handlePDSearch()}
                    className="border-2 border-blue-300 focus:border-blue-500"
                    data-testid="input-pd-zipcode"
                  />
                </div>
                <Button
                  onClick={handlePDSearch}
                  disabled={pdSearching || pdZipCode.length !== 5}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6"
                  data-testid="button-search-pd"
                >
                  {pdSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      {t('home.publicDefenderSearch.searching')}
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      {t('home.publicDefenderSearch.searchButton')}
                    </>
                  )}
                </Button>
              </div>

              {pdError && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    {pdError}
                  </AlertDescription>
                </Alert>
              )}

              {pdOffices.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    {t('home.searchResults.foundOffices', { count: pdOffices.length, plural: pdOffices.length !== 1 ? 's' : '' })}
                  </h3>
                  
                  <div className="grid gap-4">
                    {pdOffices.map((office) => (
                      <PublicDefenderOfficeCard key={office.id} office={office} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Legal Aid Organizations Search Modal */}
        <Dialog open={showLegalAidModal} onOpenChange={setShowLegalAidModal}>
          <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                {t('home.legalAidSearch.title')}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <Alert className="border-blue-200 bg-blue-50">
                <AlertDescription className="text-blue-800">
                  <div className="flex items-start gap-3">
                    <BrandShieldIcon size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{t('home.legalAidSearch.alertMessage')}</span>
                  </div>
                </AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder={t('home.legalAidSearch.inputPlaceholder')}
                    value={laZipCode}
                    onChange={(e) => setLaZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                    onKeyPress={(e) => e.key === 'Enter' && handleLASearch()}
                    className="border-2 border-green-300 focus:border-green-500"
                    data-testid="input-la-zipcode"
                  />
                </div>
                <Button
                  onClick={handleLASearch}
                  disabled={laSearching || laZipCode.length !== 5}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-6"
                  data-testid="button-search-la"
                >
                  {laSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      {t('home.legalAidSearch.searching')}
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      {t('home.legalAidSearch.searchButton')}
                    </>
                  )}
                </Button>
              </div>

              {laError && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    {laError}
                  </AlertDescription>
                </Alert>
              )}

              {laOrganizations.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    {t('home.legalAidSearch.resultsFound', { count: laOrganizations.length, plural: laOrganizations.length !== 1 ? 's' : '' })}
                  </h3>
                  
                  <div className="grid gap-4">
                    {laOrganizations.map((org) => (
                      <LegalAidOrganizationCard key={org.id} organization={org} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Exit Warning Dialog */}
        <Dialog open={showExitWarning} onOpenChange={setShowExitWarning}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                {t('case.exitWarning.title')}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                {t('case.exitWarning.message')}
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={handleProceedWithoutExport}
                  data-testid="button-proceed-without-export"
                >
                  {t('case.exitWarning.proceed')}
                </Button>
                <Button
                  onClick={handleExportFromWarning}
                  data-testid="button-export-and-stay"
                >
                  {t('case.exitWarning.export')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* AI Unavailable Banner */}
      {aiUnavailable && (
        <div className="bg-amber-50 dark:bg-amber-950/50 border-b border-amber-200 dark:border-amber-800 px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
              {aiStatus?.reason || 'AI features are temporarily unavailable due to high usage today. They will be restored at midnight UTC.'}
            </p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="understand-charges" className="vivid-header py-16 md:py-20 lg:py-24 scroll-mt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 vivid-header-content text-center">
          <ScrollReveal>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-5 md:mb-6" data-testid="heading-case-title">
              {t('case.hero.title')}
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-10" data-testid="text-case-description">
              {t('case.hero.description')}
            </p>

            <Button
              onClick={handleStartQA}
              size="lg"
              disabled={!!aiUnavailable}
              className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-3 rounded-lg shadow-lg"
              data-testid="button-start-guidance"
            >
              {t('case.hero.startButton')}
            </Button>
            <p className="mt-4 text-sm opacity-70">
              Or start with the{" "}
              <Link href="/first-24-hours" className="underline underline-offset-2 hover:opacity-90">
                First 24 Hours guide
              </Link>.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 lg:py-24 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-center text-foreground mb-10 md:mb-14" data-testid="heading-how-it-works">
              {t('case.howItWorks.title')}
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-4 gap-6 md:gap-8">
            <ScrollReveal delay={0.1}>
              <StepCard
                number={1}
                title={t('case.howItWorks.step1Title')}
                description={t('case.howItWorks.step1Desc')}
              />
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <StepCard
                number={2}
                title={t('case.howItWorks.step2Title')}
                description={t('case.howItWorks.step2Desc')}
              />
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <StepCard
                number={3}
                title={t('case.howItWorks.step3Title')}
                description={t('case.howItWorks.step3Desc')}
              />
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <StepCard
                number={4}
                title={t('case.howItWorks.step4Title')}
                description={t('case.howItWorks.step4Desc')}
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Privacy & Security */}
      <section className="py-14 md:py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="editorial-surface rounded-xl p-6 md:p-8">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center mb-4 ring-1 ring-primary/20">
                  <BrandShieldIcon size={24} />
                </div>
                <h2 className="text-xl font-semibold text-foreground" data-testid="heading-privacy">
                  {t('case.privacy.title')}
                </h2>
              </div>

              <PrivacyGrid />

              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                <Button
                  onClick={handleStartQA}
                  disabled={!!aiUnavailable}
                  data-testid="button-start-guidance-bottom"
                >
                  {t('case.privacy.getStartedButton')}
                </Button>
                <Link href="/rights-info">
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-auto"
                    data-testid="button-learn-rights"
                  >
                    {t('case.privacy.learnRightsButton')}
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function StepCard({ number, title, description }: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3 text-sm font-semibold">
        {number}
      </div>
      <h3 className="font-medium text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function PrivacyGrid() {
  const { t } = useTranslation();

  const items = [
    {
      title: t('case.privacy.noStorageTitle'),
      description: t('case.privacy.noStorageDesc'),
      icon: HardDriveIcon,
      gradient: 'from-blue-600/20 to-blue-400/20',
      iconBg: 'from-blue-600 to-blue-500',
    },
    {
      title: t('case.privacy.sessionOnlyTitle'),
      description: t('case.privacy.sessionOnlyDesc'),
      icon: Clock,
      gradient: 'from-sky-600/20 to-sky-400/20',
      iconBg: 'from-sky-600 to-sky-500',
    },
    {
      title: t('case.privacy.autoDeleteTitle'),
      description: t('case.privacy.autoDeleteDesc'),
      icon: Trash2,
      gradient: 'from-indigo-600/20 to-indigo-400/20',
      iconBg: 'from-indigo-600 to-indigo-500',
    },
    {
      title: t('case.privacy.anonymousTitle'),
      description: t('case.privacy.anonymousDesc'),
      icon: EyeOff,
      gradient: 'from-slate-600/20 to-slate-400/20',
      iconBg: 'from-slate-600 to-slate-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" data-testid="privacy-grid">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="editorial-card editorial-card-interactive relative group overflow-hidden p-4"
            data-testid={`privacy-card-${index}`}
          >
            <div className="relative h-full">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}



