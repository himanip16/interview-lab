import ChatMessage from "./ChatMessage";

const messages = [
  {
    role: "assistant" as const,
    content:
      "Welcome! Today we'll design YouTube. Start by asking clarifying questions.",
  },
];

export default function ChatWindow() {
  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
      {messages.map((message, index) => (
        <ChatMessage
          key={index}
          role={message.role}
          content={message.content}
        />
      ))}
    </div>
  );
}