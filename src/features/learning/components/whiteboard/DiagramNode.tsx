import { cn } from "@/shared/utils/utils";
import { DiagramNode as NodeType } from "@/features/whiteboard/types/whiteboard";

const CATEGORY_STYLES: Record<string, string> = {
  entry: "bg-coral border-coral/20",
  logic: "bg-violet border-violet/20",
  storage: "bg-mint-deep border-mint-deep/20",
  queue: "bg-amber border-amber/20",
  network: "bg-ink border-ink/20",
};

export const DiagramNode = ({ 
  node, 
  isSelected, 
  onClick,
  x,
  y 
}: { 
  node: NodeType; 
  isSelected: boolean; 
  onClick: () => void;
  x: number;
  y: number;
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
      className={cn(
        "absolute w-40 -translate-x-1/2 -translate-y-1/2 p-4 rounded-xl text-white cursor-pointer transition-all z-20 border shadow-sm",
        "hover:scale-105 active:scale-95",
        CATEGORY_STYLES[node.category],
        isSelected ? "ring-4 ring-offset-4 ring-offset-paper ring-ink/20" : "opacity-90"
      )}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-white/40 mb-2" />
      <h4 className="text-xs font-bold leading-tight">{node.title}</h4>
      <p className="text-[10px] opacity-70 uppercase tracking-tighter font-semibold">{node.category}</p>
    </div>
  );
};