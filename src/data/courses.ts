
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
    description: 'Основы JavaScript для новичков',
    imageUrl: 'https://via.placeholder.com/400x225',
    level: 'Начальный',
    lessons: 12,
    teacher: 'Мария Сидорова',
    progress: 45,
  },
  {
    id: 2,
    title: 'React.js Продвинутый',
    description: 'Продвинутые техники React.js',
    imageUrl: 'https://via.placeholder.com/400x225',
    level: 'Продвинутый',
    lessons: 15,
    teacher: 'Алексей Смирнов',
    progress: 25,
  },
  {
    id: 3,
    title: 'Node.js с нуля',
    description: 'Создание серверных приложений на Node.js',
    imageUrl: 'https://via.placeholder.com/400x225',
    level: 'Средний',
    lessons: 10,
    teacher: 'Екатерина Петрова',
    progress: 0,
  },
];
