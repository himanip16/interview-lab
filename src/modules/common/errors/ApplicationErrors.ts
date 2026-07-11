// src/modules/common/errors/ApplicationErrors.ts

export class ApplicationError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class AIProviderError extends ApplicationError {}

export class PromptLoadError extends ApplicationError {}

export class ValidationError extends ApplicationError {}

export class InterviewStateError extends ApplicationError {}

export class PersistenceError extends ApplicationError {}