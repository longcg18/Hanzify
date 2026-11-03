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

  // 1. Get lessons in course-hsk1 ordered by number
  const hsk1Lessons = await client.query(`
    SELECT id, "number", title 
    FROM lessons 
    WHERE course_id = 'course-hsk1' 
    ORDER BY "number" ASC
  `);
  console.log('HSK1 lessons in DB:', hsk1Lessons.rows);

  // 2. Get lessons in course-hsk3-q1 ordered by number
  const q1Lessons = await client.query(`
    SELECT id, "number", title 
    FROM lessons 
    WHERE course_id = 'course-hsk3-q1' 
    ORDER BY "number" ASC
  `);
  console.log('HSK3 Q1 lessons in DB:', q1Lessons.rows);

  // 3. For each lesson in Q1, copy questions from corresponding lesson in HSK1
  for (let i = 0; i < q1Lessons.rows.length; i++) {
    const targetLesson = q1Lessons.rows[i];
    const sourceLesson = hsk1Lessons.rows[i];
    if (!sourceLesson) continue;

    // Check if target already has questions
    const existing = await client.query('SELECT count(*) FROM homework_questions WHERE lesson_id = $1', [targetLesson.id]);
    if (parseInt(existing.rows[0].count) > 0) {
      console.log(`Lesson ${targetLesson.id} already has ${existing.rows[0].count} questions. Skipping.`);
      continue;
    }

    const sourceQuestions = await client.query('SELECT * FROM homework_questions WHERE lesson_id = $1 ORDER BY sort_order ASC', [sourceLesson.id]);
    console.log(`Copying ${sourceQuestions.rows.length} questions from ${sourceLesson.id} (${sourceLesson.title}) -> ${targetLesson.id} (${targetLesson.title})`);

    for (const q of sourceQuestions.rows) {
      const newId = `q-${targetLesson.id}-${q.id}`;
      await client.query(`
        INSERT INTO homework_questions (id, lesson_id, type, prompt, data_json, sort_order)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO NOTHING
      `, [newId, targetLesson.id, q.type, q.prompt, q.data_json, q.sort_order]);
    }
  }

  // 4. Do the same for course-hsk2 -> course-hsk3-q2
  const hsk2Lessons = await client.query(`
    SELECT id, "number", title 
    FROM lessons 
    WHERE course_id = 'course-hsk2' 
    ORDER BY "number" ASC
  `);
  const q2Lessons = await client.query(`
    SELECT id, "number", title 
    FROM lessons 
    WHERE course_id = 'course-hsk3-q2' 
    ORDER BY "number" ASC
  `);
  console.log(`HSK2 lessons: ${hsk2Lessons.rows.length}, Q2 lessons: ${q2Lessons.rows.length}`);

  for (let i = 0; i < q2Lessons.rows.length; i++) {
    const targetLesson = q2Lessons.rows[i];
    const sourceLesson = hsk2Lessons.rows[i];
    if (!sourceLesson) continue;

    const existing = await client.query('SELECT count(*) FROM homework_questions WHERE lesson_id = $1', [targetLesson.id]);
    if (parseInt(existing.rows[0].count) > 0) {
      console.log(`Lesson ${targetLesson.id} already has ${existing.rows[0].count} questions. Skipping.`);
      continue;
    }

    const sourceQuestions = await client.query('SELECT * FROM homework_questions WHERE lesson_id = $1 ORDER BY sort_order ASC', [sourceLesson.id]);
    console.log(`Copying ${sourceQuestions.rows.length} questions from ${sourceLesson.id} (${sourceLesson.title}) -> ${targetLesson.id} (${targetLesson.title})`);

    for (const q of sourceQuestions.rows) {
      const newId = `q-${targetLesson.id}-${q.id}`;
      await client.query(`
        INSERT INTO homework_questions (id, lesson_id, type, prompt, data_json, sort_order)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO NOTHING
      `, [newId, targetLesson.id, q.type, q.prompt, q.data_json, q.sort_order]);
    }
  }

  // 5. Total count after sync
  const totalAfter = await client.query('SELECT count(*) FROM homework_questions');
  console.log('Total homework_questions after sync:', totalAfter.rows[0].count);

  await client.end();
}

main().catch(console.error);

