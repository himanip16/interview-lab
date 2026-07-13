interface ConversationMessage {
  role: "assistant" | "user";
  content: string;
}

interface StaticConversationBubbleProps {
  message: ConversationMessage;
}

export function StaticConversationBubble({ message }: StaticConversationBubbleProps) {
  const isAI = message.role === "assistant";

  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-xl p-4 ${
          isAI
            ? 'bg-muted text-foreground border border-border shadow-sm'
            : 'bg-primary text-primary-foreground shadow-md'
        }`}
      >
        <div className="text-xs mb-1 opacity-70 font-semibold uppercase">
          {isAI ? 'Interviewer' : 'Candidate'}
        </div>
        <div className="whitespace-pre-wrap leading-relaxed text-sm">
          {message.content}
        </div>
      </div>
    </div>
  );
}
