import { useState } from "react";

import { Action, PredictActionContent } from "../../types/learning";

interface PredictActionProps {
  action: Action;
  onComplete: (response?: unknown) => void;
}

export function PredictAction({ action, onComplete }: PredictActionProps) {
  const [prediction, setPrediction] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);

  const content = action.content as PredictActionContent;
  const question = content?.question || "No question available.";
  const revealExplanation = content?.revealExplanation || "No explanation available.";
  const reflection = content?.reflection;

  const handleSubmit = () => {
    if (prediction.trim()) {
      setShowExplanation(true);
    }
  };

  const handleContinue = () => {
    onComplete({ prediction });
  };

  return (
    <div className="border border-border rounded-lg p-6 bg-card">
      <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
      {action.instructions && (
        <p className="text-sm text-muted-foreground mb-4">{action.instructions}</p>
      )}

      <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
        <p>{question}</p>
      </div>

      {!showExplanation ? (
        <div className="space-y-4">
          <textarea
            value={prediction}
            onChange={(e) => setPrediction(e.target.value)}
            placeholder="Enter your prediction..."
            className="w-full min-h-[100px] px-3 py-2 border border-border rounded bg-background text-foreground"
            rows={4}
          />
          <button
            onClick={handleSubmit}
            disabled={!prediction.trim()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reveal Explanation
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded border border-border">
            <p className="text-sm font-semibold mb-2">Your Prediction:</p>
            <p className="text-sm">{prediction}</p>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p>{revealExplanation}</p>
          </div>

          {reflection && (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p>{reflection}</p>
            </div>
          )}

          <button
            onClick={handleContinue}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
