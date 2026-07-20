import FeatureCard from "./FeatureCard";
import { features } from "@/content/learning/features";

export default function Features() {
  return (
    <section className="py-20">

      <h2 className="text-4xl font-bold text-foreground">
        Why AI Interview?
      </h2>

      <p className="mt-3 text-muted-foreground">
        Practice interviews designed to feel like real technical interviews.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>

    </section>
  );
}