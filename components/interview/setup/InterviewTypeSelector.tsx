// components/interview/setup/InterviewTypeSelector.tsx
const TYPES = [
  { id: 'system-design', title: 'Standard System Design', desc: 'General architecture, APIs, and DB design.' },
  { id: 'high-scale', title: 'High Scale / Distributed', desc: 'Focus on sharding, caching, and throughput.' },
  { id: 'api-design', title: 'API & Integration', desc: 'Focus on contract design and developer UX.' }
];

export default function InterviewTypeSelector({ value, onChange }: any) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {TYPES.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`text-left p-4 rounded-xl border-2 transition-all ${
            value === t.id ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-slate-300'
          }`}
        >
          <h3 className="font-bold text-slate-800">{t.title}</h3>
          <p className="text-sm text-slate-500">{t.desc}</p>
        </button>
      ))}
    </div>
  );
}