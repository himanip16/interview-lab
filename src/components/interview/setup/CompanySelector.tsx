import { Input } from "@/src/components/ui/Input";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const COMPANIES = [
  "Google",
  "Meta",
  "Uber",
  "Stripe",
  "Amazon",
] as const;

export default function CompanySelector({
  value,
  onChange,
}: Props) {
  return (
    <div className="mt-8">
      <h3 className="mb-3 font-semibold">
        Interview Style
      </h3>

      <Input
        as="select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {COMPANIES.map((company) => (
          <option
            key={company}
            value={company}
          >
            {company}
          </option>
        ))}
      </Input>
    </div>
  );
}