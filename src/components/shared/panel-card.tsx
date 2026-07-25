import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PanelCardProps {
  radius?: "md" | "lg";
  className?: string;
  children: ReactNode;
}

const RADIUS_MAP = {
  md: "rounded-[14px]",
  lg: "rounded-[2rem]",
};

/**
 * The soft-shadow card wrapper repeated across sidebar/profile panels
 * (trending topics, suggested users, profile gallery, etc).
 */
export function PanelCard({ radius = "md", className, children }: PanelCardProps) {
  return (
    <Card
      className={cn(
        "border-0 shadow-[0_12px_45px_rgb(0,0,0,0.04)] bg-card p-6",
        RADIUS_MAP[radius],
        className
      )}
    >
      {children}
    </Card>
  );
}
