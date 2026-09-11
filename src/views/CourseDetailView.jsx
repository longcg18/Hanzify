import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { isStudentInClassroom } from '../utils/classEnrollment';
import { fetchStudentSubmissions, getLocalDraft } from '../services/supabaseService';

export const CourseDetailView = ({ 
  course, 
  classrooms = [],
  onOpenLesson, 
  onOpenHomeworkEditor,
  onBack, 
  onAddLesson, 
  onDeleteLesson, 
  onEditCourse, 
  onDeleteCourse,
  onOpenClassLessonManager,
  onUpdateLesson
}) => {
  const { user, setIsAuthModalOpen } = useAuth();
  const isTeacherOrAdmin = user?.role === 'admin' || user?.role === 'teacher';

  // Check if student belongs to a class that is assigned this course
  const studentClass = classrooms.find(
    (c) => isStudentInClassroom(c, user) && (c.courseIds || c.course_ids || []).includes(course?.id)
  );
  const isCourseEnrolled = isTeacherOrAdmin ? true : Boolean(studentClass);

  const [studentSubmissions, setStudentSubmissions] = useState([]);

  useEffect(() => {
    if (user?.id) {
      fetchStudentSubmissions(user.id).then(({ data }) => {
        setStudentSubmissions(data || []);
      });
    } else {
      setStudentSubmissions([]);
    }
  }, [user?.id, course?.id]);

  // Modal State for Adding Lesson
  const [isAddLessonModalOpen, setIsAddLessonModalOpen] = useState(false);
  const [newLessonNumber, setNewLessonNumber] = useState('');
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonDeadline, setNewLessonDeadline] = useState('23:59 Chủ Nhật');
  const [newLessonQuestionsCount, setNewLessonQuestionsCount] = useState(5);
  const [newLessonStatus, setNewLessonStatus] = useState('active');

  // Modal State for Editing Lesson
  const [isEditLessonModalOpen, setIsEditLessonModalOpen] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [editLessonNumber, setEditLessonNumber] = useState('');
  const [editLessonTitle, setEditLessonTitle] = useState('');
  const [editLessonChineseTitle, setEditLessonChineseTitle] = useState('');
  const [editLessonDeadline, setEditLessonDeadline] = useState('23:59 Chủ Nhật');
  const [editLessonQuestionsCount, setEditLessonQuestionsCount] = useState(5);
  const [editLessonStatus, setEditLessonStatus] = useState('active');

  // Modal State for Editing Course
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [editCourseTitle, setEditCourseTitle] = useState('');
  const [editCourseChineseTitle, setEditCourseChineseTitle] = useState('');
  const [editCourseLevel, setEditCourseLevel] = useState('');
  const [editCourseTeacher, setEditCourseTeacher] = useState('');
  const [editCourseBadge, setEditCourseBadge] = useState('');
  const [editCourseDesc, setEditCourseDesc] = useState('');

  if (!course) return null;

  const visibleLessons = isTeacherOrAdmin
    ? (course.lessons || [])
    : (course.lessons || []).filter((lesson) => (studentClass?.unlockedLessons || []).includes(lesson.id));
  const submittedLessonIds = new Set(
    studentSubmissions
      .filter((submission) => ['submitted', 'graded'].includes(submission.submissionState) || submission.status === 'graded')
      .map((submission) => String(submission.lessonId))
  );
  const completedLessonsCount = (course.lessons || []).filter((lesson) => submittedLessonIds.has(String(lesson.id))).length;

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

  const handleOpenEditLesson = (lesson) => {
    setEditingLessonId(lesson.id);
    setEditLessonNumber(lesson.number || '01');
    setEditLessonTitle(lesson.title || '');
    setEditLessonChineseTitle(lesson.chineseTitle || '');
    setEditLessonDeadline(lesson.deadline || '23:59 Chủ Nhật');
    setEditLessonQuestionsCount(lesson.questionsCount || 5);
    setEditLessonStatus(lesson.status || 'active');
    setIsEditLessonModalOpen(true);
  };

  const handleSaveEditLesson = (e) => {
    e.preventDefault();
    if (!editLessonTitle.trim()) {
      alert('Vui lòng nhập tên bài học!');
      return;
    }

    const updated = {
      id: editingLessonId,
      number: editLessonNumber.padStart(2, '0'),
      title: editLessonTitle.trim(),
      chineseTitle: editLessonChineseTitle.trim(),
      deadline: editLessonDeadline.trim() || 'Chưa có hạn',
      status: editLessonStatus,
      questionsCount: parseInt(editLessonQuestionsCount, 10) || 5,
      type: editLessonStatus === 'completed' ? 'Đã chấm điểm' : editLessonStatus === 'active' ? 'Cần nộp bài' : 'Chưa mở'
    };

    if (onUpdateLesson) {
      onUpdateLesson(course.id, updated);
    }
    setIsEditLessonModalOpen(false);
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

        {/* Hero Stats Row */}
        {(() => {
          const courseEnrolledStudents = (classrooms || [])
            .filter((cls) => (cls.course_ids || cls.courseIds || []).includes(course?.id))
            .reduce((acc, cls) => acc + (cls.students?.length || 0), 0);

          return (
            <div className="hero-stats-row">
              <div className="hero-stat-item">
                <span className="val">{course.lessons?.length || course.totalLessons || 0}</span>
                <span className="lbl">{isTeacherOrAdmin ? 'Bài Đã Thiết Lập' : 'Tổng bài học'}</span>
              </div>
              <div className="hero-stat-item">
                <span className="val">{isTeacherOrAdmin ? courseEnrolledStudents : completedLessonsCount}</span>
                <span className="lbl">{isTeacherOrAdmin ? 'Học Viên Ghi Danh' : 'Đã hoàn thành'}</span>
              </div>
              <div className="hero-stat-item">
                <span className="val">
                  {isTeacherOrAdmin 
                    ? (courseEnrolledStudents > 0 ? '100%' : '0%') 
                    : `${Math.round((completedLessonsCount / (course.lessons?.length || course.totalLessons || 1)) * 100)}%`}
                </span>
                <span className="lbl">{isTeacherOrAdmin ? 'Tỷ Lệ Kích Hoạt' : 'Tiến độ'}</span>
              </div>
            </div>
          );
        })()}

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
        <div className="roadmap-title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 className="roadmap-title">
              <i className="fa-solid fa-list-check"></i> Lộ Trình & Danh Sách Bài Tập ({visibleLessons.length} Bài)
            </h2>
            <span className="roadmap-sub">
              {isTeacherOrAdmin
                ? 'Soạn câu hỏi & kiểm tra đề bài chuẩn. Trạng thái mở bài được quản lý riêng theo từng Lớp học.'
                : 'Hoàn thành từng bài theo lịch mở của lớp để làm bài và ghi nhận điểm số'}
            </span>
          </div>

          {isTeacherOrAdmin && onOpenClassLessonManager && (
            <button
              type="button"
              onClick={() => {
                const matchingClass = classrooms.find((cls) => (cls.courseIds || []).includes(course.id)) || classrooms[0];
                if (matchingClass) {
                  onOpenClassLessonManager(matchingClass);
                } else {
                  alert('Chưa có lớp học nào liên kết với khóa học này. Hãy vào Trang Chủ -> Tạo Lớp Mới!');
                }
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 1rem',
                borderRadius: '10px',
                background: '#f8fafc',
                border: '1.5px solid #cbd5e1',
                color: '#334155',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.04)'
              }}
            >
              <i className="fa-solid fa-chalkboard-user" style={{ color: '#b91c1c' }}></i>
              <span>Quản Lý Mở Bài Cho Lớp</span>
            </button>
          )}
        </div>

        {!isTeacherOrAdmin && user && !isCourseEnrolled && (
          <div style={{
            background: '#fff7ed',
            border: '1.5px solid #fed7aa',
            borderRadius: '16px',
            padding: '1.25rem 1.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            color: '#9a3412'
          }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '1.5rem', color: '#ea580c', flexShrink: 0 }}></i>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.2rem' }}>
                Khóa học này thuộc lớp khác và chưa được mở cho lớp của bạn
              </div>
              <div style={{ fontSize: '0.82rem', color: '#7c2d12' }}>
                Bạn chỉ có thể xem và làm bài tập của các khóa học được phân bổ cho lớp mình tham gia. Vui lòng liên hệ Cô Hoài hoặc nhập mã lớp để mở khóa.
              </div>
            </div>
          </div>
        )}

        <div className="lesson-list">
          {visibleLessons.map((lesson, index) => {
            const isLessonOpenForClass = studentClass
              ? (studentClass.unlockedLessons || []).includes(lesson.id)
              : false;

            const sub = studentSubmissions.find(
              (s) => String(s.lessonId) === String(lesson.id)
            );
            const localDraft = user ? getLocalDraft(user.id, lesson.id) : null;

            const isGraded = sub?.status === 'graded' || lesson.status === 'completed';
            const isRedoRequested = sub?.submissionState === 'redo_requested';
            const isSubmitted = sub?.status === 'pending' && sub?.submissionState === 'submitted';
            const isDraft = !isSubmitted && !isGraded && !isRedoRequested && (sub?.submissionState === 'draft' || !!localDraft);

            const isCompleted = isGraded;
            const isActive = isTeacherOrAdmin ? true : isLessonOpenForClass;
            const isLocked = !isTeacherOrAdmin && !isLessonOpenForClass;
            const lessonNumInt = parseInt(lesson.number, 10) || (index + 1);

            return (
              <div 
                key={lesson.id || index}
                className={`lesson-card ${isCompleted ? 'completed' : isActive ? 'active' : 'locked'}`}
              >
                <div className="lesson-left">
                  <div className={`lesson-num-badge ${isCompleted ? 'completed' : isActive ? 'active' : 'locked'}`}>
                    {isCompleted ? (
                      <i className="fa-solid fa-check"></i>
                    ) : isLocked ? (
                      <i className="fa-solid fa-lock"></i>
                    ) : (
                      lesson.number
                    )}
                  </div>

                  <div className="lesson-info">
                    <div className="lesson-meta-row" style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span className="lesson-tag">Bài {lesson.number}</span>
                      <span className={`deadline-tag ${lesson.status}`}>
                        <i className="fa-regular fa-clock"></i> {lesson.deadline}
                      </span>
                      {!isTeacherOrAdmin && (
                        <>
                          {isRedoRequested && (
                            <span style={{ background: '#fef3c7', color: '#b45309', fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <i className="fa-solid fa-rotate-left"></i> Yêu cầu làm lại
                            </span>
                          )}
                          {isSubmitted && (
                            <span style={{ background: '#ffedd5', color: '#c2410c', fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <i className="fa-regular fa-clock"></i> Chờ cô chấm
                            </span>
                          )}
                          {isDraft && (
                            <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <i className="fa-regular fa-floppy-disk"></i> Đang lưu nháp
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    <h3 className="lesson-title">{lesson.title}</h3>
                    <div className="lesson-sub-meta">
                      <span><i className="fa-solid fa-circle-question"></i> {lesson.questionsCount || 5} phần câu hỏi</span>
                      <span>•</span>
                      <span>
                        {!isTeacherOrAdmin && isRedoRequested
                          ? (sub?.redoNote ? `Cô nhắn: "${sub.redoNote}"` : 'Cô giáo yêu cầu sửa & làm lại bài')
                          : !isTeacherOrAdmin && isGraded
                            ? (sub?.totalScore !== undefined && sub?.totalScore !== null ? `Đã có điểm: ${sub.totalScore}đ` : 'Đã chấm điểm')
                            : !isTeacherOrAdmin && isSubmitted
                              ? 'Đã nộp bài cho cô'
                              : !isTeacherOrAdmin && isDraft
                                ? 'Đang lưu bản nháp dở dang'
                                : (lesson.type || (isActive ? 'Cần nộp bài' : isCompleted ? 'Đã chấm điểm' : 'Chưa mở'))}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="lesson-right">
                  {isTeacherOrAdmin ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: lesson.submissionCount > 0 ? '#16a34a' : '#64748b',
                        background: lesson.submissionCount > 0 ? '#f0fdf4' : '#f8fafc',
                        padding: '4px 8px',
                        borderRadius: '8px'
                      }}>
                        {lesson.submissionCount ? `✓ ${lesson.submissionCount} đã nộp` : 'Chưa có bài nộp'}
                      </span>

                      {/* Nút Sửa Chi Tiết Bài Học */}
                      <button
                        type="button"
                        title="Chỉnh sửa chi tiết bài học"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditLesson(lesson);
                        }}
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          color: '#334155',
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
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      
                      {/* Nút Soạn & Live Preview bài tập cho Giáo viên và Admin */}
                      <button
                        type="button"
                        className="btn-do-homework-main"
                        style={{ background: '#b91c1c', padding: '0.55rem 0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                        onClick={() => onOpenHomeworkEditor ? onOpenHomeworkEditor(lesson) : onOpenLesson(lesson)}
                        title="Soạn đề bài tập và xem trước theo góc nhìn học sinh"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                        <span>Soạn & Live Preview</span>
                      </button>

                      {/* Đổi nút "Kiểm Tra Đề" thành "Bài tập Bài 1" theo yêu cầu người dùng */}
                      <button
                        type="button"
                        className="btn-do-homework-main"
                        style={{ background: '#0f172a', padding: '0.55rem 0.95rem' }}
                        onClick={() => onOpenLesson(lesson)}
                        title="Xem giao diện làm bài chuẩn của học sinh"
                      >
                        <span>Giao diện làm bài</span>
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
                      {isGraded ? (
                        <div className="completed-score-box">
                          <span className="score-val">{(sub?.totalScore !== undefined && sub?.totalScore !== null ? sub.totalScore : (lesson.score || 9.5)).toFixed(1)}</span>
                          <span className="score-max">/ 10 đ</span>
                          <button 
                            type="button" 
                            className="btn-review-mini"
                            onClick={() => {
                              if (!user) {
                                setIsAuthModalOpen(true);
                                return;
                              }
                              onOpenLesson(lesson);
                            }}
                          >
                            <i className="fa-regular fa-eye"></i> Xem Lại Điểm
                          </button>
                        </div>
                      ) : isRedoRequested ? (
                        <button 
                          type="button" 
                          className="btn-do-homework-main"
                          style={{ background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)', boxShadow: '0 4px 12px rgba(217, 119, 6, 0.25)' }}
                          onClick={() => {
                            if (!user) {
                              setIsAuthModalOpen(true);
                              return;
                            }
                            onOpenLesson(lesson);
                          }}
                        >
                          <i className="fa-solid fa-rotate-left"></i>
                          <span>Sửa &amp; Nộp Lại Bài</span>
                          <i className="fa-solid fa-arrow-right"></i>
                        </button>
                      ) : isSubmitted ? (
                        <button 
                          type="button" 
                          className="btn-do-homework-main"
                          style={{ background: '#f8fafc', color: '#334155', border: '1.5px solid #cbd5e1', boxShadow: 'none' }}
                          onClick={() => {
                            if (!user) {
                              setIsAuthModalOpen(true);
                              return;
                            }
                            onOpenLesson(lesson);
                          }}
                        >
                          <i className="fa-regular fa-eye"></i>
                          <span>Xem Bài Đã Nộp</span>
                        </button>
                      ) : isDraft ? (
                        <button 
                          type="button" 
                          className="btn-do-homework-main"
                          style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)' }}
                          onClick={() => {
                            if (!user) {
                              setIsAuthModalOpen(true);
                              return;
                            }
                            onOpenLesson(lesson);
                          }}
                        >
                          <i className="fa-regular fa-pen-to-square"></i>
                          <span>Làm Tiếp (Bản Nháp)</span>
                          <i className="fa-solid fa-arrow-right"></i>
                        </button>
                      ) : isActive ? (
                        <button 
                          type="button" 
                          className="btn-do-homework-main"
                          onClick={() => {
                            if (!user) {
                              setIsAuthModalOpen(true);
                              return;
                            }
                            onOpenLesson(lesson);
                          }}
                        >
                          {!user && <i className="fa-solid fa-lock" style={{ marginRight: '4px', fontSize: '0.8rem' }}></i>}
                          <span>{user ? 'Làm Bài Ngay' : 'Đăng Nhập Để Làm Bài'}</span>
                          <i className="fa-solid fa-arrow-right"></i>
                        </button>
                      ) : (
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
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Số Thứ Tự Bài (Ví dụ: 05)
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
      {/* MODAL SỬA BÀI HỌC (Dành cho Cô Hoài & Admin) */}
      {/* ========================================================================= */}
      {isEditLessonModalOpen && (
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
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              padding: '1.25rem 1.5rem',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <i className="fa-solid fa-pen-to-square" style={{ fontSize: '1.25rem', color: '#60a5fa' }}></i>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Chỉnh Sửa Bài Học</h3>
                  <span style={{ fontSize: '0.75rem', opacity: 0.85 }}>Khóa học: {course.title}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditLessonModalOpen(false)}
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
            <form onSubmit={handleSaveEditLesson} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                  Số Thứ Tự Bài (Ví dụ: 01)
                </label>
                <input
                  type="text"
                  required
                  value={editLessonNumber}
                  onChange={(e) => setEditLessonNumber(e.target.value)}
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
                  Tiêu Đề Tiếng Việt *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Ăn uống tại nhà hàng"
                  value={editLessonTitle}
                  onChange={(e) => setEditLessonTitle(e.target.value)}
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
                  Tiêu Đề Tiếng Trung (Chữ Hán)
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: 在饭馆吃饭"
                  value={editLessonChineseTitle}
                  onChange={(e) => setEditLessonChineseTitle(e.target.value)}
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
                    value={editLessonDeadline}
                    onChange={(e) => setEditLessonDeadline(e.target.value)}
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
                    value={editLessonQuestionsCount}
                    onChange={(e) => setEditLessonQuestionsCount(e.target.value)}
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
                  onClick={() => setIsEditLessonModalOpen(false)}
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
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.25)'
                  }}
                >
                  <i className="fa-solid fa-check"></i> Lưu Cập Nhật
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
