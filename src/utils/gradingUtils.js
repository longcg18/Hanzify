export const QUESTION_SCORE_LIMITS = [1.5, 1.5, 1.5, 1.5, 1.5, 1, 1.5];

export function normalizeQuestionScores(scores = {}) {
  return Object.fromEntries(QUESTION_SCORE_LIMITS.map((max, index) => {
    const key = `q${index + 1}`;
    const value = Number(scores[key]);
    return [key, Number.isFinite(value) ? Math.min(max, Math.max(0, value)) : 0];
  }));
}

export function calculateTotalScore(scores = {}) {
  const normalized = normalizeQuestionScores(scores);
  return Number(Object.values(normalized).reduce((sum, value) => sum + value, 0).toFixed(2));
}

export function isSubmissionGradingLocked(submission) {
  return submission?.status === 'graded' || submission?.submissionState === 'graded' || submission?.submissionState === 'redo_requested';
}
