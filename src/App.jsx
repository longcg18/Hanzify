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
import { ClassLessonManagerModal } from './components/ClassLessonManagerModal';
import { EditClassModal } from './components/EditClassModal';
import { LessonHomeworkEditorView } from './views/LessonHomeworkEditorView';
import { 
  fetchCoursesWithLessons,
  syncCourseToSupabase, 
  deleteCourseFromSupabase, 
  syncLessonToSupabase, 
  deleteLessonFromSupabase,
  fetchClassrooms,
  createClassroomInSupabase,
  updateClassroomInSupabase,
  updateClassroomUnlockedLessons,
  deleteClassroomFromSupabase,
  fetchExams,
  syncExamToSupabase,
  deleteExamFromSupabase,
  fetchUserStreak,
  checkInUser
} from './services/supabaseService';


const RequireLoginCard = ({ title, subtitle, onLogin, onBack }) => (
  <main className="main-content" style={{ padding: '3.5rem 1rem', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{
      maxWidth: '520px',
      width: '100%',
      background: '#ffffff',
      borderRadius: '24px',
      border: '1.5px solid #fee2e2',
      padding: '2.75rem 2rem',
      textAlign: 'center',
      boxShadow: '0 12px 35px rgba(161, 29, 36, 0.08)'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: '#fef2f2',
        color: '#b91c1c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.8rem',
        margin: '0 auto 1.25rem'
      }}>
        <i className="fa-solid fa-lock"></i>
      </div>
      <h2 style={{ color: '#0f172a', fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.6rem' }}>
        {title || 'Yêu Cầu Đăng Nhập'}
      </h2>
      <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
        {subtitle || 'Bạn cần đăng nhập vào tài khoản để tham gia làm bài và ghi nhận kết quả.'}
      </p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={onLogin}
          style={{
            padding: '0.75rem 1.6rem',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)',
            color: '#ffffff',
            border: 'none',
            fontWeight: 800,
            fontSize: '0.92rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 14px rgba(185, 28, 28, 0.25)'
          }}
        >
          <i className="fa-solid fa-arrow-right-to-bracket"></i>
          <span>Đăng Nhập Ngay</span>
        </button>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            style={{
              padding: '0.75rem 1.4rem',
              borderRadius: '12px',
              background: '#f1f5f9',
              color: '#475569',
              border: '1px solid #e2e8f0',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer'
            }}
          >
            Quay lại
          </button>
        )}
      </div>
    </div>
  </main>
);

const GuestPreviewNotice = ({ children, onLogin }) => (
  <div style={{ maxWidth: '1180px', margin: '1rem auto', padding: '0 1rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', padding: '0.85rem 1rem', borderRadius: '14px', background: '#fff7ed', border: '1px solid #fed7aa', color: '#9a3412' }}>
      <span style={{ fontSize: '0.86rem', fontWeight: 650 }}>
        <i className="fa-solid fa-eye" style={{ marginRight: '0.5rem' }}></i>
        {children}
      </span>
      <button type="button" onClick={onLogin} style={{ border: 0, borderRadius: '9px', padding: '0.5rem 0.9rem', background: '#A11D24', color: '#fff', fontWeight: 750, cursor: 'pointer' }}>
        Đăng nhập
      </button>
    </div>
  </div>
);

export function AppContent() {
  const {
    user,
    setIsAuthModalOpen,
    isCreateClassModalOpen,
    setIsCreateClassModalOpen,
    isJoinClassModalOpen,
    setIsJoinClassModalOpen
  } = useAuth();

  const getInitialView = () => {
    const rawPath = window.location.pathname.replace(/^\//, '').toLowerCase();
    const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
    const validViews = ['home', 'courses', 'course-detail', 'homework', 'practice', 'exam', 'entertainment', 'grading', 'admin-users', 'leaderboard', 'forum'];
    if (validViews.includes(rawPath)) return rawPath;
    if (validViews.includes(hash)) return hash;
    return 'home';
  };
  const [currentView, setCurrentView] = useState(getInitialView); // 'home' | 'courses' | 'course-detail' | 'homework' | 'practice' | 'exam' | 'exam-room' | 'entertainment' | 'grading' | 'admin-users' | 'leaderboard' | 'forum'

  useEffect(() => {
    const onPop = () => {
      const rawPath = window.location.pathname.replace(/^\//, '').toLowerCase() || 'home';
      setCurrentView(rawPath);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Classrooms state - Pure Supabase
  const [classrooms, setClassrooms] = useState([]);

  // Courses state - Pure Supabase
  const [courses, setCourses] = useState([]);

  // Exams state — Supabase là nguồn dữ liệu duy nhất
  const [exams, setExams] = useState([]);
  const [isExamsDbLive, setIsExamsDbLive] = useState(false);

  const [activeCourseId, setActiveCourseId] = useState(null);
  const activeCourse = courses.find((c) => c.id === activeCourseId) || courses[0] || null;

  const [activeLesson, setActiveLesson] = useState(null);
  const [activeExam, setActiveExam] = useState(null);
  const [managingClassroom, setManagingClassroom] = useState(null);
  const [editingClassroom, setEditingClassroom] = useState(null);

  // Load courses and classrooms directly from Supabase Cloud
  useEffect(() => {
    fetchCoursesWithLessons().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setCourses(data);
        setActiveCourseId((prev) => prev || data[0].id);
        if (data[0].lessons && data[0].lessons.length > 0) {
          setActiveLesson((prev) => prev || data[0].lessons[0]);
        }
      }
    });

    fetchClassrooms().then((data) => {
      if (Array.isArray(data)) {
        setClassrooms(data);
      }
    });
  }, []);

  // Load exams từ Supabase khi mount
  useEffect(() => {
    fetchExams().then(({ data, isLiveDb }) => {
      setExams(data || []);
      setIsExamsDbLive(Boolean(isLiveDb));
    });
  }, []);

  const [roleToast, setRoleToast] = useState(null);

  // Streak state with persistence
  const [streakData, setStreakData] = useState({ currentStreak: 0, longestStreak: 0, totalXp: 0, checkedInToday: false, weekDays: [] });
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);

  useEffect(() => {
    if (user?.id) fetchUserStreak(user.id).then(({ data }) => data && setStreakData(data));
  }, [user?.id]);

  // Handle daily streak check-in
  const handleCheckInToday = async () => {
    if (streakData.checkedInToday) return;
    const result = await checkInUser(user?.id);
    if (!result.success) { setRoleToast(result.error); return; }
    const updated = result.data;
    setStreakData(updated);
    setRoleToast(`🔥 Điểm danh thành công! Chuỗi học tăng lên ${updated.currentStreak} ngày liên tiếp (+50 XP)`);
    setTimeout(() => {
      setRoleToast(null);
    }, 4500);
  };

  // Handlers for Exams CRUD — chỉ cập nhật UI sau khi Supabase thành công
  const handleCreateExam = async (newExam) => {
    const result = await syncExamToSupabase(newExam);
    if (!result.success) { setRoleToast('Không thể lưu đề thi lên Supabase.'); return; }
    setExams((prev) => [newExam, ...prev]);
    setIsExamsDbLive(true);
  };

  const handleEditExam = async (updatedExam) => {
    const result = await syncExamToSupabase(updatedExam);
    if (!result.success) { setRoleToast('Không thể cập nhật đề thi trên Supabase.'); return; }
    setExams((prev) => prev.map((e) => (e.id === updatedExam.id ? updatedExam : e)));
    if (activeExam?.id === updatedExam.id) {
      setActiveExam(updatedExam);
    }
    setIsExamsDbLive(true);
  };

  const handleDeleteExam = async (examId) => {
    const result = await deleteExamFromSupabase(examId);
    if (!result.success) { setRoleToast('Không thể xóa đề thi trên Supabase.'); return; }
    setExams((prev) => prev.filter((e) => e.id !== examId));
    if (activeExam?.id === examId) {
      setActiveExam(null);
      setCurrentView('exam');
    }
  };


  // Handlers for Courses CRUD (Cô Hoài & Admin on Supabase)
  const handleCreateCourse = async (newCourse) => {
    const result = await syncCourseToSupabase(newCourse);
    if (!result.success) { setRoleToast('Không thể tạo khóa học trên Supabase.'); return; }
    setCourses((prev) => [newCourse, ...prev]);
    setActiveCourseId(newCourse.id);
  };

  const handleEditCourse = async (updatedCourse) => {
    const result = await syncCourseToSupabase(updatedCourse);
    if (!result.success) { setRoleToast('Không thể cập nhật khóa học trên Supabase.'); return; }
    setCourses((prev) => prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c)));
  };

  const handleDeleteCourse = async (courseId) => {
    const result = await deleteCourseFromSupabase(courseId);
    if (!result.success) { setRoleToast('Không thể xóa khóa học trên Supabase.'); return; }
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    if (activeCourseId === courseId) {
      setActiveCourseId(courses[0]?.id);
      setCurrentView('courses');
    }
  };

  // Handlers for Lessons in Course (Cô Hoài & Admin on Supabase)
  const handleAddLesson = async (courseId, newLesson) => {
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
    await syncLessonToSupabase(newLesson, courseId);
  };

  const handleDeleteLesson = async (courseId, lessonId) => {
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
    await deleteLessonFromSupabase(lessonId);
  };

  // Handlers for Unlocking Lessons per Classroom (Theo Lớp Học)
  const handleToggleClassLesson = async (classId, lessonId) => {
    let updatedClass = null;
    setClassrooms((prev) =>
      prev.map((c) => {
        if (c.id === classId) {
          const currentUnlocked = new Set(c.unlockedLessons || []);
          if (currentUnlocked.has(lessonId)) {
            currentUnlocked.delete(lessonId);
          } else {
            currentUnlocked.add(lessonId);
          }
          updatedClass = {
            ...c,
            unlockedLessons: Array.from(currentUnlocked)
          };
          return updatedClass;
        }
        return c;
      })
    );

    if (updatedClass) {
      if (managingClassroom?.id === classId) {
        setManagingClassroom(updatedClass);
      }
      await updateClassroomUnlockedLessons(classId, updatedClass.unlockedLessons);
      const isNowOpen = updatedClass.unlockedLessons.includes(lessonId);
      setRoleToast(
        isNowOpen
          ? `🟢 Đã mở bài học cho lớp "${updatedClass.name}" (Học sinh lớp này có thể làm bài)`
          : `🔒 Đã khóa bài học đối với lớp "${updatedClass.name}"`
      );
      setTimeout(() => setRoleToast(null), 3500);
    }
  };

  const handleUnlockAllClassLessons = async (classId, allLessonIds) => {
    let updatedClass = null;
    setClassrooms((prev) =>
      prev.map((c) => {
        if (c.id === classId) {
          updatedClass = {
            ...c,
            unlockedLessons: allLessonIds
          };
          return updatedClass;
        }
        return c;
      })
    );

    if (updatedClass) {
      if (managingClassroom?.id === classId) {
        setManagingClassroom(updatedClass);
      }
      await updateClassroomUnlockedLessons(classId, allLessonIds);
      setRoleToast(`🟢 Đã mở toàn bộ ${allLessonIds.length} bài học cho lớp "${updatedClass.name}"!`);
      setTimeout(() => setRoleToast(null), 3500);
    }
  };

  const handleLockAllClassLessons = async (classId) => {
    let updatedClass = null;
    setClassrooms((prev) =>
      prev.map((c) => {
        if (c.id === classId) {
          updatedClass = {
            ...c,
            unlockedLessons: []
          };
          return updatedClass;
        }
        return c;
      })
    );

    if (updatedClass) {
      if (managingClassroom?.id === classId) {
        setManagingClassroom(updatedClass);
      }
      await updateClassroomUnlockedLessons(classId, []);
      setRoleToast(`🔒 Đã khóa toàn bộ bài học đối với lớp "${updatedClass.name}"!`);
      setTimeout(() => setRoleToast(null), 3500);
    }
  };

  const handleDeleteClassroom = async (classId) => {
    const res = await deleteClassroomFromSupabase(classId);
    if (!res.success) {
      setRoleToast('Không thể xóa lớp học trên Supabase.');
      return;
    }
    setClassrooms((prev) => prev.filter((c) => c.id !== classId));
    setRoleToast('Đã xóa lớp học thành công.');
    setTimeout(() => setRoleToast(null), 3000);
  };

  const handleEditClassroom = async (updatedClass) => {
    const res = await updateClassroomInSupabase(updatedClass);
    if (!res.success) {
      setRoleToast('Không thể cập nhật thông tin lớp học trên Supabase.');
      return;
    }
    setClassrooms((prev) =>
      prev.map((c) => (c.id === updatedClass.id ? updatedClass : c))
    );
    if (managingClassroom?.id === updatedClass.id) {
      setManagingClassroom(updatedClass);
    }
    setRoleToast(`Đã cập nhật thông tin lớp "${updatedClass.name}" thành công!`);
    setTimeout(() => setRoleToast(null), 3500);
  };

  const handleUpdateLesson = async (courseId, updatedLesson) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const updatedLessons = (c.lessons || []).map((l) =>
            l.id === updatedLesson.id ? updatedLesson : l
          );
          return {
            ...c,
            lessons: updatedLessons
          };
        }
        return c;
      })
    );
    await syncLessonToSupabase(updatedLesson, courseId);
    setRoleToast(`Đã lưu thông tin bài học "${updatedLesson.title}" thành công!`);
    setTimeout(() => setRoleToast(null), 3500);
  };

  // Role Switch Handler with Smart Auto-Redirection
  const handleRoleSwitched = (newRole) => {
    let roleLabel = 'Học Viên';
    if (newRole === 'admin') roleLabel = '👑 Quản Trị Viên (Admin)';
    if (newRole === 'teacher') roleLabel = '👩‍🏫 Giáo Viên Phụ Trách';

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

  // Guests may browse public previews, but private/detail views still require login.
  useEffect(() => {
    const guestPreviewViews = ['home', 'courses', 'practice', 'exam', 'entertainment'];
    if (!user && !guestPreviewViews.includes(currentView)) {
      setCurrentView('home');
      setIsAuthModalOpen(true);
      setRoleToast('Vui lòng đăng nhập để truy cập các khóa học và nội dung bên trong!');
      setTimeout(() => setRoleToast(null), 4000);
      return;
    }
    if (user && currentView === 'admin-users' && user.role !== 'admin') {
      setCurrentView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (user && currentView === 'grading' && user.role !== 'teacher') {
      setCurrentView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [user, user?.role, currentView]);

  const handleNavigate = (view) => {
    const guestPreviewViews = ['home', 'courses', 'practice', 'exam', 'entertainment'];
    if (!user && !guestPreviewViews.includes(view)) {
      setIsAuthModalOpen(true);
      setRoleToast('Vui lòng đăng nhập để truy cập tính năng này!');
      setTimeout(() => setRoleToast(null), 4000);
      return;
    }
    setCurrentView(view);
    window.history.pushState(null, '', `/${view === 'home' ? '' : view}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCourse = (course) => {
    if (!user) {
      setIsAuthModalOpen(true);
      setRoleToast('Vui lòng đăng nhập để truy cập khóa học và làm bài tập!');
      setTimeout(() => setRoleToast(null), 4000);
      return;
    }
    setActiveCourseId(course.id);
    setCurrentView('course-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLesson = (lesson) => {
    if (!user) {
      setIsAuthModalOpen(true);
      setRoleToast('Vui lòng đăng nhập để làm bài tập và ghi nhận tiến độ học tập!');
      setTimeout(() => setRoleToast(null), 4000);
      return;
    }
    setActiveLesson(lesson);
    setCurrentView('homework');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartExam = (exam) => {
    if (!user) {
      setIsAuthModalOpen(true);
      setRoleToast('Vui lòng đăng nhập để vào phòng thi thử HSK!');
      setTimeout(() => setRoleToast(null), 4000);
      return;
    }
    setActiveExam(exam);
    setCurrentView('exam-room');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenStreakModal = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      setRoleToast('Vui lòng đăng nhập để theo dõi chuỗi ngày học và điểm danh!');
      setTimeout(() => setRoleToast(null), 4000);
      return;
    }
    setIsStreakModalOpen(true);
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
  const handleCreateClass = async (newClass) => {
    const result = await createClassroomInSupabase(newClass);
    if (!result.success) { setRoleToast('Không thể tạo lớp trên Supabase.'); return; }
    setClassrooms((prev) => [newClass, ...prev]);
    setRoleToast(`Đã mở lớp "${newClass.name}" thành công trên Supabase! Mã lớp: ${newClass.code}`);
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
        onNavigate={handleNavigate}
        activeCourse={activeCourse}
        onBack={handleBack}
        onRoleSwitched={handleRoleSwitched}
        streakData={streakData}
        onOpenStreakModal={handleOpenStreakModal}
      />

      {/* Main View Switcher */}
      {currentView === 'home' && (
        <HomeView
          courses={courses}
          classrooms={classrooms}
          onOpenCreateClass={() => setIsCreateClassModalOpen(true)}
          onOpenJoinClass={() => setIsJoinClassModalOpen(true)}
          onOpenClassLessonManager={(cls) => setManagingClassroom(cls)}
          onOpenEditClass={(cls) => setEditingClassroom(cls)}
          onDeleteClassroom={handleDeleteClassroom}
          streakData={streakData}
          onOpenStreakModal={handleOpenStreakModal}
          onNavigate={handleNavigate}
          onSelectCourse={handleSelectCourse}
          onOpenLesson={handleOpenLesson}
        />
      )}

      {currentView === 'courses' && (
        <>
          {!user && (
            <GuestPreviewNotice onLogin={() => setIsAuthModalOpen(true)}>
              Bạn đang xem trước danh sách khóa học. Đăng nhập để mở nội dung bài học và tham gia lớp.
            </GuestPreviewNotice>
          )}
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
            onOpenStreakModal={handleOpenStreakModal}
            onNavigate={handleNavigate}
          />
        </>
      )}

      {currentView === 'course-detail' && (
        user ? (
          <CourseDetailView
            course={activeCourse}
            classrooms={classrooms}
            onOpenLesson={handleOpenLesson}
            onOpenHomeworkEditor={(lesson) => {
              if (!['admin', 'teacher'].includes(user?.role)) {
                setIsAuthModalOpen(true);
                return;
              }
              setActiveLesson(lesson);
              setCurrentView('homework-editor');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBack={() => setCurrentView('courses')}
            onAddLesson={handleAddLesson}
            onDeleteLesson={handleDeleteLesson}
            onEditCourse={handleEditCourse}
            onDeleteCourse={handleDeleteCourse}
            onOpenClassLessonManager={(cls) => setManagingClassroom(cls)}
            onUpdateLesson={handleUpdateLesson}
          />
        ) : (
          <RequireLoginCard
            title="Yêu Cầu Đăng Nhập"
            subtitle="Vui lòng đăng nhập vào tài khoản để xem chi tiết lộ trình bài học và làm bài tập."
            onLogin={() => setIsAuthModalOpen(true)}
            onBack={() => setCurrentView('home')}
          />
        )
      )}

      {currentView === 'homework-editor' && (
        ['admin', 'teacher'].includes(user?.role) ? (
          <LessonHomeworkEditorView
            lesson={activeLesson}
            course={activeCourse}
            onBack={() => {
              // refresh courses so question count updates
              fetchCoursesWithLessons().then((data) => {
                if (Array.isArray(data) && data.length > 0) setCourses(data);
              });
              setCurrentView('course-detail');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : (
          <RequireLoginCard
            title="Quyền Hạn Bị Giới Hạn"
            subtitle="Trình biên soạn bài tập chỉ dành riêng cho Giáo viên và Quản trị viên."
            onLogin={() => setIsAuthModalOpen(true)}
            onBack={() => setCurrentView('home')}
          />
        )
      )}

      {currentView === 'homework' && (
        user ? (
          <HomeworkView
            lesson={activeLesson}
            onBack={() => setCurrentView('course-detail')}
          />
        ) : (
          <RequireLoginCard
            title="Yêu Cầu Đăng Nhập Để Làm Bài Tập"
            subtitle="Bạn cần đăng nhập vào tài khoản để mở không gian làm bài tập, chấm điểm tự động và nộp bài cho giáo viên."
            onLogin={() => setIsAuthModalOpen(true)}
            onBack={() => setCurrentView('home')}
          />
        )
      )}

      {currentView === 'practice' && (
        <>
          {!user && (
            <GuestPreviewNotice onLogin={() => setIsAuthModalOpen(true)}>
              Đây là bản xem trước khu luyện tập. Đăng nhập để chọn đáp án, nghe bài và ghi nhận kết quả.
            </GuestPreviewNotice>
          )}
          <PracticeView />
        </>
      )}

      {currentView === 'exam' && (
        <>
          {!user && (
            <GuestPreviewNotice onLogin={() => setIsAuthModalOpen(true)}>
              Bạn có thể xem kho đề thi. Đăng nhập khi muốn bắt đầu làm bài và lưu điểm.
            </GuestPreviewNotice>
          )}
          <ExamView 
            exams={exams}
            isDbLive={isExamsDbLive}
            onStartExam={handleStartExam} 
            onCreateExam={handleCreateExam}
            onEditExam={handleEditExam}
            onDeleteExam={handleDeleteExam}
          />
        </>
      )}

      {currentView === 'exam-room' && (
        user ? (
          <ExamRoomView exam={activeExam} onExit={() => setCurrentView('exam')} />
        ) : (
          <RequireLoginCard
            title="Yêu Cầu Đăng Nhập Để Vào Phòng Thi"
            subtitle="Bạn cần đăng nhập vào tài khoản để vào phòng thi chuẩn HSK, làm bài có bấm giờ và lưu bảng điểm."
            onLogin={() => setIsAuthModalOpen(true)}
            onBack={() => setCurrentView('home')}
          />
        )
      )}

      {currentView === 'leaderboard' && (
        user ? (
          <LeaderboardView classrooms={classrooms} onNavigate={handleNavigate} />
        ) : (
          <RequireLoginCard
            title="Yêu Cầu Đăng Nhập Để Xem Bảng Xếp Hạng"
            subtitle="Bạn cần đăng nhập vào tài khoản để theo dõi xếp hạng thi đua tuần và điểm số của lớp."
            onLogin={() => setIsAuthModalOpen(true)}
            onBack={() => setCurrentView('home')}
          />
        )
      )}

      {currentView === 'forum' && (
        user ? (
          <ForumView />
        ) : (
          <RequireLoginCard
            title="Yêu Cầu Đăng Nhập Để Vào Diễn Đàn"
            subtitle="Bạn cần đăng nhập vào tài khoản để tham gia hỏi đáp bài khó, thảo luận cùng bạn bè và giáo viên."
            onLogin={() => setIsAuthModalOpen(true)}
            onBack={() => setCurrentView('home')}
          />
        )
      )}

      {currentView === 'entertainment' && (
        <>
          {!user && (
            <GuestPreviewNotice onLogin={() => setIsAuthModalOpen(true)}>
              Chế độ chơi thử: bạn có thể chơi đầy đủ, nhưng điểm, XP và thành tích sẽ không được lưu.
            </GuestPreviewNotice>
          )}
          <EntertainmentView />
        </>
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
                onClick={() => setCurrentView('home')}
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
                Quay Về Trang Chủ
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
                onClick={() => setCurrentView('home')}
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
                Quay Về Trang Chủ
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

      {/* Class Lesson Unlock Manager Modal */}
      <ClassLessonManagerModal
        isOpen={Boolean(managingClassroom)}
        onClose={() => setManagingClassroom(null)}
        classroom={managingClassroom}
        courses={courses}
        onToggleLesson={handleToggleClassLesson}
        onUnlockAll={handleUnlockAllClassLessons}
        onLockAll={handleLockAllClassLessons}
      />

      {/* Classroom Edit Modal (Cô Hoài / Admin) */}
      <EditClassModal
        isOpen={Boolean(editingClassroom)}
        onClose={() => setEditingClassroom(null)}
        classroom={editingClassroom}
        courses={courses}
        onSaveSuccess={handleEditClassroom}
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
