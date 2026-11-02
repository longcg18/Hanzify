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

  // Create course-materials bucket if not exists or update file_size_limit to null (unlimited)
  await client.query(`
    INSERT INTO storage.buckets (id, name, public, file_size_limit)
    VALUES ('course-materials', 'course-materials', true, 268435456)
    ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 268435456;
  `);

  // Allow public select and insert
  await client.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Public Access Course Materials'
      ) THEN
        CREATE POLICY "Public Access Course Materials" ON storage.objects
        FOR SELECT USING (bucket_id = 'course-materials');
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Public Upload Course Materials'
      ) THEN
        CREATE POLICY "Public Upload Course Materials" ON storage.objects
        FOR INSERT WITH CHECK (bucket_id = 'course-materials');
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Public Update Course Materials'
      ) THEN
        CREATE POLICY "Public Update Course Materials" ON storage.objects
        FOR UPDATE USING (bucket_id = 'course-materials');
      END IF;
    END
    $$;
  `);

  // Also raise hanzify-media limit to 250MB just in case
  await client.query(`UPDATE storage.buckets SET file_size_limit = 268435456 WHERE id = 'hanzify-media';`);

  const buckets = await client.query('SELECT id, name, public, file_size_limit FROM storage.buckets');
  console.log('Buckets after update:', buckets.rows);

  await client.end();
}

main().catch(console.error);

