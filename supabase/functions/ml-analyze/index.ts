
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Получаем ключ OpenAI из секретов Supabase
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log('ML-analyze: Получен запрос');
    
    const requestData = await req.json();
    const { lessonActivities, quizResults } = requestData;
    
    console.log('ML-analyze: Данные получены:', {
      activitiesCount: lessonActivities?.length || 0,
      quizResultsCount: quizResults?.length || 0
    });

    if (!openAIApiKey) {
      console.error('ML-analyze: OpenAI API key not found');
      return new Response(JSON.stringify({
        error: "OpenAI API key не настроен в Supabase Edge Function Secrets"
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Проверяем наличие данных
    if ((!lessonActivities || lessonActivities.length === 0) && 
        (!quizResults || quizResults.length === 0)) {
      return new Response(JSON.stringify({
        analysis: "Недостаточно данных для анализа. Пройдите больше уроков и тестов."
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Подготавливаем сводку для анализа
    const activitiesSummary = (lessonActivities || []).map((a: any) => 
      `- Урок ${a.lessonId}, Курс ${a.courseId}, Время: ${a.timeSpent} мин, Попыток: ${a.attempts || 1}`
    ).join('\n');

    const quizSummary = (quizResults || []).map((q: any) => 
      `- Урок ${q.lessonId}, Курс ${q.courseId}, Оценка: ${q.score}%, Правильных: ${q.correctAnswers}/${q.totalQuestions}, Время: ${q.timeSpent} мин`
    ).join('\n');

    const summary = `
Анализ обучения студента:

Активность по урокам (${lessonActivities?.length || 0}):
${activitiesSummary || 'Нет данных'}

Результаты тестов (${quizResults?.length || 0}):
${quizSummary || 'Нет данных'}
`;

    // Инструкция для GPT
    const prompt = `${summary}

Проанализируй эти данные обучения и дай краткие рекомендации:
1. Какие темы требуют дополнительного внимания?
2. Как можно улучшить результаты?

Ответ должен быть кратким (не более 150 слов) и на русском языке.`;

    console.log('ML-analyze: Отправляем запрос к OpenAI');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Ты ассистент преподавателя. Анализируй данные обучения и давай краткие, практичные рекомендации на русском языке.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    console.log('ML-analyze: Получен ответ от OpenAI, статус:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ML-analyze: Ошибка OpenAI:', errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('ML-analyze: Успешно получен анализ');

    const analysis = data?.choices?.[0]?.message?.content;
    
    if (!analysis) {
      throw new Error('Пустой ответ от OpenAI');
    }

    return new Response(JSON.stringify({
      analysis: analysis.trim()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('ML-analyze: Общая ошибка:', error);
    
    return new Response(JSON.stringify({
      error: `Ошибка анализа: ${error.message || 'Неизвестная ошибка'}`
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
