// src/shared/ui/Text.tsx

import React from "react";
import { cn } from "@/shared/utils/utils";

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: "body" | "muted" | "small";
}

const Text = ({
  variant = "body",
  className,
  children,
  ...props
}: TextProps) => {
  const variants = {
    body: "body-m text-[var(--ink)]",
    muted: "body-m text-[var(--ink-400)]",
    small: "body-s text-[var(--ink-400)]",
  };

  return (
    <p
      className={cn(
        "font-inter leading-relaxed",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
};

export default Text;