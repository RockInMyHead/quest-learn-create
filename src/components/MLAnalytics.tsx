
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Clock, Target, BarChart3, CheckCircle, BookOpen } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const MLAnalytics = () => {
  const { user } = useAuth();
  const [lessonActivities, setLessonActivities] = useState<any[]>([]);
  const [quizResults, setQuizResults] = useState<any[]>([]);
  const [mlAnalysis, setMlAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Функция для проверки валидности UUID
  const isValidUUID = (uuid: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  useEffect(() => {
    if (!user?.id) {
      console.log('MLAnalytics: Пользователь не авторизован или ID отсутствует');
      return;
    }

    console.log('MLAnalytics: Пользователь найден, ID:', user.id);

    // Проверяем валидность UUID пользователя
    if (!isValidUUID(user.id)) {
      setError('Ошибка: неверный формат ID пользователя. Пожалуйста, выйдите из системы и войдите заново.');
      console.error('MLAnalytics: Невалидный UUID пользователя:', user.id);
      return;
    }
    
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      console.log('MLAnalytics: Начинаем загрузку данных из Supabase...');
      
      try {
        console.log('MLAnalytics: Получаем lesson_activities для user_id:', user.id);

        const { data: activities, error: actError } = await supabase
          .from('lesson_activities')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: true });

        if (actError) {
          console.error('MLAnalytics: Ошибка lesson_activities:', actError);
          throw new Error(`Ошибка lesson_activities: ${actError.message}`);
        }

        console.log('MLAnalytics: lesson_activities получены:', activities);

        const { data: quizzes, error: quizError } = await supabase
          .from('quiz_results')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: true });

        if (quizError) {
          console.error('MLAnalytics: Ошибка quiz_results:', quizError);
          throw new Error(`Ошибка quiz_results: ${quizError.message}`);
        }

        console.log('MLAnalytics: quiz_results получены:', quizzes);

        const processedActivities = (activities ?? []).map((item: any) => ({
          lessonId: item.lesson_id,
          courseId: item.course_id,
          timeSpent: item.time_spent,
          completedAt: item.completed_at,
          attempts: item.attempts,
        }));

        const processedQuizzes = (quizzes ?? []).map((item: any) => ({
          lessonId: item.lesson_id,
          courseId: item.course_id,
          score: item.score,
          correctAnswers: item.correct_answers,
          totalQuestions: item.total_questions,
          timeSpent: item.time_spent,
          completedAt: item.completed_at,
        }));

        console.log('MLAnalytics: Обработанные данные - activities:', processedActivities.length, 'quizzes:', processedQuizzes.length);

        setLessonActivities(processedActivities);
        setQuizResults(processedQuizzes);
      } catch (e: any) {
        console.error('MLAnalytics: Общая ошибка загрузки данных:', e);
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
      console.log('Запускаем ML анализ...');
      
      const payload = {
        lessonActivities: lessonActivities,
        quizResults: quizResults,
      };

      console.log('Отправляем данные:', payload);

      const resp = await fetch('/functions/ml-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
      }

      const result = await resp.json();
      console.log('Результат анализа:', result);

      if (result.analysis) {
        setMlAnalysis(result.analysis);
        toast.success('Анализ завершен успешно!');
      } else if (result.error) {
        setError("Ошибка анализа: " + result.error);
      } else {
        setError("Сервис анализа временно недоступен");
      }
    } catch (e: any) {
      console.error('Ошибка ML анализа:', e);
      setError('Ошибка: ' + (e.message || e.toString()));
    } finally {
      setIsLoading(false);
    }
  };

  // Вычисляем метрики
  const avgTimePerLesson = lessonActivities.length ?
    Math.round(lessonActivities.reduce((sum, x) => sum + (Number(x.timeSpent) || 0), 0) / lessonActivities.length) : 0;
  
  const avgQuizScore = quizResults.length ?
    Math.round(quizResults.reduce((sum, x) => sum + (Number(x.score) || 0), 0) / quizResults.length) : 0;
  
  const efficiency = avgQuizScore > 0 && avgTimePerLesson > 0 ?
    Math.round(Math.min(100, (avgQuizScore / (avgTimePerLesson / 10)) * 10)) : 0;
  
  const overallGrade = avgQuizScore >= 90 ? 'A' : avgQuizScore >= 80 ? 'B' : avgQuizScore >= 70 ? 'C' : avgQuizScore >= 60 ? 'D' : 'F';

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-500';
      case 'B': return 'bg-blue-500';
      case 'C': return 'bg-yellow-500';
      case 'D': return 'bg-orange-500';
      case 'F': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const hasData = lessonActivities.length > 0 || quizResults.length > 0;

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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className={`w-16 h-16 ${getGradeColor(overallGrade)} text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-2`}>
                    {overallGrade}
                  </div>
                  <p className="text-sm font-medium">Общая оценка</p>
                </div>
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
            </>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mr-4"></div>
              <span>Анализируем ваши данные...</span>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 border rounded-lg bg-red-50 text-red-800">
              <div className="font-medium mb-2">Ошибка:</div>
              <div>{error}</div>
              {error.includes('localStorage') && (
                <div className="mt-3 text-sm">
                  <p className="font-medium">Как исправить:</p>
                  <ol className="list-decimal list-inside mt-1 space-y-1">
                    <li>Откройте DevTools (F12)</li>
                    <li>Перейдите в Application → Local Storage</li>
                    <li>Удалите все данные или выполните localStorage.clear()</li>
                    <li>Обновите страницу и войдите заново</li>
                  </ol>
                </div>
              )}
            </div>
          )}

          {mlAnalysis && !isLoading && (
            <div className="mt-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-medium mb-2 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Рекомендации искусственного интеллекта
              </h3>
              <pre className="text-sm whitespace-pre-wrap">{mlAnalysis}</pre>
            </div>
          )}

          {hasData && !isLoading && !error && (
            <Button onClick={runMLAnalysis} variant="outline" className="w-full mt-4">
              Запустить AI-анализ
            </Button>
          )}

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
