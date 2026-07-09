type Props = {
  role: "assistant" | "user";
  content: string;
};

export default function ChatMessage({
  role,
  content,
}: Props) {
  const isAssistant = role === "assistant";

  return (
    <div
      className={`flex ${
        isAssistant ? "justify-start" : "justify-end"
      }`}
    >
      <div
        className={`max-w-2xl rounded-xl px-4 py-3 ${
          isAssistant
            ? "bg-gray-200"
            : "bg-blue-600 text-white"
        }`}
      >
        {content}
      </div>
    </div>
  );
}