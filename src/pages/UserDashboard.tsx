
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, User, FileText, Play, Plus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ProfileSettingsModal from '@/components/ProfileSettingsModal';
import StatsModal from '@/components/StatsModal';
import AssignmentCodeInput from '@/components/AssignmentCodeInput';
import TeacherAssignmentView from '@/components/TeacherAssignmentView';
import CreateAssignmentModal from '@/components/CreateAssignmentModal';
import { useAuth } from '@/context/AuthContext';
import { calculateCourseProgress } from '@/utils/courseProgress';
import { courses } from '@/data/courses';

const UserDashboard = () => {
  const { user: currentUser } = useAuth();
  const userCourses = courses.filter(c => currentUser?.courses.includes(c.id));
  const [selectedTeacherAssignment, setSelectedTeacherAssignment] = useState(null);

  const [userAssignments] = useState([
    { id: 1, title: 'Домашнее задание 1', course: 'JavaScript для начинающих', dueDate: '2025-06-01', status: 'pending' },
    { id: 2, title: 'Тест по React', course: 'React.js Продвинутый', dueDate: '2025-05-27', status: 'completed' },
  ]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-20 text-center text-gray-700">
          Для доступа к личному кабинету необходимо войти в систему
        </div>
      </div>
    );
  }

  // Вычисляем общую статистику
  const totalLessons = userCourses.reduce((acc, course) => acc + course.lessons, 0);
  const completedLessons = Object.values(currentUser.completedLessons).flat().length;
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const completedAssignments = userAssignments.filter(a => a.status === 'completed').length;
  const assignmentProgress = userAssignments.length > 0 ? Math.round((completedAssignments / userAssignments.length) * 100) : 0;

  const handleAssignmentFound = (assignment) => {
    setSelectedTeacherAssignment(assignment);
  };

  const handleBackToSearch = () => {
    setSelectedTeacherAssignment(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Личный кабинет</h1>
            <p className="text-gray-600 mt-1">Добро пожаловать, {currentUser.name}</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <Badge className="mr-2">{currentUser.role === 'student' ? 'Студент' : 
              currentUser.role === 'teacher' ? 'Преподаватель' : 'Администратор'}</Badge>
            <ProfileSettingsModal />
            {currentUser.role === 'teacher' && (
              <>
                <CreateAssignmentModal />
                <Button size="sm" asChild>
                  <Link to="/create-course">
                    <Plus className="w-4 h-4 mr-2" />
                    Создать курс
                  </Link>
                </Button>
              </>
            )}
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
                <ProfileSettingsModal />
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
                    <span>Общий прогресс</span>
                    <span>{overallProgress}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">{completedLessons} из {totalLessons} уроков</p>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Задания</span>
                    <span>{assignmentProgress}%</span>
                  </div>
                  <Progress value={assignmentProgress} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">{completedAssignments} из {userAssignments.length} заданий</p>
                </div>
                <div className="pt-2">
                  <StatsModal />
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
                <div className="space-y-6">
                  {userCourses.map(course => {
                    const progress = calculateCourseProgress(currentUser, course.id, course.lessons);
                    return (
                      <div key={course.id} className="p-6 border rounded-lg hover:border-blue-500 transition-all duration-200 bg-white">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-medium text-lg text-gray-900">{course.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">Преподаватель: {course.teacher}</p>
                          </div>
                          <Badge variant="secondary">Записан</Badge>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Прогресс: {progress}%</span>
                            <span className="text-gray-600">{course.lessons} уроков</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                        
                        <div className="flex space-x-3">
                          <Button size="sm" className="flex-1" asChild>
                            <Link to={`/courses/${course.id}/learn`}>
                              <Play className="w-4 h-4 mr-2" />
                              Продолжить
                            </Link>
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1" asChild>
                            <Link to={`/courses/${course.id}`}>
                              <BookOpen className="w-4 h-4 mr-2" />
                              Подробнее
                            </Link>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 text-center">
                  <Button variant="ghost" asChild>
                    <Link to="/courses">Найти больше курсов</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="assignments">
            <div className="space-y-6">
              {currentUser.role === 'teacher' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Управление заданиями</CardTitle>
                    <CardDescription>Создавайте задания для студентов</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <CreateAssignmentModal />
                      <Button variant="outline" asChild>
                        <Link to="/teacher/assignments">
                          <FileText className="w-4 h-4 mr-2" />
                          Мои задания
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {selectedTeacherAssignment ? (
                <TeacherAssignmentView 
                  assignment={selectedTeacherAssignment}
                  onBack={handleBackToSearch}
                />
              ) : (
                <AssignmentCodeInput onAssignmentFound={handleAssignmentFound} />
              )}
              
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
                          <Badge variant={assignment.status === 'completed' ? 'default' : 'secondary'}>
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
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;
