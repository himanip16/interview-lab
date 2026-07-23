// src/app/login/page.tsx

import { signIn } from "@/features/auth/auth";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  async function loginAction(formData: FormData) {
    "use server";

    try {
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirectTo: "/",
      });
    } catch (error) {
      // Re-throw redirect errors to allow Next.js redirect to work
      if (error && typeof error === 'object' && 'digest' in error && 
          typeof error.digest === 'string' && error.digest.startsWith('NEXT_REDIRECT')) {
        throw error;
      }
      
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

      {resolvedSearchParams?.error === "invalid" && (
        <p className="mt-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          Incorrect email or password. If you don't have an account yet,{" "}
          <Link href="/register" className="underline">register here</Link>.
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
        <Link href="/register" className="text-primary hover:opacity-80">
          Register
        </Link>
      </p>
    </main>
  );
}