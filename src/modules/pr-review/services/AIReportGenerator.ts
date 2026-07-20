// src/modules/pr-review/services/AIReportGenerator.ts
import * as fs from 'fs';
import * as path from 'path';
import type { Finding } from "./ScenarioLoader";
import type { EvaluationResult } from "./ReviewEvaluationService";

export interface AIReportData {
  summary: string;
  strengths: string[];
  communication: string;
  recommendations: string[];
}

export class AIReportGenerator {
  private promptTemplate: string;

  constructor() {
    this.promptTemplate = this.loadPromptTemplate();
  }

  private loadPromptTemplate(): string {
    const promptPath = path.join(__dirname, '../prompts/grading.md');
    if (fs.existsSync(promptPath)) {
      return fs.readFileSync(promptPath, 'utf-8');
    }
    // Fallback template if file doesn't exist
    return this.getDefaultPromptTemplate();
  }

  private getDefaultPromptTemplate(): string {
    return `You are a Staff Engineer grading a code review.

The user scored {{score}} based on deterministic checks.
They matched these findings: {{matchedFindings}}
They missed these findings: {{missedFindings}}

Return a JSON object with this exact structure:
{
  "summary": "High level overview of their review quality (2-3 sentences)",
  "strengths": ["Point 1", "Point 2", "Point 3"],
  "communication": "Feedback on their tone and clarity",
  "recommendations": ["How to improve their senior-level perspective"]
}`;
  }

  /**
   * Generates the AI prompt for grading.
   */
  generatePrompt(evaluationResult: EvaluationResult): string {
    const { overallScore, matchedFindings, missedFindings } = evaluationResult;

    const matchedSummary = matchedFindings.map(f => 
      `- ${f.category}: ${f.description} (${f.points} pts)`
    ).join('\n');

    const missedSummary = missedFindings.map(f => 
      `- ${f.category}: ${f.description} (${f.points} pts)`
    ).join('\n');

    return this.promptTemplate
      .replace('{{score}}', overallScore.toString())
      .replace('{{matchedFindings}}', matchedSummary || 'None')
      .replace('{{missedFindings}}', missedSummary || 'None');
  }

  /**
   * Parses the AI response into structured data.
   * In a real implementation, this would call an AI service like OpenAI.
   */
  parseAIResponse(aiResponse: string): AIReportData {
    try {
      const parsed = JSON.parse(aiResponse);
      return {
        summary: parsed.summary || '',
        strengths: parsed.strengths || [],
        communication: parsed.communication || '',
        recommendations: parsed.recommendations || [],
      };
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return this.getDefaultReport();
    }
  }

  /**
   * Generates a default report when AI is unavailable.
   */
  getDefaultReport(): AIReportData {
    return {
      summary: 'Code review completed. AI feedback unavailable.',
      strengths: [],
      communication: '',
      recommendations: [],
    };
  }

  /**
   * In a real implementation, this would call the AI service.
   * For now, it returns a mock response based on the evaluation.
   */
  async generateReport(evaluationResult: EvaluationResult): Promise<AIReportData> {
    const prompt = this.generatePrompt(evaluationResult);
    
    // TODO: Integrate with actual AI service (OpenAI, etc.)
    // For now, return a structured response based on the evaluation
    return this.generateMockReport(evaluationResult);
  }

  /**
   * Generates a mock report based on evaluation results.
   */
  private generateMockReport(evaluationResult: EvaluationResult): AIReportData {
    const { overallScore, matchedFindings, missedFindings } = evaluationResult;

    const strengths: string[] = [];
    const recommendations: string[] = [];

    if (overallScore >= 80) {
      strengths.push('Strong technical analysis with good coverage of key issues');
      strengths.push('Clear and actionable feedback');
    } else if (overallScore >= 50) {
      strengths.push('Identified some important issues');
      recommendations.push('Look for edge cases and potential performance implications');
    } else {
      recommendations.push('Focus on fundamental correctness and security issues');
      recommendations.push('Consider the broader impact of code changes');
    }

    if (missedFindings.some(f => f.category === 'ACCESSIBILITY')) {
      recommendations.push('Pay attention to accessibility concerns in UI changes');
    }

    if (missedFindings.some(f => f.category === 'PERFORMANCE')) {
      recommendations.push('Consider performance implications of state management');
    }

    const summary = overallScore >= 70 
      ? 'Good code review with solid technical understanding. Continue to develop senior-level perspective by considering broader system implications.'
      : 'Code review shows basic understanding but misses several important findings. Focus on deepening technical analysis and considering edge cases.';

    return {
      summary,
      strengths,
      communication: overallScore >= 60 ? 'Clear and professional communication style.' : 'Work on providing more specific and actionable feedback.',
      recommendations,
    };
  }
}
