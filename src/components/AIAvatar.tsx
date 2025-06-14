
import React, { useEffect, useState } from 'react';
import { Bot } from 'lucide-react';

interface AIAvatarProps {
  isSpeaking: boolean;
  isLoading: boolean;
}

const AIAvatar: React.FC<AIAvatarProps> = ({ isSpeaking, isLoading }) => {
  const [pulseIntensity, setPulseIntensity] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isSpeaking) {
      interval = setInterval(() => {
        setPulseIntensity(Math.random() * 0.8 + 0.2);
      }, 100);
    } else {
      setPulseIntensity(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSpeaking]);

  return (
    <div className="flex flex-col items-center space-y-2">
      <div 
        className={`relative w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center transition-all duration-200 ${
          isSpeaking 
            ? 'animate-pulse shadow-lg shadow-blue-400/50 scale-110' 
            : isLoading 
            ? 'animate-bounce' 
            : 'hover:scale-105'
        }`}
        style={{
          boxShadow: isSpeaking 
            ? `0 0 ${20 + pulseIntensity * 30}px rgba(59, 130, 246, ${0.3 + pulseIntensity * 0.4})` 
            : undefined
        }}
      >
        <Bot 
          className={`w-12 h-12 text-white transition-all duration-200 ${
            isSpeaking ? 'animate-pulse' : ''
          }`} 
        />
        
        {/* Пульсирующие кольца при говорении */}
        {isSpeaking && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-blue-300 animate-ping opacity-20"></div>
            <div className="absolute inset-0 rounded-full border border-purple-300 animate-ping opacity-30 animation-delay-75"></div>
          </>
        )}
      </div>
      
      {/* Статус индикатор */}
      <div className="text-center">
        <div className={`text-sm font-medium transition-colors duration-200 ${
          isSpeaking 
            ? 'text-blue-600' 
            : isLoading 
            ? 'text-orange-500' 
            : 'text-gray-500'
        }`}>
          {isSpeaking ? 'Говорит...' : isLoading ? 'Думает...' : 'AI Преподаватель'}
        </div>
        
        {/* Анимированные точки для индикации активности */}
        {(isSpeaking || isLoading) && (
          <div className="flex justify-center space-x-1 mt-1">
            <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
            <div className="w-1 h-1 bg-current rounded-full animate-bounce animation-delay-100"></div>
            <div className="w-1 h-1 bg-current rounded-full animate-bounce animation-delay-200"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAvatar;
