import SystemDiagram from "@/features/diagram/components/SystemDiagram";

export default function DiagramPage() {
  return (
    <div className="h-screen">
      <SystemDiagram systemType="dropbox" />
    </div>
  );
}
