import React from 'react';
import { useAuth } from '../context/AuthContext';
import { COURSES_DATA } from '../data/coursesData';

export const CoursesView = ({ onSelectCourse }) => {
  const { user, setIsAuthModalOpen } = useAuth();

  return (
    <div className="courses-view-container">
      {/* Motivational Banner */}
      <section className="welcome-banner">
        <div className="banner-content">
          <div className="banner-tag">
            <i className="fa-solid fa-sparkles"></i>
            <span>Không Gian Học Tập Hoa Ngữ</span>
          </div>
          <h1 className="banner-greeting">
            {user ? `Chào mừng trở lại, ${user.name}! 👋` : 'Chào mừng bạn đến với Hanzify!'}
          </h1>
          <p className="banner-proverb">
            "千里之行，始于足下" — <em>Hành trình vạn dặm bắt đầu từ những bước chân đầu tiên.</em>
          </p>

          {!user && (
            <button
              type="button"
              className="btn-banner-login"
              onClick={() => setIsAuthModalOpen(true)}
            >
              <i className="fa-solid fa-right-to-bracket"></i>
              <span>Đăng nhập để lưu tiến độ bài tập</span>
            </button>
          )}
        </div>

        <div className="banner-stats">
          <div className="stat-card">
            <span className="stat-num">03</span>
            <span className="stat-label">Khóa Học</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">16</span>
            <span className="stat-label">Bài Tập Đã Giao</span>
          </div>
          <div className="stat-card highlight">
            <span className="stat-num">9.5</span>
            <span className="stat-label">Điểm Trung Bình</span>
          </div>
        </div>
      </section>

      {/* Course List Section Header */}
      <div className="section-title-row">
        <div>
          <h2 className="section-title">Danh Sách Khóa Học Của Bạn</h2>
          <p className="section-desc">Chọn khóa học để xem lộ trình bài học và làm bài tập nộp cho cô giáo</p>
        </div>
        <span className="course-counter">
          Tổng cộng: <strong>{COURSES_DATA.length}</strong> khóa học
        </span>
      </div>

      {/* Courses Grid */}
      <div className="courses-grid">
        {COURSES_DATA.map((course) => {
          const percent = Math.round((course.completedLessons / course.totalLessons) * 100);

          return (
            <article 
              key={course.id} 
              className="course-card"
              onClick={() => onSelectCourse(course)}
            >
              {/* Header Gradient with Chinese Calligraphy Watermark */}
              <div 
                className="course-card-cover" 
                style={{ background: course.coverGradient }}
              >
                <span className="cover-watermark">{course.charWatermark}</span>
                <div className="cover-tags">
                  <span className="course-level-badge">{course.level}</span>
                  <span className="course-status-badge">{course.badge}</span>
                </div>
                <div className="cover-chinese-sub">{course.chineseTitle}</div>
              </div>

              {/* Body */}
              <div className="course-card-body">
                <div className="course-teacher">
                  <i className="fa-solid fa-chalkboard-user"></i>
                  <span>{course.teacher}</span>
                </div>

                <h3 className="course-title">{course.title}</h3>
                <p className="course-desc">{course.description}</p>

                {/* Progress */}
                <div className="course-progress-wrap">
                  <div className="progress-info-row">
                    <span className="progress-text">Tiến độ bài tập:</span>
                    <span className="progress-num">
                      <strong>{course.completedLessons}</strong> / {course.totalLessons} bài ({percent}%)
                    </span>
                  </div>
                  <div className="course-progress-bar">
                    <div 
                      className="course-progress-fill" 
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="course-card-footer">
                  <span className="footer-meta">
                    <i className="fa-regular fa-folder-open"></i> {course.lessons.length} bài tập có sẵn
                  </span>
                  <button type="button" className="btn-enter-course">
                    <span>Vào Lớp Học</span>
                    <i className="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
