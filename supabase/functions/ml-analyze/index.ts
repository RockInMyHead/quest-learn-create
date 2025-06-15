
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    
    let requestData;
    try {
      requestData = await req.json();
    } catch (e) {
      console.error('ML-analyze: Ошибка парсинга JSON запроса:', e);
      return new Response(JSON.stringify({
        error: "Некорректный формат данных в запросе"
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const { lessonActivities, quizResults } = requestData;
    
    console.log('ML-analyze: Данные получены:', {
      activitiesCount: lessonActivities?.length || 0,
      quizResultsCount: quizResults?.length || 0,
      activitiesData: JSON.stringify(lessonActivities?.slice(0, 2) || []),
      quizData: JSON.stringify(quizResults?.slice(0, 2) || [])
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

    // Валидируем и очищаем данные
    const validActivities = (lessonActivities || []).filter(a => 
      a && typeof a === 'object' && 
      a.lessonId && a.courseId && 
      typeof a.timeSpent === 'number'
    );

    const validQuizResults = (quizResults || []).filter(q => 
      q && typeof q === 'object' && 
      q.lessonId && q.courseId && 
      typeof q.score === 'number' && 
      typeof q.correctAnswers === 'number' && 
      typeof q.totalQuestions === 'number'
    );

    console.log('ML-analyze: Валидные данные:', {
      validActivitiesCount: validActivities.length,
      validQuizResultsCount: validQuizResults.length
    });

    // Подготавливаем сводку для анализа
    const activitiesSummary = validActivities.map((a, index) => 
      `${index + 1}. Урок ${a.lessonId || 'N/A'}, Курс ${a.courseId || 'N/A'}, Время: ${a.timeSpent || 0} мин, Попыток: ${a.attempts || 1}`
    ).join('\n');

    const quizSummary = validQuizResults.map((q, index) => 
      `${index + 1}. Урок ${q.lessonId || 'N/A'}, Курс ${q.courseId || 'N/A'}, Оценка: ${q.score || 0}%, Правильных: ${q.correctAnswers || 0}/${q.totalQuestions || 0}, Время: ${q.timeSpent || 0} мин`
    ).join('\n');

    const summary = `Анализ обучения студента:

Активность по урокам (${validActivities.length}):
${activitiesSummary || 'Нет данных'}

Результаты тестов (${validQuizResults.length}):
${quizSummary || 'Нет данных'}`;

    // Инструкция для GPT
    const prompt = `${summary}

Проанализируй эти данные обучения и дай краткие рекомендации:
1. Какие темы требуют дополнительного внимания?
2. Как можно улучшить результаты?

Ответ должен быть кратким (не более 150 слов) и на русском языке.`;

    console.log('ML-analyze: Отправляем запрос к OpenAI');
    console.log('ML-analyze: Prompt length:', prompt.length);

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'Ты ассистент преподавателя. Анализируй данные обучения и давай краткие, практичные рекомендации на русском языке. Отвечай только текстом, без форматирования.'
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

    console.log('ML-analyze: Получен ответ от OpenAI, статус:', openAIResponse.status);

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('ML-analyze: Ошибка OpenAI:', errorText);
      return new Response(JSON.stringify({
        error: `OpenAI API error: ${openAIResponse.status} - ${errorText}`
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let openAIData;
    try {
      const responseText = await openAIResponse.text();
      console.log('ML-analyze: Raw response text:', responseText.substring(0, 200) + '...');
      openAIData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('ML-analyze: Ошибка парсинга ответа OpenAI:', parseError);
      return new Response(JSON.stringify({
        error: `Ошибка обработки ответа от OpenAI: ${parseError.message}`
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('ML-analyze: Успешно получен анализ');

    const analysis = openAIData?.choices?.[0]?.message?.content;
    
    if (!analysis) {
      console.error('ML-analyze: Пустой анализ в ответе:', JSON.stringify(openAIData));
      return new Response(JSON.stringify({
        error: 'Получен пустой ответ от OpenAI'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
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
