export interface Course {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  level: string;
  lessons: number;
  instructor: string;
}

export const courses: Course[] = [
  {
    id: 1,
    title: 'JavaScript для начинающих',
    description: 'Основы JavaScript для новичков',
    imageUrl: 'https://via.placeholder.com/400x225',
    level: 'Начальный',
    lessons: 12,
    instructor: 'Мария Сидорова'
  },
  {
    id: 2,
    title: 'React.js Продвинутый',
    description: 'Продвинутые техники React.js',
    imageUrl: 'https://via.placeholder.com/400x225',
    level: 'Продвинутый',
    lessons: 15,
    instructor: 'Алексей Смирнов'
  },
  {
    id: 3,
    title: 'Node.js с нуля',
    description: 'Создание серверных приложений на Node.js',
    imageUrl: 'https://via.placeholder.com/400x225',
    level: 'Средний',
    lessons: 10,
    instructor: 'Иван Петров'
  }
];
