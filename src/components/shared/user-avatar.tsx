import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserAvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showOnlineDot?: boolean;
  ringOnHover?: boolean;
  ringColor?: string;
  className?: string;
}

const sizeMap = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-14 w-14',
};

/**
 * Standardised avatar with optional online dot and hover ring —
 * used in sidebar, post card, suggested users, etc.
 */
export function UserAvatar({
  src,
  alt = 'User',
  fallback = 'U',
  size = 'md',
  showOnlineDot = false,
  ringOnHover = false,
  ringColor = 'var(--brand-primary)',
  className,
}: UserAvatarProps) {
  return (
    <div className="relative flex-shrink-0">
      <Avatar
        className={`
          ${sizeMap[size]}
          ${ringOnHover ? 'ring-2 ring-transparent transition-all group-hover:ring-[var(--ring-color)]' : ''}
          ${className ?? ''}
        `}
        style={{ ['--ring-color' as any]: `${ringColor}4d` }}
      >
        <AvatarImage src={src} alt={alt} />
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
      {showOnlineDot && (
        <div
          className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background"
          style={{ backgroundColor: '#11a657' }}
        />
      )}
    </div>
  );
}
