import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";

import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import AuthProvider from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";

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
      className={`${poppins.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              function getTheme() {
                const savedTheme = localStorage.getItem('theme');
                if (savedTheme) {
                  return savedTheme;
                }
                return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              }
              const theme = getTheme();
              document.documentElement.setAttribute('data-theme', theme);
            })();
          `,
        }}
      />
      <body className="flex min-h-screen flex-col">
        <AuthProvider>
          <ThemeProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}