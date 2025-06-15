
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizProps {
  questions: QuizQuestion[];
  lessonId: number;
  courseId: number;
  onComplete?: () => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, lessonId, courseId, onComplete }) => {
  const { markQuizCompleted } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [startTime] = useState(Date.now());

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const calculateResults = () => {
    let correct = 0;
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100)
    };
  };

  const handleSubmit = async () => {
    const results = calculateResults();
    const timeSpent = Math.floor((Date.now() - startTime) / 1000 / 60); // в минутах
    
    // Сохраняем результат в Supabase
    await markQuizCompleted(
      courseId,
      lessonId,
      results.percentage,
      results.correct,
      results.total,
      timeSpent
    );
    
    setShowResults(true);
    toast.success(`Тест завершен! Результат: ${results.percentage}%`);
    
    if (onComplete) {
      onComplete();
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (showResults) {
    const results = calculateResults();
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {results.percentage >= 70 ? (
              <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500 mr-2" />
            )}
            Результаты теста
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold text-blue-600">
              {results.percentage}%
            </div>
            <p className="text-lg">
              Правильных ответов: {results.correct} из {results.total}
            </p>
            <div className="text-sm text-gray-600">
              {results.percentage >= 70 ? 
                'Отличная работа! Тест пройден успешно.' : 
                'Попробуйте еще раз, чтобы улучшить результат.'
              }
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Тест - Вопрос {currentQuestion + 1} из {questions.length}</CardTitle>
        <CardDescription>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">{question.question}</h3>
          <RadioGroup
            value={selectedAnswers[question.id]?.toString()}
            onValueChange={(value) => handleAnswerSelect(question.id, parseInt(value))}
          >
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
          >
            Назад
          </Button>
          
          {currentQuestion === questions.length - 1 ? (
            <Button 
              onClick={handleSubmit}
              disabled={selectedAnswers[question.id] === undefined}
            >
              Завершить тест
            </Button>
          ) : (
            <Button 
              onClick={nextQuestion}
              disabled={selectedAnswers[question.id] === undefined}
            >
              Далее
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Quiz;
