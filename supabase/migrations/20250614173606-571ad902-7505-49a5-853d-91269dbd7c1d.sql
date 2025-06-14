
-- Таблица активностей по урокам
create table public.lesson_activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  lesson_id integer not null,
  course_id integer not null,
  time_spent integer not null, -- в минутах
  completed_at timestamp with time zone not null default now(),
  attempts integer default 1
);

-- Таблица результатов тестов
create table public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  lesson_id integer not null,
  course_id integer not null,
  score integer not null, -- в процентах
  correct_answers integer not null,
  total_questions integer not null,
  time_spent integer not null,
  completed_at timestamp with time zone not null default now()
);

-- Включаем RLS для обеих таблиц
alter table public.lesson_activities enable row level security;
alter table public.quiz_results enable row level security;

-- Политики: только владелец видит и изменяет свои записи
create policy "Select own lesson activities" on public.lesson_activities for select using (auth.uid() = user_id);
create policy "Insert own lesson activities" on public.lesson_activities for insert with check (auth.uid() = user_id);
create policy "Update own lesson activities" on public.lesson_activities for update using (auth.uid() = user_id);
create policy "Delete own lesson activities" on public.lesson_activities for delete using (auth.uid() = user_id);

create policy "Select own quiz results" on public.quiz_results for select using (auth.uid() = user_id);
create policy "Insert own quiz results" on public.quiz_results for insert with check (auth.uid() = user_id);
create policy "Update own quiz results" on public.quiz_results for update using (auth.uid() = user_id);
create policy "Delete own quiz results" on public.quiz_results for delete using (auth.uid() = user_id);
