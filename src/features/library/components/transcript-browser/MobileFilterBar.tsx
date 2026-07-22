"use client";

type Category = keyof typeof CATS | 'all';

const CATS = {
  behavioral: { label: 'Behavioral', color: '#E8940A' },
  dsa: { label: 'Data Structures & Algorithms', color: '#00A87E' },
  hld: { label: 'High Level Design', color: '#6A5AE0' },
  lld: { label: 'Low Level Design', color: '#FF5A3C' },
  'machine-coding': { label: 'Machine Coding', color: '#6A5AE0' },
} as const;

type Props = {
  categories: typeof CATS;
  counts: Record<string, number>;
  selected: Category;
  onSelect: (cat: Category) => void;
};

export default function MobileFilterBar({
  categories,
  counts,
  selected,
  onSelect
}: Props) {
  return (
    <div className="mobile-filter-bar flex gap-[7px] overflow-x-auto border-b" style={{
      padding: '12px 16px',
      borderColor: 'rgba(21,22,28,0.08)',
      flexShrink: 0,
      fontFamily: "'Inter', sans-serif",
      display: 'none'
    }}>
      <button
        onClick={() => onSelect('all')}
        style={{
          fontSize: '12.65px',
          fontWeight: 600,
          padding: '7px 13px',
          borderRadius: '999px',
          border: selected === 'all' ? '1px solid #15161C' : '1px solid rgba(21,22,28,0.08)',
          color: selected === 'all' ? '#FAF9F6' : '#5A5B66',
          background: selected === 'all' ? '#15161C' : 'transparent',
          whiteSpace: 'nowrap',
          cursor: 'pointer'
        }}
      >
        All ({counts.all})
      </button>

      {Object.entries(categories).map(([key, cat]) => (
        <button
          key={key}
          onClick={() => onSelect(key as Category)}
          style={{
            fontSize: '12.65px',
            fontWeight: 600,
            padding: '7px 13px',
            borderRadius: '999px',
            border: selected === key ? '1px solid #15161C' : '1px solid rgba(21,22,28,0.08)',
            color: selected === key ? '#FAF9F6' : '#5A5B66',
            background: selected === key ? '#15161C' : 'transparent',
            whiteSpace: 'nowrap',
            cursor: 'pointer'
          }}
        >
          {cat.label} ({counts[key]})
        </button>
      ))}
    </div>
  );
}
