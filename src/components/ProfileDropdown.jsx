import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

const PRESET_AVATARS = [
  { label: '👑', name: 'Admin' },
  { label: '怀', name: 'Cô Hoài' },
  { label: '龙', name: 'Long' },
  { label: '安', name: 'An' },
  { label: '梅', name: 'Mai' },
  { label: '凤', name: 'Phượng' },
  { label: '莲', name: 'Liên' },
  { label: '福', name: 'Phúc' },
  { label: '🐼', name: 'Gấu trúc' },
  { label: '🌸', name: 'Hoa đào' },
  { label: '🏮', name: 'Đèn lồng' },
  { label: '🍵', name: 'Trà đạo' }
];

const RECENT_SUBMISSIONS = [];

export const ProfileDropdown = ({ isOpen, onClose, initialTab = 'profile', onRoleSwitched, streakData, classrooms = [] }) => {
  const {
    user,
    logout,
    updateProfile,
    notifications,
    unreadNotifsCount,
    markAllNotificationsRead
  } = useAuth();

  const [activeTab, setActiveTab] = useState(initialTab); // 'profile' | 'history' | 'notifications'
  const dropdownRef = useRef(null);

  // Get live streak and XP with local fallback
  const localStreak = (() => {
    try {
      const raw = localStorage.getItem(`hanzify_streak_${user?.id || 'student'}`);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  })();
  const currentStreak = streakData?.currentStreak ?? localStreak?.currentStreak ?? 0;
  const currentTotalXp = streakData?.totalXp ?? localStreak?.totalXp ?? user?.xp ?? 0;

  // Resolve user's classroom code
  const userClass = classrooms.find((c) =>
    c.id === user?.classId ||
    (Array.isArray(user?.classIds) && user.classIds.includes(c.id)) ||
    (Array.isArray(c.students) && c.students.some((st) => st.id === user?.id || st.username === user?.username))
  );
  const classCodeDisplay = userClass?.code || user?.classCode || user?.class_code || (user?.role === 'admin' ? 'TOÀN HỆ THỐNG' : user?.role === 'teacher' ? 'GIÁO VIÊN' : 'Chưa vào lớp');

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, isOpen]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  const handleSelectAvatar = (avatarChar) => {
    updateProfile({ avatar: avatarChar });
    confetti({
      particleCount: 30,
      spread: 45,
      origin: { y: 0.2, x: 0.85 },
      colors: ['#A11D24', '#D4AF37', '#16a34a']
    });
  };

  return (
    <div
      ref={dropdownRef}
      style={{
        position: 'absolute',
        top: 'calc(100% + 10px)',
        right: 0,
        width: '360px',
        maxHeight: '85vh',
        background: '#ffffff',
        borderRadius: '20px',
        border: '1.5px solid #fee2e2',
        boxShadow: '0 20px 45px -10px rgba(161, 29, 36, 0.18), 0 8px 25px rgba(0, 0, 0, 0.08)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'fadeInSlideDown 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* 1. Header User Overview Card */}
      <div style={{
        padding: '1rem 1.15rem 0.85rem 1.15rem',
        background: 'linear-gradient(180deg, #fff5f5 0%, #ffffff 100%)',
        borderBottom: '1px solid #fee2e2',
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        position: 'relative'
      }}>
        {/* Large Avatar */}
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #A11D24 0%, #7f1d1d 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.45rem',
          fontFamily: 'Noto Serif SC, serif',
          fontWeight: 700,
          boxShadow: '0 4px 12px rgba(161, 29, 36, 0.25)',
          flexShrink: 0
        }}>
          {user.avatar}
        </div>

        {/* User Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <span style={{
              fontWeight: 800,
              fontSize: '0.98rem',
              color: '#0f172a',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {user.name}
            </span>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '2px 7px',
              borderRadius: '10px',
              background: user.role === 'admin' ? '#fef2f2' : user.role === 'teacher' ? '#f0fdf4' : '#f8fafc',
              color: user.role === 'admin' ? '#A11D24' : user.role === 'teacher' ? '#16a34a' : '#475569',
              border: `1px solid ${user.role === 'admin' ? '#fecaca' : user.role === 'teacher' ? '#bbf7d0' : '#e2e8f0'}`,
              whiteSpace: 'nowrap'
            }}>
              {user.role === 'admin' ? '👑 Admin' : user.role === 'teacher' ? '👩‍🏫 Giáo Viên' : '🎓 Học Viên'}
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <i className="fa-solid fa-graduation-cap" style={{ fontSize: '0.72rem', color: '#A11D24' }}></i>
            <span>Mã lớp:</span>
            <strong style={{
              color: '#A11D24',
              background: '#fef2f2',
              padding: '1px 6px',
              borderRadius: '6px',
              border: '1px solid #fecaca',
              letterSpacing: '0.5px',
              fontSize: '0.75rem'
            }}>
              {classCodeDisplay}
            </strong>
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            fontSize: '1rem',
            padding: '4px',
            borderRadius: '6px',
            lineHeight: 1
          }}
          title="Đóng"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      {/* 2. Mini Tab Switcher */}
      <div style={{
        display: 'flex',
        background: '#f8fafc',
        borderBottom: '1px solid #fee2e2',
        padding: '4px 6px',
        gap: '4px'
      }}>
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          style={{
            flex: 1,
            padding: '0.45rem 0.2rem',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'profile' ? '#ffffff' : 'transparent',
            color: activeTab === 'profile' ? '#A11D24' : '#64748b',
            fontWeight: activeTab === 'profile' ? 700 : 500,
            fontSize: '0.78rem',
            cursor: 'pointer',
            boxShadow: activeTab === 'profile' ? '0 2px 5px rgba(0,0,0,0.06)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            transition: 'all 0.15s'
          }}
        >
          <i className="fa-solid fa-user-gear"></i>
          <span>Hồ Sơ & Quyền</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          style={{
            flex: 1,
            padding: '0.45rem 0.2rem',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'history' ? '#ffffff' : 'transparent',
            color: activeTab === 'history' ? '#A11D24' : '#64748b',
            fontWeight: activeTab === 'history' ? 700 : 500,
            fontSize: '0.78rem',
            cursor: 'pointer',
            boxShadow: activeTab === 'history' ? '0 2px 5px rgba(0,0,0,0.06)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            transition: 'all 0.15s'
          }}
        >
          <i className="fa-solid fa-clock-rotate-left"></i>
          <span>Lịch Sử</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('notifications')}
          style={{
            flex: 1,
            padding: '0.45rem 0.2rem',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'notifications' ? '#ffffff' : 'transparent',
            color: activeTab === 'notifications' ? '#A11D24' : '#64748b',
            fontWeight: activeTab === 'notifications' ? 700 : 500,
            fontSize: '0.78rem',
            cursor: 'pointer',
            boxShadow: activeTab === 'notifications' ? '0 2px 5px rgba(0,0,0,0.06)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            position: 'relative',
            transition: 'all 0.15s'
          }}
        >
          <i className="fa-regular fa-bell"></i>
          <span>Thông Báo</span>
          {unreadNotifsCount > 0 && (
            <span style={{
              background: '#A11D24',
              color: '#fff',
              fontSize: '0.62rem',
              fontWeight: 800,
              padding: '1px 5px',
              borderRadius: '8px',
              lineHeight: 1
            }}>
              {unreadNotifsCount}
            </span>
          )}
        </button>
      </div>

      {/* 3. Dropdown Body Content */}
      <div style={{
        padding: '0.85rem',
        overflowY: 'auto',
        maxHeight: '380px'
      }}>
        {/* ================= TAB 1: HỒ SƠ & VAI TRÒ ================= */}
        {activeTab === 'profile' && (
          <div>
            {/* Quick Avatar Picker */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: '#64748b',
                letterSpacing: '0.5px',
                marginBottom: '0.45rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span>Chọn Avatar Hán Tự:</span>
                <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 600 }}>Click là đổi ngay</span>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '6px'
              }}>
                {PRESET_AVATARS.map((av) => {
                  const isSelected = user.avatar === av.label;
                  return (
                    <button
                      key={av.label}
                      type="button"
                      onClick={() => handleSelectAvatar(av.label)}
                      title={`${av.name} (${av.label})`}
                      style={{
                        height: '38px',
                        borderRadius: '10px',
                        border: isSelected ? '2px solid #A11D24' : '1px solid #e2e8f0',
                        background: isSelected ? '#fef2f2' : '#ffffff',
                        fontSize: '1.15rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        transform: isSelected ? 'scale(1.06)' : 'scale(1)'
                      }}
                    >
                      {av.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats Summary */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '6px',
              marginBottom: '0.75rem',
              background: '#f8fafc',
              padding: '0.65rem',
              borderRadius: '12px',
              border: '1px solid #fee2e2'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1.1rem' }}>🔥</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#A11D24' }}>
                    {currentStreak} Ngày
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Chuỗi học tập</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1.1rem' }}>⭐</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#c2410c' }}>
                    {currentTotalXp} XP
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Điểm tích lũy</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: LỊCH SỬ LÀM BÀI & ĐIỂM ================= */}
        {activeTab === 'history' && (
          <div>
            <div style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#64748b',
              letterSpacing: '0.5px',
              marginBottom: '0.5rem'
            }}>
              Lịch sử nộp bài gần đây:
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {RECENT_SUBMISSIONS.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '0.65rem 0.75rem',
                    borderRadius: '12px',
                    background: '#f8fafc',
                    border: '1px solid #fee2e2'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.83rem', color: '#0f172a', lineHeight: 1.3 }}>
                      {item.title}
                    </div>
                    <span style={{
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      color: '#A11D24',
                      background: '#fef2f2',
                      padding: '2px 6px',
                      borderRadius: '8px',
                      whiteSpace: 'nowrap'
                    }}>
                      {item.score}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', fontSize: '0.72rem', color: '#64748b', marginBottom: '4px' }}>
                    <span>{item.course}</span>
                    <span>•</span>
                    <span>{item.date}</span>
                    <span>•</span>
                    <span style={{ color: '#16a34a', fontWeight: 600 }}>{item.status}</span>
                  </div>

                  {item.comment && (
                    <div style={{
                      fontSize: '0.72rem',
                      color: '#475569',
                      background: '#ffffff',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      borderLeft: '3px solid #A11D24',
                      lineHeight: 1.4
                    }}>
                      💬 <em>{item.comment}</em>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: THÔNG BÁO ================= */}
        {activeTab === 'notifications' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.5rem'
            }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
                Thông Báo Hoạt Động:
              </span>
              {unreadNotifsCount > 0 && (
                <button
                  type="button"
                  onClick={markAllNotificationsRead}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#A11D24',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Đánh dấu đã đọc
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  style={{
                    padding: '0.65rem 0.75rem',
                    borderRadius: '12px',
                    background: notif.isRead ? '#ffffff' : '#fff5f5',
                    border: notif.isRead ? '1px solid #f1f5f9' : '1px solid #fecaca',
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'flex-start'
                  }}
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: notif.type === 'grade' ? '#dcfce7' : '#fee2e2',
                    color: notif.type === 'grade' ? '#16a34a' : '#A11D24',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    flexShrink: 0
                  }}>
                    <i className={notif.type === 'grade' ? 'fa-solid fa-check' : 'fa-regular fa-bell'}></i>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#0f172a', marginBottom: '2px' }}>
                      {notif.title}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.3, marginBottom: '2px' }}>
                      {notif.desc}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                      {notif.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Dropdown Footer with Logout */}
      <div style={{
        padding: '0.6rem 0.85rem',
        background: '#f8fafc',
        borderTop: '1px solid #fee2e2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
          Hanzify 汉字流 v1.0
        </div>
        <button
          type="button"
          className="btn-dropdown-logout"
          onClick={() => {
            onClose();
            logout();
          }}
          style={{
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            color: '#be123c',
            fontWeight: 700,
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: '10px',
            transition: 'all 0.15s'
          }}
        >
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
          <span>Đăng xuất tài khoản</span>
        </button>
      </div>
    </div>
  );
};
