type Props = {
    value: string;
    onChange: (value: string) => void;
};

const companies = [
    "Google",
    "Meta",
    "Uber",
    "Stripe",
    "Amazon",
];

export default function CompanySelector({
    value,
    onChange,
}: Props) {
    return (
        <div className="mt-8">

            <h3 className="mb-3 font-semibold">
                Interview Style
            </h3>

            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3"
            >
                {companies.map((company) => (
                    <option key={company}>
                        {company}
                    </option>
                ))}
            </select>

        </div>
    );
}