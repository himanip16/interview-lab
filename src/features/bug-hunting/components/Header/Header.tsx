import Timer from "./Timer";
import type { BugScenario } from "../../types/Scenario";

export default function Header({ scenario, onBack }: { scenario: BugScenario; onBack: () => void }) {
  return (
    <div className="head">
      <div className="crumb">
        <button className="back" onClick={onBack}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <div className="crumb-text">Bug hunting &nbsp;/&nbsp; <b>{scenario.title}</b></div>
      </div>
      <div className="head-right">
        <Timer seconds={scenario.timerSeconds} />
        <button className="submit-btn">Submit fix</button>
      </div>
    </div>
  );
}