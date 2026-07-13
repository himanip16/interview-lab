import { useState } from "react";

import { Action, ObserveActionContent } from "../../types/learning";

interface ObserveActionProps {
  action: Action;
  onComplete: () => void;
}

export function ObserveAction({ action, onComplete }: ObserveActionProps) {
  const [isRead, setIsRead] = useState(false);

  const content = action.content as ObserveActionContent;

  const handleMarkAsRead = () => {
    setIsRead(true);
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
      
      <div className="prose prose-sm dark:prose-invert max-w-none mb-4">
        <p>{content.reflection}</p>
      </div>

      {!isRead ? (
        <button
          onClick={handleMarkAsRead}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
        >
          Mark as Read
        </button>
      ) : (
        <button
          onClick={handleContinue}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
        >
          Continue
        </button>
      )}
    </div>
  );
}
