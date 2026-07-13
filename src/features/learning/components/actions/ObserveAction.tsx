import { useState } from "react";

import { Action, ObserveActionContent } from "../../types/learning";

interface ObserveActionProps {
  action: Action;
  onComplete: () => void;
}

export function ObserveAction({ action, onComplete }: ObserveActionProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  const content = action.content as ObserveActionContent;

  const handleReveal = () => {
    setIsRevealed(true);
  };

  const handleContinue = () => {
    onComplete();
  };

  return (
    <div className="border border-border rounded-lg p-6 bg-card">
      <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
      {action.instructions && (
        <p className="text-sm text-muted-foreground mb-4">{action.instructions}</p>
      )}
      
      {!isRevealed ? (
        <button
          onClick={handleReveal}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
        >
          Reveal Reflection
        </button>
      ) : (
        <div className="space-y-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p>{content.reflection}</p>
          </div>
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
