import Link from "next/link";
import ThemeToggle from "@/src/components/ui/ThemeToggle";

export default function Navbar() {
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

        <ThemeToggle />

      </div>

    </nav>
  );
}