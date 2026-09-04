import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const CourseDetailView = ({ 
  course, 
  onOpenLesson, 
  onBack, 
  onAddLesson, 
  onDeleteLesson, 
  onEditCourse, 
  onDeleteCourse 
}) => {
  const { user } = useAuth();
  const isTeacherOrAdmin = user?.role === 'admin' || user?.role === 'teacher';

  // Modal State for Adding Lesson
  const [isAddLessonModalOpen, setIsAddLessonModalOpen] = useState(false);
  const [newLessonNumber, setNewLessonNumber] = useState('');
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonDeadline, setNewLessonDeadline] = useState('23:59 Chủ Nhật');
  const [newLessonQuestionsCount, setNewLessonQuestionsCount] = useState(5);
  const [newLessonStatus, setNewLessonStatus] = useState('active');

  // Modal State for Editing Course
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [editCourseTitle, setEditCourseTitle] = useState('');
  const [editCourseChineseTitle, setEditCourseChineseTitle] = useState('');
  const [editCourseLevel, setEditCourseLevel] = useState('');
  const [editCourseTeacher, setEditCourseTeacher] = useState('');
  const [editCourseBadge, setEditCourseBadge] = useState('');
  const [editCourseDesc, setEditCourseDesc] = useState('');

  if (!course) return null;

  const handleOpenAddLesson = () => {
    const nextNum = String((course.lessons?.length || 0) + 1).padStart(2, '0');
    setNewLessonNumber(nextNum);
    setNewLessonTitle('');
    setNewLessonDeadline('23:59 Chủ Nhật');
    setNewLessonQuestionsCount(5);
    setNewLessonStatus('active');
    setIsAddLessonModalOpen(true);
  };

  const handleSaveNewLesson = (e) => {
    e.preventDefault();
    if (!newLessonTitle.trim()) {
      alert('Vui lòng nhập tên bài học!');
      return;
    }

    const newLesson = {
      id: `lesson-${Date.now()}`,
      number: newLessonNumber.padStart(2, '0'),
      title: newLessonTitle.trim(),
      deadline: newLessonDeadline.trim() || 'Chưa có hạn',
      status: newLessonStatus,
      score: null,
      questionsCount: parseInt(newLessonQuestionsCount, 10) || 5,
      type: newLessonStatus === 'completed' ? 'Đã chấm điểm' : newLessonStatus === 'active' ? 'Cần nộp bài' : 'Chưa mở'
    };

    if (onAddLesson) {
      onAddLesson(course.id, newLesson);
    }
    setIsAddLessonModalOpen(false);
  };

  const handleOpenEditCourse = () => {
    setEditCourseTitle(course.title || '');
    setEditCourseChineseTitle(course.chineseTitle || '');
    setEditCourseLevel(course.level || 'HSK 2');
    setEditCourseTeacher(course.teacher || 'Cô Hoài');
    setEditCourseBadge(course.badge || 'Đang theo học');
    setEditCourseDesc(course.description || '');
    setIsEditCourseModalOpen(true);
  };

  const handleSaveEditCourse = (e) => {
    e.preventDefault();
    if (!editCourseTitle.trim()) {
      alert('Vui lòng nhập tiêu đề khóa học!');
      return;
    }

    const updated = {
      ...course,
      title: editCourseTitle.trim(),
      chineseTitle: editCourseChineseTitle.trim(),
      level: editCourseLevel,
      teacher: editCourseTeacher.trim(),
      badge: editCourseBadge.trim(),
      description: editCourseDesc.trim()
    };

    if (onEditCourse) {
      onEditCourse(updated);
    }
    setIsEditCourseModalOpen(false);
  };

  return (
    <div className="course-detail-container">
      {/* Back button & Course Header */}
      <div className="course-header-banner" style={{ background: course.coverGradient || 'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 100%)' }}>
        <button type="button" className="btn-back-pill" onClick={onBack}>
          <i className="fa-solid fa-arrow-left"></i>
          <span>Danh sách khóa học</span>
        </button>

        <div className="banner-top-meta">
          <span className="pill-badge">{course.level}</span>
          <span className="pill-badge accent">
            {isTeacherOrAdmin ? `👑 Quản Trị Khóa (${user?.role === 'admin' ? 'Admin' : 'Cô Hoài'})` : course.badge}
          </span>
          <span className="teacher-info">
            <i className="fa-solid fa-chalkboard-user"></i> {course.teacher}
          </span>
        </div>

        <h1 className="course-hero-title">{course.title}</h1>
        <div className="chinese-subtitle">{course.chineseTitle}</div>
        <p className="course-hero-desc">{course.description}</p>

        <div className="hero-stats-row">
          <div className="hero-stat-item">
            <span className="val">{course.lessons?.length || course.totalLessons}</span>
            <span className="lbl">{isTeacherOrAdmin ? 'Bài Đã Thiết Lập' : 'Tổng bài học'}</span>
          </div>
          <div className="hero-stat-item">
            <span className="val">{isTeacherOrAdmin ? '28' : course.completedLessons || 0}</span>
            <span className="lbl">{isTeacherOrAdmin ? 'Học Viên Ghi Danh' : 'Đã hoàn thành'}</span>
          </div>
          <div className="hero-stat-item">
            <span className="val">
              {isTeacherOrAdmin ? '96%' : `${Math.round(((course.completedLessons || 0) / (course.lessons?.length || course.totalLessons || 1)) * 100)}%`}
            </span>
            <span className="lbl">{isTeacherOrAdmin ? 'Tỷ Lệ Hoàn Thành' : 'Tiến độ'}</span>
          </div>
        </div>

        {/* Cô giáo & Admin Actions */}
        {isTeacherOrAdmin && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleOpenAddLesson}
              style={{
                padding: '0.6rem 1.15rem',
                borderRadius: '10px',
                background: '#ffffff',
                color: '#A11D24',
                fontWeight: 700,
                fontSize: '0.85rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                transition: 'all 0.2s ease'
              }}
            >
              <i className="fa-solid fa-plus-circle"></i> Thêm Bài Học Mới
            </button>

            <button
              type="button"
              onClick={handleOpenEditCourse}
              style={{
                padding: '0.6rem 1.15rem',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.2)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.85rem',
                border: '1px solid rgba(255,255,255,0.4)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <i className="fa-solid fa-pen-to-square"></i> Sửa Khóa Học
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Bạn có chắc muốn xóa khóa học "${course.title}" và toàn bộ bài tập liên quan không?`)) {
                  if (onDeleteCourse) onDeleteCourse(course.id);
                }
              }}
              style={{
                padding: '0.6rem 1.15rem',
                borderRadius: '10px',
                background: 'rgba(239, 68, 68, 0.35)',
                color: '#fecaca',
                fontWeight: 700,
                fontSize: '0.85rem',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <i className="fa-solid fa-trash-can"></i> Xóa Khóa Học
            </button>
          </div>
        )}
      </div>

      {/* Lesson Roadmap */}
      <div className="lesson-roadmap-section">
        <div className="roadmap-title-row">
          <h2 className="roadmap-title">
            <i className="fa-solid fa-list-check"></i> Lộ Trình & Danh Sách Bài Tập ({course.lessons?.length || 0} Bài)
          </h2>
          <span className="roadmap-sub">
            {isTeacherOrAdmin ? 'Cô giáo và Admin có thể thêm bài học mới hoặc kiểm tra đề bài' : 'Hoàn thành từng bài theo thứ tự để mở khóa các bài tiếp theo'}
          </span>
        </div>

        <div className="lesson-list">
          {(course.lessons || []).map((lesson, index) => {
            const isCompleted = lesson.status === 'completed';
            const isActive = lesson.status === 'active';
            const isLocked = lesson.status === 'locked';
            const lessonNumInt = parseInt(lesson.number, 10) || (index + 1);

            return (
              <div 
                key={lesson.id || index}
                className={`lesson-card ${lesson.status}`}
              >
                <div className="lesson-left">
                  <div className={`lesson-num-badge ${lesson.status}`}>
                    {isCompleted ? (
                      <i className="fa-solid fa-check"></i>
                    ) : isLocked ? (
                      <i className="fa-solid fa-lock"></i>
                    ) : (
                      lesson.number
                    )}
                  </div>

                  <div className="lesson-info">
                    <div className="lesson-meta-row">
                      <span className="lesson-tag">Bài {lesson.number}</span>
                      <span className={`deadline-tag ${lesson.status}`}>
                        <i className="fa-regular fa-clock"></i> {lesson.deadline}
                      </span>
                    </div>
                    <h3 className="lesson-title">{lesson.title}</h3>
                    <div className="lesson-sub-meta">
                      <span><i className="fa-solid fa-circle-question"></i> {lesson.questionsCount || 5} phần câu hỏi</span>
                      <span>•</span>
                      <span>{lesson.type || (isActive ? 'Cần nộp bài' : isCompleted ? 'Đã chấm điểm' : 'Chưa mở')}</span>
                    </div>
                  </div>
                </div>

                <div className="lesson-right">
                  {isTeacherOrAdmin ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: isCompleted ? '#16a34a' : '#A11D24',
                        background: isCompleted ? '#f0fdf4' : '#fef2f2',
                        padding: '4px 8px',
                        borderRadius: '8px'
                      }}>
                        {isCompleted ? '✓ 24/28 Đã Nộp' : '⏳ 18/28 Đã Nộp'}
                      </span>
                      
                      {/* Đổi nút "Kiểm Tra Đề" thành "Bài tập Bài 1" theo yêu cầu người dùng */}
                      <button
                        type="button"
                        className="btn-do-homework-main"
                        style={{ background: '#0f172a', padding: '0.55rem 0.95rem' }}
                        onClick={() => onOpenLesson(lesson)}
                      >
                        <span>Bài tập Bài {lessonNumInt}</span>
                        <i className="fa-solid fa-arrow-right"></i>
                      </button>

                      {/* Nút xóa bài học dành cho Cô giáo / Admin */}
                      <button
                        type="button"
                        title="Xóa bài học này"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Bạn có chắc muốn xóa bài học "${lesson.title}" không?`)) {
                            if (onDeleteLesson) onDeleteLesson(course.id, lesson.id);
                          }
                        }}
                        style={{
                          background: '#fef2f2',
                          border: '1px solid #fecaca',
                          color: '#dc2626',
                          borderRadius: '8px',
                          padding: '0.55rem 0.75rem',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s'
                        }}
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  ) : (
                    <>
                      {isCompleted && (
                        <div className="completed-score-box">
                          <span className="score-val">{lesson.score?.toFixed(1) || '9.5'}</span>
                          <span className="score-max">/ 10 đ</span>
                          <button 
                            type="button" 
                            className="btn-review-mini"
                            onClick={() => onOpenLesson(lesson)}
                          >
                            <i className="fa-regular fa-eye"></i> Xem lại
                          </button>
                        </div>
                      )}

                      {isActive && (
                        <button 
                          type="button" 
                          className="btn-do-homework-main"
                          onClick={() => onOpenLesson(lesson)}
                        >
                          <span>Làm Bài Ngay</span>
                          <i className="fa-solid fa-arrow-right"></i>
                        </button>
                      )}

                      {isLocked && (
                        <div className="locked-badge">
                          <i className="fa-solid fa-lock"></i>
                          <span>Chưa mở</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL THÊM BÀI HỌC MỚI (Dành cho Cô Hoài & Admin) */}
      {/* ========================================================================= */}
      {isAddLessonModalOpen && (
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
            maxWidth: '520px',
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
                <i className="fa-solid fa-file-circle-plus" style={{ fontSize: '1.25rem' }}></i>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Thêm Bài Học Mới</h3>
                  <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>Khóa học: {course.title}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddLessonModalOpen(false)}
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
            <form onSubmit={handleSaveNewLesson} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Số Bài (Ví dụ: 05)
                  </label>
                  <input
                    type="text"
                    required
                    value={newLessonNumber}
                    onChange={(e) => setNewLessonNumber(e.target.value)}
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
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Trạng Thái Mở Bài
                  </label>
                  <select
                    value={newLessonStatus}
                    onChange={(e) => setNewLessonStatus(e.target.value)}
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
                    <option value="active">🟢 Đang Mở (Cần Nộp Bài)</option>
                    <option value="locked">🔒 Khóa (Chưa Mở)</option>
                    <option value="completed">✓ Đã Hoàn Thành (Có Điểm)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Tiêu Đề Bài Học (Việt & Chữ Hán) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Ăn uống tại nhà hàng (在饭馆吃饭)"
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
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
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Hạn Nộp Bài (Deadline)
                  </label>
                  <input
                    type="text"
                    value={newLessonDeadline}
                    onChange={(e) => setNewLessonDeadline(e.target.value)}
                    placeholder="23:59 Chủ Nhật"
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
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Số Phần Câu Hỏi
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={newLessonQuestionsCount}
                    onChange={(e) => setNewLessonQuestionsCount(e.target.value)}
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

              <div style={{ display: 'flex', gap: '10px', marginTop: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsAddLessonModalOpen(false)}
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
                  <i className="fa-solid fa-check"></i> Lưu Bài Học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL SỬA KHÓA HỌC (Dành cho Cô Hoài & Admin) */}
      {/* ========================================================================= */}
      {isEditCourseModalOpen && (
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
            maxWidth: '560px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
            overflow: 'hidden',
            animation: 'modalSlideUp 0.3s ease-out'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              padding: '1.25rem 1.5rem',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <i className="fa-solid fa-pen-to-square" style={{ color: '#fca5a5' }}></i>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Chỉnh Sửa Thông Tin Khóa Học</h3>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Mã khóa: {course.id}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditCourseModalOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#ffffff',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditCourse} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Tên Khóa Học (Tiếng Việt) *
                </label>
                <input
                  type="text"
                  required
                  value={editCourseTitle}
                  onChange={(e) => setEditCourseTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Tên Tiếng Trung (Phụ đề)
                  </label>
                  <input
                    type="text"
                    value={editCourseChineseTitle}
                    onChange={(e) => setEditCourseChineseTitle(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Cấp Độ (HSK)
                  </label>
                  <select
                    value={editCourseLevel}
                    onChange={(e) => setEditCourseLevel(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="HSK 1">HSK 1</option>
                    <option value="HSK 2">HSK 2</option>
                    <option value="HSK 3">HSK 3</option>
                    <option value="HSK 4">HSK 4</option>
                    <option value="HSK 5">HSK 5</option>
                    <option value="Giao tiếp">Giao tiếp</option>
                    <option value="Khẩu Ngữ HSKK">Khẩu Ngữ HSKK</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Giáo Viên Phụ Trách
                  </label>
                  <input
                    type="text"
                    value={editCourseTeacher}
                    onChange={(e) => setEditCourseTeacher(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                    Nhãn Khóa Học (Badge)
                  </label>
                  <input
                    type="text"
                    value={editCourseBadge}
                    onChange={(e) => setEditCourseBadge(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Mô Tả Khóa Học
                </label>
                <textarea
                  rows="3"
                  value={editCourseDesc}
                  onChange={(e) => setEditCourseDesc(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.88rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsEditCourseModalOpen(false)}
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
                    background: '#0f172a',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cập Nhật Khóa Học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
