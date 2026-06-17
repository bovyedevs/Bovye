import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Something went wrong<span className="text-primary">.</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              An unexpected error occurred. You can try to recover or go back to the dashboard.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-4 rounded-lg border border-border bg-card p-3 text-left">
                <summary className="text-xs font-semibold text-muted-foreground cursor-pointer">
                  Error details (dev only)
                </summary>
                <pre className="mt-2 text-[11px] text-muted-foreground whitespace-pre-wrap">
                  {this.state.error.message}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            <div className="mt-6 flex gap-3 justify-center">
              <Button variant="outline" onClick={this.handleReload} className="h-9 text-sm">
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                Reload
              </Button>
              <Button onClick={this.handleReset} className="h-9 text-sm font-semibold">
                <Home className="h-3.5 w-3.5 mr-1.5" />
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
