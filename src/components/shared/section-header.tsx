import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  icon: LucideIcon;
  label: string;
  iconColor?: string;
  iconBg?: string;
}

/**
 * The repeating icon + uppercase label pattern used as card/panel headers
 * across the app. Pass a Lucide icon and label to render consistently.
 */
export function SectionHeader({
  icon: Icon,
  label,
  iconColor = 'var(--brand-primary)',
  iconBg,
}: SectionHeaderProps) {
  const bgStyle = iconBg ?? (iconColor.startsWith('var(') ? `color-mix(in srgb, ${iconColor} 10%, transparent)` : `${iconColor}1a`);

  return (
    <h2 className="text-[11px] font-black text-muted-foreground mb-6 flex items-center gap-3 uppercase tracking-[0.2em]">
      <div
        className="p-1.5 rounded-lg shrink-0"
        style={{ backgroundColor: bgStyle }}
      >
        <Icon className="h-4 w-4" style={{ color: iconColor }} />
      </div>
      {label}
    </h2>
  );
}
