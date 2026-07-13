import { cookies } from "next/headers";
import { randomUUID } from "crypto";

import { prisma } from "@/shared/prisma/client";

import { auth } from "./auth";

const GUEST_COOKIE = "guest_user_id";
const GUEST_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth();

  if (session?.user?.id) {
    return session.user.id;
  }

  const cookieStore = await cookies();
  const existingGuestId = cookieStore.get(GUEST_COOKIE)?.value;

  if (existingGuestId) {
    const guest = await prisma.user.findUnique({
      where: { id: existingGuestId },
    });

    if (guest) return guest.id;
  }

  return null;
}

export async function ensureGuestUser(): Promise<string> {
  const session = await auth();

  if (session?.user?.id) {
    return session.user.id;
  }

  const cookieStore = await cookies();
  const existingGuestId = cookieStore.get(GUEST_COOKIE)?.value;

  if (existingGuestId) {
    const guest = await prisma.user.findUnique({
      where: { id: existingGuestId },
    });

    if (guest) return guest.id;
  }

  const guest = await prisma.user.create({
    data: {
      email: `guest-${randomUUID()}@guest.local`,
      isGuest: true,
    },
  });

  cookieStore.set(GUEST_COOKIE, guest.id, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: GUEST_COOKIE_MAX_AGE_SECONDS,
    path: "/",
  });

  return guest.id;
}