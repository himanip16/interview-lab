import type { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  rounded?: "xl" | "2xl";
  padding?: "6" | "8";
};

const Card: FC<Props> = ({
  children,
  className = "",
  rounded = "xl",
  padding = "6",
}) => {
  const roundedClass = rounded === "xl" ? "rounded-xl" : "rounded-2xl";
  const paddingClass = padding === "6" ? "p-6" : "p-8";

  return (
    <div className={`${roundedClass} bg-card ${paddingClass} border border-border ${className}`}>
      {children}
    </div>
  );
};

export default Card;
