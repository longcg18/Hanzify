import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const SHIFTS = [
  { id: 'Sáng', label: 'Sáng', timeHint: '08:30 - 10:30' },
  { id: 'Chiều', label: 'Chiều', timeHint: '14:30 - 16:30' },
  { id: 'Tối', label: 'Tối', timeHint: '19:30 - 21:30' }
];

export const EditClassModal = ({
  isOpen,
  onClose,
  classroom,
  courses = [],
  onSaveSuccess
}) => {
  const { user } = useAuth();

  // Active section tab: 'general' | 'courses' | 'students'
  const [activeTab, setActiveTab] = useState('general');

  // Form State
  const [className, setClassName] = useState('');
  const [level, setLevel] = useState('HSK 1');
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);
  const [selectedDays, setSelectedDays] = useState(['T2', 'T4', 'T6']);
  const [selectedShift, setSelectedShift] = useState('Tối');
  const [timeNote, setTimeNote] = useState('19:30 - 21:00');
  const [students, setStudents] = useState([]);
  const [newStudentsText, setNewStudentsText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Sync state when classroom prop changes
  useEffect(() => {
    if (classroom) {
      setClassName(classroom.name || '');
      setLevel(classroom.level || 'HSK 1');
      setSelectedCourseIds(classroom.courseIds || []);
      setSelectedDays(classroom.schedule?.days || ['T2', 'T4', 'T6']);
      setSelectedShift(classroom.schedule?.shift || 'Tối');
      setTimeNote(classroom.schedule?.timeNote || '19:30 - 21:00');
      setStudents(classroom.students || []);
      setNewStudentsText('');
      setActiveTab('general');
    }
  }, [classroom, isOpen]);

  if (!isOpen || !classroom) return null;

  // Toggle course selection
  const handleToggleCourse = (courseId) => {
    setSelectedCourseIds((prev) => {
      if (prev.includes(courseId)) {
        if (prev.length === 1) {
          alert('Lớp học cần có ít nhất 1 khóa học!');
          return prev;
        }
        return prev.filter((id) => id !== courseId);
      } else {
        return [...prev, courseId];
      }
    });
  };

  // Toggle weekday selection
  const handleToggleDay = (day) => {
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        if (prev.length === 1) return prev;
        return prev.filter((d) => d !== day);
      } else {
        return [...prev, day];
      }
    });
  };

  // Add new students from textarea
  const handleAddNewStudents = () => {
    const names = newStudentsText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (names.length === 0) {
      alert('Vui lòng nhập họ và tên của học viên mới (mỗi bạn 1 dòng)!');
      return;
    }

    const newEntries = names.map((name, idx) => ({
      id: `st-${Date.now()}-${idx + 1}`,
      name: name,
      username: null,
      isActivated: false,
      activatedAt: null
    }));

    setStudents((prev) => [...prev, ...newEntries]);
    setNewStudentsText('');
  };

  // Remove a student
  const handleRemoveStudent = (studentId, studentName, isActivated) => {
    if (isActivated) {
      if (!window.confirm(`Học viên "${studentName}" đã kích hoạt tài khoản. Bạn có chắc muốn xóa bạn này khỏi lớp không?`)) {
        return;
      }
    }
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
  };

  // Copy class code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(classroom.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Save changes
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!className.trim()) {
      alert('Vui lòng nhập tên lớp học!');
      return;
    }
    if (selectedCourseIds.length === 0) {
      alert('Vui lòng chọn ít nhất 1 khóa học cho lớp!');
      return;
    }

    setIsSaving(true);

    const updatedClass = {
      ...classroom,
      name: className.trim(),
      level: level,
      courseIds: selectedCourseIds,
      schedule: {
        days: selectedDays,
        shift: selectedShift,
        timeNote: timeNote.trim()
      },
      students: students
    };

    if (onSaveSuccess) {
      await onSaveSuccess(updatedClass);
    }
    setIsSaving(false);
    onClose();
  };

  return (
    <div
      className="modal-backdrop"
      style={{
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
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4)',
          overflow: 'hidden',
          animation: 'modalSlideUp 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            padding: '1.25rem 1.75rem',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                color: '#38bdf8'
              }}
            >
              <i className="fa-solid fa-pen-to-square"></i>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                Chỉnh Sửa Thông Tin Lớp Học
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem', fontSize: '0.82rem', color: '#94a3b8' }}>
                <span>Mã lớp:</span>
                <strong style={{ color: '#fbbf24', fontFamily: 'monospace' }}>{classroom.code}</strong>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  style={{
                    background: copiedCode ? '#22c55e' : 'rgba(255, 255, 255, 0.15)',
                    border: 'none',
                    color: '#fff',
                    padding: '2px 7px',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    cursor: 'pointer'
                  }}
                >
                  {copiedCode ? '✓ Đã chép' : 'Sao chép'}
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              border: 'none',
              color: '#ffffff',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem'
            }}
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            padding: '0.5rem 1.75rem 0',
            gap: '0.5rem'
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            style={{
              padding: '0.65rem 1rem',
              border: 'none',
              borderBottom: activeTab === 'general' ? '3px solid #b91c1c' : '3px solid transparent',
              background: 'transparent',
              color: activeTab === 'general' ? '#b91c1c' : '#64748b',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <i className="fa-solid fa-circle-info"></i>
            <span>Thông Tin & Lịch Học</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('courses')}
            style={{
              padding: '0.65rem 1rem',
              border: 'none',
              borderBottom: activeTab === 'courses' ? '3px solid #b91c1c' : '3px solid transparent',
              background: 'transparent',
              color: activeTab === 'courses' ? '#b91c1c' : '#64748b',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <i className="fa-solid fa-layer-group"></i>
            <span>Khóa Học Combo ({selectedCourseIds.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('students')}
            style={{
              padding: '0.65rem 1rem',
              border: 'none',
              borderBottom: activeTab === 'students' ? '3px solid #b91c1c' : '3px solid transparent',
              background: 'transparent',
              color: activeTab === 'students' ? '#b91c1c' : '#64748b',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <i className="fa-solid fa-user-group"></i>
            <span>Danh Sách Học Viên ({students.length})</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem 1.75rem', flex: 1 }}>

            {/* TAB 1: THÔNG TIN & LỊCH HỌC */}
            {activeTab === 'general' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                    Tên Lớp Học *
                  </label>
                  <input
                    type="text"
                    required
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="Ví dụ: Lớp HSK 1 - K32 (Tối 2-4-6)"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.92rem',
                      fontWeight: 600,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                      Cấp Độ Lớp *
                    </label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="HSK 1">HSK 1 (Nhập môn căn bản)</option>
                      <option value="HSK 2">HSK 2 (Sơ cấp giao tiếp)</option>
                      <option value="HSK 3">HSK 3 (Trung cấp)</option>
                      <option value="HSK 4">HSK 4 (Cao cấp)</option>
                      <option value="HSK 5">HSK 5 (Chuyên nghiệp)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                      Giáo Viên Phụ Trách
                    </label>
                    <input
                      type="text"
                      disabled
                      value={classroom.teacher || 'Cô Hoài'}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        border: '1.5px solid #e2e8f0',
                        background: '#f8fafc',
                        color: '#64748b',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                {/* Schedule Config */}
                <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.65rem' }}>
                    <i className="fa-regular fa-calendar" style={{ color: '#b91c1c', marginRight: '6px' }}></i>
                    Lịch Học Trong Tuần
                  </label>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {WEEKDAYS.map((day) => {
                      const isSel = selectedDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleToggleDay(day)}
                          style={{
                            padding: '0.45rem 0.85rem',
                            borderRadius: '8px',
                            border: isSel ? '1.5px solid #b91c1c' : '1px solid #cbd5e1',
                            background: isSel ? '#fef2f2' : '#ffffff',
                            color: isSel ? '#b91c1c' : '#475569',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            cursor: 'pointer'
                          }}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                        Ca học
                      </label>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {SHIFTS.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setSelectedShift(s.id)}
                            style={{
                              flex: 1,
                              padding: '0.5rem 0.4rem',
                              borderRadius: '8px',
                              border: selectedShift === s.id ? '1.5px solid #0f172a' : '1px solid #cbd5e1',
                              background: selectedShift === s.id ? '#0f172a' : '#ffffff',
                              color: selectedShift === s.id ? '#ffffff' : '#475569',
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              cursor: 'pointer'
                            }}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                        Giờ học cụ thể
                      </label>
                      <input
                        type="text"
                        value={timeNote}
                        onChange={(e) => setTimeNote(e.target.value)}
                        placeholder="19:30 - 21:00"
                        style={{
                          width: '100%',
                          padding: '0.55rem 0.85rem',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.85rem',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: KHÓA HỌC COMBO */}
            {activeTab === 'courses' && (
              <div>
                <p style={{ margin: '0 0 1rem', fontSize: '0.84rem', color: '#64748b' }}>
                  Chọn các khóa học được mở cho học viên trong lớp này. Bấm vào thẻ để bật/tắt:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {courses.map((course) => {
                    const isChecked = selectedCourseIds.includes(course.id);

                    return (
                      <div
                        key={course.id}
                        onClick={() => handleToggleCourse(course.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.85rem 1.15rem',
                          borderRadius: '14px',
                          border: isChecked ? '2px solid #b91c1c' : '1.5px solid #e2e8f0',
                          background: isChecked ? '#fff7ed' : '#ffffff',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <div
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '6px',
                              border: isChecked ? '2px solid #b91c1c' : '2px solid #cbd5e1',
                              background: isChecked ? '#b91c1c' : '#ffffff',
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.8rem'
                            }}
                          >
                            {isChecked && <i className="fa-solid fa-check"></i>}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                                {course.title}
                              </h4>
                              <span style={{ fontSize: '0.72rem', background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px', color: '#475569', fontWeight: 700 }}>
                                {course.level || 'HSK'}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
                              {course.lessons?.length || course.totalLessons || 0} bài học bài bản
                            </span>
                          </div>
                        </div>

                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isChecked ? '#b91c1c' : '#94a3b8' }}>
                          {isChecked ? 'Đang Mở Cho Lớp' : 'Chưa Gán'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: DANH SÁCH HỌC VIÊN */}
            {activeTab === 'students' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Form thêm học viên mới */}
                <div style={{ background: '#f8fafc', padding: '1.15rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem' }}>
                    <i className="fa-solid fa-user-plus" style={{ color: '#b91c1c', marginRight: '6px' }}></i>
                    Thêm Học Viên Mới Vào Lớp
                  </label>
                  <p style={{ margin: '0 0 0.6rem', fontSize: '0.76rem', color: '#64748b' }}>
                    Nhập họ và tên học viên mới cần thêm vào lớp (hỗ trợ dán danh sách nhiều bạn, mỗi bạn 1 dòng):
                  </p>
                  <textarea
                    rows="3"
                    value={newStudentsText}
                    onChange={(e) => setNewStudentsText(e.target.value)}
                    placeholder="Ví dụ:&#10;Đỗ Thị Ngọc Ánh&#10;Vũ Hoàng Nam"
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.88rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box',
                      marginBottom: '0.65rem'
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={handleAddNewStudents}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        background: '#A11D24',
                        color: '#ffffff',
                        border: 'none',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <i className="fa-solid fa-plus"></i>
                      <span>Thêm Học Viên</span>
                    </button>
                  </div>
                </div>

                {/* Danh sách học viên hiện tại */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                      Danh Sách Học Sinh Trong Lớp ({students.length} bạn)
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>
                      ✓ {students.filter((s) => s.isActivated).length} bạn đã kích hoạt
                    </span>
                  </div>

                  {students.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '1.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                      Chưa có học sinh nào trong lớp. Hãy nhập tên ở ô trên để thêm!
                    </div>
                  ) : (
                    <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                      {students.map((student, idx) => (
                        <div
                          key={student.id || idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.55rem 0.85rem',
                            borderRadius: '10px',
                            background: student.isActivated ? '#f0fdf4' : '#ffffff',
                            border: student.isActivated ? '1px solid #bbf7d0' : '1px solid #e2e8f0'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <span style={{ fontSize: '0.78rem', color: '#94a3b8', width: '20px' }}>
                              #{idx + 1}
                            </span>
                            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                              {student.name}
                            </span>
                            {student.isActivated ? (
                              <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                                ✓ @{student.username || 'active'}
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.72rem', background: '#f1f5f9', color: '#64748b', padding: '2px 6px', borderRadius: '4px' }}>
                                Chưa kích hoạt
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            title={`Xóa học viên ${student.name}`}
                            onClick={() => handleRemoveStudent(student.id, student.name, student.isActivated)}
                            style={{
                              border: 'none',
                              background: '#fef2f2',
                              color: '#dc2626',
                              width: '26px',
                              height: '26px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem'
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div
            style={{
              background: '#ffffff',
              borderTop: '1px solid #e2e8f0',
              padding: '1rem 1.75rem',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              alignItems: 'center'
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '10px',
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                color: '#475569',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              disabled={isSaving}
              style={{
                padding: '0.65rem 1.5rem',
                borderRadius: '10px',
                background: '#A11D24',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: isSaving ? 'wait' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(161, 29, 36, 0.25)'
              }}
            >
              {isSaving ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>Đang Lưu...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-floppy-disk"></i>
                  <span>Lưu Thay Đổi</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
