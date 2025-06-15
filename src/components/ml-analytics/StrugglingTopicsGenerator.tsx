
import React from "react";
import { useAutoLessonGeneration } from "@/hooks/useAutoLessonGeneration";
import { useAuth } from "@/context/AuthContext";

// Использует сложные темы из пропсов, по ним инициируется генерация урока
type Props = {
  strugglingTopics: { topic: string; courseId: number }[];
  baseCourseTitle: string;
};

const StrugglingTopicsGenerator: React.FC<Props> = ({ strugglingTopics, baseCourseTitle }) => {
  const { user } = useAuth();
  useAutoLessonGeneration(user, strugglingTopics, baseCourseTitle);

  return (
    <div className="text-xs text-gray-400 mt-2">
      Автоматическая генерация уроков для сложных тем: {strugglingTopics.map(t => t.topic).join(', ') || "нет"}
    </div>
  );
};

export default StrugglingTopicsGenerator;
