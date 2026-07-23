// src/shared/ui/Animations.tsx

import { type ReactNode, type ElementType } from "react";
import { cn } from "@/shared/utils/utils";

type AnimationName = "float" | "breathe" | "pulse-soft";

const ANIMATION_CLASS: Record<AnimationName, string> = {
  float: "animate-float",
  breathe: "animate-breathe",
  "pulse-soft": "animate-pulse-soft",
};

interface AnimatedProps {
  animation: AnimationName;
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

export function Animated({ animation, as: Tag = "div", className, children }: AnimatedProps) {
  return <Tag className={cn(ANIMATION_CLASS[animation], className)}>{children}</Tag>;
}