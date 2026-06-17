import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import { supabase } from '@/lib/supabase';
import { apiClient } from '@/lib/api';

import { useProfileStore } from '@/store/useProfileStore';
import { hydrateAllStores } from '@/services/sync';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get current session from Supabase
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        // No session found
        if (!session) {
          navigate('/login', { replace: true });
          return;
        }

        // Sync user with backend
        const syncResponse = await apiClient.post<{
          user: any;
          token: string;
        }>('/auth/sync', {
          id: session.user.id,
          email: session.user.email,
          name:
            session.user.user_metadata?.full_name ||
            session.user.email?.split('@')[0],
        });

        const backendToken = syncResponse.token;

        // Store backend token
        apiClient.setToken(backendToken);

        // Update auth store
        useProfileStore.getState().setAuth({
          isAuthenticated: true,
          authToken: backendToken,
          userId: syncResponse.user.id,
        });

        // Hydrate stores
        await hydrateAllStores();

        // Redirect
        navigate('/', { replace: true });
      } catch (err) {
        console.error('Error during auth callback:', err);

        // Cleanup
        apiClient.clearToken();

        navigate('/login', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground font-medium">
          Completing sign in...
        </p>
      </div>
    </div>
  );
}