import { Interview, MessageRole } from "@prisma/client";

import { InterviewProfile } from "@/features/interview/data/profiles/InterviewProfile";
import { InterviewAggregate } from "@/features/interview/domain/InterviewAggregate";

/**
 * SessionContext
 * 
 * A single object containing all data needed for an interview session.
 * Built at the entry point to eliminate redundant DB queries and internal service hops.
 * 
 * Data Fetching Strategy:
 * - Request Path: Fetch Interview + RecentTranscript (last 10 messages)
 * - Background Path: Workers fetch FullTranscript only when full summary refresh is required
 */
export class SessionContext {
  private _interviewAggregate: InterviewAggregate;
  private _profile: InterviewProfile;
  private _user: {
    id: string;
    email: string;
  };
  private _problem: {
    id: string;
    title: string;
    description: string | null;
  };
  private _recentTranscript: Array<{
    role: MessageRole;
    content: string;
  }>;
  private _fullTranscript: Array<{
    role: MessageRole;
    content: string;
  }> | null = null;

  constructor(params: SessionContextParams) {
    this._interviewAggregate = params.interviewAggregate;
    this._profile = params.profile;
    this._user = params.user;
    this._problem = params.problem;
    this._recentTranscript = params.recentTranscript;
  }

  /**
   * Create SessionContext for request path (minimal data)
   * Fetches only Interview + RecentTranscript (last 10 messages)
   */
  static async forRequest(params: {
    interviewId: string;
    repository: any;
    profileService: any;
  }): Promise<SessionContext> {
    const { interviewId, repository, profileService } = params;

    // Fetch interview with recent transcript (last 10 messages)
    const interview = await repository.getByIdWithRecentTranscript(interviewId, 10);
    
    if (!interview) {
      throw new Error("Interview not found");
    }

    // Fetch profile
    const profile = await profileService.resolveByTemplateId(interview.template.id);

    // Build recent transcript
    const recentTranscript = interview.transcript
      .slice(-10)
      .map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      }));

    // Create aggregate
    const aggregate = new InterviewAggregate({
      id: interview.id,
      userId: interview.userId,
      templateId: interview.templateId,
      problemId: interview.problemId,
      status: interview.status,
      currentPhase: interview.currentPhase,
      phaseStartedAt: interview.phaseStartedAt || interview.startedAt,
      startedAt: interview.startedAt || interview.createdAt,
      completedAt: interview.completedAt,
      duration: interview.duration,
      mode: interview.mode,
      candidatePersona: interview.candidatePersona,
      summary: interview.summary,
      summaryVersion: interview.summaryVersion || 0,
      transcript: interview.transcript,
      metadata: interview.metadata || {},
      whiteboardDescription: interview.whiteboardDescription,
    });

    return new SessionContext({
      interviewAggregate: aggregate,
      profile,
      user: {
        id: interview.user.id,
        email: interview.user.email,
      },
      problem: {
        id: interview.problem.id,
        title: interview.problem.title,
        description: interview.problem.description,
      },
      recentTranscript,
    });
  }

  /**
   * Create SessionContext for background workers (full data)
   * Fetches Interview + FullTranscript when needed
   */
  static async forBackground(params: {
    interviewId: string;
    repository: any;
    profileService: any;
  }): Promise<SessionContext> {
    const { interviewId, repository, profileService } = params;

    // Fetch interview with full transcript
    const interview = await repository.getById(interviewId);
    
    if (!interview) {
      throw new Error("Interview not found");
    }

    // Fetch profile
    const profile = await profileService.resolveByTemplateId(interview.template.id);

    // Build full transcript
    const fullTranscript = interview.transcript.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Create aggregate
    const aggregate = new InterviewAggregate({
      id: interview.id,
      userId: interview.userId,
      templateId: interview.templateId,
      problemId: interview.problemId,
      status: interview.status,
      currentPhase: interview.currentPhase,
      phaseStartedAt: interview.phaseStartedAt || interview.startedAt,
      startedAt: interview.startedAt || interview.createdAt,
      completedAt: interview.completedAt,
      duration: interview.duration,
      mode: interview.mode,
      candidatePersona: interview.candidatePersona,
      summary: interview.summary,
      summaryVersion: interview.summaryVersion || 0,
      transcript: interview.transcript,
      metadata: interview.metadata || {},
      whiteboardDescription: interview.whiteboardDescription,
    });

    const context = new SessionContext({
      interviewAggregate: aggregate,
      profile,
      user: {
        id: interview.user.id,
        email: interview.user.email,
      },
      problem: {
        id: interview.problem.id,
        title: interview.problem.title,
        description: interview.problem.description,
      },
      recentTranscript: fullTranscript.slice(-10),
    });

    context._fullTranscript = fullTranscript;

    return context;
  }

  /**
   * Get full transcript (lazy-loaded)
   * Only fetches if not already loaded
   */
  async getFullTranscript(repository: any): Promise<Array<{
    role: MessageRole;
    content: string;
  }> | null> {
    if (this._fullTranscript) {
      return this._fullTranscript;
    }

    // Lazy load full transcript
    const interview = await repository.getById(this._interviewAggregate.id);
    if (!interview) {
      return null;
    }

    this._fullTranscript = interview.transcript.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }));

    return this._fullTranscript;
  }

  /**
   * Check if full transcript is loaded
   */
  hasFullTranscript(): boolean {
    return this._fullTranscript !== null;
  }

  // Getters
  get interviewAggregate(): InterviewAggregate {
    return this._interviewAggregate;
  }

  get profile(): InterviewProfile {
    return this._profile;
  }

  get user(): { id: string; email: string } {
    return this._user;
  }

  get problem(): { id: string; title: string; description: string | null } {
    return this._problem;
  }

  get recentTranscript(): Array<{
    role: MessageRole;
    content: string;
  }> {
    return this._recentTranscript;
  }

  get interviewId(): string {
    return this._interviewAggregate.id;
  }

  get currentPhase(): string {
    return this._interviewAggregate.currentPhase;
  }

  get summary(): string {
    return this._interviewAggregate.summary;
  }

  get status(): string {
    return this._interviewAggregate.status;
  }
}

/**
 * Parameters for creating a SessionContext
 */
interface SessionContextParams {
  interviewAggregate: InterviewAggregate;
  profile: InterviewProfile;
  user: {
    id: string;
    email: string;
  };
  problem: {
    id: string;
    title: string;
    description: string | null;
  };
  recentTranscript: Array<{
    role: MessageRole;
    content: string;
  }>;
}
