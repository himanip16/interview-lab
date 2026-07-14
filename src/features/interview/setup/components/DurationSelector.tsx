import { Button } from "@/components/ui/Button";

type Props = {
  value: number;
  onChange: (value: number) => void;
};

const DURATIONS = [15, 30, 45, 60, 90] as const;

export default function DurationSelector({
  value,
  onChange,
}: Props) {
  return (
    <div className="mt-8">
      <h3 className="mb-3 font-semibold text-foreground">
        Duration
      </h3>

      <div className="flex flex-wrap gap-3">
        {DURATIONS.map((duration) => (
          <Button
            key={duration}
            type="button"
            variant={value === duration ? "primary" : "outline"}
            aria-pressed={value === duration}
            onClick={() => onChange(duration)}
          >
            {duration} min
          </Button>
        ))}
      </div>
    </div>
  );
}