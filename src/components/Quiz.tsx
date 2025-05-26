
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value);
  };

  const handleNext = () => {
    if (selectedAnswer) {
      const newAnswers = [...answers, parseInt(selectedAnswer)];
      setAnswers(newAnswers);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer('');
      } else {
        // Quiz completed
        const score = newAnswers.reduce((acc, answer, index) => {
          return acc + (answer === questions[index].correctAnswer ? 1 : 0);
        }, 0);
        setQuizCompleted(true);
        onComplete(Math.round((score / questions.length) * 100));
      }
    }
  };

  const handleShowResult = () => {
    setShowResult(!showResult);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setAnswers([]);
    setShowResult(false);
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    const score = answers.reduce((acc, answer, index) => {
      return acc + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-green-600">Тест завершен!</CardTitle>
          <CardDescription>
            Вы ответили правильно на {score} из {questions.length} вопросов
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">{percentage}%</div>
            <Progress value={percentage} className="h-4" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleShowResult} variant="outline" className="flex-1">
              {showResult ? 'Скрыть результаты' : 'Показать результаты'}
            </Button>
            <Button onClick={handleRestart} variant="outline" className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" />
              Пройти заново
            </Button>
          </div>

          {showResult && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Результаты:</h3>
              {questions.map((question, index) => {
                const userAnswer = answers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-start space-x-2 mb-2">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{question.question}</p>
                        <p className={`text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                          Ваш ответ: {question.options[userAnswer]}
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-green-600">
                            Правильный ответ: {question.options[question.correctAnswer]}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 mt-1">{question.explanation}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <CardTitle>Вопрос {currentQuestionIndex + 1} из {questions.length}</CardTitle>
          <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <CardDescription className="text-lg font-medium text-gray-900">
          {currentQuestion.question}
        </CardDescription>

        <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <Button 
          onClick={handleNext} 
          disabled={!selectedAnswer}
          className="w-full"
        >
          {currentQuestionIndex < questions.length - 1 ? 'Следующий вопрос' : 'Завершить тест'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default Quiz;
