import { useState, useCallback } from 'react';
import { Bell, Loader2, Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProfileStore } from '@/store/useProfileStore';

const timeOptions = [
  { value: '07:00', label: '7:00 AM' },
  { value: '08:00', label: '8:00 AM' },
  { value: '09:00', label: '9:00 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '18:00', label: '6:00 PM' },
];

const themeOptions = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
] as const;

export function StepPreferences({ onNext, isLoading }: { onNext: () => void; isLoading?: boolean }) {
  const profile = useProfileStore();
  const [notifTime, setNotifTime] = useState(profile.preferences.notificationTime);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(profile.preferences.theme);

  const handleFinish = useCallback(() => {
    profile.updatePreferences({ notificationTime: notifTime, theme });
    onNext();
  }, [profile, notifTime, theme, onNext]);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">Final preferences</h3>
        <p className="text-sm text-muted-foreground">
          Set your daily digest time and theme preference. You can adjust these anytime.
        </p>
      </div>

      {/* Notification Time */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">Daily Digest Time</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {timeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setNotifTime(option.value)}
              className={`rounded-lg border px-3 py-2.5 text-xs font-medium transition-all duration-200 ${
                notifTime === option.value
                  ? 'border-primary bg-primary/[0.06] text-primary ring-1 ring-primary/20'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/40'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Theme */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Sun className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">Theme</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {themeOptions.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setTheme(value)}
              className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-medium transition-all duration-200 ${
                theme === value
                  ? 'border-primary bg-primary/[0.06] text-primary ring-1 ring-primary/20'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/40'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <Button onClick={handleFinish} disabled={isLoading} className="h-11 px-8 text-sm btn-gradient rounded font-semibold w-full">
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Get Started'}
      </Button>
    </div>
  );
}
