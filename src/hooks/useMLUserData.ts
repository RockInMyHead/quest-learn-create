
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/context/AuthContext";

// Простая форма для передачи результатов
export type LessonActivity = {
  lessonId: number | string;
  courseId: number;
  timeSpent: number;
  completedAt?: string;
  attempts?: number;
};
export type QuizResult = {
  lessonId: number | string;
  courseId: number;
  score: number;
  correctAnswers?: number;
  totalQuestions?: number;
  timeSpent?: number;
  completedAt?: string;
};

export function useMLUserData(user: User | null) {
  const [lessonActivities, setLessonActivities] = useState<LessonActivity[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Новый: очистка данных при отсутствии user?.id (при разлогинивании или смене пользователя)
    if (!user?.id) {
      setLessonActivities([]);
      setQuizResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    // Проверка UUID (можно убрать, если доверяем AuthContext)
    const isValidUUID = (uuid: string) => /^[0-9a-fA-F-]{36}$/.test(uuid);

    if (!isValidUUID(user.id)) {
      setError("Ошибка: неверный формат ID пользователя. Пожалуйста, выйдите из системы и войдите заново.");
      setLessonActivities([]);
      setQuizResults([]);
      setLoading(false);
      return;
    }

    let ignore = false;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: activities } = await supabase
          .from("lesson_activities")
          .select("*")
          .eq("user_id", user.id)
          .order("completed_at", { ascending: true });
        const { data: quizzes } = await supabase
          .from("quiz_results")
          .select("*")
          .eq("user_id", user.id)
          .order("completed_at", { ascending: true });

        if (!ignore) {
          setLessonActivities(
            (activities ?? [])
              .filter((item: any) => !!item.lesson_id && !!item.user_id)
              .map((item: any) => ({
                lessonId: item.lesson_id,
                courseId: item.course_id,
                timeSpent: Number(item.time_spent),
                completedAt: item.completed_at,
                attempts: item.attempts,
              }))
          );
          setQuizResults(
            (quizzes ?? [])
              .filter((item: any) => !!item.lesson_id && !!item.user_id)
              .map((item: any) => ({
                lessonId: item.lesson_id,
                courseId: item.course_id,
                score: Number(item.score),
                correctAnswers: item.correct_answers,
                totalQuestions: item.total_questions,
                timeSpent: Number(item.time_spent),
                completedAt: item.completed_at,
              }))
          );
        }
      } catch (e: any) {
        setError(e.message || "Ошибка загрузки данных");
        setLessonActivities([]);
        setQuizResults([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetch();
    return () => {
      ignore = true;
    };
  }, [user?.id]);

  // Для быстрой диагностики — выводим значения в консоль
  console.log('[useMLUserData] lessonActivities:', lessonActivities, '| quizResults:', quizResults, '| user:', user?.id);

  return { lessonActivities, quizResults, loading, error };
}

