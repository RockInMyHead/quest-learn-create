
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Send, Bot, User, Volume2, VolumeX } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AIAvatar from './AIAvatar';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';

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
  const [autoSpeak, setAutoSpeak] = useState(true);

  const { speak, stop, isSpeaking, isSupported } = useSpeechSynthesis();

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

    // Останавливаем предыдущую речь
    stop();

    try {
      console.log('Отправка сообщения в AI chat функцию...');
      
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: [
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: 'user',
              content: inputMessage
            }
          ]
        }
      });

      if (error) {
        console.error('Ошибка Supabase функции:', error);
        throw new Error(error.message || 'Ошибка при вызове функции');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Автоматическая озвучка ответа AI
      if (autoSpeak && isSupported && data.content) {
        setTimeout(() => {
          speak(data.content);
        }, 500); // Небольшая задержка для лучшего UX
      }

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

  const handleSpeakMessage = (content: string) => {
    if (isSpeaking) {
      stop();
    } else {
      speak(content);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Чат с AI Преподавателем
            </div>
            
            {/* Управление озвучкой */}
            {isSupported && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAutoSpeak(!autoSpeak)}
                  className={autoSpeak ? 'bg-blue-50 border-blue-200' : ''}
                >
                  {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span className="ml-1 text-xs">
                    {autoSpeak ? 'Авто-озвучка' : 'Озвучка выкл.'}
                  </span>
                </Button>
                
                {isSpeaking && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={stop}
                    className="text-red-600 hover:text-red-700"
                  >
                    Остановить
                  </Button>
                )}
              </div>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {/* AI Аватар */}
          <div className="flex justify-center mb-6">
            <AIAvatar isSpeaking={isSpeaking} isLoading={isLoading} />
          </div>

          <div className="h-96 border rounded-lg p-4 overflow-y-auto mb-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-20">
                <div className="mb-4">
                  <p className="text-lg">Привет! Я ваш AI преподаватель. Задайте мне любой вопрос!</p>
                  {isSupported && (
                    <p className="text-sm text-blue-600 mt-2">
                      🔊 Мои ответы будут озвучены на русском языке
                    </p>
                  )}
                </div>
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
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                        
                        {/* Кнопка озвучки для сообщений AI */}
                        {message.role === 'assistant' && isSupported && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSpeakMessage(message.content)}
                            className="p-1 h-6 w-6 ml-2"
                          >
                            <Volume2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
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
          
          {!isSupported && (
            <div className="mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
              ⚠️ Ваш браузер не поддерживает озвучку текста
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AITeacherChat;
