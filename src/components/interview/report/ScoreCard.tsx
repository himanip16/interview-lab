// components/interview/report/ScoreCard.tsx
export default function ScoreCard({ score, label = "Overall Score" }: { score: number, label?: string }) {
  const getColor = (s: number) => {
    if (s >= 80) return 'text-green-600 border-green-200 bg-green-50';
    if (s >= 60) return 'text-yellow-600 border-yellow-200 bg-yellow-50';
    return 'text-red-600 border-red-200 bg-red-50';
  };

  return (
    <div className={`p-8 rounded-2xl border-2 flex flex-col items-center justify-center ${getColor(score)}`}>
      <span className="text-sm font-bold uppercase tracking-wider opacity-70">{label}</span>
      <div className="text-6xl font-black mt-2">{score}</div>
      <div className="w-full bg-black/10 h-2 rounded-full mt-6 overflow-hidden">
        <div 
          className="h-full bg-current transition-all duration-1000" 
          style={{ width: `${score}%` }} 
        />
      </div>
    </div>
  );
}