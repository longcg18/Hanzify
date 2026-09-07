import React, { useState, useEffect } from 'react';
import { fetchLessonQuestions, saveLessonQuestions } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';

export const LessonHomeworkEditorView = ({ lesson, course, onBack }) => {
  const { user } = useAuth();

  // State
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(null);
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'editor' | 'preview'
  const [activeTabQIndex, setActiveTabQIndex] = useState(0);

  // Student Interactive Preview States (Allows teacher to test the questions live)
  const [previewAnswers, setPreviewAnswers] = useState({});
  const [previewWords, setPreviewWords] = useState({});
  const [audioPlayingIndex, setAudioPlayingIndex] = useState(null);

  // Load questions on mount
  useEffect(() => {
    let isMounted = true;
    async function loadQuestions() {
      setLoading(true);
      if (lesson?.id) {
        const data = await fetchLessonQuestions(lesson.id);
        if (isMounted) {
          if (Array.isArray(data) && data.length > 0) {
            setQuestions(data);
          } else {
            // Initial starter templates if empty
            setQuestions([
              {
                id: `q-${lesson.id}-1`,
                type: 'listening',
                title: 'Luyện Nghe: Chọn đáp án chính xác',
                tag: 'Nghe hiểu',
                instruction: 'Nghe đoạn audio và chọn câu trả lời đúng:',
                data: {
                  audioText: '你好！很高兴认识你。',
                  hint: 'Nghe kỹ lời chào hỏi mở đầu.',
                  options: [
                    { id: 'A', hanzi: '很高兴认识你', pinyin: 'hěn gāoxìng rènshi nǐ', meaning: 'Rất vui được quen biết bạn', isCorrect: true },
                    { id: 'B', hanzi: '明天见', pinyin: 'míngtiān jiàn', meaning: 'Hẹn gặp lại ngày mai', isCorrect: false }
                  ]
                }
              },
              {
                id: `q-${lesson.id}-2`,
                type: 'pinyin',
                title: 'Thanh Điệu & Pinyin',
                tag: 'Phát âm',
                instruction: 'Chọn thanh điệu và phiên âm chuẩn:',
                data: {
                  hanzi: '你好',
                  meaning: 'Xin chào',
                  options: [
                    { id: 'A', text: 'nǐ hǎo (Biến điệu: ní hǎo)', isCorrect: true },
                    { id: 'B', text: 'nī hāo', isCorrect: false }
                  ],
                  explanation: 'Hai thanh 3 đi liền nhau thì từ đầu tiên đọc thành thanh 2 (ní hǎo).'
                }
              },
              {
                id: `q-${lesson.id}-3`,
                type: 'word_order',
                title: 'Sắp Xếp Từ Ghép Thành Câu',
                tag: 'Ngữ pháp',
                instruction: 'Bấm chọn các thẻ từ để tạo thành câu hoàn chỉnh:',
                data: {
                  chips: [
                    { id: 'c1', word: '我', pinyin: 'wǒ' },
                    { id: 'c2', word: '是', pinyin: 'shì' },
                    { id: 'c3', word: '越南人', pinyin: 'yuènán rén' },
                    { id: 'c4', word: '。', pinyin: '' }
                  ],
                  meaning: 'Tôi là người Việt Nam.'
                }
              },
              {
                id: `q-${lesson.id}-4`,
                type: 'voice',
                title: 'Luyện Nói Khẩu Ngữ',
                tag: 'Khẩu ngữ',
                instruction: 'Bật micro thu âm đọc to và rõ ràng câu sau:',
                data: {
                  text: '你好，我是越南人。',
                  pinyin: 'Nǐ hǎo, wǒ shì yuènán rén.',
                  meaning: 'Xin chào, tôi là người Việt Nam.'
                }
              },
              {
                id: `q-${lesson.id}-5`,
                type: 'writing',
                title: 'Nộp Vở Viết Chữ Hán',
                tag: 'Viết chữ',
                instruction: 'Viết chữ 你 (nǐ) vào vở ô Mễ và chụp ảnh nộp bài:',
                data: {
                  char: '你',
                  pinyin: 'nǐ',
                  strokes: 7,
                  radicals: '亻 (Nhân đứng)'
                }
              }
            ]);
          }
          setLoading(false);
        }
      }
    }
    loadQuestions();
    return () => { isMounted = false; };
  }, [lesson?.id]);

  // Speech helper
  const speakChinese = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'zh-CN';
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  };

  // Save to Database (Supabase Cloud)
  const handleSaveToDatabase = async () => {
    if (!lesson?.id) return;
    setSaving(true);
    setSaveSuccessMsg(null);
    try {
      const res = await saveLessonQuestions(lesson.id, questions);
      if (res.success) {
        setSaveSuccessMsg(`✓ Đã lưu thành công ${questions.length} câu hỏi lên Supabase Cloud!`);
        setTimeout(() => setSaveSuccessMsg(null), 4000);
      } else {
        alert('Không thể lưu câu hỏi lên Supabase');
      }
    } catch (err) {
      alert('Lỗi lưu bài tập: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Add question
  const handleAddQuestion = (type = 'listening') => {
    const nextIdx = questions.length + 1;
    let newQ = {
      id: `q-${lesson.id}-${Date.now()}`,
      type,
      title: `Câu hỏi ${nextIdx}: ${type === 'listening' ? 'Luyện Nghe' : type === 'pinyin' ? 'Pinyin' : type === 'word_order' ? 'Ghép câu' : type === 'voice' ? 'Khẩu ngữ' : 'Viết chữ'}`,
      tag: type === 'listening' ? 'Nghe hiểu' : type === 'pinyin' ? 'Phát âm' : type === 'word_order' ? 'Ngữ pháp' : type === 'voice' ? 'Khẩu ngữ' : 'Viết chữ',
      instruction: 'Vui lòng làm theo hướng dẫn bài tập:',
      data: {}
    };

    if (type === 'listening') {
      newQ.data = {
        audioText: '苹果多少钱一斤？',
        hint: 'Nghe kỹ giá tiền trong đoạn thoại',
        options: [
          { id: 'A', hanzi: '五块钱一斤', pinyin: 'wǔ kuài qián yì jīn', meaning: '5 tệ một cân', isCorrect: true },
          { id: 'B', hanzi: '两块钱一斤', pinyin: 'liǎng kuài qián yì jīn', meaning: '2 tệ một cân', isCorrect: false }
        ]
      };
    } else if (type === 'pinyin') {
      newQ.data = {
        hanzi: '衣服',
        meaning: 'Quần áo',
        options: [
          { id: 'A', text: 'yī fu (Thanh nhẹ chuẩn)', isCorrect: true },
          { id: 'B', text: 'yí fù', isCorrect: false }
        ],
        explanation: 'Từ 衣服 chữ 服 đọc thanh nhẹ.'
      };
    } else if (type === 'word_order') {
      newQ.data = {
        chips: [
          { id: 'c1', word: '苹果', pinyin: 'píngguǒ' },
          { id: 'c2', word: '很', pinyin: 'hěn' },
          { id: 'c3', word: '甜', pinyin: 'tián' },
          { id: 'c4', word: '。', pinyin: '' }
        ],
        meaning: 'Quả táo rất ngọt.'
      };
    } else if (type === 'voice') {
      newQ.data = {
        text: '老板，这件衣服太贵了！',
        pinyin: 'Lǎobǎn, zhè jiàn yīfu tài guì le!',
        meaning: 'Ông chủ ơi, bộ đồ này đắt quá!'
      };
    } else {
      newQ.data = {
        char: '买',
        pinyin: 'mǎi',
        strokes: 6,
        radicals: '乙 (Ất)'
      };
    }

    setQuestions([...questions, newQ]);
    setActiveTabQIndex(questions.length);
  };

  // Remove question
  const handleRemoveQuestion = (idx) => {
    if (window.confirm('Bạn có chắc muốn xóa câu hỏi này khỏi bài tập?')) {
      const updated = questions.filter((_, i) => i !== idx);
      setQuestions(updated);
      if (activeTabQIndex >= updated.length) {
        setActiveTabQIndex(Math.max(0, updated.length - 1));
      }
    }
  };

  // Update specific question field
  const updateQuestion = (idx, field, value) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  // Update question nested data
  const updateQuestionData = (idx, dataField, value) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[idx] = {
        ...copy[idx],
        data: {
          ...copy[idx].data,
          [dataField]: value
        }
      };
      return copy;
    });
  };

  // Helper for word order chip builder
  const handleWordChipsInput = (idx, commaSeparatedText) => {
    const rawWords = commaSeparatedText.split(/[,，\s]+/).filter((w) => w.trim().length > 0);
    const newChips = rawWords.map((w, i) => ({
      id: `w-${i}-${Date.now()}`,
      word: w.trim(),
      pinyin: ''
    }));
    updateQuestionData(idx, 'chips', newChips);
  };

  const currentQ = questions[activeTabQIndex];

  return (
    <div className="homework-editor-layout" style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '3rem' }}>
      
      {/* 1. TOP HEADER & CONTROLS */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '1rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              padding: '0.55rem 1rem',
              borderRadius: '999px',
              border: '1px solid #cbd5e1',
              background: '#f1f5f9',
              color: '#334155',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>Quay lại Khóa Học</span>
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: '#fef2f2', color: '#b91c1c', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                {course?.level || 'HSK'}
              </span>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {lesson?.title || 'Bài tập buổi học'}
              </h1>
            </div>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.82rem', color: '#64748b' }}>
              Soạn đề và Preview theo góc nhìn học sinh trong thời gian thực ({questions.length} câu hỏi)
            </p>
          </div>
        </div>

        {/* View Switcher & Save Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* View Mode Buttons */}
          <div style={{ background: '#f1f5f9', padding: '4px', borderRadius: '10px', display: 'flex', gap: '4px' }}>
            <button
              type="button"
              onClick={() => setViewMode('split')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                background: viewMode === 'split' ? '#ffffff' : 'transparent',
                color: viewMode === 'split' ? '#b91c1c' : '#64748b',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                boxShadow: viewMode === 'split' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <i className="fa-solid fa-table-columns"></i>
              <span>Song Song (Split)</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('editor')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                background: viewMode === 'editor' ? '#ffffff' : 'transparent',
                color: viewMode === 'editor' ? '#b91c1c' : '#64748b',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                boxShadow: viewMode === 'editor' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <i className="fa-solid fa-pen-to-square"></i>
              <span>Chỉ Soạn Đề</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                background: viewMode === 'preview' ? '#ffffff' : 'transparent',
                color: viewMode === 'preview' ? '#b91c1c' : '#64748b',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                boxShadow: viewMode === 'preview' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <i className="fa-solid fa-eye"></i>
              <span>Góc Nhìn Học Sinh</span>
            </button>
          </div>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSaveToDatabase}
            disabled={saving}
            style={{
              background: '#b91c1c',
              color: '#ffffff',
              padding: '0.65rem 1.25rem',
              borderRadius: '10px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 8px rgba(185, 28, 28, 0.3)'
            }}
          >
            <i className={`fa-solid ${saving ? 'fa-spinner fa-spin' : 'fa-floppy-disk'}`}></i>
            <span>{saving ? 'Đang Lưu...' : 'Lưu Vào Database'}</span>
          </button>
        </div>
      </header>

      {/* Save Notification Banner */}
      {saveSuccessMsg && (
        <div style={{
          background: '#dcfce7',
          color: '#15803d',
          padding: '0.75rem 2rem',
          textAlign: 'center',
          fontWeight: 700,
          fontSize: '0.9rem',
          borderBottom: '1px solid #bbf7d0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <i className="fa-solid fa-circle-check"></i>
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* 2. MAIN WORKSPACE */}
      <div style={{
        maxWidth: '1500px',
        margin: '1.5rem auto',
        padding: '0 1.5rem',
        display: 'grid',
        gridTemplateColumns: viewMode === 'split' ? '1fr 1fr' : '1fr',
        gap: '1.5rem',
        alignItems: 'start'
      }}>

        {/* ========================================================
            LEFT COLUMN: TEACHER EDITING PANEL (Form Soạn Câu Hỏi)
            ======================================================== */}
        {(viewMode === 'split' || viewMode === 'editor') && (
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            overflow: 'hidden'
          }}>
            {/* Question Selector Tabs */}
            <div style={{
              background: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              overflowX: 'auto',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {questions.map((q, idx) => (
                  <button
                    key={q.id || idx}
                    type="button"
                    onClick={() => setActiveTabQIndex(idx)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: activeTabQIndex === idx ? '1px solid #b91c1c' : '1px solid #cbd5e1',
                      background: activeTabQIndex === idx ? '#b91c1c' : '#ffffff',
                      color: activeTabQIndex === idx ? '#ffffff' : '#334155',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>Câu {idx + 1}</span>
                    <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>({q.type === 'listening' ? 'Nghe' : q.type === 'pinyin' ? 'Pinyin' : q.type === 'word_order' ? 'Ghép câu' : q.type === 'voice' ? 'Nói' : 'Viết'})</span>
                  </button>
                ))}
              </div>

              {/* Add New Question Menu */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => handleAddQuestion('listening')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px dashed #b91c1c',
                    background: '#fef2f2',
                    color: '#b91c1c',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <i className="fa-solid fa-plus"></i>
                  <span>Thêm Câu</span>
                </button>
              </div>
            </div>

            {/* Editing Form for the Selected Question */}
            {currentQ ? (
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      background: '#0f172a',
                      color: '#ffffff',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.85rem'
                    }}>
                      {activeTabQIndex + 1}
                    </span>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                      Chỉnh sửa Câu {activeTabQIndex + 1}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* Select Question Type */}
                    <select
                      value={currentQ.type}
                      onChange={(e) => updateQuestion(activeTabQIndex, 'type', e.target.value)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        background: '#f8fafc'
                      }}
                    >
                      <option value="listening">🎧 Dạng 1: Luyện Nghe</option>
                      <option value="pinyin">🗣️ Dạng 2: Thanh Điệu & Pinyin</option>
                      <option value="word_order">🧩 Dạng 3: Ghép Câu</option>
                      <option value="voice">🎙️ Dạng 4: Khẩu Ngữ / Thu Âm</option>
                      <option value="writing">✍️ Dạng 5: Viết Chữ Hán Ô Mễ</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(activeTabQIndex)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        border: '1px solid #fee2e2',
                        background: '#fef2f2',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        fontWeight: 700
                      }}
                      title="Xóa câu hỏi này"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>

                {/* Common Fields: Title & Instruction */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Tiêu đề / Chủ đề câu hỏi:
                    </label>
                    <input
                      type="text"
                      value={currentQ.title || ''}
                      onChange={(e) => updateQuestion(activeTabQIndex, 'title', e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                      placeholder="Ví dụ: Luyện Nghe: Hỏi giá cả"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Thẻ tag phân loại:
                    </label>
                    <input
                      type="text"
                      value={currentQ.tag || ''}
                      onChange={(e) => updateQuestion(activeTabQIndex, 'tag', e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                      placeholder="Ví dụ: Nghe hiểu, Khẩu ngữ"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Yêu cầu / Hướng dẫn học sinh:
                  </label>
                  <input
                    type="text"
                    value={currentQ.instruction || ''}
                    onChange={(e) => updateQuestion(activeTabQIndex, 'instruction', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                    placeholder="Ví dụ: Nghe đoạn audio bên dưới và chọn đáp án chính xác nhất:"
                  />
                </div>

                {/* Dynamic Type-specific Form Controls */}
                {/* 1. LISTENING QUESTION */}
                {currentQ.type === 'listening' && (
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Đoạn thoại tiếng Trung (Hệ thống sẽ tự phát âm chuẩn cho học sinh nghe):
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          value={currentQ.data?.audioText || ''}
                          onChange={(e) => updateQuestionData(activeTabQIndex, 'audioText', e.target.value)}
                          style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.92rem', fontWeight: 600 }}
                          placeholder="Ví dụ: 苹果多少钱一斤？五块钱一斤。"
                        />
                        <button
                          type="button"
                          onClick={() => speakChinese(currentQ.data?.audioText || '你好')}
                          style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', background: '#0284c7', color: '#ffffff', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <i className="fa-solid fa-volume-high"></i>
                          <span>Nghe Thử</span>
                        </button>
                      </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Gợi ý cho học sinh:
                      </label>
                      <input
                        type="text"
                        value={currentQ.data?.hint || ''}
                        onChange={(e) => updateQuestionData(activeTabQIndex, 'hint', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                        placeholder="Ví dụ: Chú ý lắng nghe số từ chỉ giá tiền..."
                      />
                    </div>

                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Các lựa chọn trả lời (Chọn nút tròn để đặt đáp án đúng):
                    </label>
                    {(currentQ.data?.options || []).map((opt, optIdx) => (
                      <div key={opt.id || optIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', background: '#ffffff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <input
                          type="radio"
                          name={`correct-opt-${activeTabQIndex}`}
                          checked={opt.isCorrect}
                          onChange={() => {
                            const updatedOpts = currentQ.data.options.map((o, i) => ({
                              ...o,
                              isCorrect: i === optIdx
                            }));
                            updateQuestionData(activeTabQIndex, 'options', updatedOpts);
                          }}
                          title="Chọn làm đáp án đúng"
                        />
                        <strong style={{ color: '#b91c1c' }}>{opt.id}.</strong>
                        <input
                          type="text"
                          value={opt.hanzi || ''}
                          onChange={(e) => {
                            const updatedOpts = [...currentQ.data.options];
                            updatedOpts[optIdx].hanzi = e.target.value;
                            updateQuestionData(activeTabQIndex, 'options', updatedOpts);
                          }}
                          placeholder="Chữ Hán (Ví dụ: 五块钱一斤)"
                          style={{ flex: 1, padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                        />
                        <input
                          type="text"
                          value={opt.meaning || ''}
                          onChange={(e) => {
                            const updatedOpts = [...currentQ.data.options];
                            updatedOpts[optIdx].meaning = e.target.value;
                            updateQuestionData(activeTabQIndex, 'options', updatedOpts);
                          }}
                          placeholder="Nghĩa tiếng Việt (Ví dụ: 5 tệ một cân)"
                          style={{ flex: 1, padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. PINYIN QUESTION */}
                {currentQ.type === 'pinyin' && (
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                          Từ vựng Chữ Hán cần phân tích:
                        </label>
                        <input
                          type="text"
                          value={currentQ.data?.hanzi || ''}
                          onChange={(e) => updateQuestionData(activeTabQIndex, 'hanzi', e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1.1rem', fontWeight: 800 }}
                          placeholder="Ví dụ: 东西"
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                          Nghĩa tiếng Việt:
                        </label>
                        <input
                          type="text"
                          value={currentQ.data?.meaning || ''}
                          onChange={(e) => updateQuestionData(activeTabQIndex, 'meaning', e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                          placeholder="Ví dụ: Đồ đạc / Mua sắm"
                        />
                      </div>
                    </div>

                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Các lựa chọn Pinyin (Chọn nút tròn để đặt đáp án đúng):
                    </label>
                    {(currentQ.data?.options || []).map((opt, optIdx) => (
                      <div key={opt.id || optIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', background: '#ffffff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <input
                          type="radio"
                          name={`correct-pinyin-${activeTabQIndex}`}
                          checked={opt.isCorrect}
                          onChange={() => {
                            const updatedOpts = currentQ.data.options.map((o, i) => ({
                              ...o,
                              isCorrect: i === optIdx
                            }));
                            updateQuestionData(activeTabQIndex, 'options', updatedOpts);
                          }}
                        />
                        <strong style={{ color: '#b91c1c' }}>{opt.id}.</strong>
                        <input
                          type="text"
                          value={opt.text || ''}
                          onChange={(e) => {
                            const updatedOpts = [...currentQ.data.options];
                            updatedOpts[optIdx].text = e.target.value;
                            updateQuestionData(activeTabQIndex, 'options', updatedOpts);
                          }}
                          placeholder="Phiên âm Pinyin (Ví dụ: dōngxi)"
                          style={{ flex: 1, padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                        />
                      </div>
                    ))}

                    <div style={{ marginTop: '0.75rem' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Lời giải thích chi tiết:
                      </label>
                      <input
                        type="text"
                        value={currentQ.data?.explanation || ''}
                        onChange={(e) => updateQuestionData(activeTabQIndex, 'explanation', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                        placeholder="Ví dụ: Chữ 西 khi đứng trong từ 东西 thì đọc thanh nhẹ..."
                      />
                    </div>
                  </div>
                )}

                {/* 3. WORD ORDER QUESTION */}
                {currentQ.type === 'word_order' && (
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Nhập các từ cần sắp xếp (Cách nhau bằng dấu phẩy hoặc khoảng trắng):
                      </label>
                      <input
                        type="text"
                        defaultValue={(currentQ.data?.chips || []).map((c) => c.word).join(', ')}
                        onBlur={(e) => handleWordChipsInput(activeTabQIndex, e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 600 }}
                        placeholder="Ví dụ: 这件衣服, 有点儿, 贵, 。"
                      />
                      <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px', display: 'block' }}>
                        * Hệ thống sẽ tự động xáo trộn các thẻ từ này để học sinh bấm ghép vào ô.
                      </span>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Nghĩa tiếng Việt của câu:
                      </label>
                      <input
                        type="text"
                        value={currentQ.data?.meaning || ''}
                        onChange={(e) => updateQuestionData(activeTabQIndex, 'meaning', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                        placeholder="Ví dụ: Bộ quần áo này hơi đắt một chút."
                      />
                    </div>
                  </div>
                )}

                {/* 4. VOICE QUESTION */}
                {currentQ.type === 'voice' && (
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Câu Chữ Hán học sinh cần đọc và thu âm:
                      </label>
                      <input
                        type="text"
                        value={currentQ.data?.text || ''}
                        onChange={(e) => updateQuestionData(activeTabQIndex, 'text', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', fontWeight: 700 }}
                        placeholder="Ví dụ: 老板，这件衣服太贵了，便宜一点儿吧！"
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                          Phiên âm Pinyin kèm thanh điệu:
                        </label>
                        <input
                          type="text"
                          value={currentQ.data?.pinyin || ''}
                          onChange={(e) => updateQuestionData(activeTabQIndex, 'pinyin', e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                          placeholder="Lǎobǎn, zhè jiàn yīfu tài guì le..."
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                          Dịch nghĩa tiếng Việt:
                        </label>
                        <input
                          type="text"
                          value={currentQ.data?.meaning || ''}
                          onChange={(e) => updateQuestionData(activeTabQIndex, 'meaning', e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                          placeholder="Ông chủ, bộ này đắt quá bớt chút đi!"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. WRITING QUESTION */}
                {currentQ.type === 'writing' && (
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                          Chữ Hán:
                        </label>
                        <input
                          type="text"
                          value={currentQ.data?.char || ''}
                          onChange={(e) => updateQuestionData(activeTabQIndex, 'char', e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1.2rem', fontWeight: 800, textAlign: 'center' }}
                          placeholder="贵"
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                          Pinyin:
                        </label>
                        <input
                          type="text"
                          value={currentQ.data?.pinyin || ''}
                          onChange={(e) => updateQuestionData(activeTabQIndex, 'pinyin', e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                          placeholder="guì"
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                          Số nét:
                        </label>
                        <input
                          type="number"
                          value={currentQ.data?.strokes || 9}
                          onChange={(e) => updateQuestionData(activeTabQIndex, 'strokes', parseInt(e.target.value, 10))}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                          Bộ thủ:
                        </label>
                        <input
                          type="text"
                          value={currentQ.data?.radicals || ''}
                          onChange={(e) => updateQuestionData(activeTabQIndex, 'radicals', e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                          placeholder="贝 (Bối)"
                        />
                      </div>
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                Chưa có câu hỏi nào. Bấm nút "+ Thêm Câu" ở trên để tạo câu hỏi đầu tiên!
              </div>
            )}
          </div>
        )}


        {/* ========================================================
            RIGHT COLUMN: REAL-TIME STUDENT PREVIEW (Góc Nhìn Học Sinh)
            ======================================================== */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '2px solid #b91c1c',
            boxShadow: '0 8px 30px rgba(185, 28, 28, 0.08)',
            overflow: 'hidden'
          }}>
            {/* Student Preview Top Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 100%)',
              color: '#ffffff',
              padding: '0.85rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fa-solid fa-graduation-cap" style={{ fontSize: '1.1rem' }}></i>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>
                    Góc Nhìn Học Sinh (Live Student Preview)
                  </div>
                  <div style={{ fontSize: '0.72rem', opacity: 0.9 }}>
                    Phản chiếu tức thì nội dung đang soạn thảo • Tương tác trực tiếp
                  </div>
                </div>
              </div>

              <span style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                {questions.length} Phần Bài Tập
              </span>
            </div>

            {/* Simulated Student Workspace */}
            <div style={{ padding: '1.25rem', maxHeight: '800px', overflowY: 'auto' }}>
              {questions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  <i className="fa-solid fa-file-circle-question" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}></i>
                  Chưa có câu hỏi nào để hiển thị góc nhìn học sinh.
                </div>
              ) : (
                questions.map((q, idx) => {
                  const isAnswered = previewAnswers[q.id] !== undefined;

                  return (
                    <article
                      key={q.id || idx}
                      className={`hw-qcard ${isAnswered ? 'answered' : ''}`}
                      style={{
                        background: '#ffffff',
                        border: activeTabQIndex === idx ? '2px solid #0284c7' : '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        marginBottom: '1.25rem',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                      }}
                    >
                      {/* Question Card Header */}
                      <div className="hw-qcard-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ background: '#f1f5f9', color: '#334155', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>
                            {String(idx + 1).padStart(2, '0')} / {String(questions.length).padStart(2, '0')}
                          </span>
                          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#b91c1c' }}>
                            {q.tag || 'Luyện tập'}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {isAnswered ? '✓ Đã thử nghiệm' : 'Chưa làm'}
                        </span>
                      </div>

                      {/* Question Instruction */}
                      <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.98rem', fontWeight: 700, color: '#0f172a' }}>
                        {q.instruction || q.title}
                      </h4>

                      {/* 1. PREVIEW: LISTENING */}
                      {q.type === 'listening' && (
                        <div>
                          {q.data?.hint && (
                            <div style={{ background: '#eff6ff', color: '#1d4ed8', padding: '6px 10px', borderRadius: '8px', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                              <i className="fa-solid fa-circle-info"></i> {q.data.hint}
                            </div>
                          )}

                          {/* Audio Player */}
                          <div style={{
                            background: '#0f172a',
                            color: '#ffffff',
                            borderRadius: '10px',
                            padding: '10px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '1rem'
                          }}>
                            <button
                              type="button"
                              onClick={() => {
                                setAudioPlayingIndex(audioPlayingIndex === idx ? null : idx);
                                speakChinese(q.data?.audioText || '你好');
                              }}
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '50%',
                                background: '#b91c1c',
                                border: 'none',
                                color: '#ffffff',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.95rem'
                              }}
                            >
                              <i className={`fa-solid ${audioPlayingIndex === idx ? 'fa-pause' : 'fa-play'}`}></i>
                            </button>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Nghe Audio phát âm chuẩn</div>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Giọng đọc mẫu chuẩn Bắc Kinh</div>
                            </div>
                          </div>

                          {/* Options Grid */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                            {(q.data?.options || []).map((opt) => {
                              const isSelected = previewAnswers[q.id] === opt.id;
                              return (
                                <label
                                  key={opt.id}
                                  onClick={() => setPreviewAnswers({ ...previewAnswers, [q.id]: opt.id })}
                                  style={{
                                    border: isSelected ? '2px solid #b91c1c' : '1px solid #e2e8f0',
                                    background: isSelected ? '#fef2f2' : '#ffffff',
                                    borderRadius: '10px',
                                    padding: '10px 14px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                  }}
                                >
                                  <span style={{
                                    width: '26px',
                                    height: '26px',
                                    borderRadius: '50%',
                                    border: isSelected ? '2px solid #b91c1c' : '1px solid #cbd5e1',
                                    background: isSelected ? '#b91c1c' : '#ffffff',
                                    color: isSelected ? '#ffffff' : '#475569',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 800,
                                    fontSize: '0.78rem'
                                  }}>
                                    {opt.id}
                                  </span>
                                  <div>
                                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>{opt.hanzi}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{opt.meaning}</div>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* 2. PREVIEW: PINYIN */}
                      {q.type === 'pinyin' && (
                        <div>
                          <div style={{ textAlign: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '10px', marginBottom: '1rem' }}>
                            <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a' }}>{q.data?.hanzi || '词语'}</div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{q.data?.meaning}</div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                            {(q.data?.options || []).map((opt) => {
                              const isSelected = previewAnswers[q.id] === opt.id;
                              return (
                                <label
                                  key={opt.id}
                                  onClick={() => setPreviewAnswers({ ...previewAnswers, [q.id]: opt.id })}
                                  style={{
                                    border: isSelected ? '2px solid #b91c1c' : '1px solid #e2e8f0',
                                    background: isSelected ? '#fef2f2' : '#ffffff',
                                    borderRadius: '10px',
                                    padding: '10px 14px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                  }}
                                >
                                  <span style={{
                                    width: '26px',
                                    height: '26px',
                                    borderRadius: '50%',
                                    border: isSelected ? '2px solid #b91c1c' : '1px solid #cbd5e1',
                                    background: isSelected ? '#b91c1c' : '#ffffff',
                                    color: isSelected ? '#ffffff' : '#475569',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 800,
                                    fontSize: '0.78rem'
                                  }}>
                                    {opt.id}
                                  </span>
                                  <div style={{ fontWeight: 700, fontSize: '0.98rem', color: '#0f172a' }}>
                                    {opt.text}
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* 3. PREVIEW: WORD ORDER */}
                      {q.type === 'word_order' && (
                        <div>
                          <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '8px' }}>
                            Nghĩa câu: <em>"{q.data?.meaning || '...'}"</em>
                          </div>

                          {/* Interactive Chips Dropzone */}
                          <div style={{
                            minHeight: '48px',
                            background: '#f8fafc',
                            border: '2px dashed #cbd5e1',
                            borderRadius: '10px',
                            padding: '8px',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '6px',
                            alignItems: 'center',
                            marginBottom: '10px'
                          }}>
                            {(!previewWords[q.id] || previewWords[q.id].length === 0) ? (
                              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Bấm các thẻ từ bên dưới để ghép vào đây...</span>
                            ) : (
                              previewWords[q.id].map((w, wIdx) => (
                                <button
                                  key={wIdx}
                                  type="button"
                                  onClick={() => {
                                    const next = previewWords[q.id].filter((_, i) => i !== wIdx);
                                    setPreviewWords({ ...previewWords, [q.id]: next });
                                  }}
                                  style={{
                                    padding: '0 12px',
                                    height: '40px',
                                    minHeight: '40px',
                                    boxSizing: 'border-box',
                                    borderRadius: '8px',
                                    background: '#b91c1c',
                                    color: '#ffffff',
                                    border: 'none',
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px'
                                  }}
                                >
                                  <span>{w}</span>
                                  <i className="fa-solid fa-xmark" style={{ fontSize: '0.75rem' }}></i>
                                </button>
                              ))
                            )}
                          </div>

                          {/* Chips Pool */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
                            {(q.data?.chips || []).map((chip, cIdx) => (
                              <button
                                key={chip.id || cIdx}
                                type="button"
                                onClick={() => {
                                  const current = previewWords[q.id] || [];
                                  setPreviewWords({ ...previewWords, [q.id]: [...current, chip.word] });
                                }}
                                style={{
                                  padding: '0 14px',
                                  height: '40px',
                                  minHeight: '40px',
                                  boxSizing: 'border-box',
                                  borderRadius: '8px',
                                  border: '1px solid #cbd5e1',
                                  background: '#ffffff',
                                  fontWeight: 700,
                                  fontSize: '0.95rem',
                                  color: '#0f172a',
                                  cursor: 'pointer',
                                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                {chip.word}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 4. PREVIEW: VOICE RECORDING */}
                      {q.type === 'voice' && (
                        <div style={{
                          background: '#f8fafc',
                          padding: '1.25rem',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          textAlign: 'center'
                        }}>
                          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                            {q.data?.text}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: '#b91c1c', fontWeight: 600, marginBottom: '4px' }}>
                            {q.data?.pinyin}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
                            {q.data?.meaning}
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                            <button
                              type="button"
                              onClick={() => speakChinese(q.data?.text || '')}
                              style={{
                                padding: '8px 16px',
                                borderRadius: '999px',
                                border: '1px solid #cbd5e1',
                                background: '#ffffff',
                                color: '#334155',
                                fontWeight: 700,
                                fontSize: '0.82rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              <i className="fa-solid fa-volume-high"></i>
                              <span>Nghe mẫu</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => alert('Học sinh sẽ bấm nút này để ghi âm và gửi file âm thanh lên server!')}
                              style={{
                                padding: '8px 18px',
                                borderRadius: '999px',
                                border: 'none',
                                background: '#dc2626',
                                color: '#ffffff',
                                fontWeight: 700,
                                fontSize: '0.82rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                            >
                              <i className="fa-solid fa-microphone"></i>
                              <span>Bắt đầu thu âm</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* 5. PREVIEW: WRITING */}
                      {q.type === 'writing' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
                          {/* Mi Zi Ge Grid Character */}
                          <div style={{
                            width: '90px',
                            height: '90px',
                            border: '2px solid #ef4444',
                            position: 'relative',
                            background: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '3rem',
                            fontWeight: 900,
                            color: '#b91c1c',
                            boxShadow: 'inset 0 0 0 1px #fee2e2'
                          }}>
                            {q.data?.char}
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>
                              Chữ {q.data?.char} ({q.data?.pinyin})
                            </div>
                            <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px' }}>
                              Số nét: <strong>{q.data?.strokes}</strong> • Bộ thủ: <strong>{q.data?.radicals}</strong>
                            </div>
                            <div style={{ marginTop: '8px' }}>
                              <button
                                type="button"
                                onClick={() => alert('Học sinh sẽ chụp ảnh vở viết chữ Hán và tải file lên đây.')}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  border: '1px solid #cbd5e1',
                                  background: '#ffffff',
                                  fontSize: '0.78rem',
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}
                              >
                                <i className="fa-solid fa-camera"></i> Tải ảnh chụp vở viết
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
