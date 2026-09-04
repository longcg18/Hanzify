/**
 * Hanzify API Client for connecting to Backend (Express + SQLite)
 */

export const API_BASE = 'http://localhost:5000';

export async function loginApi(email, password) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Đăng nhập thất bại');
  }
  return await res.json();
}

export async function getCoursesApi() {
  try {
    const res = await fetch(`${API_BASE}/api/courses`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend offline, using local fallback');
  }
  return null;
}

export async function getLessonQuestionsApi(lessonId) {
  try {
    const res = await fetch(`${API_BASE}/api/lessons/${lessonId}/questions`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend offline, using fallback questions');
  }
  return null;
}

export async function submitHomeworkApi(formData) {
  const res = await fetch(`${API_BASE}/api/submissions`, {
    method: 'POST',
    body: formData // multipart/form-data for audio/image files
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Lỗi nộp bài');
  }
  return await res.json();
}

export async function getSubmissionsApi(studentId = null, status = null) {
  let url = `${API_BASE}/api/submissions`;
  const params = new URLSearchParams();
  if (studentId) params.append('student_id', studentId);
  if (status) params.append('status', status);
  if (params.toString()) url += `?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Không thể tải bài nộp');
  return await res.json();
}

export async function gradeSubmissionApi(submissionId, totalScore, teacherComment, teacherAudioFeedback = null) {
  const res = await fetch(`${API_BASE}/api/submissions/${submissionId}/grade`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      total_score: totalScore,
      teacher_comment: teacherComment,
      teacher_audio_feedback: teacherAudioFeedback
    })
  });
  if (!res.ok) throw new Error('Lỗi cập nhật điểm');
  return await res.json();
}

export async function getListeningDrillsApi() {
  const res = await fetch(`${API_BASE}/api/listening`);
  if (!res.ok) throw new Error('Không thể tải bài luyện nghe');
  return await res.json();
}

export async function getExamsApi() {
  const res = await fetch(`${API_BASE}/api/exams`);
  if (!res.ok) throw new Error('Không thể tải danh sách đề thi');
  return await res.json();
}

export async function getExamDetailApi(examId) {
  const res = await fetch(`${API_BASE}/api/exams/${examId}`);
  if (!res.ok) throw new Error('Không thể tải nội dung đề thi');
  return await res.json();
}

export async function submitExamApi(examId, studentId, studentName, answers) {
  const res = await fetch(`${API_BASE}/api/exams/${examId}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      student_id: studentId,
      student_name: studentName,
      answers
    })
  });
  if (!res.ok) throw new Error('Lỗi nộp bài thi');
  return await res.json();
}

export async function getUsersApi() {
  const res = await fetch(`${API_BASE}/api/auth/users`);
  if (!res.ok) throw new Error('Không thể tải danh sách tài khoản');
  return await res.json();
}
