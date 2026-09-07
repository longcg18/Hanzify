import React, { useState } from 'react';
import { generateCurrentWeekDays, formatStreakMilestones } from '../utils/streakUtils';

export const StreakModal = ({ isOpen, onClose, streakData, onCheckInToday }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    try {
      if (onCheckInToday) {
        await onCheckInToday();
      }
    } catch (err) {
      console.error('Streak check-in click error:', err);
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
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '0.75rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div 
        className="streak-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '430px',
          maxHeight: '90vh',
          boxShadow: '0 25px 50px -12px rgba(161, 29, 36, 0.25), 0 0 0 1px rgba(254, 226, 226, 0.8)',
          overflowY: 'auto',
          animation: 'modalScaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header with Warm Flame Theme (Compact) */}
        <div style={{
          background: 'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 50%, #ea580c 100%)',
          padding: '1.25rem 1.25rem 0.95rem',
          color: '#ffffff',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative Calligraphy watermark */}
          <span style={{
            position: 'absolute',
            right: '-10px',
            top: '-15px',
            fontSize: '5.5rem',
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
              top: '12px',
              right: '12px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: '#ffffff',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem',
              transition: 'all 0.15s'
            }}
          >
            ✕
          </button>

          {/* Animated Flame Icon */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fed7aa 0%, #ffedd5 100%)',
            boxShadow: '0 0 20px rgba(234, 88, 12, 0.5), inset 0 2px 4px rgba(255,255,255,0.8)',
            marginBottom: '0.45rem'
          }}>
            <span style={{ fontSize: '1.8rem', filter: 'drop-shadow(0 2px 6px rgba(234, 88, 12, 0.5))' }}>
              🔥
            </span>
          </div>

          <h2 style={{ margin: '0 0 0.2rem', fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Chuỗi {currentStreak} Ngày Học
          </h2>
          <p style={{ margin: 0, fontSize: '0.82rem', color: '#ffedd5', opacity: 0.95, lineHeight: 1.35 }}>
            {checkedInToday 
              ? '🎉 Tuyệt vời! Bạn đã hoàn thành điểm danh ngày hôm nay (+50 XP).'
              : 'Học mỗi ngày để tích lũy phản xạ Hoa ngữ và thăng hạng!'}
          </p>
        </div>

        {/* Modal Body (Compact) */}
        <div style={{ padding: '0.95rem 1.15rem 1.15rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          
          {/* Week Calendar Strip */}
          <div style={{
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            borderRadius: '14px',
            padding: '0.65rem 0.75rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.45rem'
            }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#9f1239' }}>
                <i className="fa-regular fa-calendar-check"></i> Tuần này của bạn
              </span>
              <span style={{ fontSize: '0.72rem', color: '#be123c', fontWeight: 600 }}>
                Kỷ lục: <strong>{longestStreak} ngày</strong>
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
              {weekDays.map((item) => (
                <div 
                  key={item.day}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '3px'
                  }}
                >
                  <span style={{ 
                    fontSize: '0.68rem', 
                    fontWeight: 700, 
                    color: item.completed ? '#be123c' : '#94a3b8' 
                  }}>
                    {item.day}
                  </span>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: item.completed 
                      ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' 
                      : '#ffffff',
                    border: item.completed 
                      ? '1.5px solid #fda4af' 
                      : '1.5px dashed #cbd5e1',
                    color: item.completed ? '#ffffff' : '#cbd5e1',
                    fontSize: '0.72rem',
                    boxShadow: item.completed ? '0 2px 6px rgba(185, 28, 28, 0.25)' : 'none'
                  }}>
                    {item.completed ? (
                      <i className="fa-solid fa-fire"></i>
                    ) : (
                      <i className="fa-regular fa-circle" style={{ fontSize: '0.65rem' }}></i>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button: Điểm danh ngay / Đã điểm danh */}
          <div>
            {!checkedInToday ? (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleCheckInClick}
                style={{
                  width: '100%',
                  padding: '0.72rem 1rem',
                  borderRadius: '12px',
                  background: isSubmitting
                    ? '#94a3b8'
                    : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.55rem',
                  boxShadow: isSubmitting ? 'none' : '0 6px 16px rgba(185, 28, 28, 0.3)',
                  transition: 'all 0.2s'
                }}
              >
                {isSubmitting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '1rem' }}></i>
                    <span>Đang ghi nhận...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-fire-flame-curved" style={{ fontSize: '1.05rem', color: '#fed7aa' }}></i>
                    <span>Điểm Danh Ngay (+50 XP)</span>
                  </>
                )}
              </button>
            ) : (
              <div style={{
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '12px',
                padding: '0.65rem 0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.55rem',
                color: '#065f46',
                fontWeight: 700,
                fontSize: '0.82rem',
                boxShadow: '0 2px 6px rgba(5, 150, 105, 0.08)'
              }}>
                <i className="fa-solid fa-circle-check" style={{ color: '#059669', fontSize: '1rem' }}></i>
                <span>Hôm nay bạn đã điểm danh (+50 XP)! Hẹn gặp lại ngày mai!</span>
              </div>
            )}
          </div>

          {/* Streak Milestones (Compact 2x2 grid) */}
          <div>
            <h4 style={{ 
              margin: '0 0 0.4rem', 
              fontSize: '0.78rem', 
              fontWeight: 700, 
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <i className="fa-solid fa-award" style={{ color: '#d97706' }}></i>
              <span>Cột Mốc Thử Thách Streak</span>
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {milestones.map((m) => (
                <div 
                  key={m.days}
                  style={{
                    background: m.unlocked ? '#fffbeb' : '#f8fafc',
                    border: m.unlocked ? '1px solid #fde68a' : '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '0.45rem 0.6rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem'
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    background: m.unlocked ? '#f59e0b' : '#cbd5e1',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    flexShrink: 0
                  }}>
                    {m.unlocked ? '✓' : `${m.days}d`}
                  </div>
                  <div style={{ minWidth: 0, overflow: 'hidden' }}>
                    <div style={{ 
                      fontSize: '0.72rem', 
                      fontWeight: 700, 
                      color: m.unlocked ? '#92400e' : '#64748b',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {m.label}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: m.unlocked ? '#b45309' : '#94a3b8' }}>
                      +{m.xpBonus} XP Thưởng
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Proverb Footer (Compact) */}
          <div style={{
            borderTop: '1px solid #f1f5f9',
            paddingTop: '0.45rem',
            textAlign: 'center',
            fontSize: '0.72rem',
            color: '#64748b',
            fontStyle: 'italic'
          }}>
            "锲而不舍，金石可镂" — Kiên trì không bỏ cuộc, đá vàng cũng chạm khắc.
          </div>

        </div>
      </div>
    </div>
  );
};
