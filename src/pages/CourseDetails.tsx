import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { courses } from '@/data/courses';
import { useAuth } from '@/context/AuthContext';

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
          <CardContent className="space-y-4">
            <p>Уровень: {course.level}</p>
            <p>Количество уроков: {course.lessons}</p>
            <Button onClick={handleEnroll} disabled={isEnrolled}>
              {isEnrolled ? 'Вы записаны' : 'Записаться на курс'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseDetails;
