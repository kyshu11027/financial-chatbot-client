import { useLayoutEffect, useRef } from "react";

export function useAutosizeTextArea(value: string, maxHeight: number) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = textAreaRef.current;
    if (!el) return;

    el.style.height = "auto"; // Reset
    const newHeight = Math.min(el.scrollHeight, maxHeight);
    el.style.height = `${newHeight}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [value, maxHeight]);

  return textAreaRef;
}
