
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Plus, Save } from 'lucide-react';
import Navbar from '@/components/Navbar';

const CreateCourse = () => {
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    level: '',
    duration: '',
    price: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


  const handleInputChange = (field: string, value: string) => {
    setCourseData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Симуляция создания курса
    setTimeout(() => {
      console.log('Course created:', courseData);
      setIsLoading(false);
      navigate('/courses');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BookOpen className="h-8 w-8 mr-3 text-blue-600" />
            Создать новый курс
          </h1>
          <p className="text-gray-600 mt-2">Заполните информацию о вашем курсе</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Информация о курсе</CardTitle>
            <CardDescription>
              Введите основные данные для создания курса
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Название курса</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Введите название курса"
                    value={courseData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Категория</Label>
                  <Select value={courseData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="programming">Программирование</SelectItem>
                      <SelectItem value="design">Дизайн</SelectItem>
                      <SelectItem value="marketing">Маркетинг</SelectItem>
                      <SelectItem value="business">Бизнес</SelectItem>
                      <SelectItem value="languages">Языки</SelectItem>
                      <SelectItem value="science">Наука</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Уровень сложности</Label>
                  <Select value={courseData.level} onValueChange={(value) => handleInputChange('level', value)}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Выберите уровень" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Начинающий</SelectItem>
                      <SelectItem value="intermediate">Средний</SelectItem>
                      <SelectItem value="advanced">Продвинутый</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Продолжительность (часов)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="Например: 40"
                    value={courseData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Описание курса</Label>
                <Textarea
                  id="description"
                  placeholder="Опишите содержание курса, что изучат студенты..."
                  value={courseData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                  className="min-h-32 resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Цена (руб.)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="Например: 5000"
                  value={courseData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="h-11 max-w-xs"
                />
                <p className="text-sm text-gray-600">Оставьте пустым для бесплатного курса</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button 
                  type="submit" 
                  className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Создание...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Save className="h-4 w-4" />
                      <span>Создать курс</span>
                    </div>
                  )}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 h-11"
                  onClick={() => navigate('/courses')}
                >
                  Отменить
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateCourse;
