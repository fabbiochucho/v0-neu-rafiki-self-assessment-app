-- scripts/009_create_consents_table.sql's comment claims "no UPDATE policy
-- that allows changing granted_at/consent_type after the fact" -- but RLS
-- policies can't restrict which columns an UPDATE touches, only which rows,
-- so consents_revoke_own actually let a user rewrite any column on their own
-- consent row (consent_type, version, granted_at, is_for_minor, ...), not
-- just revoked_at. This adds a trigger that enforces the comment's stated
-- intent: an UPDATE may only set revoked_at, nothing else.

create or replace function public.consents_prevent_immutable_field_changes()
returns trigger
language plpgsql
as $$
begin
  if new.user_id is distinct from old.user_id
    or new.profile_id is distinct from old.profile_id
    or new.consent_type is distinct from old.consent_type
    or new.version is distinct from old.version
    or new.granted_at is distinct from old.granted_at
    or new.is_for_minor is distinct from old.is_for_minor
    or new.guardian_relationship is distinct from old.guardian_relationship
  then
    raise exception 'Only revoked_at may be changed on an existing consent row; revoke and insert a new row instead.';
  end if;

  return new;
end;
$$;

drop trigger if exists consents_prevent_immutable_field_changes on public.consents;

create trigger consents_prevent_immutable_field_changes
  before update on public.consents
  for each row
  execute function public.consents_prevent_immutable_field_changes();
