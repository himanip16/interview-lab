import { diagrams } from "@/data/systemDiagrams";

export async function generateStaticParams() {
  return diagrams.map((d) => ({
    system: d.slug,
  }));
}

export default function Page({ params }) {
  const diagram = diagrams.find(
    (d) => d.slug === params.system
  );

  if (!diagram) {
    notFound();
  }

  return <SystemDiagram systemType={diagram.slug} />;
}