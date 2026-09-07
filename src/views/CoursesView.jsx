import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { isCourseAssignedToStudent } from '../utils/classEnrollment';

const GRADIENT_PRESETS = [
  { label: 'Đỏ Imperial', value: 'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 100%)', color: '#b91c1c' },
  { label: 'Đỏ Mận Sang Trọng', value: 'linear-gradient(135deg, #450a0a 0%, #831843 100%)', color: '#831843' },
  { label: 'Xanh Đen Huyền Bí', value: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#1e293b' },
  { label: 'Xanh Ngọc Cổ Kính', value: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)', color: '#047857' },
  { label: 'Tím Hoàng Gia', value: 'linear-gradient(135deg, #3b0764 0%, #6b21a8 100%)', color: '#6b21a8' }
];

export const CoursesView = ({ 
  courses = [], 
  classrooms = [],
  onOpenCreateClass,
  onOpenJoinClass,
  onSelectCourse, 
  onCreateCourse, 
  onEditCourse, 
  onDeleteCourse,
  streakData,
  onOpenStreakModal,
  onNavigate
}) => {
  const { user } = useAuth();
  const isTeacherOrAdmin = user?.role === 'admin' || user?.role === 'teacher';

  // Modal State for Create / Edit Course
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null); // null means creating new
  const [formTitle, setFormTitle] = useState('');
  const [formChineseTitle, setFormChineseTitle] = useState('');
  const [formLevel, setFormLevel] = useState('HSK 2');
  const [formBadge, setFormBadge] = useState('Đang mở');
  const [formTeacher, setFormTeacher] = useState('Cô Hoài');
  const [formCharWatermark, setFormCharWatermark] = useState('学');
  const [formCoverGradient, setFormCoverGradient] = useState(GRADIENT_PRESETS[0].value);
  const [formDescription, setFormDescription] = useState('');
  const [formTotalLessons, setFormTotalLessons] = useState(10);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingCourseId(null);
    setFormTitle('');
    setFormChineseTitle('');
    setFormLevel('HSK 3');
    setFormBadge('Khóa mới');
    setFormTeacher(user?.name || 'Cô Hoài');
    setFormCharWatermark('学');
    setFormCoverGradient(GRADIENT_PRESETS[0].value);
    setFormDescription('');
    setFormTotalLessons(10);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (course, e) => {
    e.stopPropagation();
    setEditingCourseId(course.id);
    setFormTitle(course.title || '');
    setFormChineseTitle(course.chineseTitle || '');
    setFormLevel(course.level || 'HSK 2');
    setFormBadge(course.badge || 'Đang theo học');
    setFormTeacher(course.teacher || 'Cô Hoài');
    setFormCharWatermark(course.charWatermark || '学');
    setFormCoverGradient(course.coverGradient || GRADIENT_PRESETS[0].value);
    setFormDescription(course.description || '');
    setFormTotalLessons(course.totalLessons || (course.lessons?.length || 10));
    setIsModalOpen(true);
  };

  // Delete Course
  const handleDelete = (course, e) => {
    e.stopPropagation();
    if (window.confirm(`Bạn có chắc chắn muốn xóa khóa học "${course.title}"? Thao tác này sẽ xóa toàn bộ bài tập trong khóa!`)) {
      if (onDeleteCourse) {
        onDeleteCourse(course.id);
      }
    }
  };

  // Submit Form
  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('Vui lòng nhập tên khóa học!');
      return;
    }

    if (editingCourseId) {
      // Edit existing
      const existing = courses.find((c) => c.id === editingCourseId);
      const updated = {
        ...existing,
        title: formTitle.trim(),
        chineseTitle: formChineseTitle.trim(),
        level: formLevel,
        badge: formBadge.trim(),
        teacher: formTeacher.trim(),
        charWatermark: formCharWatermark.trim() || '学',
        coverGradient: formCoverGradient,
        description: formDescription.trim(),
        totalLessons: parseInt(formTotalLessons, 10) || 10
      };
      if (onEditCourse) onEditCourse(updated);
    } else {
      // Create new
      const newId = `course-${Date.now()}`;
      const newCourse = {
        id: newId,
        title: formTitle.trim(),
        chineseTitle: formChineseTitle.trim(),
        level: formLevel,
        badge: formBadge.trim(),
        teacher: formTeacher.trim(),
        charWatermark: formCharWatermark.trim() || '学',
        coverGradient: formCoverGradient,
        description: formDescription.trim(),
        totalLessons: parseInt(formTotalLessons, 10) || 10,
        completedLessons: 0,
        lessons: [
          {
            id: `${newId}-1`,
            number: '01',
            title: `Bài 1: Khởi động & Phát âm căn bản (${formChineseTitle ? formChineseTitle + ' 01' : '基础发音'})`,
            deadline: '23:59 Chủ Nhật',
            status: 'active',
            score: null,
            questionsCount: 5,
            type: 'Cần nộp bài'
          }
        ]
      };
      if (onCreateCourse) onCreateCourse(newCourse);
    }

    setIsModalOpen(false);
  };

  // Student & System statistics calculation
  const totalStudents = classrooms.reduce((acc, c) => acc + (c.students?.length || 0), 0);
  const totalLessons = courses.reduce((acc, c) => acc + (c.lessons?.length || 0), 0);
  const studentCompletedLessons = courses.reduce((acc, c) => acc + (c.completedLessons || 0), 0);
  const allScores = [];
  courses.forEach((c) => {
    (c.lessons || []).forEach((l) => {
      if (typeof l.score === 'number') allScores.push(l.score);
    });
  });
  const avgScore = allScores.length > 0 
    ? (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1) 
    : '0.0';

  return (
    <div className="courses-view-container">
      {/* Motivational / Admin Banner */}
      <section className="welcome-banner" style={{
        background: isTeacherOrAdmin ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' : undefined,
        border: isTeacherOrAdmin ? '1.5px solid #334155' : undefined
      }}>
        <div className="banner-content">
          <div className="banner-tag" style={{
            background: isTeacherOrAdmin ? 'rgba(254, 202, 202, 0.15)' : undefined,
            color: isTeacherOrAdmin ? '#fca5a5' : undefined
          }}>
            <i className={isTeacherOrAdmin ? "fa-solid fa-chalkboard-user" : "fa-solid fa-sparkles"}></i>
            <span>
              {user?.role === 'admin' 
                ? '👑 Trung Tâm Quản Trị Đào Tạo & Khóa Học (Admin)' 
                : user?.role === 'teacher'
                ? '👩‍🏫 Không Gian Quản Lý Khóa Học Của Cô Hoài'
                : 'Không Gian Học Tập Hoa Ngữ'}
            </span>
          </div>
          <h1 className="banner-greeting" style={{ color: isTeacherOrAdmin ? '#f8fafc' : undefined }}>
            {user?.role === 'admin'
              ? 'Bảng Điều Hành Khóa Học Hanzify'
              : user?.role === 'teacher'
              ? 'Chào Cô Hoài! Quản Lý & Cập Nhật Khóa Học 🌸'
              : user ? `Chào mừng trở lại, ${user.name}! 👋` : 'Chào mừng bạn đến với Hanzify!'}
          </h1>
          <p className="banner-proverb" style={{ color: isTeacherOrAdmin ? '#94a3b8' : undefined }}>
            {isTeacherOrAdmin
              ? 'Toàn quyền thêm, chỉnh sửa hoặc xóa khóa học; cấu hình lộ trình các bài giảng và bài tập về nhà cho học sinh.'
              : '"千里之行，始于足下" — Hành trình vạn dặm bắt đầu từ những bước chân đầu tiên.'}
          </p>

          {/* Action buttons for Teacher & Admin */}
          {isTeacherOrAdmin && (
            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleOpenCreate}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: '12px',
                  background: '#A11D24',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(161, 29, 36, 0.4)',
                  transition: 'all 0.2s'
                }}
              >
                <i className="fa-solid fa-plus-circle"></i>
                <span>Thêm Khóa Học Mới</span>
              </button>
            </div>
          )}
        </div>

        <div className="banner-stats">
          {user?.role === 'admin' ? (
            <>
              <div className="stat-card" style={{ background: 'rgba(255,255,255,0.06)', borderColor: '#334155' }}>
                <span className="stat-num" style={{ color: '#f8fafc' }}>
                  {courses.length < 10 ? `0${courses.length}` : courses.length}
                </span>
                <span className="stat-label" style={{ color: '#94a3b8' }}>Khóa Hệ Thống</span>
              </div>
              <div className="stat-card" style={{ background: 'rgba(255,255,255,0.06)', borderColor: '#334155' }}>
                <span className="stat-num" style={{ color: '#f8fafc' }}>
                  {totalStudents < 10 ? `0${totalStudents}` : totalStudents}
                </span>
                <span className="stat-label" style={{ color: '#94a3b8' }}>Tổng Học Viên</span>
              </div>
              <div className="stat-card highlight" style={{ background: 'rgba(161, 29, 36, 0.2)', borderColor: '#A11D24' }}>
                <span className="stat-num" style={{ color: '#fca5a5' }}>
                  {totalLessons < 10 ? `0${totalLessons}` : totalLessons}
                </span>
                <span className="stat-label" style={{ color: '#fca5a5' }}>Bài Tập Thiết Lập</span>
              </div>
            </>
          ) : user?.role === 'teacher' ? (
            <>
              <div className="stat-card" style={{ background: 'rgba(255,255,255,0.06)', borderColor: '#334155' }}>
                <span className="stat-num" style={{ color: '#f8fafc' }}>
                  {courses.length < 10 ? `0${courses.length}` : courses.length}
                </span>
                <span className="stat-label" style={{ color: '#94a3b8' }}>Khóa Đang Dạy</span>
              </div>
              <div className="stat-card" style={{ background: 'rgba(255,255,255,0.06)', borderColor: '#334155' }}>
                <span className="stat-num" style={{ color: '#f8fafc' }}>
                  {totalStudents < 10 ? `0${totalStudents}` : totalStudents}
                </span>
                <span className="stat-label" style={{ color: '#94a3b8' }}>Tổng Học Viên</span>
              </div>
              <div className="stat-card highlight" style={{ background: 'rgba(161, 29, 36, 0.2)', borderColor: '#A11D24' }}>
                <span className="stat-num" style={{ color: '#fca5a5' }}>
                  {totalLessons < 10 ? `0${totalLessons}` : totalLessons}
                </span>
                <span className="stat-label" style={{ color: '#fca5a5' }}>Bài Đang Phụ Trách</span>
              </div>
            </>
          ) : (
            <>
              <div className="stat-card">
                <span className="stat-num">
                  {courses.length < 10 ? `0${courses.length}` : courses.length}
                </span>
                <span className="stat-label">{user ? 'Khóa Đang Học' : 'Khóa Đang Mở'}</span>
              </div>
              <div className="stat-card">
                <span className="stat-num">
                  {user
                    ? (studentCompletedLessons < 10 ? `0${studentCompletedLessons}` : studentCompletedLessons)
                    : (totalLessons < 10 ? `0${totalLessons}` : totalLessons)}
                </span>
                <span className="stat-label">{user ? 'Bài Đã Hoàn Thành' : 'Bài Học Có Sẵn'}</span>
              </div>
              <div className="stat-card highlight">
                <span className="stat-num">{user ? (allScores.length > 0 ? avgScore : '--') : 'HSK'}</span>
                <span className="stat-label">{user ? 'Điểm Trung Bình' : 'Lộ Trình Chuẩn'}</span>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Course List Section Header */}
      <div className="section-title-row">
        <div>
          <h2 className="section-title">
            {isTeacherOrAdmin
              ? 'Quản Lý Danh Sách Khóa Học'
              : user
              ? 'Danh Sách Khóa Học Của Bạn'
              : 'Danh Sách Khóa Học Đang Mở'}
          </h2>
          <p className="section-desc">
            {isTeacherOrAdmin
              ? 'Bấm vào từng khóa học để quản lý lộ trình bài giảng, thêm bài học mới hoặc kiểm tra đề bài'
              : user
              ? 'Chọn khóa học để xem lộ trình bài học và làm bài tập nộp cho cô giáo'
              : 'Xem trước nội dung và lộ trình; đăng nhập để vào học và lưu tiến độ'}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span className="course-counter">
            Tổng cộng: <strong>{courses.length}</strong> khóa học
          </span>

          {isTeacherOrAdmin ? (
            <>
              <button
                type="button"
                onClick={onOpenCreateClass}
                style={{
                  padding: '0.65rem 1.15rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 4px 12px rgba(217, 119, 6, 0.25)'
                }}
              >
                <i className="fa-solid fa-plus-circle"></i>
                <span>Mở Lớp Học Mới</span>
              </button>

              <button
                type="button"
                onClick={handleOpenCreate}
                style={{
                  padding: '0.65rem 1.15rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 4px 12px rgba(185, 28, 28, 0.25)'
                }}
              >
                <i className="fa-solid fa-book-medical"></i>
                <span>Tạo Khóa Học</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onOpenJoinClass}
              style={{
                padding: '0.65rem 1.15rem',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.86rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: '0 4px 12px rgba(185, 28, 28, 0.25)'
              }}
            >
              <i className="fa-solid fa-ticket"></i>
              <span>Tham Gia Lớp Bằng Mã</span>
            </button>
          )}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="courses-grid">
        {courses.map((course) => {
          const totalL = course.lessons?.length || course.totalLessons || 1;
          const completedL = course.completedLessons || 0;
          const percent = Math.min(100, Math.round((completedL / totalL) * 100));
          const isEnrolled = isTeacherOrAdmin ? true : isCourseAssignedToStudent(course.id, classrooms, user);
          const courseStudentsCount = (classrooms || [])
            .filter((cls) => (cls.course_ids || cls.courseIds || []).includes(course.id))
            .reduce((acc, cls) => acc + (cls.students?.length || 0), 0);

          return (
            <article 
              key={course.id} 
              className="course-card"
              onClick={() => onSelectCourse(course)}
              style={{
                position: 'relative',
                opacity: !user || isTeacherOrAdmin || isEnrolled ? 1 : 0.85
              }}
            >
              {/* Header Gradient with Chinese Calligraphy Watermark */}
              <div 
                className="course-card-cover" 
                style={{ background: course.coverGradient || 'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 100%)' }}
              >
                <span className="cover-watermark">{course.charWatermark || '学'}</span>
                <div className="cover-tags">
                  <span className="course-level-badge">{course.level}</span>
                  <span className="course-status-badge">
                    {!user ? course.badge : isEnrolled ? (isTeacherOrAdmin ? course.badge : '✓ Lớp của bạn') : '🔒 Khóa ngoài lớp'}
                  </span>
                </div>
                <div className="cover-chinese-sub">{course.chineseTitle}</div>

                {/* Teacher / Admin Action Overlay on Card Cover */}
                {isTeacherOrAdmin && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      display: 'flex',
                      gap: '6px',
                      zIndex: 3
                    }}
                  >
                    <button
                      type="button"
                      title="Chỉnh sửa khóa học này"
                      onClick={(e) => handleOpenEdit(course, e)}
                      style={{
                        background: 'rgba(15, 23, 42, 0.75)',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        color: '#ffffff',
                        borderRadius: '8px',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        transition: 'all 0.2s'
                      }}
                    >
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button
                      type="button"
                      title="Xóa khóa học này"
                      onClick={(e) => handleDelete(course, e)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.85)',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        color: '#ffffff',
                        borderRadius: '8px',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        transition: 'all 0.2s'
                      }}
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="course-card-body">
                <div className="course-teacher">
                  <i className="fa-solid fa-chalkboard-user"></i>
                  <span>{course.teacher}</span>
                </div>

                <h3 className="course-title">{course.title}</h3>
                <p className="course-desc">{course.description}</p>

                {/* Progress or Admin Stats */}
                <div className="course-progress-wrap">
                  <div className="progress-info-row">
                    <span className="progress-text">
                      {isTeacherOrAdmin ? 'Quy mô học viên lớp:' : user ? 'Tiến độ bài tập:' : 'Nội dung khóa học:'}
                    </span>
                    <span className="progress-num">
                      {isTeacherOrAdmin ? (
                        <strong>{courseStudentsCount} Học Viên</strong>
                      ) : user ? (
                        <>
                          <strong>{completedL}</strong> / {totalL} bài ({percent}%)
                        </>
                      ) : (
                        <strong>{totalL} bài học</strong>
                      )}
                    </span>
                  </div>
                  {user && <div className="course-progress-bar">
                    <div 
                      className="course-progress-fill" 
                      style={{
                        width: isTeacherOrAdmin 
                          ? `${courseStudentsCount > 0 ? '100%' : '0%'}` 
                          : `${percent}%`,
                        background: isTeacherOrAdmin ? 'linear-gradient(90deg, #1e293b 0%, #A11D24 100%)' : undefined
                      }}
                    ></div>
                  </div>}
                </div>

                {/* Footer Action */}
                <div className="course-card-footer">
                  <span className="footer-meta">
                    <i className="fa-regular fa-folder-open"></i> {course.lessons?.length || totalL} bài tập {isTeacherOrAdmin ? 'thiết lập' : 'có sẵn'}
                  </span>
                  <button
                    type="button"
                    className="btn-enter-course"
                    style={{
                      background: isTeacherOrAdmin ? '#0f172a' : !isEnrolled && user ? '#64748b' : undefined
                    }}
                  >
                    <span>{isTeacherOrAdmin ? 'Quản Trị Bài Học' : isEnrolled ? 'Vào Lớp Học' : 'Khóa Ngoài Lớp'}</span>
                    <i className={isTeacherOrAdmin ? "fa-solid fa-pen-to-square" : isEnrolled ? "fa-solid fa-chevron-right" : "fa-solid fa-lock"}></i>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* MODAL THÊM / SỬA KHÓA HỌC (Dành cho Cô Hoài & Admin) */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="modal-backdrop" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '580px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
            overflow: 'hidden',
            animation: 'modalSlideUp 0.3s ease-out'
          }}>
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #7f1d1d 0%, #A11D24 100%)',
              padding: '1.25rem 1.5rem',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <i className={editingCourseId ? "fa-solid fa-pen-to-square" : "fa-solid fa-plus-circle"} style={{ fontSize: '1.25rem' }}></i>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>
                    {editingCourseId ? 'Chỉnh Sửa Khóa Học' : 'Thêm Khóa Học Mới'}
                  </h3>
                  <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                    {user?.role === 'admin' ? 'Quyền Quản Trị Hệ Thống (Admin)' : 'Quyền Giảng Viên Phụ Trách (Cô Hoài)'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: '#ffffff',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitForm} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '80vh', overflowY: 'auto' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Tên Khóa Học (Tiếng Việt) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: HSK 3 Toàn Diện: Giao Tiếp & Công Sở"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Tên Tiếng Trung (Phụ đề)
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 职场与交流"
                    value={formChineseTitle}
                    onChange={(e) => setFormChineseTitle(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Trình Độ (Cấp độ HSK)
                  </label>
                  <select
                    value={formLevel}
                    onChange={(e) => setFormLevel(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="HSK 1">HSK 1 (Căn Bản)</option>
                    <option value="HSK 2">HSK 2 (Sơ Cấp)</option>
                    <option value="HSK 3">HSK 3 (Trung Cấp)</option>
                    <option value="HSK 4">HSK 4 (Nâng Cao)</option>
                    <option value="HSK 5">HSK 5 (Chuyên Sâu)</option>
                    <option value="Giao tiếp">Khẩu Ngữ Giao Tiếp</option>
                    <option value="HSKK">Luyện Thi HSKK</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Giáo Viên Phụ Trách
                  </label>
                  <input
                    type="text"
                    required
                    value={formTeacher}
                    onChange={(e) => setFormTeacher(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Nhãn Khóa Học (Badge)
                  </label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="Đang mở, Khóa mới,..."
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Chữ Hán Chìm Trang Trí
                  </label>
                  <input
                    type="text"
                    maxLength="2"
                    value={formCharWatermark}
                    onChange={(e) => setFormCharWatermark(e.target.value)}
                    placeholder="学, 书, 语,..."
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Số Bài Học Dự Kiến
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formTotalLessons}
                    onChange={(e) => setFormTotalLessons(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Color Theme Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.45rem' }}>
                  Bảng Màu Nền Khóa Học
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {GRADIENT_PRESETS.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setFormCoverGradient(p.value)}
                      style={{
                        padding: '0.45rem 0.75rem',
                        borderRadius: '8px',
                        background: p.value,
                        color: '#ffffff',
                        border: formCoverGradient === p.value ? '2.5px solid #0f172a' : '1px solid transparent',
                        cursor: 'pointer',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        transform: formCoverGradient === p.value ? 'scale(1.05)' : 'none',
                        transition: 'all 0.15s'
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Mô Tả Mục Tiêu Khóa Học
                </label>
                <textarea
                  rows="3"
                  placeholder="Nắm vững 300 từ vựng và các mẫu câu giao tiếp..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.88rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: '10px',
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    color: '#475569',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.65rem 1.5rem',
                    borderRadius: '10px',
                    background: '#A11D24',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 4px 12px rgba(161, 29, 36, 0.3)'
                  }}
                >
                  <i className="fa-solid fa-check"></i>
                  <span>{editingCourseId ? 'Cập Nhật Khóa Học' : 'Tạo Khóa Học Mới'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
