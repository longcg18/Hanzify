import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ProfileDropdown } from './ProfileDropdown';

export const Navbar = ({ currentView, onNavigate, activeCourse, onBack, onRoleSwitched, streakData, isStreakLoading = false, onOpenStreakModal, classrooms = [] }) => {
  const { user, setIsAuthModalOpen, unreadNotifsCount } = useAuth();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [profileDropdownTab, setProfileDropdownTab] = useState('profile');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigationItems = [
    { view: 'home', label: 'Trang Chủ', icon: 'fa-house', activeViews: ['home'] },
    { view: 'courses', label: 'Khóa Học', icon: 'fa-book-bookmark', activeViews: ['courses', 'course-detail', 'homework', 'homework-editor'] },
    { view: 'practice', label: 'Luyện Tập', icon: 'fa-dumbbell', activeViews: ['practice'] },
    { view: 'exam', label: 'Thi Thử HSK', icon: 'fa-flag-checkered', activeViews: ['exam', 'exam-room'] },
    { view: 'entertainment', label: 'Giải Trí', icon: 'fa-gamepad', activeViews: ['entertainment'] },
    { view: 'leaderboard', label: 'Xếp Hạng', icon: 'fa-trophy', activeViews: ['leaderboard'] },
    { view: 'forum', label: 'Diễn Đàn', icon: 'fa-comments', activeViews: ['forum'] },
    ...(['admin', 'teacher'].includes(user?.role)
      ? [{ view: 'grading', label: 'Chấm Bài', icon: 'fa-stamp', activeViews: ['grading'] }]
      : []),
    ...(['admin', 'teacher'].includes(user?.role)
      ? [{ view: 'student-progress', label: 'Theo Dõi', icon: 'fa-chart-line', activeViews: ['student-progress'] }]
      : []),
    ...(user?.role === 'admin'
      ? [{ view: 'admin-users', label: 'Quản Trị', icon: 'fa-users-gear', activeViews: ['admin-users'] }]
      : [])
  ];

  const handleNavClick = (view) => {
    onNavigate(view);
    setIsSidebarOpen(false);
  };

  const roleLabel = user?.role === 'admin' ? 'Quản trị viên' : user?.role === 'teacher' ? 'Giáo viên' : 'Học viên';
  const cleanUserName = user
    ? (user.role === 'teacher' ? 'Cô Hoài' : (user.name || user.full_name || user.username || '').replace(/\([^)]*\)/g, '').trim())
    : '';
  const userInitials = user?.avatar || (user?.role === 'teacher' ? '怀' : user?.name ? user.name.charAt(0).toUpperCase() : '?');

  return (
    <>
      {/* Mobile top bar */}
      <div className="mobile-top-bar">
        <button
          type="button"
          className="sidebar-menu-btn"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          aria-label="Mở menu"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text)',
            fontSize: '18px',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <i className="fa-solid fa-bars" />
        </button>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', flex: 1 }}
          onClick={() => handleNavClick('home')}
        >
          <img src="/favicon.svg" alt="Hanzify" style={{ width: 28, height: 28, borderRadius: 7 }} />
          <span className="sidebar-brand-name">Hanzify</span>
        </div>
        {user ? (
          <div
            className="sidebar-avatar"
            style={{ cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              setProfileDropdownTab('profile');
              setIsProfileDropdownOpen((prev) => !prev);
            }}
            title="Tài khoản cá nhân"
          >
            {userInitials}
          </div>
        ) : (
          <button
            type="button"
            className="btn-login-trigger"
            onClick={() => setIsAuthModalOpen(true)}
            style={{ padding: '6px 12px', fontSize: '13px' }}
          >
            Đăng Nhập
          </button>
        )}
      </div>

      {/* Sidebar overlay for mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.25)',
            zIndex: 199,
          }}
        />
      )}

      {/* Sidebar */}
      <nav className={`app-sidebar${isSidebarOpen ? ' is-open' : ''}`} id="app-sidebar">
        {/* Brand */}
        <div className="sidebar-brand" onClick={() => handleNavClick('home')}>
          <img src="/favicon.svg" alt="Hanzify" style={{ width: 34, height: 34, borderRadius: 9 }} />
          <span className="sidebar-brand-name">Hanzify</span>
        </div>

        {/* Navigation */}
        <div className="sidebar-nav">
          {navigationItems.map((item) => {
            const isActive = item.activeViews.includes(currentView);
            return (
              <button
                key={item.view}
                type="button"
                className={`sidebar-nav-item${isActive ? ' is-active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => handleNavClick(item.view)}
              >
                <i className={`fa-solid ${item.icon}`} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Bottom user row */}
        <div className="sidebar-bottom">
          {user ? (
            <>
              {/* Streak button for students */}
              {user?.role === 'student' && (
                <button
                  type="button"
                  onClick={onOpenStreakModal}
                  title={`Chuỗi ngày học: ${streakData?.currentStreak ?? 0} ngày liên tiếp`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    height: 34,
                    padding: '0 10px',
                    borderRadius: 8,
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--muted)',
                    fontSize: 14,
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <i className="fa-solid fa-fire" style={{ color: 'var(--warning)', fontSize: 14 }} />
                  <span style={{ fontSize: 14, color: 'var(--text)' }}>
                    {isStreakLoading ? '…' : `${streakData?.currentStreak ?? 0} ngày`}
                  </span>
                  {unreadNotifsCount > 0 && (
                    <span style={{
                      marginLeft: 'auto',
                      background: 'var(--negative)',
                      color: '#fff',
                      borderRadius: '50%',
                      width: 18,
                      height: 18,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                      fontWeight: 600,
                    }}>
                      {unreadNotifsCount}
                    </span>
                  )}
                </button>
              )}

              {/* User row */}
              <div
                className="sidebar-user-row"
                onClick={() => {
                  setProfileDropdownTab('profile');
                  setIsProfileDropdownOpen((prev) => !prev);
                }}
                title="Bấm để mở cài đặt tài khoản"
              >
                <div className="sidebar-avatar">{userInitials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="sidebar-user-name" title={user.name}>{cleanUserName}</div>
                  <div className="sidebar-user-role">{roleLabel}</div>
                </div>
                <button
                  type="button"
                  className="sidebar-more-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileDropdownTab('profile');
                    setIsProfileDropdownOpen((prev) => !prev);
                  }}
                  title="Cài đặt tài khoản"
                  aria-label="Cài đặt tài khoản"
                >
                  <i className="fa-solid fa-ellipsis" />
                </button>
              </div>
            </>
          ) : (
            <button
              type="button"
              className="btn-login-trigger"
              onClick={() => setIsAuthModalOpen(true)}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <i className="fa-regular fa-user" />
              <span>Đăng Nhập</span>
            </button>
          )}
        </div>
      </nav>

      {/* Global Profile Dropdown (single instance, fixed position) */}
      {user && (
        <ProfileDropdown
          isOpen={isProfileDropdownOpen}
          onClose={() => setIsProfileDropdownOpen(false)}
          initialTab={profileDropdownTab}
          onRoleSwitched={onRoleSwitched}
          streakData={streakData}
          classrooms={classrooms}
        />
      )}
    </>
  );
};
