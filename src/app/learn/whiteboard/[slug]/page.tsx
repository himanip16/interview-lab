// src/app/learn/whiteboard/[slug]/page.tsx

import WhiteboardWorkspace from "@/features/learning/components/WhiteboardWorkspace";

export default async function WhiteboardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  return (
    <div className="min-h-screen bg-[var(--paper)] py-10 px-6">
       <WhiteboardWorkspace initialSlug={slug} />
    </div>
  );
}