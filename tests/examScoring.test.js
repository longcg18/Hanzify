import test from 'node:test';
import assert from 'node:assert/strict';
import { gradeExam, isExamAnswerCorrect } from '../src/utils/examScoring.js';

test('does not count an empty answer as correct', () => {
  assert.equal(isExamAnswerCorrect('', ''), false);
  assert.equal(isExamAnswerCorrect(undefined, 'A'), false);
});

test('accepts punctuation and spacing variants in HSK writing answers', () => {
  assert.equal(isExamAnswerCorrect('弟弟 高兴 地 笑了', '弟弟高兴地笑了。'), true);
});

test('grades HSK 1/2 by 100 points per section', () => {
  const questions = [
    { id: '1', section: 'listening', correctAnswer: '√' },
    { id: '2', section: 'listening', correctAnswer: 'A' },
    { id: '3', section: 'reading', correctAnswer: 'B' },
    { id: '4', section: 'reading', correctAnswer: '×' },
  ];
  const result = gradeExam(questions, { 1: '√', 2: 'B', 3: 'B' }, { passingScore: 120 });
  assert.equal(result.listeningScore, 50);
  assert.equal(result.readingScore, 50);
  assert.equal(result.totalScore, 100);
  assert.equal(result.answeredCount, 3);
  assert.equal(result.isPassed, false);
});

test('grades HSK 3 writing and pass threshold', () => {
  const questions = [
    { id: '1', section: 'listening', correctAnswer: 'A' },
    { id: '2', section: 'reading', correctAnswer: 'B' },
    { id: '3', section: 'writing', correctAnswer: '我们先看看菜单。' },
  ];
  const result = gradeExam(questions, { 1: 'A', 2: 'B', 3: '我们先看看菜单' }, { passingScore: 180 });
  assert.equal(result.totalScore, 300);
  assert.equal(result.isPassed, true);
});
