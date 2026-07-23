
// src/features/auth/getCurrentUserId.ts
import { cookies } from "next/headers";

import { prisma } from "@/shared/prisma/client";
import { auth } from "./auth";

const GUEST_COOKIE = "guest_user_id";

export async function ensureGuestUser(): Promise<string> {
  const session = await auth();

  if (session?.user?.id) {
    return session.user.id;
  }

  const cookieStore = await cookies();
  const guestId = cookieStore.get(GUEST_COOKIE)?.value;

  if (!guestId) {
    // Should not normally happen — middleware assigns this on every
    // request. If it's missing, something bypassed middleware (e.g. a
    // route excluded by the matcher, or middleware not deployed yet).
    // Surface it loudly instead of silently minting a throwaway identity
    // that can't persist — that silent-mint behavior was the original bug.
    throw new Error(
      "guest_user_id cookie missing — middleware did not run for this request"
    );
  }

  // upsert, not create: safe to call repeatedly with the same id.
  // No risk of creating duplicate/orphaned guest rows on every miss,
  // which is what happened when cookie writes were silently failing.
  const guest = await prisma.user.upsert({
    where: { id: guestId },
    update: {},
    create: {
      id: guestId,
      email: `guest-${guestId}@guest.local`,
      isGuest: true,
    },
    select: { id: true },
  });

  return guest.id;
}

export async function getCurrentUserId(): Promise<string> {
  return ensureGuestUser();
}