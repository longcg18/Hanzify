import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

export const HomeworkView = ({ lesson, onBack }) => {
  // Homework State
  const [q1Answer, setQ1Answer] = useState(null);
  const [q2Answer, setQ2Answer] = useState(null);
  const [q3Words, setQ3Words] = useState([]);
  const [q4Recorded, setQ4Recorded] = useState(false);
  const [q5Uploaded, setQ5Uploaded] = useState(null);

  // Audio Player State (Q1)
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState(1.0);
  const [audioTime, setAudioTime] = useState('00:00');

  // Voice Recorder State (Q4)
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState('00:00');
  const micCanvasRef = useRef(null);
  const recordIntervalRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  // Submission Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState(25 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Chinese speech synthesis helper
  const speakChinese = (text, speed = 1.0) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'zh-CN';
      u.rate = speed;
      const voices = window.speechSynthesis.getVoices();
      const zhVoice = voices.find((v) => v.lang.includes('zh') || v.lang.includes('cmn'));
      if (zhVoice) u.voice = zhVoice;
      window.speechSynthesis.speak(u);
    }
  };

  // Handle Q1 Audio play
  const togglePlayAudio = () => {
    if (audioPlaying) {
      setAudioPlaying(false);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    } else {
      setAudioPlaying(true);
      speakChinese('苹果多少钱一斤？五块钱一斤。', audioSpeed);
      let sec = 0;
      const iv = setInterval(() => {
        sec++;
        setAudioTime(`00:0${sec}`);
        if (sec >= 6) {
          clearInterval(iv);
          setAudioPlaying(false);
          setAudioTime('00:00');
        }
      }, 1000 / audioSpeed);
    }
  };

  // Q3 Word chips pool
  const allWordChips = [
    { id: 'w1', word: '这件衣服', ruby: <><ruby>这<rt>zhè</rt></ruby><ruby>件<rt>jiàn</rt></ruby><ruby>衣<rt>yī</rt></ruby><ruby>服<rt>fu</rt></ruby></> },
    { id: 'w2', word: '有点儿', ruby: <><ruby>有<rt>yǒu</rt></ruby><ruby>点<rt>diǎn</rt></ruby><ruby>儿<rt>er</rt></ruby></> },
    { id: 'w3', word: '贵', ruby: <><ruby>贵<rt>guì</rt></ruby></> },
    { id: 'w4', word: '。', ruby: '。' }
  ];

  const handleChipClick = (chip) => {
    if (!q3Words.find((w) => w.id === chip.id)) {
      setQ3Words([...q3Words, chip]);
    }
  };

  const handleRemoveChip = (chipId) => {
    setQ3Words(q3Words.filter((w) => w.id !== chipId));
  };

  // Q4 Voice Recorder
  const startRecording = async () => {
    setRecording(true);
    let sec = 0;
    recordIntervalRef.current = setInterval(() => {
      sec++;
      setRecordingTime(`00:${sec < 10 ? '0' + sec : sec}`);
    }, 1000);

    // Draw animated wave
    const canvas = micCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      let animId;
      const render = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const bars = 24;
        const barWidth = 6;
        const gap = 6;
        const startX = (canvas.width - bars * (barWidth + gap)) / 2;
        const centerY = canvas.height / 2;

        for (let i = 0; i < bars; i++) {
          const h = Math.floor(Math.random() * 40) + 6;
          ctx.fillStyle = i % 2 === 0 ? '#e11d48' : '#fb7185';
          ctx.fillRect(startX + i * (barWidth + gap), centerY - h / 2, barWidth, h);
        }
        animId = requestAnimationFrame(render);
      };
      render();
    }

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.start();
      }
    } catch (e) {
      console.warn('Microphone fallback simulator activated');
    }
  };

  const stopRecording = () => {
    setRecording(false);
    clearInterval(recordIntervalRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setQ4Recorded(true);
  };

  // Q5 Photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setQ5Uploaded({ name: file.name, url, size: (file.size / (1024 * 1024)).toFixed(2) });
    }
  };

  // Calculate Progress
  let answeredCount = 0;
  if (q1Answer) answeredCount++;
  if (q2Answer) answeredCount++;
  if (q3Words.length === 4) answeredCount++;
  if (q4Recorded) answeredCount++;
  if (q5Uploaded) answeredCount++;

  const progressPercent = Math.round((answeredCount / 5) * 100);

  // Submit & Auto-grade
  const handleSubmit = () => {
    if (answeredCount < 3) {
      alert('Bạn ơi, hãy hoàn thành ít nhất các phần trắc nghiệm trước khi nộp bài nhé!');
      return;
    }

    let score = 0;
    if (q1Answer === 'A') score += 2.0;
    if (q2Answer === 'A') score += 2.0;
    if (q3Words.map((w) => w.id).join(',') === 'w1,w2,w3,w4') score += 2.0;

    setFinalScore(score);
    setIsModalOpen(true);

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="homework-view-wrapper">
      {/* Top Assignment Header */}
      <section className="assignment-header-card">
        <div className="assignment-meta">
          <button type="button" className="btn-back-link" onClick={onBack}>
            <i className="fa-solid fa-arrow-left"></i> Lộ trình bài học
          </button>
          <span className="lesson-tag">
            <i className="fa-solid fa-book-bookmark"></i> {lesson?.title || 'Bài 04: Đi Mua Sắm (买东西)'}
          </span>
          <span className="deadline-tag">
            <i className="fa-solid fa-hourglass-half"></i> Hạn nộp: 23:59 Hôm nay
          </span>
          <span className="timer-pill">
            <i className="fa-regular fa-clock"></i> {formatTimer(timeLeft)}
          </span>
        </div>

        <h1 className="assignment-title">Luyện tập Từ vựng, Ngữ pháp & Khẩu ngữ HSK 2</h1>
        <p className="assignment-desc">
          Hoàn thành 5 phần bài tập bên dưới để ôn tập mẫu câu hỏi giá, số đếm và thanh điệu tiếng Trung chuẩn xác.
        </p>

        {/* Progress Tracker */}
        <div className="progress-section">
          <div className="progress-info">
            <span className="progress-label">
              Tiến độ hoàn thành: <strong>{answeredCount}</strong> / <strong>5</strong> phần
            </span>
            <span className="progress-percentage">{progressPercent}%</span>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </section>

      {/* Main Questions Stream */}
      <main className="assignment-stream">
        {/* Q1: Listening */}
        <article className={`question-card ${q1Answer ? 'answered' : ''}`}>
          <div className="card-header">
            <div className="q-badge"><span className="q-num">01</span> / 05</div>
            <div className="q-type"><i className="fa-solid fa-headphones"></i> Luyện Nghe (听力题)</div>
            <div className="q-points"><span className="points-val">2.0</span> điểm</div>
          </div>

          <div className="card-body">
            <h2 className="q-instruction">Nghe đoạn audio bên dưới và chọn đáp án chính xác nhất:</h2>
            <p className="q-translation-hint"><i className="fa-solid fa-circle-info"></i> Hãy nghe kỹ mức giá và đồ vật được nhắc đến trong đoạn hội thoại.</p>

            <div className="custom-audio-player">
              <button type="button" className="btn-audio-play" onClick={togglePlayAudio}>
                <i className={`fa-solid ${audioPlaying ? 'fa-pause' : 'fa-play'}`}></i>
              </button>
              <div className="audio-track-info">
                <div className="audio-title">Đoạn thoại: Người bán hoa quả và khách hàng</div>
                <div className={`audio-wave-visualizer ${audioPlaying ? 'playing' : ''}`}>
                  {[...Array(10)].map((_, i) => (
                    <span key={i} className="wave-bar"></span>
                  ))}
                </div>
                <div className="audio-time">{audioTime} / 00:06</div>
              </div>
              <div className="audio-speed-controls">
                <button
                  type="button"
                  className={`speed-btn ${audioSpeed === 1.0 ? 'active' : ''}`}
                  onClick={() => setAudioSpeed(1.0)}
                >
                  1.0x
                </button>
                <button
                  type="button"
                  className={`speed-btn ${audioSpeed === 0.8 ? 'active' : ''}`}
                  onClick={() => setAudioSpeed(0.8)}
                >
                  0.8x
                </button>
              </div>
            </div>

            <div className="q-prompt-box">
              <div className="prompt-hanzi">
                <ruby>苹<rt>píng</rt></ruby><ruby>果<rt>guǒ</rt></ruby><ruby>多<rt>duō</rt></ruby><ruby>少<rt>shao</rt></ruby><ruby>钱<rt>qián</rt></ruby><ruby>一<rt>yī</rt></ruby><ruby>斤<rt>jīn</rt></ruby>？
              </div>
              <div className="prompt-meaning">"Táo bao nhiêu tiền một cân (500g)?"</div>
            </div>

            <div className="options-grid">
              {[
                { key: 'A', hanzi: '五块钱一斤', pinyin: 'wǔ kuài qián yī jīn (5 tệ/cân)' },
                { key: 'B', hanzi: '三块钱一斤', pinyin: 'sān kuài qián yī jīn (3 tệ/cân)' },
                { key: 'C', hanzi: '十块钱三斤', pinyin: 'shí kuài qián sān jīn (10 tệ/3 cân)' }
              ].map((opt) => (
                <label
                  key={opt.key}
                  className={`option-item ${q1Answer === opt.key ? 'selected' : ''}`}
                  onClick={() => setQ1Answer(opt.key)}
                >
                  <div className="option-content">
                    <span className="option-key">{opt.key}</span>
                    <div className="option-text">
                      <span className="option-hanzi">{opt.hanzi}</span>
                      <span className="option-pinyin">{opt.pinyin}</span>
                    </div>
                  </div>
                  <span className="option-check-circle"><i className="fa-solid fa-check"></i></span>
                </label>
              ))}
            </div>
          </div>
        </article>

        {/* Q2: Pinyin */}
        <article className={`question-card ${q2Answer ? 'answered' : ''}`}>
          <div className="card-header">
            <div className="q-badge"><span className="q-num">02</span> / 05</div>
            <div className="q-type"><i className="fa-solid fa-spell-check"></i> Pinyin & Thanh Điệu (拼音题)</div>
            <div className="q-points"><span className="points-val">2.0</span> điểm</div>
          </div>

          <div className="card-body">
            <h2 className="q-instruction">Chọn phiên âm Pinyin đúng nhất cho từ gạch chân:</h2>
            <div className="hanzi-focus-banner">
              <span className="hanzi-large">我想去商店买<strong className="highlight-word">东西</strong>。</span>
              <span className="hanzi-sub">Dịch nghĩa: "Tôi muốn đến cửa hàng mua đồ."</span>
            </div>

            <div className="options-grid cols-2">
              {[
                { key: 'A', pinyin: 'dōngxi', meta: 'Thanh 1 + Thanh nhẹ (Đồ đạc, vật phẩm)' },
                { key: 'B', pinyin: 'dōngxī', meta: 'Thanh 1 + Thanh 1 (Phương hướng: Đông Tây)' },
                { key: 'C', pinyin: 'dòngxī', meta: 'Thanh 4 + Thanh 1' },
                { key: 'D', pinyin: 'dóngxi', meta: 'Thanh 2 + Thanh nhẹ' }
              ].map((opt) => (
                <label
                  key={opt.key}
                  className={`option-item ${q2Answer === opt.key ? 'selected' : ''}`}
                  onClick={() => setQ2Answer(opt.key)}
                >
                  <div className="option-content">
                    <span className="option-key">{opt.key}</span>
                    <div className="option-text">
                      <span className="option-pinyin-big">{opt.pinyin}</span>
                      <span className="option-meta">{opt.meta}</span>
                    </div>
                  </div>
                  <span className="option-check-circle"><i className="fa-solid fa-check"></i></span>
                </label>
              ))}
            </div>
          </div>
        </article>

        {/* Q3: Sentence Builder */}
        <article className={`question-card ${q3Words.length === 4 ? 'answered' : ''}`}>
          <div className="card-header">
            <div className="q-badge"><span className="q-num">03</span> / 05</div>
            <div className="q-type"><i className="fa-solid fa-shuffle"></i> Ghép Từ Thành Câu (连词成句)</div>
            <div className="q-points"><span className="points-val">2.0</span> điểm</div>
          </div>

          <div className="card-body">
            <h2 className="q-instruction">Bấm chọn các từ vựng bên dưới để xếp thành câu hoàn chỉnh:</h2>
            <div className="target-translation">
              <i className="fa-solid fa-language"></i> Mục tiêu: <strong>"Chiếc áo này có hơi đắt một chút."</strong>
            </div>

            <div className={`sentence-drop-zone ${q3Words.length > 0 ? 'filled' : ''}`}>
              {q3Words.length === 0 ? (
                <div className="drop-placeholder">
                  <i className="fa-regular fa-hand-pointer"></i> Bấm vào các thẻ từ bên dưới để đưa vào câu
                </div>
              ) : (
                q3Words.map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    className="word-chip in-slot"
                    onClick={() => handleRemoveChip(chip.id)}
                  >
                    {chip.ruby}
                  </button>
                ))
              )}
            </div>

            <div className="sentence-actions">
              <button type="button" className="btn-mini-action" onClick={() => setQ3Words([])}>
                <i className="fa-solid fa-rotate-left"></i> Xếp lại từ đầu
              </button>
              <span className="sentence-hint-text">Gợi ý: [Chủ ngữ + Có chút (有点儿) + Tính từ]</span>
            </div>

            <div className="word-pool">
              {allWordChips.map((chip) => {
                const isUsed = q3Words.some((w) => w.id === chip.id);
                return (
                  <button
                    key={chip.id}
                    type="button"
                    className={`word-chip ${isUsed ? 'used' : ''}`}
                    onClick={() => handleChipClick(chip)}
                  >
                    {chip.ruby}
                  </button>
                );
              })}
            </div>
          </div>
        </article>

        {/* Q4: Voice Recording */}
        <article className={`question-card ${q4Recorded ? 'answered' : ''}`}>
          <div className="card-header">
            <div className="q-badge"><span className="q-num">04</span> / 05</div>
            <div className="q-type"><i className="fa-solid fa-microphone-lines"></i> Luyện Nói & Thu Âm (口语录音)</div>
            <div className="q-points"><span className="points-val">2.0</span> điểm</div>
          </div>

          <div className="card-body">
            <h2 className="q-instruction">Đọc to câu tiếng Trung sau và bấm Ghi âm để gửi bài cho cô giáo:</h2>
            <div className="speaking-prompt-card">
              <div className="listen-sample-btn-wrap">
                <button
                  type="button"
                  className="btn-sample-audio"
                  onClick={() => speakChinese('太贵了，便宜一点儿吧！', 0.9)}
                >
                  <i className="fa-solid fa-volume-high"></i> Nghe cô giáo phát âm mẫu
                </button>
              </div>

              <div className="reading-hanzi-text">
                <ruby>太<rt>tài</rt></ruby>
                <ruby>贵<rt>guì</rt></ruby>
                <ruby>了<rt>le</rt></ruby>，
                <ruby>便<rt>pián</rt></ruby><ruby>宜<rt>yi</rt></ruby>
                <ruby>一<rt>yì</rt></ruby><ruby>点<rt>diǎn</rt></ruby><ruby>儿<rt>er</rt></ruby>
                <ruby>吧<rt>ba</rt></ruby>！
              </div>
              <div className="reading-meaning">"Đắt quá rồi, rẻ hơn một chút đi mà!"</div>
            </div>

            <div className={`recorder-widget ${recording ? 'recording' : ''}`}>
              <div className="recorder-status">
                <span className="status-dot"></span>
                <span>{recording ? 'Đang thu âm giọng đọc...' : q4Recorded ? 'Đã hoàn thành bản thu' : 'Sẵn sàng thu âm'}</span>
              </div>

              <div className="live-visualizer-container">
                <canvas ref={micCanvasRef} width="320" height="60"></canvas>
              </div>

              <div className="recorder-timer">{recordingTime}</div>

              <div className="recorder-controls">
                {!recording ? (
                  <button type="button" className="btn-record-main" onClick={startRecording}>
                    <i className="fa-solid fa-microphone"></i>
                    <span>{q4Recorded ? 'Thu Âm Lại' : 'Bắt đầu Thu Âm'}</span>
                  </button>
                ) : (
                  <button type="button" className="btn-record-main stop" onClick={stopRecording}>
                    <i className="fa-solid fa-stop"></i>
                    <span>Dừng & Lưu Thu Âm</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </article>

        {/* Q5: Handwriting */}
        <article className={`question-card ${q5Uploaded ? 'answered' : ''}`}>
          <div className="card-header">
            <div className="q-badge"><span className="q-num">05</span> / 05</div>
            <div className="q-type"><i className="fa-solid fa-pen-nib"></i> Nộp Bài Viết Chữ Hán (汉字书写)</div>
            <div className="q-points"><span className="points-val">2.0</span> điểm</div>
          </div>

          <div className="card-body">
            <h2 className="q-instruction">Viết chữ Hán vào vở ô ly theo quy tắc bút thuận rồi chụp ảnh tải lên:</h2>
            <div className="tianzige-preview">
              {[
                { char: '买', desc: 'Mǎi (Mua) - 6 nét' },
                { char: '贵', desc: 'Guì (Đắt) - 9 nét' },
                { char: '钱', desc: 'Qián (Tiền) - 10 nét' }
              ].map((t, idx) => (
                <div key={idx} className="tianzige-box">
                  <span className="grid-watermark">{t.char}</span>
                  <span className="char-meaning">{t.desc}</span>
                </div>
              ))}
            </div>

            <div className="upload-zone">
              <input
                type="file"
                id="fileUploadInput"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handlePhotoChange}
              />
              {!q5Uploaded ? (
                <label htmlFor="fileUploadInput" className="upload-ui" style={{ cursor: 'pointer' }}>
                  <div className="upload-icon-circle">
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                  </div>
                  <div className="upload-texts">
                    <strong>Chạm để chụp ảnh hoặc tải ảnh vở viết lên</strong>
                    <span>Hỗ trợ JPG, PNG, HEIC (Tối đa 10MB)</span>
                  </div>
                  <span className="btn-choose-file">
                    <i className="fa-solid fa-camera"></i> Chọn Ảnh Vở
                  </span>
                </label>
              ) : (
                <div className="upload-preview-ui">
                  <img src={q5Uploaded.url} alt="Xem trước" className="preview-img-tag" />
                  <div className="preview-details">
                    <span className="preview-filename">{q5Uploaded.name}</span>
                    <span className="preview-size">{q5Uploaded.size} MB</span>
                    <button type="button" className="btn-remove-photo" onClick={() => setQ5Uploaded(null)}>
                      <i className="fa-solid fa-trash-can"></i> Đổi ảnh khác
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </article>
      </main>

      {/* Bottom Sticky Submission Bar */}
      <footer className="submission-dock">
        <div className="dock-container">
          <div className="dock-summary">
            <div className="dock-status-icon"><i className="fa-solid fa-circle-check"></i></div>
            <div className="dock-status-text">
              <div className="dock-title">Đã làm: {answeredCount}/5 phần</div>
              <div className="dock-sub">
                {answeredCount === 5 ? 'Tuyệt vời! Bạn đã làm xong tất cả.' : `Còn ${5 - answeredCount} phần chưa làm`}
              </div>
            </div>
          </div>

          <button type="button" className="btn-submit-assignment" onClick={handleSubmit}>
            <span>Nộp Bài</span>
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </footer>

      {/* Result Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-confetti-badge">
              <span className="badge-chinese">太棒了</span>
            </div>

            <h2 className="modal-headline">Nộp Bài Tập Thành Công! 🎉</h2>
            <p className="modal-sub">Hệ thống đã tự động chấm phần trắc nghiệm & gửi bài nói, bài viết đến cô giáo.</p>

            <div className="score-showcase">
              <div className="score-circle">
                <span className="score-number">{finalScore.toFixed(1)}</span>
                <span className="score-total">/ 10.0</span>
              </div>
              <div className="score-breakdown">
                <div className="score-item success">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>Trắc nghiệm & Nghe: <strong>4.0 / 4.0</strong></span>
                </div>
                <div className="score-item success">
                  <i className="fa-solid fa-circle-check"></i>
                  <span>Ghép câu: <strong>{q3Words.map((w) => w.id).join(',') === 'w1,w2,w3,w4' ? '2.0 / 2.0' : '0.0 / 2.0'}</strong></span>
                </div>
                <div className="score-item pending">
                  <i className="fa-solid fa-hourglass-half"></i>
                  <span>Thu âm & Vở viết: <strong>Đang chờ cô chấm (4.0 đ)</strong></span>
                </div>
              </div>
            </div>

            <div className="modal-feedback-box">
              <div className="teacher-feedback-header">
                <div className="teacher-badge-avatar">灵</div>
                <div className="teacher-name">Cô Linh Nhắn Nhủ:</div>
              </div>
              <p className="teacher-msg">
                "Em nắm rất tốt mẫu câu hỏi giá '多少钱'. Bài nói cô sẽ nghe và gửi audio sửa phát âm cho em trước 20h tối mai nhé!"
              </p>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-review-answers" onClick={onBack}>
                <i className="fa-solid fa-check"></i> Hoàn Thành & Quay Lại Lớp
              </button>
              <button type="button" className="btn-modal-close" onClick={() => setIsModalOpen(false)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
