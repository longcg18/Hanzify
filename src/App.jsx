import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { HomeView } from './views/HomeView';
import { CoursesView } from './views/CoursesView';
import { CourseDetailView } from './views/CourseDetailView';
import { HomeworkView } from './views/HomeworkView';
import { PracticeView } from './views/PracticeView';
import { EntertainmentView } from './views/EntertainmentView';
import { ExamView } from './views/ExamView';
import { ExamRoomView } from './views/ExamRoomView';
import { TeacherGradingView } from './views/TeacherGradingView';
import { AdminUsersView } from './views/AdminUsersView';
import { LeaderboardView } from './views/LeaderboardView';
import { ForumView } from './views/ForumView';
import { StreakModal } from './components/StreakModal';
import { CreateClassModal } from './components/CreateClassModal';
import { JoinClassModal } from './components/JoinClassModal';
import { COURSES_DATA } from './data/coursesData';
import { INITIAL_EXAMS_DATA } from './data/examsData';
import { INITIAL_STREAK_DATA } from './data/gamificationData';
import { INITIAL_CLASSROOMS } from './data/classroomsData';
import { 
  syncCourseToSupabase, 
  deleteCourseFromSupabase, 
  syncLessonToSupabase, 
  deleteLessonFromSupabase,
  fetchExams,
  syncExamToSupabase,
  deleteExamFromSupabase
} from './services/supabaseService';


export function AppContent() {
  const {
    user,
    isCreateClassModalOpen,
    setIsCreateClassModalOpen,
    isJoinClassModalOpen,
    setIsJoinClassModalOpen
  } = useAuth();
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'courses' | 'course-detail' | 'homework' | 'practice' | 'exam' | 'exam-room' | 'entertainment' | 'grading' | 'admin-users' | 'leaderboard' | 'forum'

  // Classrooms state with localStorage persistence
  const [classrooms, setClassrooms] = useState(() => {
    const saved = localStorage.getItem('hanzify_classrooms');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_CLASSROOMS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('hanzify_classrooms', JSON.stringify(classrooms));
    } catch (e) {}
  }, [classrooms]);

  // Courses state with localStorage persistence
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('hanzify_courses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return COURSES_DATA;
  });

  // Exams state — ưu tiên Supabase DB, fallback localStorage
  const [exams, setExams] = useState(() => {
    const saved = localStorage.getItem('hanzify_exams');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_EXAMS_DATA;
  });
  const [isExamsDbLive, setIsExamsDbLive] = useState(false);

  // Load exams từ Supabase khi mount (ghi đè localStorage nếu DB có data)
  useEffect(() => {
    fetchExams().then(({ data, isLiveDb }) => {
      if (isLiveDb && data && data.length > 0) {
        setExams(data);
        setIsExamsDbLive(true);
        try {
          localStorage.setItem('hanzify_exams', JSON.stringify(data));
        } catch (e) {}
      }
    });
  }, []);

  // Save courses changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hanzify_courses', JSON.stringify(courses));
    } catch (e) {}
  }, [courses]);

  // Save exams changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hanzify_exams', JSON.stringify(exams));
    } catch (e) {}
  }, [exams]);


  const [activeCourseId, setActiveCourseId] = useState(() => COURSES_DATA[0].id);
  const activeCourse = courses.find((c) => c.id === activeCourseId) || courses[0] || COURSES_DATA[0];

  const [activeLesson, setActiveLesson] = useState(() => activeCourse?.lessons?.[3] || activeCourse?.lessons?.[0]); // Lesson default
  const [activeExam, setActiveExam] = useState(null);
  const [roleToast, setRoleToast] = useState(null);

  // Streak state with persistence
  const [streakData, setStreakData] = useState(() => {
    const saved = localStorage.getItem('hanzify_streak_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.currentStreak === 'number') return parsed;
      } catch (e) {}
    }
    return INITIAL_STREAK_DATA;
  });
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('hanzify_streak_data', JSON.stringify(streakData));
    } catch (e) {}
  }, [streakData]);

  // Handle daily streak check-in
  const handleCheckInToday = () => {
    if (streakData.checkedInToday) return;

    const todayIndex = 4; // Thứ 6
    const updatedWeekDays = streakData.weekDays.map((d, idx) =>
      idx === todayIndex ? { ...d, completed: true } : d
    );

    const updated = {
      ...streakData,
      currentStreak: streakData.currentStreak + 1,
      checkedInToday: true,
      totalXp: (streakData.totalXp || 5420) + 50,
      weekDays: updatedWeekDays
    };

    setStreakData(updated);
    setRoleToast(`🔥 Điểm danh thành công! Chuỗi học tăng lên ${updated.currentStreak} ngày liên tiếp (+50 XP)`);
    setTimeout(() => {
      setRoleToast(null);
    }, 4500);
  };

  // Handlers for Exams CRUD — sync cả localStorage lẫn Supabase
  const handleCreateExam = (newExam) => {
    setExams((prev) => [newExam, ...prev]);
    syncExamToSupabase(newExam).then(({ isLiveDb }) => {
      if (isLiveDb) setIsExamsDbLive(true);
    });
  };

  const handleEditExam = (updatedExam) => {
    setExams((prev) => prev.map((e) => (e.id === updatedExam.id ? updatedExam : e)));
    if (activeExam?.id === updatedExam.id) {
      setActiveExam(updatedExam);
    }
    syncExamToSupabase(updatedExam).then(({ isLiveDb }) => {
      if (isLiveDb) setIsExamsDbLive(true);
    });
  };

  const handleDeleteExam = (examId) => {
    setExams((prev) => prev.filter((e) => e.id !== examId));
    if (activeExam?.id === examId) {
      setActiveExam(null);
      setCurrentView('exam');
    }
    deleteExamFromSupabase(examId);
  };


  // Handlers for Courses CRUD (Cô Hoài & Admin)
  const handleCreateCourse = (newCourse) => {
    setCourses((prev) => [newCourse, ...prev]);
    setActiveCourseId(newCourse.id);
    syncCourseToSupabase(newCourse);
  };

  const handleEditCourse = (updatedCourse) => {
    setCourses((prev) => prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c)));
    syncCourseToSupabase(updatedCourse);
  };

  const handleDeleteCourse = (courseId) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    if (activeCourseId === courseId) {
      setActiveCourseId(courses[0]?.id);
      setCurrentView('courses');
    }
    deleteCourseFromSupabase(courseId);
  };

  // Handlers for Lessons in Course (Cô Hoài & Admin)
  const handleAddLesson = (courseId, newLesson) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const updatedLessons = [...(c.lessons || []), newLesson];
          return {
            ...c,
            totalLessons: updatedLessons.length,
            lessons: updatedLessons
          };
        }
        return c;
      })
    );
    syncLessonToSupabase(newLesson, courseId);
  };

  const handleDeleteLesson = (courseId, lessonId) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const updatedLessons = (c.lessons || []).filter((l) => l.id !== lessonId);
          return {
            ...c,
            totalLessons: updatedLessons.length,
            lessons: updatedLessons
          };
        }
        return c;
      })
    );
    deleteLessonFromSupabase(lessonId);
  };

  // Role Switch Handler with Smart Auto-Redirection
  const handleRoleSwitched = (newRole) => {
    let roleLabel = 'Học Viên (Nguyễn Văn An)';
    if (newRole === 'admin') roleLabel = '👑 Admin (Nguyễn Phúc Long)';
    if (newRole === 'teacher') roleLabel = '👩‍🏫 Giáo Viên (Cô Hoài)';

    let redirectNote = '';
    // If on admin-users and new role is not admin, redirect immediately to courses
    if (currentView === 'admin-users' && newRole !== 'admin') {
      setCurrentView('courses');
      redirectNote = ' • Tự động chuyển về trang Khóa Học vì không đủ quyền Quản Trị';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentView === 'grading' && newRole !== 'teacher') {
      setCurrentView('courses');
      redirectNote = ' • Tự động chuyển về trang Khóa Học vì chỉ dành cho Giáo Viên';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setRoleToast(`Đã chuyển sang ${roleLabel}${redirectNote}`);
    setTimeout(() => {
      setRoleToast(null);
    }, 4500);
  };

  // Route Guard: Ensure unauthorized users never stay in admin-users or grading
  useEffect(() => {
    if (!user) return;
    if (currentView === 'admin-users' && user.role !== 'admin') {
      setCurrentView('courses');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentView === 'grading' && user.role !== 'teacher') {
      setCurrentView('courses');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [user?.role, currentView]);

  const handleSelectCourse = (course) => {
    setActiveCourseId(course.id);
    setCurrentView('course-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLesson = (lesson) => {
    setActiveLesson(lesson);
    setCurrentView('homework');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartExam = (exam) => {
    setActiveExam(exam);
    setCurrentView('exam-room');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (currentView === 'homework') {
      setCurrentView('course-detail');
    } else if (currentView === 'course-detail') {
      setCurrentView('courses');
    } else if (currentView === 'exam-room') {
      setCurrentView('exam');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle New Class Creation
  const handleCreateClass = (newClass) => {
    setClassrooms((prev) => [newClass, ...prev]);
    setRoleToast(`Đã mở lớp "${newClass.name}" thành công! Mã lớp: ${newClass.code}`);
    setTimeout(() => setRoleToast(null), 6000);
  };

  // Handle Student Activation when joining via code
  const handleStudentActivated = ({ classId, studentId, username }) => {
    setClassrooms((prev) =>
      prev.map((c) => {
        if (c.id === classId) {
          return {
            ...c,
            students: c.students.map((st) =>
              st.id === studentId
                ? { ...st, isActivated: true, username: username, activatedAt: new Date().toISOString() }
                : st
            )
          };
        }
        return c;
      })
    );
    setRoleToast(`Kích hoạt tài khoản @${username} thành công! Toàn bộ khóa học của lớp đã mở.`);
    setTimeout(() => setRoleToast(null), 5000);
  };

  return (
    <div className="app-shell">
      {/* Decorative Ambient Glow Orbs */}
      <div className="ambient-glow glow-1"></div>
      <div className="ambient-glow glow-2"></div>

      {/* Top Bar Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activeCourse={activeCourse}
        onBack={handleBack}
        onRoleSwitched={handleRoleSwitched}
        streakData={streakData}
        onOpenStreakModal={() => setIsStreakModalOpen(true)}
      />

      {/* Main View Switcher */}
      {currentView === 'home' && (
        <HomeView
          courses={courses}
          classrooms={classrooms}
          onOpenCreateClass={() => setIsCreateClassModalOpen(true)}
          onOpenJoinClass={() => setIsJoinClassModalOpen(true)}
          streakData={streakData}
          onOpenStreakModal={() => setIsStreakModalOpen(true)}
          onNavigate={(view) => {
            setCurrentView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSelectCourse={handleSelectCourse}
          onOpenLesson={handleOpenLesson}
        />
      )}

      {currentView === 'courses' && (
        <CoursesView 
          courses={courses}
          classrooms={classrooms}
          onOpenCreateClass={() => setIsCreateClassModalOpen(true)}
          onOpenJoinClass={() => setIsJoinClassModalOpen(true)}
          onSelectCourse={handleSelectCourse} 
          onCreateCourse={handleCreateCourse}
          onEditCourse={handleEditCourse}
          onDeleteCourse={handleDeleteCourse}
          streakData={streakData}
          onOpenStreakModal={() => setIsStreakModalOpen(true)}
          onNavigate={(view) => {
            setCurrentView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {currentView === 'course-detail' && (
        <CourseDetailView
          course={activeCourse}
          onOpenLesson={handleOpenLesson}
          onBack={() => setCurrentView('courses')}
          onAddLesson={handleAddLesson}
          onDeleteLesson={handleDeleteLesson}
          onEditCourse={handleEditCourse}
          onDeleteCourse={handleDeleteCourse}
        />
      )}

      {currentView === 'homework' && (
        <HomeworkView
          lesson={activeLesson}
          onBack={() => setCurrentView('course-detail')}
        />
      )}

      {currentView === 'practice' && (
        <PracticeView />
      )}

      {currentView === 'exam' && (
        <ExamView 
          exams={exams}
          isDbLive={isExamsDbLive}
          onStartExam={handleStartExam} 
          onCreateExam={handleCreateExam}
          onEditExam={handleEditExam}
          onDeleteExam={handleDeleteExam}
        />
      )}

      {currentView === 'exam-room' && (
        <ExamRoomView exam={activeExam} onExit={() => setCurrentView('exam')} />
      )}

      {currentView === 'leaderboard' && (
        <LeaderboardView onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} />
      )}

      {currentView === 'forum' && (
        <ForumView />
      )}

      {currentView === 'entertainment' && (
        <EntertainmentView />
      )}

      {currentView === 'grading' && (
        user?.role === 'teacher' ? (
          <TeacherGradingView />
        ) : (
          <main className="main-content" style={{ padding: '3rem 1rem' }}>
            <div style={{
              maxWidth: '560px',
              margin: '2rem auto',
              padding: '2.5rem',
              background: '#ffffff',
              borderRadius: '24px',
              border: '1.5px solid #fee2e2',
              textAlign: 'center',
              boxShadow: '0 12px 35px rgba(161, 29, 36, 0.08)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👩‍🏫</div>
              <h2 style={{ color: '#A11D24', marginBottom: '0.5rem', fontSize: '1.35rem' }}>
                Quyền Truy Cập Bị Hạn Chế
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.92rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Bàn Chấm Bài chỉ dành riêng cho Giáo viên phụ trách (Cô Hoài).
              </p>
              <button
                type="button"
                onClick={() => setCurrentView('courses')}
                style={{
                  background: 'linear-gradient(135deg, #A11D24 0%, #7f1d1d 100%)',
                  color: '#fff',
                  border: 'none',
                  padding: '0.75rem 1.6rem',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(161, 29, 36, 0.25)'
                }}
              >
                Quay Về Trang Khóa Học
              </button>
            </div>
          </main>
        )
      )}

      {currentView === 'admin-users' && (
        user?.role === 'admin' ? (
          <AdminUsersView />
        ) : (
          <main className="main-content" style={{ padding: '3rem 1rem' }}>
            <div style={{
              maxWidth: '560px',
              margin: '2rem auto',
              padding: '2.5rem',
              background: '#ffffff',
              borderRadius: '24px',
              border: '1.5px solid #fee2e2',
              textAlign: 'center',
              boxShadow: '0 12px 35px rgba(161, 29, 36, 0.08)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
              <h2 style={{ color: '#A11D24', marginBottom: '0.5rem', fontSize: '1.35rem' }}>
                Quyền Truy Cập Bị Hạn Chế
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.92rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Trang <strong>Quản Trị</strong> chỉ dành riêng cho tài khoản Quản trị viên (Admin). Bạn hiện đang xem với vai trò <strong>{user?.role === 'teacher' ? 'Giáo Viên (Teacher)' : 'Học Viên (Student)'}</strong>.
              </p>
              <button
                type="button"
                onClick={() => setCurrentView('courses')}
                style={{
                  background: 'linear-gradient(135deg, #A11D24 0%, #7f1d1d 100%)',
                  color: '#fff',
                  border: 'none',
                  padding: '0.75rem 1.6rem',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(161, 29, 36, 0.25)'
                }}
              >
                Quay Về Trang Khóa Học
              </button>
            </div>
          </main>
        )
      )}

      {/* Floating Role Switch & Route Guard Toast Notification */}
      {roleToast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          background: '#0f172a',
          color: '#ffffff',
          padding: '0.85rem 1.35rem',
          borderRadius: '16px',
          boxShadow: '0 12px 35px rgba(0, 0, 0, 0.28)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          fontSize: '0.88rem',
          fontWeight: 600,
          maxWidth: '520px',
          lineHeight: 1.4
        }}>
          <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>🔄</span>
          <span style={{ flex: 1 }}>{roleToast}</span>
          <button
            type="button"
            onClick={() => setRoleToast(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              marginLeft: '0.4rem',
              fontSize: '1.1rem',
              lineHeight: 1
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Daily Streak Modal */}
      <StreakModal
        isOpen={isStreakModalOpen}
        onClose={() => setIsStreakModalOpen(false)}
        streakData={streakData}
        onCheckInToday={handleCheckInToday}
      />

      {/* Classroom Creation Modal (Cô Hoài / Admin) */}
      <CreateClassModal
        isOpen={isCreateClassModalOpen}
        onClose={() => setIsCreateClassModalOpen(false)}
        courses={courses}
        existingClassrooms={classrooms}
        onCreateSuccess={handleCreateClass}
      />

      {/* Student Classroom Join & Activation Modal */}
      <JoinClassModal
        isOpen={isJoinClassModalOpen}
        onClose={() => setIsJoinClassModalOpen(false)}
        classrooms={classrooms}
        courses={courses}
        onStudentActivated={handleStudentActivated}
      />

      {/* Global Auth Modal */}
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
