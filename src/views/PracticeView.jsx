import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';

const PRACTICE_TOPICS = [
  // 🎧 Kỹ năng Nghe
  {
    id: 'p-list-1',
    skill: 'listening',
    skillLabel: '🎧 Luyện Nghe',
    level: 'HSK 2',
    title: 'Phân Biệt Thanh 1 và Thanh 4 Qua Câu Nói',
    desc: 'Luyện tai nghe nhận biết cao độ và độ dứt khoát của thanh 1 (cao bằng) và thanh 4 (dứt khoát).',
    questionsCount: 4,
    questions: [
      {
        prompt: 'Lắng nghe câu: "妈妈骑马，马慢，妈妈骂马。" Chữ "骂" phát âm thanh mấy?',
        audio: '妈妈骑马，马慢，妈妈骂马。',
        pinyin: 'Māma qí mǎ, mǎ màn, māma mà mǎ.',
        options: ['Thanh 1 (mā)', 'Thanh 2 (má)', 'Thanh 3 (mǎ)', 'Thanh 4 (mà)'],
        correct: 3,
        explain: 'Chữ "骂" (mà) phát âm thanh 4 dứt khoát.'
      },
      {
        prompt: 'Lắng nghe giá tiền: "这件衣服两百块，你能便宜五十块吗？" Giá mong muốn là bao nhiêu?',
        audio: '这件衣服两百块，你能便宜五十块吗？',
        pinyin: 'Zhè jiàn yīfu liǎng bǎi kuài...',
        options: ['100 tệ', '150 tệ', '200 tệ', '250 tệ'],
        correct: 1,
        explain: '200 - 50 = 150 tệ (一百五十块).'
      }
    ]
  },
  {
    id: 'p-list-2',
    skill: 'listening',
    skillLabel: '🎧 Luyện Nghe',
    level: 'HSK 1',
    title: 'Nghe Chào Hỏi & Hẹn Giờ Đời Sống',
    desc: 'Lắng nghe các mốc thời gian, địa điểm hẹn gặp và đại từ nhân xưng.',
    questionsCount: 3,
    questions: [
      {
        prompt: 'Nghe cuộc hẹn: "明天下午三点我们在学校门口见，好吗？" Hẹn ở đâu lúc mấy giờ?',
        audio: '明天下午三点我们在学校门口见，好吗？',
        pinyin: 'Míngtiān xiàwǔ sān diǎn...',
        options: ['3h chiều ở cổng trường', '3h chiều ở quán trà', '8h sáng ở lớp', '9h tối ở nhà'],
        correct: 0,
        explain: 'Từ khóa: "下午三点" (3h chiều) và "学校门口" (cổng trường).'
      }
    ]
  },

  // 📖 Kỹ năng Đọc hiểu
  {
    id: 'p-read-1',
    skill: 'reading',
    skillLabel: '📖 Đọc Hiểu',
    level: 'HSK 2',
    title: 'Đọc Hiểu Đoạn Văn Mua Sắm & Ăn Uống',
    desc: 'Rèn kỹ năng đọc lướt, phán đoán đúng/sai và bắt từ khóa trong đoạn văn ngắn.',
    questionsCount: 3,
    questions: [
      {
        prompt: 'Đoạn văn: "今天星期六，王明去超市买了三斤苹果和一个西瓜，一共二十五块钱。" -> Phán đoán: Vương Minh mua 5 cân táo.',
        options: ['对 (Đúng)', '错 (Sai - Mua 3 cân táo)'],
        correct: 1,
        explain: 'Vương Minh chỉ mua 3 cân táo (三斤苹果).'
      },
      {
        prompt: 'Đoạn văn: "桌子上有一本书，两支笔和一个苹果。" -> Trên bàn có bao nhiêu cây bút?',
        options: ['一支 (1 cây)', '两支 (2 cây)', '三支 (3 cây)'],
        correct: 1,
        explain: '"两支笔" là 2 cây bút.'
      }
    ]
  },

  // 🧩 Kỹ năng Ngữ pháp
  {
    id: 'p-gram-1',
    skill: 'grammar',
    skillLabel: '🧩 Ngữ Pháp',
    level: 'HSK 2',
    title: 'Trật Tự Câu & Phó Từ "有点儿 / 一点儿"',
    desc: 'Nắm chắc cấu trúc câu tiếng Trung: Chủ ngữ + Thời gian + Địa điểm + Động từ.',
    questionsCount: 3,
    questions: [
      {
        prompt: 'Chọn câu có trật tự ngữ pháp đúng nhất:',
        options: [
          '我明天上午去中国超市。',
          '我去中国超市明天上午。',
          '明天上午我去超市中国。'
        ],
        correct: 0,
        explain: 'Trong tiếng Trung, trạng từ chỉ thời gian đứng trước động từ: S + Time + V + O.'
      },
      {
        prompt: 'Điền từ thích hợp: "这件衣服____贵，便宜一点儿吧。"',
        options: ['一点儿', '有点儿', '很多', '十分'],
        correct: 1,
        explain: '"有点儿" đứng trước tính từ mang ý phàn nàn/không hài lòng (有点儿贵 = hơi đắt một chút).'
      }
    ]
  },

  // 📝 Kỹ năng Pinyin & Thanh điệu
  {
    id: 'p-pinyin-1',
    skill: 'pinyin',
    skillLabel: '📝 Pinyin & Thanh Điệu',
    level: 'HSK 1',
    title: 'Phân Biệt Cặp Âm Bật Hơi & Không Bật Hơi (b/p, d/t, g/k)',
    desc: 'Luyện tai và phản xạ chọn đúng phiên âm chuẩn xác.',
    questionsCount: 4,
    questions: [
      {
        prompt: 'Từ "Táo" (苹果) có phiên âm Pinyin đúng là gì?',
        options: ['píngguǒ', 'bíngguǒ', 'pǐnguǒ', 'bǐnguǒ'],
        correct: 0,
        explain: 'Chữ 苹 đọc âm bật hơi "p" và thanh 2: píng; 果 đọc thanh 3: guǒ.'
      },
      {
        prompt: 'Từ "Rẻ / Tiện lợi" (便宜) có phiên âm Pinyin chuẩn là:',
        options: ['piányi (Thanh 2 + Thanh nhẹ)', 'biànyi', 'piànyí', 'piǎnyì'],
        correct: 0,
        explain: '便宜 phiên âm chuẩn là piányi.'
      }
    ]
  },

  // ✍️ Chữ Hán & Bút thuận
  {
    id: 'p-hanzi-1',
    skill: 'hanzi',
    skillLabel: '✍️ Chữ Hán',
    level: 'HSK 1',
    title: 'Quy Tắc Bút Thuận & Bộ Thủ Căn Bản',
    desc: 'Nhận diện các bộ thủ phổ biến: bộ Nhân đứng 亻, bộ Thủy 氵, bộ Tâm 忄.',
    questionsCount: 3,
    questions: [
      {
        prompt: 'Chữ "你" (bạn) chứa bộ thủ nào?',
        options: ['Bộ Nhân đứng (亻)', 'Bộ Nữ (女)', 'Bộ Thủy (氵)', 'Bộ Khẩu (口)'],
        correct: 0,
        explain: 'Chữ 你 gồm bộ Nhân đứng (亻) bên trái và chữ 尔 bên phải.'
      }
    ]
  }
];

export const PracticeView = () => {
  const [selectedSkill, setSelectedSkill] = useState('all'); // 'all' | 'listening' | 'reading' | 'grammar' | 'pinyin' | 'hanzi'
  const [selectedLevel, setSelectedLevel] = useState('all'); // 'all' | 'HSK 1' | 'HSK 2' | 'HSK 3'
  
  // Active practice runner state
  const [activeTopic, setActiveTopic] = useState(null);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Filter topics
  const filteredTopics = PRACTICE_TOPICS.filter((t) => {
    const matchSkill = selectedSkill === 'all' || t.skill === selectedSkill;
    const matchLevel = selectedLevel === 'all' || t.level === selectedLevel;
    return matchSkill && matchLevel;
  });

  const playChineseAudio = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'zh-CN';
      u.rate = 0.95;
      u.onstart = () => setIsAudioPlaying(true);
      u.onend = () => setIsAudioPlaying(false);
      window.speechSynthesis.speak(u);
    }
  };

  const { user, setIsAuthModalOpen } = useAuth();

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
      // Completed topic practice
      alert(`🎉 Hoàn thành bài luyện tập! Điểm của bạn: ${sessionScore + (selectedOption === activeTopic.questions[currentQIdx].correct ? 0 : 0)} / ${activeTopic.questions.length}`);
      setActiveTopic(null);
    }
  };

  return (
    <main className="main-content">
      {/* Header Banner */}
      <section className="courses-header" style={{
        marginBottom: '2rem',
        background: user?.role === 'admin' ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' : undefined,
        padding: user?.role === 'admin' ? '1.75rem 2rem' : undefined,
        borderRadius: user?.role === 'admin' ? '20px' : undefined,
        color: user?.role === 'admin' ? '#f8fafc' : undefined
      }}>
        <div className="header-meta" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <span className="meta-badge" style={{
            background: user?.role === 'admin' ? 'rgba(254, 202, 202, 0.15)' : 'rgba(161, 29, 36, 0.1)',
            color: user?.role === 'admin' ? '#fca5a5' : '#A11D24'
          }}>
            {user?.role === 'admin' ? '👑 Trung Tâm Quản Trị Ngân Hàng Kỹ Năng' : '🎯 Phòng Luyện Tập Kỹ Năng Tự Do'}
          </span>
          <span className="meta-class" style={{ color: user?.role === 'admin' ? '#94a3b8' : undefined }}>
            Phân Loại Theo Kỹ Năng & Trình Độ HSK
          </span>
        </div>
        <h1 className="header-title" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: user?.role === 'admin' ? '#f8fafc' : undefined
        }}>
          <span>{user?.role === 'admin' ? 'Quản Trị Ngân Hàng Câu Hỏi Kỹ Năng' : 'Luyện Tập Kỹ Năng Tiếng Trung'}</span>
          <span style={{ fontSize: '1.25rem', color: user?.role === 'admin' ? '#fca5a5' : '#A11D24', fontFamily: 'Noto Serif SC, serif' }}>技能专项练习</span>
        </h1>
        <p className="header-desc" style={{ color: user?.role === 'admin' ? '#94a3b8' : undefined }}>
          {user?.role === 'admin'
            ? 'Quản lý ngân hàng câu hỏi phân theo 5 kỹ năng (Nghe, Đọc, Ngữ Pháp, Pinyin, Chữ Hán). Xem trước trải nghiệm luyện tập và chỉnh sửa giải thích đáp án.'
            : 'Tùy chọn luyện sâu từng kỹ năng bạn còn yếu (Nghe, Đọc, Ngữ pháp, Pinyin, Chữ Hán) theo từng cấp độ HSK 1 - HSK 3 với phản hồi và giải thích tức thì.'}
        </p>

        {user?.role === 'admin' && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '1.25rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => alert('Mở form tạo Chuyên đề luyện kỹ năng mới.')}
              style={{
                padding: '0.6rem 1.15rem',
                borderRadius: '12px',
                background: '#A11D24',
                border: 'none',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(161, 29, 36, 0.3)'
              }}
            >
              <i className="fa-solid fa-plus"></i> Thêm Chuyên Đề Mới
            </button>
            <button
              type="button"
              onClick={() => alert('Nhập danh sách câu hỏi trắc nghiệm từ file Excel/CSV.')}
              style={{
                padding: '0.6rem 1.15rem',
                borderRadius: '12px',
                background: '#334155',
                border: '1px solid #475569',
                color: '#f8fafc',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <i className="fa-solid fa-file-arrow-up"></i> Nhập Câu Hỏi Excel
            </button>
          </div>
        )}
      </section>

      {/* If Running Practice Question */}
      {activeTopic ? (
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
              <i className="fa-solid fa-arrow-left" style={{ marginRight: '0.35rem' }}></i> Đổi bài khác
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
      ) : (
        <>
          {/* Skill Filter Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            {[
              { id: 'all', label: 'Tất Cả Kỹ Năng' },
              { id: 'listening', label: '🎧 Luyện Nghe' },
              { id: 'reading', label: '📖 Đọc Hiểu' },
              { id: 'grammar', label: '🧩 Ngữ Pháp' },
              { id: 'pinyin', label: '📝 Pinyin & Thanh Điệu' },
              { id: 'hanzi', label: '✍️ Chữ Hán' }
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
                onClick={() => setSelectedLevel(lvl)}
                style={{
                  padding: '0.3rem 0.8rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: selectedLevel === lvl ? '#fee2e2' : '#f1f5f9',
                  color: selectedLevel === lvl ? '#A11D24' : '#64748b',
                  fontWeight: selectedLevel === lvl ? 700 : 500,
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
                    {item.questionsCount} câu hỏi
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
    </main>
  );
};
