import { TradeoffCard } from './TradeoffCard';

interface TradeoffComparisonProps {
  strengths: string[];
  weaknesses: string[];
}

export function TradeoffComparison({ strengths, weaknesses }: TradeoffComparisonProps) {
  return (
    <div className="tradeoff-grid">
      <TradeoffCard type="good" label="Good fit" items={strengths} />
      <TradeoffCard type="bad" label="Poor fit" items={weaknesses} />
    </div>
  );
}
