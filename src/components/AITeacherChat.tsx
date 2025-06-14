
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AITeacherChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Фиксированный API ключ
  const apiKey = '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';

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'Вы AI преподаватель, который помогает студентам изучать различные предметы. Отвечайте на русском языке, будьте дружелюбны и старайтесь объяснять сложные темы простым языком.'
            },
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: 'user',
              content: inputMessage
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Ошибка при обращении к API');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.choices[0].message.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Ошибка:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Извините, произошла ошибка: ${error.message}. Попробуйте снова.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Чат с AI Преподавателем
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 border rounded-lg p-4 overflow-y-auto mb-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-20">
                <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Привет! Я ваш AI преподаватель. Задайте мне любой вопрос!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {message.role === 'user' ? (
                        <User className="w-8 h-8 p-1 bg-blue-500 text-white rounded-full" />
                      ) : (
                        <Bot className="w-8 h-8 p-1 bg-green-500 text-white rounded-full" />
                      )}
                    </div>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <Bot className="w-8 h-8 p-1 bg-green-500 text-white rounded-full" />
                    <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg">
                      <p className="text-sm text-gray-500">Печатает...</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Задайте ваш вопрос..."
              className="flex-1 min-h-[40px] max-h-32"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="self-end"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AITeacherChat;
