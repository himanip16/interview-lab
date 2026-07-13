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
    <header className="h-20 border-b border-border flex items-center justify-between px-6 bg-card">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
        <span className="font-semibold text-foreground">
          Live Interview Session
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
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