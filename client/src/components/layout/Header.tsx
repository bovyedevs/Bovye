import { Menu, Sun, Moon, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';
import { NotificationDropdown } from '@/components/layout/NotificationDropdown';

interface HeaderProps {
  title: string;
  onMenuToggle: () => void;
}

export function Header({ title, onMenuToggle }: HeaderProps) {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/50 px-4 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40 md:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-8 w-8 text-muted-foreground"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <Menu className="h-[18px] w-[18px]" />
        </Button>
        <h1 className="text-base font-semibold tracking-tight md:text-lg">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex h-8 w-8 text-muted-foreground hover:text-foreground"
          aria-label="Search"
        >
          <Search className="h-[18px] w-[18px]" />
        </Button>

        <NotificationDropdown />

        <div className="ml-1 h-4 w-px bg-border" />

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <Sun
            className={cn(
              'h-[18px] w-[18px] rotate-0 scale-100 transition-all duration-300',
              resolvedTheme === 'dark' && 'rotate-90 scale-0'
            )}
          />
          <Moon
            className={cn(
              'absolute h-[18px] w-[18px] rotate-90 scale-0 transition-all duration-300',
              resolvedTheme === 'dark' && 'rotate-0 scale-100'
            )}
          />
        </Button>
      </div>
    </header>
  );
}
