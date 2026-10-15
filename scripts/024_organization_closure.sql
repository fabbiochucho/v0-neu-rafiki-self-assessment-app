-- 024: organisation closure with a 30-day grace period (owner decision,
-- Oct 2026). A primary admin who is the only member can schedule closure;
-- during the grace period they can download the organisation's data or
-- cancel. The daily cron (api/cron/followup-reminders) deletes organisations
-- whose closing_at has passed. Members' personal accounts are never deleted.
alter table public.organizations add column if not exists closing_at timestamptz;
