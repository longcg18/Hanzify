import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateTotalScore, isSubmissionGradingLocked, normalizeQuestionScores } from '../src/utils/gradingUtils.js';

test('calculates the total from individual question scores', () => {
  assert.equal(calculateTotalScore({ q1: 1.5, q2: 1, q3: 1.25, q4: 1.5, q5: 1, q6: 0.75, q7: 1.5 }), 8.5);
});

test('clamps question scores to their allowed range', () => {
  const scores = normalizeQuestionScores({ q1: 9, q2: -2, q6: 2 });
  assert.equal(scores.q1, 1.5);
  assert.equal(scores.q2, 0);
  assert.equal(scores.q6, 1);
});

test('locks completed and redo-requested grading attempts', () => {
  assert.equal(isSubmissionGradingLocked({ status: 'graded' }), true);
  assert.equal(isSubmissionGradingLocked({ status: 'pending', submissionState: 'redo_requested' }), true);
  assert.equal(isSubmissionGradingLocked({ status: 'pending', submissionState: 'submitted' }), false);
});
