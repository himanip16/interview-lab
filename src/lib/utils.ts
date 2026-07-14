import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CARD_PALETTE = [
  { from: "#FF6B4A", to: "#E8940A" },
  { from: "#3E6BFF", to: "#213FCC" },
  { from: "#00E0AB", to: "#00A87E" },
  { from: "#6A5AE0", to: "#4B3DB8" },
];

export function accentFor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return CARD_PALETTE[hash % CARD_PALETTE.length];
}

export { CARD_PALETTE };