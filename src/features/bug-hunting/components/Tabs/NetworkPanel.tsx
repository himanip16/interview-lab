

type NetworkRequest = {
  id?: string | number;
  method: string;
  url: string;
  status: number | string;
  duration: number;
};

type Props = {
  requests?: NetworkRequest[];
};

export function NetworkPanel({ requests = [] }: Props) {
  if (requests.length === 0) {
    return (
      <div className="panel-empty">
        <p>No network activity.</p>
      </div>
    );
  }

  return (
    <div className="network-list">
      <table className="network-table">
        <thead>
          <tr>
            <th>Method</th>
            <th>URL</th>
            <th>Status</th>
            <th>Duration</th>
          </tr>
        </thead>

        <tbody>
          {requests.map((request, index) => (
            <tr key={request.id ?? index}>
              <td>{request.method}</td>
              <td>{request.url}</td>
              <td>{request.status}</td>
              <td>{request.duration} ms</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}