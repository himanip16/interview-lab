// src/shared/hooks/useClickOutside.ts

import { useEffect, RefObject } from "react";

/**
 * Hook to detect clicks outside a referenced element
 * @param ref - Reference to the element to check clicks against
 * @param handler - Callback function to execute when click outside is detected
 * @param isActive - Optional boolean to enable/disable the hook
 */
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: () => void,
  isActive: boolean = true
) {
  useEffect(() => {
    if (!isActive) return;

    const handleClickOutside = (event: Event) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [ref, handler, isActive]);
}
