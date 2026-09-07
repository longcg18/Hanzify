import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { BASE_PRACTICE_TOPICS, PRACTICE_TOPICS, countTotalPracticeQuestions } from '../data/practiceData';
import { buildVocabPracticeTopics } from '../data/vocabPracticeBuilder';
import { fetchVocabularies, addGameRewardXp } from '../services/supabaseService';
import { HSK_LEVELS } from '../data/hskVocabularyData';

export const PracticeView = () => {
  const { user, setIsAuthModalOpen } = useAuth();

  // Dynamic practice topics list (curated base + live vocabulary topics from DB)
  const [topicsList, setTopicsList] = useState(PRACTICE_TOPICS);
  const [isLoading, setIsLoading] = useState(false);

  // Filters
  const [selectedSkill, setSelectedSkill] = useState('all'); // 'all' | 'listening' | 'reading' | 'grammar' | 'pinyin' | 'hanzi'
  const [selectedLevel, setSelectedLevel] = useState('all'); // 'all' | 'HSK 1' ... 'HSK 6'
  const [searchQuery, setSearchQuery] = useState('');

  // Active practice runner state
  const [activeTopic, setActiveTopic] = useState(null);
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [sessionAnswers, setSessionAnswers] = useState([]);
  const [isSessionFinished, setIsSessionFinished] = useState(false);
  const [sessionXpEarned, setSessionXpEarned] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Fetch live vocabularies from Supabase and integrate into skill topics
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchVocabularies()
      .then((res) => {
        const items = Array.isArray(res) ? res : res?.data || [];
        if (isMounted && items.length > 0) {
          const liveVocabTopics = buildVocabPracticeTopics(items);
          setTopicsList([...BASE_PRACTICE_TOPICS, ...liveVocabTopics]);
        }
      })
      .catch((err) => {
        console.warn('PracticeView: using static practice dataset', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter topics based on skill, level, and search keyword
  const filteredTopics = useMemo(() => {
    return topicsList.filter((t) => {
      const matchSkill = selectedSkill === 'all' || t.skill === selectedSkill;
      const matchLevel = selectedLevel === 'all' || t.level === selectedLevel;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q) ||
        t.skillLabel.toLowerCase().includes(q);
      return matchSkill && matchLevel && matchSearch;
    });
  }, [topicsList, selectedSkill, selectedLevel, searchQuery]);

  // Audio speech synthesis helper
  const playChineseAudio = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'zh-CN';
      u.rate = 0.92;
      u.onstart = () => setIsAudioPlaying(true);
      u.onend = () => setIsAudioPlaying(false);
      window.speechSynthesis.speak(u);
    }
  };

  /**
   * Helper: Chọn đúng 10 câu ngẫu nhiên và đảm bảo KHÔNG bị trùng lặp chữ/từ liên tiếp
   */
  const pickTenQuestions = (rawQuestions) => {
    if (!rawQuestions || rawQuestions.length === 0) return [];
    const pool = [...rawQuestions].sort(() => 0.5 - Math.random());
    const selected = [];
    const usedWords = new Set();

    // Pass 1: Ưu tiên chọn các câu có từ vựng / chủ đề khác nhau
    for (const q of pool) {
      const key = (q.targetWord || q.prompt || '').trim().toLowerCase();
      if (!usedWords.has(key)) {
        selected.push(q);
        usedWords.add(key);
        if (selected.length === 10) break;
      }
    }

    // Pass 2: Nếu chưa đủ 10 câu, nạp thêm từ các câu còn lại trong pool
    if (selected.length < 10) {
      for (const q of pool) {
        if (!selected.includes(q)) {
          selected.push(q);
          if (selected.length === 10) break;
        }
      }
    }

    return selected;
  };

  // Khởi động làm bài 1 chuyên đề (10 câu)
  const handleStartPractice = (topic) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    const tenQs = pickTenQuestions(topic.questions);
    setActiveTopic(topic);
    setActiveQuestions(tenQs);
    setCurrentQIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setSessionScore(0);
    setSessionAnswers([]);
    setIsSessionFinished(false);
    setSessionXpEarned(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Làm tiếp một lượt mới (10 câu mới) trong cùng chuyên đề
  const handleRestartSession = () => {
    if (!activeTopic) return;
    const tenQs = pickTenQuestions(activeTopic.questions);
    setActiveQuestions(tenQs);
    setCurrentQIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setSessionScore(0);
    setSessionAnswers([]);
    setIsSessionFinished(false);
    setSessionXpEarned(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Chọn đáp án
  const handleSelectAnswer = (idx) => {
    if (isAnswered || !activeQuestions[currentQIdx]) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const q = activeQuestions[currentQIdx];
    const isCorrect = idx === q.correct;
    if (isCorrect) {
      setSessionScore((prev) => prev + 1);
      confetti({
        particleCount: 35,
        spread: 45,
        origin: { y: 0.75 },
        colors: ['#A11D24', '#16a34a', '#D4AF37']
      });
    }

    setSessionAnswers((prev) => [
      ...prev,
      {
        question: q,
        selectedOption: idx,
        isCorrect
      }
    ]);
  };

  // Chuyển sang câu tiếp theo hoặc kết thúc lượt 10 câu
  const handleNextQ = async () => {
    if (currentQIdx < activeQuestions.length - 1) {
      setCurrentQIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Hoàn thành lượt 10 câu!
      setIsSessionFinished(true);
      const totalQ = activeQuestions.length;
      const finalScore = sessionScore;
      const accuracy = totalQ > 0 ? finalScore / totalQ : 0;
      const baseReward = 35;
      const scoreBonus = Math.round(accuracy * 35);
      const perfectBonus = finalScore === totalQ ? 20 : 0;
      const earnedXp = baseReward + scoreBonus + perfectBonus;
      setSessionXpEarned(earnedXp);

      if (user?.id) {
        try {
          await addGameRewardXp(user.id, earnedXp, {
            gameTitle: activeTopic.title,
            level: activeTopic.level
          });
        } catch (e) {
          console.warn('Could not sync practice XP:', e);
        }
      }

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#A11D24', '#16a34a', '#D4AF37']
      });
    }
  };

  // Tổng số câu hỏi trong toàn bộ ngân hàng
  const totalQuestions = useMemo(() => countTotalPracticeQuestions(topicsList), [topicsList]);

  return (
    <main className="main-content" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 1rem 2.5rem' }}>
      {/* Header Banner - Unified, Sleek & Compact */}
      {!activeTopic && (
        <div
          style={{
            background:
              user?.role === 'admin'
                ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #fffbfb 100%)',
            border: user?.role === 'admin' ? '1px solid #334155' : '1px solid #fee2e2',
            borderRadius: '16px',
            padding: '1.1rem 1.4rem',
            marginBottom: '1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.85rem',
            boxShadow:
              user?.role === 'admin'
                ? '0 4px 20px rgba(0, 0, 0, 0.2)'
                : '0 4px 16px rgba(161, 29, 36, 0.04)',
            color: user?.role === 'admin' ? '#f8fafc' : undefined
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span
                style={{
                  background: user?.role === 'admin' ? 'rgba(254, 202, 202, 0.15)' : '#fef2f2',
                  color: user?.role === 'admin' ? '#fca5a5' : '#A11D24',
                  padding: '2px 8px',
                  borderRadius: '8px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  border: user?.role === 'admin' ? '1px solid rgba(254, 202, 202, 0.25)' : '1px solid #fecaca'
                }}
              >
                {user?.role === 'admin' ? '👑 Quản Trị Kỹ Năng' : '🎯 Luyện Kỹ Năng'}
              </span>
              <span
                style={{
                  fontSize: '0.85rem',
                  color: user?.role === 'admin' ? '#fca5a5' : '#A11D24',
                  fontFamily: 'Noto Serif SC, serif',
                  fontWeight: 600
                }}
              >
                技能与词汇专项练习
              </span>
            </div>
            <h1
              style={{
                margin: '0 0 0.2rem 0',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: user?.role === 'admin' ? '#f8fafc' : '#0f172a'
              }}
            >
              {user?.role === 'admin' ? 'Quản Trị Ngân Hàng Kỹ Năng' : 'Luyện Tập Kỹ Năng Tiếng Trung'}
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: '0.82rem',
                color: user?.role === 'admin' ? '#94a3b8' : '#64748b'
              }}
            >
              {user?.role === 'admin'
                ? 'Quản lý ngân hàng câu hỏi phân theo 5 kỹ năng (Nghe, Đọc, Ngữ Pháp, Pinyin, Chữ Hán) qua tất cả 6 cấp độ HSK.'
                : `Luyện sâu từng kỹ năng Nghe, Đọc, Ngữ Pháp, Pinyin, Chữ Hán theo cấp độ HSK 1 đến HSK 6 với ${totalQuestions} câu hỏi phong phú, mỗi lượt 10 câu ngẫu nhiên.`}
            </p>
          </div>

          {/* Badges */}
          {user?.role === 'admin' ? (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => alert('Mở form tạo Chuyên đề luyện kỹ năng mới.')}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: '10px',
                  background: '#A11D24',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 2px 8px rgba(161, 29, 36, 0.3)'
                }}
              >
                <i className="fa-solid fa-plus"></i> Thêm Chuyên Đề
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '10px',
                  fontSize: '0.78rem',
                  color: '#475569',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <i className="fa-solid fa-book-open" style={{ color: '#A11D24' }}></i>
                5 Kỹ năng
              </span>
              <span
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '10px',
                  fontSize: '0.78rem',
                  color: '#475569',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <i className="fa-solid fa-layer-group" style={{ color: '#d97706' }}></i>
                HSK 1 - 6
              </span>
              <span
                style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '10px',
                  fontSize: '0.78rem',
                  color: '#15803d',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <i className="fa-solid fa-circle-check" style={{ color: '#16a34a' }}></i>
                {topicsList.length} Chuyên đề
              </span>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. RUNNER VIEW (Gọn gàng, vừa vặn trên màn hình không phải cuộn)          */}
      {/* ========================================================================= */}
      {activeTopic ? (
        <div
          style={{
            maxWidth: '740px',
            margin: '0 auto',
            background: '#fff',
            border: '1.5px solid #fee2e2',
            borderRadius: '18px',
            padding: '1.25rem 1.5rem',
            boxShadow: '0 8px 30px rgba(0,0,0,0.03)'
          }}
        >
          {/* TRƯỜNG HỢP 1: ĐÃ HOÀN THÀNH LƯỢT 10 CÂU -> BẢNG TỔNG KẾT & ÔN TẬP */}
          {isSessionFinished ? (
            <div>
              {/* Header tổng kết */}
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.35rem' }}>🎉</div>
                <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '1.35rem', color: '#0f172a', fontWeight: 800 }}>
                  Hoàn Thành Lượt Luyện Tập!
                </h2>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  {activeTopic.title} · <strong style={{ color: '#A11D24' }}>{activeTopic.level}</strong>
                </div>
              </div>

              {/* Thống kê điểm & XP */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1.25rem'
                }}
              >
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '0.9rem',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    Độ Chính Xác
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#15803d', marginTop: '2px' }}>
                    {sessionScore} / {activeQuestions.length}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Đạt {Math.round((sessionScore / (activeQuestions.length || 1)) * 100)}%
                  </div>
                </div>

                <div
                  style={{
                    background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                    border: '1px solid #fde68a',
                    borderRadius: '14px',
                    padding: '0.9rem',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b45309', textTransform: 'uppercase' }}>
                    Điểm Thưởng Nhận Được
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#d97706', marginTop: '2px' }}>
                    +{sessionXpEarned} XP
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#b45309', fontWeight: 600 }}>
                    {sessionScore === activeQuestions.length ? 'Xuất sắc tuyệt đối ⭐' : 'Đã cộng vào hồ sơ 🔥'}
                  </div>
                </div>
              </div>

              {/* Danh sách câu hỏi cần ôn lại (Câu sai) */}
              {(() => {
                const wrongAnswers = sessionAnswers.filter((a) => !a.isCorrect);

                if (wrongAnswers.length === 0) {
                  return (
                    <div
                      style={{
                        background: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        borderRadius: '12px',
                        padding: '0.9rem 1.1rem',
                        marginBottom: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem'
                      }}
                    >
                      <i className="fa-solid fa-circle-check" style={{ color: '#16a34a', fontSize: '1.2rem' }}></i>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#15803d' }}>
                          Tuyệt vời! Bạn không làm sai câu nào trong lượt luyện này.
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#166534' }}>
                          Kiến thức chuyên đề này của bạn đã rất vững chắc.
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: '#991b1b',
                        marginBottom: '0.65rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <i className="fa-solid fa-book-bookmark"></i>
                      Kiến thức cần ôn lại ({wrongAnswers.length} câu chưa đúng):
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '260px', overflowY: 'auto', paddingRight: '4px' }}>
                      {wrongAnswers.map((item, idx) => {
                        const q = item.question;
                        const userChoice = q.options[item.selectedOption] || 'Chưa chọn';
                        const correctChoice = q.options[q.correct] || '';

                        return (
                          <div
                            key={idx}
                            style={{
                              background: '#fef2f2',
                              border: '1px solid #fecaca',
                              borderRadius: '10px',
                              padding: '0.75rem 1rem',
                              fontSize: '0.82rem'
                            }}
                          >
                            <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                              {idx + 1}. {q.prompt}
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                              <span style={{ color: '#dc2626' }}>
                                Bạn đã chọn: <strong>{userChoice}</strong> ✗
                              </span>
                              <span style={{ color: '#15803d' }}>
                                Đáp án đúng: <strong>{correctChoice}</strong> ✓
                              </span>
                            </div>
                            {q.explain && (
                              <div style={{ color: '#475569', fontSize: '0.78rem', borderTop: '1px dashed #fca5a5', paddingTop: '0.35rem', marginTop: '0.35rem' }}>
                                💡 {q.explain}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Hỏi user có muốn làm tiếp không */}
              <div
                style={{
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '1rem',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.75rem',
                  flexWrap: 'wrap'
                }}
              >
                <button
                  type="button"
                  onClick={handleRestartSession}
                  style={{
                    padding: '0.6rem 1.4rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #A11D24 0%, #7f1d1d 100%)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    boxShadow: '0 2px 8px rgba(161, 29, 36, 0.25)'
                  }}
                >
                  <i className="fa-solid fa-rotate-right"></i> Làm tiếp lượt mới (10 câu mới)
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTopic(null)}
                  style={{
                    padding: '0.6rem 1.2rem',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    background: '#fff',
                    color: '#475569',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <i className="fa-solid fa-arrow-left"></i> Chọn chuyên đề khác
                </button>
              </div>
            </div>
          ) : (
            /* TRƯỜNG HỢP 2: ĐANG LÀM CÂU HỎI TRONG LƯỢT 10 CÂU (GỌN GÀNG, KHÔNG CUỘN) */
            <>
              {/* Header của runner */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.85rem',
                  borderBottom: '1px solid #f1f5f9',
                  paddingBottom: '0.65rem'
                }}
              >
                <div>
                  <span
                    style={{
                      background: '#fef2f2',
                      color: '#A11D24',
                      padding: '2px 8px',
                      borderRadius: '8px',
                      fontSize: '0.74rem',
                      fontWeight: 700
                    }}
                  >
                    {activeTopic.skillLabel} · {activeTopic.level}
                  </span>
                  <h3 style={{ margin: '0.3rem 0 0 0', color: '#0f172a', fontSize: '1.05rem', fontWeight: 800 }}>
                    {activeTopic.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTopic(null)}
                  style={{
                    background: 'none',
                    border: '1px solid #cbd5e1',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    color: '#64748b',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <i className="fa-solid fa-arrow-left"></i> Đổi bài
                </button>
              </div>

              {/* Progress bar inside session */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.78rem',
                  color: '#64748b',
                  marginBottom: '0.35rem'
                }}
              >
                <span>
                  Tiến độ: Câu <strong>{currentQIdx + 1}</strong> / {activeQuestions.length}
                </span>
                <span>
                  Đúng: <strong style={{ color: '#15803d' }}>{sessionScore}</strong> câu
                </span>
              </div>
              <div
                style={{
                  height: '4px',
                  background: '#f1f5f9',
                  borderRadius: '2px',
                  marginBottom: '1rem',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    width: `${((currentQIdx + 1) / (activeQuestions.length || 1)) * 100}%`,
                    height: '100%',
                    background: '#A11D24',
                    transition: 'width 0.25s ease'
                  }}
                ></div>
              </div>

              {/* Question Content */}
              {(() => {
                const q = activeQuestions[currentQIdx];
                if (!q) return null;

                return (
                  <div>
                    {/* Câu hỏi prompt */}
                    <div
                      style={{
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        marginBottom: '0.75rem',
                        lineHeight: 1.4
                      }}
                    >
                      {q.prompt}
                    </div>

                    {/* Thanh audio nếu câu hỏi có âm thanh */}
                    {q.audio && (
                      <div
                        style={{
                          background: 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)',
                          padding: '0.65rem 0.9rem',
                          borderRadius: '10px',
                          color: '#fff',
                          marginBottom: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem'
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => playChineseAudio(q.audio)}
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: '#fff',
                            color: '#A11D24',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.95rem',
                            flexShrink: 0
                          }}
                        >
                          <i className={`fa-solid ${isAudioPlaying ? 'fa-volume-high' : 'fa-play'}`}></i>
                        </button>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                            {isAudioPlaying ? 'Đang phát âm thanh...' : 'Bấm để nghe phát âm'}
                          </div>
                          {q.pinyin && <div style={{ fontSize: '0.75rem', color: '#fef08a' }}>{q.pinyin}</div>}
                        </div>
                      </div>
                    )}

                    {/* 4 Phương án lựa chọn (Gọn gàng) */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem', marginBottom: '0.85rem' }}>
                      {q.options.map((opt, idx) => {
                        const isSelected = selectedOption === idx;
                        const isCorrect = idx === q.correct;
                        let bg = '#ffffff';
                        let border = '1px solid #cbd5e1';

                        if (isAnswered) {
                          if (isCorrect) {
                            bg = '#f0fdf4';
                            border = '1.5px solid #22c55e';
                          } else if (isSelected) {
                            bg = '#fef2f2';
                            border = '1.5px solid #ef4444';
                          }
                        }

                        return (
                          <div
                            key={idx}
                            onClick={() => handleSelectAnswer(idx)}
                            style={{
                              padding: '0.65rem 0.95rem',
                              borderRadius: '10px',
                              background: bg,
                              border: border,
                              cursor: isAnswered ? 'default' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                              transition: 'all 0.12s ease'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                              <span
                                style={{
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '50%',
                                  background: isSelected ? '#A11D24' : '#f1f5f9',
                                  color: isSelected ? '#fff' : '#64748b',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.78rem',
                                  fontWeight: 700
                                }}
                              >
                                {String.fromCharCode(65 + idx)}
                              </span>
                              <span style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 600 }}>
                                {opt}
                              </span>
                            </div>
                            {isAnswered && isCorrect && (
                              <i className="fa-solid fa-circle-check" style={{ color: '#22c55e', fontSize: '1.1rem' }}></i>
                            )}
                            {isAnswered && isSelected && !isCorrect && (
                              <i className="fa-solid fa-circle-xmark" style={{ color: '#ef4444', fontSize: '1.1rem' }}></i>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Giải thích chi tiết & Nút câu tiếp theo (Hiển thị ngay trong tầm mắt) */}
                    {isAnswered && (
                      <div
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          borderLeft: '4px solid #A11D24',
                          borderRadius: '10px',
                          padding: '0.75rem 1rem',
                          marginBottom: '0.85rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '1rem',
                          flexWrap: 'wrap'
                        }}
                      >
                        <div style={{ flex: 1, minWidth: '240px' }}>
                          <div style={{ fontWeight: 700, color: '#A11D24', fontSize: '0.8rem', marginBottom: '2px' }}>
                            Giải thích chi tiết:
                          </div>
                          <div style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.4 }}>
                            {q.explain}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleNextQ}
                          style={{
                            background: 'linear-gradient(135deg, #A11D24 0%, #7f1d1d 100%)',
                            color: '#fff',
                            border: 'none',
                            padding: '0.55rem 1.4rem',
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            boxShadow: '0 2px 8px rgba(161, 29, 36, 0.25)',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <span>{currentQIdx < activeQuestions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}</span>
                          <i className="fa-solid fa-arrow-right"></i>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </>
          )}
        </div>
      ) : (
        /* ========================================================================= */
        /* 2. CATALOG VIEW (Giao diện luyện tập tự do theo kỹ năng và cấp độ)       */
        /* ========================================================================= */
        <>
          {/* Skill Filter Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            {[
              { id: 'all', label: 'Tất Cả Kỹ Năng' },
              { id: 'listening', label: '🎧 Luyện Nghe' },
              { id: 'reading', label: '📖 Đọc Hiểu' },
              { id: 'grammar', label: '🧩 Ngữ Pháp' },
              { id: 'pinyin', label: '📝 Pinyin & Thanh Điệu' },
              { id: 'hanzi', label: '✍️ Chữ Hán & Từ Vựng' }
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedSkill(s.id)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '12px',
                  border: selectedSkill === s.id ? '1.5px solid #A11D24' : '1px solid #e2e8f0',
                  background: selectedSkill === s.id ? '#A11D24' : '#fff',
                  color: selectedSkill === s.id ? '#fff' : '#475569',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Level Filter Tags + Search Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '2rem'
            }}
          >
            {/* Level Pills: explicitly HSK 1 through HSK 6 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Cấp độ:</span>
              {['all', ...HSK_LEVELS].map((lvl) => {
                const isSelected = selectedLevel === lvl;
                const count = lvl === 'all'
                  ? topicsList.length
                  : topicsList.filter((t) => t.level === lvl).length;

                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSelectedLevel(lvl)}
                    style={{
                      padding: '0.35rem 0.8rem',
                      borderRadius: '8px',
                      border: isSelected ? '1px solid #fca5a5' : '1px solid #e2e8f0',
                      background: isSelected ? '#fee2e2' : '#ffffff',
                      color: isSelected ? '#A11D24' : '#64748b',
                      fontWeight: isSelected ? 700 : 500,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{lvl === 'all' ? 'Tất cả cấp độ' : lvl}</span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        padding: '1px 5px',
                        borderRadius: '6px',
                        background: isSelected ? 'rgba(161, 29, 36, 0.12)' : '#f1f5f9',
                        color: isSelected ? '#A11D24' : '#64748b',
                        fontWeight: 700
                      }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Topic Search Input */}
            <div style={{ position: 'relative', minWidth: '220px', flex: '0 1 280px' }}>
              <i
                className="fa-solid fa-magnifying-glass"
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  fontSize: '0.8rem'
                }}
              ></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm chuyên đề luyện tập..."
                style={{
                  width: '100%',
                  padding: '0.45rem 0.75rem 0.45rem 2rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.82rem',
                  outline: 'none',
                  background: '#ffffff'
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.75rem'
                  }}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>
          </div>

          {/* Topic Cards Grid */}
          {filteredTopics.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '3rem 1rem',
                background: '#fff',
                borderRadius: '16px',
                border: '1px dashed #cbd5e1'
              }}
            >
              <i className="fa-solid fa-inbox" style={{ fontSize: '2.5rem', color: '#cbd5e1', marginBottom: '0.75rem' }}></i>
              <div style={{ fontWeight: 600, color: '#64748b' }}>
                Không tìm thấy chuyên đề phù hợp với lựa chọn của bạn.
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedSkill('all');
                  setSelectedLevel('all');
                  setSearchQuery('');
                }}
                style={{
                  marginTop: '1rem',
                  padding: '0.45rem 1rem',
                  borderRadius: '8px',
                  background: '#A11D24',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                Đặt lại bộ lọc
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {filteredTopics.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: '#fff',
                    border: '1px solid #fee2e2',
                    borderRadius: '18px',
                    padding: '1.5rem',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.75rem'
                      }}
                    >
                      <span
                        style={{
                          background: '#fef2f2',
                          color: '#A11D24',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '10px',
                          fontSize: '0.78rem',
                          fontWeight: 700
                        }}
                      >
                        {item.skillLabel}
                      </span>
                      <span
                        style={{
                          background: '#f8fafc',
                          color: '#64748b',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '10px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          border: '1px solid #e2e8f0'
                        }}
                      >
                        {item.level}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', color: '#0f172a', margin: '0 0 0.5rem 0', lineHeight: 1.4 }}>
                      {item.title}
                    </h3>

                    <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                      {item.desc}
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: '1px solid #f1f5f9',
                      paddingTop: '1rem'
                    }}
                  >
                    <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      <i className="fa-solid fa-layer-group" style={{ color: '#A11D24', marginRight: '0.35rem' }}></i>
                      10 câu ngẫu nhiên / lượt
                    </span>

                    <button
                      type="button"
                      onClick={() => handleStartPractice(item)}
                      style={{
                        background: 'linear-gradient(135deg, #A11D24 0%, #7f1d1d 100%)',
                        color: '#fff',
                        border: 'none',
                        padding: '0.55rem 1.25rem',
                        borderRadius: '10px',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        boxShadow: '0 2px 8px rgba(161, 29, 36, 0.25)'
                      }}
                    >
                      {!user && <i className="fa-solid fa-lock" style={{ fontSize: '0.75rem' }}></i>}
                      <span>{user ? 'Luyện Ngay' : 'Đăng nhập để luyện'}</span>
                      <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.75rem' }}></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
};
