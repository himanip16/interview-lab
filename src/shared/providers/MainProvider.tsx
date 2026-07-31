// src/shared/providers/MainProvider.tsx

"use client";

import { ThemeProvider } from "next-themes";
import AuthProvider from "@/shared/providers/AuthProvider";
import { useEffect, useState } from "react";

export function MainProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <AuthProvider>{children}</AuthProvider>;
  }

  return (
    <div suppressHydrationWarning>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
}