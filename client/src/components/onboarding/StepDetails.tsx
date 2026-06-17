import { useForm } from 'react-hook-form';
import { useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useProfileStore } from '@/store/useProfileStore';

interface DetailsForm {
  company: string;
  industry: string;
  bio: string;
}

export function StepDetails({ onNext }: { onNext: () => void }) {
  const profile = useProfileStore();
  const { register, handleSubmit, getValues } = useForm<DetailsForm>({
    defaultValues: {
      company: profile.company,
      industry: profile.industry,
      bio: profile.bio,
    },
  });

  const handleBlur = useCallback(() => {
    profile.updateDetails(getValues());
  }, [getValues, profile]);

  const onSubmit = useCallback((data: DetailsForm) => {
    profile.updateDetails(data);
    onNext();
  }, [profile, onNext]);

  const isFounder = profile.role === 'founder';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-foreground">
          {isFounder ? 'Tell us about your startup' : 'Tell us about yourself'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {isFounder
            ? 'These details help us tailor your roadmap and toolkit recommendations.'
            : 'Share a bit about your background and interests.'}
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="company" className="block text-sm font-semibold text-foreground mb-2">
            {isFounder ? 'Company / Project Name' : 'Organization'}
          </label>
          <Input
            id="company"
            placeholder={isFounder ? 'Acme Inc.' : 'Your company or institution'}
            className="h-11 text-sm"
            {...register('company')}
            onBlur={handleBlur}
          />
        </div>

        <div>
          <label htmlFor="industry" className="block text-sm font-semibold text-foreground mb-2">
            Industry
          </label>
          <Input
            id="industry"
            placeholder="e.g. SaaS, Fintech, HealthTech"
            className="h-11 text-sm"
            {...register('industry')}
            onBlur={handleBlur}
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-semibold text-foreground mb-2">
            Short Bio
          </label>
          <Textarea
            id="bio"
            placeholder="A sentence or two about what you're working on..."
            rows={3}
            className="min-h-[80px] text-sm"
            {...register('bio')}
            onBlur={handleBlur}
          />
        </div>
      </div>

      <Button type="submit" className="h-11 px-8 text-sm font-semibold w-full">
        Continue
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
}
