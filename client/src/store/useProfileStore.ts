import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PathwayId } from '@/data/roadmapTemplates';

export type UserRole = 'founder' | 'investor' | 'mentor' | 'explorer';
export type OnboardingStep = 'basic' | 'role' | 'startupType' | 'details' | 'preferences' | 'complete';

export interface UserPreferences {
  notificationTime: string;
  theme: 'light' | 'dark' | 'system';
}

export interface ProfileState {
  onboardingComplete: boolean;
  onboardingStep: OnboardingStep;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole | null;
  startupType: PathwayId | null;
  company: string;
  industry: string;
  bio: string;
  skills: string[];
  interests: string[];
  preferences: UserPreferences;
  isAuthenticated: boolean;
  authToken: string | null;
  userId: string | null;
  isInitialized: boolean;
  isHydrating: boolean;
}

export interface ProfileActions {
  setOnboardingStep: (step: OnboardingStep) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  setOnboardingComplete: (complete: boolean) => void;
  updateBasicInfo: (data: { firstName: string; lastName: string; email: string }) => void;
  setRole: (role: UserRole) => void;
  setStartupType: (type: PathwayId) => void;
  updateDetails: (data: { company: string; industry: string; bio: string }) => void;
  updateProfile: (data: Partial<ProfileState>) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  setAuth: (data: { isAuthenticated: boolean; authToken: string | null; userId: string | null }) => void;
  setInitialized: (initialized: boolean) => void;
  setHydrating: (hydrating: boolean) => void;
}

export type ProfileStore = ProfileState & ProfileActions;

const defaultPreferences: UserPreferences = {
  notificationTime: '09:00',
  theme: 'system',
};

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      onboardingComplete: false,
      onboardingStep: 'basic',
      firstName: '',
      lastName: '',
      email: '',
      role: null,
      startupType: null,
      company: '',
      industry: '',
      bio: '',
      skills: [],
      interests: [],
      preferences: defaultPreferences,
      isAuthenticated: false,
      authToken: null,
      userId: null,
      isInitialized: false,
      isHydrating: false,

      setOnboardingStep: (step) => set({ onboardingStep: step }),
      completeOnboarding: () => set({ onboardingComplete: true, onboardingStep: 'complete' }),
      resetOnboarding: () => set({
        onboardingComplete: false,
        onboardingStep: 'basic',
        firstName: '',
        lastName: '',
        email: '',
        role: null,
        startupType: null,
        company: '',
        industry: '',
        bio: '',
        skills: [],
        interests: [],
        preferences: defaultPreferences,
      }),
      setOnboardingComplete: (complete) => set({ onboardingComplete: complete }),
      updateBasicInfo: (data) => set((state) => ({
        ...state,
        ...data,
      })),
      setRole: (role) => set({ role }),
      setStartupType: (startupType) => set({ startupType }),
      updateDetails: (data) => set((state) => ({
        ...state,
        ...data,
      })),
      updateProfile: (data) => set((state) => ({
        ...state,
        ...data,
      })),
      updatePreferences: (prefs) => set((state) => ({
        preferences: { ...state.preferences, ...prefs },
      })),
      setAuth: (data) => set(data),
      setInitialized: (isInitialized) => set({ isInitialized }),
      setHydrating: (isHydrating) => set({ isHydrating }),
    }),
    {
      name: 'bovye-profile',
    }
  )
);
