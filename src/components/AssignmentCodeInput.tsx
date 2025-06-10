
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TeacherAssignment {
  id: string;
  code: string;
  title: string;
  description: string;
  course: string;
  teacher: string;
  dueDate: string;
  instructions: string;
}

// Мок данные заданий от учителей
const teacherAssignments: TeacherAssignment[] = [
  {
    id: '1',
    code: 'JS001',
    title: 'Создание интерактивного калькулятора',
    description: 'Разработайте калькулятор с использованием HTML, CSS и JavaScript',
    course: 'JavaScript для начинающих',
    teacher: 'Мария Сидорова',
    dueDate: '2025-06-20',
    instructions: 'Создайте калькулятор, который может выполнять базовые арифметические операции. Используйте DOM для взаимодействия с пользователем.'
  },
  {
    id: '2',
    code: 'REACT15',
    title: 'Компонент списка задач',
    description: 'Создайте компонент Todo List с использованием React хуков',
    course: 'React.js Продвинутый',
    teacher: 'Алексей Смирнов',
    dueDate: '2025-06-25',
    instructions: 'Разработайте полнофункциональный Todo List с возможностью добавления, удаления и отметки выполненных задач.'
  }
];

interface AssignmentCodeInputProps {
  onAssignmentFound: (assignment: TeacherAssignment) => void;
}

const AssignmentCodeInput = ({ onAssignmentFound }: AssignmentCodeInputProps) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите номер задания",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Симуляция поиска задания
    setTimeout(() => {
      const assignment = teacherAssignments.find(a => a.code.toLowerCase() === code.toLowerCase());
      
      if (assignment) {
        onAssignmentFound(assignment);
        toast({
          title: "Задание найдено!",
          description: `Открыто задание: ${assignment.title}`
        });
      } else {
        toast({
          title: "Задание не найдено",
          description: "Проверьте правильность введенного номера",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Найти задание по номеру
        </CardTitle>
        <CardDescription>
          Введите номер задания, полученный от преподавателя
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="assignment-code">Номер задания</Label>
            <Input
              id="assignment-code"
              type="text"
              placeholder="Например: JS001, REACT15"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="uppercase"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Поиск...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4" />
                <span>Найти задание</span>
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AssignmentCodeInput;
