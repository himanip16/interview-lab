import { NextResponse } from "next/server";
import { signOut } from "@/features/auth/auth";

export async function POST() {
  await signOut({ redirectTo: "/" });
  
  return NextResponse.json({ success: true });
}
