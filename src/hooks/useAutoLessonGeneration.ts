
// Новый универсальный хук генерации AI-уроков на основе времени на уроке и результатов теста

import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/context/AuthContext";
import { LessonActivity, QuizResult } from "@/hooks/useMLUserData";

// Оптимально подключать этот хук на дашборде курса или аналитике

type Lesson = {
  id: number | string;
  title: string;
  topic?: string;
};

type GenerationTask = {
  type: "short_time" | "test_errors";
  lessonId: number | string;
  courseId: number;
  baseCourseTitle: string;
  topic: string;
  errorDetails?: string;
};

export const useAutoLessonGeneration = (
  user: User | null,
  baseCourseTitle: string,
  lessonActivities: LessonActivity[],
  quizResults: QuizResult[]
) => {
  useEffect(() => {
    if (!user) return;

    // 1. ОПРЕДЕЛЯЕМ УРОКИ С МАЛЫМ ВРЕМЕНЕМ (<5 мин)
    const shortTimeTasks: GenerationTask[] = lessonActivities
      .filter(l => typeof l.timeSpent === "number" && l.timeSpent > 0 && l.timeSpent < 5)
      .map(l => ({
        type: "short_time",
        lessonId: l.lessonId,
        courseId: l.courseId,
        baseCourseTitle,
        topic: `Повтор: урок №${l.lessonId}`,
      }));

    // 2. ОПРЕДЕЛЯЕМ ТЕСТЫ С ОШИБКАМИ (< 100%)
    const tasksByTest: GenerationTask[] = [];
    quizResults.forEach((qr) => {
      if (
        typeof qr.score === "number" &&
        qr.score < 100
      ) {
        // Можно тут же получить неверные номера вопросов и оформить errorDetails
        let explanation = "";
        if (qr.correctAnswers !== undefined && qr.totalQuestions !== undefined) {
          const incorrect = qr.totalQuestions - qr.correctAnswers;
          explanation = `Было ошибок: ${incorrect} из ${qr.totalQuestions}`;
        }
        tasksByTest.push({
          type: "test_errors",
          lessonId: qr.lessonId,
          courseId: qr.courseId,
          baseCourseTitle,
          topic: `Объяснение: тест по уроку №${qr.lessonId}`,
          errorDetails: explanation,
        });
      }
    });

    // 3. УДАЛЯЕМ ДУБЛИКАТЫ по (type + lessonId + courseId)
    const tasks: GenerationTask[] = [];
    const keySet = new Set();
    [...tasksByTest, ...shortTimeTasks].forEach(task => {
      const key = `${task.type}-${task.lessonId}-${task.courseId}`;
      if (!keySet.has(key)) {
        tasks.push(task);
        keySet.add(key);
      }
    });

    // 4. Для каждой задачи — запускаем генерацию, если урока ещё нет
    tasks.forEach(async (task) => {
      // Проверяем, создан ли lesson
      const { data: existing } = await supabase
        .from("generated_lessons")
        .select("id")
        .eq("user_id", user.id)
        .eq("topic", task.topic)
        .eq("base_course_id", task.courseId)
        .maybeSingle();

      if (existing) return;

      // Готовим prompt для AI в зависимости от типа
      let prompt = "";
      if (task.type === "short_time") {
        prompt = `
Ты обучающая система. Сгенерируй дополнительный практико-ориентированный и понятный урок (на русском языке) по той же теме, что и урок №${task.lessonId} для курса "${task.baseCourseTitle}", потому что пользователь потратил очень мало времени на оригинальном уроке. Сделай акцент на объяснениях, практических примерах и простых заданиях для лучшего понимания материала.
Верни только содержимое урока в Markdown.
`;
      } else if (task.type === "test_errors") {
        prompt = `
Ты обучающая система. Сгенерируй урок (на русском языке), который подробно объяснит темы, вызвавшие трудности в тесте по уроку №${task.lessonId} курса "${task.baseCourseTitle}". Пользователь совершил ошибки: ${task.errorDetails || "были неправильно решены вопросы"}. Основное внимание удели тем моментам, которые чаще всего вызывают ошибки. Включи объяснения, примеры, наводящие подсказки и мини-тест по слабым местам.
Верни только содержимое урока в Markdown.
`;
      }
      // Вызываем edge-функцию
      const resp = await fetch("/functions/v1/generate-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: task.topic,
          baseCourse: task.baseCourseTitle,
          userId: user.id,
          promptOverride: prompt,
        }),
      });

      const { content, error: genErr } = await resp.json();

      if (content) {
        await supabase.from("generated_lessons").insert([
          {
            user_id: user.id,
            base_course_id: task.courseId,
            topic: task.topic,
            content,
          },
        ]);
      } else {
        console.error(genErr || "Не удалось сгенерировать урок");
      }
    });
  }, [user, lessonActivities, quizResults, baseCourseTitle]);
};
