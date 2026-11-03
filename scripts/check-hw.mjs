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
  const qCount = await client.query('SELECT count(*) FROM homework_questions');
  console.log('homework_questions count:', qCount.rows[0]);
  const sample = await client.query('SELECT id, lesson_id, type, prompt FROM homework_questions LIMIT 10');
  console.log('Sample homework_questions:', sample.rows);
  const lessons = await client.query('SELECT id, course_id, title FROM lessons LIMIT 10');
  console.log('Sample lessons:', lessons.rows);

  const distinctLessonsWithQ = await client.query('SELECT distinct lesson_id FROM homework_questions');
  console.log('Lessons with questions in homework_questions:', distinctLessonsWithQ.rows);

  await client.end();
}
main().catch(console.error);

