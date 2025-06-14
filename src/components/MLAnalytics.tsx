
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Clock, Target, BarChart3, CheckCircle, Plus } from 'lucide-react';
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

  // Загружаем реальные данные из базы Supabase
  useEffect(() => {
    if (!user?.id) return;
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('Загружаем данные для пользователя:', user.id);
        
        // Получаем lesson_activities
        const { data: activities, error: actError } = await supabase
          .from('lesson_activities')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: true });
        
        if (actError) {
          console.error('Ошибка lesson_activities:', actError);
          throw new Error(`Ошибка lesson_activities: ${actError.message}`);
        }
        
        // Получаем quiz_results
        const { data: quizzes, error: quizError } = await supabase
          .from('quiz_results')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: true });
        
        if (quizError) {
          console.error('Ошибка quiz_results:', quizError);
          throw new Error(`Ошибка quiz_results: ${quizError.message}`);
        }

        console.log('Загружено активностей:', activities?.length || 0);
        console.log('Загружено результатов тестов:', quizzes?.length || 0);

        // Приводим к нужному формату
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

        setLessonActivities(processedActivities);
        setQuizResults(processedQuizzes);
      } catch (e: any) {
        console.error('Ошибка загрузки данных:', e);
        setError(e.message || 'Ошибка загрузки данных');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Функция для создания тестовых данных
  const createSampleData = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      console.log('Создаем тестовые данные...');
      
      // Создаем тестовые активности
      const sampleActivities = [
        { user_id: user.id, lesson_id: 1, course_id: 1, time_spent: 25, attempts: 1 },
        { user_id: user.id, lesson_id: 2, course_id: 1, time_spent: 30, attempts: 2 },
        { user_id: user.id, lesson_id: 3, course_id: 1, time_spent: 20, attempts: 1 },
        { user_id: user.id, lesson_id: 4, course_id: 1, time_spent: 35, attempts: 1 },
        { user_id: user.id, lesson_id: 5, course_id: 1, time_spent: 28, attempts: 3 },
      ];

      const { error: activitiesError } = await supabase
        .from('lesson_activities')
        .insert(sampleActivities);

      if (activitiesError) throw activitiesError;

      // Создаем тестовые результаты тестов
      const sampleQuizzes = [
        { user_id: user.id, lesson_id: 1, course_id: 1, score: 85, correct_answers: 4, total_questions: 5, time_spent: 12 },
        { user_id: user.id, lesson_id: 2, course_id: 1, score: 75, correct_answers: 3, total_questions: 4, time_spent: 8 },
        { user_id: user.id, lesson_id: 3, course_id: 1, score: 90, correct_answers: 9, total_questions: 10, time_spent: 15 },
        { user_id: user.id, lesson_id: 4, course_id: 1, score: 66, correct_answers: 2, total_questions: 3, time_spent: 8 },
      ];

      const { error: quizzesError } = await supabase
        .from('quiz_results')
        .insert(sampleQuizzes);

      if (quizzesError) throw quizzesError;

      toast.success('Тестовые данные созданы успешно!');
      
      // Перезагружаем данные
      window.location.reload();
    } catch (e: any) {
      console.error('Ошибка создания тестовых данных:', e);
      setError('Ошибка создания тестовых данных: ' + e.message);
      toast.error('Не удалось создать тестовые данные');
    } finally {
      setIsLoading(false);
    }
  };

  const runMLAnalysis = async () => {
    if (lessonActivities.length === 0 && quizResults.length === 0) {
      setError('Нет данных для анализа. Сначала добавьте тестовые данные.');
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
          {!hasData && (
            <div className="text-center py-8 border rounded-lg bg-yellow-50 mb-6">
              <p className="text-gray-600 mb-4">
                У вас пока нет данных об активности для анализа
              </p>
              <Button onClick={createSampleData} disabled={isLoading} className="mb-2">
                <Plus className="w-4 h-4 mr-2" />
                Создать тестовые данные
              </Button>
              <p className="text-sm text-gray-500">
                Это поможет продемонстрировать работу AI анализа
              </p>
            </div>
          )}

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

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mr-4"></div>
              <span>
                {lessonActivities.length === 0 && quizResults.length === 0 
                  ? 'Создаем тестовые данные...' 
                  : 'Анализируем ваши данные...'}
              </span>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 border rounded-lg bg-red-50 text-red-800">
              {error}
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

          {hasData && !isLoading && (
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
