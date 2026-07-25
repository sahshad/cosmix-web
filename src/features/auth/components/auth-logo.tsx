import { cn } from '@/lib/utils';

interface AuthLogoProps {
  className?: string;
}

export function AuthLogo({ className }: AuthLogoProps) {
  return (
    <div className={cn('flex items-center gap-3 mb-8', className)}>
      <div className="w-10 h-10 rounded-[10px] bg-linear-to-br from-vivid-blue to-vivid-blue-dark flex items-center justify-center shadow-md">
        <span className="text-white font-black text-xl tracking-tighter">C</span>
      </div>
      <span className="text-foreground text-2xl font-bold tracking-tight">Cosmix</span>
    </div>
  );
}
