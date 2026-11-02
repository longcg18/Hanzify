import pg from 'pg';

const { Client } = pg;
const client = new Client({
  host: 'aws-0-ap-northeast-2.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.vwuikidgncknuozufiyi',
  password: 'ThuHoai1409',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  await client.connect();
  await client.query(`
    INSERT INTO public.courses (id, title, chinese_title, level, description, tag, total_lessons, teacher_name, teacher_avatar)
    VALUES 
      ('course-hsk3-q4', 'Giáo Trình HSK 3.0: Quyển 4 (Cao Cấp 1)', '新HSK 3.0 第四册', 'HSK 4', 'Giáo trình chuẩn HSK 3.0 mới Quyển 4: Mở rộng từ vựng và chủ đề chuyên sâu về công việc, văn hóa, đời sống xã hội.', 'Đang biên soạn', 15, 'Cô Hoài (Giáo Viên 01)', '怀'),
      ('course-hsk3-q5', 'Giáo Trình HSK 3.0: Quyển 5 (Cao Cấp 2)', '新HSK 3.0 第五册', 'HSK 5', 'Giáo trình chuẩn HSK 3.0 mới Quyển 5: Hoàn thiện kỹ năng đọc hiểu văn bản dài, viết đoạn luận và giao tiếp lưu loát.', 'Đang biên soạn', 15, 'Cô Hoài (Giáo Viên 01)', '怀')
    ON CONFLICT (id) DO UPDATE SET
      title = EXCLUDED.title,
      chinese_title = EXCLUDED.chinese_title,
      level = EXCLUDED.level,
      description = EXCLUDED.description,
      tag = EXCLUDED.tag;
  `);

  console.log('✓ Successfully upserted Quyển 4 and Quyển 5 into database public.courses!');

  const allCourses = await client.query('SELECT id, title, level, tag, total_lessons FROM public.courses ORDER BY id');
  console.log('All courses in database:', allCourses.rows);

  await client.end();
}

main().catch(console.error);

