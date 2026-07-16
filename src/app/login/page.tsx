import { signIn } from "@/modules/auth/auth";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  async function loginAction(formData: FormData) {
    "use server";

    try {
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirectTo: "/",
      });
    } catch (error) {
      if (error instanceof AuthError) {
        // Bad credentials, including "no such user" — authorize() returns
        // null for both cases, so we can't distinguish here. Send them to
        // login with an error flag rather than crashing the server action.
        redirect(`/login?error=invalid`);
      }
      throw error;
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-20">
      <h1 className="text-3xl font-bold text-foreground">Log In</h1>

      {searchParams?.error === "invalid" && (
        <p className="mt-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          Incorrect email or password. If you don't have an account yet,{" "}
          <a href="/register" className="underline">register here</a>.
        </p>
      )}

      <form action={loginAction} className="mt-8 space-y-4">
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-foreground"
        />

        <input
          name="password"
          type="password"
          required
          placeholder="Password"
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-foreground"
        />

        <button
          type="submit"
          className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground hover:opacity-90"
        >
          Log In
        </button>
      </form>

      <p className="mt-4 text-sm text-muted-foreground">
        No account?{" "}
        <a href="/register" className="text-primary hover:opacity-80">
          Register
        </a>
      </p>
    </main>
  );
}