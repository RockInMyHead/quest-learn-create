
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, BarChart3 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import AverageMetrics from './ml-analytics/AverageMetrics';
import MLAnalysisSection from './ml-analytics/MLAnalysisSection';
import MLErrorBlock from './ml-analytics/MLErrorBlock';
import StrugglingTopicsGenerator from "./ml-analytics/StrugglingTopicsGenerator";
import { useStrugglingTopics } from "@/hooks/useStrugglingTopics";
import { useMLUserData } from "@/hooks/useMLUserData";
import { useMLMetrics } from "@/hooks/useMLMetrics";

const MLAnalytics = () => {
  const { user } = useAuth();
  const [mlAnalysis, setMlAnalysis] = useState<string>('');

  // Получение пользовательских активностей и квизов (супабейс)
  const { lessonActivities, quizResults, loading: isLoading, error } = useMLUserData(user);

  // Метрики (hook)
  const { avgTimePerLesson, avgQuizScore, efficiency } = useMLMetrics(lessonActivities, quizResults);

  // Есть ли какие-либо данные
  const hasData = lessonActivities.length > 0 || quizResults.length > 0;

  // Темы с низкими результатами
  const strugglingTopics = useStrugglingTopics(quizResults, 90);

  // Заглушка: функция для запуска AI-анализа
  const runMLAnalysis = () => {
    setMlAnalysis("AI-подсказка: анализ успешно выполнен. (Здесь будут персональные рекомендации)");
    toast.success("Анализ данных запущен!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            ML Анализ успеваемости
          </CardTitle>
          <CardDescription>
            Искусственный интеллект анализирует ваш прогресс обучения
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!hasData && !isLoading && !error && (
            <div className="text-center py-12 border rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Начните изучать курсы
              </h3>
              <p className="text-gray-600 mb-4 max-w-md mx-auto">
                Для работы аналитики необходимо пройти хотя бы один урок или тест. 
                Система будет отслеживать ваш прогресс и предоставлять персонализированные рекомендации.
              </p>
              <div className="text-sm text-gray-500">
                ML-анализ станет доступен после накопления данных об обучении
              </div>
            </div>
          )}
          {(hasData || isLoading) && !error && (
            <>
              <AverageMetrics
                avgTimePerLesson={avgTimePerLesson}
                avgQuizScore={avgQuizScore}
                efficiency={efficiency}
              />
              <StrugglingTopicsGenerator strugglingTopics={strugglingTopics} baseCourseTitle="Ваш курс" />
            </>
          )}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mr-4"></div>
              <span>Анализируем ваши данные...</span>
            </div>
          )}
          <MLErrorBlock error={error} />
          <MLAnalysisSection
            mlAnalysis={mlAnalysis}
            isLoading={isLoading}
            hasData={hasData}
            error={error}
            onRunAnalysis={runMLAnalysis}
          />
          {hasData && (
            <div className="mt-4 text-sm text-gray-500">
              Данных для анализа: {lessonActivities.length} активностей, {quizResults.length} результатов тестов
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MLAnalytics;
