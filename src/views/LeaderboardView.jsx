import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchLeaderboard } from '../services/supabaseService';

export const LeaderboardView = ({ onNavigate, classrooms = [] }) => {
  const { user } = useAuth();
  const [selectedClassId, setSelectedClassId] = useState('all'); // 'all' | 'hsk1-k02' | 'hsk1-k03' | 'hsk2-k01'
  const [timeRange, setTimeRange] = useState('weekly'); // 'weekly' | 'monthly' | 'allTime'
  const [isXpRulesOpen, setIsXpRulesOpen] = useState(false);
  const [entries, setEntries] = useState([]);
  const [loadError, setLoadError] = useState('');
  useEffect(() => {
    fetchLeaderboard().then(({ data, isLiveDb }) => {
      setEntries((data || []).map((item, index) => ({
        ...item, rank: index + 1, name: item.user_name, avatar: item.user_name?.slice(0, 1) || '学',
        xp: item.score, points: item.score, classId: item.classroom_id || 'all'
      })));
      if (!isLiveDb) setLoadError('Không thể kết nối bảng xếp hạng trên Supabase.');
    });
  }, []);

  const currentList = selectedClassId === 'all' ? entries : entries.filter((item) => item.classId === selectedClassId);

  const classOptions = [{ id: 'all', name: 'Toàn hệ thống' }, ...classrooms];
  const selectedClassInfo = classOptions.find((c) => c.id === selectedClassId);

  // Podium positions: 2nd (left), 1st (center), 3rd (right)
  const firstPlace = currentList[0];
  const secondPlace = currentList[1];
  const thirdPlace = currentList[2];
  const restList = currentList.slice(3);

  // Current user's entry in this leaderboard
  const currentUserEntry = currentList.find((item) => item.isCurrentUser || item.name.includes(user?.name || ''));

  if (loadError) return <main className="main-content" style={{ padding: '3rem 1rem', textAlign: 'center', color: '#991b1b' }}>{loadError}</main>;

  return (
    <div className="leaderboard-view-container" style={{ maxWidth: '1080px', margin: '0 auto', padding: '1.5rem 1rem 3rem' }}>
      {/* Header Banner */}
      <section style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #311042 50%, #450a0a 100%)',
        borderRadius: '24px',
        padding: '2.25rem 2rem',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 40px -15px rgba(49, 16, 66, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '2rem'
      }}>
        {/* Background decorative watermark */}
        <span style={{
          position: 'absolute',
          right: '10px',
          top: '-30px',
          fontSize: '11rem',
          fontFamily: 'Noto Serif SC, serif',
          color: 'rgba(255, 255, 255, 0.04)',
          pointerEvents: 'none',
          userSelect: 'none'
        }}>
          榜
        </span>

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(245, 158, 11, 0.18)',
              color: '#fde68a',
              padding: '0.4rem 0.85rem',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '0.75rem',
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}>
              <i className="fa-solid fa-crown" style={{ color: '#fbbf24' }}></i>
              <span>Vinh Danh Học Viên Xuất Sắc Hanzify</span>
            </div>
            <h1 style={{ margin: '0 0 0.5rem', fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Bảng Xếp Hạng Tranh Tài
            </h1>
            <p style={{ margin: 0, fontSize: '0.95rem', color: '#cbd5e1', maxWidth: '620px', lineHeight: 1.5 }}>
              Tích lũy điểm XP thông qua hoàn thành bài tập, thi thử HSK bấm giờ thật, duy trì chuỗi Streak và rèn luyện từ vựng mỗi ngày!
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setIsXpRulesOpen(true)}
              style={{
                padding: '0.65rem 1.15rem',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                transition: 'all 0.2s'
              }}
            >
              <i className="fa-solid fa-circle-question" style={{ color: '#fde68a' }}></i>
              <span>Quy Tắc Tính XP</span>
            </button>
          </div>
        </div>

        {/* Class Scope Selector & Time Range Tabs */}
        <div style={{
          marginTop: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          {/* Class Dropdown */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(10px)',
            padding: '0.35rem 0.75rem',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fde68a', whiteSpace: 'nowrap' }}>
              <i className="fa-solid fa-chalkboard-user"></i> Xếp Hạng:
            </span>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              style={{
                padding: '0.45rem 0.75rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                background: '#0f172a',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {classOptions.map((c) => (
                <option key={c.id} value={c.id} style={{ background: '#0f172a', color: '#ffffff' }}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Time Tabs Selector (Hiển thị khi chọn Toàn Hệ Thống) */}
          {selectedClassId === 'all' && (
            <div style={{
              display: 'inline-flex',
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(10px)',
              padding: '0.35rem',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              gap: '0.35rem'
            }}>
              <button
                type="button"
                onClick={() => setTimeRange('weekly')}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: timeRange === 'weekly' ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' : 'transparent',
                  color: timeRange === 'weekly' ? '#ffffff' : '#94a3b8',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  transition: 'all 0.2s'
                }}
              >
                <i className="fa-solid fa-calendar-week"></i>
                <span>Top Tuần Này</span>
              </button>

              <button
                type="button"
                onClick={() => setTimeRange('monthly')}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: timeRange === 'monthly' ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' : 'transparent',
                  color: timeRange === 'monthly' ? '#ffffff' : '#94a3b8',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  transition: 'all 0.2s'
                }}
              >
                <i className="fa-regular fa-calendar-days"></i>
                <span>Top Tháng Này</span>
              </button>

              <button
                type="button"
                onClick={() => setTimeRange('allTime')}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: timeRange === 'allTime' ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' : 'transparent',
                  color: timeRange === 'allTime' ? '#ffffff' : '#94a3b8',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  transition: 'all 0.2s'
                }}
              >
                <i className="fa-solid fa-globe"></i>
                <span>Tổng Tích Lũy</span>
              </button>
            </div>
          )}
        </div>

        {/* Fairness note for Class-based Leaderboard */}
        {selectedClassId !== 'all' && (
          <div style={{
            marginTop: '1.25rem',
            padding: '0.75rem 1.15rem',
            borderRadius: '14px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1.5px solid rgba(245, 158, 11, 0.35)',
            color: '#fef3c7',
            fontSize: '0.84rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem'
          }}>
            <i className="fa-solid fa-scale-balanced" style={{ color: '#fbbf24', fontSize: '1.15rem', flexShrink: 0 }}></i>
            <span>
              <strong>Bảng thi đua riêng của {selectedClassInfo?.name}:</strong> Toàn bộ học viên trong lớp có cùng số lượng bài học và bài tập bằng nhau ({selectedClassInfo?.totalLessons || 3} bài). So tài công bằng tuyệt đối 100%!
            </span>
          </div>
        )}
      </section>

      {/* RANKING CONTENT OR EMPTY STATE */}
      {currentList.length === 0 ? (
        <section style={{
          background: '#ffffff',
          borderRadius: '24px',
          border: '1.5px dashed #cbd5e1',
          padding: '3.5rem 2rem',
          textAlign: 'center',
          color: '#64748b',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          marginBottom: '2.5rem'
        }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🏆</div>
          <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', color: '#0f172a', fontWeight: 800 }}>
            Chưa Có Dữ Liệu Bảng Xếp Hạng
          </h3>
          <p style={{ margin: '0 auto 1.5rem', maxWidth: '520px', fontSize: '0.92rem', lineHeight: 1.6 }}>
            Học viên khi làm bài tập, điểm danh chuỗi ngày học hoặc tham gia thử thách game mini sẽ được tích lũy điểm kinh nghiệm (XP) và vinh danh trên bục tại đây!
          </p>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('courses')}
            style={{
              padding: '0.65rem 1.35rem',
              borderRadius: '12px',
              background: '#A11D24',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            Khám phá bài học & Tích lũy XP ngay
          </button>
        </section>
      ) : (
        <>
          {/* TOP 3 PODIUM (Bục Vinh Danh Olympic) */}
          <section style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.25rem',
            alignItems: 'flex-end',
            marginBottom: '2.5rem',
            padding: '0 0.5rem'
          }}>
            {/* HẠNG 2 (SILVER 🥈) */}
            {secondPlace && (
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            border: '2px solid #cbd5e1',
            padding: '1.5rem 1rem 1.25rem',
            textAlign: 'center',
            boxShadow: '0 10px 25px -5px rgba(100, 116, 139, 0.15)',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-16px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
              color: '#ffffff',
              borderRadius: '999px',
              padding: '0.25rem 0.85rem',
              fontSize: '0.78rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              boxShadow: '0 4px 10px rgba(100, 116, 139, 0.3)'
            }}>
              <span>🥈 HẠNG 2</span>
            </div>

            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: secondPlace.avatarBg || '#64748b',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              fontWeight: 700,
              fontFamily: 'Noto Serif SC, serif',
              margin: '0.75rem auto 0.65rem',
              border: '3px solid #e2e8f0',
              boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
            }}>
              {secondPlace.avatar}
            </div>

            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#1e293b' }}>
              {secondPlace.name}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.65rem' }}>
              {secondPlace.chineseName} • <span style={{ color: '#0369a1', fontWeight: 600 }}>{secondPlace.level}</span>
            </div>

            <div style={{
              background: '#f1f5f9',
              borderRadius: '10px',
              padding: '0.5rem',
              display: 'inline-block',
              fontWeight: 800,
              color: '#0f172a',
              fontSize: '1.15rem'
            }}>
              {secondPlace.xp.toLocaleString()} <span style={{ fontSize: '0.75rem', color: '#64748b' }}>XP</span>
            </div>
          </div>
        )}

        {/* HẠNG 1 (GOLD 👑 - Cao nhất) */}
        {firstPlace && (
          <div style={{
            background: 'linear-gradient(180deg, #fffbeb 0%, #ffffff 100%)',
            borderRadius: '24px',
            border: '2.5px solid #f59e0b',
            padding: '2rem 1.25rem 1.5rem',
            textAlign: 'center',
            boxShadow: '0 15px 35px -5px rgba(245, 158, 11, 0.25)',
            position: 'relative',
            transform: 'scale(1.05)',
            zIndex: 3
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#ffffff',
              borderRadius: '999px',
              padding: '0.35rem 1.15rem',
              fontSize: '0.85rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)'
            }}>
              <span>👑 QUÁN QUÂN</span>
            </div>

            <div style={{
              width: '78px',
              height: '78px',
              borderRadius: '50%',
              background: firstPlace.avatarBg || '#f59e0b',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 700,
              fontFamily: 'Noto Serif SC, serif',
              margin: '0.85rem auto 0.65rem',
              border: '4px solid #fde68a',
              boxShadow: '0 8px 20px rgba(245, 158, 11, 0.35)'
            }}>
              {firstPlace.avatar}
            </div>

            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#1e293b' }}>
              {firstPlace.name}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#92400e', fontWeight: 600, marginBottom: '0.75rem' }}>
              {firstPlace.chineseName} • <span style={{ background: '#fef3c7', padding: '2px 8px', borderRadius: '6px' }}>{firstPlace.level}</span>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              borderRadius: '12px',
              padding: '0.6rem 1.25rem',
              display: 'inline-block',
              fontWeight: 800,
              color: '#78350f',
              fontSize: '1.35rem',
              boxShadow: '0 2px 6px rgba(245, 158, 11, 0.2)'
            }}>
              {firstPlace.xp.toLocaleString()} <span style={{ fontSize: '0.8rem', color: '#92400e' }}>XP</span>
            </div>
          </div>
        )}

        {/* HẠNG 3 (BRONZE 🥉) */}
        {thirdPlace && (
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            border: '2px solid #fed7aa',
            padding: '1.5rem 1rem 1.25rem',
            textAlign: 'center',
            boxShadow: '0 10px 25px -5px rgba(217, 119, 6, 0.12)',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-16px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
              color: '#ffffff',
              borderRadius: '999px',
              padding: '0.25rem 0.85rem',
              fontSize: '0.78rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              boxShadow: '0 4px 10px rgba(217, 119, 6, 0.3)'
            }}>
              <span>🥉 HẠNG 3</span>
            </div>

            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: thirdPlace.avatarBg || '#d97706',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              fontWeight: 700,
              fontFamily: 'Noto Serif SC, serif',
              margin: '0.75rem auto 0.65rem',
              border: '3px solid #ffedd5',
              boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
            }}>
              {thirdPlace.avatar}
            </div>

            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#1e293b' }}>
              {thirdPlace.name}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.65rem' }}>
              {thirdPlace.chineseName} • <span style={{ color: '#0369a1', fontWeight: 600 }}>{thirdPlace.level}</span>
            </div>

            <div style={{
              background: '#fff7ed',
              borderRadius: '10px',
              padding: '0.5rem',
              display: 'inline-block',
              fontWeight: 800,
              color: '#9a3412',
              fontSize: '1.15rem'
            }}>
              {thirdPlace.xp.toLocaleString()} <span style={{ fontSize: '0.75rem', color: '#c2410c' }}>XP</span>
            </div>
          </div>
        )}
      </section>

      {/* DANH SÁCH CHI TIẾT CÁC HẠNG TIẾP THEO */}
      <section style={{
        background: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #fee2e2',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.15rem 1.5rem',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#fafafa'
        }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#1e293b' }}>
            <i className="fa-solid fa-list-ol" style={{ color: '#A11D24', marginRight: '0.5rem' }}></i>
            Top Học Viên Tranh Tài
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Cập nhật theo thời gian thực
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {restList.map((item) => {
            const isUser = item.isCurrentUser;
            return (
              <div 
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem 1.5rem',
                  borderBottom: '1px solid #f8fafc',
                  background: isUser ? '#fef2f2' : '#ffffff',
                  transition: 'all 0.15s',
                  gap: '1rem'
                }}
              >
                {/* Rank Number */}
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: isUser ? '#A11D24' : '#f1f5f9',
                  color: isUser ? '#ffffff' : '#64748b',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  #{item.rank}
                </div>

                {/* Avatar */}
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: item.avatarBg || '#e2e8f0',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  fontFamily: 'Noto Serif SC, serif',
                  flexShrink: 0
                }}>
                  {item.avatar}
                </div>

                {/* User Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>
                      {item.name}
                    </span>
                    {isUser && (
                      <span style={{
                        background: '#fee2e2',
                        color: '#991b1b',
                        padding: '1px 6px',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: 800
                      }}>
                        BẠN
                      </span>
                    )}
                    <span style={{
                      background: '#f1f5f9',
                      color: '#475569',
                      padding: '1px 6px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 600
                    }}>
                      {item.level}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                    {item.chineseName} • {item.badge}
                  </div>
                </div>

                {/* Activities Done & Fair Evaluation */}
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.8rem', color: '#64748b', flexWrap: 'wrap' }}>
                  {item.teacherGrade && (
                    <span style={{ color: '#047857', fontWeight: 700, background: '#ecfdf5', padding: '2px 7px', borderRadius: '6px' }} title="Điểm bài tập trung bình do Cô Hoài chấm">
                      ⭐ {item.teacherGrade}đ cô chấm
                    </span>
                  )}
                  {item.completionRate && (
                    <span style={{ color: '#0284c7', fontWeight: 700, background: '#f0f9ff', padding: '2px 7px', borderRadius: '6px' }} title="Tỷ lệ hoàn thành bài tập được giao của lớp">
                      🎯 {item.completionRate}% xong
                    </span>
                  )}
                  <span title="Số bài học đã xong">
                    <i className="fa-regular fa-folder-open" style={{ color: '#0ea5e9' }}></i> {item.lessonsCompleted} bài
                  </span>
                  <span title="Số đề thi thử đã làm">
                    <i className="fa-solid fa-flag-checkered" style={{ color: '#f59e0b' }}></i> {item.examsDone} đề
                  </span>
                </div>

                {/* XP Score */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: isUser ? '#A11D24' : '#0f172a' }}>
                    {item.xp.toLocaleString()} <span style={{ fontSize: '0.75rem', color: '#64748b' }}>XP</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* USER'S PINNED FOOTER CARD (Vị trí hiện tại của người dùng) */}
      {currentUserEntry && (
        <aside style={{
          position: 'sticky',
          bottom: '16px',
          marginTop: '1.5rem',
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: '18px',
          padding: '1rem 1.5rem',
          color: '#ffffff',
          boxShadow: '0 12px 30px rgba(15, 23, 42, 0.4), 0 0 0 1px rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: '#dc2626',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              #{currentUserEntry.rank}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.98rem' }}>
                Vị trí của bạn: Hạng #{currentUserEntry.rank} ({currentUserEntry.name})
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                {thirdPlace && currentUserEntry.rank > 3 ? (
                  <>Chỉ còn <strong style={{ color: '#fca5a5' }}>{(thirdPlace.xp - currentUserEntry.xp).toLocaleString()} XP</strong> nữa để lọt vào Top 3 vinh danh 🎯</>
                ) : (
                  <>Chúc mừng bạn đang nằm trong nhóm dẫn đầu bảng xếp hạng! 🚀</>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fde68a' }}>
                {currentUserEntry.xp.toLocaleString()} <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>XP</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('courses')}
              style={{
                padding: '0.55rem 1.15rem',
                borderRadius: '10px',
                background: '#A11D24',
                border: 'none',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 4px 12px rgba(161, 29, 36, 0.4)'
              }}
            >
              <i className="fa-solid fa-bolt"></i> Cày Thêm XP Ngay
            </button>
          </div>
        </aside>
      )}
      </>
      )}

      {/* MODAL: QUY TẮC TÍNH XP */}
      {isXpRulesOpen && (
        <div 
          className="modal-backdrop" 
          onClick={() => setIsXpRulesOpen(false)}
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
            padding: '1rem'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              maxWidth: '500px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#1e293b' }}>
                <i className="fa-solid fa-sparkles" style={{ color: '#f59e0b', marginRight: '0.4rem' }}></i>
                Cơ Chế Tích Lũy Điểm XP
              </h3>
              <button
                type="button"
                onClick={() => setIsXpRulesOpen(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  fontWeight: 700
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-book"></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>Hoàn thành bài tập về nhà</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Nộp bài đúng hạn và đạt điểm chấm</div>
                </div>
                <div style={{ fontWeight: 800, color: '#0284c7' }}>+100 XP</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-flag-checkered"></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>Thi thử HSK chuẩn quốc tế</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Điểm thi thực tế quy đổi trực tiếp sang XP</div>
                </div>
                <div style={{ fontWeight: 800, color: '#d97706' }}>+120 - 200 XP</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-fire"></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>Duy trì chuỗi ngày học Streak</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Điểm danh học tập mỗi ngày liên tiếp</div>
                </div>
                <div style={{ fontWeight: 800, color: '#dc2626' }}>+50 XP / ngày</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fdf4ff', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-gamepad"></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>Thắng Mini-game ôn bài</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Ghép từ, Luyện Pinyin, Thẻ nhớ Flashcard</div>
                </div>
                <div style={{ fontWeight: 800, color: '#a855f7' }}>+30 XP / ván</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-regular fa-comments"></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>Đóng góp trên diễn đàn</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Báo lỗi web hữu ích hoặc giải đáp bài khó</div>
                </div>
                <div style={{ fontWeight: 800, color: '#16a34a' }}>+20 XP</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
