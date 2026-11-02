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
  const buckets = await client.query('SELECT * FROM storage.buckets');
  console.log('Buckets:', buckets.rows);

  const policies = await client.query("SELECT policyname, tablename, cmd FROM pg_policies WHERE schemaname = 'storage'");
  console.log('Storage Policies:', policies.rows);

  await client.end();
}

main().catch(console.error);

