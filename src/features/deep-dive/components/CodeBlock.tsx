interface CodeBlockProps {
  children: string;
}

export function CodeBlock({ children }: CodeBlockProps) {
  return (
    <div className="code-block mono">
      <pre dangerouslySetInnerHTML={{ __html: children }} />
    </div>
  );
}
