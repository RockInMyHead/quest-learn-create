
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart3, BookOpen, CheckCircle, Clock, Trophy, TrendingUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { courses } from '@/data/courses';
import { calculateCourseProgress } from '@/utils/courseProgress';

const DetailedStats = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  const userCourses = courses.filter(c => user.courses.includes(c.id));
  const totalLessons = userCourses.reduce((acc, course) => acc + course.lessons, 0);
  const completedLessons = Object.values(user.completedLessons).flat().length;
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const getProgressCategory = (progress: number) => {
    if (progress === 0) return { label: 'Не начат', color: 'bg-gray-500' };
    if (progress < 30) return { label: 'Начальный', color: 'bg-red-500' };
    if (progress < 70) return { label: 'В процессе', color: 'bg-yellow-500' };
    if (progress < 100) return { label: 'Почти готово', color: 'bg-blue-500' };
    return { label: 'Завершен', color: 'bg-green-500' };
  };

  const coursesWithProgress = userCourses.map(course => ({
    ...course,
    progress: calculateCourseProgress(user, course.id, course.lessons)
  }));

  const completedCourses = coursesWithProgress.filter(c => c.progress === 100).length;
  const avgProgress = coursesWithProgress.length > 0 
    ? Math.round(coursesWithProgress.reduce((acc, c) => acc + c.progress, 0) / coursesWithProgress.length)
    : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Общая статистика
          </CardTitle>
          <CardDescription>Ваш прогресс обучения</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">{userCourses.length}</div>
              <div className="text-sm text-gray-600">Курсов</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-600">{completedLessons}</div>
              <div className="text-sm text-gray-600">Уроков пройдено</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-purple-600">{completedCourses}</div>
              <div className="text-sm text-gray-600">Курсов завершено</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-orange-600">{avgProgress}%</div>
              <div className="text-sm text-gray-600">Средний прогресс</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Общий прогресс</span>
              <span>{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Прогресс по курсам</CardTitle>
          <CardDescription>Детальная информация по каждому курсу</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {coursesWithProgress.map(course => {
              const category = getProgressCategory(course.progress);
              return (
                <div key={course.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium">{course.title}</h3>
                      <p className="text-sm text-gray-600">Преподаватель: {course.teacher}</p>
                    </div>
                    <Badge className={`${category.color} text-white`}>
                      {category.label}
                    </Badge>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Прогресс: {course.progress}%</span>
                      <span>{user.completedLessons[course.id]?.length || 0} из {course.lessons} уроков</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailedStats;
