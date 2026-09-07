import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchForumPosts, fetchLeaderboard, fetchSubmissions, fetchExams } from '../services/supabaseService';
import { isStudentInClassroom, getStudentEnrolledCourseIds } from '../utils/classEnrollment';

export const HomeView = ({ 
  courses = [], 
  classrooms = [],
  onOpenCreateClass,
  onOpenJoinClass,
  onOpenClassLessonManager,
  onOpenEditClass,
  onDeleteClassroom,
  streakData, 
  onOpenStreakModal, 
  onNavigate, 
  onSelectCourse, 
  onOpenLesson 
}) => {
  const { user, setIsAuthModalOpen } = useAuth();
  const isTeacherOrAdmin = user?.role === 'admin' || user?.role === 'teacher';

  // Filter classrooms visible to the logged-in user
  const visibleClassrooms = isTeacherOrAdmin
    ? classrooms
    : classrooms.filter((cls) => isStudentInClassroom(cls, user));

  const [selectedClassId, setSelectedClassId] = useState('all');
  const [copiedCodeClassId, setCopiedCodeClassId] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [forumPosts, setForumPosts] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [examsCount, setExamsCount] = useState(0);

  useEffect(() => {
    fetchLeaderboard().then((leaderboardResult) => {
      setLeaderboard((leaderboardResult.data || []).map((item, index) => ({
        ...item,
        id: item.id,
        rank: index + 1,
        name: item.name || item.user_name,
        user_name: item.name || item.user_name,
        xp: item.xp || item.score || 0,
        score: item.xp || item.score || 0,
        points: item.xp || item.score || 0,
        classId: item.classId || item.classroom_id || 'all',
        classroom_id: item.classId || item.classroom_id || 'all'
      })));
    });
  }, [user?.id, streakData?.totalXp, streakData?.currentStreak]);

  useEffect(() => {
    if (!user) {
      setForumPosts([]);
      setSubmissions([]);
      setExamsCount(0);
      return;
    }

    Promise.all([
      fetchForumPosts(),
      fetchSubmissions(),
      fetchExams()
    ]).then(([forumResult, subResult, examResult]) => {
      setForumPosts(forumResult.data || []);
      setSubmissions(subResult?.data || []);
      if (examResult?.data) setExamsCount(examResult.data.length);
    });
  }, [user?.id]);

  const handleCopyClassCode = (code, classId, e) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCodeClassId(classId);
    setTimeout(() => setCopiedCodeClassId(null), 2500);
  };

  // Student-specific enrolled courses
  const studentEnrolledCourseIds = isTeacherOrAdmin
    ? null
    : getStudentEnrolledCourseIds(classrooms, user);

  const studentCourses = isTeacherOrAdmin
    ? courses
    : courses.filter((c) => studentEnrolledCourseIds?.has(c.id));

  // Active course and next unlocked lesson for this user
  const currentCourse = studentCourses?.[0] || (isTeacherOrAdmin ? courses?.[0] : null);
  const currentClass = visibleClassrooms.find((cls) =>
    (cls.courseIds || cls.course_ids || []).includes(currentCourse?.id)
  );
  const unlockedLessonIds = currentClass?.unlockedLessons || [];
  const nextLesson = isTeacherOrAdmin
    ? (currentCourse?.lessons?.find((l) => l.status === 'active') || currentCourse?.lessons?.[0])
    : (currentCourse?.lessons?.find((l) => unlockedLessonIds.includes(l.id)) || currentCourse?.lessons?.[0]);

  // Submissions stats
  const pendingSubmissions = submissions.filter((s) => s.status === 'pending');
  const pendingCount = pendingSubmissions.length;
  const totalLessons = (courses || []).reduce((acc, c) => acc + (c.lessons?.length || 0), 0);
  const totalEnrolledStudents = (visibleClassrooms || []).reduce((acc, c) => acc + (c.students?.length || 0), 0);

  // Leaderboard data for preview
  const classLeaderboard = (selectedClassId === 'all' 
    ? leaderboard 
    : leaderboard.filter((item) => item.classroom_id === selectedClassId || item.classId === selectedClassId)
  ).slice(0, 3);

  // Latest forum posts
  const hotQuestion = forumPosts.find((p) => p.category === 'bai-kho');
  const fixedBug = forumPosts.find((p) => p.category === 'bao-loi');

  return (
    <div className="home-view-container" style={{ maxWidth: '1180px', margin: '0 auto', padding: '1.5rem 1rem 3.5rem' }}>
      
      {/* ========================================================================= */}
      {/* 1. HERO BANNER: NÂNG CAO MỖI NGÀY - TIẾN BỘ KHÔNG NGỪNG */}
      {/* ========================================================================= */}
      <section style={{
        background: 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 50%, #991b1b 100%)',
        borderRadius: '26px',
        padding: '2.5rem 2.25rem',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 45px -12px rgba(127, 29, 29, 0.35)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        marginBottom: '2rem'
      }}>
        {/* Background Chinese Calligraphy Watermark */}
        <span style={{
          position: 'absolute',
          right: '25px',
          top: '-35px',
          fontSize: '12rem',
          fontFamily: 'Noto Serif SC, serif',
          color: 'rgba(255, 255, 255, 0.04)',
          pointerEvents: 'none',
          userSelect: 'none'
        }}>
          学
        </span>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '640px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            padding: '0.35rem 0.85rem',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#fde68a',
            marginBottom: '0.85rem'
          }}>
            <i className="fa-solid fa-sparkles"></i>
            <span>Trung Tâm Hoa Ngữ Trực Tuyến Hanzify</span>
          </div>

          <h1 style={{ margin: '0 0 0.5rem', fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            {user?.role === 'teacher' ? (
              <>Chào Cô Hoài! 🌸<br/><span style={{ color: '#fed7aa', fontSize: '1.9rem' }}>Chúc cô một ngày giảng dạy tràn ngập niềm vui</span></>
            ) : user?.role === 'admin' ? (
              <>Bảng Điều Hành Hệ Thống 👑<br/><span style={{ color: '#fed7aa', fontSize: '1.9rem' }}>Giám sát toàn diện học viên & đề thi</span></>
            ) : (
              <>Nâng cao mỗi ngày,<br/><span style={{ color: '#fde68a' }}>Tiến bộ không ngừng!</span></>
            )}
          </h1>

          <p style={{ margin: '0 0 1.5rem', fontSize: '0.96rem', color: '#fee2e2', lineHeight: 1.6, opacity: 0.95 }}>
            {user?.role === 'teacher'
              ? (pendingCount > 0 ? `Hôm nay có ${pendingCount} bài tập mới cần chấm điểm từ học viên.` : 'Hôm nay chưa có bài tập mới cần chấm. Hệ thống sẵn sàng cho buổi học tiếp theo!')
              : user?.role === 'admin'
              ? `Hệ thống vận hành mượt mà, gồm ${courses.length} khóa học và ${examsCount} đề thi HSK đã sẵn sàng.`
              : 'Học tiếng Trung mỗi ngày cùng Cô Hoài giúp bạn tự tin giao tiếp và chinh phục chứng chỉ HSK chuẩn quốc tế.'}
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => {
                if (!user) {
                  setIsAuthModalOpen(true);
                  return;
                }
                if (nextLesson && onOpenLesson) {
                  onOpenLesson(nextLesson);
                } else {
                  onNavigate('courses');
                }
              }}
              style={{
                padding: '0.8rem 1.6rem',
                borderRadius: '14px',
                background: '#ffffff',
                color: '#991b1b',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.25)',
                transition: 'all 0.2s'
              }}
            >
              <i className={`fa-solid ${!user ? 'fa-lock' : 'fa-play'}`}></i>
              <span>{user?.role === 'teacher' ? 'Quản Lý Bài Học' : user ? 'Tiếp Tục Bài Học Ngay' : 'Đăng Nhập Để Bắt Đầu Học'}</span>
            </button>

            {/* Mở lớp mới (Teacher/Admin) HOẶC Nhập mã tham gia (Student/Guest) */}
            {isTeacherOrAdmin ? (
              <button
                type="button"
                onClick={onOpenCreateClass}
                style={{
                  padding: '0.8rem 1.4rem',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 6px 20px rgba(217, 119, 6, 0.35)',
                  transition: 'all 0.2s'
                }}
              >
                <i className="fa-solid fa-plus-circle"></i>
                <span>Mở Lớp Học Mới</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenJoinClass}
                style={{
                  padding: '0.8rem 1.4rem',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 6px 20px rgba(217, 119, 6, 0.35)',
                  transition: 'all 0.2s'
                }}
              >
                <i className="fa-solid fa-ticket"></i>
                <span>Tham Gia Lớp Bằng Mã</span>
              </button>
            )}

            {/* Vào phòng thi chỉ hiển thị cho học sinh và khách, ẩn đối với giáo viên và admin */}
            {!['teacher', 'admin'].includes(user?.role) && (
              <button
                type="button"
                onClick={() => onNavigate('exam')}
                style={{
                  padding: '0.8rem 1.4rem',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(8px)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  transition: 'all 0.2s'
                }}
              >
                <i className="fa-solid fa-flag-checkered"></i>
                <span>Vào Phòng Thi Thử HSK</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {!user && (
        <>
          <section style={{ marginBottom: '2rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem' }}>
                🏫 Các Lớp Đang Mở
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
                Xem lịch học và giáo viên phụ trách. Đăng nhập hoặc nhập mã lớp để xem thông tin của bạn.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              {classrooms.map((cls) => (
                <article key={cls.id} style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.8rem' }}>
                    <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1rem', fontWeight: 800 }}>{cls.name}</h3>
                    <span style={{ flexShrink: 0, background: '#fef2f2', color: '#991b1b', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 800 }}>{cls.level}</span>
                  </div>
                  <div style={{ color: '#475569', fontSize: '0.83rem', lineHeight: 1.8 }}>
                    <div><i className="fa-solid fa-chalkboard-user" style={{ width: 20, color: '#A11D24' }}></i> {cls.teacher || cls.teacherName || 'Cô Hoài'}</div>
                    <div><i className="fa-regular fa-calendar" style={{ width: 20, color: '#A11D24' }}></i> {(cls.schedule?.days || []).join(', ') || 'Lịch đang cập nhật'}{cls.schedule?.timeNote ? ` • ${cls.schedule.timeNote}` : ''}</div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section style={{ background: '#ffffff', borderRadius: '22px', border: '1px solid #fee2e2', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 4px 20px rgba(185, 28, 28, 0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem' }}>🏆 Bảng Xếp Hạng Học Tập</h2>
                <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0 }}>Thành tích nổi bật trên toàn hệ thống</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('leaderboard')}
                style={{
                  padding: '0.5rem 0.95rem',
                  borderRadius: '10px',
                  border: '1px solid #fecaca',
                  background: '#fef2f2',
                  color: '#991b1b',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '0.84rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <span>Xem tất cả</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>

            {leaderboard.slice(0, 5).map((item, index) => (
              <div key={item.id || index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '0.8rem 0', borderTop: index === 0 ? 'none' : '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ width: 30, height: 30, borderRadius: '50%', display: 'grid', placeItems: 'center', background: index === 0 ? '#fef3c7' : index === 1 ? '#e2e8f0' : index === 2 ? '#ffedd5' : '#f1f5f9', color: index === 0 ? '#b45309' : index === 1 ? '#475569' : index === 2 ? '#c2410c' : '#64748b', fontWeight: 900 }}>{index + 1}</span>
                  <div>
                    <div style={{ fontWeight: 800, color: '#1e293b' }}>{item.name}</div>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{item.game || item.badge || 'Học tập'}</div>
                  </div>
                </div>
                <strong style={{ color: '#A11D24', fontWeight: 800, fontSize: '0.95rem' }}>{item.points || item.xp || item.score || 0} điểm</strong>
              </div>
            ))}

            {leaderboard.length === 0 && <p style={{ color: '#94a3b8', textAlign: 'center', margin: '1rem 0 0' }}>Chưa có thành tích được ghi nhận.</p>}
          </section>
        </>
      )}

      {user && (
        <>

      {/* ========================================================================= */}
      {/* 1.5. KHU VỰC QUẢN LÝ LỚP HỌC & LỊCH HỌC TRỰC TUYẾN */}
      {/* ========================================================================= */}
      <section style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🏫</span>
              <span>{isTeacherOrAdmin ? 'Danh Sách Lớp Học Đang Giảng Dạy' : 'Lớp Học & Lịch Học Của Bạn'}</span>
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
              {isTeacherOrAdmin
                ? 'Mã lớp học không trùng lặp dùng để phát cho học sinh quét và kích hoạt vào lớp'
                : 'Theo dõi lịch học, giáo viên phụ trách và các khóa học đã được kích hoạt'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            {isTeacherOrAdmin ? (
              <button
                type="button"
                onClick={onOpenCreateClass}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: '10px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#991b1b',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <i className="fa-solid fa-plus"></i>
                <span>Tạo Lớp Mới</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenJoinClass}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: '10px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#991b1b',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <i className="fa-solid fa-qrcode"></i>
                <span>Nhập Mã Lớp Khác</span>
              </button>
            )}
          </div>
        </div>

        {/* Classes Cards Grid or Empty State */}
        {visibleClassrooms.length === 0 ? (
          <div style={{
            background: '#ffffff',
            borderRadius: '18px',
            border: '1.5px dashed #cbd5e1',
            padding: '2rem',
            textAlign: 'center',
            color: '#64748b'
          }}>
            <p style={{ margin: '0 0 0.75rem', fontSize: '0.95rem', fontWeight: 600 }}>
              {isTeacherOrAdmin ? 'Hiện tại chưa có lớp học nào được tạo trong hệ thống.' : 'Bạn chưa được ghi danh vào lớp học nào.'}
            </p>
            <button
              type="button"
              onClick={isTeacherOrAdmin ? onOpenCreateClass : onOpenJoinClass}
              style={{
                padding: '0.55rem 1.15rem',
                borderRadius: '10px',
                background: '#A11D24',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {isTeacherOrAdmin ? 'Tạo Lớp Học Đầu Tiên' : 'Nhập Mã Tham Gia Lớp'}
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1rem' }}>
            {visibleClassrooms.map((cls) => {
              const activatedCount = (cls.students || []).filter((s) => s.isActivated).length;
              const totalStudents = (cls.students || []).length;
              const isCopied = copiedCodeClassId === cls.id;
              const isStudentInClass = isStudentInClassroom(cls, user);

              return (
                <div
                  key={cls.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '18px',
                    border: isStudentInClass ? '2px solid #b91c1c' : '1px solid #e2e8f0',
                    padding: '1.25rem',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    {/* Top Bar: Code & Level */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontWeight: 800,
                            fontSize: '0.95rem',
                            letterSpacing: '0.05em',
                            color: '#991b1b',
                            background: '#fef2f2',
                            border: '1px solid #fee2e2',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '8px'
                          }}
                        >
                          {cls.code}
                        </span>
                        <button
                          type="button"
                          title="Sao chép mã lớp"
                          onClick={(e) => handleCopyClassCode(cls.code, cls.id, e)}
                          style={{
                            border: 'none',
                            background: isCopied ? '#22c55e' : '#f1f5f9',
                            color: isCopied ? '#fff' : '#475569',
                            padding: '0.3rem 0.6rem',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            transition: 'all 0.15s'
                          }}
                        >
                          <i className={`fa-solid ${isCopied ? 'fa-check' : 'fa-copy'}`}></i>
                          <span>{isCopied ? 'Đã chép' : 'Chép mã'}</span>
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            background: '#f1f5f9',
                            color: '#334155',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '6px'
                          }}
                        >
                          {cls.level}
                        </span>

                        {isTeacherOrAdmin && onOpenEditClass && (
                          <button
                            type="button"
                            title="Chỉnh sửa thông tin lớp, thêm học sinh, khóa học"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenEditClass(cls);
                            }}
                            style={{
                              border: 'none',
                              background: '#f1f5f9',
                              color: '#334155',
                              padding: '0.25rem 0.55rem',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              transition: 'all 0.15s'
                            }}
                          >
                            <i className="fa-solid fa-pen"></i>
                            <span>Sửa</span>
                          </button>
                        )}

                        {isTeacherOrAdmin && onDeleteClassroom && (
                          <button
                            type="button"
                            title="Xóa lớp học này"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Bạn có chắc muốn xóa lớp học "${cls.name}" không?`)) {
                                onDeleteClassroom(cls.id);
                              }
                            }}
                            style={{
                              border: 'none',
                              background: '#fef2f2',
                              color: '#dc2626',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.75rem'
                            }}
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Class Name */}
                    <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.08rem', fontWeight: 800, color: '#0f172a' }}>
                      {cls.name}
                    </h3>

                    {/* Schedule & Teacher Info */}
                    <div style={{ fontSize: '0.83rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <i className="fa-regular fa-calendar" style={{ color: '#b91c1c', width: '16px' }}></i>
                        <span>
                          <strong>Lịch học:</strong> {cls.schedule?.days?.join(', ')} ({cls.schedule?.shift}: {cls.schedule?.timeNote})
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <i className="fa-solid fa-chalkboard-user" style={{ color: '#b91c1c', width: '16px' }}></i>
                        <span>
                          <strong>Giáo viên:</strong> {cls.teacher}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <i className="fa-solid fa-book-bookmark" style={{ color: '#b91c1c', width: '16px' }}></i>
                        <span>
                          <strong>Chương trình:</strong> {(() => {
                            const cIds = cls.courseIds || cls.course_ids || [];
                            const matched = courses.filter((c) => cIds.includes(c.id));
                            if (matched.length > 0) {
                              const labels = [...new Set(matched.map((c) => c.level || c.title))];
                              return labels.join(', ');
                            }
                            return cls.level || 'HSK 1';
                          })()}
                        </span>
                      </div>
                    </div>

                    {/* Class Lesson Open Management (Dành cho Giáo viên & Admin) */}
                    {isTeacherOrAdmin && (
                      <div style={{
                        marginBottom: '0.85rem',
                        padding: '0.65rem 0.85rem',
                        background: '#f8fafc',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.5rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem' }}>
                          <span style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: (cls.unlockedLessons?.length || 0) > 0 ? '#16a34a' : '#94a3b8'
                          }} />
                          <span style={{ fontWeight: 700, color: '#334155' }}>
                            {cls.unlockedLessons?.length || 0} bài học đang mở
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <button
                            type="button"
                            onClick={() => onOpenEditClass && onOpenEditClass(cls)}
                            title="Chỉnh sửa thông tin lớp, thêm học sinh, khóa học"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              padding: '0.45rem 0.75rem',
                              borderRadius: '8px',
                              background: '#ffffff',
                              color: '#334155',
                              border: '1px solid #cbd5e1',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            <i className="fa-solid fa-pen"></i>
                            <span>Sửa Lớp</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onOpenClassLessonManager && onOpenClassLessonManager(cls)}
                            title="Mở hoặc khóa bài học cho lớp này"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              padding: '0.45rem 0.85rem',
                              borderRadius: '8px',
                              background: '#0f172a',
                              color: '#ffffff',
                              border: 'none',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)'
                            }}
                          >
                            <i className="fa-solid fa-lock-open" style={{ color: '#38bdf8' }}></i>
                            <span>Mở Bài</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Roster Status */}
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', marginBottom: '0.4rem' }}>
                      <span style={{ color: '#475569', fontWeight: 650 }}>Học cùng với:</span>
                      <strong style={{ color: activatedCount === totalStudents && totalStudents > 0 ? '#16a34a' : '#0f172a' }}>
                        {activatedCount} / {totalStudents} học sinh
                      </strong>
                    </div>

                    <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${totalStudents > 0 ? (activatedCount / totalStudents) * 100 : 0}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                          borderRadius: '999px'
                        }}
                      />
                    </div>

                    {/* Student names chips with "(tôi)" badge */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.38rem', marginTop: '0.65rem' }}>
                      {(() => {
                        const studentList = cls.students || [];
                        if (studentList.length === 0) {
                          return (
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
                              Chưa có học sinh trong lớp
                            </span>
                          );
                        }

                        // Check if student matches the current user
                        const isStudentMe = (s) => {
                          if (!user || !s) return false;
                          const uId = user.id ? String(user.id).trim() : null;
                          const uUser = (user.username || '').trim().toLowerCase();
                          const uName = (user.full_name || user.name || '').trim().toLowerCase();
                          const uEmail = (user.email || '').trim().toLowerCase();

                          const sId = s.id ? String(s.id).trim() : null;
                          const sUserId = (s.userId || s.user_id) ? String(s.userId || s.user_id).trim() : null;
                          const sUser = (s.username || '').trim().toLowerCase();
                          const sName = (s.name || '').trim().toLowerCase();
                          const sEmail = (s.email || '').trim().toLowerCase();

                          if (uId && (uId === sId || uId === sUserId)) return true;
                          if (uUser && sUser && uUser === sUser) return true;
                          if (uEmail && sEmail && uEmail === sEmail) return true;
                          if (uName && sName && uName === sName) return true;
                          return false;
                        };

                        // Sort current user to the first position
                        const sortedStudents = [...studentList].sort((a, b) => {
                          const aMe = isStudentMe(a);
                          const bMe = isStudentMe(b);
                          if (aMe && !bMe) return -1;
                          if (!aMe && bMe) return 1;
                          return 0;
                        });

                        return sortedStudents.map((s) => {
                          const isMe = isStudentMe(s);

                          return (
                            <span
                              key={s.id || s.name}
                              style={{
                                fontSize: '0.74rem',
                                padding: '0.18rem 0.55rem',
                                borderRadius: '7px',
                                background: isMe ? '#fef2f2' : s.isActivated ? '#dcfce7' : '#f8fafc',
                                color: isMe ? '#A11D24' : s.isActivated ? '#166534' : '#64748b',
                                border: isMe ? '1.5px solid #fca5a5' : s.isActivated ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                                fontWeight: isMe ? 800 : 600,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                boxShadow: isMe ? '0 2px 6px rgba(161, 29, 36, 0.12)' : 'none'
                              }}
                            >
                              <span>
                                {s.name}{isMe ? ' (tôi)' : ''}
                              </span>
                              {s.isActivated && (
                                <span style={{ color: isMe ? '#A11D24' : '#16a34a', fontWeight: 700 }}>✓</span>
                              )}
                            </span>
                          );
                        });
                      })()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 2. KHU VỰC TIỆN ÍCH TRỌNG TÂM: STREAK, LEADERBOARD THEO LỚP, DIỄN ĐÀN */}
      {/* ========================================================================= */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem'
      }}>
        
        {/* THẺ 1: HỌC VIÊN HIỂN THỊ CHUỖI STREAK - GIÁO VIÊN HIỂN THỊ BÀN CHẤM BÀI */}
        {user?.role === 'teacher' ? (
          /* THẺ DÀNH CHO GIÁO VIÊN: BÀN CHẤM BÀI TẬP */
          <div style={{
            background: '#ffffff',
            borderRadius: '22px',
            border: '1.5px solid #fecaca',
            padding: '1.5rem',
            boxShadow: '0 4px 20px rgba(185, 28, 28, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#991b1b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <i className="fa-solid fa-stamp" style={{ fontSize: '1.1rem' }}></i> Bàn Chấm Bài & Phản Hồi
                </span>
                <span style={{
                  background: '#fef2f2',
                  color: '#b91c1c',
                  border: '1px solid #fee2e2',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 700
                }}>
                  {pendingCount > 0 ? `${pendingCount} bài tập chờ chấm` : 'Đã chấm hết'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '2.4rem', fontWeight: 900, color: '#991b1b', lineHeight: 1 }}>
                  {pendingCount < 10 ? `0${pendingCount}` : pendingCount}
                </span>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#334155' }}>
                  bài tập cần chấm
                </span>
              </div>
              <p style={{ margin: '0 0 1rem', fontSize: '0.84rem', color: '#64748b', lineHeight: 1.45 }}>
                {pendingCount > 0 
                  ? 'Học viên vừa nộp bài tập về nhà. Cô chấm điểm và gửi lời nhận xét để khích lệ các em nhé!'
                  : 'Hiện chưa có bài tập nộp mới nào cần chấm. Học viên nộp bài sẽ xuất hiện tại đây.'}
              </p>

              {/* Task list preview */}
              {pendingCount > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  {pendingSubmissions.slice(0, 3).map((sub) => (
                    <div key={sub.id} style={{
                      background: '#f8fafc',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.8rem'
                    }}>
                      <span style={{ fontWeight: 700, color: '#1e293b' }}>{sub.lessonTitle}</span>
                      <span style={{ color: '#dc2626', fontWeight: 700, fontSize: '0.74rem' }}>{sub.studentName}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  padding: '1.1rem',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px dashed #cbd5e1',
                  textAlign: 'center',
                  color: '#64748b',
                  fontSize: '0.82rem',
                  marginBottom: '1.25rem'
                }}>
                  Chưa có bài tập cần chấm
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => onNavigate('grading')}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                boxShadow: '0 4px 14px rgba(185, 28, 28, 0.25)',
                transition: 'all 0.15s'
              }}
            >
              <i className="fa-solid fa-pen-to-square"></i>
              <span>Vào Bàn Chấm Bài Của Cô Giáo</span>
            </button>
          </div>
        ) : (
          /* THẺ DÀNH CHO HỌC VIÊN: CHUỖI NGÀY HỌC (STREAK) */
          <div style={{
            background: '#ffffff',
            borderRadius: '22px',
            border: '1.5px solid #fed7aa',
            padding: '1.5rem',
            boxShadow: '0 4px 20px rgba(234, 88, 12, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#c2410c', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>🔥</span> Chuỗi Ngày Học
                </span>
                <span style={{
                  background: streakData?.checkedInToday ? '#ecfdf5' : '#fff7ed',
                  color: streakData?.checkedInToday ? '#047857' : '#ea580c',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 700
                }}>
                  {streakData?.checkedInToday ? '✓ Đã điểm danh' : 'Chưa điểm danh'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '2.4rem', fontWeight: 900, color: '#9a3412', lineHeight: 1 }}>
                  {streakData?.currentStreak ?? 0}
                </span>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#334155' }}>
                  ngày liên tiếp
                </span>
              </div>
              <p style={{ margin: '0 0 1rem', fontSize: '0.84rem', color: '#64748b', lineHeight: 1.45 }}>
                Học mỗi ngày để giữ chuỗi streak và củng cố phản xạ Hoa ngữ lâu dài.
              </p>

              {/* 7 Days tracker */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', marginBottom: '1.25rem' }}>
                {streakData?.weekDays ? streakData.weekDays.map((d) => (
                  <div key={d.day} style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: d.completed ? '#c2410c' : '#94a3b8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      {d.day}
                    </span>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      margin: '0 auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: d.completed ? 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)' : '#ffffff',
                      border: d.completed ? 'none' : '1.5px dashed #cbd5e1',
                      color: '#ffffff',
                      fontSize: '0.8rem',
                      boxShadow: d.completed ? '0 2px 8px rgba(234, 88, 12, 0.35)' : 'none'
                    }}>
                      {d.completed ? '✓' : ''}
                    </div>
                  </div>
                )) : null}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!user) {
                  setIsAuthModalOpen(true);
                  return;
                }
                if (onOpenStreakModal) onOpenStreakModal();
              }}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                boxShadow: '0 4px 14px rgba(234, 88, 12, 0.25)',
                transition: 'all 0.15s'
              }}
            >
              <i className={`fa-solid ${!user ? 'fa-lock' : 'fa-fire'}`}></i>
              <span>{!user ? 'Đăng Nhập Để Điểm Danh' : streakData?.checkedInToday ? 'Xem Lịch Sử Chuỗi' : 'Điểm Danh Chuỗi (+50 XP)'}</span>
            </button>
          </div>
        )}

        {/* THẺ 2: BẢNG XẾP HẠNG THEO LỚP HỌC (CÔNG BẰNG) */}
        <div style={{
          background: '#ffffff',
          borderRadius: '22px',
          border: '1.5px solid #fef08a',
          padding: '1.5rem',
          boxShadow: '0 4px 20px rgba(202, 138, 4, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#854d0e', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <i className="fa-solid fa-crown" style={{ color: '#eab308' }}></i> Bảng Xếp Hạng Lớp Học
              </span>
              <button
                type="button"
                onClick={() => onNavigate('leaderboard')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#A11D24',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Xem chi tiết ➔
              </button>
            </div>

            {/* Quick Class Dropdown Filter */}
            <div style={{ marginBottom: '0.85rem' }}>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.4rem 0.65rem',
                  borderRadius: '10px',
                  border: '1.5px solid #fef08a',
                  background: '#fefce8',
                  color: '#854d0e',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {[{ id: 'all', name: 'Toàn hệ thống' }, ...visibleClassrooms].map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Top 3 List or Empty State */}
            {classLeaderboard.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '1rem' }}>
                {classLeaderboard.map((item, idx) => (
                  <div 
                    key={item.id} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: '6px 10px', 
                      borderRadius: '10px', 
                      background: idx === 0 ? '#fefce8' : '#f8fafc',
                      border: idx === 0 ? '1px solid #fef08a' : '1px solid #f1f5f9'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.9rem' }}>{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</span>
                      <span style={{ fontWeight: 700, fontSize: '0.84rem', color: '#1e293b' }}>{item.name}</span>
                      <span style={{ fontSize: '0.68rem', color: '#64748b', background: '#e2e8f0', padding: '1px 5px', borderRadius: '4px' }}>
                        {item.level || 'HSK'}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.84rem', color: idx === 0 ? '#854d0e' : '#0f172a' }}>
                        {(item.xp || 0).toLocaleString()} XP
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                padding: '1.25rem 1rem',
                background: '#fefce8',
                borderRadius: '12px',
                border: '1px dashed #fef08a',
                textAlign: 'center',
                color: '#854d0e',
                fontSize: '0.82rem',
                marginBottom: '1rem'
              }}>
                Chưa có lượt xếp hạng trong tuần này.
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onNavigate('leaderboard')}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '14px',
              background: '#fefce8',
              color: '#854d0e',
              border: '1.5px solid #fef08a',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              transition: 'all 0.15s'
            }}
          >
            <i className="fa-solid fa-trophy" style={{ color: '#eab308' }}></i>
            <span>Vào Bảng Xếp Hạng Đầy Đủ</span>
          </button>
        </div>

        {/* THẺ 3: DIỄN ĐÀN & BÁO LỖI WEB */}
        <div style={{
          background: '#ffffff',
          borderRadius: '22px',
          border: '1.5px solid #fecdd3',
          padding: '1.5rem',
          boxShadow: '0 4px 20px rgba(161, 29, 36, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#9f1239', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <i className="fa-regular fa-comments" style={{ color: '#be123c' }}></i> Diễn Đàn & Báo Lỗi Web
              </span>
              <button
                type="button"
                onClick={() => onNavigate('forum')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#A11D24',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Xem tất cả ➔
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1rem' }}>
              {hotQuestion && (
                <div 
                  onClick={() => onNavigate('forum')}
                  style={{ 
                    padding: '8px 10px', 
                    borderRadius: '10px', 
                    background: '#fff1f2', 
                    cursor: 'pointer',
                    border: '1px solid #fecdd3'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#be123c', background: '#ffe4e6', padding: '1px 5px', borderRadius: '4px' }}>
                      ❓ Hỏi bài khó
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#047857', fontWeight: 700 }}>
                      • Cô Hoài đã giải đáp
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {hotQuestion.title}
                  </div>
                </div>
              )}

              {fixedBug && (
                <div 
                  onClick={() => onNavigate('forum')}
                  style={{ 
                    padding: '8px 10px', 
                    borderRadius: '10px', 
                    background: '#ecfdf5', 
                    cursor: 'pointer',
                    border: '1px solid #a7f3d0'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#047857', background: '#d1fae5', padding: '1px 5px', borderRadius: '4px' }}>
                      🐛 Báo lỗi Web
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#047857', fontWeight: 700 }}>
                      • Admin đã fix xong
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {fixedBug.title}
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('forum')}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '14px',
              background: '#A11D24',
              color: '#ffffff',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              boxShadow: '0 4px 14px rgba(161, 29, 36, 0.25)',
              transition: 'all 0.15s'
            }}
          >
            <i className="fa-solid fa-pen-nib"></i>
            <span>Đăng Bài Hỏi / Báo Lỗi (+20 XP)</span>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. LỘ TRÌNH KHÓA HỌC & KHO TÀI LIỆU CỦA BẠN */}
      {/* ========================================================================= */}
      <section style={{
        background: '#ffffff',
        borderRadius: '24px',
        border: '1px solid #fee2e2',
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ margin: '0 0 0.35rem', fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
              <i className="fa-solid fa-book-open-reader" style={{ color: '#A11D24', marginRight: '0.5rem' }}></i>
              Tiến Độ Khóa Học Của Bạn
            </h2>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b' }}>
              Tiếp tục bài tập đang làm dở để không bị ngắt quãng dòng học tập.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('courses')}
            style={{
              padding: '0.55rem 1.15rem',
              borderRadius: '10px',
              background: '#fef2f2',
              color: '#A11D24',
              border: '1px solid #fecaca',
              fontWeight: 700,
              fontSize: '0.84rem',
              cursor: 'pointer'
            }}
          >
            Xem Tất Cả Khóa Học ➔
          </button>
        </div>

        {currentCourse && (
          <div style={{
            background: 'linear-gradient(135deg, #fff1f2 0%, #ffffff 100%)',
            border: '1.5px solid #fecdd3',
            borderRadius: '18px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '14px',
                background: currentCourse.coverGradient || 'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                fontFamily: 'Noto Serif SC, serif',
                fontWeight: 700,
                flexShrink: 0
              }}>
                {currentCourse.charWatermark || '学'}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <span style={{ background: '#dc2626', color: '#ffffff', padding: '1px 6px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 800 }}>
                    {currentCourse.level}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    {currentCourse.teacher}
                  </span>
                </div>
                <h3 style={{ margin: '0 0 2px', fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>
                  {currentCourse.title}
                </h3>
                <div style={{ fontSize: '0.82rem', color: '#991b1b', fontWeight: 600 }}>
                  {currentCourse.chineseTitle} • Bài tiếp theo: <strong>{nextLesson?.title || 'Bài 01'}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block' }}>Tiến độ khóa</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#A11D24' }}>
                  {Math.min(100, Math.round(((currentCourse.completedLessons || 0) / (currentCourse.lessons?.length || currentCourse.totalLessons || 1)) * 100))}%
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!user) {
                    setIsAuthModalOpen(true);
                    return;
                  }
                  if (onSelectCourse) onSelectCourse(currentCourse);
                }}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: '12px',
                  background: '#A11D24',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 12px rgba(161, 29, 36, 0.25)'
                }}
              >
                <span>Vào Lớp Ngay</span>
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 4. KHO HỌC LIỆU & THỐNG KÊ HỆ THỐNG THỰC TẾ */}
      {/* ========================================================================= */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #fee2e2', padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#A11D24', marginBottom: '2px' }}>{totalLessons}</div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>Bài Tập Đã Thiết Lập</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Theo lộ trình các khóa học</div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #fee2e2', padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#A11D24', marginBottom: '2px' }}>{(courses || []).length}</div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>Khóa Học Đang Mở</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>HSK 1 đến HSK 3 chuẩn hóa</div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #fee2e2', padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#A11D24', marginBottom: '2px' }}>{examsCount}</div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>Đề Thi Thử HSK</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Tính giờ tự động chuẩn quốc tế</div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #fee2e2', padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#A11D24', marginBottom: '2px' }}>{classrooms.length}</div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>Lớp Đang Hoạt Động</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{totalEnrolledStudents} học viên ghi danh</div>
        </div>
      </section>

        </>
      )}

    </div>
  );
};
