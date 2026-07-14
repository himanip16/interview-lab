import { getCurrentUserId } from "@/modules/auth/getCurrentUserId";
import SetupPage from "./SetupPage";

export default async function InterviewSetupPage() {
  const userId = await getCurrentUserId();

  return <SetupPage userId={userId} />;
}