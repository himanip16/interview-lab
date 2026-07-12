import * as React from "react";
import { cn } from "../../lib/utils";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
}

export const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(
  (
    {
      children,
      variant = "primary",
      className,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-zinc-900 text-white hover:bg-zinc-800",
      secondary:
        "bg-zinc-200 text-zinc-900 hover:bg-zinc-300",
      outline:
        "border border-zinc-300 bg-transparent hover:bg-zinc-50 text-zinc-900",
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          baseStyles,
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";