import { cn } from "@/lib/utils";

interface EmptyStateProps {
  message: string;
  variant?: "block" | "inline";
  className?: string;
}

/**
 * "No X yet" placeholder. `block` is the centered, card-shaped variant
 * (empty tabs); `inline` is a plain muted line (e.g. no comments yet).
 */
export function EmptyState({ message, variant = "block", className }: EmptyStateProps) {
  if (variant === "inline") {
    return <p className={cn("text-[13px] text-muted-foreground", className)}>{message}</p>;
  }

  return (
    <div
      className={cn(
        "p-12 text-center text-muted-foreground font-bold text-sm uppercase tracking-widest bg-card rounded-[2.5rem] shadow-sm",
        className
      )}
    >
      {message}
    </div>
  );
}
