
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, User, BookOpen, FileText, ArrowLeft } from 'lucide-react';

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

interface TeacherAssignmentViewProps {
  assignment: TeacherAssignment;
  onBack: () => void;
}

const TeacherAssignmentView = ({ assignment, onBack }: TeacherAssignmentViewProps) => {
  const handleStartAssignment = () => {
    console.log('Starting assignment:', assignment.id);
    // Здесь будет логика начала выполнения задания
  };

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="flex items-center"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Назад к поиску
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{assignment.code}</Badge>
                <Badge variant="outline">Задание от преподавателя</Badge>
              </div>
              <CardTitle className="text-2xl">{assignment.title}</CardTitle>
              <CardDescription className="text-base">
                {assignment.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Курс</p>
                <p className="text-sm text-gray-600">{assignment.course}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Преподаватель</p>
                <p className="text-sm text-gray-600">{assignment.teacher}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarDays className="w-4 h-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Срок сдачи</p>
                <p className="text-sm text-gray-600">{assignment.dueDate}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Инструкции к заданию
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed">
                {assignment.instructions}
              </p>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button 
              className="flex-1"
              onClick={handleStartAssignment}
            >
              Начать выполнение
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
            >
              Сохранить в мои задания
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherAssignmentView;
