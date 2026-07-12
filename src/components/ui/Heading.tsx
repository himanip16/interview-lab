import type { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
  level?: "h1" | "h2" | "h3" | "h4";
  className?: string;
};

const Heading: FC<Props> = ({
  children,
  level = "h2",
  className = "",
}) => {
  const levelClasses = {
    h1: "text-4xl font-bold text-foreground",
    h2: "text-3xl font-bold text-foreground",
    h3: "text-2xl font-bold text-foreground",
    h4: "text-xl font-semibold text-foreground",
  };

  const Tag = level;

  return (
    <Tag className={`${levelClasses[level]} ${className}`}>
      {children}
    </Tag>
  );
};

export default Heading;
