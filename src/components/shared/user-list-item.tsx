import { cn, dicebearUrl } from "@/lib/utils";
import { UserAvatar } from "./user-avatar";
import FollowButton from "./follow-button";

interface UserListItemProps {
  name: string;
  handle: string;
  avatarSeed: string;
  variant?: "compact" | "card";
  ringColor?: string;
  className?: string;
}

const VARIANT_STYLES = {
  compact: { avatarSize: "md" as const, gap: "gap-4", name: "text-[13px]", handle: "text-[11px]" },
  card: { avatarSize: "lg" as const, gap: "gap-3", name: "text-[15px]", handle: "text-[12px]" },
};

/**
 * Avatar + name/handle + FollowButton row — used both as a list row inside
 * a single panel (suggested users) and as the content of a standalone card
 * (discover creators grid).
 */
export function UserListItem({
  name,
  handle,
  avatarSeed,
  variant = "compact",
  ringColor = "var(--brand-primary)",
  className,
}: UserListItemProps) {
  const s = VARIANT_STYLES[variant];

  return (
    <div className={cn("flex items-center justify-between group", className)}>
      <div className={cn("flex items-center flex-1 min-w-0 cursor-pointer", s.gap)}>
        <UserAvatar
          src={dicebearUrl(avatarSeed)}
          alt={name}
          fallback={name[0]}
          size={s.avatarSize}
          ringOnHover
          ringColor={ringColor}
          className="shadow-sm shrink-0"
        />
        <div className="min-w-0 pr-2">
          <p className={cn("font-bold text-foreground group-hover:underline truncate", s.name)}>
            {name}
          </p>
          <p className={cn("font-medium text-muted-foreground truncate", s.handle)}>@{handle}</p>
        </div>
      </div>
      <FollowButton />
    </div>
  );
}
