'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface FollowButtonProps {
  isFollowing?: boolean;
  onToggle?: (following: boolean) => void;
  className?: string;
}

export default function FollowButton({
  isFollowing: initialFollowing = false,
  onToggle,
  className,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);

  const handleClick = () => {
    const next = !isFollowing;
    setIsFollowing(next);
    onToggle?.(next);
  };

  return (
    <Button
      size="sm"
      onClick={handleClick}
      className={`
        h-[32px]
        rounded-full
        font-extrabold
        px-4
        transition-all
        shadow-md
        text-[11px]
        uppercase
        tracking-wider
        ${
          isFollowing
            ? 'bg-secondary text-foreground hover:bg-secondary/80 border border-border'
            : 'bg-[#8b5cf6] text-background hover:bg-[#8b5cf6]/80 hover:text-white'
        }
        ${className ?? ''}
      `}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </Button>
  );
}
