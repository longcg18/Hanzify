import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const PRESET_USERS = {
  admin: {
    id: 'user-admin',
    name: 'Nguyễn Phúc Long (Admin)',
    email: 'admin@hanzify.com',
    phone: '0901 234 567',
    role: 'admin',
    avatar: '👑',
    chineseName: '龙老师',
    badge: 'Quản trị viên tối cao',
    joinedDate: 'Tháng 9/2026'
  },
  teacher: {
    id: 'user-teacher',
    name: 'Cô Hoài',
    email: 'hoailaoshi@hanzify.com',
    phone: '0987 654 321',
    role: 'teacher',
    avatar: '怀',
    chineseName: '怀老师',
    badge: 'Giáo viên phụ trách',
    joinedDate: 'Năm 2024'
  },
  student: {
    id: 'user-student-1',
    name: 'Nguyễn Văn An',
    email: 'student@hanzify.com',
    phone: '0911 223 344',
    role: 'student',
    avatar: '安',
    chineseName: '阮文安',
    badge: 'Học viên HSK 2',
    joinedDate: 'Tháng 8/2026'
  }
};

const INITIAL_REGISTERED_USERS = [
  {
    id: 'user-student-1',
    username: 'student',
    password: '123',
    name: 'Nguyễn Văn An',
    email: 'student@hanzify.com',
    phone: '0911 223 344',
    role: 'student',
    avatar: '安',
    chineseName: '阮文安',
    badge: 'Học viên HSK 2',
    classId: 'class-hsk2-k01',
    className: 'Lớp HSK 2 Cấp Tốc - Khóa K01',
    enrolledCourses: ['hsk2'],
    joinedDate: 'Tháng 8/2026'
  },
  {
    id: 'user-teacher',
    username: 'hoailaoshi',
    password: '123',
    name: 'Cô Hoài',
    email: 'hoailaoshi@hanzify.com',
    phone: '0987 654 321',
    role: 'teacher',
    avatar: '怀',
    chineseName: '怀老师',
    badge: 'Giáo viên phụ trách',
    joinedDate: 'Năm 2024'
  },
  {
    id: 'user-admin',
    username: 'admin',
    password: '123',
    name: 'Nguyễn Phúc Long (Admin)',
    email: 'admin@hanzify.com',
    phone: '0901 234 567',
    role: 'admin',
    avatar: '👑',
    chineseName: '龙老师',
    badge: 'Quản trị viên tối cao',
    joinedDate: 'Tháng 9/2026'
  }
];

export const AuthProvider = ({ children }) => {
  // Persistent registered users list
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('hanzify_registered_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_REGISTERED_USERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('hanzify_registered_users', JSON.stringify(registeredUsers));
    } catch (e) {}
  }, [registeredUsers]);

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hanzify_user');
    return saved ? JSON.parse(saved) : PRESET_USERS.student;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfilePanelOpen, setIsProfilePanelOpen] = useState(false);
  const [isCreateClassModalOpen, setIsCreateClassModalOpen] = useState(false);
  const [isJoinClassModalOpen, setIsJoinClassModalOpen] = useState(false);

  // Sample Notifications
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Cô Hoài đã chấm bài tập của bạn!',
      desc: 'Bài 04: Đi Mua Sắm (买东西) đạt 9.5 Điểm kèm lời phê chi tiết.',
      time: '15 phút trước',
      type: 'grade',
      isRead: false
    },
    {
      id: 'notif-2',
      title: 'Nhắc nhở nộp bài tập tuần này',
      desc: 'Hạn nộp bài tập Bài 04 là 23:59 hôm nay, đừng quên nộp nhé!',
      time: '3 giờ trước',
      type: 'reminder',
      isRead: false
    },
    {
      id: 'notif-3',
      title: 'Chúc mừng đạt điểm cao Thi Thử HSK 2',
      desc: 'Bạn đã đạt 160/200 điểm ở Đề thi thử số 01. Tuyệt vời!',
      time: 'Hôm qua',
      type: 'award',
      isRead: true
    }
  ]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('hanzify_user', JSON.stringify(user));
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hanzify_user');
  };

  const updateProfile = (updates) => {
    setUser((prev) => ({
      ...prev,
      ...updates
    }));
  };

  // Verify credentials on login
  const authenticate = (usernameOrEmail, password) => {
    const cleanUser = (usernameOrEmail || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    const found = registeredUsers.find(
      (u) =>
        (u.username?.toLowerCase() === cleanUser ||
         u.email?.toLowerCase() === cleanUser ||
         u.phone === cleanUser) &&
        (u.password === cleanPass || cleanPass === '123' || cleanPass === '123456') // Support flexible demo pass
    );

    if (found) {
      login(found);
      return { success: true, user: found };
    }
    return { success: false, message: 'Sai tên đăng nhập hoặc mật khẩu!' };
  };

  // Register student joining class
  const registerStudentWithClass = ({ classId, className, studentId, name, username, password, enrolledCourses = [] }) => {
    const existing = registeredUsers.find(u => u.username?.toLowerCase() === username.trim().toLowerCase());
    if (existing) {
      return { success: false, message: 'Tên đăng nhập này đã được sử dụng. Vui lòng chọn tên khác!' };
    }

    const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const newUser = {
      id: `user-${Date.now()}`,
      studentId: studentId,
      username: username.trim(),
      password: password,
      name: name.trim(),
      email: `${username.trim()}@student.hanzify.com`,
      phone: '',
      role: 'student',
      avatar: initials || '学',
      badge: `Học viên ${className || 'Lớp Mới'}`,
      classId: classId,
      className: className,
      enrolledCourses: enrolledCourses,
      joinedDate: 'Tháng 9/2026'
    };

    setRegisteredUsers((prev) => [...prev, newUser]);
    login(newUser);
    return { success: true, user: newUser };
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const switchRole = (newRole) => {
    if (PRESET_USERS[newRole]) {
      setUser(PRESET_USERS[newRole]);
    }
  };

  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AuthContext.Provider
      value={{
        user,
        registeredUsers,
        authenticate,
        registerStudentWithClass,
        login,
        logout,
        updateProfile,
        switchRole,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isProfilePanelOpen,
        setIsProfilePanelOpen,
        isCreateClassModalOpen,
        setIsCreateClassModalOpen,
        isJoinClassModalOpen,
        setIsJoinClassModalOpen,
        notifications,
        unreadNotifsCount,
        markAllNotificationsRead
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
