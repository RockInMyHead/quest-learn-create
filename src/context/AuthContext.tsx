
import React, { createContext, useContext, useEffect, useState } from 'react';

export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  name: string;
  email: string;
  role: UserRole;
  joinDate: string;
  courses: number[];
}

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { name: string; email: string; password: string; role: UserRole }) => Promise<boolean>;
  enroll: (courseId: number) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const register = async (data: { name: string; email: string; password: string; role: UserRole }) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find((u: any) => u.email === data.email)) {
      return false;
    }
    const joinDate = new Date().toLocaleDateString('ru-RU');
    const storedUser = { ...data, joinDate, courses: [] };
    users.push(storedUser);
    localStorage.setItem('users', JSON.stringify(users));
    const currentUser = { name: data.name, email: data.email, role: data.role, joinDate, courses: [] };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    setUser(currentUser);
    return true;
  };

  const login = async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const found = users.find((u: any) => u.email === email && u.password === password);
    if (found) {
      const currentUser = {
        name: found.name,
        email: found.email,
        role: found.role,
        joinDate: found.joinDate,
        courses: found.courses || [],
      };
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      setUser(currentUser);
      return true;
    }
    return false;
  };

  const enroll = (courseId: number) => {
    if (!user) return;
    if (user.courses.includes(courseId)) return;
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const index = users.findIndex((u: any) => u.email === user.email);
    if (index !== -1) {
      users[index].courses = users[index].courses || [];
      users[index].courses.push(courseId);
      localStorage.setItem('users', JSON.stringify(users));
    }
    const updated = { ...user, courses: [...user.courses, courseId] };
    setUser(updated);
    localStorage.setItem('currentUser', JSON.stringify(updated));
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, enroll, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
