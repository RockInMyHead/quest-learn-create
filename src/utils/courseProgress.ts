
import { User } from '@/context/AuthContext';

export const calculateCourseProgress = (user: User | null, courseId: number, totalLessons: number): number => {
  if (!user || !user.completedLessons[courseId]) {
    return 0;
  }
  
  const completedCount = user.completedLessons[courseId].length;
  return Math.round((completedCount / totalLessons) * 100);
};

export const isLessonCompleted = (user: User | null, courseId: number, lessonId: number): boolean => {
  if (!user || !user.completedLessons[courseId]) {
    return false;
  }
  
  return user.completedLessons[courseId].includes(lessonId);
};
