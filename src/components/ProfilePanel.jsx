import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

const PRESET_AVATARS = [
  { id: 'av-1', label: '👑', desc: 'Vương miện Admin' },
  { id: 'av-2', label: '怀', desc: 'Cô Hoài' },
  { id: 'av-3', label: '龙', desc: 'Long (Rồng uy nghiêm)' },
  { id: 'av-4', label: '安', desc: 'An (Bình an)' },
  { id: 'av-5', label: '梅', desc: 'Mai (Hoa mai)' },
  { id: 'av-6', label: '凤', desc: 'Phượng (Phượng hoàng)' },
  { id: 'av-7', label: '莲', desc: 'Liên (Hoa sen thanh tịnh)' },
  { id: 'av-8', label: '福', desc: 'Phúc (Hạnh phúc)' }
];

const SAMPLE_SUBMISSION_HISTORY = [
  {
    id: 'h-1',
    lesson: 'Bài 04: Đi Mua Sắm (买东西)',
    course: 'HSK 2 Toàn Diện',
    date: 'Hôm nay 08:30',
    type: 'Bài tập về nhà',
    score: '9.5 / 10',
    status: 'graded',
    feedback: 'Em phát âm thanh 4 rất dứt khoát! Chú ý nét phẩy của chữ 贵 viết dài hơn một chút nhé.'
  },
  {
    id: 'h-2',
    lesson: 'Đề Thi Thử HSK 2 Toàn Diện - Đề Số 01',
    course: 'Luyện thi HSK 2',
    date: 'Hôm qua 21:15',
    type: 'Thi thử HSK',
    score: '160 / 200',
    status: 'passed',
    feedback: 'Kết quả: ĐẠT (合格) - Nghe 80đ, Đọc 80đ.'
  },
  {
    id: 'h-3',
    lesson: 'Bài 03: Thời Gian & Ngày Tháng (时间与日期)',
    course: 'HSK 2 Toàn Diện',
    date: '02/09/2026',
    type: 'Bài tập về nhà',
    score: '9.0 / 10',
    status: 'graded',
    feedback: 'Bài làm rất tốt, câu đàm thoại đọc tự nhiên.'
  },
  {
    id: 'h-4',
    lesson: 'Bài 02: Gia Đình & Nghề Nghiệp (家庭与工作)',
    course: 'HSK 2 Toàn Diện',
    date: '28/08/2026',
    type: 'Bài tập về nhà',
    score: '9.5 / 10',
    status: 'graded',
    feedback: 'Thu âm to, rõ ràng, không bị ngọng âm z/c/s.'
  }
];

export const ProfilePanel = () => {
  const {
    user,
    updateProfile,
    isProfilePanelOpen,
    setIsProfilePanelOpen,
    notifications,
    unreadNotifsCount,
    markAllNotificationsRead
  } = useAuth();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'history' | 'notifications' | 'stats'

  // Editable Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [chineseName, setChineseName] = useState(user?.chineseName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || '安');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Live streak and XP
  const localStreak = (() => {
    try {
      const raw = localStorage.getItem(`hanzify_streak_${user?.id || 'student'}`);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  })();
  const currentStreak = localStreak?.currentStreak ?? 0;
  const currentTotalXp = localStreak?.totalXp ?? user?.xp ?? 0;

  if (!isProfilePanelOpen || !user) return null;

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({
      name,
      chineseName,
      phone,
      avatar: customAvatarUrl.trim() || selectedAvatar
    });

    setSaveSuccess(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#A11D24', '#16a34a', '#D4AF37']
    });

    setTimeout(() => {
      setSaveSuccess(false);
    }, 2500);
  };

  const handleCustomImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomAvatarUrl(url);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.55)',
      backdropFilter: 'blur(5px)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end',
      animation: 'fadeIn 0.2s ease'
    }}>
      {/* Slide-over Drawer Panel */}
      <div style={{
        width: '100%',
        maxWidth: '560px',
        height: '100%',
        background: '#ffffff',
        boxShadow: '-10px 0 40px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        {/* Panel Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #fee2e2',
          background: 'linear-gradient(135deg, #fef2f2 0%, #ffffff 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #A11D24 0%, #7f1d1d 100%)',
              color: '#fff',
              fontSize: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              boxShadow: '0 4px 12px rgba(161, 29, 36, 0.25)',
              overflow: 'hidden'
            }}>
              {customAvatarUrl ? (
                <img src={customAvatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                selectedAvatar
              )}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.15rem', color: '#0f172a', margin: 0, fontWeight: 800 }}>{user.name}</h2>
                <span style={{
                  background: user.role === 'admin' ? '#fef2f2' : user.role === 'teacher' ? '#f0fdf4' : '#f1f5f9',
                  color: user.role === 'admin' ? '#A11D24' : user.role === 'teacher' ? '#16a34a' : '#475569',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '10px',
                  fontSize: '0.72rem',
                  fontWeight: 700
                }}>
                  {user.role === 'admin' && '👑 Admin'}
                  {user.role === 'teacher' && '👩‍🏫 Giáo Viên'}
                  {user.role === 'student' && '🎓 Học Viên'}
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.2rem' }}>
                {user.email} · Tham gia: {user.joinedDate}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsProfilePanelOpen(false)}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              cursor: 'pointer',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem'
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Panel Navigation Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0',
          background: '#fafaf9',
          padding: '0.4rem 1.5rem 0 1.5rem',
          gap: '0.5rem'
        }}>
          {[
            { id: 'profile', label: 'Hồ Sơ & Avatar', icon: 'fa-user-pen' },
            { id: 'history', label: 'Lịch Sử Làm Bài', icon: 'fa-clock-rotate-left' },
            { id: 'notifications', label: `Thông Báo (${unreadNotifsCount})`, icon: 'fa-bell' },
            { id: 'stats', label: 'Thống Kê', icon: 'fa-chart-pie' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.75rem 1rem',
                border: 'none',
                background: 'transparent',
                borderBottom: activeTab === tab.id ? '2.5px solid #A11D24' : '2.5px solid transparent',
                color: activeTab === tab.id ? '#A11D24' : '#64748b',
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: '0.86rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s'
              }}
            >
              <i className={`fa-solid ${tab.icon}`}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panel Body Content (Scrollable) */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {/* TAB 1: EDIT PROFILE & AVATAR */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Avatar Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.75rem' }}>
                  Ảnh đại diện (Avatar):
                </label>

                {/* Preset Calligraphy/Icon Avatars */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                  {PRESET_AVATARS.map((av) => {
                    const isSelected = selectedAvatar === av.label && !customAvatarUrl;
                    return (
                      <div
                        key={av.id}
                        onClick={() => {
                          setSelectedAvatar(av.label);
                          setCustomAvatarUrl('');
                        }}
                        style={{
                          border: isSelected ? '2px solid #A11D24' : '1px solid #e2e8f0',
                          background: isSelected ? '#fef2f2' : '#f8fafc',
                          borderRadius: '14px',
                          padding: '0.75rem 0.5rem',
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                      >
                        <div style={{ fontSize: '1.6rem', fontFamily: 'Ma Shan Zheng, cursive', color: '#A11D24' }}>
                          {av.label}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem' }}>
                          {av.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Custom Photo Upload Option */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f8fafc', border: '1.5px dashed #cbd5e1', padding: '0.85rem 1.25rem', borderRadius: '12px' }}>
                  <input type="file" accept="image/*" id="avatar-upload" style={{ display: 'none' }} onChange={handleCustomImageUpload} />
                  <label htmlFor="avatar-upload" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#A11D24', fontWeight: 600, fontSize: '0.88rem' }}>
                    <i className="fa-solid fa-camera"></i>
                    <span>Tải ảnh từ máy tính / điện thoại</span>
                  </label>
                  {customAvatarUrl && (
                    <span style={{ fontSize: '0.78rem', color: '#16a34a', marginLeft: 'auto' }}>
                      ✓ Đã tải ảnh lên
                    </span>
                  )}
                </div>
              </div>

              {/* Personal Info Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                    Họ và tên hiển thị:
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                    Tên Chữ Hán (中文名字):
                  </label>
                  <input
                    type="text"
                    value={chineseName}
                    onChange={(e) => setChineseName(e.target.value)}
                    placeholder="Ví dụ: 阮文安"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.95rem',
                      fontFamily: 'Noto Serif SC, serif',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>
                      Số điện thoại đăng ký:
                    </label>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <i className="fa-solid fa-lock" style={{ fontSize: '0.7rem' }}></i> Cố định
                    </span>
                  </div>
                  <input
                    type="text"
                    value={phone}
                    disabled
                    readOnly
                    placeholder="0911 223 344"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      border: '1.5px solid #e2e8f0',
                      background: '#f8fafc',
                      color: '#64748b',
                      fontSize: '0.95rem',
                      outline: 'none',
                      cursor: 'not-allowed'
                    }}
                  />
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.35rem' }}>
                    * Số điện thoại dùng để định danh tài khoản học viên và liên hệ lớp học (liên hệ Admin nếu cần thay đổi).
                  </div>
                </div>
              </div>

              {/* Submit Save Button */}
              <div>
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #A11D24 0%, #7f1d1d 100%)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 14px rgba(161, 29, 36, 0.25)'
                  }}
                >
                  <i className="fa-solid fa-floppy-disk"></i>
                  Lưu Thay Đổi Hồ Sơ
                </button>

                {saveSuccess && (
                  <div style={{ color: '#16a34a', fontWeight: 600, textAlign: 'center', marginTop: '0.75rem', fontSize: '0.9rem' }}>
                    ✓ Đã cập nhật thông tin và avatar thành công!
                  </div>
                )}
              </div>
            </form>
          )}

          {/* TAB 2: LEARNING & SUBMISSION HISTORY */}
          {activeTab === 'history' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
                  Tổng cộng: <strong>{SAMPLE_SUBMISSION_HISTORY.length} lượt nộp bài</strong>
                </span>
                <span style={{ fontSize: '0.82rem', color: '#16a34a', fontWeight: 600 }}>
                  <i className="fa-solid fa-circle-check"></i> Đã hoàn thành 100%
                </span>
              </div>

              {SAMPLE_SUBMISSION_HISTORY.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: '#fff',
                    border: '1px solid #fee2e2',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <span style={{
                        background: item.type.includes('HSK') ? '#fef3c7' : '#fef2f2',
                        color: item.type.includes('HSK') ? '#b45309' : '#A11D24',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}>
                        {item.type}
                      </span>
                      <h4 style={{ margin: '0.35rem 0 0.2rem 0', fontSize: '1rem', color: '#0f172a' }}>
                        {item.lesson}
                      </h4>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{item.course} · {item.date}</span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#A11D24' }}>
                        {item.score}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>
                        {item.status === 'passed' ? '✓ ĐẠT CHUẨN' : '✓ Đã chấm'}
                      </span>
                    </div>
                  </div>

                  {/* Teacher Feedback Note */}
                  <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.84rem', color: '#475569', borderLeft: '3px solid #A11D24', marginTop: '0.6rem' }}>
                    <strong>Nhận xét:</strong> {item.feedback}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
                  {unreadNotifsCount > 0 ? `Có ${unreadNotifsCount} thông báo mới chưa đọc` : 'Bạn đã đọc tất cả thông báo'}
                </span>
                {unreadNotifsCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    style={{ background: 'none', border: 'none', color: '#A11D24', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Đánh dấu đã đọc tất cả
                  </button>
                )}
              </div>

              {notifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    background: n.isRead ? '#ffffff' : '#fef2f2',
                    border: n.isRead ? '1px solid #f1f5f9' : '1.5px solid #fecaca',
                    borderRadius: '14px',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'flex-start'
                  }}
                >
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: n.type === 'grade' ? '#f0fdf4' : n.type === 'award' ? '#fef3c7' : '#fee2e2',
                    color: n.type === 'grade' ? '#16a34a' : n.type === 'award' ? '#d97706' : '#A11D24',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    flexShrink: 0
                  }}>
                    <i className={`fa-solid ${n.type === 'grade' ? 'fa-stamp' : n.type === 'award' ? 'fa-award' : 'fa-bell'}`}></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{n.title}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{n.time}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#475569', lineHeight: 1.5 }}>
                      {n.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: STATS */}
          {activeTab === 'stats' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: '#f8fafc', border: '1px solid #fee2e2', borderRadius: '16px', padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem' }}>🔥</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#A11D24', marginTop: '0.2rem' }}>
                    {currentStreak} Ngày
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Chuỗi học liên tục</div>
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #fee2e2', borderRadius: '16px', padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem' }}>⭐</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#c2410c', marginTop: '0.2rem' }}>
                    {currentTotalXp} XP
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Điểm tích lũy</div>
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #fee2e2', borderRadius: '16px', padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem' }}>⭐</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a', marginTop: '0.2rem' }}>9.4 / 10</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Điểm trung bình các bài</div>
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #fee2e2', borderRadius: '16px', padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem' }}>🎧</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563eb', marginTop: '0.2rem' }}>3.5 Giờ</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Thời gian luyện nghe</div>
                </div>
              </div>

              <div style={{ background: 'linear-gradient(135deg, #fef2f2 0%, #fff 100%)', border: '1px solid #fecaca', borderRadius: '16px', padding: '1.25rem' }}>
                <div style={{ fontWeight: 700, color: '#A11D24', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-graduation-cap"></i>
                  Đánh giá lộ trình HSK 2:
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#334155', lineHeight: 1.6 }}>
                  Bạn đã hoàn thành <strong>3/12 bài học</strong> của khóa HSK 2 và đạt kết quả <strong>160/200 điểm</strong> ở đề thi thử mô phỏng. Tiến độ rất khả quan để vượt qua kỳ thi HSK 2 thực tế!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
