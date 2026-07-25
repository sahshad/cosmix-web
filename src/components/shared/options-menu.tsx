"use client";

import { Fragment, ReactNode } from "react";
import { LucideIcon, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export interface OptionsMenuItem {
  key?: string;
  icon?: LucideIcon;
  label: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  separatorBefore?: boolean;
}

interface OptionsMenuProps {
  items: OptionsMenuItem[];
  size?: "sm" | "md";
  align?: "start" | "end";
  side?: "top" | "right" | "bottom" | "left";
  ariaLabel?: string;
  triggerClassName?: string;
}

const SIZE_STYLES = {
  sm: {
    trigger: "h-7 w-7",
    triggerIcon: "h-3.5 w-3.5",
    content: "min-w-37.5",
    item: "py-1.5 px-2.5 text-[12.5px]",
    itemIcon: "h-3.5 w-3.5",
  },
  md: {
    trigger: "h-8 w-8",
    triggerIcon: "h-4 w-4",
    content: "min-w-47.5",
    item: "py-2 px-3 text-[13px]",
    itemIcon: "h-4 w-4",
  },
} as const;

/**
 * Shared "more options" dropdown — MoreHorizontal trigger + a list of
 * items, some of which may be destructive or preceded by a separator.
 * Used for post options (edit/delete) and comment options (edit/delete).
 */
export function OptionsMenu({
  items,
  size = "md",
  align = "end",
  side,
  ariaLabel = "More options",
  triggerClassName,
}: OptionsMenuProps) {
  const s = SIZE_STYLES[size];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={ariaLabel}
          className={cn(
            s.trigger,
            "rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground shrink-0",
            triggerClassName
          )}
        >
          <MoreHorizontal className={s.triggerIcon} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        side={side}
        className={cn("rounded-[10px] shadow-lg border-border/60 z-50 p-1.5", s.content)}
      >
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <Fragment key={item.key ?? index}>
              {item.separatorBefore && <Separator className="my-1 bg-border/50" />}
              <DropdownMenuItem
                onClick={item.onClick}
                disabled={item.disabled}
                className={cn(
                  "rounded-lg cursor-pointer gap-2 font-medium hover:bg-secondary",
                  s.item,
                  item.destructive &&
                    "text-destructive focus:text-destructive focus:bg-destructive/10"
                )}
              >
                {Icon && <Icon className={s.itemIcon} />}
                {item.label}
              </DropdownMenuItem>
            </Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
