
import { useMemo } from "react";

export const useStrugglingTopics = (quizResults: any[], threshold: number = 90) => {
  // Возвращает темы с результатом меньше порога (по умолчанию < 90)
  return useMemo(() => 
    quizResults.filter(q => Number(q.score) < threshold).map(q => ({
      topic: `Тема урока №${q.lessonId}`,
      courseId: q.courseId
    }))
  ,[quizResults, threshold]);
};
