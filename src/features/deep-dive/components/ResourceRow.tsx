interface ResourceRowProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  chips?: Array<{ label: string; variant?: 'ok' }>;
}

export function ResourceRow({ icon, title, subtitle, chips }: ResourceRowProps) {
  return (
    <div className="res-row">
      <div className="res-ic">{icon}</div>
      <div className="res-info">
        <div className="res-title">{title}</div>
        <div className="res-sub">{subtitle}</div>
      </div>
      {chips && (
        <div className="chip-row">
          {chips.map((chip, index) => (
            <span key={index} className={`chip ${chip.variant || ''}`}>
              {chip.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
