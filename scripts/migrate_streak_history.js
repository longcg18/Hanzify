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
await client.query('BEGIN');
try {
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.streak_check_ins (
      user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
      check_in_date DATE NOT NULL,
      xp_awarded INTEGER NOT NULL DEFAULT 50,
      created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
      PRIMARY KEY (user_id, check_in_date)
    );
    CREATE INDEX IF NOT EXISTS streak_check_ins_user_date_idx
      ON public.streak_check_ins(user_id, check_in_date DESC);
    INSERT INTO public.streak_check_ins (user_id, check_in_date, xp_awarded)
    SELECT user_id, last_check_in, 50 FROM public.user_streaks WHERE last_check_in IS NOT NULL
    ON CONFLICT (user_id, check_in_date) DO NOTHING;
    ALTER TABLE public.streak_check_ins ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Học viên xem lịch sử streak cá nhân" ON public.streak_check_ins;
    DROP POLICY IF EXISTS "Nhân viên xem lịch sử streak" ON public.streak_check_ins;
    CREATE POLICY "Học viên xem lịch sử streak cá nhân" ON public.streak_check_ins FOR SELECT TO authenticated
      USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));
    CREATE POLICY "Nhân viên xem lịch sử streak" ON public.streak_check_ins FOR SELECT TO authenticated
      USING (public.is_hanzify_staff());
    GRANT SELECT ON public.streak_check_ins TO authenticated;

    CREATE OR REPLACE FUNCTION public.check_in_user()
    RETURNS public.user_streaks
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public
    AS $$
    DECLARE
      v_today DATE := (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Ho_Chi_Minh')::DATE;
      v_row public.user_streaks;
      v_user_id TEXT;
      v_inserted INTEGER := 0;
    BEGIN
      SELECT id INTO v_user_id FROM public.users WHERE auth_user_id = auth.uid() AND status = 'active';
      IF v_user_id IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501'; END IF;

      INSERT INTO public.user_streaks (user_id, current_streak, longest_streak, last_check_in, total_xp)
      VALUES (v_user_id, 0, 0, NULL, 0)
      ON CONFLICT (user_id) DO NOTHING;

      SELECT * INTO v_row FROM public.user_streaks WHERE user_id = v_user_id FOR UPDATE;
      INSERT INTO public.streak_check_ins (user_id, check_in_date, xp_awarded)
      VALUES (v_user_id, v_today, 50)
      ON CONFLICT (user_id, check_in_date) DO NOTHING;
      GET DIAGNOSTICS v_inserted = ROW_COUNT;

      IF v_inserted > 0 THEN
        v_row.current_streak := CASE WHEN v_row.last_check_in = v_today - 1 THEN v_row.current_streak + 1 ELSE 1 END;
        v_row.longest_streak := GREATEST(v_row.longest_streak, v_row.current_streak);
        v_row.last_check_in := v_today;
        v_row.total_xp := v_row.total_xp + 50;
        UPDATE public.user_streaks SET
          current_streak = v_row.current_streak,
          longest_streak = v_row.longest_streak,
          last_check_in = v_row.last_check_in,
          total_xp = v_row.total_xp,
          updated_at = timezone('utc'::text, now())
        WHERE user_id = v_user_id
        RETURNING * INTO v_row;
      END IF;
      RETURN v_row;
    END;
    $$;
    REVOKE ALL ON FUNCTION public.check_in_user() FROM PUBLIC;
    GRANT EXECUTE ON FUNCTION public.check_in_user() TO authenticated;
  `);
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
}

const verification = await client.query(`
  SELECT
    (SELECT count(*)::int FROM public.streak_check_ins) AS history_rows,
    (SELECT count(*)::int FROM public.user_streaks WHERE last_check_in IS NOT NULL) AS streak_rows,
    (SELECT count(*)::int
       FROM public.user_streaks s
      WHERE s.last_check_in IS NOT NULL
        AND NOT EXISTS (
          SELECT 1 FROM public.streak_check_ins h
          WHERE h.user_id = s.user_id AND h.check_in_date = s.last_check_in
        )) AS missing_backfills,
    EXISTS (
      SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
      WHERE n.nspname = 'public' AND p.proname = 'check_in_user'
    ) AS rpc_ready
`);
console.log(JSON.stringify(verification.rows[0]));
await client.end();
