"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InlineEditFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving?: boolean;
  rows?: number;
  autoFocus?: boolean;
  className?: string;
  textareaClassName?: string;
  variant?: "button" | "link";
}

/**
 * Shared edit-in-place field: a Textarea plus a Cancel/Save action row.
 * `variant="button"` renders full buttons (post edit); `variant="link"`
 * renders bare text actions (comment edit).
 */
export function InlineEditField({
  value,
  onChange,
  onSave,
  onCancel,
  isSaving = false,
  rows = 3,
  autoFocus = true,
  className,
  textareaClassName,
  variant = "button",
}: InlineEditFieldProps) {
  return (
    <div className={className}>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        autoFocus={autoFocus}
        disabled={isSaving}
        className={cn("w-full resize-none leading-relaxed focus-visible:ring-0", textareaClassName)}
      />
      {variant === "button" ? (
        <div className="flex items-center justify-end gap-2 mt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isSaving}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onSave}
            disabled={isSaving || !value.trim()}
            className="bg-vivid-blue hover:bg-vivid-blue-hover text-white cursor-pointer"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-end gap-3 mt-1">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="text-[11.5px] font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving || !value.trim()}
            className="text-[11.5px] font-semibold text-vivid-blue hover:underline cursor-pointer disabled:opacity-50"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
