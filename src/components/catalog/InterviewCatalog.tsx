import InterviewCard from "./InterviewCard";
import { interviews } from "@/src/modules/interview/domain/interviews";

export default function InterviewCatalog() {
  return (
    <section className="py-20">

      <h2 className="text-4xl font-bold">
        Practice Interviews
      </h2>

      <p className="mt-3 text-zinc-400">
        Choose an interview and start practicing.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {interviews.map((interview) => (
          <InterviewCard
            key={interview.id}
            interview={interview}
          />
        ))}

      </div>

    </section>
  );
}