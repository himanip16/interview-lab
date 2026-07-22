"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useClickOutside } from "@/shared/hooks/useClickOutside";

// Uncomment this if you have a ROUTES constant
// import { ROUTES } from "@/lib/constants/routes";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [userXP, setUserXP] = useState(0);

  useClickOutside(menuRef, () => setMenuOpen(false), menuOpen);

  // Fetch user XP
  useEffect(() => {
    async function fetchXP() {
      if (session?.user?.id) {
        try {
          const response = await fetch('/api/xp');
          const data = await response.json();
          if (data.totalXP !== undefined) {
            setUserXP(data.totalXP);
          }
        } catch (error) {
          console.error('Error fetching XP:', error);
        }
      }
    }
    fetchXP();
  }, [session?.user?.id]);

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Learn", path: "/learn" },
    { name: "Library", path: "/library" },
  ];

  const email = session?.user?.email;
  const initial = email ? email.charAt(0).toUpperCase() : "?";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-lg font-semibold text-[var(--ink)]"
        >
          System Design Interviewer
        </Link>

        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`font-medium transition-colors ${
                isActive(item.path)
                  ? "text-[var(--ink)]"
                  : "text-[var(--ink-400)] hover:text-[var(--ink)]"
              }`}
            >
              {item.name}
            </Link>
          ))}

          {status === "loading" ? (
            <div className="h-8 w-8 rounded-full bg-[var(--paper-200)] animate-pulse" />
          ) : email ? (
            <div className="flex items-center gap-4">
              {/* XP Display */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--paper-100)] text-sm font-medium text-[var(--ink)]">
                <span>⭐</span>
                <span>{userXP} XP</span>
              </div>

              {/* User Avatar */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--ink)] text-sm font-semibold text-white"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                >
                  {initial}
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-10 z-50 min-w-[180px] rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-lg">
                    <div className="mb-2 border-b border-[var(--border)] px-3 py-2 text-sm text-[var(--ink-400)]">
                      {email}
                    </div>

                    <button
                      onClick={() => signOut({ redirectTo: "/" })}
                      className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-[var(--paper-100)]"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="font-medium text-[var(--ink-400)] hover:text-[var(--ink)]"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}