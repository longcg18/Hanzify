/**
 * Hanzify 汉字流 - Hierarchical HSK Exams Data Helpers
 * Dữ liệu đề thi thực tế được nạp 100% từ bảng 'exams' trên Supabase.
 */

export const INITIAL_EXAMS_DATA = [];

/**
 * Trải phẳng toàn bộ câu hỏi từ cấu trúc phân cấp (Skills -> Parts -> Questions)
 * để ExamRoomView render giao diện làm bài thi trơn tru
 */
export function flattenExamQuestions(exam) {
  if (!exam || !exam.skills) return [];

  const questions = [];
  let currentNum = 1;

  exam.skills.forEach((skill) => {
    (skill.parts || []).forEach((part) => {
      (part.questions || []).forEach((q) => {
        questions.push({
          ...q,
          questionNumber: currentNum++,
          section: skill.type,
          sectionTitle: `${skill.name} · ${part.title}`,
          skillName: skill.name,
          partTitle: part.title,
          partInstructions: part.instructions
        });
      });
    });
  });

  return questions;
}

/**
 * Đếm tổng số câu hỏi trong một đề thi
 */
export function countExamTotalQuestions(exam) {
  if (!exam || !exam.skills) return 0;
  let total = 0;
  exam.skills.forEach((skill) => {
    (skill.parts || []).forEach((part) => {
      total += (part.questions || []).length;
    });
  });
  return total;
}
