import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BovyeLogo } from '@/components/layout/Sidebar';

const suggestions = [
  { label: 'Dashboard', path: '/' },
  { label: 'Roadmap', path: '/roadmap' },
  { label: 'Toolkit', path: '/toolkit' },
  { label: 'Learning Hub', path: '/learning-hub' },
];

export default function NotFound() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? suggestions.filter((s) => s.label.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-8">
          <BovyeLogo />
        </div>

        {/* 404 Display */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-[6rem] font-bold leading-none tracking-tighter text-foreground/10 select-none">
            404
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground -mt-4">
            Page not found<span className="text-primary">.</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative mb-6"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a page..."
            className="h-10 pl-9 text-sm"
          />
          {filtered.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-border bg-card shadow-warm overflow-hidden z-10">
              {filtered.map((s) => (
                <button
                  key={s.path}
                  onClick={() => navigate(s.path, { replace: true })}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-accent/50 transition-colors text-foreground"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 gap-2 mb-6"
        >
          {suggestions.map((s) => (
            <button
              key={s.path}
              onClick={() => navigate(s.path, { replace: true })}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
            >
              <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
              {s.label}
            </button>
          ))}
        </motion.div>

        {/* Home Button */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={() => navigate('/', { replace: true })}
            className="w-full h-10 text-sm font-semibold"
          >
            <Home className="h-3.5 w-3.5 mr-1.5" />
            Back to Dashboard
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
