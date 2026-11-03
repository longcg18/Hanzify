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
import { SlidePresentationViewer } from '../components/SlidePresentationViewer';

export const HomeworkView = ({ lesson, onBack }) => {
  const { user, setIsAuthModalOpen } = useAuth();

  // Dynamic Questions from Database
  const [questions, setQuestions] = useState([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [isPptViewerOpen, setIsPptViewerOpen] = useState(false);

  // Dynamic Student Answers: { [questionId]: answerData }
  const [answers, setAnswers] = useState({});

  // Audio Player State for Listening questions
  const [audioPlayingQId, setAudioPlayingQId] = useState(null);
  const [audioSpeed, setAudioSpeed] = useState(1.0);

  // Real Voice Recording State (MediaRecorder)
  const [recordingQId, setRecordingQId] = useState(null);
  const [recordingTime, setRecordingTime] = useState('00:00');
  const [audioBlobs, setAudioBlobs] = useState({});
  const [audioPreviewUrls, setAudioPreviewUrls] = useState({});
  const [micError, setMicError] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordIntervalRef = useRef(null);

  // Submission & Draft State Management
  const [submissionState, setSubmissionState] = useState('initial'); // 'initial' | 'draft' | 'submitted' | 'redo_requested' | 'graded'
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [existingSubmission, setExistingSubmission] = useState(null);
  const [isSubmissionLoading, setIsSubmissionLoading] = useState(Boolean(lesson?.id && user?.id));
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [draftToast, setDraftToast] = useState(null);

  // Submit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatusMsg, setUploadStatusMsg] = useState('');

  // Countdown timer (45 minutes)
  const [timeLeft, setTimeLeft] = useState(45 * 60);

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

  // 1. Fetch Dynamic Questions from Supabase DB for this Lesson
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoadingQuestions(true);
      if (lesson?.id) {
        try {
          const data = await fetchLessonQuestions(lesson.id);
          if (isMounted) {
            setQuestions(Array.isArray(data) ? data : []);
          }
        } catch (err) {
          console.error('Error fetching questions:', err);
        } finally {
          if (isMounted) setIsLoadingQuestions(false);
        }
      } else {
        setIsLoadingQuestions(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [lesson?.id]);

  // 2. Load existing submission or draft
  useEffect(() => {
    if (lesson?.id && user?.id) {
      setIsSubmissionLoading(true);
      fetchStudentLessonSubmission(user.id, lesson.id)
        .then(({ success, submission }) => {
          if (success && submission) {
            setExistingSubmission(submission);
            const state = submission.submissionState || (submission.status === 'graded' ? 'graded' : 'submitted');
            setSubmissionState(state);

            const ans = submission.answers || {};

            // Restore answers from dynamic map if available, otherwise map from legacy keys
            const restoredAnswers = ans.answersByQuestion ? { ...ans.answersByQuestion } : {};

            if (ans.q1Answer && !restoredAnswers['q1']) restoredAnswers['q1'] = ans.q1Answer;
            if (ans.q2Answer && !restoredAnswers['q2']) restoredAnswers['q2'] = ans.q2Answer;
            if (Array.isArray(ans.q3Words) && !restoredAnswers['q3']) restoredAnswers['q3'] = ans.q3Words;
            if (ans.q4Answers && !restoredAnswers['q4']) restoredAnswers['q4'] = ans.q4Answers;
            if (ans.q5AudioUrl && !restoredAnswers['q5']) restoredAnswers['q5'] = ans.q5AudioUrl;
            if (ans.q6HandwritingUrl && !restoredAnswers['q6']) restoredAnswers['q6'] = { url: ans.q6HandwritingUrl, name: ans.q6Handwriting || 'Ảnh bài viết' };
            if (ans.q7EssayText && !restoredAnswers['q7']) restoredAnswers['q7'] = ans.q7EssayText;

            setAnswers(restoredAnswers);

            if (ans.q5AudioUrl) {
              setAudioPreviewUrls((prev) => ({ ...prev, voice: ans.q5AudioUrl }));
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
        })
        .finally(() => setIsSubmissionLoading(false));
    } else {
      setIsSubmissionLoading(false);
    }
  }, [lesson?.id, user?.id]);

  // Chinese speech synthesis helper for Audio questions
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

  const handleTogglePlayAudio = (qId, audioText) => {
    if (audioPlayingQId === qId) {
      setAudioPlayingQId(null);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    } else {
      setAudioPlayingQId(qId);
      speakChinese(audioText, audioSpeed);
      setTimeout(() => {
        setAudioPlayingQId(null);
      }, 5000 / audioSpeed);
    }
  };

  // Word order: add chip
  const handleAddWordChip = (qId, word) => {
    if (isReadOnly) return;
    const current = Array.isArray(answers[qId]) ? answers[qId] : [];
    setAnswers({
      ...answers,
      [qId]: [...current, word]
    });
  };

  // Word order: remove chip at index
  const handleRemoveWordChip = (qId, chipIdx) => {
    if (isReadOnly) return;
    const current = Array.isArray(answers[qId]) ? answers[qId] : [];
    setAnswers({
      ...answers,
      [qId]: current.filter((_, idx) => idx !== chipIdx)
    });
  };

  // MediaRecorder Voice Recording
  const startRecording = async (qId) => {
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
        setAudioBlobs((prev) => ({ ...prev, [qId]: recordedBlob }));

        const previewUrl = URL.createObjectURL(recordedBlob);
        setAudioPreviewUrls((prev) => ({ ...prev, [qId]: previewUrl }));

        setAnswers((prev) => ({
          ...prev,
          [qId]: { audioBlob: recordedBlob, previewUrl, recorded: true }
        }));

        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start(200);
      setRecordingQId(qId);

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
      console.error(err);
      setMicError('Không thể truy cập Microphone. Vui lòng cấp quyền micro cho trình duyệt!');
    }
  };

  const stopRecording = () => {
    if (recordIntervalRef.current) clearInterval(recordIntervalRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setRecordingQId(null);
  };

  // Writing Photo Upload
  const handlePhotoUpload = (qId, e) => {
    if (isReadOnly) return;
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        alert('File ảnh quá lớn! Vui lòng chọn ảnh < 15MB.');
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setAnswers((prev) => ({
        ...prev,
        [qId]: { file, previewUrl, name: file.name, size: `${(file.size / 1024).toFixed(0)} KB` }
      }));
    }
  };

  // Progress calculation across all questions
  const totalQuestions = questions.length;
  const answeredQuestionsCount = questions.filter((q) => {
    const ans = answers[q.id];
    if (!ans) return false;
    if (Array.isArray(ans)) return ans.length > 0;
    if (typeof ans === 'object') return ans.recorded || ans.file || ans.url || Object.keys(ans).length > 0;
    if (typeof ans === 'string') return ans.trim().length > 0;
    return true;
  }).length;
  const progressPercent = totalQuestions > 0 ? Math.round((answeredQuestionsCount / totalQuestions) * 100) : 0;

  // Save Draft Handler
  const handleSaveDraft = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    if (isReadOnly) return;
    setIsDraftSaving(true);
    setUploadStatusMsg('Đang lưu bài tạm thời...');

    try {
      await saveHomeworkDraft({
        lessonId: lesson?.id,
        studentId: user?.id,
        studentName: user?.name || user?.full_name || 'Học viên',
        answers: {
          answersByQuestion: answers,
          autoGradedScore: finalScore,
          lessonTitle: lesson?.title
        }
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

  // Submit Homework Handler
  const handleSubmit = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    if (isReadOnly) return;
    setIsSubmitting(true);

    try {
      // 1. Calculate Score for Objective Questions
      let calculatedScore = 0;
      let totalObjectiveQuestions = 0;

      questions.forEach((q) => {
        const studentAns = answers[q.id];
        if (q.type === 'listening' || q.type === 'pinyin') {
          totalObjectiveQuestions++;
          const correctOpt = (q.data?.options || []).find((opt) => opt.isCorrect);
          if (correctOpt && studentAns === correctOpt.id) {
            calculatedScore += (10 / Math.max(1, totalQuestions));
          }
        } else if (q.type === 'word_order') {
          totalObjectiveQuestions++;
          const studentOrder = Array.isArray(studentAns) ? studentAns.join('') : '';
          const expectedOrder = (q.data?.chips || []).map((c) => c.word).join('');
          if (studentOrder && studentOrder === expectedOrder) {
            calculatedScore += (10 / Math.max(1, totalQuestions));
          }
        }
      });

      const roundedScore = Math.min(10, Math.round(calculatedScore * 10) / 10);
      setFinalScore(roundedScore);

      // 2. Upload any recorded voice or photos to Supabase Storage
      const uploadedAnswers = { ...answers };

      for (const q of questions) {
        if (q.type === 'voice') {
          const blob = audioBlobs[q.id] || answers[q.id]?.audioBlob;
          if (blob) {
            setUploadStatusMsg(`Đang tải bài thu âm câu ${q.title || 'khẩu ngữ'} lên Storage...`);
            try {
              const audioUrl = await uploadMediaToSupabase(
                blob,
                'homework-audio',
                `voice_${user.id}_${lesson.id}_${q.id}.webm`
              );
              uploadedAnswers[q.id] = { audioUrl, recorded: true };
            } catch (err) {
              console.warn('Audio upload warning:', err);
            }
          }
        } else if (q.type === 'writing') {
          const file = answers[q.id]?.file;
          if (file) {
            setUploadStatusMsg(`Đang tải ảnh vở viết lên Storage...`);
            try {
              const photoUrl = await uploadMediaToSupabase(
                file,
                'homework-photos',
                `photo_${user.id}_${lesson.id}_${file.name}`
              );
              uploadedAnswers[q.id] = { photoUrl, name: file.name };
            } catch (err) {
              console.warn('Photo upload warning:', err);
            }
          }
        }
      }

      // 3. Save to Supabase submissions table
      setUploadStatusMsg('Đang lưu bài nộp lên hệ thống...');
      const payload = {
        lessonId: lesson?.id,
        studentId: user?.id,
        studentName: user?.name || user?.full_name || 'Học viên',
        answers: {
          answersByQuestion: uploadedAnswers,
          autoGradedScore: roundedScore,
          lessonTitle: lesson?.title,
          submittedAt: new Date().toISOString(),
          // Legacy mappings for TeacherGradingView compatibility
          q1Answer: Object.values(uploadedAnswers)[0] || '',
          q2Answer: Object.values(uploadedAnswers)[1] || '',
          q3Sentence: Array.isArray(Object.values(uploadedAnswers)[2]) ? Object.values(uploadedAnswers)[2].join('') : '',
          q5AudioUrl: Object.values(uploadedAnswers).find((v) => v?.audioUrl)?.audioUrl || null
        },
        autoScore: roundedScore
      };

      const result = await submitHomeworkToSupabase(payload);
      if (result.success) {
        setIsReadOnly(true);
        setSubmissionState('submitted');
        setIsModalOpen(true);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        alert('Lỗi lưu bài nộp: ' + (result.error || 'Vui lòng thử lại!'));
      }
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra trong quá trình nộp bài.');
    } finally {
      setIsSubmitting(false);
      setUploadStatusMsg('');
    }
  };

  return (
    <div className="homework-view-container" style={{ maxWidth: '960px', margin: '0 auto', padding: '0 0 4rem' }}>
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & NAVIGATION BAR                                             */}
      {/* ========================================================================= */}
      <header className="page-header-editorial" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '10px' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={onBack}
            style={{ padding: '6px 12px', fontSize: '13px' }}
          >
            <i className="fa-solid fa-arrow-left" />
            <span>Quay lại bài giảng</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {lesson?.pptUrl && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsPptViewerOpen(true)}
                style={{
                  background: '#fff7ed',
                  borderColor: '#fed7aa',
                  color: '#c2410c',
                  fontWeight: 600,
                  fontSize: '13px',
                  padding: '6px 12px'
                }}
              >
                <i className="fa-solid fa-file-powerpoint" style={{ color: '#ea580c' }} />
                <span>Xem Slide PPT Bài Giảng</span>
              </button>
            )}

            {!isReadOnly && (
              <button
                type="button"
                className="btn-secondary"
                onClick={handleSaveDraft}
                disabled={isDraftSaving}
                style={{ padding: '6px 14px', fontSize: '13px', fontWeight: 600 }}
              >
                <i className={`fa-regular ${isDraftSaving ? 'fa-spinner fa-spin' : 'fa-floppy-disk'}`} />
                <span>{isDraftSaving ? 'Đang lưu…' : 'Lưu Nháp'}</span>
              </button>
            )}

            <span style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              color: timeLeft < 300 ? '#b91c1c' : '#334155',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <i className="fa-regular fa-clock" style={{ color: timeLeft < 300 ? '#b91c1c' : '#64748b' }} />
              <span>{formatTimer(timeLeft)}</span>
            </span>
          </div>
        </div>

        <div className="header-meta">
          <i className="fa-solid fa-book-open" style={{ color: '#b91c1c' }} />
          <span>Bài Tập Về Nhà · {lesson?.hskLevel || 'HSK 3.0'}</span>
        </div>

        <h1 className="header-title" style={{ fontSize: '24px', margin: '4px 0 8px' }}>
          {lesson?.title || 'Bài tập trực tuyến'}
        </h1>
        <p className="header-desc">
          Làm bài tập trực tiếp từ dữ liệu bài giảng của giáo viên, nộp file ghi âm và bài viết để cô giáo chấm điểm và nhận xét chi tiết.
        </p>

        {/* Progress Bar */}
        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--rule)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '13px', fontWeight: 600 }}>
            <span style={{ color: 'var(--muted)' }}>Tiến độ hoàn thành:</span>
            <span style={{ color: progressPercent === 100 ? '#15803d' : '#b91c1c', fontWeight: 700 }}>
              {answeredQuestionsCount} / {totalQuestions} câu ({progressPercent}%)
            </span>
          </div>
          <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${progressPercent}%`,
                background: progressPercent === 100 ? '#16a34a' : '#b91c1c',
                borderRadius: '999px',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>
      </header>

      {/* Draft Toast Notification */}
      {draftToast && (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #86efac',
          borderRadius: '10px',
          padding: '10px 16px',
          marginBottom: '1.25rem',
          color: '#15803d',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 600,
          fontSize: '13.5px'
        }}>
          <i className="fa-solid fa-circle-check" />
          <span>{draftToast}</span>
        </div>
      )}

      {/* Notice Banner based on Submission State */}
      {isReadOnly && existingSubmission?.status === 'graded' && (
        <div style={{
          background: '#f0fdf4',
          border: '1.5px solid #86efac',
          borderRadius: '12px',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.25rem' }}>
              <i className="fa-solid fa-circle-check" />
              <span>Bài Làm Đã Được Cô Giáo Chấm Điểm: {existingSubmission.totalScore} / 10 Điểm</span>
            </div>
            <div style={{ color: '#166534', fontSize: '13.5px' }}>
              <strong>Lời phê của cô:</strong> {existingSubmission.teacherComment || 'Em hoàn thành bài rất tốt! Cố gắng phát huy nhé.'}
            </div>
          </div>
          <span style={{ background: '#16a34a', color: '#fff', padding: '0.35rem 0.85rem', borderRadius: '8px', fontWeight: 700, fontSize: '13px' }}>
            ✓ Đã Có Điểm
          </span>
        </div>
      )}

      {isReadOnly && existingSubmission?.status !== 'graded' && (
        <div style={{
          background: '#fef2f2',
          border: '1.5px solid #fca5a5',
          borderRadius: '12px',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b91c1c', fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.25rem' }}>
              <i className="fa-solid fa-lock" />
              <span>Bài Tập Đã Được Nộp Cho Cô Giáo (Đang Chờ Chấm)</span>
            </div>
            <div style={{ color: '#7f1d1d', fontSize: '13px' }}>
              Thời gian nộp: <strong>{existingSubmission?.submittedAt ? new Date(existingSubmission.submittedAt).toLocaleString('vi-VN') : 'Hôm nay'}</strong>. Bài đang trong chế độ chỉ xem, bạn không thể chỉnh sửa đáp án nữa.
            </div>
          </div>
          <span style={{ background: '#b91c1c', color: '#fff', padding: '0.35rem 0.85rem', borderRadius: '8px', fontWeight: 700, fontSize: '13px' }}>
            Đang Chờ Cô Chấm
          </span>
        </div>
      )}

      {!isReadOnly && submissionState === 'redo_requested' && (
        <div style={{
          background: '#fffbeb',
          border: '1.5px solid #fcd34d',
          borderRadius: '12px',
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
              <i className="fa-solid fa-rotate-left" />
              <span>Cô Giáo Yêu Cầu Làm Lại Bài Này</span>
            </div>
            <div style={{ color: '#92400e', fontSize: '13.5px' }}>
              <strong>Lời dặn của Cô Hoài:</strong> "{existingSubmission?.redoNote || 'Em kiểm tra lại câu trả lời và làm lại bài nhé'}"
            </div>
          </div>
          <span style={{ background: '#d97706', color: '#fff', padding: '0.35rem 0.85rem', borderRadius: '8px', fontWeight: 700, fontSize: '13px' }}>
            Đã Mở Khóa Làm Lại
          </span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DYNAMIC QUESTIONS STREAM (100% Loaded from Supabase DB)                */}
      {/* ========================================================================= */}
      {isLoadingQuestions ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#ffffff', borderRadius: '14px', border: '1px solid var(--border)', color: '#64748b' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '1.8rem', color: '#b91c1c', marginBottom: '0.75rem', display: 'block' }} />
          <span>Đang tải ngân hàng bài tập thực tế từ cơ sở dữ liệu…</span>
        </div>
      ) : questions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#ffffff', borderRadius: '14px', border: '1px dashed #cbd5e1', color: '#64748b' }}>
          <i className="fa-solid fa-clipboard-question" style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: '1rem', display: 'block' }} />
          <h3 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: 700, marginBottom: '0.5rem' }}>
            Bài học này hiện chưa có câu hỏi bài tập
          </h3>
          <p style={{ fontSize: '13.5px', color: '#64748b', maxWidth: '480px', margin: '0 auto 1.25rem' }}>
            Giáo viên có thể thiết lập câu hỏi và bài tập về nhà cho bài học này trực tiếp trong mục <strong>Soạn Bài Tập</strong>.
          </p>
        </div>
      ) : (
        <main className="hw-stream" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {questions.map((q, idx) => {
            const isAnswered = Boolean(
              answers[q.id] &&
              (Array.isArray(answers[q.id]) ? answers[q.id].length > 0 : typeof answers[q.id] === 'object' ? answers[q.id].recorded || answers[q.id].file || answers[q.id].url || Object.keys(answers[q.id]).length > 0 : String(answers[q.id]).trim().length > 0)
            );

            return (
              <article
                key={q.id || idx}
                className={`hw-qcard ${isAnswered ? 'answered' : ''}`}
                style={{
                  background: '#ffffff',
                  border: isAnswered ? '1px solid #cbd5e1' : '1px solid var(--border)',
                  borderRadius: '14px',
                  padding: '22px 24px',
                  boxShadow: 'none',
                  transition: 'border-color 0.15s ease'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ background: '#f1f5f9', color: '#334155', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 800 }}>
                      Câu {String(idx + 1).padStart(2, '0')} / {String(totalQuestions).padStart(2, '0')}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: '13px', color: '#b91c1c' }}>
                      {q.tag || (q.type === 'listening' ? 'Luyện Nghe' : q.type === 'pinyin' ? 'Phát Âm' : q.type === 'word_order' ? 'Ngữ Pháp' : q.type === 'voice' ? 'Khẩu Ngữ' : 'Viết Chữ')}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      {(10 / Math.max(1, totalQuestions)).toFixed(1)} điểm
                    </span>
                    {isAnswered && (
                      <span style={{ background: '#f0fdf4', color: '#15803d', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <i className="fa-solid fa-circle-check" /> Đã làm
                      </span>
                    )}
                  </div>
                </div>

                {/* Instruction */}
                <h3 style={{ margin: '0 0 14px 0', fontSize: '15px', fontWeight: 700, color: '#0f172a', lineHeight: 1.5 }}>
                  {q.instruction || q.title || q.prompt}
                </h3>

                {/* 1. LISTENING QUESTION */}
                {q.type === 'listening' && (
                  <div>
                    {q.data?.hint && (
                      <div style={{ background: '#eff6ff', color: '#1d4ed8', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="fa-solid fa-circle-info" /> {q.data.hint}
                      </div>
                    )}

                    {/* Audio Player */}
                    <div style={{
                      background: '#1e293b',
                      color: '#ffffff',
                      borderRadius: '10px',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      marginBottom: '16px'
                    }}>
                      <button
                        type="button"
                        onClick={() => handleTogglePlayAudio(q.id, q.data?.audioText || q.prompt)}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: '#b91c1c',
                          border: 'none',
                          color: '#ffffff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1rem'
                        }}
                      >
                        <i className={`fa-solid ${audioPlayingQId === q.id ? 'fa-pause' : 'fa-play'}`} />
                      </button>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13.5px', fontWeight: 700 }}>Nghe Audio phát âm chuẩn</div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>Giọng đọc mẫu chuẩn Bắc Kinh</div>
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[0.75, 1.0, 1.25].map((spd) => (
                          <button
                            key={spd}
                            type="button"
                            onClick={() => setAudioSpeed(spd)}
                            style={{
                              background: audioSpeed === spd ? 'rgba(255,255,255,0.25)' : 'transparent',
                              border: '1px solid rgba(255,255,255,0.2)',
                              color: '#fff',
                              borderRadius: '6px',
                              padding: '2px 8px',
                              fontSize: '11px',
                              cursor: 'pointer',
                              fontWeight: audioSpeed === spd ? 700 : 500
                            }}
                          >
                            {spd}x
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Options Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                      {(q.data?.options || []).map((opt) => {
                        const isSelected = answers[q.id] === opt.id;
                        return (
                          <label
                            key={opt.id}
                            onClick={() => {
                              if (!isReadOnly) setAnswers({ ...answers, [q.id]: opt.id });
                            }}
                            style={{
                              border: isSelected ? '1.5px solid #b91c1c' : '1px solid var(--border)',
                              background: isSelected ? '#fef2f2' : '#ffffff',
                              borderRadius: '10px',
                              padding: '12px 16px',
                              cursor: isReadOnly ? 'default' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <span style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              border: isSelected ? '2px solid #b91c1c' : '1px solid #cbd5e1',
                              background: isSelected ? '#b91c1c' : '#ffffff',
                              color: isSelected ? '#ffffff' : '#475569',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '12px'
                            }}>
                              {opt.id}
                            </span>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>{opt.hanzi || opt.text}</div>
                              {opt.meaning && <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '2px' }}>{opt.meaning}</div>}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. PINYIN / MULTIPLE CHOICE QUESTION */}
                {q.type === 'pinyin' && (
                  <div>
                    {q.data?.hanzi && (
                      <div style={{ textAlign: 'center', padding: '16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', fontFamily: 'var(--font-hanzi)' }}>
                          {q.data.hanzi}
                        </div>
                        {q.data.meaning && <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{q.data.meaning}</div>}
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                      {(q.data?.options || []).map((opt) => {
                        const isSelected = answers[q.id] === opt.id;
                        return (
                          <label
                            key={opt.id}
                            onClick={() => {
                              if (!isReadOnly) setAnswers({ ...answers, [q.id]: opt.id });
                            }}
                            style={{
                              border: isSelected ? '1.5px solid #b91c1c' : '1px solid var(--border)',
                              background: isSelected ? '#fef2f2' : '#ffffff',
                              borderRadius: '10px',
                              padding: '12px 16px',
                              cursor: isReadOnly ? 'default' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <span style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              border: isSelected ? '2px solid #b91c1c' : '1px solid #cbd5e1',
                              background: isSelected ? '#b91c1c' : '#ffffff',
                              color: isSelected ? '#ffffff' : '#475569',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '12px'
                            }}>
                              {opt.id}
                            </span>
                            <div style={{ fontWeight: 700, fontSize: '14.5px', color: '#0f172a' }}>
                              {opt.text || opt.hanzi}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. WORD ORDER QUESTION */}
                {q.type === 'word_order' && (
                  <div>
                    {q.data?.meaning && (
                      <div style={{ fontSize: '13.5px', color: '#475569', marginBottom: '10px' }}>
                        Nghĩa câu: <em>"{q.data.meaning}"</em>
                      </div>
                    )}

                    {/* Placed Words Dropzone */}
                    <div style={{
                      minHeight: '52px',
                      background: '#f8fafc',
                      border: '2px dashed #cbd5e1',
                      borderRadius: '10px',
                      padding: '10px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      alignItems: 'center',
                      marginBottom: '12px'
                    }}>
                      {(!Array.isArray(answers[q.id]) || answers[q.id].length === 0) ? (
                        <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                          {isReadOnly ? 'Học viên chưa sắp xếp câu' : 'Bấm các thẻ từ bên dưới để ghép vào đây…'}
                        </span>
                      ) : (
                        answers[q.id].map((word, wIdx) => (
                          <button
                            key={wIdx}
                            type="button"
                            onClick={() => handleRemoveWordChip(q.id, wIdx)}
                            disabled={isReadOnly}
                            style={{
                              padding: '0 12px',
                              height: '38px',
                              borderRadius: '8px',
                              background: '#b91c1c',
                              color: '#ffffff',
                              border: 'none',
                              fontWeight: 700,
                              fontSize: '14px',
                              cursor: isReadOnly ? 'default' : 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <span>{word}</span>
                            {!isReadOnly && <i className="fa-solid fa-xmark" style={{ fontSize: '11px', opacity: 0.8 }} />}
                          </button>
                        ))
                      )}
                    </div>

                    {/* Word Chips Pool */}
                    {!isReadOnly && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                        {(q.data?.chips || []).map((chip, cIdx) => (
                          <button
                            key={chip.id || cIdx}
                            type="button"
                            onClick={() => handleAddWordChip(q.id, chip.word)}
                            style={{
                              padding: '0 14px',
                              height: '38px',
                              borderRadius: '8px',
                              border: '1px solid #cbd5e1',
                              background: '#ffffff',
                              color: '#0f172a',
                              fontWeight: 700,
                              fontSize: '14px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {chip.word}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 4. VOICE RECORDING QUESTION */}
                {q.type === 'voice' && (
                  <div style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <div style={{ marginBottom: '14px' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                        {q.data?.text || '你好，很高兴认识你！'}
                      </div>
                      {q.data?.pinyin && <div style={{ fontSize: '13px', color: '#b91c1c', fontWeight: 600 }}>{q.data.pinyin}</div>}
                      {q.data?.meaning && <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>{q.data.meaning}</div>}
                    </div>

                    {/* Pronunciation sample button */}
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => speakChinese(q.data?.text || '')}
                      style={{ padding: '6px 14px', fontSize: '13px', marginBottom: '14px' }}
                    >
                      <i className="fa-solid fa-volume-high" style={{ color: '#b91c1c' }} />
                      <span>Nghe phát âm chuẩn</span>
                    </button>

                    {/* Recording Action */}
                    {!isReadOnly && (
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        {recordingQId === q.id ? (
                          <button
                            type="button"
                            onClick={stopRecording}
                            style={{
                              background: '#b91c1c',
                              color: '#ffffff',
                              border: 'none',
                              padding: '10px 20px',
                              borderRadius: '999px',
                              fontWeight: 700,
                              fontSize: '14px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}
                          >
                            <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#fff' }} />
                            <span>Dừng ghi âm ({recordingTime})</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => startRecording(q.id)}
                            style={{
                              background: 'var(--text)',
                              color: '#ffffff',
                              border: 'none',
                              padding: '10px 20px',
                              borderRadius: '999px',
                              fontWeight: 700,
                              fontSize: '14px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}
                          >
                            <i className="fa-solid fa-microphone" />
                            <span>{answers[q.id]?.recorded ? 'Ghi âm lại' : 'Bắt đầu ghi âm'}</span>
                          </button>
                        )}
                      </div>
                    )}

                    {micError && <div style={{ color: '#b91c1c', fontSize: '12.5px', marginTop: '8px' }}>{micError}</div>}

                    {/* Voice Audio Preview */}
                    {(audioPreviewUrls[q.id] || answers[q.id]?.audioUrl || (q.id === 'q5' && audioPreviewUrls.voice)) && (
                      <div style={{ marginTop: '14px', background: '#ffffff', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                        <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px', fontWeight: 600 }}>
                          ▶ Nghe lại bản ghi âm của bạn:
                        </div>
                        <audio
                          controls
                          src={audioPreviewUrls[q.id] || answers[q.id]?.audioUrl || audioPreviewUrls.voice}
                          style={{ width: '100%', height: '36px' }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* 5. WRITING / NOTEBOOK PHOTO QUESTION */}
                {q.type === 'writing' && (
                  <div>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '14px' }}>
                      {q.data?.char && (
                        <div style={{
                          width: '72px',
                          height: '72px',
                          border: '2px dashed #b91c1c',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '2.5rem',
                          fontWeight: 900,
                          color: '#0f172a',
                          fontFamily: 'var(--font-hanzi)',
                          background: '#fffdf5'
                        }}>
                          {q.data.char}
                        </div>
                      )}
                      <div>
                        {q.data?.pinyin && <div style={{ fontSize: '14px', fontWeight: 700, color: '#b91c1c' }}>Pinyin: {q.data.pinyin}</div>}
                        {q.data?.strokes && <div style={{ fontSize: '13px', color: '#64748b' }}>Số nét bút: {q.data.strokes} nét</div>}
                        {q.data?.radicals && <div style={{ fontSize: '13px', color: '#64748b' }}>Bộ thủ: {q.data.radicals}</div>}
                        {q.data?.meaning && <div style={{ fontSize: '13px', color: '#334155' }}>Nghĩa: {q.data.meaning}</div>}
                      </div>
                    </div>

                    {/* Upload Dropzone */}
                    {!isReadOnly ? (
                      <label style={{
                        border: '2px dashed #cbd5e1',
                        borderRadius: '12px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        background: '#f8fafc',
                        transition: 'border-color 0.15s ease'
                      }}>
                        <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '2rem', color: '#94a3b8' }} />
                        <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#334155' }}>
                          {answers[q.id]?.name ? `Đã chọn: ${answers[q.id].name}` : 'Bấm vào đây để tải ảnh vở viết chữ Hán'}
                        </span>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>Hỗ trợ JPG, PNG (tối đa 15MB)</span>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => handlePhotoUpload(q.id, e)}
                        />
                      </label>
                    ) : null}

                    {/* Uploaded Photo Preview */}
                    {(answers[q.id]?.previewUrl || answers[q.id]?.photoUrl || answers[q.id]?.url) && (
                      <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <img
                          src={answers[q.id].previewUrl || answers[q.id].photoUrl || answers[q.id].url}
                          alt="Bài tập viết chữ Hán"
                          style={{ width: '120px', height: '90px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                          onClick={() => window.open(answers[q.id].previewUrl || answers[q.id].photoUrl || answers[q.id].url, '_blank')}
                        />
                        <div>
                          <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>
                            {answers[q.id].name || 'Vở tập viết chữ Hán'}
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>Bấm vào ảnh để xem chi tiết nét viết</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 6. ESSAY QUESTION */}
                {q.type === 'essay' && (
                  <div>
                    <textarea
                      rows={5}
                      value={typeof answers[q.id] === 'string' ? answers[q.id] : ''}
                      onChange={(e) => {
                        if (!isReadOnly) setAnswers({ ...answers, [q.id]: e.target.value });
                      }}
                      disabled={isReadOnly}
                      placeholder="Nhập đoạn văn tiếng Trung của bạn tại đây..."
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '14px',
                        lineHeight: 1.6,
                        boxSizing: 'border-box',
                        fontFamily: 'inherit'
                      }}
                    />
                    <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                      Số chữ: <strong>{(typeof answers[q.id] === 'string' ? answers[q.id].trim().length : 0)}</strong> chữ
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </main>
      )}

      {/* ========================================================================= */}
      {/* 3. BOTTOM SUBMISSION BAR                                                  */}
      {/* ========================================================================= */}
      {questions.length > 0 && !isReadOnly && (
        <footer style={{
          marginTop: '2rem',
          padding: '1.25rem 1.5rem',
          background: '#ffffff',
          borderRadius: '14px',
          border: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
              Đã hoàn thành {answeredQuestionsCount} / {totalQuestions} câu
            </div>
            <div style={{ fontSize: '12.5px', color: '#64748b' }}>
              {uploadStatusMsg || 'Kiểm tra kỹ các đáp án trước khi bấm nộp bài chính thức cho cô giáo.'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleSaveDraft}
              disabled={isDraftSaving || isSubmitting}
              style={{ padding: '8px 16px', fontSize: '13.5px' }}
            >
              <i className="fa-regular fa-floppy-disk" />
              <span>Lưu Tạm</span>
            </button>

            <button
              type="button"
              className="btn-primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                padding: '8px 22px',
                fontSize: '14px',
                fontWeight: 700,
                background: '#b91c1c',
                borderColor: '#b91c1c'
              }}
            >
              <i className={`fa-solid ${isSubmitting ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`} />
              <span>{isSubmitting ? 'Đang Nộp Bài…' : 'Nộp Bài Cho Cô'}</span>
            </button>
          </div>
        </footer>
      )}

      {/* ========================================================================= */}
      {/* 4. SUCCESS SUBMISSION MODAL                                               */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            maxWidth: '460px',
            width: '100%',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎉</div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>
              Nộp Bài Thành Công!
            </h2>
            <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.5, margin: '0 0 1.25rem' }}>
              Bài tập của bạn đã được gửi tới phòng chấm điểm của Cô Hoài. Điểm trắc nghiệm tự động: <strong>{finalScore} / 10đ</strong>.
            </p>

            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setIsModalOpen(false);
                if (onBack) onBack();
              }}
              style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
            >
              <span>Xem Lộ Trình Khóa Học</span>
              <i className="fa-solid fa-arrow-right" />
            </button>
          </div>
        </div>
      )}

      {/* Slide Presentation PPT Viewer Modal */}
      {lesson?.pptUrl && (
        <SlidePresentationViewer
          isOpen={isPptViewerOpen}
          onClose={() => setIsPptViewerOpen(false)}
          pptUrl={lesson.pptUrl}
          lessonTitle={lesson.title}
        />
      )}
    </div>
  );
};
