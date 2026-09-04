import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const INITIAL_SUBMISSIONS = [
  {
    id: 'sub-sample-1',
    lessonTitle: 'Bài 04: Đi Mua Sắm (买东西)',
    studentId: 'user-student-2',
    studentName: 'Trần Thị Mai',
    studentAvatar: '梅',
    submittedAt: '2 giờ trước',
    status: 'pending',
    totalScore: null,
    answers: {
      q1Answer: 'B',
      q2Answer: 'C',
      q3Sentence: '这件衣服有点儿贵。',
      q4Answers: { 'sq-1': '错 (Sai)', 'sq-2': '三斤 (3 cân)', 'sq-3': '二十五块 (25 tệ)' },
      q5AudioText: '老板，这件红色的衣服太贵了，便宜一点儿吧！',
      q6HandwritingImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
      q7EssayText: '上个星期天，我和妈妈去超市买东西。我们买了三斤苹果和两斤香蕉。苹果很甜，不贵。我们一共花了三十块钱，很高兴。',
      q7CharCount: 58
    },
    teacherComment: ''
  },
  {
    id: 'sub-sample-2',
    lessonTitle: 'Bài 03: Thời Gian & Ngày Tháng (时间与日期)',
    studentId: 'user-student-1',
    studentName: 'Nguyễn Văn An',
    studentAvatar: '安',
    submittedAt: 'Hôm qua',
    status: 'graded',
    totalScore: 9.5,
    answers: {
      q1Answer: 'B',
      q2Answer: 'C',
      q3Sentence: '明天下午三点见。',
      q4Answers: { 'sq-1': '对', 'sq-2': '3h chiều' },
      q5AudioText: '现在差一刻八点，电影八点开始。',
      q6HandwritingImage: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&auto=format&fit=crop&q=80',
      q7EssayText: '我每天早上七点起床，八点去学校。下午五点回家。晚上我和爸爸妈妈一起吃晚饭。',
      q7CharCount: 42
    },
    teacherComment: 'Em phát âm thanh 4 rất dứt khoát! Chú ý nét phẩy của chữ 贵 viết dài hơn một chút nhé.'
  }
];

export const TeacherGradingView = () => {
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const [selectedSub, setSelectedSub] = useState(INITIAL_SUBMISSIONS[0]);
  const [scoreInput, setScoreInput] = useState(9.0);
  const [commentInput, setCommentInput] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Play synthetic reading sample for teacher review
  const handleReviewAudio = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'zh-CN';
      u.rate = 0.9;
      u.onstart = () => setIsPlayingAudio(true);
      u.onend = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(u);
    }
  };

  const handleSaveGrade = () => {
    const updated = submissions.map((sub) => {
      if (sub.id === selectedSub.id) {
        return {
          ...sub,
          totalScore: parseFloat(scoreInput),
          teacherComment: commentInput,
          status: 'graded'
        };
      }
      return sub;
    });

    setSubmissions(updated);
    setSelectedSub({
      ...selectedSub,
      totalScore: parseFloat(scoreInput),
      teacherComment: commentInput,
      status: 'graded'
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#A11D24', '#16a34a', '#D4AF37']
    });

    alert('🎉 Đã lưu điểm và nhận xét cho học viên thành công!');
  };

  return (
    <main className="main-content">
      {/* Header Banner */}
      <section className="courses-header" style={{ marginBottom: '2rem' }}>
        <div className="header-meta">
          <span className="meta-badge" style={{ background: 'rgba(161, 29, 36, 0.1)', color: '#A11D24' }}>
            👩‍🏫 Bàn Chấm Bài Của Cô Giáo (Speed Grading)
          </span>
          <span className="meta-class">Quyền Giáo Viên & Quản Trị Viên</span>
        </div>
        <h1 className="header-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span>Phòng Chấm Bài & Nhận Xét Khẩu Ngữ</span>
          <span style={{ fontSize: '1.25rem', color: '#A11D24', fontFamily: 'Noto Serif SC, serif' }}>批改作业</span>
        </h1>
        <p className="header-desc">
          Chấm bài thần tốc trong 1-2 phút: nghe học sinh phát âm trực tiếp, soi bài viết chữ Hán, đọc đoạn văn và gửi nhận xét âm điệu cho học viên.
        </p>
      </section>

      {/* Main Split Interface: Submissions Queue vs Detailed Grading Canvas */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.75rem', alignItems: 'start' }}>
        {/* Left: Queue of Submissions */}
        <div style={{ background: '#fff', border: '1px solid #fee2e2', borderRadius: '20px', padding: '1.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Danh Sách Nộp Bài</span>
            <span style={{ background: '#fef2f2', color: '#A11D24', fontSize: '0.8rem', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>
              {submissions.filter((s) => s.status === 'pending').length} chờ chấm
            </span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {submissions.map((sub) => {
              const isSelected = selectedSub?.id === sub.id;
              return (
                <div
                  key={sub.id}
                  onClick={() => {
                    setSelectedSub(sub);
                    setScoreInput(sub.totalScore || 9.0);
                    setCommentInput(sub.teacherComment || '');
                  }}
                  style={{
                    padding: '1rem',
                    borderRadius: '14px',
                    border: isSelected ? '1.5px solid #A11D24' : '1px solid #f1f5f9',
                    background: isSelected ? '#fef2f2' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#A11D24', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                        {sub.studentAvatar}
                      </span>
                      <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{sub.studentName}</strong>
                    </div>
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '8px',
                      background: sub.status === 'graded' ? '#f0fdf4' : '#fff7ed',
                      color: sub.status === 'graded' ? '#16a34a' : '#c2410c',
                      fontWeight: 600
                    }}>
                      {sub.status === 'graded' ? `${sub.totalScore}đ` : 'Chờ chấm'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{sub.lessonTitle}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>Nộp: {sub.submittedAt}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Student Submission & Grading Form */}
        <div style={{ background: '#fff', border: '1px solid #fee2e2', borderRadius: '20px', padding: '2rem', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
          {/* Header of selected submission */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', margin: '0 0 0.35rem 0', color: '#0f172a' }}>
                Bài làm của: <span style={{ color: '#A11D24' }}>{selectedSub.studentName}</span>
              </h2>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                {selectedSub.lessonTitle} · Thời gian nộp: {selectedSub.submittedAt}
              </div>
            </div>
            <div>
              <span style={{
                background: selectedSub.status === 'graded' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 88, 12, 0.1)',
                color: selectedSub.status === 'graded' ? '#16a34a' : '#ea580c',
                padding: '0.4rem 1rem',
                borderRadius: '20px',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}>
                {selectedSub.status === 'graded' ? `Đã chấm: ${selectedSub.totalScore} Điểm` : 'Đang chờ cô chấm'}
              </span>
            </div>
          </div>

          {/* Answers Review Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Auto-graded summary */}
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: '#16a34a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <i className="fa-solid fa-check-double"></i>
                Phần trắc nghiệm & Ngữ pháp (Máy đã tự chấm đúng 100%):
              </div>
              <div style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6 }}>
                <div>• <strong>Câu 1 (Nghe hiểu):</strong> Học viên chọn đáp án <strong>B (五块钱 - 5 tệ)</strong> ✓</div>
                <div>• <strong>Câu 2 (Thanh điệu):</strong> Chọn <strong>C (yī fu - Thanh 1 + Thanh nhẹ)</strong> ✓</div>
                <div>• <strong>Câu 3 (Sắp xếp câu):</strong> "{selectedSub.answers.q3Sentence || '这件衣服有点儿贵。'}" ✓</div>
              </div>
            </div>

            {/* Speaking Recording Review */}
            <div style={{ border: '1px solid #fee2e2', borderRadius: '14px', padding: '1.25rem', background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ fontWeight: 700, color: '#A11D24', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-microphone"></i>
                  Câu 5: Bài Thu Âm Khẩu Ngữ Của Học Viên
                </div>
                <button
                  onClick={() => handleReviewAudio(selectedSub.answers.q5AudioText)}
                  style={{
                    background: '#A11D24',
                    color: '#fff',
                    border: 'none',
                    padding: '0.4rem 0.9rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <i className={`fa-solid ${isPlayingAudio ? 'fa-pause' : 'fa-play'}`}></i>
                  {isPlayingAudio ? 'Đang nghe...' : 'Bấm Nghe Bản Thu'}
                </button>
              </div>
              <div style={{ fontSize: '0.92rem', color: '#334155', background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px' }}>
                "{selectedSub.answers.q5AudioText}"
              </div>
            </div>

            {/* Handwriting Photo 7A */}
            <div style={{ border: '1px solid #fee2e2', borderRadius: '14px', padding: '1.25rem', background: '#fff' }}>
              <div style={{ fontWeight: 700, color: '#A11D24', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fa-solid fa-pen-nib"></i>
                Câu 6 (Dạng 7A): Ảnh Chụp Vở Tập Viết Chữ Hán
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <img
                  src={selectedSub.answers.q6HandwritingImage}
                  alt="Bài viết của học viên"
                  style={{ width: '180px', height: '120px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer' }}
                  onClick={() => window.open(selectedSub.answers.q6HandwritingImage, '_blank')}
                />
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  <div>• Học viên đã viết đủ 4 chữ: <strong>买, 卖, 贵, 钱</strong> vào ô điền tự cách.</div>
                  <div style={{ marginTop: '0.35rem', color: '#A11D24' }}>* Bấm vào ảnh để phóng to xem nét bút thuận.</div>
                </div>
              </div>
            </div>

            {/* Essay Text 7B */}
            <div style={{ border: '1px solid #fee2e2', borderRadius: '14px', padding: '1.25rem', background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ fontWeight: 700, color: '#A11D24', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-keyboard"></i>
                  Câu 7 (Dạng 7B): Đoạn Văn Học Viên Nhập Trực Tiếp
                </div>
                <span style={{ fontSize: '0.8rem', background: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '6px', color: '#475569' }}>
                  Đã viết: <strong>{selectedSub.answers.q7CharCount} chữ</strong> (Yêu cầu: ≥ 50)
                </span>
              </div>
              <div style={{ fontSize: '0.95rem', color: '#1e293b', background: '#f8fafc', padding: '1rem', borderRadius: '10px', lineHeight: 1.7, border: '1px solid #e2e8f0' }}>
                {selectedSub.answers.q7EssayText}
              </div>
            </div>
          </div>

          {/* Teacher Scoring & Feedback Action Box */}
          <div style={{ background: 'linear-gradient(135deg, #fef2f2 0%, #ffffff 100%)', border: '1.5px solid #fecaca', borderRadius: '16px', padding: '1.75rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#A11D24', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fa-solid fa-stamp"></i>
              Nhận Xét & Chấm Điểm
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '1.5rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                  Điểm số (thang 10):
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="10"
                  value={scoreInput}
                  onChange={(e) => setScoreInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 1rem',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    color: '#A11D24',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                  Lời phê chi tiết của cô giáo:
                </label>
                <textarea
                  rows="3"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Ví dụ: Em đọc thanh 4 dứt khoát, chữ viết ngay ngắn. Chú ý từ piányi phát âm nhẹ nhàng hơn..."
                  style={{
                    width: '100%',
                    padding: '0.65rem 1rem',
                    fontSize: '0.9rem',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    outline: 'none',
                    resize: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button
                onClick={handleSaveGrade}
                style={{
                  background: 'linear-gradient(135deg, #A11D24 0%, #7f1d1d 100%)',
                  color: '#fff',
                  border: 'none',
                  padding: '0.8rem 2rem',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(161, 29, 36, 0.25)'
                }}
              >
                <i className="fa-solid fa-paper-plane"></i>
                Lưu Điểm & Gửi Nhận Xét Cho Học Viên
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
