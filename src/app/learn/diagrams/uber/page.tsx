import SystemDiagram from "@/src/features/diagram/components/SystemDiagram";

export default function UberDiagramPage() {
  return (
    <div className="h-screen">
      <SystemDiagram systemType="uber" />
    </div>
  );
}
