interface WhiteboardElement {
  id: string;
  type: string;
  label: string;
  points?: number[];
  explanationTitle?: string;
}

export class WhiteboardSerializer {
  /** Compact text description for prompt injection. Empty string if nothing drawn. */
  describe(elements: WhiteboardElement[] | null | undefined): string {
    if (!elements || elements.length === 0) {
      return "The candidate has not drawn anything on the whiteboard yet.";
    }

    const nodes = elements.filter((el) => el.type !== "arrow");
    const arrows = elements.filter((el) => el.type === "arrow");

    const nodeById = new Map(nodes.map((n) => [n.id, n]));

    const nodeLines = nodes.map(
      (n) => `- ${n.label} (${n.type})` 
    );

    const connectionLines = arrows
      .map((a) => a.explanationTitle) // "Connection: X ➜ Y" already stored by the whiteboard component
      .filter((title): title is string => Boolean(title));

    return [
      "Components on whiteboard:",
      ...nodeLines,
      connectionLines.length > 0 ? "\nConnections:" : "",
      ...connectionLines,
    ]
      .filter(Boolean)
      .join("\n");
  }
}
