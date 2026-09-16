import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  fetchUsers, fetchSubmissions, fetchStudentActivityHistory, fetchStudentExamAttemptsForStaff
} from '../services/supabaseService';

const displayDate = (value) => value ? new Date(value).toLocaleString('vi-VN') : '—';

export const StudentProgressView = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!['admin', 'teacher'].includes(user?.role)) return;
    Promise.all([fetchUsers(), fetchSubmissions()]).then(([usersResult, submissionsResult]) => {
      setStudents((usersResult.data || []).filter((person) => person.role === 'student'));
      setSubmissions(submissionsResult.data || []);
      setError(usersResult.isLiveDb === false || submissionsResult.error ? 'Không tải được đầy đủ dữ liệu học sinh hoặc bài tập.' : '');
      setLoading(false);
    }).catch(() => { setError('Không tải được dữ liệu học sinh.'); setLoading(false); });
  }, [user?.role]);

  useEffect(() => {
    if (!studentId) { setAttempts([]); setActivities([]); return; }
    setLoading(true);
    Promise.all([fetchStudentExamAttemptsForStaff(studentId), fetchStudentActivityHistory(studentId)])
      .then(([examResult, activityResult]) => {
        setAttempts(examResult.data);
        setActivities(activityResult.data);
        setError(examResult.error || activityResult.error || '');
        setLoading(false);
      }).catch(() => { setError('Không tải được lịch sử hoạt động.'); setLoading(false); });
  }, [studentId]);

  const homework = useMemo(() => submissions.filter((item) => item.studentId === studentId), [submissions, studentId]);
  const practice = activities.filter((item) => item.activity_type === 'practice');
  const games = activities.filter((item) => item.activity_type === 'game');
  const groups = [
    { title: 'Bài tập sau giờ', rows: homework.map((item) => ({ id: item.id, title: item.lessonTitle, date: item.submittedAt, detail: item.totalScore == null ? item.status : `${item.totalScore}/10 điểm` })) },
    { title: 'Luyện tập tự do', rows: practice.map((item) => ({ id: item.id, title: item.title, date: displayDate(item.completed_at), detail: `${item.score}/${item.max_score} câu · +${item.xp || 0} XP` })) },
    { title: 'Lịch sử thi thử', rows: attempts.map((item) => ({ id: item.id, title: item.exam_title, date: displayDate(item.completed_at), detail: `${item.total_score}/${item.max_score} điểm` })) },
    { title: 'Lịch sử chơi game', rows: games.map((item) => ({ id: item.id, title: item.title, date: displayDate(item.completed_at), detail: `+${item.xp || 0} XP` })) },
  ];

  if (!['admin', 'teacher'].includes(user?.role)) return null;
  return <main className="main-content student-progress-view">
    <h1>Quá trình học tập của học sinh</h1>
    <label htmlFor="progress-student">Chọn học sinh</label>
    <select id="progress-student" value={studentId} onChange={(event) => setStudentId(event.target.value)}>
      <option value="">Chọn một học sinh</option>
      {students.map((person) => <option key={person.id} value={person.id}>{person.name || person.username} ({person.username})</option>)}
    </select>
    {loading && <p>Đang tải dữ liệu...</p>}
    {error && <p role="alert" className="progress-error">{error}</p>}
    {studentId && !loading && <div className="progress-grid">
      {groups.map((group) => <section key={group.title} className="progress-card">
        <h2>{group.title} <span>{group.rows.length}</span></h2>
        {group.rows.length ? <ul>{group.rows.map((row) => <li key={row.id}>
          <strong>{row.title}</strong><span>{row.detail}</span><small>{row.date}</small>
        </li>)}</ul> : <p>Chưa có dữ liệu được ghi nhận.</p>}
      </section>)}
    </div>}
  </main>;
};
