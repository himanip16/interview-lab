// src/features/pr-review/services/FindingMatcher.ts

// src/modules/pr-review/services/FindingMatcher.ts
import { ReviewComment } from "../domain/entities/ReviewComment";
import type { Finding } from "./ScenarioLoader";

export class FindingMatcher {
  /**
   * Matches a user comment against an expected finding using fuzzy matching.
   * 
   * The matching algorithm considers:
   * 1. File match - must be the same file
   * 2. Proximity check - allows +/- 3 lines tolerance
   * 3. Keyword/semantic match - checks if comment contains expected keywords
   * 
   * @param comment - The user's comment
   * @param finding - The expected finding from the rubric
   * @returns true if the comment matches the finding
   */
  match(comment: ReviewComment, finding: Finding): boolean {
    // 1. Check File Match
    if (comment.fileId !== finding.fileId) return false;

    // 2. Proximity Check (Allow +/- 3 lines)
    const isNear = Math.abs(comment.line - finding.line) <= 3;
    if (!isNear) return false;

    // 3. Keyword/Semantic Match
    const hasKeywords = finding.keywords.some(k => 
      comment.content.toLowerCase().includes(k.toLowerCase())
    );

    return hasKeywords;
  }

  /**
   * Finds the best matching finding for a given comment.
   * 
   * @param comment - The user's comment
   * @param findings - All expected findings from the rubric
   * @returns The matched finding or null if no match found
   */
  findBestMatch(comment: ReviewComment, findings: Finding[]): Finding | null {
    const matches = findings.filter(finding => this.match(comment, finding));
    
    if (matches.length === 0) return null;
    
    // Return the first match (could be enhanced to return the "best" match)
    return matches[0];
  }

  /**
   * Matches all comments against the rubric findings.
   * 
   * @param comments - All user comments
   * @param findings - All expected findings from the rubric
   * @returns Object containing matched and unmatched findings
   */
  matchAll(comments: ReviewComment[], findings: Finding[]): {
    matched: Map<ReviewComment, Finding>;
    unmatchedFindings: Finding[];
    unmatchedComments: ReviewComment[];
  } {
    const matched = new Map<ReviewComment, Finding>();
    const unmatchedFindings = [...findings];
    const unmatchedComments: ReviewComment[] = [];

    for (const comment of comments) {
      const match = this.findBestMatch(comment, unmatchedFindings);
      if (match) {
        matched.set(comment, match);
        // Remove the matched finding from unmatched list
        const index = unmatchedFindings.indexOf(match);
        if (index > -1) {
          unmatchedFindings.splice(index, 1);
        }
      } else {
        unmatchedComments.push(comment);
      }
    }

    return { matched, unmatchedFindings, unmatchedComments };
  }
}
