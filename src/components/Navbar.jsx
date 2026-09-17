import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ProfileDropdown } from './ProfileDropdown';

export const Navbar = ({ currentView, onNavigate, activeCourse, onBack, onRoleSwitched, streakData, isStreakLoading = false, onOpenStreakModal, classrooms = [] }) => {
  const { user, setIsAuthModalOpen, unreadNotifsCount } = useAuth();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [profileDropdownTab, setProfileDropdownTab] = useState('profile');

  const navigationItems = [
    { view: 'home', label: 'Trang Chủ', icon: 'fa-house', activeViews: ['home'] },
    { view: 'courses', label: 'Khóa Học', icon: 'fa-book-bookmark', activeViews: ['courses', 'course-detail', 'homework', 'homework-editor'] },
    { view: 'practice', label: 'Luyện Tập', icon: 'fa-dumbbell', activeViews: ['practice'] },
    { view: 'exam', label: 'Thi Thử HSK', icon: 'fa-flag-checkered', activeViews: ['exam', 'exam-room'] },
    { view: 'entertainment', label: 'Giải Trí', icon: 'fa-gamepad', activeViews: ['entertainment'] },
    ...(['admin', 'teacher'].includes(user?.role)
      ? [{ view: 'grading', label: 'Chấm Bài', icon: 'fa-stamp', activeViews: ['grading'] }]
      : []),
    ...(['admin', 'teacher'].includes(user?.role)
      ? [{ view: 'student-progress', label: 'Theo Dõi', ariaLabel: 'Theo Dõi Học Sinh', icon: 'fa-chart-line', activeViews: ['student-progress'] }]
      : []),
    ...(user?.role === 'admin'
      ? [{ view: 'admin-users', label: 'Quản Trị', icon: 'fa-users-gear', activeViews: ['admin-users'] }]
      : [])
  ];

  return (
    <header className="top-nav" style={{ position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)', background: 'rgba(255, 255, 255, 0.95)', borderBottom: '1px solid #fee2e2' }}>
      {/* Brand Logo & Title */}
      <div className="brand-group" onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>
        <div className="brand-logo">
          <span className="chinese-char">刘</span>
          <span className="logo-dot"></span>
        </div>
        <div className="brand-text">
          <div className="brand-title">
            Hanzify
          </div>
        </div>
      </div>

      {/* Only the current section keeps its text label; other tabs stay compact. */}
      <nav className="primary-nav" style={{ display: 'flex', gap: '0.4rem', background: '#f8fafc', padding: '0.35rem', borderRadius: '14px', border: '1px solid #fee2e2', flexShrink: 0 }}>
        {navigationItems.map((item) => {
          const isActive = item.activeViews.includes(currentView);
          return (
          <button
            key={item.view}
            type="button"
            className={`primary-nav-button${isActive ? ' is-active' : ''}`}
            aria-label={item.ariaLabel || item.label}
            aria-current={isActive ? 'page' : undefined}
            title={isActive ? undefined : item.ariaLabel || item.label}
            onClick={() => onNavigate(item.view)}
            style={{
              width: isActive ? 'auto' : '42px',
              minWidth: isActive ? 'max-content' : '42px',
              height: '38px',
              padding: isActive ? '0.5rem 0.95rem' : 0,
              borderRadius: '10px',
              border: 'none',
              background: isActive ? '#A11D24' : 'transparent',
              color: isActive ? '#ffffff' : '#64748b',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: isActive ? '0.4rem' : 0,
              whiteSpace: 'nowrap',
              transition: 'width 0.2s ease, padding 0.2s ease, background 0.15s ease, color 0.15s ease'
            }}
          >
            <i className={`fa-solid ${item.icon}`} aria-hidden="true"></i>
            {isActive && <span className="primary-nav-label">{item.label}</span>}
          </button>
          );
        })}
      </nav>

      {/* Right User Status & Quick Role Switcher */}
      <div className="header-status" style={{ position: 'relative' }}>
        {user ? (
          <div className="user-profile-menu" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {/* Daily Streak Flame Button (Chỉ hiển thị cho Học Viên, ẩn hoàn toàn đối với Giáo Viên & Admin) */}
            {user?.role === 'student' && (
              <button
                type="button"
                onClick={onOpenStreakModal}
                title={isStreakLoading ? 'Đang tải chuỗi ngày học' : `Chuỗi ngày học: ${streakData?.currentStreak ?? 0} ngày liên tiếp (Bấm để xem & điểm danh)`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: streakData?.checkedInToday ? '#fff7ed' : '#fef2f2',
                  border: streakData?.checkedInToday ? '1.5px solid #fdba74' : '1.5px solid #fecaca',
                  padding: '0.38rem 0.75rem',
                  borderRadius: '999px',
                  color: '#c2410c',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(234, 88, 12, 0.12)',
                  transition: 'all 0.15s'
                }}
              >
                <span style={{ fontSize: '1.05rem', filter: 'drop-shadow(0 1px 3px rgba(234,88,12,0.4))' }}>🔥</span>
                <span>{isStreakLoading ? '…' : (streakData?.currentStreak ?? 0)}</span>
              </button>
            )}

            {/* Notification Bell Button */}
            <button
              type="button"
              onClick={() => {
                if (isProfileDropdownOpen && profileDropdownTab === 'notifications') {
                  setIsProfileDropdownOpen(false);
                } else {
                  setProfileDropdownTab('notifications');
                  setIsProfileDropdownOpen(true);
                }
              }}
              title="Thông báo & Hoạt động lớp học"
              style={{
                background: isProfileDropdownOpen && profileDropdownTab === 'notifications' ? '#fef2f2' : '#f8fafc',
                border: isProfileDropdownOpen && profileDropdownTab === 'notifications' ? '1px solid #fecaca' : '1px solid #fee2e2',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                color: isProfileDropdownOpen && profileDropdownTab === 'notifications' ? '#A11D24' : '#475569',
                fontSize: '0.95rem',
                transition: 'all 0.15s'
              }}
            >
              <i className="fa-regular fa-bell"></i>
              {unreadNotifsCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: '#A11D24',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #fff'
                }}>
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {/* User Info Text */}
            <div
              className="user-info-text"
              style={{ whiteSpace: 'nowrap', cursor: 'pointer' }}
              onClick={() => {
                if (isProfileDropdownOpen && profileDropdownTab === 'profile') {
                  setIsProfileDropdownOpen(false);
                } else {
                  setProfileDropdownTab('profile');
                  setIsProfileDropdownOpen(true);
                }
              }}
              title="Bấm để mở Menu Hồ sơ & Đổi Avatar"
            >
              <span className="user-name" style={{ whiteSpace: 'nowrap', fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>
                {user.name}
              </span>
            </div>

            {/* Avatar Pill */}
            <div
              className="student-avatar"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (isProfileDropdownOpen && profileDropdownTab === 'profile') {
                  setIsProfileDropdownOpen(false);
                } else {
                  setProfileDropdownTab('profile');
                  setIsProfileDropdownOpen(true);
                }
              }}
              title="Bấm để mở Menu Hồ sơ & Đổi Avatar"
            >
              <span className="avatar-initials">{user.avatar}</span>
              <span className="status-online"></span>
            </div>

            {/* Compact Profile Dropdown Popover */}
            <ProfileDropdown
              isOpen={isProfileDropdownOpen}
              onClose={() => setIsProfileDropdownOpen(false)}
              initialTab={profileDropdownTab}
              onRoleSwitched={onRoleSwitched}
              streakData={streakData}
              classrooms={classrooms}
            />
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
