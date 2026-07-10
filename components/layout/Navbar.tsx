import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between py-6">

      <Link
        href="/"
        className="text-xl font-bold"
      >
        AI Interviewer
      </Link>


      <div className="flex gap-6 text-sm text-zinc-400">

        <Link href="/interview/setup">
          Interviews
        </Link>

        <Link href="/analytics">
          Analytics
        </Link>

      </div>

    </nav>
  );
}