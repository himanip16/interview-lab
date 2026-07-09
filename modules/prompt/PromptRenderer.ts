export interface PromptVariables {
  [key: string]: string | number | boolean;
}

export class PromptRenderer {
  render(
    template: string,
    variables: PromptVariables
  ): string {
    let rendered = template;

    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;

      rendered = rendered.replaceAll(
        placeholder,
        String(value)
      );
    }

    return rendered;
  }
}