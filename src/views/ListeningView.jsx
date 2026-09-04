import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const SAMPLE_DRILLS = [
  {
    id: 'list-1',
    level: 'HSK 2',
    category: 'Thanh điệu & Pinyin',
    title: 'Phân biệt Thanh 1 và Thanh 4',
    audioText: '妈妈骑马，马慢，妈妈骂马。',
    pinyin: 'Māma qí mǎ, mǎ màn, māma mà mǎ.',
    translation: 'Mẹ cưỡi ngựa, ngựa chậm, mẹ mắng ngựa.',
    question: 'Trong câu trên, chữ "骂" (mắng) được phát âm theo thanh điệu nào?',
    options: ['Thanh 1 (mā - đều cao)', 'Thanh 2 (má - đi lên)', 'Thanh 3 (mǎ - xuống lên)', 'Thanh 4 (mà - dứt khoát)'],
    correctAnswer: 3,
    explanation: 'Chữ "骂" (mắng) phát âm là "mà" với thanh 4 dứt khoát từ cao xuống thấp (5 -> 1).'
  },
  {
    id: 'list-2',
    level: 'HSK 2',
    category: 'Mua sắm & Giá cả',
    title: 'Nghe hỏi giá tiền & Mặc cả',
    audioText: '这件衣服两百块，有点儿贵，你能便宜五十块吗？',
    pinyin: 'Zhè jiàn yīfu liǎng bǎi kuài, yǒudiǎnr guì, nǐ néng piányi wǔshí kuài ma?',
    translation: 'Chiếc áo này 200 tệ, hơi đắt, bạn bớt cho tôi 50 tệ được không?',
    question: 'Khách hàng mong muốn mua chiếc áo với giá bao nhiêu?',
    options: ['100 tệ', '150 tệ (两百减五十 = 150)', '200 tệ', '250 tệ'],
    correctAnswer: 1,
    explanation: 'Giá gốc 200 tệ (两百块), khách xin bớt 50 tệ (便宜五十块) -> Mức giá mong muốn là 150 tệ.'
  },
  {
    id: 'list-3',
    level: 'HSK 1',
    category: 'Đời sống thường nhật',
    title: 'Hẹn gặp mặt và Thời gian',
    audioText: '明天下午三点我们在学校门口见，好吗？好，明天见！',
    pinyin: 'Míngtiān xiàwǔ sān diǎn wǒmen zài xuéxiào ménkǒu jiàn, hǎo ma? Hǎo, míngtiān jiàn!',
    translation: '3 giờ chiều mai chúng ta gặp nhau ở cổng trường nhé? Được, mai gặp!',
    question: 'Hai người hẹn gặp nhau ở đâu và lúc mấy giờ?',
    options: ['3h chiều ở cổng trường (学校门口)', '3h chiều ở quán cà phê', '8h sáng ở lớp học', '9h tối ở thư viện'],
    correctAnswer: 0,
    explanation: 'Từ khóa nghe được: "明天下午三点" (3h chiều mai) và "学校门口" (cổng trường).'
  },
  {
    id: 'list-4',
    level: 'HSK 2',
    category: 'Ẩm thực & Nhà hàng',
    title: 'Gọi món ăn và Đồ uống',
    audioText: '服务员，请给我们两碗米饭，一盘羊肉和两瓶冰可乐。',
    pinyin: 'Fúwùyuán, qǐng gěi wǒmen liǎng wǎn mǐfàn, yì pán yángròu hé liǎng píng bīng kělè.',
    translation: 'Phục vụ ơi, cho chúng tôi 2 bát cơm trắng, 1 đĩa thịt cừu và 2 chai coca ướp lạnh.',
    question: 'Khách hàng đã gọi bao nhiêu bát cơm trắng?',
    options: ['1 bát', '2 bát (两碗米饭)', '3 bát', '4 bát'],
    correctAnswer: 1,
    explanation: 'Lượng từ cho bát cơm là "碗" (wǎn), khách gọi "两碗米饭" = 2 bát cơm.'
  }
];

export const ListeningView = ({ onBack }) => {
  const [drills, setDrills] = useState(SAMPLE_DRILLS);
  const [activeDrillIndex, setActiveDrillIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showPinyin, setShowPinyin] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);

  const currentDrill = drills[activeDrillIndex];

  // Speech synthesis helper
  const playAudio = (text, rate = 1.0) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'zh-CN';
      u.rate = rate;
      const voices = window.speechSynthesis.getVoices();
      const zh = voices.find((v) => v.lang.includes('zh') || v.lang.includes('cmn'));
      if (zh) u.voice = zh;
      u.onstart = () => setIsPlaying(true);
      u.onend = () => setIsPlaying(false);
      u.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(u);
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      playAudio(currentDrill.audioText, audioSpeed);
    }
  };

  const handleSelectOption = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === currentDrill.correctAnswer) {
      setScore((prev) => prev + 1);
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#A11D24', '#D4AF37', '#ffffff']
      });
    }
  };

  const handleNext = () => {
    if (activeDrillIndex < drills.length - 1) {
      setActiveDrillIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowPinyin(false);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    if (activeDrillIndex > 0) {
      setActiveDrillIndex((prev) => prev - 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowPinyin(false);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  return (
    <main className="main-content">
      {/* Header Banner */}
      <section className="courses-header" style={{ marginBottom: '2rem' }}>
        <div className="header-meta">
          <span className="meta-badge" style={{ background: 'rgba(161, 29, 36, 0.1)', color: '#A11D24' }}>
            🎧 Chuyên Đề Phản Xạ Tai Nghe
          </span>
          <span className="meta-class">HSK 1 - HSK 2 · Giọng Đọc Chuẩn Phổ Thông</span>
        </div>
        <h1 className="header-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span>Luyện Nghe Tiếng Trung</span>
          <span style={{ fontSize: '1.25rem', color: '#A11D24', fontFamily: 'Noto Serif SC, serif' }}>听力专项训练</span>
        </h1>
        <p className="header-desc">
          Rèn luyện phản xạ nghe tự nhiên qua từng câu thoại đời sống, tùy chỉnh tốc độ nói từ chậm tới chuẩn, phân biệt rõ thanh 1, thanh 4 và biến âm.
        </p>

        {/* Progress & Stats Bar */}
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <div className="stat-pill" style={{ background: '#fff', border: '1px solid #fee2e2', padding: '0.6rem 1.2rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <i className="fa-solid fa-headphones" style={{ color: '#A11D24' }}></i>
            <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Tiến độ:</span>
            <strong style={{ color: '#0f172a' }}>{activeDrillIndex + 1} / {drills.length} câu</strong>
          </div>
          <div className="stat-pill" style={{ background: '#fff', border: '1px solid #fee2e2', padding: '0.6rem 1.2rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <i className="fa-solid fa-circle-check" style={{ color: '#16a34a' }}></i>
            <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Chính xác:</span>
            <strong style={{ color: '#16a34a' }}>{score} câu đúng</strong>
          </div>
        </div>
      </section>

      {/* Main Interactive Listening Card */}
      <div className="question-card" style={{ maxWidth: '850px', margin: '0 auto', background: '#fff', border: '1px solid #f1f5f9', borderRadius: '20px', padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
        {/* Card Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
          <div>
            <span className="q-badge" style={{ background: '#fef2f2', color: '#A11D24', padding: '0.35rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
              {currentDrill.level} · {currentDrill.category}
            </span>
            <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '1.25rem', color: '#0f172a' }}>{currentDrill.title}</h3>
          </div>
          <button
            onClick={() => setShowPinyin(!showPinyin)}
            className="speed-btn"
            style={{ padding: '0.4rem 0.9rem', fontSize: '0.82rem', background: showPinyin ? '#A11D24' : '#f8fafc', color: showPinyin ? '#fff' : '#64748b', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer' }}
          >
            <i className="fa-solid fa-eye" style={{ marginRight: '0.35rem' }}></i>
            {showPinyin ? 'Ẩn Pinyin' : 'Hiện Pinyin'}
          </button>
        </div>

        {/* Audio Player Controller */}
        <div style={{ background: 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)', borderRadius: '16px', padding: '1.75rem', color: '#fff', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-15px', bottom: '-20px', fontSize: '6rem', color: 'rgba(255,255,255,0.06)', fontFamily: 'Noto Serif SC, serif' }}>
            听
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <button
                onClick={handleTogglePlay}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: isPlaying ? '#D4AF37' : '#ffffff',
                  color: isPlaying ? '#000' : '#A11D24',
                  border: 'none',
                  fontSize: '1.3rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
              </button>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '0.5px' }}>
                  {isPlaying ? 'Đang phát âm thanh...' : 'Bấm để nghe đoạn thoại'}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.2rem' }}>
                  Giọng đọc chuẩn Bắc Kinh (Putonghua)
                </div>
              </div>
            </div>

            {/* Speed Control */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.12)', padding: '0.4rem 0.6rem', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)' }}>Tốc độ:</span>
              {[0.75, 1.0, 1.25].map((rate) => (
                <button
                  key={rate}
                  onClick={() => {
                    setAudioSpeed(rate);
                    if (isPlaying) playAudio(currentDrill.audioText, rate);
                  }}
                  style={{
                    padding: '0.25rem 0.6rem',
                    borderRadius: '6px',
                    border: 'none',
                    background: audioSpeed === rate ? '#ffffff' : 'transparent',
                    color: audioSpeed === rate ? '#7f1d1d' : '#ffffff',
                    fontWeight: audioSpeed === rate ? 700 : 400,
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>

          {/* Optional Pinyin Hint */}
          {showPinyin && (
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.15)', fontSize: '0.95rem', color: '#fef08a' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8, marginBottom: '0.25rem' }}>Pinyin gợi ý:</div>
              <div>{currentDrill.pinyin}</div>
            </div>
          )}
        </div>

        {/* Question Prompt */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '1.05rem', color: '#1e293b', marginBottom: '1rem', fontWeight: 600 }}>
            <i className="fa-solid fa-circle-question" style={{ color: '#A11D24', marginRight: '0.5rem' }}></i>
            {currentDrill.question}
          </h4>

          {/* Options Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
            {currentDrill.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentDrill.correctAnswer;
              let bg = '#f8fafc';
              let border = '1px solid #e2e8f0';
              let textCol = '#334155';

              if (isAnswered) {
                if (isCorrect) {
                  bg = '#f0fdf4';
                  border = '1px solid #22c55e';
                  textCol = '#166534';
                } else if (isSelected) {
                  bg = '#fef2f2';
                  border = '1px solid #ef4444';
                  textCol = '#991b1b';
                }
              }

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: '12px',
                    background: bg,
                    border: border,
                    color: textCol,
                    cursor: isAnswered ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
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
                    <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{option}</span>
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
        </div>

        {/* Explanation Box when answered */}
        {isAnswered && (
          <div style={{ background: '#f8fafc', borderLeft: '4px solid #A11D24', padding: '1.25rem', borderRadius: '0 12px 12px 0', marginTop: '1.5rem' }}>
            <div style={{ fontWeight: 700, color: '#A11D24', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fa-solid fa-lightbulb"></i>
              Giải thích chi tiết của cô giáo:
            </div>
            <div style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6 }}>
              <div><strong>Nội dung câu nói:</strong> {currentDrill.audioText}</div>
              <div style={{ color: '#64748b', fontSize: '0.9rem' }}><strong>Dịch nghĩa:</strong> {currentDrill.translation}</div>
              <div style={{ marginTop: '0.5rem' }}>{currentDrill.explanation}</div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
          <button
            onClick={handlePrev}
            disabled={activeDrillIndex === 0}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              background: '#fff',
              color: activeDrillIndex === 0 ? '#cbd5e1' : '#475569',
              cursor: activeDrillIndex === 0 ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            <i className="fa-solid fa-arrow-left" style={{ marginRight: '0.5rem' }}></i>
            Câu trước
          </button>

          <button
            onClick={handleNext}
            disabled={activeDrillIndex === drills.length - 1}
            style={{
              padding: '0.65rem 1.5rem',
              borderRadius: '10px',
              border: 'none',
              background: activeDrillIndex === drills.length - 1 ? '#e2e8f0' : '#A11D24',
              color: activeDrillIndex === drills.length - 1 ? '#94a3b8' : '#ffffff',
              cursor: activeDrillIndex === drills.length - 1 ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            Câu tiếp theo
            <i className="fa-solid fa-arrow-right" style={{ marginLeft: '0.5rem' }}></i>
          </button>
        </div>
      </div>
    </main>
  );
};
