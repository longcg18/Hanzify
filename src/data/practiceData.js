// src/data/practiceData.js
// Tổng hợp 300 câu hỏi Luyện tập tự do (100 câu HSK 1, 100 câu HSK 2, 100 câu HSK 3)
import { hsk1PracticeTopics } from './practice/hsk1_practice';
import { hsk2PracticeTopics } from './practice/hsk2_practice';
import { hsk3PracticeTopics } from './practice/hsk3_practice';

export const PRACTICE_TOPICS = [
  ...hsk1PracticeTopics,
  ...hsk2PracticeTopics,
  ...hsk3PracticeTopics
];

export const countTotalPracticeQuestions = () => {
  return PRACTICE_TOPICS.reduce((acc, t) => acc + (t.questions ? t.questions.length : 0), 0);
};
