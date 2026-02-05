/**
 * Cloudflare Turnstile CAPTCHA Component
 *
 * A privacy-focused CAPTCHA that protects AI-powered endpoints from abuse.
 * Turnstile is free and doesn't track users across sites.
 *
 * Usage:
 * ```tsx
 * const [captchaToken, setCaptchaToken] = useState<string | null>(null);
 *
 * <TurnstileCaptcha onVerify={setCaptchaToken} />
 *
 * // Include token in API requests
 * fetch('/api/legal-guidance', {
 *   body: JSON.stringify({ ...data, captchaToken })
 * })
 * ```
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ShieldCheck, AlertCircle } from 'lucide-react';

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: TurnstileOptions) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
      getResponse: (widgetId: string) => string | undefined;
    };
    onTurnstileLoad?: () => void;
  }
}

interface TurnstileOptions {
  sitekey: string;
  callback?: (token: string) => void;
  'error-callback'?: (error: string) => void;
  'expired-callback'?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
  language?: string;
}

interface TurnstileCaptchaProps {
  /** Called when CAPTCHA is successfully verified */
  onVerify: (token: string) => void;
  /** Called when CAPTCHA expires (user should re-verify) */
  onExpire?: () => void;
  /** Called when CAPTCHA encounters an error */
  onError?: (error: string) => void;
  /** Theme for the widget */
  theme?: 'light' | 'dark' | 'auto';
  /** Size of the widget */
  size?: 'normal' | 'compact';
  /** Additional CSS class */
  className?: string;
}

// Cache for CAPTCHA configuration
let captchaConfig: { required: boolean; siteKey: string | null } | null = null;
let configPromise: Promise<typeof captchaConfig> | null = null;

async function fetchCaptchaConfig(): Promise<typeof captchaConfig> {
  if (captchaConfig) return captchaConfig;
  if (configPromise) return configPromise;

  configPromise = fetch('/api/captcha/config')
    .then(res => res.json())
    .then(data => {
      captchaConfig = {
        required: data.required,
        siteKey: data.siteKey
      };
      return captchaConfig;
    })
    .catch(() => {
      captchaConfig = { required: false, siteKey: null };
      return captchaConfig;
    });

  return configPromise;
}

export function TurnstileCaptcha({
  onVerify,
  onExpire,
  onError,
  theme = 'auto',
  size = 'normal',
  className = ''
}: TurnstileCaptchaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [config, setConfig] = useState<typeof captchaConfig>(null);

  // Fetch config on mount
  useEffect(() => {
    fetchCaptchaConfig().then(setConfig);
  }, []);

  const handleVerify = useCallback((token: string) => {
    setIsVerified(true);
    setError(null);
    onVerify(token);
  }, [onVerify]);

  const handleExpire = useCallback(() => {
    setIsVerified(false);
    onExpire?.();
  }, [onExpire]);

  const handleError = useCallback((err: string) => {
    setError('Verification failed. Please try again.');
    setIsVerified(false);
    onError?.(err);
  }, [onError]);

  // Load Turnstile script and render widget
  useEffect(() => {
    if (!config) return;

    // If CAPTCHA not required or no site key, auto-verify
    if (!config.required || !config.siteKey) {
      setIsLoading(false);
      onVerify('not-required');
      setIsVerified(true);
      return;
    }

    const siteKey = config.siteKey;

    // Check if script already loaded
    if (window.turnstile) {
      renderWidget(siteKey);
      return;
    }

    // Load the Turnstile script
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad';
    script.async = true;
    script.defer = true;

    window.onTurnstileLoad = () => {
      renderWidget(siteKey);
    };

    script.onerror = () => {
      setError('Failed to load verification. Please refresh the page.');
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup widget on unmount
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, [config, onVerify]);

  function renderWidget(siteKey: string) {
    if (!containerRef.current || !window.turnstile) return;

    // Remove existing widget if any
    if (widgetIdRef.current) {
      window.turnstile.remove(widgetIdRef.current);
    }

    setIsLoading(false);

    try {
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: handleVerify,
        'error-callback': handleError,
        'expired-callback': handleExpire,
        theme,
        size,
      });
    } catch (err) {
      setError('Failed to initialize verification');
    }
  }

  // If config not loaded yet, show loading
  if (!config) {
    return (
      <div className={`flex items-center gap-2 p-4 bg-muted/50 rounded-lg ${className}`}>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Loading verification...</span>
      </div>
    );
  }

  // If CAPTCHA not required, don't show anything
  if (!config.required || !config.siteKey) {
    return null;
  }

  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (isVerified) {
    return (
      <div className={`flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg ${className}`}>
        <ShieldCheck className="h-4 w-4 text-green-600" />
        <span className="text-sm text-green-700 dark:text-green-300">Verified</span>
      </div>
    );
  }

  return (
    <div className={className}>
      {isLoading && (
        <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-muted-foreground">Loading verification...</span>
        </div>
      )}
      <div
        ref={containerRef}
        className={isLoading ? 'hidden' : ''}
      />
    </div>
  );
}

/**
 * Hook to get CAPTCHA token for API requests
 */
export function useCaptcha() {
  const [token, setToken] = useState<string | null>(null);
  const [isRequired, setIsRequired] = useState<boolean | null>(null);

  useEffect(() => {
    fetchCaptchaConfig().then(config => {
      setIsRequired(config?.required ?? false);
      if (!config?.required) {
        setToken('not-required');
      }
    });
  }, []);

  const reset = useCallback(() => {
    setToken(null);
  }, []);

  return {
    token,
    setToken,
    isRequired,
    isReady: token !== null,
    reset
  };
}

export default TurnstileCaptcha;
