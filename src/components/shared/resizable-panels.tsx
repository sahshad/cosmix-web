
'use client';

import {
  Children,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
  type PointerEvent,
  type KeyboardEvent,
} from 'react';
import { cn } from '@/lib/utils';

interface ResizablePanelsProps {
  children: ReactNode;
  initialRightWidth?: number;
  minLeftWidth?: number;
  minRightWidth?: number;
  maxRightWidth?: number;
  className?: string;
}

export function ResizablePanels({
  children,
  initialRightWidth = 380,
  minLeftWidth = 320,
  minRightWidth = 280,
  maxRightWidth = 560,
  className,
}: ResizablePanelsProps) {
  const [rightWidth, setRightWidth] = useState(initialRightWidth);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const panels = Children.toArray(children);

  if (panels.length !== 2) {
    throw new Error('ResizablePanels requires exactly two children.');
  }

  const [left, right] = panels;

  const resize = (clientX: number) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const maxWidth = Math.min(
      maxRightWidth,
      rect.width - minLeftWidth - 8
    );

    if (maxWidth < minRightWidth) return;

    const nextWidth = rect.right - clientX;

    setRightWidth(
      Math.max(minRightWidth, Math.min(nextWidth, maxWidth))
    );
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;

    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    resize(event.clientX);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

    event.preventDefault();

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const maxWidth = Math.min(
      maxRightWidth,
      rect.width - minLeftWidth - 8
    );

    setRightWidth((width) => {
      const nextWidth =
        event.key === 'ArrowLeft' ? width + 20 : width - 20;

      return Math.max(
        minRightWidth,
        Math.min(nextWidth, maxWidth)
      );
    });
  };

  return (
    <div
      ref={containerRef}
      style={
        { '--right-width': `${rightWidth}px` } as CSSProperties
      }
      className={cn(
        'grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_8px_var(--right-width)] min-w-0',
        className
      )}
    >
      <div className="min-w-0">{left}</div>

      <div
        role="separator"
        aria-label="Resize panels"
        aria-orientation="vertical"
        aria-valuenow={rightWidth}
        aria-valuemin={minRightWidth}
        aria-valuemax={maxRightWidth}
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        className="hidden lg:flex justify-center cursor-col-resize group touch-none select-none"
      >
        <div className="w-px bg-border group-hover:bg-primary group-active:bg-primary transition-colors" />
      </div>

      <div className="min-w-0">{right}</div>
    </div>
  );
}
