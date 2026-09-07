import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ProfileDropdown } from './ProfileDropdown';

export const Navbar = ({ currentView, onNavigate, activeCourse, onBack, onRoleSwitched, streakData, onOpenStreakModal }) => {
  const { user, setIsAuthModalOpen, unreadNotifsCount } = useAuth();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [profileDropdownTab, setProfileDropdownTab] = useState('profile');

  return (
    <header className="top-nav" style={{ position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)', background: 'rgba(255, 255, 255, 0.95)', borderBottom: '1px solid #fee2e2' }}>
      {/* Brand Logo & Title */}
      <div className="brand-group" onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>
        <div className="brand-logo">
          <span className="chinese-char">流</span>
          <span className="logo-dot"></span>
        </div>
        <div className="brand-text">
          <div className="brand-title">
            Hanzify <span className="badge-tag">汉字流</span>
          </div>
        </div>
      </div>

      {/* Center Navigation Tabs: Trang Chủ - Khóa Học - Luyện Tập - Thi Thử HSK - Giải Trí */}
      <nav style={{ display: 'flex', gap: '0.4rem', background: '#f8fafc', padding: '0.35rem', borderRadius: '14px', border: '1px solid #fee2e2', flexShrink: 0 }}>
        {/* 1. Trang Chủ */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          style={{
            padding: '0.5rem 0.95rem',
            borderRadius: '10px',
            border: 'none',
            background: currentView === 'home' ? '#A11D24' : 'transparent',
            color: currentView === 'home' ? '#ffffff' : '#64748b',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease'
          }}
        >
          <i className="fa-solid fa-house"></i>
          Trang Chủ
        </button>

        {/* 2. Khóa Học */}
        <button
          type="button"
          onClick={() => onNavigate('courses')}
          style={{
            padding: '0.5rem 0.95rem',
            borderRadius: '10px',
            border: 'none',
            background: currentView === 'courses' || currentView === 'course-detail' || currentView === 'homework' ? '#A11D24' : 'transparent',
            color: currentView === 'courses' || currentView === 'course-detail' || currentView === 'homework' ? '#ffffff' : '#64748b',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease'
          }}
        >
          <i className="fa-solid fa-book-bookmark"></i>
          Khóa Học
        </button>

        {/* 2. Luyện Tập */}
        <button
          type="button"
          onClick={() => onNavigate('practice')}
          style={{
            padding: '0.5rem 0.95rem',
            borderRadius: '10px',
            border: 'none',
            background: currentView === 'practice' ? '#A11D24' : 'transparent',
            color: currentView === 'practice' ? '#ffffff' : '#64748b',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease'
          }}
        >
          <i className="fa-solid fa-dumbbell"></i>
          Luyện Tập
        </button>

        {/* 3. Thi Thử HSK */}
        <button
          type="button"
          onClick={() => onNavigate('exam')}
          style={{
            padding: '0.5rem 0.95rem',
            borderRadius: '10px',
            border: 'none',
            background: currentView === 'exam' || currentView === 'exam-room' ? '#A11D24' : 'transparent',
            color: currentView === 'exam' || currentView === 'exam-room' ? '#ffffff' : '#64748b',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease'
          }}
        >
          <i className="fa-solid fa-flag-checkered"></i>
          Thi Thử HSK
        </button>

        {/* 5. Giải Trí */}
        <button
          type="button"
          onClick={() => onNavigate('entertainment')}
          style={{
            padding: '0.5rem 0.95rem',
            borderRadius: '10px',
            border: 'none',
            background: currentView === 'entertainment' ? '#A11D24' : 'transparent',
            color: currentView === 'entertainment' ? '#ffffff' : '#64748b',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease'
          }}
        >
          <i className="fa-solid fa-gamepad"></i>
          Giải Trí
        </button>

        {/* 7. Teacher Only Grading Tab (Chỉ dành riêng cho Cô Giáo) */}
        {user?.role === 'teacher' && (
          <button
            type="button"
            onClick={() => onNavigate('grading')}
            style={{
              padding: '0.5rem 0.95rem',
              borderRadius: '10px',
              border: 'none',
              background: currentView === 'grading' ? '#A11D24' : 'transparent',
              color: currentView === 'grading' ? '#ffffff' : '#64748b',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            <i className="fa-solid fa-stamp"></i>
            Chấm Bài
          </button>
        )}

        {/* 8. Admin Only Tab */}
        {user?.role === 'admin' && (
          <button
            type="button"
            onClick={() => onNavigate('admin-users')}
            style={{
              padding: '0.5rem 0.95rem',
              borderRadius: '10px',
              border: 'none',
              background: currentView === 'admin-users' ? '#A11D24' : 'transparent',
              color: currentView === 'admin-users' ? '#ffffff' : '#64748b',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            <i className="fa-solid fa-users-gear"></i>
            Quản Trị
          </button>
        )}
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
                title={`Chuỗi ngày học: ${streakData?.currentStreak ?? 0} ngày liên tiếp (Bấm để xem & điểm danh)`}
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
                <span>{streakData?.currentStreak ?? 0}</span>
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
              title="Bấm để mở Menu Hồ sơ, Đổi Avatar & Chuyển quyền"
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
