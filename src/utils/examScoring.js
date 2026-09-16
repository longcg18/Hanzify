export function normalizeExamAnswer(value) {
  return String(value ?? '').trim().replace(/[。！!？?\s]/g, '');
}

export function isExamAnswerCorrect(answer, expected) {
  return Boolean(normalizeExamAnswer(answer)) && normalizeExamAnswer(answer) === normalizeExamAnswer(expected);
}

export function gradeExam(questions, answers, exam) {
  const counts = {
    listening: { total: 0, correct: 0 },
    reading: { total: 0, correct: 0 },
    writing: { total: 0, correct: 0 },
  };

  for (const question of questions) {
    const section = counts[question.section] ? question.section : 'reading';
    counts[section].total += 1;
    if (isExamAnswerCorrect(answers[question.id], question.correctAnswer)) counts[section].correct += 1;
  }

  const sectionScore = (section) => counts[section].total
    ? Math.round((counts[section].correct / counts[section].total) * 100) : 0;
  const listeningScore = sectionScore('listening');
  const readingScore = sectionScore('reading');
  const writingScore = sectionScore('writing');
  const hasWriting = counts.writing.total > 0;
  const totalScore = listeningScore + readingScore + (hasWriting ? writingScore : 0);
  const passThreshold = exam?.passingScore || (hasWriting ? 180 : 120);

  return {
    listeningScore, readingScore, writingScore, hasWriting,
    totalListening: counts.listening.total,
    totalReading: counts.reading.total,
    totalWriting: counts.writing.total,
    totalScore,
    isPassed: totalScore >= passThreshold,
    passThreshold,
    maxScore: exam?.maxScore || (hasWriting ? 300 : 200),
    answeredCount: questions.filter((question) => Boolean(normalizeExamAnswer(answers[question.id]))).length,
    totalQuestions: questions.length,
  };
}
