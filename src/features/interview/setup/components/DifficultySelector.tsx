import { Button } from "@/src/components/ui/Button";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const DIFFICULTY_OPTIONS = [
  "Easy",
  "Medium",
  "Hard",
] as const;

export default function DifficultySelector({
  value,
  onChange,
}: Props) {
  return (
    <div className="mt-8">
      <h3 className="mb-3 font-semibold text-foreground">
        Difficulty
      </h3>

      <div className="flex flex-wrap gap-3">
        {DIFFICULTY_OPTIONS.map((option) => (
          <Button
            key={option}
            type="button"
            variant={value === option ? "primary" : "outline"}
            aria-pressed={value === option}
            onClick={() => onChange(option)}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}