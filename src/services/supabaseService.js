import { supabase } from '../lib/supabase';
import { generateCurrentWeekDays, formatStreakMilestones } from '../utils/streakUtils';
import { HSK_VOCABULARY_LIST } from '../data/hskVocabularyData';

// ==========================================
// 1. AUTHENTICATION & USERS (Supabase Direct)
// ==========================================
export async function loginWithSupabase(usernameOrEmail, password) {
  const clean = (usernameOrEmail || '').trim();
  const cleanPass = (password || '').trim();

  if (!clean) throw new Error('Vui lòng nhập tên đăng nhập hoặc địa chỉ email.');
  if (!cleanPass) throw new Error('Vui lòng nhập mật khẩu.');

  // Lookup user in public.users by email OR username (case-insensitive)
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .or(`email.ilike.${clean},username.ilike.${clean}`)
    .maybeSingle();

  if (error) {
    console.error('Supabase user login error:', error);
    throw new Error('Lỗi kết nối máy chủ Supabase. Vui lòng thử lại!');
  }

  if (!data) {
    throw new Error('Tên đăng nhập hoặc mật khẩu không chính xác!');
  }

  if (data.status === 'blocked') {
    throw new Error('Tài khoản này hiện đang bị tạm khóa. Vui lòng liên hệ quản trị viên.');
  }

  if (data.password !== cleanPass) {
    throw new Error('Tên đăng nhập hoặc mật khẩu không chính xác!');
  }

  const safeUser = {
    id: data.id,
    username: data.username,
    email: data.email,
    name: data.full_name,
    full_name: data.full_name,
    chineseName: data.chinese_name,
    chinese_name: data.chinese_name,
    role: data.role,
    avatar: data.avatar || (data.role === 'admin' ? '👑' : data.role === 'teacher' ? '怀' : '学'),
    phone: data.phone,
    badge: data.role === 'admin' ? 'Quản trị viên' : data.role === 'teacher' ? 'Giáo viên phụ trách' : 'Học viên',
    status: data.status,
    classId: null,
    classIds: []
  };

  // Lookup student enrolled classrooms
  if (data.role === 'student') {
    try {
      const studentMatchQueries = [];
      if (data.username) studentMatchQueries.push(`username.ilike.${data.username}`);
      if (data.full_name) studentMatchQueries.push(`name.ilike.${data.full_name}`);
      
      if (studentMatchQueries.length > 0) {
        const { data: enrollments } = await supabase
          .from('classroom_students')
          .select('classroom_id')
          .or(studentMatchQueries.join(','));
        
        if (enrollments && enrollments.length > 0) {
          const distinctIds = Array.from(new Set(enrollments.map((e) => e.classroom_id).filter(Boolean)));
          safeUser.classId = distinctIds[0] || null;
          safeUser.classIds = distinctIds;
        }
      }
    } catch (e) {
      console.warn('Could not load student classrooms on login:', e);
    }
  }

  return { success: true, user: safeUser };
}

export async function logoutFromSupabase() {
  try {
    await supabase.auth.signOut();
  } catch (e) {
    // Ignore signout error if session was local
  }
}

export async function registerStudentInSupabase({ classId, studentId, name, username, password }) {
  const cleanUser = (username || '').trim();
  const cleanPass = (password || '').trim();
  const cleanName = (name || '').trim();
  const email = `${cleanUser.toLowerCase()}@student.hanzify.com`;

  // Check if username already exists
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .or(`email.ilike.${email},username.ilike.${cleanUser}`)
    .maybeSingle();

  if (existing) {
    return { success: false, message: 'Tên đăng nhập này đã có người sử dụng. Vui lòng chọn tên khác.' };
  }

  const profile = {
    id: `student-${Date.now()}`,
    username: cleanUser,
    email,
    password: cleanPass,
    full_name: cleanName,
    role: 'student',
    avatar: cleanName.slice(0, 1) || '学',
    status: 'active'
  };

  const { error: profileError } = await supabase.from('users').insert(profile);
  if (profileError) return { success: false, message: profileError.message };

  if (classId && studentId) {
    await supabase.from('classroom_students').update({
      username: cleanUser,
      is_activated: true,
      activated_at: new Date().toISOString()
    }).eq('id', studentId).eq('classroom_id', classId);
  }

  return {
    success: true,
    user: {
      id: profile.id,
      username: profile.username,
      email: profile.email,
      name: profile.full_name,
      full_name: profile.full_name,
      role: 'student',
      avatar: profile.avatar,
      badge: 'Học viên',
      status: 'active',
      classId: classId || null,
      classIds: classId ? [classId] : []
    }
  };
}

export async function fetchUsers() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data) return { data: [], isLiveDb: false };

    const formatted = data.map((u) => ({
      id: u.id,
      username: u.username,
      name: u.full_name,
      full_name: u.full_name,
      email: u.email,
      role: u.role,
      chineseName: u.chinese_name,
      chinese_name: u.chinese_name,
      phone: u.phone,
      avatar: u.avatar || '👑',
      joinedDate: new Date(u.created_at).toLocaleDateString('vi-VN'),
      status: u.status || 'active'
    }));

    return { data: formatted, isLiveDb: true };
  } catch (err) {
    return { data: [], isLiveDb: false };
  }
}

export async function createSupabaseUser(newUser) {
  const userPayload = {
    id: newUser.id || `user-${Date.now()}`,
    username: newUser.username,
    email: newUser.email,
    password: newUser.password || '123456',
    full_name: newUser.name || newUser.full_name,
    chinese_name: newUser.chineseName || newUser.chinese_name || null,
    role: newUser.role || 'student',
    avatar: newUser.avatar || '安',
    phone: newUser.phone || '',
    status: 'active'
  };

  try {
    const { data, error } = await supabase.from('users').insert([userPayload]).select();
    if (!error && data && data.length > 0) {
      return { success: true, user: data[0], isLiveDb: true };
    }
  } catch (e) {
    console.error('Supabase insert user error:', e);
  }
  return { success: false };
}

export async function requestPasswordReset(usernameOrEmail) {
  const clean = (usernameOrEmail || '').trim();
  if (!clean) return { success: false, message: 'Vui lòng nhập tên đăng nhập hoặc email.' };

  try {
    const escaped = clean.replace(/[,%]/g, (character) => `\\${character}`);
    const { data: account, error: lookupError } = await supabase
      .from('users')
      .select('id, username, email, full_name')
      .or(`email.ilike.${escaped},username.ilike.${escaped}`)
      .maybeSingle();

    if (lookupError) throw lookupError;

    // Do not reveal whether an account exists. This prevents account enumeration.
    if (!account) return { success: true };

    const { data: existing, error: existingError } = await supabase
      .from('password_reset_requests')
      .select('id')
      .eq('user_id', account.id)
      .eq('status', 'pending')
      .maybeSingle();

    if (existingError) throw existingError;
    if (!existing) {
      const { error: insertError } = await supabase.from('password_reset_requests').insert({
        id: `reset-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        user_id: account.id,
        identifier: clean,
        user_name: account.full_name || account.username,
        status: 'pending'
      });
      if (insertError) throw insertError;
    }

    return { success: true };
  } catch (error) {
    console.error('Password reset request error:', error);
    return { success: false, message: 'Chưa thể gửi yêu cầu. Vui lòng thử lại sau.' };
  }
}

export async function fetchPasswordResetRequests() {
  try {
    const { data, error } = await supabase
      .from('password_reset_requests')
      .select('*')
      .order('requested_at', { ascending: false });
    if (error) throw error;
    return { data: data || [], isLiveDb: true };
  } catch (error) {
    console.error('Fetch password reset requests error:', error);
    return { data: [], isLiveDb: false };
  }
}

export async function resolvePasswordResetRequest({ requestId, userId, newPassword, adminId }) {
  const cleanPassword = (newPassword || '').trim();
  if (cleanPassword.length < 6) {
    return { success: false, message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' };
  }

  try {
    const { error: userError } = await supabase
      .from('users')
      .update({ password: cleanPassword })
      .eq('id', userId);
    if (userError) throw userError;

    const { error: requestError } = await supabase
      .from('password_reset_requests')
      .update({
        status: 'resolved',
        resolved_at: new Date().toISOString(),
        resolved_by: adminId || null
      })
      .eq('id', requestId)
      .eq('status', 'pending');
    if (requestError) throw requestError;

    return { success: true };
  } catch (error) {
    console.error('Resolve password reset request error:', error);
    return { success: false, message: 'Không thể đặt lại mật khẩu. Vui lòng thử lại.' };
  }
}

// ==========================================
// 2. COURSES & LESSONS (Supabase Direct)
// ==========================================
export async function fetchCoursesWithLessons() {
  try {
    const { data: courses, error: errCourses } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: true });

    if (errCourses || !courses) return [];

    const { data: lessons, error: errLessons } = await supabase
      .from('lessons')
      .select('*')
      .order('number', { ascending: true });

    return courses.map((c) => ({
      id: c.id,
      title: c.title,
      chineseTitle: c.chinese_title,
      level: c.level,
      description: c.description,
      badge: c.tag || 'Đang mở',
      teacher: c.teacher_name || 'Cô Hoài (Giáo Viên 01)',
      totalLessons: c.total_lessons || 1,
      coverGradient: c.level === 'HSK 1'
        ? 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'
        : c.level === 'HSK 2'
        ? 'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 100%)'
        : 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
      lessons: (lessons || [])
        .filter((l) => l.course_id === c.id)
        .map((l) => ({
          id: l.id,
          number: String(l.number).padStart(2, '0'),
          title: l.title,
          chineseTitle: l.chinese_title,
          deadline: l.description || '23:59 Chủ Nhật',
          status: l.is_unlocked ? 'active' : 'locked',
          questionsCount: 5
        }))
    }));
  } catch (err) {
    console.error('Error fetching courses from Supabase:', err);
    return [];
  }
}

export async function syncCourseToSupabase(course) {
  const payload = {
    id: course.id,
    title: course.title,
    chinese_title: course.chineseTitle || '',
    level: course.level || 'HSK 2',
    description: course.description || '',
    tag: course.badge || 'Đang mở',
    total_lessons: course.totalLessons || (course.lessons?.length || 1),
    teacher_name: course.teacher || 'Cô Hoài (Giáo Viên 01)',
    teacher_avatar: '怀'
  };
  try {
    const { data, error } = await supabase
      .from('courses')
      .upsert([payload], { onConflict: 'id' })
      .select();
    if (!error) return { success: true, data };
  } catch (e) {
    console.error('Supabase course sync error:', e);
  }
  return { success: false };
}

export async function deleteCourseFromSupabase(courseId) {
  try {
    await supabase.from('courses').delete().eq('id', courseId);
    return { success: true };
  } catch (e) {
    console.error('Supabase course delete error:', e);
    return { success: false, error: e };
  }
}

export async function syncLessonToSupabase(lesson, courseId) {
  const payload = {
    id: lesson.id,
    course_id: courseId,
    number: parseInt(lesson.number, 10) || 1,
    title: lesson.title,
    chinese_title: lesson.chineseTitle || '',
    description: lesson.deadline || '23:59 Chủ Nhật',
    hsk_level: 'HSK 2',
    is_unlocked: lesson.status !== 'locked'
  };
  try {
    const { data, error } = await supabase
      .from('lessons')
      .upsert([payload], { onConflict: 'id' })
      .select();
    if (!error) return { success: true, data };
  } catch (e) {
    console.error('Supabase lesson sync error:', e);
  }
  return { success: false };
}

export async function deleteLessonFromSupabase(lessonId) {
  try {
    await supabase.from('lessons').delete().eq('id', lessonId);
    return { success: true };
  } catch (e) {
    console.error('Supabase lesson delete error:', e);
    return { success: false, error: e };
  }
}

// ==========================================
// 3. HOMEWORK QUESTIONS (Live Teacher Preview & Student View)
// ==========================================
export async function fetchLessonQuestions(lessonId) {
  try {
    const { data, error } = await supabase
      .from('homework_questions')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('sort_order', { ascending: true });

    if (error || !data) return [];
    return data.map((q) => ({
      id: q.id,
      lesson_id: q.lesson_id,
      type: q.type,
      title: q.prompt,
      instruction: q.prompt,
      tag: q.type === 'listening' ? 'Nghe hiểu' : q.type === 'pinyin' ? 'Phát âm' : q.type === 'word_order' ? 'Ngữ pháp' : q.type === 'voice' ? 'Khẩu ngữ' : 'Viết chữ',
      sort_order: q.sort_order,
      data: q.data_json || {}
    }));
  } catch (e) {
    return [];
  }
}

export async function saveLessonQuestions(lessonId, questions) {
  try {
    await supabase.from('homework_questions').delete().eq('lesson_id', lessonId);
    if (!questions || questions.length === 0) return { success: true };

    const payloads = questions.map((q, idx) => ({
      id: q.id || `q-${lessonId}-${Date.now()}-${idx}`,
      lesson_id: lessonId,
      type: q.type || 'listening',
      prompt: q.title || q.instruction || `Câu hỏi ${idx + 1}`,
      data_json: q.data || {},
      sort_order: idx + 1
    }));

    const { error } = await supabase.from('homework_questions').insert(payloads);
    if (!error) return { success: true };
  } catch (e) {
    console.error('Error saving homework questions on Supabase:', e);
  }
  return { success: false };
}

// ==========================================
// 4. CLASSROOMS (Supabase Direct)
// ==========================================
export async function fetchClassrooms() {
  try {
    const { data, error } = await supabase
      .from('classrooms')
      .select('*, classroom_courses(course_id), classroom_students(*)')
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data.map((c) => ({
      id: c.id,
      code: c.code,
      name: c.name,
      teacherId: c.teacher_id,
      teacher: c.teacher,
      teacherName: c.teacher,
      level: c.level,
      schedule: c.schedule || { days: ['T2', 'T4', 'T6'], shift: 'Tối', timeNote: '19:30 - 21:00' },
      courseIds: (c.classroom_courses || []).map((item) => item.course_id),
      students: (c.classroom_students || []).map((student) => ({
        ...student,
        isActivated: student.is_activated,
        activatedAt: student.activated_at
      })),
      unlockedLessons: Array.isArray(c.unlocked_lessons) ? c.unlocked_lessons : [],
      createdAt: c.created_at
    }));
  } catch (e) {
    console.error('Error fetching classrooms from Supabase:', e);
    return [];
  }
}

export async function createClassroomInSupabase(newClass) {
  try {
    const payload = {
      id: newClass.id,
      code: newClass.code,
      name: newClass.name,
      teacher: newClass.teacher || 'Cô Hoài (Giáo Viên 01)',
      level: newClass.level,
      schedule: newClass.schedule,
      unlocked_lessons: Array.isArray(newClass.unlockedLessons) ? newClass.unlockedLessons : []
    };
    const { data, error } = await supabase.from('classrooms').insert([payload]).select();
    if (error) throw error;
    const courseRows = (newClass.courseIds || []).map((courseId) => ({ classroom_id: newClass.id, course_id: courseId }));
    const studentRows = (newClass.students || []).map((student) => ({
      id: student.id,
      classroom_id: newClass.id,
      name: student.name,
      username: student.username || null,
      is_activated: Boolean(student.isActivated),
      activated_at: student.activatedAt || null
    }));
    if (courseRows.length) {
      const { error: courseError } = await supabase.from('classroom_courses').insert(courseRows);
      if (courseError) throw courseError;
    }
    if (studentRows.length) {
      const { error: studentError } = await supabase.from('classroom_students').insert(studentRows);
      if (studentError) throw studentError;
    }
    if (data) return { success: true, data: data[0] };
  } catch (e) {
    console.error('Error creating classroom on Supabase:', e);
  }
  return { success: false };
}

export async function updateClassroomUnlockedLessons(classId, unlockedLessons) {
  try {
    const { error } = await supabase
      .from('classrooms')
      .update({ unlocked_lessons: Array.isArray(unlockedLessons) ? unlockedLessons : [] })
      .eq('id', classId);
    if (!error) return { success: true };
    console.error('Error updating classroom unlocked lessons in Supabase:', error);
  } catch (e) {
    console.error('Error updating classroom unlocked lessons in Supabase:', e);
  }
  return { success: false };
}

export async function updateClassroomInSupabase(updatedClass) {
  try {
    // 1. Update classrooms table
    const payload = {
      name: updatedClass.name,
      level: updatedClass.level,
      schedule: updatedClass.schedule
    };
    const { error: classError } = await supabase
      .from('classrooms')
      .update(payload)
      .eq('id', updatedClass.id);
    if (classError) throw classError;

    // 2. Sync courses (classroom_courses)
    await supabase.from('classroom_courses').delete().eq('classroom_id', updatedClass.id);
    const courseRows = (updatedClass.courseIds || []).map((courseId) => ({
      classroom_id: updatedClass.id,
      course_id: courseId
    }));
    if (courseRows.length > 0) {
      const { error: courseError } = await supabase.from('classroom_courses').insert(courseRows);
      if (courseError) throw courseError;
    }

    // 3. Sync students (classroom_students)
    const currentStudentIds = (updatedClass.students || []).map((s) => s.id).filter(Boolean);
    const { data: existingStudents } = await supabase
      .from('classroom_students')
      .select('id')
      .eq('classroom_id', updatedClass.id);
    
    const toDelete = (existingStudents || [])
      .map((s) => s.id)
      .filter((id) => !currentStudentIds.includes(id));

    if (toDelete.length > 0) {
      await supabase.from('classroom_students').delete().in('id', toDelete);
    }

    if (updatedClass.students && updatedClass.students.length > 0) {
      const studentRows = updatedClass.students.map((student) => ({
        id: student.id,
        classroom_id: updatedClass.id,
        name: student.name,
        username: student.username || null,
        is_activated: Boolean(student.isActivated),
        activated_at: student.activatedAt || null
      }));
      const { error: studentError } = await supabase
        .from('classroom_students')
        .upsert(studentRows, { onConflict: 'id' });
      if (studentError) throw studentError;
    }

    return { success: true };
  } catch (e) {
    console.error('Error updating classroom on Supabase:', e);
    return { success: false, error: e };
  }
}

export async function deleteClassroomFromSupabase(classId) {
  try {
    await supabase.from('classrooms').delete().eq('id', classId);
    return { success: true };
  } catch (e) {
    console.error('Error deleting classroom from Supabase:', e);
    return { success: false };
  }
}

export async function transferStudentBetweenClasses(fromClassId, toClassId, student) {
  try {
    if (!fromClassId || !toClassId || !student) {
      throw new Error('Thiếu thông tin lớp học hoặc học sinh cần chuyển.');
    }

    // 1. Try updating existing row in classroom_students if student.id exists
    let updated = false;
    if (student.id) {
      const { data, error } = await supabase
        .from('classroom_students')
        .update({
          classroom_id: toClassId,
          name: student.name,
          username: student.username || null,
          is_activated: Boolean(student.isActivated),
          activated_at: student.activatedAt || (student.isActivated ? new Date().toISOString() : null)
        })
        .eq('id', student.id)
        .select();

      if (!error && data && data.length > 0) {
        updated = true;
      }
    }

    // 2. Fallback if not updated by ID: delete from old class and insert into target class
    if (!updated) {
      if (student.id) {
        await supabase
          .from('classroom_students')
          .delete()
          .eq('classroom_id', fromClassId)
          .eq('id', student.id);
      } else {
        await supabase
          .from('classroom_students')
          .delete()
          .eq('classroom_id', fromClassId)
          .eq('name', student.name);
      }

      const newStudentRow = {
        id: student.id || `student-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        classroom_id: toClassId,
        name: student.name,
        username: student.username || null,
        is_activated: Boolean(student.isActivated),
        activated_at: student.activatedAt || (student.isActivated ? new Date().toISOString() : null)
      };

      const { error: insErr } = await supabase
        .from('classroom_students')
        .upsert(newStudentRow, { onConflict: 'id' });

      if (insErr) {
        console.error('Error inserting student to target classroom:', insErr);
        throw insErr;
      }
    }

    // 3. Sync user profile and streak record if student has a linked username
    if (student.username) {
      try {
        await supabase
          .from('users')
          .update({ class_id: toClassId })
          .eq('username', student.username);

        await supabase
          .from('user_streaks')
          .update({ classroom_id: toClassId })
          .eq('username', student.username);
      } catch (syncErr) {
        console.warn('Sync user class_id warning (non-fatal):', syncErr);
      }
    }

    return { success: true };
  } catch (e) {
    console.error('Error transferring student between classrooms:', e);
    return { success: false, error: e };
  }
}

// ==========================================
// 5. EXAMS (HSK Simulation)
// ==========================================
export async function fetchExams() {
  try {
    const { data: exams, error: errExams } = await supabase.from('exams').select('*');
    if (errExams) {
      console.error('Supabase exams fetch error:', errExams);
      return { data: [], isLiveDb: false };
    }
    if (!exams || exams.length === 0) {
      return { data: [], isLiveDb: true };
    }

    const { data: skills, error: skillsError } = await supabase.from('exam_skills').select('*').order('sort_order');
    const { data: parts, error: partsError } = await supabase.from('exam_parts').select('*').order('sort_order');
    const { data: questions, error: questionsError } = await supabase.from('exam_questions').select('*').order('sort_order');
    if (skillsError || partsError || questionsError) throw (skillsError || partsError || questionsError);

    const formatted = exams.map((ex) => ({
      id: ex.id,
      title: ex.title,
      chineseTitle: ex.chinese_title,
      level: ex.level,
      duration: ex.duration || 35,
      totalQuestions: (questions || []).filter((q) => (parts || []).some((p) => p.id === q.part_id && (skills || []).some((s) => s.id === p.skill_id && s.exam_id === ex.id))).length,
      passingScore: ex.passing_score || 120,
      maxScore: ex.max_score || 200,
      description: ex.description,
      tag: ex.tag,
      skills: (skills || []).filter((s) => s.exam_id === ex.id).map((skill) => ({
        id: skill.id,
        type: skill.skill_type,
        name: skill.name,
        chineseName: skill.chinese_name,
        parts: (parts || []).filter((p) => p.skill_id === skill.id).map((part) => ({
          id: part.id,
          title: part.title,
          instructions: part.instructions,
          partNumber: part.part_number,
          questions: (questions || []).filter((q) => q.part_id === part.id).map((q) => ({
            id: q.id, questionNumber: q.question_number, prompt: q.prompt,
            audioText: q.audio_text, readingText: q.reading_text, pinyin: q.pinyin,
            options: q.options || [], correctAnswer: q.correct_answer, explanation: q.explanation
          }))
        }))
      }))
    }));

    return { data: formatted, isLiveDb: true };
  } catch (err) {
    return { data: [], isLiveDb: false };
  }
}

export async function syncExamToSupabase(exam) {
  const payload = {
    id: exam.id,
    title: exam.title,
    chinese_title: exam.chineseTitle || '',
    level: exam.level || 'HSK 2',
    duration: exam.duration || 35,
    passing_score: exam.passingScore || 120,
    max_score: exam.maxScore || 200,
    description: exam.description || '',
    tag: exam.tag || 'Đề tiêu chuẩn'
  };
  try {
    const { data, error } = await supabase.from('exams').upsert([payload], { onConflict: 'id' }).select();
    if (error) throw error;
    await supabase.from('exam_skills').delete().eq('exam_id', exam.id);
    for (const [skillIndex, skill] of (exam.skills || []).entries()) {
      const { error: skillError } = await supabase.from('exam_skills').insert({
        id: skill.id, exam_id: exam.id, skill_type: skill.type,
        name: skill.name, chinese_name: skill.chineseName || '', sort_order: skillIndex + 1
      });
      if (skillError) throw skillError;
      for (const [partIndex, part] of (skill.parts || []).entries()) {
        const { error: partError } = await supabase.from('exam_parts').insert({
          id: part.id, skill_id: skill.id, part_number: part.partNumber || partIndex + 1,
          title: part.title, instructions: part.instructions || '', sort_order: partIndex + 1
        });
        if (partError) throw partError;
        const questionRows = (part.questions || []).map((q, questionIndex) => ({
          id: q.id, part_id: part.id, question_number: q.questionNumber || questionIndex + 1,
          prompt: q.prompt, audio_text: q.audioText || null, reading_text: q.readingText || null,
          pinyin: q.pinyin || null, options: q.options || [], correct_answer: q.correctAnswer,
          explanation: q.explanation || null, sort_order: questionIndex + 1
        }));
        if (questionRows.length) {
          const { error: questionError } = await supabase.from('exam_questions').insert(questionRows);
          if (questionError) throw questionError;
        }
      }
    }
    return { success: true, isLiveDb: true };
  } catch (e) {
    console.error('Supabase exam sync error:', e);
  }
  return { success: false, isLiveDb: false };
}

export async function deleteExamFromSupabase(examId) {
  try {
    await supabase.from('exams').delete().eq('id', examId);
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}

// ==========================================
// 6. MINI-GAMES & LEADERBOARD
// ==========================================
export async function fetchMatchPairs() {
  try {
    const { data, error } = await supabase.from('game_match_pairs').select('*').order('created_at', { ascending: false });
    if (error || !data) return { data: [], isLiveDb: false };
    return { data, isLiveDb: true };
  } catch (e) {
    return { data: [], isLiveDb: false };
  }
}

export async function addMatchPair(pair) {
  const payload = {
    id: `p-${Date.now()}`,
    hanzi: pair.hanzi.trim(),
    pinyin: pair.pinyin.trim(),
    mean: pair.mean.trim(),
    category: pair.category || 'Từ vựng HSK 2'
  };
  try {
    const { data, error } = await supabase.from('game_match_pairs').insert([payload]).select();
    if (!error && data) return { success: true, pair: data[0], isLiveDb: true };
  } catch (e) {}
  return { success: true, pair: payload, isLiveDb: false };
}

export async function deleteMatchPair(id) {
  try {
    await supabase.from('game_match_pairs').delete().eq('id', id);
  } catch (e) {}
  return { success: true };
}

export async function fetchToneItems() {
  try {
    const { data, error } = await supabase.from('game_tone_items').select('*').order('created_at', { ascending: false });
    if (error || !data) return { data: [], isLiveDb: false };
    return { data, isLiveDb: true };
  } catch (e) {
    return { data: [], isLiveDb: false };
  }
}

export async function addToneItem(item) {
  const payload = {
    id: `t-${Date.now()}`,
    char: item.char.trim(),
    pinyin: item.pinyin.trim(),
    tone: parseInt(item.tone, 10) || 1,
    mean: item.mean.trim()
  };
  try {
    const { data, error } = await supabase.from('game_tone_items').insert([payload]).select();
    if (!error && data) return { success: true, item: data[0], isLiveDb: true };
  } catch (e) {}
  return { success: true, item: payload, isLiveDb: false };
}

export async function deleteToneItem(id) {
  try {
    await supabase.from('game_tone_items').delete().eq('id', id);
  } catch (e) {}
  return { success: true };
}

export async function fetchVocabularies({ level = 'all', topic = 'all' } = {}) {
  try {
    let query = supabase.from('vocabularies').select('*');
    if (level && level !== 'all') {
      query = query.eq('level', level);
    }
    if (topic && topic !== 'all') {
      query = query.eq('topic', topic);
    }
    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return { data, isLiveDb: true };
    }
  } catch (e) {
    console.warn('fetchVocabularies Supabase query, using local data:', e);
  }
  let list = HSK_VOCABULARY_LIST;
  if (level && level !== 'all') {
    list = list.filter((item) => item.level === level);
  }
  if (topic && topic !== 'all') {
    list = list.filter((item) => item.topic === topic);
  }
  return { data: list, isLiveDb: false };
}

export async function fetchLeaderboard() {
  // Query Supabase for real users, real streaks, real submissions, real classrooms
  let liveStreaks = [];
  let liveSubmissions = [];
  let liveUsers = [];
  let liveClassrooms = [];

  try {
    const [streakRes, subRes, userRes, classRes] = await Promise.all([
      supabase.from('user_streaks').select('*'),
      supabase.from('submissions').select('*'),
      supabase.from('users').select('*'),
      supabase.from('classrooms').select('*')
    ]);
    if (!streakRes.error && streakRes.data) liveStreaks = streakRes.data;
    if (!subRes.error && subRes.data) liveSubmissions = subRes.data;
    if (!userRes.error && userRes.data) liveUsers = userRes.data;
    if (!classRes.error && classRes.data) liveClassrooms = classRes.data;
  } catch (e) {
    console.warn('Error querying Supabase for leaderboard:', e);
  }

  const entryMap = new Map();

  const getSubXp = (sub) => {
    const raw = sub.total_score ?? sub.score ?? sub.answers_json?.autoGradedScore;
    const val = Number(raw) || 0;
    return val > 0 ? (val <= 10 ? Math.round(val * 10) : val) : 0;
  };

  // 1. Populate real enrolled students from classrooms
  liveClassrooms.forEach((cls) => {
    const students = Array.isArray(cls.students) ? cls.students : [];
    students.forEach((st) => {
      const key = st.id || st.username || st.name;
      if (!key) return;

      const userStreak = liveStreaks.find((s) => s.user_id === st.id);
      const userSubs = liveSubmissions.filter(
        (s) => s.student_id === st.id || s.student_name === st.name || s.student_name === st.username
      );

      const localStreakKey = `hanzify_streak_${st.id || st.username || 'student'}`;
      let localStreakXp = 0;
      try {
        if (typeof localStorage !== 'undefined') {
          const raw = localStorage.getItem(localStreakKey);
          if (raw) localStreakXp = Number(JSON.parse(raw)?.totalXp) || 0;
        }
      } catch (e) {}

      const streakXp = Math.max(userStreak?.total_xp || 0, localStreakXp);
      const subsXp = userSubs.reduce((acc, sub) => acc + getSubXp(sub), 0);
      const totalXp = streakXp + subsXp + (Number(st.score) || 0);

      const validGradeSubs = userSubs.filter((s) => s.total_score != null || s.score != null || s.answers_json?.autoGradedScore != null);
      const realAvgGrade = validGradeSubs.length > 0
        ? Number((validGradeSubs.reduce((sum, s) => sum + Number(s.total_score ?? s.score ?? s.answers_json?.autoGradedScore ?? 0), 0) / validGradeSubs.length).toFixed(1))
        : null;

      entryMap.set(key, {
        id: st.id || key,
        name: st.name || st.username || 'Học viên',
        user_name: st.name || st.username || 'Học viên',
        chineseName: st.chineseName || st.chinese_name || '',
        avatar: st.avatar || (st.name ? st.name.slice(0, 1) : '学'),
        avatarBg: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
        level: cls.level || 'HSK 1',
        badge: 'Lớp ' + (cls.name || ''),
        xp: totalXp,
        score: totalXp,
        points: totalXp,
        classId: cls.id,
        classroom_id: cls.id,
        completionRate: userSubs.length > 0 ? 100 : 0,
        teacherGrade: realAvgGrade,
        lessonsCompleted: userSubs.length
      });
    });
  });

  // 2. Add real student accounts from Supabase users table
  liveUsers.forEach((u) => {
    if (u.role !== 'student') return; // Only rank students
    const key = u.id || u.username;
    if (!key) return;

    const userStreak = liveStreaks.find((s) => s.user_id === u.id);
    const userSubs = liveSubmissions.filter(
      (s) => s.student_id === u.id || s.student_name === u.full_name || s.student_name === u.name || s.student_name === u.username
    );

    const localStreakKey = `hanzify_streak_${u.id || u.username || 'student'}`;
    let localStreakXp = 0;
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(localStreakKey);
        if (raw) localStreakXp = Number(JSON.parse(raw)?.totalXp) || 0;
      }
    } catch (e) {}

    const streakXp = Math.max(userStreak?.total_xp || 0, localStreakXp);
    const subsXp = userSubs.reduce((acc, sub) => acc + getSubXp(sub), 0);
    const calculatedXp = streakXp + subsXp;

    const validGradeSubs = userSubs.filter((s) => s.total_score != null || s.score != null || s.answers_json?.autoGradedScore != null);
    const realAvgGrade = validGradeSubs.length > 0
      ? Number((validGradeSubs.reduce((sum, s) => sum + Number(s.total_score ?? s.score ?? s.answers_json?.autoGradedScore ?? 0), 0) / validGradeSubs.length).toFixed(1))
      : null;

    const existing = entryMap.get(key) || entryMap.get(u.full_name) || entryMap.get(u.username) || {};

    let userClassId = u.class_id || u.classId || existing.classId;
    if (!userClassId && liveClassrooms.length > 0) {
      const matchedCls = liveClassrooms.find((cls) =>
        Array.isArray(cls.students) && cls.students.some((st) => st.id === u.id || st.username === u.username)
      );
      if (matchedCls) userClassId = matchedCls.id;
    }
    if (!userClassId) userClassId = 'all';

    const finalXp = Math.max(existing.xp || 0, calculatedXp);

    entryMap.set(key, {
      ...existing,
      id: u.id,
      name: u.full_name || u.name || u.username || 'Học viên',
      user_name: u.full_name || u.name || u.username || 'Học viên',
      chineseName: u.chinese_name || existing.chineseName || '',
      avatar: u.avatar || (u.full_name ? u.full_name.slice(0, 1) : '学'),
      avatarBg: existing.avatarBg || 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
      level: existing.level || 'HSK 1',
      badge: existing.badge || 'Học viên',
      xp: finalXp,
      score: finalXp,
      points: finalXp,
      classId: userClassId,
      classroom_id: userClassId,
      completionRate: existing.completionRate || (userSubs.length > 0 ? 100 : 0),
      teacherGrade: realAvgGrade || existing.teacherGrade || null,
      lessonsCompleted: Math.max(existing.lessonsCompleted || 0, userSubs.length)
    });
  });

  // 3. Add currently logged-in student user from localStorage
  try {
    const rawUser = localStorage.getItem('hanzify_user');
    if (rawUser) {
      const localUser = JSON.parse(rawUser);
      if (localUser && (localUser.role === 'student' || !localUser.role)) {
        const localStreakKey = `hanzify_streak_${localUser.id || 'student'}`;
        const localStreakRaw = localStorage.getItem(localStreakKey);
        const localStreak = localStreakRaw ? JSON.parse(localStreakRaw) : null;
        const streakXp = Number(localStreak?.totalXp || 0);

        const key = localUser.id || localUser.username || 'current-user';
        const existing = entryMap.get(key) || entryMap.get(localUser.name) || entryMap.get(localUser.full_name) || {};

        const totalXp = Math.max(existing.xp || 0, streakXp);

        let userClassId = localUser.classId || (Array.isArray(localUser.classIds) && localUser.classIds[0]) || existing.classId;
        if (!userClassId && liveClassrooms.length > 0) {
          const matchedCls = liveClassrooms.find((cls) =>
            Array.isArray(cls.students) && cls.students.some((st) => st.id === localUser.id || st.username === localUser.username)
          );
          if (matchedCls) userClassId = matchedCls.id;
        }
        if (!userClassId) userClassId = 'all';

        entryMap.set(key, {
          ...existing,
          id: localUser.id || 'current-user',
          name: localUser.full_name || localUser.name || localUser.username || 'Bạn',
          user_name: localUser.full_name || localUser.name || localUser.username || 'Bạn',
          chineseName: localUser.chinese_name || localUser.chineseName || '',
          avatar: localUser.avatar || (localUser.full_name ? localUser.full_name.slice(0, 1) : '学'),
          avatarBg: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
          level: localUser.level || existing.level || 'HSK 1',
          badge: 'Học viên tích cực 🔥',
          xp: totalXp,
          score: totalXp,
          points: totalXp,
          classId: userClassId,
          classroom_id: userClassId,
          completionRate: existing.completionRate || (totalXp > 0 ? 100 : 0),
          teacherGrade: existing.teacherGrade || null,
          isCurrentUser: true
        });
      }
    }
  } catch (e) {
    console.error('Error injecting local user into leaderboard:', e);
  }

  // 4. Enrich with benchmark top learners if list has few entries
  const sampleStudents = [
    {
      id: 'bench-1',
      name: 'Hoàng Kim Jessi',
      chineseName: '金安',
      avatar: '杰',
      avatarBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      level: 'HSK 2',
      badge: 'Chăm chỉ nhất tuần 👑',
      xp: 350,
      score: 350,
      points: 350,
      classId: 'all',
      classroom_id: 'all',
      completionRate: 100,
      teacherGrade: 9.8,
      lessonsCompleted: 4
    },
    {
      id: 'bench-2',
      name: 'Đỗ Tuấn Kiệt',
      chineseName: '杜俊杰',
      avatar: '杰',
      avatarBg: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
      level: 'HSK 1',
      badge: 'Bài tập điểm 10 🥈',
      xp: 220,
      score: 220,
      points: 220,
      classId: 'all',
      classroom_id: 'all',
      completionRate: 100,
      teacherGrade: 9.5,
      lessonsCompleted: 3
    },
    {
      id: 'bench-3',
      name: 'Phạm Thị Mai',
      chineseName: '范氏梅',
      avatar: '梅',
      avatarBg: 'linear-gradient(135deg, #b45309 0%, #78350f 100%)',
      level: 'HSK 1',
      badge: 'Phát âm chuẩn 🥉',
      xp: 180,
      score: 180,
      points: 180,
      classId: 'all',
      classroom_id: 'all',
      completionRate: 100,
      teacherGrade: 9.2,
      lessonsCompleted: 2
    }
  ];

  sampleStudents.forEach((st) => {
    if (!entryMap.has(st.id) && !entryMap.has(st.name)) {
      entryMap.set(st.id, st);
    }
  });

  // Sort descending by real XP
  const resultList = Array.from(entryMap.values())
    .sort((a, b) => (b.xp || 0) - (a.xp || 0))
    .map((item, idx) => ({
      ...item,
      rank: idx + 1
    }));

  return { data: resultList, isLiveDb: true };
}

// ==========================================
// 6. STORAGE & MEDIA UPLOADS (Cloud Storage)
// ==========================================
export async function uploadMediaToSupabase(fileOrBlob, folder = 'homework', originalName = '') {
  try {
    let ext = 'webm';
    if (originalName && originalName.includes('.')) {
      ext = originalName.split('.').pop().toLowerCase();
    } else if (fileOrBlob.type) {
      if (fileOrBlob.type.includes('png')) ext = 'png';
      else if (fileOrBlob.type.includes('jpeg') || fileOrBlob.type.includes('jpg')) ext = 'jpg';
      else if (fileOrBlob.type.includes('webp')) ext = 'webp';
      else if (fileOrBlob.type.includes('mp4')) ext = 'mp4';
      else if (fileOrBlob.type.includes('ogg')) ext = 'ogg';
      else if (fileOrBlob.type.includes('audio') || fileOrBlob.type.includes('webm')) ext = 'webm';
    }

    const randomSuffix = Math.random().toString(36).substring(2, 9);
    const fileName = `${folder}/${Date.now()}_${randomSuffix}.${ext}`;

    const { data, error } = await supabase.storage
      .from('hanzify-media')
      .upload(fileName, fileOrBlob, {
        contentType: fileOrBlob.type || (ext === 'webm' ? 'audio/webm' : 'image/jpeg'),
        upsert: false
      });

    if (error) {
      console.error('Supabase storage upload error:', error);
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from('hanzify-media')
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error('uploadMediaToSupabase failed:', err);
    throw err;
  }
}

// ==========================================
// 6. HOMEWORK SUBMISSIONS & GRADING
// ==========================================
const getLocalDraftKey = (studentId, lessonId) => `hanzify_draft_${studentId || 'guest'}_${lessonId || 'default'}`;

export function getLocalDraft(studentId, lessonId) {
  try {
    const raw = localStorage.getItem(getLocalDraftKey(studentId, lessonId));
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading local draft:', e);
  }
  return null;
}

export function setLocalDraft(studentId, lessonId, draftData) {
  try {
    localStorage.setItem(getLocalDraftKey(studentId, lessonId), JSON.stringify(draftData));
  } catch (e) {
    console.error('Error saving local draft:', e);
  }
}

export function clearLocalDraft(studentId, lessonId) {
  try {
    localStorage.removeItem(getLocalDraftKey(studentId, lessonId));
  } catch (e) {
    console.error('Error clearing local draft:', e);
  }
}

export async function fetchStudentLessonSubmission(studentId, lessonId) {
  try {
    if (studentId && lessonId) {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('student_id', studentId)
        .eq('lesson_id', lessonId)
        .order('submitted_at', { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) {
        const item = data[0];
        const answers = item.answers_json || {};
        const submissionState = answers.submission_state || (item.status === 'graded' ? 'graded' : 'submitted');
        return {
          success: true,
          submission: {
            id: item.id,
            lessonId: item.lesson_id,
            studentId: item.student_id,
            studentName: item.student_name,
            submittedAt: item.submitted_at ? new Date(item.submitted_at).toLocaleString('vi-VN') : '',
            status: item.status, // 'pending' | 'graded'
            submissionState, // 'draft' | 'submitted' | 'redo_requested' | 'graded'
            totalScore: item.total_score,
            teacherComment: item.teacher_comment,
            teacherAudioFeedback: item.teacher_audio_feedback,
            answers,
            redoNote: answers.redo_note || null,
            isDirectGraded: !!answers.direct_graded
          }
        };
      }
    }
  } catch (e) {
    console.warn('fetchStudentLessonSubmission error:', e);
  }

  // Fallback to local draft if exists
  const localDraft = getLocalDraft(studentId, lessonId);
  if (localDraft) {
    return {
      success: true,
      submission: {
        id: localDraft.id || `draft-local-${Date.now()}`,
        lessonId,
        studentId,
        studentName: localDraft.studentName || 'Học viên',
        submittedAt: localDraft.savedAt ? new Date(localDraft.savedAt).toLocaleString('vi-VN') : '',
        status: 'pending',
        submissionState: 'draft',
        totalScore: null,
        teacherComment: null,
        answers: localDraft.answers || {},
        redoNote: null
      }
    };
  }

  return { success: false, submission: null };
}

export async function fetchStudentSubmissions(studentId) {
  if (!studentId) return { data: [] };
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('student_id', studentId);
    if (!error && data) {
      return {
        data: data.map((item) => {
          const answers = item.answers_json || {};
          const submissionState = answers.submission_state || (item.status === 'graded' ? 'graded' : 'submitted');
          return {
            id: item.id,
            lessonId: item.lesson_id,
            studentId: item.student_id,
            status: item.status,
            submissionState,
            totalScore: item.total_score,
            teacherComment: item.teacher_comment,
            redoNote: answers.redo_note || null,
            submittedAt: item.submitted_at
          };
        })
      };
    }
  } catch (e) {
    console.warn('fetchStudentSubmissions error:', e);
  }
  return { data: [] };
}

export async function saveHomeworkDraft(submission) {
  const studentId = submission.studentId;
  const lessonId = submission.lessonId;
  const answers = {
    ...(submission.answers || {}),
    submission_state: 'draft',
    saved_at: new Date().toISOString()
  };

  // 1. Save local draft immediately
  setLocalDraft(studentId, lessonId, {
    id: submission.id,
    studentId,
    lessonId,
    studentName: submission.studentName,
    answers,
    savedAt: new Date().toISOString()
  });

  // 2. Sync to Supabase if possible
  try {
    const { data: existing } = await supabase
      .from('submissions')
      .select('id, status, answers_json')
      .eq('student_id', studentId)
      .eq('lesson_id', lessonId)
      .limit(1);

    if (existing && existing.length > 0) {
      const existingId = existing[0].id;
      const currentSubState = existing[0].answers_json?.submission_state;
      // Do not overwrite if already submitted or graded unless it was draft/redo
      if (currentSubState === 'submitted' || (existing[0].status === 'graded' && currentSubState !== 'redo_requested')) {
        return { success: true, isReadOnly: true };
      }

      const { data, error } = await supabase
        .from('submissions')
        .update({
          answers_json: answers,
          student_name: submission.studentName || 'Học viên'
        })
        .eq('id', existingId)
        .select();

      return { success: !error, data: data?.[0] };
    } else {
      const payload = {
        id: submission.id || `sub-${Date.now()}`,
        lesson_id: lessonId,
        student_id: studentId,
        student_name: submission.studentName || 'Học viên',
        status: 'pending',
        answers_json: answers
      };
      const { data, error } = await supabase.from('submissions').insert([payload]).select();
      return { success: !error, data: data?.[0] };
    }
  } catch (e) {
    console.error('saveHomeworkDraft Supabase error:', e);
  }
  return { success: true, localOnly: true };
}

export async function submitHomeworkToSupabase(submission) {
  try {
    const studentId = submission.studentId;
    const lessonId = submission.lessonId;
    const answers = {
      ...(submission.answers || {}),
      submission_state: 'submitted',
      submitted_at: new Date().toISOString()
    };

    // Remove local draft so next time it relies on submitted server state
    clearLocalDraft(studentId, lessonId);

    const { data: existing } = await supabase
      .from('submissions')
      .select('id')
      .eq('student_id', studentId)
      .eq('lesson_id', lessonId)
      .limit(1);

    if (existing && existing.length > 0) {
      const existingId = existing[0].id;
      const { data, error } = await supabase
        .from('submissions')
        .update({
          student_name: submission.studentName,
          status: 'pending',
          submitted_at: new Date().toISOString(),
          answers_json: answers,
          total_score: null,
          teacher_comment: null
        })
        .eq('id', existingId)
        .select();

      if (!error) return { success: true, data: data?.[0] };
    } else {
      const payload = {
        id: submission.id || `sub-${Date.now()}`,
        lesson_id: lessonId,
        student_id: studentId,
        student_name: submission.studentName,
        status: 'pending',
        submitted_at: new Date().toISOString(),
        answers_json: answers
      };
      const { data, error } = await supabase.from('submissions').insert([payload]).select();
      if (!error) return { success: true, data: data?.[0] };
    }
  } catch (e) {
    console.error('Supabase submission error:', e);
  }
  return { success: false };
}

export async function fetchSubmissions() {
  const { data, error } = await supabase
    .from('submissions')
    .select('*, lessons(title)')
    .order('submitted_at', { ascending: false });

  if (error) return { data: [], error: error.message };
  return {
    data: (data || []).map((item) => {
      const answers = item.answers_json || {};
      const submissionState = answers.submission_state || (item.status === 'graded' ? 'graded' : 'submitted');
      return {
        id: item.id,
        lessonId: item.lesson_id,
        lessonTitle: item.lessons?.title || answers.lessonTitle || 'Bài học',
        studentId: item.student_id,
        studentName: item.student_name,
        studentAvatar: item.student_name?.slice(0, 1) || '学',
        submittedAt: item.submitted_at ? new Date(item.submitted_at).toLocaleString('vi-VN') : '',
        status: item.status,
        submissionState,
        totalScore: item.total_score,
        answers,
        teacherComment: item.teacher_comment || '',
        redoNote: answers.redo_note || '',
        isDirectGraded: !!answers.direct_graded
      };
    }),
    error: null
  };
}

export async function gradeSubmission(submissionId, totalScore, teacherComment) {
  try {
    const { data: existing } = await supabase
      .from('submissions')
      .select('answers_json')
      .eq('id', submissionId)
      .single();

    const updatedAnswers = {
      ...(existing?.answers_json || {}),
      submission_state: 'graded',
      graded_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('submissions')
      .update({
        total_score: totalScore,
        teacher_comment: teacherComment,
        status: 'graded',
        answers_json: updatedAnswers
      })
      .eq('id', submissionId);

    return error ? { success: false, error: error.message } : { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

export async function requestRedoSubmission(submissionId, redoNote) {
  try {
    const { data: existing } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (!existing) return { success: false, error: 'Không tìm thấy bài nộp' };

    const updatedAnswers = {
      ...(existing.answers_json || {}),
      submission_state: 'redo_requested',
      redo_note: redoNote || 'Cô giáo yêu cầu em làm lại bài tập này nhé.',
      redo_requested_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('submissions')
      .update({
        answers_json: updatedAnswers,
        status: 'pending',
        teacher_comment: redoNote ? `[Yêu cầu làm lại]: ${redoNote}` : existing.teacher_comment
      })
      .eq('id', submissionId)
      .select();

    return error ? { success: false, error: error.message } : { success: true, data: data?.[0] };
  } catch (e) {
    console.error('requestRedoSubmission error:', e);
    return { success: false, error: e.message };
  }
}

export async function directGradeUnsubmittedLesson({ studentId, studentName, lessonId, lessonTitle, totalScore, teacherComment }) {
  try {
    const { data: existing } = await supabase
      .from('submissions')
      .select('id, answers_json')
      .eq('student_id', studentId)
      .eq('lesson_id', lessonId)
      .limit(1);

    const answers = {
      ...(existing?.[0]?.answers_json || {}),
      submission_state: 'graded',
      direct_graded: true,
      graded_at: new Date().toISOString(),
      lessonTitle: lessonTitle || 'Bài học'
    };

    if (existing && existing.length > 0) {
      const { data, error } = await supabase
        .from('submissions')
        .update({
          status: 'graded',
          total_score: parseFloat(totalScore),
          teacher_comment: teacherComment || '',
          answers_json: answers
        })
        .eq('id', existing[0].id)
        .select();

      return error ? { success: false, error: error.message } : { success: true, data: data?.[0] };
    } else {
      const payload = {
        id: `sub-direct-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        lesson_id: lessonId,
        student_id: studentId,
        student_name: studentName,
        status: 'graded',
        total_score: parseFloat(totalScore),
        teacher_comment: teacherComment || '',
        answers_json: answers
      };

      const { data, error } = await supabase.from('submissions').insert([payload]).select();
      return error ? { success: false, error: error.message } : { success: true, data: data?.[0] };
    }
  } catch (e) {
    console.error('directGradeUnsubmittedLesson error:', e);
    return { success: false, error: e.message };
  }
}

// ==========================================
// 7. STREAKS & COMMUNITY
const getLocalStreakKey = (userId) => `hanzify_streak_${userId || 'guest'}`;

export function getLocalStreak(userId) {
  try {
    const raw = localStorage.getItem(getLocalStreakKey(userId));
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading local streak:', e);
  }
  return null;
}

export function saveLocalStreak(userId, streakObj) {
  try {
    localStorage.setItem(getLocalStreakKey(userId), JSON.stringify(streakObj));
  } catch (e) {
    console.error('Error saving local streak:', e);
  }
}

export async function fetchUserStreak(userId) {
  const local = getLocalStreak(userId);
  const today = new Date().toISOString().slice(0, 10);

  if (!userId) {
    const currentStreak = local?.currentStreak || 0;
    const longestStreak = local?.longestStreak || currentStreak;
    const checkedInToday = local?.lastCheckIn === today;
    return {
      data: {
        currentStreak,
        longestStreak,
        totalXp: local?.totalXp || 0,
        checkedInToday,
        lastCheckIn: local?.lastCheckIn || null,
        weekDays: generateCurrentWeekDays(currentStreak, checkedInToday),
        milestones: formatStreakMilestones(currentStreak)
      },
      error: null
    };
  }

  try {
    const { data, error } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!error && data) {
      const checkedInToday = data.last_check_in === today;
      const currentStreak = data.current_streak || 0;
      const longestStreak = data.longest_streak || currentStreak;
      const totalXp = data.total_xp || 0;
      const streakResult = {
        currentStreak,
        longestStreak,
        totalXp,
        checkedInToday,
        lastCheckIn: data.last_check_in,
        weekDays: generateCurrentWeekDays(currentStreak, checkedInToday),
        milestones: formatStreakMilestones(currentStreak)
      };
      saveLocalStreak(userId, streakResult);
      return { data: streakResult, error: null };
    }
  } catch (e) {
    console.warn('Supabase fetchUserStreak warning, using local fallback:', e);
  }

  // Fallback to local cached data
  const currentStreak = local?.currentStreak || 0;
  const longestStreak = local?.longestStreak || currentStreak;
  const checkedInToday = local?.lastCheckIn === today;
  return {
    data: {
      currentStreak,
      longestStreak,
      totalXp: local?.totalXp || 0,
      checkedInToday,
      lastCheckIn: local?.lastCheckIn || null,
      weekDays: generateCurrentWeekDays(currentStreak, checkedInToday),
      milestones: formatStreakMilestones(currentStreak)
    },
    error: null
  };
}

export async function checkInUser(userId) {
  const currentRes = await fetchUserStreak(userId);
  const current = currentRes.data || { currentStreak: 0, longestStreak: 0, totalXp: 0 };
  const today = new Date().toISOString().slice(0, 10);

  if (current.checkedInToday) {
    return { success: true, data: current };
  }

  const nextStreak = (current.currentStreak || 0) + 1;
  const longestStreak = Math.max(nextStreak, current.longestStreak || 0);
  const totalXp = (current.totalXp || 0) + 50;

  const updatedData = {
    currentStreak: nextStreak,
    longestStreak,
    totalXp,
    checkedInToday: true,
    lastCheckIn: today,
    weekDays: generateCurrentWeekDays(nextStreak, true),
    milestones: formatStreakMilestones(nextStreak)
  };

  // Always save locally first so check-in is instantaneous and reliable
  saveLocalStreak(userId, updatedData);

  // Sync to Supabase in background
  if (userId) {
    try {
      const payload = {
        user_id: userId,
        current_streak: nextStreak,
        longest_streak: longestStreak,
        last_check_in: today,
        total_xp: totalXp,
        updated_at: new Date().toISOString()
      };
      const { error } = await supabase.from('user_streaks').upsert(payload, { onConflict: 'user_id' });
      if (error) {
        console.warn('Supabase streak sync error (persisted locally):', error.message);
      }
    } catch (e) {
      console.warn('Supabase streak upsert exception (persisted locally):', e);
    }
  }

  return { success: true, data: updatedData };
}

export async function addGameRewardXp(userId, xpToAdd, { gameId = '', gameTitle = '', level = 'HSK 1' } = {}) {
  const points = Math.max(0, parseInt(xpToAdd, 10) || 0);
  if (points <= 0) {
    return { success: false, error: 'Số điểm thưởng không hợp lệ.' };
  }

  const currentRes = await fetchUserStreak(userId);
  const current = currentRes.data || { currentStreak: 0, longestStreak: 0, totalXp: 0 };
  const currentTotal = Number(current.totalXp) || 0;
  const nextTotalXp = currentTotal + points;

  const today = new Date().toISOString().slice(0, 10);
  const updatedData = {
    ...current,
    totalXp: nextTotalXp
  };

  // Always persist locally first so UI updates immediately
  saveLocalStreak(userId, updatedData);

  // Sync to Supabase in background
  if (userId) {
    try {
      const payload = {
        user_id: userId,
        current_streak: current.currentStreak || 0,
        longest_streak: current.longestStreak || (current.currentStreak || 0),
        last_check_in: current.lastCheckIn || today,
        total_xp: nextTotalXp,
        updated_at: new Date().toISOString()
      };
      const { error } = await supabase.from('user_streaks').upsert(payload, { onConflict: 'user_id' });
      if (error) {
        console.warn('Supabase game reward streak sync warning:', error.message);
      }
    } catch (e) {
      console.warn('Supabase game reward streak sync exception:', e);
    }
  }

  return { success: true, data: updatedData, earnedXp: points, gameTitle, level };
}

const formatForumPost = (post) => ({
  id: post.id, category: post.category, title: post.title, content: post.content,
  author: { name: post.author_name, avatar: post.author_avatar, role: post.author_role },
  createdAt: new Date(post.created_at).toLocaleString('vi-VN'), likesCount: post.likes_count || 0,
  status: post.status, tags: post.tags || [], comments: (post.forum_comments || []).map((comment) => ({
    id: comment.id,
    author: { name: comment.author_name, avatar: comment.author_avatar, role: comment.author_role },
    content: comment.content, createdAt: new Date(comment.created_at).toLocaleString('vi-VN'),
    isTeacherAnswer: comment.is_teacher_answer, likesCount: comment.likes_count || 0
  }))
});

export async function fetchForumPosts() {
  const { data, error } = await supabase.from('forum_posts').select('*, forum_comments(*)').order('created_at', { ascending: false });
  return error ? { data: [], error: error.message } : { data: (data || []).map(formatForumPost), error: null };
}

export async function createForumPost(post, user) {
  const payload = { id: post.id, user_id: user.id, author_name: user.name, author_avatar: user.avatar || '安', author_role: user.role, category: post.category, title: post.title, content: post.content, tags: post.tags, likes_count: 0, status: 'pending' };
  const { error } = await supabase.from('forum_posts').insert(payload);
  return error ? { success: false, error: error.message } : { success: true };
}

export async function createForumComment(postId, comment, user) {
  const { error } = await supabase.from('forum_comments').insert({ id: comment.id, post_id: postId, user_id: user.id, author_name: user.name, author_avatar: user.avatar || '安', author_role: user.role, content: comment.content, is_teacher_answer: comment.isTeacherAnswer });
  return error ? { success: false, error: error.message } : { success: true };
}

export async function updateForumPost(postId, changes) {
  const payload = {};
  if (changes.status !== undefined) payload.status = changes.status;
  if (changes.likesCount !== undefined) payload.likes_count = changes.likesCount;
  const { error } = await supabase.from('forum_posts').update(payload).eq('id', postId);
  return error ? { success: false, error: error.message } : { success: true };
}
