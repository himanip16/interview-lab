// src/modules/bug-hunting/domain/entities/Finding.ts
export type InvestigationArtifactSource = "LOG" | "SQL" | "CODE" | "DOC" | "DEPLOYMENT";

interface FindingProps {
  id: string;
  attemptId: string;
  source: InvestigationArtifactSource;
  refId: string;
  note: string | null;
  createdAt: Date;
}

export class Finding {
  private constructor(private readonly props: FindingProps) {}

  static fromProps(props: FindingProps): Finding {
    return new Finding(props);
  }

  toJSON(): FindingProps {
    return this.props;
  }
}