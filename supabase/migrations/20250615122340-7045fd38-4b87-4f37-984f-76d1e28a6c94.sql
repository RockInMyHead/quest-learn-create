
-- Таблица для хранения сгенерированных уроков, привязанных к пользователю и теме
create table public.generated_lessons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  base_course_id integer not null,
  topic text not null,
  content text not null,
  created_at timestamp with time zone not null default now()
);

-- Таблица для фиксации тем, которые даются студенту тяжело (отслеживание проблемных тем по анализу)
create table public.user_struggling_topics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  course_id integer not null,
  topic text not null,
  detected_at timestamp with time zone not null default now(),
  resolved boolean default false
);

-- Включаем RLS (Row Level Security)
alter table public.generated_lessons enable row level security;
alter table public.user_struggling_topics enable row level security;

-- Политики доступа — только владелец видит и управляет своими записями
create policy "Select own generated_lessons" on public.generated_lessons for select using (auth.uid() = user_id);
create policy "Insert own generated_lessons" on public.generated_lessons for insert with check (auth.uid() = user_id);
create policy "Delete own generated_lessons" on public.generated_lessons for delete using (auth.uid() = user_id);

create policy "Select own user_struggling_topics" on public.user_struggling_topics for select using (auth.uid() = user_id);
create policy "Insert own user_struggling_topics" on public.user_struggling_topics for insert with check (auth.uid() = user_id);
create policy "Update own user_struggling_topics" on public.user_struggling_topics for update using (auth.uid() = user_id);
create policy "Delete own user_struggling_topics" on public.user_struggling_topics for delete using (auth.uid() = user_id);
