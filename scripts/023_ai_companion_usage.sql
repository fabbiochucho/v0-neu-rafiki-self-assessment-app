-- AI companion usage counters (brief §8-12, §57): per-user daily message
-- counts and the last message time, used for rate limits and plan gating.
-- No conversation content is stored anywhere: only counts and timestamps.
--
-- Users may READ their own counters (to show "N left today") but cannot
-- write them; otherwise anyone could reset their own limit via the REST API.
-- All writes go through consume_ai_companion_message(), which only the
-- service role may execute (called from app/api/companion/route.ts).

create table if not exists public.ai_companion_usage (
  user_id uuid not null references public.profiles(id) on delete cascade,
  usage_date date not null,
  message_count integer not null default 0 check (message_count >= 0),
  last_message_at timestamptz,
  primary key (user_id, usage_date)
);

alter table public.ai_companion_usage enable row level security;

create policy "ai_companion_usage_select_own" on public.ai_companion_usage
  for select using (user_id = auth.uid());

-- Atomically checks the daily limit and minimum interval, then counts the
-- message. Returns 'ok', 'daily_limit' or 'too_fast'.
create or replace function public.consume_ai_companion_message(
  p_user_id uuid,
  p_daily_limit integer,
  p_min_interval_seconds integer
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_today date := (now() at time zone 'utc')::date;
  v_row public.ai_companion_usage;
begin
  insert into public.ai_companion_usage (user_id, usage_date)
  values (p_user_id, v_today)
  on conflict (user_id, usage_date) do nothing;

  select * into v_row from public.ai_companion_usage
  where user_id = p_user_id and usage_date = v_today
  for update;

  if v_row.message_count >= p_daily_limit then
    return 'daily_limit';
  end if;
  if v_row.last_message_at is not null
     and v_row.last_message_at > now() - make_interval(secs => p_min_interval_seconds) then
    return 'too_fast';
  end if;

  update public.ai_companion_usage
  set message_count = message_count + 1, last_message_at = now()
  where user_id = p_user_id and usage_date = v_today;

  return 'ok';
end;
$$;

revoke all on function public.consume_ai_companion_message(uuid, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_ai_companion_message(uuid, integer, integer) to service_role;
