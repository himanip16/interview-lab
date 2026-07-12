import Card from "@/src/components/ui/Card";
import Text from "@/src/components/ui/Text";

type Observation = {
  type: "OBSERVATION" | "ADVISORY";
  text: string;
};

type Props = {
  observations: Observation[];
  strengths?: string[];
  weaknesses?: string[];
};

export default function WhatHappenedCard({ observations, strengths, weaknesses }: Props) {
  // Combine observations with strengths and weaknesses if no explicit observations
  const allItems = observations.length > 0 
    ? observations 
    : [
        ...(strengths?.map(s => ({ type: "OBSERVATION" as const, text: s })) ?? []),
        ...(weaknesses?.map(w => ({ type: "ADVISORY" as const, text: w })) ?? [])
      ];

  return (
    <Card>
      <Text variant="small" className="font-semibold mb-4">
        WHAT HAPPENED
      </Text>

      {allItems.length > 0 ? (
        <ul className="space-y-3">
          {allItems.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <span
                className={`flex-shrink-0 w-2.5 h-2.5 rounded-full mt-1.5 ${
                  item.type === "OBSERVATION" ? "bg-emerald-500" : "bg-orange-500"
                }`}
              />
              <div className="flex-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {item.type}
                </span>
                <Text variant="body" className="leading-relaxed mt-1">
                  {item.text}
                </Text>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8">
          <Text variant="muted">No observations available</Text>
        </div>
      )}
    </Card>
  );
}
