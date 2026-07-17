import WhiteboardWorkspace from "@/features/learning/components/WhiteboardWorkspace";
import { use } from "react";

export default function WhiteboardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  
  return (
    <div className="min-h-screen bg-[var(--paper)] py-10 px-6">
       <WhiteboardWorkspace initialSlug={slug} />
    </div>
  );
}