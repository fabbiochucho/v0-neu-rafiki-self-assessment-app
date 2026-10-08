-- Individual (per-profile) subscriptions and payment tracking, powering a
-- real Flutterwave-backed upgrade flow at app/dashboard/subscription. Two
-- tiers only, matching the existing CHECK constraint on
-- auth.users.subscription_tier and organizations.subscription_tier
-- ('free', 'premium') from 004_expand_institutional_schema.sql.
--
-- Deliberately has NO update policy for users: the only legitimate write
-- after the initial pending insert is the payment-finalize step, which runs
-- under the service role (bypasses RLS) from app/api/payments/flutterwave/
-- {verify,webhook}. A user-facing "update own subscription" policy would let
-- anyone grant themselves premium directly via the REST API without ever
-- paying -- the exact bug this schema avoids by never granting that policy
-- in the first place (see 020_restrict_organizations_subscription_tier.sql
-- for the matching fix to the existing organizations table).
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  tier text not null default 'free' check (tier in ('free', 'premium')),
  status text not null default 'active' check (status in ('active', 'pending', 'cancelled', 'expired')),
  flutterwave_ref text,
  amount_paid numeric(10, 2),
  payment_date timestamp with time zone,
  renewal_date timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.subscriptions enable row level security;

create policy "subscriptions_select_own"
  on public.subscriptions for select
  using (profile_id = auth.uid());

create policy "subscriptions_insert_own"
  on public.subscriptions for insert
  with check (profile_id = auth.uid());

create table if not exists public.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid references public.subscriptions(id) on delete cascade,
  transaction_id text unique not null,
  flutterwave_transaction_id text,
  amount numeric(10, 2),
  currency text default 'USD',
  status text not null default 'pending' check (status in ('pending', 'successful', 'failed')),
  created_at timestamp with time zone default now()
);

alter table public.payment_transactions enable row level security;

create policy "payment_transactions_select_own"
  on public.payment_transactions for select
  using (
    exists (
      select 1 from public.subscriptions
      where subscriptions.id = payment_transactions.subscription_id
      and subscriptions.profile_id = auth.uid()
    )
  );

create index if not exists idx_subscriptions_profile on public.subscriptions(profile_id);
create index if not exists idx_payment_transactions_subscription on public.payment_transactions(subscription_id);
