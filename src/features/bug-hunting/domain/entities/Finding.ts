// src/modules/bug-hunting/domain/entities/Finding.ts
import { InvestigationArtifactSource } from "@prisma/client";

export interface FindingProps {
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