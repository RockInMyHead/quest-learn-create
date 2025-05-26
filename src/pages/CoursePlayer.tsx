
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import { courses } from '@/data/courses';
import { useAuth } from '@/context/AuthContext';
import { calculateCourseProgress, isLessonCompleted } from '@/utils/courseProgress';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle, Play, FileText } from 'lucide-react';

interface Lesson {
  id: number;
  title: string;
  type: 'video' | 'text' | 'quiz';
  content: string;
  duration?: string;
}

const CoursePlayer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, markLessonCompleted } = useAuth();

  const course = courses.find((c) => c.id === Number(id));
  
  // Мок-данные уроков
  const [lessons] = useState<Lesson[]>([
    {
      id: 1,
      title: 'Введение в JavaScript',
      type: 'video',
      content: 'В этом уроке мы изучим основы JavaScript, его историю и применение. JavaScript — это мощный язык программирования, который используется для создания интерактивных веб-страниц.',
      duration: '15 мин',
    },
    {
      id: 2,
      title: 'Переменные и типы данных',
      type: 'text',
      content: 'Изучаем как объявлять переменные и работать с различными типами данных в JavaScript. В JavaScript есть несколько способов объявления переменных: var, let, const.',
      duration: '20 мин',
    },
    {
      id: 3,
      title: 'Функции',
      type: 'video',
      content: 'Как создавать и использовать функции в JavaScript. Функции — это блоки кода, которые можно многократно использовать.',
      duration: '25 мин',
    },
    {
      id: 4,
      title: 'Тест: Основы JavaScript',
      type: 'quiz',
      content: 'Проверим ваши знания по основам JavaScript. Ответьте на вопросы, чтобы закрепить изученный материал.',
      duration: '10 мин',
    },
  ]);

  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const currentLesson = lessons[currentLessonIndex];
  const progressPercentage = calculateCourseProgress(user, Number(id), lessons.length);

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-20 text-center">Курс не найден</div>
      </div>
    );
  }

  if (!user?.courses.includes(course.id)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-20 text-center">
          <p className="text-gray-600 mb-4">Вы не записаны на этот курс</p>
          <Button onClick={() => navigate(`/courses/${course.id}`)}>
            Перейти к описанию курса
          </Button>
        </div>
      </div>
    );
  }

  const handleNextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const handleMarkCompleted = () => {
    markLessonCompleted(course.id, currentLesson.id);
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="w-4 h-4" />;
      case 'text':
        return <BookOpen className="w-4 h-4" />;
      case 'quiz':
        return <FileText className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к курсам
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
          <p className="text-gray-600">Преподаватель: {course.teacher}</p>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Прогресс курса</span>
              <span>{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with lessons */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Содержание курса</CardTitle>
                <CardDescription>
                  {user?.completedLessons[course.id]?.length || 0} из {lessons.length} уроков завершено
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {lessons.map((lesson, index) => (
                    <button
                      key={lesson.id}
                      onClick={() => setCurrentLessonIndex(index)}
                      className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        index === currentLessonIndex ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getLessonIcon(lesson.type)}
                          <div>
                            <p className="font-medium text-sm">{lesson.title}</p>
                            <p className="text-xs text-gray-500">{lesson.duration}</p>
                          </div>
                        </div>
                        {isLessonCompleted(user, course.id, lesson.id) && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      {getLessonIcon(currentLesson.type)}
                      <span>{currentLesson.title}</span>
                    </CardTitle>
                    <CardDescription>
                      <Badge variant="secondary" className="mt-2">
                        {currentLesson.type === 'video' ? 'Видео' : 
                         currentLesson.type === 'text' ? 'Текст' : 'Тест'}
                      </Badge>
                    </CardDescription>
                  </div>
                  {isLessonCompleted(user, course.id, currentLesson.id) && (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {/* Lesson content */}
                <div className="mb-8">
                  {currentLesson.type === 'video' && (
                    <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center text-white">
                        <Play className="w-16 h-16 mx-auto mb-4" />
                        <p>Видео урок: {currentLesson.title}</p>
                        <p className="text-sm opacity-75">Продолжительность: {currentLesson.duration}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">{currentLesson.content}</p>
                  </div>
                </div>

                {/* Mark as completed button */}
                {!isLessonCompleted(user, course.id, currentLesson.id) && (
                  <div className="mb-6">
                    <Button onClick={handleMarkCompleted} className="w-full">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Отметить как завершенный
                    </Button>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={handlePrevLesson}
                    disabled={currentLessonIndex === 0}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Предыдущий урок
                  </Button>
                  
                  <div className="text-sm text-gray-500">
                    {currentLessonIndex + 1} из {lessons.length}
                  </div>
                  
                  <Button
                    onClick={handleNextLesson}
                    disabled={currentLessonIndex === lessons.length - 1}
                  >
                    Следующий урок
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
