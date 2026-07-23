// src/shared/ui/Skeleton.tsx

import { cn } from "@/shared/utils/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-[var(--ink-100)]", className)}
      {...props}
    />
  );
}
