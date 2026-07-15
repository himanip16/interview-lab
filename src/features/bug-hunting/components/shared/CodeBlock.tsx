export default function CodeBlock({ html }: { html: string }) {
  // static, author-authored highlight markup — same trust boundary as the
  // original innerHTML assignment in the source <script>
  return <pre dangerouslySetInnerHTML={{ __html: html }} />;
}