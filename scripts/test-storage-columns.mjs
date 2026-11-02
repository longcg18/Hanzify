import pg from 'pg';
import { createClient } from '@supabase/supabase-js';

const { Client } = pg;
const pgClient = new Client({
  host: 'aws-0-ap-northeast-2.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.vwuikidgncknuozufiyi',
  password: 'ThuHoai1409',
  ssl: { rejectUnauthorized: false }
});

const SUPABASE_URL = 'https://vwuikidgncknuozufiyi.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Tl4-IAKBx5KT9d2CiL8tog_fzEq4qc2';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  await pgClient.connect();

  console.log('1. Checking and adding ppt_url and ppt_filename columns to lessons table...');
  await pgClient.query(`
    ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS ppt_url TEXT;
    ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS ppt_filename TEXT;
  `);
  console.log('✓ Columns added/verified successfully!');

  const columns = await pgClient.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'lessons'
  `);
  console.log('Current lessons columns:', columns.rows.map(c => c.column_name));

  // Test storage upload test file
  console.log('2. Testing upload to course-materials bucket...');
  const testBuf = Buffer.from('Hanzify PPT Test', 'utf-8');
  const { data: uploadData, error: uploadErr } = await supabase.storage
    .from('course-materials')
    .upload('test.txt', testBuf, { upsert: true, contentType: 'text/plain' });

  if (uploadErr) {
    console.error('Storage upload error:', uploadErr);
  } else {
    console.log('✓ Storage upload success:', uploadData);
    const { data: pubData } = supabase.storage
      .from('course-materials')
      .getPublicUrl('test.txt');
    console.log('Public URL:', pubData.publicUrl);
  }

  await pgClient.end();
}

main().catch(console.error);

