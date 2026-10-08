-- Subscriptions and payment tracking powering the real Flutterwave-backed
-- upgrade flow at app/dashboard/subscription. Confirmed these tables (and
-- their user_id column name) already existed live in production before this
-- migration was written -- this file was rewritten to match that reality
-- instead of the profile_id-keyed shape originally drafted here, so a fresh
-- database bootstraps into the same schema the live one already has.
--
-- Deliberately has NO update policy for users: the only legitimate write
-- after the initial pending insert is the payment-finalize step, which runs
-- under the service role (bypasses RLS) from app/api/payments/flutterwave/
-- {verify,webhook}. A user-facing "update own subscription" policy would let
-- anyone grant themselves premium directly via the REST API without ever
-- paying -- confirmed the live subscriptions_insert_own/subscriptions_select_own
-- policies already avoid this (no update policy exists) -- see
-- 020_restrict_organizations_subscription_tier.sql for the matching fix to
-- the separate organizations table, which does have this bug.
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
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
  using (user_id = auth.uid());

create policy "subscriptions_insert_own"
  on public.subscriptions for insert
  with check (user_id = auth.uid());

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
      and subscriptions.user_id = auth.uid()
    )
  );

create index if not exists idx_subscriptions_user on public.subscriptions(user_id);
create index if not exists idx_payment_transactions_subscription on public.payment_transactions(subscription_id);
