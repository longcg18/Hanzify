import assert from 'node:assert/strict';
import pg from 'pg';

const password = process.env.HANZIFY_DB_PASSWORD;
if (!password) throw new Error('Set HANZIFY_DB_PASSWORD before running this audit.');

const client = new pg.Client({
  host: 'aws-0-ap-northeast-2.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.vwuikidgncknuozufiyi',
  password,
  ssl: { rejectUnauthorized: false }
});

const assumeRole = async (profile) => {
  await client.query('SET LOCAL ROLE authenticated');
  await client.query("SELECT set_config('request.jwt.claim.sub', $1, true)", [profile.auth_user_id]);
};

const inRollback = async (action) => {
  await client.query('BEGIN');
  try {
    return await action();
  } finally {
    await client.query('ROLLBACK');
  }
};

await client.connect();
try {
  const { rows: profiles } = await client.query(`
    SELECT DISTINCT ON (role) id, role, auth_user_id
    FROM public.users
    WHERE role IN ('student', 'teacher', 'admin') AND auth_user_id IS NOT NULL AND status = 'active'
    ORDER BY role, created_at
  `);
  const byRole = Object.fromEntries(profiles.map((profile) => [profile.role, profile]));
  assert.ok(byRole.student && byRole.teacher && byRole.admin, 'All three active roles need an Auth-linked test profile.');

  const { rows: courseRows } = await client.query('SELECT id FROM public.courses ORDER BY created_at LIMIT 1');
  const { rows: lessonRows } = await client.query('SELECT id FROM public.lessons ORDER BY created_at LIMIT 1');
  const { rows: classroomRows } = await client.query('SELECT id FROM public.classrooms ORDER BY created_at LIMIT 1');
  const { rows: submissionTotals } = await client.query('SELECT count(*)::int total FROM public.submissions');
  assert.ok(courseRows[0] && classroomRows[0], 'The audit needs one course and one classroom.');
  const totalSubmissions = submissionTotals[0].total;

  const report = {};
  for (const role of ['student', 'teacher', 'admin']) {
    report[role] = await inRollback(async () => {
      await assumeRole(byRole[role]);
      const contentWrite = await client.query('UPDATE public.courses SET title = title WHERE id = $1 RETURNING id', [courseRows[0].id]);
      const classroomWrite = await client.query('UPDATE public.classrooms SET name = name WHERE id = $1 RETURNING id', [classroomRows[0].id]);
      const visibleSubmissions = await client.query('SELECT count(*)::int total FROM public.submissions');
      const ownSubmissions = await client.query('SELECT count(*)::int total FROM public.submissions WHERE student_id = $1', [byRole[role].id]);
      return {
        contentWrites: contentWrite.rowCount,
        classroomWrites: classroomWrite.rowCount,
        visibleSubmissions: visibleSubmissions.rows[0].total,
        ownSubmissions: ownSubmissions.rows[0].total
      };
    });
  }

  assert.equal(report.student.contentWrites, 0, 'Student must not edit courses.');
  assert.equal(report.student.classroomWrites, 0, 'Student must not edit classrooms.');
  assert.equal(report.student.visibleSubmissions, report.student.ownSubmissions, 'Student must only read own submissions.');
  for (const role of ['teacher', 'admin']) {
    assert.equal(report[role].contentWrites, 1, `${role} must edit courses.`);
    assert.equal(report[role].classroomWrites, 1, `${role} must edit classrooms.`);
    assert.equal(report[role].visibleSubmissions, totalSubmissions, `${role} must read all submissions.`);
  }

  const anonymousWrites = await inRollback(async () => {
    await client.query('SET LOCAL ROLE anon');
    const result = await client.query('UPDATE public.courses SET title = title WHERE id = $1 RETURNING id', [courseRows[0].id]);
    return result.rowCount;
  });
  assert.equal(anonymousWrites, 0, 'Anonymous visitors must not mutate learning content.');

  let privilegeEscalationRejected = false;
  await client.query('BEGIN');
  try {
    await assumeRole(byRole.student);
    await client.query("UPDATE public.users SET role = 'admin' WHERE id = $1", [byRole.student.id]);
  } catch (error) {
    privilegeEscalationRejected = error.code === '42501';
  } finally {
    await client.query('ROLLBACK');
  }
  assert.equal(privilegeEscalationRejected, true, 'A student must not promote their own role.');

  let identityChangeRejected = false;
  await client.query('BEGIN');
  try {
    await assumeRole(byRole.student);
    await client.query("UPDATE public.users SET username = username || '.tampered' WHERE id = $1", [byRole.student.id]);
  } catch (error) {
    identityChangeRejected = error.code === '42501';
  } finally {
    await client.query('ROLLBACK');
  }
  assert.equal(identityChangeRejected, true, 'A student must not edit identity or account metadata.');

  const { rows: ownSubmissionRows } = await client.query(
    'SELECT id FROM public.submissions WHERE student_id = $1 LIMIT 1',
    [byRole.student.id]
  );
  let gradingTamperRejected = true;
  if (ownSubmissionRows[0]) {
    gradingTamperRejected = false;
    await client.query('BEGIN');
    try {
      await assumeRole(byRole.student);
      await client.query(
        "UPDATE public.submissions SET status = 'graded', total_score = 10 WHERE id = $1",
        [ownSubmissionRows[0].id]
      );
    } catch (error) {
      gradingTamperRejected = error.code === '42501';
    } finally {
      await client.query('ROLLBACK');
    }
  }
  assert.equal(gradingTamperRejected, true, 'A student must not change grading fields.');

  const studentDraftFlowWorks = await inRollback(async () => {
    assert.ok(lessonRows[0], 'The audit needs one lesson.');
    await assumeRole(byRole.student);
    const submissionId = `audit-submission-${Date.now()}`;
    await client.query(
      `INSERT INTO public.submissions (id, lesson_id, student_id, student_name, status, answers_json)
       VALUES ($1, $2, $3, 'Audit Student', 'pending', '{"submission_state":"draft"}'::jsonb)`,
      [submissionId, lessonRows[0].id, byRole.student.id]
    );
    const result = await client.query(
      `UPDATE public.submissions
       SET answers_json = '{"submission_state":"submitted"}'::jsonb, submitted_at = now()
       WHERE id = $1 RETURNING id`,
      [submissionId]
    );
    return result.rowCount === 1;
  });
  assert.equal(studentDraftFlowWorks, true, 'A student must still be able to save and submit legitimate work.');

  for (const role of ['student', 'teacher']) {
    let rejected = false;
    await client.query('BEGIN');
    try {
      await assumeRole(byRole[role]);
      await client.query("SELECT * FROM public.admin_create_hanzify_user('audit-denied', 'Audit Denied', 'student', '', '123456')");
    } catch (error) {
      rejected = error.code === '42501';
    } finally {
      await client.query('ROLLBACK');
    }
    assert.equal(rejected, true, `${role} must not create accounts.`);
  }

  const adminCreated = await inRollback(async () => {
    await assumeRole(byRole.admin);
    const { rows } = await client.query(
      "SELECT id, username, role, auth_user_id FROM public.admin_create_hanzify_user($1, 'Audit Account', 'student', '', '123456')",
      [`audit.${Date.now()}`]
    );
    return rows[0];
  });
  assert.equal(adminCreated.role, 'student');
  assert.ok(adminCreated.auth_user_id);

  const passwordResetWorks = await inRollback(async () => {
    const requestId = `audit-reset-${Date.now()}`;
    await client.query(
      `INSERT INTO public.password_reset_requests (id, user_id, identifier, user_name)
       VALUES ($1, $2, 'audit', 'Audit')`,
      [requestId, byRole.student.id]
    );
    await assumeRole(byRole.admin);
    const { rows } = await client.query(
      'SELECT public.admin_resolve_password_reset($1, $2, $3) resolved',
      [requestId, byRole.student.id, '654321']
    );
    return rows[0].resolved;
  });
  assert.equal(passwordResetWorks, true, 'Admin password reset must update Supabase Auth and resolve the request.');

  const invalidPasswordResetIsAtomic = await inRollback(async () => {
    const { rows: beforeRows } = await client.query(
      `SELECT encrypted_password FROM auth.users WHERE id = $1`,
      [byRole.student.auth_user_id]
    );
    await assumeRole(byRole.admin);
    const { rows } = await client.query(
      'SELECT public.admin_resolve_password_reset($1, $2, $3) resolved',
      ['missing-reset-request', byRole.student.id, 'not-applied-654321']
    );
    await client.query('RESET ROLE');
    const { rows: afterRows } = await client.query(
      `SELECT encrypted_password FROM auth.users WHERE id = $1`,
      [byRole.student.auth_user_id]
    );
    return rows[0].resolved === false && beforeRows[0].encrypted_password === afterRows[0].encrypted_password;
  });
  assert.equal(invalidPasswordResetIsAtomic, true, 'An invalid reset request must not change the Auth password.');

  console.log(JSON.stringify({
    ok: true,
    report,
    anonymousWrites,
    privilegeEscalationRejected,
    identityChangeRejected,
    gradingTamperRejected,
    studentDraftFlowWorks,
    adminAccountCreation: true,
    adminPasswordReset: true,
    invalidPasswordResetIsAtomic
  }, null, 2));
} finally {
  await client.end();
}
