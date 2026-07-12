type Props = {
  score: number;
};

export default function OverallScoreCard({ score }: Props) {
  const getDifficultyLevel = (score: number) => {
    if (score >= 80) return "EASY LEVEL";
    if (score >= 60) return "MEDIUM LEVEL";
    return "HARD LEVEL";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-zinc-200 text-center">
      <p className="text-sm font-semibold text-zinc-500 mb-4">
        OVERALL SCORE
      </p>
      <p className="text-6xl font-bold text-zinc-900 mb-2">
        {score}
      </p>
      <p className="text-sm text-zinc-500">
        {getDifficultyLevel(score)}
      </p>
    </div>
  );
}
