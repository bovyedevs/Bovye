import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle, Lightbulb, Circle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToolkitStore } from '@/store/useToolkitStore';
import type { IdeaValidationData } from '@/types/toolkit';

interface FormFieldConfig {
  key: keyof IdeaValidationData;
  label: string;
  description: string;
  placeholder: string;
}

const formFields: FormFieldConfig[] = [
  {
    key: 'targetAudience',
    label: 'Target Audience',
    description: 'Who exactly are you building this for? Be specific — demographics, behaviors, pain points.',
    placeholder: 'e.g. Freelance designers aged 25-40 who struggle with client management...',
  },
  {
    key: 'problem',
    label: 'Problem Statement',
    description: 'What core problem does your startup solve? Quantify the impact if possible.',
    placeholder: 'e.g. Freelancers spend 8+ hours per week on invoicing and follow-ups...',
  },
  {
    key: 'solution',
    label: 'Your Solution',
    description: 'How does your product directly address this problem? Keep it concrete.',
    placeholder: 'e.g. An automated invoicing tool that tracks time, generates invoices, and sends follow-ups...',
  },
  {
    key: 'competitors',
    label: 'Competitive Landscape',
    description: 'Who else is solving this? What are their weaknesses and your advantages?',
    placeholder: 'e.g. FreshBooks and Wave exist but lack AI-powered client communication...',
  },
  {
    key: 'uniqueValue',
    label: 'Unique Value Proposition',
    description: 'What makes you fundamentally different? Why would customers choose you?',
    placeholder: 'e.g. First tool that combines invoicing with AI-driven client relationship management...',
  },
];

function ValidationScoreBadge({ filledCount }: { filledCount: number }) {
  const total = formFields.length;
  const score = Math.round((filledCount / total) * 100);

  if (score === 0) {
    return (
      <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs font-medium">
        <Circle className="h-3 w-3" />
        Not started
      </Badge>
    );
  }

  if (score === 100) {
    return (
      <Badge
        className="gap-1.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-0 px-3 py-1 text-xs font-medium"
      >
        <CheckCircle className="h-3 w-3" />
        Complete
      </Badge>
    );
  }

  return (
    <Badge variant="default" className="gap-1.5 px-3 py-1 text-xs font-medium">
      <Lightbulb className="h-3 w-3" />
      {score}% validated
    </Badge>
  );
}

export function IdeaValidator() {
  const ideaData = useToolkitStore((s) => s.ideaData);
  const updateIdeaData = useToolkitStore((s) => s.updateIdeaData);

  const { register, getValues, formState } = useForm<IdeaValidationData>({
    defaultValues: ideaData,
  });

  const handleBlur = useCallback(
    (field: keyof IdeaValidationData) => {
      const value = getValues(field);
      if (value !== ideaData[field]) {
        updateIdeaData({ [field]: value });
      }
    },
    [getValues, ideaData, updateIdeaData]
  );

  const filledCount = useMemo(() => {
    const values = getValues();
    return Object.values(values).filter((v) => v.trim().length > 0).length;
  }, [formState.isDirty, getValues]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Idea Validator</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Answer 5 critical questions to validate your startup idea
          </p>
        </div>
        <ValidationScoreBadge filledCount={filledCount} />
      </div>

      <div className="space-y-6">
        {formFields.map((field, index) => (
          <motion.div
            key={field.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.3 }}
          >
            <Card className="group shadow-warm-sm">
              <CardContent className="p-5">
                <div className="mb-3">
                  <label className="text-sm font-semibold text-foreground">
                    {field.label}
                  </label>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {field.description}
                  </p>
                </div>
                <Textarea
                  placeholder={field.placeholder}
                  rows={3}
                  className="min-h-[80px] resize-y"
                  {...register(field.key)}
                  onBlur={() => handleBlur(field.key)}
                />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-end">
        <Button
          variant="outline"
          onClick={() => {
            const values = getValues();
            updateIdeaData(values);
          }}
        >
          Save Progress
        </Button>
      </div>
    </div>
  );
}
