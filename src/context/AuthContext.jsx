import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Default student account
  const initialUser = {
    id: 'student-1',
    name: 'Nguyễn Minh Anh',
    email: 'minhanh@gmail.com',
    phone: '0988 123 456',
    role: 'student', // 'student' | 'teacher'
    avatar: 'MA',
    currentClass: 'Lớp HSK 2 Căn Bản (Cô Linh)',
    joinedDate: 'Tháng 8/2026'
  };

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hanzify_user');
    return saved ? JSON.parse(saved) : initialUser;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('hanzify_user', JSON.stringify(user));
  }, [user]);

  const login = (userData) => {
    setUser(userData);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (newRole) => {
    if (!user) return;
    if (newRole === 'teacher') {
      setUser({
        id: 'teacher-1',
        name: 'Cô Linh Lão Sư (灵老师)',
        email: 'colinh.chinese@gmail.com',
        phone: '0909 888 999',
        role: 'teacher',
        avatar: '灵',
        currentClass: 'Giáo viên phụ trách 3 lớp',
        joinedDate: 'Năm 2024'
      });
    } else {
      setUser(initialUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        switchRole,
        isAuthModalOpen,
        setIsAuthModalOpen
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
