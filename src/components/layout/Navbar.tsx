"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import ThemeToggle from "@/src/components/ui/ThemeToggle";
import { Button } from "@/src/components/ui/Button";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [showMenu, setShowMenu] = useState(false);

  const isAuthenticated = status === "authenticated";
  const userEmail = session?.user?.email || null;
  const userId = session?.user?.id || null;

  async function handleSignOut() {
    await signOut({ callbackUrl: "/" });
  }

  return (
    <nav className="flex items-center justify-between py-6 border-b border-border">

      <Link
        href="/"
        className="text-xl font-bold text-foreground tracking-tight"
      >
        AI Interviewer
      </Link>


      <div className="flex gap-8 text-sm text-muted-foreground items-center">

        <Link 
          href="/interview/setup"
          className="hover:text-foreground transition-colors"
        >
          Interviews
        </Link>

        <Link
          href="/learn"
          className="hover:text-foreground transition-colors"
        >
          Learn
        </Link>

        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                {userEmail?.[0]?.toUpperCase() || "U"}
              </div>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-card shadow-lg py-2">
                <div className="px-4 py-2 text-xs text-muted-foreground border-b border-border">
                  {userEmail}
                </div>
                {userId && (
                  <Link
                    href={`/dashboard/${userId}`}
                    className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-4 items-center">
            <Link 
              href="/login"
              className="hover:text-foreground transition-colors"
            >
              Log In
            </Link>
            <Link href="/register">
              <Button variant="primary">
                Register
              </Button>
            </Link>
          </div>
        )}

        <ThemeToggle />

      </div>

    </nav>
  );
}