import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const JoinClassModal = ({
  isOpen,
  onClose,
  classrooms = [],
  courses = [],
  onStudentActivated
}) => {
  const { registerStudentWithClass, registeredUsers } = useAuth();

  // Multi-step: 1 = Code, 2 = Pick Name, 3 = Credentials, 4 = Success
  const [step, setStep] = useState(1);

  // Step 1: Code
  const [classCodeInput, setClassCodeInput] = useState('');
  const [codeError, setCodeError] = useState('');
  const [matchedClass, setMatchedClass] = useState(null);

  // Step 2: Pick Name from Roster
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [nameFilter, setNameFilter] = useState('');

  // Step 3: Credentials
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [credentialError, setCredentialError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  // Reset all states
  const handleReset = () => {
    setStep(1);
    setClassCodeInput('');
    setCodeError('');
    setMatchedClass(null);
    setSelectedStudent(null);
    setNameFilter('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setCredentialError('');
    onClose();
  };

  // Step 1: Validate Code
  const handleVerifyCode = (codeToVerify) => {
    const rawCode = (codeToVerify || classCodeInput).trim().toUpperCase();
    setCodeError('');

    if (!rawCode) {
      setCodeError('Vui lòng nhập mã lớp học!');
      return;
    }

    const found = classrooms.find(
      (c) => (c.code || '').trim().toUpperCase() === rawCode
    );

    if (!found) {
      setCodeError('Mã lớp học không tồn tại hoặc đã hết hạn. Vui lòng kiểm tra lại mã Cô Hoài cung cấp!');
      return;
    }

    setMatchedClass(found);
    setStep(2);
  };

  // Step 2: Confirm Selected Student
  const handleContinueToCredentials = () => {
    if (!selectedStudent) {
      alert('Vui lòng chọn họ tên của bạn trong danh sách lớp!');
      return;
    }
    if (selectedStudent.isActivated) {
      alert('Học sinh này đã được kích hoạt tài khoản rồi. Nếu là bạn, hãy đăng nhập trực tiếp!');
      return;
    }

    // Pre-generate a friendly username from student name (e.g. "Trần Thị Mai" -> "maitt")
    const words = selectedStudent.name.trim().toLowerCase().split(/\s+/);
    let suggestedUsername = words[words.length - 1]; // last name
    for (let i = 0; i < words.length - 1; i++) {
      suggestedUsername += words[i][0] || '';
    }
    suggestedUsername = suggestedUsername.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
    
    // Check if suggested already taken
    let finalSuggested = suggestedUsername;
    let suffix = 1;
    while (registeredUsers?.some((u) => u.username?.toLowerCase() === finalSuggested.toLowerCase())) {
      finalSuggested = `${suggestedUsername}${suffix++}`;
    }

    setUsername(finalSuggested);
    setStep(3);
  };

  // Step 3: Complete Registration
  const handleRegisterAccount = async (e) => {
    e.preventDefault();
    setCredentialError('');

    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername || cleanUsername.length < 3) {
      setCredentialError('Tên đăng nhập phải có ít nhất 3 ký tự!');
      return;
    }

    // Check valid username characters (alphanumeric, dot, underscore)
    if (!/^[a-z0-9_.]+$/.test(cleanUsername)) {
      setCredentialError('Tên đăng nhập chỉ gồm chữ cái thường, số, dấu gạch dưới (_) hoặc dấu chấm (.)');
      return;
    }

    if (!password || password.length < 4) {
      setCredentialError('Mật khẩu phải có ít nhất 4 ký tự!');
      return;
    }

    if (password !== confirmPassword) {
      setCredentialError('Mật khẩu xác nhận không khớp. Vui lòng nhập lại!');
      return;
    }

    // Register user & activate
    const res = await registerStudentWithClass({
      classId: matchedClass.id,
      className: matchedClass.name,
      studentId: selectedStudent.id,
      name: selectedStudent.name,
      username: cleanUsername,
      password: password,
      enrolledCourses: matchedClass.courseIds || []
    });

    if (!res.success) {
      setCredentialError(res.message);
      return;
    }

    // Update classroom roster state via callback
    if (onStudentActivated) {
      onStudentActivated({
        classId: matchedClass.id,
        studentId: selectedStudent.id,
        username: cleanUsername
      });
    }

    setStep(4);
  };

  // Filter students
  const filteredStudents = (matchedClass?.students || []).filter((s) =>
    s.name.toLowerCase().includes(nameFilter.trim().toLowerCase())
  );

  return (
    <div
      className="modal-overlay"
      onClick={handleReset}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem'
      }}
    >
      <div
        className="custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          width: '100%',
          maxWidth: '660px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '24px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          position: 'relative',
          padding: '2rem'
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleReset}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: 'none',
            background: '#f1f5f9',
            color: '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            transition: 'all 0.2s'
          }}
        >
          ✕
        </button>

        {/* STEP PROGRESS INDICATOR */}
        {step < 4 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: step >= 1 ? '#b91c1c' : '#94a3b8', fontWeight: 700, fontSize: '0.82rem' }}>
              <span style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: step >= 1 ? '#b91c1c' : '#e2e8f0',
                color: step >= 1 ? '#fff' : '#64748b',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem'
              }}>1</span>
              <span>Nhập mã</span>
            </div>
            <div style={{ width: '28px', height: '2px', background: step >= 2 ? '#b91c1c' : '#e2e8f0' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: step >= 2 ? '#b91c1c' : '#94a3b8', fontWeight: 700, fontSize: '0.82rem' }}>
              <span style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: step >= 2 ? '#b91c1c' : '#e2e8f0',
                color: step >= 2 ? '#fff' : '#64748b',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem'
              }}>2</span>
              <span>Chọn tên</span>
            </div>
            <div style={{ width: '28px', height: '2px', background: step >= 3 ? '#b91c1c' : '#e2e8f0' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: step >= 3 ? '#b91c1c' : '#94a3b8', fontWeight: 700, fontSize: '0.82rem' }}>
              <span style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: step >= 3 ? '#b91c1c' : '#e2e8f0',
                color: step >= 3 ? '#fff' : '#64748b',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem'
              }}>3</span>
              <span>Tạo tài khoản</span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* BƯỚC 1: NHẬP HOẶC QUÉT MÃ LỚP HỌC */}
        {/* ========================================================================= */}
        {step === 1 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: '#fef2f2',
                  color: '#b91c1c',
                  fontSize: '1.6rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.75rem'
                }}
              >
                <i className="fa-solid fa-qrcode"></i>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem' }}>
                Tham Gia Lớp Học Bằng Mã
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                Nhập mã lớp học do Cô Hoài cung cấp trong nhóm Zalo hoặc quét mã QR.
              </p>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
                Mã Lớp Học (Class Code) *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  autoFocus
                  placeholder="Ví dụ: HZ-2026-CB13X9"
                  value={classCodeInput}
                  onChange={(e) => {
                    setClassCodeInput(e.target.value.toUpperCase());
                    setCodeError('');
                  }}
                  style={{
                    width: '100%',
                    padding: '0.95rem 1.1rem',
                    borderRadius: '14px',
                    border: codeError ? '2px solid #ef4444' : '2px solid #cbd5e1',
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {codeError && (
                <div style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span>{codeError}</span>
                </div>
              )}
            </div>

            {/* Quick Demo Chips for Instant Testing */}
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                💡 Thử nghiệm nhanh các mã lớp hiện có:
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {classrooms.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setClassCodeInput(c.code);
                      handleVerifyCode(c.code);
                    }}
                    style={{
                      padding: '0.45rem 0.8rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#0f172a',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'monospace'
                    }}
                  >
                    {c.code} ({c.level})
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleVerifyCode(classCodeInput)}
              style={{
                width: '100%',
                padding: '0.95rem',
                borderRadius: '14px',
                border: 'none',
                background: 'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(185, 28, 28, 0.3)'
              }}
            >
              <span>Kiểm Tra Mã & Xem Danh Sách Lớp</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* BƯỚC 2: CHỌN ĐÚNG TÊN TRONG DANH SÁCH LỚP */}
        {/* ========================================================================= */}
        {step === 2 && matchedClass && (
          <div>
            {/* Header info about the class */}
            <div
              style={{
                background: 'linear-gradient(135deg, #fef2f2 0%, #fff1f2 100%)',
                padding: '1.25rem',
                borderRadius: '16px',
                border: '1px solid #fecaca',
                marginBottom: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#991b1b', background: '#fee2e2', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                  {matchedClass.code}
                </span>
                <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  GV: <strong>{matchedClass.teacher}</strong>
                </span>
              </div>
              <h3 style={{ margin: '0 0 0.3rem', fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                {matchedClass.name}
              </h3>
              <div style={{ fontSize: '0.84rem', color: '#475569', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <span>📅 {matchedClass.schedule.days.join(', ')} ({matchedClass.schedule.shift} {matchedClass.schedule.timeNote})</span>
                <span>📚 Mở {matchedClass.courseIds.length} khóa combo</span>
              </div>
            </div>

            {/* Instruction */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.92rem', fontWeight: 800, color: '#1e293b' }}>
                  Chọn đúng họ tên của bạn trong danh sách: *
                </label>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Sĩ số: {matchedClass.students.length} bạn
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0 0 0.75rem' }}>
                ⚠️ Mỗi bạn chỉ được kích hoạt 1 lần theo đúng tên Cô Hoài đã lập danh sách. Tên đã kích hoạt sẽ không chọn lại được.
              </p>

              {/* Search filter */}
              <input
                type="text"
                placeholder="Tìm nhanh tên bạn..."
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.9rem',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.88rem',
                  marginBottom: '0.75rem',
                  boxSizing: 'border-box'
                }}
              />

              {/* Students list */}
              <div
                className="custom-scrollbar"
                style={{
                  maxHeight: '260px',
                  overflowY: 'auto',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem'
                }}
              >
                {filteredStudents.length === 0 ? (
                  <div style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b', fontSize: '0.88rem' }}>
                    Không tìm thấy học sinh phù hợp với từ khóa!
                  </div>
                ) : (
                  filteredStudents.map((st) => {
                    const isSelected = selectedStudent?.id === st.id;
                    const isActivated = st.isActivated;

                    return (
                      <div
                        key={st.id}
                        onClick={() => {
                          if (!isActivated) setSelectedStudent(st);
                        }}
                        style={{
                          padding: '0.75rem 1rem',
                          borderRadius: '12px',
                          border: isSelected
                            ? '2px solid #b91c1c'
                            : isActivated
                            ? '1px solid #e2e8f0'
                            : '1px solid #e2e8f0',
                          background: isSelected
                            ? '#fef2f2'
                            : isActivated
                            ? '#f1f5f9'
                            : '#ffffff',
                          opacity: isActivated ? 0.65 : 1,
                          cursor: isActivated ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.15s'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              background: isSelected ? '#b91c1c' : '#e2e8f0',
                              color: isSelected ? '#ffffff' : '#334155',
                              fontWeight: 700,
                              fontSize: '0.88rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {st.name[0]}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
                              {st.name}
                            </div>
                            {st.username && (
                              <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                                @{st.username}
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          {isActivated ? (
                            <span
                              style={{
                                fontSize: '0.76rem',
                                fontWeight: 700,
                                background: '#e2e8f0',
                                color: '#475569',
                                padding: '0.25rem 0.6rem',
                                borderRadius: '999px'
                              }}
                            >
                              ✓ Đã kích hoạt
                            </span>
                          ) : (
                            <span
                              style={{
                                fontSize: '0.76rem',
                                fontWeight: 700,
                                background: isSelected ? '#b91c1c' : '#f8fafc',
                                color: isSelected ? '#ffffff' : '#0369a1',
                                border: isSelected ? 'none' : '1px solid #bae6fd',
                                padding: '0.25rem 0.6rem',
                                borderRadius: '999px'
                              }}
                            >
                              {isSelected ? 'Đang chọn ✓' : 'Chưa kích hoạt'}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  padding: '0.85rem 1.4rem',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                Quay Lại
              </button>
              <button
                type="button"
                disabled={!selectedStudent}
                onClick={handleContinueToCredentials}
                style={{
                  flex: 1,
                  padding: '0.85rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: selectedStudent
                    ? 'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)'
                    : '#cbd5e1',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  cursor: selectedStudent ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: selectedStudent ? '0 4px 14px rgba(185, 28, 28, 0.3)' : 'none'
                }}
              >
                <span>Tiếp Tục: Đặt Tên Đăng Nhập & Mật Khẩu</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* BƯỚC 3: ĐẶT TÊN ĐĂNG NHẬP & MẬT KHẨU */}
        {/* ========================================================================= */}
        {step === 3 && selectedStudent && (
          <form onSubmit={handleRegisterAccount}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#fef2f2',
                  color: '#b91c1c',
                  fontSize: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.75rem'
                }}
              >
                <i className="fa-solid fa-id-badge"></i>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.3rem' }}>
                Thiết Lập Tài Khoản Đăng Nhập
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                Bạn đang kích hoạt tài khoản cho học viên: <strong>{selectedStudent.name}</strong>
              </p>
            </div>

            <div
              style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                color: '#166534',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <i className="fa-solid fa-circle-check"></i>
              <span>
                Từ lần sau bạn có thể dùng <strong>Tên đăng nhập & Mật khẩu</strong> này để vào học trực tiếp mà không cần nhập lại mã lớp!
              </span>
            </div>

            {/* Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.4rem' }}>
                  Họ và tên học viên:
                </label>
                <input
                  type="text"
                  disabled
                  value={selectedStudent.name}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    color: '#334155',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.4rem' }}>
                  Tên đăng nhập (Username) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: maitt26"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.92rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <span style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
                  Dùng để đăng nhập lần sau. Viết liền không dấu, ít nhất 3 ký tự.
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.4rem' }}>
                  Mật khẩu *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Nhập mật khẩu (tối thiểu 4 ký tự)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      paddingRight: '2.5rem',
                      borderRadius: '12px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.92rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      border: 'none',
                      background: 'transparent',
                      color: '#64748b',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.4rem' }}>
                  Xác nhận lại mật khẩu *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Nhập lại mật khẩu vừa nhập"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.92rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {credentialError && (
              <div
                style={{
                  color: '#dc2626',
                  fontSize: '0.85rem',
                  marginBottom: '1rem',
                  background: '#fef2f2',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <i className="fa-solid fa-circle-exclamation"></i>
                <span>{credentialError}</span>
              </div>
            )}

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setStep(2)}
                style={{
                  padding: '0.85rem 1.4rem',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                Quay Lại
              </button>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: '0.85rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(185, 28, 28, 0.3)'
                }}
              >
                <span>Kích Hoạt Tài Khoản & Vào Học Ngay</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* BƯỚC 4: THÀNH CÔNG VÀ CHÀO MỪNG */}
        {/* ========================================================================= */}
        {step === 4 && (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: '#dcfce7',
                color: '#15803d',
                fontSize: '2.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}
            >
              ✓
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
              Chào mừng {selectedStudent?.name}! 🎉
            </h2>
            <p style={{ color: '#475569', fontSize: '0.95rem', margin: '0 0 1.5rem', lineHeight: 1.5 }}>
              Bạn đã kích hoạt thành công vào <strong>{matchedClass?.name}</strong> của <strong>{matchedClass?.teacher}</strong>.<br/>
              Toàn bộ các khóa học trong lớp đã được mở khóa cho bạn!
            </p>

            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '1rem',
                marginBottom: '1.5rem',
                textAlign: 'left'
              }}
            >
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, marginBottom: '0.4rem' }}>
                Thông tin tài khoản của bạn:
              </div>
              <div style={{ fontSize: '0.9rem', color: '#0f172a', marginBottom: '0.2rem' }}>
                • Tên đăng nhập: <strong style={{ color: '#b91c1c' }}>{username}</strong>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#0f172a' }}>
                • Mật khẩu: <strong>••••••••</strong> (đã lưu an toàn)
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              style={{
                width: '100%',
                padding: '0.95rem',
                borderRadius: '14px',
                border: 'none',
                background: 'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(185, 28, 28, 0.3)'
              }}
            >
              Bắt Đầu Khóa Học Ngay 🚀
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
