import React, { useState } from 'react';
import { generateCurrentWeekDays, formatStreakMilestones } from '../utils/streakUtils';

export const StreakModal = ({ isOpen, onClose, streakData, onCheckInToday }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  if (!isOpen) return null;

  const currentStreak = Number(streakData?.currentStreak || 0);
  const longestStreak = Number(streakData?.longestStreak || currentStreak);
  const checkedInToday = Boolean(streakData?.checkedInToday);
  const totalXp = Number(streakData?.totalXp || 0);

  const weekDays = (Array.isArray(streakData?.weekDays) && streakData.weekDays.length === 7)
    ? streakData.weekDays
    : generateCurrentWeekDays(currentStreak, checkedInToday);

  const milestones = formatStreakMilestones(currentStreak, streakData?.milestones);

  const handleCheckInClick = async () => {
    if (isSubmitting || checkedInToday) return;
    setIsSubmitting(true);
    setFeedbackMsg(null);
    try {
      if (onCheckInToday) {
        await onCheckInToday();
        setFeedbackMsg('🎉 Điểm danh thành công! +50 XP đã được cộng vào tài khoản!');
      }
    } catch (err) {
      console.error('Streak check-in click error:', err);
      setFeedbackMsg('Đã ghi nhận điểm danh hôm nay.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="modal-backdrop" 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div 
        className="streak-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '520px',
          boxShadow: '0 25px 50px -12px rgba(161, 29, 36, 0.25), 0 0 0 1px rgba(254, 226, 226, 0.8)',
          overflow: 'hidden',
          animation: 'modalScaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header with Warm Flame Theme */}
        <div style={{
          background: 'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 50%, #ea580c 100%)',
          padding: '2rem 1.75rem 1.5rem',
          color: '#ffffff',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative Chinese Calligraphy watermark */}
          <span style={{
            position: 'absolute',
            right: '-15px',
            top: '-20px',
            fontSize: '8rem',
            fontFamily: 'Noto Serif SC, serif',
            color: 'rgba(255, 255, 255, 0.07)',
            pointerEvents: 'none',
            userSelect: 'none'
          }}>
            恒
          </span>

          <button
            type="button"
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: '#ffffff',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              transition: 'all 0.15s'
            }}
          >
            ✕
          </button>

          {/* Animated Big Flame Icon */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fed7aa 0%, #ffedd5 100%)',
            boxShadow: '0 0 30px rgba(234, 88, 12, 0.6), inset 0 2px 4px rgba(255,255,255,0.8)',
            marginBottom: '0.85rem'
          }}>
            <span style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 2px 8px rgba(234, 88, 12, 0.5))' }}>
              🔥
            </span>
          </div>

          <h2 style={{ margin: '0 0 0.35rem', fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Chuỗi {currentStreak} Ngày Học
          </h2>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#ffedd5', opacity: 0.95 }}>
            {checkedInToday 
              ? '🎉 Tuyệt vời! Bạn đã hoàn thành điểm danh ngày hôm nay (+50 XP).'
              : 'Học mỗi ngày để tích lũy kiến thức sâu sắc và thăng hạng trên BXH!'}
          </p>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Week Calendar Strip (T2 .. CN) */}
          <div style={{
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            borderRadius: '16px',
            padding: '1rem 0.85rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.85rem'
            }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#9f1239' }}>
                <i className="fa-regular fa-calendar-check"></i> Tuần này của bạn
              </span>
              <span style={{ fontSize: '0.78rem', color: '#be123c', fontWeight: 600 }}>
                Kỷ lục: <strong>{longestStreak} ngày liên tục</strong>
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
              {weekDays.map((item, idx) => (
                <div 
                  key={item.day}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 700, 
                    color: item.completed ? '#be123c' : '#94a3b8' 
                  }}>
                    {item.day}
                  </span>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: item.completed 
                      ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' 
                      : '#ffffff',
                    border: item.completed 
                      ? '2px solid #fda4af' 
                      : '2px dashed #cbd5e1',
                    color: item.completed ? '#ffffff' : '#cbd5e1',
                    fontSize: '0.9rem',
                    boxShadow: item.completed ? '0 4px 10px rgba(185, 28, 28, 0.3)' : 'none',
                    transition: 'all 0.2s'
                  }}>
                    {item.completed ? (
                      <i className="fa-solid fa-fire"></i>
                    ) : (
                      <i className="fa-regular fa-circle"></i>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button: Điểm danh ngay */}
          <div>
            {!checkedInToday ? (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleCheckInClick}
                style={{
                  width: '100%',
                  padding: '0.9rem 1.25rem',
                  borderRadius: '14px',
                  background: isSubmitting
                    ? '#94a3b8'
                    : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '1rem',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.65rem',
                  boxShadow: isSubmitting ? 'none' : '0 8px 20px rgba(185, 28, 28, 0.35)',
                  transition: 'all 0.2s',
                  transform: isSubmitting ? 'scale(0.99)' : 'none'
                }}
              >
                {isSubmitting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '1.2rem' }}></i>
                    <span>Đang ghi nhận điểm danh...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-fire-flame-curved" style={{ fontSize: '1.2rem', color: '#fed7aa' }}></i>
                    <span>Điểm Danh Ngay (+50 XP)</span>
                  </>
                )}
              </button>
            ) : (
              <div style={{
                background: '#ecfdf5',
                border: '1.5px solid #a7f3d0',
                borderRadius: '14px',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                color: '#065f46',
                fontWeight: 700,
                fontSize: '0.92rem',
                boxShadow: '0 2px 8px rgba(5, 150, 105, 0.12)'
              }}>
                <i className="fa-solid fa-circle-check" style={{ color: '#059669', fontSize: '1.2rem' }}></i>
                <span>Hôm nay bạn đã điểm danh thành công! Hẹn gặp lại vào ngày mai!</span>
              </div>
            )}

            {feedbackMsg && (
              <div style={{
                marginTop: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                fontSize: '0.84rem',
                fontWeight: 600,
                textAlign: 'center',
                background: '#f0fdf4',
                color: '#15803d',
                border: '1px solid #bbf7d0',
                animation: 'fadeIn 0.25s ease-out'
              }}>
                {feedbackMsg}
              </div>
            )}
          </div>

          {/* Streak Milestones */}
          <div>
            <h4 style={{ 
              margin: '0 0 0.65rem', 
              fontSize: '0.88rem', 
              fontWeight: 700, 
              color: '#334155',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              <i className="fa-solid fa-award" style={{ color: '#d97706' }}></i>
              <span>Cột Mốc Thử Thách Streak</span>
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {milestones.map((m) => (
                <div 
                  key={m.days}
                  style={{
                    background: m.unlocked ? '#fffbeb' : '#f8fafc',
                    border: m.unlocked ? '1px solid #fde68a' : '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '0.65rem 0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem'
                  }}
                >
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    background: m.unlocked ? '#f59e0b' : '#cbd5e1',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    flexShrink: 0
                  }}>
                    {m.unlocked ? '✓' : `${m.days}d`}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: m.unlocked ? '#92400e' : '#64748b' }}>
                      {m.label}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: m.unlocked ? '#b45309' : '#94a3b8' }}>
                      +{m.xpBonus} XP Thưởng
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Proverb Footer */}
          <div style={{
            borderTop: '1px solid #f1f5f9',
            paddingTop: '0.85rem',
            textAlign: 'center',
            fontSize: '0.82rem',
            color: '#64748b',
            fontStyle: 'italic'
          }}>
            "锲而不舍，金石可镂" — Kiên trì không bỏ cuộc, đá vàng cũng có thể chạm khắc.
          </div>

        </div>
      </div>
    </div>
  );
};
