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
  const res = await client.query(`
    SELECT l.id, l.course_id, l.title, count(q.id) as q_count
    FROM lessons l
    JOIN homework_questions q ON q.lesson_id = l.id
    GROUP BY l.id, l.course_id, l.title
    ORDER BY l.course_id, l.id
  `);
  console.log('Lessons with questions:', res.rows);

  // Also check if there are homework_questions whose lesson_id does NOT match lessons.id
  const orphans = await client.query(`
    SELECT distinct q.lesson_id, count(q.id) as cnt
    FROM homework_questions q
    LEFT JOIN lessons l ON l.id = q.lesson_id
    WHERE l.id IS NULL
    GROUP BY q.lesson_id
  `);
  console.log('Orphan lesson_ids in homework_questions:', orphans.rows);

  await client.end();
}
main().catch(console.error);
