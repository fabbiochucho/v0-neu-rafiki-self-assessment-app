-- 004_expand_institutional_schema.sql's "Users can update their own
-- organization" policy only restricts which ROW an admin can update (via
-- admin_user_id = auth.uid()), not which COLUMNS -- same class of bug fixed
-- for public.consents in 017_restrict_consent_updates_to_revoke.sql. As
-- written, any organization admin can set their own org's subscription_tier
-- to 'premium' directly via the REST API, with no payment ever happening.
-- This adds the same before-update-trigger pattern 017 used: subscription_tier
-- may only change via the service-role client (which bypasses RLS/triggers
-- are still enforced, so the finalize step uses a plain UPDATE that doesn't
-- go through PostgREST's RLS-constrained role -- service role is exempt from
-- RLS but not from triggers, so this must explicitly allow service-role
-- writes through).
create or replace function public.organizations_prevent_tier_selfgrant()
returns trigger
language plpgsql
as $$
begin
  if new.subscription_tier is distinct from old.subscription_tier
    and current_setting('request.jwt.claims', true) is not null
    and (current_setting('request.jwt.claims', true)::jsonb ->> 'role') <> 'service_role'
  then
    raise exception 'subscription_tier can only be changed by a completed payment, not updated directly.';
  end if;

  return new;
end;
$$;

drop trigger if exists organizations_prevent_tier_selfgrant on public.organizations;

create trigger organizations_prevent_tier_selfgrant
  before update on public.organizations
  for each row
  execute function public.organizations_prevent_tier_selfgrant();
