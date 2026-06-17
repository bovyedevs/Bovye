import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Building2, MapPin, Tag, Bell, Moon } from 'lucide-react';
import { useProfileStore } from '@/store/useProfileStore';
import { TagInput } from '@/components/profile/TagInput';
import { cn } from '@/lib/utils';

const roleLabels: Record<string, string> = {
  founder: 'Founder',
  investor: 'Investor',
  mentor: 'Mentor',
  explorer: 'Explorer',
};

const roleDescriptions: Record<string, string> = {
  founder: 'Building a startup from the ground up',
  investor: 'Evaluating and funding promising startups',
  mentor: 'Guiding founders with experience',
  explorer: 'Curious about the startup landscape',
};

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-warm-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-muted-foreground">{icon}</span>
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

export default function Profile() {
  const profile = useProfileStore();
  const [skills, setSkills] = useState<string[]>(profile.skills || []);
  const [interests, setInterests] = useState<string[]>(profile.interests || []);

  useEffect(() => {
    const t = setTimeout(() => {
      profile.updateProfile({ skills, interests });
    }, 500);
    return () => clearTimeout(t);
  }, [skills, interests]);

  const roleKey = profile.role ?? 'founder';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="min-h-full p-4 md:p-6 lg:p-8"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Profile<span className="text-primary">.</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <Section title="Personal Info" icon={<User className="h-4 w-4" />}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First Name" value={profile.firstName} />
              <Field label="Last Name" value={profile.lastName} />
              <Field label="Email" value={profile.email} className="sm:col-span-2" />
              <Field label="Company" value={profile.company} />
              <Field label="Industry" value={profile.industry} />
            </div>
            {profile.bio && (
              <div className="mt-4">
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">
                  Bio
                </label>
                <p className="text-sm text-foreground leading-relaxed">
                  {profile.bio}
                </p>
              </div>
            )}
          </Section>

          <Section title="Skills & Interests" icon={<Tag className="h-4 w-4" />}>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                  Skills
                </label>
                <TagInput
                  tags={skills}
                  onChange={setSkills}
                  placeholder="Add a skill (e.g. product management, engineering)..."
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                  Interests
                </label>
                <TagInput
                  tags={interests}
                  onChange={setInterests}
                  placeholder="Add an interest (e.g. AI, fintech, sustainability)..."
                />
              </div>
            </div>
          </Section>

          <Section title="Company Documents" icon={<Building2 className="h-4 w-4" />}>
            <p className="text-sm text-muted-foreground">
              Manage your startup documents in the{' '}
              <a href="/toolkit" className="text-primary hover:underline font-medium">
                Toolkit → Company Docs
              </a>
              {' '}section.
            </p>
          </Section>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Role Card */}
          <Section title="Role" icon={<MapPin className="h-4 w-4" />}>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <span className="text-lg font-bold text-primary">
                  {roleKey.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {roleLabels[roleKey]}
                </p>
                <p className="text-xs text-muted-foreground">
                  {roleDescriptions[roleKey]}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Role is set during onboarding. Contact support to change.
            </p>
          </Section>

          {/* Preferences */}
          <Section title="Preferences" icon={<Bell className="h-4 w-4" />}>
            <div className="space-y-3">
              <PrefRow icon={<Bell className="h-3.5 w-3.5" />} label="Notification Time" value={profile.preferences.notificationTime} />
              <PrefRow icon={<Moon className="h-3.5 w-3.5" />} label="Theme" value={profile.preferences.theme.charAt(0).toUpperCase() + profile.preferences.theme.slice(1)} />
            </div>
          </Section>

          {/* Account */}
          <Section title="Account" icon={<Mail className="h-4 w-4" />}>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2">
                <span className="text-xs text-muted-foreground">Status</span>
                <span className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium',
                  profile.isAuthenticated
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-muted text-muted-foreground'
                )}>
                  <span className={cn(
                    'h-1.5 w-1.5 rounded-full',
                    profile.isAuthenticated ? 'bg-emerald-500' : 'bg-muted-foreground'
                  )} />
                  {profile.isAuthenticated ? 'Authenticated' : 'Local Mode'}
                </span>
              </div>
              {profile.userId && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs text-muted-foreground">User ID</span>
                  <span className="text-xs font-mono text-muted-foreground">
                    {profile.userId.slice(0, 8)}...
                  </span>
                </div>
              )}
            </div>
          </Section>
        </div>
      </div>
    </motion.div>
  );
}

function Field({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={cn(className)}>
      <label className="text-xs font-semibold text-muted-foreground mb-1 block">
        {label}
      </label>
      <p className="text-sm text-foreground">
        {value || <span className="text-muted-foreground/50">Not set</span>}
      </p>
    </div>
  );
}

function PrefRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-sm text-foreground">{label}</span>
      </div>
      <span className="text-sm font-medium text-muted-foreground">{value}</span>
    </div>
  );
}
