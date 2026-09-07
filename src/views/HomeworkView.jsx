import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { fetchLessonQuestions, submitHomeworkToSupabase, uploadMediaToSupabase } from '../services/supabaseService';
import { useAuth } from '../context/AuthContext';

export const HomeworkView = ({ lesson, onBack }) => {
  const { user, setIsAuthModalOpen } = useAuth();
  const [dbQuestions, setDbQuestions] = useState([]);

  useEffect(() => {
    if (lesson?.id) {
      fetchLessonQuestions(lesson.id).then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setDbQuestions(data);
        }
      });
    }
  }, [lesson?.id]);

  // Homework Answers State
  const [q1Answer, setQ1Answer] = useState(null);
  const [q2Answer, setQ2Answer] = useState(null);
  const [q3Words, setQ3Words] = useState([]);

  // Q4 Dynamic Reading Answers (2 options True/False, 3 options, 4 options)
  const [q4Answers, setQ4Answers] = useState({});

  // Q5 Real Voice Recording State (MediaRecorder)
  const [q5Recorded, setQ5Recorded] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState('00:00');
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState(null);
  const [micError, setMicError] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordIntervalRef = useRef(null);

  // Q6 Writing 7A: Handwritten Photo
  const [q6File, setQ6File] = useState(null);
  const [q6Photo, setQ6Photo] = useState(null);

  // Q7 Writing 7B: Essay Textarea with Character Counter
  const [q7EssayText, setQ7EssayText] = useState('');
  const minEssayChars = 50;

  // Audio Player State (Q1)
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState(1.0);
  const [audioTime, setAudioTime] = useState('00:00');
  const [uploadStatusMsg, setUploadStatusMsg] = useState('');

  // Submission Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState(30 * 60);

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
    { id: 'w4', word: '。', ruby: <ruby>。<rt style={{ visibility: 'hidden' }}>&nbsp;</rt></ruby> }
  ];

  const handleChipClick = (chip) => {
    if (!q3Words.find((w) => w.id === chip.id)) {
      setQ3Words([...q3Words, chip]);
    }
  };

  const handleRemoveChip = (chipId) => {
    setQ3Words(q3Words.filter((w) => w.id !== chipId));
  };

  // Q5 Real Voice Recorder (MediaRecorder API)
  const startRecording = async () => {
    setMicError('');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Trình duyệt không hỗ trợ ghi âm trực tiếp.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      let mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        if (MediaRecorder.isTypeSupported('audio/mp4')) mimeType = 'audio/mp4';
        else if (MediaRecorder.isTypeSupported('audio/ogg')) mimeType = 'audio/ogg';
        else mimeType = '';
      }

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const actualMime = recorder.mimeType || 'audio/webm';
        const recordedBlob = new Blob(audioChunksRef.current, { type: actualMime });
        setAudioBlob(recordedBlob);

        if (audioPreviewUrl) {
          URL.revokeObjectURL(audioPreviewUrl);
        }
        const preview = URL.createObjectURL(recordedBlob);
        setAudioPreviewUrl(preview);
        setQ5Recorded(true);

        // Turn off microphone light/tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start(200); // 200ms slice
      setRecording(true);

      let sec = 0;
      setRecordingTime('00:00');
      if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
      recordIntervalRef.current = setInterval(() => {
        sec++;
        const m = Math.floor(sec / 60).toString().padStart(2, '0');
        const s = (sec % 60).toString().padStart(2, '0');
        setRecordingTime(`${m}:${s}`);
      }, 1000);
    } catch (err) {
      console.error('Microphone error:', err);
      setMicError('Không thể truy cập Micro. Vui lòng cho phép quyền micro trong trình duyệt để ghi âm.');
      setRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
    if (recordIntervalRef.current) {
      clearInterval(recordIntervalRef.current);
    }
  };

  const resetRecording = () => {
    stopRecording();
    if (audioPreviewUrl) {
      URL.revokeObjectURL(audioPreviewUrl);
    }
    setAudioBlob(null);
    setAudioPreviewUrl(null);
    setQ5Recorded(false);
    setRecordingTime('00:00');
    setMicError('');
  };

  // Q6 Photo Upload Handler
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (q6Photo?.url) {
        URL.revokeObjectURL(q6Photo.url);
      }
      const url = URL.createObjectURL(file);
      setQ6File(file);
      setQ6Photo({ name: file.name, url, size: (file.size / (1024 * 1024)).toFixed(2) });
    }
  };

  const handleRemovePhoto = () => {
    if (q6Photo?.url) {
      URL.revokeObjectURL(q6Photo.url);
    }
    setQ6File(null);
    setQ6Photo(null);
  };

  // Calculate Progress across 7 components
  let answeredCount = 0;
  if (q1Answer) answeredCount++;
  if (q2Answer) answeredCount++;
  if (q3Words.length === 4) answeredCount++;
  if (Object.keys(q4Answers).length >= 2) answeredCount++;
  if (q5Recorded) answeredCount++;
  if (q6Photo) answeredCount++;
  if (q7EssayText.trim().length >= 30) answeredCount++;

  const totalParts = 7;
  const progressPercent = Math.round((answeredCount / totalParts) * 100);

  // Submit Homework with Real Supabase Storage Upload
  const handleSubmit = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsSubmitting(true);

    let score = 0;
    if (q1Answer === 'A') score += 1.5;
    if (q2Answer === 'A') score += 1.5;
    if (q3Words.map((w) => w.id).join(',') === 'w1,w2,w3,w4') score += 1.5;
    if (q4Answers['sq1'] === 'F') score += 0.5;
    if (q4Answers['sq2'] === 'B') score += 0.5;
    if (q4Answers['sq3'] === 'C') score += 0.5;

    setFinalScore(score);

    let uploadedAudioUrl = null;
    let uploadedPhotoUrl = null;

    try {
      // 1. Upload audio recording to Supabase Storage if recorded
      if (audioBlob) {
        setUploadStatusMsg('Đang tải file ghi âm lên Supabase Storage...');
        uploadedAudioUrl = await uploadMediaToSupabase(
          audioBlob,
          'homework-audio',
          `voice_${user.id || 'student'}.webm`
        );
      }

      // 2. Upload photo to Supabase Storage if attached
      if (q6File) {
        setUploadStatusMsg('Đang tải ảnh bài viết lên Supabase Storage...');
        uploadedPhotoUrl = await uploadMediaToSupabase(
          q6File,
          'homework-photos',
          q6File.name
        );
      }

      // 3. Save submission payload to Supabase database
      setUploadStatusMsg('Đang lưu kết quả nộp bài...');
      const submissionData = {
        lessonId: lesson?.id || 'lesson-4',
        studentId: user?.id || 'user-student-1',
        studentName: user?.name || user?.full_name || 'Học viên',
        answers: {
          q1Answer,
          q2Answer,
          q3Words: q3Words.map((w) => w.word),
          q3Sentence: q3Words.map((w) => w.word).join(''),
          q4Answers,
          q5Recorded: !!uploadedAudioUrl || q5Recorded,
          q5AudioUrl: uploadedAudioUrl,
          q5AudioText: '老板，这件红色的衣服太贵了，便宜一点儿吧！',
          q6Handwriting: q6Photo?.name,
          q6HandwritingUrl: uploadedPhotoUrl,
          q6HandwritingImage: uploadedPhotoUrl,
          q7Essay: q7EssayText,
          q7EssayText: q7EssayText,
          q7CharCount: q7EssayText.trim().length,
          autoGradedScore: score
        }
      };

      const result = await submitHomeworkToSupabase(submissionData);
      if (!result.success) {
        console.warn('Lưu bài tập Supabase trả về lỗi, chuyển trạng thái offline.');
      }
    } catch (e) {
      console.error('Lỗi khi tải file hoặc nộp bài tập:', e);
    } finally {
      setIsSubmitting(false);
      setUploadStatusMsg('');
    }

    setIsModalOpen(true);

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#A11D24', '#D4AF37', '#ffffff']
    });
  };

  return (
    <div className="hw-wrapper">

      {/* Admin Mode Inspection Banner */}
      {user?.role === 'admin' && (
        <div className="hw-admin-banner">
          <div className="hw-admin-banner-left">
            <span style={{ fontSize: '1.4rem' }}>👑</span>
            <div>
              <div className="hw-admin-banner-title">Chế Độ Quản Trị Viên: Kiểm Duyệt Bài Tập (Admin Preview)</div>
              <div className="hw-admin-banner-sub">Toàn quyền kiểm tra audio, biểu điểm, đáp án đúng và theo dõi bài nộp của 28 học viên.</div>
            </div>
          </div>
          <div className="hw-admin-actions">
            <button type="button" className="hw-admin-btn outline" onClick={() => alert('Mở bảng cấu hình biên tập 7 dạng câu hỏi.')}>
              <i className="fa-solid fa-pen-to-square"></i> Biên Tập Câu Hỏi
            </button>
            <button type="button" className="hw-admin-btn primary" onClick={() => alert('Đã sao chép liên kết làm bài!')}>
              <i className="fa-solid fa-share-nodes"></i> Giao Bài Nhanh
            </button>
          </div>
        </div>
      )}

      {/* Header Card */}
      <section className="hw-header-card">
        <div className="hw-header-meta">
          <button type="button" className="hw-back-btn" onClick={onBack}>
            <i className="fa-solid fa-arrow-left"></i> Lộ trình
          </button>
          <span className="hw-lesson-tag">
            <i className="fa-solid fa-book-bookmark"></i> {lesson?.title || 'Bài 04: Đi Mua Sắm (买东西)'}
          </span>
          <span className="hw-deadline-tag">
            <i className="fa-solid fa-hourglass-half"></i> Hạn nộp: 23:59 Hôm nay
          </span>
          <span className="hw-timer-pill">
            <i className="fa-regular fa-clock"></i> {formatTimer(timeLeft)}
          </span>
        </div>

        <h1 className="hw-title">Hệ Thống Bài Tập Toàn Diện 7 Dạng Chuẩn HSK 2</h1>
        <p className="hw-desc">
          Luyện trọn vẹn: Nghe hiểu, Thanh điệu Pinyin, Sắp xếp câu, Đọc hiểu đa dạng, Thu âm khẩu ngữ và Luyện viết (chép chính tả &amp; đoạn văn).
        </p>

        <div className="hw-progress-row">
          <span>Tiến độ: <strong>{answeredCount}</strong> / <strong>{totalParts}</strong> phần</span>
          <span className="hw-progress-pct">{progressPercent}%</span>
        </div>
        <div className="hw-progress-track">
          <div className="hw-progress-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </section>

      {/* Questions */}
      <main className="hw-stream">

        {/* Q1: Listening */}
        <article className={`hw-qcard ${q1Answer ? 'answered' : ''}`}>
          <div className="hw-qcard-header">
            <div className="hw-qnum-badge"><strong>01</strong> / 07</div>
            <div className="hw-qtype-label"><i className="fa-solid fa-headphones"></i> Dạng 1: Luyện Nghe (听力题)</div>
            <div className="hw-qpoints">1.5 điểm</div>
            {q1Answer && <div className="hw-answered-badge"><i className="fa-solid fa-circle-check"></i> Đã làm</div>}
          </div>
          <div className="hw-qcard-body">
            <h2 className="hw-instruction">Nghe đoạn audio bên dưới và chọn đáp án chính xác nhất:</h2>
            <div className="hw-hint">
              <i className="fa-solid fa-circle-info"></i> Hãy nghe kỹ mức giá và đồ vật được nhắc đến trong đoạn thoại.
            </div>

            <div className="hw-audio-player">
              <button type="button" className="hw-audio-play-btn" onClick={togglePlayAudio}>
                <i className={`fa-solid ${audioPlaying ? 'fa-pause' : 'fa-play'}`}></i>
              </button>
              <div className="hw-audio-track">
                <div className="hw-audio-title">Đoạn thoại: Hỏi giá mua táo ở chợ (苹果多少钱一斤)</div>
                <div className={`hw-audio-wave ${audioPlaying ? 'playing' : ''}`}>
                  {[...Array(10)].map((_, i) => <span key={i} className="wbar"></span>)}
                </div>
                <div className="hw-audio-timer">{audioTime} / 00:06</div>
              </div>
              <div className="hw-audio-speeds">
                {[0.75, 1.0, 1.25].map((speed) => (
                  <button
                    key={speed}
                    type="button"
                    className={`hw-speed-btn ${audioSpeed === speed ? 'active' : ''}`}
                    onClick={() => setAudioSpeed(speed)}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            <div className="hw-options-grid">
              <label className={`hw-option-card ${q1Answer === 'A' ? 'selected' : ''}`}>
                <input type="radio" name="q1" value="A" onChange={() => setQ1Answer('A')} />
                <div className="hw-option-indicator">A</div>
                <div className="hw-option-body">
                  <div className="hw-hanzi-big">
                    <ruby>五<rt>wǔ</rt></ruby><ruby>块<rt>kuài</rt></ruby><ruby>钱<rt>qián</rt></ruby><ruby>一<rt>yì</rt></ruby><ruby>斤<rt>jīn</rt></ruby>
                  </div>
                  <div className="hw-option-viet">5 tệ một cân (khoảng 17.500 VNĐ)</div>
                </div>
              </label>

              <label className={`hw-option-card ${q1Answer === 'B' ? 'selected' : ''}`}>
                <input type="radio" name="q1" value="B" onChange={() => setQ1Answer('B')} />
                <div className="hw-option-indicator">B</div>
                <div className="hw-option-body">
                  <div className="hw-hanzi-big">
                    <ruby>两<rt>liǎng</rt></ruby><ruby>块<rt>kuài</rt></ruby><ruby>钱<rt>qián</rt></ruby><ruby>一<rt>yì</rt></ruby><ruby>斤<rt>jīn</rt></ruby>
                  </div>
                  <div className="hw-option-viet">2 tệ một cân (khoảng 7.000 VNĐ)</div>
                </div>
              </label>
            </div>
          </div>
        </article>

        {/* Q2: Pinyin & Tones */}
        <article className={`hw-qcard ${q2Answer ? 'answered' : ''}`}>
          <div className="hw-qcard-header">
            <div className="hw-qnum-badge"><strong>02</strong> / 07</div>
            <div className="hw-qtype-label"><i className="fa-solid fa-volume-high"></i> Dạng 2: Thanh Điệu &amp; Pinyin (声调辨析)</div>
            <div className="hw-qpoints">1.5 điểm</div>
            {q2Answer && <div className="hw-answered-badge"><i className="fa-solid fa-circle-check"></i> Đã làm</div>}
          </div>
          <div className="hw-qcard-body">
            <h2 className="hw-instruction">Chọn phiên âm Pinyin và thanh điệu đúng cho từ "Quần áo":</h2>
            <div className="hw-focus-hanzi">
              <span className="hw-big-char">衣</span>
              <span className="hw-big-char">服</span>
            </div>

            <div className="hw-options-grid">
              <label className={`hw-option-card ${q2Answer === 'A' ? 'selected' : ''}`}>
                <input type="radio" name="q2" value="A" onChange={() => setQ2Answer('A')} />
                <div className="hw-option-indicator">A</div>
                <div className="hw-option-body">
                  <div className="hw-pinyin-big">yī fu</div>
                  <div className="hw-option-sub">Thanh 1 + Thanh nhẹ (Chuẩn)</div>
                </div>
              </label>

              <label className={`hw-option-card ${q2Answer === 'B' ? 'selected' : ''}`}>
                <input type="radio" name="q2" value="B" onChange={() => setQ2Answer('B')} />
                <div className="hw-option-indicator">B</div>
                <div className="hw-option-body">
                  <div className="hw-pinyin-big">yí fù</div>
                  <div className="hw-option-sub">Thanh 2 + Thanh 4</div>
                </div>
              </label>
            </div>
          </div>
        </article>

        {/* Q3: Sentence Order */}
        <article className={`hw-qcard ${q3Words.length === 4 ? 'answered' : ''}`}>
          <div className="hw-qcard-header">
            <div className="hw-qnum-badge"><strong>03</strong> / 07</div>
            <div className="hw-qtype-label"><i className="fa-solid fa-puzzle-piece"></i> Dạng 3: Sắp Xếp Trật Tự Từ (连词成句)</div>
            <div className="hw-qpoints">1.5 điểm</div>
            {q3Words.length === 4 && <div className="hw-answered-badge"><i className="fa-solid fa-circle-check"></i> Đã làm</div>}
          </div>
          <div className="hw-qcard-body">
            <h2 className="hw-instruction">Bấm chọn các thẻ từ để tạo thành câu: "Bộ quần áo này hơi đắt một chút."</h2>

            <div className="hw-dropzone">
              {q3Words.length === 0
                ? <div className="hw-dropzone-placeholder">Bấm các thẻ từ bên dưới để ghép vào đây...</div>
                : q3Words.map((chip) => (
                  <button key={chip.id} type="button" className="hw-word-chip active" onClick={() => handleRemoveChip(chip.id)}>
                    <span>{chip.ruby}</span>
                    <i className="fa-solid fa-xmark" style={{ fontSize: '0.75rem', opacity: 0.7 }}></i>
                  </button>
                ))
              }
            </div>

            <div className="hw-chips-pool">
              {allWordChips.map((chip) => {
                const isUsed = q3Words.some((w) => w.id === chip.id);
                return (
                  <button
                    key={chip.id}
                    type="button"
                    className={`hw-word-chip ${isUsed ? 'used' : ''}`}
                    onClick={() => handleChipClick(chip)}
                    disabled={isUsed}
                  >
                    <span>{chip.ruby}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </article>

        {/* Q4: Dynamic Reading Comprehension */}
        <article className={`hw-qcard ${Object.keys(q4Answers).length >= 2 ? 'answered' : ''}`}>
          <div className="hw-qcard-header">
            <div className="hw-qnum-badge"><strong>04</strong> / 07</div>
            <div className="hw-qtype-label"><i className="fa-solid fa-book-open"></i> Dạng 4: Đọc Hiểu Đa Dạng (阅读理解)</div>
            <div className="hw-qpoints">1.5 điểm</div>
            {Object.keys(q4Answers).length >= 2 && <div className="hw-answered-badge"><i className="fa-solid fa-circle-check"></i> Đã làm</div>}
          </div>
          <div className="hw-qcard-body">
            <h2 className="hw-instruction">Đọc đoạn văn bản sau và trả lời các câu hỏi trắc nghiệm bên dưới:</h2>

            <div className="hw-passage-box">
              今天星期六，王明去超市买东西。超市里的水果很多，有苹果、香蕉和西瓜。苹果五块钱一斤，很甜；西瓜两块钱一斤。王明买了三斤苹果和一个西瓜，一共花了二十五块钱。
              <div className="translation-hint">
                * Dịch gợi ý: Hôm nay thứ Bảy, Vương Minh đi siêu thị mua đồ. Hoa quả trong siêu thị rất nhiều, có táo, chuối và dưa hấu...
              </div>
            </div>

            {/* Sub-question 1: True/False */}
            <div className="hw-subq-block">
              <div className="hw-subq-label">
                <span className="hw-subq-num">1</span>
                (Đúng/Sai): Siêu thị hôm nay không bán dưa hấu (西瓜).
              </div>
              <div className="hw-tf-grid">
                <button
                  type="button"
                  className={`hw-mc-btn ${q4Answers.sq1 === 'T' ? 'selected' : ''}`}
                  onClick={() => setQ4Answers({ ...q4Answers, sq1: 'T' })}
                >
                  对 (Đúng)
                </button>
                <button
                  type="button"
                  className={`hw-mc-btn ${q4Answers.sq1 === 'F' ? 'selected' : ''}`}
                  onClick={() => setQ4Answers({ ...q4Answers, sq1: 'F' })}
                >
                  错 (Sai — Có bán dưa hấu)
                </button>
              </div>
            </div>

            {/* Sub-question 2: 3 choices */}
            <div className="hw-subq-block">
              <div className="hw-subq-label">
                <span className="hw-subq-num">2</span>
                (3 đáp án): Vương Minh đã mua mấy cân táo?
              </div>
              <div className="hw-mc-grid-3">
                {[{ id: 'A', text: '两斤 (2 cân)' }, { id: 'B', text: '三斤 (3 cân)' }, { id: 'C', text: '五斤 (5 cân)' }].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`hw-mc-btn ${q4Answers.sq2 === opt.id ? 'selected' : ''}`}
                    onClick={() => setQ4Answers({ ...q4Answers, sq2: opt.id })}
                  >
                    {opt.id}. {opt.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-question 3: 4 choices */}
            <div className="hw-subq-block">
              <div className="hw-subq-label">
                <span className="hw-subq-num">3</span>
                (4 đáp án): Tổng số tiền Vương Minh đã chi tiêu là bao nhiêu?
              </div>
              <div className="hw-mc-grid-4">
                {[{ id: 'A', text: '十五块 (15 tệ)' }, { id: 'B', text: '二十块 (20 tệ)' }, { id: 'C', text: '二十五块 (25 tệ)' }, { id: 'D', text: '三十块 (30 tệ)' }].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`hw-mc-btn ${q4Answers.sq3 === opt.id ? 'selected' : ''}`}
                    onClick={() => setQ4Answers({ ...q4Answers, sq3: opt.id })}
                  >
                    {opt.id}. {opt.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </article>

        {/* Q5: Speaking / Voice Recording */}
        <article className={`hw-qcard ${q5Recorded ? 'answered' : ''}`}>
          <div className="hw-qcard-header">
            <div className="hw-qnum-badge"><strong>05</strong> / 07</div>
            <div className="hw-qtype-label"><i className="fa-solid fa-microphone"></i> Dạng 5: Khẩu Ngữ &amp; Thu Âm (口语录音)</div>
            <div className="hw-qpoints">1.5 điểm</div>
            {q5Recorded && <div className="hw-answered-badge"><i className="fa-solid fa-circle-check"></i> Đã ghi âm</div>}
          </div>
          <div className="hw-qcard-body">
            <h2 className="hw-instruction">Bấm ghi âm và đọc to câu đàm thoại mặc cả sau:</h2>

            <div className="hw-sentence-display">
              <div className="hw-sentence-hanzi">老板，这件红色的衣服太贵了，便宜一点儿吧！</div>
              <div className="hw-sentence-pinyin">Lǎobǎn, zhè jiàn hóngsè de yīfu tài guì le, piányi yìdiǎnr ba!</div>
            </div>

            <div className="hw-recorder-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.85rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {!recording ? (
                  <button type="button" className="hw-rec-btn start" onClick={startRecording}>
                    <i className="fa-solid fa-microphone"></i>
                    {q5Recorded ? 'Thu âm lại' : 'Bắt đầu ghi âm'}
                  </button>
                ) : (
                  <button type="button" className="hw-rec-btn stop" onClick={stopRecording}>
                    <span className="hw-rec-dot"></span>
                    <i className="fa-solid fa-stop"></i>
                    Dừng thu âm ({recordingTime})
                  </button>
                )}
                {q5Recorded && !recording && (
                  <button
                    type="button"
                    onClick={resetRecording}
                    style={{
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      padding: '0.55rem 0.9rem',
                      borderRadius: '10px',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      color: '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <i className="fa-solid fa-trash-can"></i> Xóa bản thu
                  </button>
                )}
              </div>

              {micError && (
                <div style={{ color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', padding: '0.6rem 0.9rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '6px' }}></i>
                  {micError}
                </div>
              )}

              {q5Recorded && !recording && audioPreviewUrl && (
                <div style={{ width: '100%', maxWidth: '440px', background: '#f8fafc', padding: '0.85rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.82rem', color: '#16a34a', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <i className="fa-solid fa-circle-check"></i> Đã thu âm ({recordingTime}). Bạn có thể nghe lại trước khi nộp:
                  </div>
                  <audio controls src={audioPreviewUrl} style={{ width: '100%', height: '36px' }} />
                </div>
              )}
            </div>
          </div>
        </article>

        {/* Q6: Writing 7A – Handwritten Photo */}
        <article className={`hw-qcard ${q6Photo ? 'answered' : ''}`}>
          <div className="hw-qcard-header">
            <div className="hw-qnum-badge"><strong>06</strong> / 07</div>
            <div className="hw-qtype-label"><i className="fa-solid fa-pen-nib"></i> Dạng 7A: Luyện Viết Chép Chính Tả (手写拍照)</div>
            <div className="hw-qpoints">1.5 điểm</div>
            {q6Photo && <div className="hw-answered-badge"><i className="fa-solid fa-circle-check"></i> Đã tải ảnh</div>}
          </div>
          <div className="hw-qcard-body">
            <h2 className="hw-instruction">Viết 4 chữ Hán sau ra vở ô điền (田字格), sau đó chụp ảnh tải lên:</h2>

            <div className="hw-char-grid">
              {[
                { char: '买', pinyin: 'mǎi', mean: 'Mua' },
                { char: '卖', pinyin: 'mài', mean: 'Bán' },
                { char: '贵', pinyin: 'guì', mean: 'Đắt' },
                { char: '钱', pinyin: 'qián', mean: 'Tiền' }
              ].map((item, i) => (
                <div key={i} className="hw-char-card">
                  <div className="hw-char-big">{item.char}</div>
                  <div className="hw-char-pinyin">{item.pinyin}</div>
                  <div className="hw-char-mean">{item.mean}</div>
                </div>
              ))}
            </div>

            <div className="hw-upload-zone">
              <input type="file" accept="image/*" id="photo-upload" style={{ display: 'none' }} onChange={handlePhotoChange} />
              <label htmlFor="photo-upload">
                <i className="hw-upload-icon fa-solid fa-camera"></i>
                <span className="hw-upload-text">
                  {q6Photo ? `Đã chọn: ${q6Photo.name} (${q6Photo.size} MB)` : 'Bấm để chụp ảnh hoặc tải ảnh bài viết từ máy'}
                </span>
                <span className="hw-upload-sub">Hỗ trợ JPG, PNG, HEIC chụp từ điện thoại</span>
              </label>
              {q6Photo && (
                <div style={{ marginTop: '0.75rem', position: 'relative', display: 'inline-block' }}>
                  <img src={q6Photo.url} alt="Xem trước bài viết" className="hw-preview-img" style={{ maxHeight: '240px', borderRadius: '10px' }} />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'rgba(0,0,0,0.65)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Xóa ảnh này"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        </article>

        {/* Q7: Writing 7B – Essay */}
        <article className={`hw-qcard ${q7EssayText.trim().length >= 30 ? 'answered' : ''}`}>
          <div className="hw-qcard-header">
            <div className="hw-qnum-badge"><strong>07</strong> / 07</div>
            <div className="hw-qtype-label"><i className="fa-solid fa-keyboard"></i> Dạng 7B: Luyện Viết Đoạn Văn Trực Tiếp (短文写作)</div>
            <div className="hw-qpoints">1.0 điểm</div>
            {q7EssayText.trim().length >= 30 && <div className="hw-answered-badge"><i className="fa-solid fa-circle-check"></i> Đã viết</div>}
          </div>
          <div className="hw-qcard-body">
            <h2 className="hw-instruction">
              Dựa vào các từ vựng đã học ở Bài 04, hãy viết một đoạn văn ngắn (tối thiểu {minEssayChars} chữ) kể về một lần em đi mua đồ ở siêu thị:
            </h2>

            <div className="hw-essay-layout">
              <div className="hw-essay-main">
                <div className="hw-essay-textarea-wrap">
                  <textarea
                    className="hw-essay-textarea"
                    placeholder="Ví dụ: 昨天下午，我和朋友一起去超市买东西。超市里人很多，水果也很新鲜……"
                    value={q7EssayText}
                    onChange={(e) => setQ7EssayText(e.target.value)}
                  />
                  <div className="hw-essay-counter">
                    <span className="hw-counter-num">{q7EssayText.trim().length}</span>
                    <span className="hw-counter-min">/ tối thiểu {minEssayChars} chữ</span>
                    {q7EssayText.trim().length >= minEssayChars && (
                      <span className="hw-counter-pass"><i className="fa-solid fa-check"></i> Đạt chuẩn</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="hw-vocab-panel">
                <div className="hw-vocab-panel-title">
                  <i className="fa-solid fa-lightbulb"></i> Gợi ý từ vựng:
                </div>
                {[
                  { word: '超市', pinyin: 'chāoshì', mean: 'Siêu thị' },
                  { word: '买 / 卖', pinyin: 'mǎi / mài', mean: 'Mua / Bán' },
                  { word: '苹果', pinyin: 'píngguǒ', mean: 'Quả táo' },
                  { word: '有点儿贵', pinyin: '', mean: 'Hơi đắt một chút' },
                  { word: '一共', pinyin: 'yígòng', mean: 'Tổng cộng' }
                ].map((v, i) => (
                  <div key={i} className="hw-vocab-item">
                    • <strong>{v.word}</strong>{v.pinyin ? ` (${v.pinyin})` : ''}: {v.mean}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>

        {/* Submit Bar */}
        <div className="hw-submit-bar">
          <div>
            <div className="hw-submit-info-title">
              Đã hoàn thành: <span style={{ color: 'var(--primary-700)' }}>{answeredCount} / {totalParts} phần</span>
            </div>
            <div className="hw-submit-info-sub">
              {uploadStatusMsg ? (
                <span style={{ color: '#A11D24', fontWeight: 600 }}>
                  <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '6px' }}></i>
                  {uploadStatusMsg}
                </span>
              ) : (
                'Câu trắc nghiệm & ngữ pháp sẽ được máy chấm ngay. File thu âm và ảnh viết tay sẽ được tải lên Supabase Storage gửi cho cô giáo.'
              )}
            </div>
          </div>

          <button
            type="button"
            className="hw-submit-btn"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            <i className="fa-solid fa-paper-plane"></i>
            {isSubmitting ? 'Đang gửi bài...' : 'Nộp Bài Cho Cô'}
          </button>
        </div>
      </main>

      {/* Submission Success Modal */}
      {isModalOpen && (
        <div className="hw-modal-overlay">
          <div className="hw-modal-box">
            <div className="hw-modal-icon">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <h2 className="hw-modal-title">Nộp Bài Thành Công!</h2>
            <p className="hw-modal-body">
              Hệ thống đã tự động chấm điểm các câu trắc nghiệm &amp; ngữ pháp: <span className="hw-modal-score">{finalScore} điểm</span>.
              <br /><br />
              Bài thu âm và bài viết của bạn đã được gửi tới <strong>Cô Hoài</strong> để chấm chi tiết!
            </p>
            <button className="hw-modal-close-btn" onClick={onBack}>
              Quay Về Danh Mục Khóa Học
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
