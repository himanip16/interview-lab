import { notFound } from "next/navigation";
import {
  WHITEBOARD_SYSTEM_LIST,
} from "@/features/learning/data/whiteboardSystems";
import WhiteboardView from "@/features/learning/components/WhiteboardView";

// Prebuild a page for every known system so each is directly linkable
// (e.g. from a problem card: `/learn/whiteboard/${problem.slug}`).
export function generateStaticParams() {
  return WHITEBOARD_SYSTEM_LIST.map(({ slug }) => ({ slug }));
}

export default async function WhiteboardSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const exists = WHITEBOARD_SYSTEM_LIST.some((s) => s.slug === slug);
  if (!exists) notFound();

  return <WhiteboardView initialSlug={slug} />;
}