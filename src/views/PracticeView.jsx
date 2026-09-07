import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { PRACTICE_TOPICS } from '../data/practiceData';
import {
  HSK_VOCABULARIES,
  HSK_LEVELS,
  getVocabulariesByLevel,
  getAvailableTopics
} from '../data/hskVocabularyData';
import { fetchVocabularies } from '../services/supabaseService';

export const PracticeView = () => {
  const { user, setIsAuthModalOpen } = useAuth();

  // Top mode: 'skills' (Luyện kỹ năng) | 'vocab' (Luyện từ vựng tự do HSK 1 - 6)
  const [practiceMode, setPracticeMode] = useState('vocab');

  // ==========================================
  // 1. SKILLS PRACTICE STATE
  // ==========================================
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState('all');
  const [activeTopic, setActiveTopic] = useState(null);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Filter skill topics
  const filteredSkillTopics = PRACTICE_TOPICS.filter((t) => {
    const matchSkill = selectedSkill === 'all' || t.skill === selectedSkill;
    const matchLevel = selectedSkillLevel === 'all' || t.level === selectedSkillLevel;
    return matchSkill && matchLevel;
  });

  // ==========================================
  // 2. VOCABULARY FREE PRACTICE STATE (HSK 1 - 6)
  // ==========================================
  const [vocabLevel, setVocabLevel] = useState('all'); // 'all' | 'HSK 1' ... 'HSK 6'
  const [vocabTopic, setVocabTopic] = useState('all');
  const [vocabSearch, setVocabSearch] = useState('');
  const [vocabSubTab, setVocabSubTab] = useState('flashcards'); // 'flashcards' | 'quiz' | 'list'

  // Live vocabularies from Supabase or fallback
  const [allVocabList, setAllVocabList] = useState(HSK_VOCABULARIES);
  const [isLoadingVocab, setIsLoadingVocab] = useState(false);

  // Flashcard State
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Vocab Quiz State
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizQIdx, setQuizQIdx] = useState(0);
  const [quizSelectedOpt, setQuizSelectedOpt] = useState(null);
  const [quizIsAnswered, setQuizIsAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Load vocabularies from Supabase on mount
  useEffect(() => {
    let isMounted = true;
    setIsLoadingVocab(true);
    fetchVocabularies()
      .then((res) => {
        const items = Array.isArray(res) ? res : res?.data || [];
        if (isMounted && items.length > 0) {
          setAllVocabList(items);
        }
      })
      .catch((err) => {
        console.warn('PracticeView: fallback to local vocab list', err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingVocab(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered Vocabularies
  const filteredVocabularies = useMemo(() => {
    return allVocabList.map((v) => ({
      ...v,
      meaning: v.meaning || v.mean || '',
      example_cn: v.example_cn || v.exampleHanzi || '',
      example_vn: v.example_vn || v.exampleMean || '',
      sino_vietnamese: v.sino_vietnamese || v.sinoVietnamese || ''
    })).filter((v) => {
      const matchLevel = vocabLevel === 'all' || v.level === vocabLevel;
      const matchTopic = vocabTopic === 'all' || v.topic === vocabTopic;
      const search = vocabSearch.trim().toLowerCase();
      const matchSearch =
        !search ||
        v.hanzi?.toLowerCase().includes(search) ||
        v.pinyin?.toLowerCase().includes(search) ||
        v.meaning?.toLowerCase().includes(search) ||
        v.sino_vietnamese?.toLowerCase().includes(search);
      return matchLevel && matchTopic && matchSearch;
    });
  }, [allVocabList, vocabLevel, vocabTopic, vocabSearch]);

  // Available topics for current vocab level
  const availableTopics = useMemo(() => {
    return getAvailableTopics(vocabLevel);
  }, [vocabLevel]);

  // Reset flashcard index when filter changes
  useEffect(() => {
    setFlashcardIdx(0);
    setIsCardFlipped(false);
  }, [vocabLevel, vocabTopic, vocabSearch]);

  // Audio speech synthesis helper
  const playChineseAudio = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'zh-CN';
      u.rate = 0.9;
      u.onstart = () => setIsAudioPlaying(true);
      u.onend = () => setIsAudioPlaying(false);
      window.speechSynthesis.speak(u);
    }
  };

  // Skill runner handlers
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
        particleCount: 40,
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
      alert(`🎉 Hoàn thành bài luyện kỹ năng! Điểm của bạn: ${sessionScore} / ${activeTopic.questions.length}`);
      setActiveTopic(null);
    }
  };

  // ==========================================
  // Vocab Quiz Generation
  // ==========================================
  const startVocabQuiz = () => {
    const pool = filteredVocabularies.length >= 4 ? filteredVocabularies : allVocabList.map((v) => ({
      ...v,
      meaning: v.meaning || v.mean || '',
      example_cn: v.example_cn || v.exampleHanzi || '',
      example_vn: v.example_vn || v.exampleMean || '',
      sino_vietnamese: v.sino_vietnamese || v.sinoVietnamese || ''
    }));
    if (pool.length < 4) return;

    // Pick 10 questions (or pool.length)
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selectedWords = shuffled.slice(0, Math.min(10, pool.length));

    const generatedQs = selectedWords.map((target) => {
      // 3 distractors
      const distractors = pool
        .filter((w) => w.id !== target.id && w.meaning !== target.meaning)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const isHanziPrompt = Math.random() > 0.4;
      let prompt = '';
      let correct = 0;
      let options = [];

      if (isHanziPrompt) {
        prompt = `Từ "${target.hanzi}" (${target.pinyin}) có nghĩa là gì?`;
        const allOpts = [target.meaning, ...distractors.map((d) => d.meaning)].sort(() => Math.random() - 0.5);
        correct = allOpts.indexOf(target.meaning);
        options = allOpts;
      } else {
        prompt = `Từ tiếng Trung nào có nghĩa là "${target.meaning}"?`;
        const allOpts = [
          `${target.hanzi} (${target.pinyin})`,
          ...distractors.map((d) => `${d.hanzi} (${d.pinyin})`)
        ].sort(() => Math.random() - 0.5);
        correct = allOpts.indexOf(`${target.hanzi} (${target.pinyin})`);
        options = allOpts;
      }

      return {
        target,
        prompt,
        options,
        correct,
        explain: `${target.hanzi} [${target.pinyin}] (Hán-Việt: ${target.sino_vietnamese || '—'}): ${target.meaning}. Ví dụ: ${target.example_cn || ''} - ${target.example_vn || ''}`
      };
    });

    setQuizQuestions(generatedQs);
    setQuizQIdx(0);
    setQuizSelectedOpt(null);
    setQuizIsAnswered(false);
    setQuizScore(0);
    setQuizFinished(false);
  };

  const handleSelectQuizOpt = (idx) => {
    if (quizIsAnswered || quizFinished) return;
    setQuizSelectedOpt(idx);
    setQuizIsAnswered(true);

    const q = quizQuestions[quizQIdx];
    if (idx === q.correct) {
      setQuizScore((prev) => prev + 1);
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#A11D24', '#22c55e', '#f59e0b']
      });
    }
  };

  const handleNextQuizQ = () => {
    if (quizQIdx < quizQuestions.length - 1) {
      setQuizQIdx((prev) => prev + 1);
      setQuizSelectedOpt(null);
      setQuizIsAnswered(false);
    } else {
      setQuizFinished(true);
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  // Start quiz when switching to quiz subtab if not yet started
  useEffect(() => {
    if (vocabSubTab === 'quiz' && quizQuestions.length === 0) {
      startVocabQuiz();
    }
  }, [vocabSubTab]);

  return (
    <main className="main-content" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.25rem 1rem 3rem' }}>
      {/* Top Banner */}
      {!activeTopic && (
        <div
          style={{
            background:
              user?.role === 'admin'
                ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #fffbfb 100%)',
            border: user?.role === 'admin' ? '1px solid #334155' : '1px solid #fee2e2',
            borderRadius: '18px',
            padding: '1.25rem 1.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            boxShadow:
              user?.role === 'admin'
                ? '0 4px 20px rgba(0, 0, 0, 0.2)'
                : '0 4px 20px rgba(161, 29, 36, 0.05)',
            color: user?.role === 'admin' ? '#f8fafc' : undefined
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span
                style={{
                  background: user?.role === 'admin' ? 'rgba(254, 202, 202, 0.15)' : '#fef2f2',
                  color: user?.role === 'admin' ? '#fca5a5' : '#A11D24',
                  padding: '3px 10px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  border: user?.role === 'admin' ? '1px solid rgba(254, 202, 202, 0.25)' : '1px solid #fecaca'
                }}
              >
                {practiceMode === 'vocab' ? '🗂️ Luyện Từ Vựng Tự Do' : '🎯 Luyện Kỹ Năng'}
              </span>
              <span
                style={{
                  fontSize: '0.9rem',
                  color: user?.role === 'admin' ? '#fca5a5' : '#A11D24',
                  fontFamily: 'Noto Serif SC, serif',
                  fontWeight: 600
                }}
              >
                {practiceMode === 'vocab' ? 'HSK 1 - 6 词汇随心练' : '技能专项练习'}
              </span>
            </div>
            <h1
              style={{
                margin: '0 0 0.25rem 0',
                fontSize: '1.4rem',
                fontWeight: 800,
                color: user?.role === 'admin' ? '#f8fafc' : '#0f172a'
              }}
            >
              {practiceMode === 'vocab' ? 'Kho Từ Vựng HSK 1 Đến HSK 6' : 'Luyện Tập Kỹ Năng Tiếng Trung'}
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: '0.85rem',
                color: user?.role === 'admin' ? '#94a3b8' : '#64748b'
              }}
            >
              {practiceMode === 'vocab'
                ? `Học và tra cứu ${allVocabList.length} từ vựng chuẩn HSK phân chia rõ ràng theo 6 cấp độ (HSK 1, 2, 3, 4, 5, 6), flashcard lật 3D có phát âm và ví dụ thực tế.`
                : 'Luyện sâu từng kỹ năng Nghe, Đọc, Ngữ Pháp, Chữ Hán theo cấp độ với phản hồi và giải thích tức thì.'}
            </p>
          </div>

          {/* Quick Mode Toggle */}
          <div
            style={{
              display: 'flex',
              background: user?.role === 'admin' ? '#0f172a' : '#f1f5f9',
              padding: '4px',
              borderRadius: '12px',
              gap: '4px'
            }}
          >
            <button
              onClick={() => setPracticeMode('vocab')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                border: 'none',
                background: practiceMode === 'vocab' ? '#A11D24' : 'transparent',
                color: practiceMode === 'vocab' ? '#fff' : user?.role === 'admin' ? '#94a3b8' : '#475569',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: practiceMode === 'vocab' ? '0 2px 8px rgba(161, 29, 36, 0.3)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <i className="fa-solid fa-layer-group"></i> Luyện Từ Vựng HSK 1 - 6
            </button>
            <button
              onClick={() => setPracticeMode('skills')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                border: 'none',
                background: practiceMode === 'skills' ? '#A11D24' : 'transparent',
                color: practiceMode === 'skills' ? '#fff' : user?.role === 'admin' ? '#94a3b8' : '#475569',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: practiceMode === 'skills' ? '0 2px 8px rgba(161, 29, 36, 0.3)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <i className="fa-solid fa-bullseye"></i> Luyện Kỹ Năng Đề
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 1: VOCABULARY FREE PRACTICE (HSK 1 - 6)                            */}
      {/* ========================================================================= */}
      {practiceMode === 'vocab' && !activeTopic && (
        <div>
          {/* Level Pills: HSK 1 to HSK 6 explicitly */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Chọn Cấp Độ HSK:
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setVocabLevel('all')}
                style={{
                  padding: '0.45rem 0.95rem',
                  borderRadius: '10px',
                  border: vocabLevel === 'all' ? '1.5px solid #A11D24' : '1px solid #e2e8f0',
                  background: vocabLevel === 'all' ? '#A11D24' : '#fff',
                  color: vocabLevel === 'all' ? '#fff' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                Tất cả ({allVocabList.length})
              </button>
              {HSK_LEVELS.map((lvl) => {
                const count = allVocabList.filter((v) => v.level === lvl).length;
                const isSelected = vocabLevel === lvl;
                return (
                  <button
                    key={lvl}
                    onClick={() => setVocabLevel(lvl)}
                    style={{
                      padding: '0.45rem 0.95rem',
                      borderRadius: '10px',
                      border: isSelected ? '1.5px solid #A11D24' : '1px solid #e2e8f0',
                      background: isSelected ? '#A11D24' : '#fff',
                      color: isSelected ? '#fff' : '#475569',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{lvl}</span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        padding: '1px 5px',
                        borderRadius: '6px',
                        background: isSelected ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                        color: isSelected ? '#fff' : '#64748b'
                      }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub-bar: Topic Filter, Search, and SubTabs */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              background: '#fff',
              border: '1px solid #f1f5f9',
              borderRadius: '14px',
              padding: '0.75rem 1rem',
              marginBottom: '1.5rem',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
            }}
          >
            {/* Topic & Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <i className="fa-solid fa-filter" style={{ color: '#A11D24', fontSize: '0.8rem' }}></i>
                <select
                  value={vocabTopic}
                  onChange={(e) => setVocabTopic(e.target.value)}
                  style={{
                    padding: '0.45rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: '#334155',
                    background: '#fff',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="all">Tất cả chủ đề</option>
                  {availableTopics.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search input */}
              <div style={{ position: 'relative', minWidth: '220px', flex: '0 1 300px' }}>
                <i
                  className="fa-solid fa-magnifying-glass"
                  style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.8rem' }}
                ></i>
                <input
                  type="text"
                  value={vocabSearch}
                  onChange={(e) => setVocabSearch(e.target.value)}
                  placeholder="Tra chữ Hán, pinyin, nghĩa..."
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.75rem 0.45rem 2rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.82rem',
                    outline: 'none',
                    background: '#f8fafc'
                  }}
                />
                {vocabSearch && (
                  <button
                    onClick={() => setVocabSearch('')}
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

            {/* Sub Tabs: Flashcards | Quiz | Table */}
            <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: '10px', gap: '3px' }}>
              <button
                onClick={() => setVocabSubTab('flashcards')}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: vocabSubTab === 'flashcards' ? '#fff' : 'transparent',
                  color: vocabSubTab === 'flashcards' ? '#A11D24' : '#64748b',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  boxShadow: vocabSubTab === 'flashcards' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <i className="fa-regular fa-clone"></i> Flashcard 3D
              </button>
              <button
                onClick={() => setVocabSubTab('quiz')}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: vocabSubTab === 'quiz' ? '#fff' : 'transparent',
                  color: vocabSubTab === 'quiz' ? '#A11D24' : '#64748b',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  boxShadow: vocabSubTab === 'quiz' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <i className="fa-solid fa-circle-question"></i> Trắc Nghiệm ({filteredVocabularies.length >= 4 ? '10 Câu' : 'Ít từ'})
              </button>
              <button
                onClick={() => setVocabSubTab('list')}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: vocabSubTab === 'list' ? '#fff' : 'transparent',
                  color: vocabSubTab === 'list' ? '#A11D24' : '#64748b',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  boxShadow: vocabSubTab === 'list' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <i className="fa-solid fa-table-list"></i> Danh Sách ({filteredVocabularies.length})
              </button>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* SUBTAB 1: FLASHCARDS 3D                                               */}
          {/* --------------------------------------------------------------------- */}
          {vocabSubTab === 'flashcards' && (
            <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
              {filteredVocabularies.length === 0 ? (
                <div style={{ padding: '3rem 1rem', background: '#fff', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                  <i className="fa-solid fa-inbox" style={{ fontSize: '2.5rem', color: '#cbd5e1', marginBottom: '1rem' }}></i>
                  <div style={{ fontWeight: 600, color: '#64748b' }}>Không tìm thấy từ vựng nào khớp với bộ lọc.</div>
                  <button
                    onClick={() => {
                      setVocabLevel('all');
                      setVocabTopic('all');
                      setVocabSearch('');
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
                (() => {
                  const currentWord = filteredVocabularies[flashcardIdx] || filteredVocabularies[0];
                  return (
                    <div>
                      {/* Top counter & Shuffle */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span
                            style={{
                              background: '#fee2e2',
                              color: '#A11D24',
                              fontWeight: 700,
                              fontSize: '0.78rem',
                              padding: '3px 10px',
                              borderRadius: '8px'
                            }}
                          >
                            {currentWord.level}
                          </span>
                          <span
                            style={{
                              background: '#f1f5f9',
                              color: '#475569',
                              fontWeight: 600,
                              fontSize: '0.78rem',
                              padding: '3px 10px',
                              borderRadius: '8px'
                            }}
                          >
                            {currentWord.topic}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                          Thẻ <strong>{flashcardIdx + 1}</strong> / {filteredVocabularies.length}
                        </div>
                      </div>

                      {/* 3D Flashcard Container */}
                      <div
                        style={{
                          perspective: '1000px',
                          marginBottom: '1.25rem'
                        }}
                      >
                        <div
                          onClick={() => setIsCardFlipped((prev) => !prev)}
                          style={{
                            position: 'relative',
                            width: '100%',
                            minHeight: '340px',
                            cursor: 'pointer',
                            transformStyle: 'preserve-3d',
                            transition: 'transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)',
                            transform: isCardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                          }}
                        >
                          {/* FRONT FACE */}
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              background: 'linear-gradient(145deg, #ffffff 0%, #fff7f7 100%)',
                              border: '2px solid #fecaca',
                              borderRadius: '24px',
                              padding: '2rem 1.5rem',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              backfaceVisibility: 'hidden',
                              boxShadow: '0 12px 35px rgba(161, 29, 36, 0.08)'
                            }}
                          >
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
                                <i className="fa-solid fa-arrows-rotate"></i> Chạm để xem nghĩa
                              </span>
                            </div>

                            <div style={{ margin: 'auto 0' }}>
                              {/* Big Hanzi */}
                              <div
                                style={{
                                  fontSize: '3.6rem',
                                  fontWeight: 800,
                                  color: '#0f172a',
                                  fontFamily: 'Noto Serif SC, serif',
                                  letterSpacing: '2px',
                                  marginBottom: '0.5rem',
                                  lineHeight: 1.1
                                }}
                              >
                                {currentWord.hanzi}
                              </div>

                              {/* Pinyin */}
                              <div
                                style={{
                                  fontSize: '1.4rem',
                                  fontWeight: 700,
                                  color: '#A11D24',
                                  marginBottom: '0.4rem',
                                  letterSpacing: '0.5px'
                                }}
                              >
                                {currentWord.pinyin}
                              </div>

                              {/* Sino-Vietnamese if exists */}
                              {currentWord.sino_vietnamese && (
                                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
                                  Hán-Việt: <strong>{currentWord.sino_vietnamese}</strong>
                                </div>
                              )}
                            </div>

                            {/* Audio & Hint Button */}
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  playChineseAudio(currentWord.hanzi);
                                }}
                                style={{
                                  padding: '0.55rem 1.25rem',
                                  borderRadius: '20px',
                                  border: 'none',
                                  background: 'linear-gradient(135deg, #A11D24 0%, #7f1d1d 100%)',
                                  color: '#fff',
                                  fontWeight: 700,
                                  fontSize: '0.85rem',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  boxShadow: '0 4px 12px rgba(161, 29, 36, 0.25)'
                                }}
                              >
                                <i className={`fa-solid ${isAudioPlaying ? 'fa-volume-high' : 'fa-volume-low'}`}></i>
                                Phát âm
                              </button>
                            </div>
                          </div>

                          {/* BACK FACE */}
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              background: 'linear-gradient(145deg, #fffbfb 0%, #fef2f2 100%)',
                              border: '2px solid #f87171',
                              borderRadius: '24px',
                              padding: '1.75rem 1.5rem',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              backfaceVisibility: 'hidden',
                              transform: 'rotateY(180deg)',
                              boxShadow: '0 12px 35px rgba(161, 29, 36, 0.12)'
                            }}
                          >
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#A11D24' }}>
                                {currentWord.hanzi} [{currentWord.pinyin}]
                              </span>
                              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
                                <i className="fa-solid fa-arrows-rotate"></i> Chạm để quay lại
                              </span>
                            </div>

                            <div style={{ margin: 'auto 0', maxWidth: '90%' }}>
                              {/* Meaning */}
                              <div
                                style={{
                                  fontSize: '1.45rem',
                                  fontWeight: 800,
                                  color: '#0f172a',
                                  marginBottom: '0.85rem',
                                  lineHeight: 1.3
                                }}
                              >
                                {currentWord.meaning}
                              </div>

                              {/* Example sentence */}
                              {currentWord.example_cn && (
                                <div
                                  style={{
                                    background: 'rgba(255, 255, 255, 0.85)',
                                    border: '1px solid #fee2e2',
                                    borderRadius: '14px',
                                    padding: '0.85rem 1rem',
                                    textAlign: 'left'
                                  }}
                                >
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#A11D24', textTransform: 'uppercase' }}>
                                      Ví Dụ Câu
                                    </span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        playChineseAudio(currentWord.example_cn);
                                      }}
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#A11D24',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem',
                                        padding: '2px 6px'
                                      }}
                                      title="Nghe câu ví dụ"
                                    >
                                      <i className="fa-solid fa-volume-high"></i>
                                    </button>
                                  </div>
                                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.2rem' }}>
                                    {currentWord.example_cn}
                                  </div>
                                  {currentWord.example_pinyin && (
                                    <div style={{ fontSize: '0.78rem', color: '#d97706', marginBottom: '0.25rem' }}>
                                      {currentWord.example_pinyin}
                                    </div>
                                  )}
                                  <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                                    {currentWord.example_vn}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Audio button on back face */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                playChineseAudio(currentWord.hanzi);
                              }}
                              style={{
                                padding: '0.45rem 1rem',
                                borderRadius: '16px',
                                border: '1px solid #fca5a5',
                                background: '#fff',
                                color: '#A11D24',
                                fontWeight: 700,
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem'
                              }}
                            >
                              <i className="fa-solid fa-volume-high"></i> Nghe lại từ vựng
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Navigation Controls */}
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                        <button
                          onClick={() => {
                            setFlashcardIdx((prev) => (prev > 0 ? prev - 1 : filteredVocabularies.length - 1));
                            setIsCardFlipped(false);
                          }}
                          style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '50%',
                            border: '1px solid #cbd5e1',
                            background: '#fff',
                            color: '#334155',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                          }}
                          title="Từ trước"
                        >
                          <i className="fa-solid fa-arrow-left"></i>
                        </button>

                        <button
                          onClick={() => setIsCardFlipped((prev) => !prev)}
                          style={{
                            padding: '0.65rem 1.4rem',
                            borderRadius: '12px',
                            border: '1px solid #fee2e2',
                            background: '#fef2f2',
                            color: '#A11D24',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          <i className="fa-solid fa-rotate"></i> Lật thẻ (Space)
                        </button>

                        <button
                          onClick={() => {
                            const randomIdx = Math.floor(Math.random() * filteredVocabularies.length);
                            setFlashcardIdx(randomIdx);
                            setIsCardFlipped(false);
                          }}
                          style={{
                            padding: '0.65rem 1rem',
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            background: '#fff',
                            color: '#475569',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                          }}
                          title="Từ ngẫu nhiên"
                        >
                          <i className="fa-solid fa-shuffle"></i> Ngẫu nhiên
                        </button>

                        <button
                          onClick={() => {
                            setFlashcardIdx((prev) => (prev < filteredVocabularies.length - 1 ? prev + 1 : 0));
                            setIsCardFlipped(false);
                          }}
                          style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '50%',
                            border: 'none',
                            background: '#A11D24',
                            color: '#fff',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(161, 29, 36, 0.25)'
                          }}
                          title="Từ tiếp theo"
                        >
                          <i className="fa-solid fa-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* SUBTAB 2: VOCABULARY QUIZ (10 QUESTIONS)                              */}
          {/* --------------------------------------------------------------------- */}
          {vocabSubTab === 'quiz' && (
            <div style={{ maxWidth: '780px', margin: '0 auto', background: '#fff', border: '1px solid #fee2e2', borderRadius: '20px', padding: '1.75rem', boxShadow: '0 6px 25px rgba(0,0,0,0.03)' }}>
              {quizFinished ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎉</div>
                  <h2 style={{ fontSize: '1.5rem', color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                    Hoàn Thành Bài Trắc Nghiệm Từ Vựng!
                  </h2>
                  <p style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '1.5rem' }}>
                    Kết quả luyện tập từ vựng {vocabLevel === 'all' ? 'Tổng hợp' : vocabLevel} của bạn
                  </p>

                  <div
                    style={{
                      display: 'inline-block',
                      background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                      border: '1.5px solid #fca5a5',
                      borderRadius: '16px',
                      padding: '1.25rem 2.5rem',
                      marginBottom: '1.5rem'
                    }}
                  >
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#A11D24', lineHeight: 1 }}>
                      {quizScore} / {quizQuestions.length}
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#991b1b', marginTop: '0.35rem' }}>
                      {quizScore === quizQuestions.length
                        ? 'Xuất Sắc! Điểm Tuyệt Đối (+80 XP)'
                        : quizScore >= quizQuestions.length * 0.7
                        ? 'Rất Tốt! Nắm vững từ vựng (+50 XP)'
                        : 'Cố Gắng Lên! Hãy luyện thêm Flashcard nhé (+30 XP)'}
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={startVocabQuiz}
                      style={{
                        padding: '0.65rem 1.75rem',
                        borderRadius: '12px',
                        background: '#A11D24',
                        color: '#fff',
                        border: 'none',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 4px 12px rgba(161, 29, 36, 0.25)'
                      }}
                    >
                      <i className="fa-solid fa-rotate-right"></i> Làm Đề Khác (10 Câu Mới)
                    </button>
                  </div>
                </div>
              ) : quizQuestions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <button
                    onClick={startVocabQuiz}
                    style={{
                      padding: '0.6rem 1.5rem',
                      borderRadius: '10px',
                      background: '#A11D24',
                      color: '#fff',
                      border: 'none',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Bắt đầu trắc nghiệm
                  </button>
                </div>
              ) : (
                (() => {
                  const q = quizQuestions[quizQIdx];
                  return (
                    <div>
                      {/* Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.85rem' }}>
                        <div>
                          <span style={{ background: '#fef2f2', color: '#A11D24', padding: '0.25rem 0.75rem', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 700 }}>
                            {q.target.level} · {q.target.topic}
                          </span>
                          <span style={{ marginLeft: '0.5rem', fontSize: '0.82rem', color: '#64748b' }}>
                            Câu {quizQIdx + 1} / {quizQuestions.length}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                          Điểm hiện tại: <strong style={{ color: '#15803d' }}>{quizScore}</strong>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div style={{ height: '5px', background: '#f1f5f9', borderRadius: '3px', marginBottom: '1.5rem', overflow: 'hidden' }}>
                        <div style={{ width: `${((quizQIdx + 1) / quizQuestions.length) * 100}%`, height: '100%', background: '#A11D24', transition: 'width 0.3s' }}></div>
                      </div>

                      {/* Prompt */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <button
                          type="button"
                          onClick={() => playChineseAudio(q.target.hanzi)}
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            background: '#fee2e2',
                            color: '#A11D24',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1rem',
                            flexShrink: 0
                          }}
                          title="Phát âm từ"
                        >
                          <i className="fa-solid fa-volume-high"></i>
                        </button>
                        <h3 style={{ fontSize: '1.2rem', color: '#0f172a', margin: 0, lineHeight: 1.4 }}>
                          {q.prompt}
                        </h3>
                      </div>

                      {/* Options */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        {q.options.map((opt, idx) => {
                          const isSelected = quizSelectedOpt === idx;
                          const isCorrect = idx === q.correct;
                          let bg = '#f8fafc';
                          let border = '1px solid #e2e8f0';

                          if (quizIsAnswered) {
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
                              onClick={() => handleSelectQuizOpt(idx)}
                              style={{
                                padding: '0.9rem 1.25rem',
                                borderRadius: '12px',
                                background: bg,
                                border: border,
                                cursor: quizIsAnswered ? 'default' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span
                                  style={{
                                    width: '26px',
                                    height: '26px',
                                    borderRadius: '50%',
                                    background: isSelected ? '#A11D24' : '#e2e8f0',
                                    color: isSelected ? '#fff' : '#64748b',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.8rem',
                                    fontWeight: 700
                                  }}
                                >
                                  {String.fromCharCode(65 + idx)}
                                </span>
                                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b' }}>
                                  {opt}
                                </span>
                              </div>
                              {quizIsAnswered && isCorrect && <i className="fa-solid fa-circle-check" style={{ color: '#22c55e', fontSize: '1.1rem' }}></i>}
                              {quizIsAnswered && isSelected && !isCorrect && <i className="fa-solid fa-circle-xmark" style={{ color: '#ef4444', fontSize: '1.1rem' }}></i>}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {quizIsAnswered && (
                        <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '12px', borderLeft: '4px solid #A11D24', marginBottom: '1.5rem' }}>
                          <div style={{ fontWeight: 700, color: '#A11D24', marginBottom: '0.25rem', fontSize: '0.85rem' }}>
                            Giải thích & Chi tiết từ:
                          </div>
                          <div style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.5 }}>
                            {q.explain}
                          </div>
                        </div>
                      )}

                      {/* Next button */}
                      {quizIsAnswered && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button
                            onClick={handleNextQuizQ}
                            style={{
                              background: 'linear-gradient(135deg, #A11D24 0%, #7f1d1d 100%)',
                              color: '#fff',
                              border: 'none',
                              padding: '0.65rem 1.75rem',
                              borderRadius: '10px',
                              fontWeight: 700,
                              fontSize: '0.88rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.45rem',
                              boxShadow: '0 3px 10px rgba(161, 29, 36, 0.25)'
                            }}
                          >
                            {quizQIdx < quizQuestions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}
                            <i className="fa-solid fa-arrow-right"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()
              )}
            </div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* SUBTAB 3: VOCABULARY LIST (QUICK REFERENCE)                           */}
          {/* --------------------------------------------------------------------- */}
          {vocabSubTab === 'list' && (
            <div style={{ background: '#fff', border: '1px solid #fee2e2', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 4px 18px rgba(0,0,0,0.02)' }}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>
                  Hiển thị {filteredVocabularies.length} từ vựng
                </span>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Bấm vào biểu tượng loa để nghe phát âm giọng chuẩn
                </span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>Cấp độ</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Chữ Hán</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Pinyin</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Nghĩa Tiếng Việt</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Hán-Việt</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Chủ đề</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Nghe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVocabularies.map((item, idx) => (
                      <tr
                        key={item.id || idx}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          transition: 'background 0.15s ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#fff8f8')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span
                            style={{
                              background: '#fee2e2',
                              color: '#A11D24',
                              fontWeight: 700,
                              fontSize: '0.72rem',
                              padding: '2px 8px',
                              borderRadius: '6px'
                            }}
                          >
                            {item.level}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Noto Serif SC, serif' }}>
                            {item.hanzi}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', color: '#A11D24', fontWeight: 600, fontSize: '0.9rem' }}>
                          {item.pinyin}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#1e293b', fontSize: '0.88rem' }}>
                          {item.meaning}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', color: '#64748b', fontSize: '0.82rem' }}>
                          {item.sino_vietnamese || '—'}
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <span style={{ background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem' }}>
                            {item.topic}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => playChineseAudio(item.hanzi)}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              border: '1px solid #fee2e2',
                              background: '#fff',
                              color: '#A11D24',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.8rem',
                              transition: 'all 0.15s ease'
                            }}
                            title="Nghe phát âm"
                          >
                            <i className="fa-solid fa-volume-high"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: SKILLS PRACTICE (NGHE, ĐỌC, NGỮ PHÁP...)                       */}
      {/* ========================================================================= */}
      {practiceMode === 'skills' && !activeTopic && (
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

          {/* Level Filter Tags */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Cấp độ:</span>
            {['all', 'HSK 1', 'HSK 2', 'HSK 3'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedSkillLevel(lvl)}
                style={{
                  padding: '0.3rem 0.8rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: selectedSkillLevel === lvl ? '#fee2e2' : '#f1f5f9',
                  color: selectedSkillLevel === lvl ? '#A11D24' : '#64748b',
                  fontWeight: selectedSkillLevel === lvl ? 700 : 500,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                {lvl === 'all' ? 'Tất cả cấp độ' : lvl}
              </button>
            ))}
          </div>

          {/* Topic Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
            {filteredSkillTopics.map((item) => (
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
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ background: '#fef2f2', color: '#A11D24', padding: '0.25rem 0.65rem', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 700 }}>
                      {item.skillLabel}
                    </span>
                    <span style={{ background: '#f8fafc', color: '#64748b', padding: '0.25rem 0.65rem', borderRadius: '10px', fontSize: '0.78rem', fontWeight: 600 }}>
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

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    <i className="fa-solid fa-list-check" style={{ color: '#A11D24', marginRight: '0.35rem' }}></i>
                    {item.questions?.length || item.questionsCount || 0} câu hỏi
                  </span>

                  <button
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
                      gap: '0.45rem'
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
        </>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: SKILL PRACTICE RUNNER                                          */}
      {/* ========================================================================= */}
      {activeTopic && (
        <div style={{ maxWidth: '840px', margin: '0 auto', background: '#fff', border: '1.5px solid #fee2e2', borderRadius: '20px', padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
          {/* Header of runner */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
            <div>
              <span style={{ background: '#fef2f2', color: '#A11D24', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700 }}>
                {activeTopic.skillLabel} · {activeTopic.level}
              </span>
              <h3 style={{ margin: '0.5rem 0 0 0', color: '#0f172a' }}>{activeTopic.title}</h3>
            </div>
            <button
              onClick={() => setActiveTopic(null)}
              style={{ background: 'none', border: '1px solid #cbd5e1', padding: '0.4rem 0.9rem', borderRadius: '8px', cursor: 'pointer', color: '#64748b', fontSize: '0.85rem' }}
            >
              <i className="fa-solid fa-arrow-left" style={{ marginRight: '0.35rem' }}></i> Quay lại
            </button>
          </div>

          {/* Progress bar inside session */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>
            <span>Câu {currentQIdx + 1} / {activeTopic.questions.length}</span>
            <span>Chính xác: <strong>{sessionScore}</strong> câu đúng</span>
          </div>
          <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', marginBottom: '1.75rem', overflow: 'hidden' }}>
            <div style={{ width: `${((currentQIdx + 1) / activeTopic.questions.length) * 100}%`, height: '100%', background: '#A11D24', transition: 'width 0.3s' }}></div>
          </div>

          {/* Question Content */}
          {(() => {
            const q = activeTopic.questions[currentQIdx];
            return (
              <div>
                <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  {q.prompt}
                </h3>

                {/* Audio button if question has audio */}
                {q.audio && (
                  <div style={{ background: 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)', padding: '1.25rem', borderRadius: '14px', color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
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
                        fontSize: '1.1rem'
                      }}
                    >
                      <i className={`fa-solid ${isAudioPlaying ? 'fa-volume-high' : 'fa-play'}`}></i>
                    </button>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{isAudioPlaying ? 'Đang phát âm thanh...' : 'Bấm để nghe câu thoại'}</div>
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
                          justifyContent: 'space-between'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{
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
                          }}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span style={{ fontSize: '0.95rem', color: '#1e293b' }}>{opt}</span>
                        </div>
                        {isAnswered && isCorrect && <i className="fa-solid fa-circle-check" style={{ color: '#22c55e', fontSize: '1.2rem' }}></i>}
                        {isAnswered && isSelected && !isCorrect && <i className="fa-solid fa-circle-xmark" style={{ color: '#ef4444', fontSize: '1.2rem' }}></i>}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {isAnswered && (
                  <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', borderLeft: '4px solid #A11D24', marginBottom: '1.5rem' }}>
                    <div style={{ fontWeight: 700, color: '#A11D24', marginBottom: '0.35rem' }}>Giải thích chi tiết:</div>
                    <div style={{ fontSize: '0.92rem', color: '#334155' }}>{q.explain}</div>
                  </div>
                )}

                {/* Next button */}
                {isAnswered && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
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
                        gap: '0.5rem'
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
      )}
    </main>
  );
};
