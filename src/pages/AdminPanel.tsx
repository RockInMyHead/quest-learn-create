
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, ClipboardList, Settings, BarChart3, UserCheck, UserX } from 'lucide-react';
import Navbar from '@/components/Navbar';

const AdminPanel = () => {
  // Временные данные для демонстрации
  const [users] = useState([
    { id: 1, name: 'Иван Петров', email: 'ivan@example.com', role: 'student', status: 'active' },
    { id: 2, name: 'Мария Сидорова', email: 'maria@example.com', role: 'teacher', status: 'active' },
    { id: 3, name: 'Алексей Смирнов', email: 'alex@example.com', role: 'student', status: 'inactive' },
  ]);

  const [courses] = useState([
    { id: 1, title: 'JavaScript для начинающих', teacher: 'Мария Сидорова', students: 25, status: 'active' },
    { id: 2, title: 'React.js Продвинутый', teacher: 'Мария Сидорова', students: 15, status: 'draft' },
  ]);

  const stats = {
    totalUsers: users.length,
    totalCourses: courses.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    totalTests: 8
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Панель администратора</h1>
          <p className="text-gray-600 mt-2">Управление пользователями, курсами и системой</p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Всего пользователей</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Активные пользователи</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Курсы</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
                </div>
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Тесты</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalTests}</p>
                </div>
                <ClipboardList className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Табы управления */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Пользователи</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Курсы</span>
            </TabsTrigger>
            <TabsTrigger value="tests" className="flex items-center space-x-2">
              <ClipboardList className="h-4 w-4" />
              <span>Тесты</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Аналитика</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Управление пользователями</CardTitle>
                <CardDescription>
                  Просмотр и управление всеми пользователями системы
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="font-medium">{user.name}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <Badge variant={user.role === 'teacher' ? 'default' : 'secondary'}>
                          {user.role === 'teacher' ? 'Преподаватель' : 'Студент'}
                        </Badge>
                        <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                          {user.status === 'active' ? 'Активен' : 'Неактивен'}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Редактировать</Button>
                        <Button variant="destructive" size="sm">
                          <UserX className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>Управление курсами</CardTitle>
                <CardDescription>
                  Просмотр всех курсов и управление ими
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{course.title}</h3>
                        <p className="text-sm text-gray-600">Преподаватель: {course.teacher}</p>
                        <p className="text-sm text-gray-600">Студентов: {course.students}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
                          {course.status === 'active' ? 'Активен' : 'Черновик'}
                        </Badge>
                        <Button variant="outline" size="sm">Редактировать</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tests">
            <Card>
              <CardHeader>
                <CardTitle>Управление тестами</CardTitle>
                <CardDescription>
                  Просмотр и управление контрольными работами
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Тесты будут здесь</h3>
                  <p className="text-gray-600">Функционал управления тестами будет добавлен в следующих версиях</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Аналитика</CardTitle>
                <CardDescription>
                  Статистика использования платформы
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Аналитика в разработке</h3>
                  <p className="text-gray-600">Детальная аналитика будет добавлена в следующих версиях</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
