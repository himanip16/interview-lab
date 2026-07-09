import ChatWindow from "@/components/ChatWindow";
import InterviewHeader from "@/components/InterviewHeader";
import MessageInput from "@/components/MessageInput";

export default function Home() {
  return (
    <main className="flex h-screen flex-col bg-gray-50">
      <InterviewHeader />

      <ChatWindow />

      <MessageInput />
    </main>
  );
}