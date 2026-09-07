// src/data/practiceData.js
// Tổng hợp ngân hàng câu hỏi Luyện tập tự do theo 5 kỹ năng cho toàn bộ cấp độ HSK 1 - HSK 6
import { hsk1PracticeTopics } from './practice/hsk1_practice';
import { hsk2PracticeTopics } from './practice/hsk2_practice';
import { hsk3PracticeTopics } from './practice/hsk3_practice';
import { buildVocabPracticeTopics } from './vocabPracticeBuilder';

// Sinh các chuyên đề kỹ năng từ kho 314 từ vựng HSK 1 - 6
const initialVocabTopics = buildVocabPracticeTopics();

export const BASE_PRACTICE_TOPICS = [
  ...hsk1PracticeTopics,
  ...hsk2PracticeTopics,
  ...hsk3PracticeTopics
];

export const PRACTICE_TOPICS = [
  ...BASE_PRACTICE_TOPICS,
  ...initialVocabTopics
];

export const countTotalPracticeQuestions = (topics = PRACTICE_TOPICS) => {
  return topics.reduce((acc, t) => acc + (t.questions ? t.questions.length : 0), 0);
};
