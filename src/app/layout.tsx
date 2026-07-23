// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";

import "./globals.css";

import AppShell from "@/shared/layout/AppShell";
import { MainProvider } from "@/shared/providers/MainProvider";

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
  description: "Learn system design through interactive visual explanations.",
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
      <body className="flex min-h-screen flex-col">
        <MainProvider>
          <AppShell>
            {children}
          </AppShell>
        </MainProvider>
      </body>
    </html>
  );
}