
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/context/AuthContext";

// Оптимально подключать этот хук на дашборде курса или аналитике

type StrugglingTopic = {
  topic: string;
  courseId: number;
};

export const useAutoLessonGeneration = (
  user: User | null,
  strugglingTopics: StrugglingTopic[],
  baseCourseTitle: string
) => {
  useEffect(() => {
    if (!user || strugglingTopics.length === 0) return;
    // Для каждой сложной темы проверяем — есть ли уже сгенерированный урок
    strugglingTopics.forEach(async ({ topic, courseId }) => {
      // Проверяем, создан ли lesson
      const { data: existing, error } = await supabase
        .from("generated_lessons")
        .select("id")
        .eq("user_id", user.id)
        .eq("topic", topic)
        .eq("base_course_id", courseId)
        .maybeSingle();

      if (existing) return;

      // Генерируем урок через edge-функцию
      const resp = await fetch("/functions/v1/generate-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          baseCourse: baseCourseTitle,
          userId: user.id,
        }),
      });
      const { content, error: genErr } = await resp.json();

      if (content) {
        // Сохраняем lesson в Supabase
        await supabase.from("generated_lessons").insert([
          {
            user_id: user.id,
            base_course_id: courseId,
            topic,
            content,
          },
        ]);
        // Можно показывать toast пользователю!
      } else {
        // Можно логировать/оповестить администратора об ошибке генерации
        console.error(genErr || "Не удалось сгенерировать урок");
      }
    });
  }, [user, strugglingTopics, baseCourseTitle]);
};
