/**
 * Attorney Context
 *
 * React context for managing attorney verification and session state.
 * Follows the pattern established in chat-context.tsx.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useLocation } from "wouter";
import {
  verifyAttorney,
  checkAttorneySession,
  endAttorneySession,
} from "@/lib/attorney-api";
import type {
  AttorneyAttestation,
  AttorneyVerificationRequest,
} from "@shared/attorney/types";

interface AttorneyState {
  isVerified: boolean;
  isLoading: boolean;
  sessionId: string | null;
  expiresAt: Date | null;
  timeRemaining: number; // seconds
  error: string | null;
}

interface AttorneyContextValue {
  state: AttorneyState;
  actions: {
    verify: (attestations: AttorneyAttestation) => Promise<boolean>;
    endSession: () => Promise<void>;
    checkSession: () => Promise<void>;
    clearError: () => void;
  };
}

const initialState: AttorneyState = {
  isVerified: false,
  isLoading: true, // Start loading to check session
  sessionId: null,
  expiresAt: null,
  timeRemaining: 0,
  error: null,
};

const AttorneyContext = createContext<AttorneyContextValue | null>(null);

export function AttorneyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AttorneyState>(initialState);
  const [, setLocation] = useLocation();

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, []);

  // Clean up session on page unload (tab close, navigation away)
  useEffect(() => {
    const handleUnload = () => {
      if (state.isVerified) {
        // Use sendBeacon for reliable delivery during page unload
        navigator.sendBeacon("/api/attorney/session/cleanup");
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [state.isVerified]);

  // Countdown timer - updates every second when session is active
  useEffect(() => {
    if (!state.isVerified || !state.expiresAt) return;

    const updateTimeRemaining = () => {
      const now = Date.now();
      const expiresAt = state.expiresAt!.getTime();
      const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));

      if (remaining <= 0) {
        // Session expired
        setState((prev) => ({
          ...prev,
          isVerified: false,
          sessionId: null,
          barState: null,
          expiresAt: null,
          timeRemaining: 0,
          error: "Session expired",
        }));
        setLocation("/attorney/verify");
      } else {
        setState((prev) => ({
          ...prev,
          timeRemaining: remaining,
        }));
      }
    };

    // Update immediately
    updateTimeRemaining();

    // Update every second
    const interval = setInterval(updateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [state.isVerified, state.expiresAt, setLocation]);

  const checkSession = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    const response = await checkAttorneySession();

    if (response.isVerified) {
      setState({
        isVerified: true,
        isLoading: false,
        sessionId: null, // We don't expose session ID to client
        expiresAt: response.expiresAt || null,
        timeRemaining: response.timeRemaining || 0,
        error: null,
      });
    } else {
      setState({
        isVerified: false,
        isLoading: false,
        sessionId: null,
        expiresAt: null,
        timeRemaining: 0,
        error: null,
      });
    }
  }, []);

  const verify = useCallback(
    async (attestations: AttorneyAttestation): Promise<boolean> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const request: AttorneyVerificationRequest = {
        attestations,
      };

      const response = await verifyAttorney(request);

      if (response.success) {
        setState({
          isVerified: true,
          isLoading: false,
          sessionId: response.sessionId || null,
          expiresAt: response.expiresAt || null,
          timeRemaining: response.expiresAt
            ? Math.floor((response.expiresAt.getTime() - Date.now()) / 1000)
            : 0,
          error: null,
        });
        return true;
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: response.error || "Verification failed",
        }));
        return false;
      }
    },
    []
  );

  const endSession = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    await endAttorneySession();

    setState({
      isVerified: false,
      isLoading: false,
      sessionId: null,
      expiresAt: null,
      timeRemaining: 0,
      error: null,
    });

    setLocation("/attorney");
  }, [setLocation]);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const value = useMemo(
    () => ({
      state,
      actions: {
        verify,
        endSession,
        checkSession,
        clearError,
      },
    }),
    [state, verify, endSession, checkSession, clearError]
  );

  return (
    <AttorneyContext.Provider value={value}>
      {children}
    </AttorneyContext.Provider>
  );
}

export function useAttorney() {
  const context = useContext(AttorneyContext);
  if (!context) {
    throw new Error("useAttorney must be used within AttorneyProvider");
  }
  return context;
}
