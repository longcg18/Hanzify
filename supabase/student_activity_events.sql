-- Apply once in Supabase SQL Editor before enabling staff activity history.
CREATE TABLE IF NOT EXISTS public.student_activity_events (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('practice', 'game')),
  title TEXT NOT NULL,
  score INTEGER,
  max_score INTEGER,
  xp INTEGER,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS student_activity_events_student_completed_idx
  ON public.student_activity_events(student_id, completed_at DESC);
ALTER TABLE public.student_activity_events ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT ON public.student_activity_events TO authenticated;
DROP POLICY IF EXISTS "Students create own activity" ON public.student_activity_events;
DROP POLICY IF EXISTS "Students read own activity" ON public.student_activity_events;
DROP POLICY IF EXISTS "Staff read student activity" ON public.student_activity_events;
CREATE POLICY "Students create own activity" ON public.student_activity_events FOR INSERT TO authenticated
  WITH CHECK (student_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));
CREATE POLICY "Students read own activity" ON public.student_activity_events FOR SELECT TO authenticated
  USING (student_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));
CREATE POLICY "Staff read student activity" ON public.student_activity_events FOR SELECT TO authenticated
  USING (public.is_hanzify_staff());
