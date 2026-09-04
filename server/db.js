import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure directories exist
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
      total_lessons INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS lessons (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL,
      number TEXT NOT NULL,
      title TEXT NOT NULL,
      deadline TEXT,
      status TEXT DEFAULT 'active',
      questions_count INTEGER DEFAULT 5,
      FOREIGN KEY (course_id) REFERENCES courses(id)
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
      FOREIGN KEY (lesson_id) REFERENCES lessons(id)
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
      FOREIGN KEY (lesson_id) REFERENCES lessons(id),
      FOREIGN KEY (student_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS listening_drills (
      id TEXT PRIMARY KEY,
      level TEXT NOT NULL,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      audio_text TEXT NOT NULL,
      pinyin TEXT,
      translation TEXT,
      question TEXT NOT NULL,
      options_json TEXT NOT NULL,
      correct_answer INTEGER NOT NULL,
      explanation TEXT
    );

    CREATE TABLE IF NOT EXISTS mock_exams (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      level TEXT NOT NULL,
      chinese_title TEXT,
      duration_minutes INTEGER DEFAULT 35,
      total_questions INTEGER DEFAULT 20,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS exam_questions (
      id TEXT PRIMARY KEY,
      exam_id TEXT NOT NULL,
      section TEXT CHECK(section IN ('listening', 'reading', 'writing')) NOT NULL,
      question_number INTEGER NOT NULL,
      prompt TEXT NOT NULL,
      audio_text TEXT,
      reading_text TEXT,
      pinyin TEXT,
      options_json TEXT,
      correct_answer TEXT NOT NULL,
      explanation TEXT,
      FOREIGN KEY (exam_id) REFERENCES mock_exams(id)
    );

    CREATE TABLE IF NOT EXISTS exam_results (
      id TEXT PRIMARY KEY,
      exam_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      student_name TEXT NOT NULL,
      listening_score REAL DEFAULT 0,
      reading_score REAL DEFAULT 0,
      total_score REAL DEFAULT 0,
      is_passed BOOLEAN DEFAULT 0,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      answers_json TEXT,
      FOREIGN KEY (exam_id) REFERENCES mock_exams(id),
      FOREIGN KEY (student_id) REFERENCES users(id)
    );
  `);

  seedData();
}

function seedData() {
  const userCount = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
  if (userCount > 0) return; // Already seeded

  console.log('Seeding initial data for Hanzify database...');

  // Seed Users
  const insertUser = db.prepare(`
    INSERT INTO users (id, email, password, full_name, chinese_name, role, avatar, phone)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertUser.run(
    'user-admin',
    'admin@hanzify.com',
    'admin123',
    'Nguyễn Phúc Long (Admin)',
    '龙老师',
    'admin',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    '0901234567'
  );

  insertUser.run(
    'user-teacher',
    'hoailaoshi@hanzify.com',
    'teacher123',
    'Cô Hoài',
    '怀老师',
    'teacher',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    '0987654321'
  );

  insertUser.run(
    'user-student-1',
    'student@hanzify.com',
    'student123',
    'Nguyễn Văn An',
    '阮文安',
    'student',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    '0911223344'
  );

  insertUser.run(
    'user-student-2',
    'maitran@hanzify.com',
    'student123',
    'Trần Thị Mai',
    '陈氏梅',
    'student',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    '0933445566'
  );

  // Seed Courses
  const insertCourse = db.prepare(`
    INSERT INTO courses (id, title, chinese_title, level, teacher_name, description, cover_gradient, char_watermark, total_lessons)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertCourse.run(
    'hsk2',
    'HSK 2 Toàn Diện: Đời Sống & Mua Sắm',
    '生活与购物',
    'HSK 2',
    'Cô Hoài',
    'Nắm vững 300 từ vựng và 45 mẫu câu đời sống: hỏi giá, số đếm, phương hướng và sinh hoạt hằng ngày.',
    'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 100%)',
    '买',
    12
  );

  insertCourse.run(
    'hsk1',
    'Tiếng Trung Căn Bản HSK 1 (Bắt Đầu Từ Số 0)',
    '初级汉语',
    'HSK 1',
    'Cô Hoài',
    'Làm quen bảng chữ cái Pinyin, 4 thanh điệu, quy tắc bút thuận chữ Hán và 150 từ vựng cốt lõi.',
    'linear-gradient(135deg, #450a0a 0%, #831843 100%)',
    '文',
    10
  );

  insertCourse.run(
    'speaking',
    'Khẩu Ngữ & Phản Xạ Giao Tiếp HSKK',
    '口语特训',
    'Giao tiếp',
    'Cô Hoài',
    'Chỉnh ngọng thanh 1, thanh 4 và biến âm nửa thanh 3. Luyện nói đoạn văn ngắn tự tin như người bản xứ.',
    'linear-gradient(135deg, #991b1b 0%, #dc2626 100%)',
    '话',
    8
  );

  // Seed Lessons for HSK 2
  const insertLesson = db.prepare(`
    INSERT INTO lessons (id, course_id, number, title, deadline, status, questions_count)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertLesson.run('lesson-1', 'hsk2', '01', 'Chào hỏi & Làm quen (问候与介绍)', 'Đã hoàn thành', 'completed', 5);
  insertLesson.run('lesson-2', 'hsk2', '02', 'Gia đình & Nghề nghiệp (家庭与工作)', 'Đã hoàn thành', 'completed', 5);
  insertLesson.run('lesson-3', 'hsk2', '03', 'Thời gian & Ngày tháng (时间与日期)', 'Đã hoàn thành', 'completed', 5);
  insertLesson.run('lesson-4', 'hsk2', '04', 'Đi Mua Sắm (买东西)', '23:59 Hôm nay', 'active', 7);
  insertLesson.run('lesson-5', 'hsk2', '05', 'Ăn uống tại nhà hàng (在饭馆吃饭)', 'Tuần sau', 'locked', 5);
  insertLesson.run('lesson-6', 'hsk2', '06', 'Hỏi đường & Giao thông (问路与交通)', 'Tuần sau', 'locked', 5);

  // Seed Questions for Lesson 4 (Covering all 7 formats)
  const insertQuestion = db.prepare(`
    INSERT INTO homework_questions (id, lesson_id, sort_order, type, title, tag, instruction, data_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Q1: Nghe audio chọn đáp án
  insertQuestion.run(
    'q4-1',
    'lesson-4',
    1,
    'listening',
    'Câu 1: Luyện Nghe Hiểu (听力理解)',
    'Nghe chọn đáp án',
    'Bấm nút phát bên dưới, lắng nghe đoạn hội thoại mua bán và chọn mức giá chính xác.',
    JSON.stringify({
      audioText: '苹果多少钱一斤？五块钱一斤。',
      pinyin: 'Píngguǒ duōshao qián yì jīn? Wǔ kuài qián yì jīn.',
      vietnamese: 'Táo bao nhiêu tiền một cân? 5 tệ một cân.',
      question: 'Trong đoạn thoại, một cân táo có giá bao nhiêu?',
      options: [
        { id: 'A', text: '两块钱 (2 tệ)' },
        { id: 'B', text: '五块钱 (5 tệ)', isCorrect: true },
        { id: 'C', text: '十块钱 (10 tệ)' },
        { id: 'D', text: '十五块钱 (15 tệ)' }
      ]
    })
  );

  // Q2: Pinyin & Thanh điệu
  insertQuestion.run(
    'q4-2',
    'lesson-4',
    2,
    'pinyin',
    'Câu 2: Nhận Diện Thanh Điệu & Pinyin (声调辨析)',
    'Điền thanh điệu',
    'Chọn thanh điệu chuẩn xác cho từ vựng mang nghĩa "Áo quần / Trang phục".',
    JSON.stringify({
      word: '衣服',
      hanziPrompt: '衣 服',
      vietnamese: 'Quần áo',
      options: [
        { id: 'A', pinyin: 'yī fú', toneNote: 'Thanh 1 + Thanh 2' },
        { id: 'B', pinyin: 'yí fù', toneNote: 'Thanh 2 + Thanh 4' },
        { id: 'C', pinyin: 'yī fu', toneNote: 'Thanh 1 + Thanh nhẹ (Chuẩn)', isCorrect: true },
        { id: 'D', pinyin: 'yì fú', toneNote: 'Thanh 4 + Thanh 2' }
      ]
    })
  );

  // Q3: Ghép câu
  insertQuestion.run(
    'q4-3',
    'lesson-4',
    3,
    'sentence_order',
    'Câu 3: Sắp Xếp Trật Tự Từ (连词成句)',
    'Ngữ pháp sắp xếp',
    'Bấm các thẻ từ bên dưới theo đúng trật tự ngữ pháp để tạo thành câu hoàn chỉnh mang nghĩa: "Bộ quần áo này hơi đắt một chút."',
    JSON.stringify({
      targetTranslation: 'Bộ quần áo này hơi đắt một chút.',
      correctOrder: ['这件衣服', '有点儿', '贵', '。'],
      chips: [
        { id: 'c1', text: '贵', pinyin: 'guì' },
        { id: 'c2', text: '这件衣服', pinyin: 'zhè jiàn yīfu' },
        { id: 'c3', text: '。', pinyin: '' },
        { id: 'c4', text: '有点儿', pinyin: 'yǒudiǎnr' }
      ]
    })
  );

  // Q4: Đọc hiểu linh hoạt (2 đáp án Đúng/Sai, 3 đáp án A/B/C, 4 đáp án A/B/C/D)
  insertQuestion.run(
    'q4-4',
    'lesson-4',
    4,
    'reading_choice',
    'Câu 4: Đọc Hiểu Đoạn Văn & Trắc Nghiệm (阅读理解)',
    'Đọc hiểu đa dạng',
    'Đọc đoạn văn bản ngắn của bạn Vương Minh đi siêu thị mua sắm và trả lời các câu hỏi bên dưới.',
    JSON.stringify({
      passage: '今天星期六，王明去超市买东西。超市里的水果很多，有苹果、香蕉和西瓜。苹果五块钱一斤，很甜；西瓜两块钱一斤。王明买了三斤苹果和一个西瓜，一共花了二十五块钱。',
      pinyinPassage: 'Jīntiān xīngqīliù, Wáng Míng qù chāoshì mǎi dōngxi. Chāoshì lǐ de shuǐguǒ hěn duō, yǒu píngguǒ, xiāngjiāo hé xīguā. Píngguǒ wǔ kuài qián yì jīn, hěn tián; xīguā liǎng kuài qián yì jīn. Wáng Míng mǎi le sān jīn píngguǒ hé yí gè xīguā, yígòng huā le èrshíwǔ kuài qián.',
      subQuestions: [
        {
          id: 'sq-1',
          type: 'true_false',
          prompt: '1. Phán đoán: Siêu thị hôm nay không có dưa hấu (西瓜).',
          options: [
            { id: 'T', text: '对 (Đúng)' },
            { id: 'F', text: '错 (Sai - Có bán dưa hấu)', isCorrect: true }
          ]
        },
        {
          id: 'sq-2',
          type: 'multiple_choice_3',
          prompt: '2. Vương Minh đã mua mấy cân táo?',
          options: [
            { id: 'A', text: '两斤 (2 cân)' },
            { id: 'B', text: '三斤 (3 cân)', isCorrect: true },
            { id: 'C', text: '五斤 (5 cân)' }
          ]
        },
        {
          id: 'sq-3',
          type: 'multiple_choice_4',
          prompt: '3. Tổng số tiền Vương Minh phải trả là bao nhiêu?',
          options: [
            { id: 'A', text: '十五块 (15 tệ)' },
            { id: 'B', text: '二十块 (20 tệ)' },
            { id: 'C', text: '二十五块 (25 tệ)', isCorrect: true },
            { id: 'D', text: '三十块 (30 tệ)' }
          ]
        }
      ]
    })
  );

  // Q5: Thu âm khẩu ngữ
  insertQuestion.run(
    'q4-5',
    'lesson-4',
    5,
    'speaking_audio',
    'Câu 5: Khẩu Ngữ & Thu Âm Phát Âm (口语录音)',
    'Luyện nói thu âm',
    'Bấm nút Micro để ghi âm giọng đọc của bạn cho câu thoại dưới đây để cô giáo nghe và chỉnh thanh điệu.',
    JSON.stringify({
      speechText: '老板，这件红色的衣服太贵了，便宜一点儿吧！',
      pinyinText: 'Lǎobǎn, zhè jiàn hóngsè de yīfu tài guì le, piányi yìdiǎnr ba!',
      vietnameseText: 'Ông chủ ơi, chiếc áo màu đỏ này đắt quá, bớt cho tôi một chút đi!',
      keyFocus: 'Chú ý âm bật hơi p trong "piányi" và thanh 4 dứt khoát của "tài guì".'
    })
  );

  // Q6: Luyện viết 7A - Chép chính tả / Viết tay chụp ảnh
  insertQuestion.run(
    'q4-6',
    'lesson-4',
    6,
    'writing_handwritten',
    'Câu 6: Tập Viết Chữ Hán Chép Chính Tả (汉字书写·手写拍照)',
    '7A - Chép chụp ảnh',
    'Hãy dùng bút mực viết 4 chữ Hán dưới đây vào vở ô điền (mỗi chữ 2 dòng kèm pinyin), sau đó chụp ảnh rõ nét và tải lên nộp bài cho cô.',
    JSON.stringify({
      characters: [
        { char: '买', pinyin: 'mǎi', strokes: 6, meaning: 'Mua (Mãi)' },
        { char: '卖', pinyin: 'mài', strokes: 8, meaning: 'Bán (Mại)' },
        { char: '贵', pinyin: 'guì', strokes: 9, meaning: 'Đắt / Quý' },
        { char: '钱', pinyin: 'qián', strokes: 10, meaning: 'Tiền' }
      ],
      tianzigeNotice: 'Yêu cầu viết đúng thứ tự nét bút, chữ nằm giữa ô điền tự cách (田字格).'
    })
  );

  // Q7: Luyện viết 7B - Viết đoạn văn nhập trực tiếp có đếm ký tự
  insertQuestion.run(
    'q4-7',
    'lesson-4',
    7,
    'writing_essay',
    'Câu 7: Viết Đoạn Văn Ngắn (短文写作·在线输入)',
    '7B - Nhập đoạn văn',
    'Gõ một đoạn văn ngắn (tối thiểu 50 chữ Hán) kể về một lần đi mua sắm gần nhất của bạn bằng chữ Hán.',
    JSON.stringify({
      topic: '我的购物经历 (Trải nghiệm mua sắm của tôi)',
      minCharacters: 50,
      suggestedWords: [
        { word: '超市', pinyin: 'chāoshì', mean: 'siêu thị' },
        { word: '买', pinyin: 'mǎi', mean: 'mua' },
        { word: '苹果', pinyin: 'píngguǒ', mean: 'quả táo' },
        { word: '贵 / 便宜', pinyin: 'guì / piányi', mean: 'đắt / rẻ' },
        { word: '一共', pinyin: 'yígòng', mean: 'tổng cộng' }
      ],
      suggestedGrammar: 'Mẫu câu: 我想买... / ...有点儿贵 / 一共花了...块钱。'
    })
  );

  // Seed sample submissions
  const insertSubmission = db.prepare(`
    INSERT INTO submissions (id, lesson_id, student_id, student_name, total_score, status, submitted_at, teacher_comment, answers_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertSubmission.run(
    'sub-sample-1',
    'lesson-4',
    'user-student-2',
    'Trần Thị Mai',
    null,
    'pending',
    new Date(Date.now() - 3600000 * 2).toISOString(),
    null,
    JSON.stringify({
      q1Answer: 'B',
      q2Answer: 'C',
      q3Words: ['这件衣服', '有点儿', '贵', '。'],
      q4Answers: { 'sq-1': 'F', 'sq-2': 'B', 'sq-3': 'C' },
      q5AudioRecorded: true,
      audioFileName: 'sample_mai_recording.webm',
      q6PhotoUploaded: true,
      photoFileName: 'sample_mai_handwriting.jpg',
      q7EssayText: '上个星期天，我和妈妈去超市买东西。我们买了三斤苹果和两斤香蕉。苹果很甜，不贵。我们一共花了三十块钱，很高兴。',
      q7CharCount: 58
    })
  );

  insertSubmission.run(
    'sub-sample-2',
    'lesson-3',
    'user-student-1',
    'Nguyễn Văn An',
    9.5,
    'graded',
    new Date(Date.now() - 3600000 * 24).toISOString(),
    'Em phát âm thanh 4 rất dứt khoát! Chú ý nét phẩy của chữ 贵 viết dài hơn một chút nhé.',
    JSON.stringify({
      q1Answer: 'B',
      q2Answer: 'C',
      score: 9.5
    })
  );

  // Seed Listening Drills
  const insertListening = db.prepare(`
    INSERT INTO listening_drills (id, level, category, title, audio_text, pinyin, translation, question, options_json, correct_answer, explanation)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertListening.run(
    'list-1',
    'HSK 2',
    'Thanh điệu & Pinyin',
    'Phân biệt Thanh 1 và Thanh 4',
    '妈妈骑马，马慢，妈妈骂马。',
    'Māma qí mǎ, mǎ màn, māma mà mǎ.',
    'Mẹ cưỡi ngựa, ngựa chậm, mẹ mắng ngựa.',
    'Trong câu trên, chữ "骂" (mắng) được phát âm theo thanh điệu nào?',
    JSON.stringify(['Thanh 1 (mā)', 'Thanh 2 (má)', 'Thanh 3 (mǎ)', 'Thanh 4 (mà)']),
    3,
    'Chữ "骂" (mắng) phát âm là "mà" với thanh 4 dứt khoát từ cao xuống thấp.'
  );

  insertListening.run(
    'list-2',
    'HSK 2',
    'Mua sắm & Giá cả',
    'Nghe hỏi giá tiền',
    '这件衣服两百块，有点儿贵，你能便宜五十块吗？',
    'Zhè jiàn yīfu liǎng bǎi kuài, yǒudiǎnr guì, nǐ néng piányi wǔshí kuài ma?',
    'Chiếc áo này 200 tệ, hơi đắt, bạn bớt cho tôi 50 tệ được không?',
    'Khách hàng mong muốn mua chiếc áo với giá bao nhiêu?',
    JSON.stringify(['100 tệ', '150 tệ', '200 tệ', '250 tệ']),
    1,
    'Giá gốc 200 tệ, xin bớt 50 tệ -> Giá mong muốn là 150 tệ (两百减五十 = 一百五十).'
  );

  insertListening.run(
    'list-3',
    'HSK 1',
    'Chào hỏi đời sống',
    'Hẹn gặp lại',
    '明天下午三点我们在学校门口见，好吗？好，明天见！',
    'Míngtiān xiàwǔ sān diǎn wǒmen zài xuéxiào ménkǒu jiàn, hǎo ma? Hǎo, míngtiān jiàn!',
    '3 giờ chiều mai chúng ta gặp nhau ở cổng trường nhé? Được, mai gặp!',
    'Hai người hẹn gặp nhau ở đâu và lúc mấy giờ?',
    JSON.stringify(['3h chiều ở cổng trường', '3h chiều ở quán cà phê', '8h sáng ở trường học', '9h tối ở nhà']),
    0,
    'Từ khóa: "明天下午三点" (3h chiều mai) và "学校门口" (cổng trường).'
  );

  // Seed Mock Exam
  const insertMockExam = db.prepare(`
    INSERT INTO mock_exams (id, title, level, chinese_title, duration_minutes, total_questions, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertMockExam.run(
    'exam-hsk2-01',
    'Đề Thi Thử HSK 2 Chuẩn Quốc Tế - Đề Số 01',
    'HSK 2',
    'HSK 2级全真模拟考试 卷一',
    35,
    10,
    'Đề thi mô phỏng định dạng chuẩn của Hanban gồm 2 phần: Nghe hiểu (5 câu) và Đọc hiểu (5 câu). Thời gian 35 phút, điểm đạt tối thiểu 120/200.'
  );

  // Seed Exam Questions for exam-hsk2-01
  const insertExamQ = db.prepare(`
    INSERT INTO exam_questions (id, exam_id, section, question_number, prompt, audio_text, reading_text, pinyin, options_json, correct_answer, explanation)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertExamQ.run(
    'eq-1',
    'exam-hsk2-01',
    'listening',
    1,
    'Câu 1 (Nghe hiểu): Lắng nghe câu thoại và chọn hình ảnh/ý nghĩa tương ứng.',
    '外面下大雨了，你别出去了。',
    null,
    'Wàimiàn xià dàyǔ le, nǐ bié chūqu le.',
    JSON.stringify(['Trời đang nắng to', 'Trời đang mưa to', 'Trời có tuyết rơi', 'Trời nhiều gió']),
    'Trời đang mưa to',
    'Từ khóa nghe được: "下大雨" (mưa to).'
  );

  insertExamQ.run(
    'eq-2',
    'exam-hsk2-01',
    'listening',
    2,
    'Câu 2 (Nghe hiểu): Lắng nghe câu đối thoại và chọn đáp án đúng.',
    '男：服务员，我想点菜。女：好的先生，请问您想吃什么？',
    null,
    'Nán: Fúwùyuán, wǒ xiǎng diǎncài. Nǚ: Hǎode xiānsheng, qǐngwèn nín xiǎng chī shénme?',
    JSON.stringify(['Ở bệnh viện', 'Ở sân bay', 'Ở nhà hàng / Quán ăn', 'Ở rạp chiếu phim']),
    'Ở nhà hàng / Quán ăn',
    'Từ khóa: "服务员" (phục vụ) và "点菜" (gọi món).'
  );

  insertExamQ.run(
    'eq-3',
    'exam-hsk2-01',
    'listening',
    3,
    'Câu 3 (Nghe hiểu): Lắng nghe giờ giấc.',
    '现在是差一刻八点，电影八点开始。',
    null,
    'Xiànzài shì chà yí kè bā diǎn, diànyǐng bā diǎn kāishǐ.',
    JSON.stringify(['7 giờ 45 phút', '8 giờ 15 phút', '8 giờ đúng', '7 giờ 30 phút']),
    '7 giờ 45 phút',
    '"差一刻八点" = kém 15 phút 8 giờ = 7:45.'
  );

  insertExamQ.run(
    'eq-4',
    'exam-hsk2-01',
    'listening',
    4,
    'Câu 4 (Nghe hiểu): Đàm thoại sở thích.',
    '我最喜欢踢足球，我哥哥喜欢打篮球。',
    null,
    'Wǒ zuì xǐhuan tī zúqiú, wǒ gēge xǐhuan dǎ lánqiú.',
    JSON.stringify(['Người nói thích đá bóng', 'Người nói thích bóng rổ', 'Anh trai thích đá bóng', 'Cả hai đều thích bơi']),
    'Người nói thích đá bóng',
    '"我最喜欢踢足球" -> Người nói thích nhất là đá bóng.'
  );

  insertExamQ.run(
    'eq-5',
    'exam-hsk2-01',
    'listening',
    5,
    'Câu 5 (Nghe hiểu): Chọn phương tiện di chuyển.',
    '去火车站坐出租车要半个小时，坐地铁只要十五分钟。',
    null,
    'Qù huǒchēzhàn zuò chūzūchē yào bàn gè xiǎoshí, zuò dìtiě zhǐ yào shíwǔ fēnzhōng.',
    JSON.stringify(['Đi tàu hỏa', 'Đi taxi', 'Đi xe buýt', 'Đi tàu điện ngầm (nhanh nhất)']),
    'Đi tàu điện ngầm (nhanh nhất)',
    'Đi tàu điện ngầm ("坐地铁") chỉ mất 15 phút.'
  );

  insertExamQ.run(
    'eq-6',
    'exam-hsk2-01',
    'reading',
    6,
    'Câu 6 (Đọc hiểu - Phán đoán Đúng/Sai):',
    null,
    '医生说我生病了，需要多喝水，多休息，不能去上班。 -> Phán đoán: Người này hôm nay vẫn đi làm bình thường.',
    'Yīshēng shuō wǒ shēngbìng le...',
    JSON.stringify(['对 (Đúng)', '错 (Sai)']),
    '错 (Sai)',
    'Bài đọc ghi "不能去上班" (không thể đi làm) nên phán đoán đi làm là Sai.'
  );

  insertExamQ.run(
    'eq-7',
    'exam-hsk2-01',
    'reading',
    7,
    'Câu 7 (Đọc hiểu - Trắc nghiệm 3 đáp án):',
    null,
    '桌子上有一本书，两支笔和一个苹果。 -> Hỏi: Trên bàn có mấy cái bút?',
    'Zhuōzi shang yǒu yì běn shū...',
    JSON.stringify(['一支 (1 cái)', '两支 (2 cái)', '三支 (3 cái)']),
    '两支 (2 cái)',
    'Đoạn văn ghi: "两支笔" = 2 cây bút.'
  );

  insertExamQ.run(
    'eq-8',
    'exam-hsk2-01',
    'reading',
    8,
    'Câu 8 (Đọc hiểu - Trắc nghiệm 4 đáp án):',
    null,
    '小张每天早上六点起床跑步，然后七点吃早饭，八点去公司。 -> Hỏi: Tiểu Trương mấy giờ ăn sáng?',
    'Xiǎo Zhāng měitiān zǎoshang...',
    JSON.stringify(['6:00', '7:00', '8:00', '8:30']),
    '7:00',
    'Đoạn văn ghi "七点吃早饭" (7 giờ ăn sáng).'
  );

  insertExamQ.run(
    'eq-9',
    'exam-hsk2-01',
    'reading',
    9,
    'Câu 9 (Đọc hiểu - Điền từ vào chỗ trống):',
    null,
    '教室里很安静，大家都在认真地____书。',
    'Jiàoshì lǐ hěn ānjìng, dàjiā dōu zài rènlǐn de ____ shū.',
    JSON.stringify(['看 (Đọc / Xem)', '喝 (Uống)', '跑 (Chạy)', '买 (Mua)']),
    '看 (Đọc / Xem)',
    'Cụm từ cố định trong tiếng Trung: 看书 (Đọc sách).'
  );

  insertExamQ.run(
    'eq-10',
    'exam-hsk2-01',
    'reading',
    10,
    'Câu 10 (Đọc hiểu - Sắp xếp câu hoàn chỉnh):',
    null,
    'Chọn trật tự đúng cho các từ: (1) 汉语 / (2) 我 / (3) 学 / (4) 正在',
    null,
    JSON.stringify(['(2)-(4)-(3)-(1): 我正在学汉语。', '(4)-(2)-(3)-(1): 正在我学汉语。', '(1)-(2)-(3)-(4): 汉语我学正在。']),
    '(2)-(4)-(3)-(1): 我正在学汉语。',
    'Ngữ pháp: Chủ ngữ (我) + phó từ tiến hành (正在) + Động từ (学) + Tân ngữ (汉语).'
  );

  console.log('Database seeded successfully with initial users, courses, questions, listening drills and mock exam!');
}
