import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
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
        <div className="min-h-screen flex items-center justify-center p-6 bg-background">
          <div className="text-center max-w-md">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-amber-500" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Something went wrong
            </h2>
            <p className="text-muted-foreground mb-6">
              An unexpected error occurred. Reload the page to continue. Unsaved browser input may be lost; temporary server records expire as described in the Privacy Policy.
            </p>
            <Button onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
