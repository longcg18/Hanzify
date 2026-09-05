import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginWithSupabase, logoutFromSupabase, registerStudentInSupabase } from '../services/supabaseService';

const AuthContext = createContext();

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

  // Sample Notifications
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Chào mừng bạn đến với Hanzify!',
      desc: 'Hệ thống đã sẵn sàng cho giáo viên quản lý lớp học và bài tập.',
      time: 'Vừa xong',
      type: 'reminder',
      isRead: false
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

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
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
        markAllNotificationsRead
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
