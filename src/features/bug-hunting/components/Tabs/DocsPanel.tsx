import type { DocSection } from "../../types/Scenario";

export default function DocsPanel({ docs, active }: { docs: DocSection[]; active: boolean }) {
  return (
    <div className={`panel${active ? " active" : ""}`}>
      <div className="doc">
        {docs.map((d, i) => (
          <div key={i}>
            <h3>{d.title}</h3>
            <p>{d.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}