interface RelatedTechnologyCardProps {
  name: string;
  description: string;
}

export function RelatedTechnologyCard({ name, description }: RelatedTechnologyCardProps) {
  return (
    <div className="rel-card">
      <div className="rn">{name}</div>
      <div className="rd">{description}</div>
    </div>
  );
}
