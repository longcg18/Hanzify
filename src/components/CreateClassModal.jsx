import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { COURSES_DATA } from '../data/coursesData';
import { generateUniqueClassCode } from '../data/classroomsData';

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const SHIFTS = [
  { id: 'Sáng', label: 'Sáng', timeHint: '08:30 - 10:30' },
  { id: 'Chiều', label: 'Chiều', timeHint: '14:30 - 16:30' },
  { id: 'Tối', label: 'Tối', timeHint: '19:30 - 21:30' }
];

export const CreateClassModal = ({
  isOpen,
  onClose,
  courses = COURSES_DATA,
  existingClassrooms = [],
  onCreateSuccess
}) => {
  const { user } = useAuth();

  // Form State
  const [className, setClassName] = useState('');
  const [level, setLevel] = useState('HSK 2');
  const [selectedCourseIds, setSelectedCourseIds] = useState(['hsk2']);
  const [selectedDays, setSelectedDays] = useState(['T2', 'T4', 'T6']);
  const [selectedShift, setSelectedShift] = useState('Tối');
  const [timeNote, setTimeNote] = useState('19:30 - 21:00');
  const [rosterText, setRosterText] = useState(
    'Trần Thị Mai\nLê Hoàng Nam\nPhạm Minh Đức\nHoàng Thùy Linh'
  );

  // Success screen state
  const [createdClass, setCreatedClass] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  if (!isOpen) return null;

  // Toggle course selection
  const handleToggleCourse = (courseId) => {
    setSelectedCourseIds((prev) => {
      if (prev.includes(courseId)) {
        if (prev.length === 1) return prev; // Keep at least one
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

  // Parse roster names
  const parsedStudentNames = rosterText
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  // Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!className.trim()) {
      alert('Vui lòng nhập tên lớp học!');
      return;
    }
    if (parsedStudentNames.length === 0) {
      alert('Vui lòng nhập ít nhất 1 học sinh trong danh sách!');
      return;
    }

    // Generate guaranteed unique class code
    const uniqueCode = generateUniqueClassCode(existingClassrooms);

    const newClass = {
      id: `class-${Date.now()}`,
      code: uniqueCode,
      name: className.trim(),
      level: level,
      teacher: user?.name || 'Cô Hoài',
      courseIds: selectedCourseIds,
      schedule: {
        days: selectedDays,
        shift: selectedShift,
        timeNote: timeNote.trim()
      },
      students: parsedStudentNames.map((name, idx) => ({
        id: `st-${Date.now()}-${idx + 1}`,
        name: name,
        username: null,
        isActivated: false,
        activatedAt: null
      })),
      createdAt: new Date().toISOString().split('T')[0]
    };

    if (onCreateSuccess) {
      onCreateSuccess(newClass);
    }
    setCreatedClass(newClass);
  };

  // Pre-formatted Zalo invite message
  const getZaloMessage = () => {
    if (!createdClass) return '';
    const selectedCourseNames = courses
      .filter((c) => createdClass.courseIds.includes(c.id))
      .map((c) => c.title)
      .join(' + ');

    return `🧧 THÔNG BÁO LỚP HỌC MỚI - CÔ HOÀI HANZIFY 🧧
Chào các em! Cô Hoài đã tạo lớp học trực tuyến trên Hanzify:
📌 Lớp: ${createdClass.name}
📅 Lịch học: ${createdClass.schedule.days.join(', ')} (${createdClass.schedule.shift}: ${createdClass.schedule.timeNote})
📚 Khóa học được kích hoạt: ${selectedCourseNames}

🔑 MÃ LỚP HỌC CỦA CÁC EM:
👉👉👉 [ ${createdClass.code} ] 👈👈👈

📝 HƯỚNG DẪN VÀO HỌC:
1. Truy cập vào website Hanzify: ${window.location.origin}
2. Bấm nút "Tham Gia Lớp Bằng Mã" (hoặc quét mã).
3. Nhập mã lớp trên -> Chọn ĐÚNG TÊN của mình trong danh sách lớp.
4. Đặt tên đăng nhập & mật khẩu riêng để từ lần sau đăng nhập trực tiếp.
Chúc các em học tốt cùng Cô Hoài nhé! ❤️`;
  };

  const handleCopyCode = () => {
    if (createdClass?.code) {
      navigator.clipboard.writeText(createdClass.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  const handleCopyMessage = () => {
    const msg = getZaloMessage();
    if (msg) {
      navigator.clipboard.writeText(msg);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2500);
    }
  };

  const handleClose = () => {
    setCreatedClass(null);
    setCopiedCode(false);
    setCopiedMessage(false);
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={handleClose}
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
          maxWidth: '720px',
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
          onClick={handleClose}
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

        {!createdClass ? (
          /* ========================================================================= */
          /* FORM TẠO LỚP HỌC */
          /* ========================================================================= */
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.75rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '999px',
                  background: '#fef2f2',
                  color: '#991b1b',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  marginBottom: '0.6rem'
                }}
              >
                <span>🌸 Dành cho Cô Hoài & Quản Trị Viên</span>
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem' }}>
                Mở Lớp Học Mới & Phát Hành Mã
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                Tạo lớp, chọn combo khóa học kèm danh sách học sinh. Hệ thống sẽ sinh mã lớp duy nhất để học sinh kích hoạt.
              </p>
            </div>

            {/* 1. Tên Lớp & Cấp Độ */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.4rem' }}>
                  Tên Lớp Học *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lớp HSK 2 Cấp Tốc - K03"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
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

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.4rem' }}>
                  Cấp Độ
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.8rem',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.92rem',
                    outline: 'none',
                    background: '#fff',
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

            {/* 2. Chọn Khóa Học (Combo) */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e293b' }}>
                  Khóa Học Sẽ Mở Cho Lớp (Hỗ trợ chọn Combo nhiều khóa) *
                </label>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#b91c1c' }}>
                  Đã chọn {selectedCourseIds.length} khóa
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {courses.map((c) => {
                  const isChecked = selectedCourseIds.includes(c.id);
                  return (
                    <div
                      key={c.id}
                      onClick={() => handleToggleCourse(c.id)}
                      style={{
                        padding: '0.85rem',
                        borderRadius: '14px',
                        border: isChecked ? '2px solid #b91c1c' : '1px solid #e2e8f0',
                        background: isChecked ? '#fef2f2' : '#f8fafc',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        transition: 'all 0.2s'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        style={{ cursor: 'pointer', accentColor: '#b91c1c', width: '18px', height: '18px' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {c.title}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                          {c.level} • {c.totalLessons || c.lessons?.length || 10} bài
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Lịch Học (Thứ, Buổi, Giờ Note) */}
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.75rem' }}>
                Lịch Học Trong Tuần & Khung Giờ
              </label>

              {/* Weekdays */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.4rem', fontWeight: 600 }}>
                  Ngày học trong tuần:
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {WEEKDAYS.map((day) => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleToggleDay(day)}
                        style={{
                          width: '42px',
                          height: '38px',
                          borderRadius: '10px',
                          border: isSelected ? '2px solid #b91c1c' : '1px solid #cbd5e1',
                          background: isSelected ? '#b91c1c' : '#ffffff',
                          color: isSelected ? '#ffffff' : '#334155',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Shift & Time Note */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.4rem', fontWeight: 600 }}>
                    Buổi học:
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {SHIFTS.map((sh) => (
                      <button
                        key={sh.id}
                        type="button"
                        onClick={() => {
                          setSelectedShift(sh.id);
                          setTimeNote(sh.timeHint);
                        }}
                        style={{
                          flex: 1,
                          padding: '0.55rem 0.4rem',
                          borderRadius: '10px',
                          border: selectedShift === sh.id ? '2px solid #b91c1c' : '1px solid #cbd5e1',
                          background: selectedShift === sh.id ? '#fef2f2' : '#ffffff',
                          color: selectedShift === sh.id ? '#991b1b' : '#475569',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer'
                        }}
                      >
                        {sh.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.4rem', fontWeight: 600 }}>
                    Giờ học chi tiết:
                  </div>
                  <input
                    type="text"
                    value={timeNote}
                    onChange={(e) => setTimeNote(e.target.value)}
                    placeholder="Ví dụ: 19:30 - 21:00"
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.88rem',
                      background: '#fff',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 4. Nhập Danh Sách Học Sinh */}
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e293b' }}>
                  Danh Sách Họ Tên Học Sinh Tham Gia *
                </label>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    background: '#e0f2fe',
                    color: '#0369a1',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '999px'
                  }}
                >
                  {parsedStudentNames.length} học viên dự kiến
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 0.5rem' }}>
                Nhập họ tên từng học viên, mỗi học viên 1 dòng. Học sinh khi quét mã sẽ chọn đúng tên của mình để kích hoạt.
              </p>
              <textarea
                rows={4}
                required
                value={rosterText}
                onChange={(e) => setRosterText(e.target.value)}
                placeholder="Trần Thị Mai&#10;Lê Hoàng Nam&#10;Phạm Minh Đức"
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: '14px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.9rem',
                  fontFamily: 'inherit',
                  lineHeight: 1.6,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={handleClose}
                style={{
                  padding: '0.8rem 1.4rem',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                Hủy Bỏ
              </button>
              <button
                type="submit"
                style={{
                  padding: '0.8rem 1.8rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(185, 28, 28, 0.3)'
                }}
              >
                <span>Xác Nhận & Tạo Mã Lớp</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </form>
        ) : (
          /* ========================================================================= */
          /* SUCCESS SCREEN: MÃ LỚP HỌC & LỜI NHẮN ZALO */
          /* ========================================================================= */
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#dcfce7',
                  color: '#15803d',
                  fontSize: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}
              >
                ✓
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem' }}>
                Mở Lớp Học Thành Công! 🎉
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.92rem', margin: 0 }}>
                Lớp <strong>{createdClass.name}</strong> đã sẵn sàng. Hãy gửi mã bên dưới cho học viên của lớp.
              </p>
            </div>

            {/* CLASS CODE HIGHLIGHT BOX */}
            <div
              style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                color: '#ffffff',
                padding: '1.5rem',
                borderRadius: '18px',
                textAlign: 'center',
                marginBottom: '1.5rem',
                boxShadow: '0 10px 25px rgba(15, 23, 42, 0.25)'
              }}
            >
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: '0.5rem' }}>
                Mã Lớp Học Duy Nhất (Class Code)
              </div>
              <div
                style={{
                  fontSize: '2.2rem',
                  fontWeight: 900,
                  letterSpacing: '0.12em',
                  color: '#fde047',
                  fontFamily: 'monospace',
                  marginBottom: '1rem'
                }}
              >
                {createdClass.code}
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                style={{
                  padding: '0.65rem 1.4rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: copiedCode ? '#22c55e' : '#ffffff',
                  color: copiedCode ? '#ffffff' : '#0f172a',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  transition: 'all 0.2s'
                }}
              >
                <i className={`fa-solid ${copiedCode ? 'fa-check' : 'fa-copy'}`}></i>
                <span>{copiedCode ? 'Đã Sao Chép Mã!' : 'Sao Chép Mã Lớp'}</span>
              </button>
            </div>

            {/* SUMMARY INFO */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
                background: '#f8fafc',
                padding: '1rem',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Sĩ số lớp</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  {createdClass.students.length} bạn
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Khóa học kích hoạt</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  {createdClass.courseIds.length} khóa combo
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Lịch học</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                  {createdClass.schedule.days.join(', ')} ({createdClass.schedule.shift})
                </div>
              </div>
            </div>

            {/* ZALO MESSAGE TEMPLATE */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>
                  📱 Lời Nhắn Mẫu Gửi Nhóm Zalo / Phụ Huynh:
                </label>
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: copiedMessage ? '#16a34a' : '#2563eb',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <i className={`fa-solid ${copiedMessage ? 'fa-check' : 'fa-copy'}`}></i>
                  <span>{copiedMessage ? 'Đã Sao Chép Lời Nhắn!' : 'Sao chép toàn bộ tin nhắn'}</span>
                </button>
              </div>
              <textarea
                readOnly
                rows={5}
                value={getZaloMessage()}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  fontSize: '0.82rem',
                  color: '#334155',
                  fontFamily: 'inherit',
                  lineHeight: 1.5,
                  boxSizing: 'border-box',
                  resize: 'none'
                }}
              />
            </div>

            {/* FINISH BUTTON */}
            <button
              type="button"
              onClick={handleClose}
              style={{
                width: '100%',
                padding: '0.9rem',
                borderRadius: '14px',
                border: 'none',
                background: '#0f172a',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer'
              }}
            >
              Hoàn Tất & Đóng Cửa Sổ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
