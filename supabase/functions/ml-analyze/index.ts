
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
    const { lessonActivities, quizResults } = await req.json();

    // Подготавливаем сводку для анализа
    const summary = `
Вот подробная информация об обучающемся:
---
Уроки: 
${lessonActivities.map((a: any) => 
  `- Урок #${a.lessonId}, Курс #${a.courseId}, Время: ${a.timeSpent} мин, Дата: ${a.completedAt}, Попыток: ${a.attempts ?? 'нет'}`
).join('\n')}

Тесты:
${quizResults.map((q: any) => 
  `- Урок #${q.lessonId}, Курс #${q.courseId}, Оценка: ${q.score}%, Прав. ответов: ${q.correctAnswers}/${q.totalQuestions}, Время: ${q.timeSpent} мин, Дата: ${q.completedAt}`
).join('\n')}
---
`;

    // Инструкция для GPT
    const prompt = `
${summary}

На основе этой информации:
1. Какая тема/раздел, по вашему мнению, вызывает наибольшие сложности у ученика?
2. Дайте ШАГОВУЮ рекомендацию по тому, как улучшить знания именно по этому разделу. Дайте коротко и четко.
Формат:
Тема для повторения: <...>
Рекомендация: <...>
`;

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
            content: 'Ты искусственный интеллект - ассистент преподавателя. Отвечай лаконично, по делу, на русском.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 512,
        temperature: 0.4,
      }),
    });

    const data = await response.json();

    return new Response(JSON.stringify({
      analysis: data?.choices?.[0]?.message?.content ?? "Не удалось получить анализ",
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message ?? error.toString(),
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
