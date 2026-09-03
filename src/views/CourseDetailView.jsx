import React from 'react';

export const CourseDetailView = ({ course, onOpenLesson, onBack }) => {
  if (!course) return null;

  return (
    <div className="course-detail-container">
      {/* Back button & Course Header */}
      <div className="course-header-banner" style={{ background: course.coverGradient }}>
        <button type="button" className="btn-back-pill" onClick={onBack}>
          <i className="fa-solid fa-arrow-left"></i>
          <span>Danh sách khóa học</span>
        </button>

        <div className="banner-top-meta">
          <span className="pill-badge">{course.level}</span>
          <span className="pill-badge accent">{course.badge}</span>
          <span className="teacher-info">
            <i className="fa-solid fa-chalkboard-user"></i> {course.teacher}
          </span>
        </div>

        <h1 className="course-hero-title">{course.title}</h1>
        <div className="chinese-subtitle">{course.chineseTitle}</div>
        <p className="course-hero-desc">{course.description}</p>

        <div className="hero-stats-row">
          <div className="hero-stat-item">
            <span className="val">{course.totalLessons}</span>
            <span className="lbl">Tổng bài học</span>
          </div>
          <div className="hero-stat-item">
            <span className="val">{course.completedLessons}</span>
            <span className="lbl">Đã hoàn thành</span>
          </div>
          <div className="hero-stat-item">
            <span className="val">
              {Math.round((course.completedLessons / course.totalLessons) * 100)}%
            </span>
            <span className="lbl">Tiến độ</span>
          </div>
        </div>
      </div>

      {/* Lesson Roadmap */}
      <div className="lesson-roadmap-section">
        <div className="roadmap-title-row">
          <h2 className="roadmap-title">
            <i className="fa-solid fa-list-check"></i> Lộ Trình & Danh Sách Bài Tập
          </h2>
          <span className="roadmap-sub">
            Hoàn thành từng bài theo thứ tự để mở khóa các bài tiếp theo
          </span>
        </div>

        <div className="lesson-list">
          {course.lessons.map((lesson) => {
            const isCompleted = lesson.status === 'completed';
            const isActive = lesson.status === 'active';
            const isLocked = lesson.status === 'locked';

            return (
              <div 
                key={lesson.id}
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
                      <span><i className="fa-solid fa-circle-question"></i> {lesson.questionsCount} phần câu hỏi</span>
                      <span>•</span>
                      <span>{lesson.type}</span>
                    </div>
                  </div>
                </div>

                <div className="lesson-right">
                  {isCompleted && (
                    <div className="completed-score-box">
                      <span className="score-val">{lesson.score?.toFixed(1)}</span>
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
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
