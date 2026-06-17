import { useState, useRef, useCallback } from 'react';
import { Paperclip, X, FileText, ChevronDown, CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { useToolkitStore } from '@/store/useToolkitStore';
import {
  DOC_CATEGORIES,
  formatFileSize,
  type DocRequirement,
} from '@/types/toolkit';

function generateFileId(): string {
  return `file_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function AttachedFiles({
  files,
  onRemove,
}: {
  files: { id: string; name: string; size: number; type: string; dataUrl: string; attachedAt: string }[];
  onRemove: (fileId: string) => void;
}) {
  if (files.length === 0) return null;

  return (
    <div className="mt-3 space-y-2">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground truncate">
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(file.size)}
            </p>
          </div>
          <button
            onClick={() => onRemove(file.id)}
            className="flex-shrink-0 p-1 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

function DocRequirementRow({
  categoryId,
  requirement,
}: {
  categoryId: string;
  requirement: DocRequirement;
}) {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateDocStatus = useToolkitStore((s) => s.updateDocStatus);
  const updateDocNotes = useToolkitStore((s) => s.updateDocNotes);
  const attachDocFile = useToolkitStore((s) => s.attachDocFile);
  const removeDocFile = useToolkitStore((s) => s.removeDocFile);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        attachDocFile(categoryId, requirement.id, {
          id: generateFileId(),
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl: reader.result as string,
          attachedAt: new Date().toISOString(),
        });
      };
      reader.readAsDataURL(file);

      if (e.target) e.target.value = '';
    },
    [attachDocFile, categoryId, requirement.id]
  );

  const handleNotesBlur = useCallback(() => {
    setIsEditingNotes(false);
  }, []);

  const statusConfig = {
    'not-started': {
      icon: Circle,
      label: 'Not Started',
      color: 'text-muted-foreground',
      dotColor: 'bg-muted-foreground/40',
    },
    'in-progress': {
      icon: AlertCircle,
      label: 'In Progress',
      color: 'text-amber-500',
      dotColor: 'bg-amber-500',
    },
    'complete': {
      icon: CheckCircle,
      label: 'Complete',
      color: 'text-emerald-500',
      dotColor: 'bg-emerald-500',
    },
  };

  const config = statusConfig[requirement.status];
  const StatusIcon = config.icon;

  const nextStatus: Record<string, DocRequirement['status']> = {
    'not-started': 'in-progress',
    'in-progress': 'complete',
    'complete': 'not-started',
  };

  return (
    <div className="border border-border rounded-xl p-4 transition-all duration-200 hover:shadow-warm-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <button
            onClick={() => updateDocStatus(categoryId, requirement.id, nextStatus[requirement.status])}
            className="mt-0.5 flex-shrink-0"
            title={`Click to cycle status (current: ${config.label})`}
          >
            <StatusIcon className={cn('h-5 w-5', config.color)} />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">
              {requirement.label}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={cn('h-1.5 w-1.5 rounded-full', config.dotColor)} />
              <span className={cn('text-xs font-medium', config.color)}>
                {config.label}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-shrink-0 flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <Paperclip className="h-3.5 w-3.5" />
          Attach
          {requirement.files.length > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
              {requirement.files.length}
            </span>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Notes */}
      <div className="mt-3 pl-8">
        <AnimatePresence>
          {isEditingNotes ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <Textarea
                value={requirement.notes}
                onChange={(e) => updateDocNotes(categoryId, requirement.id, e.target.value)}
                onBlur={handleNotesBlur}
                placeholder="Add notes about this document..."
                rows={2}
                className="text-sm min-h-[60px]"
                autoFocus
              />
            </motion.div>
          ) : (
            <button
              onClick={() => setIsEditingNotes(true)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors w-full text-left py-1"
            >
              {requirement.notes ? requirement.notes : '+ Add notes'}
            </button>
          )}
        </AnimatePresence>
      </div>

      {/* Attached Files */}
      <div className="pl-8">
        <AttachedFiles
          files={requirement.files}
          onRemove={(fileId) => removeDocFile(categoryId, requirement.id, fileId)}
        />
      </div>
    </div>
  );
}

export function CompanyDocs() {
  const [activeCategory, setActiveCategory] = useState<string>('legal');
  const companyDocs = useToolkitStore((s) => s.companyDocs);

  const activeCat = DOC_CATEGORIES.find((c) => c.id === activeCategory);
  const activeRequirements = companyDocs.categories.find(
    (c) => c.categoryId === activeCategory
  )?.requirements ?? [];

  const totalReqs = activeRequirements.length;
  const completeReqs = activeRequirements.filter((r) => r.status === 'complete').length;
  const pct = totalReqs > 0 ? Math.round((completeReqs / totalReqs) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Company Docs</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Organize and attach your startup's essential documents
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold tabular-nums text-foreground">
            {pct}%
          </span>
          <p className="text-xs text-muted-foreground">category complete</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
        {DOC_CATEGORIES.map((cat) => {
          const catReqs = companyDocs.categories.find(
            (c) => c.categoryId === cat.id
          )?.requirements ?? [];
          const catComplete = catReqs.filter((r) => r.status === 'complete').length;
          const catPct = catReqs.length > 0 ? Math.round((catComplete / catReqs.length) * 100) : 0;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                'flex flex-col items-start rounded-lg border px-4 py-2.5 text-left transition-all duration-200 min-w-[120px]',
                activeCategory === cat.id
                  ? 'border-primary bg-primary/[0.04] ring-1 ring-primary/20'
                  : 'border-border bg-card hover:border-primary/30'
              )}
            >
              <span className="text-xs font-semibold text-foreground">{cat.label}</span>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="h-1 w-10 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${catPct}%` }}
                  />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground tabular-nums">
                  {catPct}%
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Description */}
      {activeCat && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {activeCat.label}
          </span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {activeCat.description}
          </span>
        </div>
      )}

      {/* Requirements List */}
      <div className="space-y-3">
        {activeRequirements.map((req) => (
          <DocRequirementRow
            key={req.id}
            categoryId={activeCategory}
            requirement={req}
          />
        ))}
      </div>
    </div>
  );
}
