// src/features/library/components/transcript-detail/EvaluationCallout.tsx

type Props = {
  eval: string[];
};

export function EvaluationCallout({ eval: evaluations }: Props) {
  return (
    <div
      className="my-3 max-w-[78%] rounded-[14px] px-4 py-3.5"
      style={{ background: "rgba(0,217,163,0.07)", border: "1px solid rgba(0,168,126,0.2)" }}
    >
      <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold" style={{ color: "#00A87E" }}>
        ✓ Good signal
      </div>
      <ul className="m-0 list-none p-0">
        {evaluations.map((item, index) => (
          <li
            key={index}
            className="relative pl-4 text-[12px]"
            style={{ color: "#5A5B66", marginBottom: "3px" }}
          >
            <span
              className="absolute left-0 font-bold"
              style={{ color: "#00A87E" }}
            >
              ✓
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
