-- Real, privacy-safe aggregate used by the leaderboard.
-- It exposes only the same profile/score summary shown in the UI, never raw answers.
CREATE OR REPLACE FUNCTION public.get_leaderboard_stats()
RETURNS TABLE (
  user_id TEXT,
  username TEXT,
  full_name TEXT,
  chinese_name TEXT,
  avatar TEXT,
  classroom_id TEXT,
  classroom_name TEXT,
  level TEXT,
  activity_xp BIGINT,
  homework_xp BIGINT,
  exam_xp BIGINT,
  total_xp BIGINT,
  lessons_completed BIGINT,
  exams_done BIGINT,
  teacher_grade NUMERIC
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH authorized AS (
    SELECT auth.uid() AS auth_user_id
    WHERE auth.uid() IS NOT NULL
  ),
  enrollments AS (
    SELECT DISTINCT ON (u.id)
      u.id AS user_id,
      cs.classroom_id,
      c.name AS classroom_name,
      c.level
    FROM public.users u
    LEFT JOIN public.classroom_students cs
      ON lower(cs.username) = lower(u.username)
    LEFT JOIN public.classrooms c ON c.id = cs.classroom_id
    WHERE u.role = 'student' AND u.status = 'active'
    ORDER BY u.id, cs.created_at DESC NULLS LAST
  ),
  homework AS (
    SELECT
      s.student_id,
      count(*) FILTER (
        WHERE s.status = 'graded'
          AND coalesce(s.answers_json->>'submission_state', 'graded') = 'graded'
      ) AS completed_count,
      round(avg(s.total_score) FILTER (
        WHERE s.status = 'graded'
          AND coalesce(s.answers_json->>'submission_state', 'graded') = 'graded'
          AND s.total_score IS NOT NULL
      ), 1) AS average_grade
    FROM public.submissions s
    GROUP BY s.student_id
  ),
  exams AS (
    SELECT
      e.student_id,
      count(*) AS exam_count,
      coalesce(sum(e.total_score), 0) AS exam_points,
      (array_agg(e.level ORDER BY e.completed_at DESC))[1] AS latest_level
    FROM public.exam_attempts e
    GROUP BY e.student_id
  )
  SELECT
    u.id,
    u.username,
    u.full_name,
    u.chinese_name,
    u.avatar,
    en.classroom_id,
    en.classroom_name,
    coalesce(en.level, ex.latest_level),
    coalesce(st.total_xp, 0)::BIGINT,
    (coalesce(hw.completed_count, 0) * 100)::BIGINT,
    coalesce(ex.exam_points, 0)::BIGINT,
    (coalesce(st.total_xp, 0) + coalesce(hw.completed_count, 0) * 100 + coalesce(ex.exam_points, 0))::BIGINT,
    coalesce(hw.completed_count, 0)::BIGINT,
    coalesce(ex.exam_count, 0)::BIGINT,
    hw.average_grade
  FROM public.users u
  CROSS JOIN authorized
  LEFT JOIN enrollments en ON en.user_id = u.id
  LEFT JOIN public.user_streaks st ON st.user_id = u.id
  LEFT JOIN homework hw ON hw.student_id = u.id
  LEFT JOIN exams ex ON ex.student_id = u.id
  WHERE u.role = 'student' AND u.status = 'active'
  ORDER BY total_xp DESC, u.full_name ASC;
$$;

REVOKE ALL ON FUNCTION public.get_leaderboard_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_leaderboard_stats() TO authenticated;
