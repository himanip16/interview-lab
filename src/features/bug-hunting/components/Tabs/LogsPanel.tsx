import type { LogLine } from "../../types/Scenario";

export default function LogsPanel({ logs, active }: { logs: LogLine[]; active: boolean }) {
  return (
    <div className={`panel${active ? " active" : ""}`}>
      <div className="log-search">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
        </svg>
        Filter logs&hellip;
      </div>
      <div className="mono">
        {logs.map((log, i) => (
          <div key={i} className={`log-line ${log.level}`}>
            <span className="ts">{log.ts}</span>
            <span className="lvl">{log.level.toUpperCase()}</span>
            <span>{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}