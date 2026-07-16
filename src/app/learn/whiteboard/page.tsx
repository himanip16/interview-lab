import { redirect } from "next/navigation";
import { WHITEBOARD_SYSTEM_LIST } from "@/features/learning/data/whiteboardSystems";

export default function WhiteboardIndexPage() {
  const first = WHITEBOARD_SYSTEM_LIST[0];
  if (!first) {
    throw new Error("No whiteboard systems configured.");
  }
  redirect(`/learn/whiteboard/${first.slug}`);
}