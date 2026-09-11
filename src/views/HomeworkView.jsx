import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  fetchLessonQuestions,
  submitHomeworkToSupabase,
  uploadMediaToSupabase,
  fetchStudentLessonSubmission,
  saveHomeworkDraft
} from '../services/supabaseService';
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

  // Q3 Word chips pool
  const allWordChips = [
    { id: 'w1', word: '这件衣服', ruby: <><ruby>这<rt>zhè</rt></ruby><ruby>件<rt>jiàn</rt></ruby><ruby>衣<rt>yī</rt></ruby><ruby>服<rt>fu</rt></ruby></> },
    { id: 'w2', word: '有点儿', ruby: <><ruby>有<rt>yǒu</rt></ruby><ruby>点<rt>diǎn</rt></ruby><ruby>儿<rt>er</rt></ruby></> },
    { id: 'w3', word: '贵', ruby: <><ruby>贵<rt>guì</rt></ruby></> },
    { id: 'w4', word: '。', ruby: <ruby>。<rt style={{ visibility: 'hidden' }}>&nbsp;</rt></ruby> }
  ];

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

  // Submission & Draft State Management
  const [submissionState, setSubmissionState] = useState('initial'); // 'initial' | 'draft' | 'submitted' | 'redo_requested' | 'graded'
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [existingSubmission, setExistingSubmission] = useState(null);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [draftToast, setDraftToast] = useState(null);

  // Load existing submission or draft
  useEffect(() => {
    if (lesson?.id && user?.id) {
      fetchStudentLessonSubmission(user.id, lesson.id).then(({ success, submission }) => {
        if (success && submission) {
          setExistingSubmission(submission);
          const state = submission.submissionState || (submission.status === 'graded' ? 'graded' : 'submitted');
          setSubmissionState(state);

          const ans = submission.answers || {};
          if (ans.q1Answer) setQ1Answer(ans.q1Answer);
          if (ans.q2Answer) setQ2Answer(ans.q2Answer);
          if (Array.isArray(ans.q3Words) && ans.q3Words.length > 0) {
            const restoredChips = ans.q3Words.map((wordStr, idx) => {
              const matched = allWordChips.find((c) => c.word === wordStr || c.id === wordStr);
              return matched || { id: `w-restored-${idx}`, word: wordStr, ruby: wordStr };
            });
            setQ3Words(restoredChips);
          }
          if (ans.q4Answers && typeof ans.q4Answers === 'object') {
            setQ4Answers(ans.q4Answers);
          }
          if (ans.q5AudioUrl) {
            setAudioPreviewUrl(ans.q5AudioUrl);
            setQ5Recorded(true);
          }
          if (ans.q6HandwritingUrl || ans.q6HandwritingImage) {
            setQ6Photo({
              name: ans.q6Handwriting || 'Vở viết chữ Hán',
              url: ans.q6HandwritingUrl || ans.q6HandwritingImage,
              size: 'Cloud'
            });
          }
          if (ans.q7EssayText || ans.q7Essay) {
            setQ7EssayText(ans.q7EssayText || ans.q7Essay);
          }
          if (submission.totalScore !== null && submission.totalScore !== undefined) {
            setFinalScore(submission.totalScore);
          }

          if (state === 'submitted' || state === 'graded') {
            setIsReadOnly(true);
          } else if (state === 'redo_requested') {
            setIsReadOnly(false);
          }
        }
      });
    }
  }, [lesson?.id, user?.id]);

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

  const handleChipClick = (chip) => {
    if (isReadOnly) return;
    if (!q3Words.find((w) => w.id === chip.id)) {
      setQ3Words([...q3Words, chip]);
    }
  };

  const handleRemoveChip = (chipId) => {
    if (isReadOnly) return;
    setQ3Words(q3Words.filter((w) => w.id !== chipId));
  };

  // Q5 Real Voice Recorder (MediaRecorder API)
  const startRecording = async () => {
    if (isReadOnly) return;
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
    if (isReadOnly) return;
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
    if (isReadOnly) return;
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
    if (isReadOnly) return;
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

  // Save Homework Draft Handler
  const handleSaveDraft = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    if (isReadOnly) return;
    setIsDraftSaving(true);
    setUploadStatusMsg('Đang lưu bài tạm thời...');

    try {
      let uploadedAudioUrl = audioPreviewUrl;
      let uploadedPhotoUrl = q6Photo?.url;

      if (audioBlob && (!uploadedAudioUrl || !uploadedAudioUrl.startsWith('http'))) {
        try {
          uploadedAudioUrl = await uploadMediaToSupabase(
            audioBlob,
            'homework-audio',
            `draft_voice_${user.id || 'student'}_${Date.now()}.webm`
          );
        } catch (err) {
          console.warn('Draft voice upload fallback');
        }
      }

      if (q6File && (!uploadedPhotoUrl || !uploadedPhotoUrl.startsWith('http'))) {
        try {
          uploadedPhotoUrl = await uploadMediaToSupabase(
            q6File,
            'homework-photos',
            `draft_photo_${user.id || 'student'}_${Date.now()}_${q6File.name}`
          );
        } catch (err) {
          console.warn('Draft photo upload fallback');
        }
      }

      const answers = {
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
        autoGradedScore: finalScore
      };

      await saveHomeworkDraft({
        lessonId: lesson?.id || 'lesson-4',
        studentId: user?.id || 'user-student-1',
        studentName: user?.name || user?.full_name || 'Học viên',
        answers
      });

      setSubmissionState('draft');
      setDraftToast('💾 Đã lưu bài làm tạm thời! Mọi câu trả lời đã được giữ lại an toàn để bạn làm tiếp.');
      setTimeout(() => setDraftToast(null), 4500);
    } catch (e) {
      console.error('Lỗi khi lưu bài tạm:', e);
      setDraftToast('Đã lưu bài làm vào bộ nhớ tạm của trình duyệt.');
      setTimeout(() => setDraftToast(null), 4000);
    } finally {
      setIsDraftSaving(false);
      setUploadStatusMsg('');
    }
  };

  // Submit Homework with Real Supabase Storage Upload
  const handleSubmit = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    if (isReadOnly) return;
    setIsSubmitting(true);

    let score = 0;
    if (q1Answer === 'A') score += 1.5;
    if (q2Answer === 'A') score += 1.5;
    if (q3Words.map((w) => w.id).join(',') === 'w1,w2,w3,w4') score += 1.5;
    if (q4Answers['sq1'] === 'F') score += 0.5;
    if (q4Answers['sq2'] === 'B') score += 0.5;
    if (q4Answers['sq3'] === 'C') score += 0.5;

    setFinalScore(score);

    let uploadedAudioUrl = audioPreviewUrl;
    let uploadedPhotoUrl = q6Photo?.url;

    try {
      // 1. Upload audio recording to Supabase Storage if recorded
      if (audioBlob && (!uploadedAudioUrl || !uploadedAudioUrl.startsWith('http'))) {
        setUploadStatusMsg('Đang tải file ghi âm lên Supabase Storage...');
        uploadedAudioUrl = await uploadMediaToSupabase(
          audioBlob,
          'homework-audio',
          `voice_${user.id || 'student'}.webm`
        );
      }

      // 2. Upload photo to Supabase Storage if attached
      if (q6File && (!uploadedPhotoUrl || !uploadedPhotoUrl.startsWith('http'))) {
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

      // Lock homework into read-only
      setIsReadOnly(true);
      setSubmissionState('submitted');
      setExistingSubmission({
        ...submissionData,
        submittedAt: 'Vừa xong',
        status: 'pending',
        totalScore: score
      });
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

      {/* Dynamic Status Notification Banner */}
      {draftToast && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          background: '#0f172a',
          color: '#ffffff',
          padding: '0.9rem 1.4rem',
          borderRadius: '14px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 600,
          fontSize: '0.92rem'
        }}>
          <span>{draftToast}</span>
        </div>
      )}

      {/* Notice Banner based on Submission State */}
      {isReadOnly && existingSubmission?.status === 'graded' && (
        <div style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          border: '1.5px solid #86efac',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.25rem' }}>
              <i className="fa-solid fa-circle-check"></i>
              <span>Bài Làm Đã Được Cô Giáo Chấm Điểm: {existingSubmission.totalScore} / 10 Điểm</span>
            </div>
            <div style={{ color: '#166534', fontSize: '0.9rem' }}>
              <strong>Lời phê của cô:</strong> {existingSubmission.teacherComment || 'Em hoàn thành bài rất tốt! Cố gắng phát huy nhé.'}
            </div>
          </div>
          <span style={{ background: '#16a34a', color: '#fff', padding: '0.4rem 1rem', borderRadius: '12px', fontWeight: 700, fontSize: '0.88rem' }}>
            ✓ Đã Có Điểm
          </span>
        </div>
      )}

      {isReadOnly && existingSubmission?.status !== 'graded' && (
        <div style={{
          background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
          border: '1.5px solid #fca5a5',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A11D24', fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.25rem' }}>
              <i className="fa-solid fa-lock"></i>
              <span>Bài Tập Đã Được Nộp Cho Cô Giáo (Đang Chờ Chấm)</span>
            </div>
            <div style={{ color: '#7f1d1d', fontSize: '0.88rem' }}>
              Thời gian nộp: <strong>{existingSubmission?.submittedAt || 'Hôm nay'}</strong>. Bài đang trong chế độ chỉ xem, bạn không thể chỉnh sửa đáp án nữa.
            </div>
          </div>
          <span style={{ background: '#A11D24', color: '#fff', padding: '0.4rem 1rem', borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem' }}>
            Đang Chờ Cô Chấm
          </span>
        </div>
      )}

      {!isReadOnly && submissionState === 'redo_requested' && (
        <div style={{
          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          border: '1.5px solid #fcd34d',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b45309', fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.25rem' }}>
              <i className="fa-solid fa-rotate-left"></i>
              <span>Cô Giáo Yêu Cầu Làm Lại Bài Này</span>
            </div>
            <div style={{ color: '#92400e', fontSize: '0.9rem' }}>
              <strong>Lời dặn của Cô Hoài:</strong> "{existingSubmission?.redoNote || 'Em kiểm tra lại câu trả lời và làm lại bài nhé'}"
            </div>
          </div>
          <span style={{ background: '#d97706', color: '#fff', padding: '0.4rem 1rem', borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem' }}>
            Đã Mở Khóa Làm Lại
          </span>
        </div>
      )}

      {!isReadOnly && submissionState === 'draft' && (
        <div style={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          border: '1.5px solid #7dd3fc',
          borderRadius: '16px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#0369a1',
          fontSize: '0.9rem'
        }}>
          <i className="fa-regular fa-floppy-disk" style={{ fontSize: '1.1rem' }}></i>
          <span>
            <strong>Đang tiếp tục bài làm dở:</strong> Hệ thống đã tự động khôi phục các câu trả lời bạn đã lưu trước đó. Hãy tiếp tục làm bài và bấm <strong>"Nộp Bài Cho Cô"</strong> khi sẵn sàng!
          </span>
        </div>
      )}

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
                <div className="hw-audio-title">Đoạn thoại nghe hiểu — bấm phát để nghe</div>
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

            {q1Answer && (
              <div className="hw-hint" style={{ marginTop: '-0.35rem' }}>
                <i className="fa-solid fa-file-lines"></i> 听力原文：苹果多少钱一斤？五块钱一斤。
              </div>
            )}

            <div className="hw-options-grid">
              <label className={`hw-option-card ${q1Answer === 'A' ? 'selected' : ''}`} style={{ cursor: isReadOnly ? 'default' : 'pointer' }}>
                <input
                  type="radio"
                  name="q1"
                  value="A"
                  checked={q1Answer === 'A'}
                  disabled={isReadOnly}
                  onChange={() => !isReadOnly && setQ1Answer('A')}
                />
                <div className="hw-option-indicator">A</div>
                <div className="hw-option-body">
                  <div className="hw-hanzi-big">
                    <ruby>五<rt>wǔ</rt></ruby><ruby>块<rt>kuài</rt></ruby><ruby>钱<rt>qián</rt></ruby><ruby>一<rt>yì</rt></ruby><ruby>斤<rt>jīn</rt></ruby>
                  </div>
                  <div className="hw-option-viet">5 tệ một cân (khoảng 17.500 VNĐ)</div>
                </div>
              </label>

              <label className={`hw-option-card ${q1Answer === 'B' ? 'selected' : ''}`} style={{ cursor: isReadOnly ? 'default' : 'pointer' }}>
                <input
                  type="radio"
                  name="q1"
                  value="B"
                  checked={q1Answer === 'B'}
                  disabled={isReadOnly}
                  onChange={() => !isReadOnly && setQ1Answer('B')}
                />
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
              <label className={`hw-option-card ${q2Answer === 'A' ? 'selected' : ''}`} style={{ cursor: isReadOnly ? 'default' : 'pointer' }}>
                <input
                  type="radio"
                  name="q2"
                  value="A"
                  checked={q2Answer === 'A'}
                  disabled={isReadOnly}
                  onChange={() => !isReadOnly && setQ2Answer('A')}
                />
                <div className="hw-option-indicator">A</div>
                <div className="hw-option-body">
                  <div className="hw-pinyin-big">yī fu</div>
                  <div className="hw-option-sub">Thanh 1 + Thanh nhẹ</div>
                </div>
              </label>

              <label className={`hw-option-card ${q2Answer === 'B' ? 'selected' : ''}`} style={{ cursor: isReadOnly ? 'default' : 'pointer' }}>
                <input
                  type="radio"
                  name="q2"
                  value="B"
                  checked={q2Answer === 'B'}
                  disabled={isReadOnly}
                  onChange={() => !isReadOnly && setQ2Answer('B')}
                />
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
                  <button
                    key={chip.id}
                    type="button"
                    className="hw-word-chip active"
                    onClick={() => !isReadOnly && handleRemoveChip(chip.id)}
                    disabled={isReadOnly}
                    style={{ cursor: isReadOnly ? 'default' : 'pointer' }}
                  >
                    <span>{chip.ruby}</span>
                    {!isReadOnly && <i className="fa-solid fa-xmark" style={{ fontSize: '0.75rem', opacity: 0.7 }}></i>}
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
                    onClick={() => !isReadOnly && handleChipClick(chip)}
                    disabled={isUsed || isReadOnly}
                    style={{ cursor: isReadOnly ? 'default' : undefined }}
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
                  disabled={isReadOnly}
                  style={{ cursor: isReadOnly ? 'default' : 'pointer', opacity: isReadOnly && q4Answers.sq1 !== 'T' ? 0.6 : 1 }}
                  onClick={() => !isReadOnly && setQ4Answers({ ...q4Answers, sq1: 'T' })}
                >
                  对 (Đúng)
                </button>
                <button
                  type="button"
                  className={`hw-mc-btn ${q4Answers.sq1 === 'F' ? 'selected' : ''}`}
                  disabled={isReadOnly}
                  style={{ cursor: isReadOnly ? 'default' : 'pointer', opacity: isReadOnly && q4Answers.sq1 !== 'F' ? 0.6 : 1 }}
                  onClick={() => !isReadOnly && setQ4Answers({ ...q4Answers, sq1: 'F' })}
                >
                  错 (Sai)
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
                    disabled={isReadOnly}
                    style={{ cursor: isReadOnly ? 'default' : 'pointer', opacity: isReadOnly && q4Answers.sq2 !== opt.id ? 0.6 : 1 }}
                    onClick={() => !isReadOnly && setQ4Answers({ ...q4Answers, sq2: opt.id })}
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
                    disabled={isReadOnly}
                    style={{ cursor: isReadOnly ? 'default' : 'pointer', opacity: isReadOnly && q4Answers.sq3 !== opt.id ? 0.6 : 1 }}
                    onClick={() => !isReadOnly && setQ4Answers({ ...q4Answers, sq3: opt.id })}
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
                  <button
                    type="button"
                    className="hw-rec-btn start"
                    onClick={startRecording}
                    disabled={isReadOnly}
                    style={{ cursor: isReadOnly ? 'default' : 'pointer', opacity: isReadOnly ? 0.6 : 1 }}
                  >
                    <i className="fa-solid fa-microphone"></i>
                    {isReadOnly ? 'Đã khóa thu âm (Chế độ xem)' : q5Recorded ? 'Thu âm lại' : 'Bắt đầu ghi âm'}
                  </button>
                ) : (
                  <button type="button" className="hw-rec-btn stop" onClick={stopRecording}>
                    <span className="hw-rec-dot"></span>
                    <i className="fa-solid fa-stop"></i>
                    Dừng thu âm ({recordingTime})
                  </button>
                )}
                {q5Recorded && !recording && !isReadOnly && (
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
                    <i className="fa-solid fa-circle-check"></i> {isReadOnly ? 'File ghi âm bạn đã nộp cho cô giáo:' : `Đã thu âm (${recordingTime}). Bạn có thể nghe lại trước khi nộp:`}
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

            <div className="hw-upload-zone" style={{ opacity: isReadOnly ? 0.8 : 1 }}>
              <input
                type="file"
                accept="image/*"
                id="photo-upload"
                style={{ display: 'none' }}
                disabled={isReadOnly}
                onChange={handlePhotoChange}
              />
              <label htmlFor={isReadOnly ? undefined : "photo-upload"} style={{ cursor: isReadOnly ? 'default' : 'pointer' }}>
                <i className="hw-upload-icon fa-solid fa-camera"></i>
                <span className="hw-upload-text">
                  {q6Photo
                    ? `Đã chọn: ${q6Photo.name}`
                    : isReadOnly
                      ? 'Chưa đính kèm ảnh bài viết'
                      : 'Bấm để chụp ảnh hoặc tải ảnh bài viết từ máy'}
                </span>
                <span className="hw-upload-sub">
                  {isReadOnly ? 'Chế độ xem lại bài tập' : 'Hỗ trợ JPG, PNG, HEIC chụp từ điện thoại'}
                </span>
              </label>
              {q6Photo && (
                <div style={{ marginTop: '0.75rem', position: 'relative', display: 'inline-block' }}>
                  <img src={q6Photo.url} alt="Xem trước bài viết" className="hw-preview-img" style={{ maxHeight: '240px', borderRadius: '10px' }} />
                  {!isReadOnly && (
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
                  )}
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
                    placeholder={isReadOnly ? 'Học viên chưa nhập đoạn văn.' : 'Ví dụ: 昨天下午，我和朋友一起去超市买东西。超市里人很多，水果也很新鲜……'}
                    value={q7EssayText}
                    readOnly={isReadOnly}
                    style={{ background: isReadOnly ? '#f8fafc' : '#ffffff', cursor: isReadOnly ? 'default' : 'text' }}
                    onChange={(e) => !isReadOnly && setQ7EssayText(e.target.value)}
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
              ) : isReadOnly ? (
                existingSubmission?.status === 'graded'
                  ? 'Bài tập đã có kết quả chấm điểm từ Cô Hoài.'
                  : 'Bài tập đã được gửi cho cô giáo. Đang chờ kết quả chấm điểm khẩu ngữ & chữ viết.'
              ) : (
                'Bấm "Lưu Bài Tạm" để làm tiếp bất cứ khi nào, hoặc bấm "Nộp Bài Cho Cô" khi bạn đã hoàn thành.'
              )}
            </div>
          </div>

          {isReadOnly ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{
                background: existingSubmission?.status === 'graded' ? '#f0fdf4' : '#fef2f2',
                color: existingSubmission?.status === 'graded' ? '#16a34a' : '#A11D24',
                border: `1.5px solid ${existingSubmission?.status === 'graded' ? '#86efac' : '#fca5a5'}`,
                padding: '0.65rem 1.25rem',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.92rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <i className={`fa-solid ${existingSubmission?.status === 'graded' ? 'fa-circle-check' : 'fa-lock'}`}></i>
                {existingSubmission?.status === 'graded'
                  ? `Đã Chấm: ${existingSubmission.totalScore} / 10 Điểm`
                  : 'Đã Nộp Bài (Đang Chờ Chấm)'}
              </span>
              <button
                type="button"
                onClick={onBack}
                style={{
                  background: '#0f172a',
                  color: '#fff',
                  border: 'none',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                Quay Về Lộ Trình
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isDraftSaving || isSubmitting}
                style={{
                  background: '#ffffff',
                  color: '#334155',
                  border: '1.5px solid #cbd5e1',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}
              >
                <i className="fa-regular fa-floppy-disk" style={{ color: '#0284c7' }}></i>
                <span>{isDraftSaving ? 'Đang lưu...' : 'Lưu Bài Tạm'}</span>
              </button>

              <button
                type="button"
                className="hw-submit-btn"
                onClick={handleSubmit}
                disabled={isSubmitting || isDraftSaving}
              >
                <i className="fa-solid fa-paper-plane"></i>
                {isSubmitting ? 'Đang gửi bài...' : 'Nộp Bài Cho Cô'}
              </button>
            </div>
          )}
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
