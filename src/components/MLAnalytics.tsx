
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Clock, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  AlertTriangle,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { 
  analyzeStudentPerformance, 
  generateSampleData, 
  StudentPerformanceMetrics 
} from '@/utils/mlAnalytics';

const MLAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<StudentPerformanceMetrics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runAnalysis = async () => {
    if (!user) return;
    
    setIsAnalyzing(true);
    
    // Симуляция загрузки данных и анализа ML модели
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const { activities, quizResults } = generateSampleData(user.id);
    const metrics = analyzeStudentPerformance(user, activities, quizResults);
    
    setAnalytics(metrics);
    setIsAnalyzing(false);
  };

  useEffect(() => {
    if (user) {
      runAnalysis();
    }
  }, [user]);

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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'stable': return <Minus className="w-4 h-4 text-yellow-500" />;
      default: return null;
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            ML Анализ успеваемости
          </CardTitle>
          <CardDescription>
            Искусственный интеллект анализирует ваш прогресс обучения
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isAnalyzing ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Анализируем ваши данные...</p>
            </div>
          ) : analytics ? (
            <div className="space-y-6">
              {/* Общая оценка */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className={`w-16 h-16 ${getGradeColor(analytics.overallGrade)} text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-2`}>
                    {analytics.overallGrade}
                  </div>
                  <p className="text-sm font-medium">Общая оценка</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-2xl font-bold">{Math.round(analytics.averageTimePerLesson)} мин</p>
                  <p className="text-sm text-gray-600">Среднее время на урок</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <Target className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <p className="text-2xl font-bold">{Math.round(analytics.averageQuizScore)}%</p>
                  <p className="text-sm text-gray-600">Средний балл тестов</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <BarChart3 className="w-8 h-8 text-purple-500" />
                    {getTrendIcon(analytics.progressTrend)}
                  </div>
                  <p className="text-2xl font-bold">{Math.round(analytics.learningEfficiency)}%</p>
                  <p className="text-sm text-gray-600">Эффективность</p>
                </div>
              </div>

              {/* Эффективность обучения */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Эффективность обучения</span>
                  <span>{Math.round(analytics.learningEfficiency)}%</span>
                </div>
                <Progress value={analytics.learningEfficiency} className="h-3" />
              </div>

              {/* Проблемные области */}
              {analytics.strugglingAreas.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2 text-orange-500" />
                    Области для улучшения
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analytics.strugglingAreas.map((area, index) => (
                      <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-800">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Рекомендации */}
              <div>
                <h3 className="font-medium mb-3 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Рекомендации ИИ
                </h3>
                <ul className="space-y-2">
                  {analytics.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-sm text-gray-700">{recommendation}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <Button onClick={runAnalysis} variant="outline" className="w-full">
                <Brain className="w-4 h-4 mr-2" />
                Обновить анализ
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-4">Недостаточно данных для анализа</p>
              <Button onClick={runAnalysis}>
                Запустить анализ
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MLAnalytics;
