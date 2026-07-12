import Timer from "./Timer";

interface InterviewHeaderProps {
  duration: number;
  interviewId: string;
}

export default function InterviewHeader({
  duration,
  interviewId,
}: InterviewHeaderProps) {
  return (
    <header className="h-16 border-b border-zinc-200 flex items-center justify-between px-6 bg-zinc-50">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
        <span className="font-semibold text-zinc-900">
          Live Interview Session
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
            Time Remaining
          </span>

          <Timer
            durationInMinutes={duration}
            interviewId={interviewId}
          />
        </div>
      </div>
    </header>
  );
}