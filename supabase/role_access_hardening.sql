-- Enforce the Student / Teacher / Admin access matrix in the database.
-- UI visibility is not a security boundary; every write is protected here too.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.password_reset_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  identifier TEXT NOT NULL,
  user_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved')),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT REFERENCES public.users(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS password_reset_requests_status_idx
  ON public.password_reset_requests(status, requested_at DESC);
ALTER TABLE public.password_reset_requests ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.request_hanzify_password_reset(p_identifier TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_user public.users;
BEGIN
  SELECT * INTO v_user
  FROM public.users
  WHERE status = 'active'
    AND (lower(email) = lower(trim(p_identifier)) OR lower(username) = lower(trim(p_identifier)))
  LIMIT 1;

  -- Always return success so callers cannot enumerate accounts.
  IF v_user.id IS NULL THEN RETURN true; END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.password_reset_requests
    WHERE user_id = v_user.id AND status = 'pending'
  ) THEN
    INSERT INTO public.password_reset_requests (id, user_id, identifier, user_name)
    VALUES ('reset-' || replace(gen_random_uuid()::text, '-', ''), v_user.id, trim(p_identifier), v_user.full_name);
  END IF;
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.request_hanzify_password_reset(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.request_hanzify_password_reset(TEXT) TO anon, authenticated;

DROP POLICY IF EXISTS "Public can submit reset requests" ON public.password_reset_requests;
DROP POLICY IF EXISTS "Legacy admins can read reset requests" ON public.password_reset_requests;
DROP POLICY IF EXISTS "Legacy admins can update reset requests" ON public.password_reset_requests;
DROP POLICY IF EXISTS "Admins manage password reset requests" ON public.password_reset_requests;
CREATE POLICY "Admins manage password reset requests" ON public.password_reset_requests
  FOR ALL TO authenticated
  USING (public.is_hanzify_admin()) WITH CHECK (public.is_hanzify_admin());

-- ---------------------------------------------------------------------------
-- Admin-only account lifecycle. Supabase Auth passwords must never be stored in
-- public.users, so account creation and password reset run in SECURITY DEFINER
-- functions after verifying the caller is an active Hanzify admin.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.admin_create_hanzify_user(
  p_username TEXT,
  p_full_name TEXT,
  p_role TEXT DEFAULT 'student',
  p_phone TEXT DEFAULT '',
  p_password TEXT DEFAULT '123456'
)
RETURNS public.users
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  v_username TEXT := lower(trim(p_username));
  v_email TEXT;
  v_profile_id TEXT := 'user-' || replace(gen_random_uuid()::text, '-', '');
  v_auth_id UUID := gen_random_uuid();
  v_profile public.users;
BEGIN
  IF NOT public.is_hanzify_admin() THEN
    RAISE EXCEPTION 'Admin access required' USING ERRCODE = '42501';
  END IF;
  IF v_username !~ '^[a-z0-9._]{3,32}$' THEN
    RAISE EXCEPTION 'Invalid username';
  END IF;
  IF p_role NOT IN ('admin', 'teacher', 'student') THEN
    RAISE EXCEPTION 'Invalid role';
  END IF;
  IF length(trim(p_password)) < 6 THEN
    RAISE EXCEPTION 'Password must contain at least 6 characters';
  END IF;

  v_email := v_username || '@account.hanzify.com';
  IF EXISTS (SELECT 1 FROM public.users WHERE lower(username) = v_username OR lower(email) = v_email) THEN
    RAISE EXCEPTION 'Username already exists' USING ERRCODE = '23505';
  END IF;

  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, recovery_token, email_change,
    email_change_token_new, email_change_token_current,
    phone_change, phone_change_token, reauthentication_token,
    is_sso_user, is_anonymous
  ) VALUES (
    '00000000-0000-0000-0000-000000000000', v_auth_id, 'authenticated', 'authenticated',
    v_email, crypt(trim(p_password), gen_salt('bf')), now(),
    jsonb_build_object('provider', 'email', 'providers', ARRAY['email']),
    jsonb_build_object('profile_id', v_profile_id, 'username', v_username, 'full_name', trim(p_full_name), 'role', p_role),
    now(), now(), '', '', '', '', '', '', '', '', false, false
  );

  INSERT INTO auth.identities (
    provider_id, user_id, identity_data, provider,
    last_sign_in_at, created_at, updated_at
  ) VALUES (
    v_auth_id::text, v_auth_id,
    jsonb_build_object('sub', v_auth_id::text, 'email', v_email, 'email_verified', true),
    'email', now(), now(), now()
  );

  -- The auth trigger creates the student profile. Apply the admin-selected role
  -- and remaining fields after that trigger has completed.
  UPDATE public.users
  SET username = v_username,
      email = v_email,
      full_name = trim(p_full_name),
      role = p_role,
      phone = nullif(trim(p_phone), ''),
      status = 'active',
      auth_user_id = v_auth_id
  WHERE id = v_profile_id
  RETURNING * INTO v_profile;

  IF v_profile.id IS NULL THEN
    INSERT INTO public.users (id, auth_user_id, username, email, full_name, role, phone, status)
    VALUES (v_profile_id, v_auth_id, v_username, v_email, trim(p_full_name), p_role, nullif(trim(p_phone), ''), 'active')
    RETURNING * INTO v_profile;
  END IF;

  RETURN v_profile;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_resolve_password_reset(
  p_request_id TEXT,
  p_user_id TEXT,
  p_new_password TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  v_auth_user_id UUID;
  v_admin_id TEXT;
  v_request_id TEXT;
BEGIN
  IF NOT public.is_hanzify_admin() THEN
    RAISE EXCEPTION 'Admin access required' USING ERRCODE = '42501';
  END IF;
  IF length(trim(p_new_password)) < 6 THEN
    RAISE EXCEPTION 'Password must contain at least 6 characters';
  END IF;

  SELECT id INTO v_admin_id FROM public.users WHERE auth_user_id = auth.uid();
  SELECT id INTO v_request_id
  FROM public.password_reset_requests
  WHERE id = p_request_id AND user_id = p_user_id AND status = 'pending'
  FOR UPDATE;
  IF v_request_id IS NULL THEN RETURN false; END IF;

  SELECT auth_user_id INTO v_auth_user_id FROM public.users WHERE id = p_user_id;
  IF v_auth_user_id IS NULL THEN RAISE EXCEPTION 'User not found'; END IF;

  UPDATE auth.users
  SET encrypted_password = crypt(trim(p_new_password), gen_salt('bf')),
      updated_at = now()
  WHERE id = v_auth_user_id;

  UPDATE public.password_reset_requests
  SET status = 'resolved', resolved_at = now(), resolved_by = v_admin_id
  WHERE id = v_request_id;

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_create_hanzify_user(TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_resolve_password_reset(TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_create_hanzify_user(TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_resolve_password_reset(TEXT, TEXT, TEXT) TO authenticated;

-- ---------------------------------------------------------------------------
-- Users: students may edit their own non-privileged profile values, but cannot
-- promote themselves or unblock an account. Admins retain full management.
-- ---------------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Insert/Update Users" ON public.users;
DROP POLICY IF EXISTS "Users update own profile" ON public.users;
DROP POLICY IF EXISTS "Users update own safe profile" ON public.users;
DROP POLICY IF EXISTS "Admins manage users" ON public.users;
CREATE POLICY "Users update own safe profile" ON public.users
  FOR UPDATE TO authenticated
  USING (auth_user_id = auth.uid() AND role = 'student' AND status = 'active')
  WITH CHECK (auth_user_id = auth.uid() AND role = 'student' AND status = 'active');
CREATE POLICY "Admins manage users" ON public.users
  FOR ALL TO authenticated
  USING (public.is_hanzify_admin())
  WITH CHECK (public.is_hanzify_admin());

CREATE OR REPLACE FUNCTION public.protect_student_profile_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF current_user NOT IN ('authenticated', 'anon') THEN RETURN NEW; END IF;
  IF public.is_hanzify_admin() THEN RETURN NEW; END IF;
  IF auth.uid() IS NULL OR OLD.auth_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Profile update not allowed' USING ERRCODE = '42501';
  END IF;
  IF (to_jsonb(NEW) - ARRAY['full_name', 'chinese_name', 'avatar', 'phone'])
      IS DISTINCT FROM
     (to_jsonb(OLD) - ARRAY['full_name', 'chinese_name', 'avatar', 'phone']) THEN
    RAISE EXCEPTION 'Only display profile fields may be changed' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS protect_student_profile_fields_trigger ON public.users;
CREATE TRIGGER protect_student_profile_fields_trigger
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.protect_student_profile_fields();

-- ---------------------------------------------------------------------------
-- Public learning content remains readable for previews. Only staff can mutate.
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public Manage Courses" ON public.courses;
DROP POLICY IF EXISTS "Staff Manage Courses" ON public.courses;
CREATE POLICY "Staff Manage Courses" ON public.courses FOR ALL TO authenticated
  USING (public.is_hanzify_staff()) WITH CHECK (public.is_hanzify_staff());

DROP POLICY IF EXISTS "Public Manage Lessons" ON public.lessons;
DROP POLICY IF EXISTS "Staff Manage Lessons" ON public.lessons;
CREATE POLICY "Staff Manage Lessons" ON public.lessons FOR ALL TO authenticated
  USING (public.is_hanzify_staff()) WITH CHECK (public.is_hanzify_staff());

DROP POLICY IF EXISTS "Public Manage Questions" ON public.homework_questions;
DROP POLICY IF EXISTS "Staff Manage Questions" ON public.homework_questions;
CREATE POLICY "Staff Manage Questions" ON public.homework_questions FOR ALL TO authenticated
  USING (public.is_hanzify_staff()) WITH CHECK (public.is_hanzify_staff());

DROP POLICY IF EXISTS "Public Manage Exams" ON public.exams;
DROP POLICY IF EXISTS "Staff Manage Exams" ON public.exams;
CREATE POLICY "Staff Manage Exams" ON public.exams FOR ALL TO authenticated
  USING (public.is_hanzify_staff()) WITH CHECK (public.is_hanzify_staff());

DROP POLICY IF EXISTS "Public Manage Exam Skills" ON public.exam_skills;
DROP POLICY IF EXISTS "Staff Manage Exam Skills" ON public.exam_skills;
CREATE POLICY "Staff Manage Exam Skills" ON public.exam_skills FOR ALL TO authenticated
  USING (public.is_hanzify_staff()) WITH CHECK (public.is_hanzify_staff());

DROP POLICY IF EXISTS "Public Manage Exam Parts" ON public.exam_parts;
DROP POLICY IF EXISTS "Staff Manage Exam Parts" ON public.exam_parts;
CREATE POLICY "Staff Manage Exam Parts" ON public.exam_parts FOR ALL TO authenticated
  USING (public.is_hanzify_staff()) WITH CHECK (public.is_hanzify_staff());

DROP POLICY IF EXISTS "Public Manage Exam Questions" ON public.exam_questions;
DROP POLICY IF EXISTS "Staff Manage Exam Questions" ON public.exam_questions;
CREATE POLICY "Staff Manage Exam Questions" ON public.exam_questions FOR ALL TO authenticated
  USING (public.is_hanzify_staff()) WITH CHECK (public.is_hanzify_staff());

DROP POLICY IF EXISTS "Public Manage Match Pairs" ON public.game_match_pairs;
DROP POLICY IF EXISTS "Staff Manage Match Pairs" ON public.game_match_pairs;
CREATE POLICY "Staff Manage Match Pairs" ON public.game_match_pairs FOR ALL TO authenticated
  USING (public.is_hanzify_staff()) WITH CHECK (public.is_hanzify_staff());

DROP POLICY IF EXISTS "Public Manage Tone Items" ON public.game_tone_items;
DROP POLICY IF EXISTS "Staff Manage Tone Items" ON public.game_tone_items;
CREATE POLICY "Staff Manage Tone Items" ON public.game_tone_items FOR ALL TO authenticated
  USING (public.is_hanzify_staff()) WITH CHECK (public.is_hanzify_staff());

DROP POLICY IF EXISTS "Public Manage Leaderboard" ON public.game_leaderboard;
DROP POLICY IF EXISTS "Staff Manage Leaderboard" ON public.game_leaderboard;
CREATE POLICY "Staff Manage Leaderboard" ON public.game_leaderboard FOR ALL TO authenticated
  USING (public.is_hanzify_staff()) WITH CHECK (public.is_hanzify_staff());

DROP POLICY IF EXISTS "Cho phép staff quản lý từ vựng" ON public.vocabularies;
DROP POLICY IF EXISTS "Staff manage vocabularies" ON public.vocabularies;
CREATE POLICY "Staff manage vocabularies" ON public.vocabularies FOR ALL TO authenticated
  USING (public.is_hanzify_staff()) WITH CHECK (public.is_hanzify_staff());

-- Classroom membership is readable for the current join-by-code flow, but only
-- staff (or the SECURITY DEFINER signup trigger) may alter it.
DROP POLICY IF EXISTS "Cho phép ghi combo khóa học lớp" ON public.classroom_courses;
DROP POLICY IF EXISTS "Staff ghi combo khóa học lớp" ON public.classroom_courses;
DROP POLICY IF EXISTS "Staff manage classroom courses" ON public.classroom_courses;
CREATE POLICY "Staff manage classroom courses" ON public.classroom_courses FOR ALL TO authenticated
  USING (public.is_hanzify_staff()) WITH CHECK (public.is_hanzify_staff());

DROP POLICY IF EXISTS "Cho phép cập nhật kích hoạt học viên" ON public.classroom_students;
DROP POLICY IF EXISTS "Staff cập nhật học viên lớp" ON public.classroom_students;
DROP POLICY IF EXISTS "Staff manage classroom students" ON public.classroom_students;
CREATE POLICY "Staff manage classroom students" ON public.classroom_students FOR ALL TO authenticated
  USING (public.is_hanzify_staff()) WITH CHECK (public.is_hanzify_staff());

-- Submissions are private to their student and staff. Students need UPDATE for
-- draft autosave and final submission; staff need INSERT for direct grading.
DROP POLICY IF EXISTS "Public Manage Submissions" ON public.submissions;
DROP POLICY IF EXISTS "Public Read Submissions" ON public.submissions;
DROP POLICY IF EXISTS "Students create submissions" ON public.submissions;
DROP POLICY IF EXISTS "Students read own submissions" ON public.submissions;
DROP POLICY IF EXISTS "Students update own submissions" ON public.submissions;
DROP POLICY IF EXISTS "Owners and staff read submissions" ON public.submissions;
DROP POLICY IF EXISTS "Staff grade submissions" ON public.submissions;
DROP POLICY IF EXISTS "Staff manage submissions" ON public.submissions;
CREATE POLICY "Students create submissions" ON public.submissions FOR INSERT TO authenticated
  WITH CHECK (student_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid() AND role = 'student'));
CREATE POLICY "Students read own submissions" ON public.submissions FOR SELECT TO authenticated
  USING (student_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));
CREATE POLICY "Students update own submissions" ON public.submissions FOR UPDATE TO authenticated
  USING (student_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid() AND role = 'student'))
  WITH CHECK (student_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid() AND role = 'student'));
CREATE POLICY "Staff manage submissions" ON public.submissions FOR ALL TO authenticated
  USING (public.is_hanzify_staff()) WITH CHECK (public.is_hanzify_staff());

CREATE OR REPLACE FUNCTION public.protect_student_submission_grading()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_is_owner BOOLEAN;
  v_old_state TEXT;
  v_new_state TEXT;
BEGIN
  IF current_user NOT IN ('authenticated', 'anon') THEN RETURN NEW; END IF;
  IF public.is_hanzify_staff() THEN RETURN NEW; END IF;
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = NEW.student_id AND auth_user_id = auth.uid() AND role = 'student' AND status = 'active'
  ) INTO v_is_owner;
  IF NOT v_is_owner THEN
    RAISE EXCEPTION 'Submission update not allowed' USING ERRCODE = '42501';
  END IF;

  v_new_state := coalesce(NEW.answers_json ->> 'submission_state', 'submitted');
  IF NEW.status IS DISTINCT FROM 'pending'
     OR NEW.total_score IS NOT NULL
     OR NEW.teacher_comment IS NOT NULL
     OR NEW.teacher_audio_feedback IS NOT NULL
     OR v_new_state NOT IN ('draft', 'submitted') THEN
    RAISE EXCEPTION 'Students cannot change grading fields' USING ERRCODE = '42501';
  END IF;

  IF TG_OP = 'UPDATE' THEN
    v_old_state := coalesce(OLD.answers_json ->> 'submission_state', 'submitted');
    IF (to_jsonb(NEW) - ARRAY['student_name', 'submitted_at', 'answers_json'])
        IS DISTINCT FROM
       (to_jsonb(OLD) - ARRAY['student_name', 'submitted_at', 'answers_json'])
       OR OLD.status = 'graded'
       OR (v_old_state = 'submitted' AND v_new_state <> 'submitted') THEN
      RAISE EXCEPTION 'Submitted or graded work is locked' USING ERRCODE = '42501';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS protect_student_submission_grading_trigger ON public.submissions;
CREATE TRIGGER protect_student_submission_grading_trigger
  BEFORE INSERT OR UPDATE ON public.submissions
  FOR EACH ROW EXECUTE FUNCTION public.protect_student_submission_grading();

-- Forum likes are stored per account and toggled atomically. This prevents
-- repeated likes and keeps the denormalized counter correct under concurrency.
CREATE TABLE IF NOT EXISTS public.forum_post_likes (
  post_id TEXT NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, user_id)
);
ALTER TABLE public.forum_post_likes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Members read own forum likes" ON public.forum_post_likes;
CREATE POLICY "Members read own forum likes" ON public.forum_post_likes FOR SELECT TO authenticated
  USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

DROP FUNCTION IF EXISTS public.adjust_forum_post_likes(TEXT, INTEGER);
CREATE OR REPLACE FUNCTION public.toggle_forum_post_like(p_post_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id TEXT;
  v_likes INTEGER;
  v_liked BOOLEAN;
BEGIN
  SELECT id INTO v_user_id FROM public.users
  WHERE auth_user_id = auth.uid() AND status = 'active';
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Active account required' USING ERRCODE = '42501';
  END IF;

  PERFORM 1 FROM public.forum_posts WHERE id = p_post_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Forum post not found'; END IF;

  DELETE FROM public.forum_post_likes
  WHERE post_id = p_post_id AND user_id = v_user_id;
  IF FOUND THEN
    v_liked := false;
  ELSE
    INSERT INTO public.forum_post_likes (post_id, user_id)
    VALUES (p_post_id, v_user_id);
    v_liked := true;
  END IF;

  SELECT count(*)::INTEGER INTO v_likes
  FROM public.forum_post_likes WHERE post_id = p_post_id;
  UPDATE public.forum_posts
  SET likes_count = v_likes WHERE id = p_post_id;
  RETURN jsonb_build_object('liked', v_liked, 'likes_count', v_likes);
END;
$$;
REVOKE ALL ON FUNCTION public.toggle_forum_post_like(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.toggle_forum_post_like(TEXT) TO authenticated;

DROP POLICY IF EXISTS "Cho phép ghi bài viết diễn đàn" ON public.forum_posts;
DROP POLICY IF EXISTS "Thành viên ghi bài viết diễn đàn" ON public.forum_posts;
DROP POLICY IF EXISTS "Chủ bài hoặc staff cập nhật diễn đàn" ON public.forum_posts;
DROP POLICY IF EXISTS "Members create forum posts" ON public.forum_posts;
DROP POLICY IF EXISTS "Owners or staff update forum posts" ON public.forum_posts;
CREATE POLICY "Members create forum posts" ON public.forum_posts FOR INSERT TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));
CREATE POLICY "Owners or staff update forum posts" ON public.forum_posts FOR UPDATE TO authenticated
  USING (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()) OR public.is_hanzify_staff())
  WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()) OR public.is_hanzify_staff());

CREATE OR REPLACE FUNCTION public.protect_forum_post_write()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE v_user public.users;
BEGIN
  IF current_user NOT IN ('authenticated', 'anon') THEN RETURN NEW; END IF;
  IF public.is_hanzify_staff() THEN RETURN NEW; END IF;
  SELECT * INTO v_user FROM public.users
  WHERE auth_user_id = auth.uid() AND id = NEW.user_id AND role = 'student' AND status = 'active';
  IF v_user.id IS NULL THEN RAISE EXCEPTION 'Forum write not allowed' USING ERRCODE = '42501'; END IF;
  IF TG_OP = 'INSERT' THEN
    NEW.author_name := v_user.full_name;
    NEW.author_avatar := coalesce(v_user.avatar, '安');
    NEW.author_role := 'student';
    NEW.likes_count := 0;
    NEW.status := 'pending';
  ELSIF (to_jsonb(NEW) - ARRAY['category', 'title', 'content', 'tags'])
        IS DISTINCT FROM
        (to_jsonb(OLD) - ARRAY['category', 'title', 'content', 'tags']) THEN
    RAISE EXCEPTION 'Protected forum fields cannot be changed' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS protect_forum_post_write_trigger ON public.forum_posts;
CREATE TRIGGER protect_forum_post_write_trigger
  BEFORE INSERT OR UPDATE ON public.forum_posts
  FOR EACH ROW EXECUTE FUNCTION public.protect_forum_post_write();

DROP POLICY IF EXISTS "Cho phép ghi bình luận diễn đàn" ON public.forum_comments;
DROP POLICY IF EXISTS "Thành viên ghi bình luận diễn đàn" ON public.forum_comments;
DROP POLICY IF EXISTS "Members create forum comments" ON public.forum_comments;
CREATE POLICY "Members create forum comments" ON public.forum_comments FOR INSERT TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

CREATE OR REPLACE FUNCTION public.prepare_forum_comment_write()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE v_user public.users;
BEGIN
  IF current_user NOT IN ('authenticated', 'anon') THEN RETURN NEW; END IF;
  SELECT * INTO v_user FROM public.users
  WHERE auth_user_id = auth.uid() AND id = NEW.user_id AND status = 'active';
  IF v_user.id IS NULL THEN RAISE EXCEPTION 'Forum comment not allowed' USING ERRCODE = '42501'; END IF;
  NEW.author_name := v_user.full_name;
  NEW.author_avatar := coalesce(v_user.avatar, '安');
  NEW.author_role := v_user.role;
  NEW.is_teacher_answer := v_user.role IN ('admin', 'teacher');
  NEW.likes_count := 0;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS prepare_forum_comment_write_trigger ON public.forum_comments;
CREATE TRIGGER prepare_forum_comment_write_trigger
  BEFORE INSERT ON public.forum_comments
  FOR EACH ROW EXECUTE FUNCTION public.prepare_forum_comment_write();
