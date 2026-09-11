import fs from 'fs';
import pg from 'pg';

const migrationSource = fs.readFileSync(new URL('./migrate.js', import.meta.url), 'utf8');
const databasePassword = migrationSource.match(/const DB_PASSWORD = '([^']+)'/)?.[1];
if (!databasePassword) throw new Error('Missing database credential');

const client = new pg.Client({
  host: 'aws-0-ap-northeast-2.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.vwuikidgncknuozufiyi',
  password: databasePassword,
  ssl: { rejectUnauthorized: false }
});

await client.connect();
await client.query(`
  CREATE TABLE IF NOT EXISTS public.exam_attempts (
    id TEXT PRIMARY KEY,
    exam_id TEXT,
    student_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    exam_title TEXT NOT NULL,
    level TEXT,
    total_score INTEGER NOT NULL,
    max_score INTEGER NOT NULL,
    duration_seconds INTEGER NOT NULL DEFAULT 0,
    completed_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
  );
  CREATE INDEX IF NOT EXISTS exam_attempts_student_completed_idx
    ON public.exam_attempts(student_id, completed_at DESC);
  ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
  DROP POLICY IF EXISTS "Students create own exam attempts" ON public.exam_attempts;
  DROP POLICY IF EXISTS "Students read own exam attempts" ON public.exam_attempts;
  DROP POLICY IF EXISTS "Staff read exam attempts" ON public.exam_attempts;
  CREATE POLICY "Students create own exam attempts" ON public.exam_attempts FOR INSERT TO authenticated
    WITH CHECK (student_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));
  CREATE POLICY "Students read own exam attempts" ON public.exam_attempts FOR SELECT TO authenticated
    USING (student_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));
  CREATE POLICY "Staff read exam attempts" ON public.exam_attempts FOR SELECT TO authenticated
    USING (public.is_hanzify_staff());
`);

const verification = await client.query(
  "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'exam_attempts'"
);
console.log(verification.rowCount === 1 ? 'exam_attempts ready' : 'exam_attempts missing');
await client.end();
