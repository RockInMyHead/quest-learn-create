import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { courses } from '@/utils/courses';
import { useAuth } from '@/context/AuthContext';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, enrollInCourse } = useAuth();
  const course = courses.find(c => c.id === Number(id));

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto py-20 px-4">Курс не найден</div>
      </div>
    );
  }

  const handleEnroll = () => {
    enrollInCourse(course.id);
    navigate('/dashboard');
  };

  const alreadyEnrolled = user?.courses.includes(course.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
        <img src={course.imageUrl} alt={course.title} className="w-full h-64 object-cover rounded-lg mb-6" />
        <p className="text-gray-700 mb-6">{course.description}</p>
        <p className="text-gray-600 mb-2">Уровень: {course.level}</p>
        <p className="text-gray-600 mb-6">Уроков: {course.lessons}</p>
        <div className="flex space-x-3">
          <Button onClick={handleEnroll} disabled={alreadyEnrolled}>
            {alreadyEnrolled ? 'Вы записаны' : 'Записаться на курс'}
          </Button>
          <Button variant="outline" asChild>
            <Link to="/courses">Назад</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
