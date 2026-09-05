/**
 * Hanzify API Client for connecting to Backend (Express + SQLite)
 */

export const API_BASE = 'http://localhost:5000';

// ==========================================
// 1. AUTHENTICATION
// ==========================================
export async function loginApi(usernameOrEmail, password) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: usernameOrEmail,
      email: usernameOrEmail,
      password
    })
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản hoặc mật khẩu!');
  }
  return data;
}

export async function getUsersApi() {
  try {
    const res = await fetch(`${API_BASE}/api/auth/users`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend offline, cannot load users');
  }
  return [];
}

// ==========================================
// 2. COURSES & LESSONS
// ==========================================
export async function getCoursesApi() {
  try {
    const res = await fetch(`${API_BASE}/api/courses`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend offline, falling back');
  }
  return null;
}

export async function createCourseApi(courseData) {
  const res = await fetch(`${API_BASE}/api/courses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(courseData)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Lỗi tạo khóa học');
  }
  return await res.json();
}

export async function updateCourseApi(courseId, courseData) {
  const res = await fetch(`${API_BASE}/api/courses/${courseId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(courseData)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Lỗi cập nhật khóa học');
  }
  return await res.json();
}

export async function deleteCourseApi(courseId) {
  const res = await fetch(`${API_BASE}/api/courses/${courseId}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Lỗi xóa khóa học');
  }
  return await res.json();
}

export async function createLessonApi(courseId, lessonData) {
  const res = await fetch(`${API_BASE}/api/courses/${courseId}/lessons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lessonData)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Lỗi thêm bài học');
  }
  return await res.json();
}

export async function deleteLessonApi(lessonId) {
  const res = await fetch(`${API_BASE}/api/lessons/${lessonId}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Lỗi xóa bài học');
  }
  return await res.json();
}

// ==========================================
// 3. HOMEWORK QUESTIONS (Teacher Live Preview & Student View)
// ==========================================
export async function getLessonQuestionsApi(lessonId) {
  try {
    const res = await fetch(`${API_BASE}/api/lessons/${lessonId}/questions`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend offline, cannot load questions for lesson', lessonId);
  }
  return [];
}

export async function saveLessonQuestionsApi(lessonId, questions) {
  const res = await fetch(`${API_BASE}/api/lessons/${lessonId}/questions`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questions })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Lỗi lưu bài tập vào database');
  }
  return await res.json();
}

// ==========================================
// 4. CLASSROOMS
// ==========================================
export async function getClassroomsApi() {
  try {
    const res = await fetch(`${API_BASE}/api/classrooms`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Backend offline, cannot load classrooms');
  }
  return [];
}

export async function createClassroomApi(classroomData) {
  const res = await fetch(`${API_BASE}/api/classrooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(classroomData)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Lỗi tạo lớp học');
  }
  return await res.json();
}

export async function deleteClassroomApi(classroomId) {
  const res = await fetch(`${API_BASE}/api/classrooms/${classroomId}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Lỗi xóa lớp học');
  }
  return await res.json();
}

// ==========================================
// 5. SUBMISSIONS & SPEED GRADING
// ==========================================
export async function submitHomeworkApi(formData) {
  const res = await fetch(`${API_BASE}/api/submissions`, {
    method: 'POST',
    body: formData
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
