import { Segment } from "../types/learning";

interface SegmentConversationProps {
  segment: Segment;
}

interface ConversationMessage {
  role: "assistant" | "user";
  content: string;
}

export function SegmentConversation({ segment }: SegmentConversationProps) {
  const conversation = segment.conversation as ConversationMessage[] | null;

  if (!conversation || conversation.length === 0) {
    return null;
  }

  return (
    <div className="border border-border rounded-lg p-6 bg-card mb-6">
      <h3 className="text-lg font-semibold mb-4">Conversation</h3>
      <div className="space-y-4">
        {conversation.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-3 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
