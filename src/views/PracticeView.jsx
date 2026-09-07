import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { BASE_PRACTICE_TOPICS, PRACTICE_TOPICS, countTotalPracticeQuestions } from '../data/practiceData';
import { buildVocabPracticeTopics } from '../data/vocabPracticeBuilder';
import { fetchVocabularies } from '../services/supabaseService';
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
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
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

  // Runner controls
  const handleStartPractice = (topic) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setActiveTopic(topic);
    setCurrentQIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setSessionScore(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAnswer = (idx) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const q = activeTopic.questions[currentQIdx];
    if (idx === q.correct) {
      setSessionScore((prev) => prev + 1);
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#A11D24', '#16a34a', '#D4AF37']
      });
    }
  };

  const handleNextQ = () => {
    if (currentQIdx < activeTopic.questions.length - 1) {
      setCurrentQIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      const finalScore = sessionScore + (selectedOption === activeTopic.questions[currentQIdx].correct ? 0 : 0);
      alert(`🎉 Hoàn thành bài luyện tập!\nĐiểm của bạn: ${finalScore} / ${activeTopic.questions.length} câu đúng.`);
      setActiveTopic(null);
    }
  };

  // Total questions count in database
  const totalQuestions = useMemo(() => countTotalPracticeQuestions(topicsList), [topicsList]);

  return (
    <main className="main-content" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.25rem 1rem 3rem' }}>
      {/* Header Banner - Unified, Sleek & Compact */}
      {!activeTopic && (
        <div
          style={{
            background:
              user?.role === 'admin'
                ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #fffbfb 100%)',
            border: user?.role === 'admin' ? '1px solid #334155' : '1px solid #fee2e2',
            borderRadius: '18px',
            padding: '1.25rem 1.6rem',
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            boxShadow:
              user?.role === 'admin'
                ? '0 4px 20px rgba(0, 0, 0, 0.2)'
                : '0 4px 18px rgba(161, 29, 36, 0.04)',
            color: user?.role === 'admin' ? '#f8fafc' : undefined
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
              <span
                style={{
                  background: user?.role === 'admin' ? 'rgba(254, 202, 202, 0.15)' : '#fef2f2',
                  color: user?.role === 'admin' ? '#fca5a5' : '#A11D24',
                  padding: '3px 10px',
                  borderRadius: '8px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  border: user?.role === 'admin' ? '1px solid rgba(254, 202, 202, 0.25)' : '1px solid #fecaca'
                }}
              >
                {user?.role === 'admin' ? '👑 Quản Trị Kỹ Năng' : '🎯 Luyện Kỹ Năng'}
              </span>
              <span
                style={{
                  fontSize: '0.9rem',
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
                margin: '0 0 0.25rem 0',
                fontSize: '1.35rem',
                fontWeight: 800,
                color: user?.role === 'admin' ? '#f8fafc' : '#0f172a'
              }}
            >
              {user?.role === 'admin' ? 'Quản Trị Ngân Hàng Kỹ Năng' : 'Luyện Tập Kỹ Năng Tiếng Trung'}
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: '0.85rem',
                color: user?.role === 'admin' ? '#94a3b8' : '#64748b'
              }}
            >
              {user?.role === 'admin'
                ? 'Quản lý ngân hàng câu hỏi phân theo 5 kỹ năng (Nghe, Đọc, Ngữ Pháp, Pinyin, Chữ Hán) qua tất cả 6 cấp độ HSK.'
                : `Luyện sâu từng kỹ năng Nghe, Đọc, Ngữ Pháp, Pinyin, Chữ Hán theo cấp độ HSK 1 đến HSK 6 với ${totalQuestions} câu hỏi phong phú và giải thích tức thì.`}
            </p>
          </div>

          {/* Badges / Admin Actions */}
          {user?.role === 'admin' ? (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => alert('Mở form tạo Chuyên đề luyện kỹ năng mới.')}
                style={{
                  padding: '0.5rem 1rem',
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
                  padding: '0.4rem 0.8rem',
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
                  padding: '0.4rem 0.8rem',
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
                  padding: '0.4rem 0.8rem',
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
      {/* 1. RUNNER VIEW (Khi người học đang làm bài tập một chuyên đề)             */}
      {/* ========================================================================= */}
      {activeTopic ? (
        <div
          style={{
            maxWidth: '840px',
            margin: '0 auto',
            background: '#fff',
            border: '1.5px solid #fee2e2',
            borderRadius: '22px',
            padding: '2rem',
            boxShadow: '0 10px 35px rgba(0,0,0,0.03)'
          }}
        >
          {/* Header of runner */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              borderBottom: '1px solid #f1f5f9',
              paddingBottom: '1rem'
            }}
          >
            <div>
              <span
                style={{
                  background: '#fef2f2',
                  color: '#A11D24',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}
              >
                {activeTopic.skillLabel} · {activeTopic.level}
              </span>
              <h3 style={{ margin: '0.5rem 0 0 0', color: '#0f172a', fontSize: '1.2rem' }}>
                {activeTopic.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setActiveTopic(null)}
              style={{
                background: 'none',
                border: '1px solid #cbd5e1',
                padding: '0.45rem 1rem',
                borderRadius: '10px',
                cursor: 'pointer',
                color: '#64748b',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <i className="fa-solid fa-arrow-left"></i> Đổi bài khác
            </button>
          </div>

          {/* Progress bar inside session */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.85rem',
              color: '#64748b',
              marginBottom: '0.5rem'
            }}
          >
            <span>
              Câu <strong>{currentQIdx + 1}</strong> / {activeTopic.questions.length}
            </span>
            <span>
              Chính xác: <strong style={{ color: '#15803d' }}>{sessionScore}</strong> câu đúng
            </span>
          </div>
          <div
            style={{
              height: '6px',
              background: '#f1f5f9',
              borderRadius: '3px',
              marginBottom: '1.75rem',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${((currentQIdx + 1) / activeTopic.questions.length) * 100}%`,
                height: '100%',
                background: '#A11D24',
                transition: 'width 0.3s ease'
              }}
            ></div>
          </div>

          {/* Question Content */}
          {(() => {
            const q = activeTopic.questions[currentQIdx];
            if (!q) return null;

            return (
              <div>
                <h3 style={{ fontSize: '1.18rem', color: '#0f172a', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  {q.prompt}
                </h3>

                {/* Audio button if question has audio */}
                {q.audio && (
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)',
                      padding: '1.25rem',
                      borderRadius: '16px',
                      color: '#fff',
                      marginBottom: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => playChineseAudio(q.audio)}
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        background: '#fff',
                        color: '#A11D24',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.1rem',
                        flexShrink: 0
                      }}
                    >
                      <i className={`fa-solid ${isAudioPlaying ? 'fa-volume-high' : 'fa-play'}`}></i>
                    </button>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                        {isAudioPlaying ? 'Đang phát âm thanh...' : 'Bấm để nghe phát âm'}
                      </div>
                      {q.pinyin && <div style={{ fontSize: '0.82rem', color: '#fef08a' }}>{q.pinyin}</div>}
                    </div>
                  </div>
                )}

                {/* Options */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {q.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === q.correct;
                    let bg = '#f8fafc';
                    let border = '1px solid #e2e8f0';

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
                          padding: '1rem 1.25rem',
                          borderRadius: '12px',
                          background: bg,
                          border: border,
                          cursor: isAnswered ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: isSelected ? '#A11D24' : '#e2e8f0',
                              color: isSelected ? '#fff' : '#64748b',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.85rem',
                              fontWeight: 700
                            }}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span style={{ fontSize: '0.95rem', color: '#1e293b', fontWeight: 600 }}>{opt}</span>
                        </div>
                        {isAnswered && isCorrect && (
                          <i className="fa-solid fa-circle-check" style={{ color: '#22c55e', fontSize: '1.2rem' }}></i>
                        )}
                        {isAnswered && isSelected && !isCorrect && (
                          <i className="fa-solid fa-circle-xmark" style={{ color: '#ef4444', fontSize: '1.2rem' }}></i>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {isAnswered && (
                  <div
                    style={{
                      background: '#f8fafc',
                      padding: '1.25rem',
                      borderRadius: '12px',
                      borderLeft: '4px solid #A11D24',
                      marginBottom: '1.5rem'
                    }}
                  >
                    <div style={{ fontWeight: 700, color: '#A11D24', marginBottom: '0.35rem', fontSize: '0.88rem' }}>
                      Giải thích chi tiết:
                    </div>
                    <div style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.5 }}>{q.explain}</div>
                  </div>
                )}

                {/* Next button */}
                {isAnswered && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={handleNextQ}
                      style={{
                        background: 'linear-gradient(135deg, #A11D24 0%, #7f1d1d 100%)',
                        color: '#fff',
                        border: 'none',
                        padding: '0.75rem 2rem',
                        borderRadius: '10px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 4px 14px rgba(161, 29, 36, 0.25)'
                      }}
                    >
                      {currentQIdx < activeTopic.questions.length - 1 ? 'Câu tiếp theo' : 'Hoàn thành bài tập'}
                      <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                )}
              </div>
            );
          })()}
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
                      <i className="fa-solid fa-list-check" style={{ color: '#A11D24', marginRight: '0.35rem' }}></i>
                      {item.questions?.length || item.questionsCount || 0} câu hỏi
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
