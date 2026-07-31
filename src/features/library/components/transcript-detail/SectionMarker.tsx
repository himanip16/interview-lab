// src/features/library/components/transcript-detail/SectionMarker.tsx

type Props = {
  title: string;
  isFirst?: boolean;
};

export function SectionMarker({ title, isFirst = false }: Props) {
  return (
    <div
      className="text-[11px] font-bold uppercase tracking-[0.08em]"
      style={{ 
        color: "#6A5AE0",
        marginTop: isFirst ? "0" : "34px",
        marginBottom: "16px",
        paddingTop: "6px"
      }}
    >
      {title}
    </div>
  );
}
