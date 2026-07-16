export class JSONSchemaBuilder {
  build(
    prompt: string,
    schema: string
  ): string {
    return [
      prompt,
      "",
      "Return valid JSON only.",
      schema,
    ].join("\n");
  }
}