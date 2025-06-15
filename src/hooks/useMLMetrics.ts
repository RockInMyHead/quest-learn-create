
import { useMemo } from "react";
import type { LessonActivity, QuizResult } from "./useMLUserData";

export function useMLMetrics(lessonActivities: LessonActivity[], quizResults: QuizResult[]) {
  // Добавляем консоль для отладки
  console.log("lessonActivities (raw):", lessonActivities);

  // Оставляем только валидные значения
  const validActivities = useMemo(() => lessonActivities.filter(
    x => Number(x.timeSpent) > 0 && Number(x.timeSpent) < 180 // 3 часа макс
  ), [lessonActivities]);

  // Консоль для контроля
  console.log("validActivities (timeSpent>0 & <180):", validActivities);

  // Среднее время на урок (минуты, округлённое)
  const avgTimePerLesson = useMemo(() => {
    if (!validActivities.length) return 0;
    const times = validActivities.map(x => Number(x.timeSpent) || 0);
    return times.length ? Math.round(times.reduce((sum, t) => sum + t, 0) / times.length) : 0;
  }, [validActivities]);

  // Средний балл тестов
  const avgQuizScore = useMemo(() => {
    if (!quizResults.length) return 0;
    return Math.round(
      quizResults.reduce((sum, x) => sum + (Number(x.score) || 0), 0) / quizResults.length
    );
  }, [quizResults]);

  // Эффективность — простая формула: балл / (время / 10) * 10 capped 100
  const efficiency = useMemo(() => {
    if (avgQuizScore > 0 && avgTimePerLesson > 0) {
      return Math.round(Math.min(100, (avgQuizScore / (avgTimePerLesson / 10)) * 10));
    }
    return 0;
  }, [avgQuizScore, avgTimePerLesson]);

  return { avgTimePerLesson, avgQuizScore, efficiency };
}
