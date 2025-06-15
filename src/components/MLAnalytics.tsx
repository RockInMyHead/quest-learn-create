import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, BarChart3 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import AverageMetrics from './ml-analytics/AverageMetrics';
import MLAnalysisSection from './ml-analytics/MLAnalysisSection';
import MLErrorBlock from './ml-analytics/MLErrorBlock';
import StrugglingTopicsGenerator from "./ml-analytics/StrugglingTopicsGenerator";
import { useStrugglingTopics } from "@/hooks/useStrugglingTopics"; // новинка

const MLAnalytics = () => {
  const { user } = useAuth();
  const [lessonActivities, setLessonActivities] = useState<any[]>([]);
  const [quizResults, setQuizResults] = useState<any[]>([]);
  const [mlAnalysis, setMlAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidUUID = (uuid: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  useEffect(() => {
    if (!user?.id) {
      console.log('MLAnalytics: Пользователь не авторизован или ID отсутствует');
      return;
    }
    if (!isValidUUID(user.id)) {
      setError('Ошибка: неверный формат ID пользователя. Пожалуйста, выйдите из системы и войдите заново.');
      console.error('MLAnalytics: Невалидный UUID пользователя:', user.id);
      return;
    }
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data: activities, error: actError } = await supabase
          .from('lesson_activities')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: true });
        if (actError) throw new Error(`Ошибка lesson_activities: ${actError.message}`);
        const { data: quizzes, error: quizError } = await supabase
          .from('quiz_results')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: true });
        if (quizError) throw new Error(`Ошибка quiz_results: ${quizError.message}`);
        setLessonActivities((activities ?? []).map((item: any) => ({
          lessonId: item.lesson_id,
          courseId: item.course_id,
          timeSpent: item.time_spent,
          completedAt: item.completed_at,
          attempts: item.attempts,
        })));
        setQuizResults((quizzes ?? []).map((item: any) => ({
          lessonId: item.lesson_id,
          courseId: item.course_id,
          score: item.score,
          correctAnswers: item.correct_answers,
          totalQuestions: item.total_questions,
          timeSpent: item.time_spent,
          completedAt: item.completed_at,
        })));
      } catch (e: any) {
        if (e.message.includes('invalid input syntax for type uuid')) {
          setError('Ошибка ID пользователя. Пожалуйста, очистите localStorage браузера, выйдите из системы и войдите заново.');
        } else if (e.name === 'TypeError' || e?.message?.toLowerCase().includes('failed')) {
          setError('Ошибка загрузки данных из Supabase: возможно, проблема с сетью или доступом к базе. Проверьте подключение к интернету и настройки Supabase.');
        } else {
          setError(e.message || 'Ошибка загрузки данных');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

  const runMLAnalysis = async () => {
    if (lessonActivities.length === 0 && quizResults.length === 0) {
      setError('Нет данных для анализа. Начните изучать курсы для получения аналитики.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setMlAnalysis('');
    try {
      const payload = {
        lessonActivities: lessonActivities,
        quizResults: quizResults,
      };
      const resp = await fetch('https://btnioyywtmuyacyjhsit.functions.supabase.co/ml-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const rawText = await resp.text();
      let result;
      try {
        result = JSON.parse(rawText);
      } catch (e) {
        setError(
          'Ошибка парсинга результата ML-функции: ' +
            (e.message || e) +
            '\n\nRaw ответ:\n' +
            rawText
        );
        setIsLoading(false);
        return;
      }
      if (result.analysis) {
        setMlAnalysis(result.analysis);
        toast.success('Анализ завершен успешно!');
      } else if (result.error) {
        setError("Ошибка анализа: " + result.error + '\n\nRaw ответ:\n' + rawText);
      } else {
        setError("Сервис анализа временно недоступен\n\nRaw ответ:\n" + rawText);
      }
    } catch (e: any) {
      setError('Ошибка: ' + (e.message || e.toString()));
    } finally {
      setIsLoading(false);
    }
  };

  // Вычисление средней длительности урока
  // timeSpent должен быть числом, а не строкой
  const times = lessonActivities.map(x => Number(x.timeSpent) || 0);
  const avgTimePerLesson = times.length
    ? Math.round(times.reduce((sum, t) => sum + t, 0) / times.length)
    : 0;
  // Для отладки: выводим массив времен в консоль
  console.log('MLAnalytics: lessonActivities timeSpent:', times, 'Среднее:', avgTimePerLesson);

  const avgQuizScore = quizResults.length ?
    Math.round(quizResults.reduce((sum, x) => sum + (Number(x.score) || 0), 0) / quizResults.length) : 0;
  const efficiency = avgQuizScore > 0 && avgTimePerLesson > 0 ?
    Math.round(Math.min(100, (avgQuizScore / (avgTimePerLesson / 10)) * 10)) : 0;
  const hasData = lessonActivities.length > 0 || quizResults.length > 0;

  // Новый способ определения сложных тем с пониженным порогом (score < 90)
  const strugglingTopics = useStrugglingTopics(quizResults, 90);

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
              {/* Новый компонент для слежения и авто-генерации уроков */}
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
