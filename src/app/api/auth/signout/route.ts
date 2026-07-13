import { NextResponse } from "next/server";
import { signOut } from "@/src/modules/auth/auth";

export async function POST() {
  await signOut({ redirectTo: "/" });
  
  return NextResponse.json({ success: true });
}
