import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

const SIZE_MAP = {
  xs: "h-3 w-3",
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
  xl: "h-6 w-6",
  "2xl": "h-8 w-8",
};

/** The one spinning-loader icon for the whole app — swap in place of any Loader2/animate-spin. */
export function Spinner({ size = "md", className }: SpinnerProps) {
  return <Loader2 className={cn("animate-spin", SIZE_MAP[size], className)} />;
}

interface CenteredLoaderProps {
  size?: SpinnerProps["size"];
  className?: string;
  spinnerClassName?: string;
}

/** A Spinner centered in its own block — the "loading this section" pattern. */
export function CenteredLoader({ size = "xl", className, spinnerClassName }: CenteredLoaderProps) {
  return (
    <div className={cn("flex justify-center", className)}>
      <Spinner size={size} className={cn("text-muted-foreground", spinnerClassName)} />
    </div>
  );
}
