import { signIn } from "@/src/modules/auth/auth";

export default function LoginPage() {
  async function loginAction(formData: FormData) {
    "use server";

    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/",
    });
  }

  return (
    <main className="mx-auto max-w-md px-6 py-20 text-white">
      <h1 className="text-3xl font-bold">Log In</h1>

      <form action={loginAction} className="mt-8 space-y-4">
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2"
        />

        <input
          name="password"
          type="password"
          required
          placeholder="Password"
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2"
        />

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-3 font-semibold hover:bg-blue-500"
        >
          Log In
        </button>
      </form>

      <p className="mt-4 text-sm text-zinc-400">
        No account?{" "}
        <a href="/register" className="text-blue-400">
          Register
        </a>
      </p>
    </main>
  );
}