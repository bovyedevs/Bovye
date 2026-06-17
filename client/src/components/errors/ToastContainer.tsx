import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast, type Toast } from '@/lib/toast';

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: AlertCircle,
};

const colors = {
  success: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400',
  error: 'border-destructive/30 bg-destructive/5 text-destructive',
  info: 'border-primary/30 bg-primary/5 text-primary',
};

function ToastItem({ toastItem }: { toastItem: Toast }) {
  const Icon = icons[toastItem.type];
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm shadow-warm',
        colors[toastItem.type]
      )}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span className="flex-1">{toastItem.message}</span>
      <button
        onClick={() => toast.dismiss(toastItem.id)}
        className="flex-shrink-0 opacity-60 hover:opacity-100 transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsub = toast.subscribe(setToasts);
    return () => unsub();
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-80">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 40, height: 0 }}
            animate={{ opacity: 1, x: 0, height: 'auto' }}
            exit={{ opacity: 0, x: 40, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ToastItem toastItem={t} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
