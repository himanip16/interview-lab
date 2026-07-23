// src/app/(marketing)/layout.tsx

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function MarketingLayout({
  children,
}: Props) {
  return children;
}