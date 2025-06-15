
import { useMemo } from "react";
import type { LessonActivity, QuizResult } from "./useMLUserData";

export function useMLMetrics(lessonActivities: LessonActivity[], quizResults: QuizResult[]) {
  // Среднее время на урок
  const avgTimePerLesson = useMemo(() => {
    if (!lessonActivities.length) return 0;
    const times = lessonActivities.map(x => Number(x.timeSpent) || 0);
    return times.length ? Math.round(times.reduce((sum, t) => sum + t, 0) / times.length) : 0;
  }, [lessonActivities]);

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
