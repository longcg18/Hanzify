import express from 'express';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db, initDatabase, seedData } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize SQLite DB (Create tables and clean seed)
initDatabase();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static uploads
const uploadsDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'audio') {
      cb(null, path.join(uploadsDir, 'audio'));
    } else if (file.fieldname === 'image' || file.fieldname === 'photo') {
      cb(null, path.join(uploadsDir, 'images'));
    } else {
      cb(null, uploadsDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || (file.mimetype.includes('audio') ? '.webm' : '.jpg');
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ storage });

// ==========================================
// 1. AUTHENTICATION (Login with username/email & password)
// ==========================================
app.post('/api/auth/login', (req, res) => {
  const { username, email, password } = req.body;
  const identifier = (username || email || '').trim();

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Vui lòng cung cấp tên đăng nhập/email và mật khẩu' });
  }

  const user = db.prepare(`
    SELECT id, username, email, password, full_name, chinese_name, role, avatar, phone 
    FROM users 
    WHERE username = ? OR email = ?
  `).get(identifier, identifier);

  if (!user || user.password !== password.trim()) {
    return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không chính xác' });
  }

  const { password: _, ...safeUser } = user;
  res.json({
    success: true,
    user: {
      ...safeUser,
      name: safeUser.full_name,
      chineseName: safeUser.chinese_name
    },
    token: `hanzify-token-${user.id}-${Date.now()}`
  });
});

app.get('/api/auth/users', (req, res) => {
  const users = db.prepare('SELECT id, username, email, full_name, chinese_name, role, avatar, phone, created_at FROM users').all();
  res.json(users);
});

// Reset database endpoint (Useful for development & tests)
app.post('/api/system/reset-db', (req, res) => {
  try {
    seedData(true);
    res.json({ success: true, message: 'Đã thiết lập lại dữ liệu sạch thành công!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 2. COURSES & LESSONS (CRUD)
// ==========================================
app.get('/api/courses', (req, res) => {
  try {
    const courses = db.prepare('SELECT * FROM courses ORDER BY created_at ASC').all();
    const lessons = db.prepare('SELECT * FROM lessons ORDER BY number ASC').all();

    const coursesWithLessons = courses.map((c) => ({
      id: c.id,
      title: c.title,
      chineseTitle: c.chinese_title,
      level: c.level,
      teacher: c.teacher_name,
      description: c.description,
      coverGradient: c.cover_gradient,
      charWatermark: c.char_watermark,
      totalLessons: c.total_lessons,
      badge: 'Đang mở',
      lessons: lessons
        .filter((l) => l.course_id === c.id)
        .map((l) => ({
          id: l.id,
          number: l.number,
          title: l.title,
          deadline: l.deadline,
          status: l.status,
          questionsCount: l.questions_count
        }))
    }));

    res.json(coursesWithLessons);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi tải danh sách khóa học: ' + err.message });
  }
});

app.post('/api/courses', (req, res) => {
  try {
    const {
      id,
      title,
      chineseTitle,
      level,
      teacher,
      description,
      coverGradient,
      charWatermark,
      totalLessons
    } = req.body;

    const courseId = id || `course-${Date.now()}`;
    db.prepare(`
      INSERT INTO courses (id, title, chinese_title, level, teacher_name, description, cover_gradient, char_watermark, total_lessons)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      courseId,
      title,
      chineseTitle || null,
      level || 'HSK 1',
      teacher || 'Cô Hoài (Giáo Viên 01)',
      description || '',
      coverGradient || 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      charWatermark || '学',
      totalLessons || 0
    );

    res.json({ success: true, id: courseId, message: 'Tạo khóa học thành công!' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi tạo khóa học: ' + err.message });
  }
});

app.put('/api/courses/:id', (req, res) => {
  try {
    const { title, chineseTitle, level, teacher, description, coverGradient, charWatermark, totalLessons } = req.body;
    db.prepare(`
      UPDATE courses 
      SET title = ?, chinese_title = ?, level = ?, teacher_name = ?, description = ?, cover_gradient = ?, char_watermark = ?, total_lessons = ?
      WHERE id = ?
    `).run(title, chineseTitle, level, teacher, description, coverGradient, charWatermark, totalLessons, req.params.id);

    res.json({ success: true, message: 'Cập nhật khóa học thành công!' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi cập nhật khóa học: ' + err.message });
  }
});

app.delete('/api/courses/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM courses WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Đã xóa khóa học thành công!' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi xóa khóa học: ' + err.message });
  }
});

// Lessons
app.post('/api/courses/:courseId/lessons', (req, res) => {
  try {
    const { courseId } = req.params;
    const { id, number, title, deadline, status, questionsCount } = req.body;
    const lessonId = id || `lesson-${Date.now()}`;

    db.prepare(`
      INSERT INTO lessons (id, course_id, number, title, deadline, status, questions_count)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      lessonId,
      courseId,
      number || '01',
      title,
      deadline || '23:59 Chủ Nhật',
      status || 'active',
      questionsCount || 5
    );

    // Update course total_lessons count
    const count = db.prepare('SELECT COUNT(*) as total FROM lessons WHERE course_id = ?').get(courseId).total;
    db.prepare('UPDATE courses SET total_lessons = ? WHERE id = ?').run(count, courseId);

    res.json({ success: true, id: lessonId, message: 'Thêm bài học mới thành công!' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi thêm bài học: ' + err.message });
  }
});

app.delete('/api/lessons/:id', (req, res) => {
  try {
    const lesson = db.prepare('SELECT course_id FROM lessons WHERE id = ?').get(req.params.id);
    db.prepare('DELETE FROM lessons WHERE id = ?').run(req.params.id);

    if (lesson?.course_id) {
      const count = db.prepare('SELECT COUNT(*) as total FROM lessons WHERE course_id = ?').get(lesson.course_id).total;
      db.prepare('UPDATE courses SET total_lessons = ? WHERE id = ?').run(count, lesson.course_id);
    }

    res.json({ success: true, message: 'Đã xóa bài học thành công!' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi xóa bài học: ' + err.message });
  }
});

// ==========================================
// 3. HOMEWORK QUESTIONS (Fetch & Save for Teacher Live Preview)
// ==========================================
app.get('/api/lessons/:id/questions', (req, res) => {
  try {
    const questions = db.prepare('SELECT * FROM homework_questions WHERE lesson_id = ? ORDER BY sort_order ASC').all(req.params.id);
    const parsed = questions.map((q) => ({
      id: q.id,
      lesson_id: q.lesson_id,
      sort_order: q.sort_order,
      type: q.type,
      title: q.title,
      tag: q.tag,
      instruction: q.instruction,
      data: JSON.parse(q.data_json)
    }));
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi tải câu hỏi bài tập: ' + err.message });
  }
});

// Save/Update full questions list for a lesson (Live editor sync)
app.put('/api/lessons/:id/questions', (req, res) => {
  try {
    const lessonId = req.params.id;
    const { questions } = req.body;

    if (!Array.isArray(questions)) {
      return res.status(400).json({ error: 'Dữ liệu câu hỏi phải là một mảng!' });
    }

    const deleteOld = db.prepare('DELETE FROM homework_questions WHERE lesson_id = ?');
    const insertQuestion = db.prepare(`
      INSERT INTO homework_questions (id, lesson_id, sort_order, type, title, tag, instruction, data_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const transaction = db.transaction((qs) => {
      deleteOld.run(lessonId);
      qs.forEach((q, idx) => {
        const qId = q.id || `q-${lessonId}-${Date.now()}-${idx}`;
        insertQuestion.run(
          qId,
          lessonId,
          idx + 1,
          q.type || 'listening',
          q.title || `Câu hỏi ${idx + 1}`,
          q.tag || 'Luyện tập',
          q.instruction || '',
          JSON.stringify(q.data || {})
        );
      });

      // Update question count in lesson
      db.prepare('UPDATE lessons SET questions_count = ? WHERE id = ?').run(qs.length, lessonId);
    });

    transaction(questions);

    res.json({
      success: true,
      message: `Đã lưu ${questions.length} câu hỏi bài tập vào cơ sở dữ liệu thành công!`,
      count: questions.length
    });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi lưu câu hỏi bài tập: ' + err.message });
  }
});

// ==========================================
// 4. CLASSROOMS (Lớp học trực tuyến)
// ==========================================
app.get('/api/classrooms', (req, res) => {
  try {
    const classrooms = db.prepare('SELECT * FROM classrooms ORDER BY created_at DESC').all();
    const formatted = classrooms.map((c) => ({
      id: c.id,
      code: c.code,
      name: c.name,
      teacherId: c.teacher_id,
      teacherName: c.teacher_name,
      level: c.level,
      schedule: c.schedule,
      timeSlot: c.time_slot,
      courseIds: c.course_ids_json ? JSON.parse(c.course_ids_json) : [],
      students: c.students_json ? JSON.parse(c.students_json) : [],
      createdAt: c.created_at
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi tải danh sách lớp học: ' + err.message });
  }
});

app.post('/api/classrooms', (req, res) => {
  try {
    const {
      id,
      code,
      name,
      teacherId,
      teacherName,
      level,
      schedule,
      timeSlot,
      courseIds,
      students
    } = req.body;

    const classId = id || `class-${Date.now()}`;
    const classCode = (code || `HZ${Math.floor(1000 + Math.random() * 9000)}`).toUpperCase();

    db.prepare(`
      INSERT INTO classrooms (id, code, name, teacher_id, teacher_name, level, schedule, time_slot, course_ids_json, students_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      classId,
      classCode,
      name,
      teacherId || null,
      teacherName || 'Cô Hoài (Giáo Viên 01)',
      level || 'HSK 2',
      schedule || 'T2 - T4 - T6',
      timeSlot || '19:30 - 21:00',
      JSON.stringify(courseIds || []),
      JSON.stringify(students || [])
    );

    res.json({
      success: true,
      classroom: {
        id: classId,
        code: classCode,
        name,
        teacherName: teacherName || 'Cô Hoài (Giáo Viên 01)',
        level,
        schedule,
        timeSlot,
        courseIds: courseIds || [],
        students: students || []
      },
      message: 'Tạo lớp học mới thành công!'
    });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi tạo lớp học: ' + err.message });
  }
});

app.delete('/api/classrooms/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM classrooms WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Đã xóa lớp học thành công!' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi xóa lớp học: ' + err.message });
  }
});

// ==========================================
// 5. SUBMISSIONS (Nộp bài & Chấm điểm)
// ==========================================
app.post(
  '/api/submissions',
  upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'image', maxCount: 1 }
  ]),
  (req, res) => {
    try {
      const { lesson_id, student_id, student_name, answers_json } = req.body;
      const subId = `sub-${Date.now()}-${Math.round(Math.random() * 1000)}`;

      let parsedAnswers = {};
      try {
        parsedAnswers = typeof answers_json === 'string' ? JSON.parse(answers_json) : answers_json;
      } catch (e) {
        parsedAnswers = {};
      }

      if (req.files?.audio?.[0]) {
        parsedAnswers.audio_url = `/uploads/audio/${req.files.audio[0].filename}`;
      }
      if (req.files?.image?.[0]) {
        parsedAnswers.image_url = `/uploads/images/${req.files.image[0].filename}`;
      }

      db.prepare(`
        INSERT INTO submissions (id, lesson_id, student_id, student_name, status, answers_json)
        VALUES (?, ?, ?, ?, 'pending', ?)
      `).run(
        subId,
        lesson_id || 'lesson-hsk2-1',
        student_id || 'user-student-1',
        student_name || 'Học viên',
        JSON.stringify(parsedAnswers)
      );

      res.json({
        success: true,
        message: 'Nộp bài tập thành công!',
        submissionId: subId,
        answers: parsedAnswers
      });
    } catch (err) {
      res.status(500).json({ error: 'Không thể lưu bài nộp: ' + err.message });
    }
  }
);

app.get('/api/submissions', (req, res) => {
  try {
    const { student_id, status } = req.query;
    let query = 'SELECT s.*, l.title as lesson_title FROM submissions s LEFT JOIN lessons l ON s.lesson_id = l.id';
    const params = [];
    const conditions = [];

    if (student_id) {
      conditions.push('s.student_id = ?');
      params.push(student_id);
    }
    if (status) {
      conditions.push('s.status = ?');
      params.push(status);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY s.submitted_at DESC';

    const rows = db.prepare(query).all(...params);
    const result = rows.map((r) => ({
      ...r,
      answers: r.answers_json ? JSON.parse(r.answers_json) : {}
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/submissions/:id/grade', (req, res) => {
  try {
    const { total_score, teacher_comment, teacher_audio_feedback } = req.body;
    db.prepare(`
      UPDATE submissions
      SET total_score = ?, teacher_comment = ?, teacher_audio_feedback = ?, status = 'graded'
      WHERE id = ?
    `).run(total_score, teacher_comment || null, teacher_audio_feedback || null, req.params.id);

    res.json({ success: true, message: 'Đã lưu điểm và nhận xét thành công!' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi chấm điểm: ' + err.message });
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Hanzify Backend Server running on http://localhost:${PORT}`);
  console.log(`📦 Database: SQLite (server/hanzify.db)`);
  console.log(`🔑 Accounts: admin, giaovien01, hocvien01 (pass: 123456)`);
  console.log(`📚 Initial Courses: HSK 1, HSK 2, HSK 3`);
  console.log(`====================================================`);
});
