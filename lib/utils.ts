import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertLatexDelimiters(text: string) {
  return (
    text
      // convert \[...\] (display math) to $$...$$
      .replace(/\\\[(.+?)\\\]/gs, (_, expr) => `$$${expr.trim()}$$`)
      // convert \(...\) (inline math) to $...$
      .replace(/\\\((.+?)\\\)/gs, (_, expr) => `$$${expr.trim()}$$`)
  );
}
