
import { User } from '@/context/AuthContext';

export interface LessonActivity {
  lessonId: number;
  courseId: number;
  timeSpent: number; // в минутах
  completedAt: Date;
  attempts?: number;
}

export interface QuizResult {
  lessonId: number;
  courseId: number;
  score: number; // процент правильных ответов
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number; // в минутах
  completedAt: Date;
}

export interface StudentPerformanceMetrics {
  overallGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  averageTimePerLesson: number;
  averageQuizScore: number;
  learningEfficiency: number; // 0-100
  strugglingAreas: string[];
  recommendations: string[];
  progressTrend: 'improving' | 'declining' | 'stable';
}

// Симуляция ML модели для анализа успеваемости
export const analyzeStudentPerformance = (
  user: User,
  lessonActivities: LessonActivity[],
  quizResults: QuizResult[]
): StudentPerformanceMetrics => {
  // Анализ времени на уроки
  const avgTimePerLesson = lessonActivities.length > 0 
    ? lessonActivities.reduce((sum, activity) => sum + activity.timeSpent, 0) / lessonActivities.length
    : 0;

  // Анализ результатов тестов
  const avgQuizScore = quizResults.length > 0
    ? quizResults.reduce((sum, result) => sum + result.score, 0) / quizResults.length
    : 0;

  // Определение эффективности обучения (соотношение результата к времени)
  const learningEfficiency = avgTimePerLesson > 0 
    ? Math.min(100, (avgQuizScore / (avgTimePerLesson / 10)) * 10)
    : 0;

  // Определение общей оценки
  let overallGrade: 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  if (avgQuizScore >= 90) overallGrade = 'A';
  else if (avgQuizScore >= 80) overallGrade = 'B';
  else if (avgQuizScore >= 70) overallGrade = 'C';
  else if (avgQuizScore >= 60) overallGrade = 'D';

  // Анализ проблемных областей
  const strugglingAreas: string[] = [];
  const lowScoreResults = quizResults.filter(result => result.score < 70);
  
  if (lowScoreResults.length > quizResults.length * 0.3) {
    strugglingAreas.push('Тестирование');
  }
  
  if (avgTimePerLesson > 35) {
    strugglingAreas.push('Скорость изучения');
  }

  if (learningEfficiency < 50) {
    strugglingAreas.push('Эффективность обучения');
  }

  // Генерация рекомендаций на основе анализа
  const recommendations: string[] = [];
  
  if (avgQuizScore < 70) {
    recommendations.push('Рекомендуется больше времени уделить повторению материала');
  }
  
  if (avgTimePerLesson > 30) {
    recommendations.push('Попробуйте разбить материал на более мелкие части');
  }
  
  if (learningEfficiency < 60) {
    recommendations.push('Рассмотрите возможность изменения подхода к изучению');
  }

  if (strugglingAreas.length === 0) {
    recommendations.push('Отличная работа! Продолжайте в том же духе');
  }

  // Анализ тренда (последние 5 результатов vs предыдущие)
  let progressTrend: 'improving' | 'declining' | 'stable' = 'stable';
  if (quizResults.length >= 6) {
    const recent = quizResults.slice(-3).reduce((sum, r) => sum + r.score, 0) / 3;
    const previous = quizResults.slice(-6, -3).reduce((sum, r) => sum + r.score, 0) / 3;
    
    if (recent > previous + 5) progressTrend = 'improving';
    else if (recent < previous - 5) progressTrend = 'declining';
  }

  return {
    overallGrade,
    averageTimePerLesson: avgTimePerLesson,
    averageQuizScore: avgQuizScore,
    learningEfficiency,
    strugglingAreas,
    recommendations,
    progressTrend
  };
};

// Генерация тестовых данных для демонстрации
export const generateSampleData = (userId: string): { activities: LessonActivity[], quizResults: QuizResult[] } => {
  const activities: LessonActivity[] = [
    { lessonId: 1, courseId: 1, timeSpent: 25, completedAt: new Date('2024-01-15'), attempts: 1 },
    { lessonId: 2, courseId: 1, timeSpent: 30, completedAt: new Date('2024-01-16'), attempts: 2 },
    { lessonId: 3, courseId: 1, timeSpent: 20, completedAt: new Date('2024-01-17'), attempts: 1 },
    { lessonId: 4, courseId: 1, timeSpent: 35, completedAt: new Date('2024-01-18'), attempts: 1 },
    { lessonId: 5, courseId: 1, timeSpent: 28, completedAt: new Date('2024-01-19'), attempts: 3 },
  ];

  const quizResults: QuizResult[] = [
    { lessonId: 4, courseId: 1, score: 80, correctAnswers: 4, totalQuestions: 5, timeSpent: 12, completedAt: new Date('2024-01-18') },
    { lessonId: 6, courseId: 1, score: 66, correctAnswers: 2, totalQuestions: 3, timeSpent: 8, completedAt: new Date('2024-01-20') },
  ];

  return { activities, quizResults };
};
