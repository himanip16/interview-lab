type Props = {
    value: string;
    onChange: (value: string) => void;
};

const options = [
    "Easy",
    "Medium",
    "Hard",
    "Staff",
];

export default function DifficultySelector({
    value,
    onChange,
}: Props) {
    return (
        <div className="mt-8">

            <h3 className="mb-3 font-semibold">
                Difficulty
            </h3>

            <div className="flex gap-3">

                {options.map((option) => (
                    <button
                        key={option}
                        onClick={() => onChange(option)}
                        className={`rounded-lg border px-5 py-2 ${
                            value === option
                                ? "border-blue-500 bg-blue-600"
                                : "border-zinc-700"
                        }`}
                    >
                        {option}
                    </button>
                ))}

            </div>
        </div>
    );
}