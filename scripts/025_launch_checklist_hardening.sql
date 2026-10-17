-- Launch-checklist hardening (2026-10-17).
-- Signed-out visitors use no NeuRafiki table: RLS already shows them nothing
-- (checked on prod 2026-10-17), and now the grants say so too. New tables
-- aren't open to anon by default either; grant it explicitly if a table is
-- ever meant to be public.
revoke all on all tables in schema public from anon;
alter default privileges in schema public revoke all on tables from anon;
