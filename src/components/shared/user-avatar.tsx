import { CSSProperties } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface RingColorStyle extends CSSProperties {
  '--ring-color'?: string;
}

interface UserAvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showOnlineDot?: boolean;
  ringOnHover?: boolean;
  ringColor?: string;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
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
 * `className` overrides sizing/shape/border, `imageClassName`/`fallbackClassName`
 * reach the inner AvatarImage/AvatarFallback (e.g. for object-fit or palette colors).
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
  imageClassName,
  fallbackClassName,
}: UserAvatarProps) {
  return (
    <div className="relative flex-shrink-0">
      <Avatar
        className={cn(
          sizeMap[size],
          ringOnHover && 'ring-2 ring-transparent transition-all group-hover:ring-[var(--ring-color)]',
          className
        )}
        style={{ '--ring-color': `${ringColor}4d` } as RingColorStyle}
      >
        <AvatarImage src={src} alt={alt} className={imageClassName} />
        <AvatarFallback className={fallbackClassName}>{fallback}</AvatarFallback>
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
