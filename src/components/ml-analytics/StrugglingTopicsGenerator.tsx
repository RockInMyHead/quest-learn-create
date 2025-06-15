
import React from "react";
import { useMLUserData, LessonActivity, QuizResult } from "@/hooks/useMLUserData";
import { useAuth } from "@/context/AuthContext";
import { useAutoLessonGeneration } from "@/hooks/useAutoLessonGeneration";

// Теперь StrugglingTopicsGenerator принимает lessonActivities и quizResults, baseCourseTitle
type Props = {
  baseCourseTitle: string;
  lessonActivities: LessonActivity[];
  quizResults: QuizResult[];
};

const StrugglingTopicsGenerator: React.FC<Props> = ({ baseCourseTitle, lessonActivities, quizResults }) => {
  const { user } = useAuth();
  useAutoLessonGeneration(user, baseCourseTitle, lessonActivities, quizResults);

  return (
    <div className="text-xs text-gray-400 mt-2">
      Автоматическая генерация AI-уроков, если<br />
      • урок прошёл слишком быстро (&lt;5 мин)<br />
      • были ошибки в тестах<br />
      Новые уроки появятся через несколько секунд после события.
    </div>
  );
};

export default StrugglingTopicsGenerator;
