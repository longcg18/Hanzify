-- ==============================================================================
-- HANZIFY (汉字流) - SUPABASE DATABASE SCHEMA & INITIAL SEED DATA
-- Chạy script này trực tiếp trong tab "SQL Editor" trên Dashboard Supabase của bạn
-- Phiên bản: v2 - Thêm hệ thống Đề Thi HSK Phân Cấp 4 Tầng
-- ==============================================================================

-- 1. BẢNG TÀI KHOẢN NGƯỜI DÙNG & PHÂN QUYỀN (USERS)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  chinese_name TEXT,
  role TEXT CHECK (role IN ('admin', 'teacher', 'student')) DEFAULT 'student',
  avatar TEXT DEFAULT '安',
  phone TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
ALTER TABLE public.users DROP COLUMN IF EXISTS password;

CREATE OR REPLACE FUNCTION public.is_hanzify_staff()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.users WHERE auth_user_id = auth.uid() AND role IN ('admin', 'teacher') AND status = 'active') $$;

CREATE OR REPLACE FUNCTION public.is_hanzify_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.users WHERE auth_user_id = auth.uid() AND role = 'admin' AND status = 'active') $$;

-- 2. BẢNG KHÓA HỌC (COURSES)
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  chinese_title TEXT,
  level TEXT NOT NULL,
  description TEXT,
  tag TEXT,
  total_lessons INTEGER DEFAULT 12,
  teacher_name TEXT DEFAULT 'Cô Hoài',
  teacher_avatar TEXT DEFAULT '怀',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. BẢNG BÀI HỌC (LESSONS)
CREATE TABLE IF NOT EXISTS public.lessons (
  id TEXT PRIMARY KEY,
  course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  chinese_title TEXT,
  description TEXT,
  hsk_level TEXT DEFAULT 'HSK 2',
  is_unlocked BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. BẢNG CÂU HỎI BÀI TẬP (HOMEWORK_QUESTIONS)
CREATE TABLE IF NOT EXISTS public.homework_questions (
  id TEXT PRIMARY KEY,
  lesson_id TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'multiple-choice', 'fill-blank', 'recording', 'translation', 'hanzi-writing'
  prompt TEXT NOT NULL,
  data_json JSONB NOT NULL,
  sort_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. BẢNG BÀI NỘP HỌC VIÊN & CHẤM BÀI (SUBMISSIONS)
CREATE TABLE IF NOT EXISTS public.submissions (
  id TEXT PRIMARY KEY,
  lesson_id TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
  student_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'graded')) DEFAULT 'pending',
  total_score NUMERIC(4, 1),
  teacher_comment TEXT,
  teacher_audio_feedback TEXT,
  answers_json JSONB DEFAULT '{}'::jsonb
);

-- 6. BẢNG TỪ VỰNG GAME LẬT THẺ GHÉP ĐÔI (GAME_MATCH_PAIRS)
CREATE TABLE IF NOT EXISTS public.game_match_pairs (
  id TEXT PRIMARY KEY,
  hanzi TEXT NOT NULL,
  pinyin TEXT NOT NULL,
  mean TEXT NOT NULL,
  category TEXT DEFAULT 'Từ vựng HSK 2',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. BẢNG CÂU ĐỐ GAME THỬ THÁCH THANH ĐIỆU (GAME_TONE_ITEMS)
CREATE TABLE IF NOT EXISTS public.game_tone_items (
  id TEXT PRIMARY KEY,
  char TEXT NOT NULL,
  pinyin TEXT NOT NULL,
  tone INTEGER CHECK (tone IN (1, 2, 3, 4)) NOT NULL,
  mean TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. BẢNG VÀNG XẾP HẠNG HỌC VIÊN MINI-GAMES (GAME_LEADERBOARD)
CREATE TABLE IF NOT EXISTS public.game_leaderboard (
  id TEXT PRIMARY KEY,
  user_name TEXT NOT NULL,
  role TEXT DEFAULT 'Học viên',
  score INTEGER NOT NULL,
  game TEXT NOT NULL,
  streak TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 9. BẢNG ĐỀ THI HSK (EXAMS) - Tầng 1
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.exams (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  chinese_title TEXT,
  level TEXT NOT NULL DEFAULT 'HSK 2',
  duration INTEGER DEFAULT 35,        -- Thời lượng thi (phút)
  passing_score INTEGER DEFAULT 120,   -- Điểm chuẩn đạt
  max_score INTEGER DEFAULT 200,       -- Thang điểm tối đa
  tag TEXT DEFAULT 'Đề tiêu chuẩn',
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. BẢNG KỸ NĂNG TRONG ĐỀ THI (EXAM_SKILLS) - Tầng 2
CREATE TABLE IF NOT EXISTS public.exam_skills (
  id TEXT PRIMARY KEY,
  exam_id TEXT REFERENCES public.exams(id) ON DELETE CASCADE,
  skill_type TEXT CHECK (skill_type IN ('listening', 'reading', 'writing')) NOT NULL,
  name TEXT NOT NULL,                  -- Tên hiển thị: 'Kỹ Năng Nghe Hiểu (听力)'
  chinese_name TEXT,                   -- '听力部分'
  sort_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. BẢNG PHẦN THI TRONG KỸ NĂNG (EXAM_PARTS) - Tầng 3
CREATE TABLE IF NOT EXISTS public.exam_parts (
  id TEXT PRIMARY KEY,
  skill_id TEXT REFERENCES public.exam_skills(id) ON DELETE CASCADE,
  part_number INTEGER DEFAULT 1,
  title TEXT NOT NULL,                 -- 'Phần nghe 1: Phán đoán Đúng / Sai'
  instructions TEXT,                   -- Hướng dẫn làm bài cho phần này
  sort_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. BẢNG CÂU HỎI (EXAM_QUESTIONS) - Tầng 4 / Đơn vị nhỏ nhất
CREATE TABLE IF NOT EXISTS public.exam_questions (
  id TEXT PRIMARY KEY,
  part_id TEXT REFERENCES public.exam_parts(id) ON DELETE CASCADE,
  question_number INTEGER DEFAULT 1,   -- Số thứ tự thực tế trong toàn bộ đề
  prompt TEXT NOT NULL,                -- Đề bài câu hỏi
  audio_text TEXT,                     -- Đoạn thoại nghe (cho phần Nghe)
  reading_text TEXT,                   -- Đoạn văn đọc (cho phần Đọc)
  pinyin TEXT,                         -- Phiên âm
  options JSONB NOT NULL DEFAULT '[]'::jsonb,   -- Các phương án ['A', 'B', 'C', 'D']
  correct_answer TEXT NOT NULL,        -- Đáp án đúng
  explanation TEXT,                    -- Giải thích chi tiết
  sort_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- BẬT ROW LEVEL SECURITY (RLS) VÀ CẤP QUYỀN ĐỌC/GHI CHO PUBLISHABLE KEY
-- ==============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homework_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_match_pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_tone_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;

-- Policies cho phép Client (anon/authenticated) đọc và ghi dữ liệu phục vụ ứng dụng
DROP POLICY IF EXISTS "Public Read Users" ON public.users;
DROP POLICY IF EXISTS "Public Insert/Update Users" ON public.users;
DROP POLICY IF EXISTS "Users read own profile" ON public.users;
DROP POLICY IF EXISTS "Users update own profile" ON public.users;
DROP POLICY IF EXISTS "Users create own profile" ON public.users;
CREATE POLICY "Users read own profile" ON public.users FOR SELECT TO authenticated USING (auth_user_id = auth.uid() OR public.is_hanzify_staff());
CREATE POLICY "Users update own profile" ON public.users FOR UPDATE TO authenticated USING (auth_user_id = auth.uid() OR public.is_hanzify_admin()) WITH CHECK (auth_user_id = auth.uid() OR public.is_hanzify_admin());
CREATE POLICY "Users create own profile" ON public.users FOR INSERT TO authenticated WITH CHECK (auth_user_id = auth.uid() AND role = 'student');

DROP POLICY IF EXISTS "Public Read Courses" ON public.courses;
DROP POLICY IF EXISTS "Public Manage Courses" ON public.courses;
CREATE POLICY "Public Read Courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Staff Manage Courses" ON public.courses FOR ALL TO authenticated USING (public.is_hanzify_staff()) WITH CHECK (public.is_hanzify_staff());

DROP POLICY IF EXISTS "Public Read Lessons" ON public.lessons;
DROP POLICY IF EXISTS "Public Manage Lessons" ON public.lessons;
CREATE POLICY "Public Read Lessons" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Staff Manage Lessons" ON public.lessons FOR ALL TO authenticated USING (public.is_hanzify_staff()) WITH CHECK (public.is_hanzify_staff());

DROP POLICY IF EXISTS "Public Read Questions" ON public.homework_questions;
DROP POLICY IF EXISTS "Public Manage Questions" ON public.homework_questions;
CREATE POLICY "Public Read Questions" ON public.homework_questions FOR SELECT USING (true);
CREATE POLICY "Staff Manage Questions" ON public.homework_questions FOR ALL TO authenticated USING (public.is_hanzify_staff()) WITH CHECK (public.is_hanzify_staff());

DROP POLICY IF EXISTS "Public Read Submissions" ON public.submissions;
DROP POLICY IF EXISTS "Public Manage Submissions" ON public.submissions;
CREATE POLICY "Public Read Submissions" ON public.submissions FOR SELECT USING (true);
CREATE POLICY "Students create submissions" ON public.submissions FOR INSERT TO authenticated WITH CHECK (student_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));
CREATE POLICY "Owners and staff read submissions" ON public.submissions FOR SELECT TO authenticated USING (student_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()) OR public.is_hanzify_staff());
CREATE POLICY "Staff grade submissions" ON public.submissions FOR UPDATE TO authenticated USING (public.is_hanzify_staff()) WITH CHECK (public.is_hanzify_staff());

DROP POLICY IF EXISTS "Public Read Match Pairs" ON public.game_match_pairs;
DROP POLICY IF EXISTS "Public Manage Match Pairs" ON public.game_match_pairs;
CREATE POLICY "Public Read Match Pairs" ON public.game_match_pairs FOR SELECT USING (true);
CREATE POLICY "Public Manage Match Pairs" ON public.game_match_pairs FOR ALL TO authenticated USING (public.is_hanzify_staff()) WITH CHECK (public.is_hanzify_staff());

DROP POLICY IF EXISTS "Public Read Tone Items" ON public.game_tone_items;
DROP POLICY IF EXISTS "Public Manage Tone Items" ON public.game_tone_items;
CREATE POLICY "Public Read Tone Items" ON public.game_tone_items FOR SELECT USING (true);
CREATE POLICY "Public Manage Tone Items" ON public.game_tone_items FOR ALL TO authenticated USING (public.is_hanzify_staff()) WITH CHECK (public.is_hanzify_staff());

DROP POLICY IF EXISTS "Public Read Leaderboard" ON public.game_leaderboard;
DROP POLICY IF EXISTS "Public Manage Leaderboard" ON public.game_leaderboard;
CREATE POLICY "Public Read Leaderboard" ON public.game_leaderboard FOR SELECT USING (true);
CREATE POLICY "Public Manage Leaderboard" ON public.game_leaderboard FOR ALL TO authenticated USING (public.is_hanzify_staff()) WITH CHECK (public.is_hanzify_staff());

DROP POLICY IF EXISTS "Public Read Exams" ON public.exams;
DROP POLICY IF EXISTS "Public Manage Exams" ON public.exams;
CREATE POLICY "Public Read Exams" ON public.exams FOR SELECT USING (true);
CREATE POLICY "Public Manage Exams" ON public.exams FOR ALL TO authenticated USING (public.is_hanzify_staff()) WITH CHECK (public.is_hanzify_staff());

DROP POLICY IF EXISTS "Public Read Exam Skills" ON public.exam_skills;
DROP POLICY IF EXISTS "Public Manage Exam Skills" ON public.exam_skills;
CREATE POLICY "Public Read Exam Skills" ON public.exam_skills FOR SELECT USING (true);
CREATE POLICY "Public Manage Exam Skills" ON public.exam_skills FOR ALL TO authenticated USING (public.is_hanzify_staff()) WITH CHECK (public.is_hanzify_staff());

DROP POLICY IF EXISTS "Public Read Exam Parts" ON public.exam_parts;
DROP POLICY IF EXISTS "Public Manage Exam Parts" ON public.exam_parts;
CREATE POLICY "Public Read Exam Parts" ON public.exam_parts FOR SELECT USING (true);
CREATE POLICY "Public Manage Exam Parts" ON public.exam_parts FOR ALL TO authenticated USING (public.is_hanzify_staff()) WITH CHECK (public.is_hanzify_staff());

DROP POLICY IF EXISTS "Public Read Exam Questions" ON public.exam_questions;
DROP POLICY IF EXISTS "Public Manage Exam Questions" ON public.exam_questions;
CREATE POLICY "Public Read Exam Questions" ON public.exam_questions FOR SELECT USING (true);
CREATE POLICY "Public Manage Exam Questions" ON public.exam_questions FOR ALL TO authenticated USING (public.is_hanzify_staff()) WITH CHECK (public.is_hanzify_staff());

-- ==============================================================================
-- DỮ LIỆU KHỞI TẠO MẪU (SEED DATA)
-- ==============================================================================

-- 1. Tài khoản mẫu: Admin Nguyễn Phúc Long, Giáo viên Cô Hoài, Học viên
-- Hồ sơ mẫu chỉ dùng cho môi trường development. Tạo người dùng tương ứng trong
-- Supabase Auth rồi gán auth_user_id trước khi đăng nhập.
INSERT INTO public.users (id, email, full_name, chinese_name, role, avatar, phone)
VALUES
  ('user-admin', 'admin@hanzify.com', 'Nguyễn Phúc Long', '龙老师', 'admin', '👑', '0901 234 567'),
  ('user-teacher', 'hoailaoshi@hanzify.com', 'Cô Hoài', '怀老师', 'teacher', '怀', '0987 654 321'),
  ('user-student-1', 'student@hanzify.com', 'Nguyễn Văn An', '阮文安', 'student', '安', '0911 223 344'),
  ('user-student-2', 'maitran@hanzify.com', 'Trần Thị Mai', '陈氏梅', 'student', '梅', '0933 445 566')
ON CONFLICT (id) DO NOTHING;

-- 2. Khóa học mẫu
INSERT INTO public.courses (id, title, chinese_title, level, description, tag, total_lessons, teacher_name, teacher_avatar)
VALUES
  ('course-hsk2', 'HSK 2 Toàn Diện: Đời Sống & Mua Sắm', '生活与购物', 'HSK 2', 'Nắm vững 300 từ vựng và 45 mẫu câu đời sống: hỏi giá, số đếm, phương hướng và sinh hoạt hằng ngày.', 'Đang theo học', 12, 'Cô Hoài', '怀'),
  ('course-hsk1', 'Tiếng Trung Căn Bản HSK 1 (Bắt Đầu Từ Số 0)', '初级汉语', 'HSK 1', 'Làm quen bảng chữ cái Pinyin, 4 thanh điệu, quy tắc bút thuận chữ Hán và 150 từ vựng cốt lõi.', 'Khóa nền tảng', 10, 'Cô Hoài', '怀'),
  ('course-spoken', 'Khẩu Ngữ & Phản Xạ Giao Tiếp HSKK', '口语特训', 'Giao tiếp', 'Chỉnh ngọng thanh 1, thanh 4 và biến âm nửa thanh 3. Luyện nói đoạn văn ngắn tự tin như người bản xứ.', 'Lớp chuyên sâu', 8, 'Cô Hoài', '怀')
ON CONFLICT (id) DO NOTHING;

-- 3. Bài học mẫu cho khóa HSK 2
INSERT INTO public.lessons (id, course_id, number, title, chinese_title, description, hsk_level, is_unlocked)
VALUES
  ('lesson-1', 'course-hsk2', 1, 'Chào hỏi & Làm quen bạn mới', '问候与结识', 'Cách xưng hô lịch sự, hỏi thăm công việc, nghề nghiệp.', 'HSK 2', true),
  ('lesson-2', 'course-hsk2', 2, 'Thời gian & Sinh hoạt hằng ngày', '时间与日常', 'Hỏi giờ giấc, ngày tháng, lên kế hoạch cho tuần mới.', 'HSK 2', true),
  ('lesson-3', 'course-hsk2', 3, 'Đi lại & Hỏi thăm phương hướng', '出行与问路', 'Từ vựng chỉ phương hướng, phương tiện giao thông xe buýt, tàu điện.', 'HSK 2', true),
  ('lesson-4', 'course-hsk2', 4, 'Mua sắm & Mặc cả tại siêu thị', '购物与讨价还价', 'Luyện tập hỏi giá cả (多少钱), đắt/rẻ (太贵了) và các đơn vị tiền tệ Trung Quốc.', 'HSK 2', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Ngân hàng từ vựng Game Lật Thẻ Ghép Đôi
INSERT INTO public.game_match_pairs (id, hanzi, pinyin, mean, category)
VALUES
  ('p-1', '苹果', 'píngguǒ', 'Quả táo', 'Mua sắm HSK 2'),
  ('p-2', '衣服', 'yīfu', 'Quần áo', 'Mua sắm HSK 2'),
  ('p-3', '买', 'mǎi', 'Mua', 'Động từ căn bản'),
  ('p-4', '钱', 'qián', 'Tiền', 'Mua sắm HSK 2'),
  ('p-5', '超市', 'chāoshì', 'Siêu thị', 'Địa điểm HSK 2'),
  ('p-6', '贵', 'guì', 'Đắt', 'Tính từ HSK 2')
ON CONFLICT (id) DO NOTHING;

-- 5. Ngân hàng câu đố Game Thử Thách Thanh Điệu
INSERT INTO public.game_tone_items (id, char, pinyin, tone, mean)
VALUES
  ('t-1', '妈', 'mā', 1, 'Mẹ'),
  ('t-2', '国', 'guó', 2, 'Quốc gia'),
  ('t-3', '好', 'hǎo', 3, 'Tốt / Đẹp'),
  ('t-4', '谢', 'xiè', 4, 'Cảm ơn'),
  ('t-5', '喝', 'hē', 1, 'Uống'),
  ('t-6', '来', 'lái', 2, 'Đến'),
  ('t-7', '买', 'mǎi', 3, 'Mua'),
  ('t-8', '去', 'qù', 4, 'Đi')
ON CONFLICT (id) DO NOTHING;

-- 6. Bảng vàng thành tích học viên
INSERT INTO public.game_leaderboard (id, user_name, role, score, game, streak)
VALUES
  ('lb-1', 'Nguyễn Minh Anh', 'Học viên', 820, 'Thử Thách Thanh Điệu', 'Combo x8'),
  ('lb-2', 'Trần Thị Mai', 'Học viên', 740, 'Lật Thẻ Ghép Đôi', '14 Lượt lật'),
  ('lb-3', 'Nguyễn Văn An', 'Học viên', 650, 'Thử Thách Thanh Điệu', 'Combo x5')
ON CONFLICT (id) DO NOTHING;

-- 7. Ngân hàng câu hỏi bài tập mẫu
INSERT INTO public.homework_questions (id, lesson_id, type, prompt, data_json, sort_order)
VALUES
  ('q-1', 'lesson-4', 'multiple-choice', 'Từ "多少钱" (duōshao qián) có nghĩa là gì trong giao tiếp mua sắm?', '{"options": ["Bao nhiêu tiền?", "Đi đâu đấy?", "Đắt quá không mua!", "Cái này là gì?"], "correct": 0}'::jsonb, 1),
  ('q-2', 'lesson-4', 'fill-blank', 'Điền từ thích hợp vào chỗ trống: 这个苹果太____了，便宜一点儿吧！(Quả táo này đắt quá, rẻ một chút đi!)', '{"answer": "贵", "pinyin": "guì", "hint": "Đắt trong tiếng Trung"}'::jsonb, 2),
  ('q-3', 'lesson-4', 'recording', 'Thu âm phát âm câu giao tiếp mua sắm: "苹果多少钱一斤？三块钱一斤。"', '{"pinyin": "Píngguǒ duōshao qián yī jīn? Sān kuài qián yī jīn.", "standard_audio": "audio_sample.mp3"}'::jsonb, 3)
ON CONFLICT (id) DO NOTHING;

-- 8. Bài tập nộp mẫu của học viên
INSERT INTO public.submissions (id, lesson_id, student_id, student_name, submitted_at, status, total_score, teacher_comment, answers_json)
VALUES
  ('sub-1', 'lesson-4', 'user-student-1', 'Nguyễn Văn An', timezone('utc'::text, now()) - interval '2 hours', 'graded', 9.5, 'Em phát âm thanh 4 rất dứt khoát và chuẩn xác, chú ý biến âm nửa thanh 3 một chút nữa là hoàn hảo nhé!', '{"q-1": "Bao nhiêu tiền?", "q-2": "贵", "audio_url": "blob:student-an-voice.wav"}'::jsonb),
  ('sub-2', 'lesson-4', 'user-student-2', 'Trần Thị Mai', timezone('utc'::text, now()) - interval '45 minutes', 'pending', NULL, NULL, '{"q-1": "Bao nhiêu tiền?", "q-2": "贵"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 9. Đề thi HSK mẫu (Tầng 1: Đề thi)
INSERT INTO public.exams (id, title, chinese_title, level, duration, passing_score, max_score, tag, description)
VALUES
  ('exam-hsk2-01', 'Đề Thi Thử HSK 2 Toàn Diện - Đề Số 01', 'HSK 2级 全真模拟考试 (卷一)', 'HSK 2', 35, 120, 200, 'Đề tiêu chuẩn',
   'Đầy đủ 2 kỹ năng Nghe hiểu (听力) và Đọc hiểu (阅读) theo đúng chuẩn Hanban.')
ON CONFLICT (id) DO NOTHING;

-- 10. Kỹ năng trong đề thi (Tầng 2: Kỹ năng)
INSERT INTO public.exam_skills (id, exam_id, skill_type, name, chinese_name, sort_order)
VALUES
  ('skill-lis-hsk2', 'exam-hsk2-01', 'listening', 'Kỹ Năng Nghe Hiểu (听力)', '听力部分', 1),
  ('skill-read-hsk2', 'exam-hsk2-01', 'reading', 'Kỹ Năng Đọc Hiểu (阅读)', '阅读部分', 2)
ON CONFLICT (id) DO NOTHING;

-- 11. Phần thi trong kỹ năng (Tầng 3: Phần thi)
INSERT INTO public.exam_parts (id, skill_id, part_number, title, instructions, sort_order)
VALUES
  ('part-lis-1', 'skill-lis-hsk2', 1, 'Phần nghe 1: Phán đoán Đúng / Sai',
   'Lắng nghe từng câu thoại ngắn, đối chiếu với tình huống và chọn đáp án chính xác nhất.', 1),
  ('part-lis-2', 'skill-lis-hsk2', 2, 'Phần nghe 2: Hội thoại chọn thông tin',
   'Lắng nghe đoạn hội thoại giữa 2 nhân vật và chọn phương án trả lời đúng.', 2),
  ('part-read-1', 'skill-read-hsk2', 1, 'Phần đọc 1: Phán đoán câu Đúng / Sai',
   'Đọc câu văn và phán đoán nội dung đúng (对) hay sai (错).', 1),
  ('part-read-2', 'skill-read-hsk2', 2, 'Phần đọc 2: Trả lời câu hỏi đọc hiểu',
   'Đọc câu hoặc đoạn văn ngắn, chọn phương án trả lời phù hợp nhất.', 2)
ON CONFLICT (id) DO NOTHING;

-- 12. Câu hỏi (Tầng 4: Đơn vị nhỏ nhất)
INSERT INTO public.exam_questions (id, part_id, question_number, prompt, audio_text, reading_text, pinyin, options, correct_answer, explanation, sort_order)
VALUES
  -- Phần nghe 1
  ('eq-1', 'part-lis-1', 1, 'Lắng nghe câu thoại và chọn nội dung/tình huống đúng nhất.',
   '外面下大雨了，你别出去了。', '', 'Wàimiàn xià dàyǔ le, nǐ bié chūqu le.',
   '["Trời đang nắng to", "Trời đang mưa to", "Trời có tuyết rơi", "Trời nhiều gió"]',
   'Trời đang mưa to', 'Từ khóa nghe được: "下大雨" (mưa to), câu nói khuyên đừng ra ngoài vì trời mưa to.', 1),
  ('eq-2', 'part-lis-1', 2, 'Lắng nghe cuộc đối thoại ngắn và xác định địa điểm.',
   '男：服务员，我想点菜。女：好的先生，请问您想吃什么？', '', 'Nán: Fúwùyuán, wǒ xiǎng diǎncài.',
   '["Ở bệnh viện", "Ở sân bay", "Ở nhà hàng / Quán ăn", "Ở rạp chiếu phim"]',
   'Ở nhà hàng / Quán ăn', 'Từ khóa: "服务员" (phục vụ) và "点菜" (gọi món ăn) -> Địa điểm là nhà hàng.', 2),
  -- Phần nghe 2
  ('eq-3', 'part-lis-2', 3, 'Lắng nghe thông tin về giờ giấc.',
   '现在是差一刻八点，电影八点开始。', '', 'Xiànzài shì chà yí kè bā diǎn, diànyǐng bā diǎn kāishǐ.',
   '["7 giờ 45 phút", "8 giờ 15 phút", "8 giờ đúng", "7 giờ 30 phút"]',
   '7 giờ 45 phút', '"差一刻八点" = kém 15 phút 8 giờ = 7:45.', 1),
  ('eq-4', 'part-lis-2', 4, 'Lắng nghe sở thích của nhân vật.',
   '我最喜欢踢足球，我哥哥喜欢打篮球。', '', 'Wǒ zuì xǐhuan tī zúqiú.',
   '["Người nói thích đá bóng", "Người nói thích bóng rổ", "Anh trai thích đá bóng", "Cả hai đều thích bơi"]',
   'Người nói thích đá bóng', '"我最喜欢踢足球" -> Người nói thích nhất là môn bóng đá.', 2),
  -- Phần đọc 1
  ('eq-5', 'part-read-1', 5, 'Phán đoán Đúng / Sai dựa vào câu văn sau:',
   '', '医生说我生病了，需要多喝水，多休息，不能去上班。-> Phán đoán: Người này hôm nay vẫn đi làm bình thường.', 'Yīshēng shuō wǒ shēngbìng le...',
   '["对 (Đúng)", "错 (Sai)"]',
   '错 (Sai)', 'Câu văn ghi rõ "不能去上班" (không thể đi làm) nên phán đoán đi làm bình thường là Sai.', 1),
  ('eq-6', 'part-read-1', 6, 'Đọc câu văn và trả lời câu hỏi:',
   '', '桌子上有一本书，两支笔和一个苹果。-> Hỏi: Trên bàn có mấy cái bút?', 'Zhuōzi shang yǒu yì běn shū...',
   '["一支 (1 cái)", "两支 (2 cái)", "三支 (3 cái)"]',
   '两支 (2 cái)', 'Lượng từ cho bút là "支", câu ghi rõ "两支笔" = 2 cây bút.', 2),
  -- Phần đọc 2
  ('eq-7', 'part-read-2', 7, 'Đọc lịch trình và chọn thời gian đúng:',
   '', '小张每天早上六点起床跑步，然后七点吃早饭，八点去公司。-> Hỏi: Tiểu Trương mấy giờ ăn sáng?', '',
   '["6:00", "7:00", "8:00", "8:30"]',
   '7:00', 'Nội dung: "七点吃早饭" (7 giờ ăn sáng).', 1),
  ('eq-8', 'part-read-2', 8, 'Chọn từ thích hợp nhất điền vào chỗ trống:',
   '', '教室里很安静，大家都在认真地____书。', 'Jiàoshì lǐ hěn ānjìng...',
   '["看 (Đọc / Xem)", "喝 (Uống)", "跑 (Chạy)", "买 (Mua)"]',
   '看 (Đọc / Xem)', 'Cụm từ cố định trong tiếng Trung: 看书 (kàn shū) = Đọc sách.', 2)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 13. HỆ THỐNG GAMIFICATION: CHUỖI NGÀY HỌC (STREAK) & TÍCH LŨY XP
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.user_streaks (
  user_id TEXT PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 1,
  longest_streak INTEGER DEFAULT 1,
  last_check_in DATE DEFAULT CURRENT_DATE,
  total_xp INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 14. DIỄN ĐÀN CỘNG ĐỒNG & BÁO LỖI WEB (FORUM POSTS & COMMENTS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.forum_posts (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_avatar TEXT DEFAULT '安',
  author_role TEXT DEFAULT 'student',
  category TEXT NOT NULL CHECK (category IN ('bai-kho', 'bao-loi', 'kinh-nghiem', 'thao-luan')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags JSONB DEFAULT '[]',
  likes_count INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('pending', 'answered', 'fixed', 'pinned')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.forum_comments (
  id TEXT PRIMARY KEY,
  post_id TEXT REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  author_avatar TEXT DEFAULT '安',
  author_role TEXT DEFAULT 'student',
  content TEXT NOT NULL,
  is_teacher_answer BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bật RLS
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cho phép đọc dữ liệu Gamification" ON public.user_streaks FOR SELECT USING (true);
CREATE POLICY "Cho phép học viên điểm danh streak" ON public.user_streaks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Cho phép đọc bài viết diễn đàn" ON public.forum_posts FOR SELECT USING (true);
CREATE POLICY "Thành viên ghi bài viết diễn đàn" ON public.forum_posts FOR INSERT TO authenticated WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));
CREATE POLICY "Chủ bài hoặc staff cập nhật diễn đàn" ON public.forum_posts FOR UPDATE TO authenticated USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()) OR public.is_hanzify_staff());
CREATE POLICY "Cho phép đọc bình luận diễn đàn" ON public.forum_comments FOR SELECT USING (true);
CREATE POLICY "Thành viên ghi bình luận diễn đàn" ON public.forum_comments FOR INSERT TO authenticated WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- ==============================================================================
-- 9. BẢNG QUẢN LÝ LỚP HỌC & DANH SÁCH ĐIỂM DANH HỌC VIÊN (CLASSROOMS & ROSTER)
-- Phục vụ quy trình mở lớp của Cô Hoài:
-- - Tạo lớp + Chọn combo khóa học + Nhập danh sách học viên + Lên lịch học
-- - Sinh mã lớp học duy nhất (HZ-2026-XXXXXX)
-- - Học sinh nhập mã -> Chọn đúng tên trong danh sách -> Thiết lập username/password
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.classrooms (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL, -- Mã lớp học duy nhất, không trùng lặp (vd: HZ-2026-CB13X9)
  name TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5')),
  teacher TEXT DEFAULT 'Cô Hoài',
  schedule JSONB NOT NULL DEFAULT '{"days": ["T2", "T4", "T6"], "shift": "Tối", "timeNote": "19:30 - 21:00"}',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.classroom_courses (
  classroom_id TEXT REFERENCES public.classrooms(id) ON DELETE CASCADE,
  course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
  PRIMARY KEY (classroom_id, course_id)
);

CREATE TABLE IF NOT EXISTS public.classroom_students (
  id TEXT PRIMARY KEY,
  classroom_id TEXT REFERENCES public.classrooms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  username TEXT UNIQUE, -- Tên đăng nhập sau khi học viên kích hoạt
  is_activated BOOLEAN DEFAULT false,
  activated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bật RLS
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cho phép đọc dữ liệu lớp học" ON public.classrooms FOR SELECT USING (true);
CREATE POLICY "Staff ghi dữ liệu lớp học" ON public.classrooms FOR ALL TO authenticated USING (public.is_hanzify_staff()) WITH CHECK (public.is_hanzify_staff());
CREATE POLICY "Cho phép đọc combo khóa học lớp" ON public.classroom_courses FOR SELECT USING (true);
CREATE POLICY "Staff ghi combo khóa học lớp" ON public.classroom_courses FOR ALL TO authenticated USING (public.is_hanzify_staff()) WITH CHECK (public.is_hanzify_staff());
CREATE POLICY "Cho phép đọc danh sách học viên lớp" ON public.classroom_students FOR SELECT USING (true);
CREATE POLICY "Staff cập nhật học viên lớp" ON public.classroom_students FOR ALL TO authenticated USING (public.is_hanzify_staff()) WITH CHECK (public.is_hanzify_staff());

-- =========================================================================
-- PHÂN QUYỀN BẢO MẬT & CÁCH LY DỮ LIỆU GIỮA CÁC LỚP HỌC (CLASSROOM DATA ISOLATION)
-- 1. Ứng dụng Hanzify sử dụng mô hình lọc phân quyền lớp học nghiêm ngặt:
--    - Học viên chỉ nhìn thấy lớp học mà mình đã được ghi danh (so khớp theo username, họ tên hoặc mã học viên).
--    - Học viên chỉ mở được các khóa học và bài học được giáo viên mở khóa cho lớp của mình.
--    - Danh sách lớp khác, mã lớp khác và danh sách học viên của lớp khác hoàn toàn bị ẩn khỏi giao diện học sinh.
-- 2. Giáo viên và Admin toàn quyền quản lý, sửa lớp và mở bài cho tất cả các lớp.
-- =========================================================================
