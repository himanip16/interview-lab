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
    <div className="bg-white rounded-lg shadow-md p-6 border border-zinc-200">
      <p className="text-sm font-semibold text-zinc-500 mb-4">
        WHAT HAPPENED
      </p>
      
      {allItems.length > 0 ? (
        <ul className="space-y-3">
          {allItems.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <span 
                className={`flex-shrink-0 w-2.5 h-2.5 rounded-full mt-1.5 ${
                  item.type === "OBSERVATION" ? "bg-green-500" : "bg-orange-500"
                }`}
              />
              <div className="flex-1">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                  {item.type}
                </span>
                <p className="text-zinc-900 leading-relaxed mt-1 font-normal">
                  {item.text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8 text-zinc-400">
          No observations available
        </div>
      )}
    </div>
  );
}
