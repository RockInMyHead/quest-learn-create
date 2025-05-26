
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getDb, saveDb } from '../lib/db';

export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  name: string;
  email: string;
  role: UserRole;
  joinDate: string;
  courses: number[];
  completedLessons: { [courseId: number]: number[] };
}

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { name: string; email: string; password: string; role: UserRole }) => Promise<boolean>;
  enroll: (courseId: number) => Promise<void>;
  markLessonCompleted: (courseId: number, lessonId: number) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getDb().then(() => {
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    });
  }, []);

  const register = async (data: { name: string; email: string; password: string; role: UserRole }) => {
    const db = await getDb();
    const stmt = db.prepare('SELECT email FROM users WHERE email = $email');
    stmt.bind({ $email: data.email });
    const exists = stmt.step();
    stmt.free();
    if (exists) {
      return false;
    }
    const joinDate = new Date().toLocaleDateString('ru-RU');
    db.run(
      `INSERT INTO users (name, email, password, role, joinDate, courses, completedLessons) VALUES ($name, $email, $password, $role, $joinDate, $courses, $completed)`,
      {
        $name: data.name,
        $email: data.email,
        $password: data.password,
        $role: data.role,
        $joinDate: joinDate,
        $courses: JSON.stringify([]),
        $completed: JSON.stringify({}),
      }
    );
    await saveDb(db);
    const currentUser = {
      name: data.name,
      email: data.email,
      role: data.role,
      joinDate,
      courses: [],
      completedLessons: {},
    };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    setUser(currentUser);
    return true;
  };

  const login = async (email: string, password: string) => {
    const db = await getDb();
    const stmt = db.prepare(
      'SELECT name, email, role, joinDate, courses, completedLessons FROM users WHERE email = $email AND password = $password'
    );
    stmt.bind({ $email: email, $password: password });
    if (stmt.step()) {
      const row = stmt.getAsObject() as any;
      const currentUser = {
        name: row.name as string,
        email: row.email as string,
        role: row.role as UserRole,
        joinDate: row.joinDate as string,
        courses: row.courses ? JSON.parse(row.courses as string) : [],
        completedLessons: row.completedLessons ? JSON.parse(row.completedLessons as string) : {},
      };
      stmt.free();
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      setUser(currentUser);
      return true;
    }
    stmt.free();
    return false;
  };

  const enroll = async (courseId: number) => {
    if (!user) return;
    if (user.courses.includes(courseId)) return;
    const db = await getDb();
    const courses = JSON.stringify([...user.courses, courseId]);
    db.run('UPDATE users SET courses = $courses WHERE email = $email', {
      $courses: courses,
      $email: user.email,
    });
    await saveDb(db);
    const updated = { ...user, courses: [...user.courses, courseId] };
    setUser(updated);
    localStorage.setItem('currentUser', JSON.stringify(updated));
  };

  const markLessonCompleted = async (courseId: number, lessonId: number) => {
    if (!user) return;

    const completedLessons = { ...user.completedLessons };
    if (!completedLessons[courseId]) {
      completedLessons[courseId] = [];
    }

    if (!completedLessons[courseId].includes(lessonId)) {
      completedLessons[courseId].push(lessonId);
    }

    const db = await getDb();
    db.run('UPDATE users SET completedLessons = $completed WHERE email = $email', {
      $completed: JSON.stringify(completedLessons),
      $email: user.email,
    });
    await saveDb(db);

    const updated = { ...user, completedLessons };
    setUser(updated);
    localStorage.setItem('currentUser', JSON.stringify(updated));
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, enroll, markLessonCompleted, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
