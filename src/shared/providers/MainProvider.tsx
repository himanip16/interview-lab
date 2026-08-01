// src/shared/providers/MainProvider.tsx

"use client";

import { ThemeProvider } from "next-themes";
import AuthProvider from "@/shared/providers/AuthProvider";

export function MainProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      storageKey="theme"
    >
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}