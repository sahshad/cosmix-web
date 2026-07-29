'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface FollowButtonProps {
  isFollowing?: boolean;
  onToggle?: (following: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export default function FollowButton({
  isFollowing: initialFollowing = false,
  onToggle,
  disabled,
  className,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);

  // Keeps the button in sync when isFollowing arrives asynchronously (e.g. after a profile fetch).
  useEffect(() => {
    setIsFollowing(initialFollowing);
  }, [initialFollowing]);

  const handleClick = () => {
    const next = !isFollowing;
    setIsFollowing(next);
    onToggle?.(next);
  };

  return (
    <Button
      size="sm"
      onClick={handleClick}
      disabled={disabled}
      className={`
        h-8
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
