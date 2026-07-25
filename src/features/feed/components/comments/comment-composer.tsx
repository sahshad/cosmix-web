"use client";

import { RefObject } from "react";
import { ArrowUp } from "lucide-react";
import { Spinner, UserAvatar } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn, getAvatarPalette, getInitials } from "@/lib/utils";
import { User } from "@/types";

interface CommentComposerProps {
  avatarUser: Partial<User>;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  isSubmitting?: boolean;
  compact?: boolean;
  autoFocus?: boolean;
  inputRef?: RefObject<HTMLTextAreaElement | null>;
}

export function CommentComposer({
  avatarUser,
  value,
  onChange,
  onSubmit,
  placeholder,
  isSubmitting,
  compact,
  autoFocus,
  inputRef,
}: CommentComposerProps) {
  const palette = getAvatarPalette(avatarUser.username);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="flex items-center gap-2.5">
      <UserAvatar
        src={avatarUser.avatarUrl}
        alt={avatarUser.displayName}
        fallback={getInitials(avatarUser.displayName)}
        className={cn("flex-shrink-0", compact ? "h-6 w-6" : "h-8 w-8")}
        fallbackClassName={cn(palette.bg, palette.text, "font-semibold", compact && "text-[10px]")}
      />
      <div
        className={cn(
          "flex-1 min-w-0 flex items-center rounded-[8px] border border-border focus-within:border-foreground/35 transition-colors",
          compact ? "px-2.5 py-1.5" : "px-3 py-2"
        )}
      >
        <Textarea
          ref={inputRef}
          autoFocus={autoFocus}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={isSubmitting}
          className={cn(
            "min-h-0 resize-none rounded-none border-0 bg-transparent dark:bg-transparent shadow-none p-0 leading-relaxed focus-visible:ring-0 placeholder:text-muted-foreground",
            "text-[13.5px] leading-[20px] placeholder:text-[12px] placeholder:leading-[20px]",
            compact ? "text-[12.5px]" : "text-[13.5px]"
          )}
        />
      </div>
      <Button
        type="button"
        size="icon"
        onClick={onSubmit}
        disabled={!value.trim() || isSubmitting}
        className={cn(
          "flex-shrink-0 rounded-[6px] bg-vivid-blue text-white hover:bg-vivid-blue-hover disabled:bg-muted disabled:text-muted-foreground",
          compact ? "h-6 w-6" : "h-7 w-7"
        )}
        aria-label="Send"
      >
        {isSubmitting ? (
          <Spinner size={compact ? "xs" : "sm"} />
        ) : (
          <ArrowUp className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
        )}
      </Button>
    </div>
  );
}
