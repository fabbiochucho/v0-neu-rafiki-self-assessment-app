-- Translated screening questions (2026-10-21).
--
-- Translations start as drafts and are never shown to people taking a
-- screening until a reviewer (TRANSLATION_REVIEWER_EMAILS) marks them
-- reviewed. Answers are still stored with the English option values, so
-- scoring is unchanged whatever language the questions are shown in.

create table if not exists public.question_translations (
  question_id uuid not null references public.questions(id) on delete cascade,
  lang text not null check (lang in ('fr', 'pt')),
  question_text text not null check (char_length(question_text) between 1 and 1000),
  status text not null default 'draft' check (status in ('draft', 'reviewed')),
  source text not null default 'machine' check (source in ('machine', 'human')),
  reviewed_by text,
  reviewed_at timestamp with time zone,
  updated_at timestamp with time zone not null default now(),
  primary key (question_id, lang),
  check ((status = 'reviewed') = (reviewed_at is not null))
);

alter table public.question_translations enable row level security;

-- People taking a screening only ever see reviewed translations. Drafts are
-- read and written by the review page with the service role.
create policy question_translations_select_reviewed on public.question_translations
  for select to authenticated using (status = 'reviewed');

revoke all on public.question_translations from anon, authenticated;
grant select on public.question_translations to authenticated;

-- The language the questions were shown in, chosen when the screening starts.
alter table public.assessments
  add column if not exists language text not null default 'en' check (language in ('en', 'fr', 'pt'));
