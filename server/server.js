import express from 'express';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { db, initDatabase } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://vwuikidgncknuozufiyi.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_Tl4-IAKBx5KT9d2CiL8tog_fzEq4qc2';
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Initialize SQLite DB as local backup
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
// 1. AUTH & USER ROLES (Admin, Teacher, Student)
// ==========================================
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Vui lòng cung cấp email và mật khẩu' });
  }

  const user = db.prepare('SELECT id, email, password, full_name, chinese_name, role, avatar, phone FROM users WHERE email = ?').get(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Email hoặc mật khẩu không chính xác' });
  }

  const { password: _, ...safeUser } = user;
  res.json({
    user: safeUser,
    token: `hanzify-token-${user.id}-${Date.now()}`
  });
});

app.get('/api/auth/users', (req, res) => {
  // Admin & Teacher get user lists
  const users = db.prepare('SELECT id, email, full_name, chinese_name, role, avatar, phone, created_at FROM users').all();
  res.json(users);
});

// Admin creates or changes user role
app.post('/api/auth/users', (req, res) => {
  const { email, password, full_name, chinese_name, role, phone } = req.body;
  if (!email || !password || !full_name || !role) {
    return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
  }
  const id = `user-${Date.now()}`;
  try {
    db.prepare(`
      INSERT INTO users (id, email, password, full_name, chinese_name, role, phone)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, email, password, full_name, chinese_name || null, role, phone || null);
    res.json({ message: 'Tạo tài khoản thành công', id });
  } catch (err) {
    res.status(400).json({ error: 'Email đã tồn tại hoặc dữ liệu không hợp lệ' });
  }
});

// ==========================================
// 2. COURSES & LESSONS
// ==========================================
app.get('/api/courses', (req, res) => {
  const courses = db.prepare('SELECT * FROM courses').all();
  const lessons = db.prepare('SELECT * FROM lessons ORDER BY number ASC').all();

  const coursesWithLessons = courses.map((c) => ({
    ...c,
    lessons: lessons.filter((l) => l.course_id === c.id)
  }));
  res.json(coursesWithLessons);
});

app.get('/api/lessons/:id/questions', (req, res) => {
  const questions = db.prepare('SELECT * FROM homework_questions WHERE lesson_id = ? ORDER BY sort_order ASC').all(req.params.id);
  const parsed = questions.map((q) => ({
    ...q,
    data: JSON.parse(q.data_json)
  }));
  res.json(parsed);
});

// ==========================================
// 3. SUBMISSIONS & SPEED GRADING (Teacher & Student)
// ==========================================
app.post(
  '/api/submissions',
  upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'image', maxCount: 1 }
  ]),
  (req, res) => {
    try {
      const {
        lesson_id,
        student_id,
        student_name,
        answers_json
      } = req.body;

      const subId = `sub-${Date.now()}-${Math.round(Math.random() * 1000)}`;

      let parsedAnswers = {};
      try {
        parsedAnswers = typeof answers_json === 'string' ? JSON.parse(answers_json) : answers_json;
      } catch (e) {
        parsedAnswers = {};
      }

      // Attach uploaded files paths
      if (req.files?.audio?.[0]) {
        parsedAnswers.audio_url = `/uploads/audio/${req.files.audio[0].filename}`;
      }
      if (req.files?.image?.[0]) {
        parsedAnswers.image_url = `/uploads/images/${req.files.image[0].filename}`;
      }

      db.prepare(`
        INSERT INTO submissions (id, lesson_id, student_id, student_name, status, answers_json)
        VALUES (?, ?, ?, ?, 'pending', ?)
      `).run(subId, lesson_id || 'lesson-4', student_id || 'user-student-1', student_name || 'Học viên', JSON.stringify(parsedAnswers));

      res.json({
        success: true,
        message: 'Nộp bài tập thành công!',
        submissionId: subId,
        answers: parsedAnswers
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Không thể lưu bài nộp: ' + err.message });
    }
  }
);

app.get('/api/submissions', (req, res) => {
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
});

// Teacher Speed Grading endpoint
app.put('/api/submissions/:id/grade', (req, res) => {
  const { total_score, teacher_comment, teacher_audio_feedback } = req.body;
  try {
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

// ==========================================
// 4. LISTENING DRILLS
// ==========================================
app.get('/api/listening', (req, res) => {
  const drills = db.prepare('SELECT * FROM listening_drills').all();
  const parsed = drills.map((d) => ({
    ...d,
    options: JSON.parse(d.options_json)
  }));
  res.json(parsed);
});

// ==========================================
// 5. MOCK EXAMS (HSK Simulation)
// ==========================================
app.get('/api/exams', (req, res) => {
  const exams = db.prepare('SELECT * FROM mock_exams').all();
  res.json(exams);
});

app.get('/api/exams/:id', (req, res) => {
  const exam = db.prepare('SELECT * FROM mock_exams WHERE id = ?').get(req.params.id);
  if (!exam) return res.status(404).json({ error: 'Không tìm thấy đề thi' });

  const questions = db.prepare('SELECT * FROM exam_questions WHERE exam_id = ? ORDER BY question_number ASC').all(req.params.id);
  const parsedQuestions = questions.map((q) => ({
    ...q,
    options: q.options_json ? JSON.parse(q.options_json) : []
  }));

  res.json({
    ...exam,
    questions: parsedQuestions
  });
});

app.post('/api/exams/:id/submit', (req, res) => {
  const { student_id, student_name, answers } = req.body;
  const examId = req.params.id;

  const questions = db.prepare('SELECT * FROM exam_questions WHERE exam_id = ?').all(examId);

  let listeningCorrect = 0;
  let readingCorrect = 0;
  let totalListening = 0;
  let totalReading = 0;

  questions.forEach((q) => {
    const studentChoice = answers[q.id];
    const isCorrect = studentChoice === q.correct_answer;
    if (q.section === 'listening') {
      totalListening++;
      if (isCorrect) listeningCorrect++;
    } else {
      totalReading++;
      if (isCorrect) readingCorrect++;
    }
  });

  // Scale to 100 points per section (HSK Standard: Total 200)
  const listeningScore = totalListening > 0 ? Math.round((listeningCorrect / totalListening) * 100) : 0;
  const readingScore = totalReading > 0 ? Math.round((readingCorrect / totalReading) * 100) : 0;
  const totalScore = listeningScore + readingScore;
  const isPassed = totalScore >= 120; // HSK Passing threshold: 120/200 (60%)

  const resultId = `result-${Date.now()}`;
  db.prepare(`
    INSERT INTO exam_results (id, exam_id, student_id, student_name, listening_score, reading_score, total_score, is_passed, answers_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(resultId, examId, student_id || 'user-student-1', student_name || 'Học viên', listeningScore, readingScore, totalScore, isPassed ? 1 : 0, JSON.stringify(answers));

  res.json({
    success: true,
    resultId,
    listeningScore,
    readingScore,
    totalScore,
    isPassed,
    listeningCorrect,
    totalListening,
    readingCorrect,
    totalReading
  });
});

// ==========================================
// 6. SUPABASE STATUS & MIGRATION HELPER
// ==========================================
app.get('/api/supabase/status', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    if (error) {
      return res.json({
        connected: false,
        message: error.message,
        tableExists: !error.message.includes('Could not find')
      });
    }
    res.json({ connected: true, message: 'Đã kết nối thành công tới Supabase Database!', tableExists: true });
  } catch (err) {
    res.json({ connected: false, message: err.message, tableExists: false });
  }
});

app.get('/api/supabase/schema', (req, res) => {
  const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    const content = fs.readFileSync(schemaPath, 'utf8');
    res.type('text/plain').send(content);
  } else {
    res.status(404).send('-- Schema file not found');
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Hanzify Backend Server running on http://localhost:${PORT}`);
  console.log(`📦 Database: SQLite (server/hanzify.db)`);
  console.log(`📁 File Uploads: server/uploads/ (audio & images)`);
  console.log(`====================================================`);
});
