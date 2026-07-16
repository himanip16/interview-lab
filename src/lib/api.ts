/**
 * Unified API client — wraps fetch with typed request/response shapes so
 * components never construct raw fetch('/api/...') calls with string paths
 * that can typo silently.
 *
 * Usage:
 *   import { api } from "@/lib/api";
 *   const interview = await api.interviews.get(id);
 *   await api.interviews.sendMessage(id, { content: "..." });
 *
 * NOTE: The request/response shapes below are inferred from the route file
 * layout under src/app/api/**. I don't have the actual route handler bodies,
 * so field names in each Request/Response type are best-effort placeholders —
 * swap them for your real DTOs (ideally imported from wherever your route
 * handlers already define/validate them with zod) rather than trusting these
 * verbatim.
 */

class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  signal?: AbortSignal;
}

async function request<TResponse>(
  path: string,
  method: HttpMethod,
  body?: unknown,
  options?: RequestOptions
): Promise<TResponse> {
  const res = await fetch(path, {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal: options?.signal,
  });

  const contentType = res.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && "message" in data && typeof (data as any).message === "string"
        ? (data as any).message
        : `Request failed: ${method} ${path} (${res.status})`);
    throw new ApiError(message, res.status, data);
  }

  return data as TResponse;
}

function get<TResponse>(path: string, options?: RequestOptions) {
  return request<TResponse>(path, "GET", undefined, options);
}
function post<TResponse>(path: string, body?: unknown, options?: RequestOptions) {
  return request<TResponse>(path, "POST", body, options);
}
function put<TResponse>(path: string, body?: unknown, options?: RequestOptions) {
  return request<TResponse>(path, "PUT", body, options);
}
function patch<TResponse>(path: string, body?: unknown, options?: RequestOptions) {
  return request<TResponse>(path, "PATCH", body, options);
}
function del<TResponse>(path: string, options?: RequestOptions) {
  return request<TResponse>(path, "DELETE", undefined, options);
}

// ---------------------------------------------------------------------------
// Shared/placeholder types — replace with real DTOs once available.
// ---------------------------------------------------------------------------

export interface Interview {
  id: string;
  status: string;
  [key: string]: unknown;
}

export interface InterviewMessage {
  id: string;
  role: string;
  content: string;
  [key: string]: unknown;
}

export interface Problem {
  id: string;
  slug: string;
  title: string;
  [key: string]: unknown;
}

export interface BugScenario {
  id: string;
  slug: string;
  [key: string]: unknown;
}

export interface LearningScenario {
  slug: string;
  title: string;
  [key: string]: unknown;
}

export interface Transcript {
  slug: string;
  title: string;
  [key: string]: unknown;
}

export interface Company {
  id: string;
  name: string;
  [key: string]: unknown;
}

export interface Recommendation {
  id: string;
  [key: string]: unknown;
}

export interface SkillGraph {
  nodes: unknown[];
  edges: unknown[];
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Endpoint groups — mirrors src/app/api/** route layout 1:1
// ---------------------------------------------------------------------------

export const api = {
  interviews: {
    list: (options?: RequestOptions) => get<Interview[]>("/api/interviews", options),

    start: (body: { problemId: string; [key: string]: unknown }, options?: RequestOptions) =>
      post<Interview>("/api/interviews/start", body, options),

    status: (options?: RequestOptions) => get<{ status: string }>("/api/interviews/status", options),

    get: (id: string, options?: RequestOptions) =>
      get<Interview>(`/api/interviews/${id}`, options),

    sendMessage: (id: string, body: { content: string }, options?: RequestOptions) =>
      post<InterviewMessage>(`/api/interviews/${id}/message`, body, options),

    finish: (id: string, options?: RequestOptions) =>
      post<Interview>(`/api/interviews/${id}/finish`, undefined, options),

    updateWhiteboard: (id: string, body: { state: unknown }, options?: RequestOptions) =>
      put<{ state: unknown }>(`/api/interviews/${id}/whiteboard`, body, options),
  },

  interviewTemplates: {
    list: (options?: RequestOptions) => get<unknown[]>("/api/interview-templates", options),
  },

  problems: {
    list: (options?: RequestOptions) => get<Problem[]>("/api/problems", options),

    history: (id: string, options?: RequestOptions) =>
      get<unknown[]>(`/api/problems/${id}/history`, options),
  },

  bugHunting: {
    submitHypothesis: (
      body: { scenarioId: string; hypothesis: string; [key: string]: unknown },
      options?: RequestOptions
    ) => post<{ correct: boolean; feedback: string }>("/api/bug-hunting/hypothesis", body, options),
  },

  learningActions: {
    attempt: (
      id: string,
      body: { response: unknown; [key: string]: unknown },
      options?: RequestOptions
    ) => post<{ correct: boolean; feedback?: string }>(`/api/learning-actions/${id}/attempt`, body, options),
  },

  learningScenarios: {
    list: (options?: RequestOptions) => get<LearningScenario[]>("/api/learning-scenarios", options),

    get: (slug: string, options?: RequestOptions) =>
      get<LearningScenario>(`/api/learning-scenarios/${slug}`, options),
  },

  transcripts: {
    list: (options?: RequestOptions) => get<Transcript[]>("/api/transcripts", options),

    get: (slug: string, options?: RequestOptions) =>
      get<Transcript>(`/api/transcripts/${slug}`, options),
  },

  companies: {
    list: (options?: RequestOptions) => get<Company[]>("/api/companies", options),
  },

  judge: {
    evaluate: (body: { [key: string]: unknown }, options?: RequestOptions) =>
      post<{ score: number; feedback: string }>("/api/judge", body, options),
  },

  recommendations: {
    list: (options?: RequestOptions) => get<Recommendation[]>("/api/recommendations", options),
  },

  users: {
    recommendations: (id: string, options?: RequestOptions) =>
      get<Recommendation[]>(`/api/users/${id}/recommendations`, options),

    skillGraph: (id: string, options?: RequestOptions) =>
      get<SkillGraph>(`/api/users/${id}/skill-graph`, options),
  },

  auth: {
    register: (
      body: { email: string; password: string; [key: string]: unknown },
      options?: RequestOptions
    ) => post<{ id: string; email: string }>("/api/auth/register", body, options),

    session: (options?: RequestOptions) => get<{ user: unknown | null }>("/api/auth/session", options),

    signOut: (options?: RequestOptions) => post<void>("/api/auth/signout", undefined, options),
  },
};

export { ApiError };