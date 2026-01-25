/**
 * useAttorneySession Hook
 *
 * Convenience hook for accessing attorney session state and actions.
 * Re-exports from the attorney context with additional computed values.
 */

import { useAttorney } from "@/contexts/attorney-context";

export function useAttorneySession() {
  const { state, actions } = useAttorney();

  // Format time remaining as MM:SS
  const formatTimeRemaining = (): string => {
    const minutes = Math.floor(state.timeRemaining / 60);
    const seconds = state.timeRemaining % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Check if session is expiring soon (< 5 minutes)
  const isExpiringSoon = state.timeRemaining > 0 && state.timeRemaining < 5 * 60;

  // Check if session is critical (< 1 minute)
  const isCritical = state.timeRemaining > 0 && state.timeRemaining < 60;

  return {
    // State
    isVerified: state.isVerified,
    isLoading: state.isLoading,
    expiresAt: state.expiresAt,
    timeRemaining: state.timeRemaining,
    error: state.error,

    // Computed
    formattedTimeRemaining: formatTimeRemaining(),
    isExpiringSoon,
    isCritical,

    // Actions
    verify: actions.verify,
    endSession: actions.endSession,
    checkSession: actions.checkSession,
    clearError: actions.clearError,
  };
}
