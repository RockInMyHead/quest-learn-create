
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { courses } from '@/data/courses';
import { useAuth } from '@/context/AuthContext';
import { User, BookOpen, Clock } from 'lucide-react';

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, enroll } = useAuth();

  const course = courses.find((c) => c.id === Number(id));
  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-20 text-center">Курс не найден</div>
      </div>
    );
  }

  const isEnrolled = user?.courses?.includes(course.id);

  const handleEnroll = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!isEnrolled) {
      enroll(course.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Card>
          <img src={course.imageUrl} alt={course.title} className="w-full h-64 object-cover" />
          <CardHeader>
            <CardTitle>{course.title}</CardTitle>
            <CardDescription>{course.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">Преподаватель: {course.teacher}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">Уровень: {course.level}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">Количество уроков: {course.lessons}</span>
                </div>
              </div>
              
              {isEnrolled && course.progress !== undefined && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Ваш прогресс</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-3" />
                </div>
              )}
            </div>
            
            <Button onClick={handleEnroll} disabled={isEnrolled} className="w-full md:w-auto">
              {isEnrolled ? 'Вы записаны' : 'Записаться на курс'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseDetails;
