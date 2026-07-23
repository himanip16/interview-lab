// src/shared/ui/Badge.tsx

import React from "react";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "success" | "warning" | "danger";
};

const variantClasses = {
  default: "bg-[var(--paper)] text-[var(--ink)] border border-[var(--line)]",
  success: "bg-green-100 text-green-700 border border-green-200",
  warning: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  danger: "bg-red-100 text-red-700 border border-red-200",
};

export function Badge({
  children,
  className = "",
  variant = "default",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-2
        px-3 py-1
        rounded-full
        text-sm font-medium
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}