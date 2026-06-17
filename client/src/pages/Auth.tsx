import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  User
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useProfileStore } from '@/store/useProfileStore';
import { apiClient } from '@/lib/api';
import { hydrateProfile } from '@/services/sync';
import BovyeLogo from '@/components/layout/BovyeLogo';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const setAuth = useProfileStore((s) => s.setAuth);
  const updateBasicInfo = useProfileStore((s) => s.updateBasicInfo);
  const isAuthenticated = useProfileStore((s) => s.isAuthenticated);
  const isInitialized = useProfileStore((s) => s.isInitialized);

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isInitialized, isAuthenticated, navigate]);

  function parseName(nameStr: string) {
    const parts = nameStr.trim().split(' ');
    const first = parts[0] || '';
    const last = parts.slice(1).join(' ') || '';
    return { first, last };
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
  const { data, error: signInError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (signInError) throw signInError;

  if (data.session) {

    // Sync user with backend
    const syncResponse = await apiClient.post<{
      user: any;
      token: string;
    }>('/auth/sync', {
      id: data.user.id,
      email: data.user.email,
      name:
        data.user.user_metadata?.full_name ||
        data.user.email?.split('@')[0],
    });

    const backendToken = syncResponse.token;

    // Store BACKEND token (NOT Supabase token)
    apiClient.setToken(backendToken);

    // Update auth store
    setAuth({
      isAuthenticated: true,
      authToken: backendToken,
      userId: syncResponse.user.id,
    });

    // Update basic info
    const { first, last } = parseName(
      data.user.user_metadata?.full_name || ''
    );

    updateBasicInfo({
      firstName: first,
      lastName: last,
      email: data.user.email || '',
    });

    // Hydrate profile
    try {
      await hydrateProfile();
    } catch (err) {
      console.error('Failed to hydrate profile:', err);
    }

    navigate('/');
  }
} else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });
        if (signUpError) throw signUpError;
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      if (googleError) throw googleError;
    } catch (err: any) {
      setError(err.message || 'Google login failed');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 relative overflow-hidden">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md z-10">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-display font-extrabold mb-4 text-foreground">Check your email</h1>
          <p className="text-muted-foreground font-body text-lg mb-8">
            We've sent a magic link to <span className="font-bold text-foreground">{email}</span>. Click it to confirm your account.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="btn-gradient text-white px-8 py-3 rounded-xl font-bold inline-block"
          >
            Back to Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background px-6">
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] transition-colors duration-700 ${isLogin ? 'bg-orange-500/10' : 'bg-pink-500/10'}`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] transition-colors duration-700 ${isLogin ? 'bg-purple-500/10' : 'bg-blue-500/10'}`} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <RouterLink to="/">
            <BovyeLogo className="text-3xl mb-4" />
          </RouterLink>
          <h1 className="text-2xl font-display font-extrabold text-foreground">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-muted-foreground font-body mt-2">
            {isLogin ? 'Log in to your execution OS' : 'Start your execution journey today'}
          </p>
        </div>

        <div className="bg-card/50 backdrop-blur-xl border border-border/50 p-8 rounded-3xl shadow-xl">
          <form onSubmit={handleAuth} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="overflow-hidden"
                >
                  <label className="block text-sm font-semibold mb-2 text-foreground ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required={!isLogin}
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-semibold mb-2 text-foreground ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between ml-1 mb-2">
                <label className="block text-sm font-semibold text-foreground">Password</label>
                {isLogin && (
                  <RouterLink to="/forgot-password" title="Forgot password" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
                    Forgot?
                  </RouterLink>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-[13px] font-bold flex items-center gap-2 border border-destructive/10">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full btn-gradient text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{isLogin ? 'Log In' : 'Sign Up'} <ArrowRight className="w-5 h-5" /></>}
            </motion.button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-4 text-muted-foreground font-medium">Or continue with</span>
            </div>
          </div>

          <motion.button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-background border border-border text-foreground py-3 rounded-xl font-bold hover:bg-muted transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
          </motion.button>
        </div>

        <p className="text-center mt-8 text-muted-foreground font-body">
          {isLogin ? "Don't have an account?" : "Already have an account?"} {' '}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(null); }}
            className="text-primary font-bold hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
