type Props = {
    value: number;
    onChange: (value: number) => void;
};

const durations = [15, 30, 45, 60, 90];

export default function DurationSelector({
    value,
    onChange,
}: Props) {
    return (
        <div className="mt-8">

            <h3 className="mb-3 font-semibold">
                Duration
            </h3>

            <div className="flex gap-3">

                {durations.map((duration) => (
                    <button
                        key={duration}
                        onClick={() => onChange(duration)}
                        className={`rounded-lg border px-5 py-2 ${
                            value === duration
                                ? "border-blue-500 bg-blue-600"
                                : "border-zinc-700"
                        }`}
                    >
                        {duration} min
                    </button>
                ))}

            </div>
        </div>
    );
}