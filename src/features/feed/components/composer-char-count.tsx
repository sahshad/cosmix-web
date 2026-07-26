import { cn } from "@/lib/utils";

interface ComposerCharCountProps {
  length: number;
  limit: number;
  warnAt?: number;
}

/** Only shows once you're close to (or over) the limit — silent otherwise. */
export function ComposerCharCount({ length, limit, warnAt = 60 }: ComposerCharCountProps) {
  const remaining = limit - length;
  if (remaining > warnAt) return null;

  return (
    <span
      className={cn(
        "text-[11.5px] font-mono tabular-nums",
        remaining < 0 ? "text-destructive font-semibold" : "text-muted-foreground"
      )}
    >
      {remaining}
    </span>
  );
}
