import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { isCourseAssignedToStudent } from '../utils/classEnrollment';
import { fetchStudentSubmissions } from '../services/supabaseService';

const getLevelBadgeTheme = (level = '') => {
  const l = String(level).toLowerCase();
  if (l.includes('1')) return { bg: '#eff6ff', color: '#1d4ed8', border: '#dbeafe' };
  if (l.includes('2')) return { bg: '#fef2f2', color: '#b91c1c', border: '#fee2e2' };
  if (l.includes('3')) return { bg: '#ecfdf5', color: '#047857', border: '#d1fae5' };
  if (l.includes('4')) return { bg: '#faf5ff', color: '#6d28d9', border: '#ede9fe' };
  if (l.includes('5')) return { bg: '#fffbeb', color: '#b45309', border: '#fef3c7' };
  return { bg: '#f1f5f9', color: '#334155', border: '#e2e8f0' };
};

const getCourseTone = (course) => {
  if (course?.level?.includes('1')) return '#243b53';
  if (course?.level?.includes('2')) return '#334155';
  if (course?.level?.includes('3')) return '#1b4d44';
  if (course?.level?.includes('4')) return '#4c1d24';
  if (course?.level?.includes('5')) return '#3f2c52';
  return '#1e293b';
};

const GRADIENT_PRESETS = [
  { label: 'Ngọc Bích Tối', value: '#1b4d44', color: '#1b4d44' },
  { label: 'Xanh Chàm Trầm', value: '#243b53', color: '#243b53' },
  { label: 'Mực Đen Trầm', value: '#1e293b', color: '#1e293b' },
  { label: 'Đỏ Mận Cổ Điển', value: '#4c1d24', color: '#4c1d24' },
  { label: 'Tím Trầm', value: '#3f2c52', color: '#3f2c52' }
];

export const CoursesView = ({ 
  courses = [], 
  classrooms = [],
  isLoading = false,
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
  const [submittedLessonIds, setSubmittedLessonIds] = useState(new Set());
  const [areSubmissionsLoading, setAreSubmissionsLoading] = useState(user?.role === 'student');

  useEffect(() => {
    if (user?.role !== 'student' || !user?.id) {
      setSubmittedLessonIds(new Set());
      setAreSubmissionsLoading(false);
      return;
    }
    setAreSubmissionsLoading(true);
    fetchStudentSubmissions(user.id)
      .then(({ data }) => {
        setSubmittedLessonIds(new Set(
          (data || [])
            .filter((submission) => ['submitted', 'graded'].includes(submission.submissionState) || submission.status === 'graded')
            .map((submission) => String(submission.lessonId))
        ));
      })
      .finally(() => setAreSubmissionsLoading(false));
  }, [user?.id, user?.role]);

  // Modal State for Create / Edit Course
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null); // null means creating new
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'hsk3' | 'other'
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
  return (
    <div className="courses-view-container">
      {/* Motivational / Admin Banner */}
      {isTeacherOrAdmin && <section className="welcome-banner" style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: 'none'
      }}>
        <div className="banner-content">
          <div className="banner-tag" style={{
            background: 'var(--accent-light)',
            color: 'var(--accent)',
            border: 'none'
          }}>
            <i className={isTeacherOrAdmin ? "fa-solid fa-chalkboard-user" : "fa-solid fa-book-open"}></i>
            <span>
              {user?.role === 'admin' 
                ? 'Trung Tâm Quản Trị Đào Tạo & Khóa Học (Admin)' 
                : user?.role === 'teacher'
                ? 'Không Gian Quản Lý Khóa Học'
                : 'Không Gian Học Tập Hoa Ngữ'}
            </span>
          </div>
          <h1 className="banner-greeting" style={{ color: 'var(--text)' }}>
            {user?.role === 'admin'
              ? 'Bảng Điều Hành Khóa Học Hanzify'
              : user?.role === 'teacher'
              ? 'Quản Lý & Cập Nhật Khóa Học'
              : user ? `Chào mừng trở lại, ${user.name}` : 'Khóa Học Hanzify'}
          </h1>
          <p className="banner-proverb" style={{ color: 'var(--muted)' }}>
            {isTeacherOrAdmin
              ? 'Toàn quyền thêm, chỉnh sửa hoặc xóa khóa học; cấu hình lộ trình các bài giảng và bài tập về nhà cho học sinh.'
              : '"千里之行，始于足下" — Hành trình vạn dặm bắt đầu từ những bước chân đầu tiên.'}
          </p>

          {/* Action buttons for Teacher & Admin */}
          {isTeacherOrAdmin && (
            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={handleOpenCreate}
              >
                <i className="fa-solid fa-plus"></i>
                <span>Thêm Khóa Học Mới</span>
              </button>
            </div>
          )}
        </div>

        {isTeacherOrAdmin && <div className="banner-stats">
          {user?.role === 'admin' ? (
            <>
              <div className="stat-card">
                <span className="stat-num">
                  {isLoading ? '…' : (courses.length < 10 ? `0${courses.length}` : courses.length)}
                </span>
                <span className="stat-label">Khóa Hệ Thống</span>
              </div>
              <div className="stat-card">
                <span className="stat-num">
                  {isLoading ? '…' : (totalStudents < 10 ? `0${totalStudents}` : totalStudents)}
                </span>
                <span className="stat-label">Tổng Học Viên</span>
              </div>
              <div className="stat-card highlight">
                <span className="stat-num">
                  {isLoading ? '…' : (totalLessons < 10 ? `0${totalLessons}` : totalLessons)}
                </span>
                <span className="stat-label">Bài Tập Thiết Lập</span>
              </div>
            </>
          ) : user?.role === 'teacher' ? (
            <>
              <div className="stat-card">
                <span className="stat-num">
                  {isLoading ? '…' : (courses.length < 10 ? `0${courses.length}` : courses.length)}
                </span>
                <span className="stat-label">Khóa Đang Dạy</span>
              </div>
              <div className="stat-card">
                <span className="stat-num">
                  {isLoading ? '…' : (totalStudents < 10 ? `0${totalStudents}` : totalStudents)}
                </span>
                <span className="stat-label">Tổng Học Viên</span>
              </div>
              <div className="stat-card highlight">
                <span className="stat-num">
                  {isLoading ? '…' : (totalLessons < 10 ? `0${totalLessons}` : totalLessons)}
                </span>
                <span className="stat-label">Bài Đang Phụ Trách</span>
              </div>
            </>
          ) : null}
        </div>}
      </section>}

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
            {isLoading || areSubmissionsLoading ? 'Đang tải danh sách khóa học…' : <>Tổng cộng: <strong>{courses.length}</strong> khóa học</>}
          </span>

          {isTeacherOrAdmin ? (
            <>
              <button
                type="button"
                className="btn-secondary"
                onClick={onOpenCreateClass}
              >
                <i className="fa-solid fa-chalkboard-user" style={{ marginRight: '6px' }} />
                <span>Mở Lớp Học Mới</span>
              </button>

              <button
                type="button"
                className="btn-primary"
                onClick={handleOpenCreate}
              >
                <i className="fa-solid fa-plus" style={{ marginRight: '6px' }} />
                <span>Tạo Khóa Học</span>
              </button>
            </>
          ) : !user ? (
            <button
              type="button"
              className="btn-secondary"
              onClick={onOpenJoinClass}
            >
              <i className="fa-solid fa-ticket" style={{ marginRight: '6px' }} />
              <span>Tham Gia Lớp Bằng Mã</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Category Tabs: All vs HSK 3.0 Mới vs Khóa Hiện Tại */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '22px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setCategoryFilter('all')}
          style={{
            background: categoryFilter === 'all' ? '#b91c1c' : '#ffffff',
            color: categoryFilter === 'all' ? '#ffffff' : '#475569',
            border: categoryFilter === 'all' ? '1px solid #b91c1c' : '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '7px 14px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          Tất Cả Khóa Học ({courses.length})
        </button>
        <button
          type="button"
          onClick={() => setCategoryFilter('hsk3')}
          style={{
            background: categoryFilter === 'hsk3' ? '#b91c1c' : '#ffffff',
            color: categoryFilter === 'hsk3' ? '#ffffff' : '#475569',
            border: categoryFilter === 'hsk3' ? '1px solid #b91c1c' : '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '7px 14px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease'
          }}
        >
          <span style={{
            background: categoryFilter === 'hsk3' ? 'rgba(255,255,255,0.25)' : 'var(--border)',
            color: categoryFilter === 'hsk3' ? '#ffffff' : '#b91c1c',
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '4px',
            fontWeight: 800
          }}>
            MỚI
          </span>
          <span>Giáo Trình HSK 3.0 (Kèm PPT)</span>
        </button>
        <button
          type="button"
          onClick={() => setCategoryFilter('other')}
          style={{
            background: categoryFilter === 'other' ? '#b91c1c' : '#ffffff',
            color: categoryFilter === 'other' ? '#ffffff' : '#475569',
            border: categoryFilter === 'other' ? '1px solid #b91c1c' : '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '7px 14px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          Khóa Học Khác / Chuyên Đề
        </button>
      </div>

      {/* Courses Grid */}
      <div className="courses-grid">
        {(isLoading || areSubmissionsLoading) && (
          <div style={{ gridColumn: '1 / -1', padding: '3rem 1rem', textAlign: 'center', color: '#64748b' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '0.5rem', color: '#A11D24' }}></i>
            Đang tải khóa học…
          </div>
        )}
        {!isLoading && !areSubmissionsLoading && courses
          .filter((c) => {
            const isHsk3 = c.id?.startsWith('course-hsk3') || c.badge?.includes('HSK 3.0') || c.title?.includes('HSK 3.0');
            if (categoryFilter === 'hsk3') return isHsk3;
            if (categoryFilter === 'other') return !isHsk3;
            return true;
          })
          .map((course) => {
          const totalL = course.lessons?.length || course.totalLessons || 1;
          const completedL = user?.role === 'student'
            ? (course.lessons || []).filter((lesson) => submittedLessonIds.has(String(lesson.id))).length
            : (course.completedLessons || 0);
          const percent = Math.min(100, Math.round((completedL / totalL) * 100));
          const isEnrolled = isTeacherOrAdmin ? true : isCourseAssignedToStudent(course.id, classrooms, user);
          const courseStudentsCount = (classrooms || [])
            .filter((cls) => (cls.course_ids || cls.courseIds || []).includes(course.id))
            .reduce((acc, cls) => acc + (cls.students?.length || 0), 0);

          const levelTheme = getLevelBadgeTheme(course.level);

          return (
            <article 
              key={course.id} 
              className="course-card"
              onClick={() => onSelectCourse(course)}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'all 0.16s ease',
                opacity: !user || isTeacherOrAdmin || isEnrolled ? 1 : 0.88
              }}
            >
              {/* Refined Card Top Header */}
              <div 
                className="course-card-top-bar"
                style={{
                  padding: '12px 16px',
                  background: '#f8fafc',
                  borderBottom: '1px solid #f1f5f9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: levelTheme.bg,
                    color: levelTheme.color,
                    border: `1px solid ${levelTheme.border}`,
                    letterSpacing: '0.03em'
                  }}>
                    {course.level || 'HSK'}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: isEnrolled ? '#f0fdf4' : '#f8fafc',
                    color: isEnrolled ? '#15803d' : '#64748b',
                    border: isEnrolled ? '1px solid #bbf7d0' : '1px solid #e2e8f0'
                  }}>
                    {!user ? 'Xem trước' : isEnrolled ? (isTeacherOrAdmin ? course.badge : 'Lớp của bạn') : 'Chưa mở'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {course.chineseTitle && (
                    <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600, fontFamily: 'var(--font-hanzi)' }}>
                      {course.chineseTitle}
                    </span>
                  )}
                  {isTeacherOrAdmin && (
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        type="button"
                        title="Chỉnh sửa khóa học"
                        onClick={(e) => handleOpenEdit(course, e)}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          color: '#475569',
                          borderRadius: '6px',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button
                        type="button"
                        title="Xóa khóa học"
                        onClick={(e) => handleDelete(course, e)}
                        style={{
                          background: '#fef2f2',
                          border: '1px solid #fecaca',
                          color: '#b91c1c',
                          borderRadius: '6px',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#b91c1c', marginBottom: '8px' }}>
                  <i className="fa-solid fa-chalkboard-user"></i>
                  <span>{course.teacher || 'Cô Hoài (Giảng viên)'}</span>
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px', lineHeight: 1.35 }}>
                  {course.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px', lineHeight: 1.5, minHeight: '38px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {course.description}
                </p>

                {/* Progress / Stats wrap */}
                <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px', color: '#475569', marginBottom: '12px' }}>
                    <span>
                      <i className="fa-regular fa-folder-open" style={{ marginRight: '6px', color: '#94a3b8' }}></i>
                      <strong>{course.lessons?.length || totalL}</strong> bài học
                    </span>
                    <span>
                      <i className="fa-solid fa-users" style={{ marginRight: '6px', color: '#94a3b8' }}></i>
                      <strong>{courseStudentsCount}</strong> học viên
                    </span>
                  </div>

                  <button
                    type="button"
                    className="btn-primary"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      height: '38px',
                      fontSize: '13.5px',
                      borderRadius: '8px'
                    }}
                  >
                    <span>{isTeacherOrAdmin ? 'Quản Trị Bài Học' : isEnrolled ? 'Vào Lớp Học' : 'Khóa Ngoài Lớp'}</span>
                    <i className={isTeacherOrAdmin ? "fa-solid fa-arrow-right" : isEnrolled ? "fa-solid fa-chevron-right" : "fa-solid fa-lock"} style={{ fontSize: '11px', marginLeft: '6px' }}></i>
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
            borderRadius: '14px',
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
                    background: '#b91c1c',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: 'none'
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
