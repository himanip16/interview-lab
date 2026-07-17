import { cookies } from "next/headers";
import { randomUUID } from "crypto";

import { prisma } from "@/shared/prisma/client";
import { auth } from "./auth";

const GUEST_COOKIE = "guest_user_id";
const GUEST_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export async function ensureGuestUser(): Promise<string> {
  const session = await auth();

  if (session?.user?.id) {
    return session.user.id;
  }

  const cookieStore = await cookies();

  const guestId = cookieStore.get(GUEST_COOKIE)?.value;

  if (guestId) {
    const existingGuest = await prisma.user.findUnique({
      where: {
        id: guestId,
      },
      select: {
        id: true,
      },
    });

    if (existingGuest) {
      return existingGuest.id;
    }
  }

  const guest = await prisma.user.create({
    data: {
      email: `guest-${randomUUID()}@guest.local`,
      isGuest: true,
    },
    select: {
      id: true,
    },
  });

  cookieStore.set(GUEST_COOKIE, guest.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: GUEST_COOKIE_MAX_AGE_SECONDS,
    path: "/",
  });

  return guest.id;
}

export async function getCurrentUserId(): Promise<string> {
  return ensureGuestUser();
}