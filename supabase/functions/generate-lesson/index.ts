
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, baseCourse, userId } = await req.json();

    const prompt = `
Ты обучающая система. Сгенерируй практико-ориентированный, дружелюбный и понятно структурированный урок на русском языке по теме "${topic}" для курса "${baseCourse}". Включи объяснения, примеры, практические задания и мини-тест. Используй маркированные списки, подзаголовки и делай материал простым даже для новичка.
Верни только содержимое урока в формате Markdown без дополнительных комментариев.
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Ты — полезный помощник для создания учебных материалов" },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1400,
      }),
    });
    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error("Ошибка генерации урока: " + JSON.stringify(data));
    }

    return new Response(JSON.stringify({
      content: data.choices[0].message.content,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
