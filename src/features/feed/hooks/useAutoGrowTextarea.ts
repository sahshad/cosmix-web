import { RefObject, useEffect } from "react";

/** Grows a textarea's height to fit its content, no internal scrollbar. */
export function useAutoGrowTextarea(ref: RefObject<HTMLTextAreaElement | null>, value: string) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [ref, value]);
}
