"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

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

  return (
    <nav className="border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-semibold text-foreground">
            System Design Interviewer
          </Link>

          <div className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm font-medium transition-colors hover:text-foreground ${
                  isActive(item.path)
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
