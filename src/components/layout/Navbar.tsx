import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between py-6 border-b border-zinc-800">

      <Link
        href="/"
        className="text-xl font-bold text-white tracking-tight"
      >
        AI Interviewer
      </Link>


      <div className="flex gap-8 text-sm text-zinc-400">

        <Link 
          href="/interview/setup"
          className="hover:text-white transition-colors"
        >
          Interviews
        </Link>

        <Link 
          href="/analytics"
          className="hover:text-white transition-colors"
        >
          Analytics
        </Link>

        <Link 
          href="/library"
          className="hover:text-white transition-colors"
        >
          Library
        </Link>

      </div>

    </nav>
  );
}