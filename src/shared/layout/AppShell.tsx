"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useClickOutside } from "@/shared/hooks/useClickOutside";
import { cn } from "@/shared/utils/utils";

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    name: "Home",
    path: "/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 11l9-8 9 8M5 10v10h14V10" />
      </svg>
    ),
  },
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </svg>
    ),
  },
  {
    name: "Learn",
    path: "/learn",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 4.5A2.5 2.5 0 016.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15z" />
      </svg>
    ),
  },
  {
    name: "Problems",
    path: "/problems",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
      </svg>
    ),
  },
  {
    name: "Library",
    path: "/library",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M4 10h16M10 10v10" />
      </svg>
    ),
  },
];

const insightItems: NavItem[] = [
  {
    name: "Analytics",
    path: "/analytics",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19V9M11 19V4M18 19v-6" />
      </svg>
    ),
  },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [userXP, setUserXP] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setMenuOpen(false), menuOpen);

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Fetch user XP
  useEffect(() => {
    async function fetchXP() {
      if (session?.user?.id) {
        try {
          const response = await fetch("/api/xp");
          const data = await response.json();
          if (data.totalXP !== undefined) {
            setUserXP(data.totalXP);
          }
        } catch (error) {
          console.error("Error fetching XP:", error);
        }
      }
    }
    fetchXP();
  }, [session?.user?.id]);

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const email = session?.user?.email;
  const initial = email ? email.charAt(0).toUpperCase() : "?";

  return (
    <div className="min-h-screen bg-[var(--surface-page)]">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 w-[236px] bg-[var(--surface-panel)] border-r border-[var(--border)] z-50 flex flex-col transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="p-6 pb-5">
          <Link
            href="/"
            className="font-['Poppins'] font-bold text-[17px] text-[var(--text-primary)]"
          >
            interview<span className="text-[var(--category-learn-deep)]">.lab</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 flex flex-col gap-0.5">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium relative transition-colors",
                isActive(item.path)
                  ? "bg-[var(--category-learn-bg)] text-[var(--text-primary)] font-semibold"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-page)] hover:text-[var(--text-primary)]"
              )}
            >
              <span
                className={cn(
                  "w-[18px] h-[18px] flex-shrink-0",
                  isActive(item.path)
                    ? "text-[var(--category-learn-deep)]"
                    : "text-[var(--text-secondary)]"
                )}
              >
                {item.icon}
              </span>
              {item.name}
              {isActive(item.path) && (
                <span className="absolute left-[-12px] top-2 bottom-2 w-[3px] rounded-[3px] bg-[var(--category-learn-deep)]" />
              )}
            </Link>
          ))}

          <div className="h-px bg-[var(--border)] my-2.5 mx-3" />
          <div className="px-3 py-2.5 pb-1 text-[10px] font-bold tracking-[0.07em] text-[var(--text-secondary)] uppercase opacity-70">
            Insights
          </div>
          {insightItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium relative transition-colors",
                isActive(item.path)
                  ? "bg-[var(--category-learn-bg)] text-[var(--text-primary)] font-semibold"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-page)] hover:text-[var(--text-primary)]"
              )}
            >
              <span
                className={cn(
                  "w-[18px] h-[18px] flex-shrink-0",
                  isActive(item.path)
                    ? "text-[var(--category-learn-deep)]"
                    : "text-[var(--text-secondary)]"
                )}
              >
                {item.icon}
              </span>
              {item.name}
              {isActive(item.path) && (
                <span className="absolute left-[-12px] top-2 bottom-2 w-[3px] rounded-[3px] bg-[var(--category-learn-deep)]" />
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3.5 border-t border-[var(--border)]">
          {/* Streak Card */}
          <div className="flex items-center gap-2.5 p-2.5 rounded-[14px] bg-[var(--surface-page)] mb-2.5">
            <svg
              className="w-4 h-4 text-[var(--category-practice)] animate-pulse flex-shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2c1 4-3 5-3 9a3 3 0 006 0c0-1-1-2-1-3 2 1 3 3 3 5a5 5 0 01-10 0c0-5 4-6 5-11z" />
            </svg>
            <div className="text-[11.5px]">
              <span className="block font-semibold text-[13px]">5 day streak</span>
              keep it going
            </div>
          </div>

          {/* User Card */}
          {email && (
            <div className="flex items-center gap-2.5 p-1.5 rounded-[14px] cursor-pointer hover:bg-[var(--surface-page)] transition-colors">
              <div className="w-8 h-8 rounded-full bg-[var(--category-learn-deep)] text-white flex items-center justify-center text-[12.5px] font-bold flex-shrink-0">
                {initial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12.5px] font-semibold text-[var(--text-primary)] truncate">
                  {email.split("@")[0]}
                </div>
                <div className="text-[10.5px] text-[var(--text-secondary)]">
                  {userXP} XP · Free plan
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Topbar */}
      <header
        className={cn(
          "fixed top-0 right-0 left-0 lg:left-[236px] h-16 bg-[var(--surface-panel)] border-b border-[var(--border)] flex items-center justify-between px-6 lg:px-6 z-30 transition-all duration-300",
          sidebarOpen && "left-0"
        )}
      >
        {/* Mobile Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden w-9.5 h-9.5 rounded-full border border-[var(--border)] bg-[var(--surface-panel)] text-[var(--text-secondary)] flex items-center justify-center flex-shrink-0"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>

        {/* Breadcrumb */}
        <div className="text-[13.5px] font-semibold text-[var(--text-secondary)]">
          <span className="text-[var(--text-primary)]">
            {navItems.find((item) => isActive(item.path))?.name || "Home"}
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3.5">
          {/* Search */}
          <div className="hidden sm:flex items-center gap-2 bg-[var(--surface-page)] border border-[var(--border)] rounded-full px-3.5 py-2 text-[12.5px] text-[var(--text-secondary)] w-[190px] focus-within:border-[var(--category-learn-deep)] transition-colors">
            <svg className="w-[13px] h-[13px] opacity-50 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <span>Search…</span>
          </div>

          {/* XP Badge */}
          <div className="hidden md:flex items-center gap-1.5 text-[12px] font-semibold text-[var(--category-live)] bg-[var(--category-live-bg)] px-3 py-1.5 rounded-full">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3 7h7l-5.5 4.5L18.5 21 12 16.5 5.5 21 7.5 13.5 2 9h7z" />
            </svg>
            {userXP} XP
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-9.5 h-9.5 rounded-full border border-[var(--border)] bg-[var(--surface-panel)] text-[var(--text-secondary)] flex items-center justify-center hover:border-[var(--category-learn-deep)] transition-colors flex-shrink-0"
          >
            {theme === "dark" ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* User Menu */}
          {status === "loading" ? (
            <div className="h-8 w-8 rounded-full bg-[var(--surface-page)] animate-pulse" />
          ) : email ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--text-primary)] text-sm font-semibold text-white"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                {initial}
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-10 z-50 min-w-[180px] rounded-xl border border-[var(--border)] bg-[var(--surface-panel)] p-2 shadow-lg">
                  <div className="mb-2 border-b border-[var(--border)] px-3 py-2 text-sm text-[var(--text-secondary)]">
                    {email}
                  </div>

                  <button
                    onClick={() => signOut({ redirectTo: "/" })}
                    className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[var(--surface-page)]"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Log in
            </Link>
          )}
        </div>
      </header>

      {/* Mobile Bottom Tab Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--surface-panel)] border-t border-[var(--border)] z-40 flex items-center justify-around py-2 px-4">
        {navItems.slice(0, 4).map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors",
              isActive(item.path)
                ? "text-[var(--category-learn-deep)]"
                : "text-[var(--text-secondary)]"
            )}
          >
            <span className="w-5 h-5">{item.icon}</span>
            <span className="text-[10.5px] font-medium">{item.name}</span>
          </Link>
        ))}
        <Link
          href="/library"
          className={cn(
            "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors",
            isActive("/library")
              ? "text-[var(--category-learn-deep)]"
              : "text-[var(--text-secondary)]"
          )}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <path d="M4 10h16M10 10v10" />
          </svg>
          <span className="text-[10.5px] font-medium">Library</span>
        </Link>
      </nav>

      {/* Main Content */}
      <main className="pt-16 lg:pl-[236px] lg:pt-16 pb-16 lg:pb-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}
