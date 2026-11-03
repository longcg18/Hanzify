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
  const subCols = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'submissions'
  `);
  console.log('submissions columns:', subCols.rows);

  const sampleSub = await client.query('SELECT * FROM submissions LIMIT 2');
  console.log('Sample submission:', sampleSub.rows);

  await client.end();
}
main().catch(console.error);

