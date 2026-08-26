export type GuidanceRetryMode = 'ai' | 'rules';

export function isGuidanceRequestActive(
  currentRequestId: number,
  requestId: number,
): boolean {
  return currentRequestId === requestId;
}

/**
 * Build a retry request without ever carrying forward a single-use CAPTCHA
 * token. AI retries must receive the token from the newly mounted widget.
 */
export function buildGuidanceRetryPayload(
  data: Record<string, unknown>,
  mode: GuidanceRetryMode,
  captchaToken?: string | null,
): Record<string, unknown> {
  const { captchaToken: _previousCaptchaToken, ...caseData } = data;

  return {
    ...caseData,
    guidanceMode: mode,
    ...(mode === 'ai' && captchaToken ? { captchaToken } : {}),
  };
}