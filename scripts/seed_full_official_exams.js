// scripts/seed_full_official_exams.js
import pg from 'pg';
import { hsk1Exams } from './hsk_full_data/hsk1_exams.js';
import { hsk2Exams } from './hsk_full_data/hsk2_exams.js';
import { hsk3Exams } from './hsk_full_data/hsk3_exams.js';

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

const ALL_EXAMS = [...hsk1Exams, ...hsk2Exams, ...hsk3Exams];

async function seedFullOfficialExams() {
  const client = new Client(config);
  try {
    console.log('🔄 Connecting to Supabase Cloud PostgreSQL...');
    await client.connect();
    console.log('✅ Connected to Supabase PostgreSQL successfully!\n');

    console.log('🧹 Clearing old exams and cascading children...');
    await client.query('TRUNCATE TABLE public.exam_questions, public.exam_parts, public.exam_skills, public.exams CASCADE;');
    console.log('✅ Cleaned existing exam tables.\n');

    console.log(`🚀 Seeding ${ALL_EXAMS.length} Official Full-Question HSK Exams...`);
    console.log('   - HSK 1: 2 đề x 40 câu = 80 câu');
    console.log('   - HSK 2: 2 đề x 60 câu = 120 câu');
    console.log('   - HSK 3: 2 đề x 80 câu = 160 câu');
    console.log('   👉 TỔNG CỘNG: 360 câu hỏi chuẩn hóa 100%\n');

    for (const exam of ALL_EXAMS) {
      console.log(`📝 Inserting [${exam.level}]: ${exam.title}...`);

      // 1. Insert exam
      await client.query(
        `INSERT INTO public.exams (id, title, chinese_title, level, duration, passing_score, max_score, description, tag)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          exam.id,
          exam.title,
          exam.chineseTitle || '',
          exam.level,
          exam.duration,
          exam.passingScore,
          exam.maxScore,
          exam.description,
          exam.tag
        ]
      );

      // 2. Insert skills
      const skills = exam.skills || [];
      for (const [sIdx, skill] of skills.entries()) {
        const skillType = skill.skill_type || skill.type || 'listening';
        const skillName = skill.name || '';
        const skillChineseName = skill.chinese_name || skill.chineseName || '';

        await client.query(
          `INSERT INTO public.exam_skills (id, exam_id, skill_type, name, chinese_name, sort_order)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            skill.id,
            exam.id,
            skillType,
            skillName,
            skillChineseName,
            sIdx + 1
          ]
        );

        // 3. Insert parts
        const parts = skill.parts || [];
        for (const [pIdx, part] of parts.entries()) {
          const partNum = part.part_number || part.partNumber || (pIdx + 1);
          const partTitle = part.title || `Phần ${partNum}`;
          const instructions = part.instructions || '';

          await client.query(
            `INSERT INTO public.exam_parts (id, skill_id, part_number, title, instructions, sort_order)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              part.id,
              skill.id,
              partNum,
              partTitle,
              instructions,
              pIdx + 1
            ]
          );

          // 4. Insert questions
          const questions = part.questions || [];
          for (const [qIdx, q] of questions.entries()) {
            const qNum = q.question_number || q.questionNumber || (qIdx + 1);
            const qId = q.id || `q-${exam.id}-${qNum}`;
            const prompt = q.prompt || '';
            const audioText = q.audio_text || q.audioText || null;
            const readingText = q.reading_text || q.readingText || null;
            const pinyin = q.pinyin || null;
            const options = q.options || [];
            const correctAnswer = q.correct_answer || q.correctAnswer || '';
            const explanation = q.explanation || '';

            await client.query(
              `INSERT INTO public.exam_questions 
               (id, part_id, question_number, prompt, audio_text, reading_text, pinyin, options, correct_answer, explanation, sort_order)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10, $11)`,
              [
                qId,
                part.id,
                qNum,
                prompt,
                audioText,
                readingText,
                pinyin,
                JSON.stringify(options),
                correctAnswer,
                explanation,
                qIdx + 1
              ]
            );
          }
        }
      }

      const totalQ = (exam.skills || []).reduce(
        (acc, s) => acc + (s.parts || []).reduce((pAcc, p) => pAcc + (p.questions || []).length, 0),
        0
      );
      console.log(`   ✅ Inserted ${exam.title} with ${totalQ} full authentic questions.`);
    }

    console.log('\n🎉 ALL 6 OFFICIAL EXAMS WITH FULL QUESTIONS SEEDED SUCCESSFULLY!');

    const resExams = await client.query('SELECT id, level, title FROM public.exams ORDER BY level, id');
    console.log('\n📋 Exams in Supabase:');
    resExams.rows.forEach((r, i) => console.log(`   ${i + 1}. [${r.level}] ${r.title}`));

    const resCount = await client.query('SELECT count(*) FROM public.exam_questions');
    console.log(`\n📊 Total questions in database: ${resCount.rows[0].count} / 360 questions.`);

  } catch (err) {
    console.error('❌ Error seeding full exams to Supabase:', err);
  } finally {
    await client.end();
  }
}

seedFullOfficialExams();
