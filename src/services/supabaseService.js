import { supabase } from '../lib/supabase';

// ==========================================
// FALLBACK INITIAL DATA (Dữ liệu nền an toàn)
// ==========================================
export const FALLBACK_USERS = [
  {
    id: 'user-admin',
    name: 'Nguyễn Phúc Long',
    full_name: 'Nguyễn Phúc Long',
    email: 'admin@hanzify.com',
    role: 'admin',
    chineseName: '龙老师',
    chinese_name: '龙老师',
    phone: '0901 234 567',
    avatar: '👑',
    joinedDate: '04/09/2026',
    status: 'active'
  },
  {
    id: 'user-teacher',
    name: 'Cô Hoài',
    full_name: 'Cô Hoài',
    email: 'hoailaoshi@hanzify.com',
    role: 'teacher',
    chineseName: '怀老师',
    chinese_name: '怀老师',
    phone: '0987 654 321',
    avatar: '怀',
    joinedDate: '15/08/2026',
    status: 'active'
  },
  {
    id: 'user-student-1',
    name: 'Nguyễn Văn An',
    full_name: 'Nguyễn Văn An',
    email: 'student@hanzify.com',
    role: 'student',
    chineseName: '阮文安',
    chinese_name: '阮文安',
    phone: '0911 223 344',
    avatar: '安',
    joinedDate: '20/08/2026',
    status: 'active'
  },
  {
    id: 'user-student-2',
    name: 'Trần Thị Mai',
    full_name: 'Trần Thị Mai',
    email: 'maitran@hanzify.com',
    role: 'student',
    chineseName: '陈氏梅',
    chinese_name: '陈氏梅',
    phone: '0933 445 566',
    avatar: '梅',
    joinedDate: '25/08/2026',
    status: 'active'
  }
];

export const FALLBACK_MATCH_PAIRS = [
  { id: 'p-1', hanzi: '苹果', pinyin: 'píngguǒ', mean: 'Quả táo', category: 'Mua sắm HSK 2' },
  { id: 'p-2', hanzi: '衣服', pinyin: 'yīfu', mean: 'Quần áo', category: 'Mua sắm HSK 2' },
  { id: 'p-3', hanzi: '买', pinyin: 'mǎi', mean: 'Mua', category: 'Động từ căn bản' },
  { id: 'p-4', hanzi: '钱', pinyin: 'qián', mean: 'Tiền', category: 'Mua sắm HSK 2' },
  { id: 'p-5', hanzi: '超市', pinyin: 'chāoshì', mean: 'Siêu thị', category: 'Địa điểm HSK 2' },
  { id: 'p-6', hanzi: '贵', pinyin: 'guì', mean: 'Đắt', category: 'Tính từ HSK 2' }
];

export const FALLBACK_TONE_ITEMS = [
  { id: 't-1', char: '妈', pinyin: 'mā', tone: 1, mean: 'Mẹ' },
  { id: 't-2', char: '国', pinyin: 'guó', tone: 2, mean: 'Quốc gia' },
  { id: 't-3', char: '好', pinyin: 'hǎo', tone: 3, mean: 'Tốt / Đẹp' },
  { id: 't-4', char: '谢', pinyin: 'xiè', tone: 4, mean: 'Cảm ơn' },
  { id: 't-5', char: '喝', pinyin: 'hē', tone: 1, mean: 'Uống' },
  { id: 't-6', char: '来', pinyin: 'lái', tone: 2, mean: 'Đến' },
  { id: 't-7', char: '买', pinyin: 'mǎi', tone: 3, mean: 'Mua' },
  { id: 't-8', char: '去', pinyin: 'qù', tone: 4, mean: 'Đi' }
];

export const FALLBACK_LEADERBOARD = [
  { id: 'lb-1', rank: 1, name: 'Nguyễn Minh Anh', user_name: 'Nguyễn Minh Anh', role: 'Học viên', score: 820, game: 'Thử Thách Thanh Điệu', streak: 'Combo x8', date: 'Hôm nay' },
  { id: 'lb-2', rank: 2, name: 'Trần Thị Mai', user_name: 'Trần Thị Mai', role: 'Học viên', score: 740, game: 'Lật Thẻ Ghép Đôi', streak: '14 Lượt lật', date: 'Hôm qua' },
  { id: 'lb-3', rank: 3, name: 'Nguyễn Văn An', user_name: 'Nguyễn Văn An', role: 'Học viên', score: 650, game: 'Thử Thách Thanh Điệu', streak: 'Combo x5', date: '02/09' }
];

// In-memory cache for live mutation when DB table is not yet migrated
let localUsers = [...FALLBACK_USERS];
let localMatchPairs = [...FALLBACK_MATCH_PAIRS];
let localToneItems = [...FALLBACK_TONE_ITEMS];
let localLeaderboard = [...FALLBACK_LEADERBOARD];

// ==========================================
// 1. USERS SERVICE (Tài khoản & Phân quyền)
// ==========================================
export async function fetchUsers() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) {
      return { data: localUsers, isLiveDb: false };
    }

    const formatted = data.map((u) => ({
      id: u.id,
      name: u.full_name,
      full_name: u.full_name,
      email: u.email,
      role: u.role,
      chineseName: u.chinese_name,
      chinese_name: u.chinese_name,
      phone: u.phone,
      avatar: u.avatar || '安',
      joinedDate: new Date(u.created_at).toLocaleDateString('vi-VN'),
      status: u.status || 'active'
    }));

    return { data: formatted, isLiveDb: true };
  } catch (err) {
    return { data: localUsers, isLiveDb: false };
  }
}

export async function createSupabaseUser(newUser) {
  const userPayload = {
    id: newUser.id || `user-${Date.now()}`,
    email: newUser.email,
    full_name: newUser.name || newUser.full_name,
    chinese_name: newUser.chineseName || newUser.chinese_name || null,
    role: newUser.role || 'student',
    avatar: newUser.avatar || '安',
    phone: newUser.phone || '0900 000 000',
    status: 'active'
  };

  try {
    const { data, error } = await supabase.from('users').insert([userPayload]).select();
    if (!error && data && data.length > 0) {
      return { success: true, user: data[0], isLiveDb: true };
    }
  } catch (e) {
    console.warn('Supabase insert user fallback:', e);
  }

  // Local fallback
  localUsers = [
    ...localUsers,
    {
      ...userPayload,
      name: userPayload.full_name,
      chineseName: userPayload.chinese_name,
      joinedDate: new Date().toLocaleDateString('vi-VN')
    }
  ];
  return { success: true, user: userPayload, isLiveDb: false };
}

// ==========================================
// 2. MINI-GAMES SERVICE (Góc Giải Trí)
// ==========================================

// Game 1: Match Pairs
export async function fetchMatchPairs() {
  try {
    const { data, error } = await supabase
      .from('game_match_pairs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return { data: localMatchPairs, isLiveDb: false };
    }
    return { data, isLiveDb: true };
  } catch (e) {
    return { data: localMatchPairs, isLiveDb: false };
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
    if (!error && data && data.length > 0) {
      return { success: true, pair: data[0], isLiveDb: true };
    }
  } catch (e) {
    console.warn('Supabase addMatchPair fallback:', e);
  }

  localMatchPairs = [payload, ...localMatchPairs];
  return { success: true, pair: payload, isLiveDb: false };
}

export async function deleteMatchPair(id) {
  try {
    await supabase.from('game_match_pairs').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase deleteMatchPair fallback:', e);
  }
  localMatchPairs = localMatchPairs.filter((p) => p.id !== id);
  return { success: true };
}

// Game 2: Tone Items
export async function fetchToneItems() {
  try {
    const { data, error } = await supabase
      .from('game_tone_items')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) {
      return { data: localToneItems, isLiveDb: false };
    }
    return { data, isLiveDb: true };
  } catch (e) {
    return { data: localToneItems, isLiveDb: false };
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
    if (!error && data && data.length > 0) {
      return { success: true, item: data[0], isLiveDb: true };
    }
  } catch (e) {
    console.warn('Supabase addToneItem fallback:', e);
  }

  localToneItems = [...localToneItems, payload];
  return { success: true, item: payload, isLiveDb: false };
}

export async function deleteToneItem(id) {
  try {
    await supabase.from('game_tone_items').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase deleteToneItem fallback:', e);
  }
  localToneItems = localToneItems.filter((t) => t.id !== id);
  return { success: true };
}

// Game Leaderboard
export async function fetchLeaderboard() {
  try {
    const { data, error } = await supabase
      .from('game_leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .limit(10);

    if (error || !data || data.length === 0) {
      return { data: localLeaderboard, isLiveDb: false };
    }
    const formatted = data.map((d, idx) => ({
      ...d,
      rank: idx + 1,
      name: d.user_name,
      date: new Date(d.created_at).toLocaleDateString('vi-VN')
    }));
    return { data: formatted, isLiveDb: true };
  } catch (e) {
    return { data: localLeaderboard, isLiveDb: false };
  }
}

export async function submitGameScore(scoreData) {
  const payload = {
    id: `lb-${Date.now()}`,
    user_name: scoreData.userName || 'Học viên Hanzify',
    role: scoreData.role || 'Học viên',
    score: scoreData.score,
    game: scoreData.game,
    streak: scoreData.streak || 'Chiến thắng'
  };

  try {
    const { data, error } = await supabase.from('game_leaderboard').insert([payload]).select();
    if (!error && data) {
      return { success: true, entry: data[0], isLiveDb: true };
    }
  } catch (e) {
    console.warn('Supabase submitGameScore fallback:', e);
  }

  localLeaderboard = [payload, ...localLeaderboard].sort((a, b) => b.score - a.score);
  return { success: true, entry: payload, isLiveDb: false };
}

// ==========================================
// 3. HOMEWORK SUBMISSIONS & GRADING
// ==========================================
export async function fetchSubmissions() {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error || !data) {
      return { data: [], isLiveDb: false };
    }
    return { data, isLiveDb: true };
  } catch (e) {
    return { data: [], isLiveDb: false };
  }
}

export async function submitHomeworkToSupabase(submission) {
  const payload = {
    id: `sub-${Date.now()}`,
    lesson_id: submission.lessonId || 'lesson-4',
    student_id: submission.studentId || 'user-student-1',
    student_name: submission.studentName || 'Nguyễn Văn An',
    status: 'pending',
    answers_json: submission.answers || {}
  };

  try {
    const { data, error } = await supabase.from('submissions').insert([payload]).select();
    if (!error && data) {
      return { success: true, submission: data[0], isLiveDb: true };
    }
  } catch (e) {
    console.warn('Supabase submission fallback:', e);
  }
  return { success: true, submission: payload, isLiveDb: false };
}

// ==========================================
// 4. COURSES & LESSONS MANAGEMENT (Cô giáo & Admin)
// ==========================================
export async function syncCourseToSupabase(course) {
  const payload = {
    id: course.id,
    title: course.title,
    chinese_title: course.chineseTitle || '',
    level: course.level || 'HSK 2',
    description: course.description || '',
    tag: course.badge || 'Đang mở',
    total_lessons: course.totalLessons || (course.lessons?.length || 1),
    teacher_name: course.teacher || 'Cô Hoài',
    teacher_avatar: '怀'
  };
  try {
    const { data, error } = await supabase
      .from('courses')
      .upsert([payload], { onConflict: 'id' })
      .select();
    if (!error) return { success: true, data };
  } catch (e) {
    console.warn('Supabase course sync fallback:', e);
  }
  return { success: true, fallback: true };
}

export async function deleteCourseFromSupabase(courseId) {
  try {
    await supabase.from('courses').delete().eq('id', courseId);
    return { success: true };
  } catch (e) {
    console.warn('Supabase course delete fallback:', e);
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
    description: lesson.deadline || 'Bài tập rèn luyện',
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
    console.warn('Supabase lesson sync fallback:', e);
  }
  return { success: true, fallback: true };
}

export async function deleteLessonFromSupabase(lessonId) {
  try {
    await supabase.from('lessons').delete().eq('id', lessonId);
    return { success: true };
  } catch (e) {
    console.warn('Supabase lesson delete fallback:', e);
    return { success: false, error: e };
  }
}

// ==========================================
// 5. EXAMS MANAGEMENT (Đề Thi HSK Phân Cấp 4 Tầng)
// ==========================================

/**
 * Đọc tất cả đề thi từ Supabase và lắp ghép thành cấu trúc phân cấp 4 tầng:
 * exams → skills → parts → questions
 */
export async function fetchExams() {
  try {
    // Bước 1: Lấy danh sách đề thi
    const { data: examsData, error: examsError } = await supabase
      .from('exams')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (examsError || !examsData || examsData.length === 0) {
      return { data: null, isLiveDb: false };
    }

    // Bước 2: Lấy tất cả skills, parts, questions cùng lúc
    const examIds = examsData.map((e) => e.id);

    const { data: skillsData } = await supabase
      .from('exam_skills')
      .select('*')
      .in('exam_id', examIds)
      .order('sort_order', { ascending: true });

    const skillIds = (skillsData || []).map((s) => s.id);

    const { data: partsData } = await supabase
      .from('exam_parts')
      .select('*')
      .in('skill_id', skillIds)
      .order('sort_order', { ascending: true });

    const partIds = (partsData || []).map((p) => p.id);

    const { data: questionsData } = await supabase
      .from('exam_questions')
      .select('*')
      .in('part_id', partIds)
      .order('sort_order', { ascending: true });

    // Bước 3: Lắp ghép thành cấu trúc 4 tầng
    const assembled = examsData.map((exam) => {
      const skills = (skillsData || [])
        .filter((s) => s.exam_id === exam.id)
        .map((skill) => {
          const parts = (partsData || [])
            .filter((p) => p.skill_id === skill.id)
            .map((part) => {
              const questions = (questionsData || [])
                .filter((q) => q.part_id === part.id)
                .map((q) => ({
                  id: q.id,
                  questionNumber: q.question_number,
                  prompt: q.prompt,
                  audioText: q.audio_text || '',
                  readingText: q.reading_text || '',
                  pinyin: q.pinyin || '',
                  options: Array.isArray(q.options) ? q.options : (typeof q.options === 'string' ? JSON.parse(q.options) : []),
                  correctAnswer: q.correct_answer,
                  explanation: q.explanation || ''
                }));
              return {
                id: part.id,
                partNumber: part.part_number,
                title: part.title,
                instructions: part.instructions || '',
                questions
              };
            });
          return {
            id: skill.id,
            type: skill.skill_type,
            name: skill.name,
            chineseName: skill.chinese_name || '',
            parts
          };
        });

      return {
        id: exam.id,
        title: exam.title,
        chineseTitle: exam.chinese_title || '',
        level: exam.level,
        duration: exam.duration,
        passingScore: exam.passing_score,
        maxScore: exam.max_score,
        tag: exam.tag || 'Đề tiêu chuẩn',
        description: exam.description || '',
        skills
      };
    });

    return { data: assembled, isLiveDb: true };
  } catch (err) {
    console.warn('fetchExams error:', err);
    return { data: null, isLiveDb: false };
  }
}

/**
 * Đồng bộ một đề thi (toàn bộ 4 tầng) lên Supabase.
 * Dùng upsert cho exam, xóa-và-chèn-lại cho skills/parts/questions để đơn giản hóa.
 */
export async function syncExamToSupabase(exam) {
  try {
    // Tầng 1: Upsert exam
    const { error: examError } = await supabase
      .from('exams')
      .upsert([{
        id: exam.id,
        title: exam.title,
        chinese_title: exam.chineseTitle || '',
        level: exam.level || 'HSK 2',
        duration: exam.duration || 35,
        passing_score: exam.passingScore || 120,
        max_score: exam.maxScore || 200,
        tag: exam.tag || 'Đề tiêu chuẩn',
        description: exam.description || '',
        is_active: true
      }], { onConflict: 'id' });

    if (examError) throw examError;

    // Xóa toàn bộ skills cũ (cascade sẽ xóa luôn parts và questions)
    await supabase.from('exam_skills').delete().eq('exam_id', exam.id);

    // Tầng 2 → 3 → 4: Chèn lại từ đầu
    for (let si = 0; si < (exam.skills || []).length; si++) {
      const skill = exam.skills[si];
      const skillPayload = {
        id: skill.id || `skill-${exam.id}-${si}-${Date.now()}`,
        exam_id: exam.id,
        skill_type: skill.type || 'listening',
        name: skill.name,
        chinese_name: skill.chineseName || '',
        sort_order: si + 1
      };

      await supabase.from('exam_skills').insert([skillPayload]);

      for (let pi = 0; pi < (skill.parts || []).length; pi++) {
        const part = skill.parts[pi];
        const partPayload = {
          id: part.id || `part-${skillPayload.id}-${pi}-${Date.now()}`,
          skill_id: skillPayload.id,
          part_number: part.partNumber || pi + 1,
          title: part.title,
          instructions: part.instructions || '',
          sort_order: pi + 1
        };

        await supabase.from('exam_parts').insert([partPayload]);

        const questionPayloads = (part.questions || []).map((q, qi) => ({
          id: q.id || `eq-${partPayload.id}-${qi}-${Date.now()}`,
          part_id: partPayload.id,
          question_number: q.questionNumber || qi + 1,
          prompt: q.prompt,
          audio_text: q.audioText || '',
          reading_text: q.readingText || '',
          pinyin: q.pinyin || '',
          options: JSON.stringify(q.options || []),
          correct_answer: q.correctAnswer,
          explanation: q.explanation || '',
          sort_order: qi + 1
        }));

        if (questionPayloads.length > 0) {
          await supabase.from('exam_questions').insert(questionPayloads);
        }
      }
    }

    return { success: true, isLiveDb: true };
  } catch (err) {
    console.warn('syncExamToSupabase error:', err);
    return { success: false, isLiveDb: false, error: err };
  }
}

/**
 * Xóa một đề thi khỏi Supabase (cascade tự xóa skills/parts/questions)
 */
export async function deleteExamFromSupabase(examId) {
  try {
    const { error } = await supabase.from('exams').delete().eq('id', examId);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.warn('deleteExamFromSupabase error:', err);
    return { success: false, error: err };
  }
}
