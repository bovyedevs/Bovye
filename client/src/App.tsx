import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RouteGuard } from '@/components/auth/RouteGuard';
import { AppErrorBoundary } from '@/components/errors/AppErrorBoundary';
import { ToastContainer } from '@/components/errors/ToastContainer';
import { PageSkeleton } from '@/components/loading/PageSkeleton';
import { MilestoneCelebration } from '@/components/celebration/MilestoneCelebration';
import { Button } from '@/components/ui/button';
import { Home, RefreshCw, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useProfileStore } from '@/store/useProfileStore';
import { apiClient } from '@/lib/api';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Toolkit = lazy(() => import('@/pages/Toolkit'));
const Onboarding = lazy(() => import('@/pages/Onboarding'));
const Profile = lazy(() => import('@/pages/Profile'));
const Roadmap = lazy(() => import('@/pages/Roadmap'));
const Community = lazy(() => import('@/pages/Community'));
const LearningHub = lazy(() => import('@/pages/LearningHub'));
const Auth = lazy(() => import('@/pages/Auth'));
const AuthCallback = lazy(() => import('@/pages/AuthCallback'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function RouteFallback({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-5 w-5 text-destructive" />
      </div>
      <h2 className="text-lg font-semibold text-foreground">{title} encountered an error</h2>
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        Something went wrong while loading this section. You can try again or return to the dashboard.
      </p>
      <div className="flex gap-3 mt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
          className="h-9 text-sm"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          Reload
        </Button>
        <Button
          size="sm"
          onClick={() => (window.location.href = '/')}
          className="h-9 text-sm font-semibold"
        >
          <Home className="h-3.5 w-3.5 mr-1.5" />
          Dashboard
        </Button>
      </div>
    </div>
  );
}

function LazyRoute({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <AppErrorBoundary fallback={<RouteFallback title={title} />}>
        {children}
      </AppErrorBoundary>
    </Suspense>
  );
}

import { hydrateAllStores } from '@/services/sync';

function App() {
  const setAuth = useProfileStore((s) => s.setAuth);
  const setInitialized = useProfileStore((s) => s.setInitialized);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // Sync with backend to get a valid backend token
          const syncResponse = await apiClient.post<{ user: any, token: string }>('/auth/sync', {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          });

          const backendToken = syncResponse.token;
          apiClient.setToken(backendToken);
          localStorage.setItem('bovye-token', backendToken);

          setAuth({
            isAuthenticated: true,
            authToken: backendToken,
            userId: syncResponse.user.id,
          });
          // Ensure profile and other stores are hydrated BEFORE considering initialization complete
          await hydrateAllStores();
        } else {
          apiClient.clearToken();
          localStorage.removeItem('bovye-token');
          setAuth({ isAuthenticated: false, authToken: null, userId: null });
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err);
      } finally {
        setInitialized(true);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        try {
          const syncResponse = await apiClient.post<{ user: any, token: string }>('/auth/sync', {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          });

          const backendToken = syncResponse.token;
          apiClient.setToken(backendToken);
          localStorage.setItem('bovye-token', backendToken);

          setAuth({
            isAuthenticated: true,
            authToken: backendToken,
            userId: syncResponse.user.id,
          });
          await hydrateAllStores();
        } catch (err) {
          console.error('Failed to sync auth state:', err);
        }
      } else if (!session) {
        apiClient.clearToken();
        localStorage.removeItem('bovye-token');
        setAuth({ isAuthenticated: false, authToken: null, userId: null });
      }
    });

    return () => subscription.unsubscribe();
  }, [setAuth, setInitialized]);

  return (
    <AppErrorBoundary>
      <ThemeProvider defaultTheme="light" storageKey="bovye-theme-v2">
        <TooltipProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ToastContainer />
            <MilestoneCelebration />
            <Routes>
              <Route path="login" element={
                <LazyRoute title="Login">
                  <Auth />
                </LazyRoute>
              } />
              <Route path="auth/callback" element={
                <LazyRoute title="Authenticating">
                  <AuthCallback />
                </LazyRoute>
              } />
              <Route path="onboarding" element={
                <LazyRoute title="Onboarding">
                  <Onboarding />
                </LazyRoute>
              } />
              <Route
                element={
                  <RouteGuard>
                    <DashboardLayout />
                  </RouteGuard>
                }
              >
                <Route index element={<LazyRoute title="Dashboard"><Dashboard /></LazyRoute>} />
                <Route path="roadmap" element={<LazyRoute title="Roadmap"><Roadmap /></LazyRoute>} />
                <Route path="toolkit" element={<LazyRoute title="Toolkit"><Toolkit /></LazyRoute>} />
                <Route path="community" element={<LazyRoute title="Community"><Community /></LazyRoute>} />
                <Route path="learning-hub" element={<LazyRoute title="Learning Hub"><LearningHub /></LazyRoute>} />
                <Route path="profile" element={<LazyRoute title="Profile"><Profile /></LazyRoute>} />
              </Route>
              <Route path="*" element={<LazyRoute title="Page"><NotFound /></LazyRoute>} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AppErrorBoundary>
  );
}

export default App;
