import pg from 'pg';

const { Client } = pg;
const PROJECT_REF = 'vwuikidgncknuozufiyi';
const DB_PASSWORD = 'ThuHoai1409';

const config = {
  host: 'aws-0-ap-northeast-2.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: `postgres.${PROJECT_REF}`,
  password: DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
};

async function cleanSupabase() {
  console.log('🔄 Connecting to Supabase Cloud PostgreSQL...');
  const client = new Client(config);
  await client.connect();
  console.log('✅ Connected to Supabase PostgreSQL successfully!');

  try {
    console.log('🧹 Cleaning test data and preparing schema...');

    // 1. Add username column if missing
    await client.query(`
      ALTER TABLE public.users ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
    `);

    // 2. Create classrooms table
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.classrooms (
        id TEXT PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        teacher_id TEXT,
        teacher_name TEXT NOT NULL,
        level TEXT NOT NULL,
        schedule JSONB,
        time_slot TEXT,
        course_ids JSONB DEFAULT '[]'::jsonb,
        students JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
      );

      ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Public Read Classrooms" ON public.classrooms;
      DROP POLICY IF EXISTS "Public Manage Classrooms" ON public.classrooms;
      CREATE POLICY "Public Read Classrooms" ON public.classrooms FOR SELECT USING (true);
      CREATE POLICY "Public Manage Classrooms" ON public.classrooms FOR ALL USING (true) WITH CHECK (true);
    `);

    // 3. Clear mock/test student accounts, submissions, classrooms, leaderboard and forum
    await client.query(`
      DELETE FROM public.submissions;
      DELETE FROM public.classrooms;
      DELETE FROM public.game_leaderboard;
      DELETE FROM public.user_streaks;
      DELETE FROM public.forum_comments;
      DELETE FROM public.forum_posts;
      DELETE FROM public.users WHERE role = 'student' OR id LIKE '%student%';
    `);

    // 4. Clean and seed exactly 2 admin/teacher accounts
    await client.query(`
      INSERT INTO public.users (id, username, email, password, full_name, chinese_name, role, avatar, phone, status)
      VALUES 
        ('user-admin', 'admin', 'admin@hanzify.com', '123456', 'Nguyễn Phúc Long (Admin)', '龙老师', 'admin', '👑', '0901 234 567', 'active'),
        ('user-teacher', 'giaovien01', 'giaovien01@hanzify.com', '123456', 'Cô Hoài (Giáo Viên 01)', '怀老师', 'teacher', '怀', '0987 654 321', 'active')
      ON CONFLICT (id) DO UPDATE SET 
        username = EXCLUDED.username,
        email = EXCLUDED.email,
        password = EXCLUDED.password,
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role;
    `);

    // 5. Clean courses and lessons
    await client.query(`
      DELETE FROM public.homework_questions;
      DELETE FROM public.lessons;
      DELETE FROM public.courses;
    `);

    // 6. Insert 3 standard courses (HSK 1, HSK 2, HSK 3)
    await client.query(`
      INSERT INTO public.courses (id, title, chinese_title, level, description, tag, total_lessons, teacher_name, teacher_avatar, is_active)
      VALUES
        ('course-hsk1', 'Tiếng Trung Căn Bản HSK 1 (Bắt Đầu Từ Số 0)', 'HSK 1 基础汉语', 'HSK 1', 'Làm quen bảng chữ cái Pinyin, 4 thanh điệu, quy tắc bút thuận chữ Hán và 150 từ vựng cốt lõi.', 'Khóa Mới', 1, 'Cô Hoài (Giáo Viên 01)', '怀', true),
        ('course-hsk2', 'Tiếng Trung Sơ Cấp HSK 2: Đời Sống & Mua Sắm', 'HSK 2 初级汉语', 'HSK 2', 'Nắm vững 300 từ vựng và 45 mẫu câu đời sống: hỏi giá, số đếm, phương hướng và sinh hoạt hằng ngày.', 'Đang mở', 1, 'Cô Hoài (Giáo Viên 01)', '怀', true),
        ('course-hsk3', 'Tiếng Trung Trung Cấp HSK 3: Giao Tiếp Toàn Diện', 'HSK 3 中级汉语', 'HSK 3', 'Nắm vững 600 từ vựng HSK 3, tự tin giao tiếp trong học tập, công việc và du lịch.', 'Đang mở', 1, 'Cô Hoài (Giáo Viên 01)', '怀', true);
    `);

    // 7. Insert starter lessons for each course
    await client.query(`
      INSERT INTO public.lessons (id, course_id, number, title, chinese_title, description, hsk_level, is_unlocked)
      VALUES
        ('lesson-hsk1-1', 'course-hsk1', 1, 'Bài 01: Chào hỏi & Làm quen (你好)', '你好', '23:59 Chủ Nhật', 'HSK 1', true),
        ('lesson-hsk2-1', 'course-hsk2', 1, 'Bài 01: Đi Mua Sắm & Hỏi Giá (买东西)', '买东西', '23:59 Chủ Nhật', 'HSK 2', true),
        ('lesson-hsk3-1', 'course-hsk3', 1, 'Bài 01: Kế Hoạch Cuối Tuần (周末的打算)', '周末的打算', '23:59 Chủ Nhật', 'HSK 3', true);
    `);

    console.log('\n🎉 SUPABASE CLOUD DATABASE CLEANED AND READY!');

    const resUsers = await client.query('SELECT id, username, email, role FROM public.users');
    console.log('✅ Users on Supabase:', resUsers.rows);

    const resCourses = await client.query('SELECT id, title, level FROM public.courses');
    console.log('✅ Courses on Supabase:', resCourses.rows);

    const resLessons = await client.query('SELECT id, course_id, title FROM public.lessons');
    console.log('✅ Lessons on Supabase:', resLessons.rows);

    const resClassrooms = await client.query('SELECT count(*) FROM public.classrooms');
    console.log('✅ Classrooms on Supabase:', resClassrooms.rows[0].count);

    const resSubmissions = await client.query('SELECT count(*) FROM public.submissions');
    console.log('✅ Submissions on Supabase:', resSubmissions.rows[0].count);

  } catch (err) {
    console.error('❌ Error updating Supabase:', err);
  } finally {
    await client.end();
  }
}

cleanSupabase();
