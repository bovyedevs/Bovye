import { useForm } from 'react-hook-form';
import { useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProfileStore } from '@/store/useProfileStore';

interface BasicForm {
  firstName: string;
  lastName: string;
  email: string;
}

export function StepBasic({ onNext }: { onNext: () => void }) {
  const profile = useProfileStore();
  const { register, handleSubmit, formState: { isValid }, getValues } = useForm<BasicForm>({
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
    },
    mode: 'onChange',
  });

  const handleBlur = useCallback(
    (field: keyof BasicForm) => {
      const value = getValues(field);
      const current = profile[field];
      if (value !== current) {
        profile.updateBasicInfo({ ...getValues() });
      }
    },
    [getValues, profile]
  );

  const onSubmit = useCallback((data: BasicForm) => {
    profile.updateBasicInfo(data);
    onNext();
  }, [profile, onNext]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-semibold text-foreground mb-2">
            First Name
          </label>
          <Input
            id="firstName"
            placeholder="Jane"
            className="h-11 text-sm"
            {...register('firstName', { required: true })}
            onBlur={() => handleBlur('firstName')}
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-semibold text-foreground mb-2">
            Last Name
          </label>
          <Input
            id="lastName"
            placeholder="Doe"
            className="h-11 text-sm"
            {...register('lastName', { required: true })}
            onBlur={() => handleBlur('lastName')}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="jane@example.com"
            className="h-11 text-sm"
            {...register('email', { required: true, pattern: /^\S+@\S+\.\S+$/ })}
            onBlur={() => handleBlur('email')}
          />
        </div>
      </div>

      <Button type="submit" disabled={!isValid} className="h-11 px-8 text-sm btn-gradient rounded font-semibold w-full">
        Continue
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
}
