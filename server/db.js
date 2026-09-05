import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directories exist
const uploadsDir = path.join(__dirname, 'uploads');
const audioDir = path.join(uploadsDir, 'audio');
const imagesDir = path.join(uploadsDir, 'images');

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

const dbPath = path.join(__dirname, 'hanzify.db');
export const db = new Database(dbPath);

// Enable WAL mode for high performance
db.pragma('journal_mode = WAL');

export function initDatabase() {
  // 1. Users table (Admin, Teacher, Student)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      full_name TEXT NOT NULL,
      chinese_name TEXT,
      role TEXT CHECK(role IN ('admin', 'teacher', 'student')) NOT NULL,
      avatar TEXT,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      chinese_title TEXT,
      level TEXT NOT NULL,
      teacher_name TEXT NOT NULL,
      description TEXT,
      cover_gradient TEXT,
      char_watermark TEXT,
      total_lessons INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS lessons (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL,
      number TEXT NOT NULL,
      title TEXT NOT NULL,
      deadline TEXT,
      status TEXT DEFAULT 'active',
      questions_count INTEGER DEFAULT 5,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS homework_questions (
      id TEXT PRIMARY KEY,
      lesson_id TEXT NOT NULL,
      sort_order INTEGER DEFAULT 1,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      tag TEXT,
      instruction TEXT,
      data_json TEXT NOT NULL,
      FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS classrooms (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      teacher_id TEXT,
      teacher_name TEXT NOT NULL,
      level TEXT NOT NULL,
      schedule TEXT,
      time_slot TEXT,
      course_ids_json TEXT,
      students_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS submissions (
      id TEXT PRIMARY KEY,
      lesson_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      student_name TEXT NOT NULL,
      total_score REAL,
      status TEXT CHECK(status IN ('pending', 'graded')) DEFAULT 'pending',
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      teacher_comment TEXT,
      teacher_audio_feedback TEXT,
      answers_json TEXT,
      FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  seedData();
}

export function seedData(force = false) {
  // Check if target accounts exist
  const existingGiaovien = db.prepare("SELECT * FROM users WHERE username = 'giaovien01' OR email = 'giaovien01@hanzify.com'").get();
  
  if (existingGiaovien && !force) {
    return; // Already initialized with required structure
  }

  console.log('🔄 Seeding clean database for Hanzify (HSK 1, 2, 3 & Required Accounts)...');

  // Clear existing records to ensure completely clean state
  db.exec(`
    DELETE FROM submissions;
    DELETE FROM homework_questions;
    DELETE FROM lessons;
    DELETE FROM classrooms;
    DELETE FROM courses;
    DELETE FROM users;
  `);

  // 1. Seed 3 Users (Password: 123456)
  const insertUser = db.prepare(`
    INSERT INTO users (id, username, email, password, full_name, chinese_name, role, avatar, phone)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertUser.run(
    'user-admin',
    'admin',
    'admin@hanzify.com',
    '123456',
    'Nguyễn Phúc Long (Admin)',
    '龙老师',
    'admin',
    '👑',
    '0901234567'
  );

  insertUser.run(
    'user-teacher',
    'giaovien01',
    'giaovien01@hanzify.com',
    '123456',
    'Cô Hoài (Giáo Viên 01)',
    '怀老师',
    'teacher',
    '怀',
    '0987654321'
  );

  // 2. Seed 3 Courses (HSK 1, HSK 2, HSK 3)
  const insertCourse = db.prepare(`
    INSERT INTO courses (id, title, chinese_title, level, teacher_name, description, cover_gradient, char_watermark, total_lessons)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertCourse.run(
    'course-hsk1',
    'Tiếng Trung Căn Bản HSK 1 (Bắt Đầu Từ Số 0)',
    'HSK 1 基础汉语',
    'HSK 1',
    'Cô Hoài (Giáo Viên 01)',
    'Làm quen bảng chữ cái Pinyin, 4 thanh điệu, quy tắc bút thuận chữ Hán và 150 từ vựng cốt lõi.',
    'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    '一',
    1
  );

  insertCourse.run(
    'course-hsk2',
    'Tiếng Trung Sơ Cấp HSK 2: Đời Sống & Mua Sắm',
    'HSK 2 初级汉语',
    'HSK 2',
    'Cô Hoài (Giáo Viên 01)',
    'Nắm vững 300 từ vựng và 45 mẫu câu đời sống: hỏi giá, số đếm, phương hướng và sinh hoạt hằng ngày.',
    'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 100%)',
    '二',
    1
  );

  insertCourse.run(
    'course-hsk3',
    'Tiếng Trung Trung Cấp HSK 3: Giao Tiếp Toàn Diện',
    'HSK 3 中级汉语',
    'HSK 3',
    'Cô Hoài (Giáo Viên 01)',
    'Nắm vững 600 từ vựng HSK 3, tự tin giao tiếp trong học tập, công việc và du lịch.',
    'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
    '三',
    1
  );

  // 3. Seed starter lesson for each course
  const insertLesson = db.prepare(`
    INSERT INTO lessons (id, course_id, number, title, deadline, status, questions_count)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertLesson.run(
    'lesson-hsk1-1',
    'course-hsk1',
    '01',
    'Bài 01: Chào hỏi & Làm quen (你好)',
    '23:59 Chủ Nhật',
    'active',
    5
  );

  insertLesson.run(
    'lesson-hsk2-1',
    'course-hsk2',
    '01',
    'Bài 01: Đi Mua Sắm & Hỏi Giá (买东西)',
    '23:59 Chủ Nhật',
    'active',
    5
  );

  insertLesson.run(
    'lesson-hsk3-1',
    'course-hsk3',
    '01',
    'Bài 01: Kế Hoạch Cuối Tuần (周末的打算)',
    '23:59 Chủ Nhật',
    'active',
    5
  );

  // 4. Seed sample homework questions for lesson-hsk2-1 (ready for editing & live preview)
  const insertQuestion = db.prepare(`
    INSERT INTO homework_questions (id, lesson_id, sort_order, type, title, tag, instruction, data_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const sampleQuestions = [
    {
      id: 'q-hsk2-1-1',
      lesson_id: 'lesson-hsk2-1',
      sort_order: 1,
      type: 'listening',
      title: 'Luyện Nghe: Hỏi giá hoa quả',
      tag: 'Nghe hiểu',
      instruction: 'Nghe đoạn audio và chọn mức giá chính xác:',
      data: {
        audioText: '苹果多少钱一斤？五块钱一斤。',
        hint: 'Chú ý nghe số từ chỉ giá tiền (五 vs 两).',
        options: [
          { id: 'A', hanzi: '五块钱一斤', pinyin: 'wǔ kuài qián yì jīn', meaning: '5 tệ một cân', isCorrect: true },
          { id: 'B', hanzi: '两块钱一斤', pinyin: 'liǎng kuài qián yì jīn', meaning: '2 tệ một cân', isCorrect: false }
        ]
      }
    },
    {
      id: 'q-hsk2-1-2',
      lesson_id: 'lesson-hsk2-1',
      sort_order: 2,
      type: 'pinyin',
      title: 'Nhận diện Pinyin & Thanh điệu',
      tag: 'Phát âm',
      instruction: 'Chọn cách đọc Pinyin chuẩn của từ 买东西 (mua sắm):',
      data: {
        hanzi: '买东西',
        meaning: 'Mua sắm',
        options: [
          { id: 'A', text: 'mài dōngxi', isCorrect: false },
          { id: 'B', text: 'mǎi dōngxī', isCorrect: false },
          { id: 'C', text: 'mǎi dōngxi (Thanh nhẹ xi)', isCorrect: true }
        ],
        explanation: 'Từ 东西 khi có nghĩa "đồ vật/mua sắm" thì chữ 西 phát âm thanh nhẹ (khinh thanh).'
      }
    },
    {
      id: 'q-hsk2-1-3',
      lesson_id: 'lesson-hsk2-1',
      sort_order: 3,
      type: 'word_order',
      title: 'Ghép câu hoàn chỉnh',
      tag: 'Ngữ pháp',
      instruction: 'Sắp xếp các thẻ từ sau thành câu có nghĩa hoàn chỉnh:',
      data: {
        chips: [
          { id: 'w1', word: '这件衣服', pinyin: 'zhè jiàn yīfu' },
          { id: 'w2', word: '有点儿', pinyin: 'yǒudiǎnr' },
          { id: 'w3', word: '贵', pinyin: 'guì' },
          { id: 'w4', word: '。', pinyin: '' }
        ],
        correctOrder: ['w1', 'w2', 'w3', 'w4'],
        meaning: 'Bộ quần áo này hơi đắt một chút.'
      }
    },
    {
      id: 'q-hsk2-1-4',
      lesson_id: 'lesson-hsk2-1',
      sort_order: 4,
      type: 'voice',
      title: 'Luyện nói & Ghi âm phát âm',
      tag: 'Khẩu ngữ',
      instruction: 'Bật micro thu âm đọc to và chuẩn ngữ điệu câu sau:',
      data: {
        text: '老板，这件衣服太贵了，便宜一点儿吧！',
        pinyin: 'Lǎobǎn, zhè jiàn yīfu tài guì le, piányi yìdiǎnr ba!',
        meaning: 'Ông chủ ơi, bộ quần áo này đắt quá, bớt một chút đi!'
      }
    },
    {
      id: 'q-hsk2-1-5',
      lesson_id: 'lesson-hsk2-1',
      sort_order: 5,
      type: 'writing',
      title: 'Nộp vở viết chữ Hán ô Mễ',
      tag: 'Viết chữ',
      instruction: 'Viết chữ 贵 (guì - đắt) và 便宜 (piányi - rẻ) vào vở ô Mễ, sau đó chụp ảnh tải lên:',
      data: {
        char: '贵',
        pinyin: 'guì',
        strokes: 9,
        radicals: '贝 (Bối)'
      }
    }
  ];

  for (const q of sampleQuestions) {
    insertQuestion.run(
      q.id,
      q.lesson_id,
      q.sort_order,
      q.type,
      q.title,
      q.tag,
      q.instruction,
      JSON.stringify(q.data)
    );
  }

  console.log('✅ Clean database initialized successfully with HSK 1, 2, 3 and 3 accounts!');
}
