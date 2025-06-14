
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Clock, Target, BarChart3, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface LessonActivity {
  lessonId: number;
  courseId: number;
  timeSpent: number;
  completedAt: string;
  attempts?: number;
}
interface QuizResult {
  lessonId: number;
  courseId: number;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  completedAt: string;
}

const MLAnalytics = () => {
  const { user } = useAuth();
  const [lessonActivities, setLessonActivities] = useState<LessonActivity[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [mlAnalysis, setMlAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Загружаем реальные события и тесты пользователя
  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setIsLoading(true);
      // Пример: здесь надо заменить на реальные запросы к supabase
      const { data: act } = await supabase.from('lesson_activities').select('*').eq('user_id', user.id);
      const { data: quizzes } = await supabase.from('quiz_results').select('*').eq('user_id', user.id);

      // Обработка формата полученных данных (подгоняем под структуру)
      setLessonActivities((act ?? []).map((item: any) => ({
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
      setIsLoading(false);
    };
    fetchData();
  }, [user]);

  const runMLAnalysis = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch('/functions/ml-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonActivities, quizResults }),
      });
      const result = await resp.json();
      setMlAnalysis(result.analysis || result.error || 'Не удалось получить анализ');
    } catch (e: any) {
      setMlAnalysis('Ошибка: ' + (e.message || e.toString()));
    }
    setIsLoading(false);
  };

  // Рандомная простая метрика (пример)
  const avgTimePerLesson = lessonActivities.length ? 
    Math.round(lessonActivities.reduce((sum, x) => sum + x.timeSpent, 0) / lessonActivities.length) : 0;
  const avgQuizScore = quizResults.length ? 
    Math.round(quizResults.reduce((sum, x) => sum + x.score, 0) / quizResults.length) : 0;
  const efficiency = avgQuizScore > 0 && avgTimePerLesson > 0 
    ? Math.round(Math.min(100, avgQuizScore / (avgTimePerLesson / 10))) 
    : 0;
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
              <span>Анализируем ваши данные...</span>
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

          {!isLoading && (
            <Button onClick={runMLAnalysis} variant="outline" className="w-full mt-4">
              Запустить AI-анализ
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MLAnalytics;
