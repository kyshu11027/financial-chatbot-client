import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertLatexDelimiters(text: string) {
  // Escape any unescaped dollar sign ($) by replacing with \$
  const escapeDollarSigns = (expr: string) => expr.replace(/(?<!\\)\$/g, "\\$");

  return (
    text
      // Convert display math: \[ ... \] becomes $$...$$ without extra spaces.
      .replace(/\\\[(.*?)\\\]/gs, (_, expr) => {
        const cleanedExpr = escapeDollarSigns(expr.trim());
        return `$$${cleanedExpr}$$`;
      })
      // Convert inline math: \( ... \) becomes $...$
      .replace(/\\\((.*?)\\\)/gs, (_, expr) => {
        const cleanedExpr = escapeDollarSigns(expr.trim());
        return `$$${cleanedExpr}$$`;
      })
  );
}
