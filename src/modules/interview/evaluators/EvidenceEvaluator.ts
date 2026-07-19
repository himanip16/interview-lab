import { z } from "zod";

import { AIService } from "@/modules/ai/services/AIService";
import { ValidatedJSONParser } from "@/modules/ai/utils/ValidatedJSONParser";
import { prisma } from "@/shared/prisma/client";

import { PromptLoader } from "../prompt/PromptLoader";
import {
  EvaluatableInterview,
  EvaluationResult,
} from "./types";

const EvidenceItemSchema = z.object({
  messageId: z.string(),
  quote: z.string().min(1),
  comment: z.string().min(1),
  conceptSlugs: z.array(z.string()).default([]),
  type: z.enum(["strength", "weakness"]),
});

const DimensionScoreSchema = z.object({
  dimension: z.string(),
  score: z.number().min(0).max(10),
  summary: z.string(),
  evidence: z.array(EvidenceItemSchema).max(4).default([]),
});

const EvaluationResponseSchema = z.object({
  dimensionScores: z.array(DimensionScoreSchema).min(1),
  strengths: z.array(z.string()).default([]),
  weaknesses: z.array(z.string()).default([]),
  missedConcepts: z.array(z.string()).default([]),
  riskAssessment: z.array(z.string()).default([]),
  hireRecommendation: z.enum(["STRONG_HIRE", "HIRE", "NO_HIRE", "STRONG_NO_HIRE"]),
  feedback: z.string(),
});

const MAX_QUOTE_WORDS = 20;

// Ollama structured-output schema, matching EvaluationResponseSchema below.
export const EVALUATION_JSON_SCHEMA = {
  type: "object",
  properties: {
    dimensionScores: {
      type: "array",
      items: {
        type: "object",
        properties: {
          dimension: { type: "string" },
          score: { type: "number" },
          summary: { type: "string" },
          evidence: {
            type: "array",
            items: {
              type: "object",
              properties: {
                messageId: { type: "string" },
                quote: { type: "string" },
                comment: { type: "string" },
                conceptSlugs: {
                  type: "array",
                  items: { type: "string" },
                },
                type: { type: "string", enum: ["strength", "weakness"] },
              },
              required: ["messageId", "quote", "comment", "type"],
            },
          },
        },
        required: ["dimension", "score", "summary"],
      },
    },
    strengths: { type: "array", items: { type: "string" } },
    weaknesses: { type: "array", items: { type: "string" } },
    missedConcepts: { type: "array", items: { type: "string" } },
    riskAssessment: { type: "array", items: { type: "string" } },
    hireRecommendation: {
      type: "string",
      enum: ["STRONG_HIRE", "HIRE", "NO_HIRE", "STRONG_NO_HIRE"],
    },
    feedback: { type: "string" },
  },
  required: ["dimensionScores", "hireRecommendation", "feedback"],
} as const;

export class EvidenceEvaluator {
  constructor(
    private readonly ai = new AIService(),
    private readonly promptLoader = new PromptLoader()
  ) {}

  /**
   * Sanity-check the model's hire recommendation against the numeric overall score.
   * If they disagree by more than one tier, trust the score over the free-text recommendation.
   */
  private reconcileHireRecommendation(
    modelRecommendation: string,
    overallScore: number
  ): "STRONG_HIRE" | "HIRE" | "NO_HIRE" | "STRONG_NO_HIRE" {
    const scoreImplied =
      overallScore >= 80 ? "STRONG_HIRE" :
      overallScore >= 60 ? "HIRE" :
      overallScore >= 35 ? "NO_HIRE" :
      "STRONG_NO_HIRE";

    const tiers = ["STRONG_NO_HIRE", "NO_HIRE", "HIRE", "STRONG_HIRE"] as const;
    const modelIdx = tiers.indexOf(modelRecommendation as any);
    const scoreIdx = tiers.indexOf(scoreImplied);

    // If model and score disagree by more than one tier, trust the score
    if (Math.abs(modelIdx - scoreIdx) > 1) {
      return scoreImplied;
    }

    return modelRecommendation as "STRONG_HIRE" | "HIRE" | "NO_HIRE" | "STRONG_NO_HIRE";
  }

  async evaluate(
    interview: EvaluatableInterview
  ): Promise<EvaluationResult> {
    const startedAt =
      interview.startedAt ?? interview.createdAt;

    const dimensions = this.collectDimensions(interview, interview.mode);

    const rubricSection = await this.buildRubricSection(
      interview.template.id,
      dimensions
    );

    // Closed vocabulary for concept tagging — same grounding pattern as
    // quotes below: anything the model returns outside this set is dropped,
    // never trusted or auto-created.
    const conceptVocabulary = await prisma.concept.findMany({
      select: { slug: true, name: true, category: true },
    });

    const knownConceptSlugs = new Set(
      conceptVocabulary.map((c) => c.slug)
    );

    const conceptSection = conceptVocabulary
      .map((c) => `- ${c.slug} (${c.category}): ${c.name}`)
      .join("\n");

    const transcriptById = new Map(
      interview.transcript.map((message) => [
        message.id,
        message,
      ])
    );

    const transcriptSection = interview.transcript
      .map((message) => {
        const elapsed = message.elapsedSeconds ?? 0;

        return `[id=${message.id}] [t=${elapsed}s] ${message.role.toUpperCase()}: ${message.content}`;
      })
      .join("\n\n");

    const prompt = this.buildPrompt(
      interview.template.name,
      dimensions,
      rubricSection,
      conceptSection,
      transcriptSection,
      interview.mode
    );

    const raw = await this.ai.chat(
  [
    {
      role: "system",
      content:
        "You are a rigorous, evidence-driven technical interview evaluator.",
    },
    { role: "user", content: prompt },
  ],
  {
    task: "evaluation",
    format: EVALUATION_JSON_SCHEMA,
  }
);

const parsed = await ValidatedJSONParser.parse(
  raw,
  EvaluationResponseSchema,
  () =>
    this.ai.chat(
      [
        {
          role: "system",
          content:
            "Repair the response into valid JSON matching the requested schema. Return ONLY JSON.",
        },
        { role: "user", content: raw },
      ],
      {
        task: "repair",
        format: EVALUATION_JSON_SCHEMA,
      }
    )
);

    const dimensionScores = parsed.dimensionScores.map(
      (dimension) => {
        // First, filter evidence items that point to non-existent messages
        const validMessageEvidence = dimension.evidence.filter((item) => {
          const message = transcriptById.get(item.messageId);
          return message !== undefined;
        });

        // Then, filter evidence items with grounded quotes
        const groundedEvidence = validMessageEvidence.filter((item) => {
          const message = transcriptById.get(item.messageId)!;
          return this.isQuoteGroundedInMessage(
            item.quote,
            message.content
          );
        });

        // If we have at least one grounded evidence item, use it
        // Otherwise, use the best available evidence (most grounded) to avoid false negatives
        const evidenceToUse = groundedEvidence.length > 0
          ? groundedEvidence
          : validMessageEvidence.length > 0
            ? this.selectBestEvidence(validMessageEvidence, transcriptById)
            : [];

        return {
          dimension: dimension.dimension,
          score: dimension.score,
          summary: dimension.summary,
          evidence: evidenceToUse.map((item) => {
            const message = transcriptById.get(item.messageId)!;

            const timestampSeconds = message.elapsedSeconds ?? 0;

            return {
              messageId: item.messageId,
              timestampSeconds,
              quote: this.capWords(
                item.quote,
                MAX_QUOTE_WORDS
              ),
              comment: item.comment,
              type: item.type,
              // Ground concepts against the known vocabulary — never trust
              // a slug the model invented.
              conceptSlugs: item.conceptSlugs.filter((slug) =>
                knownConceptSlugs.has(slug)
              ),
            };
          }),
        };
      }
    );

    const overallScore = Math.round(
      (dimensionScores.reduce(
        (sum, d) => sum + d.score,
        0
      ) /
        Math.max(dimensionScores.length, 1)) *
        10
    );

    const reconciledRecommendation = this.reconcileHireRecommendation(
      parsed.hireRecommendation,
      overallScore
    );

    return {
      overallScore,
      dimensionScores,
      strengths: parsed.strengths,
      weaknesses: parsed.weaknesses,
      missedConcepts: parsed.missedConcepts,
      riskAssessment: parsed.riskAssessment,
      hireRecommendation: reconciledRecommendation,
      feedback: parsed.feedback,
    };
  }

  private collectDimensions(
    interview: EvaluatableInterview,
    mode: "CANDIDATE" | "REVERSE"
  ): string[] {
    const set = new Set<string>();

    for (const phase of interview.template.phases) {
      const dims = (mode === "REVERSE" ? phase.reverseEvaluationDimensions : phase.evaluationDimensions) as string[];

      for (const dim of dims ?? []) {
        set.add(dim);
      }
    }

    return [...set];
  }

  private async buildRubricSection(
    templateId: string,
    dimensions: string[]
  ): Promise<string> {
    const entries = await Promise.all(
      dimensions.map(async (dimension) => {
        const content =
          await this.promptLoader.loadRubricForDimension(
            templateId,
            dimension
          );

        return `### ${dimension}\n${content}`;
      })
    );

    return entries.join("\n\n");
  }

  private buildPrompt(
    templateName: string,
    dimensions: string[],
    rubricSection: string,
    conceptSection: string,
    transcriptSection: string,
    mode: "CANDIDATE" | "REVERSE"
  ): string {
    const target = mode === "REVERSE" ? "INTERVIEWER's (the human's)" : "candidate's";

    return `
You are evaluating ${target} performance in a "${templateName}" technical interview.

Score the ${mode === "REVERSE" ? "interviewer" : "candidate"} on EXACTLY these dimensions, no others:
${dimensions.map((d) => `- ${d}`).join("\n")}

RUBRICS (use these to decide scores):

${rubricSection}

CONCEPT VOCABULARY (use ONLY these slugs when tagging evidence with concepts; if none apply, return an empty array):

${conceptSection}

TRANSCRIPT (each line is tagged with a message id and elapsed seconds since interview start):

${transcriptSection}

For each dimension, provide:
- score: 0-10
- summary: one sentence justifying the score
- evidence: 1-3 items, each with:
  - messageId: the EXACT [id=...] value of a transcript line that supports this score
  - quote: a short quote (${MAX_QUOTE_WORDS} words or fewer) copied VERBATIM from that exact message's content. DO NOT correct spelling, grammar, or punctuation. DO NOT add or remove words. If you cannot find an exact quote, return null for this evidence item.
  - comment: why this quote matters for this dimension
  - conceptSlugs: 0-3 slugs from the CONCEPT VOCABULARY that this specific quote demonstrates
  - type: "strength" if this quote demonstrates competence, "weakness" if it demonstrates a gap

Additionally return:
- missedConcepts: important concepts for this problem that the ${mode === "REVERSE" ? "interviewer" : "candidate"} never addressed (free text, 0-5 items)
- riskAssessment: concrete concerns an interviewer should flag before making a hire decision (0-4 items, empty array if none)
- hireRecommendation: one of STRONG_HIRE, HIRE, NO_HIRE, STRONG_NO_HIRE — based on overall dimension scores and severity of weaknesses

Rules:
- Only cite messages with role USER (the human). Never cite AI lines as evidence.
- Every quote must be copied exactly from the cited message. Do not paraphrase and call it a quote.
- Only use conceptSlugs from the CONCEPT VOCABULARY above. Never invent a slug.
- If a dimension has weak or no supporting evidence in the transcript, say so in the summary and score it low — do not invent evidence.
- For hireRecommendation: be grounded in the numeric scores. STRONG_HIRE requires consistently high scores (8+), NO_HIRE requires consistently low scores (3-), and consider the severity of weaknesses.

Return ONLY valid JSON with this exact shape:

{
  "dimensionScores": [
    {
      "dimension": "string",
      "score": 0,
      "summary": "string",
      "evidence": [
        { "messageId": "string", "quote": "string", "comment": "string", "conceptSlugs": ["string"], "type": "strength" }
      ]
    }
  ],
  "strengths": ["string"],
  "weaknesses": ["string"],
  "missedConcepts": ["string"],
  "riskAssessment": ["string"],
  "hireRecommendation": "STRONG_HIRE",
  "feedback": "2-4 sentence overall narrative feedback"
}

Return JSON only. No markdown, no commentary outside the JSON.
`.trim();
  }

  /**
   * Calculate grounding score for a quote (0-1) for fallback selection
   */
  private calculateGroundingScore(quote: string, messageContent: string): number {
    const normalize = (text: string) => {
      return text
        .toLowerCase()
        .replace(/[.,!?;:'"()\-–—]/g, "")
        .replace(/[…‥]/g, "")
        .replace(/\b(um|uh|like|you know|basically|actually)\b/g, "")
        .replace(/[\s\n\r\t]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    };

    const normalizedQuote = normalize(quote);
    const normalizedMessage = normalize(messageContent);

    if (normalizedMessage.includes(normalizedQuote)) {
      return 1.0;
    }

    const quoteWords = normalizedQuote.split(" ").filter(w => w.length > 0);
    const messageWords = normalizedMessage.split(" ").filter(w => w.length > 0);

    if (quoteWords.length === 0) {
      return 0;
    }

    let maxMatchCount = 0;
    for (let i = 0; i <= messageWords.length - quoteWords.length; i++) {
      let matchCount = 0;
      for (let j = 0; j < quoteWords.length; j++) {
        if (messageWords[i + j] === quoteWords[j]) {
          matchCount++;
        }
      }
      if (matchCount > maxMatchCount) {
        maxMatchCount = matchCount;
      }
    }

    return maxMatchCount / quoteWords.length;
  }

  /**
   * Select the best evidence item when no perfectly grounded evidence is found
   */
  private selectBestEvidence(
    evidenceItems: Array<any>,
    transcriptById: Map<string, any>
  ): Array<any> {
    if (evidenceItems.length === 0) {
      return [];
    }

    // Score each evidence item by grounding quality
    const scoredItems = evidenceItems.map((item) => {
      const message = transcriptById.get(item.messageId);
      if (!message) {
        return { item, score: 0 };
      }
      const score = this.calculateGroundingScore(item.quote, message.content);
      return { item, score };
    });

    // Sort by score descending and take the best one
    scoredItems.sort((a, b) => b.score - a.score);

    // Only return if the best score is above a minimum threshold (50%)
    const bestScore = scoredItems[0]?.score ?? 0;
    if (bestScore >= 0.5) {
      return [scoredItems[0].item];
    }

    return [];
  }

  private isQuoteGroundedInMessage(
    quote: string,
    messageContent: string
  ): boolean {
    // Aggressive normalization for comparison
    const normalize = (text: string) => {
      return text
        .toLowerCase()
        // Remove all punctuation
        .replace(/[.,!?;:'"()\-–—]/g, "")
        // Handle Unicode ellipsis and common variations
        .replace(/[…‥]/g, "")
        // Remove common filler words that LLMs might add/remove
        .replace(/\b(um|uh|like|you know|basically|actually)\b/g, "")
        // Normalize whitespace (including newlines and tabs)
        .replace(/[\s\n\r\t]+/g, " ")
        // Remove extra spaces
        .replace(/\s+/g, " ")
        .trim();
    };

    const normalizedQuote = normalize(quote);
    const normalizedMessage = normalize(messageContent);

    // Direct inclusion check after aggressive normalization
    if (normalizedMessage.includes(normalizedQuote)) {
      return true;
    }

    // Token-based fuzzy matching with 90-95% threshold
    const quoteWords = normalizedQuote.split(" ").filter(w => w.length > 0);
    const messageWords = normalizedMessage.split(" ").filter(w => w.length > 0);

    if (quoteWords.length === 0) {
      return false;
    }

    // Calculate similarity using token overlap and sequence matching
    let maxMatchCount = 0;
    let bestMatchIndex = 0;

    // Try to find the best matching subsequence in the message
    for (let i = 0; i <= messageWords.length - quoteWords.length; i++) {
      let matchCount = 0;
      for (let j = 0; j < quoteWords.length; j++) {
        if (messageWords[i + j] === quoteWords[j]) {
          matchCount++;
        }
      }
      if (matchCount > maxMatchCount) {
        maxMatchCount = matchCount;
        bestMatchIndex = i;
      }
    }

    // Calculate match ratio
    const matchRatio = maxMatchCount / quoteWords.length;

    // 90-95% threshold for fuzzy matching
    const FUZZY_THRESHOLD = 0.90;

    // Also check for high token overlap even if sequence doesn't match perfectly
    const quoteWordSet = new Set(quoteWords);
    const messageWordSet = new Set(messageWords);
    const intersection = new Set([...quoteWordSet].filter(x => messageWordSet.has(x)));
    const overlapRatio = intersection.size / quoteWordSet.size;

    // Accept if either sequence match or overlap meets threshold
    return matchRatio >= FUZZY_THRESHOLD || overlapRatio >= FUZZY_THRESHOLD;
  }

  private capWords(text: string, maxWords: number): string {
    const words = text.trim().split(/\s+/);

    if (words.length <= maxWords) {
      return text.trim();
    }

    return words.slice(0, maxWords).join(" ");
  }
}