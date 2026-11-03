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
  const res = await client.query('SELECT id, number, title FROM lessons WHERE course_id = $1 ORDER BY number', ['course-hsk3-q3']);
  console.log('Q3 lessons:', res.rows);
  await client.end();
}
main().catch(console.error);

