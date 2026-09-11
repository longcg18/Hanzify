import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { flattenExamQuestions } from '../data/examsData';
import { useAuth } from '../context/AuthContext';
import { saveExamAttempt } from '../services/supabaseService';

const cleanExamOption = (option) => {
  if (typeof option !== 'string') return option;
  if (/^(Đúng|正确)\s*[\(（]/i.test(option)) return '正确（√）';
  if (/^(Sai|错误|错)\s*[\(（]/i.test(option)) return '错误（×）';
  const withoutVietnameseNote = option.replace(/\s*[\(（][^\)）\u3400-\u9fff]*[\)）]/g, '').trim();
  const chineseInNote = option.match(/[\(（]([^\)）]*[\u3400-\u9fff][^\)）]*)[\)）]/);
  const visibleBase = option.split(/[\(（]/)[0];
  if (chineseInNote && !/[\u3400-\u9fff]/.test(visibleBase)) {
    const prefix = option.match(/^\s*([A-D][.:]\s*)/i)?.[1] || '';
    return `${prefix}${chineseInNote[1]}`.trim();
  }
  return withoutVietnameseNote;
};

const getChineseExamPrompt = (question) => {
  if (question?.section === 'listening') return '请听录音，选择正确答案。';
  if (question?.section === 'reading') return '请阅读下面的内容，选择正确答案。';
  return '请根据题目要求，选择正确答案。';
};

export const ExamRoomView = ({ exam, onExit }) => {
  const { user } = useAuth();
  const dynamicQuestions = React.useMemo(() => {
    if (exam?.skills && exam.skills.length > 0) {
      const flattened = flattenExamQuestions(exam);
      if (flattened.length > 0) return flattened;
    }
    return [];
  }, [exam]);

  // Group questions by skill for the matrix sidebar
  const skillGroups = React.useMemo(() => {
    const groups = {};
    dynamicQuestions.forEach((q, idx) => {
      const key = q.skillName || q.sectionTitle || 'Khác';
      if (!groups[key]) groups[key] = { name: key, type: q.section, questions: [] };
      groups[key].questions.push({ ...q, _flatIndex: idx });
    });
    return Object.values(groups);
  }, [dynamicQuestions]);

  const [questions, setQuestions] = useState(dynamicQuestions);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [timeLeft, setTimeLeft] = useState((exam?.duration || 35) * 60);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    setQuestions(dynamicQuestions);
    setCurrentQIndex(0);
    setAnswers({});
    setFlagged({});
    setTimeLeft((exam?.duration || 35) * 60);
    setIsSubmitted(false);
    setResult(null);
  }, [dynamicQuestions, exam]);

  const currentQ = questions[currentQIndex] || questions[0];

  // Derive current skill name and part title for breadcrumb
  const currentSkillName = currentQ?.skillName || (currentQ?.section === 'listening' ? 'Kỹ Năng Nghe Hiểu' : currentQ?.section === 'reading' ? 'Kỹ Năng Đọc Hiểu' : currentQ?.section === 'writing' ? 'Kỹ Năng Viết' : 'Bài Thi');
  const currentPartTitle = currentQ?.partTitle || currentQ?.sectionTitle || '';

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const playAudio = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'zh-CN';
      u.rate = 0.95;
      const voices = window.speechSynthesis.getVoices();
      const zh = voices.find((v) => v.lang.includes('zh') || v.lang.includes('cmn'));
      if (zh) u.voice = zh;
      u.onstart = () => setIsAudioPlaying(true);
      u.onend = () => setIsAudioPlaying(false);
      u.onerror = () => setIsAudioPlaying(false);
      window.speechSynthesis.speak(u);
    }
  };

  const handleSelectAnswer = (option) => {
    if (isSubmitted || !currentQ) return;
    setAnswers({ ...answers, [currentQ.id]: option });
  };

  const toggleFlag = (qId) => {
    setFlagged({ ...flagged, [qId]: !flagged[qId] });
  };

  const handleSubmitExam = () => {
    if (isSubmitted) return;
    let listeningCorrect = 0, readingCorrect = 0, writingCorrect = 0;
    let totalListening = 0, totalReading = 0, totalWriting = 0;

    questions.forEach((q) => {
      const isCorrect = answers[q.id] === q.correctAnswer;
      // `section` là field được flattenExamQuestions gán từ skill.type
      const skillType = q.section || '';
      if (skillType === 'listening') {
        totalListening++;
        if (isCorrect) listeningCorrect++;
      } else if (skillType === 'writing') {
        totalWriting++;
        if (isCorrect) writingCorrect++;
      } else {
        totalReading++;
        if (isCorrect) readingCorrect++;
      }
    });

    const listeningScore = totalListening > 0 ? Math.round((listeningCorrect / totalListening) * 100) : 0;
    const readingScore = totalReading > 0 ? Math.round((readingCorrect / totalReading) * 100) : 0;
    const writingScore = totalWriting > 0 ? Math.round((writingCorrect / totalWriting) * 100) : 0;

    const totalScore = listeningScore + readingScore + (totalWriting > 0 ? writingScore : 0);
    const passThreshold = exam?.passingScore || (totalWriting > 0 ? 180 : 120);
    const isPassed = totalScore >= passThreshold;

    const res = {
      listeningScore,
      readingScore,
      writingScore,
      hasWriting: totalWriting > 0,
      totalListening,
      totalReading,
      totalWriting,
      totalScore,
      isPassed,
      passThreshold,
      maxScore: exam?.maxScore || (totalWriting > 0 ? 300 : 200),
      answeredCount: Object.keys(answers).length,
      totalQuestions: questions.length
    };

    setResult(res);
    setIsSubmitted(true);

    if (user?.id) {
      saveExamAttempt({
          id: `${exam?.id || 'exam'}-${Date.now()}`,
          studentId: user.id,
          examId: exam?.id,
          examTitle: exam?.title || 'Đề thi HSK',
          level: exam?.level || '',
          totalScore,
          maxScore: res.maxScore,
          durationSeconds: Math.max(0, (exam?.duration || 35) * 60 - timeLeft),
          completedAt: new Date().toISOString()
      });
    }

    if (isPassed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#A11D24', '#D4AF37', '#ffffff']
      });
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📋</div>
        <h3 style={{ fontSize: '1.35rem', color: '#1e293b', marginBottom: '0.5rem', fontWeight: 700 }}>
          Đề thi chưa có câu hỏi
        </h3>
        <p style={{ color: '#64748b', marginBottom: '1.5rem', maxWidth: '420px', fontSize: '0.9rem' }}>
          Đề thi này hiện chưa được giáo viên nhập câu hỏi trên hệ thống. Vui lòng quay lại sau!
        </p>
        <button
          onClick={onExit}
          style={{
            padding: '0.65rem 1.5rem',
            background: '#A11D24',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(161, 29, 36, 0.25)'
          }}
        >
          <i className="fa-solid fa-arrow-left" style={{ marginRight: '0.5rem' }}></i>
          Quay lại danh sách đề thi
        </button>
      </div>
    );
  }

  return (
    <div className="er-wrapper">

      {/* Top Bar */}
      <div className="er-topbar">
        <div className="er-topbar-left">
          <button className="er-exit-btn" onClick={onExit}>
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div>
            <div className="er-exam-title">{exam?.title || 'Phòng Thi Mô Phỏng HSK'}</div>
            {/* Breadcrumb: Kỹ năng > Phần */}
            <div className="er-breadcrumb">
              {currentQ?.section === 'listening' ? <span className="er-bc-skill listening">🎧 {currentSkillName}</span>
               : currentQ?.section === 'reading' ? <span className="er-bc-skill reading">📖 {currentSkillName}</span>
               : currentQ?.section === 'writing' ? <span className="er-bc-skill writing">✍️ {currentSkillName}</span>
               : <span className="er-bc-skill">{currentSkillName}</span>}
              {currentPartTitle && <><span className="er-bc-sep">›</span><span className="er-bc-part">{currentPartTitle}</span></>}
            </div>
          </div>
        </div>

        <div className="er-topbar-right">
          <div className={`er-timer ${timeLeft < 300 ? 'danger' : ''}`}>
            <i className={`fa-regular fa-clock ${timeLeft < 300 ? 'fa-beat' : ''}`}></i>
            <span>{formatTime(timeLeft)}</span>
          </div>

          {!isSubmitted && (
            <button className="er-submit-btn" onClick={handleSubmitExam}>
              <i className="fa-solid fa-check"></i>
              Nộp Bài Thi
            </button>
          )}
        </div>
      </div>

      {/* Main Layout */}
      <div className="er-body">

        {/* Left: Current Question */}
        <div className="er-qpanel">
          <div className="er-qpanel-top">
            <span className="er-qnum-badge">Câu {currentQ?.questionNumber} / {questions.length}</span>
            <button
              className={`er-flag-btn ${flagged[currentQ?.id] ? 'flagged' : ''}`}
              onClick={() => toggleFlag(currentQ?.id)}
            >
              <i className="fa-solid fa-flag"></i>
              {flagged[currentQ?.id] ? 'Đã đánh dấu' : 'Đánh dấu xem lại'}
            </button>
          </div>

          {/* Prompt */}
          <p className="er-qprompt">{getChineseExamPrompt(currentQ)}</p>

          {/* Listening Audio Box */}
          {currentQ?.section === 'listening' && currentQ?.audioText && (
            <div className="er-audio-box">
              <button
                className="er-audio-play-btn"
                onClick={() => playAudio(currentQ.audioText)}
              >
                <i className={`fa-solid ${isAudioPlaying ? 'fa-volume-high' : 'fa-play'}`}></i>
              </button>
              <div>
                <div className="er-audio-info-title">
                  {isAudioPlaying ? 'Đang phát âm thanh đề thi...' : 'Bấm để nghe đoạn thoại thi'}
                </div>
                <div className="er-audio-info-sub">Chuẩn phát âm Hanban HSK</div>
              </div>
            </div>
          )}

          {/* Reading Text */}
          {currentQ?.section === 'reading' && currentQ?.readingText && (
            <div className="er-reading-box">
              {currentQ.readingText}
            </div>
          )}

          {/* Options */}
          <div className="er-options-list">
            {currentQ?.options.map((option, idx) => {
              const isSelected = answers[currentQ.id] === option;
              const isCorrect = option === currentQ.correctAnswer;
              let cls = '';
              if (!isSubmitted && isSelected) cls = 'selected';
              if (isSubmitted) {
                if (isCorrect) cls = 'correct';
                else if (isSelected) cls = 'wrong';
              }

              return (
                <div
                  key={idx}
                  className={`er-option ${cls}`}
                  onClick={() => handleSelectAnswer(option)}
                >
                  <span className="er-option-circle">{String.fromCharCode(65 + idx)}</span>
                  <span className="er-option-text">{cleanExamOption(option)}</span>
                  {isSubmitted && isCorrect && (
                    <i className="fa-solid fa-circle-check" style={{ color: '#22c55e', marginLeft: 'auto' }}></i>
                  )}
                  {isSubmitted && isSelected && !isCorrect && (
                    <i className="fa-solid fa-circle-xmark" style={{ color: '#ef4444', marginLeft: 'auto' }}></i>
                  )}
                </div>
              );
            })}
          </div>

          {/* Explanation after submit */}
          {isSubmitted && currentQ?.explanation && (
            <div className="er-explanation">
              <div className="er-explanation-title">
                <i className="fa-solid fa-circle-info"></i> Đáp án &amp; Giải thích:
              </div>
              <div className="er-explanation-text">{currentQ.explanation}</div>
            </div>
          )}

          {/* Navigation */}
          <div className="er-nav-row">
            <button
              className="er-nav-btn prev"
              onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQIndex === 0}
            >
              <i className="fa-solid fa-arrow-left"></i> Câu trước
            </button>
            <button
              className="er-nav-btn next"
              onClick={() => setCurrentQIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              disabled={currentQIndex === questions.length - 1}
            >
              Câu tiếp theo <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>

        {/* Right: Answer Sheet */}
        <div className="er-answer-sheet">
          <div className="er-sheet-title">
            <i className="fa-solid fa-table-cells"></i> Ma Trận Câu Hỏi
          </div>

          {/* Legend */}
          <div className="er-legend">
            <div className="er-legend-item">
              <span className="er-legend-dot" style={{ background: 'var(--primary-800)' }}></span> Đã làm
            </div>
            <div className="er-legend-item">
              <span className="er-legend-dot" style={{ background: 'var(--ink-100)', border: '1px solid var(--ink-200)' }}></span> Chưa làm
            </div>
            <div className="er-legend-item">
              <span className="er-legend-dot" style={{ background: '#fef08a' }}></span> Nghi vấn
            </div>
            <div className="er-legend-item">
              <span className="er-legend-dot" style={{ background: 'transparent', border: '2.5px solid var(--ink-900)' }}></span> Đang xem
            </div>
          </div>

          {/* Matrix Grid — grouped by skill */}
          {skillGroups.map((group) => (
            <div key={group.name} className="er-matrix-group">
              <div className="er-matrix-group-header">
                <span className={`er-matrix-group-icon ${group.type}`}>
                  {group.type === 'listening' ? '🎧' : group.type === 'reading' ? '📖' : group.type === 'writing' ? '✍️' : '📝'}
                </span>
                <span>{group.name.split(' ').slice(0, 3).join(' ')} ({group.questions.length} câu)</span>
              </div>
              <div className="er-matrix">
                {group.questions.map((q) => {
                  const idx = q._flatIndex;
                  const isAnswered = !!answers[q.id];
                  const isFlag = flagged[q.id];
                  const isCurrent = currentQIndex === idx;

                  let cls = '';
                  if (isSubmitted) {
                    cls = answers[q.id] === q.correctAnswer ? 'result-correct' : 'result-wrong';
                  } else if (isFlag) {
                    cls = 'flagged';
                  } else if (isAnswered) {
                    cls = 'answered';
                  }
                  if (isCurrent) cls += ' current';

                  return (
                    <button
                      key={q.id}
                      className={`er-matrix-btn ${cls}`}
                      onClick={() => setCurrentQIndex(idx)}
                    >
                      {q.questionNumber || idx + 1}
                      {isFlag && !isSubmitted && <span className="er-flag-indicator">🚩</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Stats */}
          <div className="er-stats">
            <div>Đã trả lời: <strong>{Object.keys(answers).length} / {questions.length}</strong></div>
            <div>Nghi vấn: <span className="flagged-count">{Object.values(flagged).filter(Boolean).length} câu</span></div>
          </div>
        </div>
      </div>

      {/* Result Modal */}
      {isSubmitted && result && (
        <div className="er-result-overlay">
          <div className="er-result-box">
            <div className={`er-result-icon ${result.isPassed ? 'pass' : 'fail'}`}>
              <i className={`fa-solid ${result.isPassed ? 'fa-award' : 'fa-circle-xmark'}`}></i>
            </div>

            <div className={`er-result-badge ${result.isPassed ? 'pass' : 'fail'}`}>
              {result.isPassed ? '🎉 KẾT QUẢ: ĐẠT CHUẨN (合格)' : 'CHƯA ĐẠT (不合格)'}
            </div>

            <div className="er-result-score">{result.totalScore} / {result.maxScore} điểm</div>
            <div className="er-result-threshold">Chuẩn đạt HSK: từ {result.passThreshold} điểm trở lên</div>

            <div className="er-score-breakdown">
              <div>
                <div className="er-score-item-label">Điểm Nghe hiểu (听力)</div>
                <div className="er-score-item-value">{result.listeningScore} / 100</div>
              </div>
              <div>
                <div className="er-score-item-label">Điểm Đọc hiểu (阅读)</div>
                <div className="er-score-item-value">{result.readingScore} / 100</div>
              </div>
              {result.hasWriting && (
                <div>
                  <div className="er-score-item-label">Điểm Viết (书写)</div>
                  <div className="er-score-item-value">{result.writingScore} / 100</div>
                </div>
              )}
              <div>
                <div className="er-score-item-label">Đã trả lời</div>
                <div className="er-score-item-value">{result.answeredCount} / {result.totalQuestions}</div>
              </div>
            </div>

            <div className="er-result-actions">
              <button className="er-btn-review" onClick={() => setIsSubmitted(false)}>
                Xem Lại Từng Câu
              </button>
              <button className="er-btn-exit" onClick={onExit}>
                Hoàn Thành &amp; Thoát
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
