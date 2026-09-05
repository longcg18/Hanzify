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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!usernameOrEmail.trim()) {
      setErrorMsg('Vui lòng nhập tên đăng nhập hoặc email!');
      return;
    }

    // Authenticate with AuthContext via Backend API
    const res = await authenticate(usernameOrEmail, password);
    if (res.success) {
      setIsAuthModalOpen(false);
    } else {
      setErrorMsg(res.message || 'Tên đăng nhập hoặc mật khẩu không chính xác!');
    }
  };

  const handleOpenJoinClass = () => {
    setIsAuthModalOpen(false);
    setIsJoinClassModalOpen(true);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAuthModalOpen(false)}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button at top-right */}
        <button
          type="button"
          onClick={() => setIsAuthModalOpen(false)}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '1px solid #e2e8f0',
            background: '#f8fafc',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f1f5f9';
            e.currentTarget.style.color = '#0f172a';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#f8fafc';
            e.currentTarget.style.color = '#64748b';
          }}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Modal Header */}
        <div className="auth-modal-header" style={{ marginTop: '0.25rem' }}>
          <h2 className="auth-title">Đăng Nhập</h2>
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

        {/* Custom Login Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-field-group">
            <label>Tên đăng nhập hoặc Email:</label>
            <div className="input-wrap" style={{ position: 'relative', width: '100%', display: 'block' }}>
              <i
                className="fa-regular fa-user"
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  pointerEvents: 'none'
                }}
              ></i>
              <input
                type="text"
                required
                placeholder="username"
                value={usernameOrEmail}
                onChange={(e) => {
                  setUsernameOrEmail(e.target.value);
                  setErrorMsg('');
                }}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 40px',
                  borderRadius: '12px',
                  border: '1.5px solid #e2e8f0',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div className="input-field-group">
            <label>Mật khẩu:</label>
            <div className="input-wrap" style={{ position: 'relative', width: '100%', display: 'block' }}>
              <i
                className="fa-solid fa-lock"
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  pointerEvents: 'none'
                }}
              ></i>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg('');
                }}
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 40px',
                  borderRadius: '12px',
                  border: '1.5px solid #e2e8f0',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box'
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
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 5
                }}
              >
                <i
                  className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                  style={{
                    position: 'static',
                    fontSize: '0.95rem',
                    color: '#94a3b8'
                  }}
                ></i>
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
            <span>Đăng Nhập</span>
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
