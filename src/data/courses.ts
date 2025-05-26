
export interface Course {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  level: string;
  lessons: number;
  teacher: string;
  progress?: number;
}

export const courses: Course[] = [
  {
    id: 1,
    title: 'JavaScript для начинающих',
    description: 'Полный курс по основам JavaScript: переменные, функции, объекты, DOM-манипуляции и современные возможности ES6+. Изучите основы программирования и создайте свои первые интерактивные веб-приложения.',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=225&fit=crop',
    level: 'Начальный',
    lessons: 12,
    teacher: 'Мария Сидорова',
    progress: 45,
  },
  {
    id: 2,
    title: 'React.js Продвинутый',
    description: 'Углубленное изучение React.js: хуки, контекст, производительность, тестирование. Научитесь создавать масштабируемые приложения с современными подходами и лучшими практиками разработки.',
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=225&fit=crop',
    level: 'Продвинутый',
    lessons: 15,
    teacher: 'Алексей Смирнов',
    progress: 25,
  },
  {
    id: 3,
    title: 'Node.js с нуля',
    description: 'Создание серверных приложений на Node.js: Express.js, работа с базами данных, API, аутентификация и деплой. Станьте полноценным backend-разработчиком.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop',
    level: 'Средний',
    lessons: 10,
    teacher: 'Екатерина Петрова',
    progress: 0,
  },
];
