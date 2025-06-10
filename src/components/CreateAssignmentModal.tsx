
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Plus, Copy, Check, Trash2, GripVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FormField {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'file';
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

interface AssignmentData {
  title: string;
  description: string;
  course: string;
  dueDate: string;
  instructions: string;
  formFields: FormField[];
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
    instructions: '',
    formFields: []
  });

  const generateAssignmentCode = () => {
    const prefixes = ['JS', 'REACT', 'HTML', 'CSS', 'NODE', 'PY', 'MATH', 'ENG'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const number = Math.floor(Math.random() * 999) + 1;
    return `${prefix}${number.toString().padStart(3, '0')}`;
  };

  const generateFieldId = () => {
    return 'field_' + Math.random().toString(36).substr(2, 9);
  };

  const addFormField = (type: FormField['type']) => {
    const newField: FormField = {
      id: generateFieldId(),
      type,
      label: '',
      required: false,
      ...(type === 'select' || type === 'radio' || type === 'checkbox' ? { options: [''] } : {}),
      ...(type === 'text' || type === 'textarea' ? { placeholder: '' } : {})
    };
    
    setAssignmentData(prev => ({
      ...prev,
      formFields: [...prev.formFields, newField]
    }));
  };

  const updateFormField = (fieldId: string, updates: Partial<FormField>) => {
    setAssignmentData(prev => ({
      ...prev,
      formFields: prev.formFields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  const deleteFormField = (fieldId: string) => {
    setAssignmentData(prev => ({
      ...prev,
      formFields: prev.formFields.filter(field => field.id !== fieldId)
    }));
  };

  const addOption = (fieldId: string) => {
    setAssignmentData(prev => ({
      ...prev,
      formFields: prev.formFields.map(field => 
        field.id === fieldId && field.options 
          ? { ...field, options: [...field.options, ''] }
          : field
      )
    }));
  };

  const updateOption = (fieldId: string, optionIndex: number, value: string) => {
    setAssignmentData(prev => ({
      ...prev,
      formFields: prev.formFields.map(field => 
        field.id === fieldId && field.options
          ? { 
              ...field, 
              options: field.options.map((opt, idx) => idx === optionIndex ? value : opt)
            }
          : field
      )
    }));
  };

  const removeOption = (fieldId: string, optionIndex: number) => {
    setAssignmentData(prev => ({
      ...prev,
      formFields: prev.formFields.map(field => 
        field.id === fieldId && field.options && field.options.length > 1
          ? { 
              ...field, 
              options: field.options.filter((_, idx) => idx !== optionIndex)
            }
          : field
      )
    }));
  };

  const handleInputChange = (field: keyof Omit<AssignmentData, 'formFields'>, value: string) => {
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
      instructions: '',
      formFields: []
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

  const fieldTypeLabels = {
    text: 'Короткий ответ',
    textarea: 'Развернутый ответ',
    select: 'Раскрывающийся список',
    radio: 'Один из списка',
    checkbox: 'Несколько из списка',
    file: 'Загрузка файла'
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Создать задание</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Создать новое задание
          </DialogTitle>
          <DialogDescription>
            Создайте задание для студентов с интерактивными полями формы
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
                {createdAssignment.assignment.formFields.length > 0 && (
                  <div className="text-xs text-gray-500">
                    Полей в форме: {createdAssignment.assignment.formFields.length}
                  </div>
                )}
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
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  rows={3}
                />
              </div>
            </form>

            {/* Form Fields Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Поля формы</h3>
                <Select onValueChange={(value) => addFormField(value as FormField['type'])}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Добавить поле" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Короткий ответ</SelectItem>
                    <SelectItem value="textarea">Развернутый ответ</SelectItem>
                    <SelectItem value="select">Раскрывающийся список</SelectItem>
                    <SelectItem value="radio">Один из списка</SelectItem>
                    <SelectItem value="checkbox">Несколько из списка</SelectItem>
                    <SelectItem value="file">Загрузка файла</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {assignmentData.formFields.map((field, index) => (
                  <Card key={field.id} className="p-4">
                    <div className="flex items-start space-x-2">
                      <GripVertical className="w-5 h-5 text-gray-400 mt-2" />
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{fieldTypeLabels[field.type]}</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteFormField(field.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <Input
                            placeholder="Вопрос"
                            value={field.label}
                            onChange={(e) => updateFormField(field.id, { label: e.target.value })}
                          />

                          {(field.type === 'text' || field.type === 'textarea') && (
                            <Input
                              placeholder="Подсказка (необязательно)"
                              value={field.placeholder || ''}
                              onChange={(e) => updateFormField(field.id, { placeholder: e.target.value })}
                            />
                          )}

                          {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
                            <div className="space-y-2">
                              <Label className="text-sm text-gray-600">Варианты ответов:</Label>
                              {field.options?.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex space-x-2">
                                  <Input
                                    placeholder={`Вариант ${optionIndex + 1}`}
                                    value={option}
                                    onChange={(e) => updateOption(field.id, optionIndex, e.target.value)}
                                    className="flex-1"
                                  />
                                  {field.options && field.options.length > 1 && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeOption(field.id, optionIndex)}
                                      className="text-red-500"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              ))}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => addOption(field.id)}
                                className="text-blue-600"
                              >
                                + Добавить вариант
                              </Button>
                            </div>
                          )}

                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => updateFormField(field.id, { required: e.target.checked })}
                              className="rounded"
                            />
                            <span className="text-sm">Обязательное поле</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                {assignmentData.formFields.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Добавьте поля для создания интерактивной формы</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-2 pt-4 border-t">
              <Button 
                onClick={handleSubmit}
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
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateAssignmentModal;
