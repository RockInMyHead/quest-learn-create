import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, GraduationCap, Briefcase } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { courses } from '@/data/courses';

const Courses = () => {
  const { user } = useAuth();

  // данные курсов импортируются из отдельного файла

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-900">Курсы</h1>
            <p className="mt-2 text-gray-600">Выберите курс для начала обучения</p>
          </div>
          {user && (user.role === 'teacher' || user.role === 'admin') ? (
            <Link to="/create-course">
              <Button>
                <Briefcase className="mr-2 h-4 w-4" />
                Создать курс
              </Button>
            </Link>
          ) : null}
        </div>

        <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img src={course.imageUrl} alt={course.title} className="w-full h-48 object-cover" />
              <CardHeader>
                <CardTitle className="text-lg font-semibold">{course.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <CardDescription className="text-sm text-gray-600">{course.description}</CardDescription>
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center text-gray-500">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    {course.level}
                  </div>
                  <div className="flex items-center text-gray-500">
                    <BookOpen className="mr-2 h-4 w-4" />
                    {course.lessons} уроков
                  </div>
                </div>
                <Button className="mt-4 w-full" asChild>
                  <Link to={`/courses/${course.id}`}>Подробнее</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
