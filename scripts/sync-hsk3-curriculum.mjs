import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { createClient } from '@supabase/supabase-js';

const { Client } = pg;
const pgClient = new Client({
  host: 'aws-0-ap-northeast-2.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.vwuikidgncknuozufiyi',
  password: 'ThuHoai1409',
  ssl: { rejectUnauthorized: false }
});

const SUPABASE_URL = 'https://vwuikidgncknuozufiyi.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Tl4-IAKBx5KT9d2CiL8tog_fzEq4qc2';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const BASE_DIR = path.join('D:', 'Code', 'Github', 'Hanzify', 'DẠY THEO FORMAT MỚI');

// Definition of Courses and Lessons
const HSK3_COURSES = [
  {
    id: 'course-hsk3-q1',
    title: 'Giáo Trình HSK 3.0: Quyển 1 (Bắt Đầu Từ Số 0)',
    chinese_title: '新HSK 3.0 第一册',
    level: 'HSK 1 - 2',
    description: 'Giáo trình chuẩn HSK 3.0 mới Quyển 1: 15 bài học căn bản kèm Slide PPT giảng dạy chi tiết, từ phát âm Pinyin, chữ Hán đến giao tiếp đời sống.',
    tag: 'HSK 3.0 Mới',
    total_lessons: 15,
    teacher_name: 'Cô Hoài (Giáo Viên 01)',
    teacher_avatar: '怀',
    folder: 'QUYỂN 1',
    lessons: [
      { num: 1, title: 'Bài 1: Chào bạn', cn: '你好 (Nǐ hǎo)', filePrefix: 'Bai 1 Ni hao' },
      { num: 2, title: 'Bài 2: Tiếng Hán không khó lắm', cn: '汉语不太难 (Hànyǔ bù tài nán)', filePrefix: 'Bai 2 Hanyu bu tai nan' },
      { num: 3, title: 'Bài 3: Ngày mai gặp lại', cn: '明天见 (Míngtiān jiàn)', filePrefix: 'Bai 3 Mingtian jian' },
      { num: 4, title: 'Bài 4: Bạn đi đâu đấy?', cn: '你去哪儿 (Nǐ qù nǎr)', filePrefix: 'Bai 4 Ni qu nar' },
      { num: 5, title: 'Bài 5: Đây là thầy giáo Vương', cn: '这是王老师 (Zhè shì Wáng lǎoshī)', filePrefix: 'Bai 5 zhe shi Wang laoshi' },
      { num: 6, title: 'Bài 6: Tôi học tiếng Hán', cn: '我学习汉语 (Wǒ xuéxí Hànyǔ)', filePrefix: 'BAI 6 wo xuexi Hanyu' },
      { num: 7, title: 'Bài 7: Bạn ăn cái gì?', cn: '你吃什么 (Nǐ chī shénme)', filePrefix: 'Bai 7 Ni chi shenme' },
      { num: 8, title: 'Bài 8: Táo bao nhiêu tiền một cân?', cn: '苹果一斤多少钱 (Píngguǒ yì jīn duōshao qián)', filePrefix: 'Bai 8 Pingguo yi jin' },
      { num: 9, title: 'Bài 9: Tôi đổi Nhân dân tệ', cn: '我换人民币 (Wǒ huàn Rénmínbì)', filePrefix: 'Bai 9 Wo huan Renminbi' },
      { num: 10, title: 'Bài 10: Ông ấy sống ở đâu?', cn: '他住哪儿 (Tā zhù nǎr)', filePrefix: 'Bai 10 Ta zhu nar' },
      { num: 11, title: 'Bài 11: Chúng tôi đều là lưu học sinh', cn: '我们都是留学生 (Wǒmen dōu shì liúxuéshēng)', filePrefix: 'Bai 11 Women dou shi' },
      { num: 12, title: 'Bài 12: Bạn học ở đâu?', cn: '你在哪儿学习 (Nǐ zài nǎr xuéxí)', filePrefix: 'Bai 12 Ni zai nar xuexi' },
      { num: 13, title: 'Bài 13: Đây có phải thuốc bắc không?', cn: '这不是中药 (Zhè bú shì zhōngyào)', filePrefix: 'Bai 13 zhe shi bu shi' },
      { num: 14, title: 'Bài 14: Xe của bạn là xe mới hay cũ?', cn: '你的车是新的还是旧的 (Nǐ de chē shì xīn de háishi jiù de)', filePrefix: 'Bai 14 Ni de che' },
      { num: 15, title: 'Bài 15: Công ty các bạn có bao nhiêu nhân viên?', cn: '你们公司有多少职员 (Nǐmen gōngsī yǒu duōshao zhíyuán)', filePrefix: 'Bai 15 Nimen gongsi' }
    ]
  },
  {
    id: 'course-hsk3-q2',
    title: 'Giáo Trình HSK 3.0: Quyển 2 (Sơ Cấp Nâng Cao)',
    chinese_title: '新HSK 3.0 第二册',
    level: 'HSK 2 - 3',
    description: 'Giáo trình chuẩn HSK 3.0 mới Quyển 2: 10 bài học chuyên sâu kèm Slide PPT mở rộng cấu trúc ngữ pháp, biểu đạt phức hợp và giao tiếp thực tế.',
    tag: 'HSK 3.0 Mới',
    total_lessons: 10,
    teacher_name: 'Cô Hoài (Giáo Viên 01)',
    teacher_avatar: '怀',
    folder: 'QUYỂN 2',
    lessons: [
      { num: 16, title: 'Bài 16: Bạn có thường đi thư viện không?', cn: '你常去图书馆吗 (Nǐ cháng qù túshūguǎn ma)', filePrefix: '16 第16课' },
      { num: 17, title: 'Bài 17: Cậu ấy đang làm gì thế?', cn: '他在做什么呢 (Tā zài zuò shénme ne)', filePrefix: '17第17课' },
      { num: 18, title: 'Bài 18: Tôi đi bưu điện gửi bưu phẩm', cn: '我去邮局寄包裹 (Wǒ qù yóujú jì bāoguǒ)', filePrefix: '18第18课' },
      { num: 19, title: 'Bài 19: Có thể thử một chút không?', cn: '可以试试吗 (Kěyǐ shìshi ma)', filePrefix: '19第19课' },
      { num: 20, title: 'Bài 20: Chúc bạn sinh nhật vui vẻ', cn: '祝你生日快乐 (Zhù nǐ shēngrì kuàilè)', filePrefix: '20第20课' },
      { num: 21, title: 'Bài 21: Xuất phát lúc 7 giờ sáng', cn: '明天我们七点一刻出发 (Bí 21 - Q2)', filePrefix: 'Bài 21' },
      { num: 22, title: 'Bài 22: Tôi dự định đến sở thú', cn: '我打算去动物园 (Bài 22 - Q2)', filePrefix: 'Bài 22' },
      { num: 23, title: 'Bài 23: Trong trường có bưu điện không?', cn: '学校里边有邮局吗 (Bài 23 - Q2)', filePrefix: 'Bài 23' },
      { num: 24, title: 'Bài 24: Tôi muốn mua đồ lưu niệm', cn: '我想买纪念品 (Bài 24 - Q2)', filePrefix: 'Bài 24' },
      { num: 25, title: 'Bài 25: Chuyến du lịch Bắc Kinh', cn: '北京之行 (Bài 25 - Q2)', filePrefix: 'Bài 25' }
    ]
  },
  {
    id: 'course-hsk3-q3',
    title: 'Giáo Trình HSK 3.0: Quyển 3 (Trung Cấp Toàn Diện)',
    chinese_title: '新HSK 3.0 第三册',
    level: 'HSK 3.0',
    description: 'Giáo trình chuẩn HSK 3.0 mới Quyển 3: 15 bài học toàn diện kèm Slide PPT trực quan giúp nắm vững mẫu câu, bổ ngữ xu hướng và ngữ pháp HSK 3 mới.',
    tag: 'HSK 3.0 Mới',
    total_lessons: 15,
    teacher_name: 'Cô Hoài (Giáo Viên 01)',
    teacher_avatar: '怀',
    folder: 'QUYỂN 3',
    lessons: [
      { num: 1, title: 'Bài 1: Bạn muốn ăn gì thì gọi nấy', cn: '你想吃什么就点什么', filePrefix: 'HSK3 Bai 1 - 你想吃什么' },
      { num: 2, title: 'Bài 2: Chúng tôi chuyển nhà rồi', cn: '我们搬家了', filePrefix: 'HSK3 Bai 2 - 我们搬家了' },
      { num: 3, title: 'Bài 3: Bắc Kinh chẳng nóng chút nào', cn: '北京一点儿也不热', filePrefix: 'HSK3 Bai 3 - 北京一点儿也不热' },
      { num: 4, title: 'Bài 4: Từng bức ảnh này đều rất đẹp', cn: '这些照片张张都非常好看', filePrefix: 'HSK3 Bai 4 - 这些照片' },
      { num: 5, title: 'Bài 5: Đi tàu cao tốc tiện hơn đi máy bay', cn: '坐高铁比坐飞机方便', filePrefix: 'HSK3 Bai 5 - 坐高铁' },
      { num: 6, title: 'Bài 6: Tôi không những muốn mua váy mà còn muốn mua giày', cn: '我不但想买裙子，而且还想买鞋子', filePrefix: 'HSK3 Bai 6 - 我不但想买裙子' },
      { num: 7, title: 'Bài 7: Lời bác sĩ tôi hiểu rõ hơn ai hết', cn: '医生的话我比谁都清楚', filePrefix: 'HSK3 Bai 7 - 医生的话' },
      { num: 8, title: 'Bài 8: Ngày mai bạn có đến được không?', cn: '明天你来得了吗', filePrefix: 'HSK3 Bai 8 - 明天你来得了吗' },
      { num: 9, title: 'Bài 9: Tôi phải nộp bài tập cho giáo viên', cn: '我要把作业交给老师', filePrefix: 'HSK3 Bai 9 - 我要把作业交给老师' },
      { num: 10, title: 'Bài 10: Tôi đã in tài liệu ra rồi', cn: '我把资料打印出来了', filePrefix: 'HSK3 Bai 10 - 我把资料打印出来了' },
      { num: 11, title: 'Bài 11: Sao tự nhiên trời lại nổi gió thế này', cn: '怎么突然刮起风来了', filePrefix: 'HSK3 Bai 11 - 怎么突然刮起风来了' },
      { num: 12, title: 'Bài 12: Sách hay rất dễ bị người khác mượn mất', cn: '好书会容易被别人借走', filePrefix: 'HSK3 Bai 12 - 好书会容易被别人借走' },
      { num: 13, title: 'Bài 13: Tôi tin chúng ta đều có thể giải quyết nan đề này', cn: '我相信我们都能解决这个难题', filePrefix: 'HSK3 Bai 13 - 我相信我们都能解决' },
      { num: 14, title: 'Bài 14: Gấu trúc là quốc bảo của Trung Quốc', cn: '大熊猫是中国的国宝', filePrefix: 'HSK3 Bai 14 - 大熊猫是中国的国宝' },
      { num: 15, title: 'Bài 15: Tết Nguyên Đán là ngày lễ quan trọng nhất', cn: '春节是中国最重要的节日', filePrefix: 'HSK3' }
    ]
  }
];

function sanitizePath(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

async function run() {
  await pgClient.connect();
  console.log('Connected to PostgreSQL.');

  for (const course of HSK3_COURSES) {
    console.log(`\n========================================`);
    console.log(`📚 Processing Course: ${course.title} (${course.id})`);
    console.log(`========================================`);

    // 1. Upsert Course in Database
    await pgClient.query(`
      INSERT INTO public.courses (id, title, chinese_title, level, description, tag, total_lessons, teacher_name, teacher_avatar)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        chinese_title = EXCLUDED.chinese_title,
        level = EXCLUDED.level,
        description = EXCLUDED.description,
        tag = EXCLUDED.tag,
        total_lessons = EXCLUDED.total_lessons,
        teacher_name = EXCLUDED.teacher_name,
        teacher_avatar = EXCLUDED.teacher_avatar;
    `, [
      course.id,
      course.title,
      course.chinese_title,
      course.level,
      course.description,
      course.tag,
      course.total_lessons,
      course.teacher_name,
      course.teacher_avatar
    ]);
    console.log(`✓ Upserted Course: ${course.id}`);

    // 2. Read folder files
    const folderPath = path.join(BASE_DIR, course.folder);
    if (!fs.existsSync(folderPath)) {
      console.warn(`⚠ Folder not found: ${folderPath}`);
      continue;
    }

    const availableFiles = fs.readdirSync(folderPath).filter(f => f.endsWith('.pptx'));

    for (const item of course.lessons) {
      const lessonId = `${course.id}-l${String(item.num).padStart(2, '0')}`;
      
      // Match file accurately by lesson number and title
      const matchedFile = availableFiles.find(f => {
        const match = f.match(/(?:bai|bài|第|\s|^)(\d+)(?:课|\s|-|\.|_)/i);
        if (match && parseInt(match[1], 10) === item.num) {
          return true;
        }
        const normF = f.normalize('NFC').toLowerCase();
        const normP = item.filePrefix.normalize('NFC').toLowerCase();
        return normF.includes(normP);
      });

      let publicPptUrl = null;
      let pptFilename = matchedFile || null;

      // Check if already uploaded
      const existing = await pgClient.query('SELECT ppt_url, ppt_filename FROM public.lessons WHERE id = $1', [lessonId]);
      if (existing.rows[0]?.ppt_url) {
        publicPptUrl = existing.rows[0].ppt_url;
        pptFilename = existing.rows[0].ppt_filename || matchedFile;
        console.log(`  ✓ Lesson ${item.num}: Already uploaded (${publicPptUrl})`);
      } else if (matchedFile) {
        const fullLocalPath = path.join(folderPath, matchedFile);
        const fileStat = fs.statSync(fullLocalPath);
        const cleanName = `bai-${String(item.num).padStart(2, '0')}-${sanitizePath(item.title)}.pptx`;
        const storagePath = `ppt/${sanitizePath(course.folder)}/${cleanName}`;

        console.log(`  -> Lesson ${item.num}: Found ${matchedFile} (${(fileStat.size / (1024*1024)).toFixed(2)} MB)`);
        console.log(`     Uploading to Supabase: ${storagePath}...`);

        try {
          const fileBuffer = fs.readFileSync(fullLocalPath);
          const { data: uploadRes, error: uploadErr } = await supabase.storage
            .from('course-materials')
            .upload(storagePath, fileBuffer, {
              upsert: true,
              contentType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
            });

          if (uploadErr) {
            console.error(`     ❌ Upload error: ${uploadErr.message}`);
          } else {
            const { data: pubData } = supabase.storage
              .from('course-materials')
              .getPublicUrl(storagePath);
            publicPptUrl = pubData.publicUrl;
            console.log(`     ✓ Uploaded: ${publicPptUrl}`);
          }
        } catch (err) {
          console.error(`     ❌ Exception reading/uploading: ${err.message}`);
        }
      } else {
        console.warn(`  ⚠ No matching PPTX found for Lesson ${item.num}`);
      }

      // Upsert Lesson
      await pgClient.query(`
        INSERT INTO public.lessons (id, course_id, number, title, chinese_title, description, hsk_level, is_unlocked, ppt_url, ppt_filename)
        VALUES ($1, $2, $3, $4, $5, $6, $7, true, $8, $9)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          chinese_title = EXCLUDED.chinese_title,
          description = EXCLUDED.description,
          hsk_level = EXCLUDED.hsk_level,
          ppt_url = COALESCE(EXCLUDED.ppt_url, public.lessons.ppt_url),
          ppt_filename = COALESCE(EXCLUDED.ppt_filename, public.lessons.ppt_filename);
      `, [
        lessonId,
        course.id,
        item.num,
        item.title,
        item.cn,
        `Bài giảng Slide PPT chuẩn HSK 3.0: ${item.title}`,
        course.level,
        publicPptUrl,
        pptFilename
      ]);
    }
  }

  console.log('\n🎉 ALL HSK 3.0 COURSES AND PPT LESSONS SYNCED SUCCESSFULLY!');
  await pgClient.end();
}

run().catch(console.error);

