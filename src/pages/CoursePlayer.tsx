import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Quiz from '@/components/Quiz';
import FormattedContent from '@/components/FormattedContent';
import { courses } from '@/data/courses';
import { useAuth } from '@/context/AuthContext';
import { calculateCourseProgress, isLessonCompleted } from '@/utils/courseProgress';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle, Play, FileText, Brain } from 'lucide-react';

interface Lesson {
  id: number;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'theory';
  content: string;
  duration?: string;
  imageUrl?: string;
  quiz?: {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
}

const CoursePlayer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, markLessonCompleted } = useAuth();

  const course = courses.find((c) => c.id === Number(id));
  
  const [lessons] = useState<Lesson[]>([
    {
      id: 1,
      title: 'Введение в JavaScript',
      type: 'video',
      content: 'JavaScript — это мощный язык программирования, который используется для создания интерактивных веб-страниц. Он был создан в 1995 году Бренданом Эйхом в компании Netscape.\n\nОсновные возможности JavaScript:\n• Динамическая типизация\n• Прототипное наследование\n• Функции первого класса\n• Асинхронное программирование\n\nJavaScript выполняется в браузере и позволяет:\n- Изменять содержимое страницы\n- Реагировать на действия пользователя\n- Отправлять запросы на сервер\n- Создавать анимации и эффекты',
      duration: '15 мин',
      imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=300&fit=crop',
    },
    {
      id: 2,
      title: 'Переменные и типы данных',
      type: 'theory',
      content: 'В JavaScript существует несколько способов объявления переменных:\n\n**var** - устаревший способ (не рекомендуется)\n```javascript\nvar name = "Иван";\n```\n\n**let** - для изменяемых переменных\n```javascript\nlet age = 25;\nage = 26; // можно изменить\n```\n\n**const** - для константных значений\n```javascript\nconst PI = 3.14159;\n// PI = 3.14; // ошибка!\n```\n\n**Основные типы данных:**\n\n1. **Number** - числа\n```javascript\nlet integer = 42;\nlet float = 3.14;\nlet negative = -10;\n```\n\n2. **String** - строки\n```javascript\nlet greeting = "Привет";\nlet name = \'Мария\';\nlet template = `Привет, ${name}!`;\n```\n\n3. **Boolean** - логический тип\n```javascript\nlet isActive = true;\nlet isCompleted = false;\n```\n\n4. **Array** - массивы\n```javascript\nlet numbers = [1, 2, 3, 4, 5];\nlet fruits = ["яблоко", "банан", "апельсин"];\n```\n\n5. **Object** - объекты\n```javascript\nlet person = {\n  name: "Анна",\n  age: 30,\n  city: "Москва"\n};\n```',
      duration: '20 мин',
    },
    {
      id: 3,
      title: 'Функции в JavaScript',
      type: 'theory',
      content: 'Функции — это блоки кода, которые можно многократно использовать. Они помогают организовать код и избежать повторений.\n\n**Объявление функции:**\n```javascript\nfunction greet(name) {\n  return "Привет, " + name + "!";\n}\n\nlet message = greet("Мария"); // "Привет, Мария!"\n```\n\n**Функциональные выражения:**\n```javascript\nconst add = function(a, b) {\n  return a + b;\n};\n\nlet result = add(5, 3); // 8\n```\n\n**Стрелочные функции (ES6):**\n```javascript\nconst multiply = (a, b) => a * b;\n\nconst square = x => x * x;\n\nconst sayHello = () => "Привет!";\n```\n\n**Параметры по умолчанию:**\n```javascript\nfunction createUser(name, role = "user") {\n  return {\n    name: name,\n    role: role\n  };\n}\n\nlet user1 = createUser("Анна"); // role будет "user"\nlet user2 = createUser("Петр", "admin");\n```\n\n**Области видимости:**\n```javascript\nlet globalVar = "Глобальная";\n\nfunction myFunction() {\n  let localVar = "Локальная";\n  console.log(globalVar); // доступна\n  console.log(localVar);  // доступна\n}\n\n// console.log(localVar); // ошибка!\n```',
      duration: '25 мин',
      imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=300&fit=crop',
    },
    {
      id: 4,
      title: 'Тест: Основы JavaScript',
      type: 'quiz',
      content: 'Проверим ваши знания по основам JavaScript. Ответьте на вопросы, чтобы закрепить изученный материал.',
      duration: '10 мин',
      quiz: [
        {
          id: 1,
          question: 'Какой из способов объявления переменной рекомендуется использовать для константных значений?',
          options: ['var', 'let', 'const', 'function'],
          correctAnswer: 2,
          explanation: 'const используется для объявления константных значений, которые нельзя переопределить после инициализации.'
        },
        {
          id: 2,
          question: 'Какой тип данных будет у переменной: let age = 25;',
          options: ['string', 'number', 'boolean', 'object'],
          correctAnswer: 1,
          explanation: 'Значение 25 является числом, поэтому тип данных будет number.'
        },
        {
          id: 3,
          question: 'Что выведет код: console.log(typeof "Hello");',
          options: ['string', 'text', 'char', 'object'],
          correctAnswer: 0,
          explanation: 'Оператор typeof возвращает "string" для строковых значений.'
        },
        {
          id: 4,
          question: 'Какая из стрелочных функций написана правильно?',
          options: [
            'const func = => x * 2;',
            'const func = x => x * 2;',
            'const func = (x) => { x * 2 }',
            'const func = x -> x * 2;'
          ],
          correctAnswer: 1,
          explanation: 'Правильный синтаксис стрелочной функции: const func = x => x * 2; Параметр указывается перед =>, а после идет тело функции.'
        },
        {
          id: 5,
          question: 'Что такое область видимости (scope) в JavaScript?',
          options: [
            'Размер переменной в памяти',
            'Область кода, где переменная доступна',
            'Тип данных переменной',
            'Скорость выполнения функции'
          ],
          correctAnswer: 1,
          explanation: 'Область видимости определяет, в какой части кода переменная доступна для использования.'
        }
      ]
    },
    {
      id: 5,
      title: 'DOM-манипуляции',
      type: 'theory',
      content: 'DOM (Document Object Model) — это представление HTML-документа в виде дерева объектов, которое JavaScript может изменять.\n\n**Поиск элементов:**\n```javascript\n// По ID\nlet element = document.getElementById("myId");\n\n// По классу\nlet elements = document.getElementsByClassName("myClass");\n\n// По селектору CSS\nlet element = document.querySelector(".myClass");\nlet elements = document.querySelectorAll("div");\n```\n\n**Изменение содержимого:**\n```javascript\n// Изменить текст\nelement.textContent = "Новый текст";\n\n// Изменить HTML\nelement.innerHTML = "<strong>Жирный текст</strong>";\n\n// Изменить атрибуты\nelement.setAttribute("src", "image.jpg");\nelement.className = "new-class";\n```\n\n**Создание новых элементов:**\n```javascript\n// Создать элемент\nlet newDiv = document.createElement("div");\nnewDiv.textContent = "Новый блок";\nnewDiv.className = "my-div";\n\n// Добавить на страницу\ndocument.body.appendChild(newDiv);\n```\n\n**Обработка событий:**\n```javascript\n// Клик по кнопке\nlet button = document.querySelector("button");\nbutton.addEventListener("click", function() {\n  alert("Кнопка нажата!");\n});\n\n// Ввод в поле\nlet input = document.querySelector("input");\ninput.addEventListener("input", function(event) {\n  console.log("Введено:", event.target.value);\n});\n```',
      duration: '30 мин',
      imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=300&fit=crop',
    },
    {
      id: 6,
      title: 'Итоговый тест',
      type: 'quiz',
      content: 'Финальный тест по всему пройденному материалу.',
      duration: '15 мин',
      quiz: [
        {
          id: 1,
          question: 'Как правильно добавить обработчик события клика?',
          options: [
            'element.onClick = function() {};',
            'element.addEventListener("click", function() {});',
            'element.addEvent("click", function() {});',
            'element.on("click", function() {};'
          ],
          correctAnswer: 1,
          explanation: 'Метод addEventListener() — это стандартный способ добавления обработчиков событий в современном JavaScript.'
        },
        {
          id: 2,
          question: 'Что вернет document.querySelector(".example")?',
          options: [
            'Все элементы с классом example',
            'Первый элемент с классом example',
            'Последний элемент с классом example',
            'Ошибку'
          ],
          correctAnswer: 1,
          explanation: 'querySelector() возвращает первый найденный элемент, соответствующий указанному CSS-селектору.'
        },
        {
          id: 3,
          question: 'В чем разница между textContent и innerHTML?',
          options: [
            'Никакой разницы нет',
            'textContent работает быстрее',
            'innerHTML может содержать HTML-теги, textContent — только текст',
            'textContent устарел'
          ],
          correctAnswer: 2,
          explanation: 'innerHTML позволяет вставлять HTML-разметку, а textContent работает только с текстом и безопаснее от XSS-атак.'
        }
      ]
    }
  ]);

  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [lessonStartTime, setLessonStartTime] = useState<Date | null>(null);
  const currentLesson = lessons[currentLessonIndex];
  const progressPercentage = calculateCourseProgress(user, Number(id), lessons.length);

  // Отслеживание времени начала урока
  React.useEffect(() => {
    setLessonStartTime(new Date());
  }, [currentLessonIndex]);

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-20 text-center">Курс не найден</div>
      </div>
    );
  }

  if (!user?.courses.includes(course.id)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-20 text-center">
          <p className="text-gray-600 mb-4">Вы не записаны на этот курс</p>
          <Button onClick={() => navigate(`/courses/${course.id}`)}>
            Перейти к описанию курса
          </Button>
        </div>
      </div>
    );
  }

  const handleNextLesson = () => {
    // Записываем время завершения урока
    if (lessonStartTime && user) {
      const timeSpent = Math.round((new Date().getTime() - lessonStartTime.getTime()) / (1000 * 60));
      console.log(`Lesson ${currentLesson.id} completed in ${timeSpent} minutes`);
      // Здесь можно сохранить данные о времени изучения урока
    }
    
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const handleMarkCompleted = () => {
    // Записываем время завершения урока
    if (lessonStartTime && user) {
      const timeSpent = Math.round((new Date().getTime() - lessonStartTime.getTime()) / (1000 * 60));
      console.log(`Lesson ${currentLesson.id} marked as completed after ${timeSpent} minutes`);
      // Здесь можно сохранить данные о времени изучения урока
    }
    
    markLessonCompleted(course.id, currentLesson.id);
  };

  const handleQuizComplete = () => {
    const timeSpent = lessonStartTime 
      ? Math.round((new Date().getTime() - lessonStartTime.getTime()) / (1000 * 60))
      : 0;
    
    console.log(`Quiz completed, time spent: ${timeSpent} minutes`);
    
    markLessonCompleted(course.id, currentLesson.id);
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="w-4 h-4" />;
      case 'text':
        return <BookOpen className="w-4 h-4" />;
      case 'quiz':
        return <FileText className="w-4 h-4" />;
      case 'theory':
        return <Brain className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getLessonTypeName = (type: string) => {
    switch (type) {
      case 'video':
        return 'Видео';
      case 'text':
        return 'Текст';
      case 'quiz':
        return 'Тест';
      case 'theory':
        return 'Теория';
      default:
        return 'Урок';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к курсам
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
          <p className="text-gray-600">Преподаватель: {course.teacher}</p>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Прогресс курса</span>
              <span>{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Содержание курса</CardTitle>
                <CardDescription>
                  {user?.completedLessons[course.id]?.length || 0} из {lessons.length} уроков завершено
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {lessons.map((lesson, index) => (
                    <button
                      key={lesson.id}
                      onClick={() => setCurrentLessonIndex(index)}
                      className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        index === currentLessonIndex ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getLessonIcon(lesson.type)}
                          <div>
                            <p className="font-medium text-sm">{lesson.title}</p>
                            <p className="text-xs text-gray-500">{lesson.duration}</p>
                          </div>
                        </div>
                        {isLessonCompleted(user, course.id, lesson.id) && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      {getLessonIcon(currentLesson.type)}
                      <span>{currentLesson.title}</span>
                    </CardTitle>
                    <CardDescription>
                      <Badge variant="secondary" className="mt-2">
                        {getLessonTypeName(currentLesson.type)}
                      </Badge>
                    </CardDescription>
                  </div>
                  {isLessonCompleted(user, course.id, currentLesson.id) && (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-8">
                  {currentLesson.type === 'video' && (
                    <>
                      <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                        {currentLesson.imageUrl ? (
                          <>
                            <img 
                              src={currentLesson.imageUrl} 
                              alt={currentLesson.title}
                              className="w-full h-full object-cover opacity-70"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                              <div className="text-center text-white">
                                <Play className="w-16 h-16 mx-auto mb-4" />
                                <p className="text-lg font-semibold">Видео урок: {currentLesson.title}</p>
                                <p className="text-sm opacity-75">Продолжительность: {currentLesson.duration}</p>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-center text-white">
                            <Play className="w-16 h-16 mx-auto mb-4" />
                            <p>Видео урок: {currentLesson.title}</p>
                            <p className="text-sm opacity-75">Продолжительность: {currentLesson.duration}</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {currentLesson.type === 'theory' && currentLesson.imageUrl && (
                    <div className="mb-6">
                      <img 
                        src={currentLesson.imageUrl} 
                        alt={currentLesson.title}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {currentLesson.type === 'quiz' ? (
                    <div className="mb-6">
                      {currentLesson.quiz && (
                        <Quiz 
                          questions={currentLesson.quiz} 
                          lessonId={currentLesson.id}
                          courseId={course.id}
                          onComplete={handleQuizComplete}
                        />
                      )}
                    </div>
                  ) : (
                    <FormattedContent content={currentLesson.content} />
                  )}
                </div>

                {currentLesson.type !== 'quiz' && !isLessonCompleted(user, course.id, currentLesson.id) && (
                  <div className="mb-6">
                    <Button onClick={handleMarkCompleted} className="w-full">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Отметить как завершенный
                    </Button>
                  </div>
                )}

                <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={handlePrevLesson}
                    disabled={currentLessonIndex === 0}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Предыдущий урок
                  </Button>
                  
                  <div className="text-sm text-gray-500">
                    {currentLessonIndex + 1} из {lessons.length}
                  </div>
                  
                  <Button
                    onClick={handleNextLesson}
                    disabled={currentLessonIndex === lessons.length - 1}
                  >
                    Следующий урок
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
