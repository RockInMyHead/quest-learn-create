
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
      const requestText = await req.text();
      console.log('ML-analyze: Raw request text length:', requestText.length);
      
      if (!requestText.trim()) {
        throw new Error('Пустой запрос');
      }
      
      requestData = JSON.parse(requestText);
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
      quizResultsCount: quizResults?.length || 0
    });

    if (!openAIApiKey) {
      console.error('ML-analyze: OpenAI API key not found');
      return new Response(JSON.stringify({
        error: "OpenAI API key не настроен"
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
      typeof q.score === 'number'
    );

    console.log('ML-analyze: Валидные данные:', {
      validActivitiesCount: validActivities.length,
      validQuizResultsCount: validQuizResults.length
    });

    // Создаем краткую сводку для анализа
    let analysisText = "Анализ обучения:\n\n";
    
    if (validActivities.length > 0) {
      const avgTime = Math.round(validActivities.reduce((sum, a) => sum + a.timeSpent, 0) / validActivities.length);
      analysisText += `Уроков пройдено: ${validActivities.length}, среднее время: ${avgTime} мин\n`;
    }
    
    if (validQuizResults.length > 0) {
      const avgScore = Math.round(validQuizResults.reduce((sum, q) => sum + q.score, 0) / validQuizResults.length);
      analysisText += `Тестов пройдено: ${validQuizResults.length}, средний балл: ${avgScore}%\n`;
    }

    // Простой промпт для OpenAI
    const prompt = `${analysisText}

Дай краткие рекомендации (не более 100 слов) на русском языке для улучшения обучения.`;

    console.log('ML-analyze: Отправляем запрос к OpenAI');

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
            content: 'Ты помощник преподавателя. Давай краткие рекомендации на русском языке без форматирования.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    console.log('ML-analyze: Получен ответ от OpenAI, статус:', openAIResponse.status);

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('ML-analyze: Ошибка OpenAI:', errorText);
      return new Response(JSON.stringify({
        error: `Ошибка OpenAI API: ${openAIResponse.status}`
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let openAIData;
    try {
      const responseText = await openAIResponse.text();
      console.log('ML-analyze: Raw OpenAI response length:', responseText.length);
      
      // Проверяем, что ответ не пустой
      if (!responseText || responseText.trim().length === 0) {
        throw new Error('Пустой ответ от OpenAI');
      }
      
      openAIData = JSON.parse(responseText);
      console.log('ML-analyze: OpenAI data parsed successfully');
      
    } catch (parseError) {
      console.error('ML-analyze: Ошибка парсинга ответа OpenAI:', parseError);
      return new Response(JSON.stringify({
        error: "Ошибка обработки ответа от AI сервиса"
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const analysis = openAIData?.choices?.[0]?.message?.content;
    
    if (!analysis || analysis.trim().length === 0) {
      console.error('ML-analyze: Пустой анализ в ответе');
      return new Response(JSON.stringify({
        error: 'AI сервис вернул пустой ответ'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('ML-analyze: Анализ успешно получен, длина:', analysis.length);

    // Очищаем анализ от потенциально проблемных символов
    const cleanAnalysis = analysis
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Удаляем управляющие символы
      .trim();

    return new Response(JSON.stringify({
      analysis: cleanAnalysis
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
