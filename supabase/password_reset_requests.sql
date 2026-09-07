-- Run this file separately in the Supabase SQL Editor.
-- It is intentionally independent from schema.sql because the deployed app still
-- uses the legacy public.users authentication flow.

CREATE TABLE IF NOT EXISTS public.password_reset_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  identifier TEXT NOT NULL,
  user_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved')),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT REFERENCES public.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS password_reset_requests_status_idx
  ON public.password_reset_requests(status, requested_at DESC);

ALTER TABLE public.password_reset_requests ENABLE ROW LEVEL SECURITY;

-- Compatibility policies for the app's current direct-client authentication.
-- Replace these with Supabase Auth role-based policies when authentication is migrated.
DROP POLICY IF EXISTS "Public can submit reset requests" ON public.password_reset_requests;
CREATE POLICY "Public can submit reset requests"
  ON public.password_reset_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'pending' AND resolved_at IS NULL AND resolved_by IS NULL);

DROP POLICY IF EXISTS "Legacy admins can read reset requests" ON public.password_reset_requests;
CREATE POLICY "Legacy admins can read reset requests"
  ON public.password_reset_requests FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Legacy admins can update reset requests" ON public.password_reset_requests;
CREATE POLICY "Legacy admins can update reset requests"
  ON public.password_reset_requests FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (status IN ('pending', 'resolved'));
