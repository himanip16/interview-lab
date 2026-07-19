interface CalloutProps {
  label: string;
  children: React.ReactNode;
}

export function Callout({ label, children }: CalloutProps) {
  return (
    <div className="callout">
      <div className="lbl">{label}</div>
      <p>{children}</p>
    </div>
  );
}
