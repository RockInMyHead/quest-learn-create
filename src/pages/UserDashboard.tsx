import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sparkles, GraduationCap, BarChart3 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { courses } from '@/data/courses';
import { calculateCourseProgress } from '@/utils/courseProgress';
import DetailedStats from '@/components/DetailedStats';
import MLAnalytics from '@/components/MLAnalytics';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('courses');

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Привет, {user.firstName} {user.lastName}!
          </h1>
          <p className="text-gray-600">
            Добро пожаловать в личный кабинет
          </p>
        </div>

        <Tabs defaultValue="courses" className="w-full">
          <TabsList>
            <TabsTrigger value="courses" onClick={() => setActiveTab('courses')}>Курсы</TabsTrigger>
            <TabsTrigger value="stats" onClick={() => setActiveTab('stats')}>Статистика</TabsTrigger>
            <TabsTrigger value="analytics" onClick={() => setActiveTab('analytics')}>Аналитика</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-6">
          {activeTab === 'courses' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.filter(c => user.courses.includes(c.id)).map((course) => (
                <Card key={course.id} className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">{course.title}</CardTitle>
                    <CardDescription>Преподаватель: {course.teacher}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{course.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Прогресс:{' '}
                        {calculateCourseProgress(user, course.id, course.lessons)}%
                      </div>
                      <Button onClick={() => navigate(`/course/${course.id}`)}>
                        Продолжить
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {activeTab === 'stats' && <DetailedStats />}
          
          {activeTab === 'analytics' && <MLAnalytics />}

          {activeTab === 'teacher' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Создать новый курс</CardTitle>
                  <CardDescription>Начните делиться своими знаниями</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">Создайте уникальный курс и поделитесь им со студентами.</p>
                  <Button onClick={() => navigate('/create-course')}>
                    Создать курс
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
