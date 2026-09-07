import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginWithSupabase, logoutFromSupabase, registerStudentInSupabase } from '../services/supabaseService';

const AuthContext = createContext();

// Helper to check if welcome notification should be omitted
const isWelcomeNotifDismissed = (currentUser) => {
  try {
    if (localStorage.getItem('hanzify_welcome_dismissed') === 'true') {
      return true;
    }
    const userId = currentUser?.id || currentUser?.username || 'student';
    const keysToCheck = [
      `hanzify_streak_${userId}`,
      'hanzify_streak_guest',
      'hanzify_streak_student'
    ];
    for (const key of keysToCheck) {
      const raw = localStorage.getItem(key);
      if (raw) {
        const s = JSON.parse(raw);
        if (s?.checkedInToday || s?.lastCheckIn || (s?.currentStreak && s.currentStreak > 0)) {
          return true;
        }
      }
    }
  } catch (e) {
    console.error('Error checking welcome notification status:', e);
  }
  return false;
};

export const AuthProvider = ({ children }) => {
  // Persistent registered users list
  const [registeredUsers] = useState([]);

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hanzify_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfilePanelOpen, setIsProfilePanelOpen] = useState(false);
  const [isCreateClassModalOpen, setIsCreateClassModalOpen] = useState(false);
  const [isJoinClassModalOpen, setIsJoinClassModalOpen] = useState(false);

  // Notifications with persistence and check-in / read awareness
  const [notifications, setNotifications] = useState(() => {
    const savedUser = localStorage.getItem('hanzify_user');
    let initialUser = null;
    try {
      initialUser = savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {}

    const alreadyDismissed = isWelcomeNotifDismissed(initialUser);

    try {
      const savedNotifs = localStorage.getItem('hanzify_notifications');
      if (savedNotifs) {
        const parsed = JSON.parse(savedNotifs);
        if (Array.isArray(parsed)) {
          return alreadyDismissed ? parsed.filter((n) => n.id !== 'notif-1') : parsed;
        }
      }
    } catch (e) {}

    if (alreadyDismissed) {
      return [];
    }

    return [
      {
        id: 'notif-1',
        title: 'Chào mừng bạn đến với Hanzify!',
        desc: 'Hệ thống đã sẵn sàng cho giáo viên quản lý lớp học và bài tập.',
        time: 'Vừa xong',
        type: 'reminder',
        isRead: false
      }
    ];
  });

  // Auto-remove welcome notification if user has checked in
  useEffect(() => {
    if (isWelcomeNotifDismissed(user)) {
      setNotifications((prev) => {
        if (prev.some((n) => n.id === 'notif-1')) {
          const filtered = prev.filter((n) => n.id !== 'notif-1');
          try {
            localStorage.setItem('hanzify_notifications', JSON.stringify(filtered));
          } catch (e) {}
          return filtered;
        }
        return prev;
      });
    }
  }, [user]);

  // Persist notifications list
  useEffect(() => {
    try {
      localStorage.setItem('hanzify_notifications', JSON.stringify(notifications));
    } catch (e) {}
  }, [notifications]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('hanzify_user', JSON.stringify(user));
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
    setIsAuthModalOpen(false);
  };

  const logout = async () => {
    await logoutFromSupabase();
    setUser(null);
    localStorage.removeItem('hanzify_user');
  };

  const updateProfile = (updates) => {
    setUser((prev) => ({
      ...prev,
      ...updates
    }));
  };

  // Verify credentials on login via Supabase Cloud
  const authenticate = async (usernameOrEmail, password) => {
    try {
      const res = await loginWithSupabase(usernameOrEmail, password);
      if (res && res.success && res.user) {
        login(res.user);
        return { success: true, user: res.user };
      }
    } catch (err) {
      return { success: false, message: err.message || 'Tên đăng nhập hoặc mật khẩu không chính xác!' };
    }
    return { success: false, message: 'Sai tên đăng nhập hoặc mật khẩu!' };
  };

  // Register student joining class
  const registerStudentWithClass = async (payload) => {
    const result = await registerStudentInSupabase(payload);
    if (result.success) login(result.user);
    return result;
  };

  // Dismiss welcome notification permanently
  const dismissWelcomeNotification = () => {
    localStorage.setItem('hanzify_welcome_dismissed', 'true');
    setNotifications((prev) => {
      const filtered = prev.filter((n) => n.id !== 'notif-1');
      try {
        localStorage.setItem('hanzify_notifications', JSON.stringify(filtered));
      } catch (e) {}
      return filtered;
    });
  };

  // Dismiss a specific notification by ID
  const dismissNotification = (id) => {
    if (id === 'notif-1') {
      localStorage.setItem('hanzify_welcome_dismissed', 'true');
    }
    setNotifications((prev) => {
      const filtered = prev.filter((n) => n.id !== id);
      try {
        localStorage.setItem('hanzify_notifications', JSON.stringify(filtered));
      } catch (e) {}
      return filtered;
    });
  };

  const markAllNotificationsRead = () => {
    // When marking all read, welcome notification is dismissed permanently
    localStorage.setItem('hanzify_welcome_dismissed', 'true');
    setNotifications((prev) => {
      const updated = prev
        .filter((n) => n.id !== 'notif-1')
        .map((n) => ({ ...n, isRead: true }));
      try {
        localStorage.setItem('hanzify_notifications', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
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
        markAllNotificationsRead,
        dismissNotification,
        dismissWelcomeNotification
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
