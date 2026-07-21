import type { DocumentationSection } from "@/features/bug-hunting/domain/types/DocumentationSection";

type Props = {
  docs: DocumentationSection[];
  active: boolean;
};

export default function DocsPanel({
  docs,
  active,
}: Props) {
  return (
    <div className={`panel${active ? " active" : ""}`}>
      <div className="doc">
        {docs.map((doc, index) => (
          <div key={index}>
            <h3>{doc.title}</h3>
            <p>{doc.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}