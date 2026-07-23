// src/features/interview/report/components/ConversationCard.tsx

import Card from "@/shared/ui/Card";
import Text from "@/shared/ui/Text";
import type { EvidenceItem } from "@/features/interview/domain/evaluation/types";

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
    <Card>
      {evidence.length > 0 ? (
        <div className="space-y-4">
          {evidence.map((item, index) => (
            <div key={index} className="border-b border-border pb-4 last:border-0 last:pb-0">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-muted-foreground">
                  {item.type}
                </span>
                <Text variant="small">
                  {formatTimestamp(item.timestampSeconds)}
                </Text>
              </div>
              <Text variant="body" className="leading-relaxed">
                {item.quote}
              </Text>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Text variant="muted">No conversation data available</Text>
        </div>
      )}
    </Card>
  );
}
