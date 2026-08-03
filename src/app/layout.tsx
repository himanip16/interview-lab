// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";

import "./globals.css";

import AppShell from "@/shared/layout/AppShell";
import { MainProvider } from "@/shared/providers/MainProvider";
import { ThemeProvider } from "@/features/theme/ThemeProvider";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "System Design Interviewer",
  description: "Learn system design through real Staff Engineer conversations—not textbooks. Experience realistic engineering discussions and master how senior engineers actually think.",
  icons: {
    icon: "/favicon.ico",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${poppins.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="h-full" suppressHydrationWarning>
        <ThemeProvider>
          <MainProvider>
            <AppShell>
              {children}
            </AppShell>
          </MainProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}