// src/proxy.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const GUEST_COOKIE = "guest_user_id";
const GUEST_HEADER = "x-guest-id";
const GUEST_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export function proxy(request: NextRequest) {
  const existing = request.cookies.get(GUEST_COOKIE)?.value;

  // crypto.randomUUID() here is the WEB CRYPTO API global (available in
  // every modern JS runtime, including Edge), NOT Node's `crypto` module.
  // Node's `import { randomUUID } from "crypto"` is what broke the build —
  // that module isn't available in the Edge Runtime this file runs under.
  // No import needed for the Web Crypto version; it's global, same as in
  // browsers.
  const guestId = existing ?? crypto.randomUUID();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(GUEST_HEADER, guestId);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  if (!existing) {
    response.cookies.set(GUEST_COOKIE, guestId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: GUEST_COOKIE_MAX_AGE_SECONDS,
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};