import type { BugScenario } from "../../types/Scenario";

type Props = {
  scenario: BugScenario;
  hypothesis: string;
  onHypothesisChange: (v: string) => void;
  onSubmitHypothesis: () => void;
};

export default function ReportSidebar({ scenario, hypothesis, onHypothesisChange, onSubmitHypothesis }: Props) {
  return (
    <div className="report">
      <h2>The report</h2>
      <div className="sev">{scenario.severity}</div>
      <p className="symptom">{scenario.symptom}</p>

      <div className="meta-row"><span className="k">Service</span><span className="v">{scenario.service}</span></div>
      <div className="meta-row"><span className="k">Endpoint</span><span className="v mono" style={{ fontSize: 11 }}>{scenario.endpoint}</span></div>
      <div className="meta-row"><span className="k">Error rate</span><span className="v" style={{ color: "var(--coral)" }}>{scenario.errorRate}</span></div>
      <div className="meta-row"><span className="k">First seen</span><span className="v">{scenario.firstSeen}</span></div>

      <div className="hyp-label">Your hypothesis</div>
      <textarea
        className="hyp-box"
        placeholder="What do you think is going on so far?"
        value={hypothesis}
        onChange={(e) => onHypothesisChange(e.target.value)}
      />
      <button className="hyp-submit" onClick={onSubmitHypothesis}>Log hypothesis</button>
    </div>
  );
}