import pg from 'pg';

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

async function initStorage() {
  const client = new Client(config);
  try {
    await client.connect();
    console.log('Connected to DB');
    const buckets = await client.query('SELECT * FROM storage.buckets');
    console.log('Existing buckets:', buckets.rows.map(b => b.name));

    const hasBucket = buckets.rows.some(b => b.name === 'hanzify-media' || b.id === 'hanzify-media');
    if (!hasBucket) {
      console.log('Creating bucket hanzify-media...');
      await client.query(`
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES ('hanzify-media', 'hanzify-media', true, 52428800, null)
        ON CONFLICT (id) DO UPDATE SET public = true;
      `);
      console.log('Bucket hanzify-media created or updated to public!');
    } else {
      await client.query(`
        UPDATE storage.buckets SET public = true WHERE id = 'hanzify-media';
      `);
      console.log('Bucket hanzify-media already exists, ensured public = true.');
    }

    // Ensure RLS policies on storage.objects
    console.log('Configuring RLS policies on storage.objects for hanzify-media...');
    await client.query(`
      DROP POLICY IF EXISTS "Public Access Hanzify Media" ON storage.objects;
      DROP POLICY IF EXISTS "Public Upload Hanzify Media" ON storage.objects;
      DROP POLICY IF EXISTS "Public Update Hanzify Media" ON storage.objects;
      
      CREATE POLICY "Public Access Hanzify Media"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'hanzify-media');

      CREATE POLICY "Public Upload Hanzify Media"
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'hanzify-media');

      CREATE POLICY "Public Update Hanzify Media"
      ON storage.objects FOR UPDATE
      USING (bucket_id = 'hanzify-media');
    `);
    console.log('✅ Storage policies configured successfully!');

  } catch (err) {
    console.error('❌ Error initializing storage:', err);
  } finally {
    await client.end();
  }
}

initStorage();
