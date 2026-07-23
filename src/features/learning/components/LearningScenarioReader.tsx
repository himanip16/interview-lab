// src/features/learning/components/LearningScenarioReader.tsx

import { useState } from "react";

import { Scenario, Segment } from "../types/learning";
import { StaticConversationBubble } from "./StaticConversationBubble";
import { SegmentTakeaway } from "./SegmentTakeaway";
import { ObserveAction } from "./actions/ObserveAction";
import { JudgeAction } from "./actions/JudgeAction";
import { FixAction } from "./actions/FixAction";
import { PredictAction } from "./actions/PredictAction";
import { CompareAction } from "./actions/CompareAction";
import { LearningActionType } from "@prisma/client";



interface LearningScenarioReaderProps {
  scenario: Scenario;
  userId?: string;
}

interface ConversationMessage {
  role: "assistant" | "user";
  content: string;
}

export function LearningScenarioReader({ scenario, userId }: LearningScenarioReaderProps) {
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  const currentSegment = scenario.segments[currentSegmentIndex];
  const isLastSegment = currentSegmentIndex === scenario.segments.length - 1;
  const allActionsCompleted = currentSegment.actions.every((action) =>
    completedActions.has(action.id)
  );

  const handleActionComplete = async (actionId: string, response?: unknown) => {
    // Persist attempt to database if userId is available
    if (userId && response !== undefined) {
      try {
        await fetch(`/api/learning-actions/${actionId}/attempt`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ response }),
        });
      } catch (error) {
        console.error("Failed to persist learning attempt:", error);
      }
    }
    setCompletedActions((prev) => new Set(prev).add(actionId));
  };

  const handleNextSegment = () => {
    if (!isLastSegment) {
      setCurrentSegmentIndex((prev) => prev + 1);
      setCompletedActions(new Set());
    }
  };

  const renderAction = (action: Segment["actions"][0]) => {
    const actionMap = {
  OBSERVE: ObserveAction,
  JUDGE: JudgeAction,
  FIX: FixAction,
  PREDICT: PredictAction,
  COMPARE: CompareAction,
} satisfies Record<LearningActionType, React.ComponentType<any>>;

    const ActionComponent = actionMap[action.type];

    if (!ActionComponent) return null;

    return (
      <ActionComponent
        key={action.id}
        action={action}
        onComplete={(response?: unknown) => handleActionComplete(action.id, response)}
      />
    );
  };

  const conversation = currentSegment.conversation as ConversationMessage[] | null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{scenario.title}</h1>
        {scenario.description && (
          <p className="text-muted-foreground">{scenario.description}</p>
        )}
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <span>Segment {currentSegmentIndex + 1} of {scenario.segments.length}</span>
        </div>
      </div>

      {/* Conversation */}
      {conversation && conversation.length > 0 && (
        <div className="mb-6">
          {conversation.map((message, index) => (
            <StaticConversationBubble key={index} message={message} />
          ))}
        </div>
      )}

      {/* Takeaway */}
      <SegmentTakeaway takeaway={currentSegment.takeaway} />

      {/* Learning Actions */}
      <div className="space-y-6 mb-8">
        {currentSegment.actions.map((action) => renderAction(action))}
      </div>

      {/* Navigation */}
      {allActionsCompleted && (
        <div className="flex justify-center">
          {isLastSegment ? (
            <div className="text-center p-6 bg-accent/50 rounded-lg border border-border">
              <h3 className="text-xl font-semibold mb-2">Scenario Complete!</h3>
              <p className="text-muted-foreground mb-4">
                You've completed all segments of this learning scenario.
              </p>
            </div>
          ) : (
            <button
              onClick={handleNextSegment}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Next Segment
            </button>
          )}
        </div>
      )}
    </div>
  );
}
