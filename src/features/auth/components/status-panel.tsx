import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const TONE_STYLES = {
  success: { wrapper: 'bg-vivid-green/10', icon: 'text-vivid-green' },
  error: { wrapper: 'bg-destructive/10', icon: 'text-destructive' },
  info: { wrapper: 'bg-vivid-blue/10', icon: 'text-vivid-blue' },
} as const;

interface AuthStatusPanelProps {
  icon: LucideIcon;
  tone: keyof typeof TONE_STYLES;
  title: string;
  description: ReactNode;
  children?: ReactNode;
}

export function AuthStatusPanel({ icon: Icon, tone, title, description, children }: AuthStatusPanelProps) {
  const s = TONE_STYLES[tone];

  return (
    <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out">
      <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center mb-6', s.wrapper)}>
        <Icon className={cn('w-7 h-7', s.icon)} />
      </div>
      <h2 className="font-bold text-[24px] text-foreground tracking-tight mb-2">{title}</h2>
      <p className="text-muted-foreground font-medium text-[15px] leading-relaxed">{description}</p>
      {children}
    </div>
  );
}
