import React from 'react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ currentView, onNavigate, activeCourse, onBack }) => {
  const { user, logout, switchRole, setIsAuthModalOpen } = useAuth();

  return (
    <header className="top-nav">
      <div className="brand-group" onClick={() => onNavigate('courses')} style={{ cursor: 'pointer' }}>
        <div className="brand-logo">
          <span className="chinese-char">流</span>
          <span className="logo-dot"></span>
        </div>
        <div className="brand-text">
          <div className="brand-title">
            Hanzify <span className="badge-tag">汉字流</span>
          </div>
          <div className="brand-sub">
            {currentView === 'courses' && 'Danh Mục Khóa Học Hoa Ngữ'}
            {currentView === 'course-detail' && activeCourse?.title}
            {currentView === 'homework' && 'Phòng Làm Bài Tập Trực Tuyến'}
          </div>
        </div>
      </div>

      <div className="header-status">
        {/* Navigation Breadcrumb shortcut */}
        {currentView !== 'courses' && (
          <button type="button" className="btn-nav-back" onClick={onBack}>
            <i className="fa-solid fa-arrow-left"></i>
            <span>{currentView === 'homework' ? 'Quay lại bài học' : 'Xem các khóa học'}</span>
          </button>
        )}

        {/* User Profile or Login Button */}
        {user ? (
          <div className="user-profile-menu">
            <div className="user-info-text">
              <span className="user-name">{user.name}</span>
              <span className="user-role-badge">
                {user.role === 'teacher' ? '👩‍🏫 Giáo Viên' : '🎓 Học Sinh'}
              </span>
            </div>
            
            <div 
              className="student-avatar" 
              title={`${user.name} (${user.role === 'teacher' ? 'Cô giáo' : 'Học sinh'})`}
              onClick={() => {
                // Quick toggle role for convenience
                switchRole(user.role === 'student' ? 'teacher' : 'student');
              }}
            >
              <span className="avatar-initials">{user.avatar}</span>
              <span className="status-online"></span>
            </div>

            <button
              type="button"
              className="btn-icon-logout"
              title="Đăng xuất"
              onClick={logout}
            >
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn-login-trigger"
            onClick={() => setIsAuthModalOpen(true)}
          >
            <i className="fa-regular fa-user"></i>
            <span>Đăng Nhập</span>
          </button>
        )}
      </div>
    </header>
  );
};
