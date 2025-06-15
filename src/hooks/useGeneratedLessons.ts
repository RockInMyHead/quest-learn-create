
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

/**
 * Возвращает список сгенерированных AI-уроков пользователя по курсу
 * @param {number} courseId
 */
export const useGeneratedLessons = (courseId: number) => {
  const { user } = useAuth();
  const [aiLessons, setAiLessons] = useState<
    { id: string; topic: string; content: string; created_at: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const fetchLessons = async () => {
    if (!user?.id || !courseId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("generated_lessons")
      .select("id, topic, content, created_at")
      .eq("user_id", user.id)
      .eq("base_course_id", courseId)
      .order("created_at", { ascending: false });
    if (!error && data) setAiLessons(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLessons();
    // eslint-disable-next-line
  }, [user?.id, courseId]);

  return { aiLessons, loading, refetch: fetchLessons };
};
