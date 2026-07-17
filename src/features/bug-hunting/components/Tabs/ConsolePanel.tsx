

type ConsoleEntry = {
  id?: string | number;
  level: string;
  ts?: string;
  message: string;
};

type Props = {
  logs?: ConsoleEntry[];
};

export function ConsolePanel({ logs = [] }: Props) {
  if (logs.length === 0) {
    return (
      <div className="panel-empty">
        <p>No console output.</p>
      </div>
    );
  }

  return (
    <div className="console-panel">
      {logs.map((log, index) => (
        <div
          key={log.id ?? index}
          className={`console-line console-${log.level}`}
        >
          <span className="console-time">{log.ts}</span>

          <span className="console-level">
            {log.level.toUpperCase()}
          </span>

          <span className="console-message">
            {log.message}
          </span>
        </div>
      ))}
    </div>
  );
}