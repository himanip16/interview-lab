import type { Deployment } from "../../domain/types/Deployment";

interface Props {
  deployments: Deployment[];
  active: boolean;
}

export default function DeploymentsPanel({
  deployments,
  active,
}: Props) {
  return (
    <div className={`panel${active ? " active" : ""}`}>
      <div className="timeline">
        {deployments.map((d) => (
          <div key={d.id} className={`dep ${d.status}`}>
            <div className="dep-top">
              <span className="dep-ver">{d.version}</span>

              <span className={`dep-status ${d.status}`}>
                {d.status === "rolled" ? "Rolled back" : "Stable"}
              </span>
            </div>

            <div className="dep-msg">
              {d.message}
            </div>

            <div className="dep-time">
              {d.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}