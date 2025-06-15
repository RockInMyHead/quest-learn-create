
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

type Props = {
  topic: string;
  content: string;
  createdAt: string;
  index?: number;
};

const AiLessonCard: React.FC<Props> = ({ topic, content, createdAt, index }) => (
  <Card className="mb-4 border-blue-300 shadow-sm bg-gradient-to-br from-blue-50 to-white">
    <CardHeader className="flex flex-row items-center gap-2 pb-2">
      <Sparkles className="w-5 h-5 text-blue-400" />
      <CardTitle className="text-base">AI-урок: {topic}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="prose prose-sm max-w-none mb-2">
        {/* Для простоты выводим превью начала урока */}
        {content.slice(0, 320)}...
      </div>
      <div className="text-xs text-gray-400">Сгенерировано: {new Date(createdAt).toLocaleString()}</div>
    </CardContent>
  </Card>
);

export default AiLessonCard;
