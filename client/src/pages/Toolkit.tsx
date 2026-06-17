import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Presentation, ArrowRight, ChevronLeft, TrendingUp, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IdeaValidator } from '@/components/toolkit/IdeaValidator';
import { PitchDeckBuilder } from '@/components/toolkit/PitchDeckBuilder';
import { FundingChecklist } from '@/components/toolkit/FundingChecklist';
import { CompanyDocs } from '@/components/toolkit/CompanyDocs';

type ActiveTool = 'validator' | 'deck' | 'funding' | 'docs' | null;

interface ToolCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
}

function ToolCard({ icon, title, description, isActive, onClick }: ToolCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group flex w-full flex-col items-start rounded-xl border p-6 text-left',
        'transition-all duration-300 ease-out',
        'shadow-warm-sm hover:shadow-warm-md hover:-translate-y-0.5',
        isActive
          ? 'border-primary/40 bg-primary/[0.03] ring-1 ring-primary/20'
          : 'border-border bg-card hover:border-primary/30'
      )}
    >
      <div className={cn(
        'flex h-11 w-11 items-center justify-center rounded-lg mb-4',
        'transition-colors duration-200',
        isActive
          ? 'bg-primary/15 text-primary'
          : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
      )}>
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      <div className={cn(
        'mt-4 flex items-center gap-1 text-xs font-medium transition-colors duration-200',
        isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
      )}>
        {isActive ? 'Active' : 'Open'}
        <ArrowRight className="h-3 w-3" />
      </div>
    </button>
  );
}

export default function Toolkit() {
  const [activeTool, setActiveTool] = useState<ActiveTool>(null);

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
          Toolkit<span className="text-primary">.</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tools to validate, pitch, fund, and organize your startup
        </p>
      </div>

      {/* Tool Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <ToolCard
          icon={<Lightbulb className="h-5 w-5" />}
          title="Idea Validator"
          description="Answer 5 critical questions to validate your startup idea."
          isActive={activeTool === 'validator'}
          onClick={() => setActiveTool(activeTool === 'validator' ? null : 'validator')}
        />
        <ToolCard
          icon={<Presentation className="h-5 w-5" />}
          title="Pitch Deck Builder"
          description="Build an investor pitch deck, slide by slide, with guided tips."
          isActive={activeTool === 'deck'}
          onClick={() => setActiveTool(activeTool === 'deck' ? null : 'deck')}
        />
        <ToolCard
          icon={<TrendingUp className="h-5 w-5" />}
          title="Funding Checklist"
          description="Track readiness across Pre-Seed, Seed, and Series A stages."
          isActive={activeTool === 'funding'}
          onClick={() => setActiveTool(activeTool === 'funding' ? null : 'funding')}
        />
        <ToolCard
          icon={<FileText className="h-5 w-5" />}
          title="Company Docs"
          description="Organize and attach your startup's essential documents."
          isActive={activeTool === 'docs'}
          onClick={() => setActiveTool(activeTool === 'docs' ? null : 'docs')}
        />
      </div>

      {/* Active Tool Content */}
      <AnimatePresence mode="wait">
        {activeTool && (
          <motion.div
            key={activeTool}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-4 flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-muted-foreground hover:text-foreground"
                onClick={() => setActiveTool(null)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to tools
              </Button>
            </div>
            <Card className="p-6 shadow-warm-sm">
              {activeTool === 'validator' && <IdeaValidator />}
              {activeTool === 'deck' && <PitchDeckBuilder />}
              {activeTool === 'funding' && <FundingChecklist />}
              {activeTool === 'docs' && <CompanyDocs />}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
