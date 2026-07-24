import "./CodeBlock.css";

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
    <figure className="code-block">
      <div className="code-block-header">
        <span className="code-language">
          {language.toUpperCase()}
        </span>
      </div>

      <div
        className="code-block-body"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  );
}