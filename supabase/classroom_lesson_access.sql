-- Persist lesson access safely and broadcast changes to connected students.
ALTER TABLE public.classrooms
  ADD COLUMN IF NOT EXISTS unlocked_lessons JSONB NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Cho phép ghi dữ liệu lớp học" ON public.classrooms;
DROP POLICY IF EXISTS "Public Manage Classrooms" ON public.classrooms;
DROP POLICY IF EXISTS "Staff ghi dữ liệu lớp học" ON public.classrooms;
DROP POLICY IF EXISTS "Staff manage classrooms" ON public.classrooms;

CREATE POLICY "Staff manage classrooms"
  ON public.classrooms
  FOR ALL
  TO authenticated
  USING (public.is_hanzify_staff())
  WITH CHECK (public.is_hanzify_staff());

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'classrooms'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.classrooms;
  END IF;
END
$$;
