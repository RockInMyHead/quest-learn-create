
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Search, Clock, Users, Star, Plus } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Временные данные курсов
  const [courses] = useState([
    {
      id: 1,
      title: 'JavaScript для начинающих',
      description: 'Изучите основы JavaScript с нуля. Переменные, функции, объекты и многое другое.',
      teacher: 'Мария Сидорова',
      duration: '40 часов',
      students: 156,
      rating: 4.8,
      price: 4500,
      level: 'Начинающий',
      category: 'Программирование',
      image: '/placeholder.svg'
    },
    {
      id: 2,
      title: 'React.js Продвинутый',
      description: 'Глубокое изучение React.js, хуки, контекст, оптимизация производительности.',
      teacher: 'Алексей Петров',
      duration: '60 часов',
      students: 89,
      rating: 4.9,
      price: 7500,
      level: 'Продвинутый',
      category: 'Программирование',
      image: '/placeholder.svg'
    },
    {
      id: 3,
      title: 'Основы дизайна',
      description: 'Принципы дизайна, композиция, цветовая теория и работа в Figma.',
      teacher: 'Елена Козлова',
      duration: '30 часов',
      students: 124,
      rating: 4.7,
      price: 0,
      level: 'Начинающий',
      category: 'Дизайн',
      image: '/placeholder.svg'
    }
  ]);

  const currentUser = {
    name: 'Иван Петров',
    role: 'student' as const
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={currentUser} />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Курсы</h1>
              <p className="text-gray-600 mt-2">Выберите курс для изучения новых навыков</p>
            </div>
            
            {(currentUser.role === 'teacher' || currentUser.role === 'admin') && (
              <Link to="/create-course">
                <Button className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Создать курс
                </Button>
              </Link>
            )}
          </div>
          
          {/* Поиск */}
          <div className="mt-6 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Поиск курсов..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
          </div>
        </div>

        {/* Сетка курсов */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow duration-200 overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-white" />
              </div>
              
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{course.category}</Badge>
                  <Badge variant={course.level === 'Начинающий' ? 'default' : course.level === 'Средний' ? 'secondary' : 'destructive'}>
                    {course.level}
                  </Badge>
                </div>
                
                <CardTitle className="text-xl mb-2">{course.title}</CardTitle>
                <CardDescription className="text-sm line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    Преподаватель: <span className="font-medium">{course.teacher}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{course.students}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-lg font-bold text-gray-900">
                      {course.price === 0 ? 'Бесплатно' : `${course.price.toLocaleString()} ₽`}
                    </div>
                    
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Записаться
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Курсы не найдены</h3>
            <p className="text-gray-600">Попробуйте изменить поисковый запрос</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
