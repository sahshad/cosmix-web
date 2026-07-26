"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImageIcon, Video } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Media } from "../types";

interface MediaCarouselProps {
  items: Media[];
}

export function MediaCarousel({ items }: MediaCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  if (items.length === 0) return null;

  const scrollToIndex = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(index, items.length - 1));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
    setActiveIndex(clamped);
  };

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    setActiveIndex(Math.round(track.scrollLeft / track.clientWidth));
  };

  const activeItem = items[activeIndex];

  return (
    <div className="mt-4 mx-0 sm:mx-6 relative group/media">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth rounded-none sm:rounded-md border-0 sm:border sm:border-border aspect-16/10 min-h-55 max-h-120"
      >
        {items.map((item, index) => (
          <div key={item.id ?? index} className="relative w-full h-full shrink-0 snap-center">
            {item.type === "video" ? (
              <video
                src={item.url}
                controls
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover bg-black"
              />
            ) : (
              <Image
                src={item.url}
                alt="Post attachment"
                fill
                sizes="(max-width: 640px) 100vw, 600px"
                className="object-cover"
              />
            )}
          </div>
        ))}
      </div>

      <div className="absolute top-2 left-2 h-6 w-6 rounded-full bg-black/50 text-white grid place-items-center">
        {activeItem.type === "video" ? (
          <Video className="h-3.5 w-3.5" />
        ) : (
          <ImageIcon className="h-3.5 w-3.5" />
        )}
      </div>

      {items.length > 1 && (
        <>
          {activeIndex > 0 && (
            <button
              type="button"
              aria-label="Previous media"
              onClick={() => scrollToIndex(activeIndex - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 text-white grid place-items-center opacity-0 group-hover/media:opacity-100 transition-opacity cursor-pointer"
            >
              <ChevronLeft className="h-4.5 w-4.5" />
            </button>
          )}
          {activeIndex < items.length - 1 && (
            <button
              type="button"
              aria-label="Next media"
              onClick={() => scrollToIndex(activeIndex + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 text-white grid place-items-center opacity-0 group-hover/media:opacity-100 transition-opacity cursor-pointer"
            >
              <ChevronRight className="h-4.5 w-4.5" />
            </button>
          )}

          <div className="absolute top-2 right-2 bg-black/50 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
            {activeIndex + 1}/{items.length}
          </div>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {items.map((_, index) => (
              <span
                key={index}
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-colors",
                  index === activeIndex ? "bg-white" : "bg-white/50"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
