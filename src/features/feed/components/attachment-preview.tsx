import { ImageIcon, Video, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AttachmentPreviewItem {
  url: string;
  isVideo?: boolean;
}

interface AttachmentPreviewProps {
  items: AttachmentPreviewItem[];
  onRemove: (index: number) => void;
  className?: string;
}

export function AttachmentPreview({ items, onRemove, className }: AttachmentPreviewProps) {
  if (items.length === 0) return null;

  return (
    <div className={cn("mt-3 flex flex-wrap gap-2", className)}>
      {items.map((item, index) => (
        <div
          key={item.url + index}
          className="relative w-24 aspect-square rounded-lg overflow-hidden border border-border shrink-0"
        >
          {/* Local blob: preview before upload — next/image can't optimize
              blob URLs, and this is a fixed small thumbnail regardless of the
              source's aspect ratio, so intrinsic sizing doesn't apply anyway. */}
          {item.isVideo ? (
            <video src={item.url} className="absolute inset-0 w-full h-full object-cover" muted playsInline />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.url} alt="Attached media" className="absolute inset-0 w-full h-full object-cover" />
          )}
          <div className="absolute top-1 left-1 h-4.5 w-4.5 rounded-full bg-black/50 text-white grid place-items-center">
            {item.isVideo ? (
              <Video className="h-2.25 w-2.25" />
            ) : (
              <ImageIcon className="h-2.25 w-2.25" />
            )}
          </div>
          <button
            type="button"
            onClick={() => onRemove(index)}
            aria-label="Remove attachment"
            className="absolute top-1 right-1 h-5.5 w-5.5 rounded-full border-0 bg-black/50 hover:bg-black/70 text-white grid place-items-center cursor-pointer transition-colors"
          >
            <X className="h-2.75 w-2.75" strokeWidth={2.6} />
          </button>
        </div>
      ))}
    </div>
  );
}
