
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, User, Settings, FileText, BarChart3 } from 'lucide-react';
import Navbar from '@/components/Navbar';

const UserDashboard = () => {
  const [userCourses] = useState([
    { id: 1, title: 'JavaScript для начинающих', progress: 45, instructor: 'Мария Сидорова' },
    { id: 2, title: 'React.js Продвинутый', progress: 25, instructor: 'Алексей Смирнов' },
  ]);

  const [userAssignments] = useState([
    { id: 1, title: 'Домашнее задание 1', course: 'JavaScript для начинающих', dueDate: '2025-06-01', status: 'pending' },
    { id: 2, title: 'Тест по React', course: 'React.js Продвинутый', dueDate: '2025-05-27', status: 'completed' },
  ]);

  // Mock user for demonstration
  const currentUser = {
    name: 'Иван Петров',
    email: 'ivan@example.com',
    role: 'student' as const,
    joinDate: '15.03.2025',
    avatar: null
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={currentUser} />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Личный кабинет</h1>
            <p className="text-gray-600 mt-1">Добро пожаловать, {currentUser.name}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Badge className="mr-2">{currentUser.role === 'student' ? 'Студент' : 
              currentUser.role === 'teacher' ? 'Преподаватель' : 'Администратор'}</Badge>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Настройки
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* User Profile Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Профиль</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium">{currentUser.name}</h3>
                <p className="text-sm text-gray-600">{currentUser.email}</p>
                <p className="text-xs text-gray-500">На платформе с {currentUser.joinDate}</p>
                <Button className="w-full" variant="outline">Редактировать профиль</Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Мой прогресс</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Курсы</span>
                    <span>{userCourses.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Задания</span>
                    <span>{userAssignments.filter(a => a.status === 'completed').length}/{userAssignments.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
                <div className="pt-2">
                  <Button variant="ghost" size="sm" className="w-full">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Подробная статистика
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Уведомления</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <p className="text-sm text-blue-800">Новый материал добавлен в курс "JavaScript для начинающих"</p>
                  <p className="text-xs text-blue-600 mt-1">2 часа назад</p>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                  <p className="text-sm text-amber-800">Напоминание: Тест по React через 2 дня</p>
                  <p className="text-xs text-amber-600 mt-1">6 часов назад</p>
                </div>
                <Button variant="ghost" size="sm" className="w-full">
                  Все уведомления
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for courses and assignments */}
        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="courses">Мои курсы</TabsTrigger>
            <TabsTrigger value="assignments">Задания</TabsTrigger>
          </TabsList>
          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>Мои курсы</CardTitle>
                <CardDescription>Курсы, на которые вы записаны</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userCourses.map(course => (
                    <div key={course.id} className="p-4 border rounded-lg hover:border-blue-500 transition-all duration-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-lg">{course.title}</h3>
                          <p className="text-sm text-gray-600">Преподаватель: {course.instructor}</p>
                        </div>
                        <Badge variant="secondary">Прогресс: {course.progress}%</Badge>
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 h-2 rounded-full">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <Button size="sm">Продолжить</Button>
                        <Button size="sm" variant="outline">Подробнее</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button variant="ghost">Найти больше курсов</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="assignments">
            <Card>
              <CardHeader>
                <CardTitle>Мои задания</CardTitle>
                <CardDescription>Текущие и предстоящие задания</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userAssignments.map(assignment => (
                    <div key={assignment.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{assignment.title}</h3>
                          <p className="text-sm text-gray-600">Курс: {assignment.course}</p>
                          <p className="text-xs text-gray-500 mt-1">Срок сдачи: {assignment.dueDate}</p>
                        </div>
                        <Badge variant={assignment.status === 'completed' ? 'success' : 'secondary'}>
                          {assignment.status === 'completed' ? 'Выполнено' : 'Ожидает'}
                        </Badge>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <Button size="sm" disabled={assignment.status === 'completed'}>
                          {assignment.status === 'completed' ? 'Проверено' : 'Выполнить'}
                        </Button>
                        <Button size="sm" variant="outline">Подробнее</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;
