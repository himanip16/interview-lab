// src/features/deep-dive/components/TradeoffCard.tsx

interface TradeoffCardProps {
  type: 'good' | 'bad';
  label: string;
  items: string[];
}

export function TradeoffCard({ type, label, items }: TradeoffCardProps) {
  return (
    <div className={`tog ${type}`}>
      <div className="k">{label}</div>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
