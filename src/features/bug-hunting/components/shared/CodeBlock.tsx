const KEYWORDS = new Set([
  "public",
  "private",
  "class",
  "static",
  "final",
  "int",
  "return",
  "try",
  "catch",
  "for",
  "database",
  "pool",
  "timeout-ms",
  "max-connections",
]);

type Token = {
  text: string;
  type: "kw" | "str" | "cm" | "plain";
};

function tokenize(line: string): Token[] {
  const tokens: Token[] = [];

  const commentMatch = line.match(/(\/\/.*|#.*)$/);
  const code = commentMatch ? line.slice(0, commentMatch.index) : line;
  const comment = commentMatch?.[0];

  for (const word of code.split(/(\s+|[(){};,.])/)) {
    if (!word) continue;

    if (/^\d+$/.test(word)) {
      tokens.push({ text: word, type: "str" });
    } else if (KEYWORDS.has(word)) {
      tokens.push({ text: word, type: "kw" });
    } else {
      tokens.push({ text: word, type: "plain" });
    }
  }

  if (comment) {
    tokens.push({ text: comment, type: "cm" });
  }

  return tokens;
}

export default function CodeBlock({
  content,
}: {
  content: string;
}) {
  return (
    <pre className="bh-code-pre">
      {content.split("\n").map((line, i) => (
        <div key={i}>
          {tokenize(line).map((token, j) => (
            <span
              key={j}
              className={
                token.type !== "plain"
                  ? `bh-${token.type}`
                  : undefined
              }
            >
              {token.text}
            </span>
          ))}
        </div>
      ))}
    </pre>
  );
}