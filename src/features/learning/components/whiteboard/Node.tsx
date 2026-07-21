import { cn } from "@/shared/utils/utils";
import { Point } from "@/features/whiteboard/geometry";

const CATEGORY_MAP = {
  entry: "bg-coral border-coral/20 focus:ring-coral/40",
  logic: "bg-violet border-violet/20 focus:ring-violet/40",
  storage: "bg-mint-deep border-mint-deep/20 focus:ring-mint-deep/40",
} as const;

export const Node = ({ 
  node, 
  position, 
  isSelected, 
  onClick 
}: { 
  node: any, 
  position: Point, 
  isSelected: boolean, 
  onClick: () => void 
}) => (
  <button
    role="button"
    aria-pressed={isSelected}
    aria-label={`Inspect ${node.title}`}
    onClick={onClick}
    style={{ 
      transform: `translate(calc(${position.x}px - 50%), calc(${position.y}px - 50%))` 
    }}
    className={cn(
      "absolute left-0 top-0 w-[160px] p-4 rounded-xl text-white text-left transition-all",
      "hover:scale-105 focus:outline-none focus:ring-4",
      CATEGORY_MAP[node.category as keyof typeof CATEGORY_MAP],
      isSelected ? "ring-4 ring-ink/20 scale-105 z-30" : "z-20 opacity-90 shadow-sm"
    )}
  >
    <span className="block text-xs font-bold truncate">{node.title}</span>
    <span className="block text-[10px] opacity-70 uppercase font-bold">{node.category}</span>
  </button>
);