import fs from 'fs';
import path from 'path';
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
  const folder = path.join('D:', 'Code', 'Github', 'Hanzify', 'DẠY THEO FORMAT MỚI', 'QUYỂN 3');
  const files = fs.readdirSync(folder);
  const file15 = files.find(f => f.includes('15'));
  console.log('File 15:', file15);

  if (file15) {
    const fpath = path.join(folder, file15);
    const storagePath = 'ppt/quyen-3/bai-15-chunjie.pptx';
    const buffer = fs.readFileSync(fpath);
    const { data, error } = await supabase.storage
      .from('course-materials')
      .upload(storagePath, buffer, { upsert: true, contentType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });

    if (error) console.error('Upload err:', error);
    else {
      const { data: pubData } = supabase.storage.from('course-materials').getPublicUrl(storagePath);
      console.log('Public URL for Bai 15:', pubData.publicUrl);
      await pgClient.query(`
        UPDATE public.lessons 
        SET ppt_url = $1, ppt_filename = $2
        WHERE id = 'course-hsk3-q3-l15'
      `, [pubData.publicUrl, file15]);
      console.log('Updated lesson 15 in database!');
    }
  }

  // Also check Bai 16 of Quyen 2
  const folder2 = path.join('D:', 'Code', 'Github', 'Hanzify', 'DẠY THEO FORMAT MỚI', 'QUYỂN 2');
  const file16 = fs.readdirSync(folder2).find(f => f.includes('16'));
  console.log('File 16:', file16);
  if (file16) {
    const fpath = path.join(folder2, file16);
    const storagePath = 'ppt/quyen-2/bai-16-tushuguan.pptx';
    const buffer = fs.readFileSync(fpath);
    const { data, error } = await supabase.storage
      .from('course-materials')
      .upload(storagePath, buffer, { upsert: true, contentType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
    if (error) console.error('Upload err 16:', error);
    else {
      const { data: pubData } = supabase.storage.from('course-materials').getPublicUrl(storagePath);
      console.log('Public URL for Bai 16:', pubData.publicUrl);
      await pgClient.query(`
        UPDATE public.lessons 
        SET ppt_url = $1, ppt_filename = $2
        WHERE id = 'course-hsk3-q2-l16'
      `, [pubData.publicUrl, file16]);
      console.log('Updated lesson 16 in database!');
    }
  }

  await pgClient.end();
}

main().catch(console.error);

