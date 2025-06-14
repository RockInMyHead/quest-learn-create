
import { useState, useEffect, useCallback } from 'react';

interface UseSpeechSynthesisReturn {
  speak: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  setSelectedVoice: (voice: SpeechSynthesisVoice) => void;
}

export const useSpeechSynthesis = (): UseSpeechSynthesisReturn => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Загрузка доступных голосов
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);

      // Ищем русский голос
      const russianVoice = availableVoices.find(voice => 
        voice.lang.startsWith('ru') || 
        voice.lang.includes('RU') ||
        voice.name.toLowerCase().includes('russian') ||
        voice.name.toLowerCase().includes('русский')
      );

      if (russianVoice) {
        setSelectedVoice(russianVoice);
      } else {
        // Если русского нет, берем первый доступный
        setSelectedVoice(availableVoices[0] || null);
      }
    };

    // Некоторые браузеры загружают голоса асинхронно
    if (speechSynthesis.getVoices().length > 0) {
      loadVoices();
    } else {
      speechSynthesis.addEventListener('voiceschanged', loadVoices);
    }

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [isSupported]);

  const speak = useCallback((text: string) => {
    if (!isSupported || !text.trim()) return;

    // Останавливаем текущую речь
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Настройки для русского языка
    utterance.lang = 'ru-RU';
    utterance.rate = 0.9; // Чуть медленнее для лучшего понимания
    utterance.pitch = 1.1; // Чуть выше для приятности
    utterance.volume = 0.8;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  }, [isSupported, selectedVoice]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    voices,
    selectedVoice,
    setSelectedVoice
  };
};
