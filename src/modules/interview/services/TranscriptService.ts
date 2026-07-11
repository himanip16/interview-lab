import { MessageRepository } from "../repositories/MessageRepository";

export class TranscriptService {
  private repository =
    new MessageRepository();

  async addUserMessage(
    interviewId: string,
    message: string
  ) {
    return this.repository.create(
      interviewId,
      "user",
      message
    );
  }

  async addAssistantMessage(
    interviewId: string,
    message: string
  ) {
    return this.repository.create(
      interviewId,
      "assistant",
      message
    );
  }

  async getTranscript(
    interviewId: string
  ) {
    return this.repository.list(
      interviewId
    );
  }
}