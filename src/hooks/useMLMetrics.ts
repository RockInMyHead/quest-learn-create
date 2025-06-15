
import { useMemo } from "react";
import type { LessonActivity, QuizResult } from "./useMLUserData";

export function useMLMetrics(lessonActivities: LessonActivity[], quizResults: QuizResult[]) {
  // 1. Среднее время на урок по уникальным (courseId + lessonId)
  const avgTimePerLesson = useMemo(() => {
    if (!lessonActivities.length) return 0;
    // Собираем мапу уникальных уроков: ключ = `${courseId}_${lessonId}`
    const lessonMap = new Map<string, number[]>();
    lessonActivities.forEach((activity) => {
      const key = `${activity.courseId}_${activity.lessonId}`;
      if (!lessonMap.has(key)) {
        lessonMap.set(key, []);
      }
      lessonMap.get(key)!.push(Number(activity.timeSpent) || 0);
    });
    // Для каждого урока (уникальная пара) считаем среднее timeSpent
    const avgPerLesson = Array.from(lessonMap.values()).map(arr => {
      if (!arr.length) return 0;
      return arr.reduce((sum, t) => sum + t, 0) / arr.length;
    });
    // Итоговое среднее по всем уникальным урокам
    return avgPerLesson.length ? Math.round(avgPerLesson.reduce((a, b) => a + b, 0) / avgPerLesson.length) : 0;
  }, [lessonActivities]);

  // 2. Средний балл тестов
  const avgQuizScore = useMemo(() => {
    if (!quizResults.length) return 0;
    const scores = quizResults.map(x => Number(x.score) || 0);
    return scores.length ? Math.round(scores.reduce((sum, x) => sum + x, 0) / scores.length) : 0;
  }, [quizResults]);

  // 3. Эффективность: средний балл / среднее время * 100, max 100
  const efficiency = useMemo(() => {
    if (avgTimePerLesson > 0) {
      return Math.round(Math.min(100, (avgQuizScore / avgTimePerLesson) * 100));
    }
    return 0;
  }, [avgQuizScore, avgTimePerLesson]);

  return { avgTimePerLesson, avgQuizScore, efficiency };
}
