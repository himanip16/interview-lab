import { highlightSnippet } from "./shiki";

type Props = {
  code: string;
  language?: string;
};

export default async function CodeBlock({
  code,
  language = "text",
}: Props) {
  const html = await highlightSnippet(code, language);

  return (
    <div
      className="overflow-hidden rounded-lg"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}