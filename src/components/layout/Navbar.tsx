"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ThemeToggle from "@/src/components/ui/ThemeToggle";
import { Button } from "@/src/components/ui/Button";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(!!data.user);
          setUserEmail(data.user?.email || null);
        }
      } catch (error) {
        console.error("Failed to check auth:", error);
      }
    }

    checkAuth();
  }, []);

  async function handleSignOut() {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      setIsAuthenticated(false);
      setUserEmail(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
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
          href="/library"
          className="hover:text-foreground transition-colors"
        >
          Library
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