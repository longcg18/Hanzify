import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  fetchSubmissions,
  gradeSubmission,
  requestRedoSubmission,
  directGradeUnsubmittedLesson,
  fetchClassrooms,
  fetchCoursesWithLessons
} from '../services/supabaseService';

export const TeacherGradingView = () => {
  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'unsubmitted'
  const [submissions, setSubmissions] = useState([]);
  const [selectedSub, setSelectedSub] = useState(null);
  const [scoreInput, setScoreInput] = useState(9.0);
  const [commentInput, setCommentInput] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Redo Request Modal
  const [isRedoModalOpen, setIsRedoModalOpen] = useState(false);
  const [redoNote, setRedoNote] = useState('');
  const [isSubmittingRedo, setIsSubmittingRedo] = useState(false);

  // Unsubmitted Management
  const [classrooms, setClassrooms] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedLessonId, setSelectedLessonId] = useState('');
  const [directGradeModalStudent, setDirectGradeModalStudent] = useState(null);
  const [directScoreInput, setDirectScoreInput] = useState('0');
  const [directCommentInput, setDirectCommentInput] = useState('');
  const [isSavingDirectGrade, setIsSavingDirectGrade] = useState(false);

  const loadSubmissionsData = () => {
    fetchSubmissions().then(({ data }) => {
      const list = data || [];
      setSubmissions(list);
      if (!selectedSub && list.length > 0) {
        setSelectedSub(list[0]);
      } else if (selectedSub) {
        const matched = list.find((s) => s.id === selectedSub.id);
        if (matched) setSelectedSub(matched);
      }
    });
  };

  useEffect(() => {
    loadSubmissionsData();

    fetchClassrooms().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setClassrooms(data);
        setSelectedClassId(String(data[0].id));
      }
    });

    fetchCoursesWithLessons().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setCourses(data);
        const firstLesson = data[0]?.lessons?.[0];
        if (firstLesson) setSelectedLessonId(firstLesson.id);
      }
    });
  }, []);

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

  const handleSaveGrade = async () => {
    if (!selectedSub) return;
    const result = await gradeSubmission(selectedSub.id, parseFloat(scoreInput), commentInput);
    if (!result.success) { window.alert(result.error); return; }
    const updated = submissions.map((sub) => {
      if (sub.id === selectedSub.id) {
        return {
          ...sub,
          totalScore: parseFloat(scoreInput),
          teacherComment: commentInput,
          status: 'graded',
          submissionState: 'graded'
        };
      }
      return sub;
    });

    setSubmissions(updated);
    setSelectedSub({
      ...selectedSub,
      totalScore: parseFloat(scoreInput),
      teacherComment: commentInput,
      status: 'graded',
      submissionState: 'graded'
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#A11D24', '#16a34a', '#D4AF37']
    });

    alert('🎉 Đã lưu điểm và nhận xét cho học viên thành công!');
  };

  // Handle Redo Request
  const handleConfirmRedo = async () => {
    if (!selectedSub) return;
    setIsSubmittingRedo(true);
    const note = redoNote.trim() || 'Cô giáo yêu cầu em làm lại bài tập này nhé.';
    const result = await requestRedoSubmission(selectedSub.id, note);
    setIsSubmittingRedo(false);

    if (!result.success) {
      alert('Không thể gửi yêu cầu làm lại: ' + (result.error || 'Lỗi mạng'));
      return;
    }

    const updated = submissions.map((sub) => {
      if (sub.id === selectedSub.id) {
        return {
          ...sub,
          submissionState: 'redo_requested',
          redoNote: note,
          status: 'pending'
        };
      }
      return sub;
    });

    setSubmissions(updated);
    setSelectedSub({
      ...selectedSub,
      submissionState: 'redo_requested',
      redoNote: note,
      status: 'pending'
    });

    setIsRedoModalOpen(false);
    alert(`🔄 Đã gửi yêu cầu làm lại cho học viên "${selectedSub.studentName}" thành công! Bài làm đã được mở khóa để học sinh sửa và nộp lại.`);
  };

  // Handle Direct Grade for Unsubmitted Student
  const handleOpenDirectGrade = (student, currentSub) => {
    setDirectGradeModalStudent(student);
    setDirectScoreInput(currentSub?.totalScore !== undefined && currentSub?.totalScore !== null ? String(currentSub.totalScore) : '0');
    setDirectCommentInput(currentSub?.teacherComment || 'Chưa hoàn thành bài tập nộp đúng hạn.');
  };

  const handleSaveDirectGrade = async () => {
    if (!directGradeModalStudent || !selectedLessonId) return;
    setIsSavingDirectGrade(true);

    const currentCourse = courses.find((c) => (c.lessons || []).some((l) => l.id === selectedLessonId));
    const currentLesson = currentCourse?.lessons?.find((l) => l.id === selectedLessonId);
    const lessonTitle = currentLesson?.title || 'Bài tập';

    const result = await directGradeUnsubmittedLesson({
      studentId: directGradeModalStudent.id || directGradeModalStudent.username || 'student',
      studentName: directGradeModalStudent.name || directGradeModalStudent.full_name || 'Học viên',
      lessonId: selectedLessonId,
      lessonTitle,
      totalScore: parseFloat(directScoreInput) || 0,
      teacherComment: directCommentInput
    });

    setIsSavingDirectGrade(false);
    if (!result.success) {
      alert('Lỗi lưu điểm trực tiếp: ' + (result.error || ''));
      return;
    }

    setDirectGradeModalStudent(null);
    loadSubmissionsData();

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#A11D24', '#16a34a', '#D4AF37']
    });

    alert(`🎉 Đã cho điểm ${directScoreInput}đ cho học viên "${directGradeModalStudent.name}" thành công!`);
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

      {/* Navigation Tabs for Teacher */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1.5px solid #f1f5f9', paddingBottom: '0.85rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('queue')}
          style={{
            background: activeTab === 'queue' ? '#A11D24' : '#f8fafc',
            color: activeTab === 'queue' ? '#ffffff' : '#475569',
            border: activeTab === 'queue' ? '1.5px solid #A11D24' : '1px solid #e2e8f0',
            padding: '0.65rem 1.4rem',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '0.92rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: activeTab === 'queue' ? '0 4px 12px rgba(161, 29, 36, 0.2)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <i className="fa-solid fa-inbox"></i>
          <span>Bài Đã Nộp Cần Chấm</span>
          <span style={{
            background: activeTab === 'queue' ? 'rgba(255,255,255,0.25)' : '#fee2e2',
            color: activeTab === 'queue' ? '#fff' : '#A11D24',
            fontSize: '0.75rem',
            padding: '0.15rem 0.5rem',
            borderRadius: '10px',
            fontWeight: 800
          }}>
            {submissions.filter((s) => s.status === 'pending' && s.submissionState !== 'draft').length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('unsubmitted')}
          style={{
            background: activeTab === 'unsubmitted' ? '#A11D24' : '#f8fafc',
            color: activeTab === 'unsubmitted' ? '#ffffff' : '#475569',
            border: activeTab === 'unsubmitted' ? '1.5px solid #A11D24' : '1px solid #e2e8f0',
            padding: '0.65rem 1.4rem',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '0.92rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: activeTab === 'unsubmitted' ? '0 4px 12px rgba(161, 29, 36, 0.2)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <i className="fa-solid fa-clipboard-user"></i>
          <span>Chấm Điểm Bài Chưa Nộp / Quản Lý Theo Lớp</span>
        </button>
      </div>

      {/* TAB 1: SUBMISSIONS QUEUE */}
      {activeTab === 'queue' && (
        submissions.length === 0 ? (
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            border: '1.5px dashed #cbd5e1',
            padding: '3.5rem 2rem',
            textAlign: 'center',
            color: '#64748b',
            boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', color: '#0f172a', fontWeight: 800 }}>
              Hiện Tại Chưa Có Bài Nộp Cần Chấm
            </h3>
            <p style={{ margin: '0 auto', maxWidth: '500px', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Học viên khi hoàn thành bài tập về nhà và bấm nộp bài sẽ lập tức xuất hiện tại đây để Cô Hoài chấm điểm, nghe file đọc và gửi nhận xét.
            </p>
          </div>
        ) : (
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
                  const isRedo = sub.submissionState === 'redo_requested';
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
                          background: isRedo ? '#fef3c7' : sub.status === 'graded' ? '#f0fdf4' : '#fff7ed',
                          color: isRedo ? '#b45309' : sub.status === 'graded' ? '#16a34a' : '#c2410c',
                          fontWeight: 600
                        }}>
                          {isRedo ? 'Cần làm lại' : sub.status === 'graded' ? `${sub.totalScore}đ` : 'Chờ chấm'}
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
            {selectedSub && (
              <div style={{ background: '#fff', border: '1px solid #fee2e2', borderRadius: '20px', padding: '2rem', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
                {/* Header of selected submission */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
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
                      background: selectedSub.submissionState === 'redo_requested'
                        ? 'rgba(217, 119, 6, 0.15)'
                        : selectedSub.status === 'graded'
                          ? 'rgba(34, 197, 94, 0.1)'
                          : 'rgba(234, 88, 12, 0.1)',
                      color: selectedSub.submissionState === 'redo_requested'
                        ? '#b45309'
                        : selectedSub.status === 'graded'
                          ? '#16a34a'
                          : '#ea580c',
                      padding: '0.4rem 1rem',
                      borderRadius: '20px',
                      fontWeight: 700,
                      fontSize: '0.85rem'
                    }}>
                      {selectedSub.submissionState === 'redo_requested'
                        ? '⚠️ Đã yêu cầu học sinh làm lại'
                        : selectedSub.status === 'graded'
                          ? `Đã chấm: ${selectedSub.totalScore} Điểm`
                          : 'Đang chờ cô chấm'}
                    </span>
                  </div>
                </div>

                {/* Answers Review Sections */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
                  {/* Auto-graded summary */}
                  <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 700, color: '#16a34a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <i className="fa-solid fa-check-double"></i>
                      Phần trắc nghiệm &amp; Ngữ pháp (Máy tự chấm):
                    </div>
                    <div style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6 }}>
                      <div>• <strong>Câu 1 (Nghe hiểu):</strong> Học viên chọn đáp án <strong>{selectedSub.answers.q1Answer || 'Chưa làm'}</strong></div>
                      <div>• <strong>Câu 2 (Thanh điệu):</strong> Chọn <strong>{selectedSub.answers.q2Answer || 'Chưa làm'}</strong></div>
                      <div>• <strong>Câu 3 (Sắp xếp câu):</strong> "{selectedSub.answers.q3Sentence || 'Chưa sắp xếp'}"</div>
                    </div>
                  </div>

                  {/* Speaking Recording Review */}
                  <div style={{ border: '1px solid #fee2e2', borderRadius: '14px', padding: '1.25rem', background: '#fff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ fontWeight: 700, color: '#A11D24', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="fa-solid fa-microphone"></i>
                        Câu 5: Bài Thu Âm Khẩu Ngữ Của Học Viên
                      </div>
                      {selectedSub.answers?.q5AudioUrl ? (
                        <span style={{ fontSize: '0.8rem', background: '#dcfce7', color: '#15803d', padding: '0.25rem 0.65rem', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <i className="fa-solid fa-cloud"></i> File thu âm từ Cloud Storage
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleReviewAudio(selectedSub.answers?.q5AudioText || '老板，这件红色的衣服太贵了，便宜一点儿吧！')}
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
                          {isPlayingAudio ? 'Đang nghe...' : 'Bấm Nghe Bản Mẫu (TTS)'}
                        </button>
                      )}
                    </div>

                    {selectedSub.answers?.q5AudioUrl && (
                      <div style={{ margin: '0.75rem 0 0.5rem 0', background: '#fef2f2', padding: '0.75rem', borderRadius: '10px' }}>
                        <div style={{ fontSize: '0.82rem', color: '#991b1b', marginBottom: '0.35rem', fontWeight: 600 }}>
                          ▶ Bấm nghe giọng đọc thực tế của học viên:
                        </div>
                        <audio controls src={selectedSub.answers.q5AudioUrl} style={{ width: '100%', height: '36px' }} />
                      </div>
                    )}

                    <div style={{ fontSize: '0.92rem', color: '#334155', background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px' }}>
                      "{selectedSub.answers?.q5AudioText || '老板，这件红色的衣服太贵了，便宜一点儿吧！'}"
                    </div>
                  </div>

                  {/* Handwriting Photo 7A */}
                  <div style={{ border: '1px solid #fee2e2', borderRadius: '14px', padding: '1.25rem', background: '#fff' }}>
                    <div style={{ fontWeight: 700, color: '#A11D24', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fa-solid fa-pen-nib"></i>
                      Câu 6 (Dạng 7A): Ảnh Chụp Vở Tập Viết Chữ Hán
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      {(selectedSub.answers?.q6HandwritingUrl || selectedSub.answers?.q6HandwritingImage) ? (
                        <img
                          src={selectedSub.answers.q6HandwritingUrl || selectedSub.answers.q6HandwritingImage}
                          alt="Bài viết của học viên"
                          style={{ width: '180px', height: '120px', objectFit: 'cover', borderRadius: '10px', border: '1px solid #e2e8f0', cursor: 'pointer' }}
                          onClick={() => window.open(selectedSub.answers.q6HandwritingUrl || selectedSub.answers.q6HandwritingImage, '_blank')}
                        />
                      ) : (
                        <div style={{ width: '180px', height: '100px', borderRadius: '10px', background: '#f8fafc', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.82rem' }}>
                          Chưa đính kèm ảnh
                        </div>
                      )}
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        <div>• Học viên luyện viết 4 chữ Hán: <strong>买, 卖, 贵, 钱</strong> vào ô điền tự cách.</div>
                        <div style={{ marginTop: '0.35rem', color: '#A11D24' }}>* Bấm vào ảnh để phóng to xem chi tiết nét bút thuận.</div>
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
                        Đã viết: <strong>{selectedSub.answers.q7CharCount || 0} chữ</strong> (Yêu cầu: ≥ 50)
                      </span>
                    </div>
                    <div style={{ fontSize: '0.95rem', color: '#1e293b', background: '#f8fafc', padding: '1rem', borderRadius: '10px', lineHeight: 1.7, border: '1px solid #e2e8f0' }}>
                      {selectedSub.answers.q7EssayText || selectedSub.answers.q7Essay || 'Học viên chưa nhập bài văn.'}
                    </div>
                  </div>
                </div>

                {/* Teacher Scoring & Feedback Action Box */}
                <div style={{ background: 'linear-gradient(135deg, #fef2f2 0%, #ffffff 100%)', border: '1.5px solid #fecaca', borderRadius: '16px', padding: '1.75rem' }}>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#A11D24', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="fa-solid fa-stamp"></i>
                    Nhận Xét &amp; Chấm Điểm
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

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setRedoNote(selectedSub.redoNote || 'Em kiểm tra lại câu trả lời và làm lại bài tập nhé.');
                        setIsRedoModalOpen(true);
                      }}
                      style={{
                        background: '#fffbeb',
                        color: '#b45309',
                        border: '1.5px solid #fcd34d',
                        padding: '0.8rem 1.4rem',
                        borderRadius: '12px',
                        fontWeight: 700,
                        fontSize: '0.92rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        transition: 'all 0.15s'
                      }}
                    >
                      <i className="fa-solid fa-rotate-left"></i>
                      Yêu Cầu Làm Lại
                    </button>

                    <button
                      type="button"
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
                      Lưu Điểm &amp; Gửi Nhận Xét Cho Học Viên
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      )}

      {/* TAB 2: UNREPORTED & DIRECT GRADING BY CLASSROOM */}
      {activeTab === 'unsubmitted' && (
        <div style={{ background: '#ffffff', borderRadius: '20px', border: '1px solid #fee2e2', padding: '2rem', boxShadow: '0 4px 25px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', color: '#0f172a', margin: '0 0 0.35rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fa-solid fa-users-viewfinder" style={{ color: '#A11D24' }}></i>
                Theo Dõi &amp; Chấm Điểm Bài Tập Theo Lớp Học
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0 }}>
                Xem danh sách tất cả học viên trong lớp, nhận biết ai chưa nộp bài và chủ động chấm điểm trực tiếp.
              </p>
            </div>

            {/* Selectors */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Chọn Lớp Học:
                </label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    outline: 'none',
                    background: '#fff'
                  }}
                >
                  {classrooms.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({cls.code || 'Mã lớp'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Chọn Bài Học:
                </label>
                <select
                  value={selectedLessonId}
                  onChange={(e) => setSelectedLessonId(e.target.value)}
                  style={{
                    padding: '0.55rem 1rem',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    outline: 'none',
                    background: '#fff',
                    maxWidth: '280px'
                  }}
                >
                  {courses.flatMap((c) => c.lessons || []).map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.number ? `Bài ${l.number}: ` : ''}{l.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Students list of selected class */}
          {(() => {
            const currentClass = classrooms.find((c) => String(c.id) === String(selectedClassId));
            const students = currentClass?.students || [];

            if (!currentClass || students.length === 0) {
              return (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
                  <i className="fa-solid fa-user-group" style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.5 }}></i>
                  <div>Lớp học này hiện tại chưa có học viên nào.</div>
                </div>
              );
            }

            return (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Học Viên</th>
                      <th style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Trạng Thái Bài Nộp</th>
                      <th style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Điểm Số</th>
                      <th style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Lời Phê Của Cô</th>
                      <th style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', fontWeight: 700, color: '#475569', textAlign: 'right' }}>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, idx) => {
                      const studentId = student.id || student.username || `st-${idx}`;
                      const sub = submissions.find(
                        (s) =>
                          (String(s.studentId) === String(student.id) || s.studentName === student.name) &&
                          String(s.lessonId) === String(selectedLessonId)
                      );

                      const isGraded = sub?.status === 'graded';
                      const isPending = sub?.status === 'pending' && sub?.submissionState === 'submitted';
                      const isDraft = sub?.submissionState === 'draft';
                      const isRedo = sub?.submissionState === 'redo_requested';

                      return (
                        <tr key={studentId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#fee2e2', color: '#A11D24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                                {student.name?.slice(0, 1) || '学'}
                              </span>
                              <div>
                                <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{student.name}</strong>
                                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                                  {student.username ? `@${student.username}` : (student.email || currentClass.code)}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td style={{ padding: '1rem' }}>
                            {isGraded ? (
                              <span style={{ background: '#dcfce7', color: '#15803d', padding: '0.3rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                <i className="fa-solid fa-circle-check"></i> Đã có điểm
                              </span>
                            ) : isRedo ? (
                              <span style={{ background: '#fef3c7', color: '#b45309', padding: '0.3rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                <i className="fa-solid fa-rotate-left"></i> Yêu cầu làm lại
                              </span>
                            ) : isPending ? (
                              <span style={{ background: '#ffedd5', color: '#c2410c', padding: '0.3rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                <i className="fa-solid fa-paper-plane"></i> Đã nộp (Chờ chấm)
                              </span>
                            ) : isDraft ? (
                              <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '0.3rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                <i className="fa-regular fa-floppy-disk"></i> Đang lưu nháp
                              </span>
                            ) : (
                              <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.3rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                <i className="fa-solid fa-circle-xmark"></i> Chưa làm / Chưa nộp
                              </span>
                            )}
                          </td>

                          <td style={{ padding: '1rem' }}>
                            {isGraded ? (
                              <strong style={{ color: '#A11D24', fontSize: '1.05rem' }}>{sub.totalScore} đ</strong>
                            ) : (
                              <span style={{ color: '#94a3b8', fontSize: '0.88rem' }}>--</span>
                            )}
                          </td>

                          <td style={{ padding: '1rem', maxWidth: '280px' }}>
                            <div style={{ fontSize: '0.85rem', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {sub?.teacherComment || <span style={{ color: '#cbd5e1', fontStyle: 'italic' }}>Chưa có nhận xét</span>}
                            </div>
                          </td>

                          <td style={{ padding: '1rem', textAlign: 'right' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenDirectGrade(student, sub)}
                              style={{
                                background: isGraded ? '#f8fafc' : 'linear-gradient(135deg, #A11D24 0%, #881337 100%)',
                                color: isGraded ? '#0f172a' : '#ffffff',
                                border: isGraded ? '1px solid #cbd5e1' : 'none',
                                padding: '0.45rem 1rem',
                                borderRadius: '10px',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                boxShadow: isGraded ? 'none' : '0 2px 8px rgba(161, 29, 36, 0.25)'
                              }}
                            >
                              <i className={`fa-solid ${isGraded ? 'fa-pen' : 'fa-stamp'}`}></i>
                              <span>{isGraded ? 'Sửa Điểm' : 'Cho Điểm Trực Tiếp'}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })()}
        </div>
      )}

      {/* MODAL: REDO REQUEST */}
      {isRedoModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '1rem',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '2rem', maxWidth: '480px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#b45309', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🔄</span>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Yêu Cầu Làm Lại Bài Tập</h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, margin: '0 0 1.25rem 0' }}>
              Khi gửi yêu cầu, bài tập của học viên <strong>{selectedSub?.studentName}</strong> sẽ tự động được mở khóa để học sinh sửa và nộp lại bài.
            </p>

            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>
              Lời nhắn dặn dò của cô giáo cho học sinh:
            </label>
            <textarea
              rows="3"
              value={redoNote}
              onChange={(e) => setRedoNote(e.target.value)}
              placeholder="Ví dụ: Em đọc lại câu 5 cho to rõ hơn, chú ý biến điệu thanh 3 nhé..."
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.9rem',
                outline: 'none',
                resize: 'none',
                marginBottom: '1.5rem'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setIsRedoModalOpen(false)}
                style={{
                  background: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '10px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmRedo}
                disabled={isSubmittingRedo}
                style={{
                  background: '#d97706',
                  color: '#fff',
                  border: 'none',
                  padding: '0.65rem 1.4rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <i className="fa-solid fa-paper-plane"></i>
                {isSubmittingRedo ? 'Đang gửi...' : 'Xác Nhận Yêu Cầu'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DIRECT GRADE FOR UNREPORTED STUDENT */}
      {directGradeModalStudent && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '1rem',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '2rem', maxWidth: '480px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#A11D24', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>✍️</span>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Cho Điểm Trực Tiếp Cho Học Viên</h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, margin: '0 0 1.25rem 0' }}>
              Học viên: <strong>{directGradeModalStudent.name}</strong>
              <br />
              Bài học: <strong>{courses.flatMap(c => c.lessons || []).find(l => l.id === selectedLessonId)?.title || 'Bài tập'}</strong>
            </p>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                Điểm số (0 - 10):
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="10"
                value={directScoreInput}
                onChange={(e) => setDirectScoreInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: '#A11D24',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                Lời phê của cô giáo:
              </label>
              <textarea
                rows="3"
                value={directCommentInput}
                onChange={(e) => setDirectCommentInput(e.target.value)}
                placeholder="Ví dụ: 0 điểm (quá hạn nộp bài) hoặc Đã kiểm tra vở ghi chép trực tiếp tại lớp."
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.9rem',
                  outline: 'none',
                  resize: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setDirectGradeModalStudent(null)}
                style={{
                  background: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '10px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveDirectGrade}
                disabled={isSavingDirectGrade}
                style={{
                  background: 'linear-gradient(135deg, #A11D24 0%, #881337 100%)',
                  color: '#fff',
                  border: 'none',
                  padding: '0.65rem 1.5rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(161, 29, 36, 0.25)'
                }}
              >
                <i className="fa-solid fa-check"></i>
                {isSavingDirectGrade ? 'Đang lưu...' : 'Lưu Điểm & Thông Báo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
