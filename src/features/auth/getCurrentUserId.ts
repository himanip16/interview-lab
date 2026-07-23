// src/features/auth/getCurrentUserId.ts

import { cookies, headers } from "next/headers";

import { prisma } from "shared/prisma/client";
import { auth } from "./auth";

const GUEST_COOKIE = "guest_user_id";
const GUEST_HEADER = "x-guest-id";

export async function ensureGuestUser(): Promise<string> {
  const session = await auth();

  if (session?.user?.id) {
    return session.user.id;
  }

  const cookieStore = await cookies();
  const headerStore = await headers();

  // Cookie is the normal path (every request after the first). Header is
  // the fallback for the very first request, where middleware just minted
  // the id but it hasn't round-tripped back from the browser yet.
  const guestId = cookieStore.get(GUEST_COOKIE)?.value ?? headerStore.get(GUEST_HEADER);

  if (!guestId) {
    throw new Error(
      "guest id missing from both cookie and header — middleware did not run for this request"
    );
  }

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