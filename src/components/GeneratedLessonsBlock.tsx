
import React from "react";
import { Button } from "@/components/ui/button";
import AiLessonCard from "./AiLessonCard";

type AiLesson = {
  id: string;
  topic: string;
  content: string;
  created_at: string;
};

interface Props {
  aiLessons: AiLesson[];
  loading: boolean;
  onRefresh: () => void;
}

const GeneratedLessonsBlock: React.FC<Props> = ({ aiLessons, loading, onRefresh }) => (
  <div className="mt-8">
    <div className="flex items-center gap-2 mb-3">
      <h3 className="font-bold text-lg text-blue-700 flex items-center gap-2">
        AI-уроки по сложным темам
      </h3>
      <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
        {loading ? "Обновление..." : "Обновить"}
      </Button>
    </div>
    {aiLessons.length === 0 && (
      <div className="text-gray-400 italic text-sm">Нет сгенерированных AI-уроков. Если в процессе обучения будут обнаружены сложные темы — новые уроки появятся здесь автоматически.</div>
    )}
    <div>
      {aiLessons.map((a, idx) => (
        <AiLessonCard key={a.id} topic={a.topic} content={a.content} createdAt={a.created_at} index={idx + 1} />
      ))}
    </div>
  </div>
);

export default GeneratedLessonsBlock;
