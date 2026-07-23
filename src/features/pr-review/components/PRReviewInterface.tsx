// src/features/pr-review/components/PRReviewInterface.tsx

// src/components/pr-review/PRReviewInterface.tsx
"use client";

import { useState, useEffect } from 'react';

interface ReviewAttempt {
  id: string;
  userId: string;
  scenarioId: string;
  status: 'CREATED' | 'IN_PROGRESS' | 'EVALUATING' | 'COMPLETED' | 'FAILED';
  decision?: 'APPROVE' | 'REQUEST_CHANGES' | 'REJECT';
  startedAt: string;
  completedAt?: string;
}

interface ReviewComment {
  id: string;
  attemptId: string;
  fileId: string;
  side: string;
  line: number;
  anchorText?: string;
  content: string;
  createdAt: string;
}

interface ReviewScenario {
  metadata: {
    id: string;
    title: string;
    difficulty: string;
    author?: string;
    description: string;
  };
  pullRequest: {
    title: string;
    description: string;
    branch: string;
    baseBranch: string;
    files: Array<{
      fileId: string;
      filename: string;
      diffHunks: Array<{
        oldStart: number;
        oldLines: number;
        newStart: number;
        newLines: number;
        content: string;
      }>;
    }>;
  };
}

export function PRReviewInterface({ scenarioId }: { scenarioId: string }) {
  const [attempt, setAttempt] = useState<ReviewAttempt | null>(null);
  const [scenario, setScenario] = useState<ReviewScenario | null>(null);
  const [comments, setComments] = useState<ReviewComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadScenario();
  }, [scenarioId]);

  const loadScenario = async () => {
    try {
      setLoading(true);
      // Start or resume attempt
      const attemptRes = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioId }),
      });
      if (!attemptRes.ok) throw new Error('Failed to start attempt');
      const attemptData = await attemptRes.json();
      setAttempt(attemptData);

      // Load scenario data
      const scenarioRes = await fetch(`/api/reviews/${attemptData.id}/scenario`);
      if (scenarioRes.ok) {
        const scenarioData = await scenarioRes.json();
        setScenario(scenarioData);
      }

      // Load comments
      await loadComments(attemptData.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load scenario');
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async (attemptId: string) => {
    try {
      const res = await fetch(`/api/reviews/${attemptId}/comments`);
      if (res.ok) {
        const commentsData = await res.json();
        setComments(commentsData);
      }
    } catch (err) {
      console.error('Failed to load comments:', err);
    }
  };

  const addComment = async (fileId: string, side: string, line: number, content: string, anchorText?: string) => {
    if (!attempt) return;
    
    try {
      const res = await fetch(`/api/reviews/${attempt.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId, side, line, content, anchorText }),
      });
      if (res.ok) {
        const newComment = await res.json();
        setComments([...comments, newComment]);
      }
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const submitReview = async (decision: 'APPROVE' | 'REQUEST_CHANGES' | 'REJECT') => {
    if (!attempt) return;
    
    try {
      const res = await fetch(`/api/reviews/${attempt.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision }),
      });
      if (res.ok) {
        const updatedAttempt = await res.json();
        setAttempt(updatedAttempt);
        
        // Trigger evaluation
        await evaluateAttempt();
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
    }
  };

  const evaluateAttempt = async () => {
    if (!attempt) return;
    
    try {
      const res = await fetch(`/api/reviews/${attempt.id}/evaluate`, {
        method: 'POST',
      });
      if (res.ok) {
        const report = await res.json();
        console.log('Evaluation report:', report);
        // You could show the report in a modal or redirect to a results page
      }
    } catch (err) {
      console.error('Failed to evaluate attempt:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!attempt || !scenario) return <div>No attempt or scenario data</div>;

  return (
    <div className="pr-review-interface">
      <div className="header">
        <h1>{scenario.metadata.title}</h1>
        <p>{scenario.metadata.description}</p>
        <div className="status">
          Status: {attempt.status} | Decision: {attempt.decision || 'None'}
        </div>
      </div>

      <div className="content">
        <div className="pr-info">
          <h2>{scenario.pullRequest.title}</h2>
          <p>{scenario.pullRequest.description}</p>
          <div className="branches">
            <span className="branch">{scenario.pullRequest.branch}</span>
            <span>→</span>
            <span className="branch">{scenario.pullRequest.baseBranch}</span>
          </div>
        </div>

        <div className="files">
          {scenario.pullRequest.files.map((file) => (
            <div key={file.fileId} className="file">
              <h3>{file.filename}</h3>
              <div className="diff">
                {file.diffHunks.map((hunk, idx) => (
                  <div key={idx} className="diff-hunk">
                    <pre>{hunk.content}</pre>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="comments-section">
          <h3>Comments ({comments.length})</h3>
          {comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <span className="file">{comment.fileId}</span>
                <span className="line">Line {comment.line}</span>
              </div>
              <div className="comment-content">{comment.content}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="decision-bar">
        <div className="status-text">
          {attempt.status === 'COMPLETED' 
            ? 'Review completed and evaluated' 
            : 'Leave comments before making a decision'}
        </div>
        <div className="decision-buttons">
          <button 
            onClick={() => submitReview('REJECT')}
            disabled={attempt.status !== 'IN_PROGRESS'}
            className="btn reject"
          >
            Reject
          </button>
          <button 
            onClick={() => submitReview('REQUEST_CHANGES')}
            disabled={attempt.status !== 'IN_PROGRESS'}
            className="btn request-changes"
          >
            Request Changes
          </button>
          <button 
            onClick={() => submitReview('APPROVE')}
            disabled={attempt.status !== 'IN_PROGRESS'}
            className="btn approve"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}
