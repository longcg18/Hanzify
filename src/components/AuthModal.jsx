import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const AuthModal = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    login,
    authenticate,
    setIsJoinClassModalOpen
  } = useAuth();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!usernameOrEmail.trim()) {
      setErrorMsg('Vui lòng nhập tên đăng nhập, email hoặc số điện thoại!');
      return;
    }

    // Authenticate with AuthContext
    const res = authenticate(usernameOrEmail, password);
    if (res.success) {
      setIsAuthModalOpen(false);
    } else {
      setErrorMsg(res.message || 'Tên đăng nhập hoặc mật khẩu không chính xác!');
    }
  };

  const handleQuickLogin = (demoRole) => {
    if (demoRole === 'teacher') {
      login({
        id: 'user-teacher',
        username: 'hoailaoshi',
        name: 'Cô Hoài',
        email: 'hoailaoshi@hanzify.com',
        phone: '0987 654 321',
        role: 'teacher',
        avatar: '怀',
        chineseName: '怀老师',
        badge: 'Giáo viên phụ trách',
        joinedDate: 'Năm 2024'
      });
    } else {
      login({
        id: 'user-student-1',
        username: 'student',
        name: 'Nguyễn Văn An',
        email: 'student@hanzify.com',
        phone: '0911 223 344',
        role: 'student',
        avatar: '安',
        chineseName: '阮文安',
        badge: 'Học viên HSK 2',
        classId: 'class-hsk2-k01',
        className: 'Lớp HSK 2 Cấp Tốc - Khóa K01',
        enrolledCourses: ['hsk2'],
        joinedDate: 'Tháng 8/2026'
      });
    }
  };

  const handleOpenJoinClass = () => {
    setIsAuthModalOpen(false);
    setIsJoinClassModalOpen(true);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAuthModalOpen(false)}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          className="btn-modal-close"
          onClick={() => setIsAuthModalOpen(false)}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Modal Header */}
        <div className="auth-modal-header">
          <div className="auth-badge">Hanzify ID</div>
          <h2 className="auth-title">Đăng Nhập Học Viên</h2>
          <p className="auth-subtitle">
            Học tập theo lộ trình chuẩn HSK, làm bài và nhận phản hồi trực tiếp từ giáo viên
          </p>
        </div>

        {/* PROMINENT BANNER FOR NEW STUDENTS WITH CLASS CODE */}
        <div
          onClick={handleOpenJoinClass}
          style={{
            background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
            border: '1.5px dashed #b91c1c',
            borderRadius: '16px',
            padding: '1rem 1.15rem',
            marginBottom: '1.25rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(185, 28, 28, 0.08)'
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: '#b91c1c',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              flexShrink: 0
            }}
          >
            <i className="fa-solid fa-ticket"></i>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#991b1b', marginBottom: '0.15rem' }}>
              Bạn mới nhận được Mã Lớp Học?
            </div>
            <div style={{ fontSize: '0.78rem', color: '#7f1d1d' }}>
              Nhập mã lớp để chọn tên trong danh sách & tạo tài khoản đăng nhập
            </div>
          </div>
          <i className="fa-solid fa-arrow-right" style={{ color: '#b91c1c', fontSize: '0.9rem' }}></i>
        </div>

        {/* One-Click Role Testing Buttons */}
        <div className="quick-roles-section">
          <div className="quick-roles-label">Trải nghiệm nhanh tài khoản mẫu:</div>
          <div className="quick-roles-grid">
            <button
              type="button"
              className="btn-quick-role student"
              onClick={() => handleQuickLogin('student')}
            >
              <i className="fa-solid fa-graduation-cap"></i>
              <span>Học Viên (Nguyễn Văn An)</span>
            </button>
            <button
              type="button"
              className="btn-quick-role teacher"
              onClick={() => handleQuickLogin('teacher')}
            >
              <i className="fa-solid fa-chalkboard-user"></i>
              <span>Giáo Viên (Cô Hoài)</span>
            </button>
          </div>
        </div>

        <div className="auth-divider">
          <span>Hoặc đăng nhập bằng tài khoản cá nhân</span>
        </div>

        {/* Custom Login Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-field-group">
            <label>Tên đăng nhập, Email hoặc SĐT:</label>
            <div className="input-wrap">
              <i className="fa-regular fa-user"></i>
              <input
                type="text"
                required
                placeholder="Ví dụ: student hoặc maitt26"
                value={usernameOrEmail}
                onChange={(e) => {
                  setUsernameOrEmail(e.target.value);
                  setErrorMsg('');
                }}
              />
            </div>
          </div>

          <div className="input-field-group">
            <label>Mật khẩu:</label>
            <div className="input-wrap" style={{ position: 'relative' }}>
              <i className="fa-solid fa-lock"></i>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Nhập mật khẩu (Mặc định demo: 123)"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg('');
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 'none',
                  background: 'transparent',
                  color: '#64748b',
                  cursor: 'pointer'
                }}
              >
                <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div
              style={{
                color: '#dc2626',
                fontSize: '0.84rem',
                marginBottom: '0.75rem',
                background: '#fef2f2',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <i className="fa-solid fa-circle-exclamation"></i>
              <span>{errorMsg}</span>
            </div>
          )}

          <button type="submit" className="btn-auth-submit">
            <span>Đăng Nhập Vào Học</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </form>

        <div className="auth-toggle-tab" style={{ marginTop: '1.25rem' }}>
          <p>
            Chưa có tài khoản?{' '}
            <button type="button" onClick={handleOpenJoinClass} style={{ color: '#b91c1c', fontWeight: 700 }}>
              Tham gia bằng mã lớp học
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

