// src/features/interview/prompts/prompt/PromptRenderer.ts

export interface PromptVariables {
  [key: string]: string | number | boolean | undefined;
}

export class PromptRenderer {
  render(
    template: string,
    variables: PromptVariables
  ): string {
    let rendered = template;

    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;

      // Only replace if the value is defined
      if (value !== undefined && value !== null) {
        rendered = rendered.replaceAll(
          placeholder,
          String(value)
        );
      } else {
        // Remove the placeholder entirely if value is undefined
        rendered = rendered.replaceAll(placeholder, "");
      }
    }

    // Remove any remaining placeholders that weren't in the variables object
    rendered = rendered.replace(/\{\{[^}]+\}\}/g, "");

    return rendered;
  }
}