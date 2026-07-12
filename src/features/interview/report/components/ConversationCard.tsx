type EvidenceItem = {
  dimension: string;
  timestampSeconds: number;
  quote: string;
  comment: string;
};

type Props = {
  evidence: EvidenceItem[];
};

export default function ConversationCard({ evidence }: Props) {
  const formatTimestamp = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-zinc-200">
      {evidence.length > 0 ? (
        <div className="space-y-4">
          {evidence.map((item, index) => (
            <div key={index} className="border-b border-zinc-100 pb-4 last:border-0 last:pb-0">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-zinc-500">
                  {item.dimension === 'INTERVIEWER' ? 'INTERVIEWER' : 'CANDIDATE'}
                </span>
                <span className="text-sm text-zinc-400">
                  {formatTimestamp(item.timestampSeconds)}
                </span>
              </div>
              <p className="text-zinc-800 leading-relaxed">
                {item.quote}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-zinc-400">
          No conversation data available
        </div>
      )}
    </div>
  );
}
