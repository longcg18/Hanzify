CREATE EXTENSION IF NOT EXISTS pgcrypto;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE;

WITH legacy AS (
  SELECT id profile_id, email, password, full_name, username, role, gen_random_uuid() auth_id
  FROM public.users WHERE auth_user_id IS NULL AND password IS NOT NULL
), inserted AS (
  INSERT INTO auth.users (instance_id,id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at,confirmation_token,recovery_token,email_change,email_change_token_new,email_change_token_current,phone_change,phone_change_token,reauthentication_token,is_sso_user,is_anonymous)
  SELECT '00000000-0000-0000-0000-000000000000',auth_id,'authenticated','authenticated',email,crypt(password,gen_salt('bf')),now(),
    jsonb_build_object('provider','email','providers',ARRAY['email']),jsonb_build_object('profile_id',profile_id,'username',username,'full_name',full_name,'role',role),
    now(),now(),'','','','','','','','',false,false FROM legacy RETURNING id,email
), identities AS (
  INSERT INTO auth.identities (provider_id,user_id,identity_data,provider,last_sign_in_at,created_at,updated_at)
  SELECT id::text,id,jsonb_build_object('sub',id::text,'email',email,'email_verified',true),'email',now(),now(),now() FROM inserted RETURNING user_id,email
)
UPDATE public.users u SET auth_user_id=i.user_id FROM identities i WHERE lower(u.email)=lower(i.email);

CREATE OR REPLACE FUNCTION public.is_hanzify_staff() RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public
AS $$ SELECT EXISTS(SELECT 1 FROM public.users WHERE auth_user_id=auth.uid() AND role IN ('admin','teacher') AND status='active') $$;
CREATE OR REPLACE FUNCTION public.is_hanzify_admin() RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public
AS $$ SELECT EXISTS(SELECT 1 FROM public.users WHERE auth_user_id=auth.uid() AND role='admin' AND status='active') $$;

CREATE OR REPLACE FUNCTION public.resolve_login_email(p_identifier TEXT) RETURNS TEXT LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public
AS $$ SELECT email FROM public.users WHERE status='active' AND (lower(email)=lower(trim(p_identifier)) OR lower(username)=lower(trim(p_identifier))) LIMIT 1 $$;
REVOKE ALL ON FUNCTION public.resolve_login_email(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.resolve_login_email(TEXT) TO anon,authenticated;

CREATE OR REPLACE FUNCTION public.handle_hanzify_auth_user() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_profile_id TEXT:=COALESCE(NEW.raw_user_meta_data->>'profile_id','student-'||replace(NEW.id::text,'-',''));
BEGIN
  INSERT INTO public.users(id,auth_user_id,username,email,full_name,role,avatar,status)
  VALUES(v_profile_id,NEW.id,NEW.raw_user_meta_data->>'username',NEW.email,COALESCE(NEW.raw_user_meta_data->>'full_name',NEW.email),'student',COALESCE(NEW.raw_user_meta_data->>'avatar','学'),'active')
  ON CONFLICT(email) DO UPDATE SET auth_user_id=EXCLUDED.auth_user_id;
  IF COALESCE(NEW.raw_user_meta_data->>'class_id','')<>'' AND COALESCE(NEW.raw_user_meta_data->>'student_id','')<>'' THEN
    UPDATE public.classroom_students SET username=NEW.raw_user_meta_data->>'username',is_activated=true,activated_at=now()
    WHERE id=NEW.raw_user_meta_data->>'student_id' AND classroom_id=NEW.raw_user_meta_data->>'class_id' AND is_activated=false;
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS on_hanzify_auth_user_created ON auth.users;
CREATE TRIGGER on_hanzify_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_hanzify_auth_user();

ALTER TABLE public.user_streaks ALTER COLUMN current_streak SET DEFAULT 0;
ALTER TABLE public.user_streaks ALTER COLUMN longest_streak SET DEFAULT 0;
ALTER TABLE public.user_streaks ALTER COLUMN last_check_in DROP DEFAULT;

CREATE OR REPLACE FUNCTION public.check_in_user() RETURNS public.user_streaks LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_today DATE:=(CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Ho_Chi_Minh')::DATE; v_user_id TEXT; v_row public.user_streaks;
BEGIN
  SELECT id INTO v_user_id FROM public.users WHERE auth_user_id=auth.uid() AND status='active';
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='42501'; END IF;
  INSERT INTO public.user_streaks(user_id,current_streak,longest_streak,last_check_in,total_xp) VALUES(v_user_id,0,0,NULL,0) ON CONFLICT(user_id) DO NOTHING;
  SELECT * INTO v_row FROM public.user_streaks WHERE user_id=v_user_id FOR UPDATE;
  IF v_row.last_check_in<>v_today OR v_row.last_check_in IS NULL THEN
    v_row.current_streak:=CASE WHEN v_row.last_check_in=v_today-1 THEN v_row.current_streak+1 ELSE 1 END;
    v_row.longest_streak:=GREATEST(v_row.longest_streak,v_row.current_streak); v_row.last_check_in:=v_today; v_row.total_xp:=v_row.total_xp+50;
    UPDATE public.user_streaks SET current_streak=v_row.current_streak,longest_streak=v_row.longest_streak,last_check_in=v_row.last_check_in,total_xp=v_row.total_xp,updated_at=timezone('utc'::text,now())
    WHERE user_id=v_user_id RETURNING * INTO v_row;
  END IF; RETURN v_row;
END; $$;

CREATE OR REPLACE FUNCTION public.add_game_reward_xp(p_points INTEGER) RETURNS public.user_streaks LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_user_id TEXT; v_row public.user_streaks;
BEGIN
  IF p_points<=0 OR p_points>10000 THEN RAISE EXCEPTION 'Invalid XP amount'; END IF;
  SELECT id INTO v_user_id FROM public.users WHERE auth_user_id=auth.uid() AND status='active';
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE='42501'; END IF;
  INSERT INTO public.user_streaks(user_id,current_streak,longest_streak,last_check_in,total_xp) VALUES(v_user_id,0,0,NULL,p_points)
  ON CONFLICT(user_id) DO UPDATE SET total_xp=public.user_streaks.total_xp+EXCLUDED.total_xp,updated_at=timezone('utc'::text,now()) RETURNING * INTO v_row;
  RETURN v_row;
END; $$;

REVOKE ALL ON FUNCTION public.check_in_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.add_game_reward_xp(INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_in_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_game_reward_xp(INTEGER) TO authenticated;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Insert/Update Users" ON public.users;
DROP POLICY IF EXISTS "Users read own profile" ON public.users;
DROP POLICY IF EXISTS "Users update own profile" ON public.users;
CREATE POLICY "Users read own profile" ON public.users FOR SELECT TO authenticated USING(auth_user_id=auth.uid() OR public.is_hanzify_staff());
CREATE POLICY "Users update own profile" ON public.users FOR UPDATE TO authenticated USING(auth_user_id=auth.uid() OR public.is_hanzify_admin()) WITH CHECK(auth_user_id=auth.uid() OR public.is_hanzify_admin());
DROP POLICY IF EXISTS "Cho phép học viên điểm danh streak" ON public.user_streaks;
DROP POLICY IF EXISTS "Users manage own streak" ON public.user_streaks;
CREATE POLICY "Users manage own streak" ON public.user_streaks FOR ALL TO authenticated
USING(user_id IN(SELECT id FROM public.users WHERE auth_user_id=auth.uid())) WITH CHECK(user_id IN(SELECT id FROM public.users WHERE auth_user_id=auth.uid()));

DO $$ BEGIN
 IF (SELECT count(*) FROM public.users WHERE auth_user_id IS NULL)<>0 THEN RAISE EXCEPTION 'Not all profiles linked'; END IF;
 IF (SELECT count(*) FROM auth.users)<(SELECT count(*) FROM public.users) THEN RAISE EXCEPTION 'Auth migration incomplete'; END IF;
END $$;
-- Drop the legacy password column only after the migration runner verifies Auth login.
