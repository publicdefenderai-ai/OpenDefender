import React, { Component, ReactNode } from "react";
import i18n from "i18next";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("[ErrorBoundary] Uncaught error:", error, info.componentStack);
    try {
      fetch('/api/client-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          message: error.message?.slice(0, 500) ?? '',
          stack: error.stack?.slice(0, 2000) ?? '',
          componentStack: info.componentStack?.slice(0, 2000) ?? '',
          url: typeof window !== 'undefined' ? window.location.pathname + window.location.search : '',
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 200) : '',
        }),
      }).catch(() => {});
    } catch {
      // Never let the error reporter crash the boundary itself.
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen bg-background text-foreground" id="main-content">
          <section className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-10 sm:py-24" aria-labelledby="recovery-title">
            <AlertTriangle aria-hidden="true" className="mb-8 h-16 w-16 text-primary" strokeWidth={1.25} />
            <h1 id="recovery-title" className="text-4xl font-medium tracking-tight sm:text-5xl">
              {i18n.t("errorRecovery.title", "Something went wrong")}
            </h1>
            <p className="mb-5 mt-5 max-w-prose text-lg leading-relaxed text-muted-foreground">
              {i18n.t("errorRecovery.description", "An unexpected error occurred. You can reload this page or return to the homepage.")}
            </p>
            <p className="mb-8 max-w-prose border-l-2 border-primary pl-4 leading-relaxed">
              {i18n.t("errorRecovery.warning", "Reloading or leaving this page may lose unsaved input. Temporary server records expire as described in the Privacy Policy.")}
            </p>
            <div className="flex flex-wrap items-center gap-5">
              <button type="button" onClick={() => window.location.reload()} className="min-h-11 rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground hover:opacity-90">
                {i18n.t("errorRecovery.reload", "Reload page")}
              </button>
              <a href="/" className="inline-flex min-h-11 items-center py-3 text-primary underline underline-offset-4">
                {i18n.t("errorRecovery.home", "Go to homepage")}
              </a>
            </div>
            <a href="/privacy-policy" className="mt-6 inline-flex min-h-11 items-center text-primary underline underline-offset-4">
              {i18n.t("errorRecovery.privacy", "Privacy Policy")}
            </a>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
