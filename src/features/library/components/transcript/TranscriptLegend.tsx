export default function TranscriptLegend() {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-600">
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-emerald-500" />
        <span>Strong answer</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-rose-500" />
        <span>Missed opportunity</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="rounded bg-yellow-100 px-2 py-0.5 font-medium text-yellow-800">
          Highlight
        </span>
        <span>Click highlighted text to view the explanation.</span>
      </div>
    </div>
  );
}