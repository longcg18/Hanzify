import React, { useState } from 'react';

export const ClassLessonManagerModal = ({
  isOpen,
  onClose,
  classroom,
  courses = [],
  onToggleLesson,
  onUnlockAll,
  onLockAll
}) => {
  if (!isOpen || !classroom) return null;

  // Find all courses assigned to this classroom
  const assignedCourses = courses.filter((c) =>
    (classroom.courseIds || []).includes(c.id)
  );
  // Fallback: if no course matches specifically, provide courses matching level or all courses
  const displayCourses = assignedCourses.length > 0 ? assignedCourses : courses.slice(0, 2);

  const [activeCourseId, setActiveCourseId] = useState(displayCourses[0]?.id || 'all');

  const filteredCourses = activeCourseId === 'all'
    ? displayCourses
    : displayCourses.filter((c) => c.id === activeCourseId);

  // All lessons from display courses
  const allLessons = displayCourses.flatMap((c) => (c.lessons || []).map((l) => ({ ...l, courseId: c.id, courseTitle: c.title })));
  const unlockedSet = new Set(classroom.unlockedLessons || []);
  const unlockedCount = allLessons.filter((l) => unlockedSet.has(l.id)).length;
  const totalCount = allLessons.length;

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
          maxHeight: '90vh',
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
            padding: '1.35rem 1.75rem',
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
                color: '#60a5fa'
              }}
            >
              <i className="fa-solid fa-chalkboard-user"></i>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                  Quản Lý Mở Bài Học Cho Lớp
                </h3>
                <span
                  style={{
                    background: '#38bdf8',
                    color: '#0f172a',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}
                >
                  {classroom.level}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
                Lớp: <strong style={{ color: '#f8fafc' }}>{classroom.name}</strong> • Mã lớp: <code style={{ color: '#fbbf24', background: 'rgba(251, 191, 36, 0.15)', padding: '1px 5px', borderRadius: '4px' }}>{classroom.code}</code>
              </p>
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
              fontSize: '1rem',
              transition: 'background 0.2s'
            }}
          >
            ✕
          </button>
        </div>

        {/* Action Toolbar & Stats Bar */}
        <div
          style={{
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            padding: '1rem 1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '0.25rem' }}>
              Trạng thái mở bài học:
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: 800, color: unlockedCount > 0 ? '#16a34a' : '#b91c1c' }}>
                {unlockedCount} / {totalCount} bài học đang mở
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                ({totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0}%)
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => onUnlockAll && onUnlockAll(classroom.id, allLessons.map((l) => l.id))}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.5rem 0.85rem',
                borderRadius: '8px',
                background: '#f0fdf4',
                border: '1.5px solid #86efac',
                color: '#15803d',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <i className="fa-solid fa-lock-open"></i>
              <span>Mở Tất Cả</span>
            </button>
            <button
              type="button"
              onClick={() => onLockAll && onLockAll(classroom.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.5rem 0.85rem',
                borderRadius: '8px',
                background: '#fef2f2',
                border: '1.5px solid #fca5a5',
                color: '#b91c1c',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <i className="fa-solid fa-lock"></i>
              <span>Khóa Tất Cả</span>
            </button>
          </div>
        </div>

        {/* Course Filter Tabs if multiple courses */}
        {displayCourses.length > 1 && (
          <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem 1.75rem', borderBottom: '1px solid #e2e8f0', background: '#ffffff', overflowX: 'auto' }}>
            <button
              type="button"
              onClick={() => setActiveCourseId('all')}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                border: activeCourseId === 'all' ? '1.5px solid #0f172a' : '1px solid #cbd5e1',
                background: activeCourseId === 'all' ? '#0f172a' : '#ffffff',
                color: activeCourseId === 'all' ? '#ffffff' : '#475569',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Tất cả khóa ({allLessons.length} bài)
            </button>
            {displayCourses.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCourseId(c.id)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '8px',
                  border: activeCourseId === c.id ? '1.5px solid #0f172a' : '1px solid #cbd5e1',
                  background: activeCourseId === c.id ? '#0f172a' : '#ffffff',
                  color: activeCourseId === c.id ? '#ffffff' : '#475569',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {c.title} ({(c.lessons || []).length} bài)
              </button>
            ))}
          </div>
        )}

        {/* Scrollable Lessons List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredCourses.map((courseItem) => {
            const courseLessons = courseItem.lessons || [];

            return (
              <div key={courseItem.id}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem',
                    paddingBottom: '0.4rem',
                    borderBottom: '1.5px solid #f1f5f9'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1rem' }}>📚</span>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                      {courseItem.title}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      ({courseLessons.length} bài học)
                    </span>
                  </div>
                </div>

                {courseLessons.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                    Chưa có bài học nào trong khóa học này.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {courseLessons.map((lesson) => {
                      const isUnlocked = unlockedSet.has(lesson.id);

                      return (
                        <div
                          key={lesson.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.85rem 1rem',
                            borderRadius: '14px',
                            background: isUnlocked ? '#ffffff' : '#f8fafc',
                            border: isUnlocked ? '1.5px solid #bbf7d0' : '1px solid #e2e8f0',
                            boxShadow: isUnlocked ? '0 2px 8px rgba(34, 197, 94, 0.08)' : 'none',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '10px',
                                background: isUnlocked ? '#dcfce7' : '#f1f5f9',
                                color: isUnlocked ? '#166534' : '#64748b',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: '0.88rem',
                                flexShrink: 0
                              }}
                            >
                              {lesson.number || '01'}
                            </div>

                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                                <h5
                                  style={{
                                    margin: 0,
                                    fontSize: '0.92rem',
                                    fontWeight: 700,
                                    color: isUnlocked ? '#0f172a' : '#475569',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                  }}
                                >
                                  {lesson.title}
                                </h5>
                                {lesson.chineseTitle && (
                                  <span style={{ fontSize: '0.8rem', color: '#b91c1c', fontFamily: 'Noto Serif SC, serif' }}>
                                    ({lesson.chineseTitle})
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span><i className="fa-regular fa-clock"></i> {lesson.deadline || '23:59 Chủ Nhật'}</span>
                                <span>•</span>
                                <span>{lesson.questionsCount || 5} phần câu hỏi</span>
                              </div>
                            </div>
                          </div>

                          {/* Toggle Action Button */}
                          <div style={{ flexShrink: 0, marginLeft: '0.75rem' }}>
                            <button
                              type="button"
                              onClick={() => onToggleLesson && onToggleLesson(classroom.id, lesson.id)}
                              title={isUnlocked ? 'Bấm để KHÓA bài học này cho lớp' : 'Bấm để MỞ bài học này cho lớp'}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '0.5rem 0.95rem',
                                borderRadius: '10px',
                                border: isUnlocked ? '1.5px solid #86efac' : '1.5px solid #cbd5e1',
                                background: isUnlocked ? '#f0fdf4' : '#ffffff',
                                color: isUnlocked ? '#15803d' : '#64748b',
                                fontWeight: 800,
                                fontSize: '0.82rem',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <i className={`fa-solid ${isUnlocked ? 'fa-lock-open' : 'fa-lock'}`}></i>
                              <span>{isUnlocked ? 'Đang mở' : 'Chưa mở'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          style={{
            background: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            padding: '1rem 1.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            💡 Thay đổi trạng thái mở bài sẽ áp dụng ngay tức thì cho toàn bộ học viên trong lớp này.
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.65rem 1.4rem',
              borderRadius: '10px',
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            Hoàn Tất
          </button>
        </div>
      </div>
    </div>
  );
};
