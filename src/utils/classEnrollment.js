/**
 * Helper utilities for class enrollment and permissions.
 * Ensures students only see and access classes, courses, and lessons
 * they are enrolled in, preventing cross-class data leakage.
 */

export function isStudentInClassroom(classroom, user) {
  if (!user || !classroom) return false;
  
  // Teachers and Admins have global access to manage all classrooms
  if (user.role === 'admin' || user.role === 'teacher') return true;

  // Check direct classId links if stored in user profile
  if (user.classId && String(user.classId) === String(classroom.id)) return true;
  if (Array.isArray(user.classIds) && user.classIds.map(String).includes(String(classroom.id))) return true;

  const targetUsername = (user.username || '').trim().toLowerCase();
  const targetName = (user.full_name || user.name || '').trim().toLowerCase();
  const targetEmail = (user.email || '').trim().toLowerCase();
  const targetId = user.id ? String(user.id).trim() : null;

  return (classroom.students || []).some((s) => {
    const sUsername = (s.username || '').trim().toLowerCase();
    const sName = (s.name || '').trim().toLowerCase();
    const sEmail = (s.email || '').trim().toLowerCase();
    const sId = s.id ? String(s.id).trim() : null;
    const sUserId = s.userId || s.user_id ? String(s.userId || s.user_id).trim() : null;

    if (targetUsername && sUsername && targetUsername === sUsername) return true;
    if (targetName && sName && targetName === sName) return true;
    if (targetEmail && sEmail && targetEmail === sEmail) return true;
    if (targetId && ((sId && targetId === sId) || (sUserId && targetId === sUserId))) return true;

    return false;
  });
}

export function getStudentClassrooms(classrooms = [], user) {
  if (!user) return [];
  if (user.role === 'admin' || user.role === 'teacher') return classrooms;
  return (classrooms || []).filter((cls) => isStudentInClassroom(cls, user));
}

export function getStudentEnrolledCourseIds(classrooms = [], user) {
  if (!user) return new Set();
  const userClasses = getStudentClassrooms(classrooms, user);
  const courseIds = new Set();
  userClasses.forEach((cls) => {
    const ids = cls.courseIds || cls.course_ids || [];
    ids.forEach((id) => courseIds.add(id));
  });
  return courseIds;
}

export function isCourseAssignedToStudent(courseId, classrooms = [], user) {
  if (!user) return false;
  if (user.role === 'admin' || user.role === 'teacher') return true;
  const enrolledCourseIds = getStudentEnrolledCourseIds(classrooms, user);
  return enrolledCourseIds.has(courseId);
}

export function isLessonUnlockedForStudent(lessonId, courseId, classrooms = [], user) {
  if (!user) return false;
  if (user.role === 'admin' || user.role === 'teacher') return true;

  const userClass = (classrooms || []).find(
    (c) => isStudentInClassroom(c, user) && (c.courseIds || c.course_ids || []).includes(courseId)
  );

  if (!userClass) return false;
  return Array.isArray(userClass.unlockedLessons) && userClass.unlockedLessons.includes(lessonId);
}
