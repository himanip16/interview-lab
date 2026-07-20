import React from "react";
import { cn } from "@/shared/utils/utils";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: "h1" | "h2" | "h3" | "h4";
}

const Heading = ({
  level = "h2",
  className,
  children,
  ...props
}: HeadingProps) => {
  const Tag = level;

  const sizes = {
    h1: "heading-xl",
    h2: "heading-l",
    h3: "heading-m",
    h4: "heading-s",
  };

  return (
    <Tag
      className={cn(
        "font-poppins text-[var(--ink)] tracking-tight",
        sizes[level],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default Heading;