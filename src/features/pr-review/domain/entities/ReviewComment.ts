// src/features/pr-review/domain/entities/ReviewComment.ts

// src/modules/pr-review/domain/entities/ReviewComment.ts

export interface ReviewCommentProps {
  id: string;
  attemptId: string;
  fileId: string;
  side: string;
  line: number;
  anchorText?: string;
  content: string;
  createdAt: Date;
}

export class ReviewComment {
  constructor(private props: ReviewCommentProps) {}

  static fromProps(props: ReviewCommentProps): ReviewComment {
    return new ReviewComment(props);
  }

  get id(): string {
    return this.props.id;
  }

  get attemptId(): string {
    return this.props.attemptId;
  }

  get fileId(): string {
    return this.props.fileId;
  }

  get side(): string {
    return this.props.side;
  }

  get line(): number {
    return this.props.line;
  }

  get anchorText(): string | undefined {
    return this.props.anchorText;
  }

  get content(): string {
    return this.props.content;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  updateContent(content: string): void {
    this.props.content = content;
  }

  toProps(): ReviewCommentProps {
    return { ...this.props };
  }
}
