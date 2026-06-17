import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProfileStore } from '@/store/useProfileStore';
import { PageSkeleton } from '@/components/loading/PageSkeleton';

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useProfileStore((s) => s.isAuthenticated);
  const onboardingComplete = useProfileStore((s) => s.onboardingComplete);
  const role = useProfileStore((s) => s.role);
  const isInitialized = useProfileStore((s) => s.isInitialized);
  const isHydrating = useProfileStore((s) => s.isHydrating);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isInitialized || isHydrating) return;

    if (!isAuthenticated) {
      navigate('/login', { replace: true, state: { from: location.pathname } });
    } else if (!onboardingComplete && !role && location.pathname !== '/onboarding') {
      // Only redirect to onboarding if onboarding is not complete AND no role is set
      // This allows existing users with roles to access the dashboard even if onboardingComplete is false
      navigate('/onboarding', { replace: true });
    }
  }, [isInitialized, isHydrating, isAuthenticated, onboardingComplete, role, navigate, location.pathname]);

  if (!isInitialized || isHydrating) {
    return <PageSkeleton />;
  }

  if (!isAuthenticated || (!onboardingComplete && !role && location.pathname !== '/onboarding')) {
    return null;
  }

  return <>{children}</>;
}
