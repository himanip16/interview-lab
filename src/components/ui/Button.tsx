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
        "bg-primary text-primary-foreground hover:opacity-90",
      secondary:
        "bg-muted text-muted-foreground hover:bg-muted/80",
      outline:
        "border border-border bg-transparent hover:bg-muted text-muted-foreground",
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