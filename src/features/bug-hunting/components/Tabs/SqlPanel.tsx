import type { SqlResultRow } from "../../types/Scenario";

type Props = {
  active: boolean;
  query: string;
  onQueryChange: (v: string) => void;
  onRun: () => void;
  results: SqlResultRow[];
};

export default function SqlPanel({ active, query, onQueryChange, onRun, results }: Props) {
  return (
    <div className={`panel${active ? " active" : ""}`}>
      <textarea
        className="sql-box mono"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
      <button className="run-btn" onClick={onRun}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
        Run query
      </button>
      <table>
        <tbody>
          <tr><th>order_id</th><th>status</th><th>retry_count</th><th>created_at</th></tr>
          {results.map((r) => (
            <tr key={r.order_id}>
              <td>{r.order_id}</td>
              <td>{r.status}</td>
              <td className={r.flagged ? "flag" : undefined}>{r.retry_count}</td>
              <td>{r.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}