// src/components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef } from "react";
import { useClickOutside } from "@/lib/hooks/useClickOutside";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setMenuOpen(false), menuOpen);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Problems", path: "/problems" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Library", path: "/library" },
  ];

  const email = session?.user?.email;
  const initial = email ? email[0].toUpperCase() : "?";

  return (
    <nav className="border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="heading-m text-[var(--ink)]">
            System Design Interviewer
          </Link>

          <div className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`body-m font-medium transition-colors hover:text-[var(--ink)] ${
                  isActive(item.path) ? "text-[var(--ink)]" : "text-[var(--ink-400)]"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {email ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="w-8 h-8 rounded-full bg-[var(--ink)] text-white text-sm font-semibold flex items-center justify-center"
                  aria-haspopup="true"
                  aria-expanded={menuOpen}
                >
                  {initial}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] bg-[var(--surface)] border border-[var(--border)] rounded-[14px] shadow-floating p-2 min-w-[180px] z-10">
                    <div className="px-3 py-2 body-s text-[var(--ink-400)] truncate border-b border-[var(--border)] mb-1">
                      {email}
                    </div>
                    <button
                      onClick={() => signOut({ redirectTo: "/" })}
                      className="w-full text-left px-3 py-2 body-s text-[var(--ink)] hover:bg-[var(--paper-100)] rounded-[8px]"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="body-m font-medium text-[var(--ink-400)] hover:text-[var(--ink)]"
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}