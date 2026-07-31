// src/features/library/components/transcript-detail/IntentTag.tsx

type Props = {
  intent: string;
};

export function IntentTag({ intent }: Props) {
  return (
    <div
      className="mb-1.5 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold"
      style={{ color: "#E8940A", background: "rgba(232,148,10,0.1)" }}
    >
      📍 Testing: {intent}
    </div>
  );
}
