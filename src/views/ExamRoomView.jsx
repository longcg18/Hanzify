import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const SAMPLE_EXAM_QUESTIONS = [
  {
    id: 'eq-1',
    section: 'listening',
    sectionTitle: 'Phần 1: Nghe Hiểu (听力部分)',
    questionNumber: 1,
    prompt: 'Lắng nghe câu thoại và chọn nội dung/tình huống đúng nhất.',
    audioText: '外面下大雨了，你别出去了。',
    pinyin: 'Wàimiàn xià dàyǔ le, nǐ bié chūqu le.',
    options: ['Trời đang nắng to', 'Trời đang mưa to', 'Trời có tuyết rơi', 'Trời nhiều gió'],
    correctAnswer: 'Trời đang mưa to',
    explanation: 'Từ khóa nghe được: "下大雨" (mưa to), câu nói khuyên đừng ra ngoài vì trời mưa to.'
  },
  {
    id: 'eq-2',
    section: 'listening',
    sectionTitle: 'Phần 1: Nghe Hiểu (听力部分)',
    questionNumber: 2,
    prompt: 'Lắng nghe cuộc đối thoại ngắn và xác định địa điểm.',
    audioText: '男：服务员，我想点菜。女：好的先生，请问您想吃什么？',
    pinyin: 'Nán: Fúwùyuán, wǒ xiǎng diǎncài. Nǚ: Hǎode xiānsheng, qǐngwèn nín xiǎng chī shénme?',
    options: ['Ở bệnh viện', 'Ở sân bay', 'Ở nhà hàng / Quán ăn', 'Ở rạp chiếu phim'],
    correctAnswer: 'Ở nhà hàng / Quán ăn',
    explanation: 'Từ khóa: "服务员" (phục vụ) và "点菜" (gọi món ăn) -> Địa điểm là nhà hàng/quán ăn.'
  },
  {
    id: 'eq-3',
    section: 'listening',
    sectionTitle: 'Phần 1: Nghe Hiểu (听力部分)',
    questionNumber: 3,
    prompt: 'Lắng nghe thông tin về giờ giấc.',
    audioText: '现在是差一刻八点，电影八点开始。',
    pinyin: 'Xiànzài shì chà yí kè bā diǎn, diànyǐng bā diǎn kāishǐ.',
    options: ['7 giờ 45 phút', '8 giờ 15 phút', '8 giờ đúng', '7 giờ 30 phút'],
    correctAnswer: '7 giờ 45 phút',
    explanation: '"差一刻八点" = kém 15 phút 8 giờ = 7:45.'
  },
  {
    id: 'eq-4',
    section: 'listening',
    sectionTitle: 'Phần 1: Nghe Hiểu (听力部分)',
    questionNumber: 4,
    prompt: 'Lắng nghe sở thích của nhân vật.',
    audioText: '我最喜欢踢足球，我哥哥喜欢打篮球。',
    pinyin: 'Wǒ zuì xǐhuan tī zúqiú, wǒ gēge xǐhuan dǎ lánqiú.',
    options: ['Người nói thích đá bóng', 'Người nói thích bóng rổ', 'Anh trai thích đá bóng', 'Cả hai đều thích bơi'],
    correctAnswer: 'Người nói thích đá bóng',
    explanation: '"我最喜欢踢足球" -> Người nói thích nhất là môn bóng đá.'
  },
  {
    id: 'eq-5',
    section: 'listening',
    sectionTitle: 'Phần 1: Nghe Hiểu (听力部分)',
    questionNumber: 5,
    prompt: 'Lắng nghe phương tiện di chuyển nhanh nhất.',
    audioText: '去火车站坐出租车要半个小时，坐地铁只要十五分钟。',
    pinyin: 'Qù huǒchēzhàn zuò chūzūchē yào bàn gè xiǎoshí, zuò dìtiě zhǐ yào shíwǔ fēnzhōng.',
    options: ['Đi tàu hỏa', 'Đi taxi', 'Đi xe buýt', 'Đi tàu điện ngầm (nhanh nhất)'],
    correctAnswer: 'Đi tàu điện ngầm (nhanh nhất)',
    explanation: 'Đi taxi mất 30 phút, đi tàu điện ngầm ("坐地铁") chỉ mất 15 phút.'
  },
  {
    id: 'eq-6',
    section: 'reading',
    sectionTitle: 'Phần 2: Đọc Hiểu (阅读部分)',
    questionNumber: 6,
    prompt: 'Phán đoán Đúng / Sai dựa vào câu văn sau:',
    readingText: '医生说我生病了，需要多喝水，多休息，不能去上班。 -> Phán đoán: Người này hôm nay vẫn đi làm bình thường.',
    pinyin: 'Yīshēng shuō wǒ shēngbìng le...',
    options: ['对 (Đúng)', '错 (Sai)'],
    correctAnswer: '错 (Sai)',
    explanation: 'Câu văn ghi rõ "不能去上班" (không thể đi làm) nên phán đoán đi làm bình thường là Sai.'
  },
  {
    id: 'eq-7',
    section: 'reading',
    sectionTitle: 'Phần 2: Đọc Hiểu (阅读部分)',
    questionNumber: 7,
    prompt: 'Đọc câu văn và trả lời câu hỏi:',
    readingText: '桌子上有一本书，两支笔和一个苹果。 -> Hỏi: Trên bàn có mấy cái bút?',
    pinyin: 'Zhuōzi shang yǒu yì běn shū, liǎng zhī bǐ...',
    options: ['一支 (1 cái)', '两支 (2 cái)', '三支 (3 cái)'],
    correctAnswer: '两支 (2 cái)',
    explanation: 'Lượng từ cho bút là "支" (zhī), câu ghi rõ "两支笔" = 2 cây bút.'
  },
  {
    id: 'eq-8',
    section: 'reading',
    sectionTitle: 'Phần 2: Đọc Hiểu (阅读部分)',
    questionNumber: 8,
    prompt: 'Đọc lịch trình và chọn thời gian đúng:',
    readingText: '小张每天早上六点起床跑步，然后七点吃早饭，八点去公司。 -> Hỏi: Tiểu Trương mấy giờ ăn sáng?',
    pinyin: 'Xiǎo Zhāng měitiān zǎoshang liù diǎn...',
    options: ['6:00', '7:00', '8:00', '8:30'],
    correctAnswer: '7:00',
    explanation: 'Nội dung: "七点吃早饭" (7 giờ ăn sáng).'
  },
  {
    id: 'eq-9',
    section: 'reading',
    sectionTitle: 'Phần 2: Đọc Hiểu (阅读部分)',
    questionNumber: 9,
    prompt: 'Chọn từ thích hợp nhất điền vào chỗ trống:',
    readingText: '教室里很安静，大家都在认真地____书。',
    pinyin: 'Jiàoshì lǐ hěn ānjìng, dàjiā dōu zài rènlǐn de ____ shū.',
    options: ['看 (Đọc / Xem)', '喝 (Uống)', '跑 (Chạy)', '买 (Mua)'],
    correctAnswer: '看 (Đọc / Xem)',
    explanation: 'Cụm từ cố định trong tiếng Trung: 看书 (kàn shū) = Đọc sách.'
  },
  {
    id: 'eq-10',
    section: 'reading',
    sectionTitle: 'Phần 2: Đọc Hiểu (阅读部分)',
    questionNumber: 10,
    prompt: 'Chọn trật tự ngữ pháp chính xác cho các từ sau: (1) 汉语 / (2) 我 / (3) 学 / (4) 正在',
    readingText: 'Sắp xếp trật tự từ: (1) 汉语 (2) 我 (3) 学 (4) 正在',
    pinyin: null,
    options: [
      '(2)-(4)-(3)-(1): 我正在学汉语。',
      '(4)-(2)-(3)-(1): 正在我学汉语。',
      '(1)-(2)-(3)-(4): 汉语我学正在。'
    ],
    correctAnswer: '(2)-(4)-(3)-(1): 我正在学汉语。',
    explanation: 'Ngữ pháp câu tiến hành: Chủ ngữ (我) + 正在 + Động từ (学) + Tân ngữ (汉语).'
  }
];

import { flattenExamQuestions } from '../data/examsData';

export const ExamRoomView = ({ exam, onExit }) => {
  const dynamicQuestions = React.useMemo(() => {
    if (exam?.skills && exam.skills.length > 0) {
      const flattened = flattenExamQuestions(exam);
      if (flattened.length > 0) return flattened;
    }
    return SAMPLE_EXAM_QUESTIONS;
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

    if (isPassed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#A11D24', '#D4AF37', '#ffffff']
      });
    }
  };

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
          <p className="er-qprompt">{currentQ?.prompt}</p>

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
                  <span className="er-option-text">{option}</span>
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
