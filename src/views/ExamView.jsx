import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { countExamTotalQuestions } from '../data/examsData';

export const ExamView = ({ 
  exams = [],
  isDbLive = false,
  onStartExam, 
  onCreateExam, 
  onEditExam, 
  onDeleteExam 
}) => {
  const { user, setIsAuthModalOpen } = useAuth();
  const isTeacherOrAdmin = user?.role === 'admin' || user?.role === 'teacher';

  // Modal State for Exam Builder / Editor
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'skills' | 'questions'
  const [editingExamId, setEditingExamId] = useState(null);

  // Form State for Exam
  const [examForm, setExamForm] = useState({
    title: '',
    chineseTitle: '',
    level: 'HSK 2',
    duration: 35,
    passingScore: 120,
    maxScore: 200,
    tag: 'Đề tiêu chuẩn',
    description: '',
    skills: []
  });

  // Active Skill & Part selection in Editor
  const [selectedSkillId, setSelectedSkillId] = useState(null);
  const [selectedPartId, setSelectedPartId] = useState(null);

  // Question Form State (The smallest unit)
  const [isQuestionFormOpen, setIsQuestionFormOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [qPrompt, setQPrompt] = useState('');
  const [qAudioText, setQAudioText] = useState('');
  const [qReadingText, setQReadingText] = useState('');
  const [qPinyin, setQPinyin] = useState('');
  const [qOptions, setQOptions] = useState(['', '', '', '']);
  const [qCorrectAnswer, setQCorrectAnswer] = useState('');
  const [qExplanation, setQExplanation] = useState('');

  // Open Create New Exam
  const handleOpenCreateExam = () => {
    setEditingExamId(null);
    const newId = `exam-${Date.now()}`;
    const defaultTemplate = {
      id: newId,
      title: 'Đề Thi Thử HSK Mới',
      chineseTitle: '全真模拟考试',
      level: 'HSK 2',
      duration: 35,
      passingScore: 120,
      maxScore: 200,
      tag: 'Đề mới tạo',
      description: 'Mô phỏng kỳ thi HSK với đầy đủ kỹ năng Nghe và Đọc hiểu chuẩn cấu trúc Hanban.',
      skills: [
        {
          id: `skill-lis-${Date.now()}`,
          type: 'listening',
          name: 'Kỹ Năng Nghe Hiểu (听力)',
          chineseName: '听力部分',
          parts: [
            {
              id: `part-lis-1-${Date.now()}`,
              partNumber: 1,
              title: 'Phần nghe 1: Phán đoán nội dung',
              instructions: 'Lắng nghe câu thoại và chọn phương án đúng.',
              questions: []
            }
          ]
        },
        {
          id: `skill-read-${Date.now()}`,
          type: 'reading',
          name: 'Kỹ Năng Đọc Hiểu (阅读)',
          chineseName: '阅读部分',
          parts: [
            {
              id: `part-read-1-${Date.now()}`,
              partNumber: 1,
              title: 'Phần đọc 1: Đọc hiểu câu văn',
              instructions: 'Đọc câu văn và chọn đáp án thích hợp.',
              questions: []
            }
          ]
        }
      ]
    };
    setExamForm(defaultTemplate);
    setSelectedSkillId(defaultTemplate.skills[0].id);
    setSelectedPartId(defaultTemplate.skills[0].parts[0].id);
    setActiveTab('general');
    setIsBuilderOpen(true);
  };

  // Open Edit Exam
  const handleOpenEditExam = (exam, e) => {
    if (e) e.stopPropagation();
    setEditingExamId(exam.id);
    // Deep clone to avoid mutating parent state directly
    const clone = JSON.parse(JSON.stringify(exam));
    setExamForm(clone);
    const firstSkill = clone.skills?.[0];
    setSelectedSkillId(firstSkill?.id || null);
    setSelectedPartId(firstSkill?.parts?.[0]?.id || null);
    setActiveTab('general');
    setIsBuilderOpen(true);
  };

  // Delete Exam
  const handleDeleteExam = (exam, e) => {
    if (e) e.stopPropagation();
    if (window.confirm(`Bạn có chắc muốn xóa đề thi "${exam.title}"? Thao tác này sẽ xóa toàn bộ kỹ năng, phần thi và câu hỏi bên trong!`)) {
      if (onDeleteExam) onDeleteExam(exam.id);
    }
  };

  // Save Whole Exam
  const handleSaveExam = (e) => {
    e.preventDefault();
    if (!examForm.title.trim()) {
      alert('Vui lòng nhập tên đề thi!');
      return;
    }

    if (editingExamId) {
      if (onEditExam) onEditExam(examForm);
    } else {
      if (onCreateExam) onCreateExam(examForm);
    }
    setIsBuilderOpen(false);
  };

  // Add a Skill to Exam
  const handleAddSkill = (type) => {
    const skillConfigs = {
      listening: { name: 'Kỹ Năng Nghe Hiểu (听力)', chineseName: '听力部分' },
      reading: { name: 'Kỹ Năng Đọc Hiểu (阅读)', chineseName: '阅读部分' },
      writing: { name: 'Kỹ Năng Viết (书写)', chineseName: '书写部分' }
    };
    const config = skillConfigs[type] || skillConfigs.listening;
    const newSkill = {
      id: `skill-${type}-${Date.now()}`,
      type,
      name: config.name,
      chineseName: config.chineseName,
      parts: [
        {
          id: `part-${type}-1-${Date.now()}`,
          partNumber: 1,
          title: `Phần ${type === 'listening' ? 'nghe' : type === 'reading' ? 'đọc' : 'viết'} 1`,
          instructions: 'Đọc kỹ hướng dẫn và hoàn thành các câu hỏi bên dưới.',
          questions: []
        }
      ]
    };

    setExamForm((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), newSkill]
    }));
    setSelectedSkillId(newSkill.id);
    setSelectedPartId(newSkill.parts[0].id);
  };

  // Remove a Skill
  const handleRemoveSkill = (skillId) => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ kỹ năng này cùng các phần và câu hỏi bên trong?')) {
      setExamForm((prev) => {
        const nextSkills = prev.skills.filter((s) => s.id !== skillId);
        return { ...prev, skills: nextSkills };
      });
      setSelectedSkillId(null);
      setSelectedPartId(null);
    }
  };

  // Add Part to Selected Skill
  const handleAddPart = (skillId) => {
    const targetSkill = examForm.skills.find((s) => s.id === skillId);
    if (!targetSkill) return;
    const nextNum = (targetSkill.parts?.length || 0) + 1;
    const skillPrefix = targetSkill.type === 'listening' ? 'nghe' : targetSkill.type === 'reading' ? 'đọc' : 'viết';
    const newPart = {
      id: `part-${targetSkill.type}-${nextNum}-${Date.now()}`,
      partNumber: nextNum,
      title: `Phần ${skillPrefix} ${nextNum}: Tiêu đề phần thi`,
      instructions: 'Hướng dẫn làm bài thi cho phần này.',
      questions: []
    };

    setExamForm((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === skillId ? { ...s, parts: [...(s.parts || []), newPart] } : s))
    }));
    setSelectedPartId(newPart.id);
  };

  // Remove Part
  const handleRemovePart = (skillId, partId) => {
    if (window.confirm('Xóa phần thi này và các câu hỏi trong phần?')) {
      setExamForm((prev) => ({
        ...prev,
        skills: prev.skills.map((s) => (s.id === skillId ? { ...s, parts: s.parts.filter((p) => p.id !== partId) } : s))
      }));
      setSelectedPartId(null);
    }
  };

  // ==========================================
  // QUESTIONS CRUD (THE SMALLEST UNIT)
  // ==========================================
  const selectedSkill = examForm.skills.find((s) => s.id === selectedSkillId);
  const selectedPart = selectedSkill?.parts?.find((p) => p.id === selectedPartId);

  const handleOpenAddQuestion = () => {
    setEditingQuestionId(null);
    setQPrompt('');
    setQAudioText('');
    setQReadingText('');
    setQPinyin('');
    setQOptions(['A. ', 'B. ', 'C. ', 'D. ']);
    setQCorrectAnswer('A. ');
    setQExplanation('');
    setIsQuestionFormOpen(true);
  };

  const handleOpenEditQuestion = (q) => {
    setEditingQuestionId(q.id);
    setQPrompt(q.prompt || '');
    setQAudioText(q.audioText || '');
    setQReadingText(q.readingText || '');
    setQPinyin(q.pinyin || '');
    setQOptions(q.options && q.options.length > 0 ? [...q.options] : ['A. ', 'B. ', 'C. ', 'D. ']);
    setQCorrectAnswer(q.correctAnswer || q.options?.[0] || '');
    setQExplanation(q.explanation || '');
    setIsQuestionFormOpen(true);
  };

  const handleSaveQuestion = (e) => {
    e.preventDefault();
    if (!qPrompt.trim()) {
      alert('Vui lòng nhập đề bài câu hỏi!');
      return;
    }

    const cleanedOptions = qOptions.filter((opt) => opt.trim().length > 0);
    if (cleanedOptions.length < 2) {
      alert('Cần ít nhất 2 phương án lựa chọn!');
      return;
    }

    const questionObj = {
      id: editingQuestionId || `q-${Date.now()}`,
      prompt: qPrompt.trim(),
      audioText: qAudioText.trim(),
      readingText: qReadingText.trim(),
      pinyin: qPinyin.trim(),
      options: cleanedOptions,
      correctAnswer: qCorrectAnswer.trim() || cleanedOptions[0],
      explanation: qExplanation.trim()
    };

    setExamForm((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => {
        if (s.id !== selectedSkillId) return s;
        return {
          ...s,
          parts: s.parts.map((p) => {
            if (p.id !== selectedPartId) return p;
            const existingIndex = (p.questions || []).findIndex((q) => q.id === questionObj.id);
            let updatedQuestions;
            if (existingIndex >= 0) {
              updatedQuestions = [...p.questions];
              updatedQuestions[existingIndex] = questionObj;
            } else {
              updatedQuestions = [...(p.questions || []), questionObj];
            }
            return { ...p, questions: updatedQuestions };
          })
        };
      })
    }));

    setIsQuestionFormOpen(false);
  };

  const handleDeleteQuestion = (questionId) => {
    if (window.confirm('Bạn có chắc muốn xóa câu hỏi này?')) {
      setExamForm((prev) => ({
        ...prev,
        skills: prev.skills.map((s) => {
          if (s.id !== selectedSkillId) return s;
          return {
            ...s,
            parts: s.parts.map((p) => {
              if (p.id !== selectedPartId) return p;
              return { ...p, questions: (p.questions || []).filter((q) => q.id !== questionId) };
            })
          };
        })
      }));
    }
  };

  return (
    <main className="main-content">
      {/* Header Banner */}
      <section className="courses-header" style={{
        marginBottom: '2.5rem',
        background: isTeacherOrAdmin ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' : undefined,
        padding: isTeacherOrAdmin ? '1.75rem 2rem' : undefined,
        borderRadius: isTeacherOrAdmin ? '20px' : undefined,
        color: isTeacherOrAdmin ? '#f8fafc' : undefined
      }}>
        <div className="header-meta">
          <span className="meta-badge" style={{
            background: isTeacherOrAdmin ? 'rgba(254, 202, 202, 0.15)' : 'rgba(161, 29, 36, 0.1)',
            color: isTeacherOrAdmin ? '#fca5a5' : '#A11D24'
          }}>
            {user?.role === 'admin' 
              ? '👑 Quản Trị Khảo Thí HSK (Admin)' 
              : isTeacherOrAdmin 
              ? '👩‍🏫 Quản Lý Đề Thi Của Cô Hoài (Teacher)'
              : '🎯 Phòng Luyện Thi Chuẩn Quốc Tế'}
          </span>
          <span className="meta-class" style={{ color: isTeacherOrAdmin ? '#94a3b8' : undefined }}>
            Cấu trúc 4 tầng: Đề Thi ➔ Kỹ Năng ➔ Phần ➔ Câu Hỏi
          </span>
        </div>

        <h1 className="header-title" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: isTeacherOrAdmin ? '#f8fafc' : undefined
        }}>
          <span>{isTeacherOrAdmin ? 'Quản Lý Ngân Hàng Đề Thi HSK' : 'Luyện Thi & Thi Thử HSK'}</span>
          <span style={{ fontSize: '1.25rem', color: isTeacherOrAdmin ? '#fca5a5' : '#A11D24', fontFamily: 'Noto Serif SC, serif' }}>
            全真模拟考试
          </span>
        </h1>

        <p className="header-desc" style={{ color: isTeacherOrAdmin ? '#94a3b8' : undefined }}>
          {isTeacherOrAdmin
            ? 'Cô giáo và Admin có toàn quyền tạo mới đề thi, quản lý các kỹ năng (Nghe, Đọc, Viết), các phần thi và câu hỏi (đơn vị nhỏ nhất).'
            : 'Làm quen với áp lực phòng thi thật cùng đồng hồ đếm ngược thời gian, ma trận câu hỏi thông minh và hệ thống tính điểm chuẩn HSK.'}
        </p>

        {isTeacherOrAdmin && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              onClick={handleOpenCreateExam}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '12px',
                background: '#A11D24',
                border: 'none',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(161, 29, 36, 0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              <i className="fa-solid fa-plus-circle"></i> Tạo Đề Thi HSK Mới
            </button>
            {/* Supabase Live Badge */}
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.9rem',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 700,
              background: isDbLive ? 'rgba(34, 197, 94, 0.15)' : 'rgba(148, 163, 184, 0.15)',
              color: isDbLive ? '#86efac' : '#94a3b8',
              border: isDbLive ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(148, 163, 184, 0.2)'
            }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: isDbLive ? '#22c55e' : '#64748b', display: 'inline-block', animation: isDbLive ? 'pulse 2s infinite' : 'none' }}></span>
              {isDbLive ? '✅ Supabase Exams: Đã Kết Nối' : '⚠️ Chưa kết nối được Supabase'}
            </span>
          </div>
        )}
      </section>

      {/* Exam Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.75rem' }}>
        {exams.map((exam) => {
          const totalQ = countExamTotalQuestions(exam);
          const listeningCount = (exam.skills?.find((s) => s.type === 'listening')?.parts || []).reduce((sum, p) => sum + (p.questions?.length || 0), 0);
          const readingCount = (exam.skills?.find((s) => s.type === 'reading')?.parts || []).reduce((sum, p) => sum + (p.questions?.length || 0), 0);
          const writingCount = (exam.skills?.find((s) => s.type === 'writing')?.parts || []).reduce((sum, p) => sum + (p.questions?.length || 0), 0);

          return (
            <div
              key={exam.id}
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                border: '1px solid #fee2e2',
                padding: '1.75rem',
                boxShadow: '0 8px 25px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ height: '4px', width: '100%', background: 'linear-gradient(90deg, #A11D24 0%, #D4AF37 100%)', position: 'absolute', top: 0, left: 0 }}></div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ background: '#fef2f2', color: '#A11D24', padding: '0.35rem 0.8rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700 }}>
                    {exam.level} · {exam.tag || 'Đề tiêu chuẩn'}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <i className="fa-regular fa-clock" style={{ color: '#A11D24' }}></i>
                    {exam.duration} phút
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', margin: '0 0 0.35rem 0' }}>{exam.title}</h3>
                <div style={{ fontSize: '0.9rem', color: '#A11D24', fontFamily: 'Noto Serif SC, serif', marginBottom: '0.85rem' }}>
                  {exam.chineseTitle}
                </div>

                <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {exam.description}
                </p>

                {/* Exam Specs Pills */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '1.5rem' }}>
                  <div style={{ background: '#f8fafc', padding: '0.6rem 0.8rem', borderRadius: '10px', fontSize: '0.82rem', color: '#475569' }}>
                    <i className="fa-solid fa-headphones" style={{ color: '#A11D24', marginRight: '0.4rem' }}></i>
                    Nghe: <strong>{listeningCount} câu</strong>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '0.6rem 0.8rem', borderRadius: '10px', fontSize: '0.82rem', color: '#475569' }}>
                    <i className="fa-solid fa-book-open" style={{ color: '#A11D24', marginRight: '0.4rem' }}></i>
                    Đọc: <strong>{readingCount} câu</strong>
                  </div>
                  {writingCount > 0 && (
                    <div style={{ background: '#f8fafc', padding: '0.6rem 0.8rem', borderRadius: '10px', fontSize: '0.82rem', color: '#475569' }}>
                      <i className="fa-solid fa-pen-nib" style={{ color: '#A11D24', marginRight: '0.4rem' }}></i>
                      Viết: <strong>{writingCount} câu</strong>
                    </div>
                  )}
                  <div style={{ background: '#f8fafc', padding: '0.6rem 0.8rem', borderRadius: '10px', fontSize: '0.82rem', color: '#475569' }}>
                    <i className="fa-solid fa-layer-group" style={{ color: '#0284c7', marginRight: '0.4rem' }}></i>
                    Tổng: <strong>{totalQ} câu hỏi</strong>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '0.6rem 0.8rem', borderRadius: '10px', fontSize: '0.82rem', color: '#475569' }}>
                    <i className="fa-solid fa-award" style={{ color: '#d97706', marginRight: '0.4rem' }}></i>
                    Thang điểm: <strong>{exam.maxScore || 200}đ</strong>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '0.6rem 0.8rem', borderRadius: '10px', fontSize: '0.82rem', color: '#475569' }}>
                    <i className="fa-solid fa-flag-checkered" style={{ color: '#16a34a', marginRight: '0.4rem' }}></i>
                    Đạt: <strong>≥ {exam.passingScore || 120}đ</strong>
                  </div>
                </div>

                {/* Skills list preview */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                  {(exam.skills || []).map((sk) => (
                    <span 
                      key={sk.id} 
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: '#f1f5f9',
                        color: '#334155',
                        padding: '3px 8px',
                        borderRadius: '6px'
                      }}
                    >
                      {sk.name.split(' ')[0]} ({sk.parts?.length || 0} phần)
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              {isTeacherOrAdmin ? (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => onStartExam(exam)}
                    style={{
                      flex: '1 1 auto',
                      padding: '0.75rem',
                      borderRadius: '12px',
                      border: 'none',
                      background: '#0f172a',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <i className="fa-solid fa-play"></i> Thi Thử
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleOpenEditExam(exam, e)}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      border: '1.5px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#334155',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                    title="Chỉnh sửa cấu trúc: Kỹ năng -> Phần -> Câu hỏi"
                  >
                    <i className="fa-solid fa-pen-to-square"></i> Cấu Trúc
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleDeleteExam(exam, e)}
                    style={{
                      padding: '0.75rem 0.85rem',
                      borderRadius: '12px',
                      border: '1px solid #fecaca',
                      background: '#fef2f2',
                      color: '#dc2626',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer'
                    }}
                    title="Xóa đề thi này"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (!user) {
                      setIsAuthModalOpen(true);
                      return;
                    }
                    onStartExam(exam);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #A11D24 0%, #7f1d1d 100%)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 14px rgba(161, 29, 36, 0.25)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {!user && <i className="fa-solid fa-lock" style={{ marginRight: '2px' }}></i>}
                  <span>{user ? 'Bắt Đầu Thi Thử Ngay' : 'Đăng Nhập Để Thi Thử'}</span>
                  {user && <i className="fa-solid fa-play"></i>}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* MODAL TRÌNH BIÊN TẬP ĐỀ THI PHÂN CẤP (HIERARCHICAL EXAM BUILDER) */}
      {/* ========================================================================= */}
      {isBuilderOpen && (
        <div className="modal-backdrop" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1.25rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '920px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, #7f1d1d 0%, #A11D24 100%)',
              padding: '1.25rem 1.75rem',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>
                  {editingExamId ? 'Chỉnh Sửa Cấu Trúc Đề Thi HSK' : 'Tạo Đề Thi HSK Mới'}
                </h3>
                <span style={{ fontSize: '0.78rem', opacity: 0.9 }}>
                  Phân cấp: Đề Thi ➔ Kỹ Năng ➔ Phần ➔ Câu Hỏi (Đơn vị nhỏ nhất)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsBuilderOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: '#ffffff',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            {/* Navigation Tabs */}
            <div style={{
              display: 'flex',
              background: '#f8fafc',
              borderBottom: '1.5px solid #e2e8f0',
              padding: '0.5rem 1.5rem 0',
              gap: '0.5rem'
            }}>
              <button
                type="button"
                onClick={() => setActiveTab('general')}
                style={{
                  padding: '0.75rem 1.25rem',
                  border: 'none',
                  borderBottom: activeTab === 'general' ? '3px solid #A11D24' : '3px solid transparent',
                  background: 'transparent',
                  color: activeTab === 'general' ? '#A11D24' : '#64748b',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                1. Thông Tin Đề Thi
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('skills')}
                style={{
                  padding: '0.75rem 1.25rem',
                  border: 'none',
                  borderBottom: activeTab === 'skills' ? '3px solid #A11D24' : '3px solid transparent',
                  background: 'transparent',
                  color: activeTab === 'skills' ? '#A11D24' : '#64748b',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                2. Cây Kỹ Năng & Phần Thi ({examForm.skills?.length || 0} Kỹ năng)
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('questions')}
                style={{
                  padding: '0.75rem 1.25rem',
                  border: 'none',
                  borderBottom: activeTab === 'questions' ? '3px solid #A11D24' : '3px solid transparent',
                  background: 'transparent',
                  color: activeTab === 'questions' ? '#A11D24' : '#64748b',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                3. Ngân Hàng Câu Hỏi ({countExamTotalQuestions(examForm)} Câu)
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
              {/* TAB 1: THÔNG TIN ĐỀ THI */}
              {activeTab === 'general' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                      Tên Đề Thi (Tiếng Việt) *
                    </label>
                    <input
                      type="text"
                      required
                      value={examForm.title}
                      onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                      placeholder="Ví dụ: Đề Thi Thử HSK 2 Toàn Diện - Đề Số 01"
                      style={{
                        width: '100%',
                        padding: '0.7rem 0.9rem',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '0.92rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                        Tên Tiếng Trung (Phụ đề)
                      </label>
                      <input
                        type="text"
                        value={examForm.chineseTitle}
                        onChange={(e) => setExamForm({ ...examForm, chineseTitle: e.target.value })}
                        placeholder="HSK 2级 全真模拟考试"
                        style={{
                          width: '100%',
                          padding: '0.7rem 0.9rem',
                          borderRadius: '10px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '0.92rem',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                        Cấp Độ HSK
                      </label>
                      <select
                        value={examForm.level}
                        onChange={(e) => setExamForm({ ...examForm, level: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.7rem 0.9rem',
                          borderRadius: '10px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '0.92rem',
                          boxSizing: 'border-box'
                        }}
                      >
                        <option value="HSK 1">HSK 1</option>
                        <option value="HSK 2">HSK 2</option>
                        <option value="HSK 3">HSK 3</option>
                        <option value="HSK 4">HSK 4</option>
                        <option value="HSK 5">HSK 5</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.85rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                        Thời Lượng Thi (Phút)
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="180"
                        value={examForm.duration}
                        onChange={(e) => setExamForm({ ...examForm, duration: parseInt(e.target.value, 10) || 35 })}
                        style={{
                          width: '100%',
                          padding: '0.7rem 0.9rem',
                          borderRadius: '10px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '0.92rem',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                        Thang Điểm Tối Đa
                      </label>
                      <input
                        type="number"
                        value={examForm.maxScore}
                        onChange={(e) => setExamForm({ ...examForm, maxScore: parseInt(e.target.value, 10) || 200 })}
                        style={{
                          width: '100%',
                          padding: '0.7rem 0.9rem',
                          borderRadius: '10px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '0.92rem',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                        Điểm Chuẩn Đạt (Đỗ)
                      </label>
                      <input
                        type="number"
                        value={examForm.passingScore}
                        onChange={(e) => setExamForm({ ...examForm, passingScore: parseInt(e.target.value, 10) || 120 })}
                        style={{
                          width: '100%',
                          padding: '0.7rem 0.9rem',
                          borderRadius: '10px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '0.92rem',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                      Nhãn Đề Thi (Tag)
                    </label>
                    <input
                      type="text"
                      value={examForm.tag}
                      onChange={(e) => setExamForm({ ...examForm, tag: e.target.value })}
                      placeholder="Đề tiêu chuẩn, Khởi động,..."
                      style={{
                        width: '100%',
                        padding: '0.7rem 0.9rem',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '0.92rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                      Mô Tả Đề Thi
                    </label>
                    <textarea
                      rows="3"
                      value={examForm.description}
                      onChange={(e) => setExamForm({ ...examForm, description: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.7rem 0.9rem',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '0.92rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: CÂY KỸ NĂNG & CÁC PHẦN */}
              {activeTab === 'skills' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0', color: '#0f172a' }}>Danh Sách Kỹ Năng & Phần Thi</h4>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        Mỗi kỹ năng chứa các phần thi (ví dụ: Phần nghe 1, Phần nghe 2)
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleAddSkill('listening')}
                        style={{
                          padding: '0.5rem 0.85rem',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          color: '#A11D24',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        + Kỹ Năng Nghe
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddSkill('reading')}
                        style={{
                          padding: '0.5rem 0.85rem',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          color: '#A11D24',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        + Kỹ Năng Đọc
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddSkill('writing')}
                        style={{
                          padding: '0.5rem 0.85rem',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          color: '#A11D24',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        + Kỹ Năng Viết
                      </button>
                    </div>
                  </div>

                  {/* Skills Accordion / List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {(examForm.skills || []).map((skill) => (
                      <div
                        key={skill.id}
                        style={{
                          border: '1.5px solid #e2e8f0',
                          borderRadius: '14px',
                          overflow: 'hidden',
                          background: '#f8fafc'
                        }}
                      >
                        {/* Skill Header */}
                        <div style={{
                          padding: '0.85rem 1.25rem',
                          background: '#f1f5f9',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderBottom: '1px solid #e2e8f0'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <i className={
                              skill.type === 'listening' 
                                ? 'fa-solid fa-headphones' 
                                : skill.type === 'reading' 
                                ? 'fa-solid fa-book-open' 
                                : 'fa-solid fa-pen-nib'
                            } style={{ color: '#A11D24' }}></i>
                            <strong style={{ color: '#0f172a' }}>{skill.name}</strong>
                            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                              ({skill.parts?.length || 0} Phần thi)
                            </span>
                          </div>

                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => handleAddPart(skill.id)}
                              style={{
                                padding: '0.4rem 0.75rem',
                                borderRadius: '8px',
                                background: '#A11D24',
                                border: 'none',
                                color: '#ffffff',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              + Thêm Phần Mới
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill.id)}
                              style={{
                                padding: '0.4rem 0.65rem',
                                borderRadius: '8px',
                                background: '#fee2e2',
                                border: 'none',
                                color: '#dc2626',
                                fontSize: '0.75rem',
                                cursor: 'pointer'
                              }}
                              title="Xóa kỹ năng này"
                            >
                              <i className="fa-solid fa-trash-can"></i>
                            </button>
                          </div>
                        </div>

                        {/* Parts List */}
                        <div style={{ padding: '0.85rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {(skill.parts || []).map((part) => (
                            <div
                              key={part.id}
                              style={{
                                background: '#ffffff',
                                padding: '0.85rem 1rem',
                                borderRadius: '10px',
                                border: selectedPartId === part.id ? '2px solid #A11D24' : '1px solid #cbd5e1',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}
                            >
                              <div style={{ flex: 1, marginRight: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                                  <span style={{ background: '#fef2f2', color: '#A11D24', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem' }}>
                                    Phần {part.partNumber}
                                  </span>
                                  <input
                                    type="text"
                                    value={part.title}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setExamForm((prev) => ({
                                        ...prev,
                                        skills: prev.skills.map((s) => (s.id === skill.id ? {
                                          ...s,
                                          parts: s.parts.map((p) => (p.id === part.id ? { ...p, title: val } : p))
                                        } : s))
                                      }));
                                    }}
                                    style={{
                                      border: '1px solid #cbd5e1',
                                      borderRadius: '6px',
                                      padding: '0.35rem 0.6rem',
                                      fontSize: '0.85rem',
                                      fontWeight: 600,
                                      width: '60%'
                                    }}
                                  />
                                </div>
                                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                                  {(part.questions || []).length} Câu hỏi trong phần này
                                </span>
                              </div>

                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedSkillId(skill.id);
                                    setSelectedPartId(part.id);
                                    setActiveTab('questions');
                                  }}
                                  style={{
                                    padding: '0.45rem 0.85rem',
                                    borderRadius: '8px',
                                    background: '#0f172a',
                                    border: 'none',
                                    color: '#ffffff',
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.35rem'
                                  }}
                                >
                                  <i className="fa-solid fa-list-ol"></i> Quản Lý Câu Hỏi ({part.questions?.length || 0})
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleRemovePart(skill.id, part.id)}
                                  style={{
                                    padding: '0.45rem 0.65rem',
                                    borderRadius: '8px',
                                    background: '#fee2e2',
                                    border: 'none',
                                    color: '#dc2626',
                                    fontSize: '0.75rem',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <i className="fa-solid fa-trash-can"></i>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: NGÂN HÀNG CÂU HỎI (ĐƠN VỊ NHỎ NHẤT) */}
              {activeTab === 'questions' && (
                <div>
                  {/* Skill & Part Selector Bar */}
                  <div style={{
                    background: '#f8fafc',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1.25rem',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.2rem' }}>
                        Chọn Kỹ Năng:
                      </label>
                      <select
                        value={selectedSkillId || ''}
                        onChange={(e) => {
                          const sid = e.target.value;
                          setSelectedSkillId(sid);
                          const sk = examForm.skills.find((s) => s.id === sid);
                          setSelectedPartId(sk?.parts?.[0]?.id || null);
                        }}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.85rem',
                          fontWeight: 600
                        }}
                      >
                        {(examForm.skills || []).map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.2rem' }}>
                        Chọn Phần Trong Kỹ Năng:
                      </label>
                      <select
                        value={selectedPartId || ''}
                        onChange={(e) => setSelectedPartId(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.85rem',
                          fontWeight: 600
                        }}
                      >
                        {(selectedSkill?.parts || []).map((p) => (
                          <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenAddQuestion}
                      style={{
                        padding: '0.65rem 1.15rem',
                        borderRadius: '10px',
                        background: '#A11D24',
                        border: 'none',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        alignSelf: 'flex-end'
                      }}
                    >
                      <i className="fa-solid fa-plus-circle"></i> Thêm Câu Hỏi Mới
                    </button>
                  </div>

                  {/* List of Questions in Selected Part */}
                  {selectedPart ? (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                          Danh Sách Câu Hỏi Trong: {selectedPart.title} ({(selectedPart.questions || []).length} Câu)
                        </span>
                      </div>

                      {(selectedPart.questions || []).length === 0 ? (
                        <div style={{
                          padding: '2.5rem',
                          textAlign: 'center',
                          background: '#f8fafc',
                          borderRadius: '12px',
                          border: '1.5px dashed #cbd5e1'
                        }}>
                          <i className="fa-solid fa-clipboard-question" style={{ fontSize: '2rem', color: '#94a3b8', marginBottom: '0.5rem' }}></i>
                          <p style={{ color: '#64748b', margin: '0 0 0.75rem 0', fontSize: '0.9rem' }}>
                            Chưa có câu hỏi nào trong phần này.
                          </p>
                          <button
                            type="button"
                            onClick={handleOpenAddQuestion}
                            style={{
                              padding: '0.5rem 1rem',
                              borderRadius: '8px',
                              background: '#A11D24',
                              border: 'none',
                              color: '#ffffff',
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              cursor: 'pointer'
                            }}
                          >
                            + Thêm Câu Hỏi Đầu Tiên
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {(selectedPart.questions || []).map((q, idx) => (
                            <div
                              key={q.id || idx}
                              style={{
                                background: '#ffffff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px',
                                padding: '1rem',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                gap: '1rem'
                              }}
                            >
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                                  <span style={{
                                    background: '#fef2f2',
                                    color: '#A11D24',
                                    fontWeight: 700,
                                    padding: '2px 8px',
                                    borderRadius: '6px',
                                    fontSize: '0.75rem'
                                  }}>
                                    Câu #{idx + 1}
                                  </span>
                                  <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{q.prompt}</strong>
                                </div>

                                {q.audioText && (
                                  <div style={{ fontSize: '0.82rem', color: '#0284c7', marginBottom: '0.25rem' }}>
                                    <i className="fa-solid fa-volume-high" style={{ marginRight: '0.3rem' }}></i>
                                    Thoại nghe: "{q.audioText}" {q.pinyin && `(${q.pinyin})`}
                                  </div>
                                )}

                                {q.readingText && (
                                  <div style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '0.25rem' }}>
                                    <i className="fa-solid fa-align-left" style={{ marginRight: '0.3rem' }}></i>
                                    Nội dung: {q.readingText}
                                  </div>
                                )}

                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                                  {(q.options || []).map((opt, oIdx) => (
                                    <span
                                      key={oIdx}
                                      style={{
                                        fontSize: '0.75rem',
                                        padding: '2px 8px',
                                        borderRadius: '6px',
                                        background: opt === q.correctAnswer ? '#dcfce7' : '#f1f5f9',
                                        color: opt === q.correctAnswer ? '#15803d' : '#475569',
                                        fontWeight: opt === q.correctAnswer ? 700 : 500,
                                        border: opt === q.correctAnswer ? '1px solid #86efac' : '1px solid transparent'
                                      }}
                                    >
                                      {opt} {opt === q.correctAnswer && '✓'}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditQuestion(q)}
                                  style={{
                                    padding: '0.4rem 0.65rem',
                                    borderRadius: '6px',
                                    background: '#f1f5f9',
                                    border: '1px solid #cbd5e1',
                                    color: '#334155',
                                    fontSize: '0.78rem',
                                    cursor: 'pointer'
                                  }}
                                  title="Chỉnh sửa câu hỏi"
                                >
                                  <i className="fa-solid fa-pen"></i> Sửa
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteQuestion(q.id)}
                                  style={{
                                    padding: '0.4rem 0.65rem',
                                    borderRadius: '6px',
                                    background: '#fee2e2',
                                    border: '1px solid #fecaca',
                                    color: '#dc2626',
                                    fontSize: '0.78rem',
                                    cursor: 'pointer'
                                  }}
                                  title="Xóa câu hỏi"
                                >
                                  <i className="fa-solid fa-trash-can"></i>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                      Vui lòng tạo hoặc chọn một Kỹ Năng và Phần Thi ở tab 2 trước.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1.25rem 1.75rem',
              background: '#f8fafc',
              borderTop: '1.5px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Tổng cộng: <strong>{examForm.skills?.length || 0} Kỹ năng</strong> · <strong>{countExamTotalQuestions(examForm)} Câu hỏi</strong>
              </span>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsBuilderOpen(false)}
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: '10px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#475569',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Hủy Bỏ
                </button>
                <button
                  type="button"
                  onClick={handleSaveExam}
                  style={{
                    padding: '0.65rem 1.75rem',
                    borderRadius: '10px',
                    background: '#A11D24',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 4px 12px rgba(161, 29, 36, 0.3)'
                  }}
                >
                  <i className="fa-solid fa-check"></i>
                  Lưu Cấu Trúc Đề Thi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-MODAL: THÊM / SỬA CÂU HỎI (ĐƠN VỊ NHỎ NHẤT) */}
      {/* ========================================================================= */}
      {isQuestionFormOpen && (
        <div className="modal-backdrop" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '560px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
            overflow: 'hidden',
            animation: 'modalSlideUp 0.3s ease-out'
          }}>
            <div style={{
              background: '#0f172a',
              padding: '1rem 1.5rem',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>
                  {editingQuestionId ? 'Chỉnh Sửa Câu Hỏi' : 'Thêm Câu Hỏi Mới'} (Đơn vị nhỏ nhất)
                </h4>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  {selectedSkill?.name} ➔ {selectedPart?.title}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsQuestionFormOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#ffffff',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '75vh', overflowY: 'auto' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                  Đề Bài Câu Hỏi *
                </label>
                <input
                  type="text"
                  required
                  value={qPrompt}
                  onChange={(e) => setQPrompt(e.target.value)}
                  placeholder="Ví dụ: Lắng nghe đoạn thoại và chọn đáp án đúng..."
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.8rem',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.88rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {selectedSkill?.type === 'listening' ? (
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                    Đoạn Thoại Phát Âm (Audio Text)
                  </label>
                  <input
                    type="text"
                    value={qAudioText}
                    onChange={(e) => setQAudioText(e.target.value)}
                    placeholder="Ví dụ: 外面下大雨了，你别出去了。"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.8rem',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.88rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              ) : (
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                    Đoạn Văn Hoặc Câu Văn Đọc Hiểu (Reading Text)
                  </label>
                  <textarea
                    rows="2"
                    value={qReadingText}
                    onChange={(e) => setQReadingText(e.target.value)}
                    placeholder="Ví dụ: 医生说我生病了，需要多喝水，多休息..."
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.8rem',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.88rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                  Phiên Âm Pinyin (Tùy chọn)
                </label>
                <input
                  type="text"
                  value={qPinyin}
                  onChange={(e) => setQPinyin(e.target.value)}
                  placeholder="Wàimiàn xià dàyǔ le..."
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.8rem',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.88rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Options */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                  Các Phương Án Lựa Chọn (Tối thiểu 2)
                </label>
                {qOptions.map((opt, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '0.4rem' }}>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...qOptions];
                        newOpts[i] = e.target.value;
                        setQOptions(newOpts);
                      }}
                      placeholder={`Lựa chọn ${i + 1}`}
                      style={{
                        flex: 1,
                        padding: '0.55rem 0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.85rem'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setQCorrectAnswer(opt)}
                      style={{
                        padding: '0.4rem 0.75rem',
                        borderRadius: '8px',
                        border: qCorrectAnswer === opt ? '2px solid #16a34a' : '1px solid #cbd5e1',
                        background: qCorrectAnswer === opt ? '#dcfce7' : '#f8fafc',
                        color: qCorrectAnswer === opt ? '#15803d' : '#64748b',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {qCorrectAnswer === opt ? '✓ Đúng' : 'Chọn đúng'}
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                  Giải Thích Chi Tiết Đáp Án
                </label>
                <textarea
                  rows="2"
                  value={qExplanation}
                  onChange={(e) => setQExplanation(e.target.value)}
                  placeholder="Từ khóa nghe được là..., do đó đáp án chính xác là..."
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.8rem',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.88rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsQuestionFormOpen(false)}
                  style={{
                    padding: '0.6rem 1.15rem',
                    borderRadius: '8px',
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    color: '#475569',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.6rem 1.35rem',
                    borderRadius: '8px',
                    background: '#A11D24',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <i className="fa-solid fa-check"></i> Lưu Câu Hỏi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
