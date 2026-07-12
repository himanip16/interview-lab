import type { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
  variant?: "body" | "muted" | "small" | "large";
  className?: string;
};

const Text: FC<Props> = ({
  children,
  variant = "body",
  className = "",
}) => {
  const variantClasses = {
    body: "text-base text-foreground",
    muted: "text-base text-muted-foreground",
    small: "text-sm text-muted-foreground",
    large: "text-lg text-foreground",
  };

  return (
    <p className={`${variantClasses[variant]} ${className}`}>
      {children}
    </p>
  );
};

export default Text;
