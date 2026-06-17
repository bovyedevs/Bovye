import { useState, useCallback } from 'react';
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToolkitStore } from '@/store/useToolkitStore';
import { PITCH_DECK_SLIDES } from '@/types/toolkit';
import type { PitchDeckSlideKey } from '@/types/toolkit';

interface TipsBarProps {
  tips: string[];
}

function TipsBar({ tips }: TipsBarProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="h-4 w-4 text-primary/80" />
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Tips for this slide
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {tips.map((tip, index) => (
          <button
            key={index}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5',
              'text-xs font-medium text-muted-foreground transition-all duration-200',
              'hover:border-primary/40 hover:text-foreground hover:bg-primary/[0.03]',
              openIndex === index && 'border-primary/40 bg-primary/[0.04] text-foreground'
            )}
          >
            {openIndex === index ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
            <span className="max-w-[200px] truncate">{tip}</span>
          </button>
        ))}
      </div>
      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {tips[openIndex]}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface SlideEditorProps {
  slideKey: PitchDeckSlideKey;
  label: string;
  icon: string;
  tips: string[];
  value: string;
  onChange: (value: string) => void;
}

function SlideEditor({ label, icon, tips, value, onChange }: SlideEditorProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{icon}</span>
        <h3 className="text-sm font-semibold text-foreground">
          {label}
        </h3>
      </div>
      <Textarea
        value={value}
        onChange={handleChange}
        placeholder={`Write your ${label.toLowerCase()} slide content here...`}
        rows={12}
        className="min-h-[200px] resize-y text-sm leading-relaxed"
      />
      <TipsBar tips={tips} />
    </div>
  );
}

export function PitchDeckBuilder() {
  const pitchDeck = useToolkitStore((s) => s.pitchDeck);
  const updatePitchDeckSlide = useToolkitStore((s) => s.updatePitchDeckSlide);

  const [activeTab, setActiveTab] = useState<PitchDeckSlideKey>(
    PITCH_DECK_SLIDES[0].key
  );

  const handleSlideChange = useCallback(
    (key: PitchDeckSlideKey, value: string) => {
      updatePitchDeckSlide(key, value);
    },
    [updatePitchDeckSlide]
  );

  const totalFields = PITCH_DECK_SLIDES.length;
  const completedFields = PITCH_DECK_SLIDES.filter(
    (s) => (pitchDeck[s.key] || '').trim().length > 0
  ).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Pitch Deck Builder</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Build your investor pitch slide by slide
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold tabular-nums text-foreground">
            {completedFields}/{totalFields}
          </span>
          <p className="text-xs text-muted-foreground">slides started</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as PitchDeckSlideKey)}>
        <TabsList className="w-full justify-start overflow-x-auto gap-1 bg-transparent p-0 h-auto">
          {PITCH_DECK_SLIDES.map((slide) => {
            const hasContent = (pitchDeck[slide.key] || '').trim().length > 0;
            return (
              <TabsTrigger
                key={slide.key}
                value={slide.key}
                className={cn(
                  'relative rounded-md px-3 py-2 text-xs font-medium transition-all duration-200',
                  'data-[state=active]:bg-background data-[state=active]:shadow-warm-sm data-[state=active]:text-foreground'
                )}
              >
                <span className="mr-1.5">{slide.icon}</span>
                {slide.label}
                {hasContent && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 items-center justify-center">
                    <span className="absolute h-full w-full rounded-full bg-primary/60 animate-pulse-soft" />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-primary" />
                  </span>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {PITCH_DECK_SLIDES.map((slide) => (
          <TabsContent key={slide.key} value={slide.key} className="mt-4">
            <Card className="p-5 shadow-warm-sm">
              <SlideEditor
                slideKey={slide.key}
                label={slide.label}
                icon={slide.icon}
                tips={slide.tips}
                value={pitchDeck[slide.key]}
                onChange={(value) => handleSlideChange(slide.key, value)}
              />
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-8 flex items-center justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => {
            PITCH_DECK_SLIDES.forEach((slide) => {
              updatePitchDeckSlide(slide.key, '');
            });
          }}
        >
          Reset All
        </Button>
        <Button variant="default">
          Save Draft
        </Button>
      </div>
    </div>
  );
}
