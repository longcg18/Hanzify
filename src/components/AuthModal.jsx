import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login } = useAuth();
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [role, setRole] = useState('student'); // 'student' | 'teacher'
  const [fullName, setFullName] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phoneOrEmail) return;

    const name = fullName || (role === 'teacher' ? 'Cô Linh Lão Sư' : 'Học Sinh Mới');
    const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    login({
      id: `user-${Date.now()}`,
      name: name,
      email: phoneOrEmail.includes('@') ? phoneOrEmail : `${phoneOrEmail}@hanzify.com`,
      phone: phoneOrEmail,
      role: role,
      avatar: role === 'teacher' ? '灵' : initials,
      currentClass: role === 'teacher' ? 'Quản lý khóa học' : 'Lớp Tiếng Trung Online',
      joinedDate: 'Hôm nay'
    });
  };

  const handleQuickLogin = (demoRole) => {
    if (demoRole === 'teacher') {
      login({
        id: 'teacher-1',
        name: 'Cô Linh Lão Sư (灵老师)',
        email: 'colinh.chinese@gmail.com',
        phone: '0909 888 999',
        role: 'teacher',
        avatar: '灵',
        currentClass: 'Giáo viên phụ trách',
        joinedDate: 'Năm 2024'
      });
    } else {
      login({
        id: 'student-1',
        name: 'Nguyễn Minh Anh',
        email: 'minhanh@gmail.com',
        phone: '0988 123 456',
        role: 'student',
        avatar: 'MA',
        currentClass: 'Lớp HSK 2 Căn Bản (Cô Linh)',
        joinedDate: 'Tháng 8/2026'
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAuthModalOpen(false)}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="btn-modal-x"
          onClick={() => setIsAuthModalOpen(false)}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="auth-header">
          <div className="auth-brand-badge">
            <span className="chinese-char">流</span>
          </div>
          <h2 className="auth-title">
            {tab === 'login' ? 'Chào Mừng Trở Lại!' : 'Tạo Tài Khoản Mới'}
          </h2>
          <p className="auth-subtitle">
            Học & làm bài tập tiếng Trung cùng Hanzify
          </p>
        </div>

        {/* Quick 1-Click Role Login Demo */}
        <div className="quick-demo-section">
          <span className="quick-demo-label">Đăng nhập nhanh một chạm:</span>
          <div className="quick-demo-buttons">
            <button
              type="button"
              className="btn-quick-role student"
              onClick={() => handleQuickLogin('student')}
            >
              <i className="fa-solid fa-graduation-cap"></i>
              <span>Vào vai Học Sinh (Minh Anh)</span>
            </button>
            <button
              type="button"
              className="btn-quick-role teacher"
              onClick={() => handleQuickLogin('teacher')}
            >
              <i className="fa-solid fa-chalkboard-user"></i>
              <span>Vào vai Cô Giáo (Linh Lão Sư)</span>
            </button>
          </div>
        </div>

        <div className="auth-divider">
          <span>Hoặc đăng nhập thông thường</span>
        </div>

        {/* Custom Login Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="role-selector">
            <label className={`role-pill ${role === 'student' ? 'active' : ''}`}>
              <input
                type="radio"
                name="auth_role"
                checked={role === 'student'}
                onChange={() => setRole('student')}
              />
              <i className="fa-solid fa-user-graduate"></i>
              <span>Học Sinh</span>
            </label>

            <label className={`role-pill ${role === 'teacher' ? 'active' : ''}`}>
              <input
                type="radio"
                name="auth_role"
                checked={role === 'teacher'}
                onChange={() => setRole('teacher')}
              />
              <i className="fa-solid fa-chalkboard-teacher"></i>
              <span>Giáo Viên</span>
            </label>
          </div>

          {tab === 'register' && (
            <div className="input-field-group">
              <label>Họ và Tên:</label>
              <div className="input-wrap">
                <i className="fa-regular fa-user"></i>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Minh Anh"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="input-field-group">
            <label>Số điện thoại hoặc Email:</label>
            <div className="input-wrap">
              <i className="fa-regular fa-envelope"></i>
              <input
                type="text"
                required
                placeholder="0988 123 456 hoặc email@gmail.com"
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn-auth-submit">
            <span>{tab === 'login' ? 'Đăng Nhập Vào Học' : 'Tạo Tài Khoản'}</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </form>

        <div className="auth-toggle-tab">
          {tab === 'login' ? (
            <p>
              Chưa có tài khoản?{' '}
              <button type="button" onClick={() => setTab('register')}>
                Đăng ký ngay
              </button>
            </p>
          ) : (
            <p>
              Đã có tài khoản?{' '}
              <button type="button" onClick={() => setTab('login')}>
                Đăng nhập
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
