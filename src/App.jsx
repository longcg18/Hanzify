import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { CoursesView } from './views/CoursesView';
import { CourseDetailView } from './views/CourseDetailView';
import { HomeworkView } from './views/HomeworkView';
import { COURSES_DATA } from './data/coursesData';

export function AppContent() {
  const [currentView, setCurrentView] = useState('courses'); // 'courses' | 'course-detail' | 'homework'
  const [activeCourse, setActiveCourse] = useState(COURSES_DATA[0]);
  const [activeLesson, setActiveLesson] = useState(COURSES_DATA[0].lessons[3]); // Lesson 4 default

  const handleSelectCourse = (course) => {
    setActiveCourse(course);
    setCurrentView('course-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLesson = (lesson) => {
    setActiveLesson(lesson);
    setCurrentView('homework');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (currentView === 'homework') {
      setCurrentView('course-detail');
    } else if (currentView === 'course-detail') {
      setCurrentView('courses');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-shell">
      {/* Decorative Ambient Glow Orbs */}
      <div className="ambient-glow glow-1"></div>
      <div className="ambient-glow glow-2"></div>

      {/* Top Bar Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        activeCourse={activeCourse}
        onBack={handleBack}
      />

      {/* View Switcher */}
      {currentView === 'courses' && (
        <CoursesView onSelectCourse={handleSelectCourse} />
      )}

      {currentView === 'course-detail' && (
        <CourseDetailView
          course={activeCourse}
          onOpenLesson={handleOpenLesson}
          onBack={() => setCurrentView('courses')}
        />
      )}

      {currentView === 'homework' && (
        <HomeworkView
          lesson={activeLesson}
          onBack={() => setCurrentView('course-detail')}
        />
      )}

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
