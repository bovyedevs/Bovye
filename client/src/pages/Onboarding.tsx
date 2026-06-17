import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import  BovyeLogo  from '../components/layout/BovyeLogo';
import { StepBasic } from '@/components/onboarding/StepBasic';
import { StepRole } from '@/components/onboarding/StepRole';
import { StepStartupType } from '@/components/onboarding/StepStartupType';
import { StepDetails } from '@/components/onboarding/StepDetails';
import { StepPreferences } from '@/components/onboarding/StepPreferences';
import { useProfileStore } from '@/store/useProfileStore';
import { syncProfile, syncPreferences } from '@/services/sync';
import { cn } from '@/lib/utils';

const steps = ['basic', 'role', 'startupType', 'details', 'preferences'] as const;
const stepLabels: Record<string, string> = {
  basic: 'About You',
  role: 'Your Role',
  startupType: 'Startup Type',
  details: 'Your Startup',
  preferences: 'Preferences',
};

export default function Onboarding() {
  const navigate = useNavigate();
  const [direction, setDirection] = useState(1);
  const [finishing, setFinishing] = useState(false);

  const role = useProfileStore((s) => s.role);
  const isFounder = role === 'founder';

  const visibleSteps = isFounder
    ? steps
    : (['basic', 'role', 'preferences'] as const);

  const [visibleIndex, setVisibleIndex] = useState(0);
  const actualStep = visibleSteps[visibleIndex]!;

  const goNext = useCallback(() => {
    if (visibleIndex < visibleSteps.length - 1) {
      setDirection(1);
      setVisibleIndex((i) => i + 1);
    }
  }, [visibleIndex, visibleSteps.length]);

  const goBack = useCallback(() => {
    if (visibleIndex > 0) {
      setDirection(-1);
      setVisibleIndex((i) => i - 1);
    }
  }, [visibleIndex]);

  const handleFinish = useCallback(async () => {
    setFinishing(true);
    const profile = useProfileStore.getState();
    const fullName = `${profile.firstName} ${profile.lastName}`.trim() || 'Founder';

    await syncProfile({
      name: fullName,
      role: profile.role,
      startupType: profile.startupType,
      company: profile.company || null,
      industry: profile.industry || null,
      bio: profile.bio || null,
    });
    await syncPreferences({
      notificationTime: profile.preferences.notificationTime,
      theme: profile.preferences.theme,
      onboardingComplete: true,
    });

    profile.completeOnboarding();
    navigate('/', { replace: true });
  }, [navigate]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
    }),
  };

  const renderStep = () => {
    switch (actualStep) {
      case 'basic':
        return <StepBasic onNext={goNext} />;
      case 'role':
        return <StepRole onNext={goNext} />;
      case 'startupType':
        return <StepStartupType onNext={goNext} />;
      case 'details':
        return <StepDetails onNext={goNext} />;
      case 'preferences':
        return <StepPreferences onNext={handleFinish} isLoading={finishing} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-8 overflow-hidden">
      {/* Ambient Background */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="absolute h-[40rem] w-[40rem] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute h-[30rem] w-[30rem] -translate-x-1/3 translate-y-1/3 rounded-full bg-amber-500/10 blur-[100px] dark:bg-amber-600/10" />
      </div>

      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-border/50 bg-background/60 p-8 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-8">
          <BovyeLogo />
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {stepLabels[actualStep]}
            </span>
            <span className="text-xs font-medium text-muted-foreground tabular-nums">
              Step {visibleIndex + 1} of {steps.length}
            </span>
          </div>
          
          {/* Segmented Progress Indicator */}
          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'h-1.5 flex-1 rounded-full transition-all duration-300',
                  index <= visibleIndex ? 'bg-primary shadow-[0_0_10px_hsl(var(--primary)_/_0.5)]' : 'bg-secondary'
                )}
              />
            ))}
          </div>
        </div>
        {/* Step Content */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={visibleIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Back Button */}
        {visibleIndex > 0 && (
          <div className="mt-6">
            <button
              type="button"
              onClick={goBack}
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              &larr; Go back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
