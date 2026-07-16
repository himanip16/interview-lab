export class Finding {
  constructor(
    readonly id: string,
    readonly hypothesis: string,
    readonly evidence: string,
    readonly rootCause: string,
    readonly proposedFix: string,
  ) {}
}