import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";

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
    <Card className="text-center">
      <Text variant="small" className="font-semibold mb-4">
        OVERALL SCORE
      </Text>
      <p className="text-6xl font-bold text-foreground mb-2">
        {score}
      </p>
      <Text variant="small">
        {getDifficultyLevel(score)}
      </Text>
    </Card>
  );
}
