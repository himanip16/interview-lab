import { NextResponse } from "next/server";
import { auth } from "@/modules/auth/auth";

export async function GET() {
  const session = await auth();
  
  return NextResponse.json({ 
    user: session?.user ? {
      id: session.user.id,
      email: session.user.email,
    } : null 
  });
}
