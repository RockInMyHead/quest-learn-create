
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Plus, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AssignmentData {
  title: string;
  description: string;
  course: string;
  dueDate: string;
  instructions: string;
}

const CreateAssignmentModal = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [createdAssignment, setCreatedAssignment] = useState<{code: string, assignment: AssignmentData} | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);
  const { toast } = useToast();
  
  const [assignmentData, setAssignmentData] = useState<AssignmentData>({
    title: '',
    description: '',
    course: '',
    dueDate: '',
    instructions: ''
  });

  const generateAssignmentCode = () => {
    const prefixes = ['JS', 'REACT', 'HTML', 'CSS', 'NODE', 'PY', 'MATH', 'ENG'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const number = Math.floor(Math.random() * 999) + 1;
    return `${prefix}${number.toString().padStart(3, '0')}`;
  };

  const handleInputChange = (field: keyof AssignmentData, value: string) => {
    setAssignmentData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!assignmentData.title || !assignmentData.description || !assignmentData.course) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Симуляция создания задания
    setTimeout(() => {
      const assignmentCode = generateAssignmentCode();
      setCreatedAssignment({
        code: assignmentCode,
        assignment: assignmentData
      });
      
      toast({
        title: "Задание создано!",
        description: `Номер задания: ${assignmentCode}`
      });
      
      setIsLoading(false);
    }, 1000);
  };

  const copyToClipboard = async () => {
    if (createdAssignment) {
      try {
        await navigator.clipboard.writeText(createdAssignment.code);
        setCodeCopied(true);
        toast({
          title: "Скопировано!",
          description: "Номер задания скопирован в буфер обмена"
        });
        
        setTimeout(() => setCodeCopied(false), 2000);
      } catch (err) {
        toast({
          title: "Ошибка",
          description: "Не удалось скопировать номер",
          variant: "destructive"
        });
      }
    }
  };

  const resetForm = () => {
    setAssignmentData({
      title: '',
      description: '',
      course: '',
      dueDate: '',
      instructions: ''
    });
    setCreatedAssignment(null);
    setCodeCopied(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Создать задание</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Создать новое задание
          </DialogTitle>
          <DialogDescription>
            Создайте задание для студентов и получите уникальный номер для его распространения
          </DialogDescription>
        </DialogHeader>

        {createdAssignment ? (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">Задание успешно создано!</CardTitle>
              <CardDescription className="text-green-700">
                Номер задания для студентов:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 p-3 bg-white rounded-lg border">
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {createdAssignment.code}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="ml-auto"
                >
                  {codeCopied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">{createdAssignment.assignment.title}</h4>
                <p className="text-sm text-gray-600">{createdAssignment.assignment.description}</p>
                <div className="text-xs text-gray-500">
                  Курс: {createdAssignment.assignment.course}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={() => setCreatedAssignment(null)} variant="outline" className="flex-1">
                  Создать еще одно
                </Button>
                <Button onClick={() => setOpen(false)} className="flex-1">
                  Закрыть
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="assignment-title">Название задания *</Label>
              <Input
                id="assignment-title"
                value={assignmentData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Например: Создание интерактивного калькулятора"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignment-description">Краткое описание *</Label>
              <Input
                id="assignment-description"
                value={assignmentData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Краткое описание задания"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignment-course">Курс *</Label>
              <Select 
                value={assignmentData.course} 
                onValueChange={(value) => handleInputChange('course', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="JavaScript для начинающих">JavaScript для начинающих</SelectItem>
                  <SelectItem value="React.js Продвинутый">React.js Продвинутый</SelectItem>
                  <SelectItem value="HTML и CSS Основы">HTML и CSS Основы</SelectItem>
                  <SelectItem value="Node.js Backend">Node.js Backend</SelectItem>
                  <SelectItem value="Python Программирование">Python Программирование</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignment-due-date">Срок сдачи</Label>
              <Input
                id="assignment-due-date"
                type="date"
                value={assignmentData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignment-instructions">Подробные инструкции</Label>
              <Textarea
                id="assignment-instructions"
                value={assignmentData.instructions}
                onChange={(e) => handleInputChange('instructions', e.target.value)}
                placeholder="Подробное описание задания, требования, критерии оценки..."
                rows={4}
              />
            </div>

            <div className="flex space-x-2 pt-4">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Создание...</span>
                  </div>
                ) : (
                  'Создать задание'
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="flex-1"
              >
                Отменить
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateAssignmentModal;
