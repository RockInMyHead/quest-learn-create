
import React from "react";
import { Clock, Target, BarChart3 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Props {
  avgTimePerLesson: number;
  avgQuizScore: number;
  efficiency: number;
}

const AverageMetrics: React.FC<Props> = ({ avgTimePerLesson, avgQuizScore, efficiency }) => (
  <div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div className="text-center p-4 border rounded-lg">
        <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
        <p className="text-2xl font-bold">{avgTimePerLesson} мин</p>
        <p className="text-sm text-gray-600">Среднее время на урок</p>
      </div>
      <div className="text-center p-4 border rounded-lg">
        <Target className="w-8 h-8 mx-auto mb-2 text-green-500" />
        <p className="text-2xl font-bold">{avgQuizScore}%</p>
        <p className="text-sm text-gray-600">Средний балл тестов</p>
      </div>
      <div className="text-center p-4 border rounded-lg">
        <BarChart3 className="w-8 h-8 mx-auto mb-2 text-purple-500" />
        <p className="text-2xl font-bold">{efficiency}%</p>
        <p className="text-sm text-gray-600">Эффективность</p>
      </div>
    </div>
    <div className="flex justify-between text-sm mb-2">
      <span>Эффективность обучения</span>
      <span>{efficiency}%</span>
    </div>
    <Progress value={efficiency} className="h-3" />
  </div>
);

export default AverageMetrics;
