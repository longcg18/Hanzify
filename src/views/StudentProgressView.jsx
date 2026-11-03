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
        setAttempts(examResult.data || []);
        setActivities(activityResult.data || []);
        setError(examResult.error || activityResult.error || '');
        setLoading(false);
      }).catch(() => { setError('Không tải được lịch sử hoạt động.'); setLoading(false); });
  }, [studentId]);

  const selectedStudent = useMemo(() => students.find((s) => s.id === studentId), [students, studentId]);
  const homework = useMemo(() => submissions.filter((item) => item.studentId === studentId), [submissions, studentId]);
  const practice = activities.filter((item) => item.activity_type === 'practice');
  const games = activities.filter((item) => item.activity_type === 'game');
  const groups = [
    { title: 'Bài tập sau giờ', icon: 'fa-book-open', rows: homework.map((item) => ({ id: item.id, title: item.lessonTitle, date: item.submittedAt ? new Date(item.submittedAt).toLocaleDateString('vi-VN') : '—', detail: item.totalScore == null ? (item.status === 'pending' ? 'Chờ chấm' : item.status) : `${item.totalScore}/10 điểm` })) },
    { title: 'Luyện tập tự do', icon: 'fa-dumbbell', rows: practice.map((item) => ({ id: item.id, title: item.title, date: displayDate(item.completed_at), detail: `${item.score}/${item.max_score} câu · +${item.xp || 0} XP` })) },
    { title: 'Lịch sử thi thử HSK', icon: 'fa-flag-checkered', rows: attempts.map((item) => ({ id: item.id, title: item.exam_title, date: displayDate(item.completed_at), detail: `${item.total_score}/${item.max_score} điểm` })) },
    { title: 'Lịch sử chơi game giải trí', icon: 'fa-gamepad', rows: games.map((item) => ({ id: item.id, title: item.title, date: displayDate(item.completed_at), detail: `+${item.xp || 0} XP` })) },
  ];

  if (!['admin', 'teacher'].includes(user?.role)) return null;

  return (
    <div className="student-progress-container" style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 0 3.5rem' }}>
      {/* Header */}
      <section style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: '6px',
            background: '#fef2f2',
            color: '#b91c1c',
            border: '1px solid #fee2e2'
          }}>
            {user?.role === 'admin' ? '👑 Quản Trị Hệ Thống' : '👩‍🏫 Giáo Viên Phụ Trách'}
          </span>
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 750, color: '#0f172a', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
          Theo Dõi Quá Trình Học Tập Của Học Viên
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
          Tra cứu tiến độ nộp bài, điểm số bài tập sau giờ, lịch sử thi thử và hoạt động học tập thực tế.
        </p>
      </section>

      {/* Student Selector Card */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border)',
        borderRadius: '14px',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: '1 1 300px' }}>
          <label htmlFor="progress-student" style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
            <i className="fa-solid fa-user-graduate" style={{ color: '#b91c1c', marginRight: '6px' }}></i>
            Chọn Học Viên Cần Tra Cứu:
          </label>
          <select
            id="progress-student"
            value={studentId}
            onChange={(event) => setStudentId(event.target.value)}
            style={{
              width: '100%',
              maxWidth: '460px',
              padding: '9px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '14px',
              color: '#0f172a',
              background: '#ffffff',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            <option value="">-- Bấm chọn học sinh trong danh sách ({students.length} học viên) --</option>
            {students.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name || person.username} ({person.username || 'Học viên'})
              </option>
            ))}
          </select>
        </div>

        {selectedStudent && (
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#b91c1c',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '15px'
            }}>
              {selectedStudent.name ? selectedStudent.name.charAt(0).toUpperCase() : 'H'}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>{selectedStudent.name || selectedStudent.username}</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Tài khoản: {selectedStudent.username}</div>
            </div>
          </div>
        )}
      </div>

      {loading && (
        <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#64748b' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '0.5rem', color: '#b91c1c' }}></i>
          Đang nạp dữ liệu hoạt động học tập…
        </div>
      )}

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '14px' }}>
          <i className="fa-solid fa-circle-exclamation" style={{ marginRight: '6px' }}></i>
          {error}
        </div>
      )}

      {!studentId && !loading && (
        <div style={{
          background: '#ffffff',
          border: '1.5px dashed #cbd5e1',
          borderRadius: '16px',
          padding: '3.5rem 1.5rem',
          textAlign: 'center',
          color: '#64748b'
        }}>
          <i className="fa-solid fa-clipboard-user" style={{ fontSize: '2.5rem', color: '#cbd5e1', marginBottom: '1rem', display: 'block' }}></i>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', margin: '0 0 6px' }}>
            Chưa Chọn Học Viên
          </h3>
          <p style={{ fontSize: '13.5px', margin: 0, maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto' }}>
            Vui lòng chọn một học viên trong ô danh sách phía trên để xem chi tiết tiến độ học tập và kết quả các bài tập.
          </p>
        </div>
      )}

      {studentId && !loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {groups.map((group) => (
            <section
              key={group.title}
              style={{
                background: '#ffffff',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
                <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className={`fa-solid ${group.icon}`} style={{ color: '#b91c1c', fontSize: '14px' }}></i>
                  <span>{group.title}</span>
                </h2>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: '#f1f5f9',
                  color: '#475569'
                }}>
                  {group.rows.length} lượt
                </span>
              </div>

              {group.rows.length ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  {group.rows.map((row) => (
                    <div
                      key={row.id}
                      style={{
                        padding: '10px 12px',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '13px'
                      }}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontWeight: 650, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {row.title}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '2px' }}>
                          {row.date}
                        </div>
                      </div>
                      <span style={{
                        flexShrink: 0,
                        fontSize: '12px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: row.detail.includes('Chờ chấm') ? '#fef3c7' : '#ecfdf5',
                        color: row.detail.includes('Chờ chấm') ? '#b45309' : '#047857',
                        border: row.detail.includes('Chờ chấm') ? '1px solid #fde68a' : '1px solid #a7f3d0'
                      }}>
                        {row.detail}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                  Chưa có dữ liệu ghi nhận
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
};
