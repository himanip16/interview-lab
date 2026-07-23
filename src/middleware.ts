import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { randomUUID } from "crypto";

const GUEST_COOKIE = "guest_user_id";
const GUEST_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Only assign a guest cookie if one doesn't already exist. This is the
  // ONE place allowed to set cookies outside a Server Action/Route Handler
  // — middleware runs before the DB layer, so no Prisma call here, just
  // reserve the identity. The actual User row gets upserted lazily later.
  if (!request.cookies.get(GUEST_COOKIE)) {
    response.cookies.set(GUEST_COOKIE, randomUUID(), {
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
  // Run on normal page/API routes, skip static assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};