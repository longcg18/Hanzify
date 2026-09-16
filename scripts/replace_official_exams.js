import pg from 'pg';
import { officialExamSources } from './official_exam_sources.js';

const password = process.env.SUPABASE_DB_PASSWORD;
if (!password) throw new Error('Set SUPABASE_DB_PASSWORD before running this script.');

const client = new pg.Client({
  host: process.env.SUPABASE_DB_HOST || 'aws-0-ap-northeast-2.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: process.env.SUPABASE_DB_USER || 'postgres.vwuikidgncknuozufiyi',
  password,
  ssl: { rejectUnauthorized: false },
});

const ranges = {
  1: [5, 5, 5, 5, 5, 5, 5, 5],
  2: [10, 10, 10, 5, 5, 5, 5, 10],
  3: [10, 10, 10, 10, 10, 10, 10, 5, 5],
};

function optionsFor(answer, level, partIndex) {
  if (level === 3 && partIndex >= 7) return [];
  if (answer === '√' || answer === '×') return ['√', '×'];
  const isMatching = level === 1 ? [2, 5, 6, 7].includes(partIndex)
    : level === 2 ? [1, 4, 5, 7].includes(partIndex)
      : [0, 4, 5].includes(partIndex);
  return (isMatching ? ['A', 'B', 'C', 'D', 'E', 'F'] : ['A', 'B', 'C']).filter((x) => x <= 'F');
}

await client.connect();
try {
  await client.query('BEGIN');
  await client.query('ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS source_pdf_url TEXT');
  await client.query('ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS audio_url TEXT');
  const ids = officialExamSources.map((source) => source.id);
  const existing = await client.query('SELECT id FROM public.exams WHERE id = ANY($1::text[])', [ids]);
  if (existing.rowCount !== 6) throw new Error(`Expected six existing exam IDs, found ${existing.rowCount}. Rolling back.`);

  for (const source of officialExamSources) {
    const level = Number(source.level.slice(-1));
    const counts = ranges[level];
    const title = `Đề thi HSK ${level} ${source.code} — đề gốc`;
    await client.query(
      `UPDATE public.exams SET title=$2, chinese_title=$3, level=$4, duration=$5,
       description=$6, tag=$7, source_pdf_url=$8, audio_url=$9 WHERE id=$1`,
      [source.id, title, `新汉语水平考试 ${source.code}`, source.level, source.duration,
        `Đề ${source.code} từ bộ đề công khai của Chinese Testing International. Xem nguyên trang PDF để làm theo tranh và nghe bản ghi đầy đủ.`,
        'Đề gốc CTI', source.pdfUrl, source.audioUrl],
    );
    await client.query('DELETE FROM public.exam_skills WHERE exam_id=$1', [source.id]);
    let offset = 0;
    for (const [partIndex, count] of counts.entries()) {
      const skillType = level === 3 && partIndex >= 7 ? 'writing'
        : partIndex < 4 ? 'listening' : 'reading';
      const skillId = `${source.id}-${skillType}`;
      if (partIndex === 0 || partIndex === 4 || (level === 3 && partIndex === 7)) {
        await client.query(
          `INSERT INTO public.exam_skills(id, exam_id, skill_type, name, chinese_name, sort_order)
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [skillId, source.id, skillType,
            skillType === 'listening' ? 'Nghe hiểu' : skillType === 'reading' ? 'Đọc hiểu' : 'Viết',
            skillType === 'listening' ? '听力' : skillType === 'reading' ? '阅读' : '书写',
            skillType === 'listening' ? 1 : skillType === 'reading' ? 2 : 3],
        );
      }
      const withinSkill = skillType === 'listening' ? partIndex + 1
        : skillType === 'reading' ? partIndex - 3 : partIndex - 6;
      const partId = `${source.id}-part-${partIndex + 1}`;
      await client.query(
        `INSERT INTO public.exam_parts(id, skill_id, part_number, title, instructions, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [partId, skillId, withinSkill, `第${'一二三四'[withinSkill - 1]}部分 · Câu ${offset + 1}–${offset + count}`,
          'Xem nội dung và tranh trên trang đề gốc, chọn đáp án trên phiếu bên dưới.', partIndex + 1],
      );
      for (let localIndex = 0; localIndex < count; localIndex++) {
        const number = offset + localIndex + 1;
        const answer = source.answers[number - 1];
        const options = optionsFor(answer, level, partIndex);
        if (options.length && !options.includes(answer)) throw new Error(`${source.code} question ${number}: invalid option ${answer}`);
        await client.query(
          `INSERT INTO public.exam_questions
           (id, part_id, question_number, prompt, options, correct_answer, sort_order)
           VALUES ($1,$2,$3,$4,$5::jsonb,$6,$7)`,
          [`${source.id}-q${number}`, partId, number,
            skillType === 'writing' ? `Câu ${number}: viết đáp án theo đề gốc.` : `Câu ${number}: xem đề gốc và chọn đáp án.`,
            JSON.stringify(options), answer, localIndex + 1],
        );
      }
      offset += count;
    }
    console.log(`${source.code}: ${offset} official answer-key entries replaced`);
  }
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  await client.end();
}
