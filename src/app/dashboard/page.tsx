// src/app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/features/auth/getCurrentUserId";

export default async function DashboardRedirect() {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    redirect("/login");
  }
  
  redirect(`/dashboard/${userId}`);
}
