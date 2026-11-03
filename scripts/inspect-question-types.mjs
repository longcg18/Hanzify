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
  const types = await client.query('SELECT distinct type FROM homework_questions');
  console.log('Types in homework_questions:', types.rows);

  for (const t of types.rows) {
    const sample = await client.query('SELECT * FROM homework_questions WHERE type = $1 LIMIT 1', [t.type]);
    console.log(`\n=== TYPE: ${t.type} ===`);
    console.log('Prompt:', sample.rows[0]?.prompt);
    console.log('Data:', JSON.stringify(sample.rows[0]?.data_json, null, 2));
  }

  await client.end();
}
main().catch(console.error);
