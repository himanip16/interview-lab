export default function Navbar() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-zinc-800">

      <div>
        <h1 className="text-xl font-semibold">
          AI Interview
        </h1>
      </div>

      <nav className="flex items-center gap-8 text-sm text-zinc-400">

        <button className="transition hover:text-white">
          Interviews
        </button>

        <button className="transition hover:text-white">
          History
        </button>

        <button className="transition hover:text-white">
          Login
        </button>

      </nav>

    </header>
  );
}