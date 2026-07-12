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
    <main className="mx-auto max-w-md px-6 py-20">
      <h1 className="text-3xl font-bold text-foreground">Log In</h1>

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